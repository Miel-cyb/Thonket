'use client';

import { useState, useMemo, useRef } from "react";
import { X, Box, Calculator, Layers, ArrowRight, Search, Zap } from "lucide-react";

export default function VariantModal({ product, onClose, onSelectVariant }) {
    // allocations stores: { [variantId]: quantity }
    const [allocations, setAllocations] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    // Safety check for product data
    if (!product) return null;

    // Access the actual variant data from your product schema
    const variants = product.pricing?.base || [];

    const handleQtyChange = (variantId, val) => {
        const qty = parseInt(val);
        setAllocations(prev => ({
            ...prev,
            [variantId]: isNaN(qty) ? 0 : Math.max(0, qty)
        }));
    };

    // Filter variants based on UOM (Case, Pack, etc.)
    const filteredVariants = useMemo(() => {
        return variants.filter(v =>
            v.uom?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [variants, searchTerm]);

    // Commercial Logic: Calculate using variant-specific pricing
    const summary = useMemo(() => {
        return Object.entries(allocations).reduce((acc, [variantId, qty]) => {
            const variantData = variants.find(v => (v._id || v.id) === variantId);
            const price = variantData?.basePrice || 0;

            acc.totalUnits += qty;
            acc.totalValue += (qty * price);
            if (qty > 0) acc.activeLines += 1;
            acc.currency = variantData?.currency || "GHS";

            return acc;
        }, { totalUnits: 0, totalValue: 0, activeLines: 0, currency: "GHS" });
    }, [allocations, variants]);

    const handleBatchConfirm = () => {
        if (summary.totalUnits <= 0) return;

        // Iterate through allocations and trigger selection for each non-zero line
        Object.entries(allocations).forEach(([variantId, qty]) => {
            if (qty > 0) {
                const variantData = variants.find(v => (v._id || v.id) === variantId);
                // Standardizing callback to pass product, variant details, and amount
                onSelectVariant(product, variantData, qty);
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6">
            {/* Backdrop with extreme blur for ERP focus */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative bg-[#F8FAFC] w-full max-w-5xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in zoom-in-95 duration-300">

                {/* 1. COMMERCIAL HEADER */}
                <div className="p-8 bg-white border-b border-slate-200 shrink-0">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-6">
                            <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl">
                                <Box size={32} strokeWidth={2.5} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded uppercase tracking-widest">
                                        Batch Entry
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                        {product.brand || 'General Stock'}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                    {product.name}
                                </h2>
                                <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-2">
                                    SKU: <span className="text-indigo-600 font-mono tracking-tighter bg-indigo-50 px-1.5 py-0.5 rounded">{product.sku}</span>
                                    <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                    {variants.length} SKU Variants Available
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all text-slate-300 border border-transparent hover:border-red-100"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by Unit of Measure (e.g., 'Case', '6-Pack')..."
                            className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* 2. THE ALLOCATION MATRIX */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
                    <div className="grid grid-cols-12 px-6 mb-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <div className="col-span-5">Unit Configuration</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-3 text-right">Qty Allocation</div>
                    </div>

                    <div className="space-y-3">
                        {filteredVariants.map((v) => {
                            const vId = v._id || v.id;
                            const isSelected = (allocations[vId] || 0) > 0;
                            return (
                                <div
                                    key={vId}
                                    className={`grid grid-cols-12 items-center px-6 py-4 rounded-[1.5rem] border-2 transition-all duration-200 ${isSelected
                                            ? "bg-white border-indigo-600 shadow-lg scale-[1.01]"
                                            : "bg-white border-transparent hover:border-slate-200"
                                        }`}
                                >
                                    <div className="col-span-5 flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                                            <Layers size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 uppercase">{v.uom}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                                                {v.isDefault ? "Primary Sales Unit" : "Secondary Unit"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 text-center font-mono font-bold text-slate-700">
                                        {v.currency} {v.basePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>

                                    <div className="col-span-2 text-center">
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-tighter">
                                            In Stock
                                        </span>
                                    </div>

                                    <div className="col-span-3 flex justify-end items-center gap-4">
                                        {isSelected && (
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Subtotal</p>
                                                <p className="text-xs font-black text-indigo-600 tabular-nums">
                                                    {v.currency} {(allocations[vId] * v.basePrice).toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="number"
                                            value={allocations[vId] || ""}
                                            onChange={(e) => handleQtyChange(vId, e.target.value)}
                                            className={`w-24 py-3.5 px-4 text-center font-black rounded-xl border-2 transition-all outline-none tabular-nums ${isSelected
                                                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                    : "border-slate-200 bg-white text-slate-400 focus:border-indigo-300"
                                                }`}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. SETTLEMENT FOOTER */}
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
                            <button
                                onClick={onClose}
                                className="px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 transition-all"
                            >
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