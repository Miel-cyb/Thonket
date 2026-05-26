import React from "react";

// PURCHASE CONTEXT STEP - GATHER BASIC INFO ABOUT THE PURCHASE
export default function StepPurchaseContext({ form, setForm }) {

    const handleTitleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            context: { ...prev.context, title: e.target.value }
        }));
    };

    const handleTypeChange = (e) => {
        setForm((prev) => ({
            ...prev,
            context: { ...prev.context, type: e.target.value }
        }));
    };

    return (
        <div className="space-y-5 animate-fadeIn">

            {/* INPUT BLOCK: PURCHASE TITLE */}
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="purchase-title"
                    className="text-sm font-bold tracking-tight text-slate-700"
                >
                    Purchase Order Title
                </label>
                <input
                    id="purchase-title"
                    type="text"
                    placeholder="e.g., Q3 Enterprise Server Infrastructure Upgrade"
                    value={form.context?.title || ""}
                    onChange={handleTitleChange}
                    className="w-full text-base font-normal bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 shadow-3xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
                <p className="text-xs text-slate-400 font-normal">
                    Provide a clear, recognizable reference title for audit logging.
                </p>
            </div>

            {/* SELECT BLOCK: PROCUREMENT TYPE */}
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="purchase-type"
                    className="text-sm font-bold tracking-tight text-slate-700"
                >
                    Procurement Strategy Type
                </label>
                <div className="relative">
                    <select
                        id="purchase-type"
                        value={form.context?.type || "Spot Purchase"}
                        onChange={handleTypeChange}
                        className="w-full text-base font-normal bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 shadow-3xs appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    >
                        <option value="Spot Purchase">Spot Purchase</option>
                        <option value="Bulk Restock">Bulk Restock</option>
                        <option value="Contract Fulfillment">Contract Fulfillment</option>
                        <option value="Emergency Procurement">Emergency Procurement</option>
                    </select>

                    {/* CUSTOM DROPDOWN ICON PACK */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4 stroke-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
                <p className="text-xs text-slate-400 font-normal">
                    Select the regulatory priority layer corresponding to this workflow framework.
                </p>
            </div>

        </div>
    );
}