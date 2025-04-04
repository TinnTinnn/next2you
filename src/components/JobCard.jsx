import Link from "next/link";
import { CalendarIcon, ClockIcon, MapPinIcon, BanknotesIcon, MusicalNoteIcon, UserIcon } from "@heroicons/react/24/outline";

export default function JobCard({job}) {
    // Format date to be more readable
    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Calculate duration between start and end time
    const calculateDuration = (start, end) => {
        if (!start || !end) return "Not specified";
        
        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);
        
        let durationHours = endHours - startHours;
        let durationMinutes = endMinutes - startMinutes;
        
        if (durationMinutes < 0) {
            durationHours--;
            durationMinutes += 60;
        }
        
        return `${durationHours} hr ${durationMinutes} min`;
    };

    return (
        <div className="border border-slate-200 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden">
            {/* Header with date and rate */}
            <div className="bg-blue-50 p-4 border-b border-slate-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-blue-800">{job.title}</h2>
                    <div className="bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full text-sm">
                        ฿{job.rate || 0}/hr
                    </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                    Posted on {job._id ? new Date(job._id.getTimestamp()).toLocaleDateString() : "Unknown date"}
                </p>
            </div>
            
            {/* Main content */}
            <div className="p-4">
                {/* Position and Genre */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start">
                        <UserIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-gray-700">Position</h3>
                            <p>{job.position === "Other" ? job.customPosition : job.position}</p>
                            {job.position === "Singer" && job.gender && (
                                <span className="text-sm text-gray-500">({job.gender})</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start">
                        <MusicalNoteIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-gray-700">Genre</h3>
                            <p>{job.genre || "Not specified"}</p>
                        </div>
                    </div>
                </div>
                
                {/* Date and Time */}
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <div className="flex items-center mb-2">
                        <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="font-semibold text-gray-700">Date</h3>
                    </div>
                    <p className="ml-7 mb-2">{formatDate(job.date)}</p>
                    
                    <div className="flex items-center mb-2">
                        <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="font-semibold text-gray-700">Time</h3>
                    </div>
                    <div className="ml-7 grid grid-cols-3 gap-2">
                        <div>
                            <span className="text-sm text-gray-500">Start:</span>
                            <p>{job.startTime || "Not specified"}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">End:</span>
                            <p>{job.endTime || "Not specified"}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Duration:</span>
                            <p>{calculateDuration(job.startTime, job.endTime)}</p>
                        </div>
                    </div>
                </div>
                
                {/* Breaks */}
                {job.hasBreak && (
                    <div className="bg-orange-50 p-3 rounded-md mb-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Breaks</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-gray-500">Number of breaks:</span>
                                <p>{job.breakCount || 0}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Duration per break:</span>
                                <p>{job.breakDuration || 0} minutes</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Venue */}
                <div className="mb-4">
                    <div className="flex items-start">
                        <MapPinIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-gray-700">Venue</h3>
                            <p>{job.place || "Not specified"}</p>
                            {job.location && (
                                <a 
                                    href={job.location}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm inline-flex items-center mt-1"
                                >
                                    View on map
                                    <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Welfare */}
                {job.welfare && (
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Welfare</h3>
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-gray-700 whitespace-pre-line">{job.welfare}</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Footer with actions */}
            <div className="border-t border-slate-200 p-4 bg-gray-50 flex justify-between">
                <Link 
                    href={`/jobs/edit/${job._id ? job._id.toString() : ""}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    Edit Job
                </Link>
                <Link 
                    href={`/jobs/show/${job._id ? job._id.toString() : ""}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                    View Full Details
                </Link>
            </div>
        </div>
    );
}