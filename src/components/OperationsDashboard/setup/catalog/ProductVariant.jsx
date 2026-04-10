import React, { useRef } from 'react';
import {
    X,
    GripVertical,
    Tag,
    Image as ImageIcon,
    Hash,
    ChevronDown,
    Weight,
    Box,
    CheckCircle2,
    Circle
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductVariantElement = ({ variant = {}, onUpdate, onRemove }) => {
    const fileInputRef = useRef(null);
    const units = ['PCS', 'KG', 'L', 'BOX'];

    // ✅ Exactly aligned with your Mongoose Model
    const v = {
        name: variant.name ?? '',
        sku: variant.sku ?? '',
        unitOfMeasure: variant.unitOfMeasure ?? 'PCS',
        weightKg: variant.weightKg ?? 0,
        volumeM3: variant.volumeM3 ?? 0,
        attributes: variant.attributes ?? { type: '', value: '' }, // Supporting the Map/Object logic
        isActive: variant.isActive ?? true,
        image: variant.image ?? '' // UI-only field or added to model later
    };

    const update = (patch) => onUpdate({ ...v, ...patch });

    const toastStyle = {
        borderRadius: '12px',
        background: '#1e293b',
        color: '#fff',
        fontSize: '12px',
        fontWeight: '600',
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            update({ image: URL.createObjectURL(file) });
            toast.success(`Image added to ${v.sku || 'variant'}`, { style: toastStyle });
        }
    };

    return (
        <div
            className={`grid grid-cols-[40px_50px_200px_150px_180px_100px_100px_100px_auto]
            items-center gap-3 px-4 py-4 border-l-4 transition-all
            ${v.isActive ? 'bg-white border-indigo-500 shadow-sm' : 'bg-slate-50 border-slate-300 opacity-70'}`}
        >
            {/* 1. Drag Handle */}
            <div className="flex items-center justify-center">
                <GripVertical size={18} className="text-slate-300 cursor-grab active:cursor-grabbing" />
            </div>

            {/* 2. Image Slot */}
            <div className="relative group">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden bg-slate-50 hover:border-indigo-400 transition-colors"
                >
                    {v.image ? (
                        <img src={v.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon size={16} className="text-slate-400" />
                    )}
                </button>
                <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} />
            </div>

            {/* 3. Variant Name */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Variant Name</label>
                <input
                    value={v.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="e.g. Large / Red"
                    className="w-full border-slate-200 border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium"
                />
            </div>

            {/* 4. SKU */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">SKU Code</label>
                <div className="relative">
                    <Hash size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                        value={v.sku}
                        onChange={(e) => update({ sku: e.target.value.toUpperCase() })}
                        placeholder="AUTO"
                        className="w-full border-slate-200 border rounded-lg pl-7 pr-2 py-1.5 text-xs font-black tracking-wider focus:border-indigo-500 outline-none bg-slate-50/50"
                    />
                </div>
            </div>

            {/* 5. Attributes Map (Simplified to Key:Value for UI) */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Attributes</label>
                <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50/50">
                    <Tag size={12} className="text-slate-400" />
                    <input
                        value={v.attributes.type}
                        onChange={(e) => update({ attributes: { ...v.attributes, type: e.target.value } })}
                        placeholder="Size"
                        className="w-16 bg-transparent text-[11px] font-bold uppercase outline-none"
                    />
                    <span className="text-slate-300">:</span>
                    <input
                        value={v.attributes.value}
                        onChange={(e) => update({ attributes: { ...v.attributes, value: e.target.value } })}
                        placeholder="XL"
                        className="w-16 bg-transparent text-[11px] outline-none text-indigo-600 font-bold"
                    />
                </div>
            </div>

            {/* 6. Weight */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-center">Weight (Kg)</label>
                <div className="relative">
                    <Weight size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                        type="number"
                        value={v.weightKg}
                        onChange={(e) => update({ weightKg: parseFloat(e.target.value) || 0 })}
                        className="w-full border-slate-200 border rounded-lg pl-7 pr-2 py-1.5 text-xs font-bold text-slate-700 outline-none"
                    />
                </div>
            </div>

            {/* 7. Volume */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-center">Vol (m³)</label>
                <div className="relative">
                    <Box size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                        type="number"
                        value={v.volumeM3}
                        onChange={(e) => update({ volumeM3: parseFloat(e.target.value) || 0 })}
                        className="w-full border-slate-200 border rounded-lg pl-7 pr-2 py-1.5 text-xs font-bold text-slate-700 outline-none"
                    />
                </div>
            </div>

            {/* 8. UOM Selection */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">UOM</label>
                <div className="relative">
                    <select
                        value={v.unitOfMeasure}
                        onChange={(e) => update({ unitOfMeasure: e.target.value })}
                        className="w-full border-slate-200 border rounded-lg px-2 py-2 text-[10px] font-black uppercase tracking-tighter bg-white outline-none appearance-none cursor-pointer"
                    >
                        {units.map(u => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-2.5 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* 9. Actions */}
            <div className="flex items-center gap-1 justify-end pt-5">
                <button
                    onClick={() => {
                        update({ isActive: !v.isActive });
                        toast(v.isActive ? "Variant Disabled" : "Variant Enabled", { style: toastStyle });
                    }}
                    className={`p-2 rounded-lg transition-colors ${v.isActive ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-100'}`}
                >
                    {v.isActive ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <button
                    onClick={onRemove}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};