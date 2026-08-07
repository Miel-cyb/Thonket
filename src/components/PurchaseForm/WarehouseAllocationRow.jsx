import React from "react";
import {
    CheckCircle2,
    AlertTriangle,
    Plus,
    Trash2,
    ChevronDown,
    Zap,
    X,
} from "lucide-react";

export default function AllocationRow({
    item = {},
    warehouses = [],
    stats = {},
    isExpanded = false,
    onToggleExpand,
    onAddWarehouseRow,
    onRemoveWarehouseRow,
    onRowChange,
}) {
    const allocations = item.allocations || [];
    const panelId = `allocation-panel-${item.sku || item.id || "item"}`;
    const remainder = stats.remainder ?? 0;
    const allWarehousesSelected = allocations.length >= warehouses.length;

    // Set of selected IDs for quick duplicate checks
    const selectedWarehouseIds = new Set(
        allocations.map((a) => a.warehouseId).filter(Boolean)
    );

    // Quick action: Fill remaining unallocated stock into a row
    const handleQuickFill = (idx, currentQty) => {
        if (remainder <= 0) return;
        const newQty = Number(currentQty || 0) + remainder;
        onRowChange(item, idx, "qty", newQty);
    };

    return (
        <React.Fragment>
            {/* MAIN TABLE ROW */}
            <tr
                className={`group border-b border-slate-200/80 transition-colors ${
                    isExpanded ? "bg-indigo-50/50" : "hover:bg-slate-50/80"
                }`}
            >
                {/* 1. SKU & Product Info */}
                <td className="p-4 pl-6">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80 tracking-wide shrink-0">
                            {item.sku || "SKU-PROD"}
                        </span>
                        <span
                            className="text-slate-900 font-semibold text-sm truncate max-w-[140px] sm:max-w-[220px]"
                            title={item.desc || item.name}
                        >
                            {item.desc || item.name || "Item Line"}
                        </span>
                    </div>
                </td>

                {/* 2. Target Qty */}
                <td className="p-4 text-right font-mono font-bold text-slate-800 text-sm whitespace-nowrap">
                    {(stats.targetQty ?? 0).toLocaleString()}
                </td>

                {/* 3. Total Allocated Qty */}
                <td className="p-4 text-right font-mono font-bold text-sm whitespace-nowrap">
                    <span
                        className={
                            stats.isValid
                                ? "text-emerald-600"
                                : stats.isOverAllocated
                                ? "text-rose-600"
                                : "text-amber-600"
                        }
                    >
                        {(stats.totalAllocated ?? 0).toLocaleString()}
                    </span>
                </td>

                {/* 4. Status Badge */}
                <td className="p-4 whitespace-nowrap">
                    {stats.isValid ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            Balanced
                        </span>
                    ) : stats.isOverAllocated ? (
                        <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60 text-xs font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            Over (+{Math.abs(remainder).toLocaleString()})
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 text-xs font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            Need {remainder.toLocaleString()}
                        </span>
                    )}
                </td>

                {/* 5. Breakdown Tags */}
                <td className="p-4 max-w-[200px] sm:max-w-xs">
                    <div className="flex flex-wrap gap-1.5">
                        {allocations.length === 0 ? (
                            <span className="text-slate-400 italic text-xs font-normal">
                                Unassigned
                            </span>
                        ) : (
                            allocations.map((a, i) => {
                                const wh =
                                    warehouses.find(
                                        (w) => w.id === a.warehouseId
                                    ) || {
                                        code: a.warehouseCode,
                                        name: a.warehouseName,
                                    };
                                return (
                                    <span
                                        key={a.warehouseId || i}
                                        className="bg-white border border-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded shadow-xs inline-flex items-center gap-1 shrink-0"
                                    >
                                        <span className="text-slate-500 font-semibold">
                                            {a.warehouseCode || wh?.code || "WH"}:
                                        </span>
                                        <span className="font-mono">{a.qty ?? 0}</span>
                                    </span>
                                );
                            })
                        )}
                    </div>
                </td>

                {/* 6. Expand / Edit Toggle */}
                <td className="p-4 text-right pr-6 whitespace-nowrap">
                    <button
                        type="button"
                        onClick={onToggleExpand}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        className={`inline-flex items-center gap-1.5 font-medium text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            isExpanded
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                                : "text-slate-700 bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-xs"
                        }`}
                    >
                        <span>{isExpanded ? "Collapse" : "Edit Allocations"}</span>
                        <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-indigo-600" : "text-slate-400"
                            }`}
                        />
                    </button>
                </td>
            </tr>

            {/* EXPANDABLE EDITING PANEL */}
            {isExpanded && (
                <tr id={panelId} className="bg-indigo-50/30 border-b border-indigo-100">
                    <td colSpan={6} className="p-2 sm:p-5">
                        <div className="w-full max-w-4xl mx-auto bg-white p-3.5 sm:p-5 rounded-xl border border-indigo-100/80 shadow-sm space-y-4 overflow-hidden">
                            {/* Drawer Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                                        Allocation Manager
                                        <span className="font-mono text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                            {item.sku || "SKU-PROD"}
                                        </span>
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Distribute quantities across destination warehouses.
                                    </p>
                                </div>

                                {/* Summary Pills */}
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/70">
                                    <div className="text-slate-600 whitespace-nowrap">
                                        Target:{" "}
                                        <strong className="text-slate-900 font-mono">
                                            {(stats.targetQty ?? 0).toLocaleString()}
                                        </strong>
                                    </div>
                                    <div className="w-px h-3 bg-slate-200 hidden sm:block" />
                                    <div
                                        className={`whitespace-nowrap ${
                                            remainder === 0
                                                ? "text-emerald-600 font-semibold"
                                                : remainder < 0
                                                ? "text-rose-600 font-semibold"
                                                : "text-amber-600 font-semibold"
                                        }`}
                                    >
                                        Remaining:{" "}
                                        <strong className="font-mono">
                                            {remainder.toLocaleString()}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Allocation Editor List */}
                            {allocations.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                    <p className="text-xs text-slate-500 mb-3">
                                        No warehouse allocations assigned to this item yet.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => onAddWarehouseRow(item)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add First Warehouse
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Column Labels */}
                                    <div className="hidden sm:grid grid-cols-12 gap-3 px-1 text-xs font-semibold text-slate-500">
                                        <div className="col-span-6">Destination Warehouse</div>
                                        <div className="col-span-5">Allocated Quantity</div>
                                        <div className="col-span-1 text-right">Action</div>
                                    </div>

                                    {/* Row Items */}
                                    {allocations.map((alloc, idx) => (
                                        <div
                                            key={idx}
                                            className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-slate-50/60 p-2.5 rounded-lg border border-slate-200/70"
                                        >
                                            {/* Warehouse Selector */}
                                            <div className="sm:col-span-6 min-w-0">
                                                <label className="sm:hidden block text-2xs font-semibold text-slate-500 mb-1">
                                                    Warehouse
                                                </label>
                                                <select
                                                    value={alloc.warehouseId || ""}
                                                    onChange={(e) => {
                                                        const selectedWarehouse = warehouses.find(
                                                            (wh) => wh.id === e.target.value
                                                        );

                                                        onRowChange(
                                                            item,
                                                            idx,
                                                            "warehouse",
                                                            {
                                                                warehouseId: selectedWarehouse?.id || e.target.value,
                                                                warehouseName: selectedWarehouse?.name || "",
                                                                warehouseCode: selectedWarehouse?.code || "",
                                                                warehouseRegion: selectedWarehouse?.region || "",
                                                                warehouseCity: selectedWarehouse?.city || "",
                                                            }
                                                        );
                                                    }}
                                                    className="w-full min-w-0 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-shadow truncate"
                                                >
                                                    <option value="" disabled>
                                                        Select Warehouse...
                                                    </option>
                                                    {warehouses.map((wh) => {
                                                        const isSelectedElsewhere =
                                                            selectedWarehouseIds.has(wh.id) &&
                                                            alloc.warehouseId !== wh.id;
                                                        return (
                                                            <option
                                                                key={wh.id}
                                                                value={wh.id}
                                                                disabled={isSelectedElsewhere}
                                                            >
                                                                {wh.name} ({wh.code}) — Cap:{" "}
                                                                {wh.maxCapacity ?? "N/A"}
                                                                {isSelectedElsewhere
                                                                    ? " (Already added)"
                                                                    : ""}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>

                                            {/* Quantity Input + Quick Fill */}
                                            <div className="sm:col-span-5 flex items-center gap-2 min-w-0">
                                                <div className="flex-1 min-w-0">
                                                    <label className="sm:hidden block text-2xs font-semibold text-slate-500 mb-1">
                                                        Quantity
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        value={alloc.qty ?? ""}
                                                        onChange={(e) =>
                                                            onRowChange(
                                                                item,
                                                                idx,
                                                                "qty",
                                                                e.target.value === ""
                                                                    ? ""
                                                                    : Number(e.target.value)
                                                            )
                                                        }
                                                        className="w-full min-w-0 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 text-right focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-shadow"
                                                    />
                                                </div>

                                                {/* Fill Remaining Quick Button */}
                                                {remainder > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleQuickFill(idx, alloc.qty)
                                                        }
                                                        className="inline-flex items-center gap-1 text-2xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                                                        title={`Add remaining ${remainder} units here`}
                                                    >
                                                        <Zap className="w-3 h-3 text-indigo-600 shrink-0" />
                                                        +Fill ({remainder})
                                                    </button>
                                                )}
                                            </div>

                                            {/* Delete Row Button */}
                                            <div className="sm:col-span-1 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onRemoveWarehouseRow(item, idx)
                                                    }
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Remove Row"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Panel Actions Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => onAddWarehouseRow(item)}
                                    disabled={allWarehousesSelected}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                        allWarehousesSelected
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                    }`}
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    {allWarehousesSelected
                                        ? "All Warehouses Assigned"
                                        : "Add Warehouse Destination"}
                                </button>

                                <button
                                    type="button"
                                    onClick={onToggleExpand}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" /> Close Panel
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
}