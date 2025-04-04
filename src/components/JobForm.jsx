"use client"

import {useState} from "react";
import {createJob, updateJob} from "@/actions/jobs";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {SelectValue} from "@radix-ui/react-select";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {Textarea} from "@/components/ui/textarea";


export default function JobForm({job}) {

    const [errors, setErrors] = useState({});
    const [hasBreak, setHasBreak] = useState(job?.hasbreak || false);
    const [position, setPosition] = useState(job?.position || "Singer");
    const [customPosition, setCustomPosition] = useState(job?.customPosition || "");
    const [gender, setGender] = useState(job?.gender || "Unspecified");

    async function handleFormSubmit(event) {
        event.preventDefault();
        setErrors({})

        try {
            console.log("Submitting form for job:", job);
            const formData = new FormData(event.target);
            if (position === "Other"){
                formData.set("position", customPosition);
            } else {
                formData.set("position", position)
            }
            if (position !== "Singer") {
                formData.delete("gender");
            } else {
                formData.set("gender", gender)
            }

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
                        <Label htmlFor="title">Title</Label>
                        <Input
                            type="text"
                            name="title"
                            defaultValue={job?.title || ""}
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>

                    <div>
                        <Label htmlFor="position" >position</Label>
                        <Select value={position} onValueChange={setPosition}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose Position"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Singer">Singer</SelectItem>
                                <SelectItem value="Guitarist">Guitarist</SelectItem>
                                <SelectItem value="Bassist">Bassist</SelectItem>
                                <SelectItem value="Drummer">Drummer</SelectItem>
                                <SelectItem value="Other">Other please specify </SelectItem>
                            </SelectContent>
                        </Select>
                        {position === "Other" && (
                            <Input
                                className="mt-2"
                                name="customPosition"
                                placeholder="Choose Position"
                                maxlength={20}
                                value={customPosition}
                                onChange={(e) => setCustomPosition(e.target.value)}
                            />
                        )}
                        {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
                    </div>

                    {position === "Singer" && (
                        <div>
                            <Label>Gender</Label>
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Male"
                                        checked={gender === "Male"}
                                        onChange={() => setGender("Male")}
                                    />
                                    Male
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Female"
                                        checked={gender === "Female"}
                                        onChange={() => setGender("Female")}
                                    />
                                    Female
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Unspecified"
                                        checked={gender === "Unspecified"}
                                        onChange={() => setGender("Unspecified")}
                                    />
                                    Unspecified
                                </label>
                            </div>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="genre">Genre</Label>
                        <Input name="genre" defaultValue={job?.genre || ""}/>
                    </div>

                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input type="date" name="date" defaultValue={job?.date || ""}/>
                    </div>

                    <div>
                        <Label>Time start - End</Label>
                        <div className="flex gap-2">
                            <Input type="time" name="startTime" defaultValue={job?.startTime || ""}/>
                            <Input type="time" name="endTime" defaultValue={job?.endTime || ""}/>
                        </div>
                    </div>

                    <div>
                        <Label>Has break ?</Label>
                        <div className="flex items-center gap-2">
                            <Checkbox checked={hasBreak} onCheckedChange={setHasBreak}/>
                            <span>Has Break</span>
                        </div>
                    </div>

                    {hasBreak && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="breakCount">Number of Breaks</Label>
                                <Input type="number" name="breakCount" defaultValue={job?.breakCount || 1}/>
                            </div>
                            <div>
                                <Label htmlFor="breakDuration">Minute per Break</Label>
                                <input type="number" name="breakDuration" defaultValue={job?.breakDuration || 45} />
                            </div>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="rate">Rate</Label>
                        <Input type="number" name="rate" defaultValue={job?.rate || 0}/>
                    </div>

                    <div>
                        <Label htmlFor="place">Venue Name</Label>
                        <Input name="place" defaultValue={job?.place || ""}/>
                    </div>

                    <div>
                        <Label htmlFor="location">Location Link</Label>
                        <Input name="location" defaultValue={job?.location || ""} placeholder="Google Maps Link"/>
                    </div>

                    <div>
                        <Label htmlFor="welfare">Welfare (if any)</Label>
                        <Textarea name="welfare" defaultValue={job?.welfare || ""} rows={3}/>
                    </div>

                    <Button type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md">
                        {job ? "Update Job" : "Post job"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}