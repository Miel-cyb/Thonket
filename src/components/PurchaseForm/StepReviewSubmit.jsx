import React from "react";
import {
    FileText,
    User,
    ShoppingBag,
    Truck,
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
    Clock,
    Zap,
    Warehouse,
    Package,
    MapPin
} from "lucide-react";

export default function StepReviewSubmit({ form }) {
    // 1. UNIFIED STATE UNWRAPPING
    const formData = form?.values || form?.formData || form?.data || form || {};

    const context = formData.context || {};
    const intent = formData.intent || {};
    const supplier = formData.supplier || null;
    const items = formData.items || [];
    const logistics = formData.logistics || formData.shipping || formData.delivery || {};
    const pricing = formData.pricing || {};
    const manufacturer = formData.manufacturer || null;

    // Helper: Safely extract string names from string, number, array, or legacy object structures
    const getWarehouseString = (wh) => {
        if (wh === null || wh === undefined) return null;
        if (typeof wh === "string") {
            const trimmed = wh.trim();
            return trimmed.length > 0 ? trimmed : null;
        }
        if (typeof wh === "number") return String(wh);
        if (Array.isArray(wh)) {
            const list = wh.map((item) => getWarehouseString(item)).flat(Infinity).filter(Boolean);
            return list.length > 0 ? list : null;
        }
        if (typeof wh === "object") {
            const candidate =
                wh.warehouseName ||
                wh.warehouse_name ||
                wh.name ||
                wh.label ||
                wh.title ||
                wh.allocatedWarehouse ||
                wh.allocated_warehouse ||
                wh.assignedWarehouse ||
                wh.assigned_warehouse ||
                wh.targetWarehouse ||
                wh.target_warehouse ||
                wh.destinationWarehouse ||
                wh.destination_warehouse ||
                wh.facility ||
                wh.site ||
                wh.location ||
                wh.value ||
                wh.warehouseCode ||
                wh.code ||
                wh.warehouseId ||
                wh.id ||
                (wh.warehouse ? getWarehouseString(wh.warehouse) : null);

            if (candidate) {
                const resolved = getWarehouseString(candidate);
                if (resolved) return resolved;
            }
        }
        return null;
    };

    // Helper: Extract code from a warehouse object
    const getWarehouseCode = (wh) => {
        if (!wh) return null;
        if (Array.isArray(wh) && wh.length > 0) {
            return getWarehouseCode(wh[0]);
        }
        if (typeof wh === "object") {
            const code = wh.warehouseCode || wh.warehouse_code || wh.code || wh.id || wh.warehouseId;
            if (typeof code === "string" || typeof code === "number") return String(code);
        }
        return null;
    };

    // Helper: Safely extract legacy flat item warehouse
    const getItemWarehouseRaw = (item) => {
        if (!item) return null;
        return (
            item.allocatedWarehouse ||
            item.allocated_warehouse ||
            item.assignedWarehouse ||
            item.assigned_warehouse ||
            item.warehouse ||
            item.warehouseName ||
            item.warehouse_name ||
            item.destinationWarehouse ||
            item.destination_warehouse ||
            item.targetWarehouse ||
            item.target_warehouse ||
            item.facility ||
            item.site ||
            item.location ||
            item.warehouseId ||
            item.warehouse_id ||
            item.warehouseCode ||
            item.warehouse_code
        );
    };

    // Helper: Compute total allocated quantity for a single item
    const getItemAllocatedQty = (item) => {
        if (Array.isArray(item.allocations) && item.allocations.length > 0) {
            return item.allocations.reduce((sum, alloc) => sum + (parseFloat(alloc.qty ?? alloc.quantity) || 0), 0);
        }
        return parseFloat(item.allocatedQty ?? item.qty) || 0;
    };

    // Extract all unique warehouses involved across line items & logistics for global summary
    const globalWarehouseList = (() => {
        const uniqueMap = new Map();

        items.forEach((item) => {
            if (Array.isArray(item.allocations) && item.allocations.length > 0) {
                item.allocations.forEach((alloc) => {
                    const name = getWarehouseString(alloc) || "Unassigned Warehouse";
                    const key = alloc.warehouseId || alloc.id || alloc.warehouseCode || name;
                    if (!uniqueMap.has(key)) {
                        uniqueMap.set(key, {
                            id: alloc.warehouseId || alloc.id,
                            name,
                            code: alloc.warehouseCode || alloc.code,
                            city: alloc.warehouseCity || alloc.city,
                            region: alloc.warehouseRegion || alloc.region
                        });
                    }
                });
            } else {
                const whStr = getWarehouseString(getItemWarehouseRaw(item));
                if (whStr) {
                    const names = Array.isArray(whStr) ? whStr : [whStr];
                    names.forEach((name) => {
                        if (!uniqueMap.has(name)) {
                            uniqueMap.set(name, { name });
                        }
                    });
                }
            }
        });

        if (uniqueMap.size === 0) {
            const rawRoot =
                logistics.allocatedWarehouse ||
                logistics.assignedWarehouse ||
                logistics.warehouses ||
                logistics.warehouse ||
                logistics.destinationWarehouse ||
                logistics.targetWarehouse ||
                logistics.selectedWarehouse ||
                formData.allocatedWarehouse ||
                formData.warehouse;

            const rootWhs = getWarehouseString(rawRoot);
            if (Array.isArray(rootWhs)) {
                rootWhs.forEach((name) => uniqueMap.set(name, { name }));
            } else if (typeof rootWhs === "string" && rootWhs) {
                uniqueMap.set(rootWhs, {
                    name: rootWhs,
                    code: logistics.warehouseCode || getWarehouseCode(rawRoot)
                });
            }
        }

        const list = Array.from(uniqueMap.values());
        return list.length > 0 ? list : [{ name: "Unassigned Warehouse" }];
    })();

    const primaryWarehouseCode =
        logistics.warehouseCode ||
        logistics.warehouse_code ||
        globalWarehouseList.find((w) => w.code)?.code ||
        null;

    const currentCurrency = pricing.currency || "GHS";

    // Global Financial Calculations based on total allocated quantity
    const totalCalculatedCost = items.reduce((sum, item) => {
        const allocatedQty = getItemAllocatedQty(item);
        const unitPrice = parseFloat(item.price) || 0;
        return sum + allocatedQty * unitPrice;
    }, 0);

    const budgetCeiling = parseFloat(pricing.budget) || 0;
    const isOverBudget = budgetCeiling > 0 && totalCalculatedCost > budgetCeiling;

    const getPriorityBadge = (tier) => {
        if (tier === "critical")
            return {
                label: "Critical",
                style: "bg-rose-50 border-rose-200 text-rose-700 font-semibold",
                icon: ShieldAlert
            };
        if (tier === "urgent")
            return {
                label: "Urgent",
                style: "bg-amber-50 border-amber-200 text-amber-700 font-semibold",
                icon: Zap
            };
        return {
            label: "Routine",
            style: "bg-slate-100 border-slate-200 text-slate-700 font-medium",
            icon: Clock
        };
    };

    const priority = getPriorityBadge(intent.priority);
    const PriorityIcon = priority.icon;

    return (
        <div className="space-y-6 max-w-[1660px] mx-auto p-4 tracking-normal antialiased text-slate-900 font-sans">
            {/* AUDIT SUMMARY STATUS BANNER */}
            <div
                className={`p-5 rounded-2xl border flex items-start gap-4 leading-relaxed shadow-sm transition-colors ${
                    isOverBudget
                        ? "bg-rose-50/70 border-rose-200 text-rose-950"
                        : "bg-indigo-50/70 border-indigo-100/80 text-indigo-950"
                }`}
            >
                {isOverBudget ? (
                    <AlertTriangle
                        size={24}
                        className="text-rose-600 shrink-0 mt-0.5 animate-pulse"
                    />
                ) : (
                    <CheckCircle2 size={24} className="text-indigo-600 shrink-0 mt-0.5" />
                )}
                <div>
                    <span className="text-base font-bold tracking-tight block">
                        {isOverBudget
                            ? "Requires Multi-Level Authorization"
                            : "Payload Integrity Verified"}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-normal">
                        {isOverBudget
                            ? "This purchase requisition has breached designated fiscal boundaries and will trigger secondary internal verification loops."
                            : "All mandatory procurement matrix components are correctly compiled. Review the audit ledger before final confirmation dispatch."}
                    </p>
                </div>
            </div>

            {/* TWO-COLUMN MATRIX SUMMARY GRID */}
            <div className="grid grid-cols-12 gap-6 items-stretch">
                {/* LEFT COLUMN: REQUISITION METADATA */}
                <div className="col-span-12 lg:col-span-6 space-y-6">
                    {/* CARD 1: PROFILE CONTEXT */}
                    <div className="border border-slate-200/80 rounded-2xl bg-white p-6 shadow-xs space-y-5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <FileText size={15} className="text-slate-400" /> Profile Context
                        </span>
                        <div>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                Purchase Order Title
                            </p>
                            <p className="text-lg font-bold text-slate-900 mt-1 tracking-tight leading-snug">
                                {context.title || "Untitled Requisition"}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-1">
                            <div>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                    Strategy Type
                                </p>
                                <span className="inline-block text-xs font-semibold text-slate-700 bg-slate-100/80 border border-slate-200/60 px-3 py-1.5 rounded-lg mt-1.5">
                                    {context.type || "Not Specified"}
                                </span>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                    Urgency Tier
                                </p>
                                <span
                                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg mt-1.5 border ${priority.style}`}
                                >
                                    <PriorityIcon size={14} />
                                    {priority.label}
                                </span>
                            </div>
                        </div>
                        {intent.description && (
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                                    Business Justification
                                </p>
                                <p className="text-xs sm:text-sm text-slate-600 font-medium italic leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                                    "{intent.description}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* CARD 2: VENDOR ENTITY */}
                    <div className="border border-slate-200/80 rounded-2xl bg-white p-6 shadow-xs space-y-5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <User size={15} className="text-slate-400" /> Vendor Entity
                        </span>
                        {supplier ? (
                            <div className="flex justify-between items-center gap-4">
                                <div className="min-w-0">
                                    <p className="text-base font-bold text-slate-900 truncate tracking-tight">
                                        {supplier.name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                                        {supplier.location} • Reliability Index:{" "}
                                        <span className="font-semibold text-slate-700">
                                            {supplier.reliability || "N/A"}
                                        </span>
                                    </p>
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-white px-3.5 py-1.5 rounded-lg shrink-0 shadow-xs">
                                    Approved
                                </span>
                            </div>
                        ) : (
                            <p className="text-xs sm:text-sm text-rose-700 bg-rose-50/80 border border-rose-200/80 p-3.5 rounded-xl font-semibold flex items-center gap-2">
                                ⚠️ Critical Warning: No vendor assigned to this execution cycle.
                            </p>
                        )}

                        {manufacturer?.name && (
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                    Original Equipment Manufacturer (OEM)
                                </p>
                                <p className="text-sm font-semibold text-slate-800 mt-1">
                                    {manufacturer.name}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* CARD 3: LOGISTICS & WAREHOUSE ALLOCATION */}
                    <div className="border border-slate-200/80 rounded-2xl bg-white p-6 shadow-xs space-y-5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <Truck size={15} className="text-slate-400" /> Logistics & Warehouse Allocation
                        </span>

                        <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="p-2 bg-indigo-100/80 border border-indigo-200/80 rounded-lg text-indigo-700 shrink-0">
                                        <Warehouse size={16} />
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider truncate">
                                        {globalWarehouseList.length > 1
                                            ? `Assigned Warehouses (${globalWarehouseList.length})`
                                            : "Primary Target Warehouse"}
                                    </p>
                                </div>
                                {primaryWarehouseCode && (
                                    <span className="text-[11px] font-mono font-bold bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded shrink-0">
                                        {primaryWarehouseCode}
                                    </span>
                                )}
                            </div>

                            {/* Enhanced Global Warehouse Badges */}
                            <div className="flex flex-wrap gap-2 pt-1">
                                {globalWarehouseList.map((wh, index) => (
                                    <div
                                        key={wh.id || index}
                                        className="flex items-center gap-2 bg-white border border-indigo-200/70 shadow-2xs px-3 py-1.5 rounded-lg text-slate-900 max-w-full min-w-0"
                                    >
                                        <MapPin size={13} className="text-indigo-600 shrink-0" />
                                        <span className="text-xs font-bold text-slate-800 truncate" title={wh.name}>
                                            {wh.name}
                                        </span>
                                        {wh.code && (
                                            <span className="text-[11px] font-mono text-slate-500 font-normal shrink-0">
                                                ({wh.code})
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                    Routing Framework
                                </p>
                                <p className="text-sm font-bold text-slate-800 capitalize mt-1">
                                    {logistics.deliveryType || "Unassigned"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                    Target Date
                                </p>
                                <p className="text-sm font-bold text-slate-800 mt-1">
                                    {logistics.date || "Immediate Release"}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                Discharge Destination
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1 leading-relaxed">
                                {logistics.location || "No Address Saved"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: ITEM MATRIX & FINANCIAL AUDIT */}
                <div className="col-span-12 lg:col-span-6 flex flex-col h-full">
                    <div className="border border-slate-200/80 rounded-2xl bg-white shadow-xs overflow-hidden flex flex-col h-full justify-between">
                        <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                <ShoppingBag size={15} className="text-slate-500" /> Itemization & Allocation Matrix ({items.length})
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                                Pre-tax Valuations
                            </span>
                        </div>

                        <div className="divide-y divide-slate-100 max-h-[640px] min-h-[320px] overflow-y-auto px-6 bg-white flex-1">
                            {items.length > 0 ? (
                                items.map((item, idx) => {
                                    const requestedQty = parseFloat(item.qty) || 0;
                                    const hasAllocationsArray =
                                        Array.isArray(item.allocations) && item.allocations.length > 0;
                                    const totalAllocatedQty = getItemAllocatedQty(item);

                                    const unitPrice = parseFloat(item.price) || 0;
                                    const itemTotal = totalAllocatedQty * unitPrice;

                                    return (
                                        <div key={item.id || item.sku || idx} className="py-5 space-y-3.5">
                                            {/* Item Header & Price */}
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-base tracking-tight text-slate-900 break-words leading-snug">
                                                        {item.desc || item.name || item.title || "Unspecified Item"}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 mt-1.5">
                                                        <span className="font-semibold text-slate-600">SKU: {item.sku || "N/A"}</span>
                                                        <span>•</span>
                                                        <span>Req: {requestedQty} {item.uom || "units"}</span>
                                                        {unitPrice > 0 && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="text-slate-700 font-semibold tabular-nums">
                                                                    {currentCurrency} {unitPrice.toFixed(2)} / {item.uom || "unit"}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right font-mono font-bold text-base text-slate-900 shrink-0 pl-2 tabular-nums">
                                                    {currentCurrency} {itemTotal.toFixed(2)}
                                                </div>
                                            </div>

                                            {/* Summary Badge Row */}
                                            <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                                                <div className="flex items-center gap-2 flex-wrap min-w-0">
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50/80 border border-indigo-100/80 text-indigo-700">
                                                        <Package size={13} />
                                                        Total Allocated: {totalAllocatedQty} {item.uom || "units"}
                                                        {requestedQty > 0 && requestedQty !== totalAllocatedQty && (
                                                            <span className="text-indigo-400 font-normal ml-0.5">
                                                                (Req: {requestedQty})
                                                            </span>
                                                        )}
                                                    </span>

                                                    {/* Legacy Single-Warehouse fallback badge if allocations[] is missing */}
                                                    {!hasAllocationsArray && (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100/80 border border-slate-200/60 text-slate-700 max-w-[280px] truncate">
                                                            <Warehouse size={13} className="text-slate-500 shrink-0" />
                                                            <span className="truncate">
                                                                {getWarehouseString(getItemWarehouseRaw(item)) ||
                                                                    globalWarehouseList[0]?.name ||
                                                                    "Unassigned"}
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>

                                                {requestedQty > totalAllocatedQty && (
                                                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shrink-0">
                                                        Partial Allocation
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stacked Warehouse Distribution Breakdown */}
                                            {hasAllocationsArray && (
                                                <div className="mt-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 space-y-2.5">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                                        <Warehouse size={13} className="text-slate-400" /> Warehouse Distribution
                                                    </p>

                                                    <div className="space-y-2">
                                                        {item.allocations.map((alloc, aIdx) => {
                                                            const whName =
                                                                getWarehouseString(alloc) || "Unassigned Warehouse";
                                                            const code = alloc.warehouseCode || alloc.code;
                                                            const qty = alloc.qty ?? alloc.quantity ?? 0;

                                                            const locationParts = [
                                                                alloc.warehouseCity || alloc.city,
                                                                alloc.warehouseRegion || alloc.region
                                                            ].filter(Boolean);

                                                            return (
                                                                <div
                                                                    key={alloc.warehouseId || alloc.id || aIdx}
                                                                    className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0"
                                                                >
                                                                    <div className="min-w-0 flex-1 space-y-1">
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <span className="text-xs font-bold text-slate-800">
                                                                                {whName}
                                                                            </span>
                                                                            {code && (
                                                                                <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                                                                                    {code}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {locationParts.length > 0 && (
                                                                            <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                                                                                <MapPin size={11} className="text-slate-400 shrink-0" />
                                                                                <span>{locationParts.join(", ")}</span>
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex items-center gap-1.5 shrink-0 bg-indigo-50/70 border border-indigo-100/80 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                                                                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                                                            Allocated:
                                                                        </span>
                                                                        <span className="text-xs font-bold font-mono text-indigo-700">
                                                                            {qty} {item.uom || "units"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-12 text-center text-slate-400 space-y-2">
                                    <Package size={32} className="mx-auto opacity-50" />
                                    <p className="text-xs font-semibold uppercase tracking-wider">No Items Added</p>
                                </div>
                            )}
                        </div>

                        {/* FINANCIAL AUDIT BREAKDOWN FOOTER */}
                        <div className="p-5 bg-slate-50/90 border-t border-slate-200/80 space-y-2.5">
                            <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
                                <span>Budget Ceiling</span>
                                <span className="font-mono tabular-nums font-semibold text-slate-800">
                                    {budgetCeiling > 0
                                        ? `${currentCurrency} ${budgetCeiling.toFixed(2)}`
                                        : "Unconstrained"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-2 border-t border-slate-200/60">
                                <span>Total Estimated Cost</span>
                                <span className="font-mono tabular-nums text-base text-indigo-700">
                                    {currentCurrency} {totalCalculatedCost.toFixed(2)}
                                </span>
                            </div>
                            {isOverBudget && (
                                <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg flex items-center gap-1.5 mt-2">
                                    <AlertTriangle size={13} className="shrink-0" />
                                    <span>
                                        Exceeds approved budget ceiling by {currentCurrency}{" "}
                                        {(totalCalculatedCost - budgetCeiling).toFixed(2)}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}