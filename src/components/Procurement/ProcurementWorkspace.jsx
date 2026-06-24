import React from "react";

import PurchaseRequestsView from "./PurchaseRequestsView";
import ApprovedOrdersView from "./ApprovedOrdersView";
import InTransitView from "./InTransitView";
import WarehouseReceivingView from "./WarehouseReceivingView";
import ReceivingIssuesView from "./ReceivingIssuesView"; // <-- INJECTED VIEW IMPORT
import CompletedView from "./CompletedView";

// PROCUREMENT WORKSPACE - FULL HEIGHT FLUID LAYOUT
export default function ProcurementWorkspace({
    activeStage,
    purchaseOrders = [], // Injected from main layout pipeline hook
    selectedPO,          // State context management 
    setSelectedPO,        // State modifier callback interaction
}) {

    // --- TRUE DATA STATE FILTER ENGINE ---
    // Evaluates database document structures to isolate array segments by operational stage
    const stageFilteredOrders = React.useMemo(() => {
        if (!Array.isArray(purchaseOrders)) return [];

        switch (activeStage) {
            case "requests":
                return purchaseOrders.filter(o => o.cycleState === "requested");
            case "approved":
                return purchaseOrders.filter(o => o.cycleState === "approved");
            case "transit":
                return purchaseOrders.filter(o => o.cycleState === "in_transit");
            case "receiving":
                // Ingests orders matching pending receiving configurations
                return purchaseOrders.filter(o => o.receiving?.status === "pending" && o.cycleState !== "has_issues");
            case "issues":
                // Isolates records explicitly flag-marked with terminal arrival or mismatch discrepancies
                return purchaseOrders.filter(o => o.cycleState === "has_issues" || o.cycleState === "under_review" || o.receiving?.status === "discrepancy");
            case "completed":
                return purchaseOrders.filter(o => o.cycleState === "completed" || o.documentStatus === "closed");
            default:
                return purchaseOrders;
        }
    }, [purchaseOrders, activeStage]);

    // --- CONDITIONAL STAGE VIEW INJECTION ROUTER ---
    const renderView = () => {
        // Construct common shared data packet properties
        const viewProps = {
            orders: stageFilteredOrders,
            selectedPO,
            setSelectedPO
        };

        switch (activeStage) {
            case "requests":
                return <PurchaseRequestsView {...viewProps} />;

            case "approved":
                return <ApprovedOrdersView {...viewProps} />;

            case "transit":
                return <InTransitView {...viewProps} />;

            case "receiving":
                return <WarehouseReceivingView {...viewProps} />;

            case "issues":
                return <ReceivingIssuesView {...viewProps} />; // <-- NEW INJECTION PIPELINE TARGET

            case "completed":
                return <CompletedView {...viewProps} />;

            default:
                return (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <p className="text-sm font-medium">Unknown stage pipeline target index requested.</p>
                    </div>
                );
        }
    };

    // Helper utilities to align upper text styles with the global navigator configurations
    const getStageBadgeStyles = () => {
        switch (activeStage) {
            case "requests": return "text-slate-700 bg-slate-50 border-slate-200/60";
            case "approved": return "text-emerald-700 bg-emerald-50/70 border-emerald-100";
            case "transit": return "text-blue-700 bg-blue-50/70 border-blue-100";
            case "receiving": return "text-amber-700 bg-amber-50/70 border-amber-100";
            case "issues": return "text-rose-700 bg-rose-50 border-rose-100";
            case "completed": return "text-emerald-700 bg-emerald-50/70 border-emerald-100";
            default: return "text-indigo-600 bg-indigo-50/70 border-indigo-100";
        }
    };

    return (
        <div className="h-full min-h-0 w-full flex flex-col bg-slate-50/40">

            {/* INNER WRAPPER (FLUID CANVAS SHEET LAYER) */}
            <div className="flex h-full min-h-0 w-full flex-col rounded-3xl border border-slate-200/60 bg-white shadow-xs overflow-hidden">

                {/* HEADER STRIP (METADATA DYNAMIC GLANCE VIEW) */}
                <div className="shrink-0 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-white px-5 py-3.5">

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <span className={`h-2 w-2 rounded-full animate-pulse ${activeStage === "issues" ? "bg-rose-500" : "bg-indigo-500"}`} />
                        <span>Active Procurement Matrix</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200/40">
                            {stageFilteredOrders.length} {stageFilteredOrders.length === 1 ? 'Record' : 'Records'} Detected
                        </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-medium">
                        Stage Pipeline Target:{" "}
                        <span className={`font-bold border px-2 py-0.5 rounded-md ml-1 tracking-wide uppercase text-[10px] ${getStageBadgeStyles()}`}>
                            {activeStage === "issues" ? "Receiving Issues" : activeStage}
                        </span>
                    </div>
                </div>

                {/* CONTENT AREA (PERFORMANCE CONTAINED SCROLLABLE WORKSPACE) */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    <div className="h-full overflow-y-auto p-5 bg-white">
                        {renderView()}
                    </div>
                </div>

            </div>
        </div>
    );
}