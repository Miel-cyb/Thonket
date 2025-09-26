// components/DeliveryLogistics.jsx
import React from "react";
import KPISection from "./KPISection";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Sample realistic data for fuel costs trend (₵ per week)
const fuelCostData = [
    { week: "Week 1", fuelCost: 15_000 },
    { week: "Week 2", fuelCost: 16_200 },
    { week: "Week 3", fuelCost: 14_800 },
    { week: "Week 4", fuelCost: 17_000 },
    { week: "Week 5", fuelCost: 16_500 },
];

const DeliveryLogistics = () => {
    return (
        <KPISection title="Delivery & Logistics">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">On-Time Delivery</h3>
                    <p className="text-xl font-bold">93%</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Avg Delivery Time</h3>
                    <p className="text-xl font-bold">2.5h</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Route Efficiency</h3>
                    <p className="text-xl font-bold">85%</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Fleet Utilization</h3>
                    <p className="text-xl font-bold">78%</p>
                </div>
            </div>

            {/* Fuel Costs Trend */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm font-semibold mb-2">Fuel Costs Trend (₵ per week)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={fuelCostData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₵${value.toLocaleString()}`} />
                        <Legend />
                        <Line type="monotone" dataKey="fuelCost" stroke="#FF8042" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </KPISection>
    );
};

export default DeliveryLogistics;
