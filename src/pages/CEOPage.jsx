// pages/CEODashboard.jsx
import Alerts from "@/components/OperationsDashboard/Alerts";
import Customers from "@/components/Analytics/Customers";
import Forecasting from "@/components/Analytics/ForecastingPerformance";
import Insights from "@/components/Analytics/Insights";
import DeliveryLogistics from "@/components/Analytics/Inventory";
import OperationalPerformance from "@/components/Analytics/OperationalPerformance";
import OrdersSales from "@/components/Analytics/OrderAndSales";
import RevenueProfit from "@/components/Analytics/Profitability";
import WarehouseInventory from "@/components/Analytics/Warehouse";
import React, { useState } from "react";

const CEODashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">CEO Dashboard</h1>
            </div>

            {/* Tabs Navigation */}
            <div className="flex space-x-4 mb-6 border-b border-gray-300">
                <button
                    className={`pb-2 font-semibold ${activeTab === "overview" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
                        }`}
                    onClick={() => setActiveTab("overview")}
                >
                    Overview
                </button>
                <button
                    className={`pb-2 font-semibold ${activeTab === "operations" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
                        }`}
                    onClick={() => setActiveTab("operations")}
                >
                    Operations
                </button>
                <button
                    className={`pb-2 font-semibold ${activeTab === "forecasting" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
                        }`}
                    onClick={() => setActiveTab("forecasting")}
                >
                    Forecasting
                </button>
                <button
                    className={`pb-2 font-semibold ${activeTab === "insights" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
                        }`}
                    onClick={() => setActiveTab("insights")}
                >
                    Insights
                </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
                {activeTab === "overview" && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <OrdersSales />
                            <Customers />
                        </div>
                        <RevenueProfit />
                    </>
                )}

                {activeTab === "operations" && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DeliveryLogistics />
                            <WarehouseInventory />
                        </div>
                        <OperationalPerformance />
                    </>
                )}

                {activeTab === "forecasting" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Forecasting />
                        <Alerts />
                    </div>
                )}

                {activeTab === "insights" && <Insights />}
            </div>
        </div>
    );
};

export default CEODashboard;
