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
    // 1. UNIFIED STATE UNWRAPPING (Handles direct state, Formik, or React Hook Form wrappers)
    const formData = form?.values || form?.formData || form?.data || form || {};

    const context = formData.context || {};
    const intent = formData.intent || {};
    const supplier = formData.supplier || null;
    const items = formData.items || [];
    const logistics = formData.logistics || formData.shipping || formData.delivery || {};
    const payment = formData.payment || {};
    const pricing = formData.pricing || {};
    const manufacturer = formData.manufacturer || null;

    // Recursive helper to safely extract string names from string, number, array, or object structures
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
                wh.name ||
                wh.label ||
                wh.title ||
                wh.allocatedWarehouse ||
                wh.allocated_warehouse ||
                wh.allocatedWarehouses ||
                wh.allocated_warehouses ||
                wh.warehouseName ||
                wh.warehouse_name ||
                wh.targetWarehouse ||
                wh.target_warehouse ||
                wh.destinationWarehouse ||
                wh.destination_warehouse ||
                wh.assignedWarehouse ||
                wh.assigned_warehouse ||
                wh.facility ||
                wh.site ||
                wh.location ||
                wh.value ||
                wh.code ||
                wh.warehouseCode ||
                wh.warehouse_code ||
                wh.id ||
                (wh.warehouse ? getWarehouseString(wh.warehouse) : null);

            if (candidate) {
                const resolved = getWarehouseString(candidate);
                if (resolved) return resolved;
            }
        }
        return null;
    };

    // Extract warehouse code/ID safely
    const getWarehouseCode = (wh) => {
        if (!wh) return null;
        if (Array.isArray(wh) && wh.length > 0) {
            return getWarehouseCode(wh[0]);
        }
        if (typeof wh === "object") {
            const code = wh.code || wh.warehouseCode || wh.warehouse_code || wh.id;
            if (typeof code === "string" || typeof code === "number") return String(code);
        }
        return null;
    };

    // Deep search across logistics and root form objects for allocated/target warehouse data
    const rawWarehouse =
        logistics.allocatedWarehouse ||
        logistics.allocated_warehouse ||
        logistics.allocatedWarehouses ||
        logistics.allocated_warehouses ||
        logistics.assignedWarehouse ||
        logistics.assigned_warehouse ||
        logistics.warehouses ||
        logistics.selectedWarehouses ||
        logistics.warehouse ||
        logistics.destinationWarehouse ||
        logistics.destination_warehouse ||
        logistics.warehouseName ||
        logistics.warehouse_name ||
        logistics.targetWarehouse ||
        logistics.target_warehouse ||
        logistics.selectedWarehouse ||
        logistics.facility ||
        logistics.site ||
        logistics.warehouse_id ||
        logistics.warehouseId ||
        formData.allocatedWarehouse ||
        formData.allocated_warehouse ||
        formData.allocatedWarehouses ||
        formData.allocated_warehouses ||
        formData.assignedWarehouse ||
        formData.assigned_warehouse ||
        formData.warehouses ||
        formData.selectedWarehouses ||
        formData.warehouse ||
        formData.selectedWarehouse ||
        formData.warehouseName ||
        formData.warehouse_name ||
        formData.warehouseId ||
        formData.warehouse_id;

    // Helper for extracting warehouse string from line item using all known keys
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

    // Parse extracted warehouses into a normalized array of display strings
    const parsedWarehouses = (() => {
        const result = getWarehouseString(rawWarehouse);
        let list = [];
        if (Array.isArray(result)) list = result;
        else if (typeof result === "string" && result) list = [result];

        if (list.length === 0) {
            // Aggregate unique warehouses from line items if no root warehouse is present
            const itemWhs = items
                .map((i) => getWarehouseString(getItemWarehouseRaw(i)))
                .flat(Infinity)
                .filter((val) => typeof val === "string" && val.length > 0);

            const uniqueItemWhs = Array.from(new Set(itemWhs));
            if (uniqueItemWhs.length > 0) list = uniqueItemWhs;
        }

        return list.length > 0 ? list : ["Unassigned Warehouse"];
    })();

    const warehouseCode =
        logistics.warehouseCode ||
        logistics.warehouse_code ||
        getWarehouseCode(rawWarehouse);

    const currentCurrency = pricing.currency || "GHS";

    // Item Calculations
    const totalCalculatedCost = items.reduce((sum, item) => {
        const q = parseFloat(item.allocatedQty ?? item.qty) || 0;
        const p = parseFloat(item.price) || 0;
        return sum + q * p;
    }, 0);

    const budgetCeiling = parseFloat(pricing.budget) || 0;
    const isOverBudget = budgetCeiling > 0 && totalCalculatedCost > budgetCeiling;

    const getPriorityBadge = (tier) => {
        if (tier === "critical")
            return {
                label: "Critical",
                style: "bg-rose-50 border-rose-200 text-rose-700",
                icon: ShieldAlert
            };
        if (tier === "urgent")
            return {
                label: "Urgent",
                style: "bg-amber-50 border-amber-200 text-amber-700",
                icon: Zap
            };
        return {
            label: "Routine",
            style: "bg-slate-50 border-slate-200 text-slate-700",
            icon: Clock
        };
    };

    const priority = getPriorityBadge(intent.priority);
    const PriorityIcon = priority.icon;

    return (
        <div className="space-y-6 max-w-[1660px] mx-auto p-2 tracking-normal antialiased text-slate-900">
            {/* AUDIT SUMMARY STATUS BANNER */}
            <div
                className={`p-5 rounded-xl border flex items-start gap-4 leading-relaxed shadow-xs ${
                    isOverBudget
                        ? "bg-rose-50 border-rose-200 text-rose-950"
                        : "bg-indigo-50/60 border-indigo-100 text-indigo-950"
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
                    <span className="text-lg font-bold block">
                        {isOverBudget
                            ? "Requires Multi-Level Authorization"
                            : "Payload Integrity Verified"}
                    </span>
                    <p className="text-sm text-slate-600 font-medium mt-1">
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
                    <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-xs space-y-5">
                        <span className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <FileText size={16} className="text-slate-400" /> Profile Context
                        </span>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                Purchase Order Title
                            </p>
                            <p className="text-lg font-bold text-slate-900 mt-1">
                                {context.title || "Untitled Requisition"}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-1">
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                    Strategy Type
                                </p>
                                <span className="inline-block text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg mt-1.5">
                                    {context.type || "Not Specified"}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                    Urgency Tier
                                </p>
                                <span
                                    className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg mt-1.5 border ${priority.style}`}
                                >
                                    <PriorityIcon size={14} />
                                    {priority.label}
                                </span>
                            </div>
                        </div>
                        {intent.description && (
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                                    Business Justification
                                </p>
                                <p className="text-sm text-slate-600 font-medium italic leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    "{intent.description}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* CARD 2: VENDOR ENTITY */}
                    <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-xs space-y-5">
                        <span className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <User size={16} className="text-slate-400" /> Vendor Entity
                        </span>
                        {supplier ? (
                            <div className="flex justify-between items-center gap-4">
                                <div>
                                    <p className="text-lg font-bold text-slate-900">
                                        {supplier.name}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {supplier.location} • Reliability Index:{" "}
                                        <span className="font-semibold text-slate-700">
                                            {supplier.reliability || "N/A"}
                                        </span>
                                    </p>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider bg-slate-900 text-white px-3.5 py-2 rounded-xl shrink-0 shadow-sm">
                                    Approved
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg font-semibold flex items-center gap-2">
                                ⚠️ Critical Warning: No vendor assigned to this execution cycle.
                            </p>
                        )}

                        {manufacturer?.name && (
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                    Original Equipment Manufacturer (OEM)
                                </p>
                                <p className="text-sm font-semibold text-slate-800 mt-1">
                                    {manufacturer.name}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* CARD 3: LOGISTICS & WAREHOUSE ALLOCATION */}
                    <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-xs space-y-5">
                        <span className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <Truck size={16} className="text-slate-400" /> Logistics & Warehouse Allocation
                        </span>

                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-indigo-100 border border-indigo-200 rounded-lg text-indigo-700 shrink-0">
                                        <Warehouse size={18} />
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                        {parsedWarehouses.length > 1
                                            ? `Assigned Warehouses (${parsedWarehouses.length})`
                                            : "Primary Target Warehouse"}
                                    </p>
                                </div>
                                {warehouseCode && (
                                    <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded">
                                        {warehouseCode}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {parsedWarehouses.map((whName, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1.5 bg-white border border-indigo-200/80 shadow-2xs px-3 py-1.5 rounded-lg text-slate-900"
                                    >
                                        <MapPin size={13} className="text-indigo-600 shrink-0" />
                                        <span className="text-sm font-bold">{whName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                    Routing Framework
                                </p>
                                <p className="text-sm font-bold text-slate-800 capitalize mt-1">
                                    {logistics.deliveryType || "Unassigned"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                    Target Date
                                </p>
                                <p className="text-sm font-bold text-slate-800 mt-1">
                                    {logistics.date || "Immediate Release"}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                Discharge Destination
                            </p>
                            <p className="text-sm font-medium text-slate-600 mt-1 leading-relaxed">
                                {logistics.location || "No Address Saved"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: ITEM MATRIX & FINANCIAL AUDIT */}
                <div className="col-span-12 lg:col-span-6 flex flex-col h-full">
                    <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden flex flex-col h-full justify-between">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                <ShoppingBag size={16} className="text-slate-500" /> Itemization & Allocation Matrix ({items.length})
                            </span>
                            <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                                Pre-tax Valuations
                            </span>
                        </div>

                        <div className="divide-y divide-slate-100 max-h-[460px] min-h-[250px] overflow-y-auto px-6 bg-white flex-1">
                            {items.length > 0 ? (
                                items.map((item, idx) => {
                                    const requestedQty = parseFloat(item.qty) || 0;
                                    const allocatedQty =
                                        item.allocatedQty !== undefined
                                            ? parseFloat(item.allocatedQty)
                                            : requestedQty;
                                    const unitPrice = parseFloat(item.price) || 0;
                                    const itemTotal = allocatedQty * unitPrice;

                                    const parsedItemWh = getWarehouseString(getItemWarehouseRaw(item));
                                    const itemWarehouse = Array.isArray(parsedItemWh)
                                        ? parsedItemWh.join(", ")
                                        : (typeof parsedItemWh === "string" ? parsedItemWh : null) || parsedWarehouses[0] || "Unassigned";

                                    return (
                                        <div key={item.id || item.sku || idx} className="py-4 space-y-2">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm tracking-tight text-slate-900 truncate">
                                                        {item.desc || item.name || item.title || "Unspecified Item"}
                                                    </p>
                                                    <p className="text-xs font-mono text-slate-400 mt-1">
                                                        SKU: {item.sku || "N/A"} • {currentCurrency}{" "}
                                                        {unitPrice.toFixed(2)} / unit
                                                    </p>
                                                </div>
                                                <div className="text-right font-mono font-bold text-sm text-slate-900 shrink-0">
                                                    {currentCurrency} {itemTotal.toFixed(2)}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700">
                                                        <Package size={12} />
                                                        Allocated: {allocatedQty} {item.uom || "units"}
                                                        {requestedQty !== allocatedQty && (
                                                            <span className="text-indigo-400 font-normal">
                                                                {" "}
                                                                (Req: {requestedQty})
                                                            </span>
                                                        )}
                                                    </span>

                                                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                                                        <Warehouse size={12} className="text-slate-500" />
                                                        {itemWarehouse}
                                                    </span>
                                                </div>

                                                {requestedQty > allocatedQty && (
                                                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                                        Partial Allocation
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-slate-400 italic text-center py-16">
                                    No inventory item assets found inside this payload data configuration.
                                </p>
                            )}
                        </div>

                        <div className="bg-slate-900 text-white p-6 space-y-5 rounded-b-xl">
                            <div className="flex justify-between items-center text-xs opacity-75 font-bold uppercase tracking-wider">
                                <span>
                                    Terms: {payment.terms || "Not Specified"} ({payment.method || "N/A"})
                                </span>
                                <span>Valuation Denomination ({currentCurrency})</span>
                            </div>

                            <div className="flex justify-between items-baseline pt-1">
                                <span className="text-sm font-bold opacity-85 uppercase tracking-wider">
                                    Aggregated Balance Due
                                </span>
                                <span className="text-3xl font-mono font-bold text-white tracking-tight">
                                    {currentCurrency} {totalCalculatedCost.toFixed(2)}
                                </span>
                            </div>

                            <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4 text-xs opacity-90">
                                <div className="leading-relaxed">
                                    <span className="block opacity-60 uppercase tracking-wider text-[10px] font-bold mb-0.5">
                                        Ceiling Budget Threshold
                                    </span>
                                    <span className="font-mono font-bold text-sm text-white">
                                        {currentCurrency} {budgetCeiling.toFixed(2)}
                                    </span>
                                </div>
                                {payment.advance && (
                                    <div className="text-right leading-relaxed">
                                        <span className="block opacity-60 uppercase tracking-wider text-[10px] font-bold mb-0.5">
                                            Upfront Deposit ({payment.advance}%)
                                        </span>
                                        <span className="font-mono font-bold text-sm text-emerald-400">
                                            {currentCurrency}{" "}
                                            {(
                                                (totalCalculatedCost * parseFloat(payment.advance)) /
                                                100
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}