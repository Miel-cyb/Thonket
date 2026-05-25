import React from "react";
import {
    Truck,
    MapPin,
    Clock,
    ArrowUpRight,
    MoreHorizontal,
    Navigation,
} from "lucide-react";

// IN TRANSIT VIEW - PREMIUM LOGISTICS UI CARD
export default function InTransitView() {

    const mockShipments = [
        {
            id: "SHIP-001",
            supplier: "Makola Traders",
            eta: "2 days",
            status: "on route",
        },
        {
            id: "SHIP-002",
            supplier: "Accra Wholesale",
            eta: "5 hours",
            status: "arriving",
        },
    ];

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-lg">

            {/* HEADER */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white px-5 py-4">

                <div className="flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100">
                            <Truck size={20} className="text-blue-700" />
                        </div>

                        <div>
                            <h2 className="text-base font-bold tracking-tight text-slate-900">
                                In Transit
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Shipments currently moving through the supply chain.
                            </p>
                        </div>
                    </div>

                    {/* LIVE STATUS */}
                    <div className="hidden md:flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5">

                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />

                        <span className="text-xs font-semibold text-blue-700">
                            Tracking Live
                        </span>
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-auto bg-slate-50/40 p-4">

                <div className="space-y-4">

                    {mockShipments.map((ship) => (
                        <div
                            key={ship.id}
                            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
                        >

                            <div className="flex items-start justify-between">

                                {/* LEFT */}
                                <div className="flex items-start gap-4">

                                    {/* ICON */}
                                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 transition group-hover:bg-blue-100">
                                        <Navigation size={18} className="text-blue-600" />
                                    </div>

                                    {/* DETAILS */}
                                    <div>

                                        <div className="flex items-center gap-2">

                                            <h3 className="text-sm font-bold text-slate-900">
                                                {ship.supplier}
                                            </h3>

                                            <ArrowUpRight
                                                size={14}
                                                className="text-slate-300 transition group-hover:text-slate-600"
                                            />
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">

                                            <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 font-medium text-slate-600">
                                                <Clock size={12} />
                                                ETA {ship.eta}
                                            </span>

                                            <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 font-medium text-slate-600">
                                                <MapPin size={12} />
                                                {ship.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="flex items-center gap-3">

                                    {/* STATUS BADGE */}
                                    <span
                                        className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide ${ship.status === "arriving"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-blue-100 text-blue-700"
                                            }`}
                                    >
                                        {ship.status.toUpperCase()}
                                    </span>

                                    {/* ACTION */}
                                    <button className="opacity-0 transition group-hover:opacity-100">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                                            <MoreHorizontal size={16} />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="h-2" />
            </div>
        </div>
    );
}