import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Building2,
    Download,
    Plus,
    RefreshCw,
    AlertCircle,
    Package,
    Truck,
    ShieldAlert,
    X
} from 'lucide-react';

// Import Modularized Components
import DeliveryList from '../components/Inbound-Delivery/DeliveryList';
import MetricsSummary from '../components/Inbound-Delivery/MetricsSummary';
import InventoryPushManagement from '../components/Inbound-Delivery/InventoryPushManagement';
import ReconciliationIssuesView from '../components/Inbound-Delivery/ReconciliationIssuesView';
import { API_ENDPOINTS } from '../utils/urls';

// ==========================================
// DATA TRANSFORMERS & FLATTENERS
// ==========================================

const transformLedgerToPO = (raw) => {
    if (!raw || typeof raw !== 'object') return null;

    const rawItems = Array.isArray(raw.items) ? raw.items : [];

    const items = rawItems.map((item, index) => {
        const ordered = Number(item.qtyOrdered ?? item.expectedQty ?? item.quantityExpected ?? 0);
        const received = Number(item.receivedQty ?? item.qtyReceived ?? item.quantityReceived ?? 0);
        const damaged = Number(item.damagedQty ?? 0);
        const accepted = Math.max(0, received - damaged);

        return {
            id: item.itemId || item.productId || item.sku || `SKU-${index + 1}`,
            name: item.productName || item.name || item.itemName || 'Unknown Item',
            orderedQty: ordered,
            receivedQty: received,
            damagedQty: damaged,
            lotNumber: item.lotNumber || 'LOT-PENDING',
            location: item.location || 'Unassigned',
            expiryDate: item.expiryDate || new Date().toISOString().split('T')[0],
            unitCost: Number(item.unitCost ?? item.price ?? 0),
            acceptedQty: accepted
        };
    });

    const totalOrdered = items.reduce((acc, i) => acc + i.orderedQty, 0) || raw.totalExpectedQty || 0;
    const totalReceived = items.reduce((acc, i) => acc + (i.receivedQty || 0), 0) || raw.totalReceivedQty || 0;

    let inferredStatus = raw.status || 'EXPECTED';
    if (raw.status === 'GATE_CHECKED_IN') {
        inferredStatus = 'Gate Checked In';
    } else if (raw.status === 'RECEIVING_IN_PROGRESS') {
        inferredStatus = 'Receiving';
    } else if (raw.status === 'RECEIVED_PENDING_RECONCILIATION') {
        inferredStatus = 'Reconciliation';
    } else if (raw.status === 'RECONCILED') {
        inferredStatus = 'Reconciled';
    } else if (raw.status === 'REJECTED' || raw.status === 'DISCREPANCY_FLAGGED') {
        inferredStatus = 'Discrepancy';
    } else if (totalReceived > 0 && totalReceived < totalOrdered) {
        inferredStatus = 'Receiving';
    }

    return {
        id: raw.ledgerNumber || raw.id || raw.purchaseOrderId || `PO-${Math.floor(1000 + Math.random() * 9000)}`,
        rawId: raw._id,
        ledgerId: raw.ledgerId,
        supplier: raw.supplierName || raw.supplier?.name || 'Assigned Supplier',
        expectedDate: raw.arrivedAt ? new Date(raw.arrivedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: inferredStatus,
        rawStatus: raw.status || 'EXPECTED',
        carrier: raw.logistics?.carrierName || raw.carrier || 'Standard Freight',
        trackingNo: raw.logistics?.waybillNumber || raw.trackingNo || 'TRK-PENDING',
        dockNumber: raw.dockNumber || 'Bay 01',
        truckNumber: raw.logistics?.truckNumber || 'N/A',
        sealNumber: raw.logistics?.sealNumber || 'N/A',
        driverName: raw.logistics?.driverName || 'N/A',
        notes: raw.notes || '',
        reconciliation: raw.reconciliation || {},
        items,
        readyToPush: raw.readyToPush || false,
        pushState: raw.pushState || 'PENDING',
        issueState: raw.issueState || 'PENDING',
        stateHistory: Array.isArray(raw.stateHistory) ? raw.stateHistory : []
    };
};

// ==========================================
// Component: ReceivingDeliveriesPage
// ==========================================
export default function ReceivingDeliveriesPage() {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedPOId, setSelectedPOId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewIntakeModal, setShowNewIntakeModal] = useState(false);

    // Master Workspace Tab state: 'activeReceiving' | 'reconciliation' | 'inventorySync'
    const [viewMode, setViewMode] = useState('activeReceiving');

    // API & Async states (handling all 3 root top-level arrays from response payload)
    const [activeReceiving, setActiveReceiving] = useState([]);
    const [issues, setIssues] = useState([]);
    const [inventorySync, setInventorySync] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // --- API FETCHING ---
    const fetchReceivingDeliveries = useCallback(async (signal) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_ENDPOINTS.WAREHOUSES}/inbound/delivery/receiving`, {
                method: 'GET',
                signal,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (response.status === 404) {
                setActiveReceiving([]);
                setIssues([]);
                setInventorySync([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error(`Server returned error status: ${response.status}`);
            }
            const data = await response.json();

            console.log('Fetched Receiving Deliveries Data:', data);

            // Safely target the inner payload wrapper if present
            const payload = data && data.data && typeof data.data === 'object' ? data.data : data;

            // Extract Top-Level Array 1: activeReceiving
            let rawActiveList = [];
            if (Array.isArray(payload)) {
                rawActiveList = payload;
            } else if (payload && typeof payload === 'object') {
                rawActiveList = payload.activeReceiving || payload.deliveries || payload.results || [];
            }
            const normalizedActive = rawActiveList.map(transformLedgerToPO).filter(Boolean);
            setActiveReceiving(normalizedActive);

            // Extract Top-Level Array 2: issues
            let rawIssuesList = [];
            if (payload && typeof payload === 'object' && Array.isArray(payload.issues)) {
                rawIssuesList = payload.issues;
            }
            const normalizedIssues = rawIssuesList.map(transformLedgerToPO).filter(Boolean);
            setIssues(normalizedIssues);

            // Extract Top-Level Array 3: inventorySync
            let rawSyncList = [];
            if (payload && typeof payload === 'object' && Array.isArray(payload.inventorySync)) {
                rawSyncList = payload.inventorySync;
            }
            const normalizedSync = rawSyncList.map(transformLedgerToPO).filter(Boolean);
            setInventorySync(normalizedSync);

            setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } catch (err) {
            if (err.name === 'AbortError') return;
            setError(err.message || 'Unable to connect to the receiving delivery gateway.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch live data on initial mount
    useEffect(() => {
        const controller = new AbortController();
        fetchReceivingDeliveries(controller.signal);
        return () => controller.abort();
    }, [fetchReceivingDeliveries]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowNewIntakeModal(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handlePushToInventory = (poId) => {
        setActiveReceiving((prev) =>
            prev.map((po) => (po.id === poId ? { ...po, rawStatus: 'COMPLETED', status: 'Completed', pushState: 'PUSHED', issueState: 'COMPLETED' } : po))
        );
        setInventorySync((prev) =>
            prev.map((po) => (po.id === poId ? { ...po, rawStatus: 'COMPLETED', status: 'Completed', pushState: 'PUSHED', issueState: 'COMPLETED' } : po))
        );
    };

    const handleUpdatePushState = (poId, newState) => {
        setInventorySync((prev) =>
            prev.map((po) => (po.id === poId ? { ...po, pushState: newState } : po))
        );
        setActiveReceiving((prev) =>
            prev.map((po) => (po.id === poId ? { ...po, pushState: newState } : po))
        );
    };

    const handleUpdateIssueState = (poId, newState) => {
        setIssues((prev) =>
            prev.map((po) => (po.id === poId ? { ...po, issueState: newState } : po))
        );
        setActiveReceiving((prev) =>
            prev.map((po) => (po.id === poId ? { ...po, issueState: newState } : po))
        );
    };

    // Combined pool for metrics summary computation
    const allCombinedOrders = useMemo(() => {
        const map = new Map();
        [...activeReceiving, ...issues, ...inventorySync].forEach(po => {
            if (po && po.id) map.set(po.id, po);
        });
        return Array.from(map.values());
    }, [activeReceiving, issues, inventorySync]);

    const overallMetrics = useMemo(() => {
        let totalOrdered = 0, totalReceived = 0, totalDamaged = 0, totalAccepted = 0, valueEnteringInventory = 0;

        allCombinedOrders.forEach((po) => {
            po.items?.forEach((item) => {
                totalOrdered += item.orderedQty || 0;
                totalReceived += item.receivedQty || 0;
                totalDamaged += item.damagedQty || 0;
                totalAccepted += item.acceptedQty || 0;
                valueEnteringInventory += (item.acceptedQty || 0) * (item.unitCost || 0);
            });
        });

        const variance = totalReceived - totalOrdered;
        return { totalOrdered, totalReceived, totalDamaged, totalAccepted, variance, valueEnteringInventory };
    }, [allCombinedOrders]);

    // Badge counters derived from separate top-level arrays
    const readyToPushCount = useMemo(() => {
        return inventorySync.length || allCombinedOrders.filter((po) =>
            po.status === 'Reconciled' ||
            po.rawStatus === 'RECONCILED' ||
            po.readyToPush === true
        ).length;
    }, [inventorySync, allCombinedOrders]);

    const issuesCount = useMemo(() => {
        return issues.length || allCombinedOrders.filter((po) =>
            po.status === 'Discrepancy' ||
            po.rawStatus === 'REJECTED' ||
            po.rawStatus === 'DISCREPANCY_FLAGGED'
        ).length;
    }, [issues, allCombinedOrders]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 lg:p-8 antialiased flex flex-col items-center">
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-5 w-full">
                    <div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                            <Building2 className="w-3.5 h-3.5" /> Warehouse Logistics & Operations
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Receiving & Delivery Clearance</h1>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {lastUpdated && (
                            <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                                Synced: {lastUpdated}
                            </span>
                        )}
                        <button
                            onClick={() => {
                                const controller = new AbortController();
                                fetchReceivingDeliveries(controller.signal);
                            }}
                            disabled={loading}
                            className="flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
                        >
                            <Download className="w-3.5 h-3.5" /> Export
                        </button>
                        <button
                            onClick={() => setShowNewIntakeModal(true)}
                            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3.5 py-2 rounded-xl text-xs transition shadow-md shadow-indigo-100 cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" /> New Intake
                        </button>
                    </div>
                </header>

                {/* Error Banner */}
                {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-rose-900 shadow-xs w-full">
                        <div className="flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span className="text-xs font-semibold">{error}</span>
                        </div>
                        <button
                            onClick={() => {
                                const controller = new AbortController();
                                fetchReceivingDeliveries(controller.signal);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold bg-rose-100 hover:bg-rose-200 rounded-lg transition cursor-pointer"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Metrics Summary Section */}
                <MetricsSummary metrics={overallMetrics} />

                {/* Workspace Mode Toggle Tabs mapping directly to the top-level root arrays */}
                <div className="flex items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl w-fit self-start">
                    <button
                        onClick={() => setViewMode('activeReceiving')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === 'activeReceiving' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <Truck className="w-4 h-4 text-indigo-600" />
                        Active Receiving ({activeReceiving.length})
                    </button>
                    <button
                        onClick={() => setViewMode('reconciliation')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === 'reconciliation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <ShieldAlert className="w-4 h-4 text-indigo-600" />
                        Reconciliation Issues
                        {issuesCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 bg-rose-600 text-white rounded-full text-[10px]">
                                {issuesCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setViewMode('inventorySync')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === 'inventorySync' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <Package className="w-4 h-4 text-indigo-600" />
                        Inventory Sync
                        {readyToPushCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 bg-indigo-600 text-white rounded-full text-[10px]">
                                {readyToPushCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Main Dynamic Workspace Area rendering specific top-level arrays in designated components */}
                {loading && allCombinedOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2 shadow-xs w-full">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-indigo-600" />
                        <p className="text-xs font-semibold text-slate-500">Loading inbound delivery records...</p>
                    </div>
                ) : viewMode === 'inventorySync' ? (
                    <InventoryPushManagement
                        orders={inventorySync.length > 0 ? inventorySync : allCombinedOrders}
                        onPushToInventory={handlePushToInventory}
                        onUpdatePushState={handleUpdatePushState}
                    />
                ) : viewMode === 'reconciliation' ? (
                    <ReconciliationIssuesView
                        items={issues.length > 0 ? issues : allCombinedOrders}
                        onPushToInventory={handlePushToInventory}
                        onUpdateIssueState={handleUpdateIssueState}
                    />
                ) : (
                    <div className="w-full">
                        <DeliveryList
                            purchaseOrders={activeReceiving.length > 0 ? activeReceiving : allCombinedOrders}
                            selectedPOId={selectedPOId}
                            onSelectPO={setSelectedPOId}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>
                )}
            </div>

            {/* New Intake Modal Component */}
            {showNewIntakeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Create New Inbound Intake</h3>
                            <button
                                onClick={() => setShowNewIntakeModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-slate-600">
                            Configure initial delivery parameters, supplier details, and expected item ledgers for dock intake.
                        </p>
                        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                            <button
                                onClick={() => setShowNewIntakeModal(false)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewIntakeModal(false);
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer"
                            >
                                Save & Initialize
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}