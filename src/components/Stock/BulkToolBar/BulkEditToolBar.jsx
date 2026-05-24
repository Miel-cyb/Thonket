import React from "react";

import ApplyQtyButton from "./ApplyQtyButton";
import RemoveRowButton from "./RemoveRowButton";
import DuplicateScanToggle from "./DuplicateScanToggle";

/**
 * BulkEditToolbar
 * Batch modification utility panel positioned over tabular data records.
 * Provides micro-shadowing, soft borders, and clear functional spacing zones.
 */
const BulkEditToolbar = ({
    onApplyQty,
    onRemoveRow,
    duplicateMergeEnabled,
    onToggleDuplicateMerge,
}) => {
    return (
        <div className="flex items-center justify-between w-full px-4 py-2 bg-slate-50 border-b border-gray-200 select-none">

            {/* ==========================================
               LEFT ACTIONS - MULTI-RECORD MODIFICATIONS
               ========================================== */}
            <div className="flex items-center gap-2">
                {/* Visual indicator tag for context identification */}
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1.5">
                    Bulk Actions
                </span>

                {/* Bulk value adjustment execution button block */}
                <div className="focus-within:ring-2 focus-within:ring-indigo-500/20 rounded">
                    <ApplyQtyButton onApply={onApplyQty} />
                </div>

                {/* Batch deletion / purge array modifier handler button */}
                <div className="focus-within:ring-2 focus-within:ring-red-500/20 rounded">
                    <RemoveRowButton onRemove={onRemoveRow} />
                </div>
            </div>

            {/* ==========================================
               RIGHT TOGGLE - SCANNING EMULATION BEHAVIOR
               ========================================== */}
            <div className="flex items-center">
                {/* Hardware behavior switch layout frame */}
                <DuplicateScanToggle
                    enabled={duplicateMergeEnabled}
                    onToggle={onToggleDuplicateMerge}
                />
            </div>

        </div>
    );
};

export default BulkEditToolbar;