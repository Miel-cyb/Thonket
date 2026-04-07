'use client';

import { Bell, User, Truck, Radio, ChevronDown, Settings } from 'lucide-react';

export default function FleetHeader({ userRole, user, notifications = [] }) {
    // Mock fleet stats for the aesthetic
    const activeUnits = 24;

    return (
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-[100]">

            {/* LEFT: Logo & Protocol Title */}
            <div className="flex items-center gap-6">
                <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
                    <Truck size={24} className="text-white" />
                </div>

                <div className="h-10 w-px bg-slate-200 hidden md:block" />

                <div className="space-y-0.5">
                    <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-2">
                        Fleet Logistics <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full tracking-widest ml-2 border border-indigo-100">PRO</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            System Active • {userRole} Terminal
                        </p>
                    </div>
                </div>
            </div>

            {/* CENTER: Quick Stats (Optional but fills the space well) */}
            <div className="hidden lg:flex items-center gap-10">
                <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Units</p>
                    <p className="text-sm font-black text-slate-900">{activeUnits} ACTIVE</p>
                </div>
                <div className="h-8 w-px bg-slate-100" />
                <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Signal Strength</p>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-3 w-1 rounded-full ${i < 4 ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: Comms + User Profile */}
            <div className="flex items-center gap-6">

                {/* System Comms / Notifications */}
                <button className="relative p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100 group">
                    <Radio size={20} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                            {notifications.length}
                        </span>
                    )}
                </button>

                <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100">
                    <Settings size={20} className="text-slate-600" />
                </button>

                <div className="h-10 w-px bg-slate-200" />

                {/* User Context */}
                <div className="flex items-center gap-4 pl-2 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{user?.name || 'Protocol User'}</p>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">ID: {user?.id || 'ALPHA-01'}</p>
                    </div>
                    <div className="relative">
                        <div className="h-12 w-12 bg-slate-100 rounded-2xl border-2 border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-indigo-500 transition-all">
                            <User size={24} className="text-slate-400" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-sm">
                            <ChevronDown size={12} className="text-slate-500" />
                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
}