import React from "react";
import { Truck, MapPin, Calendar } from "lucide-react";

// STEP LOGISTICS - DELIVERY OPTIONS AND SCHEDULING FOR PURCHASE ORDERS
export default function StepLogistics({ form, setForm }) {
    const logistics = form?.logistics || {};

    // IMMUTABLE DISPATCH UPDATER FUNCTION TO ENFORCE CLEAN STATE CLOSURES
    const updateLogisticsField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            logistics: {
                ...(prev?.logistics || {}),
                [field]: value
            }
        }));
    };

    // SYSTEM TIMESTAMP CALCULATION TO ENFORCE FUTURE DEADLINE SELECTION
    const getTodayISOString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="space-y-6 animate-fadeIn max-w-[1660px] mx-auto p-1">

            {/* GRID LAYOUT SPLIT */}
            <div className="grid grid-cols-12 gap-5">

                {/* SELECT COMPONENT: CARRIER STRATEGY DEPLOYMENT */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2 group">
                    <label htmlFor="delivery-type" className="text-sm font-semibold tracking-tight text-slate-700">
                        Fulfillment Model
                    </label>
                    <div className="relative">
                        <Truck
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10"
                        />
                        <select
                            id="delivery-type"
                            value={logistics.deliveryType || ""}
                            onChange={(e) => updateLogisticsField("deliveryType", e.target.value)}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-10 py-3 shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px]"
                        >
                            <option value="" disabled hidden>Select Allocation Routing</option>
                            <option value="supplier">Supplier Managed Logistics</option>
                            <option value="third_party">Third-Party Carrier (3PL)</option>
                            <option value="pickup">Internal Factory Pickup</option>
                        </select>

                        {/* DROPDOWN CHEVRON ICON */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* INPUT COMPONENT: SPECIFIED FULFILLMENT DEADLINE DATE */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2 group">
                    <label htmlFor="delivery-date" className="text-sm font-semibold tracking-tight text-slate-700">
                        Target Delivery Date
                    </label>
                    <div className="relative">
                        <Calendar
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10"
                        />
                        <input
                            id="delivery-date"
                            type="date"
                            min={getTodayISOString()}
                            value={logistics.date || ""}
                            onChange={(e) => updateLogisticsField("date", e.target.value)}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px] relative cursor-pointer
              [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:bg-transparent [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                    </div>
                </div>

                {/* TEXT COMPONENT: MASTER HUB DESTINATION ADDRESS */}
                <div className="col-span-12 flex flex-col gap-2 group">
                    <label htmlFor="delivery-location" className="text-sm font-semibold tracking-tight text-slate-700">
                        Destination Discharge Address
                    </label>
                    <div className="relative">
                        <MapPin
                            size={18}
                            className="absolute left-4 top-[15px] text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none"
                        />
                        <textarea
                            id="delivery-location"
                            rows={3}
                            placeholder="e.g., Central Receiving Dock 4, Complex Beta, 842 Industrial Parkway, Tema"
                            value={logistics.location || ""}
                            onChange={(e) => updateLogisticsField("location", e.target.value)}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none leading-relaxed"
                        />
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">
                        Specify exact site locations, building units, or cargo drop bay indicators to prevent routing delays.
                    </p>
                </div>

            </div>
        </div>
    );
}