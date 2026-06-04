import React from "react";
import {
    FileText, User, ShoppingBag, Truck,
    AlertTriangle, CheckCircle2, ShieldAlert, Clock, Zap
} from "lucide-react";

export default function StepReviewSubmit({ form }) {
    // STRUCTURAL EXTRACTORS WITH ROBUST COMPLIANCE FALLBACKS
    const context = form?.context || {};
    const intent = form?.intent || {};
    const supplier = form?.supplier || null;
    const items = form?.items || [];
    const logistics = form?.logistics || {};
    const payment = form?.payment || {};
    const pricing = form?.pricing || {};
    const manufacturer = form?.manufacturer || null;

    const currentCurrency = pricing.currency || "USD";

    // INDEPENDENT LINE ITEM AGGREGATION AUDITING
    const totalCalculatedCost = items.reduce((sum, item) => {
        const q = parseFloat(item.qty) || 0;
        const p = parseFloat(item.price) || 0;
        return sum + (q * p);
    }, 0);

    const budgetCeiling = parseFloat(pricing.budget) || 0;
    const isOverBudget = budgetCeiling > 0 && totalCalculatedCost > budgetCeiling;

    // MATCHING URGENCY BADGE RESOLVER
    const getPriorityBadge = (tier) => {
        if (tier === "critical") return { label: "Critical", style: "bg-rose-50 border-rose-200 text-rose-700", icon: ShieldAlert };
        if (tier === "urgent") return { label: "Urgent", style: "bg-amber-50 border-amber-200 text-amber-700", icon: Zap };
        return { label: "Routine", style: "bg-slate-50 border-slate-200 text-slate-700", icon: Clock };
    };

    const priority = getPriorityBadge(intent.priority);
    const PriorityIcon = priority.icon;

    return (
        <div className="space-y-6 animate-fadeIn max-w-[1660px] mx-auto p-1">

            {/* AUDIT SUMMARY STATUS BANNER */}
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 leading-relaxed ${isOverBudget
                ? "bg-rose-50/70 border-rose-200 text-rose-900"
                : "bg-indigo-50/40 border-indigo-100 text-indigo-950"
                }`}>
                {isOverBudget ? (
                    <AlertTriangle size={20} className="text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                ) : (
                    <CheckCircle2 size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                )}
                <div>
                    <span className="text-base font-semibold block">
                        {isOverBudget ? "Requires Multi-Level Authorization" : "Payload Integrity Verified"}
                    </span>
                    <p className="text-xs text-slate-500 font-normal mt-1">
                        {isOverBudget
                            ? "This purchase requisition has breached designated fiscal boundaries and will trigger secondary internal verification loops."
                            : "All mandatory procurement matrix components are correctly compiled. Review the audit ledger before final confirmation dispatch."
                        }
                    </p>
                </div>
            </div>

            {/* TWO-COLUMN MATRIX SUMMARY GRID */}
            <div className="grid grid-cols-12 gap-5">

                {/* COLUMN LEFT: REQUISITION METADATA CARDS */}
                <div className="col-span-12 md:col-span-6 space-y-5">

                    {/* CARD 1: CORE WORKFLOW CONTEXT & INTENT */}
                    <div className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm space-y-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <FileText size={14} className="text-slate-400" /> Profile Context
                        </span>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Purchase Order Title</p>
                            <p className="text-base font-semibold text-slate-900 mt-0.5">{context.title || "Untitled Requisition"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-1">
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Strategy Type</p>
                                <span className="inline-block text-xs font-semibold text-slate-700 bg-slate-100/80 border border-slate-200/50 px-2.5 py-1 rounded-lg mt-1.5">
                                    {context.type || "Not Specified"}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Urgency Tier</p>
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg mt-1.5 border ${priority.style}`}>
                                    <PriorityIcon size={12} />
                                    {priority.label}
                                </span>
                            </div>
                        </div>
                        {intent.description && (
                            <div className="pt-3.5 border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Business Justification</p>
                                <p className="text-sm text-slate-600 font-normal italic leading-relaxed">"{intent.description}"</p>
                            </div>
                        )}
                    </div>

                    {/* CARD 2: ASSIGNED SUPPLIER PARTNER */}
                    <div className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm space-y-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <User size={14} className="text-slate-400" /> Vendor Entity
                        </span>
                        {supplier ? (
                            <div className="flex justify-between items-center gap-4">
                                <div>
                                    <p className="text-base font-semibold text-slate-900">{supplier.name}</p>
                                    <p className="text-xs text-slate-500 mt-1">{supplier.location} • Reliability Index: <span className="font-medium text-slate-700">{supplier.reliability}</span></p>
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider bg-slate-900 text-white px-3 py-1.5 rounded-xl shrink-0">
                                    Approved
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-rose-600 font-medium flex items-center gap-1.5">
                                ⚠️ Critical Warning: No vendor assigned to this execution cycle.
                            </p>
                        )}

                        {manufacturer?.name && (
                            <div className="pt-3.5 border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Original Equipment Manufacturer (OEM)</p>
                                <p className="text-sm font-medium text-slate-700 mt-1">{manufacturer.name}</p>
                            </div>
                        )}
                    </div>

                    {/* CARD 3: LOGISTICS & TRANSACTION ESCROW */}
                    <div className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm space-y-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <Truck size={14} className="text-slate-400" /> Logistics & Fulfillment
                        </span>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Routing Framework</p>
                                <p className="text-sm font-semibold text-slate-800 capitalize mt-1">{logistics.deliveryType || "Unassigned"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Target Target Date</p>
                                <p className="text-sm font-semibold text-slate-800 mt-1">{logistics.date || "Immediate Release"}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Discharge Destination</p>
                            <p className="text-sm text-slate-600 line-clamp-2 mt-1 leading-relaxed">{logistics.location || "No Address Saved"}</p>
                        </div>
                    </div>

                </div>

                {/* COLUMN RIGHT: ITEM LIST & INDEPENDENT ACCRUAL RUNTIME AUDIT */}
                <div className="col-span-12 md:col-span-6 flex flex-col">

                    {/* EXPANDED LINE ITEM SPECIFICATION SUMMARY DISPLAY */}
                    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                <ShoppingBag size={14} className="text-slate-400" /> Itemization Matrix ({items.length})
                            </span>
                            <span className="text-xs font-medium text-slate-400 tracking-wide">
                                Pre-tax Valuations
                            </span>
                        </div>

                        {/* LINE SUB-STREAM SCROLL TRACK */}
                        <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto px-5 bg-white flex-1">
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start py-4 gap-4">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm tracking-tight text-slate-900 truncate">{item.desc}</p>
                                            <p className="text-xs font-mono text-slate-400 mt-1">
                                                {item.sku} • {item.qty} units @ {currentCurrency} {parseFloat(item.price).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right font-mono font-bold text-sm text-slate-900 shrink-0 pt-0.5">
                                            {currentCurrency} {(item.qty * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 italic text-center py-12">No inventory item assets found inside this payload data configuration.</p>
                            )}
                        </div>

                        {/* MASTER BALANCE COMPLIANCE RECONCILIATION SUMMARY */}
                        <div className="bg-slate-900 text-white p-5 space-y-4">
                            <div className="flex justify-between items-center text-xs opacity-75 font-medium uppercase tracking-wider">
                                <span>Terms: {payment.terms || "Not Specified"} ({payment.method || "N/A"})</span>
                                <span>Valuation Denomination ({currentCurrency})</span>
                            </div>

                            <div className="flex justify-between items-baseline pt-1">
                                <span className="text-sm font-semibold opacity-85 uppercase tracking-wider">Aggregated Balance Due</span>
                                <span className="text-2xl font-mono font-bold text-white tracking-tight">
                                    {currentCurrency} {totalCalculatedCost.toFixed(2)}
                                </span>
                            </div>

                            <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-4 text-xs opacity-80">
                                <div className="leading-relaxed">
                                    <span className="block opacity-60 uppercase tracking-wider text-[10px] mb-0.5">Ceiling Budget Threshold</span>
                                    <span className="font-mono font-semibold text-white">{currentCurrency} {budgetCeiling.toFixed(2)}</span>
                                </div>
                                {payment.advance && (
                                    <div className="text-right leading-relaxed">
                                        <span className="block opacity-60 uppercase tracking-wider text-[10px] mb-0.5">Upfront Deposit ({payment.advance}%)</span>
                                        <span className="font-mono font-bold text-emerald-400">
                                            {currentCurrency} {((totalCalculatedCost * parseFloat(payment.advance)) / 100).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}