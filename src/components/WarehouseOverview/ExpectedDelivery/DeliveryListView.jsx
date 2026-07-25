import React, { useState } from 'react';
import {
    Package,
    Calendar,
    Clock,
    Eye,
    AlertCircle,
    MoreVertical,
    FileText,
    TrendingUp,
    Layers,
    SlidersHorizontal
} from 'lucide-react';

// ==========================================
// SUB-VIEW: COMMERCIAL DELIVERY LIST BOARD VIEW
// ==========================================
export default function DeliveryListView({ deliveries = [], onOpenDetails, onTriggerAction }) {
    const [activeMenu, setActiveMenu] = useState(null);

    // Advanced Logistics Status Palette
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Arrived':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-semibold';
            case 'In Transit':
                return 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-semibold';
            case 'Receiving':
                return 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 font-semibold';
            case 'Delayed':
                return 'bg-rose-50 text-rose-700 animate-pulse dark:bg-rose-500/10 dark:text-rose-400 font-bold';
            default:
                return 'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400';
        }
    };

    // Zero-state handling
    if (!deliveries || deliveries.length === 0) {
        return (
            <div className="font-sans bg-white border border-slate-100 rounded-2xl p-16 text-center max-w-xl mx-auto mt-12 shadow-sm">
                <div className="bg-indigo-50 p-4 rounded-2xl inline-block mb-4 text-indigo-600">
                    <Package size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight antialiased">No matching active deliveries</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed tracking-normal">
                    We couldn't find any current records matching those active filters. Try refining your parameters or clearing the lookup queries.
                </p>
            </div>
        );
    }

    // Calculations for the newly added dashboard sub-header
    const delayedCount = deliveries.filter(d => d.status === 'Delayed' || d.isDelayed).length;

    return (
        <div className="w-full space-y-4 font-sans antialiased selection:bg-indigo-500/15">
            {/* Context Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs text-slate-700">
                        <Layers size={18} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 tracking-tight">Delivery Pipeline</h2>
                        <p className="text-xs text-slate-500 tracking-normal font-normal">
                            Managing {deliveries.length} active shipments {delayedCount > 0 && `• ${delayedCount} delayed alerts`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs tracking-wide">
                        <SlidersHorizontal size={14} />
                        <span>Preferences</span>
                    </button>
                </div>
            </div>

            {/* Core Table View */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[840px]">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold text-xs tracking-wider uppercase select-none">
                                <th className="py-3 px-4 w-[130px]">PO Reference</th>
                                <th className="py-3 px-4 w-[240px]">Supplier & Logistics</th>
                                <th className="py-3 px-4 w-[170px]">Estimated Delivery</th>
                                <th className="py-3 px-4 text-center w-[120px]">Load Volume</th>
                                <th className="py-3 px-4 w-[160px]">Fulfillment Status</th>
                                <th className="py-3 px-4 text-right w-[140px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-normal text-slate-600">
                            {deliveries.map((delivery) => {
                                const isDelayed = delivery?.status === 'Delayed' || delivery?.isDelayed;

                                return (
                                    <tr
                                        key={delivery.id}
                                        onClick={() => onOpenDetails?.(delivery)}
                                        className="hover:bg-slate-50/70 cursor-pointer transition-all group relative duration-150"
                                    >
                                        {/* PO Identification */}
                                        <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm tracking-tight vertical-align-middle">
                                            <span className="text-indigo-500 font-sans tracking-wide mr-0.5 font-semibold">#</span>
                                            {delivery.id}
                                        </td>

                                        {/* Supplier Details */}
                                        <td className="py-3 px-4">
                                            <div className="flex flex-col space-y-0.5">
                                                <div className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[220px] tracking-tight text-[14px]">
                                                    {delivery.supplier || 'Unknown Supplier'}
                                                </div>
                                                <div className="text-xs text-slate-400 tracking-normal font-normal truncate max-w-[220px]">
                                                    {delivery.logisticsProvider || 'Internal Fleet'}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Dynamic Schedule & Warning flags */}
                                        <td className="py-3 px-4">
                                            <div className="flex flex-col space-y-0.5">
                                                <div className={`flex items-center space-x-1.5 text-[14px] ${isDelayed ? 'text-rose-600 font-bold tracking-tight' : 'font-medium text-slate-700 tracking-tight'}`}>
                                                    {isDelayed ? (
                                                        <AlertCircle size={14} className="text-rose-500 shrink-0 animate-pulse" />
                                                    ) : (
                                                        <Calendar size={14} className="text-slate-400 shrink-0" />
                                                    )}
                                                    <span>{delivery.expectedDate}</span>
                                                </div>
                                                <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-normal tracking-normal pl-5">
                                                    <Clock size={12} className="shrink-0" />
                                                    <span>{delivery.expectedTime}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Operational Load Measurement */}
                                        <td className="py-3 px-4 text-center">
                                            <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md text-xs tracking-tight border border-slate-100 tabular-nums inline-block font-mono">
                                                {delivery.totalPallets ?? 0}
                                                <span className="text-slate-400 font-sans font-semibold ml-1 text-[10px] tracking-wider uppercase">PLT</span>
                                            </span>
                                        </td>

                                        {/* Status Layout Components */}
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-lg border border-transparent tracking-wide shadow-2xs font-medium ${getStatusStyle(delivery.status)}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0"></span>
                                                {delivery.status}
                                            </span>
                                        </td>

                                        {/* Responsive Management Suite */}
                                        <td className="py-3 px-4 text-right relative">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevents row click
                                                        onOpenDetails?.(delivery);
                                                    }}
                                                    className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-98 rounded-lg transition-all shadow-xs tracking-wide"
                                                >
                                                    <Eye size={13} className="text-slate-400" />
                                                    <span>Open</span>
                                                </button>

                                                {/* Advanced Action Toggle Popovers */}
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevents row click
                                                            setActiveMenu(activeMenu === delivery.id ? null : delivery.id);
                                                        }}
                                                        className={`p-1 rounded-lg border transition-all ${activeMenu === delivery.id ? 'bg-slate-100 border-slate-300 text-slate-700' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                                    >
                                                        <MoreVertical size={14} />
                                                    </button>

                                                    {activeMenu === delivery.id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevents row click
                                                                    setActiveMenu(null);
                                                                }}
                                                            />
                                                            <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200/80 rounded-lg shadow-xl py-1 z-20 text-left animate-in fade-in slide-in-from-top-1 duration-100">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onTriggerAction?.(delivery, 'manifest');
                                                                        setActiveMenu(null);
                                                                    }}
                                                                    className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 tracking-normal"
                                                                >
                                                                    <FileText size={13} className="text-slate-400" />
                                                                    Download Manifest
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onTriggerAction?.(delivery, 'reroute');
                                                                        setActiveMenu(null);
                                                                    }}
                                                                    className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 tracking-normal"
                                                                >
                                                                    <TrendingUp size={13} className="text-slate-400" />
                                                                    Reroute Tracking
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}