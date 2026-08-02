import React from "react";
import {
    X,
    MapPin,
    Navigation,
    Building2,
    Boxes,
    Snowflake,
    Globe,
    Hash,
    Compass,
} from "lucide-react";
// Import your map component here
import LocationPickerMap from "../../Map/MapPickerModal";

export default function WarehouseFormModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    isEditing,
}) {
    if (!isOpen) return null;

    // Standardized address state updates
    const handleAddressChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev?.address,
                [field]: value,
            },
        }));
    };

    // Handles updates triggered by Map selection to populate address and geo point
    const handleSelectLocation = ({ lng, lat, placeDetails = {} }) => {
        setFormData((prev) => ({
            ...prev,
            geoLocation: {
                ...prev?.geoLocation,
                type: "Point",
                coordinates: [Number(lng), Number(lat)],
            },
            address: {
                ...prev?.address,
                street:
                    placeDetails.street ||
                    placeDetails.name ||
                    prev?.address?.street ||
                    "",
                city: placeDetails.city || prev?.address?.city || "",
                region: placeDetails.region || prev?.address?.region || "",
                digitalAddress:
                    placeDetails.digitalAddress ||
                    placeDetails.postalCode ||
                    prev?.address?.digitalAddress ||
                    "",
            },
        }));
    };

    const [lng, lat] = formData?.geoLocation?.coordinates || [0, 0];
    const currentLocationLabel = formData?.address?.street
        ? `${formData.address.street}${formData.address.city ? `, ${formData.address.city}` : ""
        }`
        : "No location pinned on map";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-all duration-200">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[92vh] flex flex-col border border-slate-100 overflow-hidden font-sans">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-3.5">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                                {isEditing ? "Edit Warehouse" : "Create New Warehouse"}
                            </h2>
                            <p className="text-sm text-slate-500 font-normal mt-0.5">
                                Configure facility location, metadata, and operational limits.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-150"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <form onSubmit={onSubmit} className="overflow-y-auto p-6 space-y-6">

                    {/* General Metadata Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                                General Information
                            </span>
                            <div className="h-px bg-slate-100 flex-1" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Warehouse Name <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={formData.name || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="w-full pl-3.5 pr-3.5 py-3 text-base font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                                        placeholder="e.g. Takoradi Port Depot"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Facility Code <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={formData.code || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                code: e.target.value.toUpperCase(),
                                            })
                                        }
                                        className="w-full pl-9 pr-3.5 py-3 text-sm font-mono tracking-wider font-semibold uppercase text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                                        placeholder="TKD-PORT-03"
                                    />
                                    <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-4 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Integration Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-indigo-600" /> Geospatial Location
                            </span>
                            <span className="text-xs font-medium text-slate-400">
                                Click map to reverse-geocode address
                            </span>
                        </div>

                        {/* Interactive Map Wrapper */}
                        <div className="h-60 w-full rounded-2xl overflow-hidden border border-slate-200/80 relative bg-slate-100 shadow-inner group">
                            <LocationPickerMap
                                coordinates={[lng, lat]}
                                onSelectLocation={({ coordinates, placeDetails }) => {
                                    const [selectedLng, selectedLat] = coordinates || [0, 0];
                                    handleSelectLocation({
                                        lng: selectedLng,
                                        lat: selectedLat,
                                        placeDetails,
                                    });
                                }}
                            />

                            {/* Selected Location Banner Overlay */}
                            <div className="absolute top-3 left-3 right-3 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3 pointer-events-none z-10 transition-all">
                                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                    <Navigation className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 leading-none">
                                        Pinned Address
                                    </p>
                                    <p className="text-sm font-semibold text-slate-700 truncate mt-0.5">
                                        {currentLocationLabel}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Fields */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                                Address Details
                            </span>
                            <div className="h-px bg-slate-100 flex-1" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Street Address <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 12 Harbour Road, Sector 4"
                                    required
                                    value={formData.address?.street || ""}
                                    onChange={(e) =>
                                        handleAddressChange("street", e.target.value)
                                    }
                                    className="w-full px-3.5 py-3 text-base font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    City / Municipality <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Takoradi"
                                    required
                                    value={formData.address?.city || ""}
                                    onChange={(e) =>
                                        handleAddressChange("city", e.target.value)
                                    }
                                    className="w-full px-3.5 py-3 text-base font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    State / Region <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Western Region"
                                    required
                                    value={formData.address?.region || ""}
                                    onChange={(e) =>
                                        handleAddressChange("region", e.target.value)
                                    }
                                    className="w-full px-3.5 py-3 text-base font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Digital Address / GPS Postal Code <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="e.g. WS-000-0000"
                                        required
                                        value={formData.address?.digitalAddress || ""}
                                        onChange={(e) =>
                                            handleAddressChange("digitalAddress", e.target.value)
                                        }
                                        className="w-full pl-9 pr-3.5 py-3 text-sm font-mono text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                                    />
                                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-4 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Capacity & Features */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                                Operational Specifications
                            </span>
                            <div className="h-px bg-slate-100 flex-1" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Pallet Capacity <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={
                                            formData.storageCapacity?.maxPalletCapacity ?? ""
                                        }
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                storageCapacity: {
                                                    ...prev?.storageCapacity,
                                                    maxPalletCapacity: Number(e.target.value),
                                                },
                                            }))
                                        }
                                        className="w-full pl-9 pr-3.5 py-3 text-base font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition-all"
                                        placeholder="0"
                                    />
                                    <Boxes className="w-4 h-4 text-slate-400 absolute left-3 top-4 pointer-events-none" />
                                </div>
                            </div>

                            {/* Commercial Feature Toggle Card */}
                            <div className="sm:mt-6">
                                <label
                                    htmlFor="hasColdStorage"
                                    className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${formData.storageFeatures?.hasColdStorage
                                            ? "bg-cyan-50/60 border-cyan-200 text-cyan-900"
                                            : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100/50"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        id="hasColdStorage"
                                        checked={
                                            formData.storageFeatures?.hasColdStorage || false
                                        }
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                storageFeatures: {
                                                    ...prev?.storageFeatures,
                                                    hasColdStorage: e.target.checked,
                                                },
                                            }))
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`p-2.5 rounded-xl ${formData.storageFeatures?.hasColdStorage
                                                ? "bg-cyan-500 text-white"
                                                : "bg-slate-200 text-slate-500"
                                            }`}
                                    >
                                        <Snowflake className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">
                                            Cold Storage Unit
                                        </span>
                                        <span className="text-xs opacity-75">
                                            Temperature-controlled capabilities
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl shadow-sm shadow-indigo-200 transition-all focus:ring-2 focus:ring-indigo-500/20"
                        >
                            {isEditing ? "Save Changes" : "Create Warehouse"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}