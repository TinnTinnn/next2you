"use client"
import Link from "next/link";
import {register} from "@/actions/auth";
import {useState} from "react";


export default function Register() {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData) {
        setIsLoading(true);
        setErrors({}); // รีเซ็ต errors ก่อน submit
        try {
            const result = await register(formData);
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
            <h1 className="title">Register</h1>

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email"/>
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" />
                    {errors.password && errors.password.length > 0 && (
                        <div className="error">
                            <p>Password must:</p>
                            <ul className="list-disc list-inside ml-4 text-red-500">
                                {errors.password.map((err, index) => (
                                    <li key={index}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" name="confirmPassword"/>
                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
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
                            "Register"
                        )}
                    </button>

                    <Link href="/" className="text-link">or login here</Link>
                </div>
            </form>
        </div>
    )
}