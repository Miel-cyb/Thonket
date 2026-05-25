import React from "react";

export default function BulkSupplierActions({ addRow, onImportCSV, onDownloadTemplate }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200">

            {/* Structural Context Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Bulk Supplier Registry Entry
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                    Populate data matrices directly or ingest bulk spreadsheet files into the verification staging pipeline.
                </p>
            </div>

            {/* Control Actions Matrix Cluster */}
            <div className="flex flex-wrap items-center gap-3">

                {/* Utility Button: Download Excel/CSV layout template frame */}
                <button
                    type="button"
                    onClick={onDownloadTemplate}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer"
                >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Get Sheet Template
                </button>

                {/* Utility Button: Import data structure file */}
                <button
                    type="button"
                    onClick={onImportCSV}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer"
                >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    Upload CSV / XLSX
                </button>

                {/* Primary Action Button: Push new grid array workspace element line row */}
                <button
                    type="button"
                    onClick={addRow}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-transparent rounded-xl text-xs font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/10 transition-all cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Row
                </button>

            </div>
        </div>
    );
}