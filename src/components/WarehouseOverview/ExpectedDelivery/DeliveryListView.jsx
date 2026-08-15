import React, { useState, useMemo } from 'react';
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
    ArrowUpDown,
    CheckCircle2,
    Truck,
    MapPin,
    AlertTriangle
} from 'lucide-react';

// ==========================================
// SUB-VIEW: COMMERCIAL DELIVERY LIST BOARD VIEW
// ==========================================
export default function DeliveryListView({
    deliveries = [],
    onOpenDetails,
    onSelectDelivery,
    onRowClick,
    onTriggerAction
}) {
    const [activeMenu, setActiveMenu] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'statusOrder', direction: 'asc' });

    // Unified handler to ensure whichever prop name the parent uses, the modal triggers
    const handleOpenModal = (delivery) => {
        const trigger = onOpenDetails || onSelectDelivery || onRowClick;
        if (typeof trigger === 'function') {
            trigger(delivery);
        }
    };

    // Advanced Logistics Status Palette & Icons
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Arrived':
                return {
                    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 font-semibold',
                    dot: 'bg-emerald-500',
                    icon: <MapPin size={13} className="text-emerald-500 shrink-0" />,
                    borderLeft: 'border-l-4 border-l-emerald-500'
                };
            case 'In Transit':
                return {
                    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 font-semibold',
                    dot: 'bg-blue-500',
                    icon: <Truck size={13} className="text-blue-500 shrink-0" />,
                    borderLeft: 'border-l-4 border-l-blue-500'
                };
            case 'Receiving':
            case 'Expected':
                return {
                    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 font-semibold',
                    dot: 'bg-amber-500',
                    icon: <Clock size={13} className="text-amber-500 shrink-0" />,
                    borderLeft: 'border-l-4 border-l-amber-400'
                };
            case 'Delayed':
                return {
                    badge: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse dark:bg-rose-500/10 dark:text-rose-400 font-bold',
                    dot: 'bg-rose-500',
                    icon: <AlertTriangle size={13} className="text-rose-500 shrink-0" />,
                    borderLeft: 'border-l-4 border-l-rose-500'
                };
            case 'Completed':
                return {
                    badge: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 font-medium',
                    dot: 'bg-slate-400',
                    icon: <CheckCircle2 size={13} className="text-slate-400 shrink-0" />,
                    borderLeft: 'border-l-4 border-l-slate-300'
                };
            default:
                return {
                    badge: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400',
                    dot: 'bg-slate-400',
                    icon: <Clock size={13} className="text-slate-400 shrink-0" />,
                    borderLeft: 'border-l-4 border-l-slate-200'
                };
        }
    };

    // Priority rank mapping for state ordering: Arrived -> In Transit -> Expected/Receiving/Delayed -> Completed
    const getStatusRank = (status) => {
        switch (status) {
            case 'Arrived': return 1;
            case 'In Transit': return 2;
            case 'Receiving':
            case 'Expected':
            case 'Delayed': return 3;
            case 'Completed': return 4;
            default: return 5;
        }
    };

    // Handle Sorting Logic
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter and Sort Data locally with prescribed state sorting & datetime guidance
    const processedDeliveries = useMemo(() => {
        let result = [...deliveries];

        // 1. Filter by Status
        if (statusFilter !== 'All') {
            result = result.filter(d => d.status === statusFilter);
        }

        // 2. Sort Data
        result.sort((a, b) => {
            if (sortConfig.key === 'statusOrder' || sortConfig.key === 'status') {
                const rankA = getStatusRank(a.status);
                const rankB = getStatusRank(b.status);

                if (rankA !== rankB) {
                    return sortConfig.direction === 'asc' ? rankA - rankB : rankB - rankA;
                }

                // Secondary sort: datetime guidance
                const dateA = new Date(`${a.expectedDate || ''} ${a.expectedTime || ''}`).getTime() || 0;
                const dateB = new Date(`${b.expectedDate || ''} ${b.expectedTime || ''}`).getTime() || 0;
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [deliveries, statusFilter, sortConfig]);

    // Zero-state handling for processed view
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

    const delayedCount = deliveries.filter(d => d.status === 'Delayed' || d.isDelayed).length;

    return (
        <div className="w-full space-y-4 font-sans antialiased selection:bg-indigo-500/15">
            {/* Context Header Section with Interactive Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs text-slate-700">
                        <Layers size={18} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 tracking-tight">Delivery Pipeline</h2>
                        <p className="text-xs text-slate-500 tracking-normal font-normal">
                            Showing {processedDeliveries.length} of {deliveries.length} shipments {delayedCount > 0 && `• ${delayedCount} delayed alerts`}
                        </p>
                    </div>
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                    {['All', 'Arrived', 'In Transit', 'Expected', 'Delayed', 'Completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-xs ${statusFilter === status
                                ? 'bg-indigo-600 text-white shadow-indigo-200'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Core Table View */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[840px]">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold text-xs tracking-wider uppercase select-none">
                                <th className="py-3 px-4 w-[130px] cursor-pointer hover:text-slate-600" onClick={() => handleSort('id')}>
                                    <div className="flex items-center space-x-1">
                                        <span>PO Reference</span>
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="py-3 px-4 w-[240px] cursor-pointer hover:text-slate-600" onClick={() => handleSort('supplier')}>
                                    <div className="flex items-center space-x-1">
                                        <span>Supplier & Logistics</span>
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="py-3 px-4 w-[170px] cursor-pointer hover:text-slate-600" onClick={() => handleSort('expectedDate')}>
                                    <div className="flex items-center space-x-1">
                                        <span>Estimated Delivery</span>
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="py-3 px-4 text-center w-[120px] cursor-pointer hover:text-slate-600" onClick={() => handleSort('totalPallets')}>
                                    <div className="flex items-center justify-center space-x-1">
                                        <span>Load Volume</span>
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="py-3 px-4 w-[160px] cursor-pointer hover:text-slate-600" onClick={() => handleSort('statusOrder')}>
                                    <div className="flex items-center space-x-1">
                                        <span>Fulfillment Status</span>
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="py-3 px-4 text-right w-[140px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-normal text-slate-600">
                            {processedDeliveries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-slate-400">
                                        No items match the selected "{statusFilter}" status filter.
                                    </td>
                                </tr>
                            ) : (
                                processedDeliveries.map((delivery) => {
                                    const isDelayed = delivery?.status === 'Delayed' || delivery?.isDelayed;
                                    const statusConfig = getStatusConfig(delivery.status);

                                    return (
                                        <tr
                                            key={delivery.id}
                                            onClick={() => handleOpenModal(delivery)}
                                            className={`hover:bg-slate-50/70 cursor-pointer transition-all group relative duration-150 ${statusConfig.borderLeft}`}
                                        >
                                            {/* PO Identification */}
                                            <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm tracking-tight">
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
                                                <span className={`inline-flex items-center px-2.5 py-1 text-xs rounded-lg border tracking-wide shadow-2xs ${statusConfig.badge}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} mr-1.5 shrink-0`}></span>
                                                    {delivery.status}
                                                </span>
                                            </td>

                                            {/* Responsive Management Suite */}
                                            <td className="py-3 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end space-x-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenModal(delivery);
                                                        }}
                                                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-98 rounded-lg transition-all shadow-xs tracking-wide"
                                                    >
                                                        <Eye size={13} className="text-slate-400" />
                                                        <span>Open</span>
                                                    </button>

                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
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
                                                                        e.stopPropagation();
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
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}