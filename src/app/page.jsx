import {getCollection} from "@/lib/db";
import Link from "next/link";
import JobCard from "@/components/JobCard";

export default async function Home() {
    const jobsCollection = await getCollection("jobs");
    const jobs = await jobsCollection?.find().sort({$natural: -1}).toArray()


    if (jobs) {
        return (
            <div className="grid grid-cols-2 gap-6">
                {
                    jobs.map((job) => (
                        <div key={job._id}>
                            <JobCard job={job} />
                        </div>
                    ))
                }
            </div>
        )
    } else {
        return <p>Failed to fetch the data from database.</p>
    }
}

