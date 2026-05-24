import React from "react";

import WarehouseSelector from "./WarehouseSelector";
import SupplierInfoBadge from "./SupplierInfoBadge";
import IntakeStatusChip from "./IntakeStatusChip";
import QuickActions from "./QuickActions";

/**
 * IntakeTopBar
 * Styled to perfectly align with your clean enterprise layout system.
 * Serves as the interactive contextual header for stock intake workflows.
 */
const IntakeTopBar = ({
    warehouse,
    onWarehouseChange,
    supplier,
    status,
    onSave,
    onPost,
    onExit,
}) => {
    return (
        <div className="bg-white p-4 rounded shadow border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full mb-6 select-none">

            {/* ==========================================
               LEFT SECTION: CONTEXT MANAGEMENT & INPUTS
               ========================================== */}
            <div className="flex flex-wrap items-center gap-4 flex-1">
                {/* Warehouse Dropdown Frame */}
                <div className="bg-gray-50 px-2 py-1.5 rounded border border-gray-200/60 focus-within:border-blue-500 transition-colors">
                    <WarehouseSelector
                        selectedWarehouse={warehouse}
                        onChange={onWarehouseChange}
                    />
                </div>

                {/* Subtle vertical separator matching your dashboard style */}
                <span className="hidden sm:inline-block h-6 w-px bg-gray-200" aria-hidden="true" />

                {/* Supplier Identity Badge */}
                <div className="flex items-center">
                    <SupplierInfoBadge supplier={supplier} />
                </div>
            </div>

            {/* ==========================================
               CENTER SECTION: TRANSACTION MONITORING
               ========================================== */}
            <div className="flex items-center justify-center flex-none w-full md:w-auto py-1 md:py-0">
                <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-200/80 shadow-inner">
                    <IntakeStatusChip status={status} />
                </div>
            </div>

            {/* ==========================================
               RIGHT SECTION: WORKFLOW ACTIONS
               ========================================== */}
            <div className="flex items-center justify-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                <QuickActions
                    onSave={onSave}
                    onPost={onPost}
                    onExit={onExit}
                />
            </div>

        </div>
    );
};

export default IntakeTopBar;