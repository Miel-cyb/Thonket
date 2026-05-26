import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    SlidersHorizontal,
    Building2,
    Layers,
    X
} from "lucide-react";
import SupplierCard from "../components/Suppliers/SupplierCard";

// Inline mock database setup containing production-depth payload properties
const DUMMY_SUPPLIERS = [
    {
        id: "sup_01JRA891",
        businessName: "Apex Manufacturing Ltd",
        businessType: "manufacturer",
        phone: "+44 20 7946 0192",
        email: "fulfillment@apex-mfg.com",
        location: "London, UK",
        status: "verified",
        reliabilityScore: "98.4%"
    },
    {
        id: "sup_02KXB104",
        businessName: "Global Logistics & Distribution",
        businessType: "distributor",
        phone: "+1 415 555 2671",
        email: "accounts@globaldist.io",
        location: "San Francisco, USA",
        status: "verified",
        reliabilityScore: "94.1%"
    },
    {
        id: "sup_03MZC882",
        businessName: "Vanguard Wholesale Brokers",
        businessType: "broker",
        phone: "+61 2 9382 0119",
        email: "intake@vanguard-wholesale.com",
        location: "Sydney, Australia",
        status: "pending_review",
        reliabilityScore: "89.0%"
    },
    {
        id: "sup_04NLD340",
        businessName: "Horizon Component Casting",
        businessType: "manufacturer",
        phone: "+49 30 8432 0012",
        email: "supply@horizon-cast.de",
        location: "Berlin, Germany",
        status: "verified",
        reliabilityScore: "99.1%"
    }
];

export default function SupplierList() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");

    // Dynamic contextual total count aggregates
    const typeDistributionCounts = useMemo(() => {
        const structuralCounters = { all: DUMMY_SUPPLIERS.length, manufacturer: 0, distributor: 0, broker: 0 };
        DUMMY_SUPPLIERS.forEach((item) => {
            if (structuralCounters[item.businessType] !== undefined) {
                structuralCounters[item.businessType]++;
            }
        });
        return structuralCounters;
    }, []);

    // Real-time pure-client text search parsing matrix filter
    const filteredSuppliers = useMemo(() => {
        return DUMMY_SUPPLIERS.filter((supplier) => {
            const matchesSearch =
                supplier.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                supplier.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType =
                selectedType === "all" || supplier.businessType === selectedType;

            return matchesSearch && matchesType;
        });
    }, [searchQuery, selectedType]);

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-6 p-4 md:p-6 antialiased selection:bg-slate-100">

            {/* 1. TOP DASHBOARD CONTROL ACTION HERO BLOCK */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:border-slate-300/90">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 shadow-xs">
                            <Building2 className="h-4 w-4" />
                        </div>
                        Supplier Core Ledger
                    </h2>
                    <p className="text-xs font-medium text-slate-500 max-w-xl leading-relaxed">
                        Monitor, filter, audit, and provision centralized corporate enterprise supplier profile accounts.
                    </p>
                </div>

                {/* Call to Action Button Matrix Grouping */}
                <div className="flex items-center gap-2.5 shrink-0">
                    <button
                        onClick={() => navigate("/suppliers/bulk")}
                        className="inline-flex items-center justify-center gap-2 px-4 h-10 border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-xl shadow-xs transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-slate-200 cursor-pointer"
                    >
                        <Layers size={14} className="text-slate-500" />
                        Bulk Import Matrix
                    </button>

                    <button
                        onClick={() => navigate("/supplier-onboarding")}
                        className="inline-flex items-center justify-center gap-2 px-4 h-10 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-black rounded-xl shadow-xs transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 cursor-pointer"
                    >
                        <Plus size={14} strokeWidth={2.5} />
                        Onboard Vendor
                    </button>
                </div>
            </div>

            {/* 2. LIVE SEARCH AND DISCOVERY CONTROL PANEL TAB BAR */}
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                {/* Search Bar Input Frame */}
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 h-10 rounded-xl flex-1 max-w-md focus-within:bg-white focus-within:border-slate-400 focus-within:shadow-xs transition-all duration-150 relative group">
                    <Search size={14} className="text-slate-400 group-focus-within:text-slate-600 transition-colors shrink-0" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search matching business name, region, or inbox..."
                        className="w-full bg-transparent outline-hidden text-xs font-medium text-slate-800 placeholder:text-slate-400 pr-4"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-md transition-all cursor-pointer"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>

                {/* Client Classification Quick-Toggle Filtering Segments */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none select-none">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold pr-3 border-r border-slate-200 mr-1.5 shrink-0">
                        <SlidersHorizontal size={13} className="text-slate-400" />
                        <span>Filters:</span>
                    </div>
                    {[
                        { id: "all", label: "All Accounts", count: typeDistributionCounts.all },
                        { id: "manufacturer", label: "Manufacturers", count: typeDistributionCounts.manufacturer },
                        { id: "distributor", label: "Distributors", count: typeDistributionCounts.distributor },
                        { id: "broker", label: "Brokers", count: typeDistributionCounts.broker }
                    ].map((tab) => {
                        const isCurrentlyActive = selectedType === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedType(tab.id)}
                                className={`inline-flex items-center gap-2 px-3.5 h-8 text-xs font-semibold rounded-lg border transition-all duration-150 whitespace-nowrap cursor-pointer ${isCurrentlyActive
                                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50"
                                    }`}
                            >
                                {tab.label}
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono ${isCurrentlyActive
                                    ? "bg-white/20 text-white"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. DYNAMIC RESULTS MAP LAYOUT GRID VIEW */}
            {filteredSuppliers.length === 0 ? (
                /* Enhanced Contextual Workspace Missing/Empty State Panel */
                <div className="border border-dashed border-slate-200 bg-white rounded-2xl p-12 md:p-16 text-center flex flex-col items-center justify-center min-h-[340px] shadow-xs">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mb-4 shadow-2xs">
                        <Building2 size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">No Profiles Isolated</h3>
                    <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                        We couldn't find any registered suppliers matching those parameters. Reset your filters or initialize new profiles.
                    </p>
                    <div className="mt-5">
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedType("all"); }}
                            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 shadow-2xs transition-all cursor-pointer"
                        >
                            Clear Workspace Filters
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-300">
                    {filteredSuppliers.map((supplier) => (
                        <SupplierCard key={supplier.id} supplier={supplier} />
                    ))}
                </div>
            )}

        </div>
    );
}