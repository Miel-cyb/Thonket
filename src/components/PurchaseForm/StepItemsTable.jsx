import React, { useMemo } from "react";
import { Trash2, FileSpreadsheet, Box, Scale, Hash, Layers } from "lucide-react";

// ITEMS TABLE - DISPLAYS CURRENT LINE ITEMS IN THE PURCHASE, ALLOWS DELETION
export default function StepItemsTable({ items = [], setForm }) {

    // Safely parse dynamic numerical expressions to defend against string mutations
    const calculateRowTotal = (qty, price) => {
        return (Number(qty) || 0) * (Number(price) || 0);
    };

    // Global aggregations for the absolute footer matrix
    const totals = useMemo(() => {
        return items.reduce((acc, current) => {
            const qty = Number(current.qty) || 0;
            const price = Number(current.price) || 0;
            return {
                units: acc.units + qty,
                cost: acc.cost + (qty * price)
            };
        }, { units: 0, cost: 0 });
    }, [items]);

    const removeItem = (id) => {
        setForm(prev => ({
            ...prev,
            items: (prev.items || []).filter(i => i.id !== id)
        }));
    };

    // Helper to evaluate if any variant parameters actually exist before rendering containers
    const getVariantSpecs = (item) => {
        const specs = [];
        if (item.variantSize) specs.push({ label: "Size", val: item.variantSize });
        if (item.variantColor) specs.push({ label: "Color", val: item.variantColor });
        if (item.variantMaterial) specs.push({ label: "Material", val: item.variantMaterial });
        if (item.variantFlavor) specs.push({ label: "Flavor", val: item.variantFlavor });
        return specs;
    };

    return (
        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
            {items.length === 0 ? (
                <div className="p-16 text-center flex flex-col items-center justify-center bg-slate-50/30">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                        <FileSpreadsheet size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700 tracking-wide">No Items Staged</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Your staged acquisition line items will show up cleanly listed in this panel.
                    </p>
                </div>
            ) : (
                <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse text-left min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-widest select-none">
                                <th className="py-4 px-6 w-[30%]">Product Identifiers</th>
                                <th className="py-4 px-6 w-[25%]">Variant Configuration</th>
                                <th className="py-4 px-6 w-[22%]">Logistics Matrix</th>
                                <th className="py-4 px-6 w-[18%] text-right">Financials</th>
                                <th className="py-4 px-6 w-[5%] text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item) => {
                                const variantSpecs = getVariantSpecs(item);
                                const rowTotal = calculateRowTotal(item.qty, item.price);

                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors group">

                                        {/* Column 1: Core Identifiers & Description */}
                                        <td className="py-5 px-6 align-top">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md w-fit tracking-wide">
                                                    {item.sku || "UNKNOWN-SKU"}
                                                </span>
                                                {item.desc && (
                                                    <span className="text-xs font-semibold text-slate-600 line-clamp-2 max-w-xs leading-relaxed">
                                                        {item.desc}
                                                    </span>
                                                )}
                                                {item.barcode && (
                                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono mt-0.5">
                                                        <Hash size={11} className="text-slate-300" />
                                                        <span>{item.barcode}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Column 2: Variant Specification Tags */}
                                        <td className="py-5 px-6 align-top">
                                            {variantSpecs.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5 max-w-[240px] pt-0.5">
                                                    {variantSpecs.map((spec, sIdx) => (
                                                        <span
                                                            key={sIdx}
                                                            className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-medium shadow-xs"
                                                        >
                                                            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">{spec.label}:</span>
                                                            <span className="font-semibold text-slate-800">{spec.val}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs italic font-medium text-slate-400 block pt-0.5">
                                                    Standard Base Item
                                                </span>
                                            )}
                                        </td>

                                        {/* Column 3: Physical & Packing Metrics */}
                                        <td className="py-5 px-6 align-top">
                                            <div className="flex flex-col gap-2 max-w-[200px] pt-0.5">
                                                <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <Box size={13} className="text-slate-400 shrink-0" />
                                                        <span className="text-slate-400">UOM:</span>
                                                        <span className="font-bold text-slate-800 uppercase">{item.unitOfMeasure || "CASE"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Layers size={13} className="text-slate-400 shrink-0" />
                                                        <span className="text-slate-400">Pack:</span>
                                                        <span className="font-bold text-slate-800">{item.packagingFactor || 1}</span>
                                                    </div>
                                                </div>

                                                {(item.weightKg || item.volumeM3) && (
                                                    <div className="flex items-center gap-2 border-t border-slate-100 pt-1.5 text-[11px] font-medium text-slate-500">
                                                        {item.weightKg && (
                                                            <div className="flex items-center gap-1">
                                                                <Scale size={12} className="text-slate-300 shrink-0" />
                                                                <span>{item.weightKg} KG</span>
                                                            </div>
                                                        )}
                                                        {item.weightKg && item.volumeM3 && <span className="text-slate-200">|</span>}
                                                        {item.volumeM3 && (
                                                            <div>
                                                                <span>Vol: <span className="text-slate-700 font-semibold">{item.volumeM3} m³</span></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Column 4: Financial Computations */}
                                        <td className="py-5 px-6 text-right align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-slate-900 tracking-wide">
                                                    GH₵{rowTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-medium">
                                                    {item.qty || 0} units × GH₵{parseFloat(item.price || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Column 5: Action Control Panel */}
                                        <td className="py-5 px-6 text-center align-top">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-40 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 inline-flex items-center justify-center cursor-pointer"
                                                title="Delete Line Item"
                                            >
                                                <Trash2 size={14} strokeWidth={2} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        {/* Static Matrix Aggregate Summary Footer */}
                        <tfoot>
                            <tr className="bg-slate-50/60 border-t border-slate-200 text-slate-800 font-bold text-xs select-none">
                                <td colSpan="2" className="py-5 px-6 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                                    Staged Balance Summary
                                </td>
                                <td className="py-5 px-6 font-bold text-slate-600 text-xs">
                                    <span className="bg-slate-200/60 px-2.5 py-1 rounded-lg">
                                        {totals.units.toLocaleString()} Units Total
                                    </span>
                                </td>
                                <td className="py-5 px-6 text-right font-extrabold text-indigo-600 text-base tracking-wide">
                                    GH₵{totals.cost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}