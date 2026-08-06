import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
    X,
    UserX,
    UserPlus,
    Search,
    Check,
    Trash2,
    ChevronDown,
    Shield,
    UserCheck,
    Briefcase,
    Sparkles,
    Tag,
} from "lucide-react";

// Enterprise staff directory mock
const DEFAULT_STAFF_DIRECTORY = [
    { id: "usr_101", name: "Kwame Mensah", email: "k.mensah@thonket.com" },
    { id: "usr_102", name: "Abena Osei", email: "a.osei@thonket.com" },
    { id: "usr_103", name: "Kofi Annan", email: "k.annan@thonket.com" },
    { id: "usr_104", name: "Esi Dankwa", email: "e.dankwa@thonket.com" },
    { id: "usr_105", name: "Yaa Asantewaa", email: "y.asantewaa@thonket.com" },
    { id: "usr_106", name: "Samuel Appiah", email: "s.appiah@thonket.com" },
];

// Pre-defined enterprise roles
const PREDEFINED_ROLES = [
    "Warehouse Manager",
    "Shift Supervisor",
    "Inventory Specialist",
    "Logistics Coordinator",
    "Forklift Operator",
    "Quality Assurance Inspector",
    "Custom...",
];

// Helper to apply dynamic badge styling based on role
const getRoleBadgeStyle = (role) => {
    switch (role) {
        case "Warehouse Manager":
            return "bg-purple-50 text-purple-700 border-purple-200/70";
        case "Shift Supervisor":
            return "bg-blue-50 text-blue-700 border-blue-200/70";
        case "Inventory Specialist":
            return "bg-emerald-50 text-emerald-700 border-emerald-200/70";
        case "Logistics Coordinator":
            return "bg-cyan-50 text-cyan-700 border-cyan-200/70";
        case "Forklift Operator":
            return "bg-amber-50 text-amber-700 border-amber-200/70";
        case "Quality Assurance Inspector":
            return "bg-rose-50 text-rose-700 border-rose-200/70";
        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
};

export default function StaffAssignmentModal({
    isOpen,
    onClose,
    warehouse,
    newStaff,
    setNewStaff,
    onAddStaff,
    onRemoveStaff,
    directory = DEFAULT_STAFF_DIRECTORY,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [selectedRoleOption, setSelectedRoleOption] = useState("Warehouse Manager");
    const [customRole, setCustomRole] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const staffDropdownRef = useRef(null);
    const roleDropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Sync state with incoming props
    useEffect(() => {
        if (newStaff?.userId) {
            setSearchTerm(newStaff.userId);
        } else {
            setSearchTerm("");
        }
    }, [newStaff?.userId]);

    // Handle click outside to close both dropdowns
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (staffDropdownRef.current && !staffDropdownRef.current.contains(e.target)) {
                setIsStaffDropdownOpen(false);
            }
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
                setIsRoleDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard shortcut listener (Escape key)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                if (isStaffDropdownOpen || isRoleDropdownOpen) {
                    setIsStaffDropdownOpen(false);
                    setIsRoleDropdownOpen(false);
                } else {
                    onClose();
                }
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isStaffDropdownOpen, isRoleDropdownOpen, onClose]);

    if (!isOpen || !warehouse) return null;

    const staffList = warehouse.staffAssignments || [];

    // Filtered search results
    const filteredDirectory = directory.filter(
        (person) =>
            person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectPerson = (person) => {
        setSearchTerm(person.name);
        setNewStaff({
            ...newStaff,
            userId: person.name,
            staffId: person.id,
        });
        setIsStaffDropdownOpen(false);
        setHighlightedIndex(-1);
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        setNewStaff({
            ...newStaff,
            userId: val,
        });
        setIsStaffDropdownOpen(true);
        setHighlightedIndex(-1);
    };

    // Keyboard navigation inside combobox
    const handleKeyDownCombobox = (e) => {
        if (!isStaffDropdownOpen) {
            if (e.key === "ArrowDown") {
                setIsStaffDropdownOpen(true);
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev < filteredDirectory.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredDirectory.length - 1
            );
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
            e.preventDefault();
            if (filteredDirectory[highlightedIndex]) {
                handleSelectPerson(filteredDirectory[highlightedIndex]);
            }
        }
    };

    const handleRoleSelect = (role) => {
        setSelectedRoleOption(role);
        setIsRoleDropdownOpen(false);
        if (role !== "Custom...") {
            setNewStaff({ ...newStaff, role });
        } else {
            setNewStaff({ ...newStaff, role: customRole });
        }
    };

    const handleCustomRoleChange = (e) => {
        const val = e.target.value;
        setCustomRole(val);
        setNewStaff({ ...newStaff, role: val });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newStaff.userId?.trim()) return;

        onAddStaff(e);
        // Reset local inputs
        setSearchTerm("");
        setCustomRole("");
        setSelectedRoleOption("Warehouse Manager");
        setIsStaffDropdownOpen(false);
        setIsRoleDropdownOpen(false);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 transform transition-all relative flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100/60 text-indigo-600 shrink-0">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 leading-snug">
                                Staff Assignments
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                                Facility: <span className="font-semibold text-slate-700">{warehouse.name}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Existing Assigned Personnel List */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Assigned Personnel ({staffList.length})
                        </span>
                    </div>

                    {/* Scrollbar hidden cleanly via Tailwind utility classes */}
                    <div className="space-y-2 max-h-48 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {staffList.length === 0 ? (
                            <div className="text-center py-7 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200/80 flex flex-col items-center justify-center">
                                <UserX className="w-7 h-7 text-slate-300 mb-1.5" />
                                <p className="text-xs font-semibold text-slate-600">No staff assigned yet</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Use the form below to assign facility contacts.</p>
                            </div>
                        ) : (
                            staffList.map((staff, idx) => (
                                <div
                                    key={staff.userId || idx}
                                    className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-all hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100/80 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200/50 shrink-0">
                                            {(staff.userId || "U").slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex flex-col gap-1">
                                            <p className="text-xs font-bold text-slate-800 leading-tight truncate">
                                                {staff.userId}
                                            </p>

                                            {/* Styled Role Badge */}
                                            {staff.role && (
                                                <div className="flex items-center">
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getRoleBadgeStyle(staff.role)}`}>
                                                        <Tag className="w-2.5 h-2.5 opacity-70" />
                                                        {staff.role}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {staff.isPrimary && (
                                            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200/60 flex items-center gap-1 shadow-2xs">
                                                <UserCheck className="w-3 h-3 text-amber-600" /> Primary
                                            </span>
                                        )}
                                        {onRemoveStaff && (
                                            <button
                                                type="button"
                                                onClick={() => onRemoveStaff(staff.userId)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Remove assignment"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-100 flex flex-col gap-3.5">
                    <div className="flex items-center gap-1.5">
                        <UserPlus className="w-4 h-4 text-indigo-600" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Assign New Staff
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
                        {/* Staff Search Combobox */}
                        <div className="relative" ref={staffDropdownRef}>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Staff Name / Identifier
                            </label>
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Type or select staff..."
                                    required
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                    onFocus={() => {
                                        setIsStaffDropdownOpen(true);
                                        setIsRoleDropdownOpen(false);
                                    }}
                                    onKeyDown={handleKeyDownCombobox}
                                    className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                                />
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setNewStaff({ ...newStaff, userId: "" });
                                            inputRef.current?.focus();
                                        }}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            {/* Combobox Dropdown Results */}
                            {isStaffDropdownOpen && (
                                <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 py-1 max-h-48 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden divide-y divide-slate-50">
                                    {filteredDirectory.length > 0 ? (
                                        filteredDirectory.map((person, index) => {
                                            const isHighlighted = highlightedIndex === index;
                                            const isSelected =
                                                searchTerm.toLowerCase() === person.name.toLowerCase();

                                            return (
                                                <button
                                                    key={person.id}
                                                    type="button"
                                                    onClick={() => handleSelectPerson(person)}
                                                    className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between ${isHighlighted
                                                            ? "bg-indigo-50/80"
                                                            : "hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-800">
                                                            {person.name}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-mono">
                                                            {person.email}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />
                                                    )}
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="px-3 py-2.5 text-[11px] text-slate-500 flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                            <span className="truncate">
                                                Assigning custom: <strong className="text-slate-700">"{searchTerm}"</strong>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Styled Role Select Dropdown */}
                        <div className="relative" ref={roleDropdownRef}>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Operational Role
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRoleDropdownOpen(!isRoleDropdownOpen);
                                    setIsStaffDropdownOpen(false);
                                }}
                                className={`w-full pl-9 pr-8 py-2 text-xs border rounded-xl bg-white text-left transition-all flex items-center justify-between font-medium text-slate-800 ${isRoleDropdownOpen
                                        ? "border-indigo-500 ring-2 ring-indigo-500/20"
                                        : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <span className="truncate">{selectedRoleOption}</span>
                                <ChevronDown
                                    className={`w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 pointer-events-none ${isRoleDropdownOpen ? "rotate-180 text-indigo-600" : ""
                                        }`}
                                />
                            </button>

                            {/* Role Dropdown Menu */}
                            {isRoleDropdownOpen && (
                                <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 py-1 max-h-52 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                    {PREDEFINED_ROLES.map((role) => {
                                        const isSelected = selectedRoleOption === role;
                                        return (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => handleRoleSelect(role)}
                                                className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between ${isSelected
                                                        ? "bg-indigo-50/70 text-indigo-900"
                                                        : "hover:bg-slate-50 text-slate-700"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    {role !== "Custom..." ? (
                                                        <span
                                                            className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md border truncate ${getRoleBadgeStyle(
                                                                role
                                                            )}`}
                                                        >
                                                            {role}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-500 italic text-xs">
                                                            Custom Role...
                                                        </span>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Custom Role Input Container */}
                    {selectedRoleOption === "Custom..." && (
                        <div className="animate-in fade-in slide-in-from-top-1 duration-150">
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Custom Role Title
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Regional Supervisor"
                                required
                                value={customRole}
                                onChange={handleCustomRoleChange}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800 font-medium bg-white"
                            />
                        </div>
                    )}

                    {/* Checkbox and Primary Action */}
                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={newStaff.isPrimary || false}
                                onChange={(e) =>
                                    setNewStaff({ ...newStaff, isPrimary: e.target.checked })
                                }
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500/20 border-slate-300 transition-colors"
                            />
                            Set as Primary Contact
                        </label>
                        <button
                            type="submit"
                            disabled={!newStaff.userId?.trim()}
                            className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs shadow-indigo-200 flex items-center gap-1.5"
                        >
                            <UserPlus className="w-3.5 h-3.5" />
                            Assign Staff
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}