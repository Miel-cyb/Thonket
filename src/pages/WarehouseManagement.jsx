import React, { useState, useEffect, useMemo } from "react";
import {
    Building2,
    Plus,
    SearchX,
    Loader2,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

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

export default function WarehouseManagement({ organizationId = "org_logistics_001" }) {
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
            // Simulated API Delay & Data Fetch
            await new Promise((resolve) => setTimeout(resolve, 600));

            const mockData = [
                {
                    _id: "wh_1",
                    organizationId,
                    name: "Accra Central Distribution Hub",
                    code: "ACC-HUB-01",
                    status: "active",
                    isDeleted: false,
                    address: {
                        street: "Plot 14 Heavy Industrial Area",
                        city: "Accra",
                        region: "Greater Accra",
                        digitalAddress: "GA-102-4589",
                    },
                    geoLocation: { coordinates: [-0.186964, 5.603717] },
                    storageCapacity: { maxPalletCapacity: 12500, currentOccupancy: 8400 },
                    storageFeatures: { hasColdStorage: true },
                    staffAssignments: [
                        { userId: "usr_sup_101", role: "Warehouse Supervisor", isPrimary: true, isActive: true },
                        { userId: "usr_log_104", role: "Inventory Lead", isPrimary: false, isActive: true },
                    ],
                },
                {
                    _id: "wh_2",
                    organizationId,
                    name: "Kumasi Cold Storage Depot",
                    code: "KMS-COLD-02",
                    status: "active",
                    isDeleted: false,
                    address: {
                        street: "Block B Kaase Industrial Zone",
                        city: "Kumasi",
                        region: "Ashanti",
                        digitalAddress: "AK-039-1120",
                    },
                    geoLocation: { coordinates: [-1.624411, 6.6666] },
                    storageCapacity: { maxPalletCapacity: 4800, currentOccupancy: 3900 },
                    storageFeatures: { hasColdStorage: true },
                    staffAssignments: [
                        { userId: "usr_sup_102", role: "Cold Chain Supervisor", isPrimary: true, isActive: true },
                    ],
                },
                {
                    _id: "wh_3",
                    organizationId,
                    name: "Takoradi Port Logistics Annex",
                    code: "TKD-PORT-03",
                    status: "inactive",
                    isDeleted: false,
                    address: {
                        street: "Harbour Commercial Belt",
                        city: "Takoradi",
                        region: "Western",
                        digitalAddress: "WS-012-9931",
                    },
                    geoLocation: { coordinates: [-1.754, 4.884] },
                    storageCapacity: { maxPalletCapacity: 8000, currentOccupancy: 0 },
                    storageFeatures: { hasColdStorage: false },
                    staffAssignments: [],
                },
                {
                    _id: "wh_4",
                    organizationId,
                    name: "Tema Export Transit Station",
                    code: "TMA-EXP-04",
                    status: "inactive",
                    isDeleted: true, // Soft-deleted item
                    address: {
                        street: "Community 2 Logistics Park",
                        city: "Tema",
                        region: "Greater Accra",
                        digitalAddress: "GT-004-1182",
                    },
                    geoLocation: { coordinates: [0.00, 5.67] },
                    storageCapacity: { maxPalletCapacity: 6000, currentOccupancy: 0 },
                    storageFeatures: { hasColdStorage: false },
                    staffAssignments: [],
                },
            ];
            setWarehouses(mockData);
        } catch (err) {
            console.error("Failed to fetch warehouses:", err);
            setError("Failed to load facilities. Please try again.");
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
            const matchesTab = activeTab === "deleted" ? wh.isDeleted : !wh.isDeleted;
            if (!matchesTab) return false;

            // Search condition
            const query = searchTerm.trim().toLowerCase();
            const matchesSearch =
                !query ||
                wh.name?.toLowerCase().includes(query) ||
                wh.code?.toLowerCase().includes(query) ||
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

                    // If new staff is primary, demote existing primary assignment
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
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-10 font-sans text-slate-800">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-pulse"
                            >
                                <div className="h-4 bg-slate-200 rounded w-1/3" />
                                <div className="h-6 bg-slate-200 rounded w-3/4" />
                                <div className="h-4 bg-slate-200 rounded w-1/2" />
                                <div className="h-24 bg-slate-100 rounded-xl" />
                                <div className="h-10 bg-slate-200 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center max-w-lg mx-auto my-12">
                        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-rose-900">{error}</h3>
                        <button
                            type="button"
                            onClick={fetchWarehouses}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
                        </button>
                    </div>
                ) : filteredWarehouses.length === 0 ? (
                    /* Empty Results State */
                    <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 shadow-xs">
                        {searchTerm || statusFilter !== "all" ? (
                            <>
                                <SearchX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-slate-800">
                                    No Matching Facilities Found
                                </h3>
                                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                                    No facilities match your search criteria. Try adjusting your query or resetting filters.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("all");
                                    }}
                                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    Reset Search & Filters
                                </button>
                            </>
                        ) : activeTab === "deleted" ? (
                            <>
                                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-slate-800">
                                    No Deactivated Facilities
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    There are currently no archived or deactivated warehouses in the repository.
                                </p>
                            </>
                        ) : (
                            <>
                                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-slate-800">
                                    No Active Facilities
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    Get started by adding your organization's first warehouse facility.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleOpenCreateModal}
                                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" /> Add New Warehouse
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    /* Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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