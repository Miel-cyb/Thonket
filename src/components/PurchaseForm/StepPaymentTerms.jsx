import React from "react";
import { CreditCard, CalendarClock, Percent, ShieldCheck } from "lucide-react";

// STEP PAYMENT TERMS - PAYMENT METHODS AND CONDITIONS FOR PURCHASE ORDERS
export default function StepPaymentTerms({ form, setForm }) {
    const payment = form.payment || {};

    // IMMUTABLE DISPATCH UPDATER TO PREVENT RACE CONDITIONS IN NESTED STATE OBJECTS
    const updatePaymentField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            payment: {
                ...(prev.payment || {}),
                [field]: value
            }
        }));
    };

    // DETERMINING CONDITION FOR DEPOSIT REQUIREMENT LAYOUT VISIBILITY
    const requiresDepositDisplay = payment.terms === "deposit" || payment.terms === "upfront";

    return (
        <div className="space-y-5 animate-fadeIn">

            {/* INPUT MATRIX ROW GRID STRUCTURE */}
            <div className="grid grid-cols-12 gap-4">

                {/* TRANSACTION METHOD: BANK TRANSFER, CREDIT, OR ESCROW */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                    <label htmlFor="payment-method" className="text-sm font-bold tracking-tight text-slate-700">
                        Settlement Channel / Method
                    </label>
                    <div className="relative">
                        <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                            id="payment-method"
                            value={payment.method || ""}
                            onChange={(e) => updatePaymentField("method", e.target.value)}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-10 py-3 shadow-3xs appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        >
                            <option value="" disabled hidden>Select Transaction Channel</option>
                            <option value="bank">Bank Wire Transfer (SWIFT/ACH)</option>
                            <option value="credit">Corporate Line of Credit</option>
                            <option value="escrow">Secured Escrow Account</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* MATURITY TERMS: UPFRONT, NET 30, NET 60 */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                    <label htmlFor="payment-terms" className="text-sm font-bold tracking-tight text-slate-700">
                        Maturity Schedule (Terms)
                    </label>
                    <div className="relative">
                        <CalendarClock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                            id="payment-terms"
                            value={payment.terms || ""}
                            onChange={(e) => updatePaymentField("terms", e.target.value)}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-10 py-3 shadow-3xs appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        >
                            <option value="" disabled hidden>Select Maturity Window</option>
                            <option value="upfront">100% Advance Remittance</option>
                            <option value="deposit">Deposit Percentage + Escrow Balance</option>
                            <option value="net30">Net 30 Days From Invoice Date</option>
                            <option value="net60">Net 60 Days From Invoice Date</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* CONDITIONAL FIELD BLOCK: RENDERED ONLY ON DEPOSIT ACCRUAL REQUIRED MATURITY SCHEMES */}
                {requiresDepositDisplay && (
                    <div className="col-span-12 flex flex-col gap-2 animate-slideDown">
                        <label htmlFor="payment-advance" className="text-sm font-bold tracking-tight text-slate-700">
                            Required Advance Deposit Proportion (%)
                        </label>
                        <div className="relative">
                            <Percent size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                id="payment-advance"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="e.g., 30"
                                value={payment.advance || ""}
                                onChange={(e) => updatePaymentField("advance", e.target.value)}
                                className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-2.5 shadow-3xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[46px]"
                            />
                        </div>
                        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200/60 rounded-lg p-3 font-normal mt-1 flex items-start gap-2">
                            <ShieldCheck size={16} className="shrink-0 text-amber-500 mt-0.5" />
                            <span>
                                Setting an advance milestone locks down financial processing requirements. The designated percentage must settle clear clearance sweeps prior to factory release scheduling.
                            </span>
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}