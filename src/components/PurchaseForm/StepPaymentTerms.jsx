'use client';

import React, { useState, useRef, useEffect } from "react";
import { CreditCard, CalendarClock, Percent, ShieldCheck, ChevronDown, Check } from "lucide-react";

// STEP PAYMENT TERMS - PAYMENT METHODS AND CONDITIONS FOR GHANA WHOLESALE DISTRIBUTION
export default function StepPaymentTerms({ form, setForm }) {
    const payment = form?.payment || {};

    // UI Dropdown Open States
    const [openMethod, setOpenMethod] = useState(false);
    const [openTerms, setOpenTerms] = useState(false);

    // Refs for outside click handling
    const methodRef = useRef(null);
    const termsRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (methodRef.current && !methodRef.current.contains(event.target)) setOpenMethod(false);
            if (termsRef.current && !termsRef.current.contains(event.target)) setOpenTerms(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // IMMUTABLE DISPATCH UPDATER TO PREVENT RACE CONDITIONS IN NESTED STATE OBJECTS
    const updatePaymentField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            payment: {
                ...(prev?.payment || {}),
                [field]: value
            }
        }));
    };

    // LOCALIZED TRANSACTION METHODS FOR WHOLESALE CHANNELS IN GHANA
    const paymentMethods = [
        { id: "bank_gip", label: "Bank Wire / GIP (Ghana Interbank Payment)" },
        { id: "momo_corporate", label: "Mobile Money (MoMo) - Corporate Wallet" },
        { id: "post_dated_cheque", label: "Post-Dated Cheque Clearing" },
        { id: "credit_line", label: "Distributor Line of Credit" }
    ];

    // LOCALIZED MATURITY OPTIONS
    const paymentTerms = [
        { id: "upfront", label: "100% Advance Remittance (Pre-delivery)" },
        { id: "deposit", label: "Deposit Percentage + Balance on Delivery" },
        { id: "net14", label: "Net 14 Days from Delivery" },
        { id: "net30", label: "Net 30 Days Credit Window" }
    ];

    const selectedMethodObj = paymentMethods.find(m => m.id === payment.method);
    const selectedTermsObj = paymentTerms.find(t => t.id === payment.terms);

    // DETERMINING CONDITION FOR DEPOSIT REQUIREMENT LAYOUT VISIBILITY
    const requiresDepositDisplay = payment.terms === "deposit" || payment.terms === "upfront";

    return (
        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto p-6 bg-white border border-slate-200/80 rounded-xl shadow-sm">

            {/* INPUT MATRIX ROW GRID STRUCTURE */}
            <div className="grid grid-cols-12 gap-5">

                {/* TRANSACTION METHOD SELECTOR */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2 relative" ref={methodRef}>
                    <label className="text-sm font-semibold tracking-tight text-slate-700">
                        Settlement Channel / Method
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => { setOpenMethod(!openMethod); setOpenTerms(false); }}
                            className="w-full text-left text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-12 py-3 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px] flex items-center justify-between"
                        >
                            <CreditCard
                                size={18}
                                className={`absolute left-4 transition-colors pointer-events-none z-10 ${openMethod ? 'text-indigo-500' : 'text-slate-400'}`}
                            />
                            <span className={selectedMethodObj ? "text-slate-900" : "text-slate-400"}>
                                {selectedMethodObj ? selectedMethodObj.label : "Select Transaction Channel"}
                            </span>
                            <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${openMethod ? "rotate-180 text-indigo-500" : ""}`} />
                        </button>

                        {/* STYLED DROPDOWN OPTIONS PANEL */}
                        {openMethod && (
                            <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200/90 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1 animate-fadeIn">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => {
                                            updatePaymentField("method", method.id);
                                            setOpenMethod(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                                    >
                                        <span className="group-hover:text-indigo-600 transition-colors">{method.label}</span>
                                        {payment.method === method.id && <Check size={16} className="text-indigo-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* MATURITY SCHEDULE SELECTOR */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2 relative" ref={termsRef}>
                    <label className="text-sm font-semibold tracking-tight text-slate-700">
                        Maturity Schedule (Terms)
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => { setOpenTerms(!openTerms); setOpenMethod(false); }}
                            className="w-full text-left text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-12 py-3 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px] flex items-center justify-between"
                        >
                            <CalendarClock
                                size={18}
                                className={`absolute left-4 transition-colors pointer-events-none z-10 ${openTerms ? 'text-indigo-500' : 'text-slate-400'}`}
                            />
                            <span className={selectedTermsObj ? "text-slate-900" : "text-slate-400"}>
                                {selectedTermsObj ? selectedTermsObj.label : "Select Maturity Window"}
                            </span>
                            <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${openTerms ? "rotate-180 text-indigo-500" : ""}`} />
                        </button>

                        {/* STYLED DROPDOWN OPTIONS PANEL */}
                        {openTerms && (
                            <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200/90 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1 animate-fadeIn">
                                {paymentTerms.map((term) => (
                                    <button
                                        key={term.id}
                                        type="button"
                                        onClick={() => {
                                            updatePaymentField("terms", term.id);
                                            setOpenTerms(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                                    >
                                        <span className="group-hover:text-indigo-600 transition-colors">{term.label}</span>
                                        {payment.terms === term.id && <Check size={16} className="text-indigo-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* CONDITIONAL FIELD BLOCK: DEPOSIT ACCRUAL */}
                {requiresDepositDisplay && (
                    <div className="col-span-12 flex flex-col gap-3 group animate-slideDown p-4 bg-slate-50/50 border border-slate-100 rounded-xl mt-1">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="payment-advance" className="text-sm font-semibold tracking-tight text-slate-700">
                                Required Advance Deposit Proportion (%)
                            </label>
                            <div className="relative flex items-center">
                                <Percent
                                    size={16}
                                    className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10"
                                />
                                <input
                                    id="payment-advance"
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="e.g., 30"
                                    value={payment.advance || ""}
                                    onChange={(e) => updatePaymentField("advance", e.target.value)}
                                    className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px]"
                                />
                            </div>
                        </div>

                        {/* SYSTEM REGULATORY BANNER NOTE */}
                        <div className="text-xs text-amber-800 bg-amber-50/60 border border-amber-200/70 rounded-xl p-3.5 flex items-start gap-2.5 leading-relaxed">
                            <ShieldCheck size={16} className="shrink-0 text-amber-600 mt-0.5" />
                            <span>
                                Setting an advance milestone locks down commercial clearing routing. The specified value must clear distribution allocation balance checks before distribution release from warehouses.
                            </span>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}