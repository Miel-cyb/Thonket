import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Building2,
    Download,
    Plus,
    RefreshCw,
    Inbox,
    Truck,
    ShieldCheck,
    Play,
    ClipboardCheck,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    Search,
    Package,
    Clock,
    X
} from 'lucide-react';

// Import Modularized Components
import DeliveryList from '../components/Inbound-Delivery/DeliveryList';
import MetricsSummary from '../components/Inbound-Delivery/MetricsSummary';
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
    const totalReceived = items.reduce((acc, i) => acc + i.totalReceivedQty, 0) || raw.totalReceivedQty || 0;

    let inferredStatus = raw.status || 'EXPECTED';
    if (raw.status === 'GATE_CHECKED_IN') {
        inferredStatus = 'Gate Checked In';
    } else if (raw.status === 'RECEIVING_IN_PROGRESS') {
        inferredStatus = 'Receiving';
    } else if (raw.status === 'RECEIVED_PENDING_RECONCILIATION') {
        inferredStatus = 'Reconciliation';
    } else if (raw.status === 'RECONCILED') {
        inferredStatus = 'Reconciled';
    } else if (raw.status === 'REJECTED') {
        inferredStatus = 'Discrepancy';
    } else if (raw.status === 'DISCREPANCY_FLAGGED') {
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
        items
    };
};

export default function ReceivingDeliveriesPage() {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedPOId, setSelectedPOId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewIntakeModal, setShowNewIntakeModal] = useState(false);

    // API & Async states
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);
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
                setPurchaseOrders([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error(`Server returned error status: ${response.status}`);
            }

            const data = await response.json();
            const rawList = Array.isArray(data) ? data : (data.data || data.deliveries || []);

            const normalized = rawList
                .map(transformLedgerToPO)
                .filter(Boolean)
                .filter((po) => po.rawStatus !== 'COMPLETED');

            setPurchaseOrders(normalized);
            setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } catch (err) {
            if (err.name === 'AbortError') return;
            setError(err.message || 'Unable to connect to the receiving delivery gateway.');
        } finally {
            setLoading(false);
        }
    }, []);

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

    const handleUpdateOrderStatus = (poId, newRawStatus, newDisplayStatus, e) => {
        if (e) e.stopPropagation();
        setPurchaseOrders((prev) =>
            prev.map((po) => (po.id === poId ? { ...po, status: newDisplayStatus, rawStatus: newRawStatus } : po))
        );
    };

    const overallMetrics = useMemo(() => {
        let totalOrdered = 0, totalReceived = 0, totalDamaged = 0, totalAccepted = 0, valueEnteringInventory = 0;

        purchaseOrders.forEach((po) => {
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
    }, [purchaseOrders]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-3 lg:p-6 antialiased flex flex-col items-center">
            <div className="w-full max-w-6xl mx-auto flex flex-col gap-4">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-200/80 pb-4 w-full">
                    <div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">
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
                            onClick={() => fetchReceivingDeliveries()}
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
                            onClick={() => fetchReceivingDeliveries()}
                            className="px-2.5 py-1 text-[11px] font-bold bg-rose-100 hover:bg-rose-200 rounded-lg transition cursor-pointer"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Metrics Section */}
                <MetricsSummary metrics={overallMetrics} />

                {/* Main Content Area Using DeliveryList Component */}
                {loading && purchaseOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2 shadow-xs w-full">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-indigo-600" />
                        <p className="text-xs font-semibold text-slate-500">Loading inbound delivery records...</p>
                    </div>
                ) : (
                    <div className="w-full">
                        <DeliveryList
                            purchaseOrders={purchaseOrders}
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
        </div>
    );
}