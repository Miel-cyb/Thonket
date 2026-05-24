import React, { useState } from "react";

const ShipmentDetailsForm = ({
    suppliers = [],
    warehouses = [],
    onSubmit,
}) => {

    const [shipment, setShipment] = useState({
        supplier: "",
        warehouse: "",

        invoiceNumber: "",
        purchaseOrder: "",
        deliveryNote: "",
        billOfLading: "",

        transportCompany: "",
        vehicleNumber: "",
        driverName: "",
        driverPhone: "",

        receiverName: "",
        receivingDate: "",

        originLocation: "",
        expectedArrival: "",

        paymentTerms: "",
        status: "pending",

        notes: "",
    });

    const update = (field, value) => {
        setShipment((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(shipment);
    };

    const input =
        "w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl " +
        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";

    const label =
        "text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1";

    return (
        <div className="max-w-6xl mx-auto my-10 bg-white rounded-3xl border shadow-2xl overflow-hidden font-sans">

            {/* HEADER */}
            <div className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white">
                <h2 className="text-2xl font-bold text-slate-900">
                    Shipment Intake Details
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Register full distribution shipment metadata before stock intake.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-10">

                {/* SECTION 1: CORE INFO */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
                        Core Shipment Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div>
                            <div className={label}>Supplier</div>
                            <select
                                className={input}
                                value={shipment.supplier}
                                onChange={(e) => update("supplier", e.target.value)}
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map((s, i) => (
                                    <option key={i} value={s.name}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div className={label}>Warehouse</div>
                            <select
                                className={input}
                                value={shipment.warehouse}
                                onChange={(e) => update("warehouse", e.target.value)}
                            >
                                <option value="">Select Warehouse</option>
                                {warehouses.map((w, i) => (
                                    <option key={i} value={w.name}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div className={label}>Receiving Date</div>
                            <input
                                type="date"
                                className={input}
                                value={shipment.receivingDate}
                                onChange={(e) => update("receivingDate", e.target.value)}
                            />
                        </div>

                    </div>
                </div>

                {/* SECTION 2: DOCUMENTS */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
                        Shipment Documents
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div>
                            <div className={label}>Invoice Number</div>
                            <input
                                className={input}
                                value={shipment.invoiceNumber}
                                onChange={(e) => update("invoiceNumber", e.target.value)}
                            />
                        </div>

                        <div>
                            <div className={label}>Purchase Order</div>
                            <input
                                className={input}
                                value={shipment.purchaseOrder}
                                onChange={(e) => update("purchaseOrder", e.target.value)}
                            />
                        </div>

                        <div>
                            <div className={label}>Delivery Note</div>
                            <input
                                className={input}
                                value={shipment.deliveryNote}
                                onChange={(e) => update("deliveryNote", e.target.value)}
                            />
                        </div>

                        <div>
                            <div className={label}>Bill of Lading</div>
                            <input
                                className={input}
                                value={shipment.billOfLading}
                                onChange={(e) => update("billOfLading", e.target.value)}
                            />
                        </div>

                        <div>
                            <div className={label}>Payment Terms</div>
                            <input
                                className={input}
                                placeholder="e.g. Net 30"
                                value={shipment.paymentTerms}
                                onChange={(e) => update("paymentTerms", e.target.value)}
                            />
                        </div>

                    </div>
                </div>

                {/* SECTION 3: LOGISTICS */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
                        Logistics Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div>
                            <div className={label}>Transport Company</div>
                            <input
                                className={input}
                                value={shipment.transportCompany}
                                onChange={(e) => update("transportCompany", e.target.value)}
                            />
                        </div>

                        <div>
                            <div className={label}>Vehicle Number</div>
                            <input
                                className={input}
                                value={shipment.vehicleNumber}
                                onChange={(e) => update("vehicleNumber", e.target.value)}
                            />
                        </div>

                        <div>
                            <div className={label}>Driver Name</div>
                            <input
                                className={input}
                                value={shipment.driverName}
                                onChange={(e) => update("driverName", e.target.value)}
                            />
                        </div>

                        <div>
                            <div className={label}>Driver Phone</div>
                            <input
                                className={input}
                                value={shipment.driverPhone}
                                onChange={(e) => update("driverPhone", e.target.value)}
                            />
                        </div>

                        <div>
                            <div className={label}>Origin Location</div>
                            <input
                                className={input}
                                value={shipment.originLocation}
                                onChange={(e) => update("originLocation", e.target.value)}
                            />
                        </div>

                        <div>
                            <div className={label}>Expected Arrival</div>
                            <input
                                type="datetime-local"
                                className={input}
                                value={shipment.expectedArrival}
                                onChange={(e) => update("expectedArrival", e.target.value)}
                            />
                        </div>

                    </div>
                </div>

                {/* SECTION 4: RECEIVING */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
                        Receiving Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <div className={label}>Receiver Name</div>
                            <input
                                className={input}
                                value={shipment.receiverName}
                                onChange={(e) => update("receiverName", e.target.value)}
                            />
                        </div>

                        <div>
                            <div className={label}>Status</div>
                            <select
                                className={input}
                                value={shipment.status}
                                onChange={(e) => update("status", e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="in_transit">In Transit</option>
                                <option value="received">Received</option>
                                <option value="partial">Partially Received</option>
                                <option value="damaged">Damaged</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <div className={label}>Notes</div>
                            <textarea
                                className={input}
                                rows={4}
                                placeholder="Additional remarks about shipment condition, delays, discrepancies..."
                                value={shipment.notes}
                                onChange={(e) => update("notes", e.target.value)}
                            />
                        </div>

                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-4 pt-4 border-t">

                    <button
                        type="button"
                        className="px-6 py-3 rounded-xl border font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Save Draft
                    </button>

                    <button
                        type="submit"
                        className="px-7 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                    >
                        Save Shipment
                    </button>

                </div>

            </form>
        </div>
    );
};

export default ShipmentDetailsForm;