import React, { useState } from "react";
import OnboardingHeader from "../components/supplier-onboarding/components/OnboardingHeader";
import ModeSwitcher from "../components/supplier-onboarding/components/ModeSwitcher";
import SingleSupplierWizard from "../components/supplier-onboarding/components/SingleSupplierWizard";
import BulkSupplierTable from "../components/supplier-onboarding/bulk/BulkSupplierTable";

export default function SupplierOnboardingPage() {
    const [mode, setMode] = useState("single"); // single | bulk

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-slate-200">

            {/* Global App Header Block */}
            <header className="w-full border-b border-slate-200/60 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <OnboardingHeader />
                </div>
            </header>

            {/* Main Content Layout Workspace Frame */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-200">

                {/* Tightened Portal Header & Workflow Switcher Row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5 pb-4 border-b border-slate-200/60">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            Supplier Registration Portal
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Select your preferred intake workflow pipeline to clear corporate profiles.
                        </p>
                    </div>

                    {/* Mode Switcher Layout Alignment Placement */}
                    <div className="flex-shrink-0 self-start md:self-auto">
                        <ModeSwitcher mode={mode} setMode={setMode} />
                    </div>
                </div>

                {/* Dynamic Onboarding Target Canvas Area */}
                <div className="w-full">
                    {mode === "single" ? (
                        <div className="animate-in fade-in slide-in-from-bottom-1.5 duration-200">
                            <SingleSupplierWizard />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-1.5 duration-200">
                            <BulkSupplierTable />
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}