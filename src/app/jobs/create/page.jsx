import JobForm from "@/components/JobForm";

export default async function create() {
    return (
        <div className="container w-1/2">
            <h1 className="title">Create a Music Job</h1>

            <JobForm />
        </div>
    )
}