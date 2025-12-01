import React from "react";

/**
 * OrderSummary
 * Props: orders (array)
 */
const OrderSummary = ({ orders }) => {
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    approved: orders.filter((o) => o.status === "Approved").length,
    packed: orders.filter((o) => o.status === "Packed").length,
    ready: orders.filter((o) => o.status === "Ready").length,
    delayed: orders.filter((o) => o.status === "Delayed").length,
  };

  const cards = [
    { label: "Total Orders", value: stats.total, color: "text-cyan-900" },
    { label: "Pending", value: stats.pending, color: "text-yellow-600" },
    { label: "Approved", value: stats.approved, color: "text-blue-600" },
    { label: "Packed", value: stats.packed, color: "text-green-600" },
    { label: "Delayed", value: stats.delayed, color: "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">{c.label}</div>
          <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
        </div>
      ))}
    </div>
  );
};

export default OrderSummary;
