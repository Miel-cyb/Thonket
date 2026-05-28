import React, { useState } from "react";
import BulkSupplierRow from "./BulkSupplierRow";
import BulkSupplierActions from "./BulkSupplierActions";
import BulkSupplierSubmitBar from "./BulkSupplierSubmitBar";
import { API_ENDPOINTS } from "../../../utils/urls";

export default function BulkSupplierTable() {
    // Cleaned schema layout blueprint mirroring operational field settings
    const createEmptySupplierTemplate = () => ({
        id: Date.now() + Math.random(),
        businessIdentity: {
            businessName: "",
            tradingName: "",
            businessType: "Manufacturer",
            yearEstablished: new Date().getFullYear(),
        },
        legalVerification: {
            registrationNumber: "",
            taxId: "",
            licenseType: "",
        },
        contactInformation: {
            primaryContactName: "",
            contactRole: "",
            emailAddress: "",
            phoneNumber: "",
            whatsappNumber: "",
        },
        locationDetails: {
            headOfficeAddress: "",
            cityRegion: "",
            country: "",
        },
        coverageLogistics: {
            deliveryType: "",
            deliveryCapability: "",
            operatingHours: "",
            coverageAreas: "",
        },
        supplyCapability: {
            productCategories: [],
            brandsHandled: "",
            capacity: { value: 0, unit: "units" },
            availabilityType: "always",
        },
        complianceRisk: {
            verificationStatus: "pending",
            riskLevel: "medium",
            complianceNotes: "",
        }
    });

    const [suppliers, setSuppliers] = useState([
        { ...createEmptySupplierTemplate(), id: 1 }
    ]);

    const [activeRowIndex, setActiveRowIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addRow = () => {
        const newRow = createEmptySupplierTemplate();
        setSuppliers([...suppliers, newRow]);
        setActiveRowIndex(suppliers.length);
    };

    const updateRow = (index, updatedFields) => {
        setSuppliers((prevSuppliers) =>
            prevSuppliers.map((row, i) => {
                if (i !== index) return row;

                const updatedRow = { ...row };

                Object.keys(updatedFields).forEach((key) => {
                    if (typeof updatedFields[key] === "object" && updatedFields[key] !== null) {
                        updatedRow[key] = {
                            ...(updatedRow[key] || {}),
                            ...updatedFields[key]
                        };
                    } else {
                        updatedRow[key] = updatedFields[key];
                    }
                });

                return updatedRow;
            })
        );
    };

    const deleteRow = (index) => {
        setSuppliers((prevSuppliers) => {
            const updated = prevSuppliers.filter((_, i) => i !== index);
            return updated.length === 0 ? [createEmptySupplierTemplate()] : updated;
        });

        if (activeRowIndex >= index && activeRowIndex > 0) {
            setActiveRowIndex((prev) => prev - 1);
        }
    };

    const handleSubmitBatch = async () => {
        setIsSubmitting(true);
        try {
            const finalBulkPayload = suppliers.map((supplier) => ({
                ...supplier,
                createdBy: {
                    userId: "usr_2026_94821",
                    username: "current.user",
                    role: "staff"
                }
            }));

            // Direct execution targeting your /create-many backend layer endpoint
            const response = await fetch(`${API_ENDPOINTS.SUPPLIERS}/create-many`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ suppliers: finalBulkPayload }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with layout state code: ${response.status}`);
            }

            // Client routing redirection fallback engine to step over framework variants (Next.js vs React Router)
            if (typeof window !== "undefined") {
                window.location.href = "/suppliers";
            }
        } catch (err) {
            console.error("Batch submission pipeline execution failed:", err);
            alert(`Upload Failed: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col transition-all duration-200">

            {/* Main Component Header Section */}
            <div className="border-b border-slate-200/60 bg-white px-6 py-5 sm:flex sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                        Bulk Supplier Entry Deck
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Stage, review, and provision batch corporate supplier directory indexes natively.
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <BulkSupplierActions addRow={addRow} />
                </div>
            </div>

            {/* Form Row Layout Scroll Area with Custom Chrome Track Injections */}
            <div className="divide-y divide-slate-100 bg-white max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
                {suppliers.map((supplier, index) => (
                    <BulkSupplierRow
                        key={supplier.id}
                        data={supplier}
                        index={index}
                        isExpanded={activeRowIndex === index}
                        onToggleExpand={() => setActiveRowIndex(activeRowIndex === index ? null : index)}
                        onUpdateRow={updateRow}
                        onDeleteRow={deleteRow}
                    />
                ))}
            </div>

            {/* Base Submission Processing Controller */}
            <div className="border-t border-slate-200/60 bg-slate-50/50 px-6 py-4">
                <BulkSupplierSubmitBar
                    suppliers={suppliers}
                    onSubmitBatch={handleSubmitBatch}
                    isSubmitting={isSubmitting}
                    isValidating={false}
                />
            </div>

        </div>
    );
}