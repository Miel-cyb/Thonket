import React from "react";
import {
    LayoutDashboard,
    History,
    Truck,
    DollarSign,
    ShieldAlert,
    Activity
} from "lucide-react";

export default function SupplierTabs({ tab, setTab, supplier }) {
    // Array of Objects to hold rich styling, accessibility IDs, and associated metadata icons
    const tabsConfig = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "transactions", label: "Transactions", icon: History },
        { id: "deliveries", label: "Deliveries", icon: Truck },
        { id: "financials", label: "Financials", icon: DollarSign },
        { id: "risk", label: "Risk & Compliance", icon: ShieldAlert },
        { id: "activity", label: "Activity Logs", icon: Activity },
    ];

    return (
        <div className="w-full space-y-6">

            {/* SCROLLABLE HORIZONTAL TAB STRIP */}
            <div className="border-b border-slate-200 -mx-6 px-6 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar scroll-smooth">
                <nav
                    className="flex space-x-6 min-w-max"
                    role="tablist"
                    aria-label="Supplier profile workspace"
                >
                    {tabsConfig.map((item) => {
                        const Icon = item.icon;
                        const isActive = tab === item.id;

                        return (
                            <button
                                key={item.id}
                                id={`tab-trigger-${item.id}`}
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`tab-panel-${item.id}`}
                                tabIndex={isActive ? 0 : -1}
                                onClick={() => setTab(item.id)}
                                className={`flex items-center gap-2 py-3.5 px-1 text-sm font-semibold border-b-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-t-lg ${isActive
                                    ? "border-slate-900 text-slate-900"
                                    : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"
                                    }`}
                            >
                                <Icon
                                    size={16}
                                    className={`transition-colors ${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-500"}`}
                                />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* TAB WINDOW CONTENT - (Double card border wrapping has been flattened) */}
            <div
                className="mt-2"
                role="tabpanel"
                id={`tab-panel-${tab}`}
                aria-labelledby={`tab-trigger-${tab}`}
            >
                {tab === "overview" && (
                    <div className="animate-fadeIn space-y-4">
                        <h4 className="text-base font-bold text-slate-900">Supplier Intelligence</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Overview intelligence data for {supplier?.name || "this vendor"}.
                        </p>
                    </div>
                )}

                {tab === "transactions" && (
                    <div className="animate-fadeIn space-y-4">
                        <h4 className="text-base font-bold text-slate-900">Transaction History</h4>
                        <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-sm text-slate-400">
                            Transaction history data grid view placeholder...
                        </div>
                    </div>
                )}

                {tab === "deliveries" && (
                    <div className="animate-fadeIn space-y-4">
                        <h4 className="text-base font-bold text-slate-900">Logistics &amp; Delivery Tracking</h4>
                        <p className="text-sm text-slate-600">Delivery performance logs profile tracking...</p>
                    </div>
                )}

                {tab === "financials" && (
                    <div className="animate-fadeIn space-y-4">
                        <h4 className="text-base font-bold text-slate-900">Financial Ledger</h4>
                        <p className="text-sm text-slate-600">Invoices, statement records, payments, and credit line utilization...</p>
                    </div>
                )}

                {tab === "risk" && (
                    <div className="animate-fadeIn space-y-4">
                        <h4 className="text-base font-bold text-slate-900">Risk Assessment Matrix</h4>
                        <p className="text-sm text-slate-600">Risk profiles, scoring systems, and active standard compliance tracking...</p>
                    </div>
                )}

                {tab === "activity" && (
                    <div className="animate-fadeIn space-y-4">
                        <h4 className="text-base font-bold text-slate-900">System Audit Logs</h4>
                        <p className="text-sm text-slate-600">System audit trails and vendor interaction notes.</p>
                    </div>
                )}
            </div>

        </div>
    );
}