import React from "react";
import {
    Truck,
    MapPin,
    Clock,
    ArrowUpRight,
    MoreHorizontal,
    Navigation,
    PackageX,
} from "lucide-react";

// IN TRANSIT VIEW - LIVE LOGISTICS WORKSPACE ENGINE
export default function InTransitView({ orders = [], selectedPO, setSelectedPO }) {

    // Helper to extract or parse delivery estimations safely
    const formatDeliveryEta = (dateString) => {
        if (!dateString) return "Pending Updates";
        const targetDate = new Date(dateString);

        // Handle fallback if the backend provides a pre-formatted semantic string (e.g., "2 days")
        if (isNaN(targetDate.getTime())) return dateString;

        // Otherwise format standard ISO timestamps into clean, human-readable dates
        return targetDate.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit"
        });
    };

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-lg">

            {/* HEADER */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white px-5 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100">
                            <Truck size={20} className="text-blue-700" />
                        </div>

                        <div>
                            <h2 className="text-base font-bold tracking-tight text-slate-900">
                                In Transit
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Shipments currently moving through the supply chain.
                            </p>
                        </div>
                    </div>

                    {/* LIVE STATUS */}
                    <div className="hidden md:flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-semibold text-blue-700">
                            {orders.length} Active Tracks
                        </span>
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-auto bg-slate-50/40 p-4">
                {orders.length === 0 ? (
                    /* EMPTY LIVE PIPELINE STATE */
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-6 my-2">
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-2">
                            <PackageX size={18} />
                        </div>
                        <h4 className="text-xs font-bold text-slate-700">No Shipments on Route</h4>
                        <p className="text-[11px] text-slate-400 max-w-[240px] mt-0.5">
                            Freight manifests will auto-populate here as soon as approved purchase orders clear carrier dispatch.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const tracking = order.shipmentTracking || {};
                            const carrierLabel = tracking.carrier || "Standard Freight";
                            const isSelected = selectedPO?._id === order._id;

                            // Check variant for conditional styling matching your previous structure
                            const currentStatus = tracking.status || "on_route";
                            const isArrivingSoon = currentStatus === "arriving" || currentStatus === "out_for_delivery";

                            return (
                                <div
                                    key={order._id}
                                    onClick={() => setSelectedPO?.(order)}
                                    className={`
                                        group rounded-2xl border p-4 transition-all duration-200 cursor-pointer
                                        ${isSelected
                                            ? "border-blue-600 bg-blue-50/20 shadow-md ring-1 ring-blue-600/10"
                                            : "border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
                                        }
                                    `}
                                >
                                    <div className="flex items-start justify-between gap-3">

                                        {/* LEFT INFORMATION WRAPPER */}
                                        <div className="flex items-start gap-4 min-w-0">
                                            {/* ICON */}
                                            <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 transition-colors group-hover:bg-blue-100">
                                                <Navigation size={18} className="text-blue-600 rotate-45" />
                                            </div>

                                            {/* DETAILS */}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-sm font-bold text-slate-900 truncate">
                                                        {order.context?.title || `${carrierLabel} Assignment`}
                                                    </h3>
                                                    <ArrowUpRight
                                                        size={14}
                                                        className="text-slate-300 transition-colors group-hover:text-slate-600 shrink-0"
                                                    />
                                                </div>

                                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 font-medium text-slate-600 border border-slate-200/40">
                                                        <Clock size={12} className="text-slate-400" />
                                                        ETA: {formatDeliveryEta(tracking.estimatedDelivery)}
                                                    </span>

                                                    <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600 border border-slate-200/40">
                                                        <MapPin size={12} className="text-slate-400" />
                                                        {order._id?.slice(-6).toUpperCase() || "MAN-TRK"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT STATUS STICKER */}
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span
                                                className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide border ${isArrivingSoon
                                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                    : "bg-blue-100 text-blue-700 border-blue-200"
                                                    }`}
                                            >
                                                {currentStatus.replace(/_/g, " ").toUpperCase()}
                                            </span>

                                            {/* ACTION LINK TRIPPERS */}
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                                            >
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                                                    <MoreHorizontal size={16} />
                                                </div>
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="h-2" />
            </div>
        </div>
    );
}