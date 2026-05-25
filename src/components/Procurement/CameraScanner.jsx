import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Camera, ScanLine, XCircle } from "lucide-react";

/// CAMERA SCANNER COMPONENT - PREMIUM SCANNER UI
export default function CameraScanner({ onScan }) {
    const videoRef = useRef(null);
    const controlsRef = useRef(null);

    useEffect(() => {
        let active = true;

        const start = async () => {
            try {
                const reader = new BrowserMultiFormatReader();

                const devices =
                    await BrowserMultiFormatReader.listVideoInputDevices();

                const deviceId = devices?.[0]?.deviceId;

                if (!deviceId || !videoRef.current || !active) return;

                const controls = await reader.decodeFromVideoDevice(
                    deviceId,
                    videoRef.current,
                    (result) => {
                        if (result) {
                            onScan?.(result.getText());
                        }
                    }
                );

                controlsRef.current = controls;
            } catch (err) {
                console.error("Scanner init error:", err);
            }
        };

        start();

        return () => {
            active = false;
            controlsRef.current?.stop?.();
        };
    }, [onScan]);

    return (
        <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-black to-slate-900 shadow-xl">

            {/* HEADER OVERLAY */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-4 py-3">

                <div className="flex items-center gap-2 text-white/90">
                    <ScanLine size={18} />
                    <span className="text-xs font-semibold tracking-wide">
                        LIVE SCANNER
                    </span>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">

                    <Camera size={14} className="text-emerald-400 animate-pulse" />

                    <span className="text-[11px] font-medium text-white/80">
                        Camera Active
                    </span>
                </div>
            </div>

            {/* VIDEO AREA */}
            <div className="relative h-72 w-full">
                <video
                    ref={videoRef}
                    className="h-full w-full object-cover opacity-90"
                />

                {/* SCAN FRAME OVERLAY */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                    <div className="relative h-44 w-44">

                        {/* CORNERS */}
                        <div className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-emerald-400" />
                        <div className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-emerald-400" />
                        <div className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-emerald-400" />
                        <div className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-emerald-400" />

                        {/* SCAN LINE */}
                        <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-emerald-400/70 animate-pulse" />
                    </div>
                </div>

                {/* DARK VIGNETTE */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            </div>

            {/* FOOTER HELP */}
            <div className="flex items-center justify-between border-t border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">

                <div className="flex items-center gap-2 text-[11px] text-white/70">
                    <ScanLine size={14} />
                    Align barcode within frame
                </div>

                <button className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80 transition hover:bg-white/20">

                    <XCircle size={14} />

                    Stop
                </button>
            </div>
        </div>
    );
}