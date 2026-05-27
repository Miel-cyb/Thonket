import React, { useState } from "react";
import OnboardingHeader from "../components/supplier-onboarding/components/OnboardingHeader";
import ModeSwitcher from "../components/supplier-onboarding/components/ModeSwitcher";
import SingleSupplierWizard from "../components/supplier-onboarding/components/SingleSupplierWizard";
import BulkSupplierTable from "../components/supplier-onboarding/bulk/BulkSupplierTable";

export default function SupplierOnboardingPage() {
    const [mode, setMode] = useState("single"); // single | bulk

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased selection:bg-slate-200">

            {/* Header Section - Changed from sticky top-0 to relative to clear workflow headers cleanly */}
            <header className="relative w-full border-b border-slate-200/80 bg-white transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <OnboardingHeader />
                </div>
            </header>

            {/* Main Content Wrapper - Tweaked padding structure to create a clean gap */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 animate-in fade-in duration-300">

                {/* Mode Switch Card */}
                <div className="mb-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                                Supplier Registration Portal
                            </h1>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Select your preferred intake workflow to register new vendors.
                            </p>
                        </div>

                        <div className="flex items-center self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
                            <ModeSwitcher mode={mode} setMode={setMode} />
                        </div>

                    </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="transition-all duration-200 ease-in-out">
                    {mode === "single" ? (
                        /* Rendered directly without an extra card container wrapper 
                           to prevent double-border styling anomalies with the inner wizard elements
                        */
                        <div className="transition-all duration-300 transform translate-y-0">
                            <SingleSupplierWizard />
                        </div>
                    ) : (
                        /* Bulk Mode layout container - features overflow control rules 
                           tailored to comfortably host high-density structured tables
                        */
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                            <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/70">
                                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                                    Bulk Upload Entry Registry
                                </h2>
                            </div>
                            <div className="p-6 overflow-x-auto">
                                <BulkSupplierTable />
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}