import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Layers,
    Package,
    Clock,
    CheckCheck,
    ShieldAlert,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    Search,
    ArrowLeft
} from 'lucide-react';

/**
 * InventoryPushManagementView Component
 * Enterprise-grade dashboard view for managing and pushing reconciled purchase orders 
 * into inventory storage systems. Supports robust filtering, data-payload passing, 
 * and modern React SPA route integration for path: /inventory/push/:pushId.
 */
export default function InventoryPushManagementView({ orders = [], onSelectPush }) {
  //  console.log('this is the data to push to inventory:', orders);

    const [subFilter, setSubFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // React Router hooks for handling /inventory/push/:pushId navigation & parameters
    const navigate = useNavigate();
    const { pushId } = useParams();

    // Filter and search logic across orders
    const filteredOrders = useMemo(() => {
        return orders.filter(po => {
            const items = Array.isArray(po.items) ? po.items : [];
            const hasDiscrepancy = items.some(i => (i.damagedQty || 0) > 0 || (i.receivedQty || 0) < (i.orderedQty || 0));

            // Sub-filter tabs condition
            let matchesTab = true;
            if (subFilter === 'READY') matchesTab = po.rawStatus === 'RECONCILED' && po.pushState !== 'PUSHED';
            else if (subFilter === 'PARTIAL') matchesTab = po.pushState === 'PARTIALLY_PUSHED';
            else if (subFilter === 'COMPLETED') matchesTab = po.pushState === 'PUSHED' || po.rawStatus === 'COMPLETED';
            else if (subFilter === 'DISCREPANCIES') matchesTab = hasDiscrepancy;

            if (!matchesTab) return false;

            // Search query filter (matches ID or supplier name)
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const idMatch = (po.id || '').toLowerCase().includes(query);
                const supplierMatch = (po.supplier || '').toLowerCase().includes(query);
                return idMatch || supplierMatch;
            }

            return true;
        });
    }, [orders, subFilter, searchQuery]);

    // Enhanced navigation passing both ID context & full object payload securely to target path
    const handleNavigateToDetail = (po) => {
        const targetRoute = `/inventory/push/${po.id || po.rawId}`;

        if (typeof onSelectPush === 'function') {
            onSelectPush(po, targetRoute);
        } else {
            // Native React Router v6 navigation passing order payload through route state
            navigate(targetRoute, { state: { orderData: po } });
        }
    };

    // If a pushId is present in the URL route, render the inline detail view for that specific item
    if (pushId) {
        const currentOrder = orders.find(po => po.id === pushId || po.rawId === pushId) || window.history.state?.orderData || {};
        const items = Array.isArray(currentOrder.items) ? currentOrder.items : [];
        const totalUnits = items.reduce((acc, i) => acc + (i.acceptedQty ?? i.receivedQty ?? 0), 0);

        return (
            <div className="w-full max-w-7xl mx-auto p-6 flex flex-col gap-6 bg-slate-50/60 min-h-screen">
                {/* Detail View Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/inventory/push')}
                            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Package className="w-5 h-5" />
                                </span>
                                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                                    Batch Details: <span className="font-mono text-indigo-600">{currentOrder.id || pushId}</span>
                                </h1>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 pl-11">
                                Supplier: <strong className="text-slate-700">{currentOrder.supplier || 'Unknown Supplier'}</strong>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => alert(`Successfully pushed batch ${pushId} to inventory storage!`)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                        <CheckCircle2 className="w-4 h-4" /> Confirm & Push to Inventory
                    </button>
                </div>

                {/* Detail Items Breakdown Table */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4 text-indigo-600" /> Reconciled Items Breakdown ({items.length} SKUs • {totalUnits} Total Units)
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold bg-slate-50/50">
                                    <th className="p-3 rounded-l-xl">SKU / Item</th>
                                    <th className="p-3">Ordered</th>
                                    <th className="p-3">Received</th>
                                    <th className="p-3">Accepted</th>
                                    <th className="p-3 rounded-r-xl">Damaged / Discrepancy</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-6 text-center text-slate-400">
                                            No item payload data available for this batch ID.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition">
                                            <td className="p-3 font-medium text-slate-800">{item.name || item.sku || `Item #${idx + 1}`}</td>
                                            <td className="p-3 text-slate-600">{item.orderedQty ?? 0}</td>
                                            <td className="p-3 text-slate-600">{item.receivedQty ?? 0}</td>
                                            <td className="p-3 font-semibold text-slate-900">{item.acceptedQty ?? item.receivedQty ?? 0}</td>
                                            <td className="p-3">
                                                {(item.damagedQty || 0) > 0 ? (
                                                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                                                        <ShieldAlert className="w-3 h-3" /> {item.damagedQty} damaged
                                                    </span>
                                                ) : (
                                                    <span className="text-emerald-600 font-medium">None</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // Default Main Management View
    return (
        <div className="w-full max-w-7xl mx-auto p-6 flex flex-col gap-6 bg-slate-50/60 min-h-screen">
            {/* Enterprise Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Package className="w-5 h-5" />
                        </span>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                            Inventory Push & Stock Allocation
                        </h1>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 pl-11">
                        Manage and sync reconciled shipment batches into active warehouse stock bins.
                    </p>
                </div>

                {/* Search Bar & Quick Tools */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by Batch ID or Supplier..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Sub-Tabs Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
                {[
                    { id: 'ALL', label: 'All Tracked Batches', icon: Layers, count: orders.length },
                    { id: 'READY', label: 'Ready to Push', icon: Package },
                    { id: 'PARTIAL', label: 'Partially Pushed', icon: Clock },
                    { id: 'COMPLETED', label: 'Fully Pushed', icon: CheckCheck },
                    { id: 'DISCREPANCIES', label: 'Discrepancies / Issues', icon: ShieldAlert },
                ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = subFilter === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setSubFilter(tab.id)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${isActive
                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* List of Batches & Push Status Cards */}
            <div className="grid grid-cols-1 gap-4">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                        <Box className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
                        <p className="text-xs font-semibold">No records match this push state filter.</p>
                        <p className="text-[11px] text-slate-400 mt-1">Try clearing your search query or selecting a different tab.</p>
                    </div>
                ) : (
                    filteredOrders.map(po => {
                        const items = Array.isArray(po.items) ? po.items : [];
                        const totalUnits = items.reduce((acc, i) => acc + (i.acceptedQty ?? i.receivedQty ?? 0), 0);
                        const hasIssues = items.some(i => (i.damagedQty || 0) > 0 || (i.receivedQty || 0) < (i.orderedQty || 0));
                        const isFullyPushed = po.pushState === 'PUSHED' || po.rawStatus === 'COMPLETED';
                        const isPartial = po.pushState === 'PARTIALLY_PUSHED';

                        return (
                            <div
                                key={po.id || po.rawId}
                                className="bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-bold text-slate-900 font-mono">{po.id}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs font-medium text-slate-600">{po.supplier || 'Unknown Supplier'}</span>

                                        {isFullyPushed ? (
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Pushed to Inventory
                                            </span>
                                        ) : isPartial ? (
                                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Partially Pushed
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold">
                                                Ready for Sync
                                            </span>
                                        )}

                                        {hasIssues && (
                                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-bold flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> Reconciled with Discrepancies
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {items.length} SKU(s) • Total Accepted Units: <strong className="text-slate-700">{totalUnits}</strong>
                                    </p>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <button
                                        onClick={() => handleNavigateToDetail(po)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                                    >
                                        <ArrowUpRight className="w-4 h-4" /> View Details & Push
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