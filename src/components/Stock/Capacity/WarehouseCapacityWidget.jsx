import React from "react";

import SpaceUtilizationBar from "./SpaceUtilizationBar";
import ZoneBreakdown from "./ZoneBreakdown";

/**
 * WarehouseCapacityWidget
 * Main sidebar/dashboard analytic card aggregating facility space diagnostics.
 * Frames real-time macro utilization alongside isolated geographic sub-zones.
 */
const WarehouseCapacityWidget = ({
    totalUsed,
    totalCapacity,
    zones,
}) => {
    return (
        <div className="w-full bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden select-none">

            {/* ==========================================
               WIDGET COMPONENT HEADER BLOCK
               ========================================== */}
            <div className="flex items-center gap-2 px-4.5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                {/* Structural Facility Map Matrix Icon */}
                <svg
                    className="w-4 h-4 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                </svg>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Warehouse Capacity
                </h3>
            </div>

            {/* ==========================================
               WIDGET COMPONENT BODY CONTROLLER CONTAINER
               ========================================== */}
            <div className="flex flex-col gap-4 p-4.5">

                {/* OVERALL SPACE UTILIZATION MONITOR (Removes internal margin redundancy) */}
                <div className="[&>div]:shadow-none [&>div]:p-0 [&>div]:border-0">
                    <SpaceUtilizationBar
                        used={totalUsed}
                        total={totalCapacity}
                    />
                </div>

                {/* VISUAL DIVIDER SUBSECTION RULE LINE */}
                <span className="h-px w-full bg-slate-100" aria-hidden="true" />

                {/* GEOGRAPHIC REAL-TIME ZONE METRIC INDEX */}
                <div>
                    <ZoneBreakdown zones={zones} />
                </div>

            </div>

        </div>
    );
};

export default WarehouseCapacityWidget;