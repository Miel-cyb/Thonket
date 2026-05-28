import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    SlidersHorizontal,
    Building2,
    Layers,
    X,
    Loader2
} from "lucide-react";
import SupplierCard from "../components/Suppliers/SupplierCard";
import { API_ENDPOINTS } from "../utils/urls";

/// SupplierList
// A dynamic directory interface for browsing, searching, and filtering registered supplier profiles within the enterprise ecosystem.
export default function SupplierList() {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");

    // Helper to beautifully format raw types (e.g., "wholesale distributor" -> "Wholesale Distributors")
    const formatTabLabel = (typeString) => {
        if (!typeString) return "";
        return typeString
            .trim()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ") + "s";
    };

    // 1. DYNAMIC API RESOURCE RETRIEVAL ON COMPONENT MOUNT
    useEffect(() => {
        const fetchSuppliersLedger = async () => {
            setIsLoading(true);
            setErrorMessage("");
            try {
                const targetEndpoint = API_ENDPOINTS.SUPPLIERS;
                const response = await fetch(targetEndpoint, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                });

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();

                    console.log("Raw supplier ledger API response payload:", data);
                    if (response.ok) {
                        // FIX: Safely unpack variables referencing 'data' rather than 'payload'
                        const standardizedPayload = Array.isArray(data.data)
                            ? data.data
                            : (Array.isArray(data) ? data : []);

                        console.log("Standardized supplier ledger dataset extracted:", standardizedPayload);
                        setSuppliers(standardizedPayload);
                    } else {
                        throw new Error(data.message || "Failed to successfully aggregate database profiles.");
                    }
                } else {
                    const fallbackHtmlError = await response.text();
                    console.error("Infrastructure unexpected non-JSON response payload:", fallbackHtmlError);
                    throw new Error(`Server returned status code [${response.status}]. Core route endpoint unresolved.`);
                }
            } catch (error) {
                console.error("Ledger background sync extraction error:", error);
                setErrorMessage(error.message || "Network synchronization baseline loss occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuppliersLedger();
    }, []);

    // 2. DYNAMIC CONTEXTUAL TOTAL COUNT AGGREGATES & TAB MATRIX GENERATION
    const dynamicTabsList = useMemo(() => {
        const distributionMap = { all: suppliers.length };

        suppliers.forEach((item) => {
            // Read directly from target deep path format coming from server
            const rawType = item.businessIdentity?.businessType || item.businessType;
            if (rawType) {
                const normalizedKey = rawType.trim();
                distributionMap[normalizedKey] = (distributionMap[normalizedKey] || 0) + 1;
            }
        });

        const tabs = [
            { id: "all", label: "All Accounts", count: distributionMap.all }
        ];

        Object.keys(distributionMap).forEach((key) => {
            if (key !== "all") {
                tabs.push({
                    id: key,
                    label: formatTabLabel(key),
                    count: distributionMap[key]
                });
            }
        });

        return tabs;
    }, [suppliers]);

    // 3. REAL-TIME SEARCH PARSING AND SELECTION MATRIX FILTER
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((supplier) => {
            // FIX: Remapped layout access properties to check nested schema values matching server response payload
            const bizIdentity = supplier.businessIdentity || {};
            const contactInfo = supplier.contactInformation || {};
            const locationInfo = supplier.locationDetails || {};

            const bizName = bizIdentity.businessName || supplier.businessName || "";
            const bizEmail = contactInfo.emailAddress || supplier.email || "";
            const bizLoc = locationInfo.cityRegion || supplier.location || "";

            const rawType = bizIdentity.businessType || supplier.businessType || "";
            const currentSupplierType = rawType.trim();
            const query = searchQuery.toLowerCase();

            const matchesSearch =
                bizName.toLowerCase().includes(query) ||
                bizEmail.toLowerCase().includes(query) ||
                bizLoc.toLowerCase().includes(query);

            // FIX: Normalizing type variables comparison prevents structural case sensitivity gaps
            const matchesType =
                selectedType === "all" ||
                currentSupplierType.toLowerCase() === selectedType.toLowerCase();

            return matchesSearch && matchesType;
        });
    }, [suppliers, searchQuery, selectedType]);

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-6 p-4 md:p-6 antialiased selection:bg-slate-100">

            {/* TOP DASHBOARD CONTROL ACTION HERO BLOCK */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:border-slate-300/90">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 shadow-xs">
                            <Building2 className="h-4 w-4" />
                        </div>
                        Supplier Core Ledger
                    </h2>
                    <p className="text-xs font-medium text-slate-500 max-w-xl leading-relaxed">
                        Monitor, filter, audit, and provision centralized corporate enterprise supplier profile accounts synced via your database system.
                    </p>
                </div>

                {/* Call to Action Button Matrix Grouping */}
                <div className="flex items-center gap-2.5 shrink-0">
                    {/* <button
                        onClick={() => navigate("/suppliers/bulk")}
                        className="inline-flex items-center justify-center gap-2 px-4 h-10 border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-xl shadow-xs transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-slate-200 cursor-pointer"
                    >
                        <Layers size={14} className="text-slate-500" />
                        Bulk Import Matrix
                    </button> */}

                    <button
                        onClick={() => navigate("/supplier-onboarding")}
                        className="inline-flex items-center justify-center gap-2 px-4 h-10 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-black rounded-xl shadow-xs transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 cursor-pointer"
                    >
                        <Plus size={14} strokeWidth={2.5} />
                        Onboard Vendor
                    </button>
                </div>
            </div>

            {/* LIVE SEARCH AND DISCOVERY CONTROL PANEL TAB BAR */}
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                {/* Search Bar Input Frame */}
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 h-10 rounded-xl flex-1 max-w-md focus-within:bg-white focus-within:border-slate-400 focus-within:shadow-xs transition-all duration-150 relative group">
                    <Search size={14} className="text-slate-400 group-focus-within:text-slate-600 transition-colors shrink-0" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search matching business name, region, or contact email..."
                        className="w-full bg-transparent outline-hidden text-xs font-medium text-slate-800 placeholder:text-slate-400 pr-4"
                        disabled={isLoading}
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

                {/* Dynamic Classification Quick-Toggle Filtering Segments */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none select-none">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold pr-3 border-r border-slate-200 mr-1.5 shrink-0">
                        <SlidersHorizontal size={13} className="text-slate-400" />
                        <span>Filters:</span>
                    </div>
                    {dynamicTabsList.map((tab) => {
                        const isCurrentlyActive = selectedType === tab.id;
                        return (
                            <button
                                key={tab.id}
                                disabled={isLoading}
                                onClick={() => setSelectedType(tab.id)}
                                className={`inline-flex items-center gap-2 px-3.5 h-8 text-xs font-semibold rounded-lg border transition-all duration-150 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isCurrentlyActive
                                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50"
                                    }`}
                            >
                                {tab.label}
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono ${isCurrentlyActive
                                    ? "bg-white/20 text-white"
                                    : "bg-slate-100 text-slate-500"
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* DYNAMIC ERROR INFRASTRUCTURE ALERTS */}
            {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
                    <span className="p-1 bg-rose-100 text-rose-700 rounded-md">⚠️</span>
                    <span>Synchronizer Blocked: {errorMessage}</span>
                </div>
            )}

            {/* 4. CONTENT DISPLAY CONTROLLER STATE TREE */}
            {isLoading ? (
                <div className="border border-slate-100 bg-white/60 backdrop-blur-xs rounded-2xl p-16 text-center flex flex-col items-center justify-center min-h-[360px] shadow-xs">
                    <Loader2 className="h-7 w-7 text-slate-800 animate-spin mb-3" />
                    <h3 className="text-xs font-bold text-slate-900 tracking-tight">Syncing Ledger Accounts</h3>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                        Establishing secure handshake protocols with data cluster nodes...
                    </p>
                </div>
            ) : filteredSuppliers.length === 0 ? (
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
                        <SupplierCard key={supplier.id || supplier._id} supplier={supplier} />
                    ))}
                </div>
            )}

        </div>
    );
}