import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InventoryTable from '@/components/Inbound-Delivery/InventoryTable';
import {
    PackageCheck,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    ShieldAlert,
    Boxes,
    TrendingUp,
    AlertTriangle,
    XCircle,
    Lock
} from 'lucide-react';
import { API_ENDPOINTS } from '@/utils/urls';

// This is the page to audit and finalize the receiving of a shipment.
// It fetches shipment details, allows item modifications, and submits the finalized report to the server.
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

    // Derived lock check: if data was already submitted in past lifecycle or server flags status as completed/verified
    const isLedgerLocked = isSubmitted || shipmentData?.status === 'COMPLETED' || shipmentData?.status === 'VERIFIED' || shipmentData?.status === 'RECEIVED';

    // Fetch live data from server using route parameter ID
    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const fetchShipmentDetails = async () => {
            if (!shipmentId) {
                setIsLoading(false);
                setErrorMessage('Missing shipment identifier in route parameters. Please verify the URL path.');
                return;
            }

            try {
                setIsLoading(true);
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
                const actualShipment = jsonResponse?.data || jsonResponse;

                setShipmentData(actualShipment);
                setInventoryItems(actualShipment?.items || actualShipment?.inventoryItems || []);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setErrorMessage(error.message || 'An unexpected error occurred while communicating with the server.');
                }
            } finally {
                setIsLoading(false);
                setIsRetrying(false);
            }
        };

        fetchShipmentDetails();

        return () => {
            controller.abort();
        };
    }, [shipmentId]);

    // Handler to update a specific item when modified from the InventoryTable modal
    const handleItemChange = (itemId, updatedItemData) => {
        if (isLedgerLocked) return;

        setInventoryItems((prevItems) =>
            prevItems.map((item, index) => {
                const targetKey = item.itemId ?? item.id ?? item.sku ?? index;

                if (String(targetKey) === String(itemId)) {
                    if (typeof updatedItemData === 'object' && updatedItemData !== null) {
                        return { ...item, ...updatedItemData };
                    }
                }
                return item;
            })
        );
    };

    // Handler to add a new inventory item
    const handleAddItem = () => {
        if (isLedgerLocked) return;

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

    // Handler to delete an item row securely with type-safe fallback matching
    const handleRemoveItem = (itemId) => {
        if (isLedgerLocked) return;

        setInventoryItems((prev) =>
            prev.filter((item, index) => {
                const targetKey = item.itemId ?? item.id ?? item.sku ?? index;
                return String(targetKey) !== String(itemId);
            })
        );
    };

    // Form validation: Checks if inventory items exist and required fields are filled out
    const validateInventoryForm = () => {
        if (!inventoryItems || inventoryItems.length === 0) {
            setErrorMessage('Cannot submit an empty receiving report. Please add at least one inventory item.');
            return false;
        }

        for (const [index, item] of inventoryItems.entries()) {
            const sku = item.sku || item.itemId;
            const receivedQty = Number(item.receivedQty ?? item.arrivedQty);

            if (!sku || String(sku).trim() === '') {
                setErrorMessage(`Item at row ${index + 1} is missing a valid SKU or identifier.`);
                return false;
            }

            if (isNaN(receivedQty) || receivedQty < 0) {
                setErrorMessage(`Item at row ${index + 1} (${sku}) has an invalid received quantity.`);
                return false;
            }
        }

        return true;
    };

    // Finalize the audit/receiving report back to the server using a PATCH request
    const handleFinalizeReceiving = async () => {
        if (isLedgerLocked) return;

        setErrorMessage(null);

        if (!validateInventoryForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            const endpoint = `${API_ENDPOINTS.WAREHOUSES}/inbound/delivery/${shipmentData._id}/physical-tally`;

            // Ensures exact received quantities are submitted without modifying them to shortages
            const sanitizedItems = inventoryItems.map((item) => ({
                ...item,
                receivedQty: Number(item.receivedQty ?? 0),
                expectedQty: Number(item.expectedQty ?? 0),
                damagedQty: Number(item.damagedQty ?? 0),
                acceptedQty: Number(item.acceptedQty ?? 0),
                shortageQty: Number(item.shortageQty ?? 0),
            }));

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    organizationId: shipmentData?.organizationId,
                    items: sanitizedItems,
                    actor: {
                        userId: 'user-12345',
                        name: 'Jane Doe',
                        username: 'jdoe_sec',
                        role: 'Supervisor',
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit receiving audit report.');
            }

            setIsSubmitted(true);
            setTimeout(() => {
                navigate(-1);
            }, 1800);
        } catch (error) {
            console.error('Submission error:', error);
            setErrorMessage('Failed to complete receiving submission. Please verify network status and try again.');
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/70 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Commercial Banner Notification for Locked/Already Submitted Ledgers */}
                {isLedgerLocked && (
                    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-amber-900">Audit Ledger Locked & Verified</h4>
                                <p className="text-xs text-amber-700/80 mt-0.5">
                                    This inbound delivery has already been processed and audited. Modifications and resubmissions are disabled for inventory compliance.
                                </p>
                            </div>
                        </div>
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-lg border border-amber-200 shrink-0">
                            Read-Only Protocol Active
                        </span>
                    </div>
                )}

                {/* Error Banner Notification for Incomplete/Empty Fields Validation Failure */}
                {errorMessage && !isLoading && (
                    <div className="bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-200/80 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-rose-900">Action Required</h4>
                                <p className="text-xs text-rose-700/90 mt-0.5">{errorMessage}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setErrorMessage(null)}
                            className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer px-2 py-1"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

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
                            <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${isLedgerLocked ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                                {isLedgerLocked ? 'Verified & Completed' : (shipmentData?.status || 'Live Audit Mode')}
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
                <div className={`space-y-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 ${isLedgerLocked ? 'opacity-90 pointer-events-none select-none' : ''}`}>
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
                        {isLedgerLocked
                            ? 'This audit record is locked for regulatory data integrity. No further updates are permitted.'
                            : 'Review all quantities and row audits thoroughly before submitting your final receiving report.'}
                    </p>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-medium text-slate-600 bg-white border border-slate-300/80 hover:bg-slate-50 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <XCircle className="w-4 h-4 text-slate-400" /> {isLedgerLocked ? 'Back to Overview' : 'Discard Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={handleFinalizeReceiving}
                            disabled={isLedgerLocked || isSubmitted || isSubmitting}
                            className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs font-semibold rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${isLedgerLocked
                                ? 'bg-slate-200 text-slate-400 border border-slate-300 shadow-none cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 disabled:bg-emerald-600'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Report...
                                </>
                            ) : isLedgerLocked || isSubmitted ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" /> Ledger Verified & Submitted
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