import { Search, UserPlus } from "lucide-react";

export default function StaffHeader({ search, setSearch }) {
    return (
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search name or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-10 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all">
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Staff</span>
            </button>
        </div>
    );
}