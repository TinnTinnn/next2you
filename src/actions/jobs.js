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

    const validatedFields = JobSchema.safeParse({
        title,
        position,
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
            userId: ObjectId.createFromHexString(user.userId)
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
    const validatedFields = JobSchema.safeParse({
        title: formData.get("title"),
        position: formData.get("position"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            title: formData.get("title"),
            position: formData.get("position"),
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