"use server"

import {redirect} from "next/navigation";
import {MemberSchema} from "@/lib/rules";
import {getCollection} from "@/lib/db";
import getAuthUser from "@/lib/getAuthUser";
import {ObjectId} from "mongodb";
import {revalidatePath} from "next/cache";

export async function createMember(formData){

    // Check is user is signed in
    const user = await getAuthUser()
    if (!user) return redirect('/login')

    // Validate form fields
    const name = formData.get("name")
    const address = formData.get("address")

    const validatedFields = MemberSchema.safeParse({
        name,
        address,
    })

    // If any form fields are invalid
    if (!validatedFields.success) {
        return{
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // Save in DB
    try {
        const membersCollection = await getCollection('members')
        const member = {
            name: validatedFields.data.name,
            address: validatedFields.data.address,
            userId: ObjectId.createFromHexString(user.userId)
        }
        await membersCollection.insertOne(member)
    } catch (error) {
        return {
            errors: {name: error.message}
        }
    }

    redirect("/dashboard")
}

export async function updateMember(formData,id) {
    // Check if user is signed in
    const user = await getAuthUser();
    if (!user || !user.userId) return redirect("/");

    // Validate form fields
    const validatedFields = MemberSchema.safeParse({
        name: formData.get("name"),
        address: formData.get("address"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            name: formData.get("name"),
            address: formData.get("address"),
        };
    }

    // Get the members collection
    const membersCollection = await getCollection("members");
    if (!membersCollection) {
        return { errors: { server: "Server error!" } };
    }

    // Find the member by ID
    console.log("Attempting to find member with ID:", id); // Debug ID
    const member = await membersCollection.findOne({
        _id: ObjectId.createFromHexString(id),
    });

    // If member not found, redirect with log
    if (!member) {
        console.log("Member not found for ID:", id);
        return redirect("/");
    }

    // Check ownership with safety for createdBy
    console.log("Member found:", member); // Debug member data
    if (!member.userId || member.userId.toString() !== user.userId) {
        console.log("User not authorized. User ID:", user.userId, "Member createdBy:", member.userId);
        return { errors: { server: "You are not authorized to edit this member" } };
    }

    // Update the member
    await membersCollection.findOneAndUpdate(
        { _id: member._id },
        {
            $set: {
                name: validatedFields.data.name,
                address: validatedFields.data.address,
                updatedAt: new Date(),
            },
        }
    );

    // Log successful update
    console.log("Member updated:", {
        _id: id,
        name: validatedFields.data.name,
        address: validatedFields.data.address,
    });

    // Redirect to dashboard
    redirect("/dashboard");
}

export async function deleteMember(formData) {
    // Check is user is signed in
    const user = await getAuthUser()
    if (!user) return redirect('/login')

    // Find the member
    const membersCollection = await getCollection('members')
    const member = await membersCollection.findOne({
        _id: ObjectId.createFromHexString(formData.get("memberId"))
    })

    // Check the auth user owns the member
    if (user.userId !== member.userId.toString()) return redirect("/");

    // Delete the member
    membersCollection.findOneAndDelete({_id: member._id})

    revalidatePath('/dashboard')
}