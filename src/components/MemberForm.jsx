"use client"

import {useState} from "react";
import {createMember, updateMember} from "@/actions/members";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";


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
        <Card className="max-w-lg mx-auto p-6 shadow-md rounded-lg">
            <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <Input
                            type="text"
                            name="name"
                            defaultValue={member?.name || ""}
                            className="mt-1 w-full"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <Textarea
                            name="address"
                            rows="3"
                            defaultValue={member?.address || ""}
                            className="mt-1 w-full"
                        />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md">
                        {member ? "Update" : "Submit"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}