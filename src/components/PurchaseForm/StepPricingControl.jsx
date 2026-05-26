import React from "react";
import { DollarSign, AlertTriangle, PiggyBank, Landmark, Percent } from "lucide-react";

// STEP PRICING CONTROL - DETAILED COST INPUTS FOR PROCUREMENT PLANNING
export default function StepPricingControl({ form, setForm }) {
    const pricing = form.pricing || { currency: "USD" };

    // SAFE IMMUTABLE CORE CLOSURE DISPATCHER
    const updatePricingField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            pricing: {
                ...(prev.pricing || { currency: "USD" }),
                [field]: value
            }
        }));
    };

    // RUN TIME FINANCIAL AUDIT LOGIC
    const totalCost = parseFloat(pricing.totalCost) || 0;
    const budgetCeiling = parseFloat(pricing.budget) || 0;
    const isOverBudget = budgetCeiling > 0 && totalCost > budgetCeiling;

    return (
        <div className="space-y-6 animate-fadeIn">

            {/* GRID CONTROLLER MATRIX */}
            <div className="grid grid-cols-12 gap-5">

                {/* FIELD 1: SET TRANSACTION DENOMINATION SCOPE */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-2">
                    <label htmlFor="currency" className="text-sm font-bold tracking-tight text-slate-700">
                        Operating Denomination
                    </label>
                    <div className="relative">
                        <Landmark size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                            id="currency"
                            value={pricing.currency || "USD"}
                            onChange={(e) => updatePricingField("currency", e.target.value)}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-10 py-3 shadow-3xs appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        >
                            <option value="USD">USD ($) - United States Dollar</option>
                            <option value="GHS">GHS (₵) - Ghanaian Cedi</option>
                            <option value="EUR">EUR (€) - Eurozone Euro</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* FIELD 2: FISCAL CEILING TARGET */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-2">
                    <label htmlFor="budget-ceiling" className="text-sm font-bold tracking-tight text-slate-700">
                        Allocated Budget Ceiling
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-base pointer-events-none">
                            {pricing.currency || "USD"}
                        </div>
                        <input
                            id="budget-ceiling"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={pricing.budget || ""}
                            onChange={(e) => updatePricingField("budget", e.target.value)}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-16 pr-4 py-2.5 shadow-3xs focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[46px]"
                        />
                    </div>
                </div>

                {/* FIELD 3: NEGOTIATION MARGIN CAP */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-2">
                    <label htmlFor="negotiation-buffer" className="text-sm font-bold tracking-tight text-slate-700">
                        Negotiation Buffer
                    </label>
                    <div className="relative">
                        <Percent size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            id="negotiation-buffer"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="e.g., 5"
                            value={pricing.buffer || ""}
                            onChange={(e) => updatePricingField("buffer", e.target.value)}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-2.5 shadow-3xs focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[46px]"
                        />
                    </div>
                </div>

                {/* FIELD 4: ACTUAL CALCULATED EVALUATION VALUE */}
                <div className="col-span-12 flex flex-col gap-2 pt-2">
                    <label htmlFor="total-cost" className="text-sm font-bold tracking-tight text-slate-700">
                        Estimated Final Aggregated Cost
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-base pointer-events-none">
                            {pricing.currency || "USD"}
                        </div>
                        <input
                            id="total-cost"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={pricing.totalCost || ""}
                            onChange={(e) => updatePricingField("totalCost", e.target.value)}
                            className={`w-full text-base font-bold bg-white border rounded-xl pl-16 pr-4 py-3 shadow-3xs focus:outline-none transition-all min-h-[48px] ${isOverBudget
                                ? "border-rose-500 text-rose-900 focus:ring-4 focus:ring-rose-500/10"
                                : "border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                }`}
                        />
                    </div>
                </div>

            </div>

            {/* CRITICAL BUDGET CEILING VIOLATION WARNING BLOCK */}
            {isOverBudget && (
                <div className="p-4 bg-rose-50 border border-rose-200/60 rounded-xl flex items-start gap-3 text-rose-800 animate-slideDown">
                    <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                    <div className="text-sm">
                        <span className="font-bold uppercase tracking-wider block mb-0.5 text-xs text-rose-900">
                            Budget Overrun Advisory
                        </span>
                        The estimated cost parameters exceed your allocated threshold by <span className="font-bold">{(totalCost - budgetCeiling).toFixed(2)} {pricing.currency}</span>. This routing setup will require automated multi-level management overrides before approval.
                    </div>
                </div>
            )}
        </div>
    );
}