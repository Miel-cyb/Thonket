import React, { useState } from 'react';
import {
    GripVertical, DollarSign, Percent, Trash2, Layers, Plus,
    Tag, ShieldCheck, ChevronDown, ChevronUp, Calendar,
    ArrowUpCircle, Clock
} from 'lucide-react';

export const PriceVariantRow = ({ variant, onUpdate, onRemove }) => {
    const [isTierOpen, setIsTierOpen] = useState(false);

    // Defensive data mapping
    const tierPrices = Array.isArray(variant.tierPrices) ? variant.tierPrices : [];
    const basePrice = variant.price?.basePrice || 0;
    const currency = variant.price?.currency || "GHS";

    // Helper to update deeply nested objects without mutation
    const updatePrice = (field, value) => {
        onUpdate('price', {
            ...(variant.price || {}),
            [field]: value
        });
    };

    const updateDiscount = (field, value) => {
        onUpdate('discount', {
            ...(variant.discount || {}),
            [field]: value
        });
    };

    const addTier = () => {
        const newTiers = [...tierPrices, {
            variantId: variant._id,
            minQuantity: tierPrices.length > 0 ? tierPrices[tierPrices.length - 1].maxQuantity + 1 : 1,
            maxQuantity: tierPrices.length > 0 ? tierPrices[tierPrices.length - 1].maxQuantity + 10 : 10,
            price: basePrice,
            isActive: true
        }];
        onUpdate('tierPrices', newTiers);
        setIsTierOpen(true);
    };

    const updateTier = (index, field, value) => {
        const newTiers = [...tierPrices];
        newTiers[index] = { ...newTiers[index], [field]: value };
        onUpdate('tierPrices', newTiers);
    };

    const removeTier = (index) => {
        const newTiers = tierPrices.filter((_, i) => i !== index);
        onUpdate('tierPrices', newTiers);
    };

    return (
        <div className="flex flex-col bg-white border-b border-slate-200 transition-all hover:bg-slate-50/50">
            {/* MAIN ROW GRID */}
            <div className="grid grid-cols-[40px_1.2fr_1.8fr_1.8fr_160px_50px] items-center gap-5 px-6 py-6">

                {/* DRAG HANDLE */}
                <div className="flex justify-center">
                    <GripVertical size={20} className="text-slate-300 cursor-grab hover:text-indigo-500 transition-colors" />
                </div>

                {/* SECTION 1: IDENTIFICATION */}
                <div className="space-y-3">
                    <div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-50 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                            <Tag size={12} /> Variant
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 truncate px-0.5">
                            {variant.name || 'Untitled Variant'}
                        </h4>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-400">SKU:</span>
                            <span className="font-bold text-slate-700">{variant.sku || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Scope</label>
                        <select
                            value={variant.price?.scope || "VARIANT"}
                            onChange={(e) => {
                                updatePrice('scope', e.target.value);
                                updateDiscount('scope', e.target.value);
                            }}
                            className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-md p-2 outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="PRODUCT">Global (All Products)</option>
                            <option value="VARIANT">This Variant Only</option>
                        </select>
                    </div>
                </div>

                {/* SECTION 2: PRICE MODEL */}
                <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/50 space-y-3">
                    <label className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                        <DollarSign size={14} className="bg-indigo-600 text-white rounded-full p-0.5" /> Base Pricing
                    </label>

                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                            <input
                                type="number"
                                value={basePrice}
                                onChange={(e) => updatePrice('basePrice', Number(e.target.value))}
                                className="w-full pl-7 p-2 text-sm font-bold border border-slate-200 rounded-lg focus:border-indigo-400 outline-none"
                            />
                        </div>
                        <input
                            type="text"
                            value={currency}
                            onChange={(e) => updatePrice('currency', e.target.value.toUpperCase())}
                            className="w-16 p-2 text-xs text-center font-bold bg-white border border-slate-200 rounded-lg text-indigo-600 uppercase"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                                <Clock size={10} /> Start
                            </span>
                            <input
                                type="date"
                                value={variant.price?.validFrom?.split('T')[0] || ''}
                                onChange={(e) => updatePrice('validFrom', e.target.value)}
                                className="w-full p-2 text-[11px] border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                                <Calendar size={10} /> End
                            </span>
                            <input
                                type="date"
                                value={variant.price?.validTo?.split('T')[0] || ''}
                                onChange={(e) => updatePrice('validTo', e.target.value)}
                                className="w-full p-2 text-[11px] border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 3: DISCOUNT MODEL */}
                <div className="bg-rose-50/30 p-4 rounded-xl border border-rose-100/50 space-y-3">
                    <label className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                        <Percent size={14} className="bg-rose-600 text-white rounded-full p-0.5" /> Discounts
                    </label>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="0.00"
                                value={variant.discount?.value || 0}
                                onChange={(e) => updateDiscount('value', Number(e.target.value))}
                                className="w-full p-2 text-sm font-bold border border-slate-200 rounded-lg text-rose-700 outline-none"
                            />
                        </div>
                        <select
                            value={variant.discount?.discountType || "PERCENTAGE"}
                            onChange={(e) => updateDiscount('discountType', e.target.value)}
                            className="w-18 p-2 text-xs font-bold border border-slate-200 rounded-lg bg-white"
                        >
                            <option value="PERCENTAGE">% OFF</option>
                            <option value="FIXED">FLAT</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Min Qty</span>
                            <input
                                type="number"
                                value={variant.discount?.minQuantity || 1}
                                onChange={(e) => updateDiscount('minQuantity', Number(e.target.value))}
                                className="w-full p-2 text-[11px] border border-slate-200 rounded-md"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase ml-1">
                                <ArrowUpCircle size={10} /> Priority
                            </span>
                            <input
                                type="number"
                                value={variant.discount?.priority || 0}
                                onChange={(e) => updateDiscount('priority', Number(e.target.value))}
                                className="w-full p-2 text-[11px] border border-slate-200 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 4: CONTROLS */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => updatePrice('isActive', !variant.price?.isActive)}
                        className={`w-full py-2.5 rounded-lg text-[10px] font-black transition-all border ${variant.price?.isActive
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                    >
                        {variant.price?.isActive ? '● ACTIVE' : '○ INACTIVE'}
                    </button>

                    <button
                        onClick={() => setIsTierOpen(!isTierOpen)}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black border transition-all ${isTierOpen
                            ? 'bg-slate-800 border-slate-900 text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Layers size={14} />
                        {isTierOpen ? 'CLOSE' : 'TIERS'}
                        {isTierOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>

                {/* SECTION 5: DELETE */}
                <div className="flex justify-center">
                    <button
                        onClick={onRemove}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                        title="Remove Variant"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* EXPANDABLE TIER SECTION */}
            {isTierOpen && (
                <div className="px-10 pb-10 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl ring-1 ring-slate-800">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <ShieldCheck size={20} className="text-emerald-400" />
                                </div>
                                <div>
                                    <h5 className="text-white text-xs font-bold uppercase tracking-widest">Bulk Quantity Pricing</h5>
                                    <p className="text-slate-500 text-[10px] uppercase">Set specific prices for volume orders</p>
                                </div>
                            </div>
                            <button
                                onClick={addTier}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-full text-xs font-bold uppercase hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                            >
                                <Plus size={16} /> Add Pricing Tier
                            </button>
                        </div>

                        <div className="space-y-3">
                            {tierPrices.map((tier, idx) => (
                                <div key={idx} className="grid grid-cols-[1fr_1fr_1.5fr_50px] gap-4 items-end bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Min Quantity</label>
                                        <input
                                            type="number"
                                            value={tier.minQuantity}
                                            onChange={(e) => updateTier(idx, 'minQuantity', Number(e.target.value))}
                                            className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold focus:ring-1 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Max Quantity</label>
                                        <input
                                            type="number"
                                            value={tier.maxQuantity}
                                            onChange={(e) => updateTier(idx, 'maxQuantity', Number(e.target.value))}
                                            className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold focus:ring-1 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-emerald-400 uppercase ml-1">Special Tier Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-600">
                                                {currency}
                                            </span>
                                            <input
                                                type="number"
                                                value={tier.price}
                                                onChange={(e) => updateTier(idx, 'price', Number(e.target.value))}
                                                className="w-full pl-12 p-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-bold outline-none focus:bg-emerald-500/10"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pb-1">
                                        <button
                                            onClick={() => removeTier(idx)}
                                            className="p-3 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {tierPrices.length === 0 && (
                                <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                                    <Layers className="mx-auto text-slate-700 mb-2" size={32} />
                                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">No bulk pricing rules defined</p>
                                    <p className="text-slate-700 text-[10px] mt-1">Base price will apply to all quantities</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};