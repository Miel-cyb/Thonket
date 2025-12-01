import { useState, useEffect } from "react";
import { ordersData as initialOrders } from "@/data/ordersData";

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Approved":
      return "bg-blue-100 text-blue-800";
    case "Ready to Ship":
      return "bg-cyan-100 text-cyan-800";
    case "Shipped":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "HIGH":
      // brighter red + faster pulse
      return "bg-red-500 text-white animate-pulse"; 
    case "MEDIUM":
      return "bg-orange-500 text-white";
    case "LOW":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-300 text-gray-800";
  }
};


// Generate random priority (simulate changes)
const randomPriority = () => {
  const priorities = ["HIGH", "MEDIUM", "LOW"];
  return priorities[Math.floor(Math.random() * priorities.length)];
};

// Countdown timer
const getCountdown = (createdAt) => {
  const deliveryTime = new Date(createdAt).getTime() + 48 * 60 * 60 * 1000; // 48 hrs
  const now = Date.now();
  const diff = deliveryTime - now;
  if (diff <= 0) return "Overdue";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
};

const OrdersTable = ({ onApprove }) => {
  const [orders, setOrders] = useState(initialOrders);
  const [tick, setTick] = useState(0); // force re-render

  // Countdown timer updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Refresh priority every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => ({
          ...order,
          priority: randomPriority(),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">Order ID</th>
            <th className="px-4 py-3 text-left">Customer</th>
            <th className="px-4 py-3 text-left">Items</th>
            <th className="px-4 py-3 text-left">Quantity</th>
            <th className="px-4 py-3 text-left">Total Price</th>
            <th className="px-4 py-3 text-left">Profit</th>
            <th className="px-4 py-3 text-left">Priority</th>
            <th className="px-4 py-3 text-left">Assigned Driver</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Estimated Delivery</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-semibold">{order.orderId}</td>
              <td className="px-4 py-3">{order.customer}</td>
              <td className="px-4 py-3">{order.items}</td>
              <td className="px-4 py-3">{order.quantity}</td>
              <td className="px-4 py-3 font-bold">
                ₵ {order.totalPrice.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-green-700 font-medium">
                ₵ {order.profit.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${getPriorityStyle(
                    order.priority
                  )}`}
                >
                  {order.priority}
                </span>
              </td>
              <td className="px-4 py-3">{order.driver || "Unassigned"}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3">{getCountdown(order.createdAt)}</td>
              <td className="px-4 py-3 space-y-1">
                {order.status === "Pending" && (
                  <button 
                    onClick={() => onApprove(order)}
                    className="py-1 px-3 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700 text-xs"
                  >
                    Approve
                  </button>
                )}
                {order.status === "Approved" && (
                  <button 
                    disabled
                    className="py-1 px-3 rounded-md font-semibold border border-gray-300 bg-white text-gray-700 text-xs cursor-not-allowed opacity-50"
                  >
                    Ready
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
