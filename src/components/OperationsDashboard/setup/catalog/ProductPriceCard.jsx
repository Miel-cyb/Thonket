import React from 'react';
import { Package, ArrowRight, Layers, Eye } from 'lucide-react';

export const ProductPriceCard = ({ product, onSelect }) => {
    const variantList = product.variants || [];
    const maxVisibleVariants = 2; // Keep the card height predictable and clean
    const visibleVariants = variantList.slice(0, maxVisibleVariants);
    const hiddenVariantsCount = variantList.length - maxVisibleVariants;

    // 1. Extract Master Product Level Catalog Price
    const rawProductPriceObj = product.productPrices?.find(pr => pr.scope === 'PRODUCT' && pr.isActive) || product.productPrices?.[0];
    const productBasePrice = rawProductPriceObj
        ? `${rawProductPriceObj.currency || 'GHS'} ${Number(rawProductPriceObj.basePrice).toFixed(2)}`
        : 'No Base Price';

    console.log('this is the details of the selected product', product);

    return (
        <div
            onClick={() => onSelect(product)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:border-indigo-500 hover:shadow-xl cursor-pointer"
        >
            {/* Header / Info Strip */}
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
                                {product.brand || 'Generic Brand'}
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

                {/* Main Product Catalog Price Banner */}
                <div className="mt-5 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/40 px-4 py-3.5">
                    <span className="text-sm font-semibold text-indigo-900 tracking-wide">Product Catalog Price</span>
                    <span className="font-mono text-lg font-bold text-indigo-600">{productBasePrice}</span>
                </div>
            </div>

            {/* Clean, Non-Scrolling Active Variants Preview Section */}
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

                            // 2. EXTRACT VARIANT LEVEL BASE PRICE CORRECTLY
                            const variantPriceObj = v.prices?.find(p => p.scope === 'VARIANT' && p.isActive) || v.prices?.[0];
                            const variantPriceDisplay = variantPriceObj
                                ? `${variantPriceObj.currency || 'GHS'} ${Number(variantPriceObj.basePrice).toFixed(2)}`
                                : 'Unpriced';

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
                                            <span className="text-sm font-semibold text-slate-700 truncate max-w-[160px]">
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

                                        {/* Logistics metadata layout style fix */}
                                        <div className="mt-1.5 text-xs text-slate-400 font-medium">
                                            {v.weightKg || 0}kg • {v.volumeM3 || 0}m³ • {v.unitOfMeasure || 'pcs'}
                                        </div>
                                    </div>

                                    {/* 3. DISPLAY THE VARIANT PRICE TAG */}
                                    <div className="text-right shrink-0 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                        <span className="font-mono text-sm font-bold text-slate-800 block">
                                            {variantPriceDisplay}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Footer Interactive Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-4 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                <span className="text-sm font-semibold tracking-wide uppercase flex items-center gap-2">
                    {hiddenVariantsCount > 0 ? (
                        <>
                            <Eye size={16} /> View All {variantList.length} Variants
                        </>
                    ) : (
                        'Configure Pricing Matrix'
                    )}
                </span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
        </div>
    );
};