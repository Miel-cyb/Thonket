import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, UserX, UserPlus } from "lucide-react";

export default function StaffAssignmentModal({
    isOpen,
    onClose,
    warehouse,
    newStaff,
    setNewStaff,
    onAddStaff,
}) {
    // Keyboard listener for Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Render Guard
    if (!isOpen || !warehouse) return null;

    const staffList = warehouse.staffAssignments || [];

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 transform transition-all relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Staff Assignments</h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{warehouse.name}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Existing Staff List */}
                <div className="mt-4 space-y-2 max-h-52 overflow-y-auto pr-1">
                    {staffList.length === 0 ? (
                        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <UserX className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                            <p className="text-xs font-medium text-slate-500">No staff assigned to this facility yet.</p>
                        </div>
                    ) : (
                        staffList.map((staff, idx) => (
                            <div
                                key={staff.userId || idx}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{staff.userId}</p>
                                    <p className="text-xs text-slate-500">{staff.role}</p>
                                </div>
                                {staff.isPrimary && (
                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200/50">
                                        Primary
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Add Staff Form */}
                <form onSubmit={onAddStaff} className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <UserPlus className="w-3.5 h-3.5 text-indigo-500" />
                        Assign New Staff Member
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="User ID (e.g. usr_101)"
                            required
                            value={newStaff.userId}
                            onChange={(e) => setNewStaff({ ...newStaff, userId: e.target.value })}
                            className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Role (e.g. Supervisor)"
                            required
                            value={newStaff.role}
                            onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                            className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={newStaff.isPrimary}
                                onChange={(e) => setNewStaff({ ...newStaff, isPrimary: e.target.checked })}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                            />
                            Set as Primary Contact
                        </label>
                        <button
                            type="submit"
                            className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm shadow-indigo-200"
                        >
                            Assign Staff
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}