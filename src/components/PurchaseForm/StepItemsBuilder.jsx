import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import {
    Plus,
    Trash2,
    Calculator,
    FileSpreadsheet,
    Layers,
    ShoppingBag,
    Edit3,
    Tag,
    X,
    GripVertical,
    Image as ImageIcon,
    Hash,
    ChevronDown,
    Weight,
    Box,
    CheckCircle2,
    Circle
} from "lucide-react";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../utils/urls";

// ==========================================
// 1. PRODUCT VARIANT ELEMENT COMPONENT
// ==========================================
export const ProductVariantElement = ({ variant = {}, onUpdate, onRemove }) => {
    const fileInputRef = useRef(null);
    const units = ['PCS', 'KG', 'L', 'BOX'];

    // Exactly aligned with Mongoose Model
    const v = {
        name: variant.name ?? '',
        sku: variant.sku ?? '',
        unitOfMeasure: variant.unitOfMeasure ?? 'PCS',
        weightKg: variant.weightKg ?? 0,
        volumeM3: variant.volumeM3 ?? 0,
        attributes: variant.attributes ?? { type: '', value: '' },
        isActive: variant.isActive ?? true,
        image: variant.image ?? ''
    };

    const update = (patch) => onUpdate({ ...v, ...patch });

    const toastStyle = {
        borderRadius: '12px',
        background: '#1e293b',
        color: '#fff',
        fontSize: '12px',
        fontWeight: '600',
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            update({ image: URL.createObjectURL(file) });
            toast.success(`Image added to ${v.sku || 'variant'}`, { style: toastStyle });
        }
    };

    return (
        <div
            className={`grid grid-cols-[40px_50px_200px_150px_180px_100px_100px_100px_auto]
            items-center gap-3 px-4 py-4 border-l-4 transition-all rounded-xl border border-y-slate-200 border-r-slate-200
            ${v.isActive ? 'bg-white border-indigo-500 shadow-sm' : 'bg-slate-50 border-slate-300 opacity-70'}`}
        >
            {/* 1. Drag Handle */}
            <div className="flex items-center justify-center">
                <GripVertical size={18} className="text-slate-300 cursor-grab active:cursor-grabbing" />
            </div>

            {/* 2. Image Slot */}
            <div className="relative group">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden bg-slate-50 hover:border-indigo-400 transition-colors"
                >
                    {v.image ? (
                        <img src={v.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon size={16} className="text-slate-400" />
                    )}
                </button>
                <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} />
            </div>

            {/* 3. Variant Name */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Variant Name</label>
                <input
                    value={v.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="e.g. Large / Red"
                    className="w-full border-slate-200 border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium"
                />
            </div>

            {/* 4. SKU */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">SKU Code</label>
                <div className="relative">
                    <Hash size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                        value={v.sku}
                        onChange={(e) => update({ sku: e.target.value.toUpperCase() })}
                        placeholder="AUTO"
                        className="w-full border-slate-200 border rounded-lg pl-7 pr-2 py-1.5 text-xs font-black tracking-wider focus:border-indigo-500 outline-none bg-slate-50/50"
                    />
                </div>
            </div>

            {/* 5. Attributes Map */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Attributes</label>
                <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50/50">
                    <Tag size={12} className="text-slate-400" />
                    <input
                        value={v.attributes.type}
                        onChange={(e) => update({ attributes: { ...v.attributes, type: e.target.value } })}
                        placeholder="Size"
                        className="w-16 bg-transparent text-[11px] font-bold uppercase outline-none"
                    />
                    <span className="text-slate-300">:</span>
                    <input
                        value={v.attributes.value}
                        onChange={(e) => update({ attributes: { ...v.attributes, value: e.target.value } })}
                        placeholder="XL"
                        className="w-16 bg-transparent text-[11px] outline-none text-indigo-600 font-bold"
                    />
                </div>
            </div>

            {/* 6. Weight */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-center">Weight (Kg)</label>
                <div className="relative">
                    <Weight size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                        type="number"
                        value={v.weightKg}
                        onChange={(e) => update({ weightKg: parseFloat(e.target.value) || 0 })}
                        className="w-full border-slate-200 border rounded-lg pl-7 pr-2 py-1.5 text-xs font-bold text-slate-700 outline-none"
                    />
                </div>
            </div>

            {/* 7. Volume */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-center">Vol (m³)</label>
                <div className="relative">
                    <Box size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                        type="number"
                        value={v.volumeM3}
                        onChange={(e) => update({ volumeM3: parseFloat(e.target.value) || 0 })}
                        className="w-full border-slate-200 border rounded-lg pl-7 pr-2 py-1.5 text-xs font-bold text-slate-700 outline-none"
                    />
                </div>
            </div>

            {/* 8. UOM Selection */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">UOM</label>
                <div className="relative">
                    <select
                        value={v.unitOfMeasure}
                        onChange={(e) => update({ unitOfMeasure: e.target.value })}
                        className="w-full border-slate-200 border rounded-lg px-2 py-2 text-[10px] font-black uppercase tracking-tighter bg-white outline-none appearance-none cursor-pointer"
                    >
                        {units.map(u => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-2.5 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* 9. Status Actions & Removal */}
            <div className="flex items-center justify-end gap-2 pt-4">
                <button
                    type="button"
                    onClick={() => update({ isActive: !v.isActive })}
                    className={`p-1.5 rounded-lg transition-colors ${v.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'}`}
                    title={v.isActive ? "Deactivate Variant" : "Activate Variant"}
                >
                    {v.isActive ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete Variant"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

// ==========================================
// 2. MAIN STEP ITEMS BUILDER COMPONENT
// ==========================================
export default function StepItemsBuilder({ form, setForm }) {
    // API Catalogs & Selection States
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedProductId, setSelectedProductId] = useState("");

    // Flag to determine if user wants to override/manually input variant attributes
    const [isManualVariant, setIsManualVariant] = useState(false);

    // Line Item entry buffer state
    const [newItem, setNewItem] = useState({ sku: "", desc: "", qty: 1, price: "" });

    const items = form?.items || [];
    const API_BASE = API_ENDPOINTS.CATEGORIES;
    const PRODUCT_BASE = API_ENDPOINTS.PRODUCTS;

    // Fetch Category & Catalog Infrastructure Data
    const fetchCatalogInfrastructure = useCallback(async () => {
        try {
            const catRes = await axios.get(`${API_BASE}/hierarchy/all`);
            const rawCats = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.data || []);
            setCategories(rawCats);

            const prodRes = await axios.get(`${PRODUCT_BASE}/catalog`);
            const rawProds = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.data || []);
            setAllProducts(rawProds);
        } catch (err) {
            console.error("Failed to fetch catalog infrastructure for builder:", err);
        }
    }, [API_BASE, PRODUCT_BASE]);

    useEffect(() => {
        fetchCatalogInfrastructure();
    }, [fetchCatalogInfrastructure]);

    // Flatten Category options for select input
    const flattenedCategories = useMemo(() => {
        const list = [];
        const traverse = (cats) => {
            cats.forEach(c => {
                list.push({ _id: c._id, name: c.name, level: c.level });
                if (c.children && c.children.length > 0) {
                    traverse(c.children);
                }
            });
        };
        traverse(categories);
        return list;
    }, [categories]);

    // Filtered Collections
    const filteredProducts = useMemo(() => {
        if (!selectedCategoryId) return allProducts;
        return allProducts.filter(p => {
            const catId = typeof p.categoryId === 'object' ? p.categoryId?._id : p.categoryId;
            return catId === selectedCategoryId;
        });
    }, [selectedCategoryId, allProducts]);

    const currentSelectedProduct = useMemo(() => {
        return allProducts.find(p => p._id === selectedProductId) || null;
    }, [selectedProductId, allProducts]);

    const activeProductVariants = useMemo(() => {
        return currentSelectedProduct?.variants || [];
    }, [currentSelectedProduct]);

    // Smart SKU Selection Logic
    const handleSkuChange = useCallback((skuValue) => {
        if (!currentSelectedProduct) return;

        // Case A: Product has no variants -> fallback to base specifications
        if (!activeProductVariants || activeProductVariants.length === 0) {
            setIsManualVariant(true);
            setNewItem({
                sku: "BASE-" + currentSelectedProduct.slug.toUpperCase(),
                desc: currentSelectedProduct.name,
                qty: 1,
                price: ""
            });
            return;
        }

        // Case B: Product has variants, user chose a specific SKU
        setIsManualVariant(false);
        if (skuValue) {
            const variant = activeProductVariants.find(v => v.sku === skuValue);
            if (variant) {
                setNewItem({
                    sku: variant.sku,
                    desc: `${currentSelectedProduct.name} (${variant.name || 'Standard'})`,
                    qty: 1,
                    price: variant.price || "0.00"
                });
            }
        } else {
            // Default to first variant if no specific SKU selected yet
            const firstVariant = activeProductVariants[0];
            if (firstVariant) {
                setNewItem({
                    sku: firstVariant.sku,
                    desc: `${currentSelectedProduct.name} (${firstVariant.name || 'Standard'})`,
                    qty: 1,
                    price: firstVariant.price || "0.00"
                });
            }
        }
    }, [currentSelectedProduct, activeProductVariants]);

    // Decoupled selection effects to eliminate dynamic tracking size differences
    useEffect(() => {
        if (!selectedProductId) {
            setNewItem({ sku: "", desc: "", qty: 1, price: "" });
            setIsManualVariant(false);
            return;
        }

        const prod = allProducts.find(p => p._id === selectedProductId);
        if (!prod) return;

        const variants = prod.variants || [];
        if (variants.length === 0) {
            setIsManualVariant(true);
            setNewItem({
                sku: "BASE-" + prod.slug.toUpperCase(),
                desc: prod.name,
                qty: 1,
                price: ""
            });
        } else {
            setIsManualVariant(false);
            const firstVariant = variants[0];
            setNewItem({
                sku: firstVariant.sku,
                desc: `${prod.name} (${firstVariant.name || 'Standard'})`,
                qty: 1,
                price: firstVariant.price || "0.00"
            });
        }
    }, [selectedProductId, allProducts]);

    // Calculation Handlers
    const calculateLineTotal = (qty, price) => {
        const q = parseFloat(qty) || 0;
        const p = parseFloat(price) || 0;
        return q * p;
    };

    const calculateGrandTotal = () => {
        return items.reduce((sum, item) => sum + calculateLineTotal(item.qty, item.price), 0);
    };

    // Handler to update an individual variant element inline inside allProducts list
    const handleUpdateVariant = (variantIndex, updatedVariant) => {
        setAllProducts(prevProducts => prevProducts.map(p => {
            if (p._id === selectedProductId) {
                const copyVariants = [...(p.variants || [])];
                copyVariants[variantIndex] = updatedVariant;
                return { ...p, variants: copyVariants };
            }
            return p;
        }));
    };

    // Handler to remove a variant structure from the selected product catalog definition
    const handleRemoveVariant = (variantIndex) => {
        setAllProducts(prevProducts => prevProducts.map(p => {
            if (p._id === selectedProductId) {
                const copyVariants = (p.variants || []).filter((_, idx) => idx !== variantIndex);
                return { ...p, variants: copyVariants };
            }
            return p;
        }));
        toast.error("Variant definition removed from runtime workspace structure");
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.sku.trim() || !newItem.desc.trim()) return;

        const parsedPrice = parseFloat(newItem.price) || 0;
        const parsedQty = parseInt(newItem.qty, 10) || 1;

        const assignedCatId = typeof currentSelectedProduct?.categoryId === 'object'
            ? currentSelectedProduct.categoryId?._id
            : currentSelectedProduct?.categoryId || selectedCategoryId;

        const catObject = flattenedCategories.find(c => c._id === assignedCatId);

        setForm((prev) => ({
            ...prev,
            items: [
                ...(prev?.items || []),
                {
                    ...newItem,
                    qty: parsedQty,
                    price: parsedPrice,
                    id: Date.now(),
                    category: catObject ? { _id: catObject._id, name: catObject.name } : null,
                    product: currentSelectedProduct ? { _id: currentSelectedProduct._id, name: currentSelectedProduct.name } : null
                }
            ]
        }));

        setNewItem({ sku: "", desc: "", qty: 1, price: "" });
        setSelectedProductId("");
        setIsManualVariant(false);
    };

    const handleRemoveItem = (id) => {
        setForm((prev) => ({
            ...prev,
            items: (prev?.items || []).filter((item) => item.id !== id)
        }));
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 font-sans text-slate-800">

            {/* CATALOG SEARCH PANEL */}
            <form onSubmit={handleAddItem} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Items Catalog Builder</h3>
                    <p className="text-sm text-slate-500 mt-1">Select a category and product to instantly populate item details.</p>
                </div>

                {/* FILTERS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Layers size={16} className="text-indigo-500" /> Category Filter
                        </label>
                        <select
                            value={selectedCategoryId}
                            onChange={(e) => {
                                setSelectedCategoryId(e.target.value);
                                setSelectedProductId("");
                            }}
                            className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                        >
                            <option value="">All Categories</option>
                            ={flattenedCategories.map(c => (
                                <option key={c._id} value={c._id}>
                                    {"\u00A0".repeat(c.level * 2)} {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <ShoppingBag size={16} className="text-indigo-500" /> Choose Base Product
                        </label>
                        <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                        >
                            <option value="">-- Select Product --</option>
                            {filteredProducts.map(p => (
                                <option key={p._id} value={p._id}>{p.name} {p.brand ? `(${p.brand})` : ''}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* DYNAMIC PRODUCT VARIANTS MANAGEMENT SECTION */}
                {selectedProductId && activeProductVariants.length > 0 && (
                    <div className="space-y-3 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Tag size={14} className="text-indigo-500" /> Active System Variants ({activeProductVariants.length})
                            </span>
                            <span className="text-[11px] text-slate-400 italic">Modify or evaluate properties below</span>
                        </div>
                        <div className="space-y-2 overflow-x-auto max-w-full pb-2">
                            <div className="min-w-[1000px] space-y-2">
                                {activeProductVariants.map((variant, index) => (
                                    <ProductVariantElement
                                        key={variant.sku || index}
                                        variant={variant}
                                        onUpdate={(updated) => handleUpdateVariant(index, updated)}
                                        onRemove={() => handleRemoveVariant(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <hr className="border-slate-100" />

                {/* POPULATED INPUTS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">

                    {/* SKU DROPDOWN / TEXT */}
                    <div className="lg:col-span-3 space-y-1.5">
                        <label htmlFor="item-sku" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <Tag size={14} className="text-slate-400" /> Target SKU
                        </label>
                        {isManualVariant ? (
                            <div className="flex gap-2">
                                <input
                                    id="item-sku"
                                    type="text"
                                    value={newItem.sku}
                                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                                    placeholder="Enter variant SKU..."
                                    className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                                    required
                                />
                                {activeProductVariants.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setIsManualVariant(false)}
                                        className="text-xs text-indigo-600 font-semibold px-2 hover:underline"
                                    >
                                        Select
                                    </button>
                                )}
                            </div>
                        ) : (
                            <select
                                id="item-sku"
                                value={newItem.sku}
                                onChange={(e) => {
                                    if (e.target.value === "__MANUAL__") {
                                        setIsManualVariant(true);
                                    } else {
                                        handleSkuChange(e.target.value);
                                    }
                                }}
                                disabled={!selectedProductId}
                                className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-60 disabled:bg-slate-100"
                                required
                            >
                                {!selectedProductId ? (
                                    <option value="">Select a product first</option>
                                ) : activeProductVariants.length === 0 ? (
                                    <option value="BASE-PROD">Base Product Structure</option>
                                ) : (
                                    <>
                                        {activeProductVariants.map(v => (
                                            <option key={v.sku} value={v.sku}>
                                                {v.sku} {v.name ? `(${v.name})` : ""}
                                            </option>
                                        ))}
                                        <option value="__MANUAL__">+ Create Ad-Hoc Variant</option>
                                    </>
                                )}
                            </select>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="lg:col-span-3 space-y-1.5">
                        <label htmlFor="item-desc" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <Edit3 size={14} className="text-slate-400" /> Description
                        </label>
                        <input
                            id="item-desc"
                            type="text"
                            placeholder="Product details..."
                            value={newItem.desc}
                            onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
                            disabled={!selectedProductId}
                            className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-60"
                            required
                        />
                    </div>

                    {/* QUANTITY */}
                    <div className="lg:col-span-2 space-y-1.5">
                        <label htmlFor="item-qty" className="text-sm font-semibold text-slate-700">Quantity</label>
                        <input
                            id="item-qty"
                            type="number"
                            min="1"
                            value={newItem.qty}
                            onChange={(e) => setNewItem({ ...newItem, qty: parseInt(e.target.value, 10) || 1 })}
                            disabled={!selectedProductId}
                            className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                            required
                        />
                    </div>

                    {/* PRICE */}
                    <div className="lg:col-span-2 space-y-1.5">
                        <label htmlFor="item-price" className="text-sm font-semibold text-slate-700">Price (GH₵)</label>
                        <input
                            id="item-price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            disabled={!selectedProductId}
                            className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                            required
                        />
                    </div>

                    {/* ACTION BUTTON */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <button
                            type="submit"
                            disabled={!newItem.sku || !newItem.desc}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-40 disabled:pointer-events-none"
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            <span>Add Item</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* INVENTORY SHEET OVERVIEW */}
            <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                <div className="hidden md:grid grid-cols-12 gap-4 bg-slate-50 px-6 py-3 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <div className="col-span-2">SKU Code</div>
                    <div className="col-span-3">Item Description</div>
                    <div className="col-span-2">Assigned Category</div>
                    <div className="col-span-1 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Unit Rate</div>
                    <div className="col-span-2 text-right">Line Total</div>
                </div>

                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                    {items.length > 0 ? (
                        items.map((item) => {
                            const total = calculateLineTotal(item.qty, item.price);
                            return (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                                    <div className="col-span-1 md:col-span-2 font-mono font-medium text-slate-900">
                                        <span className="md:hidden text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">SKU Code</span>
                                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs inline-block md:block w-fit">{item.sku}</span>
                                    </div>

                                    <div className="col-span-1 md:col-span-3 text-sm text-slate-800 font-medium md:font-normal">
                                        <span className="md:hidden text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Description</span>
                                        {item.desc}
                                    </div>

                                    <div className="col-span-1 md:col-span-2 text-xs text-slate-500">
                                        <span className="md:hidden text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Category</span>
                                        {item.category ? (
                                            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                                                {item.category.name}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 italic">Unassigned</span>
                                        )}
                                    </div>

                                    <div className="col-span-1 md:col-span-1 md:text-center text-sm text-slate-600 font-mono">
                                        <span className="md:hidden text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Qty</span>
                                        {item.qty}
                                    </div>

                                    <div className="col-span-1 md:col-span-2 md:text-right text-sm text-slate-600 font-mono">
                                        <span className="md:hidden text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Rate</span>
                                        GH₵{Number(item.price).toFixed(2)}
                                    </div>

                                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-x-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t border-slate-100 md:border-none">
                                        <div className="text-right font-mono md:w-full">
                                            <span className="md:hidden text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Total</span>
                                            <p className="text-sm font-bold text-slate-900">GH₵{total.toFixed(2)}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors shrink-0 ml-2"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
                            <div className="p-3.5 rounded-2xl bg-slate-50 text-slate-400">
                                <FileSpreadsheet size={24} />
                            </div>
                            <p className="text-sm font-medium text-slate-400 max-w-xs">
                                No line items added yet. Search your catalog criteria above to populate this structure.
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-t border-slate-800">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Calculator size={16} className="text-indigo-400" />
                        <span className="font-semibold tracking-wider uppercase text-xs">Gross Subtotal</span>
                    </div>
                    <div className="font-mono">
                        <span className="text-xl font-bold text-white">
                            GH₵{calculateGrandTotal().toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}