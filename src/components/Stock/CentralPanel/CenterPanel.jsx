import React, { useMemo } from "react";
import IntakeTableHeader from "./IntakeTableHeader";
import IntakeRow from "./IntakeRow";

/**
 * CenterPanel (SESSION-AWARE WAREHOUSE LEDGER)
 */
const CenterPanel = ({
    rows = [],
    onRowChange,

    session,
    lastScannedSku,
    sessionLocked = false,
}) => {

    /* =====================================================
       1. SESSION VALIDATION
    ===================================================== */
    if (!session || !session.supplier || !session.invoice) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white">
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                    <span className="text-red-500 text-xl">⚠️</span>
                </div>

                <h2 className="text-sm font-bold text-gray-800">
                    Intake Session Not Started
                </h2>

                <p className="text-xs text-gray-500 mt-2 max-w-sm">
                    Select supplier, invoice, and warehouse to begin scanning.
                </p>
            </div>
        );
    }

    /* =====================================================
       2. SAFE ROWS
    ===================================================== */
    const orderedRows = useMemo(() => {
        return rows?.length ? [...rows] : [];
    }, [rows]);

    /* =====================================================
       3. RENDER
    ===================================================== */
    return (
        <div className="flex flex-col h-full w-full bg-white rounded-xl border border-gray-200 overflow-hidden min-h-0">

            {/* =================================================
                SESSION HEADER
            ================================================= */}
            <div className="flex-none bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 px-4 py-3">

                <div className="flex justify-between items-center text-xs">

                    <div className="space-y-1">
                        <div className="font-bold text-blue-700 text-sm">
                            {session.supplier}
                        </div>

                        <div className="text-blue-500">
                            Invoice: <span className="font-semibold">{session.invoice}</span>
                            {" • "}
                            PO: <span className="font-semibold">{session.po || "N/A"}</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="font-semibold text-blue-700">
                            {session.warehouse}
                        </div>

                        <div
                            className={`text-[11px] mt-1 font-bold px-2 py-1 rounded-md inline-block ${
                                sessionLocked
                                    ? "bg-red-100 text-red-600"
                                    : "bg-emerald-100 text-emerald-600"
                            }`}
                        >
                            {sessionLocked ? "SESSION LOCKED" : "ACTIVE SESSION"}
                        </div>
                    </div>

                </div>
            </div>

            {/* =================================================
                TABLE HEADER
            ================================================= */}
            <div className="flex-none bg-gray-50 border-b border-gray-200">
                <IntakeTableHeader />
            </div>

            {/* =================================================
                SCROLLABLE BODY (FIXED CORE ISSUE)
            ================================================= */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-white">

                {orderedRows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                            <span className="text-blue-500 text-xl">📦</span>
                        </div>

                        <h3 className="text-sm font-bold text-gray-800">
                            Ready for Warehouse Receiving
                        </h3>

                        <p className="text-xs text-gray-400 mt-2 max-w-xs">
                            Scan items to automatically populate this intake session.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {orderedRows.map((row) => {
                            const isActiveScan =
                                lastScannedSku &&
                                row.sku === lastScannedSku;

                            return (
                                <div
                                    key={row.id}
                                    className={`
                                        transition-all duration-150
                                        ${isActiveScan
                                            ? "bg-blue-50/60 border-l-4 border-blue-500"
                                            : "hover:bg-gray-50"
                                        }
                                    `}
                                >
                                    <IntakeRow
                                        row={{
                                            ...row,
                                            supplier: session.supplier,
                                            invoice: session.invoice,
                                            po: session.po,
                                            warehouse: session.warehouse,
                                        }}
                                        onChange={onRowChange}
                                        highlight={isActiveScan}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    );
};

export default CenterPanel;