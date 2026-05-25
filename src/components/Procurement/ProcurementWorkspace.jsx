import React from "react";

import PurchaseRequestsView from "./PurchaseRequestsView";
import ApprovedOrdersView from "./ApprovedOrdersView";
import InTransitView from "./InTransitView";
import WarehouseReceivingView from "./WarehouseReceivingView";
import CompletedView from "./CompletedView";

// PROCUREMENT WORKSPACE - FULL HEIGHT FLUID LAYOUT (FIXED)
export default function ProcurementWorkspace({
    activeStage,
    scanMode,
    onScan,
    lastScannedItem,
}) {

    const renderView = () => {
        switch (activeStage) {

            case "requests":
                return <PurchaseRequestsView />;

            case "approved":
                return <ApprovedOrdersView />;

            case "transit":
                return <InTransitView />;

            case "receiving":
                return (
                    <WarehouseReceivingView
                        scanMode={scanMode}
                        onScan={onScan}
                        lastScannedItem={lastScannedItem}
                    />
                );

            case "completed":
                return <CompletedView />;

            default:
                return null;
        }
    };

    return (
        <div className="h-full min-h-0 w-full flex flex-col bg-slate-50/40">

            {/* INNER WRAPPER (NOW FLUID, NOT CLAMPED) */}
            <div className="flex h-full min-h-0 w-full flex-col rounded-3xl border border-slate-200/60 bg-white shadow-lg overflow-hidden">

                {/* HEADER STRIP (FIXED HEIGHT, NO LAYOUT BREAKING) */}
                <div className="shrink-0 flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-white px-5 py-3">

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
                        Active Procurement Module
                    </div>

                    <div className="text-[11px] text-slate-400">
                        Stage:{" "}
                        <span className="font-semibold text-slate-700">
                            {activeStage?.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* CONTENT AREA (ONLY SCROLLABLE REGION) */}
                <div className="flex-1 min-h-0 overflow-hidden">

                    <div className="h-full overflow-y-auto p-5">

                        {renderView()}

                    </div>
                </div>

            </div>
        </div>
    );
}