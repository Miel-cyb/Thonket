import React, { useState } from "react";

import ProcurementHeader from "../components/Procurement/ProcurementHeader";
import ProcurementStatsBar from "../components/Procurement/ProcurementStatsBar";
import ProcurementFlowNavigator from "../components/Procurement/ProcurementFlowNavigator";
import ProcurementWorkspace from "../components/Procurement/ProcurementWorkspace";

export default function ProcurementPage() {
    const [activeStage, setActiveStage] = useState("requests");
    const [scanMode, setScanMode] = useState("camera");
    const [lastScannedItem, setLastScannedItem] = useState(null);
    const [selectedPO, setSelectedPO] = useState(null);

    const handleScan = (code) => {
        setLastScannedItem({
            sku: code,
            product: "Scanned Item",
            qty: 1,
        });
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-100 overflow-y-auto">

            {/* BACKGROUND LAYERS */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-200" />
            <div className="pointer-events-none fixed top-0 right-0 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
            <div className="pointer-events-none fixed bottom-0 left-0 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />

            {/* CONTENT (NOW NATURAL PAGE FLOW) */}
            <div className="relative z-10 flex flex-col">

                {/* HEADER */}
                <div className="sticky top-0 z-20 border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm">
                    <ProcurementHeader />
                </div>

                {/* STATS */}
                <div className="px-5 pt-5">
                    <div className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-xl">
                        <ProcurementStatsBar />
                    </div>
                </div>

                {/* FLOW NAV */}
                <div className="px-5 pt-5">
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-2 shadow-md backdrop-blur-md">
                        <ProcurementFlowNavigator
                            activeStage={activeStage}
                            setActiveStage={setActiveStage}
                        />
                    </div>
                </div>

                {/* WORKSPACE (NO HEIGHT LIMIT, NO CLIPPING) */}
                <div className="px-5 py-6">

                    <ProcurementWorkspace
                        activeStage={activeStage}
                        scanMode={scanMode}
                        onScan={handleScan}
                        lastScannedItem={lastScannedItem}
                        selectedPO={selectedPO}
                        setSelectedPO={setSelectedPO}
                    />

                </div>

            </div>
        </div>
    );
}