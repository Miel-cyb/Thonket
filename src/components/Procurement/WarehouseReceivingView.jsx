import React from "react";
import CameraScanner from "./CameraScanner";
import ScanInput from "../Stock/Workspace/ScanInput";
import LastScannedItemCard from "../Stock/Workspace/LastScannedItemCard";
import {
    ScanLine,
    Boxes,
    ClipboardCheck,
    AlertTriangle,
    Activity,
} from "lucide-react";

// WAREHOUSE RECEIVING VIEW - PREMIUM LOGISTICS SCANNING INTERFACE
export default function WarehouseReceivingView({
    scanMode,
    onScan,
    lastScannedItem,
}) {

    return (
        <div className="h-full w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-lg">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-white px-5 py-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100">
                        <Boxes size={20} className="text-indigo-600" />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            Warehouse Receiving
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Scan and match incoming goods against purchase orders.
                        </p>
                    </div>
                </div>

                {/* STATUS */}
                <div className="hidden md:flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5">

                    <Activity size={14} className="text-indigo-600 animate-pulse" />

                    <span className="text-xs font-semibold text-indigo-700">
                        Live Matching Active
                    </span>
                </div>
            </div>

            {/* BODY */}
            <div className="grid h-[calc(100%-72px)] grid-cols-12 gap-5 bg-slate-50/40 p-5">

                {/* SCANNER COLUMN */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">

                    {/* SCAN MODE CARD */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <ScanLine size={14} />
                            Scan Interface
                        </div>

                        {scanMode === "camera" ? (
                            <CameraScanner onScan={onScan} />
                        ) : (
                            <ScanInput onScan={onScan} />
                        )}
                    </div>

                    {/* QUICK STATUS */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <ClipboardCheck size={14} />
                            Receiving Status
                        </div>

                        <div className="mt-3 space-y-2 text-xs text-slate-500">

                            <div className="flex items-center justify-between">
                                <span>Matched Items</span>
                                <span className="font-semibold text-slate-900">--</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span>Pending Items</span>
                                <span className="font-semibold text-slate-900">--</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span>Discrepancies</span>
                                <span className="flex items-center gap-1 font-semibold text-amber-600">
                                    <AlertTriangle size={12} />
                                    --
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">

                    {/* LAST SCAN */}
                    <LastScannedItemCard item={lastScannedItem} />

                    {/* RECEIVING TABLE */}
                    <div className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                        {/* TABLE HEADER */}
                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">

                            <h3 className="text-xs font-bold text-slate-600">
                                Receiving Table (Expected vs Actual)
                            </h3>

                            <p className="mt-1 text-[11px] text-slate-400">
                                Match scanned items with purchase order line items in real time.
                            </p>
                        </div>

                        {/* EMPTY STATE */}
                        <div className="flex h-full items-center justify-center p-10">

                            <div className="text-center">

                                <Boxes size={34} className="mx-auto text-slate-300" />

                                <p className="mt-3 text-sm font-semibold text-slate-600">
                                    No receiving data yet
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Start scanning items to populate the table
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}