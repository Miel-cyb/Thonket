import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  BarChart3,
  ShieldCheck,
  Layers,
  ArrowRight,
  Loader2
} from "lucide-react";
import { loginUser, getCurrentUser } from "../admin/api/authService";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser({ email, password });
      const user = await getCurrentUser();

      const role = user.role?.toLowerCase();

      // Dynamic Routing Logic based on Department
      switch (role) {
        case "ceo":
          navigate("/ceo-analytics");
          break;
        case "sales":
          navigate("/orders");
          break;
        case "operations":
          navigate("/operations");
          break;
        case "inventory":
          navigate("/inventory");
          break;
        default:
          navigate("/dashboard"); // Fallback
      }
    } catch (err) {
      setError("The email or password provided is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans">

      {/* LEFT SIDE: Value Proposition & Branding */}
      <div className="hidden md:flex md:w-1/2 bg-[#310074] text-white flex-col justify-between p-16 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#4400A5] rounded-full blur-3xl opacity-50" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="p-2 bg-white/10 rounded-lg">
              <Layers size={28} className="text-indigo-300" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">Thonket</span>
          </div>

          <h1 className="text-6xl font-black leading-tight mb-6">
            Efficient <span className="text-indigo-400">Distribution</span> <br /> Control.
          </h1>
          <p className="text-xl text-indigo-100/80 max-w-lg mb-12 font-medium leading-relaxed">
            Optimize your supply chain with real-time tracking of orders, automated inventory management, and intelligent fleet routing.
          </p>

          {/* Value Pillars */}
          <div className="grid grid-cols-2 gap-6 max-w-md">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
              <Package className="text-indigo-400" size={20} />
              <span className="text-sm font-bold tracking-wide">Smart Inventory</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
              <Truck className="text-indigo-400" size={20} />
              <span className="text-sm font-bold tracking-wide">Fleet Logistics</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
              <BarChart3 className="text-indigo-400" size={20} />
              <span className="text-sm font-bold tracking-wide">CEO Analytics</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
              <ShieldCheck className="text-indigo-400" size={20} />
              <span className="text-sm font-bold tracking-wide">Secure Ops</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-indigo-300/60 font-medium italic">
          Trusted by 50+ regional distribution hubs.
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Portal */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-24">
        <div className="w-full max-w-md">
          {/* Mobile Header (Only visible on small screens) */}
          <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <Layers size={32} className="text-[#4400A5]" />
            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Thonket</span>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Please enter your credentials to access the platform.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <X size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Corporate Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@thonket.com"
                className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 placeholder:text-slate-300"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  Secure Password
                </label>
                <button type="button" className="text-[11px] font-black text-indigo-600 uppercase hover:underline">
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 placeholder:text-slate-300"
                required
              />
            </div>

            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember" className="text-sm font-bold text-slate-600 select-none">Keep me logged in</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4400A5] hover:bg-[#310074] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-400 text-xs font-medium">
            Authorized Personnel Only. © 2026 Thonket Distribution Systems.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;