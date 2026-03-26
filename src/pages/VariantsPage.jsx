import React, { useState } from 'react';
import { Plus, Save, Trash2, Search, Box, Database, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { VariantStatCard, BreadcrumbLink } from '../components/OperationsDashboard/setup/catalog/ProductVariant';

const initialVariants = [
    { id: 1, name: '500ml Pet Bottle', sku: 'COKE-500-PET', stock: 120, productName: 'Coca Cola', categoryName: 'Beverages', price: 10.50 },
    { id: 2, name: '1L Glass Bottle', sku: 'COKE-1000-GLS', stock: 45, productName: 'Coca Cola', categoryName: 'Beverages', price: 18.00 }
];

// =============================
// FILE: /setup/catalog/VariantsPage.jsx
// =============================
const VariantsPage = () => {
    const [variants, setVariants] = useState(initialVariants);
    const [selected, setSelected] = useState(variants[0]);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState(variants[0]);

    const handleSelect = (v) => {
        setIsCreating(false);
        setSelected(v);
        setFormData(v);
    };

    const initNewVariant = () => {
        setIsCreating(true);
        setSelected(null);
        setFormData({
            name: '',
            sku: '',
            stock: 0,
            price: 0,
            productName: 'Select Product...',
            categoryName: 'Auto-linked'
        });
    };

    const handleSave = () => {
        if (isCreating) {
            const newVar = { ...formData, id: Date.now() };
            setVariants([...variants, newVar]);
            setSelected(newVar);
            setIsCreating(false);
        } else {
            setVariants(variants.map(v => v.id === selected.id ? formData : v));
            setSelected(formData);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased">
            {/* HEADER */}
            <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                        <Box size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Variant Master</h1>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">SKU Level Inventory</p>
                    </div>
                </div>
                <button onClick={initNewVariant} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                    <Plus size={16} /> New SKU
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* SIDEBAR */}
                <aside className="w-85 bg-white border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input placeholder="Filter by SKU or name..." className="w-full bg-slate-50 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/10" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {variants.map(v => (
                            <button
                                key={v.id}
                                onClick={() => handleSelect(v)}
                                className={`w-full text-left p-4 rounded-2xl transition-all ${selected?.id === v.id && !isCreating ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'hover:bg-slate-50 text-slate-600'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-bold truncate pr-2">{v.name}</span>
                                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${selected?.id === v.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        {v.stock}
                                    </span>
                                </div>
                                <p className={`text-[10px] font-mono ${selected?.id === v.id ? 'text-emerald-100' : 'text-slate-400'}`}>{v.sku}</p>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* EDITOR */}
                <main className="flex-1 overflow-y-auto p-8">
                    {(selected || isCreating) ? (
                        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

                            {!isCreating && <BreadcrumbLink category={selected.categoryName} product={selected.productName} />}

                            {/* ACTION CARD */}
                            <div className="bg-white rounded-[28px] border border-slate-200 p-6 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><RefreshCw size={18} /></div>
                                    <h2 className="text-lg font-bold text-slate-900">{isCreating ? 'Define New Variant' : 'Inventory Details'}</h2>
                                </div>
                                <div className="flex gap-2">
                                    {!isCreating && <button className="p-2.5 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>}
                                    <button onClick={handleSave} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                                        <Save size={16} /> {isCreating ? 'Create Variant' : 'Update Stock'}
                                    </button>
                                </div>
                            </div>

                            {/* STATS STRIP */}
                            <div className="grid grid-cols-3 gap-4">
                                <VariantStatCard icon={Database} label="On Hand" value={formData.stock} colorClass="bg-blue-50 text-blue-600" />
                                <VariantStatCard icon={TrendingUp} label="Unit Price" value={`₵${formData.price}`} colorClass="bg-emerald-50 text-emerald-600" />
                                <VariantStatCard icon={AlertCircle} label="Status" value={formData.stock > 10 ? 'Healthy' : 'Low Stock'} colorClass={formData.stock > 10 ? 'bg-slate-50 text-slate-600' : 'bg-rose-50 text-rose-600'} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-[32px] border border-slate-200 p-8 space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration</h3>
                                    <div className="space-y-4">
                                        <Field label="Variant Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="e.g. Small / Red / 500ml" />
                                        <Field label="SKU Code" value={formData.sku} onChange={(v) => setFormData({ ...formData, sku: v })} placeholder="Unique Identifier" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-[32px] border border-slate-200 p-8 space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory & Pricing</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Current Stock" type="number" value={formData.stock} onChange={(v) => setFormData({ ...formData, stock: parseInt(v) })} />
                                        <Field label="Base Price" type="number" value={formData.price} onChange={(v) => setFormData({ ...formData, price: parseFloat(v) })} />
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Linked Product</label>
                                        <select
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 outline-none"
                                            value={formData.productName}
                                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                        >
                                            <option disabled>Select Product...</option>
                                            <option>Coca Cola</option>
                                            <option>Pepsi</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300">
                            <Box size={64} className="mb-4 opacity-20" />
                            <p className="font-bold">Select a variant to manage stock</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const Field = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl px-5 py-3 text-sm font-bold text-slate-900 transition-all outline-none"
        />
    </div>
);

export default VariantsPage;