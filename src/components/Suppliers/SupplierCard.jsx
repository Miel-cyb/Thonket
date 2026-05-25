
import React from "react";
import {
    Building2,
    MapPin,
    Phone,
    CheckCircle2,
    AlertTriangle,
    Truck,
    Package
} from "lucide-react";

// SUPPLIER CARD - COMPACT SUPPLIER SUMMARY FOR DASHBOARDS AND LISTS
export default function SupplierCard({ supplier }) {
    return (
        <div className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition">

            {/* HEADER */}
            <div className="flex items-start justify-between">

                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {supplier.name || "Unnamed Supplier"}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Building2 size={12} />
                        {supplier.type || "Unknown Type"}
                    </p>
                </div>

                {/* STATUS BADGE */}
                <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full
                    ${supplier.status === "verified"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}>

                    {supplier.status === "verified"
                        ? <CheckCircle2 size={12} />
                        : <AlertTriangle size={12} />
                    }

                    {supplier.status || "pending"}
                </div>
            </div>

            {/* BODY */}
            <div className="mt-3 space-y-2 text-xs text-slate-600">

                <div className="flex items-center gap-2">
                    <MapPin size={12} />
                    <span>{supplier.location || "No location set"}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Phone size={12} />
                    <span>{supplier.phone || "No phone"}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Package size={12} />
                    <span>
                        {supplier.categories?.length
                            ? supplier.categories.join(", ")
                            : "No categories"
                        }
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Truck size={12} />
                    <span>
                        Delivery: {supplier.deliveryType || "Not set"}
                    </span>
                </div>
            </div>

            {/* FOOTER METRICS */}
            <div className="mt-4 pt-3 border-t flex justify-between text-xs text-slate-500">

                <div>
                    Capacity: {supplier.capacity || "N/A"}
                </div>

                <div>
                    Risk: {supplier.risk || "Unknown"}
                </div>

            </div>

        </div>
    );
}