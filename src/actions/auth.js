"use server"

import bcrypt  from 'bcrypt'
import {LoginFormSchema, RegisterFormSchema} from "@/lib/rules";
import {getCollection} from "@/lib/db";
import {redirect} from "next/navigation";
import {createSession} from "@/lib/session";

export async function register(formData) {

    // Validate form fields
    const validatedFields = RegisterFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    })
    // If any form fields are invalid
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            email: formData.get("email"),
        };
    }

    // Extract form fields
    const { email, password } = validatedFields.data;

    // Check if email is already registered
    const userCollection = await getCollection("users");
    if (!userCollection) return { errors: { email: "Server error!" } };

    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
        return {
            errors: {
                email: "Email already exists in our database!",
            },
        };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save in DB
    const results = await userCollection.insertOne({
        email,
        password: hashedPassword,
    });

    // Create a session
    await createSession(results.insertedId.toString())

    // Redirect
    redirect("/dashboard");
}

export async function login(formData) {
    // Validate form fields
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })

    // If any form fields are invalid
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            email: formData.get('email')
        }
    }

    // Extract form fields
    const {email, password} = validatedFields.data

    // Check if email exists in DB
    const userCollection = await getCollection('users')
    if (!userCollection) return {errors: {email: "Server error!"}}

    const existingUser = await userCollection.findOne({email})
    if (!existingUser) return {errors: {email: "Invalid credentials"}}


    // Check the password
    const matchedPassword = await bcrypt.compare(password, existingUser.password)
    if (!matchedPassword) return {errors: {password: "Invalid credentials"}}


    // Create  a session
    await createSession(existingUser._id.toString())

    console.log(existingUser);

    // Redirect
    redirect('/dashboard')

}