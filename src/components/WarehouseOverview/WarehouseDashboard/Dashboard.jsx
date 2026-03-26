import React, { useState } from 'react';
import {
  Package, Box, Truck, Clock,
  ArrowUpRight, ArrowDownLeft,
  Activity, Database, AlertCircle,
  MoreVertical, Search, Bell
} from 'lucide-react';

const Dashboard = () => {
  const [date, setDate] = useState(new Date());

  // --- GH DISTRIBUTION SCALE DATA ---
  // Typical mid-size Ghana distribution company (Centralized Kumasi Warehouse)

  const inventory = [
    {
      sku: 'GH-RICE-25KG',
      warehouseId: 'KUMASI_DC',
      totalQuantity: 9200,
      reservedQuantity: 1850,
      status: 'AVAILABLE',
    },
    {
      sku: 'GH-COOKING-OIL-5L',
      warehouseId: 'KUMASI_DC',
      totalQuantity: 3600,
      reservedQuantity: 3200,
      status: 'LOW_STOCK',
    },
    {
      sku: 'GH-CEMENT-50KG',
      warehouseId: 'KUMASI_DC',
      totalQuantity: 0,
      reservedQuantity: 0,
      status: 'OUT_OF_STOCK',
    },
    {
      sku: 'GH-SOAP-BOX-72',
      warehouseId: 'KUMASI_DC',
      totalQuantity: 6400,
      reservedQuantity: 980,
      status: 'AVAILABLE',
    },
  ];

  const fulfillments = [
    {
      orderId: 'GH-ORD-24011',
      status: 'PICKING',
      warehouseId: 'KUMASI_DC',
      assignedAt: '2026-01-22T08:15:00Z',
    },
    {
      orderId: 'GH-ORD-24018',
      status: 'PACKED',
      warehouseId: 'KUMASI_DC',
      assignedAt: '2026-01-22T09:05:00Z',
    },
    {
      orderId: 'GH-ORD-23992',
      status: 'DISPATCHED',
      warehouseId: 'KUMASI_DC',
      dispatchedAt: '2026-01-22T10:10:00Z',
    },
  ];

  const transactions = [
    {
      sku: 'GH-RICE-25KG',
      type: 'RESERVE',
      quantity: 180,
      referenceType: 'ORDER',
      referenceId: 'GH-ORD-24011',
      createdAt: '2026-01-22T10:20:00Z',
    },
    {
      sku: 'GH-COOKING-OIL-5L',
      type: 'IN',
      quantity: 1200,
      referenceType: 'SUPPLIER',
      referenceId: 'SUP-KSI-014',
      createdAt: '2026-01-22T08:45:00Z',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900 font-sans pb-10">
      {/* MASTER HEADER */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Database className="text-white" size={20} />
          </div>
          <h1 className="text-lg font-black tracking-tight uppercase">
            Thonket Distribution Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Search SKU or Order ID..."
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-xs w-64 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4 border-l pl-6">
            <input
              type="date"
              value={date.toISOString().split('T')[0]}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="text-xs font-bold bg-white border border-slate-200 rounded-lg p-2"
            />
            <button className="text-slate-400 hover:text-blue-600 transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Live Fulfillments" value={200} color="blue" icon={<Box size={20} />} />
          <StatCard label="Picking Orders" value={50} color="orange" icon={<Clock size={10} />} />
          <StatCard label="Dispatched Today" value={10} color="green" icon={<Truck size={20} />} />
          <StatCard label="Low Stock SKUs" value={140} color="red" icon={<AlertCircle size={20} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* INVENTORY */}
          <div className="lg:col-span-8 space-y-6">
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="font-black text-slate-800 flex items-center gap-2">
                  <Package className="text-blue-600" size={18} />
                  INVENTORY MATRIX
                </h2>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-widest uppercase">
                  KUMASI LIVE SYNC
                </span>
              </div>

              <div className="overflow-x-auto p-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                      <th className="pb-3 px-2">SKU</th>
                      <th className="pb-3 text-center">Warehouse</th>
                      <th className="pb-3 text-center">Total Qty</th>
                      <th className="pb-3 text-center">Reserved</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-5 px-2">
                          <div className="font-black text-slate-800 group-hover:text-blue-600">
                            {item.sku}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            GH_REF
                          </div>
                        </td>
                        <td className="py-5 text-center text-xs font-bold">
                          {item.warehouseId}
                        </td>
                        <td className="py-5 text-center font-mono font-bold">
                          {item.totalQuantity.toLocaleString()}
                        </td>
                        <td className="py-5 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-black text-orange-600">
                              {item.reservedQuantity.toLocaleString()}
                            </span>
                            <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                              <div
                                className="bg-orange-500 h-full"
                                style={{
                                  width: item.totalQuantity
                                    ? `${(item.reservedQuantity / item.totalQuantity) * 100}%`
                                    : '0%',
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-5 text-right">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* LEDGER */}
          <div className="lg:col-span-4">
            <Ledger fulfillments={fulfillments} transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
};

/* ---------- SUBCOMPONENTS ---------- */

const StatCard = ({ label, value, color, icon }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    orange: 'text-orange-600 bg-orange-50',
    green: 'text-emerald-600 bg-emerald-50',
    red: 'text-rose-600 bg-rose-50',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="text-3xl font-black mt-1">{value}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const themes = {
    AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    LOW_STOCK: 'bg-amber-50 text-amber-700 border-amber-100',
    OUT_OF_STOCK: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${themes[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const Ledger = ({ transactions }) => (
  <section className="bg-slate-900 rounded-3xl shadow-xl p-8 text-white h-full">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-xs font-black tracking-[0.2em] text-blue-400 flex items-center gap-2">
        <Activity size={16} />
        LIVE LEDGER
      </h2>
      <MoreVertical size={16} />
    </div>

    <div className="space-y-6">
      {transactions.map((tx, idx) => (
        <div key={idx} className="flex gap-4 border-l-2 border-slate-800 pl-4">
          <div className={`p-2 rounded-lg ${tx.type === 'IN' ? 'bg-emerald-500/20' : 'bg-orange-500/20'}`}>
            {tx.type === 'IN' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="font-black">{tx.sku}</span>
              <span className="font-mono text-xs">
                {tx.type === 'IN' ? '+' : '-'}
                {tx.quantity}
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              {tx.referenceType} — {tx.referenceId}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Dashboard;
