"use server"

import {redirect} from "next/navigation";
import {MemberSchema} from "@/lib/rules";
import {getCollection} from "@/lib/db";
import getAuthUser from "@/lib/getAuthUser";
import {ObjectId} from "mongodb";

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