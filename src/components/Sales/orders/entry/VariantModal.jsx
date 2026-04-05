'use client';

import { X, Box, CheckCircle2, AlertCircle, ShoppingCart, Calculator, Layers, ArrowRight, Search, Zap } from "lucide-react";
import { useState, useMemo } from "react";

export default function VariantModal({ product, onClose, onSelectVariant }) {
    // allocations stores: { [variantName]: quantity }
    const [allocations, setAllocations] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const handleQtyChange = (variant, val) => {
        const qty = parseInt(val) || 0;
        setAllocations(prev => ({
            ...prev,
            [variant]: Math.max(0, qty)
        }));
    };

    // Filter variants if the list is huge (1000s of goods logic)
    const filteredVariants = useMemo(() => {
        return product.variants.filter(v =>
            v.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [product.variants, searchTerm]);

    // Commercial Logic: Calculate Value and Totals
    const summary = useMemo(() => {
        return Object.entries(allocations).reduce((acc, [variant, qty]) => {
            // In a real app, price would come from a variant-specific map
            const price = product.basePrice || 0;
            acc.totalUnits += qty;
            acc.totalValue += (qty * price);
            if (qty > 0) acc.activeLines += 1;
            return acc;
        }, { totalUnits: 0, totalValue: 0, activeLines: 0 });
    }, [allocations, product.basePrice]);

    const handleBatchConfirm = () => {
        if (summary.totalUnits <= 0) return;
        Object.entries(allocations).forEach(([variant, qty]) => {
            if (qty > 0) onSelectVariant(product, variant, qty);
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative bg-[#F8FAFC] w-full max-w-5xl rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col max-h-[92vh] border border-white/20">

                {/* 1. COMMERCIAL HEADER */}
                <div className="p-8 bg-white border-b border-slate-200">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-6">
                            <div className="h-16 w-16 bg-slate-900 rounded-3xl flex items-center justify-center text-indigo-400 shadow-2xl">
                                <Box size={32} strokeWidth={2.5} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded uppercase tracking-widest">FMCG Master-Unit</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{product.category}</span>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{product.name}</h2>
                                <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                                    SKU: <span className="text-indigo-600 font-mono tracking-tighter">{product.sku}</span>
                                    <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                    Base Price: ${product.basePrice?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all text-slate-300">
                            <X size={24} />
                        </button>
                    </div>

                    {/* SEARCH/FILTER BAR for massive variant lists */}
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search units (e.g., 'Case', 'Pallet', 'Shrink')..."
                            className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* 2. THE ALLOCATION MATRIX */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-12 px-6 mb-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <div className="col-span-5">Format Specification</div>
                        <div className="col-span-2 text-center">Price/Unit</div>
                        <div className="col-span-2 text-center">Inventory</div>
                        <div className="col-span-3 text-right">Allocation</div>
                    </div>

                    <div className="space-y-2">
                        {filteredVariants.map((v) => {
                            const isSelected = allocations[v] > 0;
                            return (
                                <div key={v} className={`grid grid-cols-12 items-center px-6 py-4 rounded-2xl border-2 transition-all duration-200 ${isSelected ? "bg-white border-indigo-600 shadow-md" : "bg-white/50 border-transparent hover:border-slate-200"
                                    }`}>
                                    <div className="col-span-5 flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                                            <Layers size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 uppercase">{v}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase italic">Global Standard Pack</p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 text-center font-mono font-bold text-slate-600">
                                        ${product.basePrice?.toFixed(2)}
                                    </div>

                                    <div className="col-span-2 text-center">
                                        <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">
                                            {product.stock || '999+'} Available
                                        </span>
                                    </div>

                                    <div className="col-span-3 flex justify-end items-center gap-3">
                                        {isSelected && (
                                            <p className="text-[10px] font-black text-indigo-600 tabular-nums">
                                                Sub: ${(allocations[v] * (product.basePrice || 0)).toLocaleString()}
                                            </p>
                                        )}
                                        <input
                                            type="number"
                                            value={allocations[v] || ""}
                                            onChange={(e) => handleQtyChange(v, e.target.value)}
                                            className={`w-24 py-3 px-4 text-right font-black rounded-xl border-2 transition-all outline-none tabular-nums ${isSelected ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-400"
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
                <div className="p-8 bg-slate-900 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="grid grid-cols-3 gap-8">
                            <div className="flex items-center gap-4 border-r border-white/10 pr-8">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                    <Calculator size={24} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase">Gross Units</p>
                                    <p className="text-2xl font-black text-white tabular-nums">{summary.totalUnits}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase">Market Value</p>
                                    <p className="text-2xl font-black text-white tabular-nums">${summary.totalValue.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                            <button onClick={onClose} className="flex-1 md:flex-none px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-white border border-white/10 transition-all">
                                Abort
                            </button>
                            <button
                                disabled={summary.totalUnits === 0}
                                onClick={handleBatchConfirm}
                                className="flex-1 md:flex-none px-12 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-3"
                            >
                                Batch To Cart <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}