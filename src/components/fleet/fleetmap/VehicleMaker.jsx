'use client';

import { Navigation } from 'lucide-react';

export default function VehicleMarker({ vehicle }) {
    // Industrial color mapping with specific glow effects
    const getStatusStyles = () => {
        switch (vehicle.status) {
            case 'active':
                return {
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500',
                    shadow: 'shadow-[0_0_15px_rgba(52,211,153,0.5)]',
                    ping: 'bg-emerald-400'
                };
            case 'idle':
                return {
                    color: 'text-amber-400',
                    bg: 'bg-amber-500',
                    shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
                    ping: 'hidden'
                };
            case 'issue':
                return {
                    color: 'text-red-400',
                    bg: 'bg-red-500',
                    shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
                    ping: 'bg-red-400'
                };
            default:
                return {
                    color: 'text-slate-400',
                    bg: 'bg-slate-500',
                    shadow: '',
                    ping: 'hidden'
                };
        }
    };

    const styles = getStatusStyles();

    // Default heading to 0 (North) if not provided
    const rotation = vehicle.heading || 0;

    return (
        <div
            className="absolute group z-20 transition-all duration-700 ease-in-out"
            style={{
                top: `${vehicle.lat || 50}%`,
                left: `${vehicle.lng || 50}%`,
                transform: 'translate(-50%, -50%)'
            }}
        >
            {/* Active Ripple Animation */}
            {vehicle.status === 'active' && (
                <span className={`absolute inset-0 rounded-full animate-ping opacity-20 ${styles.ping}`} />
            )}

            {/* Tactical Marker Body */}
            <div className={`
                relative flex items-center justify-center
                w-8 h-8 rounded-xl bg-slate-900 border-2 border-slate-700
                ${styles.shadow} group-hover:scale-125 group-hover:border-white transition-all cursor-crosshair
            `}>
                {/* Directional Arrow */}
                <div
                    className={`transition-transform duration-500 ${styles.color}`}
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    <Navigation size={16} fill="currentColor" />
                </div>

                {/* Status Dot (Bottom Right corner of the marker) */}
                <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${styles.bg}`} />
            </div>

            {/* Tactical Data Tooltip (HUD Style) */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 z-30">
                <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl min-w-[140px]">
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                            {vehicle.name || 'Unit Alpha'}
                        </p>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${styles.bg} text-slate-900`}>
                            {vehicle.status}
                        </span>
                    </div>
                    <div className="h-px bg-slate-700 my-2" />
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span className="text-[8px] text-slate-400 font-bold uppercase">Velocity</span>
                            <span className="text-[9px] text-white font-mono">{vehicle.speed || '0'} KM/H</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[8px] text-slate-400 font-bold uppercase">Heading</span>
                            <span className="text-[9px] text-white font-mono">{rotation}°</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}