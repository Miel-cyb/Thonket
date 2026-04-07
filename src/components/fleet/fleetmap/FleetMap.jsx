'use client';

import { Map as MapIcon, Navigation, Crosshair, Layers, Box } from 'lucide-react';
import VehicleMarker from './VehicleMaker';

export default function FleetMap({ vehicles = [], tasks = [], driverView = false }) {
    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-6 h-[600px] flex flex-col overflow-hidden">

            {/* Tactical Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                        <h2 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">
                            Geospatial Protocol
                        </h2>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                        {driverView ? 'Route Guidance' : 'Global Fleet Matrix'}
                    </h3>
                </div>

                <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                        <Layers size={18} />
                    </button>
                    <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                        <Crosshair size={18} />
                    </button>
                </div>
            </div>

            {/* Map Container Terminal */}
            <div className="relative flex-1 bg-slate-900 rounded-[2rem] overflow-hidden border-4 border-slate-100 shadow-inner group">

                {/* Tactical Grid Overlay (Pure CSS aesthetic) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', size: '40px 40px', backgroundSize: '40px 40px' }}
                />

                {/* Map Layer Placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <MapIcon size={48} className="text-slate-800 mb-4 animate-bounce" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
                        Awaiting Satellite Uplink...
                    </p>
                    <div className="mt-4 px-4 py-1 bg-slate-800 rounded-full border border-slate-700">
                        <p className="text-[9px] font-mono text-indigo-400">LAT: 5.6037° N | LON: 0.1870° W</p>
                    </div>
                </div>

                {/* Legend / HUD HUD Overlay */}
                <div className="absolute bottom-6 left-6 p-4 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl z-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-3 bg-indigo-500 rounded-full ring-4 ring-indigo-500/20" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Active Units ({vehicles.length})</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-3 bg-emerald-400 rounded-sm ring-4 ring-emerald-400/20" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Nodes ({tasks.length})</span>
                        </div>
                    </div>
                </div>

                {/* Vehicle Markers */}
                {vehicles.map((vehicle) => (
                    <VehicleMarker key={vehicle.id} vehicle={vehicle} />
                ))}

                {/* Task Nodes (Delivery Locations) */}
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="absolute group/node"
                        style={{
                            top: `${task.lat || 50}%`,
                            left: `${task.lng || 50}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-40 group-hover/node:opacity-80 transition-opacity" />

                        <div className="relative bg-emerald-500 text-white p-1.5 rounded-lg border-2 border-slate-900 shadow-xl transform transition-transform group-hover/node:scale-110 cursor-help">
                            <Box size={14} />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-tighter rounded opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap">
                                Drop-off: {task.id}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Map Footer Info */}
            <div className="mt-4 flex justify-between items-center px-2">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Navigation size={14} className="text-indigo-600" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">Auto-Re-routing: ON</span>
                    </div>
                </div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    Vector v2.4.0-Stable
                </p>
            </div>
        </div>
    );
}