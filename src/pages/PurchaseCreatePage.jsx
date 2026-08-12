import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ROUTER HOOK
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

// ✅ WAREHOUSE NAME LOOKUP DICTIONARY
const WAREHOUSE_NAME_MAP = {
    "wh-accra": "Accra Central Warehouse",
    "wh-kumasi": "Kumasi Regional Depot",
    "wh-takoradi": "Takoradi Port Facility",
    "wh-tamale": "Tamale Northern Hub"
};

// ✅ HELPER: SAFE ISO DATE FORMATTER TO PREVENT RUNTIME DATE PARSE ERRORS
const formatSafeIsoDate = (dateVal) => {
    if (!dateVal) return null;
    const parsed = new Date(dateVal);
    return isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

export default function PurchaseCreatePage() {
    const navigate = useNavigate();
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
        manufacturer: null,
        intent: {},
        items: [],
        allocations: {},
        logistics: {},
        payment: {},
        pricing: {},
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
            const targetQty = parseFloat(item.qty || item.qtyOrdered || item.quantity) || 0;

            // ✅ GAP FIX: Flexible item ID lookup for allocation matching
            const itemKey = item.id || item.itemId || item.productId || item.product_id;
            const itemAllocations = form.allocations[itemKey] || form.allocations[item.id] || {};

            const keysToEvaluate = Object.keys(itemAllocations).length > 0
                ? Object.keys(itemAllocations)
                : warehouseKeys;

            const totalAllocated = keysToEvaluate.reduce((sum, key) => {
                const val = itemAllocations[key];
                const qty = typeof val === 'object' && val !== null ? (val.quantity || val.qty) : val;
                return sum + (parseFloat(qty) || 0);
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

            // ✅ GAP FIX: Robust item synchronization with fallback checks for productId, categoryId, etc.
            const synchronizedItems = form.items.map((item) => {
                const qtyOrdered = parseFloat(item.qty || item.qtyOrdered || item.quantity) || 0;
                const unitPrice = parseFloat(item.price || item.unitPrice || item.rate) || 0;
                const totalCalculatedLine = qtyOrdered * unitPrice;

                // Resolved Item Name
                const resolvedItemName = item.itemName || item.productName || item.name || item.title || item.sku || 'Unnamed Item';

                // Resolved Product ID (prevents empty string when ID key varies across components)
                const resolvedProductId = String(
                    item.productId || item.product_id || item.id || item.itemId || ''
                );

                // Resolved Category Details (supports nested category objects or flattened ID/Name properties)
                const resolvedCategoryId = String(
                    item.categoryId ||
                    item.category_id ||
                    (typeof item.category === 'object' ? item.category?.id : '') ||
                    form.context?.categoryId ||
                    form.context?.category_id ||
                    ''
                );

                const resolvedCategoryName = typeof item.category === 'object'
                    ? item.category?.name || ''
                    : item.category || item.categoryName || form.context?.category || '';

                runningOrderTotal += totalCalculatedLine;

                return {
                    itemId: String(item.id || item.itemId || resolvedProductId || ''),
                    productId: resolvedProductId, // ✅ GAP FIXED
                    variantId: String(item.variantId || item.variant_id || ''),
                    sku: item.sku || 'N/A',
                    itemName: resolvedItemName,
                    productName: resolvedItemName,
                    desc: item.desc || item.description || '',
                    brand: item.brand || '',
                    categoryId: resolvedCategoryId, // ✅ GAP FIXED
                    category: resolvedCategoryName, // ✅ GAP FIXED
                    unitOfMeasure: item.unitOfMeasure || item.uom || item.unit || 'PCS',
                    qtyOrdered: qtyOrdered,
                    unitPrice: unitPrice,
                    lineTotal: totalCalculatedLine,
                    specifications: item.specifications || item.specs || '',
                    notes: item.notes || '',
                    manufacturer: item.manufacturer || form.manufacturer || null
                };
            });

            // ✅ GAP FIX: Synchronize Allocations with flexible item lookup
            const synchronizedAllocations = [];
            if (form.allocations) {
                Object.entries(form.allocations).forEach(([itemId, targetWarehouses]) => {
                    const matchedItem = form.items.find((i) =>
                        String(i.id || i.itemId || i.productId || i.product_id) === String(itemId)
                    );
                    const itemName = matchedItem
                        ? (matchedItem.itemName || matchedItem.productName || matchedItem.name || matchedItem.title || matchedItem.sku || 'Unnamed Item')
                        : 'Unnamed Item';

                    if (typeof targetWarehouses === 'object' && targetWarehouses !== null) {
                        Object.entries(targetWarehouses).forEach(([warehouseId, value]) => {
                            let parsedQty = 0;
                            let warehouseName = WAREHOUSE_NAME_MAP[warehouseId] || warehouseId;

                            if (typeof value === 'object' && value !== null) {
                                parsedQty = parseFloat(value.quantity || value.qty) || 0;
                                if (value.warehouseName || value.name || value.label) {
                                    warehouseName = value.warehouseName || value.name || value.label;
                                }
                            } else {
                                parsedQty = parseFloat(value) || 0;
                            }

                            if (parsedQty > 0) {
                                synchronizedAllocations.push({
                                    itemId: String(itemId),
                                    itemName: itemName,
                                    warehouseId: String(warehouseId),
                                    warehouseName: warehouseName,
                                    quantity: parsedQty
                                });
                            }
                        });
                    }
                });
            }

            // Calculations for Freight, Tax, Subtotal & Budget
            const shippingCost = Number(form.logistics?.shippingCost) || 0;
            const estimatedTax = Number(form.pricing?.tax) || 0;
            const totalCost = runningOrderTotal + shippingCost + estimatedTax;
            const budgetCeiling = Number(form.intent?.budget || form.payment?.budget || form.pricing?.budget) || 0;

            // ✅ Comprehensive Unified Post Payload
            const payload = {
                createdBy: {
                    userId: currentUser.userId,
                    username: currentUser.username,
                    role: currentUser.role
                },
                context: {
                    title: form.context?.title || "Bulk Order",
                    type: form.context?.type || "Bulk Restock",
                    department: form.context?.department || "",
                    departmentId: form.context?.departmentId || form.context?.department_id || "",
                    category: form.context?.category || form.context?.categoryName || "",
                    categoryId: form.context?.categoryId || form.context?.category_id || "", // ✅ GAP FIXED
                    requisitionNumber: form.context?.requisitionNumber || "",
                    tags: form.context?.tags || []
                },
                intent: {
                    description: form.intent?.description || "",
                    priority: form.intent?.priority || "routine",
                    justification: form.intent?.justification || form.intent?.description || "",
                    urgencyReason: form.intent?.urgencyReason || "",
                    budget: budgetCeiling,
                    attachments: form.intent?.attachments || []
                },
                supplier: {
                    supplierId: form.supplier?.id || form.supplier?.supplierId || form.supplier?.supplier_id || null, // ✅ GAP FIXED
                    name: form.supplier?.name || "",
                    location: form.supplier?.location || "",
                    businessType: form.supplier?.businessType || "",
                    riskLevel: form.supplier?.riskLevel || "",
                    email: form.supplier?.email || "",
                    phone: form.supplier?.phone || "",
                    contactPerson: form.supplier?.contactPerson || form.supplier?.contact || "",
                    taxId: form.supplier?.taxId || "",
                    reliability: form.supplier?.reliability || ""
                },
                manufacturer: form.manufacturer ? {
                    id: form.manufacturer.id || form.manufacturer.manufacturerId || form.manufacturer.manufacturer_id || null,
                    name: form.manufacturer.name || "",
                    code: form.manufacturer.code || ""
                } : null,
                items: synchronizedItems,
                allocations: synchronizedAllocations,
                logistics: {
                    deliveryType: form.logistics?.deliveryType || "supplier",
                    expectedDispatchDate: formatSafeIsoDate(form.logistics?.expectedDispatchDate), // ✅ GAP FIXED: SAFE DATE PARSING
                    expectedDeliveryDate: formatSafeIsoDate(form.logistics?.expectedDeliveryDate), // ✅ GAP FIXED: SAFE DATE PARSING
                    destination: form.logistics?.destination || form.logistics?.location || "",
                    carrier: form.logistics?.carrier || "",
                    shippingCost: shippingCost,
                    incoterms: form.logistics?.incoterms || "",
                    specialInstructions: form.logistics?.specialInstructions || form.logistics?.notes || "",
                    warehouseCode: form.logistics?.warehouseCode || form.logistics?.warehouse_code || "",
                    allocatedWarehouse: form.logistics?.allocatedWarehouse || form.logistics?.warehouse || ""
                },
                payment: {
                    method: form.payment?.method || "",
                    terms: form.payment?.terms || "upfront",
                    advance: Number(form.payment?.advance) || 0,
                    creditPeriodDays: Number(form.payment?.creditPeriodDays || form.payment?.creditDays) || 0,
                    bankDetails: form.payment?.bankDetails || {},
                    milestones: form.payment?.milestones || form.payment?.milestoneBreakdown || []
                },
                pricing: {
                    currency: form.currency || form.pricing?.currency || "GHS",
                    subtotal: runningOrderTotal,
                    shippingCost: shippingCost,
                    tax: estimatedTax,
                    totalCost: totalCost,
                    budgetCeiling: budgetCeiling
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

            // ✅ REDIRECT USER UPON SUCCESS
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