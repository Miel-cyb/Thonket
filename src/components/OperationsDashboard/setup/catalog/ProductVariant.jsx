import React, { useRef, useState, useEffect } from 'react';
import {
    X,
    GripVertical,
    Tag,
    Image as ImageIcon,
    Hash,
    ChevronDown,
    Weight,
    Box,
    Layers,
    CheckCircle2,
    Circle,
    QrCode,
    Check,
    Type,
    Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

// Define structured property matrix
const AVAILABLE_ATTRIBUTES = {
    'Size': ['S', 'M', 'L', 'XL', 'XXL', 'Standard'],
    'Color': ['Red', 'Blue', 'Green', 'Black', 'White'],
    'Material': ['Cotton', 'Polyester', 'Plastic', 'Metal', 'Glass'],
    'Flavor': ['Vanilla', 'Chocolate', 'Strawberry', 'Original'],
};

export const ProductVariantElement = ({ variant = {}, onUpdate, onRemove }) => {
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    // Track active attribute type configuration workspace locally per row
    const [activeType, setActiveType] = useState('');

    // Dedicated state for custom text value inputs inside the dropdown options block
    const [customAttrValue, setCustomAttrValue] = useState('');

    // Local string buffer states to completely separate raw typing inputs from parent re-renders
    const [localPackFactor, setLocalPackFactor] = useState(variant.packagingFactor ?? '');
    const [localWeight, setLocalWeight] = useState(variant.weightKg ?? '');
    const [localVolume, setLocalVolume] = useState(variant.volumeM3 ?? '');

    // Synchronize local buffers only when the parent properties swap records explicitly
    useEffect(() => {
        setLocalPackFactor(variant.packagingFactor ?? '');
    }, [variant.packagingFactor]);

    useEffect(() => {
        setLocalWeight(variant.weightKg ?? '');
    }, [variant.weightKg]);

    useEffect(() => {
        setLocalVolume(variant.volumeM3 ?? '');
    }, [variant.volumeM3]);

    // Distribution packaging tiers
    const units = ['PCS', 'KG', 'L', 'BOX', 'CASE', 'PALLET'];

    // Pure Logistics & Multi-Attribute Structural State Matrix
    const v = {
        name: variant.name ?? '',
        sku: variant.sku ?? '',
        barcode: variant.barcode ?? '',
        unitOfMeasure: variant.unitOfMeasure ?? 'CASE',
        packagingFactor: variant.packagingFactor ?? '',
        weightKg: variant.weightKg ?? '',
        volumeM3: variant.volumeM3 ?? '',
        attributes: Array.isArray(variant.attributes) ? variant.attributes : [],
        isActive: variant.isActive ?? true,
        image: variant.image ?? ''
    };

    const update = (patch) => onUpdate({ ...v, ...patch });

    // Close panel cleanly on background layer interactions safely
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setActiveType('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (variant.image && variant.image.startsWith('blob:')) {
                URL.revokeObjectURL(variant.image);
            }
        };
    }, [variant.image]);

    const toastStyle = {
        borderRadius: '12px',
        background: '#0f172a',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '600',
        zIndex: 9999
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (v.image && v.image.startsWith('blob:')) {
                URL.revokeObjectURL(v.image);
            }
            update({ image: URL.createObjectURL(file) });
            toast.success(`Image linked to SKU: ${v.sku || 'Variant'}`, { style: toastStyle });
        }
    };

    const handleToggleAttribute = (type, value, isCurrentlySelected) => {
        if (isCurrentlySelected) {
            const updatedAttributes = v.attributes.filter(
                attr => !(attr.type.toLowerCase() === type.toLowerCase() && attr.value.toLowerCase() === value.toLowerCase())
            );
            update({ attributes: updatedAttributes });
        } else {
            const formalType = Object.keys(AVAILABLE_ATTRIBUTES).find(k => k.toLowerCase() === type.toLowerCase()) || type;
            const formalValue = (AVAILABLE_ATTRIBUTES[formalType] || []).find(v => v.toLowerCase() === value.toLowerCase()) || value;

            // Check duplicate selections
            const exists = v.attributes.some(
                attr => attr.type.toLowerCase() === formalType.toLowerCase() && attr.value.toLowerCase() === formalValue.toLowerCase()
            );

            if (!exists) {
                const updatedAttributes = [...v.attributes, { type: formalType, value: formalValue }];
                update({ attributes: updatedAttributes });
            }
        }
    };

    const handleAddCustomAttribute = () => {
        if (!customAttrValue.trim()) return;

        handleToggleAttribute(activeType, customAttrValue.trim(), false);
        setCustomAttrValue('');
    };

    const handleKeyDownCustomInput = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCustomAttribute();
        }
    };

    const inputBaseStyle = "w-full h-10 bg-white border border-slate-200 rounded-xl pl-9 pr-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400";
    const labelStyle = "text-xs font-semibold text-slate-600 uppercase tracking-wider ml-0.5";

    return (
        <div
            ref={containerRef}
            className={`flex flex-col lg:flex-row lg:items-center gap-5 p-5 border transition-all relative rounded-xl
            ${v.isActive ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50/70 border-slate-200/60 opacity-65 shadow-none'}
            ${activeType ? 'z-50' : 'z-10'}`}
            style={{ zIndex: activeType ? 50 : 10 }}
        >
            {/* Left Control Column: Drag & Media Handling */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Drag Anchor */}
                <div className="flex items-center justify-center cursor-grab active:cursor-grabbing h-14 w-6 text-slate-400 hover:text-slate-600 transition-colors">
                    <GripVertical size={20} />
                </div>

                {/* Media Box */}
                <div className="relative flex items-center justify-center shrink-0">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-14 h-14 border border-slate-200 bg-slate-50/80 rounded-xl flex items-center justify-center overflow-hidden hover:border-indigo-500 hover:bg-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                        {v.image ? (
                            <img src={v.image} alt="Variant" className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon size={20} className="text-slate-400" />
                        )}
                    </button>
                    <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageChange} />
                </div>
            </div>

            {/* Input Form Fields Workspace */}
            <div className="flex-1 grid grid-cols-12 gap-x-4 gap-y-4 min-w-0">

                {/* Variant Name Field */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-1.5">
                    <label className={labelStyle}>Variant Name</label>
                    <div className="relative">
                        <Type size={15} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            value={v.name}
                            onChange={(e) => update({ name: e.target.value })}
                            placeholder="Milk 160g x 48"
                            className={inputBaseStyle}
                        />
                    </div>
                </div>

                {/* Internal SKU Field */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-1.5">
                    <label className={labelStyle}>Internal SKU</label>
                    <div className="relative">
                        <Hash size={15} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => update({ sku: e.target.value.toUpperCase() })}
                            placeholder="CO-GOP-1L"
                            className={`${inputBaseStyle} font-semibold uppercase tracking-wide`}
                        />
                    </div>
                </div>

                {/* Global Barcode Field */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-1.5">
                    <label className={labelStyle}>Global Barcode</label>
                    <div className="relative">
                        <QrCode size={15} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            value={v.barcode}
                            onChange={(e) => update({ barcode: e.target.value })}
                            placeholder="6131234567..."
                            className={`${inputBaseStyle} font-mono`}
                        />
                    </div>
                </div>

                {/* Inline Attribute Workspace Tray */}
                <div className={`col-span-12 flex flex-col gap-1.5 ${activeType ? 'relative z-50' : 'relative z-10'}`}>
                    <label className={labelStyle}>Variant Specifications</label>

                    {/* Selector Hub Field */}
                    <div className="h-10 flex items-center bg-slate-50/80 border border-slate-200 rounded-xl px-3 gap-2 justify-between min-w-0 w-full">

                        {/* Interactive Dropdown Button Toggles */}
                        <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
                            {Object.keys(AVAILABLE_ATTRIBUTES).map((type) => {
                                const selectedValues = v.attributes
                                    .filter(attr => attr.type.toLowerCase() === type.toLowerCase())
                                    .map(attr => attr.value);

                                const hasActiveSelections = selectedValues.length > 0;
                                const isCurrent = activeType.toLowerCase() === type.toLowerCase();

                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => {
                                            setActiveType(isCurrent ? '' : type);
                                            setCustomAttrValue('');
                                        }}
                                        className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 select-none ${isCurrent
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : hasActiveSelections
                                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                                : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-100'
                                            }`}
                                    >
                                        <span>{type}</span>
                                        {hasActiveSelections && (
                                            <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${isCurrent ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-100/80 text-indigo-800'}`}>
                                                {selectedValues.length}
                                            </span>
                                        )}
                                        <ChevronDown size={12} className={`opacity-70 transition-transform ${isCurrent ? 'rotate-180' : ''}`} />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Attribute Status Tag */}
                        <div className="text-xs font-bold text-indigo-600 bg-indigo-50/50 border border-indigo-100/60 rounded-lg px-2.5 py-1 uppercase tracking-wider shrink-0 whitespace-nowrap ml-auto">
                            {v.attributes.length > 0 ? `${v.attributes.length} Selected` : 'Unlinked'}
                        </div>
                    </div>

                    {/* Active Values Active Badges Workspace */}
                    {v.attributes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1 bg-slate-50/40 border border-dashed border-slate-200 rounded-xl p-2.5">
                            {v.attributes.map((attr, idx) => (
                                <div
                                    key={`${attr.type}-${attr.value}-${idx}`}
                                    className="inline-flex items-center gap-2 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 transition-colors"
                                >
                                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">{attr.type}:</span>
                                    <span className="text-slate-800 font-semibold">{attr.value}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleAttribute(attr.type, attr.value, true)}
                                        className="text-slate-400 hover:text-rose-600 ml-0.5 p-0.5 rounded-md hover:bg-rose-50 transition-colors focus:outline-none"
                                    >
                                        <X size={13} strokeWidth={2.5} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Dropdown Options Absolute Drawer Overlay */}
                    {activeType && AVAILABLE_ATTRIBUTES[activeType] && (
                        <div className="absolute top-[44px] left-0 right-0 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-[100] animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Tag size={14} className="text-indigo-500" />
                                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Choose {activeType} Options</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveType('')}
                                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Options Mapping Options Row + Integrated Custom Typing Form */}
                            <div className="flex flex-wrap items-center gap-2 p-0.5">
                                {AVAILABLE_ATTRIBUTES[activeType].map((option) => {
                                    const isSelected = v.attributes.some(
                                        attr => attr.type.toLowerCase() === activeType.toLowerCase() && attr.value.toLowerCase() === option.toLowerCase()
                                    );

                                    return (
                                        <button
                                            type="button"
                                            key={option}
                                            onClick={() => handleToggleAttribute(activeType, option, isSelected)}
                                            className={`inline-flex items-center h-8 px-3.5 rounded-lg text-xs font-semibold transition-all gap-2 border cursor-pointer select-none
                                                ${isSelected
                                                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs hover:bg-indigo-100'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900'
                                                }`}
                                        >
                                            {isSelected && (
                                                <Check size={13} strokeWidth={3} className="text-indigo-600 shrink-0" />
                                            )}
                                            <span>{option}</span>
                                        </button>
                                    );
                                })}

                                {/* Enhanced Custom Typing Input Div to avoid layout bubbling refreshes */}
                                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5 h-8 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                                    <input
                                        type="text"
                                        value={customAttrValue}
                                        onChange={(e) => setCustomAttrValue(e.target.value)}
                                        onKeyDown={handleKeyDownCustomInput}
                                        placeholder={`Custom ${activeType}...`}
                                        className="bg-transparent h-full px-2 text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 w-36"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCustomAttribute}
                                        disabled={!customAttrValue.trim()}
                                        className="h-full px-2 bg-indigo-600 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-md flex items-center justify-center transition-all"
                                        title="Add Custom Option"
                                    >
                                        <Plus size={14} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Logistics UOM Dropdown */}
                <div className="col-span-6 sm:col-span-3 flex flex-col gap-1.5">
                    <label className={labelStyle}>Logistics UOM</label>
                    <div className="relative">
                        <Box size={15} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                        <select
                            value={v.unitOfMeasure}
                            onChange={(e) => update({ unitOfMeasure: e.target.value })}
                            className={`${inputBaseStyle} appearance-none cursor-pointer pr-9 font-semibold uppercase tracking-wide`}
                        >
                            {units.map(u => (
                                <option key={u} value={u} className="bg-white text-slate-800">{u}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Pack Factor Field */}
                <div className="col-span-6 sm:col-span-3 flex flex-col gap-1.5">
                    <label className={labelStyle}>Pack Factor</label>
                    <div className="relative">
                        <Layers size={15} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            value={localPackFactor}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d*$/.test(val)) {
                                    setLocalPackFactor(val);
                                }
                            }}
                            onBlur={() => {
                                const parsed = parseInt(localPackFactor, 10);
                                const fallback = isNaN(parsed) ? 1 : parsed;
                                setLocalPackFactor(String(fallback));
                                update({ packagingFactor: fallback });
                            }}
                            placeholder="1"
                            className={inputBaseStyle}
                        />
                    </div>
                </div>

                {/* Gross Weight Field */}
                <div className="col-span-6 sm:col-span-3 flex flex-col gap-1.5">
                    <label className={labelStyle}>Weight (KG)</label>
                    <div className="relative">
                        <Weight size={15} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            value={localWeight}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    setLocalWeight(val);
                                }
                            }}
                            onBlur={() => {
                                const sanitized = localWeight !== '' ? parseFloat(localWeight) || 0 : '';
                                setLocalWeight(String(sanitized));
                                update({ weightKg: sanitized });
                            }}
                            placeholder="0.00"
                            className={inputBaseStyle}
                        />
                    </div>
                </div>

                {/* Volume Field */}
                <div className="col-span-6 sm:col-span-3 flex flex-col gap-1.5">
                    <label className={labelStyle}>Volume (m³)</label>
                    <div className="relative">
                        <Box size={15} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            value={localVolume}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    setLocalVolume(val);
                                }
                            }}
                            onBlur={() => {
                                const sanitized = localVolume !== '' ? parseFloat(localVolume) || 0 : '';
                                setLocalVolume(String(sanitized));
                                update({ volumeM3: sanitized });
                            }}
                            placeholder="0.0000"
                            className={inputBaseStyle}
                        />
                    </div>
                </div>
            </div>

            {/* Right Control Column: Active Status & Row Actions */}
            <div className="flex flex-row lg:flex-col items-center justify-end lg:justify-center gap-1.5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-3 shrink-0">
                <button
                    type="button"
                    onClick={() => {
                        update({ isActive: !v.isActive });
                        toast(v.isActive ? "Variant set to inactive" : "Variant set to active", { style: toastStyle });
                    }}
                    className={`p-2.5 rounded-xl transition-all ${v.isActive ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-100'}`}
                    title={v.isActive ? "Deactivate Variant" : "Activate Variant"}
                >
                    {v.isActive ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>

                <button
                    type="button"
                    onClick={onRemove}
                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Record"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};