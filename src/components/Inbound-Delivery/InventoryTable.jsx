import React, { useState } from 'react';
import {
    Plus,
    Trash2,
    Barcode,
    MapPin,
    Edit3,
    X,
    Save,
    AlertTriangle,
    Calendar,
    DollarSign,
    Package
} from 'lucide-react';

export default function InventoryTable({ items = [], onItemChange, onAddItem, onRemoveItem }) {
    const [editingItem, setEditingItem] = useState(null);

    const handleRowClick = (item) => {
        setEditingItem({ ...item });
    };

    const handleModalSave = (e) => {
        e.preventDefault();
        if (!editingItem) return;

        // Pass the entire updated item object to the parent for a clean PATCH request
        onItemChange(editingItem.itemId, editingItem);
        setEditingItem(null);
    };

    const handleModalFieldChange = (field, value) => {
        setEditingItem((prev) => {
            if (!prev) return null;
            let updated = { ...prev, [field]: value };

            // Requirement 1: If the user enters a batch number, auto-populate 
            // other items in the table that don't have one yet so they don't have to repeat it.
            if (field === 'lotNumber' && typeof value === 'string' && value.trim() !== '') {
                items.forEach((item) => {
                    if (item.itemId !== prev.itemId && (!item.lotNumber || item.lotNumber.trim() === '')) {
                        onItemChange(item.itemId, { ...item, lotNumber: value });
                    }
                });
            }

            if (field === 'receivedQty' || field === 'damagedQty') {
                const rec = Math.max(0, parseInt(field === 'receivedQty' ? value : prev.receivedQty, 10) || 0);
                const dam = Math.max(0, parseInt(field === 'damagedQty' ? value : prev.damagedQty, 10) || 0);
                updated.acceptedQty = Math.max(0, rec - dam);
            }
            return updated;
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden font-sans">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
                        Line Item Verification & Audit
                        <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2.5 py-0.5 rounded-full">
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                        </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Click on any line item row to launch the audit modal and update quantities, batch numbers, or bin locations.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAddItem}
                    className="flex items-center justify-center gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-100 shrink-0"
                >
                    <Plus className="w-4 h-4" /> Add Extra Item
                </button>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                        <tr>
                            <th className="p-4">SKU & Item Name</th>
                            <th className="p-4">Batch / Lot #</th>
                            <th className="p-4">Putaway Bin</th>
                            <th className="p-4 text-center">Ordered</th>
                            <th className="p-4 text-center bg-blue-50/40 text-blue-900">Arrived</th>
                            <th className="p-4 text-center bg-rose-50/40 text-rose-900">Damaged</th>
                            <th className="p-4 text-center bg-emerald-50/40 text-emerald-900">Accepted</th>
                            <th className="p-4">Expiry Date</th>
                            <th className="p-4 text-right">Line Value</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center py-12 text-slate-400">
                                    <Package className="w-10 h-10 mx-auto mb-2.5 text-slate-300 stroke-1" />
                                    <p className="text-sm font-medium text-slate-600">No line items present</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Click "Add Extra Item" to populate manually.</p>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => {
                                const acceptedQty = item.acceptedQty ?? (item.receivedQty - (item.damagedQty || 0));
                                const itemValue = acceptedQty * (item.unitCost || 0);
                                const hasDiscrepancy = item.receivedQty !== item.expectedQty || (item.damagedQty || 0) > 0;

                                return (
                                    <tr
                                        key={item.itemId}
                                        onClick={() => handleRowClick(item)}
                                        className="hover:bg-slate-50/85 transition-colors cursor-pointer group"
                                    >
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                                                {item.productName}
                                                {hasDiscrepancy && (
                                                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" title="Discrepancy Detected" />
                                                )}
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.sku || item.itemId}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/80 rounded-md px-2 py-1 font-mono text-[11px] text-slate-700">
                                                <Barcode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                {item.lotNumber || item.batchNumber || 'UNASSIGNED'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/80 rounded-md px-2 py-1 font-mono text-[11px] text-slate-700">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                {item.binLocation || 'UNASSIGNED'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center text-slate-600 font-medium">{item.expectedQty}</td>
                                        <td className="p-4 text-center bg-blue-50/20 font-semibold text-blue-900">
                                            {item.receivedQty}
                                        </td>
                                        <td className={`p-4 text-center bg-rose-50/20 font-semibold ${(item.damagedQty || 0) > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                            {item.damagedQty || 0}
                                        </td>
                                        <td className="p-4 text-center bg-emerald-50/20 font-bold text-emerald-700">
                                            {acceptedQty}
                                        </td>
                                        <td className="p-4 text-slate-600 font-mono text-[11px]">
                                            {item.expiryDate || 'N/A'}
                                        </td>
                                        <td className="p-4 text-right font-bold text-slate-900">
                                            ${itemValue.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRowClick(item)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                    title="Edit Item Details"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveItem(item.itemId)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
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

            {/* Audit Modal */}
            {editingItem && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setEditingItem(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold flex items-center gap-2">
                                    <Edit3 className="w-4 h-4 text-indigo-400" /> Item Inspection & Adjustment
                                </h3>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">{editingItem.itemId}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleModalSave} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Item Description / SKU Name
                                </label>
                                <input
                                    type="text"
                                    value={editingItem.productName || ''}
                                    onChange={(e) => handleModalFieldChange('productName', e.target.value)}
                                    className="w-full text-xs bg-slate-50/50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Barcode className="w-3.5 h-3.5 text-slate-400" /> Lot / Batch Number
                                    </label>
                                    <input
                                        type="text"
                                        value={editingItem.lotNumber || ''}
                                        onChange={(e) => handleModalFieldChange('lotNumber', e.target.value)}
                                        className="w-full text-xs font-mono bg-slate-50/50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> Putaway Bin Location
                                    </label>
                                    <input
                                        type="text"
                                        value={editingItem.binLocation || ''}
                                        onChange={(e) => handleModalFieldChange('binLocation', e.target.value)}
                                        className="w-full text-xs font-mono bg-slate-50/50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Ordered</label>
                                    <input
                                        type="number"
                                        value={editingItem.expectedQty ?? 0}
                                        onChange={(e) => handleModalFieldChange('expectedQty', parseInt(e.target.value, 10) || 0)}
                                        className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-blue-700 mb-1">Received (Arrived)</label>
                                    <input
                                        type="number"
                                        value={editingItem.receivedQty ?? 0}
                                        onChange={(e) => handleModalFieldChange('receivedQty', parseInt(e.target.value, 10) || 0)}
                                        className="w-full text-xs font-bold text-blue-900 bg-white border border-blue-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-rose-700 mb-1">Damaged</label>
                                    <input
                                        type="number"
                                        value={editingItem.damagedQty ?? 0}
                                        onChange={(e) => handleModalFieldChange('damagedQty', parseInt(e.target.value, 10) || 0)}
                                        className="w-full text-xs font-bold text-rose-700 bg-white border border-rose-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
                                <span className="text-xs font-semibold text-emerald-800">Net Accepted Stock:</span>
                                <span className="text-sm font-bold text-emerald-900">
                                    {editingItem.acceptedQty ?? ((editingItem.receivedQty || 0) - (editingItem.damagedQty || 0))} units
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Expiry Date
                                    </label>
                                    <input
                                        type="date"
                                        value={editingItem.expiryDate || ''}
                                        onChange={(e) => handleModalFieldChange('expiryDate', e.target.value)}
                                        className="w-full text-xs bg-slate-50/50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Unit Cost ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editingItem.unitCost ?? 0}
                                        onChange={(e) => handleModalFieldChange('unitCost', parseFloat(e.target.value) || 0)}
                                        className="w-full text-xs bg-slate-50/50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-indigo-100"
                                >
                                    <Save className="w-4 h-4" /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}