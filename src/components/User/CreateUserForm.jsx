import { useState } from "react";
import {
    Shield, Landmark, MapPin, UserCheck,
    Briefcase, FileText, Globe, CreditCard,
    Plus, Trash2, Search, CheckCircle2,
    Phone, Building2, BadgeCheck, Mail, Smartphone
} from "lucide-react";

const roles = [
    { id: "mgr", name: "Operations Manager", access: "Full System", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { id: "sales", name: "Sales Rep", access: "Orders & Pricing", color: "text-blue-600 bg-blue-50 border-blue-100" },
    { id: "wh", name: "Warehouse Lead", access: "Stock & Logistics", color: "text-amber-600 bg-amber-50 border-amber-100" },
    { id: "acc", name: "Accountant", access: "Billing & Tax", color: "text-emerald-600 bg-emerald-50 border-emerald-100" }
];

const pendingStaff = [
    { id: "s1", name: "Kwame Mensah", email: "k.mensah@thonket.com", initial: "KM" },
    { id: "s2", name: "Sarah Boateng", email: "s.boateng@thonket.com", initial: "SB" },
    { id: "s3", name: "John Dumelo", email: "j.dumelo@thonket.com", initial: "JD" },
];

export default function CreateUserForm({ onUserCreated }) {
    const [userType, setUserType] = useState("customer");
    const [searchTerm, setSearchTerm] = useState("");
    const [branches, setBranches] = useState([{ id: Date.now(), name: "", location: "" }]);
    const [formData, setFormData] = useState({
        businessName: "", email: "", phone: "", taxId: "", creditLimit: "",
        selectedStaffId: "", assignedRole: ""
    });

    const addBranch = () => setBranches([...branches, { id: Date.now(), name: "", location: "" }]);
    const removeBranch = (id) => setBranches(branches.filter(b => b.id !== id));

    const filteredStaff = pendingStaff.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Darkened slate-500/600 for better contrast against white/slate-50 backgrounds
    const labelStyle = "block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 ml-1";
    const inputStyle = "w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 shadow-sm";

    return (
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

            {/* Top Navigation Toggle */}
            <div className="flex p-3 bg-slate-100/50 gap-2 border-b border-slate-100">
                <button
                    onClick={() => setUserType("customer")}
                    className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-widest ${userType === "customer" ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                >
                    <Landmark size={18} /> Wholesale Registry
                </button>
                <button
                    onClick={() => setUserType("staff")}
                    className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-widest ${userType === "staff" ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                >
                    <Shield size={18} /> Staff Authorization
                </button>
            </div>

            <div className="p-8 lg:p-12">
                {userType === "customer" ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">

                        {/* Section 1: Core Identity */}
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                    <Building2 size={20} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Business Profile</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <label className={labelStyle}>Legal Company Name</label>
                                    <input className={inputStyle} placeholder="Thonket Global Distribution" />
                                </div>
                                <div>
                                    <label className={labelStyle}>TIN / VAT Number</label>
                                    <input className={inputStyle} placeholder="P00-12345-X" />
                                </div>
                                <div>
                                    <label className={labelStyle}>Corporate Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input className={`${inputStyle} pl-12`} placeholder="office@company.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelStyle}>Mobile Number</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input className={`${inputStyle} pl-12`} placeholder="+233 24 000 0000" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelStyle}>Credit Limit (USD)</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input type="number" className={`${inputStyle} pl-12`} placeholder="50,000" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Distribution Points */}
                        <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200/60">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-indigo-600" size={20} />
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Branches</h3>
                                </div>
                                <button onClick={addBranch} className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {branches.map((branch, index) => (
                                    <div key={branch.id} className="flex flex-col md:flex-row gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in zoom-in-95 duration-200">
                                        <div className="md:w-1/3">
                                            <label className={labelStyle}>Branch Name</label>
                                            <input className="w-full bg-transparent font-bold text-slate-900 outline-none placeholder:text-slate-300" placeholder="e.g. Accra Central" />
                                        </div>
                                        <div className="flex-1 md:border-l md:pl-6 border-slate-100">
                                            <label className={labelStyle}>Full Physical Address</label>
                                            <input className="w-full bg-transparent text-sm font-bold text-slate-600 outline-none placeholder:text-slate-300" placeholder="Street, City, GPS Code" />
                                        </div>
                                        {branches.length > 1 && (
                                            <button onClick={() => removeBranch(branch.id)} className="self-center p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                ) : (
                    /* STAFF SECTION */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <label className={labelStyle}>Find Registered Account</label>
                                    <div className="relative">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                        <input
                                            className="w-full bg-slate-100 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-3xl py-5 pl-14 pr-6 text-slate-900 font-bold outline-none transition-all shadow-inner"
                                            placeholder="Name or email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredStaff.map(staff => (
                                        <div
                                            key={staff.id}
                                            onClick={() => setFormData({ ...formData, selectedStaffId: staff.id })}
                                            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${formData.selectedStaffId === staff.id ? "border-indigo-600 bg-indigo-50/50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300"}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-xl shadow-slate-200">{staff.initial}</div>
                                                <div>
                                                    <p className="font-black text-slate-900">{staff.name}</p>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{staff.email}</p>
                                                </div>
                                            </div>
                                            {formData.selectedStaffId === staff.id && <BadgeCheck className="text-indigo-600" size={24} />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className={labelStyle}>Assign System Role</label>
                                <div className="grid grid-cols-1 gap-4">
                                    {roles.map(role => (
                                        <button
                                            key={role.id}
                                            onClick={() => setFormData({ ...formData, assignedRole: role.id })}
                                            className={`group p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between ${formData.assignedRole === role.id ? "border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "border-slate-200 bg-white hover:border-slate-300"}`}
                                        >
                                            <div>
                                                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg mb-2 inline-block ${formData.assignedRole === role.id ? "bg-white/20 text-white" : role.color}`}>
                                                    {role.name}
                                                </span>
                                                <p className={`text-xs font-bold ${formData.assignedRole === role.id ? "text-indigo-50" : "text-slate-500"}`}>
                                                    {role.access}
                                                </p>
                                            </div>
                                            <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${formData.assignedRole === role.id ? "border-white" : "border-slate-300"}`}>
                                                {formData.assignedRole === role.id && <div className="h-3 w-3 bg-white rounded-full" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Bar */}
                <div className="mt-12 pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Integrity Verified</p>
                    </div>
                    <button className="w-full md:w-auto min-w-[300px] bg-slate-900 text-white rounded-2xl py-5 px-10 font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 hover:-translate-y-1 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3">
                        <CheckCircle2 size={18} />
                        {userType === "customer" ? "Confirm & Register Wholesaler" : "Authorize Staff Member"}
                    </button>
                </div>
            </div>
        </div>
    );
}