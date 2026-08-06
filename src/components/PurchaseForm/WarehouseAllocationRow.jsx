import React from "react";
import {
    CheckCircle2,
    AlertTriangle,
    Plus,
    Trash2,
    ChevronDown,
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

    // Collect warehouse IDs already assigned in this row to disable them in other selectors
    const selectedWarehouseIds = new Set(
        allocations.map((a) => a.warehouseId).filter(Boolean)
    );

    return (
        <React.Fragment>
            {/* MAIN TABLE ROW */}
            <tr
                className={`group border-b border-slate-200/80 transition-colors ${isExpanded ? "bg-indigo-50/40" : "hover:bg-slate-50/80"
                    }`}
            >
                {/* 1. SKU & Description */}
                <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80 tracking-wide shrink-0">
                            {item.sku || "SKU-PROD"}
                        </span>
                        <span
                            className="text-slate-900 font-semibold text-sm truncate max-w-[200px] sm:max-w-[300px]"
                            title={item.desc || item.name}
                        >
                            {item.desc || item.name || "Item Line"}
                        </span>
                    </div>
                </td>

                {/* 2. Target Qty */}
                <td className="p-4 text-right font-mono font-bold text-slate-800 text-sm">
                    {(stats.targetQty ?? 0).toLocaleString()}
                </td>

                {/* 3. Total Allocated Qty */}
                <td className="p-4 text-right font-mono font-bold text-sm">
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
                <td className="p-4">
                    {stats.isValid ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 text-xs font-medium shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Balanced
                        </span>
                    ) : stats.isOverAllocated ? (
                        <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60 text-xs font-medium shadow-2xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                            Over (+{Math.abs(stats.remainder ?? 0)})
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 text-xs font-medium shadow-2xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            Need {stats.remainder}
                        </span>
                    )}
                </td>

                {/* 5. Breakdown Tags */}
                <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                        {allocations.length === 0 ? (
                            <span className="text-slate-400 italic text-xs font-normal">
                                Unassigned
                            </span>
                        ) : (
                            allocations.map((a, i) => {
                                const wh = warehouses.find((w) => w.id === a.warehouseId);
                                return (
                                    <span
                                        key={a.warehouseId || i}
                                        className="bg-white border border-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded shadow-2xs inline-flex items-center gap-1"
                                    >
                                        <span className="text-slate-500 font-semibold">
                                            {wh ? wh.code : "WH"}:
                                        </span>
                                        <span>{a.qty}</span>
                                    </span>
                                );
                            })
                        )}
                    </div>
                </td>

                {/* 6. Action Toggle */}
                <td className="p-4 text-right pr-6">
                    <button
                        type="button"
                        onClick={onToggleExpand}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        className={`inline-flex items-center gap-1.5 font-medium text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${isExpanded
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm hover:bg-indigo-700"
                            : "text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/50 border-indigo-200/60"
                            }`}
                    >
                        {isExpanded ? "Done" : "Configure"}
                        <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                                }`}
                        />
                    </button>
                </td>
            </tr>

            {/* EXPANDABLE INLINE EDITING PANEL */}
            {isExpanded && (
                <tr id={panelId} className="bg-indigo-50/30 border-b border-indigo-100">
                    <td colSpan={6} className="p-4 sm:p-6">
                        <div className="max-w-4xl mx-auto bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm space-y-4">
                            {/* Panel Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">
                                        Configure Allocations for {item.sku || "Product"}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Distribute quantities across available destination warehouses.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
                                    <span className="text-slate-600">
                                        Target:{" "}
                                        <strong className="text-slate-900 font-mono">
                                            {stats.targetQty ?? 0}
                                        </strong>
                                    </span>
                                    <span className="text-slate-300">|</span>
                                    <span
                                        className={
                                            stats.remainder === 0
                                                ? "text-emerald-600"
                                                : "text-amber-600"
                                        }
                                    >
                                        Unallocated:{" "}
                                        <strong className="font-mono">{stats.remainder ?? 0}</strong>
                                    </span>
                                </div>
                            </div>

                            {/* Allocation Rows */}
                            <div className="space-y-2.5">
                                {allocations.length === 0 ? (
                                    <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                                        <p className="text-xs text-slate-500 mb-2">
                                            No warehouse allocations added yet.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => onAddWarehouseRow(item)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add First Warehouse
                                        </button>
                                    </div>
                                ) : (
                                    allocations.map((alloc, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 bg-slate-50/50 p-1.5 rounded-xl border border-slate-200/60"
                                        >
                                            {/* Warehouse Select */}
                                            <select
                                                value={alloc.warehouseId || ""}
                                                onChange={(e) =>
                                                    onRowChange(item, idx, "warehouseId", e.target.value)
                                                }
                                                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-shadow"
                                            >
                                                <option value="" disabled>
                                                    Select Destination Warehouse
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
                                                            {wh.name} ({wh.code}) - Max: {wh.maxCapacity}
                                                            {isSelectedElsewhere ? " (Already Selected)" : ""}
                                                        </option>
                                                    );
                                                })}
                                            </select>

                                            {/* Quantity Input */}
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    aria-label={`Quantity for warehouse index ${idx + 1}`}
                                                    value={alloc.qty ?? ""}
                                                    onChange={(e) =>
                                                        onRowChange(
                                                            item,
                                                            idx,
                                                            "qty",
                                                            e.target.value === "" ? "" : Number(e.target.value)
                                                        )
                                                    }
                                                    className="w-28 sm:w-36 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 text-right focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-shadow"
                                                />
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() => onRemoveWarehouseRow(item, idx)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                                title="Remove Destination"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Panel Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => onAddWarehouseRow(item)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Warehouse
                                </button>

                                <button
                                    type="button"
                                    onClick={onToggleExpand}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                                >
                                    Done Editing
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
}