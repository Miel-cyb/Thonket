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
    Calendar,
} from 'lucide-react';

// Import local modularized presentational views
import DeliveryListView from '../components/WarehouseOverview/ExpectedDelivery/DeliveryListView';
import DeliveryDetailModal from '../components/WarehouseOverview/ExpectedDelivery/DeliveryDetailMode';
import DeliveryAnalyticsView from '../components/WarehouseOverview/ExpectedDelivery/DeliveryAnalyticsView';
import { API_ENDPOINTS } from '../utils/urls';

// ==========================================
// STATUS MAPPINGS
// ==========================================

const STATUS_OPTIONS = [
    'All',
    'Arrived',
    'In Transit',
    'Expected',
    'Receiving',
    'Completed',
];

const STATUS_API_MAP = {
    Expected: 'EXPECTED',
    'In Transit': 'IN_TRANSIT',
    Arrived: 'ARRIVED',
    Receiving: 'RECEIVING',
    Completed: 'COMPLETED',
};

// ==========================================
// SORTING & TIMESTAMP HELPERS
// ==========================================

const getDeliveryTimestamp = (delivery) => {
    if (!delivery.expectedDate) return 0;
    const dateStr = delivery.expectedDate;
    const timeStr = delivery.expectedTime || '09:00 AM';
    const parsed = new Date(`${dateStr} ${timeStr}`);
    if (!isNaN(parsed.getTime())) return parsed.getTime();
    const parsedDateOnly = new Date(dateStr);
    return !isNaN(parsedDateOnly.getTime()) ? parsedDateOnly.getTime() : 0;
};

const sortDeliveries = (items) => {
    return [...items].sort((a, b) => {
        const getPriority = (status) => {
            switch (status) {
                case 'Arrived':
                    return 1;
                case 'In Transit':
                    return 2;
                case 'Expected':
                    return 3;
                case 'Receiving':
                    return 4;
                case 'Completed':
                    return 5;
                default:
                    return 6;
            }
        };

        const priorityA = getPriority(a.status);
        const priorityB = getPriority(b.status);

        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        // Within the same status, rank by date and timestamp (ascending: earliest first)
        const timeA = getDeliveryTimestamp(a);
        const timeB = getDeliveryTimestamp(b);
        return timeA - timeB;
    });
};

// ==========================================
// FLATTEN SERVER RESPONSE
// ==========================================

const flattenDeliveryResponse = (response) => {
    if (!response) return [];

    // If the server response is wrapped in an envelope, extract the inner data property
    const data = response.data !== undefined ? response.data : response;

    if (Array.isArray(data)) return data;
    if (typeof data !== 'object' || data === null) return [];

    return Object.entries(data).flatMap(([status, group]) => {
        if (
            !group ||
            typeof group !== 'object' ||
            !Array.isArray(group.deliveries)
        ) {
            return [];
        }

        return group.deliveries.map((delivery) => ({
            ...delivery,
            lifecycleStatus: delivery.lifecycleStatus || status,
        }));
    });
};

// ==========================================
// DATA TRANSFORMER
// ==========================================

const transformLedgerToDelivery = (raw) => {
    if (!raw || typeof raw !== 'object') {
        return {
            id: 'PO-UNKNOWN',
            supplier: 'Unknown Supplier',
            expectedDate: new Date().toISOString().split('T')[0],
            expectedTime: '09:00 AM',
            itemsCount: 0,
            status: 'Expected',
            destinationWarehouse: 'Default Warehouse',
            storageType: 'Ambient',
            totalPallets: 1,
            driverName: 'Unassigned',
            truckPlate: 'Pending',
            logisticsProvider: 'Standard Freight',
            totalValue: 0,
            currency: 'GHS',
            items: [],
            allocations: [],
            lifecycleStatus: 'EXPECTED',
        };
    }

    const dateSource =
        raw.schedule?.approvedAt ||
        raw.schedule?.requestedAt ||
        raw.expectedDate;

    let expectedDate = raw.expectedDate;
    let expectedTime = raw.expectedTime;

    if (dateSource && !raw.expectedDate) {
        const dateObj = new Date(dateSource);
        if (!Number.isNaN(dateObj.getTime())) {
            expectedDate = dateObj.toISOString().split('T')[0];
            expectedTime = dateObj.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        }
    }

    expectedDate = expectedDate || new Date().toISOString().split('T')[0];
    expectedTime = expectedTime || '09:00 AM';

    let inferredStatus = raw.status || 'Expected';
    const shipmentStatus = raw.shipmentSummary?.shipments?.[0]?.status;

    if (shipmentStatus === 'GATE_CHECKED_IN') {
        inferredStatus = 'Arrived';
    } else if (shipmentStatus === 'RECEIVING') {
        inferredStatus = 'Receiving';
    } else if (
        raw.shipmentSummary?.totalShipmentsCount > 0 &&
        raw.lifecycleStatus === 'IN_TRANSIT'
    ) {
        inferredStatus = 'In Transit';
    } else if (raw.lifecycleStatus) {
        const statusMap = {
            EXPECTED: 'Expected',
            IN_TRANSIT: 'In Transit',
            ARRIVED: 'Arrived',
            RECEIVING: 'Receiving',
            COMPLETED: 'Completed',
        };
        inferredStatus = statusMap[raw.lifecycleStatus] || 'Expected';
    }

    const allocations = Array.isArray(raw.allocations) ? raw.allocations : [];
    const uniqueWarehouses = [
        ...new Set(
            allocations
                .map((allocation) => allocation?.warehouseName)
                .filter(Boolean)
        ),
    ];

    const primaryWarehouse =
        raw.destinationWarehouse ||
        (uniqueWarehouses.length > 0
            ? uniqueWarehouses.length > 1
                ? `${uniqueWarehouses[0]} (+${uniqueWarehouses.length - 1} more)`
                : uniqueWarehouses[0]
            : raw.warehouseId
                ? `Warehouse ID: ${raw.warehouseId}`
                : 'Default Warehouse');

    const supplierDisplayName =
        raw.supplier?.name ||
        raw.supplierName ||
        (typeof raw.supplier === 'string' ? raw.supplier : null) ||
        raw.purchaseRequestId ||
        (raw.supplierId ? `Supplier ID: ${raw.supplierId}` : 'Unknown Supplier');

    const rawItems = Array.isArray(raw.items) ? raw.items : [];

    const totalQty = rawItems.reduce((acc, item) => {
        const quantity =
            item?.expectedQty !== undefined
                ? Number(item.expectedQty)
                : Number(item?.qtyExpected ?? item?.qtyOrdered ?? 0);
        return acc + (Number.isFinite(quantity) ? quantity : 0);
    }, 0);

    return {
        id:
            raw.id ||
            raw.ledgerNumber ||
            raw.purchaseRequestId ||
            raw.purchaseOrderId ||
            'PO-UNKNOWN',
        supplier:
            typeof supplierDisplayName === 'string'
                ? supplierDisplayName
                : 'Unknown Supplier',
        expectedDate,
        expectedTime,
        itemsCount: rawItems.length,
        status: inferredStatus,
        destinationWarehouse: primaryWarehouse,
        storageType: raw.storageType || raw.supplier?.businessType || 'Ambient',
        totalPallets: raw.totalPallets || Math.max(Math.ceil(totalQty / 1000), 1),
        driverName: raw.driverName || 'Unassigned',
        truckPlate: raw.truckPlate || 'Pending',
        logisticsProvider: raw.logisticsProvider || 'Standard Freight',
        totalValue:
            raw.totalValue ?? raw.commercials?.originalTotalAmount ?? 0,
        currency: raw.currency || raw.commercials?.currency || 'GHS',

        ledgerId: raw.ledgerId,
        ledgerNumber: raw.ledgerNumber,
        organizationId: raw.organizationId,
        purchaseOrderId: raw.purchaseOrderId,
        purchaseRequestId: raw.purchaseRequestId,
        supplierId: raw.supplierId,
        warehouseId: raw.warehouseId,
        supplierDetails:
            raw.supplier && typeof raw.supplier === 'object'
                ? raw.supplier
                : null,
        supplierName: supplierDisplayName,
        allocations,
        commercials: raw.commercials || null,
        schedule: raw.schedule || null,
        shipmentSummary: raw.shipmentSummary || null,
        lifecycleStatus: raw.lifecycleStatus || 'EXPECTED',

        items: rawItems.map((item) => ({
            itemId: item.itemId || item.productId || item.sku,
            productId: item.productId || item.sku,
            variantId: item.variantId || null,
            variantSize: item.variantSize || null,
            variantColor: item.variantColor || null,
            sku: item.sku || item.productId || 'N/A',
            barcode: item.barcode || null,
            name:
                item.name ||
                item.productName ||
                item.itemName ||
                'Unknown Item',
            productName:
                item.productName ||
                item.name ||
                item.itemName ||
                'Unknown Item',
            qtyExpected:
                item.expectedQty !== undefined
                    ? item.expectedQty
                    : item.qtyExpected ?? item.qtyOrdered ?? 0,
            qtyOrdered:
                item.qtyOrdered ?? item.expectedQty ?? 0,
            qtyPreviouslyReceived: item.qtyPreviouslyReceived ?? 0,
            expectedQty:
                item.expectedQty !== undefined
                    ? item.expectedQty
                    : item.qtyExpected ?? item.qtyOrdered ?? 0,
            unit: item.unit || item.unitOfMeasure || 'CASE',
            unitOfMeasure: item.unitOfMeasure || item.unit || 'CASE',
            category: item.category || 'Inbound',
            unitCost: item.unitCost ?? 0,
            outstandingValue: item.outstandingLineValue ?? 0,
            outstandingLineValue: item.outstandingLineValue ?? 0,
        })),
    };
};

// ==========================================
// FALLBACK / MOCK DATA
// ==========================================

const FALLBACK_DELIVERIES = [
    {
        organizationId: 'ORG-DEFAULT',
        ledgerId: 'led_6a7ecd8eb48e282659eb601d_v1',
        ledgerNumber: 'LED-59EB601D-V1-APP',
        purchaseOrderId: '6a7ecd8eb48e282659eb601d',
        purchaseRequestId: 'Thursday 14th August Purchase Order',
        supplierId: '6a170cfbe70e03ed4cccca7d',
        warehouseId: '6a70601466288000dadf877e',
        allocations: [
            {
                itemId: '1786694929671',
                itemName: 'Greek Yogurt',
                warehouseId: '6a70601466288000dadf877e',
                warehouseName: 'First Warehouse',
                quantity: 700,
            },
            {
                itemId: '1786694929671',
                itemName: 'Greek Yogurt',
                warehouseId: '6a71de1d5d9f2065b426673f',
                warehouseName: 'Second Warehouse',
                quantity: 300,
            },
        ],
        lifecycleStatus: 'EXPECTED',
        supplierName: 'PrimeLink Wholesale Distribution Ltd',
        supplier: {
            supplierId: '6a170cfbe70e03ed4cccca7d',
            name: 'PrimeLink Wholesale Distribution Ltd',
            location: 'Spintex Road Industrial Area',
            businessType: 'Wholesale Distributor',
            riskLevel: 'unrated',
        },
        schedule: {
            approvedAt: '2026-08-14T08:11:12.370Z',
            requestedAt: '2026-08-14T08:10:54.927Z',
            slaUrgency: 'OVERDUE',
            actionNote: '',
        },
        commercials: {
            currency: 'GHS',
            originalTotalAmount: 1042000,
            originalSubtotal: 1042000,
            tax: 0,
            discount: 0,
            outstandingCommercialValue: 1042000,
        },
        items: [
            {
                itemId: '1786694929671',
                productId: '1786694929671',
                productName: 'Greek Yogurt',
                sku: 'GREEK-YOGURT',
                unitOfMeasure: 'CASE',
                unitCost: 34,
                qtyOrdered: 1000,
                qtyPreviouslyReceived: 0,
                expectedQty: 1000,
                outstandingLineValue: 34000,
            },
        ],
    },
    {
        id: 'PO-0001',
        supplier: 'Coca-Cola Ghana',
        expectedDate: '2026-08-14',
        expectedTime: '10:30 AM',
        itemsCount: 1,
        status: 'Expected',
        destinationWarehouse: 'Accra Central Hub (Dock 04)',
        storageType: 'Ambient',
        totalPallets: 18,
        driverName: 'Kwame Mensah',
        truckPlate: 'GT-4921-25',
        logisticsProvider: 'InterLogistics Ghana',
        totalValue: 45500,
        currency: 'GHS',
        items: [
            {
                sku: 'CC-500-01',
                name: 'Coke 500ml PET (Case of 24)',
                qtyExpected: 250,
                unit: 'Cases',
                category: 'Beverages',
            },
        ],
    },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ExpectedDeliveriesPage() {
    const WarehouseAPI = `${API_ENDPOINTS.WAREHOUSES}/ledger/expected-deliveries`;

    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [gateForm, setGateForm] = useState({
        driverName: '',
        truckPlate: '',
        notes: '',
    });

    const fetchDeliveries = useCallback(
        async (signal) => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();

                if (searchTerm.trim()) {
                    params.append('search', searchTerm.trim());
                }

                if (statusFilter !== 'All') {
                    const apiStatus =
                        STATUS_API_MAP[statusFilter] || statusFilter;
                    params.append('status', apiStatus);
                }

                const requestUrl = `${WarehouseAPI}${params.toString() ? `?${params.toString()}` : ''
                    }`;

                const response = await fetch(requestUrl, {
                    method: 'GET',
                    signal,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                });

                if (response.status === 404) {
                    setDeliveries([]);
                    setLastUpdated(
                        new Date().toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                    );
                    return;
                }

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error(
                        `Unexpected response format from server (${response.status})`
                    );
                }

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                        `Server error: ${response.status} ${response.statusText}`
                    );
                }

                const rawPayload = flattenDeliveryResponse(data);
                const normalizedData = rawPayload.map(transformLedgerToDelivery);

                setDeliveries(normalizedData);
                setLastUpdated(
                    new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })
                );
            } catch (err) {
                if (err.name === 'AbortError') return;

                console.error('Expected deliveries fetch failed:', err);
                setError(
                    err.message ||
                    'Unable to connect to inbound delivery service.'
                );

                let fallbackData = FALLBACK_DELIVERIES.map(
                    transformLedgerToDelivery
                );

                if (statusFilter !== 'All') {
                    fallbackData = fallbackData.filter(
                        (delivery) => delivery.status === statusFilter
                    );
                }

                if (searchTerm.trim()) {
                    const term = searchTerm.toLowerCase().trim();
                    fallbackData = fallbackData.filter(
                        (delivery) =>
                            String(delivery.id || '')
                                .toLowerCase()
                                .includes(term) ||
                            String(delivery.supplier || '')
                                .toLowerCase()
                                .includes(term) ||
                            String(delivery.driverName || '')
                                .toLowerCase()
                                .includes(term) ||
                            String(delivery.truckPlate || '')
                                .toLowerCase()
                                .includes(term)
                    );
                }

                setDeliveries(fallbackData);
                setLastUpdated(
                    new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })
                );
            } finally {
                setLoading(false);
            }
        },
        [WarehouseAPI, searchTerm, statusFilter]
    );

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

    // Sorted deliveries memoized based on updated business sorting rules:
    const sortedDeliveries = useMemo(() => {
        return sortDeliveries(deliveries);
    }, [deliveries]);

    const metricsSummary = useMemo(() => {
        const counts = {
            total: sortedDeliveries.length,
            expected: 0,
            inTransit: 0,
            arrived: 0,
            receiving: 0,
            completed: 0,
            totalValue: 0,
        };

        sortedDeliveries.forEach((delivery) => {
            if (delivery.status === 'Expected') counts.expected++;
            else if (delivery.status === 'In Transit') counts.inTransit++;
            else if (delivery.status === 'Arrived') counts.arrived++;
            else if (delivery.status === 'Receiving') counts.receiving++;
            else if (delivery.status === 'Completed') counts.completed++;

            counts.totalValue += Number(delivery.totalValue) || 0;
        });

        return counts;
    }, [sortedDeliveries]);

    // Handler to select an item and display the detail modal
    const handleSelectDelivery = (delivery) => {
        setSelectedDelivery(delivery);
        setGateForm({
            driverName:
                delivery.driverName === 'Unassigned'
                    ? ''
                    : delivery.driverName || '',
            truckPlate:
                delivery.truckPlate === 'Pending'
                    ? ''
                    : delivery.truckPlate || '',
            notes: '',
        });
    };

    const handleConfirmArrival = async (id) => {
        setDeliveries((previous) =>
            previous.map((delivery) =>
                delivery.id === id
                    ? {
                        ...delivery,
                        status: 'Arrived',
                        lifecycleStatus: 'ARRIVED',
                        driverName: gateForm.driverName,
                        truckPlate: gateForm.truckPlate,
                    }
                    : delivery
            )
        );
        setSelectedDelivery(null);
    };

    const handleStartReceiving = async (id) => {
        setDeliveries((previous) =>
            previous.map((delivery) =>
                delivery.id === id
                    ? {
                        ...delivery,
                        status: 'Receiving',
                        lifecycleStatus: 'RECEIVING',
                    }
                    : delivery
            )
        );
        setSelectedDelivery(null);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
    };

    const metricCards = [
        {
            label: 'Total Inbound',
            filterKey: 'All',
            count: metricsSummary.total,
            activeBorder: 'border-slate-900',
            style: 'bg-white border-slate-200 text-slate-900',
            icon: Package,
        },
        {
            label: 'Arrived',
            filterKey: 'Arrived',
            count: metricsSummary.arrived,
            activeBorder: 'border-purple-500',
            style: 'bg-white border-purple-200 text-purple-900',
            icon: Calendar,
        },
        {
            label: 'In Transit',
            filterKey: 'In Transit',
            count: metricsSummary.inTransit,
            activeBorder: 'border-blue-500',
            style: 'bg-white border-blue-200 text-blue-900',
            icon: Truck,
        },
        {
            label: 'Expected',
            filterKey: 'Expected',
            count: metricsSummary.expected,
            activeBorder: 'border-amber-500',
            style: 'bg-white border-amber-200 text-amber-900',
            icon: Clock,
        },
        {
            label: 'Receiving',
            filterKey: 'Receiving',
            count: metricsSummary.receiving,
            activeBorder: 'border-emerald-500',
            style: 'bg-white border-emerald-200 text-emerald-900',
            icon: CheckCircle2,
        },
        {
            label: 'Completed',
            filterKey: 'Completed',
            count: metricsSummary.completed,
            activeBorder: 'border-green-500',
            style: 'bg-white border-green-200 text-green-900',
            icon: CheckCircle2,
        },
    ];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Expected Deliveries & Inbound Operations
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manage purchase orders, gate check-ins, and active warehouse receipts.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {lastUpdated && (
                        <span className="text-xs text-slate-400">
                            Last synced: {lastUpdated}
                        </span>
                    )}
                    <button
                        onClick={() => fetchDeliveries()}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'list'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <List className="w-4 h-4 inline mr-1.5" />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('analytics')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'analytics'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <BarChart3 className="w-4 h-4 inline mr-1.5" />
                            Analytics
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                    <div className="text-sm">
                        <span className="font-semibold">Notice:</span> {error} Showing offline/fallback records.
                    </div>
                </div>
            )}

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {metricCards.map((card) => {
                    const Icon = card.icon;
                    const isActive = statusFilter === card.filterKey;
                    return (
                        <div
                            key={card.label}
                            onClick={() => setStatusFilter(card.filterKey)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${card.style
                                } ${isActive
                                    ? `ring-2 ring-offset-2 ring-slate-900 ${card.activeBorder}`
                                    : 'hover:border-slate-300'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                    {card.label}
                                </span>
                                <Icon className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="mt-2 text-2xl font-semibold">
                                {card.count}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, Supplier, Driver..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                                Status: {status}
                            </option>
                        ))}
                    </select>
                    {(searchTerm || statusFilter !== 'All') && (
                        <button
                            onClick={handleResetFilters}
                            className="text-xs text-slate-500 hover:text-slate-900 underline ml-2"
                        >
                            Reset filters
                        </button>
                    )}
                </div>
            </div>

            {/* Content Views */}
            {viewMode === 'list' ? (
                <DeliveryListView
                    deliveries={sortedDeliveries}
                    loading={loading}
                    onOpenGateCheckIn={handleSelectDelivery}
                    onSelectDelivery={handleSelectDelivery}
                />
            ) : (
                <DeliveryAnalyticsView deliveries={sortedDeliveries} metrics={metricsSummary} />
            )}

            {/* Delivery Detail / Gate Check-In Modal */}
            {selectedDelivery && (
                <DeliveryDetailModal
                    delivery={selectedDelivery}
                    gateForm={gateForm}
                    setGateForm={setGateForm}
                    onClose={() => setSelectedDelivery(null)}
                    onConfirmArrival={handleConfirmArrival}
                    onStartReceiving={handleStartReceiving}
                />
            )}
        </div>
    );
}