// components/OperationalPerformance.jsx
import React from "react";
import KPISection from "./KPISection";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Sample expense breakdown data in ₵
const expenseData = [
    { name: "Fuel", value: 320_000 },
    { name: "Labor", value: 450_000 },
    { name: "Warehouse", value: 280_000 },
    { name: "Logistics", value: 150_000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const OperationalPerformance = () => {
    return (
        <KPISection title="Operational Performance">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Cost per Order</h3>
                    <p className="text-xl font-bold">₵36</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">KPI Summary</h3>
                    <p className="text-xl font-bold">8/10</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Overall Efficiency Score</h3>
                    <p className="text-xl font-bold">87%</p>
                </div>
            </div>

            {/* Expense Breakdown Pie Chart */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm font-semibold mb-2">Expense Breakdown (₵)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={expenseData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {expenseData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₵${value.toLocaleString()}`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </KPISection>
    );
};

export default OperationalPerformance;
