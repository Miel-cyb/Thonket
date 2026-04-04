import { Search, Filter, Plus } from "lucide-react";

export default function CustomersHeader({ search, setSearch, filter, setFilter }) {
    return (
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by business or branch..."
                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                    className="border rounded-lg px-3 py-2 bg-white text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Risk Levels</option>
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                </select>

                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Plus className="h-4 w-4" />
                    Create Customer
                </button>
            </div>
        </div>
    );
}