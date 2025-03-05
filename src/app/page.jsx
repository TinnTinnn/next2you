import {getCollection} from "@/lib/db";
import Link from "next/link";
import MemberCard from "@/components/MemberCard";

export default async function Home() {
    const membersCollection = await getCollection("members");
    const members = await membersCollection?.find().sort({$natural: -1}).toArray()


    if (members) {
        return (
            <div className="grid grid-cols-2 gap-6">
                {
                    members.map((member) => (
                        <div key={member._id}>
                            <MemberCard member={member} />
                        </div>
                    ))
                }
            </div>
        )
    } else {
        return <p>Failed to fetch the data from database.</p>
    }
}

