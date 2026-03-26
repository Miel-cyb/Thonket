import React, { useEffect, useMemo, useState } from 'react';
import {
  Package,
  Truck,
  Settings,
  Layers,
  Tag,
  Percent,
  Search,
  RefreshCw,
  LayoutDashboard,
  Box,
  Plus,
  ChevronRight,
  ShieldAlert,
  Zap,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Internal Components (assuming these paths exist in your project)
import OrderApproval from '@/components/OperationsDashboard/OrderApproval';
import Alerts from '@/components/OperationsDashboard/Alerts';
import AnalyticsDashboard from '@/components/OperationsDashboard/Analytics';
import { calculatePriority } from '@/utils/calc';

const STAGES = [
  { key: 'pending', label: 'Pending Approval' },
  { key: 'approved', label: 'Approved' },
  { key: 'picking', label: 'Picking' },
  { key: 'packed', label: 'Packed' },
  { key: 'delivery', label: 'Out for Delivery' },
  { key: 'completed', label: 'Delivered' }
];

// --- Sub-Components ---

const StatCard = ({ label, value, icon: Icon, trend, trendType }) => (
  <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-5 border border-slate-200/60 flex items-center justify-between group hover:border-blue-200 transition-colors">
    <div className="space-y-1">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">{value}</p>
        {trend && (
          <span className={`flex items-center text-[10px] font-bold ${trendType === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </span>
        )}
      </div>
    </div>
    <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
      <Icon size={20} />
    </div>
  </div>
);

const ConfigTile = ({ title, description, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="group bg-white p-6 rounded-[28px] border border-slate-200 text-left hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all relative overflow-hidden"
  >
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
      <Icon size={24} strokeWidth={2} />
    </div>
    <h4 className="text-[15px] font-bold text-slate-900 mb-1">{title}</h4>
    <p className="text-[13px] font-medium text-slate-500 leading-relaxed mb-4">{description}</p>
    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 uppercase tracking-widest">
      Manage Module <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </button>
);

// --- Main Page ---

const OperationsPage = ({ products, reports }) => {
  // CORRECTED: useNavigate must be inside the component
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [activeStage, setActiveStage] = useState('pending');
  const [view, setView] = useState('execution');
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      let data = await res.json();
      data = data.map(o => calculatePriority(o));
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const counts = useMemo(() => {
    const map = { pending: 0, approved: 0, picking: 0, packed: 0, delivery: 0, completed: 0 };
    orders.forEach(o => {
      const key = o.stage || 'pending';
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [orders]);

  const filtered = useMemo(() => orders.filter(o => (o.stage || 'pending') === activeStage), [orders, activeStage]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 antialiased selection:bg-blue-100">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* TOP NAVIGATION & VIEW SWITCHER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/50 backdrop-blur-md p-6 rounded-[32px] border border-white shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-bold text-blue-600 uppercase tracking-widest">
              <LayoutDashboard size={14} />
              <span>Operations Manager</span>
              <ChevronRight size={12} />
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
            <button onClick={fetchOrders} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* VIEW CONDITIONAL RENDERING */}
        {view === 'execution' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard label="Queue Depth" value={counts.pending} icon={Box} trend="4.2%" trendType="up" />
              <StatCard label="Critical SLA" value={orders.filter(o => o.priority === 'high').length} icon={ShieldAlert} />
              <StatCard label="Daily Goal" value={`${Math.round((counts.completed / 50) * 100)}%`} icon={Activity} trend="2.1%" trendType="up" />
              <StatCard label="Live Fleet" value={counts.delivery} icon={Truck} />
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 p-2.5 flex overflow-x-auto gap-2 no-scrollbar">
              {STAGES.map(s => (
                <button
                  key={s.key}
                  onClick={() => setActiveStage(s.key)}
                  className={`flex-1 min-w-[160px] p-5 rounded-[22px] transition-all border ${activeStage === s.key
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200'
                    : 'border-transparent hover:bg-slate-50 text-slate-500'
                    }`}
                >
                  <div className="flex flex-col gap-1 text-left">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${activeStage === s.key ? 'text-blue-400' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                    <span className="text-2xl font-bold tabular-nums">{counts[s.key] || 0}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                {loading ? (
                  <div className="bg-white rounded-[40px] border border-slate-200 p-32 text-center">
                    <div className="relative w-12 h-12 mx-auto mb-4">
                      <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                      <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                    </div>
                    <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Refreshing Pipeline</p>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-700">
                    {activeStage === 'pending' ? (
                      <OrderApproval initialOrders={filtered} onApproveOrder={fetchOrders} />
                    ) : (
                      <div className="bg-white rounded-[40px] border border-slate-200 p-20 text-center shadow-sm border-dashed">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Package className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-slate-900 font-bold text-lg mb-2">Stage Monitoring Active</h3>
                        <p className="text-slate-500 text-[14px] max-w-sm mx-auto">Standard tracking enabled for <strong>{activeStage}</strong>. Automated alerts will trigger on SLA breach.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Operations Alerts
                    </h3>
                    <Filter size={14} className="text-slate-400" />
                  </div>
                  <Alerts products={products} reports={reports} />
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'analytics' && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Fulfillment Performance</h2>
                  <p className="text-sm font-medium text-slate-500">Historical data and logistics trends</p>
                </div>
                <div className="flex gap-2">
                  <select className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
              </div>
              <AnalyticsDashboard />
            </div>
          </div>
        )}

        {view === 'configuration' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Infrastructure</h2>
                <p className="text-[14px] font-medium text-slate-500">Manage catalog architecture and commercial rules</p>
              </div>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  placeholder="Search settings..."
                  className="bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-3.5 text-sm w-full md:w-80 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <ConfigTile
                title="Promotion Logic"
                description="Set up advanced discount stacking, flash sale triggers, and coupon rules."
                icon={Percent}
                onClick={() => navigate('/products/promotions')}
              />
              <ConfigTile
                title="Operational Rules"
                description="Define SLA thresholds, auto-dispatch logic, and courier priority weights."
                icon={Settings}
                onClick={() => navigate('/operations/rules')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationsPage;