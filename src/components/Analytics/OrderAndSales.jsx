// components/OrdersSales.jsx
import React from "react";
import KPISection from "./KPISection";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

// Sample realistic data for a Kumasi wholesale distribution company
const orderVolumeData = [
  { date: "2025-09-01", orders: 320 },
  { date: "2025-09-02", orders: 410 },
  { date: "2025-09-03", orders: 380 },
  { date: "2025-09-04", orders: 450 },
  { date: "2025-09-05", orders: 500 },
  { date: "2025-09-06", orders: 470 },
  { date: "2025-09-07", orders: 520 },
];

const topProductsData = [
  { product: "Maize Bags", orders: 1200 },
  { product: "Cooking Oil 5L", orders: 950 },
  { product: "Sugar 50kg", orders: 850 },
  { product: "Rice 25kg", orders: 780 },
  { product: "Tomatoes Paste 1L", orders: 600 },
];

const ordersByRegionData = [
  { name: "Asokwa", value: 450 },
  { name: "Kumasi Central", value: 600 },
  { name: "Suame", value: 400 },
  { name: "Asawase", value: 350 },
  { name: "Tafo", value: 300 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

const OrdersSales = () => {
  return (
    <KPISection title="Orders & Sales">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Total Orders</h3>
          <p className="text-xl font-bold">3,200</p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Average Order Value</h3>
          <p className="text-xl font-bold">₵1,200</p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Average Profit per Order</h3>
          <p className="text-xl font-bold">₵320</p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Fulfillment Rate</h3>
          <p className="text-xl font-bold">95%</p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Returns / Cancellations</h3>
          <p className="text-xl font-bold">3%</p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Revenue from Orders</h3>
          <p className="text-xl font-bold">₵3,840,000</p>
        </div>
      </div>

      {/* Order Volume Trend */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="text-sm font-semibold mb-2">Order Volume Trend (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={orderVolumeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} orders`} />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#0088FE" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top-Selling Products */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="text-sm font-semibold mb-2">Top-Selling Products (This Month)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProductsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} orders`} />
            <Legend />
            <Bar dataKey="orders" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders by Region */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="text-sm font-semibold mb-2">Orders by District (Kumasi)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ordersByRegionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {ordersByRegionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} orders`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </KPISection>
  );
};

export default OrdersSales;
