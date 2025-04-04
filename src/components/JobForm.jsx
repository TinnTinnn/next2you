"use client"

import {useState} from "react";
import {createJob, updateJob} from "@/actions/jobs";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";


export default function JobForm({job}) {

    const [errors, setErrors] = useState({});

    async function handleFormSubmit(event) {
        event.preventDefault();
        setErrors({})

        try {
            console.log("Submitting form for job:", job);
            const formData = new FormData(event.target);
            const result = job
                ? await updateJob(formData, job._id) // edit case
                : await createJob(formData); // create case
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
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <Input
                            type="text"
                            name="title"
                            defaultValue={job?.title || ""}
                            className="mt-1 w-full"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <Textarea
                            name="address"
                            rows="3"
                            defaultValue={job?.address || ""}
                            className="mt-1 w-full"
                        />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md">
                        {job ? "Update" : "Submit"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}