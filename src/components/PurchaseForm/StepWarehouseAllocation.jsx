import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Warehouse,
    CheckCircle2,
    AlertTriangle,
    ArrowRightLeft,
    Plus,
    Trash2,
    HardDrive,
    Search,
    ChevronDown,
    Zap,
    RotateCcw,
} from "lucide-react";

// Standard endpoint fallback
const API_ENDPOINTS = {
    WAREHOUSES: "/api/warehouses",
};

// Fallback Master List matching API structure
const DEFAULT_WAREHOUSES = [
    {
        _id: "6a70601466288000dadf877e",
        organizationId: "Thonket-1233",
        name: "First Warehouse",
        code: "233456",
        status: "active",
        address: {
            street: "Abinkyi",
            city: "Kumasi",
            region: "Ashanti Region",
            digitalAddress: "304055",
        },
        storageCapacity: { maxPalletCapacity: 50000 },
        storageFeatures: { hasColdStorage: true },
    },
    {
        _id: "6a71de1d5d9f2065b426673f",
        organizationId: "Thonket-1233",
        name: "Second Warehouse",
        code: "#453GH1",
        status: "active",
        address: {
            street: "Abenkyi",
            city: "Kumasi",
            region: "Ashanti",
            digitalAddress: "DG-565-23",
        },
        storageCapacity: { maxPalletCapacity: 10000 },
        storageFeatures: { hasColdStorage: true },
    },
];

export default function StepWarehouseAllocation({
    form,
    setForm,
    organizationId = "Thonket-1233",
}) {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);

    // UI state for managing items efficiently
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, UNALLOCATED, BALANCED, OVER, PENDING
    const [expandedItem, setExpandedItem] = useState(null);

    // Safe Warehouse Normalizer
    const normalizeWarehouse = useCallback(
        (wh) => ({
            id: wh._id || wh.id || wh.code,
            name: wh.name || "Unnamed Facility",
            code: wh.code || "WH-GEN",
            region: wh.address?.region || wh.region || "General Region",
            city: wh.address?.city || wh.city || "",
            maxCapacity:
                wh.storageCapacity?.maxPalletCapacity || wh.maxCapacity || 50000,
            hasColdStorage: Boolean(wh.storageFeatures?.hasColdStorage),
        }),
        []
    );

    // Fetch Warehouses
    const fetchWarehouses = useCallback(async () => {
        if (!organizationId) return;
        setLoading(true);
        try {
            const response = await fetch(
                `${API_ENDPOINTS.WAREHOUSES}/${encodeURIComponent(organizationId)}`
            );
            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

            const data = await response.json();
            const list = Array.isArray(data)
                ? data
                : data.items || data.warehouses || data.data || [];

            if (list.length > 0) {
                setWarehouses(list.map(normalizeWarehouse));
            } else {
                setWarehouses(DEFAULT_WAREHOUSES.map(normalizeWarehouse));
            }
        } catch (err) {
            console.warn("Using default static warehouses due to fetch error:", err);
            setWarehouses(DEFAULT_WAREHOUSES.map(normalizeWarehouse));
        } finally {
            setLoading(false);
        }
    }, [organizationId, normalizeWarehouse]);

    useEffect(() => {
        fetchWarehouses();
    }, [fetchWarehouses]);

    const items = useMemo(() => form?.items || [], [form?.items]);

    // Fast calculation per-item
    const getItemStats = useCallback((item) => {
        const itemAllocations = item.allocations || [];
        const totalAllocated = itemAllocations.reduce(
            (sum, a) => sum + (parseInt(a.qty, 10) || 0),
            0
        );
        const targetQty = Math.max(0, parseInt(item.qty, 10) || 0);
        const remainder = targetQty - totalAllocated;

        return {
            targetQty,
            totalAllocated,
            remainder,
            isValid: remainder === 0 && targetQty > 0,
            isOverAllocated: remainder < 0,
            isUnderAllocated: remainder > 0,
            pct:
                targetQty > 0
                    ? Math.min(100, Math.round((totalAllocated / targetQty) * 100))
                    : 0,
        };
    }, []);

    // Total Warehouse load across all items
    const warehouseLoads = useMemo(() => {
        const loads = {};
        warehouses.forEach((wh) => (loads[wh.id] = 0));

        items.forEach((item) => {
            (item.allocations || []).forEach((alloc) => {
                if (alloc.warehouseId) {
                    loads[alloc.warehouseId] =
                        (loads[alloc.warehouseId] || 0) + (parseInt(alloc.qty, 10) || 0);
                }
            });
        });

        return loads;
    }, [items, warehouses]);

    // Global Metrics
    const globalMetrics = useMemo(() => {
        if (items.length === 0)
            return {
                isFullyBalanced: false,
                completedCount: 0,
                totalItems: 0,
                hasCapacityOverflow: false,
                unallocatedCount: 0,
                overAllocatedCount: 0,
            };

        let completedCount = 0;
        let unallocatedCount = 0;
        let overAllocatedCount = 0;

        items.forEach((item) => {
            const stats = getItemStats(item);
            if (stats.isValid) completedCount++;
            if (stats.totalAllocated === 0) unallocatedCount++;
            if (stats.isOverAllocated) overAllocatedCount++;
        });

        const hasCapacityOverflow = warehouses.some(
            (wh) => (warehouseLoads[wh.id] || 0) > wh.maxCapacity
        );

        return {
            isFullyBalanced:
                completedCount === items.length && !hasCapacityOverflow,
            completedCount,
            unallocatedCount,
            overAllocatedCount,
            totalItems: items.length,
            hasCapacityOverflow,
        };
    }, [items, warehouses, warehouseLoads, getItemStats]);

    // High performance bulk updates
    const updateItemAllocations = useCallback(
        (itemId, newAllocations) => {
            setForm((prev) => ({
                ...prev,
                items: prev.items.map((item) =>
                    (item.id || item.sku) === itemId
                        ? { ...item, allocations: newAllocations }
                        : item
                ),
            }));
        },
        [setForm]
    );

    // Bulk Operation 1: Assign ALL items to primary warehouse
    const handleBulkAssignPrimary = () => {
        if (warehouses.length === 0) return;
        const primaryId = warehouses[0].id;

        setForm((prev) => ({
            ...prev,
            items: prev.items.map((item) => ({
                ...item,
                allocations: [
                    {
                        warehouseId: primaryId,
                        qty: Math.max(0, parseInt(item.qty, 10) || 0),
                    },
                ],
            })),
        }));
    };

    // Bulk Operation 2: Distribute ALL items evenly
    const handleBulkDistributeEvenly = () => {
        if (warehouses.length === 0) return;
        const whCount = warehouses.length;

        setForm((prev) => ({
            ...prev,
            items: prev.items.map((item) => {
                const targetQty = Math.max(0, parseInt(item.qty, 10) || 0);
                const baseShare = Math.floor(targetQty / whCount);
                let remainder = targetQty % whCount;

                return {
                    ...item,
                    allocations: warehouses.map((wh, idx) => ({
                        warehouseId: wh.id,
                        qty: baseShare + (idx < remainder ? 1 : 0),
                    })),
                };
            }),
        }));
    };

    // Row level allocation management
    const handleAddWarehouseRow = (item) => {
        const currentAllocations = item.allocations || [];
        const usedWhIds = new Set(currentAllocations.map((a) => a.warehouseId));
        const availableWh =
            warehouses.find((w) => !usedWhIds.has(w.id)) || warehouses[0];
        const stats = getItemStats(item);

        const updated = [
            ...currentAllocations,
            {
                warehouseId: availableWh?.id || "",
                qty: Math.max(0, stats.remainder),
            },
        ];
        updateItemAllocations(item.id || item.sku, updated);
    };

    const handleRemoveWarehouseRow = (item, index) => {
        const currentAllocations = [...(item.allocations || [])];
        currentAllocations.splice(index, 1);
        updateItemAllocations(item.id || item.sku, currentAllocations);
    };

    const handleRowChange = (item, index, field, value) => {
        const currentAllocations = [...(item.allocations || [])];
        const updatedValue =
            field === "qty"
                ? value === ""
                    ? ""
                    : Math.max(0, parseInt(value, 10) || 0)
                : value;

        currentAllocations[index] = {
            ...currentAllocations[index],
            [field]: updatedValue,
        };

        updateItemAllocations(item.id || item.sku, currentAllocations);
    };

    // Helper shortcuts for single items
    const handleAutoAllocateItem = (item) => {
        if (warehouses.length === 0) return;
        updateItemAllocations(item.id || item.sku, [
            {
                warehouseId: warehouses[0].id,
                qty: Math.max(0, parseInt(item.qty, 10) || 0),
            },
        ]);
    };

    const handleClearItemAllocations = (item) => {
        updateItemAllocations(item.id || item.sku, []);
    };

    // Filter engine for items
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const stats = getItemStats(item);
            const matchesSearch =
                (item.sku || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.desc || item.name || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (statusFilter === "UNALLOCATED") return stats.totalAllocated === 0;
            if (statusFilter === "BALANCED") return stats.isValid;
            if (statusFilter === "PENDING") return stats.isUnderAllocated;
            if (statusFilter === "OVER") return stats.isOverAllocated;

            return true;
        });
    }, [items, searchTerm, statusFilter, getItemStats]);

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto p-3 sm:p-6 font-sans text-slate-800 antialiased">
            {/* HEADER METRICS & BULK ACTIONS BANNER */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex gap-3.5 items-start">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                        <Warehouse className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                Commercial Warehouse Allocation
                            </h3>
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
                                {items.length} Items Enrolled
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                            Batch process or individually route inventory to destination hubs. Ensure target quantities match order requirements without exceeding storage limits.
                        </p>
                    </div>
                </div>

                {/* BULK AUTOMATION CONTROLS */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 shrink-0">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 hidden sm:inline">
                        Bulk Ops:
                    </span>
                    <button
                        type="button"
                        onClick={handleBulkAssignPrimary}
                        disabled={warehouses.length === 0}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> All to Primary Hub
                    </button>
                    <button
                        type="button"
                        onClick={handleBulkDistributeEvenly}
                        disabled={warehouses.length === 0}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-500" /> Split All Evenly
                    </button>
                </div>
            </div>

            {/* WAREHOUSES CAPACITY TRACKER */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-indigo-600" />
                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                            Destination Hub Capacities
                        </h4>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-600">
                        {globalMetrics.completedCount} / {globalMetrics.totalItems} Items Fully Allocated
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {warehouses.map((wh) => {
                        const used = warehouseLoads[wh.id] || 0;
                        const max = wh.maxCapacity;
                        const percentage =
                            max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0;
                        const isOverflow = used > max;

                        return (
                            <div
                                key={wh.id}
                                className={`p-3.5 rounded-xl border transition-all ${isOverflow
                                    ? "border-rose-300 bg-rose-50/50"
                                    : "border-slate-200 bg-slate-50/60"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                        {wh.name} <span className="text-slate-500">({wh.code})</span>
                                    </span>
                                    <span
                                        className={`text-xs font-mono font-bold shrink-0 ${isOverflow ? "text-rose-600" : "text-slate-700"
                                            }`}
                                    >
                                        {used.toLocaleString()} / {max.toLocaleString()}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full transition-all ${isOverflow
                                            ? "bg-rose-500"
                                            : percentage > 85
                                                ? "bg-amber-500"
                                                : "bg-indigo-600"
                                            }`}
                                        style={{ width: `${Math.min(100, percentage)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* HIGH-DENSITY ITEM GRID FOR LARGE PURCHASE ORDERS */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                {/* TOOLBAR: SEARCH & STATUS FILTERING */}
                <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by SKU or product name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="font-bold text-slate-500 uppercase tracking-wider mr-1 hidden lg:inline">
                            Filter:
                        </span>
                        {[
                            { id: "ALL", label: `All (${items.length})` },
                            {
                                id: "UNALLOCATED",
                                label: `Unallocated (${globalMetrics.unallocatedCount})`,
                            },
                            {
                                id: "BALANCED",
                                label: `Balanced (${globalMetrics.completedCount})`,
                            },
                            {
                                id: "OVER",
                                label: `Over (${globalMetrics.overAllocatedCount})`,
                            },
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                type="button"
                                onClick={() => setStatusFilter(btn.id)}
                                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${statusFilter === btn.id
                                    ? "bg-indigo-600 text-white shadow-xs"
                                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* HIGH EFFICIENCY DATA TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-100/80 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600">
                                <th className="p-3.5 pl-4 sm:pl-5">Item SKU / Product</th>
                                <th className="p-3.5 text-right">Target Qty</th>
                                <th className="p-3.5 text-right">Allocated Qty</th>
                                <th className="p-3.5">Allocation Status</th>
                                <th className="p-3.5">Destinations</th>
                                <th className="p-3.5 text-right pr-4 sm:pr-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        No matching items found.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item, idx) => {
                                    const itemId = item.id || item.sku || `item-${idx}`;
                                    const stats = getItemStats(item);
                                    const isExpanded = expandedItem === itemId;
                                    const allocations = item.allocations || [];

                                    return (
                                        <React.Fragment key={itemId}>
                                            <tr
                                                className={`hover:bg-slate-50/80 transition-colors ${isExpanded ? "bg-indigo-50/30" : ""
                                                    }`}
                                            >
                                                <td className="p-3.5 pl-4 sm:pl-5 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-sm border border-slate-200 shrink-0">
                                                            {item.sku || "SKU-PROD"}
                                                        </span>
                                                        <span className="text-slate-900 font-semibold truncate max-w-[180px] sm:max-w-[280px]">
                                                            {item.desc || item.name || "Item Line"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                                                    {stats.targetQty.toLocaleString()}
                                                </td>
                                                <td className="p-3.5 text-right font-mono font-bold">
                                                    <span
                                                        className={
                                                            stats.isValid
                                                                ? "text-emerald-600"
                                                                : stats.isOverAllocated
                                                                    ? "text-rose-600"
                                                                    : "text-amber-600"
                                                        }
                                                    >
                                                        {stats.totalAllocated.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="p-3.5">
                                                    {stats.isValid ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs font-semibold">
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />{" "}
                                                            Balanced
                                                        </span>
                                                    ) : stats.isOverAllocated ? (
                                                        <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-xs font-semibold">
                                                            <AlertTriangle className="w-3 h-3 text-rose-600" />{" "}
                                                            Over (+{Math.abs(stats.remainder)})
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs font-semibold">
                                                            <AlertTriangle className="w-3 h-3 text-amber-600" />{" "}
                                                            Need {stats.remainder}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3.5">
                                                    <div className="flex flex-wrap gap-1">
                                                        {allocations.length === 0 ? (
                                                            <span className="text-slate-400 italic text-xs">
                                                                Unassigned
                                                            </span>
                                                        ) : (
                                                            allocations.map((a, i) => {
                                                                const wh = warehouses.find(
                                                                    (w) => w.id === a.warehouseId
                                                                );
                                                                return (
                                                                    <span
                                                                        key={i}
                                                                        className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium px-1.5 py-0.5 rounded-xs"
                                                                    >
                                                                        {wh ? wh.code : "WH"}: {a.qty}
                                                                    </span>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3.5 text-right pr-4 sm:pr-5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setExpandedItem(isExpanded ? null : itemId)
                                                        }
                                                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold text-xs px-2.5 py-1 rounded-lg hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer"
                                                    >
                                                        {isExpanded ? "Done" : "Configure"}
                                                        <ChevronDown
                                                            className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""
                                                                }`}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* EXPANDABLE INLINE EDITING PANEL */}
                                            {isExpanded && (
                                                <tr className="bg-indigo-50/20 border-b border-indigo-100">
                                                    <td colSpan={6} className="p-4 sm:p-5">
                                                        <div className="space-y-4 max-w-4xl bg-white p-4 sm:p-5 rounded-xl border border-indigo-100 shadow-xs">
                                                            {/* Panel Header & Quick Actions */}
                                                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                                                                <div>
                                                                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                                                                        Allocation Distribution: {item.sku}
                                                                    </h5>
                                                                    <p className="text-xs text-slate-500">
                                                                        Target: {stats.targetQty.toLocaleString()} units |
                                                                        Remaining: {stats.remainder} units
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleAutoAllocateItem(item)}
                                                                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                                                                    >
                                                                        <Zap className="w-3.5 h-3.5 text-amber-500" /> Auto-fill Primary
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleClearItemAllocations(item)}
                                                                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                                                                    >
                                                                        <RotateCcw className="w-3.5 h-3.5" /> Clear
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Allocation Rows */}
                                                            <div className="space-y-2.5">
                                                                {allocations.length === 0 ? (
                                                                    <p className="text-xs text-slate-500 italic py-2">
                                                                        No warehouses currently mapped for this product line.
                                                                    </p>
                                                                ) : (
                                                                    allocations.map((alloc, aIdx) => (
                                                                        <div
                                                                            key={aIdx}
                                                                            className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200"
                                                                        >
                                                                            {/* Warehouse Select */}
                                                                            <div className="flex-1">
                                                                                <select
                                                                                    value={alloc.warehouseId || ""}
                                                                                    onChange={(e) =>
                                                                                        handleRowChange(
                                                                                            item,
                                                                                            aIdx,
                                                                                            "warehouseId",
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                                                                                >
                                                                                    <option value="" disabled>
                                                                                        Select Destination Warehouse...
                                                                                    </option>
                                                                                    {warehouses.map((w) => (
                                                                                        <option key={w.id} value={w.id}>
                                                                                            {w.name} ({w.code})
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>

                                                                            {/* Quantity Input */}
                                                                            <div className="w-32 sm:w-40">
                                                                                <input
                                                                                    type="number"
                                                                                    min="0"
                                                                                    placeholder="Quantity"
                                                                                    value={alloc.qty}
                                                                                    onChange={(e) =>
                                                                                        handleRowChange(
                                                                                            item,
                                                                                            aIdx,
                                                                                            "qty",
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                                                                                />
                                                                            </div>

                                                                            {/* Remove Row Button */}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleRemoveWarehouseRow(item, aIdx)
                                                                                }
                                                                                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                                                                                title="Remove split"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>

                                                            {/* Footer Action: Add Warehouse Split */}
                                                            <div className="pt-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleAddWarehouseRow(item)}
                                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                                                                >
                                                                    <Plus className="w-4 h-4" /> Add Destination Split
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}