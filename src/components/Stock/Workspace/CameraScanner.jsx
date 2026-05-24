import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

/**
 * CameraScanner (WAREHOUSE-GRADE UI VERSION)
 */
const CameraScanner = ({ onScan }) => {

    const videoRef = useRef(null);
    const readerRef = useRef(null);
    const controlsRef = useRef(null);

    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [status, setStatus] = useState("Idle");

    /* ================= LOAD CAMERAS ================= */
    useEffect(() => {
        const loadDevices = async () => {
            try {
                const list = await BrowserMultiFormatReader.listVideoInputDevices();
                setDevices(list);

                if (list?.length) {
                    setSelectedDevice(list[0].deviceId);
                }
            } catch (err) {
                console.error(err);
                setStatus("Camera access failed");
            }
        };

        loadDevices();
    }, []);

    /* ================= START ================= */
    const startScanner = async () => {
        if (!selectedDevice) return;

        try {
            setStatus("Starting camera...");

            const reader = new BrowserMultiFormatReader();
            readerRef.current = reader;

            const controls = await reader.decodeFromVideoDevice(
                selectedDevice,
                videoRef.current,
                (result) => {
                    if (result) {
                        setStatus("Barcode detected");
                        onScan?.(result.getText());
                    }
                }
            );

            controlsRef.current = controls;
            setIsScanning(true);
            setStatus("Scanning...");

        } catch (err) {
            console.error(err);
            setStatus("Camera error");
        }
    };

    /* ================= STOP ================= */
    const stopScanner = () => {
        try {
            controlsRef.current?.stop?.();
        } catch { }

        try {
            readerRef.current?.reset?.();
        } catch { }

        controlsRef.current = null;
        readerRef.current = null;

        setIsScanning(false);
        setStatus("Stopped");
    };

    /* ================= TOGGLE ================= */
    const toggleScanner = () => {
        if (isScanning) stopScanner();
        else startScanner();
    };

    /* ================= CAMERA CHANGE ================= */
    const handleDeviceChange = (e) => {
        setSelectedDevice(e.target.value);

        if (isScanning) {
            stopScanner();
            setTimeout(() => startScanner(), 300);
        }
    };

    /* ================= IMAGE SCAN ================= */
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const reader = new BrowserMultiFormatReader();
            const result = await reader.decodeFromImage(undefined, file);

            if (result) {
                setStatus("Image scanned");
                onScan?.(result.getText());
            }

        } catch (err) {
            console.error(err);
            setStatus("Image scan failed");
        }
    };

    return (
        <div className="w-full flex flex-col gap-3">

            {/* ================= TOP CONTROL BAR ================= */}
            <div className="flex items-center justify-between bg-slate-50 border rounded-lg p-2">

                {/* TOGGLE SWITCH */}
                <button
                    onClick={toggleScanner}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition
                        ${isScanning
                            ? "bg-red-500 text-white"
                            : "bg-emerald-500 text-white"
                        }`}
                >
                    {isScanning ? "Stop Scan" : "Start Scan"}
                </button>

                {/* CAMERA SELECT */}
                <select
                    value={selectedDevice || ""}
                    onChange={handleDeviceChange}
                    className="text-xs border rounded-md px-2 py-1 bg-white"
                >
                    {devices.map((d) => (
                        <option key={d.deviceId} value={d.deviceId}>
                            {d.label || "Camera"}
                        </option>
                    ))}
                </select>

                {/* UPLOAD */}
                <label className="text-xs px-3 py-1 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition">
                    Upload
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </label>

            </div>

            {/* ================= VIDEO PANEL ================= */}
            <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden border">

                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                />

                {/* SCAN FRAME GUIDE */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-2/3 h-1/2 border-2 border-dashed border-white/40 rounded-lg"></div>
                </div>

                {/* STATUS BAR */}
                <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] px-3 py-1 flex justify-between">
                    <span>{status}</span>
                    <span className={isScanning ? "text-green-400" : "text-red-400"}>
                        ● {isScanning ? "LIVE" : "OFF"}
                    </span>
                </div>

            </div>
        </div>
    );
};

export default CameraScanner;