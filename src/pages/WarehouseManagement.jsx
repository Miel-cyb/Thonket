import React, { useState, useEffect, useMemo } from "react";
import {
    Building2,
    Plus,
    SearchX,
    Loader2,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

import { API_ENDPOINTS } from "../../src/utils/urls";
import WarehouseHeader from "../components/WarehouseOverview/WarehouseManagement/WarehouseHeader";
import WarehouseFilters from "../components/WarehouseOverview/WarehouseManagement/WarehouseFilters";
import WarehouseCard from "../components/WarehouseOverview/WarehouseManagement/WarehouseCard";
import WarehouseFormModal from "../components/WarehouseOverview/WarehouseManagement/WarehouseFormModal";
import StaffAssignmentModal from "../components/WarehouseOverview/WarehouseManagement/StaffAssignmentModal";

const initialFormState = {
    name: "",
    code: "",
    status: "active",
    address: {
        street: "",
        city: "",
        region: "",
        digitalAddress: "",
    },
    geoLocation: {
        coordinates: [0, 0],
    },
    storageCapacity: {
        maxPalletCapacity: 0,
        currentOccupancy: 0,
    },
    storageFeatures: {
        hasColdStorage: false,
    },
};

export default function WarehouseManagement({ organizationId = "Thonket-1233" }) {
    // Main Data & UI States
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter & View States
    const [activeTab, setActiveTab] = useState("active"); // "active" | "deleted"
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Modal Visibility States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isStaffOpen, setIsStaffOpen] = useState(false);

    // Form & Staff States
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [formData, setFormData] = useState(initialFormState);
    const [selectedWarehouseForStaff, setSelectedWarehouseForStaff] = useState(null);
    const [newStaff, setNewStaff] = useState({ userId: "", role: "", isPrimary: false });

    // ---------------------------------------------------------------------------
    // Data Fetching
    // ---------------------------------------------------------------------------
    const fetchWarehouses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${API_ENDPOINTS.WAREHOUSES}/${encodeURIComponent(organizationId)}`
            );

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Extract items array from response wrapper
            const list = Array.isArray(data)
                ? data
                : data.items || data.warehouses || data.data || [];

            setWarehouses(list);
        } catch (err) {
            console.error("Failed to fetch warehouses:", err);
            setError("Failed to load facilities. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, [organizationId]);

    // Reset sub-filters when tab changes
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm("");
        setStatusFilter("all");
    };

    // ---------------------------------------------------------------------------
    // Computed Values & Tab Counts
    // ---------------------------------------------------------------------------
    const counts = useMemo(() => {
        const active = warehouses.filter((wh) => !wh.isDeleted).length;
        const deleted = warehouses.filter((wh) => wh.isDeleted).length;
        return { active, deleted };
    }, [warehouses]);

    const filteredWarehouses = useMemo(() => {
        return warehouses.filter((wh) => {
            // Tab condition
            const matchesTab = activeTab === "deleted" ? Boolean(wh.isDeleted) : !wh.isDeleted;
            if (!matchesTab) return false;

            // Search condition
            const query = searchTerm.trim().toLowerCase();
            const matchesSearch =
                !query ||
                wh.name?.toLowerCase().includes(query) ||
                wh.code?.toLowerCase().includes(query) ||
                wh.address?.street?.toLowerCase().includes(query) ||
                wh.address?.city?.toLowerCase().includes(query) ||
                wh.address?.region?.toLowerCase().includes(query) ||
                wh.address?.digitalAddress?.toLowerCase().includes(query);

            // Operational status filter (Active tab only)
            const matchesStatus =
                activeTab === "deleted" ||
                statusFilter === "all" ||
                wh.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [warehouses, activeTab, searchTerm, statusFilter]);

    // ---------------------------------------------------------------------------
    // Event Handlers (Form & Modal Operations)
    // ---------------------------------------------------------------------------
    const handleOpenCreateModal = () => {
        setEditingWarehouse(null);
        setFormData(initialFormState);
        setIsFormOpen(true);
    };

    const handleOpenEditModal = (warehouse) => {
        setEditingWarehouse(warehouse);
        setFormData({
            name: warehouse.name || "",
            code: warehouse.code || "",
            status: warehouse.status || "active",
            address: {
                street: warehouse.address?.street || "",
                city: warehouse.address?.city || "",
                region: warehouse.address?.region || "",
                digitalAddress: warehouse.address?.digitalAddress || "",
            },
            geoLocation: {
                coordinates: warehouse.geoLocation?.coordinates || [0, 0],
            },
            storageCapacity: {
                maxPalletCapacity: warehouse.storageCapacity?.maxPalletCapacity || 0,
                currentOccupancy: warehouse.storageCapacity?.currentOccupancy || 0,
            },
            storageFeatures: {
                hasColdStorage: Boolean(warehouse.storageFeatures?.hasColdStorage),
            },
        });
        setIsFormOpen(true);
    };

    const handleSaveWarehouse = async (e) => {
        e.preventDefault();
        try {
            if (editingWarehouse) {
                // Update Existing Warehouse
                setWarehouses((prev) =>
                    prev.map((wh) =>
                        wh._id === editingWarehouse._id
                            ? { ...wh, ...formData }
                            : wh
                    )
                );
            } else {
                // Create New Warehouse
                const newFacility = {
                    ...formData,
                    _id: `wh_${Date.now()}`,
                    organizationId,
                    isDeleted: false,
                    staffAssignments: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                setWarehouses((prev) => [newFacility, ...prev]);
            }
            setIsFormOpen(false);
        } catch (err) {
            console.error("Error saving warehouse:", err);
        }
    };

    const handleToggleStatus = (warehouse) => {
        const nextStatus = warehouse.status === "active" ? "inactive" : "active";
        setWarehouses((prev) =>
            prev.map((wh) =>
                wh._id === warehouse._id ? { ...wh, status: nextStatus } : wh
            )
        );
    };

    const handleDelete = (id) => {
        if (
            window.confirm(
                "Are you sure you want to deactivate and archive this facility?"
            )
        ) {
            setWarehouses((prev) =>
                prev.map((wh) =>
                    wh._id === id ? { ...wh, isDeleted: true } : wh
                )
            );
        }
    };

    const handleRestore = (id) => {
        setWarehouses((prev) =>
            prev.map((wh) =>
                wh._id === id ? { ...wh, isDeleted: false, status: "active" } : wh
            )
        );
    };

    // ---------------------------------------------------------------------------
    // Staff Operations
    // ---------------------------------------------------------------------------
    const handleOpenStaffModal = (warehouse) => {
        setSelectedWarehouseForStaff(warehouse);
        setIsStaffOpen(true);
    };

    const handleCloseStaffModal = () => {
        setIsStaffOpen(false);
        setSelectedWarehouseForStaff(null);
        setNewStaff({ userId: "", role: "", isPrimary: false });
    };

    const handleAddStaff = (e) => {
        e.preventDefault();
        if (!selectedWarehouseForStaff || !newStaff.userId) return;

        setWarehouses((prev) =>
            prev.map((wh) => {
                if (wh._id === selectedWarehouseForStaff._id) {
                    const existingAssignments = wh.staffAssignments || [];

                    // Demote existing primary assignment if new staff is primary
                    const updatedAssignments = existingAssignments.map((s) =>
                        newStaff.isPrimary ? { ...s, isPrimary: false } : s
                    );

                    return {
                        ...wh,
                        staffAssignments: [
                            ...updatedAssignments,
                            { ...newStaff, isActive: true },
                        ],
                    };
                }
                return wh;
            })
        );

        handleCloseStaffModal();
    };

    return (
        <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans text-slate-800 antialiased">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Toolbar */}
                <WarehouseHeader onAddClick={handleOpenCreateModal} />

                {/* Filter and Tab Navigation */}
                <WarehouseFilters
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    counts={counts}
                    onResetFilters={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                    }}
                />

                {/* Main Content Area */}
                {loading ? (
                    /* Skeleton Loading Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div
                                key={n}
                                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 animate-pulse flex flex-col justify-between h-64"
                            >
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="h-4 bg-slate-200 rounded-md w-1/4" />
                                        <div className="h-5 bg-slate-100 rounded-full w-16" />
                                    </div>
                                    <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                                    <div className="h-3.5 bg-slate-100 rounded-md w-1/2" />
                                </div>
                                <div className="h-20 bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-2">
                                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                                    <div className="h-2 bg-slate-200 rounded-full w-full" />
                                </div>
                                <div className="h-9 bg-slate-100 rounded-xl w-full" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-8 text-center max-w-md mx-auto my-12 shadow-xs">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{error}</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-5">
                            There was an issue loading the warehouse repository.
                        </p>
                        <button
                            type="button"
                            onClick={fetchWarehouses}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
                        </button>
                    </div>
                ) : filteredWarehouses.length === 0 ? (
                    /* Empty Results State */
                    <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200/80 shadow-xs max-w-2xl mx-auto my-6">
                        {searchTerm || statusFilter !== "all" ? (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                                    <SearchX className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">
                                    No Matching Facilities Found
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                                    No facilities match your active search filters. Try clearing your search term or status filter.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("all");
                                    }}
                                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50/80 border border-indigo-100 hover:bg-indigo-100/80 rounded-xl transition-colors cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : activeTab === "deleted" ? (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">
                                    No Deactivated Facilities
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    There are currently no archived or deactivated warehouses in the repository.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">
                                    No Active Facilities
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                                    Get started by creating your organization's first warehouse facility.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleOpenCreateModal}
                                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" /> Add New Warehouse
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredWarehouses.map((wh) => (
                            <WarehouseCard
                                key={wh._id}
                                warehouse={wh}
                                activeTab={activeTab}
                                onOpenStaff={handleOpenStaffModal}
                                onToggleStatus={handleToggleStatus}
                                onEdit={handleOpenEditModal}
                                onDelete={handleDelete}
                                onRestore={handleRestore}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Warehouse Create / Edit Modal */}
            <WarehouseFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSaveWarehouse}
                formData={formData}
                setFormData={setFormData}
                isEditing={Boolean(editingWarehouse)}
            />

            {/* Staff Assignment Modal */}
            <StaffAssignmentModal
                isOpen={isStaffOpen}
                onClose={handleCloseStaffModal}
                warehouse={selectedWarehouseForStaff}
                newStaff={newStaff}
                setNewStaff={setNewStaff}
                onAddStaff={handleAddStaff}
            />
        </div>
    );
}