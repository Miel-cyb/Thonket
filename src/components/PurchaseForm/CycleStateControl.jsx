import React, { useState, useEffect, useCallback } from "react";
import {
    FileText,
    Truck,
    PackageCheck,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowRight,
    X,
    AlertTriangle
} from "lucide-react";

export const STAGES = [
    { key: "requested", label: "Request Init", icon: FileText },
    { key: "approved", label: "Approved", icon: CheckCircle2 },
    { key: "in_transit", label: "In Transit", icon: Truck },
    { key: "receiving", label: "Gate Arrival", icon: PackageCheck },
    { key: "has_issues", label: "Exception Review", icon: AlertCircle },
    { key: "completed", label: "Closed/Archived", icon: CheckCircle2 },
    { key: "cancelled", label: "Cancelled Request", icon: XCircle }
];

// Allowed states that can be manually triggered via update click
const ALLOWED_UPDATE_STATES = ["approved", "cancelled"];

export default function CycleStateControl({
    currentStage = "requested",
    isUpdating = false,
    onHandleStateTransition
}) {
    // Tracks the stage pending confirmation from the modal
    const [pendingStage, setPendingStage] = useState(null);

    // Close modal helper
    const handleCloseModal = useCallback(() => {
        if (!isUpdating) {
            setPendingStage(null);
        }
    }, [isUpdating]);

    // Handle ESC key to dismiss modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                handleCloseModal();
            }
        };

        if (pendingStage) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [pendingStage, handleCloseModal]);

    // Executes transition back to parent component when confirmed
    const handleConfirmTransition = async () => {
        if (!pendingStage) return;
        const targetStageKey = pendingStage.key;

        if (onHandleStateTransition) {
            await onHandleStateTransition(targetStageKey);
        }
        setPendingStage(null);
    };

    const isCancelAction = pendingStage?.key === "cancelled";
    const currentStageObj = STAGES.find((s) => s.key === currentStage);

    return (
        <>
            <div className="w-full lg:w-80 shrink-0 bg-slate-50/50 p-6 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 border-slate-200">
                <div className="space-y-5">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            State Control Center
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            Authorize phase transitions manually across the procurement matrix lifecycle loop.
                        </p>
                    </div>

                    {/* TRANSACTION CONTEXT ADAPTIVE ROUTER CONTROLS */}
                    <div className="space-y-2">
                        {currentStage === "requested" && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left mb-3">
                                <p className="text-[11px] leading-relaxed font-medium text-amber-800">
                                    ⚠️ Awaiting internal managerial approval parameters prior to supplier dispatch channels.
                                </p>
                            </div>
                        )}

                        {STAGES.map((stg) => {
                            const IconComp = stg.icon;
                            const isSelected = currentStage === stg.key;
                            const isUpdatable = ALLOWED_UPDATE_STATES.includes(stg.key);
                            const isDisabled = isUpdating || isSelected || !isUpdatable;

                            return (
                                <button
                                    key={stg.key}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => setPendingStage(stg)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${isSelected
                                        ? "bg-indigo-600 text-white border-indigo-700 shadow-md font-bold"
                                        : isUpdatable
                                            ? "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm active:scale-[0.99]"
                                            : "bg-slate-100/70 text-slate-400 border-slate-200/60 cursor-not-allowed opacity-60"
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <IconComp
                                            size={15}
                                            className={
                                                isSelected
                                                    ? "text-white"
                                                    : isUpdatable
                                                        ? "text-slate-400"
                                                        : "text-slate-300"
                                            }
                                        />
                                        <span className="truncate">{stg.label}</span>
                                    </div>
                                    <span
                                        className={`text-[9px] font-mono shrink-0 ml-2 px-1.5 py-0.5 rounded ${isSelected
                                            ? "bg-indigo-700/60 text-indigo-100"
                                            : isUpdatable
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold"
                                                : "bg-slate-200/50 text-slate-400"
                                            }`}
                                    >
                                        {isSelected
                                            ? "Active"
                                            : isUpdatable
                                                ? "Action"
                                                : "Locked"}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 mt-8 pt-4 border-t border-slate-200 text-center uppercase tracking-wider">
                    Protected Ledger Node Document
                </div>
            </div>

            {/* CONFIRMATION POPUP MODAL */}
            {pendingStage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 relative transform transition-all animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top Close Button */}
                        <button
                            type="button"
                            disabled={isUpdating}
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                        >
                            <X size={16} />
                        </button>

                        {/* Modal Header */}
                        <div className="flex items-start gap-3.5">
                            <div
                                className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${isCancelAction
                                    ? "bg-rose-100 text-rose-600 border-rose-200"
                                    : "bg-indigo-50 text-indigo-600 border-indigo-100"
                                    }`}
                            >
                                {isCancelAction ? (
                                    <AlertTriangle size={22} />
                                ) : (
                                    <CheckCircle2 size={22} />
                                )}
                            </div>
                            <div className="pr-6">
                                <h4 className="text-base font-bold text-slate-900 leading-snug">
                                    {isCancelAction ? "Cancel This Request?" : "Approve Request?"}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    {isCancelAction
                                        ? "You are about to cancel this procurement request. Please confirm this decision."
                                        : "You are about to advance this request to the approved state."}
                                </p>
                            </div>
                        </div>

                        {/* Visual Stage Transition Indicator (From -> To) */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current State</span>
                                <span className="font-semibold text-slate-700 truncate">
                                    {currentStageObj?.label || currentStage}
                                </span>
                            </div>
                            <ArrowRight size={14} className="text-slate-400 shrink-0 mx-2" />
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">New State</span>
                                <span className={`font-bold truncate ${isCancelAction ? 'text-rose-600' : 'text-indigo-600'}`}>
                                    {pendingStage.label}
                                </span>
                            </div>
                        </div>

                        {/* Context Impact Warning Box */}
                        <div
                            className={`p-3.5 rounded-xl border text-xs leading-relaxed font-medium flex items-start gap-2.5 ${isCancelAction
                                ? "bg-rose-50 border-rose-200 text-rose-900"
                                : "bg-amber-50 border-amber-200 text-amber-900"
                                }`}
                        >
                            <AlertCircle size={16} className={`shrink-0 mt-0.5 ${isCancelAction ? 'text-rose-600' : 'text-amber-600'}`} />
                            <span>
                                {isCancelAction
                                    ? "This will halt all active logistics and procurement pipelines for this document."
                                    : "Approving will release downstream operations and notify supplier dispatch channels."}
                            </span>
                        </div>

                        {/* Action Buttons with Unambiguous Labels */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isUpdating}
                                onClick={handleCloseModal}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
                            >
                                Go Back
                            </button>
                            <button
                                type="button"
                                disabled={isUpdating}
                                onClick={handleConfirmTransition}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isCancelAction
                                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                                    } disabled:opacity-50`}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <span>
                                        {isCancelAction ? "Yes, Cancel Request" : "Yes, Approve Request"}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}