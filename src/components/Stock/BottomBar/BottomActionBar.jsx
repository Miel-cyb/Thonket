import React from "react";

import SaveDraftButton from "./SaveDraftButton";
import ValidateButton from "./ValidateButton";
import PostIntakeButton from "./PostIntakeButton";
import CancelButton from "./CancelButton";

/**
 * BottomActionBar
 * Primary transaction execution commit bar.
 * Safely anchors to the viewport bottom with clear action layout separation.
 */
const BottomActionBar = ({
    onSaveDraft,
    onValidate,
    onPostIntake,
    onCancel,
    canPost,
}) => {
    return (
        <div className="flex items-center justify-between w-full bg-white select-none">

            {/* ==========================================
               LEFT SIDE - STAGING & QUALITY ASSURANCE
               ========================================== */}
            <div className="flex items-center gap-3">
                {/* Secondary data safety save button style */}
                <div className="focus-within:ring-2 focus-within:ring-blue-500/20 rounded">
                    <SaveDraftButton onClick={onSaveDraft} />
                </div>

                {/* Mid-workflow auditing rule checklist trigger button */}
                <div className="focus-within:ring-2 focus-within:ring-blue-500/20 rounded">
                    <ValidateButton onClick={onValidate} />
                </div>
            </div>

            {/* ==========================================
               RIGHT SIDE - SYSTEM PROCESSING ACTIONS
               ========================================== */}
            <div className="flex items-center gap-3">
                {/* Main intake ledger post action button */}
                <div className={`transition-all duration-200 ${!canPost ? "opacity-60 cursor-not-allowed" : "focus-within:ring-2 focus-within:ring-blue-500/30 rounded"
                    }`}>
                    <PostIntakeButton
                        onClick={onPostIntake}
                        disabled={!canPost}
                    />
                </div>

                {/* Clear vertical boundary layout rule line split */}
                <span className="h-5 w-px bg-gray-200 mx-1" aria-hidden="true" />

                {/* Escape / Reject operation handler execution block */}
                <div className="focus-within:ring-2 focus-within:ring-red-500/20 rounded">
                    <CancelButton onClick={onCancel} />
                </div>
            </div>

        </div>
    );
};

export default BottomActionBar;