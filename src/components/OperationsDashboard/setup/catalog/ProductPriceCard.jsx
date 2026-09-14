import React from 'react';
import { Package, ArrowRight, Layers, Eye, Clock, AlertCircle, Coins, AlertTriangle } from 'lucide-react';

export const ProductPriceCard = ({ product, onSelect }) => {
    const variantList = product.variants || [];
    const maxVisibleVariants = 2;
    const visibleVariants = variantList.slice(0, maxVisibleVariants);
    const hiddenVariantsCount = variantList.length - maxVisibleVariants;

    // Resolve category name safely from object or fallback fields
    const categoryName =
        (typeof product.category === 'object' && product.category?.name) ||
        product.categoryName ||
        (typeof product.categoryId === 'object' && product.categoryId?.name) ||
        'Uncategorized';

    // Helper logic to compute pricing status, retrieve price value, and handle expiry checks
    const getVariantStatus = (v) => {
        const prices = v.prices || [];

        // Find the numerical price value for fallback or explicit display
        let numericPrice = 0;
        const matchedPriceObj = prices.find(p => Number(p.basePrice) > 0 || Number(p.price) > 0);

        if (matchedPriceObj) {
            numericPrice = Number(matchedPriceObj.basePrice || matchedPriceObj.price || 0);
        } else if (Number(v.basePrice) > 0) {
            numericPrice = Number(v.basePrice);
        } else if (Number(v.price) > 0) {
            numericPrice = Number(v.price);
        }

        const hasBasePrice = numericPrice > 0;

        // Check for expiry or upcoming expiration date
        const expiryDateStr = v.expiryDate || v.expiresAt || v.validUntil;
        let isExpiringSoon = false;
        let isExpired = false;

        if (expiryDateStr) {
            const expiryDate = new Date(expiryDateStr);
            const today = new Date();
            const diffTime = expiryDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                isExpired = true;
            } else if (diffDays <= 30) {
                isExpiringSoon = true;
            }
        }

        return {
            hasBasePrice,
            numericPrice,
            expiryDateStr,
            isExpiringSoon,
            isExpired
        };
    };

    return (
        <div
            onClick={() => onSelect(product)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:border-indigo-500 hover:shadow-xl cursor-pointer"
        >
            <div className="p-5 bg-white">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-colors duration-200 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                            <Package size={22} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-base font-semibold text-slate-800 transition-colors duration-200 group-hover:text-indigo-600 truncate">
                                {product.name}
                            </h3>
                            <p className="mt-0.5 text-sm text-slate-400 font-medium tracking-wide">
                                {product.brand || 'Nestle'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold tracking-wide ${product.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-slate-50 text-slate-500 border border-slate-200'
                            }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                            <Layers size={13} className="text-slate-400" />
                            {variantList.length} SKUs
                        </span>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/40 px-4 py-3.5">
                    <span className="text-sm font-semibold text-indigo-900 tracking-wide">Category</span>
                    <span className="font-medium text-xs text-indigo-700 truncate max-w-[200px]" title={categoryName}>
                        {categoryName}
                    </span>
                </div>
            </div>

            <div className="flex-1 border-t border-slate-100 bg-slate-50/50 p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Active Variants Matrix
                    </p>
                    {hiddenVariantsCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            +{hiddenVariantsCount} more
                        </span>
                    )}
                </div>

                <div className="space-y-2.5">
                    {variantList.length === 0 ? (
                        <p className="text-sm text-slate-400 italic py-2">No variants created under this blueprint.</p>
                    ) : (
                        visibleVariants.map(v => {
                            const attributeBadges = v.attributes ? Object.entries(v.attributes).map(([key, val]) => `${key}: ${val}`) : [];
                            const { hasBasePrice, numericPrice, isExpiringSoon, isExpired, expiryDateStr } = getVariantStatus(v);

                            return (
                                <div
                                    key={v._id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelect(product);
                                    }}
                                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all duration-150 hover:border-slate-300 hover:bg-slate-50/30"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">
                                                {v.name}
                                            </span>
                                            <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200/40">
                                                {v.sku}
                                            </span>
                                        </div>

                                        {attributeBadges.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {attributeBadges.map((badge, bIdx) => (
                                                    <span
                                                        key={bIdx}
                                                        className="text-[11px] font-medium bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100"
                                                    >
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-1.5 text-xs text-slate-400 font-medium">
                                            {v.weightKg || 0}kg • {v.volumeM3 || 0}m³ • {v.unitOfMeasure || 'pcs'}
                                        </div>
                                    </div>

                                    {/* Price and Expiry Status Badges */}
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        {/* Pricing indicator with Ghanaian Cedis formatting and missing price in red */}
                                        {hasBasePrice ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                                <Coins size={11} />
                                                GH₵ {numericPrice.toFixed(2)}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-rose-50 text-rose-600 border border-rose-200/60">
                                                <AlertTriangle size={11} />
                                                Price Missing
                                            </span>
                                        )}

                                        {/* Expiry indicator */}
                                        {isExpired ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-rose-50 text-rose-700 border border-rose-200/60" title={`Expired on: ${expiryDateStr}`}>
                                                <AlertCircle size={10} /> Expired
                                            </span>
                                        ) : isExpiringSoon ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-amber-50 text-amber-700 border border-amber-200/60" title={`Expiring on: ${expiryDateStr}`}>
                                                <Clock size={10} /> Expiring Soon
                                            </span>
                                        ) : expiryDateStr ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-slate-400">
                                                <Clock size={10} /> Valid
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-4 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                <span className="text-sm font-semibold tracking-wide uppercase flex items-center gap-2">
                    {hiddenVariantsCount > 0 ? (
                        <>
                            <Eye size={16} /> View All {variantList.length} Variants
                        </>
                    ) : (
                        'Configure Variant Matrix'
                    )}
                </span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
        </div>
    );
};