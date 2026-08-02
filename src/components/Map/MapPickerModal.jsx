'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { X, MapPin, Search, Navigation, CheckCircle2, Loader2, LocateFixed, AlertTriangle } from "lucide-react";

// Kept outside component scope to maintain strict reference equality
const LIBRARIES = ['places'];
const MAP_STYLES = [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off text" }] }
];

const DEFAULT_COORDS = { lat: 5.6037, lng: -0.1870 }; // Default: Accra, Ghana

export default function MapPickerModal({ isOpen, onClose, onConfirm, initialLocation }) {
    // Read Next.js public env variable safely
    const apiKey = "AIzaSyB-uZ5sb5KzDCf3Fjx-mZvD8_XaNhC0qyk"; // process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    // process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
        libraries: LIBRARIES
    });

    const [map, setMap] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [tempCoords, setTempCoords] = useState(DEFAULT_COORDS);
    const [resolvedAddress, setResolvedAddress] = useState("Locating...");
    const [searchValue, setSearchValue] = useState("");

    const skipNextGeocode = useRef(false);
    const isPanning = useRef(false);
    const debounceTimer = useRef(null);
    const geocodeRequestId = useRef(0);

    const mapOptions = useMemo(() => ({
        disableDefaultUI: true,
        clickableIcons: false,
        styles: MAP_STYLES,
        gestureHandling: "cooperative"
    }), []);

    // Helper to sanitize incoming location formats (handles objects vs array [lng, lat])
    const parseLocation = useCallback((loc) => {
        if (!loc) return DEFAULT_COORDS;
        if (Array.isArray(loc) && loc.length >= 2) {
            return { lng: Number(loc[0]) || DEFAULT_COORDS.lng, lat: Number(loc[1]) || DEFAULT_COORDS.lat };
        }
        if (typeof loc === 'object' && loc.lat !== undefined && loc.lng !== undefined) {
            return { lat: Number(loc.lat), lng: Number(loc.lng) };
        }
        return DEFAULT_COORDS;
    }, []);

    const fetchAddress = useCallback((lat, lng) => {
        if (typeof window === 'undefined' || !window.google || !window.google.maps) return;

        const currentRequestId = ++geocodeRequestId.current;
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (currentRequestId !== geocodeRequestId.current) return;

            if (status === "OK" && Array.isArray(results) && results[0]?.formatted_address) {
                const formatted = results[0].formatted_address;
                setResolvedAddress(formatted);
                setSearchValue(formatted);
            } else if (status === "OVER_QUERY_LIMIT") {
                setResolvedAddress(`Location near ${lat.toFixed(4)}, ${lng.toFixed(4)} (Rate limited)`);
            } else {
                setResolvedAddress(`Location near ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            }
        });
    }, []);

    useEffect(() => {
        if (isOpen && isLoaded) {
            const coords = parseLocation(initialLocation);
            setTempCoords(coords);
            fetchAddress(coords.lat, coords.lng);
        }
    }, [isOpen, isLoaded, initialLocation, fetchAddress, parseLocation]);

    const handleIdle = () => {
        if (map && !isPanning.current) {
            if (skipNextGeocode.current) {
                skipNextGeocode.current = false;
                return;
            }

            const center = map.getCenter();
            if (!center) return;

            const newCenter = center.toJSON();
            setTempCoords(newCenter);

            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                fetchAddress(newCenter.lat, newCenter.lng);
            }, 300);
        }
        isPanning.current = false;
    };

    const onPlaceChanged = () => {
        if (autocomplete && map) {
            const place = autocomplete.getPlace();
            if (place?.geometry?.location) {
                const location = place.geometry.location.toJSON();
                const addressText = place.formatted_address || place.name || "Selected Location";

                skipNextGeocode.current = true;
                isPanning.current = true;

                map.panTo(location);
                map.setZoom(17);

                setTempCoords(location);
                setResolvedAddress(addressText);
                setSearchValue(addressText);
            }
        }
    };

    const handleCurrentLocation = () => {
        if (typeof window !== 'undefined' && navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                    isPanning.current = true;
                    skipNextGeocode.current = false;

                    map.panTo(pos);
                    map.setZoom(17);
                    setTempCoords(pos);
                    fetchAddress(pos.lat, pos.lng);
                },
                (error) => {
                    console.error("Error retrieving current location:", error);
                }
            );
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm({ coordinates: tempCoords, address: resolvedAddress });
        }
        onClose();
    };

    if (!isOpen) return null;

    // Graceful error UI when Google Maps fails to load or API key is missing
    if (loadError || !apiKey) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Map Service Unavailable</h3>
                    <p className="text-xs text-slate-500">
                        {!apiKey
                            ? "Google Maps API Key is missing. Check your NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable."
                            : "Failed to load Google Maps script."}
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2.5 bg-slate-100 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">

                {/* SEARCH BAR */}
                <div className="absolute top-6 left-6 right-6 z-[110] flex gap-3">
                    <div className="flex-1">
                        {isLoaded && (
                            <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Search size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search for a place..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="w-full bg-white/95 backdrop-blur-md border border-slate-200 py-5 pl-14 pr-6 rounded-2xl shadow-2xl focus:outline-none font-bold text-sm text-slate-900"
                                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                    />
                                </div>
                            </Autocomplete>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-xl text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* MAP AREA */}
                <div className="flex-1 bg-slate-100 relative overflow-hidden">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            center={tempCoords}
                            zoom={15}
                            onLoad={setMap}
                            onIdle={handleIdle}
                            options={mapOptions}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="animate-spin text-indigo-600" size={32} />
                        </div>
                    )}

                    {/* CENTER PIN */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div className="flex flex-col items-center -translate-y-full">
                            <div className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg mb-2 shadow-2xl uppercase tracking-widest">
                                Pointing Here
                            </div>
                            <MapPin size={48} className="text-indigo-600 fill-indigo-600/20 drop-shadow-2xl" />
                        </div>
                    </div>

                    <button
                        onClick={handleCurrentLocation}
                        type="button"
                        className="absolute bottom-8 right-8 h-14 w-14 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all z-30"
                    >
                        <LocateFixed size={24} />
                    </button>
                </div>

                {/* PANEL */}
                <div className="bg-white border-t border-slate-100 p-8 shrink-0 z-40">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                                <Navigation size={28} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Address</h3>
                                <p className="text-xl font-black text-slate-900 uppercase leading-tight line-clamp-1">{resolvedAddress}</p>
                                <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                                    {tempCoords.lat.toFixed(6)}, {tempCoords.lng.toFixed(6)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-5 rounded-2xl font-black text-[11px] uppercase text-slate-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-3"
                            >
                                <CheckCircle2 size={20} /> Confirm Selection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}