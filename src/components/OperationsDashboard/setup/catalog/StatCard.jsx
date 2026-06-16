import React from 'react';

export const StatCard = ({ icon: Icon, label, value, color, detail }) => {
    return (
        <div className="flex-1 min-w-[240px] bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgb(0,0,0,0.08)] hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300 group">

            {/* Structural high-contrast graphical badge wrapper */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color} shadow-inner bg-gradient-to-br transition-transform duration-300 group-hover:scale-105`}>
                <Icon size={24} className="transition-transform duration-300 group-hover:rotate-3" />
            </div>

            {/* Structured text matrix container */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5 select-none truncate">
                    {label}
                </p>

                <div className="flex items-center gap-2 flex-wrap leading-none">
                    <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </span>

                    {detail && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100/70 shrink-0">
                            {detail}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};