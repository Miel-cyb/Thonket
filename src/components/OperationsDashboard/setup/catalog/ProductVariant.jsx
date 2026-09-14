import React, { useRef, useState, useEffect, useCallback } from 'react';
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

const DISTRIBUTION_UNITS = ['PCS', 'TIN', 'KG', 'L', 'BOX', 'CASE', 'PALLET'];

const TOAST_STYLE = {
    borderRadius: '12px',
    background: '#0f172a',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    zIndex: 9999
};

export const ProductVariantElement = ({ variant = {}, onUpdate, onRemove }) => {
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    // Track active attribute type configuration workspace locally per row
    const [activeType, setActiveType] = useState('');

    // Dedicated state for custom text value inputs inside the dropdown options block
    const [customAttrValue, setCustomAttrValue] = useState('');

    // Safely normalize variant record state with secure persistent ID fallbacks
    const v = {
        id: variant.id || variant._id || `var_${Math.random().toString(36).substring(2, 9)}`,
        name: variant.name ?? '',
        sku: variant.sku ?? '',
        barcode: variant.barcode ?? '',
        unitOfMeasure: variant.unitOfMeasure ?? 'CASE',
        packagingFactor: variant.packagingFactor ?? 1,
        weightKg: variant.weightKg ?? 0,
        volumeM3: variant.volumeM3 ?? 0,
        attributes: Array.isArray(variant.attributes) ? variant.attributes : [],
        isActive: variant.isActive ?? true,
        image: variant.image ?? ''
    };

    const update = useCallback((patch) => {
        onUpdate({ ...v, ...patch });
    }, [v.id, v.name, v.sku, v.barcode, v.unitOfMeasure, v.packagingFactor, v.weightKg, v.volumeM3, v.attributes, v.isActive, v.image, onUpdate]);

    // Close panel cleanly on background layer interactions
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

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (v.image && v.image.startsWith('blob:')) {
                URL.revokeObjectURL(v.image);
            }
            const newObjectUrl = URL.createObjectURL(file);
            update({ image: newObjectUrl });
            toast.success(`Image linked to SKU: ${v.sku || 'Variant'}`, { style: TOAST_STYLE });
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
            const formalValue = (AVAILABLE_ATTRIBUTES[formalType] || []).find(item => item.toLowerCase() === value.toLowerCase()) || value;

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
        if (!customAttrValue.trim() || !activeType) return;
        handleToggleAttribute(activeType, customAttrValue.trim(), false);
        setCustomAttrValue('');
    };

    const handleKeyDownCustomInput = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCustomAttribute();
        }
    };

    const inputBaseStyle = "w-full h-10 bg-white border border-slate-200 rounded-xl pl-9 pr-3 text-sm font-medium text-slate-800 shadow-xs outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400";
    const labelStyle = "text-xs font-semibold text-slate-600 uppercase tracking-wider ml-0.5";

    return (
        <div
            ref={containerRef}
            className={`flex flex-col lg:flex-row lg:items-center gap-5 p-5 border transition-all relative rounded-2xl bg-white
            ${v.isActive ? 'border-slate-200 shadow-xs' : 'bg-slate-50/70 border-slate-200/60 opacity-75 shadow-none'}
            ${activeType ? 'z-40 ring-2 ring-indigo-500/20' : 'z-10'}`}
        >
            {/* Left Control Column: Drag & Media Handling */}
            <div className="flex items-center gap-3 shrink-0">
                <div
                    aria-label="Reorder variant"
                    className="flex items-center justify-center cursor-grab active:cursor-grabbing h-14 w-6 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <GripVertical size={20} />
                </div>

                <div className="relative flex items-center justify-center shrink-0">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-14 h-14 border border-slate-200 bg-slate-50/80 rounded-xl flex items-center justify-center overflow-hidden hover:border-indigo-500 hover:bg-white shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        aria-label="Upload variant thumbnail"
                    >
                        {v.image ? (
                            <img src={v.image} alt={v.name || 'Variant thumbnail'} className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon size={20} className="text-slate-400" />
                        )}
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        aria-hidden="true"
                    />
                </div>
            </div>

            {/* Input Form Fields Workspace */}
            <div className="flex-1 grid grid-cols-12 gap-x-4 gap-y-4 min-w-0">

                {/* Variant Name Field */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-1.5">
                    <label className={labelStyle}>Variant Name</label>
                    <div className="relative">
                        <Type size={15} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={v.name}
                            onChange={(e) => update({ name: e.target.value })}
                            placeholder="e.g. Premium Milk 1L"
                            className={inputBaseStyle}
                        />
                    </div>
                </div>

                {/* Internal SKU Field */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-1.5">
                    <label className={labelStyle}>Internal SKU</label>
                    <div className="relative">
                        <Hash size={15} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
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
                    <label className={labelStyle}>Global Barcode (GTIN/UPC)</label>
                    <div className="relative">
                        <QrCode size={15} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={v.barcode}
                            onChange={(e) => update({ barcode: e.target.value })}
                            placeholder="613123456789"
                            className={`${inputBaseStyle} font-mono`}
                        />
                    </div>
                </div>

                {/* Inline Attribute Workspace Tray */}
                <div className="col-span-12 flex flex-col gap-1.5 relative">
                    <label className={labelStyle}>Variant Specifications</label>

                    <div className="h-10 flex items-center bg-slate-50/80 border border-slate-200 rounded-xl px-3 gap-2 justify-between min-w-0 w-full">
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
                                        aria-expanded={isCurrent}
                                        onClick={() => {
                                            setActiveType(isCurrent ? '' : type);
                                            setCustomAttrValue('');
                                        }}
                                        className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 select-none ${isCurrent
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : hasActiveSelections
                                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                                : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-150'
                                            }`}
                                    >
                                        <span>{type}</span>
                                        {hasActiveSelections && (
                                            <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${isCurrent ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-100/80 text-indigo-800'}`}>
                                                {selectedValues.length}
                                            </span>
                                        )}
                                        <ChevronDown size={12} className={`opacity-70 transition-transform ${isCurrent ? 'rotate-180' : ''}`} />
                                    </button>
                                );
                            })}
                        </div>

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
                                        aria-label={`Remove attribute ${attr.type}: ${attr.value}`}
                                    >
                                        <X size={13} strokeWidth={2.5} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Dropdown Options Absolute Drawer Overlay */}
                    {activeType && AVAILABLE_ATTRIBUTES[activeType] && (
                        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Tag size={14} className="text-indigo-500" />
                                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Choose {activeType} Options</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveType('')}
                                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors"
                                    aria-label="Close attribute drawer"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {AVAILABLE_ATTRIBUTES[activeType].map((option) => {
                                    const isSelected = v.attributes.some(
                                        attr => attr.type.toLowerCase() === activeType.toLowerCase() && attr.value.toLowerCase() === option.toLowerCase()
                                    );

                                    return (
                                        <button
                                            type="button"
                                            key={option}
                                            onClick={() => handleToggleAttribute(activeType, option, isSelected)}
                                            className={`inline-flex items-center h-8 px-3.5 rounded-lg text-xs font-semibold transition-all gap-2 border cursor-pointer select-none ${isSelected
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

                                {/* Custom Option Input Group */}
                                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5 h-8 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                                    <input
                                        type="text"
                                        value={customAttrValue}
                                        onChange={(e) => setCustomAttrValue(e.target.value)}
                                        onKeyDown={handleKeyDownCustomInput}
                                        placeholder={`Custom ${activeType}...`}
                                        aria-label={`Custom ${activeType} value`}
                                        className="bg-transparent h-full px-2 text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 w-36"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCustomAttribute}
                                        disabled={!customAttrValue.trim()}
                                        className="h-full px-2 bg-indigo-600 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-md flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
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
                            {DISTRIBUTION_UNITS.map(u => (
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
                        <Layers size={15} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            inputMode="numeric"
                            value={v.packagingFactor}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d*$/.test(val)) {
                                    update({ packagingFactor: val === '' ? '' : parseInt(val, 10) });
                                }
                            }}
                            onBlur={() => {
                                const parsed = parseInt(v.packagingFactor, 10);
                                const fallback = isNaN(parsed) || parsed < 1 ? 1 : parsed;
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
                        <Weight size={15} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            inputMode="decimal"
                            value={v.weightKg}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    update({ weightKg: val === '' ? '' : val });
                                }
                            }}
                            onBlur={() => {
                                const sanitized = v.weightKg !== '' && v.weightKg !== '.' ? parseFloat(v.weightKg) || 0 : 0;
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
                        <Box size={15} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            inputMode="decimal"
                            value={v.volumeM3}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    update({ volumeM3: val === '' ? '' : val });
                                }
                            }}
                            onBlur={() => {
                                const sanitized = v.volumeM3 !== '' && v.volumeM3 !== '.' ? parseFloat(v.volumeM3) || 0 : 0;
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
                        const newActiveState = !v.isActive;
                        update({ isActive: newActiveState });
                        toast(newActiveState ? "Variant set to active" : "Variant set to inactive", { style: TOAST_STYLE });
                    }}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer ${v.isActive ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-100'}`}
                    title={v.isActive ? "Deactivate Variant" : "Activate Variant"}
                    aria-label={v.isActive ? "Deactivate Variant" : "Activate Variant"}
                >
                    {v.isActive ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>

                <button
                    type="button"
                    onClick={onRemove}
                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    title="Delete Record"
                    aria-label="Delete Record"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};