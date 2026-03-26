import React, { useState } from 'react';
import {
    Plus, Save, Trash2, Globe, Layers,
    ShieldCheck, Search, Network,
    ArrowLeft, GitBranch, Settings2, ChevronRight
} from 'lucide-react';
import { CategoryItem } from '../components/OperationsDashboard/setup/catalog/CategoryItem';
import { CreateCategoryModal } from '../components/OperationsDashboard/setup/catalog/CreateCategoryForm';

const initialCategories = [
    {
        id: '1',
        name: 'Beverages',
        slug: 'beverages',
        description: 'All liquid refreshments',
        children: [
            { id: '1-1', name: 'Coffee & Tea', slug: 'coffee-tea', children: [] },
            {
                id: '1-2', name: 'Soft Drinks', slug: 'soft-drinks', children: [
                    { id: '1-2-1', name: 'Carbonated', slug: 'carbonated', children: [] },
                    { id: '1-2-2', name: 'Juices', slug: 'juices', children: [] }
                ]
            },
        ]
    },
    {
        id: '2',
        name: 'Fresh Produce',
        slug: 'fresh-produce',
        description: 'Farm-to-table vegetables and fruits',
        children: [
            { id: '2-1', name: 'Fruits', slug: 'fruits', children: [] },
            { id: '2-2', name: 'Vegetables', slug: 'vegetables', children: [] }
        ]
    }
];

const CategoriesPage = () => {
    const [categories, setCategories] = useState(initialCategories);
    const [selected, setSelected] = useState(initialCategories[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- RECURSIVE UPDATE LOGIC ---
    const handleUpdate = (updates) => {
        if (!selected) return;

        if (updates.name) {
            updates.slug = updates.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        }

        const updateTree = (list, id, fields) => {
            return list.map((node) => {
                if (node.id === id) return { ...node, ...fields };
                if (node.children) return { ...node, children: updateTree(node.children, id, fields) };
                return node;
            });
        };

        setCategories(updateTree(categories, selected.id, updates));
        setSelected({ ...selected, ...updates });
    };

    // --- RECURSIVE CREATE LOGIC ---
    const handleCreateCategory = (newCategory, parentId) => {
        if (!parentId) {
            // Case 1: Add to root
            setCategories([...categories, newCategory]);
        } else {
            // Case 2: Recursively find parent and add to children
            const insertNode = (list) => {
                return list.map((node) => {
                    if (node.id === parentId) {
                        return {
                            ...node,
                            children: [...(node.children || []), newCategory]
                        };
                    }
                    if (node.children && node.children.length > 0) {
                        return { ...node, children: insertNode(node.children) };
                    }
                    return node;
                });
            };
            setCategories(insertNode(categories));
        }

        // Auto-select the new category so the user can immediately edit it
        setSelected(newCategory);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased">
            {/* Modal now accepts the full categories tree and the create handler */}
            <CreateCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateCategory}
                categories={categories}
            />

            <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                        <Network size={20} />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Taxonomy Manager</h1>
                        <p className="text-[10px] font-bold text-slate-400">v2.4 Production</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                >
                    <Plus size={16} /> New Category
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* SIDEBAR */}
                <aside className="w-80 bg-white border-r border-slate-200 flex flex-col">
                    <div className="p-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filter taxonomy..."
                                className="w-full bg-slate-50 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Category Tree</p>
                        {categories.map(cat => (
                            <CategoryItem
                                key={cat.id}
                                item={cat}
                                onSelect={setSelected}
                                selectedId={selected?.id}
                            />
                        ))}
                    </nav>
                </aside>

                {/* MAIN EDITOR */}
                <main className="flex-1 overflow-y-auto p-8">
                    {selected ? (
                        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* BREADCRUMB */}
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>Catalog</span>
                                <ChevronRight size={12} />
                                <span className="text-blue-600">{selected.name}</span>
                            </div>

                            {/* STRUCTURAL STATS AREA */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <Layers size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Direct Children</p>
                                        <p className="text-xl font-black text-slate-900">{selected.children?.length || 0}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                        <GitBranch size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Node ID</p>
                                        <p className="text-xl font-black text-slate-900">#{selected.id.toString().slice(-4)}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                        <Settings2 size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</p>
                                        <p className="text-xl font-black text-slate-900">{selected.children?.length > 0 ? 'Branch' : 'Leaf'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* FORM AREA */}
                            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-bold text-slate-900 text-lg">General Configuration</h2>
                                        <p className="text-sm text-slate-500">Manage category metadata and taxonomy placement.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                                            <Save size={18} /> Save Changes
                                        </button>
                                    </div>
                                </div>

                                <div className="p-10 space-y-10">
                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                                            <input
                                                value={selected.name}
                                                onChange={(e) => handleUpdate({ name: e.target.value })}
                                                className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 transition-all outline-none shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Key (Slug)</label>
                                            <div className="relative">
                                                <Globe size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    value={selected.slug}
                                                    readOnly
                                                    className="w-full bg-slate-100 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-medium text-slate-500 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">SEO Description</label>
                                        <textarea
                                            rows={4}
                                            value={selected.description}
                                            onChange={(e) => handleUpdate({ description: e.target.value })}
                                            className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-3xl px-6 py-4 text-sm font-medium text-slate-700 transition-all outline-none shadow-inner resize-none"
                                        />
                                    </div>

                                    <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">Active Navigation</p>
                                                <p className="text-sm font-medium text-slate-500">Determine if this category is visible in the frontend menu.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <ArrowLeft className="mb-4 animate-bounce" />
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">No Category Selected</h3>
                            <p className="text-slate-500 text-sm max-w-[240px]">Select a node to edit its properties.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CategoriesPage;