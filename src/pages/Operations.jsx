import React, { useState, useEffect } from 'react';
import OrderApproval from '@/components/OperationsDashboard/OrderApproval';

const OperationsPage = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("approval");

  useEffect(() => {
    // Fetch orders from the mock API via the Vite proxy
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleApproveOrder = async (orderId) => {
    try {
      const orderToApprove = orders.find((order) => order.orderId === orderId);
      if (orderToApprove) {
        // Send the approved order to the warehouse via the Vite proxy
        await fetch('/api/warehouse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderToApprove),
        });

        // Remove the approved order from the list
        setOrders(orders.filter((order) => order.orderId !== orderId));
        console.log(`Order ${orderId} approved and sent to warehouse.`);
      }
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Operations Dashboard</h1>
        
        <div className="flex space-x-4 mb-6 border-b border-gray-300">
          <button
              className={`pb-2 font-semibold ${activeTab === "approval" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`}
              onClick={() => setActiveTab("approval")}
          >
              Order Approval
          </button>
          <button
              className={`pb-2 font-semibold ${activeTab === "tracking" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`}
              onClick={() => setActiveTab("tracking")}
          >
              Driver Tracking
          </button>
          <button
              className={`pb-2 font-semibold ${activeTab === "alerts" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`}
              onClick={() => setActiveTab("alerts")}
          >
              Alerts
          </button>
        </div>

        {activeTab === "approval" && <OrderApproval initialOrders={orders} onApproveOrder={handleApproveOrder} />}

      </div>
    </div>
  );
};

export default OperationsPage;
