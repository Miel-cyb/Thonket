import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Trash2, RefreshCw, CheckCircle2, ShieldAlert, Layers2, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../utils/urls';
import { ProductContextCard } from '../components/ProductConfig/ProductContextCard';
import { VariantCard } from '../components/ProductConfig/VariantCard';
import { LeavePromptModal, ActivateModal } from '../components/ProductConfig/PriceActionModal';


//
const PriceDetailPage = ({ onSyncSuccess }) => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const passedProduct = location.state?.product;

    const [loading, setLoading] = useState(!passedProduct);
    const [saving, setSaving] = useState(false);
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showLeavePrompt, setShowLeavePrompt] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);

    // Enhanced commercial feedback state replacing raw browser alerts
    const [feedback, setFeedback] = useState({ type: null, message: null });

    const [productState, setProductState] = useState(() => {
        const source = passedProduct || {};
        return {
            _id: source._id || productId || '',
            name: source.name || '',
            slug: source.slug || '',
            categoryId: source.category?._id || source.categoryId || '',
            categoryName: source.category?.name || source.categoryName || '',
            organizationId: source.organizationId || source.orgId || 'ORG-DEFAULT',
            brand: source.brand || '',
            isActive: source.isActive ?? true,
            currency: source.displayCurrency || source.currency || 'GHS',
            costBasis: source.costBasis || { type: 'Weighted Average', latestCost: 0, weightedAverage: 0, currentCost: source.currentCost || 0 },
            variants: source.variants?.length ? source.variants.map(v => {
                const activePriceObj = v.price || (Array.isArray(v.prices) && v.prices[0]) || {};

                return {
                    ...v,
                    _id: v._id || v.variantId || `var-${Math.random().toString(36).substring(2, 9)}`,
                    variantId: v._id || v.variantId || '',
                    variantName: v.name || v.variantName || 'Standard Variant',
                    basePrice: activePriceObj.basePrice ?? v.basePrice ?? 0,
                    currency: activePriceObj.currency || v.currency || source.currency || 'GHS',
                    isActive: v.isActive ?? true,
                    validFrom: activePriceObj.validFrom ? new Date(activePriceObj.validFrom).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                    validTo: activePriceObj.validTo ? new Date(activePriceObj.validTo).toISOString().slice(0, 16) : '',
                    discountType: activePriceObj.discount?.discountType || v.discountType || 'PERCENTAGE',
                    discountValue: activePriceObj.discount?.discountValue ?? v.discountValue ?? 0,
                    discountValidFrom: activePriceObj.discount?.validFrom ? new Date(activePriceObj.discount.validFrom).toISOString().slice(0, 16) : '',
                    discountValidTo: activePriceObj.discount?.validTo ? new Date(activePriceObj.discount.validTo).toISOString().slice(0, 16) : '',
                    tiers: activePriceObj.tiers?.length ? activePriceObj.tiers : (v.tiers?.length ? v.tiers : [
                        { _id: `tier-${Date.now()}-1`, minRange: 1, maxRange: null, tierPrice: activePriceObj.basePrice || 0 }
                    ])
                };
            }) : [
                {
                    _id: 'var-1',
                    variantId: productId || 'var-1',
                    variantName: 'Standard Variant',
                    name: source.name ? `${source.name} - Standard` : 'Standard Variant',
                    sku: source.sku || 'SKU-STD',
                    unitOfMeasure: source.unitOfMeasure || 'pcs',
                    weightKg: source.weightKg || 0,
                    volumeM3: source.volumeM3 || 0,
                    attributes: {},
                    basePrice: 0,
                    currency: source.displayCurrency || source.currency || 'GHS',
                    isActive: true,
                    validFrom: new Date().toISOString().slice(0, 16),
                    validTo: '',
                    discountType: 'PERCENTAGE',
                    discountValue: 0,
                    discountValidFrom: '',
                    discountValidTo: '',
                    tiers: [
                        { _id: 'tier-1', minRange: 1, maxRange: null, tierPrice: 0 }
                    ]
                }
            ]
        };
    });

    const [expandedVariants, setExpandedVariants] = useState(() => {
        const source = passedProduct || {};
        const vars = source.variants || [];
        if (vars.length > 0 && (vars[0]?._id || vars[0]?.variantId)) {
            return { [vars[0]._id || vars[0].variantId]: true };
        }
        return { 'var-1': true };
    });

    const toggleVariantAccordion = useCallback((variantId) => {
        setExpandedVariants(prev => ({ ...prev, [variantId]: !prev[variantId] }));
    }, []);

    const expandAllVariants = useCallback(() => {
        if (!productState?.variants) return;
        const all = {};
        productState.variants.forEach(v => {
            const identifier = v._id || v.variantId;
            if (identifier) all[identifier] = true;
        });
        setExpandedVariants(all);
    }, [productState?.variants]);

    const collapseAllVariants = useCallback(() => setExpandedVariants({}), []);

    const fetchProductDetails = useCallback(async () => {
        if (!productId) return;
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_ENDPOINTS.PRICES}/single/${productId}`);
            const targetProduct = data?.product || data;
            if (targetProduct) {
                setProductState(prev => ({
                    ...prev,
                    _id: targetProduct._id || productId,
                    name: targetProduct.name || prev.name,
                    slug: targetProduct.slug || prev.slug,
                    categoryId: targetProduct.categoryId || targetProduct.category?._id || prev.categoryId,
                    categoryName: targetProduct.categoryName || targetProduct.category?.name || prev.categoryName,
                    organizationId: targetProduct.organizationId || prev.organizationId,
                    brand: targetProduct.brand || prev.brand,
                    isActive: targetProduct.isActive ?? prev.isActive,
                    currency: targetProduct.displayCurrency || targetProduct.currency || prev.currency,
                    costBasis: targetProduct.costBasis || prev.costBasis,
                    variants: targetProduct.variants?.length ? targetProduct.variants.map((v, idx) => {
                        const activePriceObj = v.price || (Array.isArray(v.prices) && v.prices[0]) || {};
                        const assignedId = v._id || v.variantId || `var-${idx}-${Date.now()}`;
                        return {
                            ...v,
                            _id: assignedId,
                            variantId: assignedId,
                            variantName: v.variantName || v.name || 'Standard Variant',
                            basePrice: activePriceObj.basePrice ?? v.basePrice ?? 0,
                            currency: activePriceObj.currency || v.currency || targetProduct.displayCurrency || targetProduct.currency || 'GHS',
                            isActive: v.isActive ?? true,
                            validFrom: (activePriceObj.validFrom || v.validFrom) ? new Date(activePriceObj.validFrom || v.validFrom).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                            validTo: (activePriceObj.validTo || v.validTo) ? new Date(activePriceObj.validTo || v.validTo).toISOString().slice(0, 16) : '',
                            discountType: activePriceObj.discount?.discountType || v.discountType || 'PERCENTAGE',
                            discountValue: activePriceObj.discount?.discountValue ?? v.discountValue ?? 0,
                            discountValidFrom: activePriceObj.discount?.validFrom ? new Date(activePriceObj.discount.validFrom).toISOString().slice(0, 16) : '',
                            discountValidTo: activePriceObj.discount?.validTo ? new Date(activePriceObj.discount.validTo).toISOString().slice(0, 16) : '',
                            tiers: activePriceObj.tiers?.length ? activePriceObj.tiers : (v.tiers?.length ? v.tiers : [
                                { _id: `tier-${Date.now()}-1`, minRange: 1, maxRange: null, tierPrice: activePriceObj.basePrice || v.basePrice || 0 }
                            ])
                        };
                    }) : prev.variants
                }));
            }
        } catch (err) {
            console.error("Failed to load commercial pricing metrics", err);
            setFeedback({ type: 'error', message: 'Failed to synchronize product pricing details from server.' });
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        if (!passedProduct && productId) {
            fetchProductDetails();
        }
    }, [passedProduct, productId, fetchProductDetails]);

    const currentCost = productState?.costBasis?.currentCost || 0;

    const validationErrors = useMemo(() => {
        const errors = [];
        if (!productState?.categoryId && !productState?.categoryName) {
            errors.push('Product category association is missing.');
        }
        if (!productState?.variants || !productState.variants.length) {
            errors.push('At least one product variant pricing configuration is required.');
        } else {
            productState.variants.forEach((v, vIdx) => {
                const varLabel = v?.variantName || v?.name || `Variant ${vIdx + 1}`;
                if (Number(v?.basePrice) <= 0) {
                    errors.push(`Variant "${varLabel}" requires a valid basePrice greater than zero.`);
                }
            });
        }
        return errors;
    }, [productState]);

    const handleVariantChange = useCallback((variantIndex, field, value) => {
        setHasUnsavedChanges(true);
        setProductState(prev => {
            const updated = [...prev.variants];
            updated[variantIndex] = { ...updated[variantIndex], [field]: value };
            return { ...prev, variants: updated };
        });
    }, []);

    const handleRemoveVariant = useCallback((variantIndex) => {
        setProductState(prev => {
            if (prev.variants.length <= 1) {
                setFeedback({ type: 'error', message: 'You must maintain at least one variant configuration.' });
                return prev;
            }
            setHasUnsavedChanges(true);
            return { ...prev, variants: prev.variants.filter((_, i) => i !== variantIndex) };
        });
    }, []);

    const handleTierChange = useCallback((variantIndex, tierIndex, field, value) => {
        setHasUnsavedChanges(true);
        setProductState(prev => {
            const updatedVariants = [...prev.variants];
            const targetVariant = { ...updatedVariants[variantIndex] };
            const updatedTiers = [...(targetVariant.tiers || [])];

            updatedTiers[tierIndex] = { ...updatedTiers[tierIndex], [field]: value };
            targetVariant.tiers = updatedTiers;
            updatedVariants[variantIndex] = targetVariant;

            return { ...prev, variants: updatedVariants };
        });
    }, []);

    const handleAddTier = useCallback((variantIndex) => {
        setHasUnsavedChanges(true);
        setProductState(prev => {
            const updatedVariants = [...prev.variants];
            const targetVariant = { ...updatedVariants[variantIndex] };
            const currentTiers = [...(targetVariant.tiers || [])];

            const last = currentTiers[currentTiers.length - 1];
            const nextMin = last && last.maxRange !== null ? Number(last.maxRange) + 1 : 100;

            currentTiers.push({
                _id: `tier-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                minRange: nextMin,
                maxRange: null,
                tierPrice: Number(currentTiers[currentTiers.length - 1]?.tierPrice || 50) * 0.95
            });

            targetVariant.tiers = currentTiers;
            updatedVariants[variantIndex] = targetVariant;

            return { ...prev, variants: updatedVariants };
        });
    }, []);

    const handleRemoveTier = useCallback((variantIndex, tierIndex) => {
        setProductState(prev => {
            const updatedVariants = [...prev.variants];
            const targetVariant = { ...updatedVariants[variantIndex] };
            const currentTiers = targetVariant.tiers || [];

            if (currentTiers.length <= 1) return prev;

            setHasUnsavedChanges(true);
            targetVariant.tiers = currentTiers.filter((_, i) => i !== tierIndex);
            updatedVariants[variantIndex] = targetVariant;

            return { ...prev, variants: updatedVariants };
        });
    }, []);

    const buildCommercialPayload = useCallback(() => {
        return productState.variants.map(variant => {
            const variantPayload = {
                variantId: variant.variantId || variant._id,
                categoryId: productState.categoryId,
                categoryName: productState.categoryName,
                organizationId: productState.organizationId,
                basePrice: Number(variant.basePrice) || 0,
                currency: variant.currency || productState.currency || 'GHS',
                isActive: variant.isActive ?? productState.isActive ?? true,
                validFrom: variant.validFrom ? new Date(variant.validFrom).toISOString() : new Date().toISOString(),
                validTo: variant.validTo && variant.validTo.trim() !== '' ? new Date(variant.validTo).toISOString() : null,
                tiers: (variant.tiers || []).map(t => ({
                    minRange: Number(t.minRange),
                    maxRange: t.maxRange === null || t.maxRange === '+' || t.maxRange === '' ? null : Number(t.maxRange),
                    tierPrice: Number(t.tierPrice)
                })),
                createdBy: {
                    userId: 'usr_commercial_admin_01',
                    userName: 'Commercial Operations Admin',
                    role: 'ADMIN'
                }
            };

            // Only include discount if a valid discount value is provided and greater than 0
            const discountNum = Number(variant.discountValue);
            if (!isNaN(discountNum) && discountNum > 0) {
                variantPayload.discount = {
                    discountType: variant.discountType || 'PERCENTAGE',
                    discountValue: discountNum,
                    validFrom: variant.discountValidFrom ? new Date(variant.discountValidFrom).toISOString() : null,
                    validTo: variant.discountValidTo && variant.discountValidTo.trim() !== '' ? new Date(variant.discountValidTo).toISOString() : null
                };
            }

            return variantPayload;
        });
    }, [productState]);

    const handleSaveDraft = async () => {
        setSaving(true);
        setFeedback({ type: null, message: null });
        try {
            const payload = buildCommercialPayload();
            await axios.put(`${API_ENDPOINTS.PRICES}/update-bulk/${productState._id}`, { prices: payload });
            setHasUnsavedChanges(false);
            setFeedback({ type: 'success', message: 'Commercial pricing configurations successfully saved as Draft.' });
            if (onSyncSuccess) onSyncSuccess();
            setTimeout(() => {
                navigate('/products/pricing');
            }, 1200);
        } catch (err) {
            console.error("Save Draft Error", err);
            setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to save draft commercial pricing configuration.' });
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmActivation = async () => {
        setSaving(true);
        setFeedback({ type: null, message: null });
        try {
            const payload = buildCommercialPayload();
            await axios.post(`${API_ENDPOINTS.PRICES}`, { prices: payload, priceState: 'ACTIVE' });
            setHasUnsavedChanges(false);
            setShowActivateModal(false);
            setProductState(prev => ({ ...prev, priceState: 'ACTIVE' }));
            setFeedback({ type: 'success', message: 'Commercial price configurations successfully activated and published live!' });
            if (onSyncSuccess) onSyncSuccess();
            setTimeout(() => {
                navigate('/products/pricing');
            }, 1200);
        } catch (err) {
            console.error("Activation Error", err);
            setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to activate commercial pricing configuration.' });
        } finally {
            setSaving(false);
        }
    };

    const handleRetireClick = () => {
        if (window.confirm("Are you sure you want to retire this rule context?")) {
            navigate('/products/pricing');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 space-y-4">
                <RefreshCw className="animate-spin text-indigo-600" size={36} />
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Assembling Commercial Pricing Context...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-6 md:p-8 bg-slate-50/80 min-h-screen text-slate-700 font-sans antialiased tracking-normal">
            {showLeavePrompt && (
                <LeavePromptModal
                    onStay={() => setShowLeavePrompt(false)}
                    onDiscard={() => {
                        setShowLeavePrompt(false);
                        navigate(pendingNavigation ?? '/products/pricing');
                    }}
                />
            )}

            {showActivateModal && (
                <ActivateModal
                    variantCount={productState.variants.length}
                    saving={saving}
                    onCancel={() => setShowActivateModal(false)}
                    onConfirm={handleConfirmActivation}
                />
            )}

            {feedback.message && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm transition-all animate-fadeIn ${feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}>
                    <div className="flex items-center gap-3 text-xs font-medium">
                        {feedback.type === 'success' ? (
                            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle size={18} className="text-rose-600 shrink-0" />
                        )}
                        <span>{feedback.message}</span>
                    </div>
                    <button
                        onClick={() => setFeedback({ type: null, message: null })}
                        className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => {
                            if (hasUnsavedChanges) {
                                setPendingNavigation('/products/pricing');
                                setShowLeavePrompt(true);
                            } else {
                                navigate('/products/pricing');
                            }
                        }}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 uppercase tracking-wider bg-slate-100 hover:bg-indigo-50/50 px-4 py-3 rounded-2xl transition-all"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100/65">Commercial Multi-Variant Pricing Workspace</span>
                            {productState.categoryName && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                                    Category: {productState.categoryName}
                                </span>
                            )}
                            {hasUnsavedChanges && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">Unsaved changes</span>}
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-1">{productState.name || 'Untitled Product'}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleRetireClick}
                        className="flex items-center gap-2 border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-600 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all"
                    >
                        <Trash2 size={16} /> Retire
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={saving}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all"
                    >
                        <Save size={16} /> {saving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (validationErrors.length) {
                                setFeedback({ type: 'error', message: 'Please correct validation errors before activating pricing.' });
                                return;
                            }
                            setShowActivateModal(true);
                        }}
                        disabled={saving || validationErrors.length > 0}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white px-6 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider shadow-md shadow-indigo-100 transition-all"
                    >
                        <CheckCircle2 size={16} /> Activate Prices
                    </button>
                </div>
            </div>

            {validationErrors.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-3xl p-4 flex items-start gap-3 text-rose-800 text-xs font-medium">
                    <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold uppercase tracking-wider block mb-1">Configuration Requires Attention:</span>
                        <ul className="list-disc pl-4 space-y-0.5">
                            {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </div>
                </div>
            )}

            <ProductContextCard productState={productState} currentCost={currentCost} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Layers2 size={16} className="text-indigo-600" /> Commercial Variants, Discounts & Volume Tiers
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 font-normal">Manage individual variant price schemas, discounts, valid date timers, and volume price tiers.</p>
                    </div>
                    <div className="flex gap-2 self-start sm:self-auto">
                        <button type="button" onClick={expandAllVariants} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-2xs">Expand All</button>
                        <button type="button" onClick={collapseAllVariants} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-2xs">Collapse All</button>
                    </div>
                </div>

                <div className="space-y-4">
                    {productState?.variants?.map((variant, vIdx) => {
                        const variantIdentifier = variant?._id || variant?.variantId || `var-${vIdx}`;
                        return (
                            <VariantCard
                                key={variantIdentifier}
                                variant={variant}
                                vIdx={vIdx}
                                currency={productState.currency}
                                currentCost={currentCost}
                                isExpanded={!!expandedVariants[variantIdentifier]}
                                toggleAccordion={toggleVariantAccordion}
                                onVariantChange={handleVariantChange}
                                onRemoveVariant={handleRemoveVariant}
                                onTierChange={handleTierChange}
                                onAddTier={handleAddTier}
                                onRemoveTier={handleRemoveTier}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PriceDetailPage;