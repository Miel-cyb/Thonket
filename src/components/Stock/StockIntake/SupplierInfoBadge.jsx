import React from "react";

/**
 * SupplierInfoBadge
 * High-visibility metadata indicator styled for commercial inventory ledger headers.
 * Dynamically shifts context theme colors when state returns empty variables.
 */
const SupplierInfoBadge = ({ supplier }) => {
    // Determine configuration values based on incoming supplier validation state
    const hasSupplier = Boolean(supplier && supplier.trim() !== "");

    return (
        <div className="flex items-center gap-2 select-none text-sm">
            {/* Context Label Descriptor Element */}
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Supplier:
            </span>

            {/* Dynamic Status Display Badge Layout Frame */}
            <span
                className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold border transition-colors duration-150 ${hasSupplier
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                    }`}
            >
                {/* Visual state leading icon wrapper */}
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0 ${hasSupplier ? "bg-blue-500" : "bg-amber-500"
                    }`} />

                {hasSupplier ? supplier : "Not Selected"}
            </span>
        </div>
    );
};

export default SupplierInfoBadge;