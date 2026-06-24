import React from "react";
import { Warehouse, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function StepWarehouseAllocation({ form, setForm }) {
    // 1. WAREHOUSE MASTER LIST DEFINITION
    const warehouses = [
        { id: "wh-accra", name: "Accra Central Hub", region: "Greater Accra" },
        { id: "wh-kumasi", name: "Kumasi Fulfillment Center", region: "Ashanti" },
        { id: "wh-takoradi", name: "Takoradi Port Depot", region: "Western" },
        { id: "wh-tamale", name: "Tamale Distribution Point", region: "Northern" }
    ];

    const items = form?.items || [];
    const allocations = form?.allocations || {};

    // 2. STABLE REAL-TIME MATRIX CALCULATOR
    const getItemAllocationStats = (item) => {
        const itemAlloc = allocations[item.id] || {};

        // Compute total currently allocated across fields
        const totalAllocated = warehouses.reduce((sum, wh) => {
            return sum + (parseInt(itemAlloc[wh.id]) || 0);
        }, 0);

        const targetQty = parseInt(item.qty) || 0;
        const remainder = targetQty - totalAllocated;

        return {
            totalAllocated,
            targetQty,
            remainder,
            isValid: remainder === 0
        };
    };

    // 3. HANDLER FOR INDIVIDUAL INPUT CHANGES
    const handleAllocationChange = (itemId, warehouseId, val) => {
        const parsedVal = val === "" ? "" : Math.max(0, parseInt(val) || 0);

        setForm((prev) => ({
            ...prev,
            allocations: {
                ...prev.allocations,
                [itemId]: {
                    ...(prev.allocations[itemId] || {}),
                    [warehouseId]: parsedVal
                }
            }
        }));
    };

    // 4. AUTO-BALANCE RESET: FLUSH ENTIRE RUNTIME QUANTITY BACK TO THE PRIMARY HUB
    const resetToDefaultHub = (item) => {
        setForm((prev) => ({
            ...prev,
            allocations: {
                ...prev.allocations,
                [item.id]: {
                    "wh-accra": parseInt(item.qty) || 0,
                    "wh-kumasi": 0,
                    "wh-takoradi": 0,
                    "wh-tamale": 0
                }
            }
        }));
    };

    return (
        <div className="space-y-6 max-w-[1660px] mx-auto p-1">

            {/* CONTEXT INSTRUCTIONAL HEADER */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-5 flex gap-4 items-start">
                <Warehouse className="text-indigo-600 shrink-0 mt-0.5" size={24} />
                <div>
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Logistical Downstream Allocation</h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                        Distribute commercial line item quantities across your physical storage assets.
                        The sum allocated per item row <strong className="text-slate-900 font-bold">must balance perfectly</strong> with the total purchased pool before you can commit this transaction ledger.
                    </p>
                </div>
            </div>

            {/* MAIN DATA LOOP WRAPPER */}
            <div className="space-y-6">
                {items.length > 0 ? (
                    items.map((item) => {
                        const stats = getItemAllocationStats(item);

                        return (
                            <div
                                key={item.id}
                                className={`border rounded-xl bg-white shadow-3xs transition-all duration-150 overflow-hidden ${stats.isValid ? "border-slate-300" : "border-amber-400 ring-2 ring-amber-400/20"
                                    }`}
                            >
                                {/* ITEM ROW SUB-HEADER BANNER */}
                                <div className="bg-slate-100 border-b border-slate-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <span className="text-xs font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded uppercase tracking-wide border border-slate-300">
                                            {item.sku || "NO-SKU"}
                                        </span>
                                        <h4 className="text-base font-bold text-slate-900 truncate mt-2">{item.desc || "Unspecified Asset Line"}</h4>
                                    </div>

                                    {/* LIVE POOL METRICS */}
                                    <div className="flex items-center gap-5 text-sm font-semibold shrink-0">
                                        <div className="text-right">
                                            <span className="text-slate-600 block text-xs uppercase tracking-wider font-bold">Purchased</span>
                                            <span className="font-mono font-bold text-slate-900 text-base">{stats.targetQty} units</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-slate-600 block text-xs uppercase tracking-wider font-bold">Allocated</span>
                                            <span className={`font-mono font-bold text-base ${stats.isValid ? "text-emerald-700" : "text-amber-700"}`}>
                                                {stats.totalAllocated}
                                            </span>
                                        </div>

                                        {/* CONDITIONAL VALIDATION BADGES */}
                                        {stats.isValid ? (
                                            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold">
                                                <CheckCircle2 size={14} className="stroke-[2.5]" /> Balanced
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => resetToDefaultHub(item)}
                                                className="inline-flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-all group shadow-sm"
                                                title="Reset all units to Accra Hub"
                                            >
                                                <AlertCircle size={14} className="text-amber-700 shrink-0" />
                                                <span>{stats.remainder > 0 ? `${stats.remainder} Left` : `${Math.abs(stats.remainder)} Over`}</span>
                                                <RefreshCw size={12} className="ml-1 text-amber-600 group-hover:rotate-180 transition-transform duration-300" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* FOUR WAREHOUSE INPUT COMPARTMENT GRID */}
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white">
                                    {warehouses.map((wh) => {
                                        const currentVal = allocations[item.id]?.[wh.id] ?? "";

                                        return (
                                            <div
                                                key={wh.id}
                                                className="p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors flex flex-col justify-between gap-3 shadow-2xs"
                                            >
                                                <div>
                                                    <label
                                                        htmlFor={`alloc-${item.id}-${wh.id}`}
                                                        className="text-sm font-bold text-slate-900 tracking-tight block truncate"
                                                    >
                                                        {wh.name}
                                                    </label>
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                                                        {wh.region} Region
                                                    </span>
                                                </div>

                                                <div className="relative mt-1">
                                                    <input
                                                        id={`alloc-${item.id}-${wh.id}`}
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        value={currentVal}
                                                        onChange={(e) => handleAllocationChange(item.id, wh.id, e.target.value)}
                                                        className="w-full bg-white border-2 border-slate-300 rounded-lg py-2 pl-3 pr-14 font-mono font-bold text-base text-slate-900 text-left placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider text-slate-500 pointer-events-none select-none">
                                                        Units
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    /* EMPTY STATE FALLBACK SCREEN */
                    <div className="text-center py-20 border-2 border-dashed border-slate-300 rounded-2xl bg-white">
                        <Warehouse className="mx-auto text-slate-400 mb-4" size={44} />
                        <p className="text-base text-slate-700 font-bold">No assets mapped within the line-item inventory stream.</p>
                        <p className="text-sm text-slate-500 mt-1.5">Please navigate backward to Stage 4 to define your item quantities.</p>
                    </div>
                )}
            </div>
        </div>
    );
}