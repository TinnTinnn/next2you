import Link from "next/link";

export default function  MemberCard ({member}) {
    return (
        <div className="border border-slate-400 border-dashed p-4 rounded-md h-full">
            <p className="text-slate-600 text-xs">
                {member._id.getTimestamp().toLocaleString()}
            </p>
            <Link href={`/members/show/${member._id.toString()}`}
                  className="block text-xl font-semibold mb-4">
                {member.name}
            </Link>
            <p className="text-sm">{member.address}</p>
        </div>
    )
}