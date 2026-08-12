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
    ChevronUp,
    Zap,
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

// Helper: Synchronizes top-level form.allocations map with item arrays
const buildAllocationsMap = (updatedItems) => {
    const map = {};
    updatedItems.forEach((item, index) => {
        const id = item.id || item.sku || `item-${index}`;
        const itemMap = {};
        (item.allocations || []).forEach((a) => {
            if (a.warehouseId) {
                itemMap[a.warehouseId] = {
                    qty: parseInt(a.qty, 10) || 0,
                    warehouseName: a.warehouseName || "",
                };
            }
        });
        map[id] = itemMap;
    });
    return map;
};

// Helper: Stable Item Identification
const getItemKey = (item, index) => item.id || item.sku || `item-${index}`;

// Status Badge Helper
const StatusBadge = ({ stats }) => {
    if (stats.isValid) {
        return (
            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs font-semibold shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Balanced
            </span>
        );
    }
    if (stats.isOverAllocated) {
        return (
            <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-xs font-semibold shrink-0">
                <AlertTriangle className="w-3 h-3 text-rose-600" /> Over (+{Math.abs(stats.remainder)})
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs font-semibold shrink-0">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Need {stats.remainder}
        </span>
    );
};

export default function StepWarehouseAllocation({
    form,
    setForm,
    organizationId = "Thonket-1233",
}) {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);

    // UI state for managing items efficiently
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
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

    // Ensure warehouseName is populated across all items once warehouses load
    useEffect(() => {
        if (!warehouses.length || !form?.items?.length) return;

        let modified = false;
        const updatedItems = form.items.map((item) => {
            if (!item.allocations || item.allocations.length === 0) return item;

            const updatedAllocations = item.allocations.map((alloc) => {
                if (alloc.warehouseId && !alloc.warehouseName) {
                    const match = warehouses.find(
                        (w) => String(w.id) === String(alloc.warehouseId)
                    );
                    if (match) {
                        modified = true;
                        return { ...alloc, warehouseName: match.name };
                    }
                }
                return alloc;
            });

            return { ...item, allocations: updatedAllocations };
        });

        if (modified) {
            setForm((prev) => ({
                ...prev,
                items: updatedItems,
                allocations: buildAllocationsMap(updatedItems),
            }));
        }
    }, [warehouses, form?.items, setForm]);

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

    // High performance updates
    const updateItemAllocations = useCallback(
        (targetKey, newAllocations) => {
            setForm((prev) => {
                const updatedItems = (prev.items || []).map((item, index) =>
                    getItemKey(item, index) === targetKey
                        ? { ...item, allocations: newAllocations }
                        : item
                );

                return {
                    ...prev,
                    items: updatedItems,
                    allocations: buildAllocationsMap(updatedItems),
                };
            });
        },
        [setForm]
    );

    // Bulk Operation 1: Assign ALL items to primary warehouse
    const handleBulkAssignPrimary = () => {
        if (warehouses.length === 0) return;
        const primaryWh = warehouses[0];

        setForm((prev) => {
            const updatedItems = (prev.items || []).map((item) => ({
                ...item,
                allocations: [
                    {
                        warehouseId: primaryWh.id,
                        warehouseName: primaryWh.name,
                        qty: Math.max(0, parseInt(item.qty, 10) || 0),
                    },
                ],
            }));

            return {
                ...prev,
                warehouseId: primaryWh.id,
                warehouseName: primaryWh.name,
                items: updatedItems,
                allocations: buildAllocationsMap(updatedItems),
            };
        });
    };

    // Bulk Operation 2: Distribute ALL items evenly
    const handleBulkDistributeEvenly = () => {
        if (warehouses.length === 0) return;
        const whCount = warehouses.length;

        setForm((prev) => {
            const updatedItems = (prev.items || []).map((item) => {
                const targetQty = Math.max(0, parseInt(item.qty, 10) || 0);
                const baseShare = Math.floor(targetQty / whCount);
                let remainder = targetQty % whCount;

                return {
                    ...item,
                    allocations: warehouses.map((wh, idx) => ({
                        warehouseId: wh.id,
                        warehouseName: wh.name,
                        qty: baseShare + (idx < remainder ? 1 : 0),
                    })),
                };
            });

            return {
                ...prev,
                items: updatedItems,
                allocations: buildAllocationsMap(updatedItems),
            };
        });
    };

    // Row level allocation management
    const handleAddWarehouseRow = (item, itemKey) => {
        const currentAllocations = item.allocations || [];
        const usedWhIds = new Set(currentAllocations.map((a) => String(a.warehouseId)));
        const availableWh =
            warehouses.find((w) => !usedWhIds.has(String(w.id))) || warehouses[0];
        const stats = getItemStats(item);

        const updated = [
            ...currentAllocations,
            {
                warehouseId: availableWh?.id || "",
                warehouseName: availableWh?.name || "",
                qty: Math.max(0, stats.remainder),
            },
        ];
        updateItemAllocations(itemKey, updated);
    };

    const handleRemoveWarehouseRow = (itemKey, index, itemAllocations) => {
        const currentAllocations = [...itemAllocations];
        currentAllocations.splice(index, 1);
        updateItemAllocations(itemKey, currentAllocations);
    };

    const handleRowChange = (itemKey, index, itemAllocations, field, value) => {
        const currentAllocations = [...itemAllocations];

        if (field === "warehouseId") {
            const selectedWh = warehouses.find((w) => String(w.id) === String(value));
            currentAllocations[index] = {
                ...currentAllocations[index],
                warehouseId: value,
                warehouseName: selectedWh ? selectedWh.name : "",
            };
        } else {
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
        }

        updateItemAllocations(itemKey, currentAllocations);
    };

    const handleClearItemAllocations = (itemKey) => {
        updateItemAllocations(itemKey, []);
    };

    // Filter engine for items
    const filteredItems = useMemo(() => {
        return items
            .map((item, index) => ({ item, key: getItemKey(item, index) }))
            .filter(({ item }) => {
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

    // Allocation Configuration Panel Render
    const renderItemConfigPanel = (item, itemKey, allocations, stats) => (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 my-2 space-y-3 w-full box-border">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Distribution Routing for {item.sku || "SKU"}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleClearItemAllocations(itemKey)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {allocations.length === 0 ? (
                <div className="text-center py-4 bg-white rounded-lg border border-dashed border-slate-300">
                    <p className="text-xs text-slate-500 mb-2">
                        No warehouses assigned for this item yet.
                    </p>
                    <button
                        type="button"
                        onClick={() => handleAddWarehouseRow(item, itemKey)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" /> Assign First Hub
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {allocations.map((alloc, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm"
                        >
                            <div className="flex-1 min-w-0">
                                <select
                                    value={alloc.warehouseId || ""}
                                    onChange={(e) =>
                                        handleRowChange(itemKey, idx, allocations, "warehouseId", e.target.value)
                                    }
                                    className="w-full text-xs font-medium p-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none truncate"
                                >
                                    <option value="" disabled>
                                        Select Destination Warehouse...
                                    </option>
                                    {warehouses.map((wh) => (
                                        <option key={wh.id} value={wh.id}>
                                            {wh.name} ({wh.code}) - Max: {wh.maxCapacity.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <div className="relative w-full sm:w-32">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Qty"
                                        value={alloc.qty}
                                        onChange={(e) =>
                                            handleRowChange(itemKey, idx, allocations, "qty", e.target.value)
                                        }
                                        className="w-full text-xs font-mono font-semibold p-2 pr-10 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase pointer-events-none">
                                        Units
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveWarehouseRow(itemKey, idx, allocations)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="pt-2 flex flex-wrap justify-between items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleAddWarehouseRow(item, itemKey)}
                            disabled={allocations.length >= warehouses.length}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <Plus className="w-3.5 h-3.5 text-indigo-600" /> Add Warehouse Split
                        </button>
                        <span className="text-xs text-slate-500">
                            Remaining Target: <strong className="font-mono">{stats.remainder}</strong>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-4 sm:space-y-6 w-full max-w-full mx-auto p-2 sm:p-6 font-sans text-slate-800 antialiased box-border overflow-hidden">
            {/* HEADER METRICS & BULK ACTIONS BANNER */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex gap-3.5 items-start min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                        <Warehouse className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                Commercial Warehouse Allocation
                            </h3>
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200 shrink-0">
                                {items.length} Items Enrolled
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                            Batch process or individually route inventory to destination hubs. Ensure target quantities match order requirements without exceeding storage limits.
                        </p>
                    </div>
                </div>

                {/* BULK AUTOMATION CONTROLS */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 shrink-0">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 hidden sm:inline">
                        Bulk Ops:
                    </span>
                    <button
                        type="button"
                        onClick={handleBulkAssignPrimary}
                        disabled={warehouses.length === 0}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> All to Primary Hub
                    </button>
                    <button
                        type="button"
                        onClick={handleBulkDistributeEvenly}
                        disabled={warehouses.length === 0}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-500" /> Split All Evenly
                    </button>
                </div>
            </div>

            {/* WAREHOUSES CAPACITY TRACKER */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                                <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
                                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                        {wh.name} <span className="text-slate-500 font-normal">({wh.code})</span>
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

            {/* ITEM ALLOCATION SECTION */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {/* TOOLBAR: SEARCH & STATUS FILTERING */}
                <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by SKU or product name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 sm:py-1.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                                className={`px-2.5 py-1.5 sm:py-1 rounded-lg font-semibold transition-colors cursor-pointer text-xs ${statusFilter === btn.id
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* RESPONSIVE LAYOUT 1: MOBILE CARDS VIEW (< md) */}
                <div className="block md:hidden divide-y divide-slate-200">
                    {filteredItems.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            No matching items found.
                        </div>
                    ) : (
                        filteredItems.map(({ item, key: itemKey }) => {
                            const stats = getItemStats(item);
                            const isExpanded = expandedItem === itemKey;
                            const allocations = item.allocations || [];

                            return (
                                <div key={itemKey} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2 min-w-0">
                                        <div className="min-w-0">
                                            <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-sm border border-slate-200 inline-block mb-1">
                                                {item.sku || "SKU-PROD"}
                                            </span>
                                            <h5 className="text-sm font-bold text-slate-900 leading-snug truncate">
                                                {item.desc || item.name || "Item Line"}
                                            </h5>
                                        </div>
                                        <StatusBadge stats={stats} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                                        <div>
                                            <span className="text-slate-500 block text-[11px]">Target Qty</span>
                                            <span className="font-mono font-bold text-slate-900">
                                                {stats.targetQty.toLocaleString()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-[11px]">Allocated Qty</span>
                                            <span
                                                className={`font-mono font-bold ${stats.isValid
                                                        ? "text-emerald-600"
                                                        : stats.isOverAllocated
                                                            ? "text-rose-600"
                                                            : "text-amber-600"
                                                    }`}
                                            >
                                                {stats.totalAllocated.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setExpandedItem(isExpanded ? null : itemKey)}
                                        className="w-full flex items-center justify-between p-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                                    >
                                        <span>
                                            {isExpanded ? "Hide Warehouses" : `Manage Warehouses (${allocations.length})`}
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </button>

                                    {isExpanded &&
                                        renderItemConfigPanel(item, itemKey, allocations, stats)}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* RESPONSIVE LAYOUT 2: DESKTOP TABLE VIEW (>= md) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 border-collapse">
                        <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                            <tr>
                                <th className="p-3.5">Product SKU / Line</th>
                                <th className="p-3.5 text-center">Target Qty</th>
                                <th className="p-3.5 text-center">Allocated</th>
                                <th className="p-3.5 text-center">Status</th>
                                <th className="p-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500 text-sm">
                                        No matching items found.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map(({ item, key: itemKey }) => {
                                    const stats = getItemStats(item);
                                    const isExpanded = expandedItem === itemKey;
                                    const allocations = item.allocations || [];

                                    return (
                                        <React.Fragment key={itemKey}>
                                            <tr className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-3.5 font-medium text-slate-900">
                                                    <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-sm border border-slate-200 mr-2">
                                                        {item.sku || "SKU-PROD"}
                                                    </span>
                                                    {item.desc || item.name || "Item Line"}
                                                </td>
                                                <td className="p-3.5 text-center font-mono font-bold text-slate-900">
                                                    {stats.targetQty.toLocaleString()}
                                                </td>
                                                <td className="p-3.5 text-center font-mono font-bold">
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
                                                <td className="p-3.5 text-center">
                                                    <StatusBadge stats={stats} />
                                                </td>
                                                <td className="p-3.5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => setExpandedItem(isExpanded ? null : itemKey)}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                                                    >
                                                        <span>Configure</span>
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <ChevronDown className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>

                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={5} className="p-4 bg-slate-100/50">
                                                        {renderItemConfigPanel(item, itemKey, allocations, stats)}
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