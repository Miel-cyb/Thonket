import React from "react";
import { useNavigate } from "react-router-dom"; // <-- Imported router navigation hook
import {
    Building2,
    MapPin,
    Phone,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Truck,
    Package,
    ShieldAlert,
    HelpCircle
} from "lucide-react";

/**
 * SupplierCard Component - Optimally packaged dashboard item summary
 * @param {Object} supplier - Structured data tracking vendor identity and performance metrics.
 */
export default function SupplierCard({ supplier }) {
    const navigate = useNavigate(); // <-- Initialized navigation hook

    if (!supplier) return null;

    // Pull the structural ID safely from your database payload schemas
    const supplierId = supplier.id || supplier._id;

    // 1. SAFE NESTED SCHEMA DESTRUCTURING FROM SERVER PAYLOAD
    const {
        businessIdentity = {},
        contactInformation = {},
        locationDetails = {},
        coverageLogistics = {},
        supplyCapability = {},
        complianceRisk = {}
    } = supplier;

    const name = businessIdentity.businessName || supplier.businessName || "Unnamed Supplier";
    const type = businessIdentity.businessType || supplier.businessType || "General Category";

    // Status maps cleanly to verificationStatus inside complianceRisk
    const status = complianceRisk.verificationStatus || supplier.status || "pending";
    const riskLevel = (complianceRisk.riskLevel || supplier.risk || "medium").toLowerCase();

    // 2. DESIGN ENGINE RULESETS
    const getRiskStyles = (level) => {
        switch (level) {
            case "low":
                return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
            case "high":
            case "critical":
                return "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
            default:
                return "bg-amber-50 text-amber-700 border-amber-200/70";
        }
    };

    const getStatusStyles = (currStatus) => {
        const normalized = currStatus.toLowerCase();
        if (normalized === "verified" || normalized === "approved") {
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }
        if (normalized === "pending" || normalized === "pending_review") {
            return "bg-slate-50 text-slate-600 border-slate-200";
        }
        return "bg-rose-50 text-rose-700 border-rose-200";
    };

    // Helper to generate quick two-letter business initials
    const initials = name
        .split(" ")
        .filter(Boolean)
        .map(w => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "SP";

    return (
        <div
            onClick={() => supplierId && navigate(`/supplier/${supplierId}`)} // <-- Strategic Navigation Handler
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-slate-300/90 transition-all duration-200 flex flex-col justify-between group h-full relative overflow-hidden cursor-pointer select-none"
        >

            {/* Design Element: Top Highlight Strip */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-100 group-hover:bg-indigo-500 transition-colors duration-200" />

            {/* CORE BODY INFO BLOCK */}
            <div className="space-y-4">

                {/* IDENTITY HEADER WRAPPER */}
                <div className="flex items-start justify-between gap-3 pt-1">
                    <div className="flex gap-3 min-w-0">
                        {/* Company Visual Avatar Placer */}
                        <div className="h-11 w-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-mono text-xs font-bold text-slate-600 shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors duration-150">
                            {initials}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
                                <Building2 size={12} className="text-indigo-500 shrink-0" />
                                {type}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors duration-150 truncate">
                                {name}
                            </h4>
                        </div>
                    </div>

                    {/* CONTEXT-DRIVEN STATUS BADGE */}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border shrink-0 ${getStatusStyles(status)}`}>
                        {status === "verified" ? (
                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        ) : status === "pending" || status === "pending_review" ? (
                            <Clock size={13} className="text-slate-500 shrink-0" />
                        ) : (
                            <AlertTriangle size={13} className="text-rose-600 shrink-0" />
                        )}
                        <span className="capitalize">{status.replace("_", " ")}</span>
                    </span>
                </div>

                {/* LOGISTICS & ATTRIBUTE DATA FIELDS */}
                <div className="space-y-3 border-y border-slate-100 py-4 text-sm text-slate-600 font-medium">

                    <div className="flex items-center gap-3 min-w-0">
                        <MapPin size={15} className="text-slate-400 shrink-0" />
                        <span className="text-slate-700 truncate">
                            {locationDetails.cityRegion && locationDetails.country
                                ? `${locationDetails.cityRegion}, ${locationDetails.country}`
                                : "No location set"}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 min-w-0">
                        <Phone size={15} className="text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-800 tracking-tight">
                            {contactInformation.phoneNumber || "No primary phone"}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 min-w-0">
                        <Package size={15} className="text-slate-400 shrink-0" />
                        <span className="text-slate-700 truncate">
                            {Array.isArray(supplyCapability.productCategories) && supplyCapability.productCategories.length > 0
                                ? supplyCapability.productCategories.join(", ")
                                : "General Inventory Assets"}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 min-w-0">
                        <Truck size={15} className="text-slate-400 shrink-0" />
                        <span className="text-slate-600 truncate">
                            Logistics: <span className="text-slate-900 font-semibold">{coverageLogistics.deliveryType || "Standard Freight"}</span>
                        </span>
                    </div>

                </div>
            </div>

            {/* CAPACITY & RISK MATRIX FOOTER */}
            <div className="mt-5 pt-3 flex items-center justify-between border-t border-slate-100">
                <div className="space-y-0.5">
                    <span className="text-slate-400 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                        Capacity Limit
                    </span>
                    <span className="text-sm font-bold text-slate-800 font-mono block">
                        {supplyCapability.capacity?.value
                            ? `${supplyCapability.capacity.value.toLocaleString()} ${supplyCapability.capacity.unit || "units"}`
                            : "Unlimited"}
                    </span>
                </div>

                <div className="text-right space-y-0.5">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Risk Profile</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize font-mono ${getRiskStyles(riskLevel)}`}>
                        {riskLevel === "high" || riskLevel === "critical" ? (
                            <ShieldAlert size={12} className="shrink-0 stroke-[2.5]" />
                        ) : null}
                        {riskLevel}
                    </span>
                </div>
            </div>

        </div>
    );
}