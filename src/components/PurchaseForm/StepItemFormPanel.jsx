import React, { useState, useMemo, useEffect } from "react";
import StepItemVariantBridge from "./StepItemVariantBridge";
import { Plus, LayoutGrid, PackageCheck } from "lucide-react";

export default function StepItemFormPanel({ categories, products, setForm, globalLoading }) {
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedProductId, setSelectedProductId] = useState("");

    const initialItemState = {
        sku: "",
        desc: "",
        qty: 1,
        price: "",
        productName: "",
        brand: "",
        categoryId: "",
        categoryTree: [],
        variantSize: "",
        variantColor: "",
        variantMaterial: "",
        variantFlavor: "",
        barcode: "",
        unitOfMeasure: "CASE",
        packagingFactor: "",
        weightKg: "",
        volumeM3: "",
        isActive: true,
        image: ""
    };

    const [newItem, setNewItem] = useState(initialItemState);

    // Unpack hierarchy arrays for option selection passes
    const flattenedCategories = useMemo(() => {
        const list = [];
        const walk = (cats) => {
            cats.forEach(c => {
                list.push(c);
                if (c.children && Array.isArray(c.children)) walk(c.children);
            });
        };
        walk(categories || []);
        return list;
    }, [categories]);

    // Filter product pool down to explicitly mapped nodes
    const filteredProducts = useMemo(() => {
        if (!selectedCategoryId) return [];
        return (products || []).filter(p => {
            const catId = typeof p.categoryId === "object" ? p.categoryId?._id : p.categoryId;
            return catId === selectedCategoryId;
        });
    }, [products, selectedCategoryId]);

    const currentProduct = useMemo(
        () => (products || []).find(p => p._id === selectedProductId) || null,
        [selectedProductId, products]
    );

    // Map upstream baseline data over form references on selection modifications
    useEffect(() => {
        if (currentProduct) {
            const parsedCatId = typeof currentProduct.categoryId === "object"
                ? currentProduct.categoryId?._id
                : currentProduct.categoryId;

            setNewItem(prev => ({
                ...prev,
                productName: currentProduct.name || "",
                brand: currentProduct.brand || "nile",
                categoryId: parsedCatId || prev.categoryId,
                categoryTree: currentProduct.categoryTree || prev.categoryTree,
                sku: currentProduct.slug ? currentProduct.slug.toUpperCase() : prev.sku,
                desc: currentProduct.description || currentProduct.name || prev.desc
            }));
        }
    }, [currentProduct]);

    const handleCategoryClick = (catId) => {
        const targetId = selectedCategoryId === catId ? "" : catId;
        setSelectedCategoryId(targetId);
        setSelectedProductId("");

        if (!targetId) {
            setNewItem(prev => ({ ...prev, ...initialItemState }));
            return;
        }

        const matchedCat = flattenedCategories.find(c => c._id === targetId);
        setNewItem(prev => ({
            ...prev,
            ...initialItemState,
            categoryId: targetId,
            categoryTree: matchedCat ? [matchedCat.name] : []
        }));
    };

    const handleProductClick = (prodId) => {
        setSelectedProductId(selectedProductId === prodId ? "" : prodId);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newItem.sku || !newItem.desc) return;

        setForm(prev => ({
            ...prev,
            items: [
                ...(prev?.items || []),
                {
                    ...newItem,
                    id: Date.now(),
                    qty: Number(newItem.qty) || 1,
                    price: Number(newItem.price) || 0,
                    product: currentProduct ? { _id: currentProduct._id, name: currentProduct.name } : null
                }
            ]
        }));

        setNewItem(initialItemState);
        setSelectedCategoryId("");
        setSelectedProductId("");
    };

    return (
        <form onSubmit={handleAdd} className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-6 max-w-4xl mx-auto shadow-sm">

            {/* STACKED/FLEX SELECTION SECTION */}
            <div className="space-y-5">

                {/* CATEGORY CONTAINER */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 tracking-wider uppercase flex items-center gap-2">
                        <LayoutGrid size={15} className="text-indigo-500" /> Choose Category
                    </label>
                    <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 w-full min-h-[70px] flex flex-wrap gap-2 content-start transition-all">
                        {flattenedCategories.length === 0 ? (
                            <span className="text-sm text-slate-400 m-auto py-1">No categories available</span>
                        ) : (
                            flattenedCategories.map(c => {
                                const isSelected = selectedCategoryId === c._id;
                                return (
                                    <button
                                        key={c._id}
                                        type="button"
                                        disabled={globalLoading}
                                        onClick={() => handleCategoryClick(c._id)}
                                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer select-none active:scale-[0.97] disabled:opacity-50 ${isSelected
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-800"
                                            }`}
                                    >
                                        {c.level > 0 ? "↳ " : ""}{c.name}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* PRODUCT CONTAINER */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 tracking-wider uppercase flex items-center gap-2">
                        <PackageCheck size={15} className="text-indigo-500" /> Choose Mapped Product
                    </label>
                    <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 w-full min-h-[70px] flex flex-wrap gap-2 content-start transition-all">
                        {!selectedCategoryId ? (
                            <span className="text-sm text-slate-400 m-auto italic py-1">Select a category above to load context items...</span>
                        ) : filteredProducts.length === 0 ? (
                            <span className="text-sm text-slate-400 m-auto py-1">No products cataloged here</span>
                        ) : (
                            filteredProducts.map(p => {
                                const isSelected = selectedProductId === p._id;
                                return (
                                    <button
                                        key={p._id}
                                        type="button"
                                        disabled={globalLoading}
                                        onClick={() => handleProductClick(p._id)}
                                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer select-none active:scale-[0.97] disabled:opacity-50 ${isSelected
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-800"
                                            }`}
                                    >
                                        {p.name} {p.brand ? `(${p.brand})` : ""}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* BASIC INPUTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 tracking-wide uppercase">SKU</label>
                    <input
                        placeholder="SKU Code"
                        value={newItem.sku}
                        onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-base text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                    />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-6">
                    <label className="text-xs font-bold text-slate-500 tracking-wide uppercase">Description</label>
                    <input
                        placeholder="Item details description"
                        value={newItem.desc}
                        onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-base text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                    />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 tracking-wide uppercase">Total Qty</label>
                    <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={newItem.qty}
                        onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-base text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                    />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 tracking-wide uppercase"> Unit Price</label>
                    <input
                        type="number"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-base text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                    />
                </div>
            </div>

            {/* SYNC WORKING WORKSPACE AREA */}
            {newItem.sku && (
                <div className="pt-3 border-t border-slate-100">
                    <StepItemVariantBridge newItem={newItem} setNewItem={setNewItem} />
                </div>
            )}

            {/* ACTION ROW */}
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-medium text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all hover:shadow-xs active:scale-[0.98] cursor-pointer"
                >
                    <Plus size={16} strokeWidth={2.5} />
                    Add Item
                </button>
            </div>
        </form>
    );
}