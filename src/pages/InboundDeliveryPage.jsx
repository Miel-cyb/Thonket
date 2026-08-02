import React, { useState, useMemo, useEffect } from 'react';
import {
    Building2,
    Download,
    Plus,
    ArrowLeft,
    PackageCheck,
    Sparkles,
    CheckCircle2,
    FileText
} from 'lucide-react';

// Import Modularized Components
import DeliveryList from '../components/Inbound-Delivery/DeliveryList';
import OrderHeader from '../components/Inbound-Delivery/OrderHeader';
import MetricsSummary from '../components/Inbound-Delivery/MetricsSummary';
import InventoryTable from '../components/Inbound-Delivery/InventoryTable';
import OrderNotesFooter from '../components/Inbound-Delivery/OrderNotesFooter';
import NewIntakeModal from '../components/Inbound-Delivery/modals/NewIntakeModal';
import FinalizeModal from '../components/Inbound-Delivery/modals/FinalizeModal';

export default function ReceivingDeliveriesPage() {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedPOId, setSelectedPOId] = useState(null); // null = Overview/List View, string ID = Detail View
    const [searchQuery, setSearchQuery] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showNewIntakeModal, setShowNewIntakeModal] = useState(false);

    const [newPOForm, setNewPOForm] = useState({
        id: '',
        supplier: '',
        expectedDate: '',
        carrier: '',
        trackingNo: '',
        dockNumber: 'Bay 01'
    });

    const [purchaseOrders, setPurchaseOrders] = useState([
        {
            id: 'PO-2026-8801',
            supplier: 'Apex Wholesalers & Logistics',
            expectedDate: '2026-07-25',
            status: 'Receiving',
            carrier: 'Freight Express Line',
            trackingNo: 'TRK-9902341',
            dockNumber: 'Bay 03',
            items: [
                {
                    id: 'SKU-001',
                    name: 'Organic Almond Milk 1L (12-pack)',
                    orderedQty: 100,
                    receivedQty: 100,
                    damagedQty: 0,
                    lotNumber: 'LOT-2026-09A',
                    location: 'Aisle 02-B1',
                    expiryDate: '2027-03-15',
                    unitCost: 24.5,
                    acceptedQty: 100
                },
                {
                    id: 'SKU-002',
                    name: 'Extra Virgin Olive Oil 500ml',
                    orderedQty: 250,
                    receivedQty: 240,
                    damagedQty: 5,
                    lotNumber: 'LOT-2026-14C',
                    location: 'Aisle 04-A3',
                    expiryDate: '2028-01-20',
                    unitCost: 12.0,
                    acceptedQty: 235
                },
                {
                    id: 'SKU-003',
                    name: 'Dark Chocolate Bars 85% (Case)',
                    orderedQty: 50,
                    receivedQty: 50,
                    damagedQty: 2,
                    lotNumber: 'LOT-2026-88F',
                    location: 'Aisle 01-C2',
                    expiryDate: '2026-12-10',
                    unitCost: 45.0,
                    acceptedQty: 48
                }
            ],
            notes: 'Pallet 2 had slight outer carton crushing.'
        },
        {
            id: 'PO-2026-8802',
            supplier: 'Global Beverage Distributors',
            expectedDate: '2026-07-25',
            status: 'Inspection',
            carrier: 'Swift Transport',
            trackingNo: 'TRK-8812039',
            dockNumber: 'Bay 01',
            items: [
                {
                    id: 'SKU-004',
                    name: 'Sparkling Mineral Water 330ml (24-pack)',
                    orderedQty: 300,
                    receivedQty: 300,
                    damagedQty: 12,
                    lotNumber: 'LOT-2026-40D',
                    location: 'Aisle 03-A1',
                    expiryDate: '2027-08-01',
                    unitCost: 18.2,
                    acceptedQty: 288
                }
            ],
            notes: 'Temperature logged at 4°C upon arrival.'
        }
    ]);

    const activePO = useMemo(() => {
        return purchaseOrders.find((po) => po.id === selectedPOId) || null;
    }, [purchaseOrders, selectedPOId]);

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

    // Calculate aggregated metrics for ALL purchase orders (shown on the list overview page)
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

            {/* --- VIEW 1: OVERVIEW PAGE (Metrics Summary + Centered Delivery Cards) --- */}
            {!selectedPOId && (
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Overall Metrics Summary across all inbound deliveries */}
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

            {/* --- VIEW 2: ISOLATED SINGLE ORDER DETAIL VIEW --- */}
            {selectedPOId && activePO && (
                <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
                    {/* Navigation & Context Bar */}
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

                    {/* Order Details Structured Layout */}
                    <div className="space-y-6">
                        {/* 1. Header Information & Actions */}
                        <OrderHeader activePO={activePO} onStatusChange={handleStatusChange} />

                        {/* 2. PO Specific Live Metrics Summary */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Live Audit Summary for {activePO.id}
                            </div>
                            <MetricsSummary metrics={activePOMetrics} />
                        </div>

                        {/* 3. Main Itemized Verification & Inventory Table */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                            <InventoryTable
                                items={activePO.items}
                                onItemChange={handleItemChange}
                                onAddItem={handleAddItem}
                                onRemoveItem={handleRemoveItem}
                            />
                        </div>

                        {/* 4. Dock Notes & Final Confirmation Section */}
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