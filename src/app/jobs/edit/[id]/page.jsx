import JobForm from "@/components/JobForm";
import {getCollection} from "@/lib/db";
import {ObjectId} from "mongodb";
import getAuthUser from "@/lib/getAuthUser";

export default async function Edit({ params }) {
    // Id parameter from page params
    const { id } = params;

    // Get the auth user from cookies
    const user = await getAuthUser()

    const jobsCollection = await getCollection("jobs");
    let job = null;
    if (id.length === 24 && jobsCollection) {
       job = await jobsCollection.findOne({
            _id: ObjectId.createFromHexString(id)
        })
        if (job) {
            job = JSON.parse(JSON.stringify(job));
        }
    }

    console.log("Fetched job:", job);
    return (
        <div className="container w-1/2">
            <h1 className="title">
                Edit your job
            </h1>
            {job ? (
                <JobForm job={job}/>
            ) : (
                <p>Failed to fetch the data</p>
            )}
        </div>
    )
}