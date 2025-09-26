// components/dashboard/Dashboard.jsx
import { useState } from "react";
import KpiCards from "./KPIsCards";
import FulfillmentChart from "./FulfillmentChart";
import InventorySnapshot from "./InventorySnapshot";
import AwaitingPickup from "./Awaitingpickup";
import Navbar from "../Navbar";


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("pickup");

  return (
    
    <div>
 
        <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Warehouse Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">
        Real-time overview of inventory, orders, and fulfillment performance.
      </p>

      {/* KPIs */}
      <KpiCards />

      {/* Chart + Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <FulfillmentChart />
        </div>

        {/* Right Side Tabs */}
        <div>
          <div className="flex border-b mb-4">
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === "pickup"
                  ? "border-b-2 border-cyan-900 text-cyan-900"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("pickup")}
            >
              Awaiting Pickup
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === "inventory"
                  ? "border-b-2 border-cyan-900 text-cyan-900"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("inventory")}
            >
              Inventory Levels
            </button>
          </div>

          {activeTab === "pickup" ? <AwaitingPickup /> : <InventorySnapshot/>}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
