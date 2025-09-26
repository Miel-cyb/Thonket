// components/Insights.jsx
import React from "react";
import KPISection from "./KPISection";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

// Sample data
const supplierPerformanceData = [
    { supplier: "Supplier A", onTime: 95 },
    { supplier: "Supplier B", onTime: 88 },
    { supplier: "Supplier C", onTime: 92 },
];

const regionalPerformanceData = [
    { region: "Asokwa", revenue: 1_200_000 },
    { region: "Kumasi Central", revenue: 1_800_000 },
    { region: "Suame", revenue: 1_100_000 },
    { region: "Asawase", revenue: 950_000 },
    { region: "Tafo", revenue: 850_000 },
];

const productCategoryData = [
    { category: "Grains", revenue: 1_500_000 },
    { category: "Oil & Fat", revenue: 900_000 },
    { category: "Sugar & Salt", revenue: 750_000 },
    { category: "Spices & Condiments", revenue: 600_000 },
];

const marketShareData = [
    { name: "Our Company", value: 45 },
    { name: "Competitor 1", value: 25 },
    { name: "Competitor 2", value: 15 },
    { name: "Competitor 3", value: 15 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Insights = () => {
    return (
        <KPISection title="Optional KPIs / Insights">
            <div className="grid grid-cols-1 gap-6">
                {/* Supplier Performance */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Supplier Performance (On-Time %)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={supplierPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="supplier" />
                            <YAxis />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                            <Bar dataKey="onTime" fill="#0088FE" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Regional Performance */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Regional Performance (Revenue in ₵)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={regionalPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="region" />
                            <YAxis />
                            <Tooltip formatter={(value) => `₵${value.toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="revenue" fill="#00C49F" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Product Category Performance */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Key Product Category Performance (Revenue in ₵)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={productCategoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip formatter={(value) => `₵${value.toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="revenue" fill="#FFBB28" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Market Share Comparison */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Market Share Comparison (%)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={marketShareData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {marketShareData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </KPISection>
    );
};

export default Insights;
