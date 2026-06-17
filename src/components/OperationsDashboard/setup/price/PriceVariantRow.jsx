import React, { useState } from 'react';
import {
    GripVertical, DollarSign, Percent, Trash2, Layers, Plus,
    Tag, ShieldCheck, Calendar, Clock, ChevronDown, ChevronUp
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

    // 2. UPDATERS
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

    const formatDate = (dateStr) => (dateStr ? dateStr.split('T')[0] : '');

    return (
        <div className="flex flex-col bg-white border-b border-slate-200 transition-all hover:bg-slate-50/40">

            {/* MAIN ROW GRID */}
            <div className="grid grid-cols-[32px_1.5fr_2.2fr_2.2fr_170px_48px] items-center gap-5 px-6 py-4">

                {/* DRAG HANDLE */}
                <div className="flex justify-center">
                    <GripVertical size={18} className="text-slate-300 cursor-grab hover:text-slate-600 transition-colors" />
                </div>

                {/* SECTION 1: IDENTIFICATION */}
                <div className="space-y-2">
                    <div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                            <Tag size={10} /> Variant
                        </span>
                        <h4 className="text-sm font-semibold text-slate-800 truncate" title={variant.name}>
                            {variant.name || 'Standard SKU'}
                        </h4>
                    </div>

                    <div className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono flex items-center justify-between">
                        <span className="text-slate-400 font-medium">SKU</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[120px]">{variant.sku || '---'}</span>
                    </div>

                    <div className="space-y-1">
                        <select
                            value={basePricing.scope || "VARIANT"}
                            onChange={(e) => {
                                updatePrice('scope', e.target.value);
                                updateDiscount('scope', e.target.value);
                            }}
                            className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg p-1.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                        >
                            <option value="VARIANT">Specific Variant</option>
                            <option value="PRODUCT">Global (Product)</option>
                        </select>
                    </div>
                </div>

                {/* SECTION 2: BASE PRICE MODEL */}
                <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/60 space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign size={12} className="text-slate-400" /> Market Pricing
                    </label>

                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono font-bold">{currency}</span>
                        <input
                            type="number"
                            value={basePrice}
                            onChange={(e) => updatePrice('basePrice', Number(e.target.value))}
                            className="w-full pl-12 pr-3 py-1.5 text-sm font-semibold border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                <Clock size={10} /> Starts
                            </span>
                            <input
                                type="date"
                                value={formatDate(basePricing.validFrom)}
                                onChange={(e) => updatePrice('validFrom', e.target.value)}
                                className="w-full p-1.5 text-[11px] font-medium border border-slate-200 bg-white rounded-md text-slate-700 outline-none focus:border-slate-400 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                <Calendar size={10} /> Ends
                            </span>
                            <input
                                type="date"
                                value={formatDate(basePricing.validTo)}
                                onChange={(e) => updatePrice('validTo', e.target.value)}
                                className="w-full p-1.5 text-[11px] font-medium border border-slate-200 bg-white rounded-md text-slate-700 outline-none focus:border-slate-400 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 3: DISCOUNT STRATEGY */}
                <div className="bg-rose-50/20 p-4 rounded-xl border border-rose-100/60 space-y-3">
                    <label className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Percent size={12} className="text-rose-500" /> Reduction / Markdown
                    </label>

                    <div className="flex gap-1.5">
                        <input
                            type="number"
                            value={discountData.value || 0}
                            onChange={(e) => updateDiscount('value', Number(e.target.value))}
                            className="w-full px-3 py-1.5 text-sm font-semibold border border-slate-200 rounded-lg bg-white text-rose-700 focus:ring-2 focus:ring-rose-500/10 focus:border-rose-400 outline-none transition-all shadow-sm"
                            placeholder="0.00"
                        />
                        <select
                            value={discountData.discountType || "PERCENTAGE"}
                            onChange={(e) => updateDiscount('discountType', e.target.value)}
                            className="w-24 px-2 py-1.5 text-[11px] font-semibold border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:border-slate-400 transition-all"
                        >
                            <option value="PERCENTAGE">% OFF</option>
                            <option value="FIXED">FLAT</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Min Qty</span>
                            <input
                                type="number"
                                value={discountData.minQuantity || 1}
                                onChange={(e) => updateDiscount('minQuantity', Number(e.target.value))}
                                className="w-full p-1.5 text-[11px] font-medium border border-slate-200 bg-white rounded-md text-slate-700 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Priority</span>
                            <input
                                type="number"
                                value={discountData.priority || 0}
                                onChange={(e) => updateDiscount('priority', Number(e.target.value))}
                                className="w-full p-1.5 text-[11px] font-medium border border-slate-200 bg-white rounded-md text-slate-700 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 4: ACTIONS */}
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => updatePrice('isActive', !basePricing.isActive)}
                        className={`w-full py-2 rounded-lg text-[11px] font-bold border transition-all text-center tracking-wide shadow-sm ${basePricing.isActive
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/60'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100/80'
                            }`}
                    >
                        {basePricing.isActive ? '● MARKET LIVE' : '○ DISABLED'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsTierOpen(!isTierOpen)}
                        className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold border transition-all shadow-sm ${isTierOpen
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Layers size={12} />
                        <span>Tiers</span>
                        {isTierOpen ? <ChevronUp size={12} className="ml-0.5" /> : <ChevronDown size={12} className="ml-0.5" />}
                    </button>
                </div>

                {/* SECTION 5: DELETE */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all group"
                    >
                        <Trash2 size={18} className="group-hover:scale-105 transition-transform" />
                    </button>
                </div>
            </div>

            {/* EXPANDABLE BULK TIERS DRAWER */}
            {isTierOpen && (
                <div className="px-6 pb-5 pt-1 bg-slate-50/50 border-t border-slate-100 animate-fadeIn">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-emerald-50 rounded-lg">
                                    <ShieldCheck size={16} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Quantity Breaks & Tiers</h5>
                                    <p className="text-slate-400 text-[10px] font-medium mt-0.5">
                                        Set up customized bulk processing scales for {variant.sku || 'this stock element'}.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addTier}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[11px] font-semibold hover:bg-indigo-700 transition-all shadow-sm"
                            >
                                <Plus size={14} /> Add Scale Tier
                            </button>
                        </div>

                        <div className="space-y-2.5">
                            {tierPrices.map((tier, idx) => (
                                <div key={tier._id || idx} className="grid grid-cols-[1fr_1fr_1.2fr_40px] gap-4 items-end bg-slate-50/40 p-3.5 rounded-lg border border-slate-200/60 transition-all hover:border-slate-300">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase">Min Units</label>
                                        <input
                                            type="number"
                                            value={tier.minQuantity}
                                            onChange={(e) => updateTier(idx, 'minQuantity', Number(e.target.value))}
                                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800 text-xs font-medium focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase">Max Units</label>
                                        <input
                                            type="number"
                                            value={tier.maxQuantity}
                                            onChange={(e) => updateTier(idx, 'maxQuantity', Number(e.target.value))}
                                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800 text-xs font-medium focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-emerald-600 uppercase">Price per unit ({currency})</label>
                                        <input
                                            type="number"
                                            value={tier.price}
                                            onChange={(e) => updateTier(idx, 'price', Number(e.target.value))}
                                            className="w-full px-3 py-1.5 bg-emerald-50/30 border border-emerald-200 rounded-md text-emerald-700 text-xs font-semibold focus:border-emerald-500 outline-none"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeTier(idx)}
                                        className="mb-0.5 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all flex justify-center"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}

                            {tierPrices.length === 0 && (
                                <div className="text-center py-8 border border-dashed border-slate-200 rounded-lg bg-slate-50/30">
                                    <p className="text-slate-400 text-xs font-medium">No wholesale scales active on this item.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};