import React, { useState, useEffect } from "react";

import ProcurementHeader from "../components/Procurement/ProcurementHeader";
import ProcurementStatsBar from "../components/Procurement/ProcurementStatsBar";
import ProcurementFlowNavigator from "../components/Procurement/ProcurementFlowNavigator";
import ProcurementWorkspace from "../components/Procurement/ProcurementWorkspace";
import { API_ENDPOINTS } from "../utils/urls";
import { Loader2, RefreshCw } from "lucide-react";

export default function ProcurementPage() {
    const [activeStage, setActiveStage] = useState("requests");
    const [scanMode, setScanMode] = useState("camera");
    const [lastScannedItem, setLastScannedItem] = useState(null);
    const [selectedPO, setSelectedPO] = useState(null);

    // --- SERVER STATE CAPTURE DATA PIPELINES ---
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // --- MAIN RETRIEVAL ACTION ---
    const fetchPurchaseOrders = async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const getOrdersApi = API_ENDPOINTS.PURCHASE_ORDERS;

            const response = await fetch(getOrdersApi, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Data synchronization failed. Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Live procurement payload snapshot from server:', data);

            // Handle both raw array returns or enclosed object payloads safely
            let extractedOrders = [];
            if (Array.isArray(data)) {
                extractedOrders = data;
            } else if (data && typeof data === 'object') {
                extractedOrders = data.orders || data.data || data.documents || (data._id ? [data] : []);
            }

            setPurchaseOrders(extractedOrders);
        } catch (err) {
            console.error("Procurement Engine Read Error:", err);
            setFetchError(err.message || "An error occurred while linking records to server pipeline.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- INITIALIZATION MOUNT ---
    useEffect(() => {
        fetchPurchaseOrders();
    }, []);

    const handleScan = (code) => {
        setLastScannedItem({
            sku: code,
            product: "Scanned Item",
            qty: 1,
        });
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-100 overflow-y-auto font-normal text-base antialiased">

            {/* BACKGROUND LAYERS */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-200" />
            <div className="pointer-events-none fixed top-0 right-0 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
            <div className="pointer-events-none fixed bottom-0 left-0 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />

            {/* CONTENT CANVAS WRAPPER */}
            <div className="relative z-10 flex flex-col w-full">

                {/* STICKY HEADER CONTAINER */}
                <div className="sticky top-0 z-20 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl shadow-xs">
                    <ProcurementHeader />
                </div>

                {/* LIVE METRICS TRACKING BAR */}
                <div className="px-5 pt-5">
                    <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
                        <ProcurementStatsBar orders={purchaseOrders} loading={isLoading} />
                    </div>
                </div>

                {/* FLOW NAVIGATOR METABAR */}
                <div className="px-5 pt-5">
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-2 shadow-xs backdrop-blur-md flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <ProcurementFlowNavigator
                                activeStage={activeStage}
                                setActiveStage={setActiveStage}
                            />
                        </div>
                        <button
                            onClick={fetchPurchaseOrders}
                            disabled={isLoading}
                            title="Force Refresh Data Matrix"
                            className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors rounded-xl shrink-0 cursor-pointer disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                {/* WORKSPACE AREA */}
                <div className="px-5 py-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/60 border border-slate-200/60 rounded-2xl backdrop-blur-md p-8 shadow-xs">
                            <Loader2 className="h-9 w-9 text-indigo-600 animate-spin mb-3" />
                            <p className="text-sm font-semibold tracking-tight text-slate-600">
                                Synchronizing backend procurement records...
                            </p>
                        </div>
                    ) : fetchError ? (
                        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl shadow-xs flex flex-col gap-2 max-w-2xl mx-auto mt-6">
                            <h4 className="text-base font-bold tracking-tight flex items-center gap-2 text-rose-800">
                                Synchronization Disruption
                            </h4>
                            <p className="text-sm font-medium text-rose-700/90">{fetchError}</p>
                            <button
                                onClick={fetchPurchaseOrders}
                                className="mt-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors px-4 py-2 rounded-lg self-start"
                            >
                                Re-verify Connection Pipeline
                            </button>
                        </div>
                    ) : (
                        <ProcurementWorkspace
                            activeStage={activeStage}
                            scanMode={scanMode}
                            onScan={handleScan}
                            lastScannedItem={lastScannedItem}
                            selectedPO={selectedPO}
                            setSelectedPO={setSelectedPO}
                            purchaseOrders={purchaseOrders}
                        />
                    )}
                </div>

            </div>
        </div>
    );
}