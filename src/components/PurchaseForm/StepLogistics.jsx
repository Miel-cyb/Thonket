'use client';

import React, { useState } from "react";
import { Truck, MapPin, Calendar, ChevronDown, LocateFixed } from "lucide-react";
// Import the map picker modal from your separate components directory
import MapPickerModal from "../Map/MapPickerModal";

// STEP LOGISTICS - DELIVERY OPTIONS AND SCHEDULING FOR PURCHASE ORDERS
export default function StepLogistics({ form, setForm }) {
    const logistics = form?.logistics || {};
    const [isMapOpen, setIsMapOpen] = useState(false);

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

    // HANDLES CONFIRMED GEOLOCATIONS RETURNED FROM THE IMPORTED MODAL
    const handleMapConfirm = (data) => {
        // Fallback hierarchy: prioritizes specific named address properties if present in modal output
        const cleanAddressName = data.addressName || data.placeName || data.address || "";

        setForm((prev) => ({
            ...prev,
            logistics: {
                ...(prev?.logistics || {}),
                location: cleanAddressName,
                coordinates: data.coordinates
            }
        }));
    };

    // SYSTEM TIMESTAMP CALCULATION TO ENFORCE FUTURE DEADLINE SELECTION (LOCAL-SAFE)
    const getTodayISOString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto p-6 bg-white border border-slate-200/80 rounded-xl shadow-sm">

            {/* GRID LAYOUT SPLIT */}
            <div className="grid grid-cols-12 gap-5">

                {/* SELECT COMPONENT: CARRIER STRATEGY DEPLOYMENT */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2 group">
                    <label htmlFor="delivery-type" className="text-sm font-semibold tracking-tight text-slate-700">
                        Fulfillment Model
                    </label>
                    <div className="relative flex items-center">
                        <Truck
                            size={18}
                            className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10"
                        />
                        <select
                            id="delivery-type"
                            value={logistics.deliveryType || ""}
                            onChange={(e) => updateLogisticsField("deliveryType", e.target.value)}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-12 py-3 shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px] z-0"
                        >
                            <option value="" disabled hidden>Select Allocation Routing</option>
                            <option value="supplier">Supplier Managed Logistics</option>
                            <option value="third_party">Third-Party Carrier (3PL)</option>
                            <option value="pickup">Internal Factory Pickup</option>
                        </select>

                        <div className="pointer-events-none absolute right-4 flex items-center text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
                            <ChevronDown size={18} strokeWidth={2} />
                        </div>
                    </div>
                </div>

                {/* INPUT COMPONENT: SPECIFIED FULFILLMENT DEADLINE DATE */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2 group">
                    <label htmlFor="delivery-date" className="text-sm font-semibold tracking-tight text-slate-700">
                        Target Delivery Date
                    </label>
                    <div className="relative flex items-center">
                        <Calendar
                            size={18}
                            className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10"
                        />
                        <input
                            id="delivery-date"
                            type="date"
                            min={getTodayISOString()}
                            value={logistics.date || ""}
                            onChange={(e) => updateLogisticsField("date", e.target.value)}
                            className="w-full text-base bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[48px] cursor-pointer
                              [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:opacity-80"
                        />
                    </div>
                </div>

                {/* TEXT COMPONENT: MASTER HUB DESTINATION ADDRESS WITH EXTERNAL MAP LAUNCHER */}
                <div className="col-span-12 flex flex-col gap-2 group">
                    <div className="flex items-center justify-between">
                        <label htmlFor="delivery-location" className="text-sm font-semibold tracking-tight text-slate-700">
                            Destination Discharge Address
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsMapOpen(true)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100"
                        >
                            <LocateFixed size={14} /> Use Map Picker
                        </button>
                    </div>
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
                    <p className="text-sm text-slate-500 leading-normal">
                        Specify exact site locations, building units, or cargo drop bay indicators to prevent routing delays.
                    </p>
                </div>

            </div>

            {/* EXTERNAL IMPORTED MAP PICKER INTERACTION LAYER */}
            <MapPickerModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onConfirm={handleMapConfirm}
                initialLocation={logistics.coordinates}
            />
        </div>
    );
}