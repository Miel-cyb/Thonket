import React, { useRef } from 'react';
import {
    X,
    Layers,
    Database,
    GripVertical,
    Tag,
    Image as ImageIcon,
    Hash,
    CheckCircle2,
    Circle,
    ChevronDown
} from 'lucide-react';

/**
 * 1. ProductVariantElement
 * Optimized for readability and data entry.
 */
export const ProductVariantElement = ({ variant, onUpdate, onRemove }) => {
    const fileInputRef = useRef(null);
    const units = ['pcs', 'kg', 'g', 'ml', 'ltr', 'box', 'set', 'pack'];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onUpdate({ ...variant, image: url });
        }
    };

    const toggleStatus = () => {
        onUpdate({ ...variant, status: variant.status === 'Active' ? 'Inactive' : 'Active' });
    };

    const isActive = variant.status === 'Active';

    return (
        <div className={`flex items-center gap-3 pl-12 pr-4 py-3 border-l-2 transition-all duration-200 group/variant 
            ${isActive ? 'bg-white border-indigo-400' : 'bg-slate-50 border-slate-200 opacity-70'}`}>

            {/* Draggable & Status Toggle */}
            <div className="shrink-0 flex items-center gap-3">
                <GripVertical size={16} className="text-slate-300 opacity-0 group-hover/variant:opacity-100 cursor-grab" />
                <button
                    onClick={toggleStatus}
                    className={`transition-colors hover:scale-110 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}
                >
                    {isActive ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
            </div>

            {/* Variant Image Slot */}
            <div className="shrink-0">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden hover:border-indigo-400 shadow-sm transition-all"
                >
                    {variant.image ? (
                        <img src={variant.image} alt="SKU" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon size={16} className="text-slate-400" />
                    )}
                </button>
                <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/*" />
            </div>

            {/* SKU Field */}
            <div className="w-40 shrink-0">
                <div className="relative flex items-center">
                    <Hash size={13} className="absolute left-3 text-slate-400" />
                    <input
                        value={variant.sku || ''}
                        onChange={(e) => onUpdate({ ...variant, sku: e.target.value })}
                        placeholder="SKU-0000"
                        className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs font-bold text-slate-900 uppercase tracking-wider outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                    />
                </div>
            </div>

            {/* Attribute & Value Group */}
            <div className="flex flex-1 items-center gap-2">
                <div className="w-32 shrink-0 relative">
                    <Tag size={13} className="absolute left-3 text-slate-400" />
                    <input
                        value={variant.attribute || ''}
                        onChange={(e) => onUpdate({ ...variant, attribute: e.target.value })}
                        placeholder="Size/Color"
                        className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500"
                    />
                </div>
                <input
                    value={variant.value || ''}
                    onChange={(e) => onUpdate({ ...variant, value: e.target.value })}
                    placeholder="Value (e.g. XL)"
                    className="flex-1 min-w-[80px] bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500"
                />
            </div>

            {/* UoM Dropdown */}
            <div className="w-28 shrink-0 relative">
                <select
                    value={variant.uom}
                    onChange={(e) => onUpdate({ ...variant, uom: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-slate-700 appearance-none outline-none focus:border-indigo-500"
                >
                    {units.map(unit => <option key={unit} value={unit}>{unit.toUpperCase()}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Stock Count */}
            <div className="w-28 shrink-0 relative">
                <Database size={13} className="absolute left-3 text-slate-400" />
                <input
                    type="number"
                    value={variant.stock || 0}
                    onChange={(e) => onUpdate({ ...variant, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
                />
            </div>

            {/* Remove Action */}
            <button onClick={onRemove} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                <X size={16} strokeWidth={2.5} />
            </button>
        </div>
    );
};

/**
 * 2. BulkProductRow
 * Master container for product name and variant management.
 */
export const BulkProductRow = ({ product, onUpdate, onRemove }) => {

    const addVariant = () => {
        const newVariant = {
            id: crypto.randomUUID(),
            sku: '',
            attribute: '',
            value: '',
            uom: 'pcs',
            stock: 0,
            status: 'Active',
            image: null
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
        <div className="mb-6 last:mb-0">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative z-10 hover:border-indigo-300 transition-all">

                {/* Master Image Preview */}
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 shrink-0 group">
                    <ImageIcon size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>

                {/* Name & Category Info */}
                <div className="flex-1 min-w-0">
                    <input
                        value={product.name || ''}
                        onChange={(e) => onUpdate({ ...product, name: e.target.value })}
                        placeholder="Master Product Name (e.g. Nike Air Max)"
                        className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-0"
                    />
                    <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                            {product.categoryName || 'General'}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                            {product.variants?.length || 0} Variants
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={addVariant}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-lg border border-indigo-100 transition-all font-bold text-xs uppercase tracking-tight"
                    >
                        <Layers size={14} />
                        Add Variant
                    </button>

                    <div className="w-px h-8 bg-slate-100 mx-1" />

                    <button
                        onClick={onRemove}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                        <X size={18} strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Variant List Rendering */}
            {product.variants && product.variants.length > 0 && (
                <div className="ml-6 mt-[-8px] pt-4 pb-2 bg-slate-50/50 border-x border-b border-slate-200 rounded-b-xl overflow-hidden shadow-inner">
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