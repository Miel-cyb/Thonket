import React, { useMemo } from "react";

export default function BulkSupplierValidationPanel({ suppliers = [] }) {

    // Real-time batch structural diagnostic validation memo
    const validationDiagnostics = useMemo(() => {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        suppliers.forEach((supplier, idx) => {
            const rowNum = idx + 1;
            const issues = [];

            // Extract nested schemas with safe fallbacks matching the core data model
            const businessIdentity = supplier.businessIdentity || {};
            const contactInformation = supplier.contactInformation || {};

            const businessName = businessIdentity.businessName || supplier.businessName;
            const email = contactInformation.email || supplier.email;
            const phoneNumber = contactInformation.phoneNumber || supplier.phone;

            // 1. Business Name Validation
            if (!businessName?.trim()) {
                issues.push("Missing company designation name");
            }

            // 2. Corporate Communication Email Validation
            if (email) {
                if (!emailRegex.test(email)) {
                    issues.push("Invalid email endpoint syntax structure");
                }
            } else {
                issues.push("Primary contact communication email is required");
            }

            // 3. Direct Contact Line Telecom Validation
            if (phoneNumber && phoneNumber.trim().length < 7) {
                issues.push("Telecom entry string appears incomplete");
            }

            if (issues.length > 0) {
                errors.push({
                    rowIndex: idx,
                    rowLabel: `Line Row #${rowNum}`,
                    issues
                });
            }
        });

        return {
            errors,
            isValid: errors.length === 0,
            totalIssuesCount: errors.reduce((acc, curr) => acc + curr.issues.length, 0)
        };
    }, [suppliers]);

    const { errors, isValid, totalIssuesCount } = validationDiagnostics;

    // Fallback state context rendering modifier: No staging data rows present
    if (suppliers.length === 0) return null;

    return (
        <div className="mt-6 border rounded-xl overflow-hidden transition-all duration-200">

            {/* Dynamic Diagnostic Summary Top Header Ribbon Strip */}
            <div className={`px-4 py-3 flex items-center justify-between border-b ${isValid
                ? "bg-emerald-50/70 border-emerald-100 text-emerald-900"
                : "bg-amber-50/70 border-amber-100 text-amber-900"
                }`}>
                <div className="flex items-center gap-2.5 text-xs font-bold tracking-wide uppercase">
                    {isValid ? (
                        <>
                            <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Matrix Pre-Flight Diagnostics Clear
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 text-amber-600 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Staging Entry Formatting Discrepancies
                        </>
                    )}
                </div>

                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${isValid ? "bg-emerald-200/50 text-emerald-900" : "bg-amber-200/60 text-amber-950"
                    }`}>
                    {isValid ? "Ready to Ingest" : `${totalIssuesCount} Actions Pending`}
                </span>
            </div>

            {/* Dynamic Conditional Diagnostic Details Output Panel Staging Node */}
            <div className="bg-slate-50/40 p-4 max-h-[180px] overflow-y-auto">
                {isValid ? (
                    <p className="text-xs text-slate-500 italic">
                        All loaded rows conform to systemic ingestion validation parameters. Ready for processing.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {errors.map((errorGroup) => (
                            <div key={errorGroup.rowIndex} className="flex flex-col gap-1 text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                                <span className="font-bold font-mono text-slate-700 block">
                                    {errorGroup.rowLabel}
                                </span>
                                <ul className="space-y-1 pl-4 list-disc text-slate-500">
                                    {errorGroup.issues.map((issue, idx) => (
                                        <li key={idx} className="text-slate-600">
                                            {issue}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}