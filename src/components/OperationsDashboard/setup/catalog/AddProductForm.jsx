import React, { useState, useMemo, useRef } from 'react';
import { Save, ArrowLeft, Package, Layers, Tag, Info } from 'lucide-react';
import { BulkProductRow } from './BulkProductRow';

/**
 * AddProductForm Component
 */
export const AddProductForm = ({ categories = [], onSave, onCancel, loading = false }) => {
    const bulkRowRef = useRef(null);

    // 1. Unified state configuration alignment
    const [product, setProduct] = useState({
        name: '',
        slug: '',
        description: '',
        categoryId: '',
        categoryTree: [],
        brand: '',
        isActive: true,
        variants: [
            {
                sku: '',
                attribute: '',
                value: '',
                uom: 'pcs',
                weightKg: 0,
                volumeM3: 0,
                status: 'Active' // Default set to 'Active'
            }
        ]
    });

    const flattenedCategoryOptions = useMemo(() => {
        const results = [];
        const recurse = (nodes, currentPath = []) => {
            nodes.forEach(node => {
                const newPath = [...currentPath, node.name];
                results.push({
                    _id: node._id,
                    label: newPath.join(' → '),
                    tree: newPath
                });
                if (node.children && Array.isArray(node.children) && node.children.length > 0) {
                    recurse(node.children, newPath);
                }
            });
        };

        recurse(categories);
        return results;
    }, [categories]);

    const handleProductUpdate = (updatedProduct) => {
        const currentCount = product.variants?.length || 0;
        const newCount = updatedProduct.variants?.length || 0;

        setProduct(updatedProduct);

        if (newCount > currentCount && bulkRowRef.current) {
            requestAnimationFrame(() => {
                if (bulkRowRef.current) {
                    bulkRowRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            });
        }
    };

    const handleProductRemove = () => {
        if (window.confirm("Are you sure you want to clear the current product data?")) {
            setProduct({
                name: '',
                slug: '',
                description: '',
                categoryId: '',
                categoryTree: [],
                brand: '',
                isActive: true,
                variants: []
            });
        }
    };

    const handleMetaChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'categoryId') {
            const selectedMatch = flattenedCategoryOptions.find(cat => cat._id === value);
            setProduct(prev => ({
                ...prev,
                categoryId: value,
                categoryTree: selectedMatch ? selectedMatch.tree : []
            }));
            return;
        }

        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (!product.name?.trim()) {
    //         alert("Product Name is a required field.");
    //         return;
    //     }
    //     if (!product.categoryId) {
    //         alert("Please map this product to an operations Category entry.");
    //         return;
    //     }

    //     const finalSlug = product.slug?.trim()
    //         ? product.slug.trim()
    //         : product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    //     // Secure baseline brand value assertion. Defaults to "nile" if empty/blank
    //     const finalBrand = product.brand && product.brand.trim() !== "" ? product.brand.trim() : "nile";

    //     const submissionPayload = {
    //         name: product.name.trim(),
    //         slug: finalSlug,
    //         description: product.description?.trim() || "",
    //         categoryId: product.categoryId,
    //         categoryTree: product.categoryTree,
    //         brand: finalBrand,
    //         isActive: product.isActive,
    //         // Variants constructed cleanly to support your precise model fields
    //         variants: (product.variants || []).map(v => {
    //             const attributesMap = {};
    //             if (Array.isArray(v.attributes)) {
    //                 v.attributes.forEach(attr => {
    //                     if (attr.type && attr.value) {
    //                         attributesMap[attr.type] = attr.value;
    //                     }
    //                 });
    //             } else if (v.attribute && v.value) {
    //                 attributesMap[v.attribute] = v.value;
    //             }

    //             // Defensive normalization logic handling both direct Boolean or String values ('Active'/'active'/true)
    //             let isVariantActive = true;
    //             if (v.status !== undefined && v.status !== null) {
    //                 isVariantActive = v.status.toString().toLowerCase() === 'active' || v.status.toString() === 'true';
    //             } else if (v.isActive !== undefined) {
    //                 isVariantActive = v.isActive.toString().toLowerCase() === 'active' || v.isActive.toString() === 'true';
    //             }

    //             return {
    //                 sku: v.sku?.trim() || "",
    //                 name: v.sku?.trim() ? `${product.name?.trim()} - ${v.sku?.trim()}` : product.name?.trim(),
    //                 unitOfMeasure: (v.uom || 'pcs').toLowerCase(),
    //                 weightKg: Number(v.weightKg || 0),
    //                 volumeM3: Number(v.volumeM3 || 0),
    //                 attributes: attributesMap,
    //                 isActive: isVariantActive
    //             };
    //         })
    //     };

    //     if (onSave) onSave(submissionPayload);
    // };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!product.name?.trim()) {
            alert("Product Name is a required field.");
            return;
        }
        if (!product.categoryId) {
            alert("Please map this product to an operations Category entry.");
            return;
        }

        const finalSlug = product.slug?.trim()
            ? product.slug.trim()
            : product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        // Secure baseline brand value assertion. Defaults to "nile" if empty/blank
        const finalBrand = product.brand && product.brand.trim() !== "" ? product.brand.trim() : "nile";

        // EXPLICIT STRUCTURING: No loose object spreading to eliminate ghost property injection
        const submissionPayload = {
            name: product.name.trim(),
            slug: finalSlug,
            description: product.description?.trim() || "",
            categoryId: product.categoryId,
            categoryTree: product.categoryTree || [],
            brand: finalBrand, // Explicitly mapped right here
            isActive: typeof product.isActive === 'boolean' ? product.isActive : true,
            variants: (product.variants || []).map(v => {
                const attributesMap = {};
                if (Array.isArray(v.attributes)) {
                    v.attributes.forEach(attr => {
                        if (attr.type && attr.value) {
                            attributesMap[attr.type] = attr.value;
                        }
                    });
                } else if (v.attribute && v.value) {
                    attributesMap[v.attribute] = v.value;
                }

                let isVariantActive = true;
                if (v.status !== undefined && v.status !== null) {
                    isVariantActive = v.status.toString().toLowerCase() === 'active' || v.status.toString() === 'true';
                } else if (v.isActive !== undefined) {
                    isVariantActive = v.isActive.toString().toLowerCase() === 'active' || v.isActive.toString() === 'true';
                }

                return {
                    sku: v.sku?.trim() || "",
                    name: v.sku?.trim() ? `${product.name?.trim()} - ${v.sku?.trim()}` : product.name?.trim(),
                    unitOfMeasure: (v.uom || 'pcs').toLowerCase(),
                    weightKg: Number(v.weightKg || 0),
                    volumeM3: Number(v.volumeM3 || 0),
                    attributes: attributesMap,
                    isActive: isVariantActive
                };
            })
        };

        if (onSave) onSave(submissionPayload);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* ACTION BAR HOOK */}
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 transition-colors"
                    >
                        <ArrowLeft size={16} /> Close Form
                    </button>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-100 disabled:opacity-50 transition-all transform active:scale-95"
                >
                    <Save size={18} /> {loading ? 'Committing Data...' : 'Commit New Product'}
                </button>
            </div>

            {/* EXTENDED META FIELDS LAYOUT */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                    <Info size={16} className="text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Primary Record Definition</h3>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Product Name <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                                    <Package size={16} />
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name || ''}
                                    onChange={handleMetaChange}
                                    placeholder="e.g., Custard Premium"
                                    className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50/50 border-slate-300 text-slate-900 placeholder-slate-400 font-medium transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Category Selection Tree Hierarchy <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                                    <Layers size={16} />
                                </span>
                                <select
                                    name="categoryId"
                                    value={product.categoryId || ''}
                                    onChange={handleMetaChange}
                                    className="w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50/50 border-slate-300 text-slate-900 font-medium transition-all appearance-none"
                                    required
                                >
                                    <option value="" className="text-slate-400">Select a product category node branching...</option>
                                    {flattenedCategoryOptions.map((cat) => (
                                        <option key={cat._id} value={cat._id} className="text-slate-900">
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500 text-xs">
                                    ▼
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">URL Slug (Optional)</label>
                            <input
                                type="text"
                                name="slug"
                                value={product.slug || ''}
                                onChange={handleMetaChange}
                                placeholder="e.g., custard-premium-powder"
                                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50/50 border-slate-300 text-slate-900 placeholder-slate-400 font-medium transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Brand Identifier</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                                    <Tag size={16} />
                                </span>
                                <input
                                    type="text"
                                    name="brand"
                                    value={product.brand || ''}
                                    onChange={handleMetaChange}
                                    placeholder="e.g., Nile"
                                    className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50/50 border-slate-300 text-slate-900 placeholder-slate-400 font-medium transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-end">
                            <label
                                className={`flex items-center justify-between cursor-pointer border rounded-xl px-4 h-[42px] w-full select-none text-sm font-semibold transition-all duration-150 ${product.isActive
                                    ? 'bg-emerald-50/50 border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100/80'
                                    }`}
                            >
                                <span>Publish Live to Catalog</span>
                                <input
                                    id="isActiveProduct"
                                    type="checkbox"
                                    name="isActive"
                                    checked={!!product.isActive}
                                    onChange={handleMetaChange}
                                    className="w-4 h-4 text-emerald-600 border-slate-400 rounded focus:ring-emerald-500 transition-colors"
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Product Context / Description</label>
                        <textarea
                            name="description"
                            value={product.description || ''}
                            onChange={handleMetaChange}
                            placeholder="Enter short description notes or content descriptions..."
                            rows={3}
                            className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50/50 border-slate-300 text-slate-900 placeholder-slate-400 font-medium transition-all resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* INTEGRATED BULK ROW COMPONENT CONTAINER WITH SCROLL REF */}
            <div ref={bulkRowRef} className="scroll-mt-6">
                <BulkProductRow
                    product={product}
                    rawCategories={categories}
                    onUpdate={handleProductUpdate}
                    onRemove={handleProductRemove}
                />
            </div>
        </form>
    );
};