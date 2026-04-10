import React, { useState } from 'react';
import {
    GripVertical, DollarSign, Percent, Trash2, Layers, Plus,
    Tag, ShieldCheck, Calendar, Clock
} from 'lucide-react';

export const PriceVariantRow = ({ variant, onUpdate, onRemove }) => {
    const [isTierOpen, setIsTierOpen] = useState(false);

    if (!variant) return null;

    // 1. DATA MAPPING
    const basePricing = variant.pricing?.base?.[0] || {};
    const discountData = variant.pricing?.discounts?.[0] || {};
    const tierPrices = Array.isArray(variant.pricing?.tiers) ? variant.pricing.tiers : [];

    const basePrice = basePricing.basePrice || 0;
    const currency = basePricing.currency || "GHS";

    // 2. UPDATERS (Corrected to pass specific sub-model keys to parent)
    const updatePrice = (field, value) => {
        const updatedBase = [{ ...basePricing, [field]: value }];
        onUpdate('base', updatedBase);
    };

    const updateDiscount = (field, value) => {
        const updatedDiscounts = [{ ...discountData, [field]: value }];
        onUpdate('discounts', updatedDiscounts);
    };

    const updateTier = (index, field, value) => {
        const newTiers = [...tierPrices];
        newTiers[index] = { ...newTiers[index], [field]: value };
        onUpdate('tiers', newTiers);
    };

    const addTier = () => {
        const lastTier = tierPrices[tierPrices.length - 1];
        const newTiers = [...tierPrices, {
            variantId: variant._id,
            minQuantity: lastTier ? Number(lastTier.maxQuantity) + 1 : 1,
            maxQuantity: lastTier ? Number(lastTier.maxQuantity) + 10 : 10,
            price: basePrice,
            isActive: true
        }];
        onUpdate('tiers', newTiers);
        setIsTierOpen(true);
    };

    const removeTier = (index) => {
        const newTiers = tierPrices.filter((_, i) => i !== index);
        onUpdate('tiers', newTiers);
    };

    // Helper for date formatting
    const formatDate = (dateStr) => (dateStr ? dateStr.split('T')[0] : '');

    return (
        <div className="flex flex-col bg-white border-b border-slate-200 transition-all hover:bg-slate-50/50">
            {/* MAIN ROW GRID */}
            <div className="grid grid-cols-[40px_1.4fr_2fr_2fr_180px_50px] items-center gap-6 px-6 py-8">

                {/* DRAG HANDLE */}
                <div className="flex justify-center">
                    <GripVertical size={20} className="text-slate-300 cursor-grab hover:text-indigo-500 transition-colors" />
                </div>

                {/* SECTION 1: IDENTIFICATION */}
                <div className="space-y-3">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-1.5">
                            <Tag size={12} /> Variant
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 truncate px-0.5" title={variant.name}>
                            {variant.name || 'Standard SKU'}
                        </h4>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-400 font-bold uppercase">SKU:</span>
                            <span className="font-black text-slate-800">{variant.sku || '---'}</span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Update Scope</label>
                        <select
                            value={basePricing.scope || "VARIANT"}
                            onChange={(e) => {
                                updatePrice('scope', e.target.value);
                                updateDiscount('scope', e.target.value);
                            }}
                            className="w-full text-[11px] font-black bg-white border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500/10"
                        >
                            <option value="VARIANT">Specific Variant</option>
                            <option value="PRODUCT">Global (Product)</option>
                        </select>
                    </div>
                </div>

                {/* SECTION 2: BASE PRICE MODEL */}
                <div className="bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100/50 space-y-4">
                    <label className="text-[10px] font-black text-indigo-700 uppercase tracking-widest flex items-center gap-2">
                        <DollarSign size={14} className="bg-indigo-600 text-white rounded-full p-0.5" /> Market Price
                    </label>

                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-black">{currency}</span>
                            <input
                                type="number"
                                value={basePrice}
                                onChange={(e) => updatePrice('basePrice', Number(e.target.value))}
                                className="w-full pl-12 p-2.5 text-sm font-black border border-slate-200 rounded-xl focus:border-indigo-400 outline-none shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1 ml-1">
                                <Clock size={10} /> Starts
                            </span>
                            <input
                                type="date"
                                value={formatDate(basePricing.validFrom)}
                                onChange={(e) => updatePrice('validFrom', e.target.value)}
                                className="w-full p-2 text-[10px] font-bold border border-slate-200 rounded-lg"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1 ml-1">
                                <Calendar size={10} /> Ends
                            </span>
                            <input
                                type="date"
                                value={formatDate(basePricing.validTo)}
                                onChange={(e) => updatePrice('validTo', e.target.value)}
                                className="w-full p-2 text-[10px] font-bold border border-slate-200 rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 3: DISCOUNT STRATEGY */}
                <div className="bg-rose-50/30 p-5 rounded-2xl border border-rose-100/50 space-y-4">
                    <label className="text-[10px] font-black text-rose-700 uppercase tracking-widest flex items-center gap-2">
                        <Percent size={14} className="bg-rose-600 text-white rounded-full p-0.5" /> Discount
                    </label>

                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={discountData.value || 0}
                            onChange={(e) => updateDiscount('value', Number(e.target.value))}
                            className="flex-1 p-2.5 text-sm font-black border border-slate-200 rounded-xl text-rose-700 outline-none"
                            placeholder="0.00"
                        />
                        <select
                            value={discountData.discountType || "PERCENTAGE"}
                            onChange={(e) => updateDiscount('discountType', e.target.value)}
                            className="w-20 p-2 text-[10px] font-black border border-slate-200 rounded-xl bg-white"
                        >
                            <option value="PERCENTAGE">% OFF</option>
                            <option value="FIXED">FLAT</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase ml-1">Min Qty</span>
                            <input
                                type="number"
                                value={discountData.minQuantity || 1}
                                onChange={(e) => updateDiscount('minQuantity', Number(e.target.value))}
                                className="w-full p-2 text-[10px] font-bold border border-slate-200 rounded-lg"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase ml-1">Priority</span>
                            <input
                                type="number"
                                value={discountData.priority || 0}
                                onChange={(e) => updateDiscount('priority', Number(e.target.value))}
                                className="w-full p-2 text-[10px] font-bold border border-slate-200 rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 4: ACTIONS */}
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => updatePrice('isActive', !basePricing.isActive)}
                        className={`w-full py-3 rounded-xl text-[10px] font-black border transition-all ${basePricing.isActive
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                    >
                        {basePricing.isActive ? '● MARKET LIVE' : '○ DISABLED'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsTierOpen(!isTierOpen)}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black border transition-all ${isTierOpen
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Layers size={14} />
                        {isTierOpen ? 'HIDE TIERS' : 'BULK TIERS'}
                    </button>
                </div>

                {/* SECTION 5: DELETE */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all group"
                    >
                        <Trash2 size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            {/* EXPANDABLE BULK TIERS */}
            {isTierOpen && (
                <div className="px-10 pb-12 block opacity-100 visible">
                    <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                    <ShieldCheck size={24} className="text-emerald-400" />
                                </div>
                                <div>
                                    <h5 className="text-white text-xs font-black uppercase tracking-widest">Quantity Tiers</h5>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase mt-0.5">
                                        Custom rates for {variant.sku || 'this variant'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addTier}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-400 shadow-lg"
                            >
                                <Plus size={16} /> New Tier
                            </button>
                        </div>

                        <div className="space-y-3">
                            {tierPrices.map((tier, idx) => (
                                <div key={tier._id || idx} className="grid grid-cols-[1fr_1fr_1.5fr_50px] gap-6 items-end bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-500 uppercase">Min Qty</label>
                                        <input
                                            type="number"
                                            value={tier.minQuantity}
                                            onChange={(e) => updateTier(idx, 'minQuantity', Number(e.target.value))}
                                            className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-black"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-500 uppercase">Max Qty</label>
                                        <input
                                            type="number"
                                            value={tier.maxQuantity}
                                            onChange={(e) => updateTier(idx, 'maxQuantity', Number(e.target.value))}
                                            className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-black"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-emerald-400 uppercase">Tier Price ({currency})</label>
                                        <input
                                            type="number"
                                            value={tier.price}
                                            onChange={(e) => updateTier(idx, 'price', Number(e.target.value))}
                                            className="w-full p-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-black"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeTier(idx)}
                                        className="mb-1 p-2.5 text-slate-500 hover:text-rose-400 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}

                            {tierPrices.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl">
                                    <p className="text-slate-600 text-[10px] font-black uppercase">No active quantity tiers</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};