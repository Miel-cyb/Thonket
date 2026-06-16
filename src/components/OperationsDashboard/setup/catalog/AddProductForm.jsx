import React, { useState, useMemo, useRef } from 'react';
import { Save, ArrowLeft, Package, Layers, Tag, Info } from 'lucide-react';
import { BulkProductRow } from './BulkProductRow'; // Imported existing component preserved intact

/**
 * AddProductForm Component
 * @param {Array} categories - Array of hierarchical tree category objects passed from the parent page
 * @param {Function} onSave - Callback triggered on form submission with the built payload
 * @param {Function} onCancel - Callback triggered to close or slide back the form view
 * @param {boolean} loading - Global submission or processing loading flag
 */
export const AddProductForm = ({ categories = [], onSave, onCancel, loading = false }) => {
    // DOM reference anchor to capture the bulk row layout position
    const bulkRowRef = useRef(null);

    // 1. Initialize Product Form state aligning with both schemas
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
                id: crypto.randomUUID(), // UI tracker key
                sku: '',
                attribute: '',
                value: '',
                uom: 'pcs',
                stock: 0,
                price: 0,
                status: 'Active',
                image: null,
                weightKg: 0,
                volumeM3: 0
            }
        ]
    });

    /**
     * Helper to recursively flatten hierarchical categories into readable options with branch indicators.
     * Maps item trees seamlessly to: "Parent Category → Sub Category → Leaf Node"
     */
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

    // 2. Handle modifications dispatched from BulkProductRow & execute auto-focus scroll
    const handleProductUpdate = (updatedProduct) => {
        setProduct(updatedProduct);

        // Trigger smooth native layout viewport scrolling upon variant changes/clicks
        if (bulkRowRef.current) {
            bulkRowRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start' // Aligns the top of the section with the top of the viewport
            });
        }
    };

    // 3. Clear/Reset form if the item row remove button is triggered
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

    // 4. Handle top-level meta updates (Description, Brand, Status, Category selection)
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

    // 5. Handle submission payload cleanup & normalization
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

        // Generate slug automatically if left empty
        const finalSlug = product.slug?.trim()
            ? product.slug.trim()
            : product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const submissionPayload = {
            ...product,
            slug: finalSlug,
            variants: (product.variants || []).map(v => ({
                ...v,
                sku: v.sku?.trim(),
                stock: Number(v.stock || 0),
                price: Number(v.price || 0),
                weightKg: Number(v.weightKg || 0),
                volumeM3: Number(v.volumeM3 || 0),
                isActive: v.status === 'Active'
            }))
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

            {/* EXTENDED META FIELDS LAYOUT - NOW RENDERS FIRST */}
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
                                    value={product.name}
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
                                    value={product.categoryId}
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
                                value={product.slug}
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
                                    value={product.brand}
                                    onChange={handleMetaChange}
                                    placeholder="e.g., Organic & Health"
                                    className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50/50 border-slate-300 text-slate-900 placeholder-slate-400 font-medium transition-all"
                                />
                            </div>
                        </div>

                        {/* OPTIMIZED COMPACT CATALOG TOGGLE BUTTON CHIP */}
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
                                    checked={product.isActive}
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
                            value={product.description}
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