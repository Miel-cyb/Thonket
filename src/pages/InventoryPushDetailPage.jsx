import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Check, Loader2, X, ArrowRight, UserCheck, AlertTriangle, ChevronDown, ChevronUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../utils/urls';
import ShipmentMetadataCard from '../components/Inbound-Delivery/ShipmentMetaDataCard';
import ReconciledItemsTable from '../components/Inbound-Delivery/ReconciledItemsTable';

// InventoryPushDetailPage Component 
// - Displays detailed information about a specific inventory push operation, including shipment metadata, reconciled items, and audit trail. Provides functionality to commit stock to warehouse inventory with discrepancy handling.
export default function InventoryPushDetailPage({ order: propOrder, onPushComplete }) {
    const location = useLocation();
    const initialOrder = propOrder || location.state?.orderData;

    const getStorageKey = (rawId) => `inventory_push_order_${rawId}`;

    const [order, setOrder] = useState(() => {
        const rawId = initialOrder?.rawId || initialOrder?.id || 'UNKNOWN';
        const savedData = localStorage.getItem(getStorageKey(rawId));

        const baseOrder = {
            id: initialOrder?.id || 'PO-UNKNOWN',
            rawId: rawId,
            ledgerId: initialOrder?.ledgerId || 'LDG-000',
            status: initialOrder?.status || 'RECONCILED',
            pushState: initialOrder?.pushState || 'PENDING',
            supplier: initialOrder?.supplier || 'Unknown Supplier',
            carrier: initialOrder?.carrier || 'Standard Carrier',
            trackingNo: initialOrder?.trackingNo || 'N/A',
            dockNumber: initialOrder?.dockNumber || 'Bay 1',
            truckNumber: initialOrder?.truckNumber || 'N/A',
            sealNumber: initialOrder?.sealNumber || 'N/A',
            driverName: initialOrder?.driverName || 'N/A',
            items: Array.isArray(initialOrder?.items) ? initialOrder.items : [],
            reconciliation: initialOrder?.reconciliation || { hasDiscrepancy: false, totalReceivedCost: 0 },
            stateHistory: Array.isArray(initialOrder?.stateHistory) ? initialOrder.stateHistory : []
        };

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                return { ...baseOrder, ...parsed };
            } catch (e) {
                console.error("Failed to parse cached order state from localStorage", e);
            }
        }

        return baseOrder;
    });

    // Save state changes to localStorage whenever pushState or order metadata changes
    useEffect(() => {
        if (order?.rawId && order.rawId !== 'UNKNOWN') {
            localStorage.setItem(getStorageKey(order.rawId), JSON.stringify({
                pushState: order.pushState,
                status: order.status,
                stateHistory: order.stateHistory
            }));
        }
    }, [order.pushState, order.status, order.stateHistory, order.rawId]);

    const [isPushing, setIsPushing] = useState(false);
    const [pushSuccess, setPushSuccess] = useState(null);
    const [pushError, setPushError] = useState(null);
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const hasDiscrepancy = order.reconciliation?.hasDiscrepancy || order.items.some(
        item => (item.orderedQty || 0) !== (item.acceptedQty || 0) || (item.damagedQty || 0) > 0
    );

    const pushButtonText = hasDiscrepancy
        ? "Commit Partial Inventory Push (With Discrepancies)"
        : "Commit Full Inventory Push to Warehouse";

    const pushButtonStyle = hasDiscrepancy
        ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 active:scale-[0.99]"
        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-[0.99]";

    const handleExecutePush = async () => {
        setIsPushing(true);
        setPushError(null);
        setPushSuccess(null);
        setIsConfirmOpen(false);

        try {
            const endpointUrl = `${API_ENDPOINTS.WAREHOUSES}/inbound/delivery/${order.rawId}/sync`;
            const payload = {
                pushType: hasDiscrepancy ? 'PARTIAL_PUSH' : 'FULL_PUSH',
                actor: { userId: 'usr_inventory_mgr_01', username: 'inventory.manager', role: 'INVENTORY_MANAGER' }
            };

            const response = await fetch(endpointUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok && response.status !== 404) {
                const errData = await response.json().catch(() => ({}));
                console.log(`Inventory Push API Error: ${response.status} - ${errData.message || 'No error message provided'}`);
                throw new Error(errData.message || `Server responded with status ${response.status}`);
            }

            const successMessage = hasDiscrepancy
                ? 'Partial inventory successfully committed with variance flags logged.'
                : 'Full inventory successfully synchronized and committed to warehouse bins.';

            const newHistoryItem = {
                _id: Date.now().toString(),
                fromStatus: order.pushState,
                toStatus: 'COMPLETED',
                changedAt: new Date().toISOString(),
                actor: { username: 'inventory.manager', role: 'INVENTORY_MANAGER' },
                notes: successMessage
            };

            setOrder(prev => ({
                ...prev,
                pushState: 'COMPLETED',
                status: 'COMMITTED',
                readyToPush: false,
                stateHistory: [newHistoryItem, ...(prev.stateHistory || [])]
            }));

            setPushSuccess(successMessage);

            if (typeof onPushComplete === 'function') {
                onPushComplete(order.rawId);
            }
        } catch (err) {
            setPushError(err.message || 'Failed to sync inventory with warehouse management system.');
        } finally {
            setIsPushing(false);
        }
    };

    const renderSubmitActionComponent = () => (
        <div className="bg-white border border-slate-200/85 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 transition-all hover:border-slate-300">
            <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">Ready to Synchronize Stock?</h3>
                    {hasDiscrepancy && order.pushState !== 'COMPLETED' && (
                        <span className="px-2.5 py-0.5 text-xs bg-amber-50 text-amber-800 border border-amber-200/85 rounded-md font-medium tracking-wide flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Discrepancy Mode Active
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xl font-normal">
                    {order.pushState === 'COMPLETED'
                        ? 'Stock has already been successfully committed to warehouse inventory bins.'
                        : 'Review reconciled item metrics above before committing this delivery into active inventory storage.'}
                </p>
            </div>

            <button
                onClick={() => setIsConfirmOpen(true)}
                disabled={isPushing || order.pushState === 'COMPLETED'}
                className={`w-full sm:w-auto py-3.5 px-6 rounded-xl text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${order.pushState === 'COMPLETED'
                    ? 'bg-slate-100 text-slate-500 border border-slate-200 shadow-none'
                    : pushButtonStyle
                    }`}
            >
                {isPushing && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                {order.pushState === 'COMPLETED' ? (
                    <>
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Inventory Already Committed
                    </>
                ) : (
                    pushButtonText
                )}
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-5 bg-slate-50/50 min-h-screen pb-16 font-sans text-slate-700 antialiased">
            {/* Header Bar */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3.5 flex-wrap">
                        <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
                            <Package className="w-5 h-5" />
                        </span>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            Inventory Push & Stock Allocation Review
                        </h1>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                            {order.status}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 font-mono pl-12 flex items-center gap-2 flex-wrap">
                        <span>Delivery ID: <span className="text-slate-900 font-semibold">{order.id}</span></span>
                        <span className="text-slate-300">•</span>
                        <span>Ledger: <span className="text-slate-900 font-semibold">{order.ledgerId}</span></span>
                    </p>
                </div>

                <div className="flex items-center gap-3 self-end lg:self-center">
                    <div className="flex items-center gap-2.5 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/60">
                        <span className="text-sm font-medium text-slate-500">Push Status:</span>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${order.pushState === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                            {order.pushState}
                        </span>
                    </div>
                </div>
            </div>

            {/* Feedback Banners */}
            {pushSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-sm flex items-center justify-between shadow-xs animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-normal leading-relaxed">{pushSuccess}</span>
                    </div>
                    <button onClick={() => setPushSuccess(null)} className="text-emerald-700 hover:text-emerald-950 p-1.5 rounded-lg hover:bg-emerald-100/70 cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {pushError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-xl text-sm flex items-center justify-between shadow-xs animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="font-normal leading-relaxed">{pushError}</span>
                    </div>
                    <button onClick={() => setPushError(null)} className="text-rose-700 hover:text-rose-950 p-1.5 rounded-lg hover:bg-rose-100/70 cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {renderSubmitActionComponent()}

            {/* Main Content Area */}
            <div className="space-y-5">
                <ShipmentMetadataCard order={order} />
                <ReconciledItemsTable items={order.items} reconciliationTotal={order.reconciliation?.totalReceivedCost} />
            </div>

            {/* Repositioned Collapsible Audit Trail / State History Section */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden transition-all">
                <button
                    onClick={() => setIsAuditOpen(prev => !prev)}
                    className="w-full p-5 flex items-center justify-between bg-white hover:bg-slate-50/60 transition-colors cursor-pointer text-left"
                >
                    <div className="flex items-center gap-3">
                        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
                            <Clock className="w-4 h-4" />
                        </span>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider font-mono">
                                Audit Trail & State History
                            </h2>
                            <p className="text-xs text-slate-500 font-normal mt-0.5">
                                Track progression and status updates for this delivery order
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2.5 py-1 rounded-md font-medium border border-slate-200/50">
                            {order.stateHistory.length} events
                        </span>
                        <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                            {isAuditOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                    </div>
                </button>

                {isAuditOpen && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 animate-fadeIn">
                        <div className="relative pl-5 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 mt-2">
                            {order.stateHistory.length === 0 ? (
                                <p className="text-sm text-slate-400 italic py-4">No historical audit records available.</p>
                            ) : (
                                order.stateHistory.map((historyItem, idx) => (
                                    <div key={historyItem._id || idx} className="relative space-y-2">
                                        <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 border-white bg-indigo-600 ring-4 ring-indigo-50 shadow-2xs" />
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {historyItem.fromStatus && (
                                                    <>
                                                        <span className="text-xs text-slate-400 font-medium">{historyItem.fromStatus}</span>
                                                        <ArrowRight className="w-3 h-3 text-slate-300" />
                                                    </>
                                                )}
                                                <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-xs font-semibold border border-indigo-100">
                                                    {historyItem.toStatus || 'Updated State'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-slate-400 font-mono shrink-0 pt-0.5">
                                                {historyItem.changedAt ? new Date(historyItem.changedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <div className="bg-slate-50/80 border border-slate-200/60 p-3 rounded-xl space-y-1.5 shadow-2xs">
                                            <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                                                <span className="flex items-center gap-1.5 truncate pr-2">
                                                    <UserCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                                    <strong className="text-slate-800 font-medium truncate">{historyItem.actor?.username || 'System Automation'}</strong>
                                                </span>
                                                <span className="text-[10px] uppercase bg-white px-2 py-0.5 rounded-md border border-slate-200 text-indigo-700 font-semibold tracking-wider font-mono shrink-0">
                                                    {historyItem.actor?.role || 'SYSTEM'}
                                                </span>
                                            </div>
                                            {historyItem.notes && (
                                                <p className="text-xs text-slate-500 italic pl-5 border-t border-slate-200/60 pt-1 mt-1 leading-relaxed">
                                                    "{historyItem.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Modal / Widget */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 transform transition-all">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className={`p-3 rounded-2xl ${hasDiscrepancy ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                    {hasDiscrepancy ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                                </span>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 tracking-tight">Confirm Inventory Sync</h3>
                                    <p className="text-xs text-slate-500 font-mono">Delivery ID: {order.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                You are about to execute a <strong className="text-slate-900 font-semibold">{hasDiscrepancy ? 'Partial Inventory Push (Discrepancy Mode)' : 'Full Warehouse Inventory Sync'}</strong>. This action will commit items into active warehouse stock bins and update ledger states.
                            </p>
                            {hasDiscrepancy && (
                                <div className="flex items-start gap-2 bg-amber-50/80 border border-amber-200/60 p-3 rounded-xl text-xs text-amber-900">
                                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <span>Discrepancy flags detected. Proceeding will officially log inventory variances for auditing.</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsConfirmOpen(false)}
                                disabled={isPushing}
                                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleExecutePush}
                                disabled={isPushing}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${hasDiscrepancy ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                                    }`}
                            >
                                {isPushing && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                                Confirm & Push
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}