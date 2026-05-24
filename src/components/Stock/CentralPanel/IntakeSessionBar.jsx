import React from "react";

const IntakeSessionBar = ({
    session,
    onChange,
    locked,
    onToggleLock,
    suppliers = [],
    zones = []
}) => {
    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold text-gray-700">
                    Intake Session (Required Before Scanning)
                </h2>

                <button
                    onClick={onToggleLock}
                    className={`px-3 py-1 text-xs font-bold rounded-lg ${locked
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                >
                    {locked ? "Locked" : "Open Session"}
                </button>
            </div>

            {/* FIELDS (THIS IS WHAT YOU WERE MISSING) */}
            <div className="grid grid-cols-5 gap-3">

                {/* SUPPLIER */}
                <select
                    className="input"
                    value={session.supplier}
                    onChange={(e) => onChange("supplier", e.target.value)}
                >
                    <option value="">Supplier</option>
                    {suppliers.map((s, i) => (
                        <option key={i} value={s.name}>
                            {s.name}
                        </option>
                    ))}
                </select>

                {/* INVOICE */}
                <input
                    className="input"
                    placeholder="Invoice #"
                    value={session.invoice}
                    onChange={(e) => onChange("invoice", e.target.value)}
                />

                {/* PO */}
                <input
                    className="input"
                    placeholder="PO #"
                    value={session.po}
                    onChange={(e) => onChange("po", e.target.value)}
                />

                {/* BATCH (GLOBAL SHIPMENT BATCH) */}
                <input
                    className="input"
                    placeholder="Batch / GRN Ref"
                    value={session.batch}
                    onChange={(e) => onChange("batch", e.target.value)}
                />

                {/* WAREHOUSE */}
                <select
                    className="input"
                    value={session.warehouse}
                    onChange={(e) => onChange("warehouse", e.target.value)}
                >
                    <option value="">Warehouse</option>
                    {zones.map((z, i) => (
                        <option key={i} value={z.name}>
                            {z.name}
                        </option>
                    ))}
                </select>

            </div>

            <style>{`
                .input {
                    width: 100%;
                    padding: 8px 10px;
                    font-size: 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    background: #f9fafb;
                    outline: none;
                }
                .input:focus {
                    border-color: #3b82f6;
                    background: white;
                }
            `}</style>

        </div>
    );
};

export default IntakeSessionBar;