import React, { useState, useEffect } from "react";
import {
    Search, Building2, MapPin, ShieldCheck,
    RefreshCcw, AlertCircle, CheckCircle2
} from "lucide-react";
import { API_ENDPOINTS } from "../../utils/urls";

export default function StepSupplierSelection({ form = {}, setForm }) {
    // ASYNC COMPONENT LOGISTICS LAYOUT STATES
    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [networkError, setNetworkError] = useState(null);

    // Current assigned ID from parent form payload state rules
    const selectedSupplierId = form?.context?.supplierId || null;

    // Fetch suppliers matching the lookup filters from server backend directory
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

                // Defensively target structural variants in backend database payloads
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

        // Execution Debouncer block: prevents endpoint slamming
        const timer = setTimeout(() => {
            fetchServerSuppliers();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Atomic State Transformer to link vendor entity back into the parent configuration matrix
    const handleSelectSupplier = (supplier) => {
        if (!supplier || !supplier._id) return;
        if (typeof setForm !== "function") return;

        const mappedName = supplier.businessIdentity?.businessName || supplier.name || "Unnamed Supplier";

        setForm((prev = {}) => ({
            ...prev,
            context: {
                ...(prev.context || {}),
                supplierId: supplier._id,
                supplierName: mappedName
            },
            // Safely push deeper relational references if down-stream workflows expect them
            supplier: {
                id: supplier._id,
                name: mappedName,
                location: supplier.locationDetails?.country || supplier.location || "Global Framework",
                reliability: supplier.performanceMetrics?.reliabilityScore || supplier.reliability || "Unrated"
            }
        }));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-200">

            {/* SEARCH ANCHOR ENGINE AND STATUS BAR */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 stroke-[2.5]" />
                    <input
                        type="text"
                        placeholder="Filter database by company identity, registry code, or locale..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-sm font-normal bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 shadow-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 justify-end sm:w-auto shrink-0">
                    {isLoading ? (
                        <div className="flex items-center gap-1.5 text-indigo-600">
                            <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                            <span>Querying Server Directory...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Live Database Hook Connected</span>
                        </div>
                    )}
                </div>
            </div>

            {/* SERVER EXCEPTION/ERROR FEEDBACK */}
            {networkError && (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-900 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                        <span className="text-sm font-bold block">Directory Sync Interrupted</span>
                        <p className="text-xs text-rose-600 font-normal mt-0.5">{networkError}</p>
                    </div>
                </div>
            )}

            {/* REAL-TIME SUPPLIER ENTRY INTERACTIVE GRID */}
            {!isLoading && suppliers.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-800">No Enterprise Profiles Discovered</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        We couldn't find matches for "{searchQuery}" verified inside the logistics system register layers.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suppliers.map((vendor) => {
                        if (!vendor || !vendor._id) return null;

                        const isAssigned = vendor._id === selectedSupplierId;
                        const businessName = vendor.businessIdentity?.businessName || vendor.name || "Unnamed Corporate Entity";
                        const businessType = vendor.businessIdentity?.businessType || vendor.type || "Registered Vendor";
                        const countryCode = vendor.locationDetails?.country || vendor.location || "Global Vendor";
                        const operationalScore = vendor.performanceMetrics?.reliabilityScore || vendor.reliability || "A+ Baseline";

                        return (
                            <div
                                key={vendor._id}
                                onClick={() => handleSelectSupplier(vendor)}
                                className={`group border rounded-xl p-4 bg-white shadow-xs cursor-pointer transition-all duration-150 relative overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 ${
                                    isAssigned
                                        ? "border-indigo-600 ring-2 ring-indigo-500/10 bg-indigo-50/5"
                                        : "border-slate-200 hover:border-slate-300"
                                }`}
                            >
                                <div className="space-y-2">
                                    {/* Entity Header Metrics */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                                {businessName}
                                            </h4>
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                                                <Building2 className="w-3 h-3" /> {businessType}
                                            </span>
                                        </div>

                                        {/* Status Tag Checkbox Indicator Overlay */}
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                                            isAssigned
                                                ? "bg-indigo-600 border-indigo-600 text-white"
                                                : "bg-white border-slate-200 group-hover:border-slate-300"
                                        }`}>
                                            {isAssigned && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                                        </div>
                                    </div>

                                    {/* Informational Sub-ledger Row */}
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500 font-normal">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{countryCode}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            <span>Score: <strong className="font-semibold text-slate-800">{operationalScore}</strong></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Highlight Footer Line */}
                                {isAssigned && (
                                    <div className="absolute left-0 bottom-0 top-0 w-1 bg-indigo-600" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* REGULATORY FLOW HINT CAPTION */}
            <p className="text-xs text-slate-400 text-center pt-2">
                Selecting a verified profile automatically loads linked logistics and baseline escrow structures.
            </p>
        </div>
    );
}