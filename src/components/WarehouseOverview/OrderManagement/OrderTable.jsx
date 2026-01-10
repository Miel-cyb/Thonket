import React, { useState } from "react";
import PicklistModal from "./PicklistModal";

const OrderTable = ({ orders, setOrders, onMarkReady, onConfirm, onFlagDelayed }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const updateOrder = (id, changes) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...changes } : o)));

  const handleGeneratePicklist = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="pb-2">Order ID</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2">Items</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Status</th>
              <th className="pb-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="py-3 font-medium">{o.id}</td>
                <td className="py-3">{o.customer}</td>
                <td className="py-3">{o.itemsCount}</td>
                <td className="py-3">{o.date}</td>
                <td className="py-3">
                  <StatusBadge status={o.status} />
                  {o.assignedDriver && (
                    <div className="text-xs text-gray-500 mt-1">Driver: {o.assignedDriver}</div>
                  )}
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {o.status === "Pending" && (
                      <button
                        onClick={() => { onConfirm(o.id); updateOrder(o.id, { status: "Confirmed" }); }}
                        className="px-3 py-1 bg-cyan-900 text-white rounded text-sm"
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      onClick={() => handleGeneratePicklist(o)}
                      className="px-3 py-1 bg-gray-100 rounded text-sm border"
                    >
                      Picklist
                    </button>
                    {o.status === "Packed" && (
                      <button
                        onClick={() => { onMarkReady(o.id); updateOrder(o.id, { status: "Ready" }); }}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                      >
                        Mark Ready
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const note = prompt("Add delay note (optional):", o.notes || "");
                        if (note !== null) {
                          updateOrder(o.id, { status: "Delayed", notes: note || "Delayed by ops" });
                          onFlagDelayed(o.id, note || "Delayed by ops");
                        }
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                    >
                      Flag Delay
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PicklistModal order={selectedOrder} onClose={handleCloseModal} />
    </>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    Pending: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Packed: "bg-indigo-100 text-indigo-800",
    Ready: "bg-green-100 text-green-800",
    Dispatched: "bg-purple-100 text-purple-800",
    Delivered: "bg-gray-100 text-gray-800",
    Delayed: "bg-red-100 text-red-800",
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
};

export default OrderTable;
