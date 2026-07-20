import React from "react";

export default function StepReview({ formData }) {
    // Gracefully destructure all nested step states from the core wizard tree
    const {
        businessIdentity = {},
        legalVerification = {},
        contactInformation = {},
        locationDetails = {},
        supplyCapability = {},
        coverageLogistics = {},
        supplierType = {}, // Commercial & payment metrics
    } = formData || {};

    const { secondaryContacts = [] } = contactInformation;

    // Helper template to safely render unpopulated fields
    const renderValue = (val, fallback = "Not provided") => {
        return val ? (
            <span className="text-slate-900 font-medium text-sm">{val}</span>
        ) : (
            <span className="text-amber-700 italic text-xs font-normal bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                {fallback}
            </span>
        );
    };

    // Helper template to safely format currency strings (GH₵)
    const renderCurrency = (val) => {
        if (!val && val !== 0) return renderValue(null);
        return (
            <span className="text-slate-900 font-bold text-sm tracking-wide">
                GH₵ {Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        );
    };

    // Format operating schedule dynamically from the payload keys
    const formatOperatingSchedule = () => {
        const { operatingDays, operatingHoursStart, operatingHoursEnd, operatingHours } = coverageLogistics;

        if (operatingDays && Array.isArray(operatingDays) && operatingDays.length > 0) {
            const daysStr = operatingDays.join(", ");
            const hoursStr = operatingHoursStart && operatingHoursEnd
                ? ` (${operatingHoursStart} - ${operatingHoursEnd})`
                : "";
            return `${daysStr}${hoursStr}`;
        }

        return operatingHours || null;
    };

    return (
        <div className="space-y-8 p-1 antialiased">
            {/* Step Header */}
            <div className="border-b border-slate-100 pb-5">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight sm:text-2xl">
                    Review & Finalize Submission
                </h2>
                <p className="text-sm font-normal text-slate-500 mt-1.5 leading-relaxed">
                    Perform a final verification check on all mapped datasets before provisioning this supplier profile.
                </p>
            </div>

            {/* Main Grid Registry Wrapper */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Card: Business Profile summary */}
                <div className="border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm transition-all hover:shadow-md/5 space-y-4">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-slate-800 font-extrabold text-[11px] uppercase tracking-widest">
                        🏢 Business Profile
                    </div>
                    <dl className="grid grid-cols-2 gap-y-4 gap-x-4">
                        <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Legal Name</dt><dd>{renderValue(businessIdentity.businessName)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Trading Name</dt><dd>{renderValue(businessIdentity.tradingName)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Structure Type</dt><dd className="uppercase">{renderValue(businessIdentity.businessType)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Established</dt><dd>{renderValue(businessIdentity.yearEstablished)}</dd></div>
                    </dl>
                </div>

                {/* Card: Governance & Legal parameters */}
                <div className="border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm transition-all hover:shadow-md/5 space-y-4">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-slate-800 font-extrabold text-[11px] uppercase tracking-widest">
                        ⚖️ Legal & Tax Indicators
                    </div>
                    <dl className="grid grid-cols-2 gap-y-4 gap-x-4">
                        <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Registration No.</dt><dd className="font-mono text-xs tracking-normal">{renderValue(legalVerification.registrationNumber)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Tax ID / VAT</dt><dd className="font-mono text-xs tracking-normal">{renderValue(legalVerification.taxId)}</dd></div>
                        <div className="flex flex-col col-span-2"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">License Type</dt><dd>{renderValue(legalVerification.licenseType)}</dd></div>
                    </dl>
                </div>

                {/* Card: Primary Communications details */}
                <div className="border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm transition-all hover:shadow-md/5 space-y-5 md:col-span-2">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 text-slate-800 font-extrabold text-[11px] uppercase tracking-widest">
                        📞 Communication Channels
                    </div>

                    {/* Primary Contact Subdivision */}
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded w-fit">Primary Contact</h4>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4">
                            <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Point of Contact</dt><dd>{renderValue(contactInformation.primaryContactName)}</dd></div>
                            <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Designated Role</dt><dd>{renderValue(contactInformation.contactRole)}</dd></div>
                            <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Direct Line</dt><dd>{renderValue(contactInformation.phoneNumber)}</dd></div>
                            <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">WhatsApp Link</dt><dd>{renderValue(contactInformation.whatsappNumber)}</dd></div>
                            <div className="flex flex-col sm:col-span-2 md:col-span-4"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Email Endpoint</dt><dd className="break-all">{renderValue(contactInformation.emailAddress)}</dd></div>
                        </dl>
                    </div>

                    {/* Dynamic Secondary Contacts Subdivision */}
                    {secondaryContacts && secondaryContacts.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                            <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded w-fit">Secondary Contacts</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {secondaryContacts.map((contact, index) => (
                                    <div key={index} className="p-4 bg-slate-50/60 rounded-xl border border-slate-100 space-y-3">
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            Contact #{index + 1}
                                        </div>
                                        <dl className="grid grid-cols-2 gap-y-3 gap-x-3">
                                            <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Name</dt><dd>{renderValue(contact.name)}</dd></div>
                                            <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Role</dt><dd>{renderValue(contact.role)}</dd></div>
                                            <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Phone</dt><dd>{renderValue(contact.phone)}</dd></div>
                                            <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">WhatsApp</dt><dd>{renderValue(contact.whatsapp)}</dd></div>
                                            <div className="flex flex-col col-span-2"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Email</dt><dd className="break-all">{renderValue(contact.email)}</dd></div>
                                        </dl>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Card: Logistics arrangements */}
                <div className="border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm transition-all hover:shadow-md/5 space-y-4">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-slate-800 font-extrabold text-[11px] uppercase tracking-widest">
                        🚚 Logistics Capabilities
                    </div>
                    <dl className="grid grid-cols-2 gap-y-4 gap-x-4">
                        <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Fulfillment Model</dt><dd className="capitalize">{renderValue(coverageLogistics.deliveryType)}</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Scope Target</dt><dd className="capitalize">{renderValue(coverageLogistics.deliveryCapability)}</dd></div>
                        <div className="flex flex-col col-span-2"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Operating Schedule</dt><dd>{renderValue(formatOperatingSchedule())}</dd></div>
                        <div className="flex flex-col col-span-2"><dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Coverage Zones</dt><dd className="line-clamp-2 text-sm leading-relaxed">{renderValue(coverageLogistics.coverageAreas)}</dd></div>
                    </dl>
                </div>

                {/* Card: Supply & Stock Capacity Summary */}
                <div className="border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm transition-all hover:shadow-md/5 space-y-4">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-slate-800 font-extrabold text-[11px] uppercase tracking-widest">
                        📦 Inventory & Supply Volume
                    </div>
                    <dl className="grid grid-cols-2 gap-y-4 gap-x-4">
                        <div className="flex flex-col col-span-2">
                            <dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Product Portfolios</dt>
                            <dd className="line-clamp-2 text-sm leading-relaxed">{renderValue(supplyCapability.productCategories)}</dd>
                        </div>
                        <div className="flex flex-col col-span-2">
                            <dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Brands Handled</dt>
                            <dd className="line-clamp-2 text-sm leading-relaxed">{renderValue(supplyCapability.brandsHandled)}</dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Monthly Capacity</dt>
                            <dd>
                                {supplyCapability.capacity && supplyCapability.capacity.value ? (
                                    <span className="text-slate-900 font-bold text-sm tracking-wide">
                                        {Number(supplyCapability.capacity.value).toLocaleString()} <span className="text-xs font-normal text-slate-500 lowercase">{supplyCapability.capacity.unit || "units"}</span>
                                    </span>
                                ) : (
                                    renderValue(null)
                                )}
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Supply Restock Cycle</dt>
                            <dd className="capitalize">{renderValue(supplyCapability.availabilityType)}</dd>
                        </div>
                    </dl>
                </div>

                {/* Card: Commercial Terms & Billing */}
                <div className="border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm transition-all hover:shadow-md/5 space-y-4 md:col-span-2">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-slate-800 font-extrabold text-[11px] uppercase tracking-widest">
                        💳 Commercial Terms & Billing
                    </div>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                        <div className="flex flex-col sm:col-span-2">
                            <dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Accepted Payment Mechanism</dt>
                            <dd className="capitalize">{renderValue(supplierType.paymentTermsType)}</dd>
                        </div>

                        {/* Render Credit Windows safely inside grid boundaries */}
                        {(supplierType.paymentTermsType === "credit" || supplierType.paymentTermsType === "both") && (
                            <>
                                <div className="flex flex-col">
                                    <div className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Credit Window Rule</div>
                                    <dd className="uppercase">
                                        {supplierType.creditTermsWindow === "custom"
                                            ? renderValue(supplierType.creditTermsWindowCustom, "Custom Window Details Missing")
                                            : renderValue(supplierType.creditTermsWindow)
                                        }
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Assigned Credit Limit</div>
                                    <dd>{renderCurrency(supplierType.creditLimitAmount)}</dd>
                                </div>
                            </>
                        )}

                        <div className="flex flex-col sm:col-span-2">
                            <dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1.5">Billing Registry Instructions</dt>
                            <dd className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-normal leading-relaxed max-h-24 overflow-y-auto italic">
                                {supplierType.billingNotes || "No explicit invoicing metadata or custom payment handling rules configured."}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Card: Location details summary mapping */}
                <div className="border border-slate-200/80 rounded-xl p-6 bg-white shadow-sm transition-all hover:shadow-md/5 space-y-4 md:col-span-2">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-slate-800 font-extrabold text-[11px] uppercase tracking-widest">
                        📍 Base Locations
                    </div>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                        <div className="flex flex-col">
                            <dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Headquarters Address</dt>
                            <dd>{renderValue(locationDetails.headOfficeAddress)}</dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">City / Region</dt>
                            <dd>{renderValue(locationDetails.cityRegion)}</dd>
                        </div>
                        <div className="flex flex-col sm:col-span-2">
                            <dt className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1.5">Warehouse & Fulfillment Depots</dt>
                            <dd className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-medium leading-relaxed max-h-24 overflow-y-auto whitespace-pre-line">
                                {locationDetails.warehouseLocations ? (
                                    <span className="text-slate-800 font-medium">{locationDetails.warehouseLocations}</span>
                                ) : (
                                    <span className="text-slate-400 italic font-normal">No external depots listed (Headquarters distribution default).</span>
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>

            </div>
        </div>
    );
}