import {ObjectId} from "mongodb";
import {getCollection} from "@/lib/db";
import MemberCard from "@/components/MemberCard";

export default async function Show({params}) {
    const {id} = await params

    const membersCollection = await getCollection('members')
    const member = id.length === 24 ? await membersCollection?.findOne({
        _id: ObjectId.createFromHexString(id)
    }) : null;

    return (
        <div className="container w-1/2">
            { member ?
                <MemberCard member={member}/>
            : <p>Failed to fetch the data</p>
            }
        </div>
    )
}