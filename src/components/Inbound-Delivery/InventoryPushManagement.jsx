import React, { useState, useMemo } from 'react';
import {
    Box,
    Layers,
    Package,
    Clock,
    CheckCheck,
    ShieldAlert,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight
} from 'lucide-react';

// InventoryPushManagementView Component - Displays a list of purchase orders ready to be pushed to inventory
export default function InventoryPushManagementView({ orders, onPushToInventory, onUpdatePushState }) {
    const [subFilter, setSubFilter] = useState('ALL');

    const filteredOrders = useMemo(() => {
        return orders.filter(po => {
            const hasDiscrepancy = po.items.some(i => i.damagedQty > 0 || i.receivedQty < i.orderedQty);
            if (subFilter === 'READY') return po.rawStatus === 'RECONCILED' && po.pushState !== 'PUSHED';
            if (subFilter === 'PARTIAL') return po.pushState === 'PARTIALLY_PUSHED';
            if (subFilter === 'COMPLETED') return po.pushState === 'PUSHED' || po.rawStatus === 'COMPLETED';
            if (subFilter === 'DISCREPANCIES') return hasDiscrepancy;
            return true;
        });
    }, [orders, subFilter]);

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Sub-Tabs Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
                {[
                    { id: 'ALL', label: 'All Tracked Batches', icon: Layers },
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
                    </div>
                ) : (
                    filteredOrders.map(po => {
                        const totalUnits = po.items.reduce((acc, i) => acc + i.acceptedQty, 0);
                        const hasIssues = po.items.some(i => i.damagedQty > 0 || i.receivedQty < i.orderedQty);
                        const isFullyPushed = po.pushState === 'PUSHED' || po.rawStatus === 'COMPLETED';
                        const isPartial = po.pushState === 'PARTIALLY_PUSHED';

                        return (
                            <div
                                key={po.id}
                                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-bold text-slate-900">{po.id}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs font-medium text-slate-600">{po.supplier}</span>

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
                                        {po.items.length} SKU(s) • Total Accepted Units: <strong className="text-slate-700">{totalUnits}</strong>
                                    </p>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    {!isFullyPushed && (
                                        <>
                                            {!isPartial && (
                                                <button
                                                    onClick={() => onUpdatePushState(po.id, 'PARTIALLY_PUSHED')}
                                                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                                                >
                                                    Mark Partial
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onPushToInventory(po.id)}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                                            >
                                                <ArrowUpRight className="w-4 h-4" /> Push to Inventory
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}