import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Building2,
    Download,
    Plus,
    ArrowLeft,
    PackageCheck,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Inbox
} from 'lucide-react';

// Import Modularized Components
import DeliveryList from '../components/Inbound-Delivery/DeliveryList';
import OrderHeader from '../components/Inbound-Delivery/OrderHeader';
import MetricsSummary from '../components/Inbound-Delivery/MetricsSummary';
import InventoryTable from '../components/Inbound-Delivery/InventoryTable';
import OrderNotesFooter from '../components/Inbound-Delivery/OrderNotesFooter';
import NewIntakeModal from '../components/Inbound-Delivery/modals/NewIntakeModal';
import FinalizeModal from '../components/Inbound-Delivery/modals/FinalizeModal';
import { API_ENDPOINTS } from '../utils/urls';

// ==========================================
// DATA TRANSFORMERS & FLATTENERS
// ==========================================

const transformLedgerToPO = (raw) => {
    if (!raw || typeof raw !== 'object') return null;

    const rawItems = Array.isArray(raw.items) ? raw.items : [];
    
    const items = rawItems.map((item, index) => {
        const ordered = Number(item.qtyOrdered ?? item.expectedQty ?? 0);
        const received = Number(item.receivedQty ?? item.qtyReceived ?? ordered);
        const damaged = Number(item.damagedQty ?? 0);
        const accepted = Math.max(0, received - damaged);

        return {
            id: item.itemId || item.productId || item.sku || `SKU-${index + 1}`,
            name: item.name || item.productName || item.itemName || 'Unknown Item',
            orderedQty: ordered,
            receivedQty: received,
            damagedQty: damaged,
            lotNumber: item.lotNumber || 'LOT-PENDING',
            location: item.location || 'Unassigned',
            expiryDate: item.expiryDate || new Date().toISOString().split('T')[0],
            unitCost: Number(item.unitCost ?? 0),
            acceptedQty: accepted
        };
    });

    const totalOrdered = items.reduce((acc, i) => acc + i.orderedQty, 0);
    const totalReceived = items.reduce((acc, i) => acc + i.receivedQty, 0);

    let inferredStatus = raw.status || 'Receiving';
    if (totalReceived === 0) inferredStatus = 'Inspection';
    else if (totalReceived >= totalOrdered && totalOrdered > 0) inferredStatus = 'Completed';

    return {
        id: raw.id || raw.ledgerNumber || raw.purchaseOrderId || `PO-${Math.floor(1000 + Math.random() * 9000)}`,
        supplier: raw.supplier?.name || raw.supplierName || 'Unknown Supplier',
        expectedDate: raw.expectedDate || new Date().toISOString().split('T')[0],
        status: inferredStatus,
        carrier: raw.carrier || raw.logisticsProvider || 'Standard Freight',
        trackingNo: raw.trackingNo || raw.shipmentSummary?.shipments?.[0]?.trackingNumber || 'TRK-PENDING',
        dockNumber: raw.dockNumber || 'Bay 01',
        notes: raw.notes || '',
        items
    };
};

export default function ReceivingDeliveriesPage() {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedPOId, setSelectedPOId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showNewIntakeModal, setShowNewIntakeModal] = useState(false);
    
    // API & Async states
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const [newPOForm, setNewPOForm] = useState({
        id: '',
        supplier: '',
        expectedDate: '',
        carrier: '',
        trackingNo: '',
        dockNumber: 'Bay 01'
    });

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
            const normalized = rawList.map(transformLedgerToPO).filter(Boolean);

            setPurchaseOrders(normalized);
            setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error('Failed to load receiving deliveries:', err);
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
                setShowConfirmModal(false);
                setShowNewIntakeModal(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const activePO = useMemo(() => {
        return purchaseOrders.find((po) => po.id === selectedPOId) || null;
    }, [purchaseOrders, selectedPOId]);

    const handleItemChange = (itemId, field, value) => {
        if (!activePO) return;
        setPurchaseOrders((prevPOs) =>
            prevPOs.map((po) => {
                if (po.id !== activePO.id) return po;

                const updatedItems = po.items.map((item) => {
                    if (item.id !== itemId) return item;
                    let updatedItem = { ...item };

                    if (field === 'receivedQty' || field === 'damagedQty') {
                        const numericValue = Math.max(0, parseInt(value, 10) || 0);
                        updatedItem[field] = numericValue;
                        const rec = field === 'receivedQty' ? numericValue : item.receivedQty;
                        const dam = field === 'damagedQty' ? numericValue : item.damagedQty;
                        updatedItem.acceptedQty = Math.max(0, rec - dam);
                    } else {
                        updatedItem[field] = value;
                    }
                    return updatedItem;
                });

                return { ...po, items: updatedItems };
            })
        );
    };

    const handleNotesChange = (value) => {
        if (!activePO) return;
        setPurchaseOrders((prevPOs) =>
            prevPOs.map((po) => (po.id === activePO.id ? { ...po, notes: value } : po))
        );
    };

    const handleAddItem = () => {
        if (!activePO) return;
        const newItem = {
            id: `SKU-${Math.floor(100 + Math.random() * 900)}`,
            name: 'Unscheduled Line Item',
            orderedQty: 0,
            receivedQty: 1,
            damagedQty: 0,
            lotNumber: 'LOT-NEW',
            location: 'Unassigned',
            expiryDate: new Date().toISOString().split('T')[0],
            unitCost: 10.0,
            acceptedQty: 1
        };

        setPurchaseOrders((prev) =>
            prev.map((po) => (po.id === activePO.id ? { ...po, items: [...po.items, newItem] } : po))
        );
    };

    const handleRemoveItem = (itemId) => {
        if (!activePO) return;
        setPurchaseOrders((prev) =>
            prev.map((po) =>
                po.id === activePO.id
                    ? { ...po, items: po.items.filter((i) => i.id !== itemId) }
                    : po
            )
        );
    };

    const handleStatusChange = (newStatus) => {
        if (!activePO) return;
        setPurchaseOrders((prev) =>
            prev.map((po) => (po.id === activePO.id ? { ...po, status: newStatus } : po))
        );
    };

    const handleCreateNewPO = (e) => {
        e.preventDefault();
        if (!newPOForm.id || !newPOForm.supplier) return;

        const createdPO = {
            ...newPOForm,
            status: 'Receiving',
            items: [],
            notes: ''
        };

        setPurchaseOrders([createdPO, ...purchaseOrders]);
        setSelectedPOId(createdPO.id);
        setShowNewIntakeModal(false);
        setNewPOForm({ id: '', supplier: '', expectedDate: '', carrier: '', trackingNo: '', dockNumber: 'Bay 01' });
    };

    // Calculate aggregated metrics for ALL purchase orders
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

    // Calculate metrics specifically for the currently selected PO
    const activePOMetrics = useMemo(() => {
        if (!activePO) return { totalOrdered: 0, totalReceived: 0, totalDamaged: 0, totalAccepted: 0, variance: 0, valueEnteringInventory: 0 };

        let totalOrdered = 0, totalReceived = 0, totalDamaged = 0, totalAccepted = 0;

        activePO.items?.forEach((item) => {
            totalOrdered += item.orderedQty || 0;
            totalReceived += item.receivedQty || 0;
            totalDamaged += item.damagedQty || 0;
            totalAccepted += item.acceptedQty || 0;
        });

        const variance = totalReceived - totalOrdered;
        const valueEnteringInventory =
            activePO.items?.reduce((acc, item) => acc + (item.acceptedQty || 0) * (item.unitCost || 0), 0) || 0;

        return { totalOrdered, totalReceived, totalDamaged, totalAccepted, variance, valueEnteringInventory };
    }, [activePO]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 lg:p-8">
            {/* Main Header */}
            <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                        <Building2 className="w-4 h-4" /> Warehouse Logistics & Operations
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Receiving & Delivery Clearance</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Verify inbound freight, audit physical counts, track lot numbers, and reconcile stock into warehouse inventory.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {lastUpdated && (
                        <span className="text-xs text-slate-400 hidden sm:inline">
                            Synced: {lastUpdated}
                        </span>
                    )}
                    <button
                        onClick={() => fetchReceivingDeliveries()}
                        className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-3 py-2 rounded-xl text-sm transition shadow-sm"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-xl text-sm transition shadow-sm hover:border-slate-400"
                    >
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                    <button
                        onClick={() => setShowNewIntakeModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition shadow-sm shadow-indigo-100"
                    >
                        <Plus className="w-4 h-4" /> New Delivery Intake
                    </button>
                </div>
            </header>

            {/* Error Banner */}
            {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-rose-900">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                    <button
                        onClick={() => fetchReceivingDeliveries()}
                        className="px-3 py-1.5 text-xs font-semibold bg-rose-100 hover:bg-rose-200 rounded-lg transition"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* --- VIEW 1: OVERVIEW PAGE --- */}
            {!selectedPOId && (
                <div className="max-w-6xl mx-auto space-y-6">
                    <MetricsSummary metrics={overallMetrics} />

                    <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                            <PackageCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                            <div>
                                <h3 className="text-sm font-semibold text-indigo-950">Select an Inbound Delivery</h3>
                                <p className="text-xs text-indigo-700">Click on any delivery card below to access line item audit, verification tables, and lot logging.</p>
                            </div>
                        </div>
                    </div>

                    {loading && purchaseOrders.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3">
                            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                            <p className="text-sm text-slate-500 font-medium">Loading inbound delivery records...</p>
                        </div>
                    ) : purchaseOrders.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3">
                            <Inbox className="w-8 h-8 mx-auto text-slate-400" />
                            <h3 className="text-base font-semibold text-slate-900">No active receiving deliveries</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">There are currently no shipments pending intake audit. Create a new intake or refresh data.</p>
                        </div>
                    ) : (
                        <DeliveryList
                            purchaseOrders={purchaseOrders}
                            selectedPOId={selectedPOId}
                            onSelectPO={setSelectedPOId}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    )}
                </div>
            )}

            {/* --- VIEW 2: ISOLATED SINGLE ORDER DETAIL VIEW --- */}
            {selectedPOId && activePO && (
                <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedPOId(null)}
                                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200/60 px-3.5 py-2 rounded-xl transition cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Deliveries
                            </button>
                            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-medium">Clearance Manifest:</span>
                                <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
                                    {activePO.id}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-lg border border-emerald-200/60">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Active Inspection Session
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <OrderHeader activePO={activePO} onStatusChange={handleStatusChange} />

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Live Audit Summary for {activePO.id}
                            </div>
                            <MetricsSummary metrics={activePOMetrics} />
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                            <InventoryTable
                                items={activePO.items}
                                onItemChange={handleItemChange}
                                onAddItem={handleAddItem}
                                onRemoveItem={handleRemoveItem}
                            />
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                            <OrderNotesFooter
                                notes={activePO.notes}
                                onNotesChange={handleNotesChange}
                                onOpenConfirmModal={() => setShowConfirmModal(true)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showNewIntakeModal && (
                <NewIntakeModal
                    form={newPOForm}
                    onChange={setNewPOForm}
                    onSubmit={handleCreateNewPO}
                    onClose={() => setShowNewIntakeModal(false)}
                />
            )}

            {showConfirmModal && (
                <FinalizeModal
                    metrics={activePOMetrics}
                    onConfirm={() => {
                        handleStatusChange('Completed');
                        setShowConfirmModal(false);
                    }}
                    onClose={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
}