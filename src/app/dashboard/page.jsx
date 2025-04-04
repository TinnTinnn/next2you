import getAuthUser from "@/lib/getAuthUser";
import {getCollection} from "@/lib/db";
import {ObjectId} from "mongodb";
import Link from "next/link";
import {deleteJob} from "@/actions/jobs";

export default async function Dashboard() {

    const user = await getAuthUser()

    const jobsCollection = await getCollection('jobs')
    const userJobs = await jobsCollection
        ?.find({userId: ObjectId.createFromHexString(user.userId)})
        .sort({$natural: -1})
        .toArray();

    if (!userJobs) return <p>Failed to fetch data!</p>

    if (userJobs.length === 0) return <p>You don't have any Job</p>

    return (
        <div>
            <h1 className="title">Dashboard</h1>
            <table>
                <thead>
                <tr>
                    <th className="w-3/6">Title</th>
                    <th className="w-1/6 sr-only">View</th>
                    <th className="w-1/6 sr-only">Edit</th>
                    <th className="w-1/6 sr-only">Delete</th>
                </tr>
                </thead>
                <tbody>
                {userJobs.map((job) => (
                    <tr key={job._id.toString}>
                        <td className="w-3/6">{job.title}</td>
                        <td className="w-1/6 text-blue-500">
                            <Link href={`/jobs/show/${job._id.toString()}`}>
                                View
                            </Link>
                        </td>
                        <td className="w-1/6 text-green-500">
                            <Link href={`/jobs/edit/${job._id.toString()}`}>
                                Edit
                            </Link>
                        </td>
                        <td className="w-1/6 text-red-500">
                            <form action={deleteJob}>
                                <input
                                    type="hidden"
                                    name="jobId"
                                    defaultValue={job._id.toString()}/>
                                <button type="submit">Delete</button>
                            </form>
                        </td>

                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}