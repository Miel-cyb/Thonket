import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldAlert,
    CheckCircle2,
    Clock,
    XCircle,
    Layers,
    FileText,
    AlertCircle,
    Search,
    ChevronRight,
    Building2,
    PackageCheck
} from 'lucide-react';

/**
 * ReconciliationIssuesView Component - Optimized & Compact
 * Designed to cleanly display item counts, item lists, delivery metadata,
 * dock info, and financials tailored precisely to the provided data model structure.
 * 
 * Updated with robust router navigation passing the complete order object via state.
 */
export default function ReconciliationIssuesView({ items = [], onNavigate }) {
    //console.log('ReconciliationIssuesView items:', items);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Handle navigation to the detail view properly, ensuring the full order object is passed in location state
    const handleDetailNavigation = (order) => {
        // console.log('Navigating to detail view for order:', order);
        if (onNavigate) {
            onNavigate(order);
        } else {
            navigate(`/receiving-reconciliation/detail/${order.id}`, { state: { orderData: order } });
        }
    };

    // Filter items based on active tab and search query matching the exact data schema
    const filteredItems = useMemo(() => {
        return items.filter(order => {
            const hasDiscrepancy = order.reconciliation?.hasDiscrepancy ||
                order.status === 'Discrepancy' ||
                order.items?.some(i => (i.damagedQty || 0) > 0 || (i.acceptedQty !== undefined ? i.acceptedQty : i.orderedQty) < i.orderedQty);

            // Determine dynamic state if missing
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
            const matchesTracking = String(order.trackingNo || '').toLowerCase().includes(q);
            const matchesItems = order.items?.some(i => String(i.name || '').toLowerCase().includes(q));

            return matchesId || matchesSupplier || matchesTracking || matchesItems;
        });
    }, [items, activeTab, searchQuery]);

    // Metrics calculations for tab badges
    const counts = useMemo(() => {
        let pending = 0;
        let resolved = 0;
        let rejected = 0;
        let completed = 0;

        items.forEach(order => {
            const hasDiscrepancy = order.reconciliation?.hasDiscrepancy ||
                order.status === 'Discrepancy' ||
                order.items?.some(i => (i.damagedQty || 0) > 0 || (i.acceptedQty !== undefined ? i.acceptedQty : i.orderedQty) < i.orderedQty);
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
        <div className="flex flex-col gap-5 w-full">
            {/* Controls Bar: Sub-Navigation Tabs & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { id: 'ALL', label: 'All', count: counts.all, icon: Layers },
                        { id: 'PENDING', label: 'Pending Issues', count: counts.pending, icon: Clock, color: 'text-rose-600' },
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
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isActive
                                    ? 'bg-blue-600 text-white shadow-2xs'
                                    : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color || 'text-slate-400'}`} />
                                <span>{tab.label}</span>
                                <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Quick Search Input */}
                <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search PO, supplier, item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Records List Container */}
            <div className="flex flex-col gap-3.5">
                {filteredItems.length === 0 ? (
                    <div className="bg-white border border-slate-200/80 rounded-xl py-14 text-center shadow-2xs">
                        <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto px-4">
                            <div className="p-3.5 bg-slate-100 text-slate-400 rounded-xl">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">No records found</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {searchQuery ? `No records match "${searchQuery}" under this filter state.` : "There are no shipment issues matching this filter state."}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-1 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
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
                        const totalCost = order.reconciliation?.totalReceivedCost || order.items?.reduce((sum, item) => sum + ((item.acceptedQty || item.orderedQty || 0) * (item.unitCost || 0)), 0) || 0;

                        const hasDiscrepancy = order.reconciliation?.hasDiscrepancy || totalDamaged > 0 || totalAccepted < totalOrdered;
                        const issueState = order.issueState || (hasDiscrepancy ? 'PENDING' : 'COMPLETED');

                        // Summarize item names nicely
                        const itemNamesSummary = order.items?.map(i => `${i.name} (${i.acceptedQty}/${i.orderedQty})`).join(', ') || 'No items listed';

                        return (
                            <div
                                key={order.id}
                                onClick={() => handleDetailNavigation(order)}
                                className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
                            >
                                {/* Left Section: ID, Status, Supplier */}
                                <div className="flex items-start sm:items-center gap-4">
                                    <div className="flex flex-col gap-1.5 shrink-0">
                                        {issueState === 'RESOLVED' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold uppercase tracking-wider w-fit">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                                            </span>
                                        ) : issueState === 'REJECTED' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200/60 text-[10px] font-bold uppercase tracking-wider w-fit">
                                                <XCircle className="w-3.5 h-3.5" /> Rejected
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200/60 text-[10px] font-bold uppercase tracking-wider w-fit">
                                                <AlertCircle className="w-3.5 h-3.5" /> Discrepancy
                                            </span>
                                        )}
                                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 font-mono transition-colors">
                                            {order.id}
                                        </span>
                                    </div>

                                    <div className="h-9 w-px bg-slate-200/80 hidden sm:block" />

                                    <div className="flex flex-col gap-1 max-w-xs">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="truncate">{order.supplier || 'Assigned Supplier'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                                            {order.dockNumber && <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px] text-slate-700">{order.dockNumber}</span>}
                                            {order.trackingNo && <span>Track: <strong className="text-slate-700 font-mono">{order.trackingNo}</strong></span>}
                                            {order.expectedDate && <span>Due: {order.expectedDate}</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Section: Compact Inventory & Item Breakdown */}
                                <div className="flex flex-col gap-1 bg-slate-50/60 border border-slate-100 rounded-lg p-3 md:max-w-xs w-full">
                                    <div className="text-xs font-medium text-slate-700 truncate" title={itemNamesSummary}>
                                        📦 {itemNamesSummary}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                        <span>Ordered: <strong className="text-slate-800">{totalOrdered}</strong></span>
                                        <span>Accepted: <strong className="text-emerald-700">{totalAccepted}</strong></span>
                                        {totalDamaged > 0 && <span className="text-rose-600 font-semibold">Damaged: {totalDamaged}</span>}
                                    </div>
                                </div>

                                {/* Right Section: Cost & Action Button */}
                                <div className="flex items-center justify-between md:justify-end gap-5">
                                    <div className="text-right">
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Reconciled Cost</p>
                                        <p className="text-xs font-bold font-mono text-slate-900">GH₵{totalCost.toLocaleString()}</p>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDetailNavigation(order);
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                                    >
                                        Details
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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