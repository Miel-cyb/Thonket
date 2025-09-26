// components/Customers.jsx
import React from "react";
import KPISection from "./KPISection";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Sample data for customer segments
const customerSegments = [
    { name: "Retailers", value: 1800 },
    { name: "Wholesalers", value: 900 },
    { name: "Distributors", value: 500 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const Customers = () => {
    return (
        <KPISection title="Customers">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Total Customers</h3>
                    <p className="text-xl font-bold">3,200</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">New vs Returning</h3>
                    <p className="text-xl font-bold">60 / 40</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Churn Rate</h3>
                    <p className="text-xl font-bold">5%</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Customer Lifetime Value (LTV)</h3>
                    <p className="text-xl font-bold">₵3,800</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Average Orders per Customer</h3>
                    <p className="text-xl font-bold">15</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">High-Value Customers</h3>
                    <p className="text-xl font-bold">720</p>
                </div>
            </div>

            {/* Customer Segment Pie Chart */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm font-semibold mb-2">Customer Segment Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={customerSegments}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {customerSegments.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} customers`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </KPISection>
    );
};

export default Customers;
