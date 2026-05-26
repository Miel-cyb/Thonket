import React from "react";
import {
    ShieldCheck,
    Briefcase,
    FileText,
    Hash,
    MapPin,
    Globe,
    User,
    Phone,
    Mail
} from "lucide-react";

/**
 * SupplierProfileCard Component
 * @param {Object} supplier - Structured data tracking vendor identity and operational metrics.
 */
export default function SupplierProfileCard({ supplier }) {
    if (!supplier) return null;

    const contact = supplier.primaryContact || {};
    const coverageAreas = supplier.coverageAreas || [];

    return (
        <div className="space-y-6">

            {/* COMPONENT TITLE */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Briefcase className="text-slate-400 shrink-0" size={18} />
                <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase tracking-wider">
                    Firmographic Profile
                </h2>
            </div>

            {/* BUSINESS FIRMOGRAPHIC DATA DETAILS */}
            <div className="space-y-4">

                {/* BUSINESS TYPE & COMPLIANCE STATUS */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            Business Type
                        </p>
                        <p className="text-sm font-semibold text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                            {supplier.type || "—"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            Status
                        </p>
                        <span className={`inline-flex items-center gap-1 text-sm font-bold capitalize px-2.5 py-1.5 rounded-lg border w-full ${supplier.status === "verified"
                            ? "bg-emerald-50/60 border-emerald-200 text-emerald-800"
                            : "bg-amber-50/60 border-amber-200 text-amber-800"
                            }`}>
                            <span className={`w-2 h-2 rounded-full shrink-0 ${supplier.status === "verified" ? "bg-emerald-500" : "bg-amber-500"}`} />
                            {supplier.status || "Pending"}
                        </span>
                    </div>
                </div>

                {/* REGISTRATION NUMBER */}
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FileText size={13} className="text-slate-400" />
                        Registration ID
                    </p>
                    <p className="text-sm font-mono font-medium text-slate-800 bg-slate-50/50 p-2 rounded-xl border border-slate-100 selection:bg-indigo-100">
                        {supplier.registrationNumber || "—"}
                    </p>
                </div>

                {/* TAX IDENTIFICATION NUMBER */}
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Hash size={13} className="text-slate-400" />
                        Taxpayer ID (TIN)
                    </p>
                    <p className="text-sm font-mono font-medium text-slate-800 bg-slate-50/50 p-2 rounded-xl border border-slate-100 selection:bg-indigo-100">
                        {supplier.taxId || "—"}
                    </p>
                </div>

                {/* LOGISTICS HEADQUARTERS ADDRESS */}
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400" />
                        Physical Address
                    </p>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                        {supplier.address || "—"}
                    </p>
                </div>

                {/* LOGISTICS TERRITORY COVERAGE PILLS */}
                <div className="space-y-1.5 pt-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Globe size={13} className="text-slate-400" />
                        Active Coverage Areas
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {coverageAreas.length > 0 ? (
                            coverageAreas.map((area, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center text-xs font-semibold bg-indigo-50/80 text-indigo-700 border border-indigo-100/70 px-2.5 py-1 rounded-md"
                                >
                                    {area}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-slate-400 italic">No logistics tracks defined</span>
                        )}
                    </div>
                </div>

            </div>

            {/* KEY PERSONNEL PRIMARY CONTACT PANEL */}
            <div className="pt-5 border-t border-slate-200 space-y-3">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <User size={13} className="text-slate-400" />
                    Primary Account Contact
                </p>

                <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-3.5 space-y-2.5">
                    <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">
                            {contact.name || "—"}
                        </p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {contact.role || "—"}
                        </p>
                    </div>

                    <div className="space-y-1.5 pt-1 text-xs font-medium border-t border-slate-100/80">
                        {contact.phone && (
                            <a
                                href={`tel:${contact.phone}`}
                                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                <Phone size={13} className="text-slate-400" />
                                {contact.phone}
                            </a>
                        )}
                        {contact.email && (
                            <a
                                href={`mailto:${contact.email}`}
                                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors truncate"
                            >
                                <Mail size={13} className="text-slate-400" />
                                {contact.email}
                            </a>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}