import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Search,
    Plus,
    ClipboardList,
    Bell,
    Settings2,
    Users,
    ChevronDown,
    Layers,
    UserPlus
} from "lucide-react";

export default function ProcurementHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Checks the active route path to dynamically apply highlighted styles
    const isSuppliersActive = location.pathname.startsWith("/suppliers");

    return (
        <header className="w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
            {/* MAIN WRAPPER */}
            <div className="flex items-center justify-between gap-6 px-6 py-4">

                {/* LEFT - BRAND LINK */}
                <Link
                    to="/"
                    className="flex items-center gap-4 min-w-0 group cursor-pointer select-none"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 shadow-sm group-hover:scale-[0.98] transition-transform">
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
                </Link>

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
                            <div className="text-[10px] font-mono font-medium text-slate-400 border border-slate-200 bg-white px-2 py-0.5 rounded-md select-none">
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
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    >
                        <Bell size={18} />
                        <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </button>

                    {/* SETTINGS */}
                    <button
                        aria-label="Settings"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    >
                        <Settings2 size={18} />
                    </button>

                    {/* SUPPLIER ACTION SPLIT-BUTTON FRAME */}
                    <div
                        className="hidden md:flex items-center h-10 rounded-xl border border-slate-200 bg-white relative"
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        {/* Primary Action Segment */}
                        <Link
                            to="/suppliers"
                            className={`flex items-center gap-2 px-4 h-full text-sm font-semibold transition cursor-pointer rounded-l-xl ${isSuppliersActive
                                ? "bg-slate-900 text-white"
                                : "text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            <Users size={15} />
                            Suppliers
                        </Link>

                        <div className={`w-px h-5 ${isSuppliersActive ? "bg-slate-800" : "bg-slate-200"}`} />

                        {/* Dropdown Menu Trigger Segment */}
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            aria-label="More supplier options"
                            className={`flex items-center justify-center px-2.5 h-full text-slate-500 hover:text-slate-800 transition cursor-pointer rounded-r-xl ${dropdownOpen ? "bg-slate-50" : ""
                                }`}
                        >
                            <ChevronDown size={15} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Contextual Dropdown Submenu Options (Pure React State Driven) */}
                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-100 z-50">
                                <Link
                                    to="/suppliers"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                                >
                                    <Layers size={14} className="text-slate-400" />
                                    Bulk Registry Matrix
                                </Link>
                                <Link
                                    to="/suppliers/new"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                                >
                                    <UserPlus size={14} className="text-slate-400" />
                                    Single Entry Wizard
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* PRIMARY ACTION */}
                    <button
                        onClick={() => navigate("/procurement/create")}
                        className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 h-10 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition cursor-pointer"
                    >
                        <Plus size={16} />
                        New Purchase
                    </button>
                </div>
            </div>

            {/* MOBILE SEARCH */}
            <div className="px-6 pb-4 lg:hidden">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                    <Search size={16} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search procurement assets..."
                        className="w-full bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400"
                    />
                </div>
            </div>
        </header>
    );
}