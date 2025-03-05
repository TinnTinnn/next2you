"use client"

import {useState} from "react";
import {createMember} from "@/actions/members";

export default function MemberForm() {

    const [errors, setErrors] = useState({});

    async  function handleFormSubmit(formData) {
        setErrors({})

        try {
            const result = await createMember(formData)
            if (result && result.errors) {
                setErrors(result.errors);
            }
        } catch (error) {
            console.error("Error in handleFormSubmit:", error)
        }
    }


    return (
        <form action={handleFormSubmit} className="space-y-4">
            <div>
                <label htmlFor="name">Name</label>
                <input type="text" name="name"/>
                {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            <div>
                <label htmlFor="address">Address</label>
                <textarea name="address" rows="3"></textarea>
                {errors.address && <p className="text-red-500">{errors.address}</p>}
            </div>

            <button className="btn-primary">Submit</button>
        </form>
    )
}