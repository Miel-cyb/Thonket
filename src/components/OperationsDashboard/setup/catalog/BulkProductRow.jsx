import React from 'react';
import { X, Package, ImageIcon, ChevronDown, Plus } from 'lucide-react';
import { ProductVariantElement } from './ProductVariant';

/**
 * BulkProductRow
 * Master container for product name, category selection, and variant management.
 * @param {Object} product - The current product state
 * @param {Array} rawCategories - The hierarchical category list from the API
 * @param {Function} onUpdate - Updates the product state in the parent
 * @param {Function} onRemove - Closes/removes this product entry
 */
export const BulkProductRow = ({ product, rawCategories = [], onUpdate, onRemove }) => {

    // 1. HELPER: Flatten the category tree for a clean dropdown list
    const flattenCategories = (cats, prefix = '') => {
        let items = [];
        cats.forEach(cat => {
            const label = prefix ? `${prefix} > ${cat.name}` : cat.name;
            items.push({ id: cat._id, label, name: cat.name });
            if (cat.children && cat.children.length > 0) {
                items = [...items, ...flattenCategories(cat.children, label)];
            }
        });
        return items;
    };

    const categoryOptions = flattenCategories(rawCategories);

    // 2. HANDLER: Update category and the visual breadcrumb tree
    const handleCategoryChange = (e) => {
        const selectedId = e.target.value;
        const selectedOption = categoryOptions.find(opt => opt.id === selectedId);

        if (selectedOption) {
            onUpdate({
                ...product,
                categoryId: selectedId,
                // We split the label into an array for the UI tags/breadcrumbs
                categoryTree: selectedOption.label.split(' > ')
            });
        }
    };

    const addVariant = () => {
        const newVariant = {
            id: crypto.randomUUID(),
            sku: '',
            attribute: '',
            value: '',
            uom: 'pcs',
            stock: 0,
            price: 0,
            status: 'Active',
            image: null
        };
        const currentVariants = product.variants || [];
        onUpdate({ ...product, variants: [...currentVariants, newVariant] });
    };

    const updateVariant = (vId, updatedData) => {
        const newVariants = product.variants.map(v => v.id === vId ? updatedData : v);
        onUpdate({ ...product, variants: newVariants });
    };

    const removeVariant = (vId) => {
        const newVariants = product.variants.filter(v => v.id !== vId);
        onUpdate({ ...product, variants: newVariants });
    };

    return (
        <div className="mb-6 last:mb-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition-all">

            {/* Row Header Block */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-white border-b border-slate-100">

                {/* Master Image Preview */}
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 shrink-0 shadow-sm">
                    <ImageIcon size={22} className="text-slate-400" />
                </div>

                {/* Name & Category Section */}
                <div className="flex-1 min-w-0 space-y-2">
                    <input
                        type="text"
                        value={product.name || ''}
                        onChange={(e) => onUpdate({ ...product, name: e.target.value })}
                        placeholder="Master Product Name (e.g., Nike Air Max)"
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none py-1 text-base font-semibold text-slate-800 placeholder:text-slate-400 transition-all focus:ring-0"
                    />

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        {/* THE DROPDOWN SELECTOR */}
                        <div className="relative group shrink-0">
                            <select
                                value={product.categoryId || ''}
                                onChange={handleCategoryChange}
                                className="appearance-none bg-indigo-50/80 hover:bg-indigo-100 text-xs font-semibold px-3 py-1.5 pr-8 rounded-lg border border-indigo-100 cursor-pointer text-indigo-700 transition-all focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            >
                                <option value="" disabled>Select Category</option>
                                {categoryOptions.map(opt => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500" />
                        </div>

                        {/* Visual Path Display (Breadcrumbs) */}
                        {product.categoryTree && product.categoryTree.length > 0 && (
                            <div className="flex items-center flex-wrap gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                {product.categoryTree.map((cat, idx) => (
                                    <React.Fragment key={idx}>
                                        <span className="text-xs font-medium text-slate-600">
                                            {cat}
                                        </span>
                                        {idx < product.categoryTree.length - 1 && (
                                            <span className="text-slate-400 text-xs font-bold px-0.5">/</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions Block */}
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right shrink-0">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {product.variants?.length || 0} {product.variants?.length === 1 ? 'Variant' : 'Variants'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={addVariant}
                            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-semibold text-xs shadow-sm shadow-indigo-100"
                        >
                            <Plus size={14} />
                            Add Variant
                        </button>

                        <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block" />

                        <button
                            type="button"
                            onClick={onRemove}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Remove Product Entry"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Variant List Rendering */}
            {product.variants && product.variants.length > 0 ? (
                <div className="bg-slate-50/60 p-4 border-t border-slate-100 space-y-3">
                    {product.variants.map((v) => (
                        <div key={v.id} className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                            <ProductVariantElement
                                variant={v}
                                onUpdate={(data) => updateVariant(v.id, data)}
                                onRemove={() => removeVariant(v.id)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-5 text-center bg-slate-50/30 text-xs font-medium text-slate-400 italic">
                    No item variants defined yet. Click "Add Variant" to append stock rows.
                </div>
            )}
        </div>
    );
};