'use client';

import React from 'react';
import {
    Play,
    Pause,
    AlertTriangle,
    PlusCircle,
    ClipboardList,
    Truck,
    ChevronRight,
    ShieldCheck,
    CircleUserRound
} from "lucide-react";

export default function QuickActionsBar({ userRole = 'manager', onAction }) {

    const driverActions = [
        { label: 'Start Route', action: 'start_route', color: 'bg-indigo-600', tint: 'bg-indigo-50 text-indigo-700', icon: <Play size={16} /> },
        { label: 'Pause Transit', action: 'pause_route', color: 'bg-amber-500', tint: 'bg-amber-50 text-amber-700', icon: <Pause size={16} /> },
        { label: 'Incident Report', action: 'report_issue', color: 'bg-red-600', tint: 'bg-red-50 text-red-700', icon: <AlertTriangle size={16} /> },
    ];

    const managerActions = [
        { label: 'Deploy Task', action: 'assign_task', color: 'bg-indigo-600', tint: 'bg-indigo-50 text-indigo-700', icon: <ClipboardList size={16} /> },
        { label: 'Onboard Vehicle', action: 'add_vehicle', color: 'bg-emerald-600', tint: 'bg-emerald-50 text-emerald-700', icon: <Truck size={16} /> },
        { label: 'Intelligence', action: 'view_reports', color: 'bg-slate-900', tint: 'bg-slate-100 text-slate-700', icon: <PlusCircle size={16} /> },
    ];

    const actions = userRole === 'driver' ? driverActions : managerActions;

    return (
        <div className="bg-white border border-slate-200 p-1.5 rounded-[1.5rem] shadow-sm flex items-center gap-1.5 w-full max-w-fit">

            {/* ROLE INDICATOR LABEL */}
            <div className="flex items-center gap-3 pl-4 pr-6 py-2 border-r border-slate-100">
                <div className={`p-2 rounded-xl flex items-center justify-center ${userRole === 'driver' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {userRole === 'driver' ? <CircleUserRound size={18} /> : <ShieldCheck size={18} />}
                </div>
                <div className="hidden sm:block">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none mb-1">Status</p>
                    <p className="text-[10px] font-black uppercase text-slate-900 tracking-tight whitespace-nowrap">{userRole} Ops</p>
                </div>
            </div>

            {/* ACTION GRID */}
            <div className="flex items-center gap-2 pr-1">
                {actions.map((btn) => (
                    <button
                        key={btn.action}
                        onClick={() => onAction?.(btn.action)}
                        className={`
                            group flex items-center gap-2.5 px-5 py-2.5 
                            rounded-[1rem] transition-all duration-300
                            ${btn.tint} hover:${btn.color} hover:text-white
                            hover:scale-[1.03] active:scale-95 
                            hover:shadow-lg hover:shadow-indigo-100
                        `}
                    >
                        <span className="transition-transform group-hover:scale-110">
                            {btn.icon}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            {btn.label}
                        </span>
                        <ChevronRight
                            size={12}
                            className="opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}