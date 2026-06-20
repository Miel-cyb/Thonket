'use client';

import React, { useMemo } from "react";
import { Landmark, Truck, Receipt, Percent, Scale, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function StepPricingControl({ form, setForm }) {
    // Fallback data structures matching post-purchase distribution defaults
    const pricing = form?.pricing || { currency: "USD", exchangeRate: "12.50", logistics: "0", taxRate: "15", targetMarkup: "25" };
    const items = form?.items || [];

    // Safe state modifier for global landing factors
    const updatePricingField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            pricing: { ...(prev?.pricing || {}), [field]: value }
        }));
    };

    // Inline control for setting distinct distribution prices per position
    const updateItemWholesalePrice = (index, value) => {
        setForm((prev) => {
            const updatedItems = [...(prev?.items || [])];
            if (updatedItems[index]) {
                updatedItems[index] = { ...updatedItems[index], targetWholesalePrice: value };
            }
            return { ...prev, items: updatedItems };
        });
    };

    // 1. Calculate Base Ex-Works/FOB Cost Locked from Supplier Invoice
    const purchaseSubtotal = useMemo(() => {
        return items.reduce((sum, item) => sum + ((Number(item.qty) || 0) * (Number(item.price) || 0)), 0);
    }, [items]);

    const logisticsCost = parseFloat(pricing.logistics) || 0;
    const taxPercentage = parseFloat(pricing.taxRate) || 0;
    const targetMarkup = parseFloat(pricing.targetMarkup) || 0;
    const fxRate = parseFloat(pricing.exchangeRate) || 1;

    // 2. Real-Time Apportionment Metrics
    const totalLandedCostBase = useMemo(() => {
        const clearingTax = (purchaseSubtotal + logisticsCost) * (taxPercentage / 100);
        return purchaseSubtotal + logisticsCost + clearingTax;
    }, [purchaseSubtotal, logisticsCost, taxPercentage]);

    // Landed cost factor multiplier used to distribute logistics overhead down to the item unit level
    const landedMultiplier = useMemo(() => {
        return purchaseSubtotal > 0 ? totalLandedCostBase / purchaseSubtotal : 1;
    }, [purchaseSubtotal, totalLandedCostBase]);

    // 3. Process Variants into Local Currency Warehouse Valuation
    const processedItems = useMemo(() => {
        return items.map((item, idx) => {
            const basePrice = Number(item.price) || 0;
            const qty = Number(item.qty) || 0;

            // Calculate exact unit cost including freight and statutory clearing levies converted locally
            const unitLandedCostLocal = basePrice * landedMultiplier * fxRate;

            // Automatically calculated distribution recommendation
            const suggestedWholesaleLocal = unitLandedCostLocal * (1 + (targetMarkup / 100));

            // Evaluated distribution price field
            const finalWholesaleLocal = item.targetWholesalePrice !== undefined
                ? parseFloat(item.targetWholesalePrice) || 0
                : parseFloat(suggestedWholesaleLocal.toFixed(2));

            const totalCostLocal = unitLandedCostLocal * qty;
            const totalRevenueLocal = finalWholesaleLocal * qty;
            const projectedYieldLocal = totalRevenueLocal - totalCostLocal;
            const realMargin = totalRevenueLocal > 0 ? (projectedYieldLocal / totalRevenueLocal) * 100 : 0;

            return {
                ...item,
                unitLandedCostLocal,
                suggestedWholesaleLocal,
                finalWholesaleLocal,
                projectedYieldLocal,
                realMargin,
                index: idx
            };
        });
    }, [items, landedMultiplier, fxRate, targetMarkup]);

    // 4. Global Financial Projections Summary
    const batchSummary = useMemo(() => {
        return processedItems.reduce((acc, item) => ({
            totalRevenue: acc.totalRevenue + (item.finalWholesaleLocal * (Number(item.qty) || 0)),
            totalProfit: acc.totalProfit + item.projectedYieldLocal
        }), { totalRevenue: 0, totalProfit: 0 });
    }, [processedItems]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-2">

            {/* INBOUND COST RECONCILIATION & LOCAL DISTRIBUTION PARAMETERS */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs grid grid-cols-12 gap-5">
                <div className="col-span-12 border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Scale size={16} className="text-indigo-600" /> Post-Purchase Cost Apportionment & Distribution
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">The purchase is locked. Declare final logistics, handling, and duty metrics to establish local catalog valuations.</p>
                </div>

                {/* SETTLEMENT EXCHANGE RATE SPREAD */}
                <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">Settlement FX Rate (1 {pricing.currency} to Local)</label>
                    <div className="relative">
                        <Landmark size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="number" step="0.0001" value={pricing.exchangeRate}
                            onChange={(e) => updatePricingField("exchangeRate", e.target.value)}
                            className="w-full text-xs border border-slate-200 rounded-lg pl-8 pr-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* FREIGHT / PORT CLEARING / HAULAGE SURCHARGES */}
                <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">Actual Freight & Port Duties ({pricing.currency})</label>
                    <div className="relative">
                        <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="number" step="0.01" value={pricing.logistics}
                            onChange={(e) => updatePricingField("logistics", e.target.value)}
                            className="w-full text-xs border border-slate-200 rounded-lg pl-8 pr-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* STATUTORY LEVIES / IMPORT TAXES */}
                <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">Import Levies & Clearing VAT</label>
                    <div className="relative">
                        <Receipt size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                            value={pricing.taxRate}
                            onChange={(e) => updatePricingField("taxRate", e.target.value)}
                            className="w-full text-xs border border-slate-200 rounded-lg pl-8 pr-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="0">0% Port Duty Exempt</option>
                            <option value="15">15% Standard Port Levy</option>
                            <option value="21.9">21.9% Mixed Compound Tariff</option>
                        </select>
                    </div>
                </div>

                {/* DISTRIBUTION CHANNEL MARKUP TARGET */}
                <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">Target Distribution Profit Margin (%)</label>
                    <div className="relative">
                        <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="number" value={pricing.targetMarkup}
                            onChange={(e) => updatePricingField("targetMarkup", e.target.value)}
                            className="w-full text-xs border border-slate-200 rounded-lg pl-8 pr-3 py-2 font-semibold text-indigo-700 bg-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* INTERACTIVE POSITION VALUATION SHEET MATRIX */}
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Warehouse Inventory Valuation Matrix</h4>
                        <p className="text-xs text-slate-400">Review calculated landed values and specify final distribution channel prices.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
                        <div className="text-left">
                            <span className="text-slate-400 block font-normal">Invoice Purchase Cost</span>
                            <span className="font-mono text-slate-900 font-bold">{pricing.currency} {purchaseSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="text-left">
                            <span className="text-slate-400 block font-normal">Total Landed Valuation</span>
                            <span className="font-mono text-slate-900 font-bold">Local {(totalLandedCostBase * fxRate).toFixed(2)}</span>
                        </div>
                        <div className="text-left">
                            <span className="text-slate-400 block font-normal">Target Revenue Yield</span>
                            <span className="font-mono text-indigo-600 font-bold">Local {batchSummary.totalRevenue.toFixed(2)}</span>
                        </div>
                        <div className="text-left">
                            <span className="text-slate-400 block font-normal">Projected Net Yield</span>
                            <span className="font-mono text-emerald-600 font-bold">Local {batchSummary.totalProfit.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <th className="py-3 px-4">Item Details / Variant</th>
                                <th className="py-3 px-4 text-center">Qty Purchased</th>
                                <th className="py-3 px-4">Unit Invoice cost ({pricing.currency})</th>
                                <th className="py-3 px-4 bg-slate-100/40">Unit Landed Cost (Local)</th>
                                <th className="py-3 px-4 text-indigo-900 bg-indigo-50/30">Target Wholesale Price Rec. (Local)</th>
                                <th className="py-3 px-4 w-44">Active Distribution Price (Local)</th>
                                <th className="py-3 px-4 text-right">Net Channel Margin</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {processedItems.map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-3.5 px-4 font-medium text-slate-900">
                                        <div>{item.name || `Product Variant Row #${i + 1}`}</div>
                                        {item.variant && <span className="text-[10px] text-slate-400 font-normal bg-slate-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">{item.variant}</span>}
                                    </td>
                                    <td className="py-3.5 px-4 text-center font-mono text-slate-600">{item.qty || 0}</td>
                                    <td className="py-3.5 px-4 font-mono text-slate-600">{Number(item.price || 0).toFixed(2)}</td>
                                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900 bg-slate-100/20">
                                        {item.unitLandedCostLocal.toFixed(2)}
                                    </td>
                                    <td className="py-3.5 px-4 font-mono text-slate-400 bg-indigo-50/10">
                                        {item.suggestedWholesaleLocal.toFixed(2)}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <div className="relative">
                                            <input
                                                type="number" step="0.01"
                                                value={item.targetWholesalePrice !== undefined ? item.targetWholesalePrice : item.suggestedWholesaleLocal.toFixed(2)}
                                                onChange={(e) => updateItemWholesalePrice(item.index, e.target.value)}
                                                className="w-full text-xs font-mono font-bold text-indigo-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/5"
                                            />
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                                        <span className={item.realMargin >= targetMarkup ? "text-emerald-600" : item.realMargin < 0 ? "text-rose-600" : "text-amber-600"}>
                                            {item.realMargin.toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {processedItems.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                                        No matching finalized procurement items found to load inside the system.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FINANCIAL HEALTH NOTIFICATIONS */}
            {processedItems.some(item => item.realMargin < 0) ? (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-rose-800">
                    <ShieldAlert size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                        <span className="font-bold text-rose-900 block mb-0.5">Deficit Valuation Warning</span>
                        One or more inventory variants are currently assigned active pricing models that rest beneath your calculated true local landed cost basis. Saving will create immediate inventory item devaluation.
                    </div>
                </div>
            ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-emerald-800">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                        <span className="font-bold text-emerald-900 block mb-0.5">Valuation Complete</span>
                        All item models have been assigned profitable local selling channels and are structurally ready to be added to active inventory distribution queues.
                    </div>
                </div>
            )}
        </div>
    );
}