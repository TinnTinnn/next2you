import MemberForm from "@/components/MemberForm";
import {getCollection} from "@/lib/db";
import {ObjectId} from "mongodb";
import getAuthUser from "@/lib/getAuthUser";

export default async function Edit({ params }) {
    // Id parameter from page params
    const { id } = params;

    // Get the auth user from cookies
    const user = await getAuthUser()

    const membersCollection = await getCollection("members");
    let member = null;
    if (id.length === 24 && membersCollection) {
       member = await membersCollection.findOne({
            _id: ObjectId.createFromHexString(id)
        })
        if (member) {
            member = JSON.parse(JSON.stringify(member));
        }
    }

    console.log("Fetched member:", member);
    return (
        <div className="container w-1/2">
            <h1 className="title">
                Edit your member
            </h1>
            {member ? (
                <MemberForm member={member}/>
            ) : (
                <p>Failed to fetch the data</p>
            )}
        </div>
    )
}