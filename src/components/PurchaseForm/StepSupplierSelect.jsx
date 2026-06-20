import React, { useState, useEffect, useMemo } from "react";
import {
    Search,
    Building2,
    MapPin,
    ShieldCheck,
    RefreshCcw,
    AlertCircle,
    CheckCircle2,
    SlidersHorizontal,
    Tag
} from "lucide-react";
import { API_ENDPOINTS } from "../../utils/urls";

export default function StepSupplierSelection({ form = {}, setForm }) {
    // ASYNC COMPONENT LOGISTICS LAYOUT STATES
    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const [networkError, setNetworkError] = useState(null);

    // Wholesale Data Mapping Constraint: Every Order Context maps structurally back to a Fulfilling Supplier
    const selectedSupplierId = form?.orderContext?.supplierId || form?.context?.supplierId || null;

    // 1. DATA EXTRACTION LAYER WITH DEBOUNCED SYNC HOOK
    useEffect(() => {
        const fetchServerSuppliers = async () => {
            setIsLoading(true);
            setNetworkError(null);
            try {
                const url = searchQuery
                    ? `${API_ENDPOINTS.SUPPLIERS}?search=${encodeURIComponent(searchQuery)}`
                    : API_ENDPOINTS.SUPPLIERS;

                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP Directory Error! Status: ${res.status}`);

                const data = await res.json();

                // Target structural variants in backend database payloads defensively
                let parsedSuppliers = [];
                if (Array.isArray(data)) {
                    parsedSuppliers = data;
                } else if (data && Array.isArray(data.suppliers)) {
                    parsedSuppliers = data.suppliers;
                } else if (data && typeof data === "object") {
                    parsedSuppliers = data.data || [];
                }

                setSuppliers(parsedSuppliers);
            } catch (err) {
                console.error("Failed to sync operational directory database index:", err);
                setNetworkError(err.message || "Failed to establish synchronization hook with directory endpoint.");
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchServerSuppliers();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 2. DYNAMIC TAB MATRIX GENERATION (With normalization & counter calculation)
    const dynamicTabsList = useMemo(() => {
        const distributionMap = { all: suppliers.length };

        suppliers.forEach((vendor) => {
            const categories = vendor.supplyCapability?.productCategories;
            if (Array.isArray(categories)) {
                categories.forEach((cat) => {
                    if (cat && cat.trim() !== "" && cat.toLowerCase() !== "select") {
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
                    label: key,
                    count: distributionMap[key]
                });
            }
        });

        return tabs;
    }, [suppliers]);

    // 3. MULTI-LAYER CLIENT SIDE FILTER MATRIX INTERPOLATION
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((vendor) => {
            const identity = vendor.businessIdentity || {};
            const location = vendor.locationDetails || {};
            const capabilities = vendor.supplyCapability || {};

            const bizName = identity.businessName || vendor.name || "";
            const bizRegion = location.cityRegion || "";
            const bizCountry = location.country || "";
            const regNumber = vendor.legalVerification?.registrationNumber || "";

            // Normalize search constraints
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch =
                bizName.toLowerCase().includes(query) ||
                bizRegion.toLowerCase().includes(query) ||
                bizCountry.toLowerCase().includes(query) ||
                regNumber.toLowerCase().includes(query);

            // Normalize category constraints 
            const productCategories = Array.isArray(capabilities.productCategories)
                ? capabilities.productCategories.map(c => c.toLowerCase().trim())
                : [];

            const matchesCategory =
                selectedCategory === "all" ||
                productCategories.includes(selectedCategory.toLowerCase().trim());

            return matchesSearch && matchesCategory;
        });
    }, [suppliers, searchQuery, selectedCategory]);

    // Atomic State Transformer mapping order/purchase pipelines explicitly to a wholesale fulfilling supplier
    const handleSelectSupplier = (supplier) => {
        if (!supplier || !supplier._id) return;
        if (typeof setForm !== "function") return;

        const mappedName = supplier.businessIdentity?.businessName || supplier.name || "Unnamed Supplier";

        setForm((prev = {}) => ({
            ...prev,
            // Enforces clean wholesale isolation context layout rules
            orderContext: {
                ...(prev.orderContext || prev.context || {}),
                supplierId: supplier._id,
                supplierName: mappedName,
            },
            // Comprehensive vendor object definition layer 
            supplier: {
                id: supplier._id,
                name: mappedName,
                location: `${supplier.locationDetails?.cityRegion || ""}, ${supplier.locationDetails?.country || ""}`.trim() || "Global Framework",
                businessType: supplier.businessIdentity?.businessType || "Vendor",
                riskLevel: supplier.complianceRisk?.riskLevel || "unknown"
            }
        }));
    };

    // Helper utilities for conditional color styles
    const getRiskBadgeStyles = (level) => {
        switch (level?.toLowerCase()) {
            case "low": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "medium": return "bg-amber-50 text-amber-700 border-amber-200";
            case "high": return "bg-rose-50 text-rose-700 border-rose-200";
            default: return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };

    // Extract simple initials for custom graphic avatars
    const getInitials = (name) => {
        if (!name) return "CO";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-200">

            {/* SEARCH ANCHOR ENGINE AND STATUS BAR */}
            <div className="flex flex-col gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 stroke-[2.5]" />
                        <input
                            type="text"
                            placeholder="Filter database by company identity, registry code, or locale..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-slate-400 justify-end sm:w-auto shrink-0 uppercase">
                        {isLoading ? (
                            <div className="flex items-center gap-1.5 text-indigo-600">
                                <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                                <span>Querying Directory...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Live Database Bound</span>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* CATEGORY FILTER MATRIX CONTROL SECTION */}
                <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm font-bold">
                        <SlidersHorizontal size={14} className="text-indigo-500" />
                        <span>Filter Registry by Capability Category</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {dynamicTabsList.map((tab) => {
                            const isCurrentlyActive = selectedCategory === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedCategory(tab.id)}
                                    className={`inline-flex items-center gap-2 px-3.5 h-9 text-xs font-bold rounded-lg border transition-all cursor-pointer ${isCurrentlyActive
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                    align>
                                    <span>{tab.label}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono ${isCurrentlyActive ? "bg-white/20 text-white" : "bg-white text-slate-400 border border-slate-200/60"
                                        }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* SERVER EXCEPTION/ERROR FEEDBACK */}
            {networkError && (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-900 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                        <span className="text-base font-bold block">Directory Sync Interrupted</span>
                        <p className="text-sm text-rose-600 font-normal mt-0.5">{networkError}</p>
                    </div>
                </div>
            )}

            {/* REAL-TIME SUPPLIER ENTRY INTERACTIVE GRID */}
            {!isLoading && filteredSuppliers.length === 0 ? (
                <div className="border border-dashed border-slate-200 bg-white rounded-2xl p-12 text-center max-w-xl mx-auto shadow-xs">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-800">No Enterprise Profiles Discovered</h3>
                    <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                        We couldn't find matches for "{searchQuery}" under the current category parameters.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSuppliers.map((vendor) => {
                        if (!vendor || !vendor._id) return null;

                        const isAssigned = vendor._id === selectedSupplierId;
                        const businessName = vendor.businessIdentity?.businessName || vendor.name || "Unnamed Corporate Entity";
                        const businessType = vendor.businessIdentity?.businessType || vendor.type || "Registered Vendor";
                        const cityRegion = vendor.locationDetails?.cityRegion || "";
                        const countryCode = vendor.locationDetails?.country || vendor.location || "Global Framework";
                        const riskRating = vendor.complianceRisk?.riskLevel || "low";
                        const categoriesArr = vendor.supplyCapability?.productCategories || [];

                        return (
                            <div
                                key={vendor._id}
                                onClick={() => handleSelectSupplier(vendor)}
                                className={`group border rounded-xl p-5 bg-white shadow-xs cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 ${isAssigned
                                    ? "border-indigo-600 ring-1 ring-indigo-600/20 bg-linear-to-b from-indigo-50/20 to-white"
                                    : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <div className="space-y-4">
                                    {/* Business Card Info Row */}
                                    <div className="flex items-start gap-3.5">
                                        {/* Stylized Branding/Avatar Block */}
                                        <div className={`w-11 h-11 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs tracking-wider transition-colors border ${isAssigned
                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                            : "bg-linear-to-br from-slate-50 to-slate-100/50 border-slate-200 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100"}`}
                                        >
                                            {getInitials(businessName)}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                                    {businessName}
                                                </h4>
                                                {/* Select Status Checklist Ring */}
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${isAssigned
                                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                                                    : "bg-slate-50 border-slate-200 group-hover:border-slate-300"
                                                    }`}>
                                                    {isAssigned && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                                                <Building2 className="w-3 h-3" /> {businessType}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Component Categorization Badges Row */}
                                    {categoriesArr.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {categoriesArr.map((cat, idx) => (
                                                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100/80 border border-slate-200/50 text-slate-600 text-sm font-semibold">
                                                    <Tag size={11} className="text-slate-400" />
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Informational Sub-ledger Row */}
                                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-sm text-slate-500 font-medium">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{cityRegion ? `${cityRegion}, ${countryCode}` : countryCode}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm border text-[10px] uppercase font-bold tracking-wide ${getRiskBadgeStyles(riskRating)}`}>
                                                {riskRating} risk
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Highlight Footer Indicator Line */}
                                {isAssigned && (
                                    <div className="absolute left-0 bottom-0 top-0 w-1 bg-indigo-600" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* REGULATORY FLOW HINT CAPTION */}
            <p className="text-sm text-slate-400 text-center pt-2">
                Selecting a verified profile automatically links wholesale logistics and baseline fulfillment structures to this purchase order.
            </p>
        </div>
    );
}