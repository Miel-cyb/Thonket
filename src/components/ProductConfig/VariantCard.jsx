import React from 'react';
import { ChevronUp, ChevronDown, Percent, Plus, Trash2, Tag, Layers, Calendar } from 'lucide-react';

// This component handles the variants of the products pricing with robust UI/UX enhancements.
export const VariantCard = ({
    variant,
    vIdx,
    currency,
    currentCost,
    isExpanded,
    toggleAccordion,
    onVariantChange,
    onRemoveVariant,
    onTierChange,
    onAddTier,
    onRemoveTier
}) => {
    // Safely parse values
    const basePrice = Number(variant?.basePrice || 0);
    const discountVal = Number(variant?.discountValue || 0);

    console.log('This is the variant of the code', variant);

    // Calculate effective promotional price
    let discountedPrice = basePrice;
    if (variant?.discountType === 'PERCENTAGE') {
        discountedPrice -= discountedPrice * (discountVal / 100);
    } else {
        discountedPrice -= discountVal;
    }
    if (discountedPrice < 0) discountedPrice = 0;

    // Calculate Margin relative to current cost basis (if cost is available)
    const marginPercent = currentCost > 0 && basePrice > 0
        ? (((basePrice - currentCost) / basePrice) * 100).toFixed(1)
        : null;

    const variantId = variant?._id || `variant-${vIdx}`;

    // Helper to format ISO date string (e.g., "2026-09-14T05:45:00.000Z") to HTML date input format ("YYYY-MM-DD")
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        // If it's already in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
        try {
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        } catch (e) {
            // fallback
        }
        return '';
    };

    // Helper to prevent leading zeros and clear '0' on focus for seamless typing
    const handleFocus = (e) => {
        if (e.target.value === '0' || e.target.value === '0.00') {
            e.target.value = '';
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200/95 shadow-xs overflow-hidden transition-all duration-300">
            {/* Accordion Header - Entire bar clickable for smooth expansion */}
            <div
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onClick={() => toggleAccordion(variant._id)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleAccordion(variant._id);
                    }
                }}
                className="p-4 md:p-6 bg-slate-50/70 hover:bg-slate-100/70 border-b border-slate-100 flex items-center justify-between gap-4 cursor-pointer transition-colors"
            >
                <div className="flex items-center gap-3.5 min-w-0">
                    <div
                        className="p-2 bg-white rounded-xl border border-slate-200 text-slate-700 transition-all shrink-0 shadow-2xs"
                        aria-hidden="true"
                    >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black text-slate-900 truncate">{variant?.variantName || variant?.name || `Variant ${vIdx + 1}`}</span>
                            {variant?.isDefault && (
                                <span className="text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 shrink-0">Default</span>
                            )}
                            {discountVal > 0 && (
                                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 flex items-center gap-1 shrink-0">
                                    <Percent size={12} /> Active Promo
                                </span>
                            )}
                            {marginPercent !== null && (
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border shrink-0 ${Number(marginPercent) >= 20 ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                    Margin: {marginPercent}%
                                </span>
                            )}
                        </div>
                        <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-2">
                            <span>SKU: {variant?.sku || 'N/A'}</span>
                            <span aria-hidden="true">•</span>
                            <span className="font-semibold text-slate-600">Base: {currency || variant?.currency || 'GHS'} {basePrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    aria-label={`Remove variant ${variant?.variantName || vIdx + 1}`}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent accordion toggle when deleting
                        onRemoveVariant(vIdx);
                    }}
                    className="text-rose-500 hover:text-rose-700 p-2.5 rounded-xl hover:bg-rose-50 transition-all shrink-0"
                    title="Remove Variant"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Accordion Expanded Content with smooth transition wrapper */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-4 sm:p-6 space-y-6">
                        {/* Basic Info Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor={`variant-name-${variantId}`} className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <Layers size={14} className="text-slate-400" /> Variant Name
                                </label>
                                <input
                                    id={`variant-name-${variantId}`}
                                    type="text"
                                    value={variant?.variantName || variant?.name || ''}
                                    onChange={(e) => onVariantChange(vIdx, 'variantName', e.target.value)}
                                    placeholder="e.g. 25kg Standard Bag"
                                    className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 transition-all outline-hidden"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor={`variant-sku-${variantId}`} className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <Tag size={14} className="text-slate-400" /> Variant SKU
                                </label>
                                <input
                                    id={`variant-sku-${variantId}`}
                                    type="text"
                                    value={variant?.sku || ''}
                                    onChange={(e) => onVariantChange(vIdx, 'sku', e.target.value)}
                                    placeholder="e.g. SKU-25KG"
                                    className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-mono text-slate-800 transition-all outline-hidden"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor={`variant-base-price-${variantId}`} className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                                    Base Price ({currency || variant?.currency || 'GHS'})
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-sm font-bold text-slate-400" aria-hidden="true">{currency || variant?.currency || 'GHS'}</span>
                                    <input
                                        id={`variant-base-price-${variantId}`}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={variant?.basePrice ?? ''}
                                        onFocus={handleFocus}
                                        onChange={(e) => onVariantChange(vIdx, 'basePrice', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 transition-all outline-hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Active Window / Date Range */}
                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200/60">
                                <Calendar size={14} className="text-slate-600" /> Pricing Availability Schedule
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor={`pricing-start-${variantId}`} className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Pricing Start Date (Valid From)</label>
                                    <input
                                        id={`pricing-start-${variantId}`}
                                        type="date"
                                        value={formatDateForInput(variant?.pricingStartDate || variant?.validFrom)}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            onVariantChange(vIdx, 'pricingStartDate', val);
                                            onVariantChange(vIdx, 'validFrom', val);
                                        }}
                                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-hidden transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor={`pricing-end-${variantId}`} className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Pricing End Date (Valid To)</label>
                                    <input
                                        id={`pricing-end-${variantId}`}
                                        type="date"
                                        value={formatDateForInput(variant?.pricingEndDate || variant?.validTo)}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            onVariantChange(vIdx, 'pricingEndDate', val);
                                            onVariantChange(vIdx, 'validTo', val);
                                        }}
                                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-hidden transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Promotional Sub-section */}
                        <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100/60">
                                <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Percent size={14} className="text-emerald-600" /> Promotional Discount & Schedule
                                </h4>
                                {discountVal > 0 && (
                                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-200/50 self-start sm:self-auto">
                                        Effective Promo Price: <span className="font-black">{currency || variant?.currency || 'GHS'} {discountedPrice.toFixed(2)}</span>
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor={`discount-type-${variantId}`} className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Discount Type</label>
                                    <select
                                        id={`discount-type-${variantId}`}
                                        value={variant?.discountType || 'PERCENTAGE'}
                                        onChange={(e) => onVariantChange(vIdx, 'discountType', e.target.value)}
                                        className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-hidden transition-all"
                                    >
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED">Fixed Amount ({currency || variant?.currency || 'GHS'})</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor={`discount-value-${variantId}`} className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Discount Value</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-sm font-semibold text-slate-400" aria-hidden="true">
                                            {variant?.discountType === 'PERCENTAGE' ? '%' : (currency || variant?.currency || 'GHS')}
                                        </span>
                                        <input
                                            id={`discount-value-${variantId}`}
                                            type="number"
                                            step={variant?.discountType === 'PERCENTAGE' ? '1' : '0.01'}
                                            min="0"
                                            max={variant?.discountType === 'PERCENTAGE' ? '100' : undefined}
                                            value={variant?.discountValue ?? ''}
                                            onFocus={handleFocus}
                                            onChange={(e) => onVariantChange(vIdx, 'discountValue', e.target.value)}
                                            placeholder="0"
                                            className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-900 outline-hidden transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor={`discount-start-${variantId}`} className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                                        <Calendar size={13} className="text-emerald-600" /> Discount Start Date
                                    </label>
                                    <input
                                        id={`discount-start-${variantId}`}
                                        type="date"
                                        value={formatDateForInput(variant?.discountStartDate || variant?.discount?.validFrom)}
                                        onChange={(e) => onVariantChange(vIdx, 'discountStartDate', e.target.value)}
                                        className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-hidden transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor={`discount-end-${variantId}`} className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                                        <Calendar size={13} className="text-emerald-600" /> Discount End Date
                                    </label>
                                    <input
                                        id={`discount-end-${variantId}`}
                                        type="date"
                                        value={formatDateForInput(variant?.discountEndDate || variant?.discount?.validTo)}
                                        onChange={(e) => onVariantChange(vIdx, 'discountEndDate', e.target.value)}
                                        className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-hidden transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Volume Tiers List */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h5 className="text-xs font-black text-slate-600 uppercase tracking-widest">Volume Pricing Tiers</h5>
                                    <p className="text-xs text-slate-400">Offer quantity-based tiered scaling discounts.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onAddTier(vIdx)}
                                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-xs font-bold bg-indigo-50 hover:bg-indigo-100/60 px-4 py-2.5 rounded-xl border border-indigo-100 transition-all shadow-2xs"
                                >
                                    <Plus size={14} /> Add Tier
                                </button>
                            </div>

                            <div className="space-y-3">
                                {variant?.tiers?.map((tier, tIdx) => {
                                    const tierId = tier?._id || `tier-${vIdx}-${tIdx}`;
                                    return (
                                        <div key={tierId} className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/80 hover:bg-slate-100/50 p-4 rounded-2xl border border-slate-200/60 transition-all">
                                            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 flex-wrap">
                                                <span className="w-8 shrink-0 text-xs font-black text-slate-500">Qty</span>
                                                <label htmlFor={`min-range-${tierId}`} className="sr-only">Minimum Quantity</label>
                                                <input
                                                    id={`min-range-${tierId}`}
                                                    type="number"
                                                    min="1"
                                                    value={tier?.minRange ?? ''}
                                                    onFocus={handleFocus}
                                                    onChange={(e) => onTierChange(vIdx, tIdx, 'minRange', e.target.value)}
                                                    className="w-24 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-center font-mono text-sm outline-hidden focus:border-indigo-500 transition-all shadow-2xs"
                                                    placeholder="Min"
                                                />
                                                <span className="text-slate-400 text-xs font-medium px-1" aria-hidden="true">to</span>
                                                <label htmlFor={`max-range-${tierId}`} className="sr-only">Maximum Quantity</label>
                                                <input
                                                    id={`max-range-${tierId}`}
                                                    type="text"
                                                    value={tier?.maxRange ?? ''}
                                                    onFocus={handleFocus}
                                                    onChange={(e) => onTierChange(vIdx, tIdx, 'maxRange', e.target.value)}
                                                    className="w-24 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-center font-mono text-sm outline-hidden focus:border-indigo-500 transition-all shadow-2xs"
                                                    placeholder="Max/+"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end gap-3 flex-1">
                                                <div className="flex items-center gap-2.5 flex-1 max-w-[280px] justify-end">
                                                    <span className="text-xs text-slate-500 shrink-0 font-medium">Tier Price:</span>
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-slate-400" aria-hidden="true">{currency || variant?.currency || 'GHS'}</span>
                                                        <label htmlFor={`tier-price-${tierId}`} className="sr-only">Tier Base Price</label>
                                                        <input
                                                            id={`tier-price-${tierId}`}
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={tier?.tierPrice ?? tier?.basePrice ?? ''}
                                                            onFocus={handleFocus}
                                                            onChange={(e) => onTierChange(vIdx, tIdx, 'tierPrice', e.target.value)}
                                                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-slate-900 outline-hidden transition-all shadow-2xs"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    aria-label={`Remove tier ${tIdx + 1}`}
                                                    onClick={() => onRemoveTier(vIdx, tIdx)}
                                                    disabled={!variant.tiers || variant.tiers.length <= 1}
                                                    className="text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 p-2.5 rounded-xl hover:bg-rose-50 transition-all shrink-0"
                                                    title={!variant.tiers || variant.tiers.length <= 1 ? "At least one tier required" : "Remove Tier"}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};