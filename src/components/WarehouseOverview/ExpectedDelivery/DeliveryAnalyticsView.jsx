import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  Timer,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Info,
  ArrowUpRight,
  Layers,
  Search,
  RefreshCw,
  Building2,
  SlidersHorizontal,
  Check,
  AlertCircle
} from 'lucide-react';

export default function DeliveryAnalyticsView({ deliveries = [] }) {
  // Timeline Date Filter Anchor State
  const [timelinePeriod, setTimelinePeriod] = useState('Today');
  // Active Filter for Exception / Analytics views
  const [activeFilter, setActiveFilter] = useState('ALL');
  // Search query for supplier data
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced Dynamic Operational Baseline Analytics
  const analytics = useMemo(() => {
    const hasData = deliveries && deliveries.length > 0;

    const baseExpected = hasData ? deliveries.length : 12;
    const baseToday = hasData ? deliveries.filter(d => d.period === 'Today').length : 5;
    const baseInTransit = 4;
    const baseAwaiting = 2;
    const baseOverdue = 3;

    const onTimeDeliveryRate = 94.2;
    const avgDeliveryDelayHours = "1.8";
    const avgArrivalVarianceMinutes = "+1h 20m";

    const workloadBreakdown = {
      expectedDeliveriesCount: baseExpected,
      expectedProductLines: 42,
      expectedVariants: 68,
      expectedPallets: 120,
      uomQuantities: [
        { uom: 'Cartons', amount: 1250, percent: 62 },
        { uom: 'Cases', amount: 480, percent: 24 },
        { uom: 'Bags', amount: 200, percent: 10 },
        { uom: 'Pieces', amount: 75, percent: 4 }
      ]
    };

    return {
      expectedDeliveries: baseExpected,
      expectedToday: baseToday,
      inTransit: baseInTransit,
      awaitingReceiving: baseAwaiting,
      overdueDeliveries: baseOverdue,
      onTimeDeliveryRate,
      avgDeliveryDelayHours,
      avgArrivalVarianceMinutes,
      workloadBreakdown
    };
  }, [deliveries]);

  const timelineData = {
    Today: [
      { id: 'PO-0001', supplier: 'Coca-Cola Ghana', time: '10:00 AM', volume: '100 Cartons', status: 'Expected', type: 'EXPECTED', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60 ring-1 ring-blue-500/10' },
      { id: 'PO-0002', supplier: 'Nestlé Ghana', time: '02:00 PM', volume: '50 Cartons', status: 'In Transit', type: 'TRANSIT', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60 ring-1 ring-amber-500/10' },
      { id: 'PO-0007', supplier: 'FanMilk PLC', time: '04:15 PM', volume: '120 Cases', status: 'Awaiting', type: 'AWAITING', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 ring-1 ring-emerald-500/10' },
    ],
    Tomorrow: [
      { id: 'PO-0003', supplier: 'Unilever Ghana', time: '09:00 AM', volume: '200 Cartons', status: 'Scheduled', type: 'EXPECTED', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
      { id: 'PO-0008', supplier: 'GB Foods', time: '11:30 AM', volume: '85 Bags', status: 'Scheduled', type: 'EXPECTED', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
    ],
    'This Week': [
      { id: 'PO-0001', supplier: 'Coca-Cola Ghana', time: 'Today, 10:00 AM', volume: '100 Cartons', status: 'Expected', type: 'EXPECTED', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60' },
      { id: 'PO-0002', supplier: 'Nestlé Ghana', time: 'Today, 2:00 PM', volume: '50 Cartons', status: 'In Transit', type: 'TRANSIT', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60' },
      { id: 'PO-0003', supplier: 'Unilever Ghana', time: 'Tomorrow, 9:00 AM', volume: '200 Cartons', status: 'Scheduled', type: 'EXPECTED', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
      { id: 'PO-0004', supplier: 'FanMilk PLC', time: 'Thursday, 11:00 AM', volume: '480 Cases', status: 'Scheduled', type: 'EXPECTED', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' }
    ],
    'Next 7 Days': [
      { id: 'PO-0005', supplier: 'GB Foods', time: 'Mon 27th, 8:00 AM', volume: '300 Bags', status: 'Scheduled', type: 'EXPECTED', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
      { id: 'PO-0009', supplier: 'Promasidor', time: 'Wed 29th, 1:00 PM', volume: '90 Cases', status: 'Scheduled', type: 'EXPECTED', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' }
    ],
    'This Month': [
      { id: 'PO-0006', supplier: 'Promasidor', time: 'End of Month', volume: '150 Cases', status: 'Scheduled', type: 'EXPECTED', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' }
    ]
  };

  const supplierPerformanceData = [
    { name: 'Coca-Cola Ghana', expected: 20, fulfilled: 18, deviations: 2, delay: '1.2 Days', rate: 90 },
    { name: 'Nestlé Ghana', expected: 15, fulfilled: 12, deviations: 3, delay: '2.4 Days', rate: 80 },
    { name: 'Unilever Ghana', expected: 10, fulfilled: 10, deviations: 0, delay: '0 Days', rate: 100 },
    { name: 'FanMilk PLC', expected: 18, fulfilled: 17, deviations: 1, delay: '0.5 Days', rate: 94 },
    { name: 'GB Foods', expected: 12, fulfilled: 11, deviations: 1, delay: '1.1 Days', rate: 91 },
  ];

  const filteredTimeline = useMemo(() => {
    const currentNodes = timelineData[timelinePeriod] || [];
    if (activeFilter === 'ALL') return currentNodes;
    return currentNodes.filter(node => node.type === activeFilter);
  }, [timelinePeriod, activeFilter]);

  const filteredSuppliers = useMemo(() => {
    return supplierPerformanceData.filter(sup =>
      sup.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50/60 text-slate-900 min-h-screen antialiased font-sans flex flex-col gap-6 sm:gap-8">

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Fulfillment & Operations Control</h1>
            <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Real-time supply chain operations, SLA compliance, and logistics manifest tracking.</p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold rounded-xl text-slate-700 transition-all shadow-xs active:scale-95">
            <RefreshCw size={14} className="text-slate-500" />
            <span>Sync Registry</span>
          </button>
        </div>
      </div>

      {/* CORE ANALYTICS CARD GRID LAYER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">

        {/* Total Queue Card */}
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`text-left bg-white p-5 border rounded-2xl transition-all relative group flex flex-col justify-between h-36 ${activeFilter === 'ALL'
            ? 'border-slate-900 ring-2 ring-slate-950/10 bg-slate-900/[0.02] shadow-xs'
            : 'border-slate-200/80 hover:border-slate-400 hover:shadow-xs'
            }`}
        >
          <div className="flex justify-between items-start w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Pipeline</span>
            <div className={`p-2 rounded-xl transition-colors ${activeFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Layers size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{analytics.expectedDeliveries}</span>
              <span className="text-xs font-bold text-slate-500">POs</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between w-full">
              <span>Aggregated balance</span>
              <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600" />
            </div>
          </div>
        </button>

        {/* Expected Today Card */}
        <button
          onClick={() => setActiveFilter('EXPECTED')}
          className={`text-left bg-white p-5 border rounded-2xl transition-all relative group flex flex-col justify-between h-36 ${activeFilter === 'EXPECTED'
            ? 'border-blue-600 ring-2 ring-blue-600/10 bg-blue-50/40 shadow-xs'
            : 'border-slate-200/80 hover:border-blue-300 hover:shadow-xs'
            }`}
        >
          <div className="flex justify-between items-start w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expected Today</span>
            <div className={`p-2 rounded-xl transition-colors ${activeFilter === 'EXPECTED' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
              <Clock size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{analytics.expectedToday}</span>
              <span className="text-xs font-bold text-blue-600">Active</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between w-full">
              <span className={`${activeFilter === 'EXPECTED' ? 'text-blue-600 font-medium' : ''}`}>Dock allocation view</span>
              <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
            </div>
          </div>
        </button>

        {/* In Transit Card */}
        <button
          onClick={() => setActiveFilter('TRANSIT')}
          className={`text-left bg-white p-5 border rounded-2xl transition-all relative group flex flex-col justify-between h-36 ${activeFilter === 'TRANSIT'
            ? 'border-amber-500 ring-2 ring-amber-500/10 bg-amber-50/40 shadow-xs'
            : 'border-slate-200/80 hover:border-amber-400 hover:shadow-xs'
            }`}
        >
          <div className="flex justify-between items-start w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In Transit</span>
            <div className={`p-2 rounded-xl transition-colors ${activeFilter === 'TRANSIT' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
              <Truck size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{analytics.inTransit}</span>
              <span className="text-xs font-bold text-amber-600">Shipments</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between w-full">
              <span className={`${activeFilter === 'TRANSIT' ? 'text-amber-700 font-medium' : ''}`}>ASN Network Tracked</span>
              <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-600" />
            </div>
          </div>
        </button>

        {/* Awaiting Receiving Card */}
        <button
          onClick={() => setActiveFilter('AWAITING')}
          className={`text-left bg-white p-5 border rounded-2xl transition-all relative group flex flex-col justify-between h-36 ${activeFilter === 'AWAITING'
            ? 'border-emerald-600 ring-2 ring-emerald-600/10 bg-emerald-50/40 shadow-xs'
            : 'border-slate-200/80 hover:border-emerald-400 hover:shadow-xs'
            }`}
        >
          <div className="flex justify-between items-start w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Awaiting Arrival</span>
            <div className={`p-2 rounded-xl transition-colors ${activeFilter === 'AWAITING' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{analytics.awaitingReceiving}</span>
              <span className="text-xs font-bold text-emerald-600">In Yard</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between w-full">
              <span className={`${activeFilter === 'AWAITING' ? 'text-emerald-700 font-medium' : ''}`}>Clearance log intact</span>
              <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
            </div>
          </div>
        </button>

        {/* SLA Breach Warning Card */}
        <div className="bg-gradient-to-b from-red-50/80 to-red-50/30 border border-red-200/80 p-5 rounded-2xl flex flex-col justify-between h-36 relative overflow-hidden sm:col-span-2 lg:col-span-1 shadow-xs">
          <div className="flex justify-between items-start w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-800">SLA Breaches</span>
            <div className="p-2 bg-red-100 text-red-600 rounded-xl animate-pulse">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-red-700 tracking-tight">{analytics.overdueDeliveries}</span>
              <span className="text-[9px] font-extrabold text-red-700 bg-red-100/90 border border-red-200 px-1.5 py-0.5 rounded uppercase tracking-wider">Critical</span>
            </div>
            <div className="mt-2 text-[11px] text-red-600/90 font-medium flex items-center justify-between">
              <span>Escalation protocol active</span>
              <AlertCircle size={13} className="text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* CORE SYSTEM TELEMETRY STRIP */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-slate-800/30 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-4 relative z-10">
          <div className="p-3 bg-slate-900 rounded-xl text-emerald-400 border border-slate-800 shadow-inner">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">On-Time Delivery Rate</p>
            <div className="flex items-center gap-2 mt-0.5">
              <h4 className="text-2xl font-black text-white">{analytics.onTimeDeliveryRate}%</h4>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp size={10} /> Optimal
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 md:border-t-0 md:border-l md:border-slate-800/80 md:pl-8 flex flex-col justify-center relative z-10 pt-4 md:pt-0">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Mean Operational Delay</p>
          <h4 className="text-sm font-semibold text-slate-200 mt-1">
            <span className="text-white font-black text-xl">{analytics.avgDeliveryDelayHours} Hours</span> <span className="text-slate-400 font-normal text-xs ml-1">(Fulfillment Window)</span>
          </h4>
        </div>

        <div className="border-t border-slate-800/80 md:border-t-0 md:border-l md:border-slate-800/80 md:pl-8 flex flex-col justify-center relative z-10 pt-4 md:pt-0">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Schedule Variance Anchor</p>
          <div className="flex items-center gap-2.5 mt-1">
            <h4 className="text-xl font-black text-amber-400">{analytics.avgArrivalVarianceMinutes}</h4>
            <span className="text-[9px] font-bold text-slate-300 bg-slate-800/90 border border-slate-700/60 px-2 py-0.5 rounded-full">Skew Positive</span>
          </div>
        </div>
      </div>

      {/* CORE WORKFLOW INTERACTION MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Pipeline Breakdown Progress bars */}
        <div className="bg-white p-6 border border-slate-200/80 rounded-2xl shadow-xs lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline Status Allocation</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time capacity and logistics breakdown</p>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Scheduled Orders', count: 8, width: '85%', color: 'bg-slate-700', pct: '42%' },
                { label: 'In Transit Logistics', count: 5, width: '60%', color: 'bg-amber-500', pct: '26%' },
                { label: 'Arrived Yard Buffers', count: 3, width: '35%', color: 'bg-emerald-500', pct: '16%' },
                { label: 'Active Receiving Flows', count: 2, width: '22%', color: 'bg-blue-600', pct: '11%' },
                { label: 'Escalated / Overdue', count: 1, width: '12%', color: 'bg-red-500', pct: '5%' },
              ].map((item, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between text-xs font-medium mb-1.5 text-slate-700">
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{item.pct}</span>
                      <span className="bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded font-bold text-slate-900 text-[10px]">{item.count}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                    <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Aggregated Registry Size</span>
            <span className="font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/80 text-[11px]">19 Active Manifests</span>
          </div>
        </div>

        {/* Registry timeline execution registry */}
        <div className="bg-white p-6 border border-slate-200/80 rounded-2xl shadow-xs lg:col-span-8 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 mb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Fulfillment Manifest Registry</h3>
                {activeFilter !== 'ALL' && (
                  <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    {activeFilter}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Manager scheduling thresholds and validation milestones</p>
            </div>

            {/* Micro-pill timeline selectors */}
            <div className="flex flex-wrap gap-1 bg-slate-100/80 p-1 rounded-xl self-start sm:self-auto border border-slate-200/50">
              {['Today', 'Tomorrow', 'This Week', 'Next 7 Days', 'This Month'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTimelinePeriod(tab)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${timelinePeriod === tab
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Nodes */}
          <div className="relative pl-6 border-l border-slate-200 space-y-3.5 max-h-[300px] overflow-y-auto pr-2 flex-grow scrollbar-thin">
            {filteredTimeline.map((node, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-4 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white group-hover:border-slate-900 group-hover:bg-slate-900 transition-all shadow-xs" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl transition-all gap-3 hover:border-slate-300">
                  <div className="flex items-center space-x-3.5">
                    <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700 shadow-2xs">
                      {node.id}
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 tracking-tight">{node.supplier}</h5>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1"><Clock size={12} className="text-slate-400" /> {node.time}</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1"><Package size={12} className="text-slate-400" /> {node.volume}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${node.badgeClass}`}>
                      {node.status}
                    </span>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 transition-colors hidden sm:block" />
                  </div>
                </div>
              </div>
            ))}

            {filteredTimeline.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200">
                <Info size={20} className="text-slate-300 mb-1.5" />
                <p className="text-xs font-semibold text-slate-500">No matching operations tracked inside this view</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Try altering the filter context matrices</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* METRIC AGING & INBOUND EXCEPTION TIERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Capacity Loading Breakdown */}
        <div className="bg-white p-6 border border-slate-200/80 rounded-2xl shadow-xs lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Warehouse Allocation Metrics</h3>
              <p className="text-xs text-slate-500 mt-0.5">Resource allocation vectors for strategic routing</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Target Shipments</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{analytics.workloadBreakdown.expectedDeliveriesCount}</p>
              </div>
              <div className="p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Active Lines</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{analytics.workloadBreakdown.expectedProductLines}</p>
              </div>
              <div className="p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">SKU Profiles</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{analytics.workloadBreakdown.expectedVariants}</p>
              </div>
              <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-xl">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Floor Pallet Units</p>
                <p className="text-xl font-black text-blue-700 mt-0.5">{analytics.workloadBreakdown.expectedPallets}</p>
              </div>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Load Volume Metrics Mix</p>
            <div className="space-y-3">
              {analytics.workloadBreakdown.uomQuantities.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600">{item.uom}</span>
                    <span className="font-bold text-slate-900">{item.amount.toLocaleString()} Units</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-800 h-full rounded-full" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3 bg-slate-50/80 border border-slate-200/60 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
            <Info size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
            <span>Unit profiles are validated independently across supplier records to prevent telemetry pollution.</span>
          </div>
        </div>

        {/* Real-time Exception Terminal */}
        <div className="bg-white p-6 border border-slate-200/80 rounded-2xl shadow-xs lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Exception Override Terminal</h3>
              <p className="text-xs text-slate-500 mt-0.5">Critical anomalies requiring immediate operator remediation</p>
            </div>

            <div className="space-y-3">
              {/* Alert 1 */}
              <div className="flex items-start space-x-3.5 p-3.5 bg-red-50/40 border border-red-100 rounded-xl">
                <div className="p-2 bg-red-100/80 text-red-600 rounded-lg flex-shrink-0 mt-0.5">
                  <AlertTriangle size={15} />
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">3 Overdue Shipments Flagged</span>
                    <span className="text-[9px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Breach Risk</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">Scheduled arrival parameters exceeded with zero yard telemetry updates. Manual check protocols requested.</p>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="flex items-start space-x-3.5 p-3.5 bg-amber-50/40 border border-amber-100 rounded-xl">
                <div className="p-2 bg-amber-100/80 text-amber-700 rounded-lg flex-shrink-0 mt-0.5">
                  <Timer size={15} />
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">PO-0001: Yard Cross-Docking Bottleneck</span>
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wide">Stalled 2h</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">Gate entry recorded at 08:15 AM but material handoff has stalled. Direct marshalling supervisor routing needed.</p>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="flex items-start space-x-3.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                <div className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg flex-shrink-0 mt-0.5">
                  <Building2 size={15} />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900">Missing Origin Advanced Shipping Notices</span>
                  <p className="text-slate-500 mt-1 leading-relaxed">2 active pipeline items currently missing authenticated data packet headers from vendor logistics origins.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Continuous Telemetry Core Active
            </span>
            <span>Real-time Sync Enabled</span>
          </div>
        </div>
      </div>

      {/* VENDOR AUDIT LOGS TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Supplier Performance Audit Registry</h3>
            <p className="text-xs text-slate-500 mt-0.5">Audited historical profiles for vendor continuous service level agreements</p>
          </div>

          <div className="relative max-w-xs w-full self-start sm:self-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter registry by vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 focus:border-slate-400 focus:bg-white rounded-xl outline-none transition-all text-slate-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/60 text-[10px] tracking-wider uppercase">
                <th className="py-3.5 px-6 font-semibold">Vendor Identity</th>
                <th className="py-3.5 px-4 font-semibold">Expected</th>
                <th className="py-3.5 px-4 font-semibold">Fulfilled</th>
                <th className="py-3.5 px-4 font-semibold">Operational Deviations</th>
                <th className="py-3.5 px-4 font-semibold">Mean Window Delay</th>
                <th className="py-3.5 px-6 text-right font-semibold">SLA Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSuppliers.map((vendor, index) => {
                const isOptimal = vendor.rate >= 90;
                return (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {vendor.name.charAt(0)}
                      </div>
                      <span>{vendor.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{vendor.expected} Manifests</td>
                    <td className="py-3.5 px-4 text-emerald-600 font-medium">{vendor.fulfilled} Fulfilled</td>
                    <td className="py-3.5 px-4">
                      {vendor.deviations > 0 ? (
                        <span className="text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                          {vendor.deviations} Deviations
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{vendor.delay}</td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${isOptimal ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${vendor.rate}%` }}
                          />
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isOptimal
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                          : 'bg-amber-50 text-amber-700 border-amber-200/60'
                          }`}>
                          {vendor.rate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No suppliers match the filter query "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}