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
    Receiving: { label: 'Receiving', color: 'bg-blue-50 text-blue-700 border-blue-200/80', icon: Package },
    Inspection: { label: 'Inspection', color: 'bg-amber-50 text-amber-700 border-amber-200/80', icon: ShieldCheck },
    Discrepancy: { label: 'Discrepancy', color: 'bg-rose-50 text-rose-700 border-rose-200/80', icon: AlertTriangle },
    Reconciliation: { label: 'Reconciliation', color: 'bg-purple-50 text-purple-700 border-purple-200/80', icon: Clock },
    Completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', icon: CheckCircle2 }
};

const getStatusBadge = (status) => {
    // Normalizing status lookup key (e.g. capitalized)
    const formattedKey = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '';
    return STATUS_CONFIG[formattedKey] || STATUS_CONFIG[status] || {
        label: status || 'Pending',
        color: 'bg-slate-50 text-slate-700 border-slate-200',
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
    // Calculate counts for tab badges case-insensitively
    const statusCounts = purchaseOrders.reduce((acc, po) => {
        const rawStatus = po.status ? po.status.trim() : 'Unassigned';
        // Match key case format (capitalize first letter)
        const key = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col h-full">
            {/* --- HEADER & SEARCH --- */}
            <div className="space-y-3 mb-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        Deliveries Queue
                        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200/80">
                            {filteredPOs.length}
                        </span>
                    </h3>
                </div>

                <div className="relative flex items-center">
                    <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search PO #, supplier, or carrier..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange?.('')}
                            className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition"
                            aria-label="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* --- FILTER TABS BAR --- */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 border-b border-slate-100 scrollbar-thin scrollbar-thumb-slate-200">
                {TABS.map((tab) => {
                    const isActive = activeTab.toUpperCase() === tab.toUpperCase();
                    const count = tab === 'ALL' ? purchaseOrders.length : (statusCounts[tab] || 0);

                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => onTabChange?.(tab)}
                            className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${isActive
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                                }`}
                        >
                            <span>{tab}</span>
                            <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold transition-colors ${isActive
                                    ? 'bg-indigo-700/60 text-white'
                                    : 'bg-slate-200/80 text-slate-600'
                                    }`}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* --- SHIPMENTS CARDS LIST --- */}
            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[580px] scrollbar-thin scrollbar-thumb-slate-200">
                {filteredPOs.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200/80 my-auto">
                        <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-700">No shipments found</p>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                            Try adjusting your search terms or clearing status filters.
                        </p>
                        {(searchQuery || activeTab !== 'ALL') && (
                            <button
                                type="button"
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
                                className={`group p-3.5 rounded-xl cursor-pointer border transition-all duration-200 relative ${isSelected
                                    ? 'border-indigo-600/80 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-500/20 border-l-4 border-l-indigo-600'
                                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                                    }`}
                            >
                                {/* Row 1: PO ID & Status Badge */}
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <span
                                        className={`font-bold text-xs tracking-tight font-mono transition-colors ${isSelected
                                            ? 'text-indigo-950'
                                            : 'text-slate-900 group-hover:text-indigo-600'
                                            }`}
                                    >
                                        {po.id || 'PO-UNKNOWN'}
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.color}`}
                                    >
                                        <BadgeIcon className="w-3 h-3 shrink-0" />
                                        {badge.label}
                                    </span>
                                </div>

                                {/* Row 2: Supplier Name */}
                                <div className="text-xs text-slate-700 font-semibold mb-2.5 truncate">
                                    {po.supplier || 'Unassigned Supplier'}
                                </div>

                                {/* Row 3: Logistics Details Footer */}
                                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                                    <span className="flex items-center gap-1.5 text-slate-500 truncate max-w-[130px]">
                                        <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        {po.carrier || 'Standard Carrier'}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        {po.expectedDate && (
                                            <span className="flex items-center gap-1 text-slate-500 text-[10px]">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                {po.expectedDate}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 text-[10px]">
                                            <Warehouse className="w-3 h-3 text-slate-400" />
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