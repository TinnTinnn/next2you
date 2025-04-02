"use client"
import Link from "next/link";
import {register} from "@/actions/auth";
import {useState} from "react";
import PasswordValidationPopover from "@/components/PasswordValidationPopover";

export default function Register() {
    const [errors, setErrors] = useState({});
    const [password, setPassword] = useState("");
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);

    async function handleSubmit(formData) {
        setErrors({}); // รีเซ็ต errors ก่อน submit
        try {
            const result = await register(formData);
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
            <h1 className="title">Register</h1>

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email"/>
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>

                <div className="relative">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setShowPasswordValidation(true)}
                        onBlur={() => setShowPasswordValidation(false)}
                    />
                    {showPasswordValidation && (
                        <PasswordValidationPopover password={password} />
                    )}
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
                    >
                            Register
                    </button>

                    <Link href="/login" className="text-link">or login here</Link>
                </div>
            </form>
        </div>
    )
}