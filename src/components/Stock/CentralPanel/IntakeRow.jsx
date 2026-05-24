import React from "react";

/**
 * IntakeRow (Wholesale Distribution Execution Ledger Row)
 * ------------------------------------------------------
 * Designed for:
 * - FMCG warehouses
 * - Distributor intake desks
 * - High-speed scanning environments
 * - Batch + invoice-driven receiving
 */
const IntakeRow = ({ row, onChange, highlight }) => {
    const getStatusStyles = (status = "") => {
        const s = status.toLowerCase();

        if (s === "valid") {
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }
        if (s === "warning") {
            return "bg-amber-50 text-amber-700 border-amber-200";
        }
        if (s === "error") {
            return "bg-red-50 text-red-700 border-red-200";
        }

        return "bg-gray-50 text-gray-600 border-gray-200";
    };

    const update = (field, value) => {
        if (!onChange) return;
        onChange(row.id, field, value);
    };

    return (
        <div
            className={`
                grid grid-cols-12 gap-2 px-3 py-2 items-center text-sm
                border-b border-gray-100 transition-all
                ${highlight ? "bg-blue-50/50 border-l-4 border-blue-500" : "hover:bg-gray-50"}
            `}
        >

            {/* ================= SKU (SCAN PRIMARY KEY) ================= */}
            <div className="col-span-2">
                <div className="font-mono text-xs font-bold text-gray-700 truncate">
                    {row.sku || "—"}
                </div>

                {/* Scan source indicator */}
                <div className="text-[10px] text-gray-400">
                    {row.source || "scan/manual"}
                </div>
            </div>

            {/* ================= PRODUCT ================= */}
            <div className="col-span-3">
                <div className="font-semibold text-gray-800 truncate">
                    {row.product || "Unknown Item"}
                </div>

                <div className="text-[11px] text-gray-400 truncate">
                    {row.variant || "Standard"}
                </div>
            </div>

            {/* ================= UOM (IMPORTANT FOR WHOLESALE) ================= */}
            <div className="col-span-1 text-xs text-gray-500 font-bold">
                {row.uom || "PCS"}
            </div>

            {/* ================= QTY CONTROLS (FAST OPS UX) ================= */}
            <div className="col-span-2 flex items-center gap-1">

                <button
                    type="button"
                    onClick={() => update("qty", Math.max(0, (row.qty || 0) - 1))}
                    className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-xs"
                >
                    −
                </button>

                <input
                    type="number"
                    className="w-16 text-center font-bold border border-gray-300 rounded text-xs py-1"
                    value={row.qty || 0}
                    onChange={(e) =>
                        update("qty", parseInt(e.target.value || "0", 10))
                    }
                />

                <button
                    type="button"
                    onClick={() => update("qty", (row.qty || 0) + 1)}
                    className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-xs"
                >
                    +
                </button>
            </div>

            {/* ================= DAMAGED ================= */}
            <div className="col-span-1">
                <input
                    type="number"
                    min="0"
                    className={`
                        w-full text-xs text-center font-bold rounded border px-1 py-1
                        ${row.damagedQty > 0
                            ? "bg-red-50 border-red-300 text-red-700"
                            : "bg-white border-gray-300"
                        }
                    `}
                    value={row.damagedQty || 0}
                    onChange={(e) =>
                        update("damagedQty", parseInt(e.target.value || "0", 10))
                    }
                />
            </div>

            {/* ================= BATCH / INVOICE TRACEABILITY ================= */}
            <div className="col-span-2">
                <input
                    type="text"
                    placeholder="Batch / Invoice"
                    className="w-full text-xs font-mono border rounded px-2 py-1"
                    value={row.batch || ""}
                    onChange={(e) => update("batch", e.target.value)}
                />
            </div>

            {/* ================= EXPIRY ================= */}
            <div className="col-span-1">
                <input
                    type="date"
                    className="w-full text-xs border rounded px-1 py-1"
                    value={row.expiry || ""}
                    onChange={(e) => update("expiry", e.target.value)}
                />
            </div>

            {/* ================= STATUS + CONFIDENCE ================= */}
            <div className="col-span-1 flex justify-end flex-col items-end gap-1">

                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border rounded ${getStatusStyles(row.status)}`}>
                    {row.status || "pending"}
                </span>

                {/* scan confidence / source marker */}
                {row.source === "barcode" && (
                    <span className="text-[9px] text-blue-500 font-semibold">
                        scanned
                    </span>
                )}
            </div>

        </div>
    );
};

export default IntakeRow;