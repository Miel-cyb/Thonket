import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, PieChart, Pie, Cell, Legend } from "recharts";

// Sample Orders Data (ensure items is always an array)
const orders = [
  {
    orderId: "ORD-001",
    customer: "John Smith",
    items: [
      { product: "Laptop", quantity: 1, sellingPrice: 7200, costPrice: 4800 },
      { product: "Mouse", quantity: 2, sellingPrice: 150, costPrice: 80 }
    ]
  },
  {
    orderId: "ORD-002",
    customer: "Sarah Johnson",
    items: [
      { product: "Smartphone", quantity: 1, sellingPrice: 4800, costPrice: 3000 }
    ]
  },
  {
    orderId: "ORD-003",
    customer: "Mike Davis",
    items: [
      { product: "Headphones", quantity: 3, sellingPrice: 450, costPrice: 300 }
    ]
  },
  {
    orderId: "ORD-004",
    customer: "Emma Wilson",
    items: [
      { product: "Tablet", quantity: 2, sellingPrice: 2400, costPrice: 1500 }
    ]
  },
  {
    orderId: "ORD-005",
    customer: "Kojo Mensah",
    items: [
      { product: "Charger", quantity: 5, sellingPrice: 100, costPrice: 60 },
      { product: "Earbuds", quantity: 2, sellingPrice: 500, costPrice: 300 }
    ]
  }
];

// Colors for Pie Chart
const COLORS = ["#2563EB", "#FBBF24", "#10B981", "#F87171", "#8B5CF6"];

const AnalyticsPanel = () => {
  // Prepare data
  const barData = orders.map((o) => {
    const totalPrice = Array.isArray(o.items)
      ? o.items.reduce((acc, i) => acc + i.sellingPrice * i.quantity, 0)
      : 0;
    const profit = Array.isArray(o.items)
      ? o.items.reduce((acc, i) => acc + (i.sellingPrice - i.costPrice) * i.quantity, 0)
      : 0;
    return { name: o.orderId, Sales: totalPrice, Profit: profit };
  });

  const totalSales = barData.reduce((acc, o) => acc + o.Sales, 0);
  const totalProfit = barData.reduce((acc, o) => acc + o.Profit, 0);

  const pieData = orders.map((o, idx) => {
    const profit = Array.isArray(o.items)
      ? o.items.reduce((acc, i) => acc + (i.sellingPrice - i.costPrice) * i.quantity, 0)
      : 0;
    return { name: o.customer, value: profit };
  });

  return (
    <div className="space-y-10 p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-black text-gray-800">Warehouse Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-xl font-black text-gray-800">{totalSales.toLocaleString()} GHS</div>
          <div className="text-gray-600 font-medium">Total Sales</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-xl font-black text-green-700">{totalProfit.toLocaleString()} GHS</div>
          <div className="text-green-700 font-medium">Total Profit</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-xl font-black text-gray-800">{orders.length}</div>
          <div className="text-gray-600 font-medium">Total Orders</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Sales & Profit per Order</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()} GHS`} />
              <Bar dataKey="Sales" fill="#2563EB" barSize={20}>
                <LabelList dataKey="Sales" position="top" formatter={(val) => `${val.toLocaleString()} GHS`} />
              </Bar>
              <Bar dataKey="Profit" fill="#10B981" barSize={20}>
                <LabelList dataKey="Profit" position="top" formatter={(val) => `${val.toLocaleString()} GHS`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Profit Distribution by Customer</h3>
        <div className="h-80 flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={(entry) => `${entry.name}: ${entry.value.toLocaleString()} GHS`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => `${value.toLocaleString()} GHS`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
