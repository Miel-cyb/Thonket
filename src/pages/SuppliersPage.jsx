import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    SlidersHorizontal,
    Building2,
    X,
    Loader2,
    ArrowLeft // <-- Imported ArrowLeft for the back button actions
} from "lucide-react";
import SupplierCard from "../components/Suppliers/SupplierCard";
import { API_ENDPOINTS } from "../utils/urls";

/// SupplierList
// A dynamic directory interface for browsing, searching, and filtering registered supplier profiles via their product categories.
export default function SupplierList() {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Helper to format category labels clearly
    const formatTabLabel = (categoryString) => {
        if (!categoryString) return "";
        return categoryString
            .trim()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
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
                        const standardizedPayload = Array.isArray(data.data)
                            ? data.data
                            : (Array.isArray(data) ? data : []);

                        setSuppliers(standardizedPayload);
                    } else {
                        throw new Error(data.message || "Failed to successfully aggregate database profiles.");
                    }
                } else {
                    const fallbackHtmlError = await response.text();
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

    // 2. DYNAMIC CONTEXTUAL CATEGORY TOTAL COUNT AGGREGATES & TAB MATRIX GENERATION
    const dynamicTabsList = useMemo(() => {
        const distributionMap = { all: suppliers.length };

        suppliers.forEach((item) => {
            const categories = item.supplyCapability?.productCategories;

            if (Array.isArray(categories)) {
                categories.forEach((cat) => {
                    if (cat) {
                        const normalizedKey = cat.trim();
                        distributionMap[normalizedKey] = (distributionMap[normalizedKey] || 0) + 1;
                    }
                });
            }
        });

        const tabs = [
            { id: "all", label: "All Categories", count: distributionMap.all }
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

    // 3. REAL-TIME SEARCH PARSING AND CATEGORY MATRIX FILTER
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((supplier) => {
            const bizIdentity = supplier.businessIdentity || {};
            const contactInfo = supplier.contactInformation || {};
            const locationInfo = supplier.locationDetails || {};
            const supplyCap = supplier.supplyCapability || {};

            const bizName = bizIdentity.businessName || supplier.businessName || "";
            const bizEmail = contactInfo.emailAddress || supplier.email || "";
            const bizLoc = locationInfo.cityRegion || supplier.location || "";

            const productCategories = Array.isArray(supplyCap.productCategories)
                ? supplyCap.productCategories.map(c => c.toLowerCase().trim())
                : [];

            const query = searchQuery.toLowerCase();

            const matchesSearch =
                bizName.toLowerCase().includes(query) ||
                bizEmail.toLowerCase().includes(query) ||
                bizLoc.toLowerCase().includes(query);

            const matchesCategory =
                selectedCategory === "all" ||
                productCategories.includes(selectedCategory.toLowerCase().trim());

            return matchesSearch && matchesCategory;
        });
    }, [suppliers, searchQuery, selectedCategory]);

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-6 p-4 md:p-6 antialiased selection:bg-blue-50">

            {/* TOP DASHBOARD CONTROL ACTION HERO BLOCK */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs transition-all duration-200 hover:border-slate-300/90">
                <div className="flex items-start gap-4">
                    {/* Dynamic Action Back Button Placement */}
                    <button
                        onClick={() => navigate(-1)} // <-- Built-in router fallback step back logic
                        className="p-2.5 mt-0.5 text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all duration-150 cursor-pointer shadow-2xs hover:bg-slate-100 flex items-center justify-center shrink-0 group"
                        title="Go Back"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    </button>

                    <div className="space-y-1 min-w-0">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                            <div className="p-1.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 shadow-2xs">
                                <Building2 className="h-4 w-4" />
                            </div>
                            Supplier Core Ledger
                        </h2>
                        <p className="text-xs font-medium text-slate-500 max-w-xl leading-relaxed">
                            Monitor, filter, audit, and provision centralized corporate enterprise supplier profile accounts synced via your database system.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 sm:self-center pl-14 sm:pl-0">
                    <button
                        onClick={() => navigate("/supplier-onboarding")}
                        className="inline-flex items-center justify-center gap-2 px-4 h-10 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                    >
                        <Plus size={14} strokeWidth={2.5} />
                        Onboard Vendor
                    </button>
                </div>
            </div>

            {/* ENHANCED LIVE SEARCH AND DISCOVERY CONTROL PANEL */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-5">

                {/* Row 1: Search Inputs Layout */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 h-11 rounded-xl flex-1 max-w-xl focus-within:bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/5 focus-within:shadow-xs transition-all duration-150 relative group">
                        <Search size={15} className="text-slate-400 group-focus-within:text-blue-500 transition-colors shrink-0" />
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
                                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-md transition-all cursor-pointer"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* Active Count Metric Label */}
                    <div className="text-right text-[11px] font-semibold text-slate-400 px-1 shrink-0 hidden md:block">
                        Showing <span className="text-blue-600 font-bold">{filteredSuppliers.length}</span> of {suppliers.length} Entries
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Row 2: Category Wrap Matrix Layout */}
                <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                        <SlidersHorizontal size={13} className="text-blue-500" />
                        <span>Filter Matrix by Categories</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {dynamicTabsList.map((tab) => {
                            const isCurrentlyActive = selectedCategory === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    disabled={isLoading}
                                    onClick={() => setSelectedCategory(tab.id)}
                                    className={`inline-flex items-center gap-2.5 px-3.5 h-9 text-xs font-semibold rounded-xl border transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isCurrentlyActive
                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10"
                                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300"
                                        }`}
                                >
                                    <span>{tab.label}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono transition-colors ${isCurrentlyActive
                                        ? "bg-white/20 text-white"
                                        : "bg-white text-slate-500 border border-slate-200/60"
                                        }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* DYNAMIC ERROR INFRASTRUCTURE ALERTS */}
            {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
                    <span className="p-1 bg-rose-100 text-rose-700 rounded-md">⚠️</span>
                    <span>Synchronizer Blocked: {errorMessage}</span>
                </div>
            )}

            {/* CONTENT DISPLAY CONTROLLER STATE TREE */}
            {isLoading ? (
                <div className="border border-slate-100 bg-white/60 backdrop-blur-xs rounded-2xl p-16 text-center flex flex-col items-center justify-center min-h-[360px] shadow-xs">
                    <Loader2 className="h-7 w-7 text-blue-600 animate-spin mb-3" />
                    <h3 className="text-xs font-bold text-slate-900 tracking-tight">Syncing Ledger Accounts</h3>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                        Establishing secure handshake protocols with data cluster nodes...
                    </p>
                </div>
            ) : filteredSuppliers.length === 0 ? (
                <div className="border border-dashed border-slate-200 bg-white rounded-2xl p-12 md:p-16 text-center flex flex-col items-center justify-center min-h-[340px] shadow-xs">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-500 flex items-center justify-center mb-4 shadow-2xs">
                        <Building2 size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">No Profiles Isolated</h3>
                    <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                        We couldn't find any registered suppliers matching those category parameters. Reset your filters or initialize new profiles.
                    </p>
                    <div className="mt-5">
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 shadow-2xs transition-all cursor-pointer hover:border-slate-300"
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