import { useState, useEffect } from "react";
import RoleTable from "../components/ManageRole/RoleTable";
import EditRoleModal from "../components/ManageRole/EditRoleModal";
import CreateRoleForm from "../components/ManageRole/CreateRoleForm";
import { ShieldCheck, PlusCircle, XCircle } from "lucide-react";

const mockRoles = [
    { id: 1, name: "Operations Manager", permissions: ["view_users", "edit_users", "approve_credit", "view_reports"] },
    { id: 2, name: "Director", permissions: ["view_users", "approve_credit", "system_audit"] },
    { id: 3, name: "Sales Rep", permissions: ["create_orders", "view_users"] },
];

export default function ManageRolesPage() {
    const [roles, setRoles] = useState([]);
    const [modalRole, setModalRole] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => { setRoles(mockRoles); }, []);

    const handleRoleCreated = (newRole) => {
        setRoles((prev) => [{ ...newRole, id: prev.length + 1 }, ...prev]);
        setShowCreateForm(false);
    };

    const updateRole = (updated) => {
        setRoles(prev => prev.map(r => r.id === updated.id ? updated : r));
        setModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Header Section: Scaled down for better balance */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 px-1">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-100">
                                <ShieldCheck size={18} />
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em]">
                                Governance System
                            </span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                                Manage <span className="text-indigo-600">Roles</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-sm italic flex items-center gap-2 mt-1">
                                Permissions Architecture
                                <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                <span className="text-slate-400 not-italic font-semibold">Authority Matrix</span>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className={`group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${showCreateForm
                                ? "bg-white border border-red-200 text-red-600 hover:bg-red-50"
                                : "bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200"
                            }`}
                    >
                        {showCreateForm ? (
                            <><XCircle size={16} strokeWidth={2.5} /> Close Architect</>
                        ) : (
                            <><PlusCircle size={16} strokeWidth={2.5} /> New Role</>
                        )}
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="space-y-6">
                    {showCreateForm && (
                        <div className="animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-400">
                            <div className="bg-white rounded-[2rem] border border-indigo-50 p-1 shadow-xl shadow-indigo-50/50">
                                <CreateRoleForm onRoleCreated={handleRoleCreated} />
                            </div>
                        </div>
                    )}

                    {/* Table Container: Scaled border radius and depth */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.05)] overflow-hidden">
                        <RoleTable
                            roles={roles}
                            onEdit={(role) => {
                                setModalRole(role);
                                setModalOpen(true);
                            }}
                        />
                    </div>
                </div>

                {/* Footer Meta: Clean & Compact */}
                <div className="mt-10 px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <p>© 2026 Thonket Enterprise</p>
                        <span className="text-slate-200">|</span>
                        <p>Security: Alpha-7</p>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            System Live
                        </div>
                        <span className="text-slate-300 font-medium tracking-normal italic">v4.0.12</span>
                    </div>
                </div>

                {/* Edit Modal */}
                {modalOpen && (
                    <EditRoleModal
                        role={modalRole}
                        onClose={() => setModalOpen(false)}
                        onSave={updateRole}
                    />
                )}
            </div>
        </div>
    );
}