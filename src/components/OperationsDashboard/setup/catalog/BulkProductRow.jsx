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
        <div className="mb-6 last:mb-0">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all relative z-10">

                {/* Master Image Preview */}
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 shrink-0">
                    <ImageIcon size={20} className="text-slate-400" />
                </div>

                {/* Name & Category Section */}
                <div className="flex-1 min-w-0">
                    <input
                        value={product.name || ''}
                        onChange={(e) => onUpdate({ ...product, name: e.target.value })}
                        placeholder="Master Product Name (e.g., Nike Air Max)"
                        className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-0"
                    />

                    <div className="flex items-center gap-2 mt-1.5 overflow-x-auto no-scrollbar">
                        {/* THE DROPDOWN SELECTOR */}
                        <div className="relative group shrink-0">
                            <select
                                value={product.categoryId || ''}
                                onChange={handleCategoryChange}
                                className="appearance-none bg-indigo-50 hover:bg-indigo-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 pr-7 rounded border-none cursor-pointer text-indigo-600 transition-all focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="" disabled>Select Category</option>
                                {categoryOptions.map(opt => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400" />
                        </div>

                        {/* Visual Path Display (Breadcrumbs) */}
                        <div className="flex items-center gap-1.5">
                            {product.categoryTree?.map((cat, idx) => (
                                <React.Fragment key={idx}>
                                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                        {cat}
                                    </span>
                                    {idx < product.categoryTree.length - 1 && (
                                        <span className="text-slate-300 text-[10px]">/</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <div className="text-right shrink-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {product.variants?.length || 0} Variants
                        </p>
                    </div>

                    <button
                        onClick={addVariant}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all font-bold text-xs uppercase tracking-tight shadow-md shadow-indigo-100"
                    >
                        <Plus size={14} />
                        Add Variant
                    </button>

                    <div className="w-px h-8 bg-slate-100 mx-1" />

                    <button
                        onClick={onRemove}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Variant List Rendering */}
            {product.variants && product.variants.length > 0 && (
                <div className="ml-6 mt-[-8px] pt-4 pb-2 bg-slate-50/50 border-x border-b border-slate-200 rounded-b-xl overflow-hidden shadow-inner">
                    {product.variants.map((v) => (
                        <ProductVariantElement
                            key={v.id}
                            variant={v}
                            onUpdate={(data) => updateVariant(v.id, data)}
                            onRemove={() => removeVariant(v.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};