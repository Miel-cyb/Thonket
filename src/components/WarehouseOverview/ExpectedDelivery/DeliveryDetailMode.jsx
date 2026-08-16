import React, { useEffect, useState } from 'react';
import {
    ArrowLeft, MapPin, Layers, Package, X, AlertCircle, CheckCircle2, Truck, ShieldCheck, ExternalLink, FileText, User, Building2, Hash
} from 'lucide-react';

import GateSecurityControl from './GateSecurityControl';
import { API_ENDPOINTS } from '../../../utils/urls';

export default function DeliveryDetailModal({
    delivery,
    form: parentForm,
    setForm: parentSetForm,
    onClose,
    onConfirmArrival,
    onStartReceiving,
    onNavigateToOffload
}) {
    const InboundLogApi = `${API_ENDPOINTS.WAREHOUSES}/inbound/delivery/gate-check-in`;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Robust local form state fallback initialized with delivery logistics
    const [localForm, setLocalForm] = useState(() => delivery?.logistics || {});

    // Sync local form state whenever the active delivery prop changes
    useEffect(() => {
        if (delivery) {
            setLocalForm(delivery.logistics || {});
        }
    }, [delivery]);

    // Use parent form/setForm if provided, otherwise fallback to local state
    const form = parentForm !== undefined ? parentForm : localForm;
    const setForm = parentSetForm || setLocalForm;

    // Handle ESC key press to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !isSubmitting) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, isSubmitting]);

    if (!delivery) return null;

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Arrived':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/50';
            case 'Receiving':
                return 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 border-violet-200/80 dark:border-violet-800/50';
            case 'Completed':
                return 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/80 dark:border-blue-800/50';
            case 'Delayed':
                return 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/50';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    const getStatusBannerDetails = (status) => {
        switch (status) {
            case 'Arrived':
                return {
                    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
                    title: 'Delivery Arrived & Confirmed',
                    desc: 'Vehicle check-in is complete. Ready to proceed with warehouse offloading and inventory receiving.',
                    bg: 'bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                };
            case 'Receiving':
                return {
                    icon: <Truck className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 animate-pulse" />,
                    title: 'Currently Undergoing Receiving',
                    desc: 'This delivery is actively being inspected and unloaded in the warehouse bay.',
                    bg: 'bg-violet-50/80 dark:bg-violet-500/10 border-violet-200 dark:border-violet-900/40 text-violet-900 dark:text-violet-200'
                };
            case 'Completed':
                return {
                    icon: <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />,
                    title: 'Delivery Process Completed',
                    desc: 'All items have been fully received, reconciled, and archived into inventory.',
                    bg: 'bg-blue-50/80 dark:bg-blue-500/10 border-blue-200 dark:border-blue-900/40 text-blue-900 dark:text-blue-200'
                };
            default:
                return null;
        }
    };

    const items = delivery.items || [];
    const totalQty = items.reduce((acc, curr) => acc + (curr.qtyExpected || 0), 0);
    const bannerInfo = getStatusBannerDetails(delivery.status);
    const isTerminalState = ['Arrived', 'Receiving', 'Completed'].includes(delivery.status);

    // Extract fields to check availability
    const driverName = form?.driverName || delivery.logistics?.driverName;
    const carrierName = form?.carrierName || delivery.logistics?.carrierName;
    const truckNumber = form?.truckNumber || delivery.logistics?.truckNumber;
    const waybillNumber = form?.waybillNumber || delivery.logistics?.waybillNumber;

    const hasLogisticsData = Boolean(driverName || carrierName || truckNumber || waybillNumber);

    const handleConfirmArrivalWithPost = async (deliveryId) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to log inbound entry: ${response.statusText}`);
            }

            const data = await response.json();

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

    const handleNavigateOffloadClick = () => {
        if (onNavigateToOffload) {
            onNavigateToOffload(delivery);
        } else if (onStartReceiving) {
            onStartReceiving(delivery);
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300 animate-in fade-in select-none overflow-y-auto"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col my-auto overflow-hidden transition-all transform scale-100 duration-200 font-sans antialiased text-slate-800 dark:text-slate-100"
            >
                {/* Modal Header */}
                <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shrink-0 sticky top-0 z-20">
                    <div className="flex items-center space-x-3.5">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700/60 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                            aria-label="Back"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                                <h2 id="modal-title" className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                                    Inbound Audit <span className="font-mono text-indigo-600 dark:text-indigo-400">#{delivery.id}</span>
                                </h2>
                                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border tracking-wide uppercase ${getStatusStyles(delivery.status)}`}>
                                    {delivery.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                Origin Supplier: <span className="text-slate-800 dark:text-slate-200 font-semibold">{delivery.supplier || 'N/A'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/30">
                    {submitError && (
                        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-2xl text-xs font-medium flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={16} className="shrink-0 text-rose-500" />
                                <span>{submitError}</span>
                            </div>
                            <button onClick={() => setSubmitError(null)} className="font-bold underline text-xs ml-2 cursor-pointer hover:opacity-80">Dismiss</button>
                        </div>
                    )}

                    {/* Status Banner */}
                    {bannerInfo && (
                        <div className={`p-4 rounded-2xl border flex items-start space-x-3 shadow-xs ${bannerInfo.bg} animate-in fade-in slide-in-from-top-1`}>
                            <div className="mt-0.5">{bannerInfo.icon}</div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold uppercase tracking-wider">{bannerInfo.title}</h4>
                                <p className="text-xs mt-0.5 opacity-90">{bannerInfo.desc}</p>
                            </div>
                        </div>
                    )}

                    {/* Metadata Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
                            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 shrink-0">
                                <MapPin size={18} />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Destination Zone</div>
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 tracking-tight truncate">
                                    {delivery.destinationWarehouse || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
                            <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 shrink-0">
                                <Layers size={18} />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Allocated Footprint</div>
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 tracking-tight flex items-baseline space-x-1.5">
                                    <span className="tabular-nums font-mono text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs border border-slate-200 dark:border-slate-700">
                                        {delivery.totalPallets ?? 0}
                                    </span>
                                    <span className="text-slate-500 text-xs font-medium">Pallet Slots</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
                            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 shrink-0">
                                <Package size={18} />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Units</div>
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 tracking-tight flex items-baseline space-x-1.5">
                                    <span className="tabular-nums font-mono text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs border border-slate-200 dark:border-slate-700">
                                        {totalQty.toLocaleString()}
                                    </span>
                                    <span className="text-slate-500 text-xs font-medium">Units</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conditional Display: Gate Control vs Confirmed State Record */}
                    {!isTerminalState ? (
                        <GateSecurityControl
                            form={form}
                            setForm={setForm}
                            organizationId={delivery.organizationId}
                            supplierId={delivery.supplierId}
                            isArrived={delivery.status === 'Arrived'}
                            isReceiving={delivery.status === 'Receiving'}
                            deliveryId={delivery.id}
                            onConfirmArrival={() => handleConfirmArrivalWithPost(delivery.id)}
                            onStartReceiving={onStartReceiving}
                        />
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Confirmed Logistics Record
                                </h3>
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    Current State: <span className="text-slate-800 dark:text-slate-200 font-medium">{delivery.status}</span>
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center space-x-2 text-slate-400 font-medium mb-1">
                                        <User size={14} className="text-indigo-500" />
                                        <span>Driver Name</span>
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                                        {driverName || 'Standard Delivery'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center space-x-2 text-slate-400 font-medium mb-1">
                                        <Building2 size={14} className="text-amber-500" />
                                        <span>Carrier Name</span>
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                                        {carrierName || delivery.supplier || 'N/A'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center space-x-2 text-slate-400 font-medium mb-1">
                                        <Truck size={14} className="text-emerald-500" />
                                        <span>Truck Number</span>
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 block font-mono truncate">
                                        {truckNumber || 'Assigned Bay'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center space-x-2 text-slate-400 font-medium mb-1">
                                        <Hash size={14} className="text-blue-500" />
                                        <span>Waybill Number</span>
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 block font-mono truncate">
                                        {waybillNumber || `#${delivery.id}`}
                                    </span>
                                </div>
                            </div>

                            {/* Prominent Next-Step Action Banner */}
                            {(onNavigateToOffload || onStartReceiving) && (
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100/60 dark:border-indigo-900/30">
                                    <div>
                                        <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">Ready to start offloading?</h5>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Proceed to the warehouse management screen to log received items and pallets.</p>
                                    </div>
                                    <button
                                        onClick={handleNavigateOffloadClick}
                                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
                                    >
                                        <span>{delivery.status === 'Arrived' ? 'Start Offloading' : 'View Offload Details'}</span>
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}