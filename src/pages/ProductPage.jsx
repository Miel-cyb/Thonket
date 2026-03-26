import React, { useState, useMemo, useRef } from 'react';
import {
    Plus, Search, Box, Database, Package, ChevronRight,
    Trash2, Layers, ArrowLeft, GripVertical, Save,
    LayoutGrid, List, BarChart3, FolderTree, Hash,
    Tag, Image as ImageIcon, CheckCircle2, Circle,
    AlertTriangle, X
} from 'lucide-react';

// --- CONSTANTS ---
const CATEGORY_TREE = {
    'Beverages': ['Soft Drinks', 'Tea', 'Coffee', 'Water'],
    'Pasta': ['Dry Pasta', 'Fresh Pasta'],
    'Dairy': ['Milk', 'Cheese', 'Yogurt'],
    'Grains': ['Rice', 'Flour'],
    'Electronics': ['Phones', 'Laptops', 'Audio']
};

//const UOM_OPTIONS = ['pcs', 'kg', 'g', 'ml', 'ltr', 'box', 'set', 'pack'];

// --- UTILS ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- NEW COMPONENT: ProductVariantElement ---
export const ProductVariantElement = ({ variant, onUpdate, onRemove }) => {
    const fileInputRef = useRef(null);
    const units = ['pcs', 'kg', 'g', 'ml', 'ltr', 'box', 'set', 'pack'];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onUpdate({ ...variant, image: url });
        }
    };

    const toggleStatus = () => {
        onUpdate({ ...variant, status: variant.status === 'Active' ? 'Inactive' : 'Active' });
    };

    return (
        <div className={`flex items-center gap-3 pl-10 pr-4 py-2 border-l-2 transition-all duration-200 group/variant animate-in slide-in-from-left-2
            ${variant.status === 'Active' ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-100/30 border-slate-100 opacity-60'}`}>

            {/* Draggable & Status Toggle */}
            <div className="shrink-0 flex items-center gap-2">
                <GripVertical size={14} className="text-slate-300 opacity-0 group-hover/variant:opacity-100 cursor-grab" />
                <button
                    onClick={toggleStatus}
                    className={`transition-colors ${variant.status === 'Active' ? 'text-indigo-500' : 'text-slate-300'}`}
                >
                    {variant.status === 'Active' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </button>
            </div>

            {/* Variant Image Slot */}
            <div className="shrink-0">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden hover:border-indigo-400 transition-all"
                >
                    {variant.image ? (
                        <img src={variant.image} alt="SKU" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon size={14} className="text-slate-400" />
                    )}
                </button>
                <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/*" />
            </div>

            {/* SKU Field */}
            <div className="w-36 shrink-0">
                <div className="relative flex items-center">
                    <Hash size={11} className="absolute left-2.5 text-slate-400" />
                    <input
                        value={variant.sku}
                        onChange={(e) => onUpdate({ ...variant, sku: e.target.value.toUpperCase() })}
                        placeholder="SKU-0000"
                        className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-2 py-1.5 text-[10px] font-black text-slate-700 uppercase outline-none focus:border-indigo-400"
                    />
                </div>
            </div>

            {/* Attribute (Size/Type) */}
            <div className="w-28 shrink-0">
                <div className="relative flex items-center">
                    <Tag size={11} className="absolute left-2.5 text-slate-400" />
                    <input
                        value={variant.attribute}
                        onChange={(e) => onUpdate({ ...variant, attribute: e.target.value })}
                        placeholder="Size/Type"
                        className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-2 py-1.5 text-[10px] font-bold text-slate-600 outline-none focus:border-indigo-400"
                    />
                </div>
            </div>

            {/* Value */}
            <div className="w-40 shrink-0">
                <input
                    value={variant.value}
                    onChange={(e) => onUpdate({ ...variant, value: e.target.value })}
                    placeholder="Value (e.g. XL, 500)"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-400"
                />
            </div>

            {/* UOM Dropdown */}
            <div className="w-24 shrink-0">
                <select
                    value={variant.uom}
                    onChange={(e) => onUpdate({ ...variant, uom: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-600 outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                >
                    {units.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
                </select>
            </div>

            {/* Stock Input */}
            <div className="w-24 shrink-0">
                <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => onUpdate({ ...variant, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-black text-indigo-600 outline-none focus:border-indigo-400"
                />
            </div>

            {/* Remove Action */}
            <div className="ml-auto">
                <button onClick={onRemove} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

// --- STAT CARD ---
const StatCard = ({ icon: Icon, label, value, color, detail }) => (
    <div className="flex-1 min-w-[220px] bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center gap-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-inner`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-slate-800">{value.toLocaleString()}</p>
                {detail && <span className="text-[10px] text-rose-500 font-bold uppercase">{detail}</span>}
            </div>
        </div>
    </div>
);

// --- BULK PRODUCT CARD ---
const BulkProductCard = ({ product, onUpdate, onRemove }) => {
    const addVariant = () => {
        const newV = { id: generateId(), sku: '', attribute: '', value: '', uom: 'pcs', stock: 0, status: 'Active', image: null };
        onUpdate({ ...product, variants: [...product.variants, newV] });
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-indigo-500 shadow-sm">
                    <Package size={24} />
                </div>
                <div className="flex-1">
                    <input
                        value={product.name}
                        onChange={(e) => onUpdate({ ...product, name: e.target.value })}
                        placeholder="Enter Master Product Name..."
                        className="w-full bg-transparent border-none outline-none text-lg font-black text-slate-800 placeholder:text-slate-300"
                    />
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md uppercase">
                            {product.categoryName} • {product.subCategory}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={addVariant} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase hover:bg-indigo-700 transition-all shadow-md">
                        <Plus size={14} /> Add SKU
                    </button>
                    <button onClick={onRemove} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            <div>
                {/* Refined Header for New Variant Design */}
                <div className="flex items-center gap-3 pl-20 pr-4 py-2 bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <div className="w-36">SKU Identifier</div>
                    <div className="w-28">Attribute</div>
                    <div className="w-40">Value</div>
                    <div className="w-24">UOM</div>
                    <div className="w-24">Stock</div>
                    <div className="ml-auto pr-4">Actions</div>
                </div>

                {product.variants.map((v) => (
                    <ProductVariantElement
                        key={v.id}
                        variant={v}
                        onRemove={() => onUpdate({ ...product, variants: product.variants.filter(x => x.id !== v.id) })}
                        onUpdate={(updatedV) => onUpdate({
                            ...product,
                            variants: product.variants.map(x => x.id === v.id ? updatedV : x)
                        })}
                    />
                ))}

                {product.variants.length === 0 && (
                    <div className="p-10 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        No SKUs added yet
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
const ProductsPage = () => {
    const [viewMode, setViewMode] = useState('products');
    const [registry, setRegistry] = useState([
        {
            id: '1', name: 'Premium Coffee Blend', categoryName: 'Beverages', subCategory: 'Coffee', variants: [
                { id: 'v1', sku: 'COF-DRK-01', attribute: 'Roast', value: 'Dark', uom: 'bag', stock: 120, status: 'Active' },
                { id: 'v2', sku: 'COF-LGT-02', attribute: 'Roast', value: 'Light', uom: 'bag', stock: 5, status: 'Active' }
            ]
        }
    ]);
    const [creationQueue, setCreationQueue] = useState([]);
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCat, setSelectedCat] = useState('Beverages');
    const [selectedSub, setSelectedSub] = useState(CATEGORY_TREE['Beverages'][0]);

    const stats = useMemo(() => {
        const allV = registry.flatMap(p => p.variants);
        return {
            total: registry.length,
            skus: allV.length,
            stock: allV.reduce((a, b) => a + (b.stock || 0), 0),
            low: allV.filter(v => v.stock < 10).length
        };
    }, [registry]);

    const filteredData = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return registry.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.variants.some(v => v.sku.toLowerCase().includes(query))
        );
    }, [registry, searchQuery]);

    const allVariants = useMemo(() => {
        return registry.flatMap(p => p.variants.map(v => ({ ...v, productName: p.name })));
    }, [registry]);

    const handleSaveBatch = () => {
        const valid = creationQueue.filter(p => p.name.trim() !== '');
        setRegistry(prev => {
            const idsToRemove = new Set(valid.map(v => v.id));
            return [...prev.filter(p => !idsToRemove.has(p.id)), ...valid];
        });
        setIsBulkMode(false);
        setCreationQueue([]);
    };

    return (
        <div className="h-screen bg-[#F8FAFC] flex flex-col antialiased text-slate-900 font-sans overflow-hidden">
            <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-50 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <Box size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-tighter">Inventory<span className="text-indigo-600">OS</span></h1>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Management System</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setCreationQueue([{ id: generateId(), name: '', categoryName: selectedCat, subCategory: selectedSub, variants: [] }]);
                            setIsBulkMode(true);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100"
                    >
                        <Plus size={16} strokeWidth={3} /> New Product
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-5 space-y-4">
                        <div className="bg-slate-100 p-1 rounded-xl flex">
                            <button onClick={() => setViewMode('products')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'products' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
                                <LayoutGrid size={14} /> Products
                            </button>
                            <button onClick={() => setViewMode('variants')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'variants' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
                                <List size={14} /> Variants
                            </button>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                placeholder={`Search ${viewMode}...`}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-2">
                        {viewMode === 'products' ? (
                            filteredData.map(p => (
                                <div key={p.id} onClick={() => { setCreationQueue([p]); setIsBulkMode(true); }}
                                    className="p-4 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/50 cursor-pointer transition-all group bg-white shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">{p.subCategory}</span>
                                        <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate">{p.name}</h4>
                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                                            <Layers size={10} /> {p.variants.length} SKUs
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            allVariants.filter(v => v.sku.toLowerCase().includes(searchQuery.toLowerCase())).map(v => (
                                <div key={v.id} className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-indigo-500">
                                            {v.sku.substring(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-slate-800 truncate uppercase">{v.sku}</p>
                                            <p className="text-[9px] font-bold text-slate-400 truncate">{v.productName}</p>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded-md text-[9px] font-black ${v.stock < 10 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            {v.stock}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto bg-slate-50/50 relative">
                    <div className="max-w-6xl mx-auto p-8">
                        {!isBulkMode && (
                            <div className="flex gap-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                                <StatCard icon={Package} label="Total Products" value={stats.total} color="bg-indigo-600 text-white" />
                                <StatCard icon={Layers} label="Active Variants" value={stats.skus} color="bg-blue-500 text-white" />
                                <StatCard icon={BarChart3} label="Total Stock" value={stats.stock} color="bg-emerald-500 text-white" />
                                <StatCard icon={AlertTriangle} label="Low Stock" value={stats.low} color="bg-rose-500 text-white" detail={`${stats.low} Alerts`} />
                            </div>
                        )}

                        {isBulkMode ? (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-5">
                                        <button onClick={() => setIsBulkMode(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all">
                                            <ArrowLeft size={20} />
                                        </button>
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Configuration Mode</h2>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Editing Batch Group</p>
                                        </div>
                                    </div>
                                    <button onClick={handleSaveBatch} className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">
                                        <Save size={16} /> Commit Changes
                                    </button>
                                </div>

                                <div className="grid grid-cols-12 gap-8">
                                    <div className="col-span-3">
                                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-8">
                                            <div className="flex items-center gap-2 mb-6 text-indigo-500">
                                                <FolderTree size={18} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Taxonomy</span>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">Category</label>
                                                    <select
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] font-bold outline-none"
                                                        value={selectedCat}
                                                        onChange={e => { setSelectedCat(e.target.value); setSelectedSub(CATEGORY_TREE[e.target.value][0]); }}
                                                    >
                                                        {Object.keys(CATEGORY_TREE).map(c => <option key={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">Sub-Category</label>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {CATEGORY_TREE[selectedCat].map(s => (
                                                            <button key={s} onClick={() => setSelectedSub(s)}
                                                                className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${selectedSub === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'}`}>
                                                                {s}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-9">
                                        {creationQueue.map(item => (
                                            <BulkProductCard
                                                key={item.id}
                                                product={item}
                                                onUpdate={(data) => setCreationQueue(q => q.map(it => it.id === item.id ? data : it))}
                                                onRemove={() => setCreationQueue(q => q.filter(it => it.id !== item.id))}
                                            />
                                        ))}
                                        <button
                                            onClick={() => setCreationQueue([...creationQueue, { id: generateId(), name: '', categoryName: selectedCat, subCategory: selectedSub, variants: [] }])}
                                            className="w-full py-12 border-2 border-dashed border-slate-300 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-white transition-all group"
                                        >
                                            <Plus size={28} />
                                            <span className="text-xs font-black uppercase tracking-widest">Add Product to Batch</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                                <div className="w-32 h-32 bg-white rounded-[3rem] border border-slate-200 shadow-xl flex items-center justify-center text-slate-200 mb-8">
                                    <Database size={56} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Workspace Empty</h3>
                                <p className="text-slate-400 text-base mt-3 max-w-md font-medium leading-relaxed">
                                    Select an item from the sidebar to manage its details or tap <span className="text-indigo-600 font-bold">New Product</span> to start a batch.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;