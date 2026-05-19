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
// Infrastructure View Configuration
import SystemConfiguration from "../components/ProductConfig/ConfigList";
// Transaction Entry
import OrderEntryForm from "../components/Sales/orders/entry/OrderEntryForm";
// Context & Icons
import { AlertsProvider } from "../components/Sales/alerts/AlertContext";
import {
    Users,
    UserPlus,
    Activity,
    X,
    LayoutGrid,
    ShieldAlert,
    ShoppingBag,
    Settings2
} from "lucide-react";

export default function SalesManagerDashboardPage() {
    // 1. DATA STATE
    const [customers, setCustomers] = useState([
        { id: 1, name: "Alice Johnson", email: "alice@example.com", ordersCount: 12, type: 'Wholesale', agentId: "TK-44" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", ordersCount: 5, type: 'Individual', agentId: "TK-99" },
        { id: 3, name: "Charlie Davis", email: "charlie@example.com", ordersCount: 8, type: 'Wholesale', agentId: "TK-44" },
        { id: 4, name: "Diana Prince", email: "diana@example.com", ordersCount: 15, type: 'Individual', agentId: "TK-44" },
    ]);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeAgent] = useState({ id: "TK-44", name: "Manager Sarah Jenkins" });

    const [activities, setActivities] = useState([
        { id: 101, type: 'orderPlaced', message: 'Bulk Order #8829 received from Alice Johnson', timestamp: '12 mins ago' },
        { id: 102, type: 'customerAdded', message: 'New Wholesale Entity: Wright Industries authorized', timestamp: '2 hours ago' },
    ]);

    const [pendingIssues] = useState([
        { id: 1, orderId: "ORD-99281", customer: "Global Logistics Corp", status: "Declined", reason: "Credit Limit Exceeded", timeStalled: "48h", priority: "high", notes: "Manager override required." },
    ]);

    // 2. NAVIGATION STATE
    const [activePanel, setActivePanel] = useState(null);

    const handleConfigNavigation = (path) => {
        console.log(`Navigating to configuration subpath: ${path}`);
    };

    // 3. LOGIC HANDLERS
    const handleOrderCreated = (orderData) => {
        const newActivity = {
            id: Date.now(),
            type: 'orderPlaced',
            message: `PROTOCOL: Transaction finalized for ${orderData.customer?.name || 'Walk-in'}. Total: ${orderData.currency} ${orderData.total.toLocaleString()}`,
            timestamp: 'Just Now'
        };
        setActivities(prev => [newActivity, ...prev]);
        setActivePanel(null);
    };

    const handleCustomerAdded = (newCustomer) => {
        const customerEntry = { ...newCustomer, id: Date.now(), ordersCount: 0 };
        setCustomers(prev => [...prev, customerEntry]);
        setActivities(prev => [{
            id: Date.now(),
            type: 'customerAdded',
            message: `SYSTEM: New entity "${newCustomer.name}" successfully onboarded.`,
            timestamp: 'Just Now'
        }, ...prev]);
        setActivePanel(null);
    };

    return (
        <AlertsProvider>
            <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row antialiased">

                {/* APP SIDEBAR NAVIGATION RAIL */}
                <aside className="w-full md:w-24 bg-white border-b md:border-b-0 md:border-r border-slate-200/80 px-4 py-6 md:h-screen md:sticky md:top-0 flex flex-row md:flex-col items-center justify-between md:justify-start gap-4 md:gap-6 shrink-0 z-40 shadow-sm">
                    {/* Logo / Brand Marker */}
                    <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-md shadow-indigo-200 text-white font-black text-xl tracking-tighter">
                        S
                    </div>

                    <div className="hidden md:block h-[1px] w-8 bg-slate-200" />

                    {/* Core App Navigation Items */}
                    <nav className="flex flex-row md:flex-col gap-3 md:gap-4 flex-1 items-center justify-center md:justify-start w-full">
                        <PanelTrigger icon={<LayoutGrid size={20} className="stroke-[2.25]" />} label="Dashboard Home" isActive={activePanel === null} onClick={() => setActivePanel(null)} />
                        <PanelTrigger icon={<ShoppingBag size={20} className="stroke-[2.25]" />} label="New Order Entry" isActive={activePanel === 'ordering'} onClick={() => setActivePanel('ordering')} />
                        <PanelTrigger icon={<Users size={20} className="stroke-[2.25]" />} label="Customer Portfolio" isActive={activePanel === 'portfolio'} onClick={() => setActivePanel('portfolio')} />
                        <PanelTrigger icon={<UserPlus size={20} className="stroke-[2.25]" />} label="Entity Accession" isActive={activePanel === 'accession'} onClick={() => setActivePanel('accession')} />
                        <PanelTrigger icon={<ShieldAlert size={20} className="stroke-[2.25]" />} label="Pending Issues" isActive={activePanel === 'issues'} onClick={() => setActivePanel('issues')} />
                        <PanelTrigger icon={<Activity size={20} className="stroke-[2.25]" />} label="Activity Feed" isActive={activePanel === 'activity'} onClick={() => setActivePanel('activity')} />
                    </nav>

                    {/* Infrastructure Setup Option Footer Segment */}
                    <div className="flex md:flex-col items-center gap-4 w-full justify-end md:justify-start">
                        <div className="hidden md:block h-[1px] w-8 bg-slate-200" />
                        <PanelTrigger icon={<Settings2 size={20} className="stroke-[2.25]" />} label="System Configuration" isActive={activePanel === 'configuration'} onClick={() => setActivePanel('configuration')} />
                    </div>
                </aside>

                {/* WORKSPACE FRAME CONTENT CONTROLLER */}
                <div className="flex-1 min-w-0 flex flex-col overflow-x-hidden">
                    <div className="max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 flex-1 flex flex-col">

                        {/* INLINE STATUS HEADER OVERVIEW METRICS SECTION */}
                        <header className="space-y-6 animate-in fade-in slide-in-from-top-3 duration-500">
                            <DashboardHeader agent={activeAgent} />
                            <QuickActionBar onNavigate={(panel) => setActivePanel(panel)} />
                            <KPISection />
                        </header>

                        {/* DYNAMIC CONSOLE SCREEN CONTAINER */}
                        <main className="flex-1 flex flex-col">
                            <div className="w-full flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.04)] overflow-hidden flex flex-col min-h-[650px]">

                                {/* SECTION CONSOLE HEADER BAR */}
                                <div className="px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/60 flex flex-row justify-between items-center gap-4 shrink-0">
                                    <div className="flex items-center gap-3.5">
                                        <div className="h-5 w-1 rounded-full bg-indigo-600" />
                                        <h3 className="font-bold text-[13px] uppercase tracking-[0.18em] text-slate-700">
                                            {activePanel === 'ordering' ? 'Transaction Entry Protocol' :
                                                activePanel === 'portfolio' ? 'Customer Intelligence Portfolio' :
                                                    activePanel === 'accession' ? 'Onboarding Entity Registration' :
                                                        activePanel === 'configuration' ? 'Architecture Setup Control Hub' :
                                                            activePanel === 'issues' ? 'Exceptions & Pending Issues' :
                                                                activePanel === 'activity' ? 'System Live Audit Trail' :
                                                                    'Master Pipeline Operations'}
                                        </h3>
                                    </div>

                                    {activePanel && (
                                        <button
                                            onClick={() => setActivePanel(null)}
                                            className="group flex items-center gap-2 px-3.5 py-1.5 border border-slate-200 bg-white rounded-xl text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                                        >
                                            <X size={14} className="stroke-[2.5]" /> Return
                                        </button>
                                    )}
                                </div>

                                {/* MODULAR VIEW RENDER MATRIX */}
                                <div className="flex-1 w-full relative">
                                    {!activePanel ? (
                                        <div className="p-6 sm:p-8 animate-in fade-in duration-300">
                                            <OrderPipeline />
                                        </div>
                                    ) : (
                                        <div className="h-full w-full animate-in slide-in-from-bottom-2 fade-in duration-300">
                                            {activePanel === 'ordering' && (
                                                <OrderEntryForm
                                                    products={products}
                                                    categories={categories}
                                                    customers={customers}
                                                    agent={activeAgent}
                                                    onCancel={() => setActivePanel(null)}
                                                    onCreateOrder={handleOrderCreated}
                                                />
                                            )}

                                            {activePanel === 'portfolio' && (
                                                <div className="p-6 sm:p-8">
                                                    <CustomerListCard customers={customers} />
                                                </div>
                                            )}

                                            {activePanel === 'accession' && (
                                                <div className="p-6 sm:p-8 bg-slate-50/40 h-full flex items-center justify-center">
                                                    <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                        <CreateCustomerForm
                                                            salesAgentID={activeAgent.id}
                                                            onCancel={() => setActivePanel(null)}
                                                            onSave={handleCustomerAdded}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {activePanel === 'issues' && (
                                                <div className="p-6 sm:p-8">
                                                    <PendingIssuesView issues={pendingIssues} />
                                                </div>
                                            )}

                                            {activePanel === 'activity' && (
                                                <div className="p-6 sm:p-8">
                                                    <ActivityFeed activities={activities} />
                                                </div>
                                            )}

                                            {activePanel === 'configuration' && (
                                                <div className="p-6 sm:p-8 bg-slate-50/20 h-full">
                                                    <SystemConfiguration navigate={handleConfigNavigation} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </main>

                    </div>
                </div>
            </div>
        </AlertsProvider>
    );
}

/**
 * Sidebar Navigation Trigger Component
 */
function PanelTrigger({ icon, label, onClick, isActive }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${isActive
                ? "bg-indigo-50 border border-indigo-200/60 text-indigo-600 shadow-sm"
                : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
        >
            {icon}
            {/* TOOLTIP OVERLAY */}
            <div className="absolute hidden md:block left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50 pointer-events-none shadow-md shadow-slate-900/10">
                {label}
                <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            </div>
        </button>
    );
}