import React, { useState } from "react";
// Corrected typos to align seamlessly with your step configurations
import StepBusinessIdentity from "../single/SteBusinessIdentity";
import StepLegalVerification from "../single/StepLegalVerification";
import StepContactInformation from "../single/StepContactInformation";
import StepLocationDetails from "../single/StepLocationDetails";
import StepSupplyCapability from "../single/StepSupplyCapability";
import StepCoverageLogistics from "../single/StepCoverageLogistics";
import StepComplianceRisk from "../single/StepComplianceRisk";
import StepReview from "../single/StepReview";

export default function BulkSupplierRow({
    data = {},
    index,
    isExpanded,
    onToggleExpand,
    onUpdateRow,
    onDeleteRow
}) {
    const [wizardStep, setWizardStep] = useState(0);

    const businessIdentity = data.businessIdentity || {};
    const businessName = businessIdentity.businessName || "";
    const businessType = businessIdentity.businessType || "Manufacturer";

    const wizardSteps = [
        { id: "businessIdentity", name: "Identity", component: StepBusinessIdentity },
        { id: "legalVerification", name: "Legal", component: StepLegalVerification },
        { id: "contactInformation", name: "Contact", component: StepContactInformation },
        { id: "locationDetails", name: "Location", component: StepLocationDetails },
        { id: "supplyCapability", name: "Supply", component: StepSupplyCapability },
        { id: "coverageLogistics", name: "Logistics", component: StepCoverageLogistics },
        { id: "complianceRisk", name: "Compliance", component: StepComplianceRisk },
        { id: "review", name: "Review", component: StepReview },
    ];

    const CurrentStepComponent = wizardSteps[wizardStep].component;
    const isFirstStep = wizardStep === 0;
    const isLastStep = wizardStep === wizardSteps.length - 1;

    const handleWizardUpdate = (stepKey, stepData) => {
        if (!onUpdateRow) return;
        onUpdateRow(index, {
            ...data,
            [stepKey]: {
                ...(data[stepKey] || {}),
                ...stepData
            }
        });
    };

    const handleNext = () => {
        if (!isLastStep) {
            setWizardStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (!isFirstStep) {
            setWizardStep((prev) => prev - 1);
        }
    };

    return (
        <div className={`w-full transition-all duration-200 border-b border-slate-200/60 ${isExpanded
            ? "bg-slate-50/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
            : "bg-white hover:bg-slate-50/40"
            }`}>

            {/* 1. Header Summarized Overview Bar (Always Visible) */}
            <div
                onClick={onToggleExpand}
                className="w-full px-6 py-4 flex items-center justify-between cursor-pointer select-none group"
            >
                <div className="flex items-center gap-4 min-w-0">
                    {/* Line Index Badge */}
                    <span className={`text-[11px] font-mono font-bold w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-150 ${isExpanded
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-400 border-slate-200 group-hover:border-slate-300 group-hover:text-slate-600"
                        }`}>
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Summary Context Fields */}
                    <div className="truncate">
                        <h4 className={`text-sm font-semibold truncate transition-colors duration-150 ${isExpanded ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
                            }`}>
                            {businessName || <span className="text-slate-400 font-normal italic">Empty Staged Profile Name</span>}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                            {businessType} &bull; Step {wizardStep + 1} of {wizardSteps.length} ({wizardSteps[wizardStep].name})
                        </span>
                    </div>
                </div>

                {/* Micro Action Layout Row Controls */}
                <div className="flex items-center gap-2.5 ml-4 flex-shrink-0">
                    {onDeleteRow && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation(); // Avoid triggering accordion expansion
                                onDeleteRow(index);
                            }}
                            title="Delete Row Entry"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150 cursor-pointer focus:outline-none"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}

                    {/* Chevron Toggle Status Icon */}
                    <div className={`p-1 rounded-lg text-slate-400 group-hover:text-slate-600 transition-all duration-200 ${isExpanded ? "rotate-180 bg-slate-200/40 text-slate-800" : ""
                        }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* 2. Collapsible Dynamic Wizard Canvas Area */}
            {isExpanded && (
                <div className="border-t border-slate-200/60 bg-white animate-in fade-in slide-in-from-top-1 duration-200">

                    {/* Mini Timeline Tracker */}
                    <div className="bg-slate-50/50 border-b border-slate-200/50 px-8 py-3 hidden sm:grid grid-cols-8 gap-3">
                        {wizardSteps.map((s, idx) => {
                            const isCompleted = idx < wizardStep;
                            const isActive = idx === wizardStep;
                            return (
                                <div
                                    key={s.id}
                                    onClick={() => setWizardStep(idx)}
                                    className="flex flex-col gap-1.5 cursor-pointer group/step select-none"
                                >
                                    <div className={`h-1 w-full rounded-full transition-all duration-150 ${isActive
                                        ? "bg-slate-900"
                                        : isCompleted
                                            ? "bg-emerald-500"
                                            : "bg-slate-200 group-hover/step:bg-slate-300"
                                        }`} />
                                    <span className={`text-[10px] font-bold tracking-tight truncate transition-colors duration-150 ${isActive ? "text-slate-900" : "text-slate-400 group-hover/step:text-slate-600"
                                        }`}>
                                        {s.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Active Form Dynamic Component Frame with Premium Scrollbars */}
                    <div className="px-8 py-6 max-w-4xl overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-slate-300 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
                        <CurrentStepComponent
                            formData={data}
                            updateFormData={handleWizardUpdate}
                            onNext={handleNext}
                            onLeft={handleBack}
                        />
                    </div>

                    {/* Integrated Sub-step Control Bar Footer */}
                    <div className="flex items-center justify-between px-8 py-3 bg-slate-50/50 border-t border-slate-200/50">
                        <button
                            type="button"
                            disabled={isFirstStep}
                            onClick={handleBack}
                            className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white font-semibold text-xs text-slate-600 rounded-lg shadow-sm transition-all duration-150 cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isLastStep}
                            className={`px-4 py-1.5 font-bold text-xs text-white rounded-lg transition-all duration-150 shadow-sm focus:outline-none ${isLastStep
                                ? "bg-emerald-600 border border-emerald-600/20 shadow-emerald-600/10 opacity-70 cursor-not-allowed"
                                : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/10 cursor-pointer focus:ring-2 focus:ring-slate-900/10"
                                }`}
                        >
                            {isLastStep ? "Step Validated" : "Save & Continue"}
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}