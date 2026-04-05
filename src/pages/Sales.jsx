'use client';

import { useState } from "react";
// Layout & Analytics
import DashboardHeader from "../components/Sales/layout/DashboardHeader";
import QuickActionBar from "../components/Sales/layout/QuickActionBar";
import KPISection from "../components/Sales/analytics/KPISection";
// Core Views
import OrderPipeline from "../components/Sales/orders/OrderPipeline";
import CustomerListCard from "../components/Sales/customers/CustomerListCard";
import CreateCustomerForm from "../components/Sales/customers/CreateCustomerForm";
import ActivityFeed from "../components/Sales/activities/ActivityFeed";
import PendingIssuesView from "../components/Sales/issues/PendingIssuesView";
// Transaction Entry
import OrderEntryForm from "../components/Sales/orders/entry/OrderEntryForm";
// Context & Icons
import { AlertsProvider } from "../components/Sales/alerts/AlertContext";
import { Users, UserPlus, Activity, X, LayoutGrid, ShieldAlert, ShoppingBag } from "lucide-react";

export default function SalesDashboardPage() {
  const [customers, setCustomers] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", ordersCount: 12, type: 'Wholesale', agentId: "TK-44" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", ordersCount: 5, type: 'Individual', agentId: "TK-99" },
    { id: 3, name: "Charlie Davis", email: "charlie@example.com", ordersCount: 8, type: 'Wholesale', agentId: "TK-44" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", ordersCount: 15, type: 'Individual', agentId: "TK-44" },
  ]);

  const [activeAgent] = useState({ id: "TK-44", name: "Agent Sarah Jenkins" });

  const [activities, setActivities] = useState([
    { id: 101, type: 'orderPlaced', message: 'Bulk Order #8829 recieved from Alice Johnson', timestamp: '12 mins ago' },
    { id: 102, type: 'customerAdded', message: 'New Wholesale Entity: Wright Industries authorized', timestamp: '2 hours ago' },
  ]);

  const [pendingIssues] = useState([
    { id: 1, orderId: "ORD-99281", customer: "Global Logistics Corp", status: "Declined", reason: "Credit Limit Exceeded", timeStalled: "48h", priority: "high", notes: "Manager override required." },
  ]);

  const [activePanel, setActivePanel] = useState(null);

  const handleOrderCreated = (orderData) => {
    const newActivity = {
      id: Date.now(),
      type: 'orderPlaced',
      message: `PROTOCOL: ${orderData.items.length} units allocated for ${orderData.customer.name} ($${orderData.total.toLocaleString()})`,
      timestamp: 'Just Now'
    };
    setActivities(prev => [newActivity, ...prev]);
    setActivePanel(null);
  };

  return (
    <AlertsProvider>
      <div className="h-screen w-full bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1800px] mx-auto p-6 lg:p-10 space-y-10">

            <header className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
              <DashboardHeader agent={activeAgent} />
              <QuickActionBar onNavigate={(panel) => setActivePanel(panel)} />
              <KPISection />
            </header>

            <div className="flex gap-8 items-start min-h-[850px]">
              {/* SIDEBAR COMMAND RAIL */}
              <nav className="flex flex-col gap-5 py-2 sticky top-10 shrink-0">
                <PanelTrigger icon={<LayoutGrid size={22} />} label="Matrix Home" isActive={activePanel === null} onClick={() => setActivePanel(null)} color="bg-slate-900" />
                <div className="h-[1px] w-full bg-slate-200 my-2" />
                <PanelTrigger icon={<ShoppingBag size={22} />} label="New Order" isActive={activePanel === 'ordering'} onClick={() => setActivePanel('ordering')} color="bg-purple-600" />
                <PanelTrigger icon={<Users size={22} />} label="Portfolio" isActive={activePanel === 'portfolio'} onClick={() => setActivePanel('portfolio')} color="bg-indigo-600" />
                <PanelTrigger icon={<UserPlus size={22} />} label="Accession" isActive={activePanel === 'accession'} onClick={() => setActivePanel('accession')} color="bg-emerald-600" />
                <PanelTrigger icon={<ShieldAlert size={22} />} label="Pending Issues" isActive={activePanel === 'issues'} onClick={() => setActivePanel('issues')} color="bg-red-600" />
                <PanelTrigger icon={<Activity size={22} />} label="Events" isActive={activePanel === 'activity'} onClick={() => setActivePanel('activity')} color="bg-amber-600" />
              </nav>

              {/* MAIN DISPLAY TERMINAL */}
              <main className="flex-1 min-w-0">
                <div className="relative w-full min-h-[800px] bg-white rounded-[3rem] border border-slate-200 shadow-[0_40px_80px_-15px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col transition-all duration-500">

                  {/* DYNAMIC HEADER */}
                  <div className="px-10 py-7 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                      <div className={`h-8 w-2 rounded-full transition-colors duration-500 ${
                        activePanel === 'ordering' ? 'bg-purple-600 animate-pulse' : 
                        activePanel === 'accession' ? 'bg-emerald-600' : 'bg-slate-900'
                      }`} />
                      <div>
                        <h3 className="font-black text-[14px] uppercase tracking-[0.25em] text-slate-800">
                          {activePanel === 'ordering' ? 'Transaction Entry Protocol' :
                            activePanel === 'portfolio' ? 'Customer Intelligence' :
                              activePanel === 'accession' ? 'Onboarding Entity' :
                                'Master Pipeline Matrix'}
                        </h3>
                      </div>
                    </div>
                    {activePanel && (
                      <button
                        onClick={() => setActivePanel(null)}
                        className="group flex items-center gap-3 px-5 py-2.5 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
                      >
                        <X size={16} /> Exit View
                      </button>
                    )}
                  </div>

                  {/* DYNAMIC CONTENT ENGINE */}
                  <div className="flex-1 overflow-y-auto bg-slate-50/50">
                    {!activePanel ? (
                      <div className="animate-in fade-in zoom-in-95 duration-500 h-full">
                        <OrderPipeline />
                      </div>
                    ) : (
                      <div className="h-full animate-in slide-in-from-right-10 fade-in duration-500">
                        {activePanel === 'ordering' && (
                          <div className="p-8 h-full">
                            <OrderEntryForm
                                customers={customers}
                                agent={activeAgent}
                                onCancel={() => setActivePanel(null)}
                                onCreateOrder={handleOrderCreated}
                            />
                          </div>
                        )}
                        
                        {activePanel === 'portfolio' && (
                          <div className="p-8 h-full">
                            <CustomerListCard customers={customers} />
                          </div>
                        )}

                        {/* CORRECTED ACCESSION VIEW */}
                        {activePanel === 'accession' && (
                          <div className="h-full flex items-center justify-center p-4 md:p-12">
                             <CreateCustomerForm 
                                salesAgentID={activeAgent.id}
                                onCancel={() => setActivePanel(null)}
                                onSave={(newCustomer) => {
                                  setCustomers(prev => [...prev, { ...newCustomer, id: Date.now(), ordersCount: 0 }]);
                                  setActivities(prev => [{
                                    id: Date.now(),
                                    type: 'customerAdded',
                                    message: `SYSTEM: New entity "${newCustomer.name}" successfully onboarded.`,
                                    timestamp: 'Just Now'
                                  }, ...prev]);
                                  setActivePanel(null);
                                }} 
                             />
                          </div>
                        )}

                        {activePanel === 'issues' && <div className="p-8"><PendingIssuesView issues={pendingIssues} /></div>}
                        {activePanel === 'activity' && <div className="p-8"><ActivityFeed activities={activities} /></div>}
                      </div>
                    )}
                  </div>
                </div>
              </main>
            </div>
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
        ? `${color} text-white shadow-2xl scale-110`
        : "bg-white border border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600"
        }`}
    >
      {icon}
      <div className="absolute left-full ml-5 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50 pointer-events-none">
        {label}
      </div>
    </button>
  );
}