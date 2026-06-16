import React, { useState, useMemo, useEffect } from "react";
import StepItemVariantBridge from "./StepItemVariantBridge";
import { Plus } from "lucide-react";

export default function StepItemFormPanel({ categories, products, setForm }) {

    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedProductId, setSelectedProductId] = useState("");

    const [newItem, setNewItem] = useState({
        sku: "",
        desc: "",
        qty: 1,
        price: "",
        variantSize: "",
        variantColor: "",
        variantMaterial: ""
    });

    // flatten categories
    const flattenedCategories = useMemo(() => {
        const list = [];
        const walk = (cats) => {
            cats.forEach(c => {
                list.push(c);
                if (c.children) walk(c.children);
            });
        };
        walk(categories || []);
        return list;
    }, [categories]);

    // category → product mapping FIX
    const filteredProducts = useMemo(() => {
        if (!selectedCategoryId) return products;
        return products.filter(p => {
            const catId = typeof p.categoryId === "object"
                ? p.categoryId?._id
                : p.categoryId;

            return catId === selectedCategoryId;
        });
    }, [products, selectedCategoryId]);

    const currentProduct = useMemo(
        () => products.find(p => p._id === selectedProductId) || null,
        [selectedProductId, products]
    );

    // Auto fill properties when standard products are picked
    useEffect(() => {
        if (currentProduct) {
            setNewItem(prev => ({
                ...prev,
                sku: currentProduct.slug ? currentProduct.slug.toUpperCase() : prev.sku,
                desc: currentProduct.description || currentProduct.name || prev.desc
            }));
        }
    }, [currentProduct]);

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
                    product: currentProduct
                        ? { _id: currentProduct._id, name: currentProduct.name }
                        : null
                }
            ]
        }));

        setNewItem({
            sku: "",
            desc: "",
            qty: 1,
            price: "",
            variantSize: "",
            variantColor: "",
            variantMaterial: ""
        });

        setSelectedProductId("");
    };

    return (
        <form onSubmit={handleAdd} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs max-w-4xl mx-auto">

            {/* DROPDOWNS SECTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CATEGORY SELECT */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Category</label>
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => {
                            setSelectedCategoryId(e.target.value);
                            setSelectedProductId("");
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 shadow-3xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {flattenedCategories.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.level > 0 ? "— ".repeat(c.level) : ""}{c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* PRODUCT SELECT */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Product</label>
                    <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 shadow-3xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                        <option value="">Select Product</option>
                        {filteredProducts.map(p => (
                            <option key={p._id} value={p._id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* BASIC INPUTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">SKU</label>
                    <input
                        placeholder="SKU Code"
                        value={newItem.sku}
                        onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-1">
                    <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Description</label>
                    <input
                        placeholder="Item details description"
                        value={newItem.desc}
                        onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Qty</label>
                    <input
                        type="number"
                        placeholder="Qty"
                        value={newItem.qty}
                        onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Price</label>
                    <input
                        type="number"
                        placeholder="Price"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>

            {/* VARIANT BRIDGE CONTAINER */}
            {newItem.sku && (
                <div className="pt-2 border-t border-slate-100">
                    <StepItemVariantBridge
                        newItem={newItem}
                        setNewItem={setNewItem}
                        product={currentProduct}
                    />
                </div>
            )}

            {/* FORM SUBMIT ACTIONS AREA */}
            <div className="flex justify-end pt-2">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-medium text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-[0.99]">
                    <Plus size={16} strokeWidth={2.5} />
                    Add Item
                </button>
            </div>
        </form>
    );
}