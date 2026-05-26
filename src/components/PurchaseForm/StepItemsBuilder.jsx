import React, { useState } from "react";
import { Plus, Trash2, Calculator, Layers, FileSpreadsheet } from "lucide-react";

export default function StepItemsBuilder({ form, setForm }) {
    // ACTIVE WORK BUFFER LAYER STATEFOR USER REAL-TIME ENTRIES
    const [newItem, setNewItem] = useState({ sku: "", desc: "", qty: 1, price: 0 });

    const items = form.items || [];

    // ACCURATE PAYLOAD COMPUTATION HOOKS
    const calculateLineTotal = (qty, price) => {
        const q = parseFloat(qty) || 0;
        const p = parseFloat(price) || 0;
        return q * p;
    };

    const calculateGrandTotal = () => {
        return items.reduce((sum, item) => sum + calculateLineTotal(item.qty, item.price), 0);
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.sku || !newItem.desc) return; // Prevent empty operational logs

        const updatedItems = [...items, { ...newItem, id: Date.now() }];
        setForm({ ...form, items: updatedItems });

        // RE-INITIALIZE ENTRY ROW WITH BLANK TEMPLATE DATA
        setNewItem({ sku: "", desc: "", qty: 1, price: 0 });
    };

    const handleRemoveItem = (id) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setForm({ ...form, items: updatedItems });
    };

    return (
        <div className="space-y-6 animate-fadeIn">

            {/* ROW INTERACTIVE DATA INGESTION FORM MATRIX */}
            <form onSubmit={handleAddItem} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Add New Line Item Specification
                </span>

                <div className="grid grid-cols-12 gap-3">
                    {/* INPUT: SKU / PART ID */}
                    <div className="col-span-12 md:col-span-3">
                        <label className="text-xs font-bold text-slate-600 tracking-tight block mb-1">SKU / Item Code</label>
                        <input
                            type="text"
                            placeholder="e.g., SKU-402-99"
                            value={newItem.sku}
                            onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 shadow-3xs focus:outline-none focus:border-indigo-500 transition-all"
                            required
                        />
                    </div>

                    {/* INPUT: ITEM SUMMARY SPECIFICATION DESCRIPTION */}
                    <div className="col-span-12 md:col-span-4">
                        <label className="text-xs font-bold text-slate-600 tracking-tight block mb-1">Item Description</label>
                        <input
                            type="text"
                            placeholder="e.g., Premium Industrial Cat5e Cable Reel"
                            value={newItem.desc}
                            onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 shadow-3xs focus:outline-none focus:border-indigo-500 transition-all"
                            required
                        />
                    </div>

                    {/* INPUT: QUANTITY ORDERED */}
                    <div className="col-span-6 md:col-span-2">
                        <label className="text-xs font-bold text-slate-600 tracking-tight block mb-1">Qty</label>
                        <input
                            type="number"
                            min="1"
                            value={newItem.qty}
                            onChange={(e) => setNewItem({ ...newItem, qty: parseInt(e.target.value) || 1 })}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 shadow-3xs focus:outline-none focus:border-indigo-500 transition-all"
                            required
                        />
                    </div>

                    {/* INPUT: UNIT PRICE VALUE */}
                    <div className="col-span-6 md:col-span-3">
                        <label className="text-xs font-bold text-slate-600 tracking-tight block mb-1">Unit Price ($)</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={newItem.price || ""}
                                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                                className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-lg pl-3 pr-4 py-2 shadow-3xs focus:outline-none focus:border-indigo-500 transition-all"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* APPEND ACTION ELEMENT TRACK */}
                <div className="flex justify-end pt-1">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-indigo-600 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-xs hover:bg-indigo-700 transition"
                    >
                        <Plus size={16} className="stroke-[2.5]" />
                        Insert Line Item
                    </button>
                </div>
            </form>

            {/* HIGH DENSITY MASTER OVERVIEW INVENTORY TABLE SHEET */}
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-3xs">
                <div className="grid grid-cols-12 gap-4 bg-slate-50 px-4 py-3 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 hidden md:grid">
                    <div className="col-span-2">SKU Code</div>
                    <div className="col-span-4">Item Description</div>
                    <div className="col-span-2 text-right">Quantity</div>
                    <div className="col-span-2 text-right">Unit Rate</div>
                    <div className="col-span-2 text-right">Line Extension</div>
                </div>

                <div className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto">
                    {items.length > 0 ? (
                        items.map((item) => {
                            const total = calculateLineTotal(item.qty, item.price);
                            return (
                                <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center group hover:bg-slate-50/50 transition-all">
                                    <div className="col-span-12 md:col-span-2 text-base font-mono font-bold text-slate-900">
                                        {item.sku}
                                    </div>
                                    <div className="col-span-12 md:col-span-4 text-base font-normal text-slate-700">
                                        {item.desc}
                                    </div>
                                    <div className="col-span-4 md:col-span-2 text-left md:text-right text-base text-slate-600">
                                        <span className="md:hidden font-bold text-xs uppercase text-slate-400 block mb-0.5">Qty</span>
                                        {item.qty} units
                                    </div>
                                    <div className="col-span-4 md:col-span-2 text-left md:text-right text-base text-slate-600">
                                        <span className="md:hidden font-bold text-xs uppercase text-slate-400 block mb-0.5">Rate</span>
                                        ${item.price.toFixed(2)}
                                    </div>
                                    <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
                                        <div className="text-right">
                                            <span className="md:hidden font-bold text-xs uppercase text-slate-400 block mb-0.5">Total</span>
                                            <p className="text-base font-bold text-slate-900">${total.toFixed(2)}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                            title="Delete record line"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        /* EMPTY RECONCILIATION VIEW PANEL BLOCK */
                        <div className="p-10 text-center flex flex-col items-center justify-center gap-2">
                            <FileSpreadsheet size={28} className="text-slate-300" />
                            <p className="text-base font-medium text-slate-400">
                                No line items added yet. Complete the entry matrix block above to initialize values.
                            </p>
                        </div>
                    )}
                </div>

                {/* AUTOMATED ACCRUAL SUMMARY COMPONENT TRAILER BAR */}
                <div className="bg-slate-900 text-white px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-80 text-sm">
                        <Calculator size={16} />
                        <span className="font-medium tracking-wide uppercase text-xs">Gross Accrual Subtotal</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xl font-mono font-bold">
                            ${calculateGrandTotal().toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
}