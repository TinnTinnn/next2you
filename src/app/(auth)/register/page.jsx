"use client"
import Link from "next/link";
import {register} from "@/actions/auth";
import {useState} from "react";


export default function Register() {
    const [error, setError] = useState(null);

    async function handleSubmit(formData) {
        const result = await register(formData);
        if (result.error) {
            setError(result.error);
        }
    }

    return (
        <div className="container w-1/2">
            <h1 className="title">Register</h1>

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email"/>
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password"/>
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" name="confirmPassword"/>
                </div>

                <div className="flex items-end gap-4">
                    <button className="btn-primary" type="submit">Register</button>

                    <Link href="/" className="text-link">or login here</Link>
                </div>
            </form>
        </div>
    )
}