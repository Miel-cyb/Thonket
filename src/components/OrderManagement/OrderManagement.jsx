"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import allordersData from "@/data/allordersData";

const OrderManagement = () => {
  const [filter, setFilter] = useState("All");
  const [orderManagementData, setOrderManagementData] = useState(allordersData);

  // Automatically flag delays if ETA is past current time
  useEffect(() => {
    const updatedOrders = orderManagementData.map((order) => {
      if (
        order.status === "Ready for Dispatch" &&
        new Date(order.eta) < new Date() &&
        !order.delay
      ) {
        return { ...order, delay: true };
      }
      return order;
    });
    setOrderManagementData(updatedOrders);
  }, [orderManagementData]);

  const filteredOrderManagement =
    filter === "All"
      ? orderManagementData
      : orderManagementData.filter((order) => order.status === filter);

  const counts = {
    pending: orderManagementData.filter((o) => o.status === "Confirmed").length,
    ready: orderManagementData.filter((o) => o.status === "Ready for Dispatch").length,
    dispatched: orderManagementData.filter((o) => o.status === "Dispatched").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Ready for Dispatch":
        return "bg-green-100 text-green-800";
      case "Dispatched":
        return "bg-cyan-100 text-cyan-800";
      case "Packed":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // --- Functions ---
  const confirmOrder = (orderId) => {
    setOrderManagementData((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Confirmed" } : order
      )
    );
  };

  const markReadyForDispatch = (orderId) => {
    setOrderManagementData((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "Ready for Dispatch", delay: false }
          : order
      )
    );
  };

  const toggleDelay = (orderId) => {
    setOrderManagementData((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, delay: !order.delay } : order
      )
    );
  };

  const generatePicklist = () => {
    const picklist = orderManagementData.map((order) => ({
      orderId: order.id,
      items: order.items,
    }));
    console.log("Picklist generated:", picklist);
    alert("Picklist generated! Check console for details.");
  };
  // ---------------------

  return (
    <div className="space-y-6">
      {/* Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.pending}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Ready for Dispatch</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.ready}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Dispatched Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.dispatched}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3">
        <Button
          variant={filter === "All" ? "default" : "outline"}
          onClick={() => setFilter("All")}
        >
          All
        </Button>
        <Button
          variant={filter === "Confirmed" ? "default" : "outline"}
          onClick={() => setFilter("Confirmed")}
        >
          Pending
        </Button>
        <Button
          variant={filter === "Ready for Dispatch" ? "default" : "outline"}
          onClick={() => setFilter("Ready for Dispatch")}
        >
          Ready for Dispatch
        </Button>
        <Button
          variant={filter === "Dispatched" ? "default" : "outline"}
          onClick={() => setFilter("Dispatched")}
        >
          Dispatched
        </Button>

        <Button variant="secondary" onClick={generatePicklist}>
          Generate Picklist
        </Button>
      </div>

      {/* OrderManagement Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Items</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Driver</th>
              <th className="px-4 py-2 text-left">Notes</th>
              <th className="px-4 py-2 text-left">ETA</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrderManagement.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.customer}</td>
                <td className="px-4 py-2">
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.qty}x {item.name}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}{" "}
                    {order.status === "Ready for Dispatch" && order.delay && "⚠️ Delay"}
                  </Badge>
                </td>
                <td className="px-4 py-2">{order.assignedDriver}</td>
                <td className="px-4 py-2">{order.notes}</td>
                <td className="px-4 py-2">{order.eta}</td>
                <td className="px-4 py-2 flex gap-2">
                  {order.status === "Pending" && (
                    <Button size="sm" onClick={() => confirmOrder(order.id)}>
                      Confirm
                    </Button>
                  )}
                  {order.status === "Confirmed" && (
                    <Button size="sm" onClick={() => markReadyForDispatch(order.id)}>
                      Mark Ready
                    </Button>
                  )}
                  {order.status === "Ready for Dispatch" && (
                    <Button
                      size="sm"
                      variant={order.delay ? "destructive" : "outline"}
                      onClick={() => toggleDelay(order.id)}
                    >
                      {order.delay ? "Clear Delay" : "Flag Delay"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
