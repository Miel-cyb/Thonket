'use client';

import DashboardHeader from "./components/layout/DashboardHeader";
import QuickActionsBar from "./components/layout/QuickActionsBar";
import KPISection from "./components/analytics/KPISection";
import OrderPipeline from "./components/orders/OrderPipeline";
import CustomerListCard from "./components/customers/CustomerListCard";
import AlertsPanel from "./components/alerts/AlertsPanel";
import ActivityFeed from "./components/activity/ActivityFeed";

export default function SalesDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Quick Actions */}
        <QuickActionsBar />

        {/* KPI Section */}
        <KPISection />

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT (Orders) */}
          <div className="lg:col-span-2">
            <OrderPipeline />
          </div>

          {/* RIGHT (Side Panels) */}
          <div className="space-y-6">
            <AlertsPanel />
            <CustomerListCard />
          </div>

        </div>

        {/* Bottom Section */}
        <ActivityFeed />

      </main>
    </div>
  );
}