import { useEffect, useState, useMemo } from "react";
import StaffHeader from "../components/Staff/StaffHeader";
import StaffStats from "../components/Staff/StaffStats";
import StaffTable from "../components/Staff/StaffTable";
import EditStaffModal from "../components/Staff/EditStaffModal";
import { Users, Terminal, ShieldCheck } from "lucide-react";

const mockStaff = [
    {
        id: 1,
        name: "Alice Johnson",
        role: "Admin",
        accessLevel: "SuperUser",
        email: "alice@thonket.com",
        status: "Active",
        lastActivity: "2026-04-03T10:00:00",
        permissions: ["All"],
        analytics: { label: "Security Audits", current: 12, target: 12, unit: "Tasks", type: "count" }
    },
    {
        id: 2,
        name: "Kwame Boateng",
        role: "Sales",
        accessLevel: "Standard",
        email: "kwame@thonket.com",
        status: "Active",
        lastActivity: "2026-04-03T09:15:00",
        permissions: ["Orders", "Customers"],
        analytics: { label: "Monthly Revenue", current: 42000, target: 60000, unit: "$", type: "currency" }
    },
    {
        id: 3,
        name: "Linda Mensah",
        role: "Logistics",
        accessLevel: "Restricted",
        email: "linda@thonket.com",
        status: "Away",
        lastActivity: "2026-04-02T17:45:00",
        permissions: ["Inventory", "Shipping"],
        analytics: { label: "Route Completion", current: 3, target: 5, unit: "Drops", type: "fraction" }
    }
];

export default function StaffPage() {
    const [staff, setStaff] = useState(mockStaff);
    const [search, setSearch] = useState("");
    const [modalStaff, setModalStaff] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const filteredStaff = useMemo(() => {
        return staff.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.role.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, staff]);

    const openEditModal = (staffMember) => {
        setModalStaff(staffMember);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalStaff(null);
        setModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Area: Scaled & Aligned to Provisioning style */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-100">
                                <Terminal size={18} />
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em]">
                                Systems Control / Staffing
                            </span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                                Staff <span className="text-indigo-600">Directory</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-sm italic flex items-center gap-2 mt-1">
                                Personnel Records
                                <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                <span className="text-slate-900 not-italic font-bold">{filteredStaff.length} Records Found</span>
                            </p>
                        </div>
                    </div>

                    <button className="flex items-center gap-2.5 px-7 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                        <Users size={16} strokeWidth={2.5} />
                        Add Personnel
                    </button>
                </div>

                {/* Analytics Section: Integrated into the layout flow */}
                <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <StaffStats staff={staff} />
                </section>

                {/* Main Data Container: Matches the "Manage Roles" Table Style */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.05)] overflow-hidden">
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/40 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-1 bg-indigo-600 rounded-full" />
                            <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-800">Personnel Registry</h3>
                        </div>
                        <StaffHeader search={search} setSearch={setSearch} />
                    </div>

                    <div className="p-0">
                        <StaffTable staff={filteredStaff} onEdit={openEditModal} />
                    </div>

                    {/* Compact Integrated Footer */}
                    <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-black uppercase tracking-widest">
                        <span>Thonket Enterprise — Secured Protocol</span>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-emerald-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live System
                            </span>
                            <span className="text-slate-300 italic not-italic">v4.0.12</span>
                        </div>
                    </div>
                </div>

                {modalOpen && <EditStaffModal staff={modalStaff} onClose={closeModal} />}
            </div>
        </div>
    );
}