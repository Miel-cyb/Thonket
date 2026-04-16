'use client';

import { Package, ShieldAlert, Activity, Truck } from "lucide-react";

export default function FinanceStatsGrid({ orders }) {
    const counts = {
        pending: orders.filter(o => o.stage === "pending").length,
        highRisk: orders.filter(o => o.risk === "high").length,
        delivered: orders.filter(o => o.stage === "completed").length,
        delivery: orders.filter(o => o.stage === "delivery").length,
    };

    const Card = ({ label, value, icon: Icon }) => (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between">
            <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            <Icon className="text-slate-400" />
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card label="Pending Review" value={counts.pending} icon={Package} />
            <Card label="High Risk" value={counts.highRisk} icon={ShieldAlert} />
            <Card label="In Delivery" value={counts.delivery} icon={Truck} />
            <Card label="Completed" value={counts.delivered} icon={Activity} />
        </div>
    );
}