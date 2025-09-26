// components/WarehouseInventory.jsx
import React from "react";
import KPISection from "./KPISection";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample stock levels by category
const stockData = [
    { category: "Grains", units: 5000 },
    { category: "Oil & Fat", units: 3500 },
    { category: "Sugar & Salt", units: 2500 },
    { category: "Spices & Condiments", units: 1500 },
];

const WarehouseInventory = () => {
    return (
        <KPISection title="Warehouse & Inventory">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Stock Levels</h3>
                    <p className="text-xl font-bold">12,500 units</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Turnover Rate</h3>
                    <p className="text-xl font-bold">1.8x</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Deadstock</h3>
                    <p className="text-xl font-bold">2%</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Stock-Outs</h3>
                    <p className="text-xl font-bold">3 incidents</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Capacity Utilization</h3>
                    <p className="text-xl font-bold">72%</p>
                </div>

                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Inventory Value</h3>
                    <p className="text-xl font-bold">₵1,020,000</p>
                </div>
            </div>

            {/* Stock Levels by Category Bar Chart */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm font-semibold mb-2">Stock Levels by Product Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} units`} />
                        <Bar dataKey="units" fill="#FFBB28" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </KPISection>
    );
};

export default WarehouseInventory;
