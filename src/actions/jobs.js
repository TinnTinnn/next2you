"use server"

import {redirect} from "next/navigation";
import {JobSchema} from "@/lib/rules";
import {getCollection} from "@/lib/db";
import getAuthUser from "@/lib/getAuthUser";
import {ObjectId} from "mongodb";
import {revalidatePath} from "next/cache";

export async function createJob(formData){

    // Check is user is signed in
    const user = await getAuthUser()
    if (!user) return redirect('/login')

    // Validate form fields
    const title = formData.get("title")
    const position = formData.get("position")
    const gender = formData.get("gender") || "Unspecified"
    const genre = formData.get("genre") || ""
    const date = formData.get("date") || ""
    const startTime = formData.get("startTime") || ""
    const endTime = formData.get("endTime") || ""
    const hasBreak = formData.get("hasBreak") === "on"
    const breakCount = parseInt(formData.get("breakCount") || "0")
    const breakDuration = parseInt(formData.get("breakDuration") || "0")
    const rate = parseInt(formData.get("rate") || "0")
    const place = formData.get("place") || ""
    const location = formData.get("location") || ""
    const welfare = formData.get("welfare") || ""
    const customPosition = position === "Other" ? formData.get("customPosition") || "" : ""

    const validatedFields = JobSchema.safeParse({
        title,
        position,
        gender,
        genre,
        date,
        startTime,
        endTime,
        hasBreak,
        breakCount,
        breakDuration,
        rate,
        place,
        location,
        welfare,
        customPosition
    })

    // If any form fields are invalid
    if (!validatedFields.success) {
        return{
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // Save in DB
    try {
        const jobsCollection = await getCollection('jobs')
        const job = {
            title: validatedFields.data.title,
            position: validatedFields.data.position,
            gender: validatedFields.data.gender,
            genre: validatedFields.data.genre,
            date: validatedFields.data.date,
            startTime: validatedFields.data.startTime,
            endTime: validatedFields.data.endTime,
            hasBreak: validatedFields.data.hasBreak,
            breakCount: validatedFields.data.breakCount,
            breakDuration: validatedFields.data.breakDuration,
            rate: validatedFields.data.rate,
            place: validatedFields.data.place,
            location: validatedFields.data.location,
            welfare: validatedFields.data.welfare,
            customPosition: validatedFields.data.customPosition,
            userId: ObjectId.createFromHexString(user.userId),
            createdAt: new Date()
        }
        await jobsCollection.insertOne(job)
    } catch (error) {
        return {
            errors: {title: error.message}
        }
    }

    redirect("/dashboard")
}

export async function updateJob(formData,id) {
    // Check if user is signed in
    const user = await getAuthUser();
    if (!user || !user.userId) return redirect("/");

    // Validate form fields
    const title = formData.get("title")
    const position = formData.get("position")
    const gender = formData.get("gender") || "Unspecified"
    const genre = formData.get("genre") || ""
    const date = formData.get("date") || ""
    const startTime = formData.get("startTime") || ""
    const endTime = formData.get("endTime") || ""
    const hasBreak = formData.get("hasBreak") === "on"
    const breakCount = parseInt(formData.get("breakCount") || "0")
    const breakDuration = parseInt(formData.get("breakDuration") || "0")
    const rate = parseInt(formData.get("rate") || "0")
    const place = formData.get("place") || ""
    const location = formData.get("location") || ""
    const welfare = formData.get("welfare") || ""
    const customPosition = position === "Other" ? formData.get("customPosition") || "" : ""

    const validatedFields = JobSchema.safeParse({
        title,
        position,
        gender,
        genre,
        date,
        startTime,
        endTime,
        hasBreak,
        breakCount,
        breakDuration,
        rate,
        place,
        location,
        welfare,
        customPosition
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            title,
            position,
            gender,
            genre,
            date,
            startTime,
            endTime,
            hasBreak,
            breakCount,
            breakDuration,
            rate,
            place,
            location,
            welfare,
            customPosition
        };
    }

    // Get the jobs collection
    const jobsCollection = await getCollection("jobs");
    if (!jobsCollection) {
        return { errors: { server: "Server error!" } };
    }

    // Find the job by ID
    console.log("Attempting to find job with ID:", id); // Debug ID
    const job = await jobsCollection.findOne({
        _id: ObjectId.createFromHexString(id),
    });

    // If job not found, redirect with log
    if (!job) {
        console.log("Job not found for ID:", id);
        return redirect("/");
    }

    // Check ownership with safety for createdBy
    console.log("Job found:", job); // Debug job data
    if (!job.userId || job.userId.toString() !== user.userId) {
        console.log("User not authorized. User ID:", user.userId, "Job createdBy:", job.userId);
        return { errors: { server: "You are not authorized to edit this job" } };
    }

    // Update the job
    await jobsCollection.findOneAndUpdate(
        { _id: job._id },
        {
            $set: {
                title: validatedFields.data.title,
                position: validatedFields.data.position,
                gender: validatedFields.data.gender,
                genre: validatedFields.data.genre,
                date: validatedFields.data.date,
                startTime: validatedFields.data.startTime,
                endTime: validatedFields.data.endTime,
                hasBreak: validatedFields.data.hasBreak,
                breakCount: validatedFields.data.breakCount,
                breakDuration: validatedFields.data.breakDuration,
                rate: validatedFields.data.rate,
                place: validatedFields.data.place,
                location: validatedFields.data.location,
                welfare: validatedFields.data.welfare,
                customPosition: validatedFields.data.customPosition,
                updatedAt: new Date(),
            },
        }
    );

    // Log successful update
    console.log("Job updated:", {
        _id: id,
        title: validatedFields.data.title,
        position: validatedFields.data.position,
    });

    // Redirect to dashboard
    redirect("/dashboard");
}

export async function deleteJob(formData) {
    // Check is user is signed in
    const user = await getAuthUser()
    if (!user) return redirect('/login')

    // Find the job
    const jobsCollection = await getCollection('jobs')
    const job = await jobsCollection.findOne({
        _id: ObjectId.createFromHexString(formData.get("jobId"))
    })

    // Check the auth user owns the job
    if (user.userId !== job.userId.toString()) return redirect("/");

    // Delete the job
    jobsCollection.findOneAndDelete({_id: job._id})

    revalidatePath('/dashboard')
}