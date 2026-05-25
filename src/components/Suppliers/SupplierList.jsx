
import React from "react";
import SupplierCard from "./SupplierCard";

export default function SupplierList({ suppliers = [] }) {
    return (
        <div className="space-y-4">

            {/* HEADER */}
            <div className="flex items-center justify-between">

                <h2 className="text-lg font-semibold text-slate-900">
                    Suppliers
                </h2>

                <span className="text-sm text-slate-500">
                    {suppliers.length} registered
                </span>

            </div>

            {/* GRID */}
            {suppliers.length === 0 ? (
                <div className="text-sm text-slate-500 border rounded-xl p-6 bg-white">
                    No suppliers available yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliers.map((supplier) => (
                        <SupplierCard
                            key={supplier.id}
                            supplier={supplier}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}