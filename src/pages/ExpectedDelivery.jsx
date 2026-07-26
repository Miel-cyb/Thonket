import React, { useState, useMemo } from 'react';
import { List, BarChart3, Search, X, RefreshCw, Filter } from 'lucide-react';

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
        logisticsProvider: "InterLogistics Ghana",
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
        itemsCount: 3,
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
        itemsCount: 2,
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

const STATUS_OPTIONS = ['All', 'Expected', 'In Transit', 'Arrived', 'Receiving'];

// ==========================================
// MAIN COMPONENT
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
        const term = searchTerm.toLowerCase().trim();
        return deliveries.filter(item => {
            const matchesSearch =
                !term ||
                item.id.toLowerCase().includes(term) ||
                item.supplier.toLowerCase().includes(term) ||
                (item.driverName && item.driverName.toLowerCase().includes(term)) ||
                (item.truckPlate && item.truckPlate.toLowerCase().includes(term));

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
        setDeliveries(prev =>
            prev.map(d =>
                d.id === id
                    ? { ...d, status: 'Arrived', driverName: gateForm.driverName, truckPlate: gateForm.truckPlate }
                    : d
            )
        );
        setSelectedDelivery(null);
    };

    const handleStartReceiving = (id) => {
        setDeliveries(prev =>
            prev.map(d => (d.id === id ? { ...d, status: 'Receiving' } : d))
        );
        setSelectedDelivery(null);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
    };

    const metricCards = [
        { label: 'Total Inbound', filterKey: 'All', count: metricsSummary.total, activeBorder: 'border-slate-900', style: 'bg-white border-slate-200 text-slate-900' },
        { label: 'Expected', filterKey: 'Expected', count: metricsSummary.expected, activeBorder: 'border-amber-500', style: 'bg-amber-50/40 border-amber-200/80 text-amber-900' },
        { label: 'In Transit', filterKey: 'In Transit', count: metricsSummary.inTransit, activeBorder: 'border-blue-500', style: 'bg-blue-50/40 border-blue-200/80 text-blue-900' },
        { label: 'Arrived at Gate', filterKey: 'Arrived', count: metricsSummary.arrived, activeBorder: 'border-emerald-500', style: 'bg-emerald-50/40 border-emerald-200/80 text-emerald-900' },
        { label: 'Receiving Dock', filterKey: 'Receiving', count: metricsSummary.receiving, activeBorder: 'border-indigo-500', style: 'bg-indigo-50/40 border-indigo-200/80 text-indigo-900' }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans p-4 sm:p-6 md:p-8 antialiased">
            {/* Top Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-5 mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-indigo-600"></span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Warehouse Operations</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Expected Inbound Deliveries</h1>
                    <p className="text-slate-500 text-sm mt-1">Track, audit, and process inbound cross-docking purchase orders and logistics shipments.</p>
                </div>

                {/* View Switcher Toggle */}
                <nav aria-label="View Switcher" className="inline-flex items-center p-1 bg-slate-200/70 rounded-xl self-start md:self-auto border border-slate-200 shadow-inner">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 ${viewMode === 'list'
                            ? 'bg-white text-slate-900 shadow-sm font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                            }`}
                    >
                        <List size={16} />
                        <span>Schedule Board</span>
                    </button>
                    <button
                        onClick={() => setViewMode('analytics')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 ${viewMode === 'analytics'
                            ? 'bg-white text-slate-900 shadow-sm font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                            }`}
                    >
                        <BarChart3 size={16} />
                        <span>Inbound Analytics</span>
                    </button>
                </nav>
            </header>

            {/* Main Content Render */}
            {viewMode === 'analytics' ? (
                <DeliveryAnalyticsView deliveries={deliveries} />
            ) : (
                <main>
                    {/* Interactive Metric Cards */}
                    <section className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
                        {metricCards.map((card) => {
                            const isActive = statusFilter === card.filterKey;
                            return (
                                <button
                                    key={card.filterKey}
                                    onClick={() => setStatusFilter(card.filterKey)}
                                    className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${card.style} ${isActive ? `${card.activeBorder} ring-2 ring-indigo-500/10 shadow-xs` : 'hover:border-slate-300 hover:shadow-xs'
                                        }`}
                                >
                                    <div className="text-xs font-semibold opacity-75 uppercase tracking-wider">{card.label}</div>
                                    <div className="text-2xl font-bold mt-1 tracking-tight flex items-baseline justify-between">
                                        <span>{card.count}</span>
                                        <span className="text-xs font-medium opacity-60">Shipments</span>
                                    </div>
                                </button>
                            );
                        })}
                    </section>

                    {/* Filtering Controls */}
                    <section className="flex flex-col lg:flex-row gap-3.5 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search PO, supplier, driver name, or truck plate..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                                    aria-label="Clear search query"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                            {STATUS_OPTIONS.map((status) => {
                                const active = statusFilter === status;
                                let statusCount = metricsSummary.total;
                                if (status === 'Expected') statusCount = metricsSummary.expected;
                                else if (status === 'In Transit') statusCount = metricsSummary.inTransit;
                                else if (status === 'Arrived') statusCount = metricsSummary.arrived;
                                else if (status === 'Receiving') statusCount = metricsSummary.receiving;

                                return (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide border whitespace-nowrap transition-all duration-150 ${active
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <span>{status}</span>
                                        <span
                                            className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${active ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-500'
                                                }`}
                                        >
                                            {statusCount}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Deliveries Display / Empty State */}
                    {filteredDeliveries.length > 0 ? (
                        <DeliveryListView
                            deliveries={filteredDeliveries}
                            onOpenDetails={handleOpenGateCheckIn}
                        />
                    ) : (
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-xs">
                            <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Filter size={20} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">No shipments found</h3>
                            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                                We couldn't find any inbound deliveries matching your search keywords or applied status filters.
                            </p>
                            <button
                                onClick={handleResetFilters}
                                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-4 py-2 rounded-xl transition-colors"
                            >
                                <RefreshCw size={14} />
                                <span>Reset search & filters</span>
                            </button>
                        </div>
                    )}
                </main>
            )}

            {/* Modal / Drawer Overlay */}
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