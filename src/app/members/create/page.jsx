import MemberForm from "@/components/MemberForm";

export default async function create() {
    return (
        <div className="container w-1/2">
            <h1 className="title">Create a new member</h1>

            <MemberForm />
        </div>
    )
}