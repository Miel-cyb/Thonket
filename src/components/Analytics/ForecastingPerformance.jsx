// components/Forecasting.jsx
import React from "react";
import KPISection from "./KPISection";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample realistic forecasting data (weekly projections)
const demandTrendData = [
  { week: "Week 1", demand: 500 },
  { week: "Week 2", demand: 620 },
  { week: "Week 3", demand: 580 },
  { week: "Week 4", demand: 700 },
  { week: "Week 5", demand: 750 },
];

const ordersTrendData = [
  { week: "Week 1", orders: 320 },
  { week: "Week 2", orders: 410 },
  { week: "Week 3", orders: 380 },
  { week: "Week 4", orders: 450 },
  { week: "Week 5", orders: 500 },
];

const Forecasting = () => {
  return (
    <KPISection title="Forecasting & Projections">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Projected Revenue (Next Month)</h3>
          <p className="text-xl font-bold">₵4,500,000</p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Projected Profit</h3>
          <p className="text-xl font-bold">₵1,350,000</p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Expected Growth</h3>
          <p className="text-xl font-bold">+15%</p>
        </div>
      </div>

      {/* Demand Trend Prediction */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="text-sm font-semibold mb-2">Demand Trend Prediction</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={demandTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} units`} />
            <Legend />
            <Line type="monotone" dataKey="demand" stroke="#0088FE" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Trend Prediction */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="text-sm font-semibold mb-2">Orders Trend Prediction</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ordersTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} orders`} />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#00C49F" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </KPISection>
  );
};

export default Forecasting;
