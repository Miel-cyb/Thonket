import React from 'react';
import {
    X,
    Layers,
    DollarSign,
    Hash,
    Database,
    ChevronDown,
    GripVertical,
    Tag
} from 'lucide-react';

/**
 * 1. ProductVariantElement
 * Designed for high-density commercial entry. 
 * This represents a single SKU variation (e.g., "Red / XL" or "500ml").
 */
export const ProductVariantElement = ({ variant, onUpdate, onRemove }) => (
    <div className="flex items-center gap-3 pl-12 pr-4 py-2 bg-slate-50/50 border-l-2 border-slate-200 group/variant animate-in slide-in-from-left-2 duration-200">
        {/* Visual Connector Line Hook */}
        <div className="shrink-0 text-slate-300">
            <GripVertical size={14} className="opacity-0 group-hover/variant:opacity-100 transition-opacity cursor-grab" />
        </div>

        {/* Attribute Selector (e.g., Size, Color) */}
        <div className="w-32 shrink-0">
            <div className="relative flex items-center">
                <Tag size={12} className="absolute left-3 text-slate-400" />
                <input
                    value={variant.attribute}
                    onChange={(e) => onUpdate({ ...variant, attribute: e.target.value })}
                    placeholder="Size/Type"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-2 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all"
                />
            </div>
        </div>

        {/* Value Input (e.g., "Large", "500ml") */}
        <div className="flex-1">
            <input
                value={variant.value}
                onChange={(e) => onUpdate({ ...variant, value: e.target.value })}
                placeholder="Value (e.g. XL, 500ml)"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all"
            />
        </div>

        {/* Commercial Data: Price Override */}
        <div className="w-28 shrink-0">
            <div className="relative flex items-center">
                <DollarSign size={12} className="absolute left-3 text-emerald-500" />
                <input
                    type="number"
                    value={variant.price}
                    onChange={(e) => onUpdate({ ...variant, price: e.target.value })}
                    placeholder="Price"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-2 py-1.5 text-[11px] font-black text-slate-900 outline-none focus:border-emerald-400 transition-all"
                />
            </div>
        </div>

        {/* Commercial Data: Stock/Quantity */}
        <div className="w-24 shrink-0">
            <div className="relative flex items-center">
                <Database size={12} className="absolute left-3 text-slate-400" />
                <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => onUpdate({ ...variant, stock: e.target.value })}
                    placeholder="Stock"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-2 py-1.5 text-[11px] font-bold text-slate-600 outline-none focus:border-indigo-400 transition-all"
                />
            </div>
        </div>

        {/* Delete Variant */}
        <button
            onClick={onRemove}
            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all"
        >
            <X size={14} strokeWidth={3} />
        </button>
    </div>
);

/**
 * 2. Updated BulkProductRow
 * Modified to support a nested variant array and expansion logic.
 */
export const BulkProductRow = ({ product, onUpdate, onRemove }) => {

    const addVariant = () => {
        const newVariant = {
            id: Date.now(),
            attribute: '',
            value: '',
            price: '',
            stock: 0
        };
        const currentVariants = product.variants || [];
        onUpdate({ ...product, variants: [...currentVariants, newVariant] });
    };

    const updateVariant = (vId, updatedData) => {
        const newVariants = product.variants.map(v => v.id === vId ? updatedData : v);
        onUpdate({ ...product, variants: newVariants });
    };

    const removeVariant = (vId) => {
        const newVariants = product.variants.filter(v => v.id !== vId);
        onUpdate({ ...product, variants: newVariants });
    };

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-4 bg-white p-2.5 pr-4 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-300 transition-all">
                {/* Product Image Wrapper */}
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 group-hover:bg-indigo-50">
                    <ImageIcon size={18} className="text-slate-400 group-hover:text-indigo-400" />
                </div>

                {/* Primary Info */}
                <div className="flex-1 min-w-0">
                    <input
                        value={product.name}
                        onChange={(e) => onUpdate({ ...product, name: e.target.value })}
                        placeholder="Master Product Name..."
                        className="w-full bg-transparent border-none outline-none text-[13px] font-black text-slate-800 placeholder:text-slate-300"
                    />
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tight bg-indigo-50 px-1.5 py-0.5 rounded">
                            {product.categoryName}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                            • {product.variants?.length || 0} Variants
                        </span>
                    </div>
                </div>

                {/* Action: Add Variant Button */}
                <button
                    onClick={addVariant}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-600 text-slate-500 hover:text-white rounded-lg border border-slate-200 hover:border-indigo-600 transition-all group/btn"
                >
                    <Layers size={14} className="group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-tight">Add Variant</span>
                </button>

                <div className="h-6 w-px bg-slate-100 mx-1" />

                {/* Remove Master Product */}
                <button onClick={onRemove} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <X size={16} strokeWidth={3} />
                </button>
            </div>

            {/* Nested Variant List */}
            {product.variants && product.variants.length > 0 && (
                <div className="bg-white/40 rounded-b-2xl pb-2 -mt-2 pt-4 border-x border-b border-slate-100 overflow-hidden">
                    {product.variants.map((v) => (
                        <ProductVariantElement
                            key={v.id}
                            variant={v}
                            onUpdate={(data) => updateVariant(v.id, data)}
                            onRemove={() => removeVariant(v.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};