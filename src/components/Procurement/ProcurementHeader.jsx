import React from "react";
import {
    Search,
    Plus,
    ClipboardList,
    Bell,
    Settings2,
    Users,
    List,
    ChevronDown
} from "lucide-react";

// PROCUREMENT HEADER - REFINED CONTROL CENTER
export default function ProcurementHeader() {
    return (
        <header className="w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">

            {/* MAIN WRAPPER */}
            <div className="flex items-center justify-between gap-6 px-6 py-4">

                {/* LEFT - BRAND */}
                <div className="flex items-center gap-4 min-w-0">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 shadow-sm">
                        <ClipboardList size={20} className="text-white" />
                    </div>

                    <div className="min-w-0">
                        <h1 className="text-base font-semibold tracking-tight text-slate-900 truncate">
                            Procurement Control Center
                        </h1>
                        <p className="text-xs text-slate-500 truncate">
                            Manage procurement, suppliers, inventory & workflows
                        </p>
                    </div>
                </div>

                {/* CENTER - SEARCH (DESKTOP ONLY) */}
                <div className="hidden lg:flex flex-1 justify-center">
                    <div className="w-full max-w-lg">
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus-within:bg-white focus-within:border-slate-400 focus-within:shadow-sm">

                            <Search size={16} className="text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search PO, supplier, SKU, warehouse..."
                                className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                            />

                            <div className="text-[10px] font-medium text-slate-400 border border-slate-200 bg-white px-2 py-0.5 rounded-md">
                                ⌘K
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT - ACTION SYSTEM */}
                <div className="flex items-center gap-2">

                    {/* NOTIFICATIONS */}
                    <button
                        aria-label="Notifications"
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition"
                    >
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </button>

                    {/* SETTINGS */}
                    <button
                        aria-label="Settings"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition"
                    >
                        <Settings2 size={18} />
                    </button>

                    {/* SUPPLIER ACTION GROUP (SIMPLIFIED + CLEANER) */}
                    <div className="hidden md:flex items-center h-10 rounded-xl border border-slate-200 bg-white overflow-hidden">

                        <button className="flex items-center gap-2 px-3 h-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                            <Users size={16} />
                            Suppliers
                        </button>

                        <div className="w-px h-5 bg-slate-200" />

                        <button
                            aria-label="More supplier options"
                            className="flex items-center justify-center px-2 h-full text-slate-500 hover:text-slate-800 transition"
                        >
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    {/* PRIMARY ACTION (VISUAL EMPHASIS FIXED) */}
                    <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 h-10 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition">

                        <Plus size={16} />
                        New Purchase
                    </button>
                </div>
            </div>

            {/* MOBILE SEARCH */}
            <div className="px-6 pb-4 lg:hidden">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                    <Search size={16} className="text-slate-400" />

                    <input
                        type="text"
                        placeholder="Search procurement..."
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                </div>
            </div>

        </header>
    );
}