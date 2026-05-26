import React, { useState } from "react";

import SupplierDetailHeader from "../components/Suppliers/SupplierHeader";
import SupplierKpiPanel from "../components/Suppliers/SupplierKpiPanel";
import SupplierTabs from "../components/Suppliers/SupplierTabs";
import SupplierProfileCard from "../components/Suppliers/SupplierProfileCard";

export default function SupplierDetailPage() {
    const [tab, setTab] = useState("overview");
    const [viewMode, setViewMode] = useState("profile"); // Set to 'profile' default for a complete layout experience

    const supplier = {
        id: 1,
        name: "Golden FMCG Ltd",
        type: "Distributor",
        status: "verified",
        location: "Accra, Ghana",
        address: "Tema Industrial Area, Warehouse Zone B",
        phone: "+233 24 000 0000",
        email: "contact@goldenfmcg.com",

        registrationNumber: "REG-ACC-88421",
        taxId: "TIN-5566778899",
        yearEstablished: 2014,

        categories: ["Beverages", "Snacks", "Household Goods"],
        deliveryType: "Supplier Delivery",
        coverageAreas: ["Accra", "Tema", "Kasoa"],

        risk: "low",
        complianceStatus: "verified",

        capacity: "50,000 units/month",
        reliabilityScore: "96%",

        primaryContact: {
            name: "Kwame Mensah",
            role: "Sales Manager",
            phone: "+233 24 000 0000",
            email: "kwame@goldenfmcg.com"
        },

        stats: {
            totalOrders: 1240,
            activeOrders: 18,
            completedOrders: 1180,
            totalSpend: 540000,
            avgOrderValue: 435,
            deliveryRate: 96,
            returnRate: 2,
            fulfillmentRate: 94,
            lastOrderDate: "2026-05-20"
        }
    };

    const isProfileMode = viewMode === "profile";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
            
            {/* HEADER */}
            <SupplierDetailHeader
                supplier={supplier}
                onOpenProfile={() => setViewMode(isProfileMode ? "main" : "profile")}
                isProfileActive={isProfileMode}
            />

            {/* MAIN CONTAINER */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                
                {/* KPI PANEL - Universal visibility remains intact */}
                <section aria-label="Key Performance Indicators">
                    <SupplierKpiPanel supplier={supplier} />
                </section>

                {/* ADAPTIVE WORKSPACE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* SIDEBAR: PROFILE CARD */}
                    {isProfileMode && (
                        <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-6 transition-all duration-300 ease-in-out">
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                
                                {/* DISMISS/HEADER PANEL */}
                                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Supplier Profile
                                    </h3>
                                    <button
                                        onClick={() => setViewMode("main")}
                                        className="text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                                        aria-label="Close Profile Panel"
                                    >
                                        Hide
                                    </button>
                                </div>

                                <div className="p-4">
                                    <SupplierProfileCard supplier={supplier} />
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* MAIN CONTENT AREA: TABS & DATA */}
                    <main className={`transition-all duration-300 ${isProfileMode ? "lg:col-span-8 xl:col-span-9" : "lg:col-span-12"}`}>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[500px]">
                            <SupplierTabs
                                supplier={supplier}
                                tab={tab}
                                setTab={setTab}
                            />
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}