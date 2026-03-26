import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronDown, PackagePlus, Info } from 'lucide-react';

export const CreateCategoryModal = ({ isOpen, onClose, onCreate, categories = [] }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState('root');

    useEffect(() => {
        if (!isOpen) {
            setName('');
            setDescription('');
            setParentId('root');
        }
    }, [isOpen]);

    // Recursive function to flatten the inventory hierarchy for the dropdown
    const renderOptions = (items, depth = 0) => {
        return items.flatMap(cat => [
            <option key={cat.id} value={cat.id} className="py-2">
                {"\u00A0".repeat(depth * 4)}{depth > 0 ? "└─ " : ""} {cat.name}
            </option>,
            ...(cat.children ? renderOptions(cat.children, depth + 1) : [])
        ]);
    };

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const newCategory = {
            id: Date.now().toString(),
            name: name,
            slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            description: description,
            children: []
        };

        onCreate(newCategory, parentId === 'root' ? null : parentId);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* HEADER - Distribution Branding */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                            <PackagePlus size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Expand Product Line</h2>
                            <p className="text-sm text-slate-500 font-medium">Define new inventory classifications and hierarchy.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {/* HIERARCHY PLACEMENT */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Distribution Level
                            </label>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">REQUIRED</span>
                        </div>
                        <div className="relative group">
                            <select
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-900 transition-all outline-none appearance-none cursor-pointer group-hover:border-slate-200"
                            >
                                <option value="root">📁 Root Product Category (Top Level)</option>
                                {renderOptions(categories)}
                            </select>
                            <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                        </div>
                    </div>

                    {/* CATEGORY NAME */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                            Category Label
                        </label>
                        <input
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Cold Storage Poultry"
                            className="w-full bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-900 transition-all outline-none placeholder:text-slate-300 shadow-sm"
                        />
                    </div>

                    {/* INTERNAL DESCRIPTION */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                            Operational Details
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Specify handling requirements or SKU groupings..."
                            className="w-full bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-5 py-3.5 text-sm font-medium text-slate-600 transition-all outline-none resize-none shadow-sm"
                        />
                    </div>

                    {/* INFO BOX */}
                    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex gap-3">
                        <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[12px] text-amber-800 leading-relaxed font-medium">
                            Creating a sub-category will automatically link all associated SKUs to the parent distributor report.
                        </p>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-4 pt-4 border-t border-slate-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all border border-transparent hover:border-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-2 flex items-center justify-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
                        >
                            <Plus size={20} strokeWidth={3} /> Register Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};