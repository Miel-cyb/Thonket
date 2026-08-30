import React, { useState, useMemo } from 'react';
import {
    ShieldAlert,
    CheckCircle2,
    Clock,
    XCircle,
    Layers,
    FileText,
    AlertCircle,
    RefreshCw,
    Search,
    ChevronRight,
    Calendar,
    Building2,
    PackageCheck
} from 'lucide-react';

export default function ReconciliationIssuesView({ items = [], onNavigate }) {
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter items based on active tab and search query
    const filteredItems = useMemo(() => {
        return items.filter(order => {
            const hasDiscrepancy = order.items?.some(i => (i.damagedQty || 0) > 0 || (i.receivedQty || 0) < (i.orderedQty || 0));
            const issueState = order.issueState || (hasDiscrepancy ? 'PENDING' : 'COMPLETED');

            let matchesTab = true;
            if (activeTab === 'PENDING') {
                matchesTab = issueState === 'PENDING' || (hasDiscrepancy && issueState !== 'RESOLVED' && issueState !== 'REJECTED');
            } else if (activeTab === 'RESOLVED') {
                matchesTab = issueState === 'RESOLVED';
            } else if (activeTab === 'REJECTED') {
                matchesTab = issueState === 'REJECTED';
            } else if (activeTab === 'COMPLETED') {
                matchesTab = issueState === 'COMPLETED' || order.pushState === 'PUSHED';
            }

            if (!matchesTab) return false;
            if (!searchQuery.trim()) return true;

            const q = searchQuery.toLowerCase();
            const matchesId = String(order.id).toLowerCase().includes(q);
            const matchesSupplier = String(order.supplier || '').toLowerCase().includes(q);
            return matchesId || matchesSupplier;
        });
    }, [items, activeTab, searchQuery]);

    // Metrics calculations for tab badges
    const counts = useMemo(() => {
        let pending = 0;
        let resolved = 0;
        let rejected = 0;
        let completed = 0;

        items.forEach(order => {
            const hasDiscrepancy = order.items?.some(i => (i.damagedQty || 0) > 0 || (i.receivedQty || 0) < (i.orderedQty || 0));
            const issueState = order.issueState || (hasDiscrepancy ? 'PENDING' : 'COMPLETED');

            if (issueState === 'PENDING' || (hasDiscrepancy && issueState !== 'RESOLVED' && issueState !== 'REJECTED')) {
                pending++;
            } else if (issueState === 'RESOLVED') {
                resolved++;
            } else if (issueState === 'REJECTED') {
                rejected++;
            } else if (issueState === 'COMPLETED' || order.pushState === 'PUSHED') {
                completed++;
            }
        });

        return { all: items.length, pending, resolved, rejected, completed };
    }, [items]);

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Controls Bar: Sub-Navigation Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { id: 'ALL', label: 'All Records', count: counts.all, icon: Layers },
                        { id: 'PENDING', label: 'Pending Issues', count: counts.pending, icon: Clock, color: 'text-red-600' },
                        { id: 'RESOLVED', label: 'Resolved', count: counts.resolved, icon: CheckCircle2, color: 'text-emerald-600' },
                        { id: 'REJECTED', label: 'Rejected', count: counts.rejected, icon: XCircle, color: 'text-rose-600' },
                        { id: 'COMPLETED', label: 'Cleared', count: counts.completed, icon: PackageCheck, color: 'text-indigo-600' },
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive
                                    ? 'bg-blue-600 text-white shadow-xs font-medium'
                                    : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-normal'
                                    }`}
                            >
                                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.color || 'text-slate-400'}`} />
                                <span className="tracking-normal">{tab.label}</span>
                                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Records List Container */}
            <div className="flex flex-col gap-3">
                {filteredItems.length === 0 ? (
                    <div className="bg-white border border-slate-200/80 rounded-2xl py-16 text-center shadow-xs">
                        <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto px-4">
                            <div className="p-3.5 bg-slate-100 text-slate-400 rounded-2xl">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">No records found</h3>
                            <p className="text-xs text-slate-500 font-normal">
                                {searchQuery ? `No records match "${searchQuery}" under this filter state.` : "There are no shipment issues matching this filter state."}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                                >
                                    Clear search query
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    filteredItems.map(order => {
                        const totalOrdered = order.items?.reduce((sum, item) => sum + (item.orderedQty || 0), 0) || 0;
                        const totalAccepted = order.items?.reduce((sum, item) => sum + (item.acceptedQty !== undefined ? item.acceptedQty : (item.orderedQty || 0)), 0) || 0;
                        const totalDamaged = order.items?.reduce((sum, item) => sum + (item.damagedQty || 0), 0) || 0;
                        const hasDiscrepancy = totalDamaged > 0 || totalAccepted < totalOrdered;
                        const issueState = order.issueState || (hasDiscrepancy ? 'PENDING' : 'COMPLETED');

                        return (
                            <div
                                key={order.id}
                                onClick={() => onNavigate ? onNavigate(order.id) : null}
                                className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer group"
                            >
                                {/* Left Info / Status */}
                                <div className="flex items-start sm:items-center gap-4">
                                    <div className="flex flex-col gap-1.5 shrink-0">
                                        {issueState === 'RESOLVED' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold uppercase tracking-wider w-fit">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                                            </span>
                                        ) : issueState === 'REJECTED' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 text-[10px] font-bold uppercase tracking-wider w-fit">
                                                <XCircle className="w-3.5 h-3.5" /> Rejected
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200/60 text-[10px] font-bold uppercase tracking-wider w-fit">
                                                <AlertCircle className="w-3.5 h-3.5" /> Pending Issue
                                            </span>
                                        )}
                                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            PO #{order.id}
                                        </span>
                                    </div>

                                    <div className="h-9 w-px bg-slate-200/80 hidden sm:block" />

                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                            <span>Supplier / Vendor</span>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-900">{order.supplier || 'Unknown Supplier'}</p>
                                        {order.date && (
                                            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-normal mt-0.5">
                                                <Calendar className="w-3 h-3" />
                                                <span>{order.date}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quantities Stats */}
                                <div className="grid grid-cols-3 sm:flex sm:items-center gap-6 py-2.5 lg:py-0 border-y lg:border-y-0 border-slate-100 bg-slate-50/50 lg:bg-transparent px-3 lg:px-0 rounded-xl">
                                    <div className="text-left sm:text-center">
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Ordered</p>
                                        <p className="text-xs font-bold text-slate-800 mt-0.5 tabular-nums">{totalOrdered}</p>
                                    </div>
                                    <div className="text-left sm:text-center">
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Accepted</p>
                                        <p className="text-xs font-bold text-emerald-600 mt-0.5 tabular-nums">{totalAccepted}</p>
                                    </div>
                                    <div className="text-left sm:text-center">
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Damaged/Short</p>
                                        <p className="text-xs font-bold text-rose-600 mt-0.5 tabular-nums">{totalDamaged || (totalOrdered - totalAccepted)}</p>
                                    </div>
                                </div>

                                {/* Navigation Action Button */}
                                <div className="flex items-center justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onNavigate) onNavigate(order.id);
                                        }}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer tracking-normal"
                                    >
                                        View Details
                                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}