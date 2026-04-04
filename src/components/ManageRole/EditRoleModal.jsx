import { useState } from "react";
import { X, Save, ShieldCheck, Lock } from "lucide-react";

const availablePermissions = [
    { id: "view_users", label: "User Directory" },
    { id: "edit_users", label: "Identity Mod" },
    { id: "approve_credit", label: "Credit Authority" },
    { id: "create_orders", label: "Order Logic" },
    { id: "respond_tickets", label: "Support Access" },
    { id: "system_audit", label: "Audit Logs" },
];

export default function EditRoleModal({ role, onClose, onSave }) {
    const [name, setName] = useState(role.name);
    const [permissions, setPermissions] = useState(role.permissions);

    const togglePermission = (permId) => {
        setPermissions(prev =>
            prev.includes(permId)
                ? prev.filter(p => p !== permId)
                : [...prev, permId]
        );
    };

    const handleSave = () => {
        if (!name.trim()) return alert("Role designation required");
        onSave({ ...role, name, permissions });
    };

    const labelStyle = "block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop: Slightly lighter blur for better performance */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container: Radius downscaled from [2.5rem] to [2rem] to match page cards */}
            <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-[0_30px_70px_rgba(15,23,42,0.2)] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Modal Header: More compact padding */}
                <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-100">
                            <ShieldCheck size={18} />
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                                Edit <span className="text-indigo-600">Authority</span>
                            </h2>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                Role ID: <span className="text-slate-900">#{role.id.toString().padStart(3, '0')}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body: Padding reduced from p-10 to p-8 */}
                <div className="p-8 space-y-8">

                    {/* Role Designation Input */}
                    <div className="group">
                        <label className={labelStyle}>Global Designation Title</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm text-slate-900 font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                placeholder="Enter role name..."
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                                <Lock size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Authority Matrix: Grid gap adjusted */}
                    <div>
                        <label className={labelStyle}>Authority Matrix (Active Permissions)</label>
                        <div className="grid grid-cols-2 gap-3">
                            {availablePermissions.map(p => {
                                const isActive = permissions.includes(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => togglePermission(p.id)}
                                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all group active:scale-95 ${isActive
                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                                            : "bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-tight">
                                            {p.label}
                                        </span>
                                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? "border-white/40 bg-white/20" : "border-slate-200"
                                            }`}>
                                            {isActive && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Action Footer: Aligned with standard page buttons */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors"
                    >
                        Discard Changes
                    </button>

                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                    >
                        <Save size={16} />
                        Update Provisioning
                    </button>
                </div>
            </div>
        </div>
    );
}