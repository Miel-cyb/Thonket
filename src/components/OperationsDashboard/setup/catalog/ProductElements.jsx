import React from 'react';
import { Camera, RefreshCw, Layers, X, Image as ImageIcon } from 'lucide-react';

/**
 * Enhanced Product Field
 * Corrected padding-to-icon ratios and focus transitions.
 */
export const ProductField = ({ label, value, onChange, placeholder, type = "text", icon: Icon }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            {label}
        </label>
        <div className="relative group">
            {Icon && (
                <Icon
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                />
            )}
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-xl ${Icon ? 'pl-11' : 'px-4'} py-3 text-sm font-bold text-slate-900 transition-all outline-none placeholder:text-slate-300`}
            />
        </div>
    </div>
);

/**
 * Bulk Product Row
 * Corrected vertical alignment and spacing between image, text, and delete action.
 */
export const BulkProductRow = ({ product, onUpdate, onRemove }) => (
    <div className="flex items-center gap-4 bg-white p-2.5 pr-4 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-300 hover:shadow-md transition-all">
        {/* Compact Image Preview */}
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden shrink-0 transition-colors group-hover:bg-indigo-50">
            {product.image ? (
                <img src={product.image} alt="" className="w-full h-full object-cover" />
            ) : (
                <ImageIcon size={18} className="group-hover:text-indigo-400" />
            )}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
            <input
                value={product.name}
                onChange={(e) => onUpdate({ ...product, name: e.target.value })}
                placeholder="Product Name..."
                className="w-full bg-transparent border-none outline-none text-[13px] font-black text-slate-800 placeholder:text-slate-300 focus:placeholder:text-slate-200"
            />
            <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tight bg-indigo-50 px-1.5 py-0.5 rounded">
                    {product.categoryName || 'General'}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                    • {product.subCategory || 'No Sub-cat'}
                </span>
            </div>
        </div>

        {/* Action Area */}
        <button
            onClick={onRemove}
            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
        >
            <X size={16} strokeWidth={3} />
        </button>
    </div>
);

/**
 * Product Image Upload
 * Corrected the "Asset" label spacing and border-radius consistency.
 */
export const ProductImageUpload = ({ image, onUpload }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Product Asset
        </label>
        <div className="relative aspect-square w-full rounded-[24px] border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center overflow-hidden group hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer shadow-sm">
            {image ? (
                <>
                    <img src={image} alt="Product" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="p-3 bg-white/20 rounded-full border border-white/30 text-white">
                            <RefreshCw size={20} />
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center p-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl shadow-inner border border-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-indigo-500 group-hover:bg-white transition-all">
                        <Camera size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                        Click to Upload
                    </p>
                </div>
            )}
        </div>
    </div>
);