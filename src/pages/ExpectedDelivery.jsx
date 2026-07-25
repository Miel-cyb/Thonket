import React, { useState, useMemo } from 'react';
import { List, BarChart3, Search } from 'lucide-react';

// Import local modularized presentational views
import DeliveryListView from '../components/WarehouseOverview/ExpectedDelivery/DeliveryListView';
import DeliveryDetailModal from '../components/WarehouseOverview/ExpectedDelivery/DeliveryDetailMode';
import DeliveryAnalyticsView from '../components/WarehouseOverview/ExpectedDelivery/DeliveryAnalyticsView';

// ==========================================
// MOCK DATA GENERATION (FMCG Focus)
// ==========================================
const INITIAL_DELIVERIES = [
    {
        id: "PO-0001",
        supplier: "Coca-Cola Ghana",
        expectedDate: "2026-07-20",
        expectedTime: "10:30 AM",
        itemsCount: 4,
        status: "Expected",
        destinationWarehouse: "Accra Central Hub (Dock 04)",
        storageType: "Ambient",
        totalPallets: 18,
        driverName: "Kwame Mensah",
        truckPlate: "GT-4921-25",
        logisticsProvider: "Inter物流 Ghana",
        items: [
            { sku: "CC-500-01", name: "Coke 500ml PET (Case of 24)", qtyExpected: 250, unit: "Cases", category: "Beverages" },
            { sku: "CC-330-02", name: "Sprite 330ml Can (Case of 24)", qtyExpected: 180, unit: "Cases", category: "Beverages" },
            { sku: "FNT-500-01", name: "Fanta Orange 500ml (Case of 24)", qtyExpected: 120, unit: "Cases", category: "Beverages" },
            { sku: "WTR-750-01", name: "Eva Water 750ml (Case of 12)", qtyExpected: 400, unit: "Cases", category: "Water" }
        ]
    },
    {
        id: "PO-0002",
        supplier: "Nestlé Ghana",
        expectedDate: "2026-07-21",
        expectedTime: "02:15 PM",
        itemsCount: 7,
        status: "In Transit",
        destinationWarehouse: "Accra Central Hub (Dock 02)",
        storageType: "Ambient / Dry",
        totalPallets: 24,
        driverName: "Emmanuel Osei",
        truckPlate: "GW-8831-24",
        logisticsProvider: "SwiftFreight Ltd",
        items: [
            { sku: "MILO-400G", name: "Milo Activ-Go 400g Tin", qtyExpected: 1500, unit: "Units", category: "Beverages" },
            { sku: "NES-200G", name: "Nescafé Classic 200g Jar", qtyExpected: 800, unit: "Units", category: "Beverages" },
            { sku: "MAG-CR-10", name: "Maggi Crevettes Cubes (Carton)", qtyExpected: 350, unit: "Cartons", category: "Culinary" }
        ]
    },
    {
        id: "PO-0003",
        supplier: "FanMilk PLC",
        expectedDate: "2026-07-20",
        expectedTime: "08:00 AM",
        itemsCount: 3,
        status: "Arrived",
        destinationWarehouse: "Accra Central Hub (Cold Storage Room B)",
        storageType: "Chilled (4°C)",
        totalPallets: 12,
        driverName: "Kofi Boateng",
        truckPlate: "GR-1102-26",
        logisticsProvider: "ColdChain Express",
        items: [
            { sku: "FM-YOG-100", name: "FanYogo Strawberry Pouch", qtyExpected: 5000, unit: "Units", category: "Dairy/Frozen" },
            { sku: "FM-CHO-100", name: "FanChoco Chocolate Pouch", qtyExpected: 4000, unit: "Units", category: "Dairy/Frozen" }
        ]
    }
];

// ==========================================
// MAIN COMPONENT HOOK / ROUTER
// ==========================================
export default function ExpectedDeliveriesPage() {
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'analytics'
    const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Gate Check-in form fields state
    const [gateForm, setGateForm] = useState({ driverName: '', truckPlate: '', notes: '' });

    // Performance Optimized Metric Calculations
    const metricsSummary = useMemo(() => {
        const counts = { total: deliveries.length, expected: 0, inTransit: 0, arrived: 0, receiving: 0 };
        deliveries.forEach(d => {
            if (d.status === 'Expected') counts.expected++;
            else if (d.status === 'In Transit') counts.inTransit++;
            else if (d.status === 'Arrived') counts.arrived++;
            else if (d.status === 'Receiving') counts.receiving++;
        });
        return counts;
    }, [deliveries]);

    const filteredDeliveries = useMemo(() => {
        return deliveries.filter(item => {
            const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [deliveries, searchTerm, statusFilter]);

    const handleOpenGateCheckIn = (delivery) => {
        setSelectedDelivery(delivery);
        setGateForm({
            driverName: delivery.driverName || '',
            truckPlate: delivery.truckPlate || '',
            notes: ''
        });
    };

    const handleConfirmArrival = (id) => {
        setDeliveries(prev => prev.map(d =>
            d.id === id ? { ...d, status: 'Arrived', driverName: gateForm.driverName, truckPlate: gateForm.truckPlate } : d
        ));
        setSelectedDelivery(null);
    };

    const handleStartReceiving = (id) => {
        setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status: 'Receiving' } : d));
        setSelectedDelivery(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 antialiased">
            {/* Top Application Sub-Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 mb-6 gap-4">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">Warehouse Operations</div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Expected Inbound Deliveries</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Track, audit, and accept cross-docking purchase orders and logistics telemetry.</p>
                </div>

                {/* Toggle Controls View */}
                <div className="flex items-center space-x-1 bg-slate-200/80 p-1 rounded-xl self-start md:self-auto shadow-inner">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        <List size={16} />
                        <span>Schedule Board</span>
                    </button>
                    <button
                        onClick={() => setViewMode('analytics')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === 'analytics' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        <BarChart3 size={16} />
                        <span>Inbound Analytics</span>
                    </button>
                </div>
            </div>

            {/* Render Selected Subviews */}
            {viewMode === 'analytics' ? (
                <DeliveryAnalyticsView deliveries={deliveries} />
            ) : (
                <>
                    {/* Live Metric Counter Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                        {[
                            { label: 'Total Inbound', count: metricsSummary.total, color: 'text-slate-900 bg-white border-slate-200' },
                            { label: 'Expected', count: metricsSummary.expected, color: 'text-amber-700 bg-amber-50/50 border-amber-200' },
                            { label: 'In Transit', count: metricsSummary.inTransit, color: 'text-blue-700 bg-blue-50/50 border-blue-200' },
                            { label: 'Arrived at Gate', count: metricsSummary.arrived, color: 'text-emerald-700 bg-emerald-50/50 border-emerald-200' },
                            { label: 'Receiving Dock', count: metricsSummary.receiving, color: 'text-indigo-700 bg-indigo-50/50 border-indigo-200' }
                        ].map((card, i) => (
                            <div key={i} className={`p-3.5 border rounded-xl shadow-xs transition-all ${card.color}`}>
                                <div className="text-xs opacity-70 font-medium">{card.label}</div>
                                <div className="text-xl font-bold mt-0.5">{card.count} <span className="text-xs font-normal opacity-60">Shipments</span></div>
                            </div>
                        ))}
                    </div>

                    {/* Filtering Controls Row */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search via PO token or supplier identity..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                            />
                        </div>
                        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                            {['All', 'Expected', 'In Transit', 'Arrived', 'Receiving'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide border whitespace-nowrap transition-all ${statusFilter === status ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conditional Grid Display / Empty Zero State */}
                    {filteredDeliveries.length > 0 ? (
                        <DeliveryListView
                            deliveries={filteredDeliveries}
                            onOpenDetails={handleOpenGateCheckIn}
                        />
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto my-8 shadow-xs">
                            <div className="text-slate-300 font-bold text-4xl mb-2">ⓘ</div>
                            <h3 className="text-base font-semibold text-slate-900">No deliveries found</h3>
                            <p className="text-slate-500 text-xs mt-1">We couldn't find any shipments matching your filter rules or search tokens.</p>
                            <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                                className="mt-4 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Detail & Action Slide-Out Drawer / Modal Overlay */}
            {selectedDelivery && (
                <DeliveryDetailModal
                    delivery={selectedDelivery}
                    form={gateForm}
                    setForm={setGateForm}
                    onClose={() => setSelectedDelivery(null)}
                    onConfirmArrival={handleConfirmArrival}
                    onStartReceiving={handleStartReceiving}
                />
            )}
        </div>
    );
}