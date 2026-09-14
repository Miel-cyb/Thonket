import React from 'react';

export const ProductContextCard = ({ productState }) => {
    const primaryVariant = productState?.variants?.[0] || {};
    const displaySku = primaryVariant.sku || productState.sku || 'N/A';
    const displayUnit = primaryVariant.unitOfMeasure || productState.unit || 'pcs';

    return (
        <div className="bg-white rounded-3xl border border-slate-200/95 shadow-xs p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Product Context (Master Identity)
                </h3>
                <span className="text-[10px] font-semibold text-slate-400 italic">
                    SKU: {displaySku} | Status: {productState.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-1">
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Variants</span>
                    <span className="text-sm font-mono font-bold text-slate-800">{productState.variants?.length || 0} Variants</span>
                </div>
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Primary SKU</span>
                    <span className="text-sm font-mono font-medium text-slate-700">{displaySku}</span>
                </div>
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Unit of Measure</span>
                    <span className="text-sm font-bold text-indigo-600">{displayUnit}</span>
                </div>
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Category ID</span>
                    <span className="text-xs font-mono font-medium text-slate-700 truncate block" title={productState.categoryId}>
                        {productState.categoryId || 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    );
};