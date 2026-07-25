import React, { useEffect } from 'react';
import {
    ArrowLeft, MapPin, Layers, Package, ShieldCheck,
    User, Truck, CheckCircle2, Clock, X
} from 'lucide-react';

export default function DeliveryDetailModal({
    delivery,
    form,
    setForm,
    onClose,
    onConfirmArrival,
    onStartReceiving
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!delivery) return null;

    // Advanced Logistics Status Palette (Aligned with DeliveryListView)
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Arrived':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-semibold border border-transparent';
            case 'Receiving':
                return 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 font-semibold border border-transparent';
            case 'Completed':
                return 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-semibold border border-transparent';
            case 'Delayed':
                return 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 font-bold border border-transparent';
            default:
                return 'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 border border-transparent';
        }
    };

    const isArrived = delivery.status === 'Arrived';
    const isReceiving = delivery.status === 'Receiving';

    // CHANGED: Form fields are now always writeable so users can fix typos or update details
    const isFormDisabled = false;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 transition-opacity animate-fade-in font-sans antialiased selection:bg-indigo-500/15"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col transform transition-transform duration-300 border-l border-slate-100"
            >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white select-none">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-slate-200/60 shadow-2xs"
                            aria-label="Back"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                                    Inbound Audit: <span className="font-mono text-indigo-600">#{delivery.id}</span>
                                </h2>
                                <span className={`text-[11px] px-2 py-0.5 rounded-lg font-medium shadow-3xs ${getStatusStyles(delivery.status)}`}>
                                    {delivery.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-normal mt-0.5 tracking-normal">
                                Origin Supplier: <span className="text-slate-700 font-semibold">{delivery.supplier || 'Unknown Supplier'}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors border border-transparent"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    {/* Metadata Summary Blocks */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-start space-x-3">
                            <div className="p-2 bg-slate-50 rounded-xl text-slate-500 border border-slate-100 shadow-2xs">
                                <MapPin size={16} />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">Destination Zone</div>
                                <div className="text-sm font-bold text-slate-800 mt-0.5 tracking-tight">{delivery.destinationWarehouse || 'Not Assigned'}</div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-start space-x-3">
                            <div className="p-2 bg-slate-50 rounded-xl text-slate-500 border border-slate-100 shadow-2xs">
                                <Layers size={16} />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">Allocated Footprint</div>
                                <div className="text-sm font-bold text-slate-800 mt-0.5 tracking-tight flex items-baseline space-x-1">
                                    <span className="tabular-nums font-mono text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded-md text-xs border border-slate-100">{delivery.totalPallets ?? 0}</span>
                                    <span className="text-slate-400 text-[11px] font-medium tracking-normal">Pallet Slots</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Manifest Table Card */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-3xs overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white select-none">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                                <Package size={14} className="text-slate-400" />
                                <span>Manifest Line Items ({(delivery.items || []).length})</span>
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold text-xs tracking-wider uppercase select-none">
                                        <th className="py-2.5 px-5 text-[10px] w-[130px]">SKU Code</th>
                                        <th className="py-2.5 px-5 text-[10px]">Product Description</th>
                                        <th className="py-2.5 px-5 text-right text-[10px] w-[145px]">Target Volume</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm font-normal text-slate-600 bg-white">
                                    {delivery.items && delivery.items.length > 0 ? (
                                        delivery.items.map((prod, idx) => (
                                            <tr key={prod.sku || idx} className="hover:bg-slate-50/40 transition-colors group">
                                                <td className="py-3 px-5 font-mono font-bold text-slate-900 tracking-tight vertical-align-middle text-xs">
                                                    <span className="text-indigo-400 font-sans tracking-wide mr-0.5 font-semibold">#</span>
                                                    {prod.sku}
                                                </td>
                                                <td className="py-3 px-5 font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors max-w-[240px] truncate tracking-tight text-xs">
                                                    {prod.name}
                                                </td>
                                                <td className="py-3 px-5 text-right font-bold text-slate-800 whitespace-nowrap tabular-nums font-mono text-xs">
                                                    {(prod.qtyExpected || 0).toLocaleString()}
                                                    <span className="text-slate-400 font-sans font-semibold ml-1 text-[10px] tracking-wider uppercase">{prod.unit || 'PCS'}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="py-8 px-5 text-center text-slate-400 font-medium text-xs select-none">
                                                No items cataloged on this manifest.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Operational Flow Action Box */}
                    <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-3xs">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center space-x-2 select-none">
                            <ShieldCheck size={14} className={isReceiving ? "text-violet-500" : isArrived ? "text-emerald-500" : "text-slate-400"} />
                            <span>Gate Security & Marshal Validation</span>
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 select-none">
                                    Driver Name / ID
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={form?.driverName || ''}
                                        onChange={(e) => setForm({ ...form, driverName: e.target.value })}
                                        disabled={isFormDisabled}
                                        placeholder="e.g. John Doe"
                                        className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 disabled:bg-slate-50/70 disabled:text-slate-400/80 transition-all placeholder:text-slate-300 font-semibold text-slate-800 shadow-2xs"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 select-none">
                                    Truck Registry Plate
                                </label>
                                <div className="relative">
                                    <Truck className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={form?.truckPlate || ''}
                                        onChange={(e) => setForm({ ...form, truckPlate: e.target.value })}
                                        disabled={isFormDisabled}
                                        placeholder="e.g. CA-772-XX"
                                        className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 disabled:bg-slate-50/70 disabled:text-slate-400/80 transition-all placeholder:text-slate-300 font-semibold text-slate-800 shadow-2xs"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Context-Aware Layout Controls */}
                        {!isArrived && !isReceiving ? (
                            <button
                                type="button"
                                onClick={() => onConfirmArrival(delivery.id)}
                                disabled={!form?.driverName?.trim() || !form?.truckPlate?.trim()}
                                className="w-full bg-slate-950 hover:bg-slate-800 disabled:bg-slate-100 text-white disabled:text-slate-400 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed select-none active:scale-99"
                            >
                                Log Gate Entry & Confirm Vehicle Presence
                            </button>
                        ) : isArrived ? (
                            <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-xl flex items-center justify-between gap-4">
                                <div className="flex items-start space-x-2.5 text-xs text-emerald-800 font-medium leading-normal">
                                    <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span>Vehicle marked present. Dispatched to active unloading bays.</span>
                                </div>
                                <button
                                    onClick={() => onStartReceiving(delivery.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs whitespace-nowrap cursor-pointer select-none active:scale-98"
                                >
                                    Initiate Offloading
                                </button>
                            </div>
                        ) : (
                            <div className="bg-violet-50/60 border border-violet-100 p-4 rounded-xl flex items-center space-x-2.5 text-xs text-violet-800 font-medium">
                                <Clock size={16} className="text-violet-600 animate-spin flex-shrink-0" />
                                <span>Receiving inventory: Line operators are currently validating and logging active pallet loads.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}