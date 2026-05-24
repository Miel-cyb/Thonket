import React from "react";

/**
 * IntakeTableHeader (Warehouse Execution Grid Header)
 * ---------------------------------------------------
 * Aligned with:
 * - scan-first intake flow
 * - FMCG / wholesale receiving operations
 * - batch + invoice traceability systems
 */
const IntakeTableHeader = () => {
    return (
        <div className="
            grid grid-cols-12 gap-2 px-3 py-2
            bg-gray-50 border-b border-gray-200
            select-none
        ">

            {/* ================= SKU ================= */}
            <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                SKU / Scan ID
            </div>

            {/* ================= PRODUCT ================= */}
            <div className="col-span-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Product
            </div>

            {/* ================= UOM ================= */}
            <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                UOM
            </div>

            {/* ================= QTY CONTROLS ================= */}
            <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                Quantity
            </div>

            {/* ================= DAMAGED ================= */}
            <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                Damaged
            </div>

            {/* ================= BATCH / INVOICE ================= */}
            <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Batch / Invoice
            </div>

            {/* ================= EXPIRY ================= */}
            <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                Expiry
            </div>

            {/* ================= STATUS ================= */}
            <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                Status
            </div>

        </div>
    );
};

export default IntakeTableHeader;