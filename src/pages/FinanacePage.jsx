'use client';

import React, { useMemo, useState } from "react";

import FinanceHeader from "../components/Finance/Layout/FinanaceHeader";
import FinanceStatsGrid from "../components/Finance/Layout/FinanceStatsGrid";

import FinanceOrderQueue from "../components/Finance/orders/FinanceOrderQueue";
import FinanceDecisionModal from "../components/Finance/orders/FinanceDecisionModal";

import EscalationQueue from "../components/Finance/escalation/EscalationQueue";
import OpsHandoffDrawer from "../components/Finance/escalation/OpsHandOffDrawer";

import CustomerCreditProfile from "../components/Finance/customers/CustomerCreditProfile";
import CreditScoreEnginePanel from "../components/Finance/risk/CreditScoreEnginePanel";

// --------------------------------------------------
// 🧪 DUMMY DATA (SIMULATES REAL ERP SYSTEM)
// --------------------------------------------------
const MOCK_ORDERS = [
    {
        _id: "ORD-001",
        customerName: "Akosua Foods Ltd",
        paymentType: "CREDIT",
        totalAmount: 12500,
        stage: "pending",
        risk: "high",
        creditScore: 42,
        customer: {
            name: "Akosua Foods Ltd",
            creditLimit: 20000,
            usedCredit: 15000,
            riskScore: 42,
        }
    },
    {
        _id: "ORD-002",
        customerName: "Tema Retail Hub",
        paymentType: "CASH",
        totalAmount: 3200,
        stage: "pending",
        risk: "low",
        creditScore: 88,
        customer: {
            name: "Tema Retail Hub",
            creditLimit: 10000,
            usedCredit: 2000,
            riskScore: 88,
        }
    },
    {
        _id: "ORD-003",
        customerName: "Accra Wholesale Mart",
        paymentType: "CREDIT",
        totalAmount: 8900,
        stage: "delivery",
        risk: "medium",
        creditScore: 65,
        customer: {
            name: "Accra Wholesale Mart",
            creditLimit: 15000,
            usedCredit: 9000,
            riskScore: 65,
        }
    },
    {
        _id: "ORD-004",
        customerName: "Makola Traders Union",
        paymentType: "CREDIT",
        totalAmount: 22000,
        stage: "pending_ops_review",
        risk: "high",
        creditScore: 35,
        escalationReason: "Finance unsure about credit exposure",
        customer: {
            name: "Makola Traders Union",
            creditLimit: 50000,
            usedCredit: 41000,
            riskScore: 35,
        }
    }
];

// --------------------------------------------------

export default function FinanceDashboardPage() {
    const [orders, setOrders] = useState(MOCK_ORDERS);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [opsOrder, setOpsOrder] = useState(null);

    const [view, setView] = useState("orders");
    const [activeTab, setActiveTab] = useState("pending");

    // -----------------------------
    // DERIVED DATA
    // -----------------------------
    const filteredOrders = useMemo(() => {
        return orders.filter(o => (o.stage || "pending") === activeTab);
    }, [orders, activeTab]);

    const escalatedOrders = useMemo(() => {
        return orders.filter(o => o.stage === "pending_ops_review");
    }, [orders]);

    const selectedCustomer = selectedOrder?.customer || null;

    // -----------------------------
    // FINANCE ACTIONS (LOCAL STATE SIMULATION)
    // -----------------------------
    const approveOrder = (order) => {
        setOrders(prev =>
            prev.map(o =>
                o._id === order._id ? { ...o, stage: "approved" } : o
            )
        );
        setSelectedOrder(null);
    };

    const rejectOrder = (order) => {
        setOrders(prev =>
            prev.map(o =>
                o._id === order._id ? { ...o, stage: "rejected" } : o
            )
        );
        setSelectedOrder(null);
    };

    const forwardToOps = (order) => {
        setOrders(prev =>
            prev.map(o =>
                o._id === order._id
                    ? { ...o, stage: "pending_ops_review" }
                    : o
            )
        );
        setSelectedOrder(null);
    };

    // -----------------------------
    // TABS
    // -----------------------------
    const Tabs = () => (
        <div className="flex gap-2 bg-white p-2 rounded-2xl border">
            {["orders", "customers", "risk", "escalations"].map(tab => (
                <button
                    key={tab}
                    onClick={() => setView(tab)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${view === tab
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:bg-slate-100"
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );

    // -----------------------------
    // RENDER
    // -----------------------------
    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 space-y-6">

            {/* HEADER */}
            <FinanceHeader
                view={view}
                onRefresh={() => setOrders([...MOCK_ORDERS])}
                loading={false}
            />

            {/* STATS */}
            <FinanceStatsGrid orders={orders} />

            {/* TABS */}
            <Tabs />

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* LEFT */}
                <div className="lg:col-span-3 space-y-4">

                    {/* ORDERS */}
                    {view === "orders" && (
                        <>
                            <div className="flex gap-2 overflow-x-auto">
                                {["pending", "approved", "delivery", "completed", "pending_ops_review"].map(stage => (
                                    <button
                                        key={stage}
                                        onClick={() => setActiveTab(stage)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap ${activeTab === stage
                                            ? "bg-slate-900 text-white"
                                            : "bg-white border"
                                            }`}
                                    >
                                        {stage}
                                    </button>
                                ))}
                            </div>

                            <FinanceOrderQueue
                                orders={filteredOrders}
                                onSelectOrder={setSelectedOrder}
                            />
                        </>
                    )}

                    {/* CUSTOMERS */}
                    {view === "customers" && (
                        <div className="bg-white rounded-3xl p-6 border space-y-4">
                            <h2 className="font-bold text-lg">Customer Credit Profiles</h2>

                            {orders.map(o => (
                                <CustomerCreditProfile
                                    key={o._id}
                                    customer={o.customer}
                                />
                            ))}
                        </div>
                    )}

                    {/* RISK */}
                    {view === "risk" && (
                        <div className="space-y-4">
                            <CreditScoreEnginePanel score={78} />
                        </div>
                    )}

                    {/* ESCALATIONS */}
                    {view === "escalations" && (
                        <EscalationQueue
                            orders={escalatedOrders}
                            onSelect={setOpsOrder}
                        />
                    )}

                </div>

                {/* RIGHT PANEL */}
                <div className="space-y-4">

                    <div className="bg-white rounded-3xl border p-5">
                        <h3 className="font-bold text-sm mb-2">
                            Finance Control Insight
                        </h3>

                        <p className="text-xs text-slate-500 leading-relaxed">
                            Orders are evaluated through credit scoring before reaching operations.
                            Finance can approve, reject, or escalate uncertain cases to Ops Manager.
                        </p>
                    </div>

                    {selectedCustomer && (
                        <CustomerCreditProfile customer={selectedCustomer} />
                    )}

                </div>
            </div>

            {/* MODALS */}
            <FinanceDecisionModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onApprove={approveOrder}
                onReject={rejectOrder}
                onForward={forwardToOps}
            />

            <OpsHandoffDrawer
                order={opsOrder}
                onClose={() => setOpsOrder(null)}
            />

        </div>
    );
}