import React from "react";
import {
    FileText, User, ShoppingBag, Truck, CreditCard,
    DollarSign, AlertTriangle, CheckCircle2, ShieldAlert, Clock, Zap
} from "lucide-react";

export default function StepReviewSubmit({ form }) {
    // STRUCTURAL EXTRACTORS WITH ROBUST COMPLIANCE FALLBACKS
    const context = form.context || {};
    const intent = form.intent || {};
    const supplier = form.supplier || null;
    const items = form.items || [];
    const logistics = form.logistics || {};
    const payment = form.payment || {};
    const pricing = form.pricing || {};
    const manufacturer = form.manufacturer || null;

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
        <div className="space-y-6 animate-fadeIn">

            {/* AUDIT SUMMARY STATUS BANNER */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${isOverBudget ? "bg-rose-50 border-rose-200 text-rose-900" : "bg-indigo-50/50 border-indigo-100 text-indigo-900"
                }`}>
                {isOverBudget ? (
                    <AlertTriangle size={20} className="text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                ) : (
                    <CheckCircle2 size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                )}
                <div>
                    <span className="text-base font-bold block">
                        {isOverBudget ? "Requires Multi-Level Authorization" : "Payload Integrity Verified"}
                    </span>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
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
                <div className="col-span-12 md:col-span-6 space-y-4">

                    {/* CARD 1: CORE WORKFLOW CONTEXT & INTENT */}
                    <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-3xs space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <FileText size={14} /> Profile Context
                        </span>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">Purchase Order Title</p>
                            <p className="text-base font-bold text-slate-900">{context.title || "Untitled Requisition"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase">Strategy Type</p>
                                <span className="inline-block text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md mt-0.5">
                                    {context.type || "Not Specified"}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase">Urgency Tier</p>
                                <span className={`inline-flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-md mt-0.5 border ${priority.style}`}>
                                    <PriorityIcon size={12} />
                                    {priority.label}
                                </span>
                            </div>
                        </div>
                        {intent.description && (
                            <div className="pt-2 border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-medium uppercase mb-0.5">Business Justification</p>
                                <p className="text-sm text-slate-600 font-normal italic leading-normal">"{intent.description}"</p>
                            </div>
                        )}
                    </div>

                    {/* CARD 2: ASSIGNED SUPPLIER PARTNER */}
                    <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-3xs space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <User size={14} /> Vendor Entity
                        </span>
                        {supplier ? (
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-base font-bold text-slate-900">{supplier.name}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{supplier.location} • Reliability: {supplier.reliability}</p>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                                    Approved
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-rose-600 font-medium">⚠️ Critical Warning: No vendor assigned to this execution cycle.</p>
                        )}

                        {manufacturer?.name && (
                            <div className="pt-2 border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-medium uppercase">Original Equipment Manufacturer (OEM)</p>
                                <p className="text-sm font-semibold text-slate-700 mt-0.5">{manufacturer.name}</p>
                            </div>
                        )}
                    </div>

                    {/* CARD 3: LOGISTICS & TRANSACTION ESCROW */}
                    <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-3xs space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Truck size={14} /> Logistics & Fulfillment
                        </span>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase">Routing Framework</p>
                                <p className="text-sm font-semibold text-slate-800 capitalize mt-0.5">{logistics.deliveryType || "Unassigned"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase">Target Target Date</p>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">{logistics.date || "Immediate Release"}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">Discharge Destination</p>
                            <p className="text-sm text-slate-700 line-clamp-2 mt-0.5">{logistics.location || "No Address Saved"}</p>
                        </div>
                    </div>

                </div>

                {/* COLUMN RIGHT: ITEM LIST & INDEPENDENT ACCRUAL RUNTIME AUDIT */}
                <div className="col-span-12 md:col-span-6 space-y-4">

                    {/* EXPANDED LINE ITEM SPECIFICATION SUMMARY DISPLAY */}
                    <div className="border border-slate-200 rounded-xl bg-white shadow-3xs overflow-hidden flex flex-col h-full">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <ShoppingBag size={14} /> Itemization Matrix ({items.length})
                            </span>
                            <span className="text-xs font-bold text-slate-400 font-mono">
                                Pre-tax Valuations
                            </span>
                        </div>

                        {/* LINE SUB-STREAM SCROLL TRACK */}
                        <div className="divide-y divide-slate-100 max-h-[260px] overflow-y-auto p-4 space-y-3.5 bg-white flex-1">
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start text-base pt-3.5 first:pt-0">
                                        <div className="min-w-0 pr-4">
                                            <p className="font-bold tracking-tight text-slate-900 truncate">{item.desc}</p>
                                            <p className="text-xs font-mono text-slate-400 mt-0.5">{item.sku} • {item.qty} units @ ${parseFloat(item.price).toFixed(2)}</p>
                                        </div>
                                        <div className="text-right font-mono font-bold text-slate-900">
                                            ${(item.qty * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 italic text-center py-6">No inventory item assets found inside this payload data configuration.</p>
                            )}
                        </div>

                        {/* MASTER BALANCE COMPLIANCE RECONCILIATION SUMMARY */}
                        <div className="bg-slate-900 text-white p-4 space-y-3">
                            <div className="flex justify-between items-center text-xs opacity-70 font-semibold uppercase tracking-wider">
                                <span>Terms: {payment.terms || "Not Specified"} ({payment.method || "N/A"})</span>
                                <span>Valuation Currency ({pricing.currency || "USD"})</span>
                            </div>

                            <div className="flex justify-between items-baseline pt-1">
                                <span className="text-sm font-bold opacity-80 uppercase tracking-tight">Aggregated Balance Due</span>
                                <span className="text-2xl font-mono font-bold text-white">
                                    ${totalCalculatedCost.toFixed(2)}
                                </span>
                            </div>

                            <div className="border-t border-white/10 pt-2 grid grid-cols-2 gap-4 text-xs opacity-80">
                                <div>
                                    <span>Ceiling Budget Threshold: </span>
                                    <span className="font-mono font-bold">${budgetCeiling.toFixed(2)}</span>
                                </div>
                                {payment.advance && (
                                    <div className="text-right">
                                        <span>Upfront Deposit ({payment.advance}%): </span>
                                        <span className="font-mono font-bold text-emerald-400">
                                            ${((totalCalculatedCost * parseFloat(payment.advance)) / 100).toFixed(2)}
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