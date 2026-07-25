import React from 'react';
import {
    Search,
    Package,
    ShieldCheck,
    AlertTriangle,
    Clock,
    CheckCircle2,
    Warehouse,
    Truck,
    X,
    Calendar
} from 'lucide-react';

const STATUS_CONFIG = {
    Receiving: { label: 'Receiving', color: 'bg-blue-50 text-blue-700 border-blue-200/80', dot: 'bg-blue-500', icon: Package },
    Inspection: { label: 'Inspection', color: 'bg-amber-50 text-amber-700 border-amber-200/80', dot: 'bg-amber-500', icon: ShieldCheck },
    Discrepancy: { label: 'Discrepancy', color: 'bg-rose-50 text-rose-700 border-rose-200/80', dot: 'bg-rose-500', icon: AlertTriangle },
    Reconciliation: { label: 'Reconciliation', color: 'bg-purple-50 text-purple-700 border-purple-200/80', dot: 'bg-purple-500', icon: Clock },
    Completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', dot: 'bg-emerald-500', icon: CheckCircle2 }
};

const getStatusBadge = (status) => {
    return STATUS_CONFIG[status] || {
        label: status || 'Pending',
        color: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        icon: Package
    };
};

export default function DeliveryList({
    purchaseOrders = [],
    selectedPOId,
    onSelectPO,
    searchQuery = '',
    onSearchChange,
    activeTab = 'ALL',
    onTabChange
}) {
    // Calculate counts for tab badges
    const statusCounts = purchaseOrders.reduce((acc, po) => {
        const key = po.status || 'ALL';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const filteredPOs = purchaseOrders.filter((po) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
            !query ||
            po.id?.toLowerCase().includes(query) ||
            po.supplier?.toLowerCase().includes(query) ||
            po.carrier?.toLowerCase().includes(query);

        const matchesStatus =
            activeTab === 'ALL' || po.status?.toUpperCase() === activeTab.toUpperCase();

        return matchesSearch && matchesStatus;
    });

    const TABS = ['ALL', 'Receiving', 'Inspection', 'Discrepancy', 'Reconciliation', 'Completed'];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-full">
            {/* --- HEADER & SEARCH --- */}
            <div className="space-y-3 mb-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        Deliveries Queue
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                            {filteredPOs.length}
                        </span>
                    </h3>
                </div>

                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search PO #, supplier, or carrier..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange?.('')}
                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* --- FILTER TABS BAR --- */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 border-b border-slate-100 scrollbar-none">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab;
                    const count = tab === 'ALL' ? purchaseOrders.length : (statusCounts[tab] || 0);

                    return (
                        <button
                            key={tab}
                            onClick={() => onTabChange?.(tab)}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md whitespace-nowrap transition flex items-center gap-1.5 ${isActive
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                                }`}
                        >
                            <span>{tab}</span>
                            <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive
                                    ? 'bg-indigo-700/60 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                    }`}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* --- SHIPMENTS CARDS LIST --- */}
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[580px]">
                {filteredPOs.length === 0 ? (
                    <div className="text-center py-10 px-4 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                        <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-600">No shipments found</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Try clearing your search query or selecting another status tab.</p>
                        {(searchQuery || activeTab !== 'ALL') && (
                            <button
                                onClick={() => {
                                    onSearchChange?.('');
                                    onTabChange?.('ALL');
                                }}
                                className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                ) : (
                    filteredPOs.map((po) => {
                        const badge = getStatusBadge(po.status);
                        const BadgeIcon = badge.icon;
                        const isSelected = po.id === selectedPOId;

                        return (
                            <div
                                key={po.id}
                                onClick={() => onSelectPO?.(po.id)}
                                className={`group p-3 rounded-lg cursor-pointer border transition-all duration-150 relative ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500/20'
                                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                                    }`}
                            >
                                {/* Left Active Bar Accent */}
                                {isSelected && (
                                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full" />
                                )}

                                {/* Row 1: PO ID & Status Badge */}
                                <div className="flex items-center justify-between gap-2 mb-1 pl-1">
                                    <span className={`font-bold text-xs tracking-tight transition ${isSelected ? 'text-indigo-900' : 'text-slate-900 group-hover:text-indigo-600'
                                        }`}>
                                        {po.id}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                                        <BadgeIcon className="w-3 h-3 shrink-0" />
                                        {badge.label}
                                    </span>
                                </div>

                                {/* Row 2: Supplier Name */}
                                <div className="text-xs text-slate-700 font-medium mb-2 pl-1 truncate">
                                    {po.supplier || 'Unassigned Supplier'}
                                </div>

                                {/* Row 3: Logistics Details Footer */}
                                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100/80 pl-1">
                                    <span className="flex items-center gap-1 text-slate-500 truncate max-w-[120px]">
                                        <Truck className="w-3 h-3 text-slate-400 shrink-0" />
                                        {po.carrier || 'Standard'}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        {po.expectedDate && (
                                            <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                                                <Calendar className="w-3 h-3" />
                                                {po.expectedDate}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60 text-[10px]">
                                            <Warehouse className="w-2.5 h-2.5 text-slate-400" />
                                            {po.dockNumber || 'Bay 0'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}