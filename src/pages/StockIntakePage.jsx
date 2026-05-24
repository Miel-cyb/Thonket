import React from "react";

/* ==========================================================================
   COMPONENT IMPORTS
   ========================================================================== */
import IntakeTopBar from "../components/Stock/StockIntake/IntakeTopBar";
import LeftPanel from "../components/Stock/Workspace/LeftPanel";
import WholesaleIntakeForm from "../components/Stock/ShipmentForm/WholesaleIntakeForm";
import ShipmentDetailsForm from "../components/Stock/ShipmentForm/ShipmentDetailsForm";
import CenterPanel from "../components/Stock/CentralPanel/CenterPanel";
import BulkEditToolbar from "../components/Stock/BulkToolBar/BulkEditToolBar";
import ValidationPanel from "../components/Stock/RightPanel/ValidationPanel";
import WarehouseCapacityWidget from "../components/Stock/Capacity/WarehouseCapacityWidget";
import BottomActionBar from "../components/Stock/BottomBar/BottomActionBar";

/* ✅ REAL CAMERA SCANNER */
import CameraScanner from "../components/Stock/Workspace/CameraScanner";
import ScanInput from "../components/Stock/Workspace/ScanInput";

const StockIntakePage = ({
    warehouse,
    supplier,
    status,

    scanValue,
    scanMode: externalScanMode = "keyboard",
    lastScannedItem,
    scanFeedback,

    rows,
    duplicateMergeEnabled,

    errors,
    warnings,
    conflicts,

    totalUsed,
    totalCapacity,
    zones,

    suppliers = [],
    warehouses = [],

    onWarehouseChange,
    onSaveDraft,
    onValidate,
    onPostIntake,
    onCancel,

    onScanChange,
    onScanSubmit,
    onModeChange,

    onRowChange,
    onApplyQty,
    onRemoveRow,
    onToggleDuplicateMerge,
    onManualRowSubmit,

    onShipmentSubmit,
}) => {

    const [scanMode, setScanMode] = React.useState(externalScanMode);
    const [step, setStep] = React.useState("shipment");

    React.useEffect(() => {
        setScanMode(externalScanMode);
    }, [externalScanMode]);

    const handleModeSwitch = (mode) => {
        setScanMode(mode);
        onModeChange?.(mode);
    };

    const handleShipmentSubmit = (data) => {
        onShipmentSubmit?.(data);
        setStep("intake");
    };

    const goBackToShipment = () => setStep("shipment");

    /* ===================== SCAN HANDLER (CENTRAL ENGINE) ===================== */
    const handleScan = (code) => {
        if (!code) return;

        onScanSubmit?.(code);

        // highlight pulse trigger (if supported)
        setTimeout(() => {
            // optional reset hook
        }, 500);
    };

    return (
        <div className="h-screen w-full flex flex-col bg-slate-100 text-slate-800 overflow-hidden">

            {/* ================= TOP BAR ================= */}
            <div className="flex-none border-b border-slate-200 bg-white shadow-sm">
                <IntakeTopBar
                    warehouse={warehouse}
                    supplier={supplier}
                    status={status}
                    onWarehouseChange={onWarehouseChange}
                    onSave={onSaveDraft}
                    onPost={onPostIntake}
                    onExit={onCancel}
                />
            </div>

            {/* ================= MAIN LAYOUT ================= */}
            <div className="flex-1 grid grid-cols-12 gap-5 p-5 overflow-hidden">

                <main className="col-span-9 flex flex-col bg-white rounded-2xl border shadow-md overflow-hidden">

                    {/* ================= STEP HEADER ================= */}
                    <div className="flex-none px-4 py-2 border-b bg-slate-50 flex justify-between items-center">

                        <div className="flex gap-2 items-center">
                            <span className="text-[11px] font-bold uppercase text-slate-500">
                                {step === "shipment" ? "Setup Phase" : "Execution Phase"}
                            </span>

                            <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase
                                ${step === "shipment"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-green-50 text-green-700 border-green-200"
                                }`}
                            >
                                {step}
                            </span>
                        </div>

                        {step === "intake" && (
                            <button
                                onClick={goBackToShipment}
                                className="text-xs px-3 py-1 rounded-lg border bg-white hover:bg-slate-50"
                            >
                                ← Back
                            </button>
                        )}
                    </div>

                    {/* ================= VIEW ================= */}
                    <div className="flex-1 relative overflow-hidden">

                        {/* ================= SHIPMENT ================= */}
                        <div className={`absolute inset-0 transition-all duration-500
                            ${step === "shipment"
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-6 pointer-events-none"
                            }`}
                        >
                            <div className="h-full overflow-y-auto bg-slate-50 p-6">
                                <div className="max-w-5xl mx-auto bg-white rounded-2xl border shadow-sm p-6">
                                    <ShipmentDetailsForm
                                        suppliers={suppliers}
                                        warehouses={warehouses}
                                        onSubmit={handleShipmentSubmit}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ================= INTAKE ================= */}
                        <div className={`absolute inset-0 transition-all duration-500
                            ${step === "intake"
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 translate-x-6 pointer-events-none"
                            }`}
                        >
                            <div className="h-full flex flex-col">

                                {/* MODE SWITCHER */}
                                <div className="flex-none px-4 py-3 border-b bg-slate-50 flex justify-between items-center">

                                    <span className="text-xs font-bold text-slate-500 uppercase">
                                        Intake Execution Mode
                                    </span>

                                    <div className="flex gap-1 bg-slate-200 p-1 rounded-xl">
                                        {["camera", "keyboard", "manual"].map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => handleModeSwitch(mode)}
                                                className={`px-3 py-1 text-xs font-bold rounded-lg transition
                                                    ${scanMode === mode
                                                        ? "bg-white text-blue-600 shadow"
                                                        : "text-slate-600 hover:text-slate-900"
                                                    }`}
                                            >
                                                {mode.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* WORKSPACE */}
                                <div className="flex-1 flex overflow-hidden bg-slate-50 p-4">

                                    {/* MANUAL */}
                                    {scanMode === "manual" ? (
                                        <div className="flex-1 overflow-y-auto bg-white rounded-xl border shadow-sm p-4">
                                            <WholesaleIntakeForm
                                                zones={zones}
                                                onAddRow={onManualRowSubmit}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            {/* LEFT PANEL */}
                                            <div className="w-80 flex flex-col bg-white border rounded-xl shadow-sm overflow-hidden">

                                                <div className="p-3 border-b bg-slate-50 text-xs font-bold text-slate-500">
                                                    {scanMode === "camera" ? "Camera Scanner" : "Keyboard Input"}
                                                </div>

                                                <div className="flex-1 p-3 overflow-hidden">
                                                    {scanMode === "camera" ? (
                                                        <CameraScanner onScan={handleScan} />
                                                    ) : (
                                                        <ScanInput
                                                            value={scanValue}
                                                            onChange={onScanChange}
                                                            onScan={handleScan}
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* CENTER PANEL */}
                                            <div className="flex-1 flex flex-col gap-3 overflow-hidden ml-4">

                                                <div className="bg-white border rounded-xl p-2 shadow-sm">
                                                    <BulkEditToolbar
                                                        onApplyQty={onApplyQty}
                                                        onRemoveRow={onRemoveRow}
                                                        duplicateMergeEnabled={duplicateMergeEnabled}
                                                        onToggleDuplicateMerge={onToggleDuplicateMerge}
                                                    />
                                                </div>

                                                <div className="flex-1 bg-white border rounded-xl shadow-sm overflow-hidden">
                                                    <CenterPanel
                                                        rows={rows || []}
                                                        onRowChange={onRowChange}
                                                        lastScannedSku={lastScannedItem?.sku}
                                                    />
                                                </div>

                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>

                {/* RIGHT PANEL */}
                <aside className="col-span-3 flex flex-col gap-4 overflow-hidden">

                    <div className="bg-white rounded-2xl border p-4 flex-1 overflow-y-auto">
                        <ValidationPanel
                            errors={errors}
                            warnings={warnings}
                            conflicts={conflicts}
                        />
                    </div>

                    <div className="bg-white rounded-2xl border p-4 flex-none">
                        <WarehouseCapacityWidget
                            totalUsed={totalUsed}
                            totalCapacity={totalCapacity}
                            zones={zones}
                        />
                    </div>

                </aside>
            </div>

            {/* BOTTOM BAR */}
            <div className="flex-none bg-white border-t shadow-md px-5 py-3">
                <BottomActionBar
                    onSaveDraft={onSaveDraft}
                    onValidate={onValidate}
                    onPostIntake={onPostIntake}
                    onCancel={onCancel}
                    canPost={errors?.length === 0}
                />
            </div>

        </div>
    );
};

export default StockIntakePage;