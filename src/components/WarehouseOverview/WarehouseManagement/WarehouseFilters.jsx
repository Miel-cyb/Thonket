import React from "react";
import { Search, X, Filter, Building2, Archive, SlidersHorizontal } from "lucide-react";

export default function WarehouseFilters({
    activeTab = "active",
    setActiveTab,
    searchTerm = "",
    setSearchTerm,
    statusFilter = "all",
    setStatusFilter,
    counts = { active: 0, deleted: 0 }, // Optional counts badge
    onResetFilters,
}) {
    const hasActiveFilters = searchTerm.trim() !== "" || statusFilter !== "all";

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            {/* Nav Tabs */}
            <div
                role="tablist"
                aria-label="Facility categories"
                className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 w-full sm:w-fit shrink-0"
            >
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "active"}
                    onClick={() => setActiveTab("active")}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${activeTab === "active"
                            ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                        }`}
                >
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    <span>Active Facilities</span>
                    {typeof counts.active === "number" && (
                        <span
                            className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === "active"
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "bg-slate-200 text-slate-600"
                                }`}
                        >
                            {counts.active}
                        </span>
                    )}
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "deleted"}
                    onClick={() => setActiveTab("deleted")}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${activeTab === "deleted"
                            ? "bg-white text-rose-600 shadow-sm border border-slate-200/50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                        }`}
                >
                    <Archive className="w-4 h-4 text-rose-500" />
                    <span>Deactivated</span>
                    {typeof counts.deleted === "number" && (
                        <span
                            className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === "deleted"
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-slate-200 text-slate-600"
                                }`}
                        >
                            {counts.deleted}
                        </span>
                    )}
                </button>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:max-w-xl">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by name, code, or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                            title="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Status Filter Dropdown (Active Tab Only) */}
                {activeTab === "active" && setStatusFilter && (
                    <div className="relative shrink-0">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <Filter className="w-3.5 h-3.5" />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-auto pl-9 pr-8 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-semibold cursor-pointer appearance-none transition-all"
                        >
                            <option value="all">All Operational Statuses</option>
                            <option value="active">Active / Operational</option>
                            <option value="maintenance">Under Maintenance</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                        </div>
                    </div>
                )}

                {/* Clear All Filters Button */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm("");
                            setStatusFilter?.("all");
                            onResetFilters?.();
                        }}
                        className="text-xs font-bold text-slate-500 hover:text-indigo-600 px-2 py-2 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap text-center cursor-pointer"
                    >
                        Reset Filters
                    </button>
                )}
            </div>
        </div>
    );
}