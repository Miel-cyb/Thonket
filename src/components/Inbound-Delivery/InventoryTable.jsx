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

//==========================
// Component: InventoryTable
//==========================
export default function InventoryTable({ items = [], onItemChange, onAddItem, onRemoveItem }) {
    const [editingItem, setEditingItem] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleRowClick = (item) => {
        setErrorMsg('');
        // Ensure acceptedQty is initialized properly when opening modal
        setEditingItem({
            ...item,
            acceptedQty: item.acceptedQty ?? Math.max(0, (item.receivedQty || 0) - (item.damagedQty || 0))
        });
    };

    const handleModalSave = (e) => {
        e.preventDefault();
        if (!editingItem) return;

        // Validation 1: Prevent submitting empty product names
        if (!editingItem.productName || editingItem.productName.trim() === '') {
            setErrorMsg('Item Description / SKU Name cannot be empty.');
            return;
        }

        // Validation 2: Ensure batch number is required and not empty
        if (!editingItem.lotNumber || editingItem.lotNumber.trim() === '') {
            setErrorMsg('Batch / Lot Number is required and cannot be empty.');
            return;
        }

        // Validation 3: Ensure received quantity is required and not empty (allows 0 if explicitly typed, but catches empty states)
        if (editingItem.receivedQty === '' || editingItem.receivedQty === null || editingItem.receivedQty === undefined) {
            setErrorMsg('Received Quantity is required and cannot be empty.');
            return;
        }

        // Pass the entire updated item object to the parent
        onItemChange(editingItem.itemId, editingItem);
        setEditingItem(null);
        setErrorMsg('');
    };

    const handleModalFieldChange = (field, value) => {
        setEditingItem((prev) => {
            if (!prev) return null;
            let updated = { ...prev, [field]: value };

            // Auto-populate batch number for other unassigned items if requested
            if (field === 'lotNumber' && typeof value === 'string' && value.trim() !== '') {
                items.forEach((item) => {
                    if (item.itemId !== prev.itemId && (!item.lotNumber || item.lotNumber.trim() === '')) {
                        onItemChange(item.itemId, { ...item, lotNumber: value });
                    }
                });
            }

            // Recalculate quantities dynamically and compute shortage/variance costs accurately
            if (field === 'receivedQty' || field === 'damagedQty' || field === 'expectedQty') {
                const exp = field === 'expectedQty' ? (value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0)) : prev.expectedQty;
                const rec = field === 'receivedQty' ? (value === '' ? '' : Math.max(0, parseInt(value, 10) || 0)) : prev.receivedQty;
                const dam = field === 'damagedQty' ? (value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0)) : prev.damagedQty;

                const parsedRec = rec === '' ? 0 : rec;
                const accepted = Math.max(0, parsedRec - dam);
                const shortage = Math.max(0, exp - parsedRec);
                const overage = Math.max(0, parsedRec - exp);
                const varianceCost = (parsedRec - exp) * (prev.unitCost || 0);

                updated.expectedQty = exp;
                updated.receivedQty = rec;
                updated.damagedQty = dam;
                updated.acceptedQty = accepted;
                updated.shortageQty = shortage;
                updated.overageQty = overage;
                updated.lineVarianceCost = varianceCost;
                updated.discrepancyReason = shortage > 0 ? 'SHORTAGE' : overage > 0 ? 'OVERAGE' : 'NONE';
                updated.isFullyReceived = parsedRec >= exp;
                updated.itemProgressPercentage = exp > 0 ? Math.min(100, Math.round((parsedRec / exp) * 100)) : 0;
            }

            return updated;
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden font-sans text-sm">
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
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="p-4">SKU & Item Name</th>
                            <th className="p-4">Batch / Lot #</th>
                            <th className="p-4">Putaway Bin</th>
                            <th className="p-4 text-center">Ordered</th>
                            <th className="p-4 text-center bg-blue-50/40 text-blue-900">Received</th>
                            <th className="p-4 text-center bg-amber-50/40 text-amber-900">Shortage</th>
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
                                <td colSpan="11" className="text-center py-12 text-slate-400">
                                    <Package className="w-10 h-10 mx-auto mb-2.5 text-slate-300 stroke-1" />
                                    <p className="text-sm font-medium text-slate-600">No line items present</p>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => {
                                const receivedQty = item.receivedQty || 0;
                                const acceptedQty = item.acceptedQty ?? Math.max(0, receivedQty - (item.damagedQty || 0));
                                const shortageQty = item.shortageQty ?? Math.max(0, (item.expectedQty || 0) - receivedQty);
                                const itemValue = acceptedQty * (item.unitCost || 0);
                                const hasDiscrepancy = receivedQty !== item.expectedQty || (item.damagedQty || 0) > 0;

                                return (
                                    <tr
                                        key={item.itemId}
                                        onClick={() => handleRowClick(item)}
                                        className="hover:bg-slate-50/85 transition-colors cursor-pointer group"
                                    >
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-sm">
                                                {item.productName}
                                                {hasDiscrepancy && (
                                                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" title="Discrepancy Detected" />
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono mt-0.5">{item.sku || item.itemId}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/80 rounded-md px-2 py-1 font-mono text-xs text-slate-700">
                                                <Barcode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                {item.lotNumber || item.batchNumber || 'UNASSIGNED'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/80 rounded-md px-2 py-1 font-mono text-xs text-slate-700">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                {item.binLocation || 'UNASSIGNED'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center text-slate-600 font-medium">{item.expectedQty}</td>
                                        <td className="p-4 text-center bg-blue-50/20 font-semibold text-blue-900">
                                            {receivedQty}
                                        </td>
                                        <td className={`p-4 text-center bg-amber-50/20 font-semibold ${shortageQty > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                                            {shortageQty}
                                        </td>
                                        <td className={`p-4 text-center bg-rose-50/20 font-semibold ${(item.damagedQty || 0) > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                            {item.damagedQty || 0}
                                        </td>
                                        <td className="p-4 text-center bg-emerald-50/20 font-bold text-emerald-700">
                                            {acceptedQty}
                                        </td>
                                        <td className="p-4 text-slate-600 font-mono text-xs">
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
                                <h3 className="text-base font-bold flex items-center gap-2">
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
                            {errorMsg && (
                                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Item Description / SKU Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editingItem.productName || ''}
                                    onChange={(e) => {
                                        setErrorMsg('');
                                        handleModalFieldChange('productName', e.target.value);
                                    }}
                                    className="w-full text-sm bg-slate-50/50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Barcode className="w-3.5 h-3.5 text-slate-400" /> Lot / Batch Number <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingItem.lotNumber || ''}
                                        onChange={(e) => {
                                            setErrorMsg('');
                                            handleModalFieldChange('lotNumber', e.target.value);
                                        }}
                                        className="w-full text-sm font-mono bg-slate-50/50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition"
                                        placeholder="e.g., GH4567"
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
                                        className="w-full text-sm font-mono bg-slate-50/50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 grid grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Ordered</label>
                                    <input
                                        type="number"
                                        value={editingItem.expectedQty ?? ''}
                                        onChange={(e) => handleModalFieldChange('expectedQty', e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10) || 0))}
                                        className="w-full text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-blue-700 mb-1">Received <span className="text-rose-500">*</span></label>
                                    <input
                                        type="number"
                                        required
                                        value={editingItem.receivedQty ?? ''}
                                        onChange={(e) => {
                                            setErrorMsg('');
                                            handleModalFieldChange('receivedQty', e.target.value === '' ? '' : e.target.value);
                                        }}
                                        className="w-full text-sm font-bold text-blue-900 bg-white border border-blue-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-amber-700 mb-1">Shortage</label>
                                    <input
                                        type="number"
                                        readOnly
                                        value={editingItem.shortageQty ?? 0}
                                        className="w-full text-sm font-bold text-amber-800 bg-amber-50/40 border border-amber-200 rounded-lg p-2.5 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-rose-700 mb-1">Damaged</label>
                                    <input
                                        type="number"
                                        value={editingItem.damagedQty ?? ''}
                                        onChange={(e) => handleModalFieldChange('damagedQty', e.target.value === '' ? '' : e.target.value)}
                                        className="w-full text-sm font-bold text-rose-700 bg-white border border-rose-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
                                <span className="text-sm font-semibold text-emerald-800">Net Accepted Stock:</span>
                                <span className="text-base font-bold text-emerald-900">
                                    {editingItem.acceptedQty ?? 0} units
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
                                        className="w-full text-sm bg-slate-50/50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Unit Cost ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editingItem.unitCost ?? ''}
                                        onChange={(e) => handleModalFieldChange('unitCost', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                        className="w-full text-sm bg-slate-50/50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-indigo-100"
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