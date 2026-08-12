import React, { useState } from "react";
import {
    FileText,
    Truck,
    PackageCheck,
    AlertCircle,
    CheckCircle2,
    User,
    Building2,
    DollarSign,
    CornerDownLeft,
    Hash,
    Clock,
    CreditCard,
    MapPin,
    History,
    ArrowRight
} from "lucide-react";

import CycleStateControl, { STAGES } from "../components/PurchaseForm/CycleStateControl";
import { API_ENDPOINTS } from "../utils/urls";

export default function PurchaseOrderDetailView({
    selectedPO,
    onClose,
    onUpdateCycleState
}) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    // Guard fallback state
    if (!selectedPO) {
        return (
            <div className="flex h-full flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-3xl border border-slate-200">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <FileText size={24} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">No Document Context Selected</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                    Select an entry from the procurement pipeline matrix to inspect active records.
                </p>
            </div>
        );
    }

    const poId = selectedPO._id || "N/A";
    const purchaseApi = `${API_ENDPOINTS.PURCHASE_ORDERS}/${poId}/cycle`;

    // Structural Extraction Mapping based on Backend Payloads
    const supplierDisplayName = selectedPO.context?.title || "Bulk Procurement Node";
    const orderType = selectedPO.context?.type || "Standard Restock";
    const currentStage = selectedPO.cycleState || "requested";
    const items = selectedPO.items || [];
    const pricing = selectedPO.pricing || { totalCost: 0, currency: "GHS" };
    const logistics = selectedPO.logistics || {};
    const payment = selectedPO.payment || {};
    const allocations = selectedPO.allocations || [];
    const stateHistory = selectedPO.stateHistory || [];

    // Metadata Handlers
    const coordinatorName = selectedPO.createdBy?.username || "System Broker";
    const priorityLevel = selectedPO.intent?.priority || "routine";
    const documentStatus = selectedPO.documentStatus || "submitted";

    const formatCurrency = (amount, code = "GHS") => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: code,
        }).format(amount);
    };

    const formatDate = (isoString) => {
        if (!isoString) return "Not Scheduled";
        return new Date(isoString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // PATCH Request Handler for Cycle State Transitions
    const handleStateTransition = async (nextState) => {
        setIsUpdating(true);
        setUpdateError(null);

        // Dummy User Payload Data
        const dummyUser = {
            userId: "usr_9988776655",
            username: "Alex Morgan",
            userrole: "Procurement Manager"
        };

        try {
            const token = localStorage.getItem("token"); // Retrieve JWT token if applicable

            const response = await fetch(purchaseApi, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                body: JSON.stringify({
                    cycleState: nextState,
                    userId: dummyUser.userId,
                    username: dummyUser.username,
                    userRole: dummyUser.userrole
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to update state (${response.status})`);
            }

            const updatedPO = await response.json();

            console.log('this is the updated purchase order after state transition:', updatedPO);

            // Notify parent listener to refresh UI or update list state
            if (onUpdateCycleState) {
                await onUpdateCycleState(poId, nextState, updatedPO);
            }
        } catch (err) {
            console.error("State transition PATCH request failed:", err);
            setUpdateError(err.message || "Failed to execute state transition.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex h-full min-h-0 flex-col rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">

            {/* STICKY TOP ACTIONS BAR */}
            <div className="shrink-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95 shrink-0"
                        title="Back to Grid"
                    >
                        <CornerDownLeft size={18} />
                    </button>
                    <div className="min-w-0">
                        <div className="flex items-center flex-wrap gap-2">
                            <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold tracking-tight border border-slate-200">
                                PO #{String(poId).slice(-8).toUpperCase()}
                            </span>
                            <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border ${currentStage === 'has_issues' || currentStage === 'cancelled'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                }`}>
                                {currentStage.replace('_', ' ')}
                            </span>
                            <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border ${priorityLevel === 'critical'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                                }`}>
                                {priorityLevel}
                            </span>
                        </div>
                        <h1 className="text-lg font-bold text-slate-900 mt-1 truncate max-w-md">
                            {supplierDisplayName}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {updateError && (
                        <div className="text-xs font-medium text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1.5">
                            <AlertCircle size={14} />
                            <span>{updateError}</span>
                        </div>
                    )}
                    {isUpdating && (
                        <div className="text-xs font-medium text-indigo-600 bg-indigo-50/60 px-3 py-1.5 rounded-xl border border-indigo-100 flex items-center gap-2 animate-pulse">
                            <Clock size={14} className="animate-spin" />
                            <span>Synchronizing Ledger Status...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* DUAL WORKSPACE BODY LAYOUT */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200 overflow-hidden bg-slate-50/40">

                {/* LEFT BLOCK: DATA CORE VISUALIZER PANEL */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* CORE LEDGER DATA GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                            <div className="h-11 w-11 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-100">
                                <Building2 size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allocation Flow</p>
                                <p className="text-sm font-semibold text-slate-800 truncate mt-0.5">{orderType}</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                                <DollarSign size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Valuation</p>
                                <p className="text-sm font-bold text-emerald-700 mt-0.5">{formatCurrency(pricing.totalCost, pricing.currency)}</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                            <div className="h-11 w-11 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-100">
                                <User size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coordinator Origin</p>
                                <p className="text-sm font-semibold text-slate-800 truncate mt-0.5">{coordinatorName}</p>
                            </div>
                        </div>
                    </div>

                    {/* EXTENDED SPECIFICATIONS (LOGISTICS & FINANCIAL TERMS) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Logistics Summary */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
                                <Truck size={16} className="text-slate-400" /> Logistics Strategy
                            </h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
                                <div>
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wide">Delivery Mode</span>
                                    <span className="font-semibold text-slate-700 capitalize mt-0.5 block">{String(logistics.deliveryType || "N/A").replace('_', ' ')}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wide">Destination Node</span>
                                    <span className="font-semibold text-slate-700 mt-0.5 block">{logistics.destination || "Central Hub"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wide">Est. Dispatch</span>
                                    <span className="font-medium text-slate-600 mt-0.5 block">{formatDate(logistics.expectedDispatchDate)}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wide">Est. Delivery</span>
                                    <span className="font-medium text-slate-600 mt-0.5 block">{formatDate(logistics.expectedDeliveryDate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Financial Ledger Terms */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
                                <CreditCard size={16} className="text-slate-400" /> Settlement Parameters
                            </h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
                                <div>
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wide">Payment Routing</span>
                                    <span className="font-bold text-slate-700 uppercase font-mono text-[11px] mt-0.5 block">{String(payment.method || "N/A").replace('_', ' ')}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wide">Agreed Terms</span>
                                    <span className="font-semibold text-slate-700 capitalize mt-0.5 block">{payment.terms || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wide">Downpayment</span>
                                    <span className="font-bold text-indigo-600 mt-0.5 block">{payment.advance || 0}%</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wide">Document Registry</span>
                                    <span className="font-semibold text-slate-700 capitalize mt-0.5 block">{documentStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ITEMIZED COMPONENT MATRICES */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                <Hash size={14} className="text-slate-400" /> Line-Item Ledger ({items.length})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            {items.length === 0 ? (
                                <p className="text-xs text-slate-400 p-6 text-center italic">No items found in this document payload manifest.</p>
                            ) : (
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="text-[10px] font-bold uppercase text-slate-400 bg-slate-50/50 border-b border-slate-200">
                                            <th className="px-5 py-3">Item Identity Description</th>
                                            <th className="px-5 py-3 text-center">UOM</th>
                                            <th className="px-5 py-3 text-center">Qty Ordered</th>
                                            <th className="px-5 py-3 text-right">Unit Net Cost</th>
                                            <th className="px-5 py-3 text-right">Line Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                        {items.map((item, idx) => (
                                            <tr key={item._id || idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="font-semibold text-slate-800">{item.productName || "Unnamed Asset"}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.sku || "SKU-UNKNOWN"}</div>
                                                </td>
                                                <td className="px-5 py-3.5 text-center text-slate-500 font-medium font-mono text-[11px]">{item.unitOfMeasure || "PCS"}</td>
                                                <td className="px-5 py-3.5 text-center font-bold text-slate-800">{item.qtyOrdered || 0}</td>
                                                <td className="px-5 py-3.5 text-right font-medium text-slate-600">{formatCurrency(item.unitPrice || 0, pricing.currency)}</td>
                                                <td className="px-5 py-3.5 text-right font-bold text-slate-900">{formatCurrency(item.lineTotal || 0, pricing.currency)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* ROUTING WAREHOUSE ALLOCATIONS */}
                    {allocations.length > 0 && (
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                                <MapPin size={16} className="text-slate-400" /> Storage Hub Network Allocations
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {allocations.map((alloc, idx) => {
                                    const matchingItem = items.find(i => i.itemId === alloc.itemId);
                                    return (
                                        <div key={alloc._id || idx} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="min-w-0 pr-2">
                                                <span className="font-semibold text-slate-800 text-xs block truncate">{matchingItem?.productName || "Product Reference"}</span>
                                                <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase mt-0.5 block">{alloc.warehouseName}</span>
                                            </div>
                                            <div className="shrink-0">
                                                <span className="text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg shadow-sm border border-slate-200">
                                                    {alloc.quantity} Units
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* LIVE TRACKING WORKFLOW TIMELINE */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" /> Active Stage Tracking Lifecycle
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 relative">
                            {STAGES.map((stg, stageIndex) => {
                                const IconComp = stg.icon;
                                const currentIndex = STAGES.findIndex(s => s.key === currentStage);
                                const isPassedOrCurrent = currentIndex >= stageIndex;
                                const isCurrent = currentStage === stg.key;

                                return (
                                    <div key={stg.key} className="flex flex-col items-center text-center p-3 rounded-xl border border-transparent bg-slate-50/50 relative">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${isCurrent
                                            ? currentStage === "cancelled"
                                                ? "bg-rose-600 text-white ring-4 ring-rose-100 shadow-md scale-105"
                                                : "bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md scale-105"
                                            : isPassedOrCurrent
                                                ? "bg-slate-800 text-white"
                                                : "bg-slate-100 text-slate-400 border border-slate-200"
                                            }`}>
                                            <IconComp size={16} />
                                        </div>
                                        <p className={`text-[11px] font-bold mt-2.5 line-clamp-1 ${isCurrent
                                            ? currentStage === "cancelled" ? 'text-rose-600 font-black' : 'text-indigo-600 font-black'
                                            : isPassedOrCurrent ? 'text-slate-800' : 'text-slate-400'
                                            }`}>
                                            {stg.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* HISTORICAL STATE REGISTRY LOG */}
                    {stateHistory.length > 0 && (
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                                <History size={16} className="text-slate-400" /> Audit Lifecycle Registry
                            </h3>
                            <div className="divide-y divide-slate-100">
                                {stateHistory.map((history, idx) => (
                                    <div key={history._id || idx} className="py-3 text-xs flex justify-between items-start gap-4 hover:bg-slate-50/40 px-2 rounded-lg transition-colors">
                                        <div>
                                            <p className="font-semibold text-slate-800">{history.note || "State Transition Triggered"}</p>
                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                Authorized by: <span className="font-medium font-mono text-slate-700 bg-slate-100 px-1 py-0.25 rounded">{history.changedBy?.username || "System Node"}</span>
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-[10px] font-mono text-slate-400 block">{formatDate(history.changedAt)}</span>
                                            <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded font-bold uppercase tracking-tight mt-1 border border-slate-200">
                                                to <ArrowRight size={10} /> {history.to}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT BLOCK: EXTRACTED CONTEXT STATE ACTION PANEL */}
                <CycleStateControl
                    currentStage={currentStage}
                    isUpdating={isUpdating}
                    onHandleStateTransition={handleStateTransition}
                />

            </div>
        </div>
    );
}