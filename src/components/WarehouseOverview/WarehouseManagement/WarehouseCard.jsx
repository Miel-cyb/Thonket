import React from "react";
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    Snowflake,
    Users,
    Edit2,
    Trash2,
    RotateCcw,
    CheckCircle2,
    XCircle,
    Package,
    UserPlus,
    ShieldCheck,
    Navigation,
    UserCog,
} from "lucide-react";

export default function WarehouseCard({
    warehouse,
    activeTab = "active",
    onOpenStaff,
    onToggleStatus,
    onEdit,
    onDelete,
    onRestore,
    onCardClick, // Optional custom navigation handler override
}) {
    const navigate = useNavigate();

    if (!warehouse) return null;

    const staffList = warehouse.staffAssignments || [];
    const primaryStaff = staffList.find((s) => s.isPrimary) || staffList[0];
    const maxCapacity = warehouse.storageCapacity?.maxPalletCapacity || 0;
    const currentOccupancy = warehouse.storageCapacity?.currentOccupancy || 0;
    const occupancyPercentage =
        maxCapacity > 0
            ? Math.min(Math.round((currentOccupancy / maxCapacity) * 100), 100)
            : 0;

    // Handle overall Card click for navigation to inventory
    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick(warehouse);
        } else {
            // Adjust path pattern here to match your router setup (e.g., `/inventory/${warehouse._id}`)
            navigate(`/inventory?warehouseId=${warehouse._id}`);
        }
    };

    const handleStaffClick = (e) => {
        e.stopPropagation(); // Prevents navigating to inventory when clicking staff
        onOpenStaff?.(warehouse);
    };

    const isActive = warehouse.status === "active";

    // Formatted location display string
    const locationName =
        [warehouse.address?.city, warehouse.address?.region]
            .filter(Boolean)
            .join(", ") || warehouse.name || "N/A";

    return (
        <div
            onClick={handleCardClick}
            className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
        >
            {/* Top Status Accent Line */}
            <div
                className={`h-1.5 w-full ${isActive ? "bg-emerald-500" : "bg-slate-300"
                    }`}
            />

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Header Block */}
                <div>
                    {/* Metadata Row */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="font-mono text-xs font-bold tracking-wider uppercase px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200">
                            {warehouse.code || "N/A"}
                        </span>

                        <div className="flex items-center gap-2">
                            {warehouse.storageFeatures?.hasColdStorage && (
                                <span
                                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 bg-sky-50 text-sky-800 border border-sky-200/70 rounded-full"
                                    title="Cold Storage Facility"
                                >
                                    <Snowflake className="w-3.5 h-3.5 text-sky-600" />
                                    Cold Storage
                                </span>
                            )}
                            <span
                                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-0.5 rounded-full border ${isActive
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                    }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"
                                        }`}
                                />
                                {warehouse.status
                                    ? warehouse.status.charAt(0).toUpperCase() +
                                    warehouse.status.slice(1)
                                    : "Inactive"}
                            </span>
                        </div>
                    </div>

                    {/* Warehouse Title & Location */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug">
                        {warehouse.name || "Unnamed Warehouse"}
                    </h3>

                    <p className="text-sm text-slate-600 flex items-start gap-1.5 mt-1.5 leading-relaxed">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">
                            {[
                                warehouse.address?.street,
                                warehouse.address?.city,
                                warehouse.address?.region,
                            ]
                                .filter(Boolean)
                                .join(", ") || "No address provided"}
                            {warehouse.address?.digitalAddress && (
                                <span className="text-slate-500 font-mono text-xs">
                                    {" "}
                                    ({warehouse.address.digitalAddress})
                                </span>
                            )}
                        </span>
                    </p>
                </div>

                {/* Metrics Box (Capacity & Location Name) */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                    {/* Capacity Section */}
                    <div>
                        <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
                            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                                <Package className="w-4 h-4 text-indigo-600" />
                                Storage Capacity
                            </span>
                            <span className="font-bold text-slate-900 font-mono text-sm">
                                {maxCapacity.toLocaleString()}{" "}
                                <span className="text-xs font-normal text-slate-500">
                                    Pallets
                                </span>
                            </span>
                        </div>

                        {/* Progress Bar */}
                        {currentOccupancy > 0 && (
                            <div className="space-y-1">
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${occupancyPercentage > 85
                                            ? "bg-amber-500"
                                            : "bg-indigo-600"
                                            }`}
                                        style={{ width: `${occupancyPercentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[11px] font-medium text-slate-500">
                                    <span>Occupancy</span>
                                    <span className="font-semibold text-slate-700">
                                        {occupancyPercentage}% ({currentOccupancy.toLocaleString()}{" "}
                                        used)
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Location Name Section */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                            <Navigation className="w-3.5 h-3.5 text-slate-400" />
                            Location
                        </span>
                        <span className="text-xs text-slate-700 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs truncate max-w-[180px]">
                            {locationName}
                        </span>
                    </div>
                </div>

                {/* Personnel Section */}
                <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-slate-400" />
                            Assigned Personnel ({staffList.length})
                        </span>
                        <button
                            type="button"
                            onClick={handleStaffClick}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                        >
                            <UserCog className="w-3.5 h-3.5" />
                            Manage Staff
                        </button>
                    </div>

                    {staffList.length > 0 ? (
                        <div
                            onClick={handleStaffClick}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer group/staff"
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                                    {primaryStaff.userId
                                        ? primaryStaff.userId.charAt(0).toUpperCase()
                                        : "U"}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-xs font-bold text-slate-900 truncate">
                                            {primaryStaff.userId}
                                        </p>
                                        {primaryStaff.isPrimary && (
                                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.2 rounded shrink-0">
                                                <ShieldCheck className="w-3 h-3 text-amber-600" /> Lead
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 truncate font-medium">
                                        {primaryStaff.role || "Staff Member"}
                                    </p>
                                </div>
                            </div>

                            {staffList.length > 1 && (
                                <span className="text-xs font-bold text-indigo-700 bg-indigo-100/80 border border-indigo-200 px-2.5 py-0.5 rounded-full shrink-0">
                                    +{staffList.length - 1} more
                                </span>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleStaffClick}
                            className="w-full py-2.5 px-3 border border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                            <UserPlus className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                            <span>Assign Staff Member</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Card Footer Toolbar */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                </span>

                <div className="flex items-center gap-1.5">
                    {activeTab === "active" ? (
                        <>
                            {/* Toggle Active/Inactive */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleStatus?.(warehouse);
                                }}
                                title={
                                    isActive ? "Deactivate Warehouse" : "Activate Warehouse"
                                }
                                className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${isActive
                                    ? "text-slate-700 bg-white border-slate-200 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-200"
                                    : "text-slate-700 bg-white border-slate-200 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200"
                                    }`}
                            >
                                {isActive ? (
                                    <>
                                        <XCircle className="w-4 h-4 text-slate-500" />
                                        <span>Deactivate</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-slate-500" />
                                        <span>Activate</span>
                                    </>
                                )}
                            </button>

                            {/* Edit Button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(warehouse);
                                }}
                                title="Edit Warehouse Details"
                                className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(warehouse._id);
                                }}
                                title="Delete Warehouse"
                                className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        /* Restore Button */
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRestore?.(warehouse._id);
                            }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-lg border border-emerald-200 transition-colors shadow-2xs"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Restore Warehouse
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}