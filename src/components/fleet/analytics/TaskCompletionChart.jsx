'use client';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export default function TaskCompletionChart({ data }) {
    // Industrial theme colors: Indigo (Completed) and Amber (Pending)
    const COLORS = ['#4f46e5', '#f59e0b'];

    // Custom Tooltip to match the HUD aesthetic
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        {payload[0].name}
                    </p>
                    <p className="text-sm font-black text-white">
                        {payload[0].value} <span className="text-[10px] text-slate-500">UNITS</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">

            {/* Center Label for the Donut Hole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Status</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">
                    {data.reduce((acc, curr) => acc + curr.value, 0)}
                </p>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={75}  /* Creates the Donut effect */
                        outerRadius={95}
                        paddingAngle={8}  /* Adds space between segments */
                        stroke="none"      /* Removes the white border around slices */
                        startAngle={90}
                        endAngle={450}
                        animationBegin={200}
                        animationDuration={1200}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                className="hover:opacity-80 transition-opacity outline-none"
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend to match the industrial theme */}
            <div className="mt-4 flex gap-6">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {entry.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}