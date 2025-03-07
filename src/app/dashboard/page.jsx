import getAuthUser from "@/lib/getAuthUser";
import {getCollection} from "@/lib/db";
import {ObjectId} from "mongodb";
import Link from "next/link";

export default async function Dashboard() {

    const user = await getAuthUser()

    const membersCollection = await getCollection('members')
    const userMembers = await membersCollection
        ?.find({userId: ObjectId.createFromHexString(user.userId)})
        .sort({$natural: -1})
        .toArray();

    if (!userMembers) return <p>Failed to fetch data!</p>

    if (userMembers.length === 0 ) return <p>You dont' have any members</p>

    return (
        <div>
            <h1 className="title">Dashboard</h1>
                <table>
                    <thead>
                    <tr>
                        <th className="w-3/6">Name</th>
                        <th className="w-1/6 sr-only">View</th>
                        <th className="w-1/6 sr-only">Edit</th>
                        <th className="w-1/6 sr-only">Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userMembers.map((member) => (
                        <tr key={member._id.toString}>
                            <td className="w-3/6">{member.name}</td>
                            <td className="w-1/6 text-blue-500">
                                <Link href={`/members/show/${member._id.toString()}`}>
                                    View
                                </Link>
                            </td>
                            <td className="w-1/6 text-green-500">
                                <Link href={`/members/edit/${member._id.toString()}`}>
                                    Edit
                                </Link>
                            </td>
                            <td className="w-1/6 text-red-500">
                                Delete
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
        </div>
    )
}