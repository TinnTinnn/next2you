import {ObjectId} from "mongodb";
import {getCollection} from "@/lib/db";
import JobCard from "@/components/JobCard";

export default async function Show({params}) {
    const {id} = await params

    const jobsCollection = await getCollection('jobs')
    const job = id.length === 24 ? await jobsCollection?.findOne({
        _id: ObjectId.createFromHexString(id)
    }) : null;

    return (
        <div className="container w-1/2">
            { job ?
                <JobCard job={job}/>
            : <p>Failed to fetch the data</p>
            }
        </div>
    )
}