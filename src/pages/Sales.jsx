'use client';

import { useState } from "react";
import DashboardHeader from "../components/Sales/layout/DashboardHeader";
import QuickActionBar from "../components/Sales/layout/QuickActionBar";
import KPISection from "../components/Sales/analytics/KPISection";
import OrderPipeline from "../components/Sales/orders/OrderPipeline";
import CustomerListCard from "../components/Sales/customers/CustomerListCard";
import CreateCustomerForm from "../components/Sales/customers/CreateCustomerForm";
import ActivityFeed from "../components/Sales/activities/ActivityFeed";
import { AlertsProvider } from "../components/Sales/alerts/AlertContext";
import { Users, UserPlus, Activity, X, LayoutGrid } from "lucide-react";

export default function SalesDashboardPage() {
  const [customers, setCustomers] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", ordersCount: 12, type: 'Wholesale' },
    { id: 2, name: "Bob Smith", email: "bob@example.com", ordersCount: 5, type: 'Individual' },
    { id: 3, name: "Charlie Davis", email: "charlie@example.com", ordersCount: 8, type: 'Wholesale' },
    { id: 4, name: "Diana Prince", email: "diana@example.com", ordersCount: 15, type: 'Individual' },
    { id: 5, name: "Evan Wright", email: "evan@example.com", ordersCount: 3, type: 'Wholesale' },
    { id: 6, name: "Fiona Gale", email: "fiona@example.com", ordersCount: 9, type: 'Individual' },
  ]);

  // Activity Feed Data State
  const [activities, setActivities] = useState([
    { id: 101, type: 'orderPlaced', message: 'Bulk Order #8829 recieved from Alice Johnson', timestamp: '12 mins ago' },
    { id: 102, type: 'customerAdded', message: 'New Wholesale Entity: Wright Industries authorized', timestamp: '2 hours ago' },
    { id: 103, type: 'orderIssue', message: 'Payment mismatch on Order #8821', timestamp: '4 hours ago' },
    { id: 104, type: 'orderApproved', message: 'Charlie Davis order cleared for shipping', timestamp: 'Yesterday' },
  ]);

  const [activePanel, setActivePanel] = useState(null);

  const handleCustomerCreated = (newCustomer) => {
    const customerId = Date.now();

    // 1. Update Customer List
    setCustomers((prev) => [...prev, { ...newCustomer, id: customerId, ordersCount: 0 }]);

    // 2. Log Activity
    const newLog = {
      id: customerId + 1,
      type: 'customerAdded',
      message: `Protocol: ${newCustomer.type} Accession - ${newCustomer.entityName || newCustomer.contactName} authorized`,
      timestamp: 'Just Now'
    };
    setActivities(prev => [newLog, ...prev]);
  };

  return (
    <AlertsProvider>
      <div className="h-screen w-full bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden flex flex-col">

        {/* Main Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1800px] mx-auto p-6 lg:p-10 space-y-10">

            {/* 1. Global Header & KPIs */}
            <header className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
              <DashboardHeader />
              <QuickActionBar />
              <KPISection />
            </header>

            {/* 2. DYNAMIC WORKSPACE MATRIX */}
            <div className="flex gap-8 items-start min-h-[850px]">

              {/* COMPACT COMMAND RAIL */}
              <nav className="flex flex-col gap-5 py-2 sticky top-10">
                <PanelTrigger
                  icon={<LayoutGrid size={22} />}
                  label="Matrix Home"
                  isActive={activePanel === null}
                  onClick={() => setActivePanel(null)}
                  color="bg-slate-900"
                />
                <div className="h-[1px] w-full bg-slate-200 my-2" />
                <PanelTrigger
                  icon={<Users size={22} />}
                  label="Portfolio"
                  isActive={activePanel === 'portfolio'}
                  onClick={() => setActivePanel('portfolio')}
                  color="bg-indigo-600"
                />
                <PanelTrigger
                  icon={<UserPlus size={22} />}
                  label="Accession"
                  isActive={activePanel === 'accession'}
                  onClick={() => setActivePanel('accession')}
                  color="bg-emerald-600"
                />
                <PanelTrigger
                  icon={<Activity size={22} />}
                  label="Events"
                  isActive={activePanel === 'activity'}
                  onClick={() => setActivePanel('activity')}
                  color="bg-amber-600"
                />
              </nav>

              {/* MAIN CONTENT STACK */}
              <main className="flex-1 min-w-0">
                <div className="relative w-full min-h-[800px] bg-white rounded-[3rem] border border-slate-200 shadow-[0_40px_80px_-15px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col">

                  {/* DYNAMIC HEADER */}
                  <div className="px-10 py-7 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`h-8 w-2 rounded-full transition-colors duration-500 ${activePanel === 'portfolio' ? 'bg-indigo-600' :
                          activePanel === 'accession' ? 'bg-emerald-600' :
                            activePanel === 'activity' ? 'bg-amber-600' : 'bg-slate-900'
                        }`} />
                      <div>
                        <h3 className="font-black text-[14px] uppercase tracking-[0.25em] text-slate-800">
                          {activePanel ? `${activePanel} Protocol` : 'Master Pipeline Matrix'}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          System Status: Optimal • Encrypted Session
                        </p>
                      </div>
                    </div>

                    {activePanel && (
                      <button
                        onClick={() => setActivePanel(null)}
                        className="group flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all"
                      >
                        <X size={16} className="group-hover:rotate-90 transition-transform" />
                        Close View
                      </button>
                    )}
                  </div>

                  {/* DATA LAYER */}
                  <div className="flex-1 overflow-y-auto bg-white">
                    {!activePanel ? (
                      <div className="animate-in fade-in zoom-in-95 duration-500 h-full">
                        <OrderPipeline />
                      </div>
                    ) : (
                      <div className="animate-in slide-in-from-right-10 fade-in duration-500 p-10 flex flex-col items-start justify-start">
                        <div className="w-full">
                          {activePanel === 'portfolio' && <CustomerListCard customers={customers} />}
                          {activePanel === 'accession' && <CreateCustomerForm onCustomerCreated={handleCustomerCreated} />}
                          {activePanel === 'activity' && (
                            <div className="max-w-4xl">
                              <ActivityFeed activities={activities} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </main>
            </div>

            {/* 3. Global Footer */}
            <footer className="pt-10 pb-6 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100 text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
              <div className="flex items-center gap-8">
                <span className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  Terminal: TK-AGENT-44
                </span>
                <span className="hidden md:block h-4 w-[1px] bg-slate-200" />
                <span className="text-slate-300">v4.0.12-STABLE</span>
              </div>
              <div className="flex gap-10">
                <button className="hover:text-indigo-600 transition-colors">Audit Logs</button>
                <button className="hover:text-indigo-600 transition-colors">Network Security</button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </AlertsProvider>
  );
}

function PanelTrigger({ icon, label, onClick, color, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center justify-center w-16 h-16 rounded-[1.5rem] transition-all duration-500 ${isActive
        ? `${color} text-white shadow-2xl shadow-current ring-4 ring-white`
        : "bg-white border border-slate-200 text-slate-400 hover:border-indigo-300 hover:scale-105"
        }`}
    >
      <div className="z-10 group-hover:scale-110 transition-transform">{icon}</div>

      <div className="absolute left-full ml-5 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-15px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl">
        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[6px] border-r-slate-900" />
        {label}
      </div>

      {isActive && (
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-slate-900 rounded-full animate-in fade-in slide-in-from-left-2" />
      )}
    </button>
  );
}