import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InventoryTable from '@/components/Inbound-Delivery/InventoryTable';
import {
    PackageCheck,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    RefreshCw,
    ShieldAlert,
    Boxes,
    TrendingUp,
    AlertTriangle,
    XCircle
} from 'lucide-react';
import { API_ENDPOINTS } from '@/utils/urls';

export default function ReceivingAuditPage() {
    const params = useParams();
    const navigate = useNavigate();
    const shipmentId = params?.ledgerId || params?.id || params?.shipmentId;

    // Component States
    const [shipmentData, setShipmentData] = useState(null);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRetrying, setIsRetrying] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch live data from server using route parameter ID
    const fetchShipmentDetails = async (isRetryAttempt = false) => {
        const controller = new AbortController();
        const { signal } = controller;

        if (!shipmentId) {
            setIsLoading(false);
            setErrorMessage('Missing shipment identifier in route parameters. Please verify the URL path.');
            return;
        }

        try {
            if (isRetryAttempt) {
                setIsRetrying(true);
            } else {
                setIsLoading(true);
            }
            setErrorMessage(null);

            const endpoint = `${API_ENDPOINTS.WAREHOUSES}/inbound/delivery/single/${shipmentId}`;

            const response = await fetch(endpoint, {
                method: 'GET',
                signal,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}: Failed to load shipment ledger.`);
            }

            const jsonResponse = await response.json();
            console.log('Fetched Shipment Audit Details:', jsonResponse);

            const actualShipment = jsonResponse?.data || jsonResponse;

            setShipmentData(actualShipment);
            setInventoryItems(actualShipment?.items || actualShipment?.inventoryItems || []);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error fetching shipment audit details:', error);
                setErrorMessage(error.message || 'An unexpected error occurred while communicating with the server.');
            }
        } finally {
            setIsLoading(false);
            setIsRetrying(false);
        }

        return () => {
            controller.abort();
        };
    };

    useEffect(() => {
        fetchShipmentDetails();
    }, [shipmentId]);

    // Handler to modify a specific field on a single item with automated shortage/accepted calculations
    const handleItemChange = (itemId, field, value) => {
        setInventoryItems((prevItems) =>
            prevItems.map((item) => {
                const targetKey = item.itemId || item.id || item.sku;
                const matchKey = itemId;
                if (targetKey === matchKey) {
                    const updatedItem = { ...item, [field]: value };

                    if (field === 'receivedQty' || field === 'expectedQty' || field === 'damagedQty') {
                        const exp = parseInt(field === 'expectedQty' ? value : (item.expectedQty ?? item.orderedQty ?? 0), 10) || 0;
                        const rec = parseInt(field === 'receivedQty' ? value : (item.receivedQty ?? 0), 10) || 0;
                        const dam = parseInt(field === 'damagedQty' ? value : (item.damagedQty ?? 0), 10) || 0;

                        updatedItem.receivedQty = rec;
                        updatedItem.damagedQty = dam;
                        updatedItem.acceptedQty = Math.max(0, rec - dam);
                        updatedItem.shortageQty = Math.max(0, exp - rec);
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    // Handler to add a new inventory item
    const handleAddItem = () => {
        const randomSku = `SKU-${Math.floor(10000 + Math.random() * 90000)}`;
        const newItem = {
            itemId: randomSku,
            sku: randomSku,
            productName: 'New Unassigned Item',
            batchNumber: '',
            lotNumber: '',
            binLocation: '',
            expectedQty: 1,
            receivedQty: 1,
            damagedQty: 0,
            acceptedQty: 1,
            shortageQty: 0,
            expiryDate: '',
            unitCost: 0.00,
        };
        setInventoryItems((prev) => [...prev, newItem]);
    };

    // Handler to delete an item row
    const handleRemoveItem = (itemId) => {
        setInventoryItems((prev) => prev.filter((item) => (item.itemId || item.id || item.sku) !== itemId));
    };

    // Finalize the audit/receiving report back to the server using a PATCH request
    const handleFinalizeReceiving = async () => {
        try {
            setIsSubmitting(true);
            const endpoint = `${API_ENDPOINTS.WAREHOUSES}/inbound/delivery/single/${shipmentId}`;

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ items: inventoryItems }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit receiving audit report.');
            }

            setIsSubmitted(true);
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to complete receiving. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculations for summary metrics
    const totalExpected = inventoryItems.reduce((acc, item) => acc + (Number(item.expectedQty ?? item.orderedQty ?? item.quantity) || 0), 0);
    const totalReceived = inventoryItems.reduce((acc, item) => acc + (Number(item.receivedQty ?? item.arrivedQty) || 0), 0);
    const totalDamaged = inventoryItems.reduce((acc, item) => acc + (Number(item.damagedQty) || 0), 0);
    const totalValuation = inventoryItems.reduce((acc, item) => {
        const accepted = Number(item.acceptedQty ?? Math.max(0, (item.receivedQty || 0) - (item.damagedQty || 0))) || 0;
        const cost = Number(item.unitCost ?? item.price) || 0;
        return acc + (accepted * cost);
    }, 0);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-md px-10 py-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 max-w-sm w-full">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-indigo-100 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                        </div>
                    </div>
                    <div className="text-center space-y-1">
                        <h2 className="text-sm font-bold text-slate-900">Retrieving Shipment Record</h2>
                        <p className="text-xs text-slate-500">Querying secure warehouse logs for ID: <span className="font-mono text-indigo-600">{shipmentId}</span></p>
                    </div>
                </div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/20 to-slate-100 flex items-center justify-center p-6">
                <div className="flex flex-col items-center text-center max-w-md gap-4 bg-white px-8 py-10 rounded-3xl border border-rose-100 shadow-xl shadow-rose-950/5">
                    <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner border border-rose-100/50">
                        <ShieldAlert className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">Failed to Load Audit Details</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{errorMessage}</p>
                    </div>
                    <div className="flex items-center gap-3 w-full pt-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition cursor-pointer"
                        >
                            Return Back
                        </button>
                        <button
                            type="button"
                            onClick={() => fetchShipmentDetails(true)}
                            disabled={isRetrying}
                            className="flex-1 px-4 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                        >
                            {isRetrying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/70 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Top Navigation & Header */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="space-y-1.5">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" /> Back to Purchase Orders
                        </button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                                <PackageCheck className="w-6 h-6 text-indigo-600" />
                                Shipment Receipt & Quality Audit
                            </h1>
                            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                                {shipmentData?.status || 'Live Audit Mode'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                            <span>Ledger Number: <strong className="font-mono text-slate-700">{shipmentData?.ledgerNumber || shipmentId}</strong></span>
                            <span className="text-slate-300">•</span>
                            <span>Purchase Request: <strong className="text-slate-700">{shipmentData?.purchaseRequestId || 'N/A'}</strong></span>
                            <span className="text-slate-300">•</span>
                            <span>Carrier: <strong className="text-slate-700">{shipmentData?.logistics?.carrierName || 'N/A'}</strong></span>
                        </p>
                    </div>
                </div>

                {/* Quick KPI Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-slate-500">Total Expected</span>
                            <div className="text-xl font-bold text-slate-900">{totalExpected} <span className="text-xs font-normal text-slate-500">units</span></div>
                        </div>
                        <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-100">
                            <Boxes className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-blue-600">Total Received Stock</span>
                            <div className="text-xl font-bold text-blue-700">{totalReceived} <span className="text-xs font-normal text-blue-500">units</span></div>
                        </div>
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                            <PackageCheck className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-rose-600">Total Damaged</span>
                            <div className="text-xl font-bold text-rose-700">{totalDamaged} <span className="text-xs font-normal text-rose-500">units</span></div>
                        </div>
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-indigo-600">Total Accepted Value</span>
                            <div className="text-xl font-bold text-indigo-900">${totalValuation.toFixed(2)}</div>
                        </div>
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Main Imported Component Container */}
                <div className="space-y-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6">
                    <InventoryTable
                        items={inventoryItems}
                        onItemChange={handleItemChange}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                    />
                </div>

                {/* Bottom Action Footer */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        Review all quantities and row audits thoroughly before submitting your final receiving report.
                    </p>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-medium text-slate-600 bg-white border border-slate-300/80 hover:bg-slate-50 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <XCircle className="w-4 h-4 text-slate-400" /> Discard Changes
                        </button>
                        <button
                            type="button"
                            onClick={handleFinalizeReceiving}
                            disabled={isSubmitted || isSubmitting}
                            className="flex-1 sm:flex-initial px-6 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 disabled:bg-emerald-600 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                                </>
                            ) : isSubmitted ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" /> Received & Verified
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" /> Complete Receiving
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}