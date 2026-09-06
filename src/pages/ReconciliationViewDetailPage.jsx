import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    Package,
    ShieldCheck,
    Edit3,
    Info,
    AlertCircle,
    X,
    Loader2
} from 'lucide-react';
import ResolutionModal from '../components/Inbound-Delivery/modals/ResolutionModal';
import FinancialSummaryCard from '../components/Inbound-Delivery/FinancialSummaryCard';
import { API_ENDPOINTS } from '../utils/urls';

// ReconciliationDetailView Component
// - Displays detailed information about a specific order, including line items, discrepancies, and financial summaries. 
// - Communicates with the backend server via PATCH request to resolve discrepancies and updates data state upon success.
export default function ReconciliationDetailView({ orderData, onBack, onUpdateOrder, onSyncOrder }) {
    const location = useLocation();

    const resolvedOrderData = orderData || location.state?.orderData;

    //console.log('this is the order data passed to the reconciliation detail view:', resolvedOrderData);

    const [order, setOrder] = useState(resolvedOrderData || {
        rawId: '',
        id: '',
        supplier: '',
        organizationId: '',
        expectedDate: '',
        status: 'Pending',
        carrier: '',
        trackingNo: '',
        dockNumber: '',
        truckNumber: '',
        sealNumber: '',
        driverName: '',
        notes: '',
        pushState: 'PENDING',
        issueState: 'PENDING',
        reconciliation: {
            totalExpectedCost: 0,
            totalReceivedCost: 0,
            totalVarianceCost: 0,
            hasDiscrepancy: false,
            discrepancySummary: '',
            managerNotes: ''
        },
        items: []
    });

    const [syncSuccessMessage, setSyncSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItems, setModalItems] = useState([]);

    const openResolveModal = () => {
        // Removed the early return check so the modal can always be opened to review or edit items.
        setErrorMessage(''); // Clear past errors on open
        setModalItems(order.items.map(item => ({
            ...item,
            tempOrderedQty: item.orderedQty || 0,
            tempReceivedQty: item.receivedQty !== undefined ? item.receivedQty : (item.orderedQty || 0),
            tempDamagedQty: item.damagedQty || 0,
            tempShortageQty: item.shortageQty || 0,
            tempDamagedReplacementQty: item.damagedReplacementQty || 0,
            tempShortageReplacementQty: item.shortageReplacementQty || 0,
            tempReason: item.discrepancyReason || ''
        })));
        setIsModalOpen(true);
    };

    const handleModalItemChange = (itemId, field, value) => {
        setModalItems(prev => prev.map(item => {
            if (item.id === itemId) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    // Commercial-grade PATCH handler for resolving discrepancies
    const handleSaveModalResolution = async () => {
        setErrorMessage('');
        setIsSubmitting(true);
        // Requirement: Close modal immediately upon clicking submit/saving, not just on success
        setIsModalOpen(false);

        try {
            // Build resolution payload mapping items with shortage or damage replacements
            const resolutionItemsPayload = modalItems.map(modalMatch => {
                const damaged = Math.max(0, parseInt(modalMatch.tempDamagedQty) || 0);
                const shortage = Math.max(0, parseInt(modalMatch.tempShortageQty) || 0);

                // Only provide replacement values if the core discrepancy is greater than zero
                const damagedReplacement = damaged > 0 ? (Math.max(0, parseInt(modalMatch.tempDamagedReplacementQty) || 0)) : 0;
                const shortageReplacement = shortage > 0 ? (Math.max(0, parseInt(modalMatch.tempShortageReplacementQty) || 0)) : 0;

                return {
                    itemId: modalMatch.id,
                    receivedQty: Math.max(0, parseInt(modalMatch.tempReceivedQty) || 0),
                    damagedQty: damaged,
                    shortageQty: shortage,
                    damagedReplacementQty: damagedReplacement,
                    shortageReplacementQty: shortageReplacement,
                    discrepancyReason: modalMatch.tempReason || ''
                };
            });

            // Construct payload package containing organization, actor context, and resolution lines
            const payload = {
                actor: {
                    userId: 'usr_receivingsup_99',
                    username: 'warehouse.supervisor',
                    role: 'WAREHOUSE_SUPERVISOR'
                },
                resolutionPayload: {
                    items: resolutionItemsPayload
                }
            };

            const endpointUrl = `${API_ENDPOINTS.WAREHOUSES}/inbound/delivery/${order.rawId}/resolve-discrepancy`;

            const response = await fetch(endpointUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Server responded with status ${response.status}`);
            }

            const result = await response.json();

            // Standardize fallback check if server wraps data inside result.data or returns the entity directly
            const freshOrderData = result.data || result;

            // Map and update state with server-backed data response
            setOrder(prev => {
                const updatedOrder = {
                    ...prev,
                    ...freshOrderData,
                    reconciliation: freshOrderData.reconciliation || prev.reconciliation,
                    items: freshOrderData.items || prev.items,
                    issueState: freshOrderData.issueState || (freshOrderData.reconciliation?.hasDiscrepancy ? 'PENDING' : 'RESOLVED')
                };

                if (onUpdateOrder) {
                    onUpdateOrder(updatedOrder);
                }
                return updatedOrder;
            });

            setSyncSuccessMessage('Discrepancy resolution successfully processed and logged with enterprise ledger.');

        } catch (err) {
            console.error('Failed to resolve discrepancies:', err);
            setErrorMessage(err.message || 'An unexpected error occurred while saving discrepancy resolution.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFinancialReconcile = () => {
        setOrder(prev => {
            const updatedOrder = {
                ...prev,
                pushState: 'PUSHED',
                issueState: 'RESOLVED',
                reconciliation: {
                    ...prev.reconciliation,
                    hasDiscrepancy: false
                }
            };
            if (onSyncOrder) {
                onSyncOrder(updatedOrder);
            }
            return updatedOrder;
        });
        setSyncSuccessMessage('Financial reconciliation successfully posted and synced with enterprise ledger.');
    };

    const isSynced = order.pushState === 'PUSHED';
    const hasActiveDiscrepancy = order.reconciliation?.hasDiscrepancy;

    return (
        <div className="min-h-screen bg-slate-900/5 text-slate-900 p-4 md:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto font-sans">
            <header className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <button
                        onClick={onBack}
                        className="mt-1 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                        title="Return to Orders"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-lg font-bold font-mono text-slate-900 tracking-tight">{order.id || 'N/A'}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isSynced
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : hasActiveDiscrepancy
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                {isSynced ? <CheckCircle2 className="w-3.5 h-3.5" /> : hasActiveDiscrepancy ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                {isSynced ? 'Synced to Finance' : hasActiveDiscrepancy ? 'Discrepancy Pending Resolution' : 'Fully Reconciled'}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                            <span>Supplier: <strong className="text-slate-800">{order.supplier || 'Unspecified'}</strong></span>
                            <span className="text-slate-300">•</span>
                            <span>Expected Delivery: <strong className="text-slate-800">{order.expectedDate || 'N/A'}</strong></span>
                            <span className="text-slate-300">•</span>
                            <span>Dock: <strong className="text-slate-800 font-mono">{order.dockNumber || 'N/A'}</strong></span>
                        </p>
                    </div>
                </div>
            </header>

            {syncSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-5 py-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{syncSuccessMessage}</span>
                    </div>
                    <button onClick={() => setSyncSuccessMessage('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer p-1 rounded-lg hover:bg-emerald-100 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {errorMessage && (
                <div className="bg-rose-50 border border-rose-300 text-rose-900 px-5 py-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                    <button onClick={() => setErrorMessage('')} className="text-rose-700 hover:text-rose-900 cursor-pointer p-1 rounded-lg hover:bg-rose-100 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {hasActiveDiscrepancy && !isSynced && (
                <div className="bg-amber-50 border border-amber-300 text-amber-900 px-5 py-4 rounded-2xl text-xs font-medium flex items-center gap-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                        <strong className="font-bold text-amber-950">Action Required:</strong> Discrepancies detected between ordered and received stock. Click <strong className="underline font-bold">Resolve Discrepancies</strong> below to log replacement items, damages, or shortages.
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <Package className="w-4 h-4 text-blue-600" /> Line Item Discrepancy Resolution ({order.items?.length || 0})
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">Review items below or open the batch resolution modal to handle incoming replacements, damages, and shortages.</p>
                            </div>
                            <button
                                onClick={openResolveModal}
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
                                {isSubmitting ? 'Processing...' : 'Resolve Discrepancies (All Items)'}
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {(order.items || []).map(item => {
                                const hasItemIssue = (item.damagedQty > 0) || (item.shortageQty > 0) || (item.acceptedQty < item.orderedQty);
                                return (
                                    <div key={item.id} className={`border rounded-xl p-4 md:p-5 flex flex-col gap-4 transition-all ${hasItemIssue ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 bg-white'}`}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${hasItemIssue ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                                        {hasItemIssue ? 'Discrepancy Flagged' : 'Match'}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-mono text-slate-400 mt-0.5">SKU: {item.id} | Lot: {item.lotNumber || 'N/A'} | Location: {item.location || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Ordered Qty</span>
                                                <span className="text-sm font-mono font-bold text-slate-800 mt-1">{item.orderedQty}</span>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Received Qty</span>
                                                <span className="text-sm font-mono font-bold text-slate-800 mt-1">{item.receivedQty}</span>
                                            </div>
                                            <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200/60 flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-rose-600">Damaged Qty</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.damagedQty || 0}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 0;
                                                        setOrder(prev => ({
                                                            ...prev,
                                                            items: prev.items.map(i => i.id === item.id ? { ...i, damagedQty: val } : i)
                                                        }));
                                                    }}
                                                    className="mt-1 w-full bg-white border border-rose-200 rounded px-2 py-1 font-mono font-bold text-rose-700 text-center block focus:outline-none focus:ring-1 focus:ring-rose-500"
                                                />
                                            </div>
                                            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-amber-700">Shortage Qty</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.shortageQty || 0}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 0;
                                                        setOrder(prev => ({
                                                            ...prev,
                                                            items: prev.items.map(i => i.id === item.id ? { ...i, shortageQty: val } : i)
                                                        }));
                                                    }}
                                                    className="mt-1 w-full bg-white border border-amber-200 rounded px-2 py-1 font-mono font-bold text-amber-800 text-center block focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                />
                                            </div>
                                            <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/60 flex flex-col col-span-2 sm:col-span-1">
                                                <span className="text-[10px] uppercase font-bold text-emerald-700">Accepted Qty</span>
                                                <span className="text-sm font-mono font-bold text-emerald-800 mt-1">{item.acceptedQty}</span>
                                            </div>
                                        </div>

                                        {item.discrepancyReason && (
                                            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                                                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                <span><strong>Reason / Note:</strong> {item.discrepancyReason}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <FinancialSummaryCard
                        order={order}
                        isSynced={isSynced}
                        onFinancialReconcile={handleFinancialReconcile}
                    />
                </div>
            </div>

            <ResolutionModal
                isOpen={isModalOpen}
                onClose={() => !isSubmitting && setIsModalOpen(false)}
                modalItems={modalItems}
                onModalItemChange={handleModalItemChange}
                onSaveModalResolution={handleSaveModalResolution}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}