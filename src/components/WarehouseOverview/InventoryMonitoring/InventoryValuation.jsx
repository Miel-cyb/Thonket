"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const inventoryData = [
  { month: "Jan", value: 12000 },
  { month: "Feb", value: 14000 },
  { month: "Mar", value: 12500 },
  { month: "Apr", value: 16000 },
  { month: "May", value: 18000 },
  { month: "Jun", value: 15000 },
  { month: "Jul", value: 20000 },
];

export default function InventoryValuation() {
  return (
    <div className="w-full h-screen bg-white p-10">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Inventory Valuation Report
      </h2>

      {/* Curve Chart */}
      <div className="w-full h-[500px] bg-gray-50 rounded-2xl shadow-md p-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: "10px" }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 5, fill: "#4f46e5" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
