import React, { useState, useMemo } from 'react';
import { Virtuoso, GroupedVirtuoso } from 'react-virtuoso';
import {
    Plus, Search, Box, Filter, ListPlus,
    UploadCloud, Database, Package, ChevronRight,
    CheckCircle2, Trash2, LayoutGrid, AlertCircle,
    Info, Tags, Layers, ChevronDown, BarChart3,
    ArrowUpRight, Activity, ShoppingBag, X, ArrowLeft
} from 'lucide-react';
import { BulkProductRow } from '../components/OperationsDashboard/setup/catalog/ProductElements';

const ProductsPage = () => {
    // --- DATA STATES --- (Removed SKU from logic)
    const [registry, setRegistry] = useState([
        { id: 3, name: 'Pepsi 500ml Case', categoryName: 'Beverages', subCategory: 'Soft Drinks', status: 'Active' },
        { id: 4, name: 'Golden Penny Spaghetti 500g', categoryName: 'Pasta', subCategory: 'Dry Pasta', status: 'Active' },
        { id: 12, name: 'Lipton Yellow Label Tea 100 Bags', categoryName: 'Beverages', subCategory: 'Tea', status: 'Active' }
    ]);

    // Hierarchy Definition
    const categoryTree = {
        'Beverages': ['Soft Drinks', 'Tea', 'Coffee', 'Water'],
        'Pasta': ['Dry Pasta', 'Fresh Pasta'],
        'Dairy': ['Milk', 'Cheese', 'Yogurt'],
        'Grains': ['Rice', 'Flour']
    };

    const [creationQueue, setCreationQueue] = useState([]);
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({ parent: "Beverages", child: "Soft Drinks" });
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsedGroups, setCollapsedGroups] = useState(new Set());

    // --- LOGIC: TOGGLE GROUP VISIBILITY ---
    const toggleGroup = (title) => {
        const newCollapsed = new Set(collapsedGroups);
        if (newCollapsed.has(title)) newCollapsed.delete(title);
        else newCollapsed.add(title);
        setCollapsedGroups(newCollapsed);
    };

    // --- SEARCH & GROUPING ---
    const { processedData, groupCounts, groupTitles } = useMemo(() => {
        const query = searchQuery.toLowerCase();
        const filtered = registry.filter(p =>
            p.name.toLowerCase().includes(query)
        );

        const groups = filtered.reduce((acc, item) => {
            if (!acc[item.categoryName]) acc[item.categoryName] = [];
            acc[item.categoryName].push(item);
            return acc;
        }, {});

        const sortedKeys = Object.keys(groups).sort();
        const displayData = sortedKeys.flatMap(k => collapsedGroups.has(k) ? [] : groups[k]);
        const displayCounts = sortedKeys.map(k => collapsedGroups.has(k) ? 0 : groups[k].length);

        return { processedData: displayData, groupCounts: displayCounts, groupTitles: sortedKeys };
    }, [registry, searchQuery, collapsedGroups]);

    // --- ACTION HANDLERS ---
    const addToQueue = () => {
        const newItem = {
            tempId: Date.now(),
            name: '',
            categoryName: selectedCategory.parent,
            subCategory: selectedCategory.child,
            status: 'Draft'
        };
        setCreationQueue(prev => [newItem, ...prev]);
        setIsBulkMode(true);
    };

    const cancelBatch = () => {
        if (creationQueue.length > 0) {
            if (window.confirm("Are you sure you want to cancel? All unsaved products will be lost.")) {
                setCreationQueue([]);
                setIsBulkMode(false);
            }
        } else {
            setIsBulkMode(false);
        }
    };

    const commitQueueToRegistry = () => {
        const validItems = creationQueue
            .filter(item => item.name.trim() !== '')
            .map(item => ({ ...item, id: item.tempId, status: 'Active' }));
        setRegistry(prev => [...prev, ...validItems]);
        setCreationQueue([]);
        setIsBulkMode(false);
    };

    return (
        <div className="h-screen bg-[#F1F5F9] flex flex-col antialiased overflow-hidden text-slate-900">
            {/* COMMERCIAL HEADER */}
            <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <Box size={18} />
                    </div>
                    <h1 className="text-sm font-black uppercase tracking-tight">Product <span className="text-indigo-600">Registry</span></h1>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600"><Activity size={18} /></button>
                    <div className="h-4 w-px bg-slate-200 mx-2" />
                    <button onClick={addToQueue} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm transition-all">
                        <Plus size={16} /> Add Products
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* LEFT: HIERARCHICAL SIDEBAR */}
                <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
                    <div className="p-4 border-b border-slate-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filter products..."
                                className="w-full bg-slate-100 border-none rounded-xl pl-9 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-h-0">
                        <GroupedVirtuoso
                            groupCounts={groupCounts}
                            groupContent={index => {
                                const title = groupTitles[index];
                                const isCollapsed = collapsedGroups.has(title);
                                return (
                                    <div
                                        onClick={() => toggleGroup(title)}
                                        className="bg-white border-b border-slate-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
                                        </div>
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-bold">{registry.filter(r => r.categoryName === title).length}</span>
                                    </div>
                                );
                            }}
                            itemContent={(index) => {
                                const p = processedData[index];
                                return (
                                    <div className="px-3 py-1 group border-b border-slate-50/50">
                                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-50/50 cursor-pointer transition-all">
                                            <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                            <div className="overflow-hidden">
                                                <p className="text-xs font-bold text-slate-700 truncate">{p.name}</p>
                                                <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">{p.subCategory}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </div>
                </aside>

                {/* RIGHT: COMMAND CENTER / WORKSPACE */}
                <main className="flex-1 overflow-y-auto relative bg-[#F8FAFC]">
                    {isBulkMode ? (
                        <div className="p-8 max-w-5xl mx-auto space-y-6">
                            
                            {/* BATCH HEADER WITH CLEAR CANCEL/BACK */}
                            <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={cancelBatch}
                                        className="p-2 bg-slate-800 hover:bg-rose-500 rounded-lg transition-colors group"
                                        title="Cancel and return"
                                    >
                                        <ArrowLeft size={18} className="text-slate-300 group-hover:text-white" />
                                    </button>
                                    <div>
                                        <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest leading-none mb-1">Creation Mode</p>
                                        <h2 className="text-xl font-black">{selectedCategory.parent} / {selectedCategory.child}</h2>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={cancelBatch} 
                                        className="text-xs font-bold text-slate-400 hover:text-rose-400 transition-colors"
                                    >
                                        Discard Batch
                                    </button>
                                    <button 
                                        onClick={commitQueueToRegistry} 
                                        className="bg-indigo-500 hover:bg-indigo-400 px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        Confirm & Publish
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-4 space-y-4">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase">Parent Category</label>
                                            <select
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10"
                                                value={selectedCategory.parent}
                                                onChange={(e) => setSelectedCategory({ parent: e.target.value, child: categoryTree[e.target.value][0] })}
                                            >
                                                {Object.keys(categoryTree).map(cat => <option key={cat}>{cat}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase">Sub Category</label>
                                            <select
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10"
                                                value={selectedCategory.child}
                                                onChange={(e) => setSelectedCategory({ ...selectedCategory, child: e.target.value })}
                                            >
                                                {categoryTree[selectedCategory.parent].map(sub => <option key={sub}>{sub}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <button onClick={addToQueue} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2">
                                        <Plus size={16} /> Add Product Row
                                    </button>
                                </div>

                                <div className="col-span-8 space-y-3">
                                    {creationQueue.map((item) => (
                                        <BulkProductRow
                                            key={item.tempId}
                                            product={{ ...item, categoryName: selectedCategory.parent, subCategory: selectedCategory.child }}
                                            onUpdate={(data) => setCreationQueue(q => q.map(it => it.tempId === item.tempId ? data : it))}
                                            onRemove={() => {
                                                const next = creationQueue.filter(it => it.tempId !== item.tempId);
                                                setCreationQueue(next);
                                                if (next.length === 0) setIsBulkMode(false);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* DASHBOARD */
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Products', value: registry.length, icon: Package, color: 'text-indigo-600' },
                                    { label: 'Active Items', value: '1,240', icon: CheckCircle2, color: 'text-emerald-600' },
                                    { label: 'Categories', value: Object.keys(categoryTree).length, icon: Layers, color: 'text-amber-600' },
                                    { label: 'System Load', value: '0.02ms', icon: Activity, color: 'text-rose-600' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}><stat.icon size={20} /></div>
                                            <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-lg">+12% <ArrowUpRight size={10} /></span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                        <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="font-black text-sm uppercase tracking-tight flex items-center gap-2">
                                        <BarChart3 size={18} className="text-indigo-500" /> Catalog Distribution
                                    </h3>
                                    <button className="text-[10px] font-bold text-indigo-600 hover:underline">Download Report</button>
                                </div>
                                <div className="p-12 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                        <LayoutGrid size={32} />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 uppercase">Registry Terminal</h4>
                                    <p className="text-xs text-slate-400 mt-1 max-w-sm">Detailed product analytics will populate here as you scale. Use the sidebar to browse existing catalog entries.</p>
                                    <button onClick={addToQueue} className="mt-6 bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center gap-2">
                                        <ListPlus size={16} /> Launch Batch Creator
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;