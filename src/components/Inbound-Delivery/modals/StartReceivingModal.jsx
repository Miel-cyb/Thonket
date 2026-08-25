import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Truck,
    Play,
    X,
    AlertTriangle,
    ShieldAlert,
    Loader2,
    PackageOpen,
    FileText,
    ChevronDown,
    ChevronUp,
    Box,
    CheckCircle2
} from 'lucide-react';
import { API_ENDPOINTS } from '../../../utils/urls';


//==========================================
//Component: StartReceivingModal Modal to 
// initiate the receiving process for a specific purchase order
//==========================================
export default function StartReceivingModal({
    isOpen,
    onClose,
    purchaseOrder: rawPurchaseOrder,
    onSuccess
}) {
    const navigate = useNavigate();

    // Normalize purchaseOrder based on wrapper structure
    const purchaseOrder = rawPurchaseOrder?.purchaseOrder || rawPurchaseOrder;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [inspectorNotes, setInspectorNotes] = useState('');
    const [showItems, setShowItems] = useState(true);

    if (!isOpen || !purchaseOrder) return null;

    // Dummy actor context (In production, pull this from your Auth/User Context)
    const currentActor = {
        userId: 'usr_doc_99218',
        username: 'Marcus Vance',
        role: 'RECEIVING_INSPECTOR'
    };

    const handleConfirmReceiving = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Extract identifier safely (support rawId, id, or ledgerId)
        const targetId = purchaseOrder.rawId || purchaseOrder.id;

        try {
            const response = await fetch(
                `${API_ENDPOINTS.WAREHOUSES}/inbound/delivery/${targetId}/start-receiving`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        ledgerId: purchaseOrder.ledgerId,
                        notes: inspectorNotes,
                        actor: currentActor,
                    }),
                }
            );

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Failed to initiate receiving sequence (Status: ${response.status})`);
            }

            const updatedData = await response.json();
            const resultPayload = updatedData.data || updatedData;

            // Resolve the newly created or updated entity detail ID
            const detailId = resultPayload.id || targetId;

            // Show explicit success feedback before navigating and closing modal
            setSuccessMessage('Receiving sequence initiated successfully! Redirecting to detail view...');

            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(resultPayload);
                }
                onClose();

                // Navigate to the detail part using the resolved ID
                navigate(`/receiving-audit/${detailId}`);
            }, 1200);

        } catch (err) {
            setError(err.message || 'An unexpected error occurred while communicating with the server.');
            setLoading(false);
        }
    };

    const reconciliation = purchaseOrder.reconciliation || {};
    const hasDiscrepancy = Boolean(reconciliation.hasDiscrepancy);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col transform transition-all max-h-[92vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                            <Truck className="w-6 h-6 text-indigo-300" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">Goods Receipt Intake</span>
                            <h2 className="text-lg font-extrabold tracking-tight">Verify & Start Receiving</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 space-y-5 overflow-y-auto">
                    {/* Error Notice */}
                    {error && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-900 text-xs animate-in shake">
                            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div className="flex-1 font-medium">{error}</div>
                            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-700 font-bold">×</button>
                        </div>
                    )}

                    {/* Success Notice */}
                    {successMessage && (
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs animate-in fade-in">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div className="flex-1 font-semibold">{successMessage}</div>
                        </div>
                    )}

                    {/* Shipment & Logistics Details Card */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3.5">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Purchase Order / Ledger ID</span>
                                <span className="text-xs font-extrabold text-indigo-600 font-mono">{purchaseOrder.id}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Dock / Bay</span>
                                <span className="text-xs font-extrabold text-slate-800 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                                    {purchaseOrder.dockNumber || 'Bay 01'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Supplier</span>
                                <strong className="text-slate-800 font-bold truncate block">{purchaseOrder.supplier}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Carrier / Truck</span>
                                <strong className="text-slate-800 font-bold truncate block">{purchaseOrder.carrier} ({purchaseOrder.truckNumber || 'N/A'})</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Driver Name</span>
                                <span className="text-slate-700 font-semibold truncate block">{purchaseOrder.driverName || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Seal Number</span>
                                <span className="font-mono text-slate-700 font-semibold truncate block">{purchaseOrder.sealNumber || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Financial & Reconciliation Overview Bar */}
                    <div className="grid grid-cols-3 gap-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3.5 text-xs">
                        <div>
                            <span className="text-indigo-400 block text-[10px] font-bold uppercase">Expected Cost</span>
                            <span className="text-slate-900 font-extrabold text-sm">
                                ${reconciliation.totalExpectedCost?.toLocaleString() || 0}
                            </span>
                        </div>
                        <div>
                            <span className="text-indigo-400 block text-[10px] font-bold uppercase">Reconciliation Status</span>
                            <span className="inline-block mt-0.5 px-2 py-0.5 bg-slate-200/70 text-slate-700 font-bold rounded-md text-[10px]">
                                {reconciliation.reconciliationStatus || 'PENDING'}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-indigo-400 block text-[10px] font-bold uppercase">Discrepancy Check</span>
                            <span className={`font-bold ${hasDiscrepancy ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {hasDiscrepancy ? 'Discrepancy Flagged' : 'No Discrepancy'}
                            </span>
                        </div>
                    </div>

                    {/* Expandable Line Items List for Verification */}
                    <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
                        <button
                            type="button"
                            onClick={() => setShowItems(!showItems)}
                            className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/70 flex items-center justify-between text-xs font-bold text-slate-700 transition cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" />
                                Expected Line Items ({purchaseOrder.items?.length || 0} SKUs to Receive)
                            </span>
                            {showItems ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>

                        {showItems && (
                            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                                {purchaseOrder.items?.map((item) => (
                                    <div key={item.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/50 transition">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <Box className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="font-extrabold text-slate-900">{item.name}</span>
                                                <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono">Lot: {item.lotNumber}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 pl-5">
                                                Unit Cost: <strong className="text-slate-700">${item.unitCost}</strong> | Expiry: {item.expiryDate || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-extrabold text-indigo-600 text-sm block">{item.orderedQty} units</span>
                                            <span className="text-[10px] text-slate-400 uppercase">Ordered Qty</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Inspector Notes Field */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <PackageOpen className="w-3.5 h-3.5 text-indigo-600" /> Receiving / Inspection Notes (Optional)
                        </label>
                        <textarea
                            rows={2}
                            value={inspectorNotes}
                            onChange={(e) => setInspectorNotes(e.target.value)}
                            placeholder="Note container quality, initial pallet check, or remarks..."
                            disabled={loading}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none shadow-2xs"
                        />
                    </div>

                    {/* Status Update Warning */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-2.5 text-amber-900 text-xs">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="font-medium">
                            Starting receipt will change shipment status to <strong className="font-bold">Receiving In Progress</strong> and activate inventory logging under actor <span className="font-mono underline">{currentActor.username}</span>.
                        </span>
                    </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmReceiving}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition cursor-pointer disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Initializing Receipt...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 fill-current" />
                                Confirm & Start Receiving
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}