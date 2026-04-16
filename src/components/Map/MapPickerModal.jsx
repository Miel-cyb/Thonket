'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { X, MapPin, Search, Navigation, CheckCircle2, Loader2, LocateFixed } from "lucide-react";

const LIBRARIES = ['places'];
const MAP_STYLES = [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] }
];

export default function MapPickerModal({ isOpen, onClose, onConfirm, initialLocation }) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyB-uZ5sb5KzDCf3Fjx-mZvD8_XaNhC0qyk',
        libraries: LIBRARIES
    });

    const [map, setMap] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [tempCoords, setTempCoords] = useState({ lat: 5.6037, lng: -0.1870 });
    const [resolvedAddress, setResolvedAddress] = useState("Locating...");

    // Crucial: This ref prevents handleIdle from overwriting search results
    const skipNextGeocode = useRef(false);
    const isPanning = useRef(false);

    const mapOptions = useMemo(() => ({
        disableDefaultUI: true,
        clickableIcons: false,
        styles: MAP_STYLES,
        gestureHandling: "greedy"
    }), []);

    const fetchAddress = useCallback((lat, lng) => {
        if (!window.google || !window.google.maps) return;
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                setResolvedAddress(results[0].formatted_address);
            } else {
                // Instead of "Unknown", show the coordinates so the user knows it's working
                setResolvedAddress(`Location near ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            }
        });
    }, []);

    useEffect(() => {
        if (isOpen && isLoaded) {
            const coords = initialLocation?.lat ? initialLocation : { lat: 5.6037, lng: -0.1870 };
            setTempCoords(coords);
            fetchAddress(coords.lat, coords.lng);
        }
    }, [isOpen, isLoaded, initialLocation, fetchAddress]);

    const handleIdle = () => {
        if (map && !isPanning.current) {
            // If we just selected a place from Autocomplete, DON'T reverse geocode
            if (skipNextGeocode.current) {
                skipNextGeocode.current = false;
                return;
            }
            const newCenter = map.getCenter().toJSON();
            setTempCoords(newCenter);
            fetchAddress(newCenter.lat, newCenter.lng);
        }
        isPanning.current = false;
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null && map) {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const location = place.geometry.location.toJSON();

                // Lock the geocoder! We already have the address from the search result.
                skipNextGeocode.current = true;
                isPanning.current = true;

                map.panTo(location);
                map.setZoom(17);

                setTempCoords(location);
                setResolvedAddress(place.formatted_address || place.name || "Selected Location");
            }
        }
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition((position) => {
                const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                isPanning.current = true;
                // We want to geocode current location because it's a raw coordinate
                skipNextGeocode.current = false;
                map.panTo(pos);
                map.setZoom(17);
                setTempCoords(pos);
                fetchAddress(pos.lat, pos.lng);
            });
        }
    };

    const handleConfirm = () => {
        onConfirm({ coordinates: tempCoords, address: resolvedAddress });
        onClose();
    };

    if (!isOpen) return null;

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
                                        className="w-full bg-white/95 backdrop-blur-md border border-slate-200 py-5 pl-14 pr-6 rounded-2xl shadow-2xl focus:outline-none font-bold text-sm text-slate-900"
                                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                    />
                                </div>
                            </Autocomplete>
                        )}
                    </div>
                    <button onClick={onClose} className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-xl text-slate-400 hover:text-red-500 transition-colors">
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
                    ) : <div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>}

                    {/* CENTER PIN */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div className="flex flex-col items-center -translate-y-full">
                            <div className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg mb-2 shadow-2xl uppercase tracking-widest">
                                Pointing Here
                            </div>
                            <MapPin size={48} className="text-indigo-600 fill-indigo-600/20 drop-shadow-2xl" />
                        </div>
                    </div>

                    <button onClick={handleCurrentLocation} className="absolute bottom-8 right-8 h-14 w-14 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all z-30">
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
                            <button onClick={onClose} className="px-8 py-5 rounded-2xl font-black text-[11px] uppercase text-slate-400">Cancel</button>
                            <button onClick={handleConfirm} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-3">
                                <CheckCircle2 size={20} /> Confirm Selection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}