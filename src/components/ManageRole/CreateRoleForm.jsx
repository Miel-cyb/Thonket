import { useState } from "react";
import { CheckCircle2, KeyRound } from "lucide-react";

const availablePermissions = [
    { id: "view_users", label: "User Directory" },
    { id: "edit_users", label: "Identity Mod" },
    { id: "approve_credit", label: "Credit Authority" },
    { id: "create_orders", label: "Order Logic" },
    { id: "system_audit", label: "Audit Logs" }
];

export default function CreateRoleForm({ onRoleCreated }) {
    const [name, setName] = useState("");
    const [permissions, setPermissions] = useState([]);

    const labelStyle = "block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 ml-1";

    return (
        <form onSubmit={(e) => { e.preventDefault(); onRoleCreated({ name, permissions }); }}
            className="bg-white border-2 border-indigo-100 rounded-[2.5rem] p-8 lg:p-10 shadow-xl">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Role Name */}
                <div className="lg:col-span-1">
                    <label className={labelStyle}>Designation Title</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                        placeholder="e.g. Regional Director"
                    />
                </div>

                {/* Permissions Grid */}
                <div className="lg:col-span-2">
                    <label className={labelStyle}>Authority Matrix (Select Permissions)</label>
                    <div className="flex flex-wrap gap-3">
                        {availablePermissions.map(p => {
                            const isSelected = permissions.includes(p.id);
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setPermissions(prev => isSelected ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                                    className={`px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 
                                        ${isSelected ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"}`}
                                >
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex justify-end">
                <button type="submit" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-3">
                    <CheckCircle2 size={16} /> Deploy Role
                </button>
            </div>
        </form>
    );
}