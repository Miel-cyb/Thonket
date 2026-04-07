'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';

export default function VehicleUsageChart({ data }) {

    // Custom Tooltip to match the HUD aesthetic
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        {payload[0].payload.name}
                    </p>
                    <p className="text-sm font-black text-white">
                        {payload[0].value} <span className="text-[10px] text-indigo-400">HRS / KM</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full flex flex-col">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    {/* Subtle grid lines to give a "blueprint" feel */}
                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#e2e8f0"
                    />

                    <XAxis
                        type="number"
                        hide
                    />

                    <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                        width={80}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: '#f1f5f9', radius: 12 }}
                    />

                    {/* The Bar: Styled as a progress track */}
                    <Bar
                        dataKey="usage"
                        fill="#4f46e5"
                        radius={[0, 12, 12, 0]} /* Rounded only on the right side */
                        barSize={24}
                        background={{ fill: '#f1f5f9', radius: 12 }} /* Shows the "track" behind the bar */
                        animationDuration={1500}
                    />
                </BarChart>
            </ResponsiveContainer>

            {/* Footer Legend */}
            <div className="mt-4 flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-8 bg-indigo-600 rounded-full" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Duty Cycle</span>
                </div>
                <span className="text-[9px] font-mono text-slate-300">TELEMETRY_V4</span>
            </div>
        </div>
    );
}