"use client"

import Link from "next/link";
import {login} from "@/actions/auth";
import {useState} from "react";


export default function Login() {
    const [errors, setErrors] = useState({});

    async function handleSubmit(formData) {
        setErrors({}); // รีเซ็ต errors ก่อน submit
        try {
            const result = await login(formData);
            // ตรวจสอบว่า result มี errors หรือไม่อย่างปลอดภัย
            if (result && result.errors) {
                setErrors(result.errors);
            }
        } catch (e) {
            console.error("Error in handleSubmit:", e);
        }
    }
    return (
        <div className="container w-1/2">
            <h1 className="title">Login</h1>

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email"/>
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" />
                    {errors.password && <p className="text-red-500">{errors.password}</p>}
                </div>

                <div className="flex items-end gap-4">
                    <button
                        className="btn-primary"
                        type="submit"
                    >

                            Login

                    </button>

                    <Link href="/register" className="text-link">or register here</Link>
                </div>
            </form>
        </div>
    )
}

