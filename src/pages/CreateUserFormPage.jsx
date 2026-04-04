import { useState } from "react";
import CreateUserForm from "../components/User/CreateUserForm";
import { ChevronLeft, CheckCircle2, ShieldCheck } from "lucide-react";

export default function CreateUserPage() {
    const [successMessage, setSuccessMessage] = useState("");

    const handleUserCreated = (user) => {
        setSuccessMessage(`${user.name} has been successfully activated!`);
        setTimeout(() => setSuccessMessage(""), 5000);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Header Area: Scaled down for better alignment */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 px-1">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-100">
                                <ShieldCheck size={18} />
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em]">
                                System Governance
                            </span>
                        </div>

                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                                New <span className="text-indigo-600">Provision</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-sm italic flex items-center gap-2 mt-1">
                                Distributor Onboarding
                                <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                <span className="text-slate-400 not-italic font-semibold italic">Staff Clearance</span>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => window.history.back()}
                        className="group flex items-center gap-2.5 px-7 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-[10px] text-slate-600 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all active:scale-95 uppercase tracking-widest"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Return to Directory
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="relative">
                    {/* Floating Success Notification: Refined size */}
                    {successMessage && (
                        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-6 duration-500">
                            <div className="bg-slate-900 text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-[0_20px_50px_rgba(15,23,42,0.3)] border border-slate-700">
                                <div className="bg-emerald-500 p-1 rounded-full">
                                    <CheckCircle2 className="text-white" size={16} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                                    {successMessage}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* The Form Component: Ensure container matches the Role Table style */}
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.05)] overflow-hidden">
                            <CreateUserForm onUserCreated={handleUserCreated} />
                        </div>
                    </div>
                </div>

                {/* Footer Info: Clean & Compact */}
                <div className="mt-10 px-4 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <p>© 2026 Thonket Enterprise</p>
                        <span className="text-slate-200">|</span>
                        <p>Security Level: Alpha-7</p>
                    </div>
                    <p className="italic text-slate-300 font-medium tracking-normal">Security Protocol v4.0.12</p>
                </div>
            </div>
        </div>
    );
}