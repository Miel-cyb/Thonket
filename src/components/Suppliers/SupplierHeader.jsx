import React from "react";
import {
    Building2,
    MapPin,
    Phone,
    ShieldCheck,
    Mail,
    User,
    UserMinus,
    ArrowLeft
} from "lucide-react";

/**
 * SupplierDetailHeader component
 * @param {Object} supplier - The supplier profile data.
 * @param {Function} onOpenProfile - Callback toggle for the sidebar layout.
 * @param {Function} onBack - Navigation handler to return to the master supplier directory list.
 * @param {boolean} isProfileActive - Detects if the profile sidebar is currently rendered.
 */
export default function SupplierDetailHeader({
    supplier,
    onOpenProfile,
    onBack = () => window.history.back(),
    isProfileActive = false
}) {
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-3">

                {/* TOP NAVIGATION TRACK */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-150 rounded-lg focus-visible:ring-2 focus-visible:ring-slate-400 outline-none"
                        aria-label="Return to supplier directory list"
                    >
                        <ArrowLeft size={14} className="transition-transform duration-150 group-hover:-translate-x-0.5 text-slate-400 group-hover:text-slate-900" />
                        Back to Suppliers
                    </button>
                </div>

                {/* BOTTOM CORE IDENTITY & ACTIONS CONTAINER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* LEFT SIDE: IDENTITY & CORE METADATA */}
                    <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                {supplier.name}
                            </h1>

                            {/* STATUS BADGE */}
                            <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium"
                                role="status"
                            >
                                <ShieldCheck size={13} className="stroke-[2.5]" />
                                Verified
                            </span>
                        </div>

                        {/* METADATA QUICK LINKS */}
                        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1.5 min-w-0 truncate">
                                <Building2 size={14} className="text-slate-400 shrink-0" />
                                {supplier.type}
                            </span>

                            <span className="flex items-center gap-1.5 min-w-0 truncate">
                                <MapPin size={14} className="text-slate-400 shrink-0" />
                                {supplier.location}
                            </span>

                            <a
                                href={`tel:${supplier.phone}`}
                                className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors min-w-0 truncate"
                            >
                                <Phone size={14} className="text-slate-400 shrink-0" />
                                {supplier.phone}
                            </a>

                            <a
                                href={`mailto:${supplier.email}`}
                                className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors min-w-0 truncate"
                            >
                                <Mail size={14} className="text-slate-400 shrink-0" />
                                {supplier.email}
                            </a>
                        </div>
                    </div>

                    {/* RIGHT SIDE: PAGE CONTEXTUAL ACTIONS */}
                    <div className="flex items-center justify-between lg:justify-end gap-4 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0 shrink-0">

                        {/* ADAPTIVE ACTION TRIGGER BUTTON */}
                        <button
                            onClick={onOpenProfile}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${isProfileActive
                                ? "bg-slate-900 border-slate-900 text-white shadow-sm hover:bg-slate-800"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                                }`}
                            aria-expanded={isProfileActive}
                        >
                            {isProfileActive ? (
                                <>
                                    <UserMinus size={15} />
                                    Hide Profile Data
                                </>
                            ) : (
                                <>
                                    <User size={15} />
                                    View Full Profile
                                </>
                            )}
                        </button>

                        {/* ID METADATA */}
                        <div className="text-right border-l border-slate-200 pl-4 h-9 flex flex-col justify-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-1">
                                Supplier Ref
                            </p>
                            <p className="text-xs font-mono font-semibold text-slate-700 leading-none">
                                #{supplier.id.toString().padStart(4, "0")}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
}