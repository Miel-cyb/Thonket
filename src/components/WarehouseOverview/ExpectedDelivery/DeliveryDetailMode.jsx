import React, { useEffect, useState } from 'react';
import {
    ArrowLeft, MapPin, Layers, Package, X
} from 'lucide-react';

// Import the GateSecurityControl component 
import GateSecurityControl from './GateSecurityControl';
import { API_ENDPOINTS } from '../../../utils/urls';

export default function DeliveryDetailModal({
    delivery,
    form,
    setForm,
    onClose,
    onConfirmArrival,
    onStartReceiving
}) {
    const InboundLogApi = `${API_ENDPOINTS.WAREHOUSES}/inbound/delivery/gate-check-in`;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Handle ESC key press to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!delivery) return null;

    // Advanced Logistics Status Palette
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Arrived':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40';
            case 'Receiving':
                return 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 border-violet-200/60 dark:border-violet-800/40';
            case 'Completed':
                return 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40';
            case 'Delayed':
                return 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/40';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    const items = delivery.items || [];
    const totalQty = items.reduce((acc, curr) => acc + (curr.qtyExpected || 0), 0);

    console.log('Delivery Detail Modal Rendered with delivery:', delivery);

    // Handler function to process POST request during arrival confirmation
    const handleConfirmArrivalWithPost = async (deliveryId) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // Exclude trackPlate and extract driver details from form
            const {
                driverName,
                driverPhone,
                driverLicense,
                driverId,
                carrierName,
                truckNumber,
                waybillNumber,
                sealNumber
            } = form || {};

            const dummyActor = {
                userId: 'user-12345',
                name: 'Jane Doe',
                username: 'jdoe_sec',
                role: 'Gate Security Officer',
            };

            const payload = {
                organizationId: delivery.organizationId,
                ledgerId: delivery.ledgerId,

                logistics: {
                    driverName,
                    driverPhone,
                    driverLicense,
                    driverId,
                    carrierName,
                    truckNumber,
                    waybillNumber,
                    sealNumber
                },
                actor: dummyActor,
            };

            const response = await fetch(InboundLogApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add 'Authorization': `Bearer ${token}` here if authentication headers are required
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to log inbound entry: ${response.statusText}`);
            }

            const data = await response.json();

            console.log('Inbound log entry created successfully:', data);

            // Trigger parent state update callback successfully
            if (onConfirmArrival) {
                onConfirmArrival(deliveryId || delivery.id, data);
            }
        } catch (err) {
            console.error('Error executing inbound post request:', err);
            setSubmitError(err.message || 'Network error occurred while saving inbound entry.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-900/60 backdrop-blur-md transition-all duration-300 animate-in fade-in"
        >
            {/* Pop-up Card Container */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden transition-all transform scale-100 duration-200 font-sans antialiased"
            >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
                    <div className="flex items-center space-x-3.5">
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors border border-slate-200/60 dark:border-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            aria-label="Back"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <div className="flex items-center space-x-2.5">
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                                    Inbound Audit <span className="font-mono text-indigo-600 dark:text-indigo-400">#{delivery.id}</span>
                                </h2>
                                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${getStatusStyles(delivery.status)}`}>
                                    {delivery.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                                Origin Supplier: <span className="text-slate-700 dark:text-slate-300 font-semibold">{delivery.supplier || 'Unknown Supplier'}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-slate-50/60 dark:bg-slate-950/40">

                    {/* Error Banner Alert */}
                    {submitError && (
                        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
                            <span>{submitError}</span>
                            <button onClick={() => setSubmitError(null)} className="font-bold underline text-xs ml-2 cursor-pointer">Dismiss</button>
                        </div>
                    )}

                    {/* Metadata Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
                            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Destination Zone</div>
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 tracking-tight">
                                    {delivery.destinationWarehouse || 'Unassigned'}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
                            <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                                <Layers size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Allocated Footprint</div>
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 tracking-tight flex items-baseline space-x-1.5">
                                    <span className="tabular-nums font-mono text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs border border-slate-200 dark:border-slate-700">
                                        {delivery.totalPallets ?? 0}
                                    </span>
                                    <span className="text-slate-500 text-xs font-medium">Pallet Slots</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
                            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                <Package size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Units</div>
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 tracking-tight flex items-baseline space-x-1.5">
                                    <span className="tabular-nums font-mono text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs border border-slate-200 dark:border-slate-700">
                                        {totalQty.toLocaleString()}
                                    </span>
                                    <span className="text-slate-500 text-xs font-medium">Units Cataloged</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Manifest Table Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                <Package size={15} className="text-slate-400" />
                                <span>Manifest Line Items ({items.length})</span>
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-400 font-bold text-[11px] tracking-wider uppercase select-none">
                                        <th className="py-3 px-5 w-[140px]">SKU Code</th>
                                        <th className="py-3 px-5">Product Description</th>
                                        <th className="py-3 px-5 text-right w-[150px]">Target Volume</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm font-normal text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900">
                                    {items.length > 0 ? (
                                        items.map((prod, idx) => (
                                            <tr key={prod.sku || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="py-3.5 px-5 font-mono font-bold text-slate-900 dark:text-slate-200 text-xs">
                                                    <span className="text-indigo-500 dark:text-indigo-400 font-sans mr-0.5">#</span>
                                                    {prod.sku}
                                                </td>
                                                <td className="py-3.5 px-5 font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-xs">
                                                    {prod.name}
                                                </td>
                                                <td className="py-3.5 px-5 text-right font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap tabular-nums font-mono text-xs">
                                                    {(prod.qtyExpected || 0).toLocaleString()}
                                                    <span className="text-slate-400 font-sans font-semibold ml-1.5 text-[10px] tracking-wider uppercase">
                                                        {prod.unit || 'PCS'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="py-10 px-5 text-center text-slate-400 dark:text-slate-500 font-medium text-xs">
                                                No items cataloged on this manifest.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Operational Gate Validation & Action Section (Modularized) */}
                    <div className={isSubmitting ? 'opacity-60 pointer-events-none transition-opacity' : ''}>
                        <GateSecurityControl
                            delivery={delivery}
                            form={form}
                            setForm={setForm}
                            onConfirmArrival={handleConfirmArrivalWithPost}
                            onStartReceiving={onStartReceiving}
                            isSubmitting={isSubmitting}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}