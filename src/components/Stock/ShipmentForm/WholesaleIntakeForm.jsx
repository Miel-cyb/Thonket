import React, { useState } from "react";

const WholesaleIntakeForm = ({
    zones = [],
    onSubmit,
}) => {

    const [items, setItems] = useState([
        {
            id: Date.now(),
            sku: "",
            barcode: "",
            product: "",
            variant: "",
            qty: 1,
            damagedQty: 0,
            uom: "PCS",
            unitCost: "",
            batch: "",
            expiryDate: "",
            zone: "",
        },
    ]);

    const updateItem = (id, field, value) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const addItemRow = () => {
        setItems((prev) => [
            ...prev,
            {
                id: Date.now(),
                sku: "",
                barcode: "",
                product: "",
                variant: "",
                qty: 1,
                damagedQty: 0,
                uom: "PCS",
                unitCost: "",
                batch: "",
                expiryDate: "",
                zone: "",
            },
        ]);
    };

    const removeRow = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const totalUnits = items.reduce((s, i) => s + Number(i.qty || 0), 0);
    const totalDamaged = items.reduce((s, i) => s + Number(i.damagedQty || 0), 0);
    const totalValue = items.reduce(
        (s, i) => s + Number(i.qty || 0) * Number(i.unitCost || 0),
        0
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            items,
            totals: { totalUnits, totalDamaged, totalValue },
        });
    };

    /* =========================
        INPUT STYLE
    ========================= */
    const input =
        "w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl " +
        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";

    const label =
        "text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1";

    return (
        <div className="max-w-7xl mx-auto my-10 bg-white rounded-3xl border shadow-2xl overflow-hidden font-sans">

            {/* HEADER */}
            <div className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Wholesale Stock Intake
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Register inventory units and assign storage zones.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={addItemRow}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                    + Add Row
                </button>
            </div>

            {/* SUMMARY */}
            <div className="px-8 py-5 flex flex-wrap gap-3 border-b bg-white">

                <div className="px-4 py-2 rounded-xl bg-slate-50 border">
                    <p className={label}>Units</p>
                    <p className="text-lg font-black">{totalUnits}</p>
                </div>

                <div className="px-4 py-2 rounded-xl bg-red-50 border">
                    <p className={label}>Damaged</p>
                    <p className="text-lg font-black text-red-600">{totalDamaged}</p>
                </div>

                <div className="px-4 py-2 rounded-xl bg-emerald-50 border">
                    <p className={label}>Value</p>
                    <p className="text-lg font-black text-emerald-600">
                        ₵{totalValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>

            </div>

            <form onSubmit={handleSubmit}>

                {/* TABLE */}
                <div className="p-8">

                    <div className="border border-slate-200 rounded-2xl overflow-hidden">

                        <table className="w-full table-fixed">

                            <thead>
                                <tr className="bg-slate-50 border-b">
                                    <th className="p-5 text-left text-xs uppercase tracking-wider text-slate-600 font-bold w-1/4">
                                        Product
                                    </th>

                                    <th className="p-5 text-left text-xs uppercase tracking-wider text-slate-600 font-bold w-1/6">
                                        Qty
                                    </th>

                                    <th className="p-5 text-left text-xs uppercase tracking-wider text-slate-600 font-bold w-1/6">
                                        Pricing
                                    </th>

                                    <th className="p-5 text-left text-xs uppercase tracking-wider text-slate-600 font-bold w-1/4">
                                        Batch / Zone
                                    </th>

                                    <th className="p-5 text-left text-xs uppercase tracking-wider text-slate-600 font-bold w-24">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="align-top hover:bg-slate-50 transition"
                                    >

                                        {/* PRODUCT GROUP */}
                                        <td className="p-5 space-y-3">
                                            <div>
                                                <div className={label}>SKU</div>
                                                <input
                                                    className={input}
                                                    value={item.sku}
                                                    onChange={(e) =>
                                                        updateItem(item.id, "sku", e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <div className={label}>Product</div>
                                                <input
                                                    className={input}
                                                    value={item.product}
                                                    onChange={(e) =>
                                                        updateItem(item.id, "product", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </td>

                                        {/* QTY GROUP */}
                                        <td className="p-5 space-y-3">
                                            <div>
                                                <div className={label}>Qty</div>
                                                <input
                                                    type="number"
                                                    className={input}
                                                    value={item.qty}
                                                    onChange={(e) =>
                                                        updateItem(item.id, "qty", e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <div className={label}>Damaged</div>
                                                <input
                                                    type="number"
                                                    className={input}
                                                    value={item.damagedQty}
                                                    onChange={(e) =>
                                                        updateItem(item.id, "damagedQty", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </td>

                                        {/* PRICING */}
                                        <td className="p-5 space-y-3">
                                            <div>
                                                <div className={label}>Unit Cost</div>
                                                <input
                                                    type="number"
                                                    className={input}
                                                    value={item.unitCost}
                                                    onChange={(e) =>
                                                        updateItem(item.id, "unitCost", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </td>

                                        {/* BATCH / ZONE */}
                                        <td className="p-5 space-y-3">
                                            <div>
                                                <div className={label}>Batch</div>
                                                <input
                                                    className={input}
                                                    value={item.batch}
                                                    onChange={(e) =>
                                                        updateItem(item.id, "batch", e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <div className={label}>Zone</div>
                                                <select
                                                    className={input}
                                                    value={item.zone}
                                                    onChange={(e) =>
                                                        updateItem(item.id, "zone", e.target.value)
                                                    }
                                                >
                                                    <option value="">Select Zone</option>
                                                    {zones.map((z, i) => (
                                                        <option key={i} value={z.name}>
                                                            {z.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>

                                        {/* ACTION (FIXED ALIGNMENT) */}
                                        <td className="p-5">
                                            <div className="h-full flex items-end justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(item.id)}
                                                    className="text-sm px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 transition"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table>

                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-4 p-6 border-t bg-white">

                    <button
                        type="button"
                        className="px-6 py-3 rounded-xl border font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Save Draft
                    </button>

                    <button
                        type="submit"
                        className="px-7 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                    >
                        Post Stock Intake
                    </button>

                </div>

            </form>
        </div>
    );
};

export default WholesaleIntakeForm;