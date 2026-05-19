'use client';

import React, { useMemo, useState } from "react";
import {
    ShieldCheck,
    Users,
    AlertTriangle,
    FileText,
    RefreshCcw,
    ChevronRight,
    Info,
    CreditCard,
    CheckCircle2,
    Clock,
    Settings,
    Sliders,
    Globe,
    Lock,
    Scale,
    Zap,
    BarChart3,
    Search,
    LayoutDashboard,
    Layers,
    Box,
    Plus,
    Tag
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

// --- Components ---
import FinanceHeader from "../components/Finance/Layout/FinanaceHeader";
import FinanceStatsGrid from "../components/Finance/Layout/FinanceStatsGrid";
import FinanceOrderQueue from "../components/Finance/orders/FinanaceOrderQueue";
import FinanceDecisionModal from "../components/Finance/orders/FinanceDecisionModal";
import EscalationQueue from "../components/Finance/escalation/EscalationQueue";
import OpsHandoffDrawer from "../components/Finance/escalation/OpsHandOffDrawer";
import CustomerCreditProfile from "../components/Finance/customers/CustomerCreditProfile";
import CreditScoreEnginePanel from "../components/Finance/risk/CreditScoreEnginePanel";

// 🧪 MOCK DATA
const MOCK_ORDERS = [
    { _id: "ORD-001", customerName: "Akosua Foods Ltd", paymentType: "CREDIT", totalAmount: 12500, stage: "pending", risk: "high", creditScore: 42, customer: { name: "Akosua Foods Ltd", creditLimit: 20000, usedCredit: 15000, riskScore: 42 } },
    { _id: "ORD-002", customerName: "Tema Retail Hub", paymentType: "CASH", totalAmount: 3200, stage: "pending", risk: "low", creditScore: 88, customer: { name: "Tema Retail Hub", creditLimit: 10000, usedCredit: 2000, riskScore: 88 } },
    { _id: "ORD-003", customerName: "Accra Wholesale Mart", paymentType: "CREDIT", totalAmount: 8900, stage: "delivery", risk: "medium", creditScore: 65, customer: { name: "Accra Wholesale Mart", creditLimit: 15000, usedCredit: 9000, riskScore: 65 } },
    { _id: "ORD-004", customerName: "Makola Traders Union", paymentType: "CREDIT", totalAmount: 22000, stage: "pending_ops_review", risk: "high", creditScore: 35, escalationReason: "Finance unsure about credit exposure", customer: { name: "Makola Traders Union", creditLimit: 50000, usedCredit: 41000, riskScore: 35 } }
];

// --- Sub-Components (Operations Style) ---

const ConfigTile = ({ title, description, icon: Icon, onClick, badge }) => (
    <button
        onClick={onClick}
        className="group bg-white p-6 rounded-[28px] border border-slate-200 text-left hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden"
    >
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <Icon size={24} />
        </div>
        <div className="flex justify-between items-start mb-1">
            <h4 className="text-[15px] font-bold text-slate-900">{title}</h4>
            {badge && <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg uppercase tracking-wider">{badge}</span>}
        </div>
        <p className="text-[13px] font-medium text-slate-500 leading-relaxed mb-4">{description}</p>
        <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 uppercase tracking-widest">
            Manage Module <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
        </div>
    </button>
);

export default function FinanceDashboardPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [opsOrder, setOpsOrder] = useState(null);
    const [view, setView] = useState("execution"); // execution, analytics, configuration
    const [activeStage, setActiveStage] = useState("pending");
    const [searchQuery, setSearchQuery] = useState("");

    // -----------------------------
    // DERIVED DATA
    // -----------------------------
    const filteredOrders = useMemo(() => orders.filter(o => (o.stage || "pending") === activeStage), [orders, activeStage]);
    const escalatedOrders = useMemo(() => orders.filter(o => o.stage === "pending_ops_review"), [orders]);
    const selectedCustomer = selectedOrder?.customer || null;

    const counts = useMemo(() => {
        const map = { pending: 0, approved: 0, delivery: 0, completed: 0, pending_ops_review: 0 };
        orders.forEach(o => {
            const key = o.stage || 'pending';
            if (map[key] !== undefined) map[key]++;
        });
        return map;
    }, [orders]);

    const updateOrderStatus = (orderId, newStage) => {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, stage: newStage } : o));
        setSelectedOrder(null);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-indigo-100">
            <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">

                {/* TOP NAVIGATION & VIEW SWITCHER (Operations Style) */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/50 backdrop-blur-md p-6 rounded-[32px] border border-white shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 uppercase tracking-widest">
                            <LayoutDashboard size={14} />
                            <span>Finance Controller</span>
                            <ChevronRight size={12} className="text-slate-300" />
                            <span className="text-slate-400">{view}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight capitalize">{view}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center shadow-inner">
                            {[
                                { id: 'execution', icon: Zap, label: 'Execution' },
                                { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                                { id: 'configuration', icon: Settings, label: 'Config' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setView(item.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${view === item.id
                                        ? 'bg-white text-slate-900 shadow-md scale-[1.02]'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <item.icon size={15} strokeWidth={view === item.id ? 2.5 : 2} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setOrders([...MOCK_ORDERS])} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm">
                            <RefreshCcw size={18} />
                        </button>
                    </div>
                </div>

                {/* VIEW CONDITIONAL RENDERING */}

                {/* --- EXECUTION VIEW --- */}
                {view === "execution" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <FinanceStatsGrid orders={orders} />

                        {/* STAGE SELECTOR (Operations Style) */}
                        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 p-2.5 flex overflow-x-auto gap-2 no-scrollbar">
                            {[
                                { id: "pending", label: "Review Required", icon: Clock },
                                { id: "approved", label: "Approved", icon: CheckCircle2 },
                                { id: "delivery", label: "In Delivery", icon: Globe },
                                { id: "completed", label: "Settled", icon: CreditCard },
                                { id: "pending_ops_review", label: "With Ops", icon: AlertTriangle }
                            ].map(stage => (
                                <button
                                    key={stage.id}
                                    onClick={() => setActiveStage(stage.id)}
                                    className={`flex-1 min-w-[180px] p-5 rounded-[22px] transition-all border ${activeStage === stage.id
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl'
                                        : 'border-transparent hover:bg-slate-50 text-slate-500'
                                        }`}
                                >
                                    <div className="flex flex-col gap-1 text-left">
                                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${activeStage === stage.id ? 'text-indigo-400' : 'text-slate-400'}`}>
                                            {stage.label}
                                        </span>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold tabular-nums">{counts[stage.id] || 0}</span>
                                            <stage.icon size={16} className={activeStage === stage.id ? "text-indigo-400" : "text-slate-300"} />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 xl:col-span-9">
                                {activeStage === "pending_ops_review" ? (
                                    <EscalationQueue orders={escalatedOrders} onSelect={setOpsOrder} />
                                ) : (
                                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                                        <FinanceOrderQueue orders={filteredOrders} onSelectOrder={setSelectedOrder} />
                                    </div>
                                )}
                            </div>

                            <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
                                {selectedCustomer ? (
                                    <div className="sticky top-8 animate-in slide-in-from-top-4 duration-300">
                                        <div className="mb-2 flex items-center justify-between px-2">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Customer Context</span>
                                            <button onClick={() => setSelectedOrder(null)} className="text-xs text-indigo-600 font-bold hover:underline">CLOSE</button>
                                        </div>
                                        <CustomerCreditProfile customer={selectedCustomer} />
                                    </div>
                                ) : (
                                    <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-4 text-indigo-300">
                                                <ShieldCheck size={18} />
                                                <h3 className="font-bold text-xs uppercase tracking-widest">Audit Ready</h3>
                                            </div>
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                Select an order to verify <span className="text-white font-semibold">KYC documents</span> and credit history.
                                            </p>
                                        </div>
                                        <div className="absolute -bottom-4 -right-4 opacity-10">
                                            <ShieldCheck size={120} />
                                        </div>
                                    </div>
                                )}
                            </aside>
                        </div>
                    </div>
                )}

                {/* --- ANALYTICS VIEW --- */}
                {view === "analytics" && (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Credit Score Engine</h2>
                                    <p className="text-sm font-medium text-slate-500">Real-time risk assessment across the portfolio</p>
                                </div>
                                <ShieldCheck className="text-indigo-600" size={32} />
                            </div>
                            <CreditScoreEnginePanel score={78} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {orders.slice(0, 4).map(o => (
                                <CustomerCreditProfile key={o._id} customer={o.customer} />
                            ))}
                        </div>
                    </div>
                )}

                {/* --- CONFIGURATION VIEW --- */}
                {view === "configuration" && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Infrastructure</h2>
                                <p className="text-[14px] font-medium text-slate-500">Manage global finance parameters and product architecture</p>
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                <input
                                    placeholder="Search parameters..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-3.5 text-sm w-full md:w-80 shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* FINANCE & PRODUCT CONFIGURATION GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Product Architecture Elements */}
                            <ConfigTile
                                title="Category Architecture"
                                description="Define the global taxonomy and parent-child relationships for all products."
                                icon={Layers}
                                onClick={() => navigate('/products/categories')}
                            />
                            <ConfigTile
                                title="Master Product List"
                                description="Central repository for base SKU data, localized descriptions, and media."
                                icon={Box}
                                onClick={() => navigate('/products/list')}
                            />
                            <ConfigTile
                                title="Variant Matrix"
                                description="Manage dynamic attributes like weight-based pricing, size, and color variants."
                                icon={Plus}
                                onClick={() => navigate('/products/variants')}
                            />
                            <ConfigTile
                                title="Price Optimization"
                                description="Configure wholesale tiers, regional tax rules, and dynamic base prices."
                                icon={Tag}
                                onClick={() => navigate('/products/pricing')}
                            />

                            {/* Core Finance Parameters */}
                            <ConfigTile
                                title="Credit Thresholds"
                                description="Adjust global credit limits and auto-hold triggers for high-risk accounts."
                                icon={Sliders}
                                onClick={() => navigate('/finance/config/credit')}
                                badge="Global"
                            />
                            <ConfigTile
                                title="Approval Workflows"
                                description="Define hierarchy for manual overrides on credit blocked orders."
                                icon={Lock}
                                onClick={() => navigate('/finance/config/workflows')}
                                badge="Secure"
                            />
                            <ConfigTile
                                title="Currency Rates"
                                description="Real-time exchange rate configurations for multi-country billing."
                                icon={Globe}
                                onClick={() => navigate('/finance/config/currency')}
                            />
                            <ConfigTile
                                title="Payment Terms"
                                description="Configure Net-15, Net-30, and early settlement discount rules."
                                icon={CreditCard}
                                onClick={() => navigate('/finance/config/terms')}
                            />
                            <ConfigTile
                                title="Tax Jurisdictions"
                                description="Manage VAT rates and automated tax compliance reporting per region."
                                icon={Scale}
                                onClick={() => navigate('/finance/config/tax')}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* OVERLAYS */}
            <FinanceDecisionModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onApprove={(order) => updateOrderStatus(order._id, "approved")}
                onReject={(order) => updateOrderStatus(order._id, "rejected")}
                onForward={(order) => updateOrderStatus(order._id, "pending_ops_review")}
            />
            <OpsHandoffDrawer order={opsOrder} onClose={() => setOpsOrder(null)} />
        </div>
    );
}