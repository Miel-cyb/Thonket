import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, Save, Trash2, Plus, BarChart3,
    Layers, ShoppingBag, Eye, RefreshCw, DollarSign,
    Percent, Layers2, TrendingUp, ChevronDown, Calendar
} from 'lucide-react';
import { PriceVariantRow } from '../components/OperationsDashboard/setup/price/PriceVariantRow';
import { API_ENDPOINTS } from '../utils/urls';

// Helper to safely format dates for HTML Date Inputs (YYYY-MM-DD)
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
};

const PriceDetailPage = ({ onSyncSuccess }) => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchProductDetails = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_ENDPOINTS.PRICES}/single/${productId}`);

            console.log('this is the data showing the detail', data)

            let targetProduct = null;
            if (data) {
                if (data._id === productId || data.id === productId) {
                    targetProduct = data;
                } else if (data.product && (data.product._id === productId || data.product.id === productId)) {
                    targetProduct = data.product;
                } else if (Array.isArray(data.products)) {
                    targetProduct = data.products.find(p => p._id === productId || p.id === productId);
                } else if (data.data) {
                    targetProduct = data.data._id === productId ? data.data : data.data.product;
                }
            }

            if (targetProduct) {
                initializeProductForm(targetProduct);
            } else {
                alert("Targeted product cannot be located in current system instance.");
                navigate(-1);
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

    const initializeProductForm = (prod) => {
        const variants = prod.variants || [];
        const topLevelPrices = prod.productPrices || prod.prices || [];

        const basePriceObj = topLevelPrices.find(p => p.scope === 'PRODUCT' || !p.scope) || {
            basePrice: 0,
            currency: "GHS",
            startDate: "",
            endDate: ""
        };
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
                        : [{ basePrice: basePriceObj.basePrice, currency: basePriceObj.currency, startDate: basePriceObj.startDate, endDate: basePriceObj.endDate }],
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
                base: [{ basePrice: basePriceObj.basePrice, currency: basePriceObj.currency, startDate: basePriceObj.startDate, endDate: basePriceObj.endDate }],
                discounts: [{ ...discountObj }],
                tiers: [...tierPrices]
            }
        }];

        setProduct({
            ...prod,
            displayBasePrice: basePriceObj.basePrice,
            displayCurrency: basePriceObj.currency,
            startDate: basePriceObj.startDate || "",
            endDate: basePriceObj.endDate || "",
            globalDiscount: discountObj,
            globalTiers: tierPrices,
            variants: fallbackVariants
        });
    };

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
                    base: [{ basePrice: prev.displayBasePrice || 0, currency: prev.displayCurrency || "GHS", startDate: prev.startDate || "", endDate: prev.endDate || "" }],
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
        if (!product) return;
        setSaving(true);
        const masterProductPrices = [
            {
                basePrice: Number(product.displayBasePrice),
                currency: product.displayCurrency,
                startDate: product.startDate,
                endDate: product.endDate,
                scope: 'PRODUCT'
            },
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
        if (!product) return;
        if (!window.confirm(`Permanently remove "${product?.name}" from master operational logs?`)) return;
        setDeleting(true);
        try {
            await axios.delete(`${API_ENDPOINTS.PRICES}/${product._id}`);
            alert("Item erased from active database registries.");
            if (onSyncSuccess) onSyncSuccess();
            navigate(-1);
        } catch (err) {
            alert("Purge operation dropped: " + (err.response?.data?.message || err.message));
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 space-y-4">
                <RefreshCw className="animate-spin text-indigo-600" size={36} />
                <p className="text-sm font-semibold tracking-wider text-slate-500 uppercase">Reindexing Product Profile context maps...</p>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-7xl mx-auto p-6 md:p-8 bg-slate-50 min-h-screen text-slate-600 selection:bg-indigo-50 selection:text-indigo-900">
            {/* Top Operational Action Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 uppercase tracking-wider transition-all bg-slate-100 hover:bg-indigo-50/50 p-3 rounded-xl border border-transparent hover:border-indigo-100 active:scale-95"
                    >
                        <ArrowLeft size={16} /> Dashboard
                    </button>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{product.name}</h2>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">Brand Family: <span className="text-slate-700 font-medium normal-case">{product.brand || 'Unspecified Vendor'}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button
                        onClick={handleDeleteProduct}
                        disabled={saving || deleting}
                        className="flex-1 lg:flex-initial flex items-center justify-center gap-2 border border-rose-200 hover:border-rose-300 bg-rose-50/50 hover:bg-rose-50 text-rose-600 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95"
                    >
                        <Trash2 size={15} /> {deleting ? 'Purging...' : 'Delete Product'}
                    </button>
                    <button
                        onClick={handleSaveProduct}
                        disabled={saving || deleting}
                        className="flex-1 lg:flex-initial flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-indigo-100 hover:shadow-lg transition-all active:scale-95"
                    >
                        <Save size={15} /> {saving ? 'Syncing...' : 'Sync Structural Rules'}
                    </button>
                </div>
            </div>

            {/* General Description Grid KPI Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 border border-slate-100">
                        <ShoppingBag size={20} />
                    </div>
                    <div className="overflow-hidden">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Reference ID</span>
                        <span className="text-sm font-mono font-medium text-slate-800 block truncate mt-0.5">{product._id}</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50/60 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100/50">
                        <Layers size={20} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Operational Group</span>
                        <span className="text-sm font-semibold text-slate-800 block mt-0.5">{product.category?.name || 'Standard Ledger Group'}</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50/60 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100/50">
                        <DollarSign size={20} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Base List Value</span>
                        <span className="text-sm font-bold text-emerald-700 block mt-0.5">{product.displayCurrency} {Number(product.displayBasePrice).toFixed(2)}</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        <Eye size={20} className={product.isActive ? "text-emerald-500" : "text-slate-400"} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Visibility Status</span>
                        <span className={`text-sm font-semibold block mt-0.5 ${product.isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {product.isActive ? "Live in Showrooms" : "Internal Stage Hold"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Pricing Parameters & Wholesale Quantity Matrix Configuration Panel */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <TrendingUp className="text-indigo-600" size={20} />
                    <h3 className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-wider">Product Master Pricing & Quantity Tiers</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Column 1: Base Price Definition + Discount Forms */}
                    <div className="space-y-5 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-inner">
                        <div>
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <span className="w-1.5 h-3 bg-indigo-600 rounded-xs block"></span> Base Definition
                            </h4>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="col-span-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Currency</label>
                                    <input
                                        type="text"
                                        value={product.displayCurrency || ''}
                                        onChange={(e) => handleGlobalPriceChange('displayCurrency', e.target.value.toUpperCase())}
                                        className="w-full text-sm font-semibold bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-center uppercase shadow-xs transition-all"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Standard List Price</label>
                                    <input
                                        type="number"
                                        value={product.displayBasePrice || ''}
                                        onChange={(e) => handleGlobalPriceChange('displayBasePrice', e.target.value)}
                                        className="w-full text-sm font-semibold bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs transition-all"
                                    />
                                </div>
                            </div>

                            {/* Added Price Activation Window Block */}
                            <div className="space-y-3 pt-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <Calendar size={12} className="text-indigo-500" /> Price Activation Window
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-[9px] font-medium text-slate-400 block mb-1">Starts On</span>
                                        <input
                                            type="date"
                                            value={formatDate(product.startDate)}
                                            onChange={(e) => handleGlobalPriceChange('startDate', e.target.value)}
                                            className="w-full p-2.5 text-xs font-semibold border border-slate-200 bg-white rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-xs"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-medium text-slate-400 block mb-1">Ends On</span>
                                        <input
                                            type="date"
                                            value={formatDate(product.endDate)}
                                            onChange={(e) => handleGlobalPriceChange('endDate', e.target.value)}
                                            className="w-full p-2.5 text-xs font-semibold border border-slate-200 bg-white rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-5 border-t border-slate-200">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <span className="w-1.5 h-3 bg-indigo-600 rounded-xs block"></span> Default Markdown Rule
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Type</label>
                                    <select
                                        value={product.globalDiscount?.discountType || 'PERCENTAGE'}
                                        onChange={(e) => handleGlobalDiscountChange('discountType', e.target.value)}
                                        className="w-full text-xs font-bold bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs transition-all appearance-none h-[46px]"
                                    >
                                        <option value="PERCENTAGE">PERCENTAGE (%)</option>
                                        <option value="FLAT">FLAT VALUE</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 bottom-4 text-slate-400 pointer-events-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Rate / Value</label>
                                    <input
                                        type="number"
                                        value={product.globalDiscount?.value || 0}
                                        onChange={(e) => handleGlobalDiscountChange('value', e.target.value)}
                                        className="w-full text-sm font-semibold bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2 & 3: Wholesale Configuration Matrix Breakdown */}
                    <div className="lg:col-span-2 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-inner flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/60">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <Layers2 size={15} className="text-indigo-500" /> Wholesales/Volume Break Scales
                                </h4>
                                <button
                                    onClick={handleAddGlobalTier}
                                    className="text-[11px] bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 text-indigo-600 font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all shadow-xs active:scale-95"
                                >
                                    + Add Scale Bracket
                                </button>
                            </div>

                            <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                                {product.globalTiers?.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400 text-xs font-medium italic bg-white rounded-xl border border-dashed border-slate-200">
                                        No high level wholesale volume tier scales assigned to this product matrix framework.
                                    </div>
                                ) : (
                                    product.globalTiers?.map((tier, tIdx) => (
                                        <div key={tier._id || tIdx} className="grid grid-cols-12 gap-3 bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all items-center shadow-xs">
                                            <div className="col-span-5">
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Min Quantity Threshold</span>
                                                <input
                                                    type="number"
                                                    value={tier.minQuantity || ''}
                                                    onChange={(e) => handleGlobalTierChange(tIdx, 'minQuantity', e.target.value)}
                                                    className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 focus:bg-white rounded-lg p-2 focus:outline-none focus:border-indigo-500 transition-colors"
                                                    placeholder="10"
                                                />
                                            </div>
                                            <div className="col-span-5">
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Price Per Unit ({product.displayCurrency})</span>
                                                <input
                                                    type="number"
                                                    value={tier.basePrice || ''}
                                                    onChange={(e) => handleGlobalTierChange(tIdx, 'basePrice', e.target.value)}
                                                    className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 focus:bg-white rounded-lg p-2 focus:outline-none focus:border-indigo-500 transition-colors"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="col-span-2 text-center pt-4">
                                                <button
                                                    onClick={() => handleRemoveGlobalTier(tIdx)}
                                                    className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors active:scale-90"
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

            {/* Pricing Matrix Nested Loop Module */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="bg-slate-950 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg text-indigo-400">
                            <BarChart3 size={18} />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-white uppercase tracking-widest block">Pricing Variant Matrix Layers</span>
                            <span className="text-[11px] font-medium text-slate-400 block mt-0.5">Currently active variants: {product.variants?.length || 0}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleAddBlankVariant}
                        className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition-all shadow-md shadow-indigo-900/20 active:scale-95"
                    >
                        <Plus size={14} /> Append Configuration Row
                    </button>
                </div>

                <div className="bg-white w-full overflow-x-auto">
                    {!product.variants || product.variants.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                            No discrete matrix option branches initialized yet. Generate rows above.
                        </div>
                    ) : (
                        <div className="min-w-[1100px] p-6 space-y-4">
                            {product.variants.map((v, idx) => (
                                <div key={v._id || `v-${idx}`} className="bg-slate-50/40 p-5 rounded-2xl border border-slate-200/60 hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-xs transition-all duration-200">
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