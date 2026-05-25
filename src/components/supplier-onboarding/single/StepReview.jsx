import React from "react";

export default function StepReview({ formData }) {
    // Gracefully destructure all nested step states from the core wizard tree
    const {
        businessIdentity = {},
        legalVerification = {},
        contactInformation = {},
        locationDetails = {},
        supplyCapability = {}, // Destructured to capture volume metrics
        coverageLogistics = {},
        complianceRisk = {},
    } = formData;

    // Helper template to safely render unpopulated fields
    const renderValue = (val, fallback = "Not provided") => {
        return val ? (
            <span className="text-slate-900 font-medium">{val}</span>
        ) : (
            <span className="text-amber-600 italic text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                {fallback}
            </span>
        );
    };

    return (
        <div className="space-y-6">

            {/* Step Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Review & Finalize Submission
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Perform a final verification check on all mapped datasets before provisioning this supplier profile.
                </p>
            </div>

            {/* Main Grid Registry Wrapper */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Card: Business Profile summary */}
                <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm uppercase tracking-wide">
                        🏢 Business Profile
                    </div>
                    <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">Legal Name</dt><dd className="mt-0.5">{renderValue(businessIdentity.businessName)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">Trading Name</dt><dd className="mt-0.5">{renderValue(businessIdentity.tradingName)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">Structure Type</dt><dd className="mt-0.5 uppercase">{renderValue(businessIdentity.businessType)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">Established</dt><dd className="mt-0.5">{renderValue(businessIdentity.yearEstablished)}</dd></div>
                    </dl>
                </div>

                {/* Card: Governance & Legal parameters */}
                <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm uppercase tracking-wide">
                        ⚖️ Legal & Tax Indicators
                    </div>
                    <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">Registration No.</dt><dd className="mt-0.5 font-mono">{renderValue(legalVerification.registrationNumber)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">Tax ID / VAT</dt><dd className="mt-0.5 font-mono">{renderValue(legalVerification.taxId)}</dd></div>
                        <div className="flex flex-col col-span-2"><dt className="text-slate-400 font-medium">License Type</dt><dd className="mt-0.5">{renderValue(legalVerification.licenseType)}</dd></div>
                    </dl>
                </div>

                {/* Card: Primary Communications details */}
                <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm uppercase tracking-wide">
                        📞 Communication Channels
                    </div>
                    <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">Point of Contact</dt><dd className="mt-0.5">{renderValue(contactInformation.primaryContactName)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">Designated Role</dt><dd className="mt-0.5">{renderValue(contactInformation.contactRole)}</dd></div>
                        <div className="flex flex-col col-span-2"><dt className="text-slate-400 font-medium">Email Endpoint</dt><dd className="mt-0.5 text-slate-900 font-medium break-all">{renderValue(contactInformation.emailAddress)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">Direct Line</dt><dd className="mt-0.5">{renderValue(contactInformation.phoneNumber)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">WhatsApp Link</dt><dd className="mt-0.5">{renderValue(contactInformation.whatsappNumber)}</dd></div>
                    </dl>
                </div>

                {/* Card: Logistics arrangements */}
                <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm uppercase tracking-wide">
                        🚚 Logistics Capabilities
                    </div>
                    <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">Fulfillment Model</dt><dd className="mt-0.5 capitalize">{renderValue(coverageLogistics.deliveryType)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">Scope Target</dt><dd className="mt-0.5 capitalize">{renderValue(coverageLogistics.deliveryCapability)}</dd></div>
                        <div className="flex flex-col col-span-2"><dt className="text-slate-400 font-medium">Operating Schedule</dt><dd className="mt-0.5">{renderValue(coverageLogistics.operatingHours)}</dd></div>
                        <div className="flex flex-col col-span-2"><dt className="text-slate-400 font-medium">Coverage Zones</dt><dd className="mt-0.5 line-clamp-1">{renderValue(coverageLogistics.coverageAreas)}</dd></div>
                    </dl>
                </div>

                {/* Upgraded Block: Card for Supply & Stock Capacity Summary */}
                <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm uppercase tracking-wide">
                        📦 Inventory & Supply Volume
                    </div>
                    <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                        <div className="flex flex-col col-span-2">
                            <dt className="text-slate-400 font-medium">Product Portfolios</dt>
                            <dd className="mt-0.5 line-clamp-1">{renderValue(supplyCapability.productCategories)}</dd>
                        </div>
                        <div className="flex flex-col col-span-2">
                            <dt className="text-slate-400 font-medium">Brands Handled</dt>
                            <dd className="mt-0.5 line-clamp-1">{renderValue(supplyCapability.brandsHandled)}</dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="text-slate-400 font-medium">Monthly Capacity</dt>
                            <dd className="mt-0.5">
                                {supplyCapability.capacityValue ? (
                                    <span className="text-slate-900 font-medium">
                                        {Number(supplyCapability.capacityValue).toLocaleString()} {supplyCapability.capacityUnit || "units"}
                                    </span>
                                ) : (
                                    renderValue(null)
                                )}
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="text-slate-400 font-medium">Supply Restock Cycle</dt>
                            <dd className="mt-0.5 capitalize">{renderValue(supplyCapability.availabilityType)}</dd>
                        </div>
                    </dl>
                </div>

                {/* Card: Location details summary mapping */}
                <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm uppercase tracking-wide">
                        📍 Base Locations
                    </div>
                    <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                        <div className="flex flex-col col-span-2"><dt className="text-slate-400 font-medium">Headquarters Address</dt><dd className="mt-0.5">{renderValue(locationDetails.headOfficeAddress)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">City / State</dt><dd className="mt-0.5">{renderValue(locationDetails.cityRegion)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-medium">Country</dt><dd className="mt-0.5">{renderValue(locationDetails.country)}</dd></div>
                    </dl>
                </div>

                {/* Card: Compliance Status metrics (Full-width span) */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 md:col-span-2 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <span className="text-slate-800 font-bold text-sm uppercase tracking-wide">🛡️ Compliance Audit Verdict</span>

                        {/* Conditional dynamic safety pill badge injection */}
                        {complianceRisk.riskLevel && (
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${complianceRisk.riskLevel === "low" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                                    complianceRisk.riskLevel === "medium" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                                        "bg-rose-100 text-rose-800 border border-rose-200"
                                }`}>
                                {complianceRisk.riskLevel} risk tier
                            </span>
                        )}
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="flex flex-col">
                            <dt className="text-slate-400 font-medium">Initial System Action</dt>
                            <dd className="mt-1 capitalize text-slate-900 font-semibold flex items-center gap-1.5">
                                {complianceRisk.verificationStatus === "verified" ? "✅ Approved Entry" :
                                    complianceRisk.verificationStatus === "rejected" ? "❌ Blocked Entry" : "⏳ Queue Pending"}
                            </dd>
                        </div>
                        <div className="flex flex-col sm:col-span-2">
                            <dt className="text-slate-400 font-medium">Due Diligence Audit Log Notes</dt>
                            <dd className="mt-1 text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200 leading-relaxed max-h-16 overflow-y-auto">
                                {complianceRisk.complianceNotes || "No override auditor evaluation summaries attached to file registry."}
                            </dd>
                        </div>
                    </dl>
                </div>

            </div>
        </div>
    );
}