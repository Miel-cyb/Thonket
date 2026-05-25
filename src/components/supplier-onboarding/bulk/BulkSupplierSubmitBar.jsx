import React from "react";

export default function BulkSupplierSubmitBar({
    suppliers = [],
    onSubmitBatch,
    isSubmitting = false,
    isValidating = false
}) {
    const rowCount = suppliers.length;

    // Basic pre-flight filter to check for actionable data
    const hasValidEntries = rowCount > 0 && suppliers.some(s => s.businessName?.trim());
    const isDisabled = isSubmitting || isValidating || !hasValidEntries;

    return (
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 pt-5 bg-white">

            {/* Batch Metadata Context Status Labels */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
                        Batch Staging Registry
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {rowCount === 0
                            ? "No records loaded in current table workspace."
                            : `Compiled ${rowCount} supplier profile ${rowCount === 1 ? 'row' : 'rows'} ready for processing.`
                        }
                    </p>
                </div>
            </div>

            {/* Action Control Group */}
            <div className="flex items-center justify-end gap-3 w-full sm:w-auto">

                {/* Primary Operational Processing Push Button Trigger */}
                <button
                    type="button"
                    disabled={isDisabled}
                    onClick={onSubmitBatch}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm focus:outline-none focus:ring-4 cursor-pointer ${isDisabled
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                        : "bg-slate-900 text-white border border-transparent hover:bg-slate-800 focus:ring-slate-900/10"
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            {/* Spinning SVG Processing Loader Asset */}
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Provisioning Profiles...
                        </>
                    ) : isValidating ? (
                        "Running Validation Checks..."
                    ) : (
                        <>
                            Submit Batch Array
                            <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </>
                    )}
                </button>

            </div>
        </div>
    );
}