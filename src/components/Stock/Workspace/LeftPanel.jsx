import React from "react";

import ScanInput from "./ScanInput";
import ScanModeToggle from "./ScanModeToggle";
import LastScannedItemCard from "./LastScannedItemCard";
import ScanFeedback from "./ScanFeedback";

/**
 * LeftPanel
 * Core ingress hub for incoming stock data capture streams.
 * Packages scan rule constraints, active telemetry inputs, and visual capture receipts.
 */
const LeftPanel = ({
    scanValue,
    scanMode,
    lastScannedItem,
    feedback,

    onScanChange,
    onScanSubmit,
    onModeChange,
}) => {
    return (
        <div className="w-full max-w-sm flex flex-col gap-4 p-4 bg-slate-50/40 border border-slate-200/80 rounded-xl shadow-sm select-none">

            {/* ==========================================
               SECTION 1: SCAN HARDWARE OPERATION CONTROLS
               ========================================== */}
            <div className="flex flex-col gap-2 bg-white p-3.5 border border-slate-200 rounded-xl shadow-sm">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Ingress Configuration
                </span>

                {/* Hardware behavior rule toggle mechanism */}
                <ScanModeToggle
                    mode={scanMode}
                    onChange={onModeChange}
                />

                {/* Focused hardware barcode/RFID scanner listener input */}
                <ScanInput
                    value={scanValue}
                    onChange={onScanChange}
                    onScan={onScanSubmit}
                />
            </div>

            {/* ==========================================
               SECTION 2: REAL-TIME RESPONSE FEEDBACK LOG
               ========================================== */}
            {feedback?.message && (
                <div className="w-full animate-fadeIn">
                    <ScanFeedback
                        status={feedback.status}
                        message={feedback.message}
                    />
                </div>
            )}

            {/* ==========================================
               SECTION 3: IMMEDIATE HARDWARE SCAN RECEIPT
               ========================================== */}
            <div className="w-full mt-auto">
                <LastScannedItemCard
                    item={lastScannedItem}
                />
            </div>

        </div>
    );
};

export default LeftPanel;