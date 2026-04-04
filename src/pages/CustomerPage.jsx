import { useEffect, useState, useMemo } from "react";
import CustomersHeader from "../components/customer/CustomerHead";
import CustomersStats from "../components/customer/CustomerStats";
import CustomersTable from "../components/customer/CustomerTable";
import { Download, PlusCircle, Users } from "lucide-react";

const mockCustomers = [
    {
        id: 1,
        name: "ABC Trading Ltd",
        type: "business",
        branches: [
            { id: 101, name: "Downtown Branch", creditUsed: 2000, profit: 1500 },
            { id: 102, name: "Airport Hub", creditUsed: 3000, profit: 2500 },
        ],
        totalCreditLimit: 15000,
        totalPurchases: 45000,
        overallProfit: 8000,
        risk: "low",
        status: "active",
        lastActivity: "2026-04-02",
    },
    {
        id: 2,
        name: "Retail Express",
        type: "business",
        branches: [{ id: 103, name: "Main St", creditUsed: 8500, profit: 400 }],
        totalCreditLimit: 10000,
        totalPurchases: 12000,
        overallProfit: 1200,
        risk: "high",
        status: "overdue",
        lastActivity: "2026-03-15",
    }
];

export default function CustomersPage() {
    const [customers, setCustomers] = useState(mockCustomers);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const filteredCustomers = useMemo(() => {
        return customers.filter((c) => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = filter === "all" || c.risk === filter || c.type === filter;
            return matchesSearch && matchesFilter;
        });
    }, [search, filter, customers]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Section: Aligned to Enterprise Style */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-100">
                                <Users size={18} />
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em]">
                                CRM & Distribution
                            </span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                                Customer <span className="text-indigo-600">Accounts</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-sm italic flex items-center gap-2 mt-1">
                                Global Registry
                                <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                <span className="text-slate-900 not-italic font-bold">{filteredCustomers.length} Active Profiles</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                            <Download size={16} />
                            Export Data
                        </button>
                        <button className="flex items-center gap-2.5 px-7 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                            <PlusCircle size={16} strokeWidth={2.5} />
                            Add Account
                        </button>
                    </div>
                </div>

                {/* Analytics Section */}
                <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <CustomersStats customers={customers} />
                </section>

                {/* Main Data Container */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.05)] overflow-hidden">
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/40 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-1 bg-indigo-600 rounded-full" />
                            <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-800">Account Database</h3>
                        </div>
                        <CustomersHeader
                            search={search}
                            setSearch={setSearch}
                            filter={filter}
                            setFilter={setFilter}
                        />
                    </div>

                    <div className="p-0">
                        <CustomersTable customers={filteredCustomers} />
                    </div>

                    {/* Footer Info: Unified tracking */}
                    <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-black uppercase tracking-widest">
                        <span>Database Sync: 04.03.2026 — 18:40:35</span>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-emerald-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live Sync Active
                            </span>
                            <span className="text-slate-300 not-italic">v4.0.12</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}