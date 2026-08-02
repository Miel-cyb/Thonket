import React from "react";
import { Building2, Plus } from "lucide-react";

//This is the header component for the Warehouse Management page. 
// It displays the title, description, and an "Add Warehouse" button. The button triggers the onAddClick function passed as a prop when clicked.
export default function WarehouseHeader({ onAddClick }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-7 h-7 text-indigo-600" />
                    Warehouse Management
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Configure facilities, capacity thresholds, and staff assignments.
                </p>
            </div>

            <button
                onClick={onAddClick}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-indigo-200"
            >
                <Plus className="w-5 h-5" />
                Add Warehouse
            </button>
        </div>
    );
}