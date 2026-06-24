import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 1. IMPORT NAVIGATE HOOK
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";

// GLOBAL RUNTIME SYSTEM IMPORT
import WizardHeader from "../components/PurchaseForm/WizardHeader";

// FORM MULTI-STAGE CONTROLLERS
import StepPurchaseContext from "../components/PurchaseForm/StepPurchaseContext";
import StepSupplierSelect from "../components/PurchaseForm/StepSupplierSelect";
import StepPurchaseIntent from "../components/PurchaseForm/StepPurchaseIntent";
import StepItemsBuilder from "../components/PurchaseForm/StepItemsBuilder";
import StepWarehouseAllocation from "../components/PurchaseForm/StepWarehouseAllocation";
import StepLogistics from "../components/PurchaseForm/StepLogistics";
import StepPaymentTerms from "../components/PurchaseForm/StepPaymentTerms";
import StepReviewSubmit from "../components/PurchaseForm/StepReviewSubmit";
import { API_ENDPOINTS } from "../utils/urls";

export default function PurchaseCreatePage() {
    const navigate = useNavigate(); // ✅ 2. INITIALIZE NAVIGATION ROUTER
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const totalSteps = 8;

    // --- USER SESSION PROFILE ---
    const currentUser = {
        userId: "usr-active-99231",
        username: "operations_admin",
        role: "admin"
    };

    const [form, setForm] = useState({
        context: {},
        supplier: null,
        intent: {},
        items: [],
        allocations: {},
        logistics: {},
        payment: {},
        currency: "GHS"
    });

    const next = () => setStep((s) => Math.min(s + 1, totalSteps));
    const back = () => setStep((s) => Math.max(s - 1, 1));

    const warehouseKeys = ["wh-accra", "wh-kumasi", "wh-takoradi", "wh-tamale"];

    const validateFormData = () => {
        if (!form.context || Object.keys(form.context).length === 0) return "Missing purchase context details.";
        if (!form.supplier) return "Please select a partner vendor supplier.";
        if (!form.intent || Object.keys(form.intent).length === 0) return "Purchase justification intent is required.";
        if (!form.items || form.items.length === 0) return "Line Items Builder must have at least 1 SKU item.";

        if (!form.allocations || Object.keys(form.allocations).length === 0) {
            return "Warehouse allocation distributions are unassigned.";
        }

        for (const item of form.items) {
            const targetQty = parseInt(item.qty) || 0;
            const itemAllocations = form.allocations[item.id] || {};

            const totalAllocated = warehouseKeys.reduce((sum, key) => {
                return sum + (parseInt(itemAllocations[key]) || 0);
            }, 0);

            if (totalAllocated !== targetQty) {
                return `Allocation imbalance found: SKU "${item.sku || "Unknown"}" requires exactly ${targetQty} units allocated, but has ${totalAllocated} assigned.`;
            }
        }

        if (!form.logistics || Object.keys(form.logistics).length === 0) return "Fulfillment logistics configurations are missing.";
        if (!form.payment || Object.keys(form.payment).length === 0) return "Accounting payment milestones are unassigned.";
        return null;
    };

    const handleSubmit = async () => {
        setSubmitError(null);

        const validationError = validateFormData();
        if (validationError) {
            setSubmitError(validationError);
            return;
        }

        setLoading(true);
        try {
            let runningOrderTotal = 0;
            const synchronizedItems = form.items.map((item) => {
                const qtyOrdered = parseInt(item.qty) || 0;
                const unitPrice = parseFloat(item.price || item.unitPrice) || 0;
                const totalCalculatedLine = qtyOrdered * unitPrice;

                runningOrderTotal += totalCalculatedLine;

                return {
                    itemId: String(item.id || item.itemId || ''),
                    productId: String(item.productId || ''),
                    variantId: String(item.variantId || ''),
                    sku: item.sku || 'N/A',
                    desc: item.desc || '',
                    productName: item.productName || item.name || '',
                    brand: item.brand || '',
                    unitOfMeasure: item.unitOfMeasure || 'PCS',
                    qtyOrdered: qtyOrdered,
                    unitPrice: unitPrice,
                    lineTotal: totalCalculatedLine
                };
            });

            const synchronizedAllocations = [];
            if (form.allocations) {
                Object.entries(form.allocations).forEach(([itemId, targetWarehouses]) => {
                    Object.entries(targetWarehouses).forEach(([warehouseId, quantity]) => {
                        const parsedQty = parseInt(quantity) || 0;
                        if (parsedQty > 0) {
                            synchronizedAllocations.push({
                                itemId: itemId,
                                warehouseId: warehouseId,
                                quantity: parsedQty
                            });
                        }
                    });
                });
            }

            const payload = {
                createdBy: {
                    userId: currentUser.userId,
                    username: currentUser.username,
                    role: currentUser.role
                },
                context: {
                    title: form.context.title || "Bulk Oil Order",
                    type: form.context.type || "Bulk Restock"
                },
                intent: {
                    description: form.intent.description || "",
                    priority: form.intent.priority || "routine"
                },
                supplier: {
                    supplierId: form.supplier?.id || form.supplier?.supplierId || null,
                    name: form.supplier?.name || "",
                    location: form.supplier?.location || "",
                    businessType: form.supplier?.businessType || "",
                    riskLevel: form.supplier?.riskLevel || ""
                },
                items: synchronizedItems,
                allocations: synchronizedAllocations,
                logistics: {
                    deliveryType: form.logistics.deliveryType || "supplier",
                    expectedDispatchDate: form.logistics.expectedDispatchDate ? new Date(form.logistics.expectedDispatchDate) : null,
                    expectedDeliveryDate: form.logistics.expectedDeliveryDate ? new Date(form.logistics.expectedDeliveryDate) : null,
                    destination: form.logistics.destination || ""
                },
                payment: {
                    method: form.payment.method || "",
                    terms: form.payment.terms || "upfront",
                    advance: Number(form.payment.advance) || 0
                },
                pricing: {
                    currency: form.currency || "GHS",
                    totalCost: runningOrderTotal
                },
                documentStatus: "submitted"
            };

            const purchaseApi = API_ENDPOINTS.PURCHASE_ORDERS;
            const response = await fetch(purchaseApi, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorPayload = await response.json().catch(() => ({}));
                throw new Error(errorPayload.message || `Server execution error status: ${response.status}`);
            }

            await response.json();

            // ✅ 3. REDIRECT USER UPON SUCCESS
            navigate("/procurement");

        } catch (err) {
            setSubmitError(err.message || "An unexpected error occurred during submission.");
        } finally {
            setLoading(false);
        }
    };

    const stepProps = { form, setForm, next, back };

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

            <WizardHeader
                currentStep={step}
                totalSteps={totalSteps}
                onBack={back}
            />

            <div className="max-w-[1660px] w-full mx-auto p-6 flex flex-col lg:flex-row gap-6 items-start flex-1">

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
                                        disabled={s.id > step || loading}
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

                <main className="relative flex-1 w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-6 sm:p-8 lg:p-10 flex flex-col justify-between transition-all duration-150 min-h-[620px]">

                    <div className="focus:outline-none" id="form-stage-focus">

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

                        {submitError && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm font-medium">
                                {submitError}
                            </div>
                        )}

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

                    <footer className="flex items-center justify-between border-t border-slate-100 pt-6 mt-10 z-10 bg-white">
                        <button
                            type="button"
                            onClick={back}
                            disabled={step === 1 || loading}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${step === 1 || loading
                                ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-3xs"
                                }`}
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={step === totalSteps ? handleSubmit : next}
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shadow-3xs ${step === totalSteps
                                ? "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-600/10"
                                : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/10"
                                } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Processing...
                                </>
                            ) : step === totalSteps ? (
                                "Submit Purchase Order"
                            ) : (
                                <>
                                    Save & Continue
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </footer>
                </main>

            </div>
        </div>
    );
}