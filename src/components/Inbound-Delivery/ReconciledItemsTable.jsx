
import React from 'react';
import { Layers, MapPin } from 'lucide-react';

// ReconciledItemsTable Component 
// - Displays a detailed table of reconciled inventory line items for a given order
export default function ReconciledItemsTable({ items, reconciliationTotal }) {
    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" /> Reconciled Inventory Line Items ({items.length})
                </h2>
                <div className="text-sm font-medium bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80 text-slate-700 shadow-2xs">
                    Total Valuation: <span className="font-semibold text-slate-900">GH₵{(reconciliationTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div className="overflow-x-auto border border-slate-200/60 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold font-mono text-xs">
                            <th className="py-3.5 px-4">Item Name & SKU</th>
                            <th className="py-3.5 px-4">Ordered / Accepted</th>
                            <th className="py-3.5 px-4">Lot Number</th>
                            <th className="py-3.5 px-4">Expiry Date</th>
                            <th className="py-3.5 px-4">Bin Location</th>
                            <th className="py-3.5 px-4 text-right">Unit Cost</th>
                            <th className="py-3.5 px-4 text-right">Total Cost</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-12 text-center text-slate-400 italic">
                                    No items found in this delivery batch.
                                </td>
                            </tr>
                        ) : (
                            items.map((item, index) => {
                                const isMatch = (item.orderedQty === item.acceptedQty) && (!item.damagedQty || item.damagedQty === 0);
                                const lineTotal = (item.acceptedQty || 0) * (item.unitCost || 0);
                                return (
                                    <tr key={item.id || index} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-3.5 px-4 font-medium text-slate-800">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span>{item.name || 'Unnamed SKU'}</span>
                                                {!isMatch && (
                                                    <span className="px-1.5 py-0.5 rounded text-xs bg-amber-50 text-amber-800 border border-amber-200/80 font-medium tracking-wide">
                                                        Discrepancy
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-sm">
                                            <span className="text-slate-500">{item.orderedQty ?? 0}</span>
                                            <span className="mx-1.5 text-slate-300">/</span>
                                            <span className="font-semibold text-emerald-700">{item.acceptedQty ?? 0}</span>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-sm text-slate-600">{item.lotNumber || 'N/A'}</td>
                                        <td className="py-3.5 px-4 text-sm text-slate-600">
                                            {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm text-slate-600">
                                            <span className="inline-flex items-center gap-1 font-medium text-slate-700 bg-slate-100/70 px-2 py-0.5 rounded-md border border-slate-200/50">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-mono font-normal text-sm text-slate-700">
                                            GH₵{(item.unitCost || 0).toFixed(2)}
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-sm text-slate-800">
                                            GH₵{lineTotal.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}