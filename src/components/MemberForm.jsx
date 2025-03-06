"use client"

import {useState} from "react";
import {createMember, updateMember} from "@/actions/members";

export default function MemberForm({member}) {

    const [errors, setErrors] = useState({});

    async function handleFormSubmit(formData) {
        setErrors({})

        try {
            console.log("Submitting form for member:", member);
            const result = member
                ? await updateMember(formData, member._id) // edit case
                : await createMember(formData); // create case
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
                <input
                    type="text"
                    name="name"
                    defaultValue={member?.name || ""}
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            <div>
                <label htmlFor="address">Address</label>
                <textarea
                    name="address"
                    rows="3"
                    defaultValue={member?.address || ""}
                ></textarea>
                {errors.address && <p className="text-red-500">{errors.address}</p>}
            </div>

            <button className="btn-primary" type="submit">
                {member ? "Update" : "Submit"}
            </button>
        </form>
    )
}