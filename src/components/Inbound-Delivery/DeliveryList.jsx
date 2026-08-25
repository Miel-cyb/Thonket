import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Package,
    ShieldCheck,
    AlertTriangle,
    Clock,
    CheckCircle2,
    Truck,
    X,
    Play,
    FileCheck,
    XCircle,
    ArrowRightCircle,
    FileText
} from 'lucide-react';
import StartReceivingModal from './modals/StartReceivingModal';

// ==========================================
// STATUS CONFIGURATION & MAPPING
// ==========================================
const STATUS_CONFIG = {
    GATE_CHECKED_IN: {
        label: 'Gate Checked In',
        color: 'bg-blue-50 text-blue-700 border-blue-200/80',
        icon: Truck,
        actionLabel: 'Start Receiving',
        actionIcon: Play,
        actionClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
    },
    RECEIVING_IN_PROGRESS: {
        label: 'Receiving In Progress',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        icon: Package,
        actionLabel: 'Resume Offloading',
        actionIcon: ArrowRightCircle,
        actionClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
    },
    RECEIVED_PENDING_RECONCILIATION: {
        label: 'Pending Reconciliation',
        color: 'bg-amber-50 text-amber-700 border-amber-200/80',
        icon: Clock,
        actionLabel: 'Verify Tallies',
        actionIcon: FileCheck,
        actionClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
    },
    RECONCILED: {
        label: 'Reconciled',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        icon: CheckCircle2,
        actionLabel: 'Release to Inventory',
        actionIcon: CheckCircle2,
        actionClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
    },
    REJECTED: {
        label: 'Rejected',
        color: 'bg-rose-50 text-rose-700 border-rose-200/80',
        icon: XCircle,
        actionLabel: 'View Rejection Notice',
        actionIcon: FileText,
        actionClass: 'bg-white border border-rose-300 text-rose-700 hover:bg-rose-50'
    },
    DISCREPANCY_FLAGGED: {
        label: 'Discrepancy Flagged',
        color: 'bg-purple-50 text-purple-700 border-purple-200/80',
        icon: AlertTriangle,
        actionLabel: 'Resolve Claim',
        actionIcon: AlertTriangle,
        actionClass: 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
    }
};

const getStatusBadge = (statusKey) => {
    return STATUS_CONFIG[statusKey] || {
        label: statusKey || 'Pending',
        color: 'bg-slate-50 text-slate-700 border-slate-200',
        icon: Package,
        actionLabel: 'Review Details',
        actionIcon: FileText,
        actionClass: 'bg-slate-800 hover:bg-slate-900 text-white shadow-xs'
    };
};

// ==========================================
// Component: DeliveryList
// ==========================================

export default function DeliveryList({
    purchaseOrders = [],
    selectedPOId,
    onSelectPO,
    searchQuery = '',
    onSearchChange,
    activeTab = 'ALL',
    onTabChange,
    onActionClick,
    onReceiveStarted
}) {
    const navigate = useNavigate();

    // Modal State Management
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [activePOForReceiving, setActivePOForReceiving] = useState(null);

    // Calculate accurate counts for individual tab filters
    const statusCounts = purchaseOrders.reduce((acc, po) => {
        const key = po.rawStatus || po.status || 'GATE_CHECKED_IN';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const filteredPOs = purchaseOrders.filter((po) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
            !query ||
            po.id?.toLowerCase().includes(query) ||
            po.supplier?.toLowerCase().includes(query) ||
            po.carrier?.toLowerCase().includes(query) ||
            po.truckNumber?.toLowerCase().includes(query);

        const matchesStatus =
            activeTab === 'ALL' || po.rawStatus === activeTab || po.status === activeTab;

        return matchesSearch && matchesStatus;
    });

    const TABS = [
        { key: 'ALL', label: 'All Shipments' },
        { key: 'GATE_CHECKED_IN', label: 'At Gate' },
        { key: 'RECEIVING_IN_PROGRESS', label: 'Receiving' },
        { key: 'RECEIVED_PENDING_RECONCILIATION', label: 'Pending Rec.' },
        { key: 'RECONCILED', label: 'Reconciled' },
        { key: 'DISCREPANCY_FLAGGED', label: 'Discrepancies' },
        { key: 'REJECTED', label: 'Rejected' }
    ];

    const handleActionTrigger = (po, statusKey) => {
        const detailId = po.id; // Mapping detailId to purchase order / shipment ID

        if (statusKey === 'GATE_CHECKED_IN') {
            // Option A: Open modal confirmation, then route upon confirmation
            setActivePOForReceiving(po);
            setIsReceiveModalOpen(true);
        } else {
            // Direct commercial routing pattern as requested
            navigate(`/receiving-audit/${detailId}`);
            onActionClick?.(po, statusKey);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 lg:p-5 flex flex-col h-full w-full">
            {/* Header & Search Controls */}
            <div className="space-y-3.5 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                            Active Deliveries Queue
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
                                {filteredPOs.length} Shipments
                            </span>
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Manage dock door allocations, physical tallies, and inventory intake approvals.
                        </p>
                    </div>
                </div>

                <div className="relative flex items-center">
                    <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by PO #, supplier name, transport carrier, or truck license..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange?.('')}
                            className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
                            aria-label="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Filter Navigation Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-b border-slate-100 scrollbar-none">
                    {TABS.map((tab) => {
                        const count = tab.key === 'ALL' ? purchaseOrders.length : (statusCounts[tab.key] || 0);
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => onTabChange?.(tab.key)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${isActive
                                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-100'
                                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* List Body Container */}
            <div className="flex flex-col gap-3">
                {filteredPOs.length === 0 ? (
                    <div className="py-12 px-4 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                        <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <h4 className="text-xs font-bold text-slate-700">No shipments found</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Try adjusting your search query or switching category tabs.
                        </p>
                    </div>
                ) : (
                    filteredPOs.map((po) => {
                        const statusKey = po.rawStatus || po.status || 'GATE_CHECKED_IN';
                        const badge = getStatusBadge(statusKey);
                        const StatusIcon = badge.icon;
                        const ActionIcon = badge.actionIcon;
                        const isSelected = selectedPOId === po.id;

                        return (
                            <div
                                key={po.id}
                                onClick={() => {
                                    onSelectPO?.(po.id);
                                    navigate(`/receiving-audit/${po.id}`);
                                }}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 ${isSelected
                                    ? 'border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-500/10 shadow-sm'
                                    : 'border-slate-200/90 hover:border-indigo-300 hover:shadow-xs bg-white'
                                    }`}
                            >
                                {/* Left Section: Metadata & Identifiers */}
                                <div className="flex items-start gap-3.5 w-full xl:w-auto">
                                    <div className="p-3 rounded-xl shrink-0 bg-slate-50 text-indigo-600 border border-slate-100 shadow-2xs mt-0.5 xl:mt-0">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1 w-full">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <span className="text-xs font-extrabold text-slate-900 tracking-tight">{po.id}</span>
                                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border flex items-center gap-1 ${badge.color}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {badge.label}
                                            </span>
                                            <span className="text-[11px] font-semibold text-slate-400">
                                                Dock: <span className="text-slate-700 font-bold">{po.dockNumber || 'Bay 01'}</span>
                                            </span>
                                        </div>

                                        <div className="text-xs font-semibold text-slate-800">
                                            {po.supplier}
                                        </div>

                                        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium flex-wrap pt-0.5">
                                            <span>Carrier: <strong className="text-slate-700">{po.carrier}</strong></span>
                                            <span>Truck Plate: <strong className="text-slate-700">{po.truckNumber}</strong></span>
                                            <span>Seal #: <strong className="text-slate-700">{po.sealNumber}</strong></span>
                                            <span>Manifest: <strong className="text-slate-700">{po.items?.length || 0} SKUs</strong></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section: Contextual Action Trigger */}
                                <div className="flex items-center justify-end w-full xl:w-auto pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleActionTrigger(po, statusKey);
                                        }}
                                        className={`w-full xl:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${badge.actionClass}`}
                                    >
                                        <ActionIcon className="w-3.5 h-3.5" />
                                        {badge.actionLabel}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Start Receiving Modal Component Integration */}
            <StartReceivingModal
                isOpen={isReceiveModalOpen}
                onClose={() => {
                    setIsReceiveModalOpen(false);
                    setActivePOForReceiving(null);
                }}
                purchaseOrder={activePOForReceiving}
                onSuccess={(updatedPO) => {
                    if (onReceiveStarted) {
                        onReceiveStarted(updatedPO);
                    }
                    setIsReceiveModalOpen(false);
                    if (activePOForReceiving?.id) {
                        navigate(`/receiving-audit/${activePOForReceiving.id}`);
                    }
                    setActivePOForReceiving(null);
                }}
            />
        </div>
    );
}