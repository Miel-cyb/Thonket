import React, { useState } from 'react';
import { Plus, Trash2, Barcode, MapPin, Edit3, X, Save, AlertTriangle, Calendar, DollarSign, Package } from 'lucide-react';

export default function InventoryTable({ items, onItemChange, onAddItem, onRemoveItem }) {
    const [editingItem, setEditingItem] = useState(null);

    const handleRowClick = (item) => {
        setEditingItem({ ...item });
    };

    const handleModalSave = (e) => {
        e.preventDefault();
        if (!editingItem) return;

        // Apply all changed fields back to parent state
        Object.keys(editingItem).forEach((field) => {
            onItemChange(editingItem.id, field, editingItem.value || editingItem[field]);
        });

        setEditingItem(null);
    };

    const handleModalFieldChange = (field, value) => {
        setEditingItem((prev) => {
            if (!prev) return null;
            const updated = { ...prev, [field]: value };

            if (field === 'receivedQty' || field === 'damagedQty') {
                const rec = Math.max(0, parseInt(field === 'receivedQty' ? value : prev.receivedQty, 10) || 0);
                const dam = Math.max(0, parseInt(field === 'damagedQty' ? value : prev.damagedQty, 10) || 0);
                updated.acceptedQty = Math.max(0, rec - dam);
            }
            return updated;
        });
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        Line Item Verification & Audit
                        <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                        </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Click on any line item to launch the detail audit modal and modify quantities, batch numbers, or bin locations.
                    </p>
                </div>
                <button
                    onClick={onAddItem}
                    className="flex items-center justify-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-2 rounded-lg transition shadow-sm shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" /> Add Extra Item
                </button>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold tracking-wide">
                        <tr>
                            <th className="p-3.5">SKU & Item Name</th>
                            <th className="p-3.5">Batch / Lot #</th>
                            <th className="p-3.5">Putaway Bin</th>
                            <th className="p-3.5 text-center">Ordered</th>
                            <th className="p-3.5 text-center bg-blue-50/60 text-blue-900">Arrived</th>
                            <th className="p-3.5 text-center bg-rose-50/60 text-rose-900">Damaged</th>
                            <th className="p-3.5 text-center bg-emerald-50/60 text-emerald-900">Accepted</th>
                            <th className="p-3.5">Expiry Date</th>
                            <th className="p-3.5 text-right">Line Value</th>
                            <th className="p-3.5 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center py-10 text-slate-400">
                                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                    No line items present. Click "Add Extra Item" to populate manually.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => {
                                const itemValue = (item.acceptedQty || 0) * (item.unitCost || 0);
                                const hasDiscrepancy = item.receivedQty !== item.orderedQty || item.damagedQty > 0;

                                return (
                                    <tr
                                        key={item.id}
                                        onClick={() => handleRowClick(item)}
                                        className="hover:bg-indigo-50/40 transition cursor-pointer group"
                                    >
                                        <td className="p-3.5">
                                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-1.5">
                                                {item.name}
                                                {hasDiscrepancy && (
                                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" title="Discrepancy Detected" />
                                                )}
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.id}</div>
                                        </td>
                                        <td className="p-3.5">
                                            <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 rounded px-2 py-0.5 font-mono text-[11px] text-slate-700">
                                                <Barcode className="w-3 h-3 text-slate-400 shrink-0" />
                                                {item.lotNumber || 'UNASSIGNED'}
                                            </span>
                                        </td>
                                        <td className="p-3.5">
                                            <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 rounded px-2 py-0.5 font-mono text-[11px] text-slate-700">
                                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                {item.location || 'UNASSIGNED'}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-center text-slate-500">{item.orderedQty}</td>
                                        <td className="p-3.5 text-center bg-blue-50/30 font-semibold text-blue-900">
                                            {item.receivedQty}
                                        </td>
                                        <td className={`p-3.5 text-center bg-rose-50/30 font-semibold ${item.damagedQty > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                            {item.damagedQty}
                                        </td>
                                        <td className="p-3.5 text-center bg-emerald-50/30 font-bold text-emerald-700">
                                            {item.acceptedQty}
                                        </td>
                                        <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                                            {item.expiryDate || 'N/A'}
                                        </td>
                                        <td className="p-3.5 text-right font-bold text-slate-900">
                                            ${itemValue.toFixed(2)}
                                        </td>
                                        <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => handleRowClick(item)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                                                    title="Edit Item Details"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                                                    title="Remove Item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- LINE ITEM EDIT / CORRECTION MODAL --- */}
            {editingItem && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold flex items-center gap-2">
                                    <Edit3 className="w-4 h-4 text-indigo-400" /> Item Inspection & Adjustment
                                </h3>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">{editingItem.id}</p>
                            </div>
                            <button
                                onClick={() => setEditingItem(null)}
                                className="text-slate-400 hover:text-white p-1 rounded transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleModalSave} className="p-5 space-y-4">
                            {/* Item Name */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Description / SKU Name</label>
                                <input
                                    type="text"
                                    value={editingItem.name}
                                    onChange={(e) => handleModalFieldChange('name', e.target.value)}
                                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Batch & Putaway */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                        <Barcode className="w-3.5 h-3.5 text-slate-400" /> Lot / Batch Number
                                    </label>
                                    <input
                                        type="text"
                                        value={editingItem.lotNumber}
                                        onChange={(e) => handleModalFieldChange('lotNumber', e.target.value)}
                                        className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> Putaway Bin Location
                                    </label>
                                    <input
                                        type="text"
                                        value={editingItem.location}
                                        onChange={(e) => handleModalFieldChange('location', e.target.value)}
                                        className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Quantities Section */}
                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Ordered</label>
                                    <input
                                        type="number"
                                        value={editingItem.orderedQty}
                                        onChange={(e) => handleModalFieldChange('orderedQty', parseInt(e.target.value, 10) || 0)}
                                        className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-blue-700 mb-1">Received (Arrived)</label>
                                    <input
                                        type="number"
                                        value={editingItem.receivedQty}
                                        onChange={(e) => handleModalFieldChange('receivedQty', e.target.value)}
                                        className="w-full text-xs font-bold text-blue-900 bg-white border border-blue-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-rose-700 mb-1">Damaged</label>
                                    <input
                                        type="number"
                                        value={editingItem.damagedQty}
                                        onChange={(e) => handleModalFieldChange('damagedQty', e.target.value)}
                                        className="w-full text-xs font-bold text-rose-700 bg-white border border-rose-300 rounded-md p-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Auto Calculated Accepted Qty Banner */}
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
                                <span className="text-xs font-medium text-emerald-800">Net Accepted Stock:</span>
                                <span className="text-base font-bold text-emerald-900">{editingItem.acceptedQty} units</span>
                            </div>

                            {/* Expiry Date & Unit Cost */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Expiry Date
                                    </label>
                                    <input
                                        type="date"
                                        value={editingItem.expiryDate}
                                        onChange={(e) => handleModalFieldChange('expiryDate', e.target.value)}
                                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                        <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Unit Cost ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editingItem.unitCost}
                                        onChange={(e) => handleModalFieldChange('unitCost', parseFloat(e.target.value) || 0)}
                                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-1.5 shadow-sm"
                                >
                                    <Save className="w-3.5 h-3.5" /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}