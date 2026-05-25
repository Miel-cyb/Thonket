import React, { useState } from "react";

// Corrected import typo: "SteBusinessIdentity" changed to "StepBusinessIdentity"
import StepBusinessIdentity from "../single/SteBusinessIdentity";
import StepLegalVerification from "../single/StepLegalVerification";
import StepContactInformation from "../single/StepContactInformation";
import StepLocationDetails from "../single/StepLocationDetails";
import StepSupplyCapability from "../single/StepSupplyCapability";
import StepCoverageLogistics from "../single/StepCoverageLogistics";
import StepComplianceRisk from "../single/StepComplianceRisk";
import StepReview from "../single/StepReview";

export default function SingleSupplierWizard() {
    const [step, setStep] = useState(0);

    const [formData, setFormData] = useState({
        businessIdentity: {},
        legalVerification: {},
        contactInformation: {},
        locationDetails: {},
        supplyCapability: {},
        coverageLogistics: {},
        complianceRisk: {},
    });

    const steps = [
        { id: "identity", name: "Identity", component: StepBusinessIdentity },
        { id: "legal", name: "Legal", component: StepLegalVerification },
        { id: "contact", name: "Contact", component: StepContactInformation },
        { id: "location", name: "Location", component: StepLocationDetails },
        { id: "supply", name: "Supply", component: StepSupplyCapability },
        { id: "logistics", name: "Logistics", component: StepCoverageLogistics },
        { id: "compliance", name: "Compliance", component: StepComplianceRisk },
        { id: "review", name: "Review", component: StepReview },
    ];

    const StepComponent = steps[step].component;
    const isFirstStep = step === 0;
    const isLastStep = step === steps.length - 1;

    const updateFormData = (stepKey, data) => {
        setFormData((prev) => ({
            ...prev,
            [stepKey]: { ...prev[stepKey], ...data },
        }));
    };

    const handleNext = () => {
        if (isLastStep) {
            handleSubmit();
        } else {
            setStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        if (!isFirstStep) {
            setStep((prevStep) => prevStep - 1);
        }
    };

    const handleSubmit = () => {
        console.log("Submitting all onboarding data:", formData);
        alert("Supplier Onboarding Submitted Successfully!");
    };

    return (
        <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all">

            {/* 8-Step Modern Visual Matrix Timeline Header */}
            <div className="bg-slate-50/70 border-b border-slate-100 p-6">
                <div className="hidden md:grid grid-cols-8 gap-2 relative">
                    {steps.map((s, idx) => {
                        const isCompleted = idx < step;
                        const isActive = idx === step;

                        return (
                            <div key={s.id} className="flex flex-col gap-2 relative">
                                {/* Connector line between pills */}
                                {idx !== 0 && (
                                    <div className={`absolute top-3.5 -left-1/2 right-1/2 h-0.5 z-0 ${idx <= step ? "bg-slate-900" : "bg-slate-200"
                                        }`} />
                                )}

                                {/* Step Node Circle */}
                                <button
                                    type="button"
                                    disabled={idx > step && !isCompleted}
                                    onClick={() => setStep(idx)}
                                    className={`relative z-10 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mx-auto ${isActive
                                        ? "bg-slate-900 text-white ring-4 ring-slate-900/10"
                                        : isCompleted
                                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                            : "bg-slate-200 text-slate-500 cursor-not-allowed"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : idx + 1}
                                </button>

                                {/* Label text */}
                                <span className={`text-[11px] font-semibold tracking-tight text-center truncate ${isActive ? "text-slate-900 font-bold" : "text-slate-400"
                                    }`}>
                                    {s.name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile/Tablet Fallback Status Indicator */}
                <div className="md:hidden flex items-center justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Current Phase</span>
                        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <span className="inline-flex items-center justify-center bg-slate-900 text-white text-xs h-5 w-5 rounded-md">
                                {step + 1}
                            </span>
                            {steps[step].name}
                        </h3>
                    </div>
                    <span className="text-xs font-medium bg-slate-200/80 text-slate-600 px-2.5 py-1 rounded-md">
                        Progress: {Math.round(((step + 1) / steps.length) * 100)}%
                    </span>
                </div>
            </div>

            {/* Main Multi-Step Form Context Section */}
            <div className="p-6 sm:p-10 min-h-[380px]">
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <StepComponent
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={handleNext}
                    />
                </div>
            </div>

            {/* Footer Utility Actions */}
            <div className="flex items-center justify-between px-8 py-5 bg-slate-50/50 border-t border-slate-100">
                <button
                    type="button"
                    disabled={isFirstStep}
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl font-semibold text-sm text-slate-600 bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all ${isLastStep
                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10"
                        : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/10"
                        }`}
                >
                    <span>{isLastStep ? "Submit Registration" : "Save & Continue"}</span>
                    {!isLastStep && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    )}
                </button>
            </div>

        </div>
    );
}