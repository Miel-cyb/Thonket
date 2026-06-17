import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ArrowLeft, Save, Trash2, Plus, Info, BarChart3,
    Layers, Tag, ShoppingBag, Eye, RefreshCw, DollarSign,
    Percent, Layers2, TrendingUp
} from 'lucide-react';
import { PriceVariantRow } from '../components/OperationsDashboard/setup/price/PriceVariantRow';
import { API_ENDPOINTS } from '../utils/urls';

const PriceDetailPage = ({ productId, onBack, onSyncSuccess }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Fetch single product and parse out base pricing records alongside variant options
    const fetchProductDetails = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_ENDPOINTS.PRICES}/catalog`);
            const matchedProduct = data?.products?.find(p => p._id === productId);

            if (matchedProduct) {
                initializeProductForm(matchedProduct);
            } else {
                alert("Targeted product cannot be located in current system instance.");
                onBack();
            }
        } catch (err) {
            console.error("Failed to load catalog details", err);
            alert("Error reading backend price layout mappings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchProductDetails();
    }, [productId]);

    // Align structural objects cleanly to ensure fields map without empty space gaps
    const initializeProductForm = (prod) => {
        const variants = prod.variants || [];
        const topLevelPrices = prod.productPrices || prod.prices || [];

        // Isolate standard product level rules distinct from matrices
        const basePriceObj = topLevelPrices.find(p => p.scope === 'PRODUCT' || !p.scope) || { basePrice: 0, currency: "GHS" };
        const discountObj = topLevelPrices.find(p => p.scope === 'DISCOUNT') || { value: 0, discountType: "PERCENTAGE", scope: "PRODUCT" };
        const tierPrices = topLevelPrices.filter(p => p.scope === 'TIER') || [];

        const initializedVariants = variants.map(v => {
            const existingDiscount = v.prices?.find(p => p.scope === 'DISCOUNT') || discountObj;
            const existingTiers = v.prices?.filter(p => p.scope === 'TIER') || [];

            return {
                _id: v._id,
                name: v.name || prod.name,
                sku: v.sku || 'N/A',
                unitOfMeasure: v.unitOfMeasure || 'PCS',
                pricing: {
                    base: v.prices?.filter(p => p.scope !== 'TIER' && p.scope !== 'DISCOUNT').length > 0
                        ? v.prices.filter(p => p.scope !== 'TIER' && p.scope !== 'DISCOUNT')
                        : [{ basePrice: basePriceObj.basePrice, currency: basePriceObj.currency }],
                    discounts: existingDiscount ? [{ ...existingDiscount }] : [{ ...discountObj, scope: "VARIANT" }],
                    tiers: existingTiers.length > 0 ? [...existingTiers] : []
                }
            };
        });

        const fallbackVariants = initializedVariants.length > 0 ? initializedVariants : [{
            _id: `standalone-${prod._id}`,
            name: prod.name,
            sku: prod.sku || prod.slug?.toUpperCase() || 'N/A',
            unitOfMeasure: 'PCS',
            pricing: {
                base: [{ basePrice: basePriceObj.basePrice, currency: basePriceObj.currency }],
                discounts: [{ ...discountObj }],
                tiers: [...tierPrices]
            }
        }];

        setProduct({
            ...prod,
            displayBasePrice: basePriceObj.basePrice,
            displayCurrency: basePriceObj.currency,
            globalDiscount: discountObj,
            globalTiers: tierPrices,
            variants: fallbackVariants
        });
    };

    // Upstream update triggers for high level values
    const handleGlobalPriceChange = (field, value) => {
        setProduct(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGlobalDiscountChange = (field, value) => {
        setProduct(prev => ({
            ...prev,
            globalDiscount: {
                ...prev.globalDiscount,
                [field]: value
            }
        }));
    };

    const handleAddGlobalTier = () => {
        setProduct(prev => ({
            ...prev,
            globalTiers: [...prev.globalTiers, { _id: `tier-${Date.now()}`, minQuantity: 10, basePrice: 0, currency: prev.displayCurrency, scope: 'TIER' }]
        }));
    };

    const handleGlobalTierChange = (index, field, value) => {
        setProduct(prev => {
            const updated = [...prev.globalTiers];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, globalTiers: updated };
        });
    };

    const handleRemoveGlobalTier = (index) => {
        setProduct(prev => ({
            ...prev,
            globalTiers: prev.globalTiers.filter((_, i) => i !== index)
        }));
    };

    const handleVariantUpdate = (variantIdx, model, patchData) => {
        setProduct(prev => {
            if (!prev) return null;
            const updatedVariants = prev.variants.map((variant, idx) => {
                if (idx !== variantIdx) return variant;
                return {
                    ...variant,
                    pricing: {
                        ...variant.pricing,
                        [model]: Array.isArray(patchData) ? [...patchData] : { ...variant.pricing[model], ...patchData }
                    }
                };
            });
            return { ...prev, variants: updatedVariants };
        });
    };

    const handleAddBlankVariant = () => {
        setProduct(prev => {
            if (!prev) return null;
            const newVariant = {
                _id: `new-variant-${Date.now()}`,
                name: `${prev.name} - Option Value`,
                sku: `SKU-${Date.now().toString().slice(-6)}`,
                unitOfMeasure: 'PCS',
                pricing: {
                    base: [{ basePrice: prev.displayBasePrice || 0, currency: prev.displayCurrency || "GHS" }],
                    discounts: [{ value: 0, discountType: "PERCENTAGE", scope: "VARIANT" }],
                    tiers: []
                }
            };
            return { ...prev, variants: [...prev.variants, newVariant] };
        });
    };

    const handleRemoveVariantLocal = (idx) => {
        setProduct(prev => {
            if (!prev) return null;
            return { ...prev, variants: prev.variants.filter((_, i) => i !== idx) };
        });
    };

    const handleSaveProduct = async () => {
        setSaving(true);
        const masterProductPrices = [
            { basePrice: Number(product.displayBasePrice), currency: product.displayCurrency, scope: 'PRODUCT' },
            { ...product.globalDiscount, value: Number(product.globalDiscount.value) },
            ...product.globalTiers.map(t => ({ ...t, minQuantity: Number(t.minQuantity), basePrice: Number(t.basePrice) }))
        ];

        try {
            await axios.post(`${API_ENDPOINTS.PRICES}/bulk-update`, {
                productId: product._id,
                productPrices: masterProductPrices,
                variants: product.variants
            });
            alert("Pricing parameters and volume tier configurations synced cleanly.");
            if (onSyncSuccess) onSyncSuccess();
        } catch (err) {
            alert("Save encountered errors: " + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProduct = async () => {
        if (!window.confirm(`Permanently remove "${product?.name}" from master operational logs?`)) return;
        setDeleting(true);
        try {
            await axios.delete(`${API_ENDPOINTS.PRICES}/${product._id}`);
            alert("Item erased from active database registries.");
            if (onSyncSuccess) onSyncSuccess();
            onBack();
        } catch (err) {
            alert("Purge operation dropped: " + (err.response?.data?.message || err.message));
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-slate-400 space-y-4">
                <RefreshCw className="animate-spin text-indigo-600" size={32} />
                <p className="text-base font-bold tracking-wider text-slate-500 uppercase">Reindexing Product Profile context maps...</p>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-full mx-auto pb-12">

            {/* Top Operational Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-indigo-600 uppercase tracking-wider transition-all bg-slate-100 hover:bg-slate-200/70 p-3 rounded-xl">
                        <ArrowLeft size={16} /> Dashboard
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{product.name}</h2>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-0.5">Brand Family: {product.brand || 'Unspecified Vendor'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleDeleteProduct}
                        disabled={saving || deleting}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 border border-rose-200 hover:border-rose-300 bg-rose-50 text-rose-600 px-6 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-colors"
                    >
                        <Trash2 size={16} /> {deleting ? 'Purging...' : 'Delete Product Record'}
                    </button>
                    <button
                        onClick={handleSaveProduct}
                        disabled={saving || deleting}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider shadow-md transition-all"
                    >
                        <Save size={16} /> {saving ? 'Syncing...' : 'Sync Price Structural Rules'}
                    </button>
                </div>
            </div>

            {/* General Description Info Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <ShoppingBag size={20} />
                    </div>
                    <div className="overflow-hidden">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Reference ID</span>
                        <span className="text-sm font-mono font-bold text-slate-700 block truncate">{product._id}</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <Layers size={20} />
                    </div>
                    <div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Operational Group</span>
                        <span className="text-sm font-bold text-slate-800 block">{product.category?.name || 'Standard Ledger Group'}</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <DollarSign size={20} />
                    </div>
                    <div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Base Item List Value</span>
                        <span className="text-sm font-black text-slate-900 block">{product.displayCurrency} {Number(product.displayBasePrice).toFixed(2)}</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <Eye size={20} className={product.isActive ? "text-emerald-500" : "text-slate-400"} />
                    </div>
                    <div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Visibility Status</span>
                        <span className="text-sm font-bold text-slate-800 block">{product.isActive ? "Live in Showrooms" : "Internal Stage Hold"}</span>
                    </div>
                </div>
            </div>

            {/* Global Base Pricing & Bulk Tiers Setup Area */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <TrendingUp className="text-indigo-600" size={18} />
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">Product Master Pricing & Quantity Tiers</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Base Configuration Fields */}
                    <div className="space-y-4 bg-slate-50/60 p-5 rounded-xl border border-slate-100">
                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                            <DollarSign size={14} className="text-slate-400" /> Base Definition
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-1">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Currency</label>
                                <input
                                    type="text"
                                    value={product.displayCurrency || ''}
                                    onChange={(e) => handleGlobalPriceChange('displayCurrency', e.target.value.toUpperCase())}
                                    className="w-full text-sm font-bold bg-white border border-slate-200 rounded-xl p-3.5 focus:outline-indigo-600 text-center"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Standard List Price</label>
                                <input
                                    type="number"
                                    value={product.displayBasePrice || ''}
                                    onChange={(e) => handleGlobalPriceChange('displayBasePrice', e.target.value)}
                                    className="w-full text-sm font-bold bg-white border border-slate-200 rounded-xl p-3.5 focus:outline-indigo-600"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200/60">
                            <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <Percent size={14} className="text-slate-400" /> Default Markdown Rule
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Type</label>
                                    <select
                                        value={product.globalDiscount?.discountType || 'PERCENTAGE'}
                                        onChange={(e) => handleGlobalDiscountChange('discountType', e.target.value)}
                                        className="w-full text-sm font-bold bg-white border border-slate-200 rounded-xl p-3.5 focus:outline-indigo-600 h-[50px] appearance-none"
                                    >
                                        <option value="PERCENTAGE">PERCENTAGE (%)</option>
                                        <option value="FLAT">FLAT VALUE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Rate / Value</label>
                                    <input
                                        type="number"
                                        value={product.globalDiscount?.value || 0}
                                        onChange={(e) => handleGlobalDiscountChange('value', e.target.value)}
                                        className="w-full text-sm font-bold bg-white border border-slate-200 rounded-xl p-3.5 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Bulk Tiers Fields */}
                    <div className="lg:col-span-2 space-y-4 bg-slate-50/60 p-5 rounded-xl border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                                    <Layers2 size={14} className="text-slate-400" /> Wholesales/Volume Break Scales
                                </h4>
                                <button
                                    onClick={handleAddGlobalTier}
                                    className="text-xs bg-white border border-slate-200 hover:border-indigo-200 text-indigo-600 font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                                >
                                    + Add Scale Bracket
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                                {product.globalTiers?.length === 0 ? (
                                    <div className="text-center py-10 text-slate-400 text-sm font-medium italic">
                                        No high level wholesale volume tier scales assigned to this product matrix framework.
                                    </div>
                                ) : (
                                    product.globalTiers?.map((tier, tIdx) => (
                                        <div key={tier._id || tIdx} className="grid grid-cols-12 gap-3 bg-white p-3 rounded-xl border border-slate-200/80 items-center">
                                            <div className="col-span-5">
                                                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">Min Quantity Threshold</span>
                                                <input
                                                    type="number"
                                                    value={tier.minQuantity || ''}
                                                    onChange={(e) => handleGlobalTierChange(tIdx, 'minQuantity', e.target.value)}
                                                    className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                                                    placeholder="10"
                                                />
                                            </div>
                                            <div className="col-span-5">
                                                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">Price Per Unit ({product.displayCurrency})</span>
                                                <input
                                                    type="number"
                                                    value={tier.basePrice || ''}
                                                    onChange={(e) => handleGlobalTierChange(tIdx, 'basePrice', e.target.value)}
                                                    className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="col-span-2 text-center pt-5">
                                                <button
                                                    onClick={() => handleRemoveGlobalTier(tIdx)}
                                                    className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Variant Control Matrix Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden w-full">
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <BarChart3 className="text-indigo-400" size={18} />
                        <span className="text-sm font-black text-white uppercase tracking-widest">Pricing Variant Matrix Layers ({product.variants.length})</span>
                    </div>
                    <button
                        onClick={handleAddBlankVariant}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors"
                    >
                        <Plus size={14} /> Append Variant Configuration
                    </button>
                </div>

                <div className="divide-y divide-slate-100 bg-white w-full overflow-x-auto">
                    {product.variants.length === 0 ? (
                        <div className="p-16 text-center text-slate-400 text-sm font-bold uppercase tracking-wider">
                            No discrete matrix option branches initialized yet. Generate rows above.
                        </div>
                    ) : (
                        <div className="min-w-[1000px] p-4 space-y-3">
                            {product.variants.map((v, idx) => (
                                <div key={v._id || `v-${idx}`} className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                                    <PriceVariantRow
                                        variant={v}
                                        onUpdate={(model, patchData) => handleVariantUpdate(idx, model, patchData)}
                                        onRemove={() => handleRemoveVariantLocal(idx)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PriceDetailPage;