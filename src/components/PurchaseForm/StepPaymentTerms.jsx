'use client';

import React, { useState, useRef, useEffect } from "react";
import {
    Banknote,
    CreditCard,
    Calendar,
    Percent,
    FileText,
    AlertCircle,
    ChevronDown,
    Check,
    Clock
} from "lucide-react";

// STEP PAYMENT TERMS - FOR FMCG PROCUREMENT FROM MANUFACTURERS
export default function StepPaymentTerms({ form, setForm }) {
    const payment = form?.payment || {
        type: "cash",
        method: "",
        terms: "upfront",
        customDays: "",
        advance: "",
        dueDate: "",
        referenceNumber: "",
        accountingNotes: ""
    };

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

    // Clean, predictable field updater
    const updatePaymentField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            payment: {
                ...(prev?.payment || {}),
                [field]: value
            }
        }));
    };

    // Helper to calculate a future date string (YYYY-MM-DD) based on number of days from today
    const calculateDueDateFromDays = (days) => {
        const today = new Date();
        today.setDate(today.getDate() + parseInt(days, 10));
        return today.toISOString().split('T')[0];
    };

    // Toggling core payment profiles
    const handleTypeChange = (type) => {
        setForm((prev) => ({
            ...prev,
            payment: {
                ...(prev?.payment || {}),
                type: type,
                terms: type === "cash" ? "upfront" : "net30",
                customDays: "",
                advance: "",
                dueDate: type === "credit" ? calculateDueDateFromDays(30) : ""
            }
        }));
    };

    // Handling selection change inside credit term profiles
    const handleTermsChange = (termId) => {
        let nextDueDate = payment.dueDate;
        let nextCustomDays = payment.customDays;

        if (termId === "net14") {
            nextDueDate = calculateDueDateFromDays(14);
            nextCustomDays = "";
        } else if (termId === "net30") {
            nextDueDate = calculateDueDateFromDays(30);
            nextCustomDays = "";
        } else if (termId === "net60") {
            nextDueDate = calculateDueDateFromDays(60);
            nextCustomDays = "";
        } else if (termId === "custom") {
            // Keep existing fields or reset to blank for unique manual entry
            nextDueDate = "";
            nextCustomDays = "";
        } else {
            // Consignment or other structural terms
            nextDueDate = "";
            nextCustomDays = "";
        }

        setForm((prev) => ({
            ...prev,
            payment: {
                ...(prev?.payment || {}),
                terms: termId,
                dueDate: nextDueDate,
                customDays: nextCustomDays
            }
        }));
    };

    // Custom window manual input changes (Updates days and synchronizes the date picker seamlessly)
    const handleCustomDaysChange = (daysValue) => {
        const cleanedDays = daysValue.replace(/[^0-max]/g, ""); // numeric baseline digits
        const calculatedDate = cleanedDays ? calculateDueDateFromDays(cleanedDays) : "";

        setForm((prev) => ({
            ...prev,
            payment: {
                ...(prev?.payment || {}),
                customDays: cleanedDays,
                dueDate: calculatedDate
            }
        }));
    };

    // Clear, user-friendly payment channels
    const paymentMethods = [
        { id: "bank_transfer", label: "Bank Wire / Instant Transfer" },
        { id: "momo_corporate", label: "Mobile Money (MoMo) Corporate Wallet" },
        { id: "cheque", label: "Corporate Cheque" },
        { id: "cash_deposit", label: "Direct Cash Deposit" }
    ];

    // Clear, practical credit timelines
    const paymentTerms = [
        { id: "net14", label: "Net 14 Days" },
        { id: "net30", label: "Net 30 Days (Standard)" },
        { id: "net60", label: "Net 60 Days (Extended)" },
        { id: "consignment", label: "Consignment (Pay-On-Scan)" },
        { id: "custom", label: "Custom Payment Window..." }
    ];

    const selectedMethodObj = paymentMethods.find(m => m.id === payment.method);
    const selectedTermsObj = paymentTerms.find(t => t.id === payment.terms);

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-300">

            {/* CORE PAYMENT TYPE SELECTOR */}
            <div className="flex flex-col gap-2.5">
                <label className="text-sm font-semibold tracking-tight text-slate-700">
                    Payment Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => handleTypeChange("cash")}
                        className={`p-4 rounded-xl border flex flex-col items-start gap-2 transition-all text-left ${payment.type === "cash"
                            ? "border-indigo-600 bg-indigo-50/40 text-indigo-900 ring-2 ring-indigo-500/20"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        <div className="flex items-center gap-2 font-semibold text-base">
                            <Banknote size={18} className={payment.type === "cash" ? "text-indigo-600" : "text-slate-400"} />
                            Pay Immediately
                        </div>
                        <p className="text-xs text-slate-500 leading-normal">
                            Settle the balance right away using cash, instant bank transfer, or mobile money.
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTypeChange("credit")}
                        className={`p-4 rounded-xl border flex flex-col items-start gap-2 transition-all text-left ${payment.type === "credit"
                            ? "border-indigo-600 bg-indigo-50/40 text-indigo-900 ring-2 ring-indigo-500/20"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        <div className="flex items-center gap-2 font-semibold text-base">
                            <CreditCard size={18} className={payment.type === "credit" ? "text-indigo-600" : "text-slate-400"} />
                            Pay on Credit
                        </div>
                        <p className="text-xs text-slate-500 leading-normal">
                            Defer payment. Choose this if the manufacturer gives you a time window to pay.
                        </p>
                    </button>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* FIELD SEGMENT GRID */}
            <div className="grid grid-cols-12 gap-5">

                {/* TRANSACTION CHANNEL */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2 relative" ref={methodRef}>
                    <label className="text-sm font-semibold tracking-tight text-slate-700">
                        Payment Method <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => { setOpenMethod(!openMethod); setOpenTerms(false); }}
                            className="w-full text-left text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-12 py-3 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px] flex items-center justify-between"
                        >
                            <Banknote
                                size={18}
                                className={`absolute left-4 transition-colors pointer-events-none z-10 ${openMethod ? 'text-indigo-500' : 'text-slate-400'}`}
                            />
                            <span className={selectedMethodObj ? "text-slate-900" : "text-slate-400"}>
                                {selectedMethodObj ? selectedMethodObj.label : "Select how payment is sent"}
                            </span>
                            <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${openMethod ? "rotate-180 text-indigo-500" : ""}`} />
                        </button>

                        {openMethod && (
                            <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
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

                {/* REFERENCE / TRANSACTION CODES */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                    <label htmlFor="referenceNumber" className="text-sm font-semibold tracking-tight text-slate-700">
                        Reference Number / Cheque Number
                    </label>
                    <div className="relative flex items-center">
                        <FileText size={18} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
                        <input
                            id="referenceNumber"
                            type="text"
                            placeholder="e.g., TXN-98234-GH or Cheque #0024"
                            value={payment.referenceNumber || ""}
                            onChange={(e) => updatePaymentField("referenceNumber", e.target.value)}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px]"
                        />
                    </div>
                </div>

                {/* CREDIT OPTIONS PANEL */}
                {payment.type === "credit" && (
                    <div className="col-span-12 grid grid-cols-12 gap-5 p-4 bg-slate-50/60 border border-slate-200/80 rounded-xl mt-1 transition-all duration-300">

                        {/* CREDIT TERMS SELECTION */}
                        <div className="col-span-12 md:col-span-6 flex flex-col gap-2 relative" ref={termsRef}>
                            <label className="text-sm font-semibold tracking-tight text-slate-700">
                                Payment Terms Profile
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => { setOpenTerms(!openTerms); setOpenMethod(false); }}
                                    className="w-full text-left text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-12 py-3 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px] flex items-center justify-between"
                                >
                                    <Clock
                                        size={18}
                                        className={`absolute left-4 transition-colors pointer-events-none z-10 ${openTerms ? 'text-indigo-500' : 'text-slate-400'}`}
                                    />
                                    <span className={selectedTermsObj ? "text-slate-900" : "text-slate-400"}>
                                        {selectedTermsObj ? selectedTermsObj.label : "Select credit structural timeline"}
                                    </span>
                                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${openTerms ? "rotate-180 text-indigo-500" : ""}`} />
                                </button>

                                {openTerms && (
                                    <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
                                        {paymentTerms.map((term) => (
                                            <button
                                                key={term.id}
                                                type="button"
                                                onClick={() => {
                                                    handleTermsChange(term.id);
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

                        {/* CONDITIONAL COMPONENT: DYNAMIC CREDIT DURATION WINDOW */}
                        {payment.terms === "custom" ? (
                            <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label htmlFor="customDays" className="text-sm font-semibold tracking-tight text-slate-700">
                                    Custom Window Duration (Days) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <Clock size={18} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
                                    <input
                                        id="customDays"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="e.g., 45 days"
                                        value={payment.customDays || ""}
                                        onChange={(e) => handleCustomDaysChange(e.target.value)}
                                        className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px]"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="col-span-12 md:col-span-6 flex flex-col justify-end pb-3 text-xs text-slate-500 italic">
                                * System is utilizing standard preset terms. Select &quot;Custom Payment Window&quot; to define a unique dynamic matrix window.
                            </div>
                        )}

                        {/* DUE DATE SELECTOR */}
                        <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label htmlFor="dueDate" className="text-sm font-semibold tracking-tight text-slate-700">
                                Final Due Date {payment.terms === "custom" && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative flex items-center">
                                <Calendar size={18} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
                                <input
                                    id="dueDate"
                                    type="date"
                                    value={payment.dueDate || ""}
                                    readOnly={payment.terms !== "custom"}
                                    onChange={(e) => updatePaymentField("dueDate", e.target.value)}
                                    className={`w-full text-base border text-slate-900 rounded-xl pl-11 pr-4 py-3 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px] ${payment.terms === "custom"
                                        ? "bg-white border-slate-200 focus:border-indigo-500"
                                        : "bg-slate-100/80 border-slate-200 text-slate-500 cursor-not-allowed select-none"
                                        }`}
                                />
                            </div>
                        </div>

                        {/* CUSTOM DEPOSIT ASSIGNMENT */}
                        <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label htmlFor="payment-advance" className="text-sm font-semibold tracking-tight text-slate-700">
                                Upfront Custom Deposit Required (%)
                            </label>
                            <div className="relative flex items-center">
                                <Percent size={16} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
                                <input
                                    id="payment-advance"
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="Enter 0 if no upfront deposit is required"
                                    value={payment.advance || ""}
                                    onChange={(e) => updatePaymentField("advance", e.target.value)}
                                    className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px]"
                                />
                            </div>
                        </div>

                        {/* NOTICE CARD */}
                        <div className="col-span-12 text-xs text-slate-600 bg-slate-100 border border-slate-200 rounded-xl p-3.5 flex items-start gap-2.5 leading-relaxed">
                            <AlertCircle size={16} className="shrink-0 text-slate-500 mt-0.5" />
                            <span>
                                <strong>Procurement System Logs:</strong> Choosing credit logs an outstanding accounts payable balance for this manufacturer. If you specify an upfront custom deposit percentage, that structural amount will immediately route to cash journals.
                            </span>
                        </div>
                    </div>
                )}

                {/* INTERNAL NOTES / REMARKS */}
                <div className="col-span-12 flex flex-col gap-2">
                    <label htmlFor="accountingNotes" className="text-sm font-semibold tracking-tight text-slate-700">
                        Internal Notes / Remarks
                    </label>
                    <textarea
                        id="accountingNotes"
                        rows={2}
                        placeholder="e.g., Special promotional batch or clearance discount applied by the manufacturer."
                        value={payment.accountingNotes || ""}
                        onChange={(e) => updatePaymentField("accountingNotes", e.target.value)}
                        className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                    />
                </div>

            </div>
        </div>
    );
}