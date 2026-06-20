import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";

// GLOBAL RUNTIME SYSTEM IMPORT
import WizardHeader from "../components/PurchaseForm/WizardHeader";

// FORM MULTI-STAGE CONTROLLERS
import StepPurchaseContext from "../components/PurchaseForm/StepPurchaseContext";
import StepSupplierSelect from "../components/PurchaseForm/StepSupplierSelect";
import StepPurchaseIntent from "../components/PurchaseForm/StepPurchaseIntent";
import StepItemsBuilder from "../components/PurchaseForm/StepItemsBuilder";
import StepWarehouseAllocation from "../components/PurchaseForm/StepWarehouseAllocation"; // Imported Allocation Stage
import StepLogistics from "../components/PurchaseForm/StepLogistics";
import StepPaymentTerms from "../components/PurchaseForm/StepPaymentTerms";
import StepReviewSubmit from "../components/PurchaseForm/StepReviewSubmit";

export default function PurchaseCreatePage() {
    const [step, setStep] = useState(1);
    const totalSteps = 8; // Incremented total count from 7 to 8

    const [form, setForm] = useState({
        context: {},
        supplier: null,
        intent: {},
        items: [],
        allocations: {}, // Structured matrix store for downstream warehouse distribution splits
        logistics: {},
        payment: {},
        currency: "GHS" // Configured to Ghana Cedis
    });

    const next = () => setStep((s) => Math.min(s + 1, totalSteps));
    const back = () => setStep((s) => Math.max(s - 1, 1));

    const stepProps = { form, setForm, next, back };

    // Meta pipelines mapped explicitly to reflect step insertions
    const stepsMeta = [
        { id: 1, label: "Purchase Context", desc: "Scope & department" },
        { id: 2, label: "Supplier Selection", desc: "Partner vendor matching" },
        { id: 3, label: "Purchase Intent", desc: "Justification & urgency" },
        { id: 4, label: "Line Items Builder", desc: "SKU quantity definitions" },
        { id: 5, label: "Warehouse Allocation", desc: "Downstream stock splits" },
        { id: 6, label: "Logistics & Freight", desc: "Routing & fulfillment" },
        { id: 7, label: "Payment Terms", desc: "Milestones & accounting" },
        { id: 8, label: "Review & Submit", desc: "Audit trail validation" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-100 flex flex-col font-normal text-base">

            {/* INTEGRATED STANDALONE MODULAR HEADER */}
            <WizardHeader
                currentStep={step}
                totalSteps={totalSteps}
                onBack={back}
            />

            {/* UNCLAMPED TWO-COLUMN WORKSPACE WRAPPER */}
            <div className="max-w-[1660px] w-full mx-auto p-6 flex flex-col lg:flex-row gap-6 items-start flex-1">

                {/* LEFT COLUMN: VISUALLY BALANCED STEP TIMELINE */}
                <nav
                    aria-label="Progress tracking pipeline"
                    className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl p-4 lg:sticky lg:top-24 shadow-3xs shrink-0 block"
                >
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1 hidden lg:block">
                        Execution Milestones
                    </p>

                    <ol role="list" className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-3 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none snap-x">
                        {stepsMeta.map((s) => {
                            const isCompleted = step > s.id;
                            const isActive = step === s.id;

                            return (
                                <li key={s.id} className="snap-center shrink-0 min-w-[220px] lg:min-w-0 w-auto lg:w-full">
                                    <button
                                        disabled={s.id > step}
                                        onClick={() => setStep(s.id)}
                                        className={`w-full flex items-center gap-3.5 p-3 rounded-xl border text-left transition-all duration-150 outline-none ${isActive
                                            ? "bg-slate-900 border-slate-900 text-white font-semibold shadow-xs"
                                            : isCompleted
                                                ? "bg-emerald-50/40 border-emerald-100/60 hover:bg-emerald-50 text-slate-700"
                                                : "bg-white border-transparent text-slate-400 cursor-not-allowed"
                                            }`}
                                    >
                                        <span className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center text-xs font-mono font-bold border shrink-0 transition-colors ${isActive
                                            ? "bg-white/20 border-white/10 text-white"
                                            : isCompleted
                                                ? "bg-emerald-100 border-emerald-200 text-emerald-800"
                                                : "bg-slate-50 border-slate-200 text-slate-400"
                                            }`}>
                                            {isCompleted ? <CheckCircle2 size={13} className="stroke-[3]" /> : s.id}
                                        </span>

                                        <div className="min-w-0 hidden sm:block lg:block">
                                            <p className="text-sm font-bold tracking-tight truncate leading-snug">
                                                {s.label}
                                            </p>
                                            <p className={`text-xs truncate font-medium mt-0.5 ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                                                {s.desc}
                                            </p>
                                        </div>

                                        {isActive && <ChevronRight size={14} className="ml-auto opacity-60 hidden lg:block shrink-0" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </nav>

                {/* RIGHT COLUMN: MAIN FORM WINDOW CONTAINER */}
                <main className="relative flex-1 w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-6 sm:p-8 lg:p-10 flex flex-col justify-between transition-all duration-150 min-h-[620px]">

                    <div className="focus:outline-none" id="form-stage-focus">

                        {/* CLEAN INTERNAL PANEL HEADER */}
                        <header className="mb-6 pb-4 border-b border-slate-100 flex items-end justify-between gap-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                                    Section Stage 0{step}
                                </span>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                    {stepsMeta[step - 1].label}
                                </h2>
                            </div>
                            <span className="text-sm text-slate-400 hidden md:inline font-normal">
                                {stepsMeta[step - 1].desc}
                            </span>
                        </header>

                        {/* HOUSES INNER DYNAMIC COMPONENT MODULES */}
                        <div className="text-slate-700 font-normal text-base">
                            {step === 1 && <StepPurchaseContext {...stepProps} />}
                            {step === 2 && <StepSupplierSelect {...stepProps} />}
                            {step === 3 && <StepPurchaseIntent {...stepProps} />}
                            {step === 4 && <StepItemsBuilder {...stepProps} />}
                            {step === 5 && <StepWarehouseAllocation {...stepProps} />}
                            {step === 6 && <StepLogistics {...stepProps} />}
                            {step === 7 && <StepPaymentTerms {...stepProps} />}
                            {step === 8 && <StepReviewSubmit {...stepProps} />}
                        </div>
                    </div>

                    {/* CONTROL FOOTER BAR */}
                    <footer className="flex items-center justify-between border-t border-slate-100 pt-6 mt-10 z-10 bg-white">
                        <button
                            onClick={back}
                            disabled={step === 1}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${step === 1
                                ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-3xs"
                                }`}
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        <button
                            onClick={next}
                            disabled={step === totalSteps}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shadow-3xs ${step === totalSteps
                                ? "bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed"
                                : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/10"
                                }`}
                        >
                            {step === totalSteps ? "Review Completed" : "Save & Continue"}
                            {step !== totalSteps && <ArrowRight size={16} />}
                        </button>
                    </footer>
                </main>

            </div>
        </div>
    );
}