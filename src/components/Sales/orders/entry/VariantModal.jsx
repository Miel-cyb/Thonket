'use client';

import { useState, useMemo } from "react";
import { X, Box, Calculator, Layers, ArrowRight, Search, Zap, Tag, Percent, SlidersHorizontal, CheckCircle2 } from "lucide-react";

export default function VariantModal({ product, onClose, onSelectVariant }) {
    const [allocations, setAllocations] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    if (!product) return null;

    // 1. EXTRACT & NORMALIZE VARIANTS
    const variantList = useMemo(() => {
        let rawVariants = [];
        if (product.variants && Array.isArray(product.variants)) {
            rawVariants = product.variants;
        } else if (product.price || product.sku) {
            rawVariants = [product];
        }

        return rawVariants.map(v => {
            const priceObj = v.price || {};
            const tiers = v.tiers || priceObj.tiers || [];
            const discount = v.discount || priceObj.discount || null;
            const basePrice = priceObj.basePrice || v.basePrice || 0;
            const currency = priceObj.currency || v.currency || 'GHS';
            const stock = v.stock ?? v.quantity ?? 0;

            return {
                id: v._id || v.id || 'default-variant',
                sku: v.sku || product.sku || 'N/A',
                name: v.name || product.name || 'Unnamed Variant',
                unitOfMeasure: v.unitOfMeasure || product.unitOfMeasure || 'pcs',
                size: v.attributes?.Size || v.size || 'Standard',
                basePrice,
                currency,
                stock,
                isActive: v.isActive ?? true,
                tiers: Array.isArray(tiers) ? tiers : [],
                discount
            };
        });
    }, [product]);

    const handleQtyChange = (variantId, val) => {
        const qty = parseInt(val, 10);
        setAllocations(prev => ({
            ...prev,
            [variantId]: isNaN(qty) ? 0 : Math.max(0, qty)
        }));
    };

    const filteredVariants = useMemo(() => {
        return variantList.filter(v =>
            v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.size.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [variantList, searchTerm]);

    // 2. TIER & DISCOUNT PRICING CALCULATOR
    const calculatePricing = (variant, qty) => {
        if (qty <= 0) return { unitPrice: variant.basePrice, subtotal: 0, appliedTier: null };

        let unitPrice = variant.basePrice;
        let appliedTier = null;

        if (variant.tiers && variant.tiers.length > 0) {
            const matchedTier = variant.tiers.find(t => qty >= t.minRange && qty <= (t.maxRange || Infinity));
            if (matchedTier) {
                unitPrice = matchedTier.tierPrice;
                appliedTier = matchedTier;
            } else {
                const lastTier = variant.tiers[variant.tiers.length - 1];
                if (qty > lastTier.maxRange) {
                    unitPrice = lastTier.tierPrice;
                    appliedTier = lastTier;
                }
            }
        }

        let subtotal = unitPrice * qty;

        if (variant.discount && variant.discount.discountValue > 0) {
            if (variant.discount.discountType === 'PERCENTAGE') {
                subtotal = subtotal * (1 - variant.discount.discountValue / 100);
            } else if (variant.discount.discountType === 'FIXED') {
                subtotal = Math.max(0, subtotal - (variant.discount.discountValue * qty));
            }
        }

        return { unitPrice, subtotal, appliedTier };
    };

    // 3. AGGREGATE SUMMARY CALCULATIONS
    const summary = useMemo(() => {
        return Object.entries(allocations).reduce((acc, [vId, qty]) => {
            if (qty > 0) {
                const variant = variantList.find(v => v.id === vId);
                if (variant) {
                    const { subtotal } = calculatePricing(variant, qty);
                    acc.totalUnits += qty;
                    acc.totalValue += subtotal;
                    acc.activeLines += 1;
                }
            }
            return acc;
        }, { totalUnits: 0, totalValue: 0, activeLines: 0, currency: variantList[0]?.currency || "GHS" });
    }, [allocations, variantList]);

    const handleBatchConfirm = () => {
        if (summary.totalUnits <= 0) return;
        Object.entries(allocations).forEach(([vId, qty]) => {
            if (qty > 0) {
                const variantData = variantList.find(v => v.id === vId);
                const pricing = calculatePricing(variantData, qty);
                onSelectVariant?.(product, { ...variantData, allocatedQty: qty, ...pricing });
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 md:p-6 font-sans">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-slate-100">

                {/* HEADER */}
                <div className="p-6 md:p-8 bg-slate-50/90 border-b border-slate-200 shrink-0">
                    <div className="flex justify-between items-start mb-5">
                        <div className="flex gap-4 items-center">
                            <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
                                <Box size={28} strokeWidth={2} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2.5 mb-1">
                                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md tracking-wide">
                                        Wholesale Tier & Variant Matrix
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        {product.categoryName || product.category?.name || 'General Inventory'}
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {product.parentProductName || product.name}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                    <span>Slug: <strong className="text-slate-700 font-mono">{product.slug || 'n/a'}</strong></span>
                                    <span>•</span>
                                    <span>{variantList.length} Variant Option(s) Available</span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-slate-200/60 rounded-xl transition-colors text-slate-400 hover:text-slate-700"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Filter variants by name, SKU, or size..."
                            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* VARIANT DETAIL LIST */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/50">
                    {filteredVariants.map((v) => {
                        const qty = allocations[v.id] || 0;
                        const isSelected = qty > 0;
                        const { unitPrice, subtotal, appliedTier } = calculatePricing(v, qty);

                        return (
                            <div
                                key={v.id}
                                className={`bg-white rounded-2xl p-6 border transition-all duration-200 shadow-sm ${isSelected
                                    ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-md bg-indigo-50/10"
                                    : "border-slate-200/90 hover:border-slate-300"
                                    }`}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                                    {/* Column 1: Info & Attributes (Width: 3 cols) */}
                                    <div className="lg:col-span-3 flex items-start gap-4">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                                            <Layers size={22} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900 leading-snug">{v.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-mono text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{v.sku}</span>
                                                <span className="text-xs text-slate-300">•</span>
                                                <span className={`text-xs font-semibold ${v.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                                                    Stock: {v.stock}
                                                </span>
                                            </div>
                                            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                                                <Tag size={13} className="text-slate-400" />
                                                Size: {v.size} ({v.unitOfMeasure})
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: Enhanced Tier Range View (Width: 5 cols) */}
                                    <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-inner space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                                <SlidersHorizontal size={14} className="text-indigo-600" /> Volume Pricing Tiers
                                            </span>
                                            <span className="text-xs font-bold text-slate-600">
                                                Base: <span className="font-mono text-indigo-600">{v.currency} {v.basePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {/* Standard tier row */}
                                            <div className="flex justify-between items-center px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200/70 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-slate-200/80 text-slate-700 text-xs font-mono font-bold rounded">
                                                        Qty: 1+ units
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-medium">Standard</span>
                                                </div>
                                                <span className="font-mono font-bold text-slate-900 text-sm">
                                                    {v.currency} {v.basePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>

                                            {/* Dynamic Tiers with clear range display */}
                                            {v.tiers.length > 0 ? (
                                                v.tiers.map((t, idx) => {
                                                    const isCurrentTier = appliedTier && appliedTier.minRange === t.minRange;
                                                    const rangeLabel = t.maxRange ? `${t.minRange} – ${t.maxRange} units` : `${t.minRange}+ units`;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`flex justify-between items-center px-3.5 py-2.5 rounded-xl border transition-all text-sm ${isCurrentTier
                                                                ? "bg-emerald-50/90 border-emerald-300 text-emerald-950 font-semibold shadow-sm ring-1 ring-emerald-400/20"
                                                                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2.5">
                                                                <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg ${isCurrentTier ? "bg-emerald-600 text-white" : "bg-indigo-50 text-indigo-700 border border-indigo-100"}`}>
                                                                    {rangeLabel}
                                                                </span>
                                                                {isCurrentTier && (
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                                                                        <CheckCircle2 size={12} /> Active Tier
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="font-mono font-bold text-sm text-slate-900">
                                                                {v.currency} {t.tierPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-[11px] font-normal text-slate-500">/unit</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-xs text-slate-400 italic py-2 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                                    No wholesale volume tiers configured
                                                </div>
                                            )}
                                        </div>

                                        {v.discount && v.discount.discountValue > 0 && (
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/80 border border-indigo-100 px-3.5 py-2 rounded-lg">
                                                <Percent size={14} /> Promotion Applied: {v.discount.discountValue}% off subtotal
                                            </div>
                                        )}
                                    </div>

                                    {/* Column 3: Allocation Input & Subtotal Output (Width: 4 cols) */}
                                    <div className="lg:col-span-4 flex items-center justify-end gap-6">
                                        {isSelected && (
                                            <div className="text-right bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                                                <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-0.5">
                                                    Line Subtotal
                                                </p>
                                                <p className="text-xl font-black text-indigo-700 font-mono tracking-tight">
                                                    {v.currency} {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </p>
                                                <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                                                    Rate: {v.currency} {unitPrice.toFixed(2)}/ea
                                                </p>
                                            </div>
                                        )}
                                        <div className="flex flex-col items-end">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Allocation Qty</label>
                                            <input
                                                type="number"
                                                value={allocations[v.id] || ""}
                                                onChange={(e) => handleQtyChange(v.id, e.target.value)}
                                                className={`w-36 py-3.5 px-3 text-center text-xl font-bold rounded-2xl border transition-all outline-none tabular-nums shadow-sm ${isSelected
                                                    ? "border-indigo-500 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-500/20"
                                                    : "border-slate-300 bg-white text-slate-900 focus:border-indigo-500"
                                                    }`}
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* FOOTER SUMMARY & CONFIRMATION */}
                <div className="p-6 md:p-8 bg-slate-900 border-t border-slate-800 shrink-0 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-8 w-full md:w-auto">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-300 shrink-0">
                                    <Calculator size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Quantity</p>
                                    <p className="text-2xl font-black tracking-tight">{summary.totalUnits} Units</p>
                                </div>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-800 hidden sm:block" />
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Aggregate Price</p>
                                    <p className="text-2xl font-black font-mono tracking-tight text-emerald-400">
                                        {summary.currency} {summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3.5 w-full md:w-auto">
                            <button
                                onClick={onClose}
                                className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={summary.totalUnits === 0}
                                onClick={handleBatchConfirm}
                                className="flex-1 md:flex-none px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                            >
                                Confirm Allocation <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}