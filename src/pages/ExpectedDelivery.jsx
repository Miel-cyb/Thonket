import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    List,
    BarChart3,
    Search,
    X,
    RefreshCw,
    Filter,
    AlertCircle,
    Clock,
    Truck,
    CheckCircle2,
    Package,
    Calendar
} from 'lucide-react';

// Import local modularized presentational views
import DeliveryListView from '../components/WarehouseOverview/ExpectedDelivery/DeliveryListView';
import DeliveryDetailModal from '../components/WarehouseOverview/ExpectedDelivery/DeliveryDetailMode';
import DeliveryAnalyticsView from '../components/WarehouseOverview/ExpectedDelivery/DeliveryAnalyticsView';
import { API_ENDPOINTS } from '../utils/urls';

// ==========================================
// DATA TRANSFORMER (Maps Raw Ledger API -> UI Model)
// ==========================================
const transformLedgerToDelivery = (raw) => {
    // Return early if object is already in UI format (e.g. Fallback Data)
    if (raw.expectedDate && raw.supplier && !raw.ledgerId) {
        return raw;
    }

    // Parse Schedule Timestamps
    const dateSource = raw.schedule?.approvedAt || raw.schedule?.requestedAt;
    const dateObj = dateSource ? new Date(dateSource) : new Date();
    const expectedDate = dateObj.toISOString().split('T')[0];
    const expectedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Infer Status from shipment summary / schedule
    let inferredStatus = 'Expected';
    if (raw.shipmentSummary?.totalShipmentsCount > 0) {
        inferredStatus = 'In Transit';
    }

    // Main Warehouse from allocations
    const primaryWarehouse = raw.allocations?.[0]?.warehouseName || 'Default Warehouse';

    return {
        id: raw.ledgerNumber || raw.purchaseRequestId || raw.purchaseOrderId || 'PO-UNKNOWN',
        purchaseOrderId: raw.purchaseOrderId,
        supplier: raw.purchaseRequestId || raw.supplierId || 'Supplier ID: ' + raw.supplierId,
        expectedDate,
        expectedTime,
        itemsCount: raw.items?.length || 0,
        status: inferredStatus,
        destinationWarehouse: primaryWarehouse,
        storageType: 'Ambient',
        totalPallets: Math.ceil((raw.items?.reduce((acc, i) => acc + (i.qtyOrdered || 0), 0) || 0) / 1000) || 1,
        driverName: raw.driverName || 'Unassigned',
        truckPlate: raw.truckPlate || 'Pending',
        logisticsProvider: raw.logisticsProvider || 'Standard Freight',
        commercials: raw.commercials || null,
        items: (raw.items || []).map((item) => ({
            sku: item.sku || item.productId || 'N/A',
            name: item.productName || 'Unknown Item',
            qtyExpected: item.qtyOrdered || 0,
            unit: item.unitOfMeasure || 'CASE',
            category: 'Inbound',
            unitCost: item.unitCost || 0,
            outstandingValue: item.outstandingLineValue || 0
        }))
    };
};

// ==========================================
// FALLBACK / MOCK DATA
// ==========================================
const FALLBACK_DELIVERIES = [
    {
        id: "PO-0001",
        supplier: "Coca-Cola Ghana",
        expectedDate: "2026-08-10",
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
        expectedDate: "2026-08-11",
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
        expectedDate: "2026-08-10",
        expectedTime: "08:00 AM",
        itemsCount: 2,
        status: "Arrived",
        destinationWarehouse: "Accra Central Hub (Cold Room B)",
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
    const WarehouseAPI = `${API_ENDPOINTS.WAREHOUSES}/ledger/expected-deliveries`;

    // Core States
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // View & Filter States
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'analytics'
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    // Check-in form state
    const [gateForm, setGateForm] = useState({ driverName: '', truckPlate: '', notes: '' });

    // ==========================================
    // API FETCH METHOD
    // ==========================================
    const fetchDeliveries = useCallback(async (signal) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (searchTerm.trim()) params.append('search', searchTerm.trim());
            if (statusFilter !== 'All') params.append('status', statusFilter);

            const requestUrl = `${WarehouseAPI}${params.toString() ? `?${params.toString()}` : ''}`;

            const response = await fetch(requestUrl, {
                method: 'GET',
                signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (response.status === 404) {
                setDeliveries([]);
                setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                return;
            }

            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                throw new Error(`Unexpected response format from server (${response.status})`);
            }

            if (!response.ok) {
                throw new Error(data?.message || `Server error: ${response.status} ${response.statusText}`);
            }

            const rawPayload = Array.isArray(data) ? data : (data.data || data.deliveries || []);

            console.log("Fetched Expected Deliveries:", rawPayload);

            // Transform raw backend ledger format to UI model
            const normalizedData = rawPayload.map(transformLedgerToDelivery);

            setDeliveries(normalizedData);
            setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        } catch (err) {
            if (err.name === 'AbortError') return;

            console.warn("API Request failed, loading fallback data for UI presentation:", err.message);
            setError(err.message || 'Unable to connect to inbound delivery service.');

            let fallbackData = FALLBACK_DELIVERIES.map(transformLedgerToDelivery);
            if (statusFilter !== 'All') {
                fallbackData = fallbackData.filter(d => d.status === statusFilter);
            }
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase();
                fallbackData = fallbackData.filter(d =>
                    (d.id && d.id.toLowerCase().includes(term)) ||
                    (d.supplier && d.supplier.toLowerCase().includes(term)) ||
                    (d.driverName && d.driverName.toLowerCase().includes(term))
                );
            }
            setDeliveries(fallbackData);
            setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } finally {
            setLoading(false);
        }
    }, [WarehouseAPI, searchTerm, statusFilter]);

    useEffect(() => {
        const controller = new AbortController();
        const handler = setTimeout(() => {
            fetchDeliveries(controller.signal);
        }, 300);

        return () => {
            clearTimeout(handler);
            controller.abort();
        };
    }, [fetchDeliveries]);

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

    const handleOpenGateCheckIn = (delivery) => {
        setSelectedDelivery(delivery);
        setGateForm({
            driverName: delivery.driverName || '',
            truckPlate: delivery.truckPlate || '',
            notes: ''
        });
    };

    const handleConfirmArrival = async (id) => {
        try {
            setDeliveries(prev =>
                prev.map(d =>
                    d.id === id
                        ? { ...d, status: 'Arrived', driverName: gateForm.driverName, truckPlate: gateForm.truckPlate }
                        : d
                )
            );
            setSelectedDelivery(null);
        } catch (err) {
            console.error("Failed to confirm arrival:", err);
        }
    };

    const handleStartReceiving = async (id) => {
        try {
            setDeliveries(prev =>
                prev.map(d => (d.id === id ? { ...d, status: 'Receiving' } : d))
            );
            setSelectedDelivery(null);
        } catch (err) {
            console.error("Failed to start receiving:", err);
        }
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
    };

    const metricCards = [
        { label: 'Total Inbound', filterKey: 'All', count: metricsSummary.total, activeBorder: 'border-slate-900', style: 'bg-white border-slate-200 text-slate-900', icon: Package },
        { label: 'Expected', filterKey: 'Expected', count: metricsSummary.expected, activeBorder: 'border-amber-500', style: 'bg-amber-50/50 border-amber-200 text-amber-900', icon: Clock },
        { label: 'In Transit', filterKey: 'In Transit', count: metricsSummary.inTransit, activeBorder: 'border-blue-500', style: 'bg-blue-50/50 border-blue-200 text-blue-900', icon: Truck },
        { label: 'Arrived at Gate', filterKey: 'Arrived', count: metricsSummary.arrived, activeBorder: 'border-emerald-500', style: 'bg-emerald-50/50 border-emerald-200 text-emerald-900', icon: CheckCircle2 },
        { label: 'Receiving Dock', filterKey: 'Receiving', count: metricsSummary.receiving, activeBorder: 'border-indigo-500', style: 'bg-indigo-50/50 border-indigo-200 text-indigo-900', icon: Calendar }
    ];

    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-800 font-sans p-4 sm:p-6 md:p-8 antialiased">
            {/* Top Header */}
            <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-5 mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                            Warehouse Operations
                        </span>
                        {lastUpdated && (
                            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                                • Sync time: {lastUpdated}
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Expected Inbound Deliveries
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Real-time inbound cross-docking, gate control, and purchase order tracking.
                    </p>
                </div>

                <div className="flex items-center gap-3 self-start lg:self-auto">
                    <button
                        onClick={() => fetchDeliveries()}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all shadow-xs disabled:opacity-50"
                        title="Refresh Inbound List"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin text-indigo-600' : 'text-slate-500'} />
                        <span className="hidden sm:inline">Sync Data</span>
                    </button>

                    <nav aria-label="View Switcher" className="inline-flex items-center p-1 bg-slate-200/70 rounded-xl border border-slate-200 shadow-inner">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${viewMode === 'list'
                                ? 'bg-white text-slate-900 shadow-sm font-bold'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <List size={15} />
                            <span>Schedule Board</span>
                        </button>
                        <button
                            onClick={() => setViewMode('analytics')}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${viewMode === 'analytics'
                                ? 'bg-white text-slate-900 shadow-sm font-bold'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <BarChart3 size={15} />
                            <span>Inbound Analytics</span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* Error Banner */}
            {error && (
                <aside aria-label="System notification" className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-amber-900 text-xs sm:text-sm shadow-xs">
                    <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-semibold">Live connection offline or delayed</p>
                        <p className="text-amber-700 mt-0.5">
                            Displaying cached local schedule data. Error details: <code className="bg-amber-100/80 px-1 py-0.5 rounded text-[11px] font-mono">{error}</code>
                        </p>
                    </div>
                    <button
                        onClick={() => fetchDeliveries()}
                        className="text-xs font-bold text-amber-800 hover:underline shrink-0"
                    >
                        Retry
                    </button>
                </aside>
            )}

            {/* Main Content Area */}
            {viewMode === 'analytics' ? (
                <DeliveryAnalyticsView deliveries={deliveries} />
            ) : (
                <main>
                    {/* Metric Cards */}
                    <section className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
                        {metricCards.map((card) => {
                            const isActive = statusFilter === card.filterKey;
                            const Icon = card.icon;
                            return (
                                <button
                                    key={card.filterKey}
                                    onClick={() => setStatusFilter(card.filterKey)}
                                    className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${card.style} ${isActive
                                        ? `${card.activeBorder} ring-2 ring-indigo-500/10 shadow-xs scale-[1.01]`
                                        : 'hover:border-slate-300 hover:shadow-xs'
                                        }`}
                                >
                                    <div className="flex items-center justify-between text-xs font-semibold opacity-80 uppercase tracking-wider mb-1">
                                        <span>{card.label}</span>
                                        <Icon size={14} className="opacity-60" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-baseline justify-between mt-1">
                                        <span>{card.count}</span>
                                        <span className="text-[11px] font-medium opacity-60">Shipments</span>
                                    </div>
                                </button>
                            );
                        })}
                    </section>

                    {/* Search Toolbar */}
                    <section className="flex flex-col lg:flex-row gap-3.5 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search PO number, supplier name, driver, or truck plate..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
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
                                            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${active ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-500'
                                                }`}
                                        >
                                            {statusCount}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Delivery List Content */}
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="bg-white border border-slate-200/80 rounded-2xl p-5 animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                    </div>
                                    <div className="h-8 bg-slate-100 rounded w-28"></div>
                                </div>
                            ))}
                        </div>
                    ) : deliveries.length > 0 ? (
                        <DeliveryListView
                            deliveries={deliveries}
                            onOpenDetails={handleOpenGateCheckIn}
                        />
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto my-8 shadow-xs">
                            <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Filter size={20} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">No shipments found</h3>
                            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                                We couldn't find any inbound deliveries matching your search keywords or applied status filters.
                            </p>
                            <button
                                onClick={handleResetFilters}
                                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                                <RefreshCw size={14} />
                                <span>Reset search & filters</span>
                            </button>
                        </div>
                    )}
                </main>
            )}

            {/* Check-in Modal */}
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