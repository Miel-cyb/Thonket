import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  ChevronRight,
  ShoppingBag,
  User,
  Calendar,
  Layers,
  Check,
  AlertCircle,
  ArrowRight,
  X
} from 'lucide-react';

const CountdownTimer = ({ receivedDate }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const deadline = new Date(new Date(receivedDate).getTime() + 48 * 60 * 60 * 1000);
    const difference = deadline - now;
    if (difference <= 0) return null;

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      totalHours: difference / (1000 * 60 * 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    return () => clearInterval(timer);
  }, [receivedDate]);

  if (!timeLeft) return (
    <span className="inline-flex items-center gap-1.5 text-red-700 font-bold text-[10px] uppercase bg-red-50 border border-red-100 px-2 py-1 rounded-md tracking-wider">
      <AlertCircle size={10} strokeWidth={2.5} /> SLA Breached
    </span>
  );

  const isCritical = timeLeft.totalHours < 6;
  return (
    <div className={`flex items-center gap-2 font-mono text-[13px] tabular-nums font-semibold ${isCritical ? 'text-red-600 animate-pulse' : 'text-slate-600'}`}>
      <Clock size={14} strokeWidth={2} />
      <span>{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m</span>
    </div>
  );
};

const OrderApproval = ({ initialOrders = [], onApproveOrder }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const groupedOrders = useMemo(() => {
    return initialOrders.reduce((acc, order) => {
      const date = new Date(order.receivedDate).toLocaleDateString(undefined, {
        month: 'long', day: 'numeric', year: 'numeric'
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(order);
      return acc;
    }, {});
  }, [initialOrders]);

  const sortedDates = Object.keys(groupedOrders).sort((a, b) => new Date(b) - new Date(a));

  const handleApprove = (id) => {
    onApproveOrder(id);
    setSelectedIds(prev => prev.filter(item => item !== id));
  };

  const toggleSelectAllForDate = (date) => {
    const ids = groupedOrders[date].map(o => o.orderId);
    const allSelected = ids.every(id => selectedIds.includes(id));
    setSelectedIds(prev => allSelected ? prev.filter(id => !ids.includes(id)) : [...new Set([...prev, ...ids])]);
  };

  return (
    <div className="relative antialiased selection:bg-blue-100">
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="sticky top-4 z-50 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 mb-8 mx-auto max-w-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg"><Layers size={20} /></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Batch Processing</p>
                <p className="text-[15px] font-semibold text-white">{selectedIds.length} Orders Selected</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button onClick={() => setSelectedIds([])} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Reset</button>
              <button
                onClick={() => { selectedIds.forEach(handleApprove); }}
                className="bg-white text-slate-900 hover:bg-blue-50 active:scale-95 px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                Approve & Dispatch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-12">
        {sortedDates.map(date => (
          <div key={date} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Calendar size={16} className="text-slate-500" />
                </div>
                <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">{date}</h3>
              </div>
              <button
                onClick={() => toggleSelectAllForDate(date)}
                className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Select Batch
              </button>
            </div>

            <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="p-6 w-14"></th>
                    <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Reference</th>
                    <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Customer</th>
                    <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Priority</th>
                    <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Time Limit</th>
                    <th className="px-4 py-4 pr-10 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode='popLayout'>
                    {groupedOrders[date].map(order => (
                      <motion.tr
                        layout
                        key={order.orderId}
                        exit={{ x: -20, opacity: 0 }}
                        className={`group transition-all duration-150 ${selectedIds.includes(order.orderId) ? 'bg-blue-50/50' : 'hover:bg-slate-50/70'}`}
                      >
                        <td className="p-6">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(order.orderId)}
                              onChange={() => setSelectedIds(prev => prev.includes(order.orderId) ? prev.filter(i => i !== order.orderId) : [...prev, order.orderId])}
                              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 checked:bg-blue-600 checked:border-blue-600 transition-all"
                            />
                            <Check className="absolute text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none" size={12} strokeWidth={4} />
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <span className="text-[14px] font-bold text-slate-950 tracking-tight">#{order.orderId}</span>
                        </td>
                        <td className="px-4 py-5">
                          <span className="text-[14px] font-medium text-slate-700">{order.customer}</span>
                        </td>
                        <td className="px-4 py-5">
                          <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${order.priority?.toLowerCase() === 'high'
                              ? 'bg-red-50 text-red-700 border-red-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                            {order.priority || 'Normal'}
                          </span>
                        </td>
                        <td className="px-4 py-5">
                          <CountdownTimer receivedDate={order.receivedDate} />
                        </td>
                        <td className="px-4 py-5 pr-10 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-2 text-[12px] font-bold text-slate-400 hover:text-blue-600 transition-all"
                          >
                            Review <ChevronRight size={16} strokeWidth={2.5} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div
              initial={{ y: 30, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.98, opacity: 0 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white"><ShoppingBag size={24} /></div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">Verify Order Items</h3>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Reference #{selectedOrder.orderId}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Purchasing Entity</p>
                    <div className="flex items-center gap-2 font-semibold text-[14px] text-slate-800"><User size={14} className="text-slate-400" /> {selectedOrder.customer}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">SLA Countdown</p>
                    <CountdownTimer receivedDate={selectedOrder.receivedDate} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest px-1">Package Contents</h4>
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                    {selectedOrder.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-4">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-semibold text-slate-800">{item.product}</span>
                          <span className="text-[11px] font-medium text-slate-500">Unit Quantity: {item.quantity}</span>
                        </div>
                        <span className="text-[14px] font-mono font-bold text-slate-900 tabular-nums">₵{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button onClick={() => setSelectedOrder(null)} className="flex-1 py-4 text-xs font-bold text-slate-500 uppercase tracking-[0.2em] transition-colors">Hold</button>
                <button
                  onClick={() => { handleApprove(selectedOrder.orderId); setSelectedOrder(null); }}
                  className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  Confirm & Approve <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderApproval;