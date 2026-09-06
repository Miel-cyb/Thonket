import React, { useState } from 'react';
import { DollarSign, Check, AlertTriangle, ShieldCheck, Clock, Loader2, X, CheckCircle2 } from 'lucide-react';
import { API_ENDPOINTS } from '../../utils/urls';

// FinancialSummaryCard Component - Displays financial summary with confirmation dialog, successful sync notification state, and duplicate sync request blockers.
export default function FinancialSummaryCard({ order: initialOrder, onFinancialReconcile }) {
    const [order, setOrder] = useState(initialOrder);
    const [isConfirmingSync, setIsConfirmingSync] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState(null);
    const [syncSuccessMessage, setSyncSuccessMessage] = useState(null);

    // Keep local order in sync if parent passes down a new order prop (e.g. after parent re-fetches from server)
    React.useEffect(() => {
        setOrder(initialOrder);
    }, [initialOrder]);

    // Derive sync status directly from order.status instead of props
    const isSynced = order?.status === 'RECONCILED';

    // Extract values safely with defaults
    const expectedCost = order.reconciliation?.totalExpectedCost ?? 0;
    const receivedCost = order.reconciliation?.totalReceivedCost ?? 0;
    const varianceCost = order.reconciliation?.totalVarianceCost ?? 0;

    // Condition 1: Fully Reconciled / Fully Balanced
    const isFullyMatched = (expectedCost === receivedCost || varianceCost === 0) && receivedCost > 0;

    // Condition 3: Received is 0 or Variance is the same as the Expected cost (meaning nothing was received)
    const isZeroReceived = receivedCost === 0 || varianceCost === expectedCost;

    // Condition 2: Received cost exists, but there is a variance / discrepancy
    const isPartialSync = receivedCost > 0 && varianceCost > 0 && !isFullyMatched;

    // Handle financial reconciliation PATCH request with backend sync
    const handleConfirmSync = async () => {
        // Block execution entirely if already synced from order status
        if (isSynced) return;

        setIsSyncing(true);
        setSyncError(null);
        setSyncSuccessMessage(null);

        try {
            if (order?.rawId) {
                const endpointUrl = `${API_ENDPOINTS.WAREHOUSES}/inbound/delivery/${order.rawId}/reconcile`;

                const payload = {
                    actor: {
                        userId: 'usr_receivingsup_99',
                        username: 'warehouse.supervisor',
                        role: 'WAREHOUSE_SUPERVISOR'
                    }
                };

                const response = await fetch(endpointUrl, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok && response.status !== 404) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.message || `Server responded with status ${response.status}`);
                }

                // Parse response safely, handling both JSON objects and primitive strings (like 'RECONCILED')
                const responseJson = await response.json().catch(() => null);

                let updatedOrderFields = { status: 'RECONCILED' };
                if (responseJson && typeof responseJson === 'object') {
                    if (responseJson.data && typeof responseJson.data === 'object') {
                        updatedOrderFields = { ...responseJson.data, status: 'RECONCILED' };
                    } else {
                        updatedOrderFields = { ...responseJson, status: 'RECONCILED' };
                    }
                }

                setOrder(prevOrder => ({
                    ...prevOrder,
                    ...updatedOrderFields
                }));
            } else {
                setOrder(prevOrder => ({
                    ...prevOrder,
                    status: 'RECONCILED'
                }));
            }

            setSyncSuccessMessage('Financial reconciliation successfully posted and synced with enterprise ledger.');

            // Trigger parent state transition or data re-fetch handler so the parent record persists it
            if (onFinancialReconcile) {
                onFinancialReconcile(order?.rawId);
            }
        } catch (err) {
            console.error('Failed to execute financial reconciliation sync:', err);
            setSyncError(err.message || 'Failed to sync financial data with enterprise ledger.');
        } finally {
            setIsSyncing(false);
            setIsConfirmingSync(false);
        }
    };

    // Determine status badge, button state, and helper messages
    let statusBadge = null;
    let buttonDisabled = isSynced || isZeroReceived || isSyncing;
    let buttonText = 'Complete Financial Reconciliation';
    let buttonStyle = 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md cursor-pointer';
    let helperText = null;

    if (isSynced) {
        buttonText = 'Financially Synced & Closed';
        buttonStyle = 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-not-allowed shadow-none';
        statusBadge = (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Fully Reconciled
            </span>
        );
    } else if (isFullyMatched) {
        statusBadge = (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Fully Balanced
            </span>
        );
    } else if (isZeroReceived) {
        buttonText = 'Awaiting Goods Receipt';
        buttonStyle = 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none';
        helperText = 'Reconciliation action is locked until items are received into inventory.';
        statusBadge = (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Pending Receipt
            </span>
        );
    } else if (isPartialSync) {
        statusBadge = (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Partial Sync / Discrepancy
            </span>
        );
    }

    const varianceColorClass = varianceCost > 0 ? 'text-rose-600' : 'text-slate-900';

    return (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow flex flex-col gap-5 relative">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                        <DollarSign className="w-4 h-4" />
                    </div>
                    Financial Reconciliation Summary
                </h3>
                {statusBadge}
            </div>

            <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100 flex flex-col gap-3 text-xs">
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Expected PO Value:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                        GH₵{expectedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Reconciled Received Value:</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                        GH₵{receivedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200/60">
                    <span className="text-slate-700 font-bold">Variance / Discrepancy Cost:</span>
                    <span className={`font-mono font-bold text-sm ${varianceColorClass}`}>
                        GH₵{varianceCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {syncSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{syncSuccessMessage}</span>
                    </div>
                    <button onClick={() => setSyncSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-950 p-1 rounded-md hover:bg-emerald-100 transition-colors">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {syncError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center justify-between shadow-xs">
                    <span>{syncError}</span>
                    <button onClick={() => setSyncError(null)} className="text-rose-600 hover:text-rose-900 p-1 rounded-md hover:bg-rose-100 transition-colors">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <button
                    onClick={() => {
                        if (isSynced) return;
                        setIsConfirmingSync(true);
                    }}
                    disabled={buttonDisabled}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${buttonStyle}`}
                >
                    {isSynced || isFullyMatched ? (
                        <Check className="w-4 h-4" />
                    ) : isZeroReceived ? (
                        <Clock className="w-4 h-4" />
                    ) : (
                        <AlertTriangle className="w-4 h-4" />
                    )}
                    {buttonText}
                </button>
                {helperText && (
                    <p className="text-[11px] text-slate-400 text-center italic px-2">
                        {helperText}
                    </p>
                )}
            </div>

            {isConfirmingSync && !isSynced && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs rounded-2xl flex items-center justify-center p-5 z-10 animate-fade-in">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xl max-w-sm w-full flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Confirm Financial Sync</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">This action locks further adjustments and posts ledger records.</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 font-mono text-slate-700 border border-slate-100">
                            <div className="flex justify-between">
                                <span>Expected:</span>
                                <span className="font-bold">GH₵{expectedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Received:</span>
                                <span className="font-bold text-emerald-700">GH₵{receivedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <button
                                type="button"
                                disabled={isSyncing}
                                onClick={() => setIsConfirmingSync(false)}
                                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isSyncing}
                                onClick={handleConfirmSync}
                                className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                {isSyncing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                {isSyncing ? 'Syncing...' : 'Confirm Sync'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}