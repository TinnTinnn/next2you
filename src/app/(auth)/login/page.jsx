"use client"

import Link from "next/link";
import {login} from "@/actions/auth";
import {useState} from "react";


export default function Login() {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData) {
        setIsLoading(true);
        setErrors({}); // รีเซ็ต errors ก่อน submit
        try {
            const result = await login(formData);
            // ตรวจสอบว่า result มี errors หรือไม่อย่างปลอดภัย
            if (result && result.errors) {
                setErrors(result.errors);
            }
        } catch (e) {
            console.error("Error in handleSubmit:", e);
        } finally {
            setIsLoading(false);
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
                        disabled={isLoading}
                    >

                        {isLoading ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8h-8z"
                                    ></path>
                                </svg>
                                Loading...
                            </span>
                        ) : (
                            "Login"
                        )}
                    </button>

                    <Link href="/register" className="text-link">or register here</Link>
                </div>
            </form>
        </div>
    )
}

