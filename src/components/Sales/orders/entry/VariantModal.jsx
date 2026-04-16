'use client';

import { useState, useMemo } from "react";
import { X, Box, Calculator, Layers, ArrowRight, Search, Zap } from "lucide-react";

export default function VariantModal({ product, onClose, onSelectVariant }) {
    const [allocations, setAllocations] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    if (!product) return null;

    // 1. EXTRACT DATA FROM SCHEMA
    const basePricing = product.pricing?.base?.[0] || {};
    const tiers = product.pricing?.tiers || [];
    const discounts = product.pricing?.discounts || [];

    // 2. IDENTIFY UNIQUE VARIANTS
    // Since variants aren't a separate list in your data, we derive them from the tiers
    const variantList = useMemo(() => {
        const uniqueIds = Array.from(new Set(tiers.map(t => t.variantId)));
        return uniqueIds.map(vId => {
            // Find the first tier for this variant to use as a reference
            const refTier = tiers.find(t => t.variantId === vId);
            return {
                id: vId,
                // Fallback name logic: Extract UOM from ID or use generic
                uom: vId.endsWith('868a') ? "Bulk Case" : vId.endsWith('868d') ? "Pack" : "Unit",
                isDefault: vId === basePricing.productId
            };
        });
    }, [tiers, basePricing]);

    // 3. PRICE CALCULATION ENGINE
    const getLivePrice = (variantId, qty) => {
        let price = basePricing.basePrice || 0;

        // Apply Tiered Price if quantity matches a range
        const tier = tiers.find(t =>
            t.variantId === variantId &&
            qty >= t.minQuantity &&
            qty <= t.maxQuantity &&
            t.isActive
        );
        if (tier) price = tier.price;

        // Apply Global Discounts
        const discount = discounts.find(d => d.isActive && qty >= d.minQuantity);
        if (discount) {
            if (discount.discountType === "PERCENTAGE") {
                price = price * (1 - (discount.value / 100));
            } else if (discount.discountType === "FIXED") {
                price = Math.max(0, price - discount.value);
            }
        }
        return price;
    };

    const handleQtyChange = (variantId, val) => {
        const qty = parseInt(val);
        setAllocations(prev => ({
            ...prev,
            [variantId]: isNaN(qty) ? 0 : Math.max(0, qty)
        }));
    };

    const filteredVariants = useMemo(() => {
        return variantList.filter(v =>
            v.uom.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [variantList, searchTerm]);

    const summary = useMemo(() => {
        return Object.entries(allocations).reduce((acc, [vId, qty]) => {
            if (qty > 0) {
                const price = getLivePrice(vId, qty);
                acc.totalUnits += qty;
                acc.totalValue += (qty * price);
                acc.activeLines += 1;
            }
            acc.currency = basePricing.currency || "GHS";
            return acc;
        }, { totalUnits: 0, totalValue: 0, activeLines: 0, currency: "GHS" });
    }, [allocations, basePricing, tiers, discounts]);

    const handleBatchConfirm = () => {
        if (summary.totalUnits <= 0) return;
        Object.entries(allocations).forEach(([vId, qty]) => {
            if (qty > 0) {
                const variantData = variantList.find(v => v.id === vId);
                const finalPrice = getLivePrice(vId, qty);
                onSelectVariant(product, { ...variantData, price: finalPrice }, qty);
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative bg-[#F8FAFC] w-full max-w-5xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in zoom-in-95 duration-300">

                {/* HEADER */}
                <div className="p-8 bg-white border-b border-slate-200 shrink-0">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-6">
                            <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl">
                                <Box size={32} strokeWidth={2.5} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded uppercase tracking-widest">Batch Entry</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{product.brand || 'General Stock'}</span>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{product.name}</h2>
                                <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-2">
                                    SKU: <span className="text-indigo-600 font-mono tracking-tighter bg-indigo-50 px-1.5 py-0.5 rounded">{product.slug}</span>
                                    <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                    {variantList.length} Unit Variants Detected
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all text-slate-300 border border-transparent hover:border-red-100">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search units (e.g. Case, Pack)..."
                            className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* MATRIX */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
                    <div className="grid grid-cols-12 px-6 mb-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <div className="col-span-5">Variant ID / Unit</div>
                        <div className="col-span-2 text-center">Effective Price</div>
                        <div className="col-span-2 text-center">Tier Status</div>
                        <div className="col-span-3 text-right">Qty Allocation</div>
                    </div>

                    <div className="space-y-3">
                        {filteredVariants.map((v) => {
                            const qty = allocations[v.id] || 0;
                            const isSelected = qty > 0;
                            const currentPrice = getLivePrice(v.id, qty);

                            return (
                                <div key={v.id} className={`grid grid-cols-12 items-center px-6 py-4 rounded-[1.5rem] border-2 transition-all duration-200 ${isSelected ? "bg-white border-indigo-600 shadow-lg scale-[1.01]" : "bg-white border-transparent hover:border-slate-200"}`}>
                                    <div className="col-span-5 flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                                            <Layers size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 uppercase truncate w-40">{v.uom}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase truncate w-40">{v.id}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 text-center font-mono font-bold text-slate-700">
                                        {basePricing.currency} {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>

                                    <div className="col-span-2 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${qty >= 5 ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"}`}>
                                            {qty >= 20 ? "Wholesale" : qty >= 5 ? "Tiered" : "Standard"}
                                        </span>
                                    </div>

                                    <div className="col-span-3 flex justify-end items-center gap-4">
                                        {isSelected && (
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Subtotal</p>
                                                <p className="text-xs font-black text-indigo-600 tabular-nums">
                                                    {basePricing.currency} {(qty * currentPrice).toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="number"
                                            value={allocations[v.id] || ""}
                                            onChange={(e) => handleQtyChange(v.id, e.target.value)}
                                            className={`w-24 py-3.5 px-4 text-center font-black rounded-xl border-2 transition-all outline-none tabular-nums ${isSelected ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-400 focus:border-indigo-300"}`}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-8 bg-slate-900 border-t border-white/10 shrink-0">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex gap-10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                                    <Calculator size={24} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Units</p>
                                    <p className="text-2xl font-black text-white tabular-nums">{summary.totalUnits}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Aggregate Value</p>
                                    <p className="text-2xl font-black text-white tabular-nums">
                                        {summary.currency} {summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                            <button onClick={onClose} className="px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 transition-all">
                                Cancel
                            </button>
                            <button
                                disabled={summary.totalUnits === 0}
                                onClick={handleBatchConfirm}
                                className="flex-1 md:flex-none px-12 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-3"
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