// components/RevenueProfit.jsx
import React from "react";
import KPISection from "./KPISection";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Sample realistic monthly data in ₵
const revenueData = [
  { month: "Jan", projected: 800_000, actual: 760_000 },
  { month: "Feb", projected: 850_000, actual: 830_000 },
  { month: "Mar", projected: 900_000, actual: 880_000 },
  { month: "Apr", projected: 950_000, actual: 910_000 },
  { month: "May", projected: 1_000_000, actual: 970_000 },
];

const RevenueProfit = () => {
  return (
    <KPISection title="Revenue & Profitability">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Total Revenue</h3>
          <p className="text-xl font-bold">₵4,550,000</p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Gross Profit</h3>
          <p className="text-xl font-bold">₵1,750,000</p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Profit Margin</h3>
          <p className="text-xl font-bold">38%</p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Revenue vs Target</h3>
          <p className="text-xl font-bold">92%</p>
        </div>
      </div>

      {/* Projected vs Actual Revenue Bar Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm font-semibold mb-2">Projected vs Actual Revenue (₵)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `₵${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="projected" fill="#0088FE" name="Projected" />
            <Bar dataKey="actual" fill="#00C49F" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </KPISection>
  );
};

export default RevenueProfit;
