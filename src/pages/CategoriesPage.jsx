'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus, Save, Trash2, Globe, Layers,
    ShieldCheck, Search, Network,
    ArrowLeft, GitBranch, Settings2, ChevronRight, Menu
} from 'lucide-react';
import { CategoryItem } from '../components/OperationsDashboard/setup/catalog/CategoryItem';
import { CreateCategoryModal } from '../components/OperationsDashboard/setup/catalog/CreateCategoryForm';
import { API_ENDPOINTS } from '../utils/urls';
import { toast } from 'react-hot-toast';

const API_BASE = API_ENDPOINTS.CATEGORIES;

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

    // Fetch full hierarchy
    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${API_BASE}/hierarchy/all`);

          //  console.log('Fetched categories:', data);
            setCategories(data);

            if (selected) {
                const findNode = (list, id) => {
                    for (const node of list) {
                        if (node._id === id) return node;
                        if (node.children) {
                            const childFound = findNode(node.children, id);
                            if (childFound) return childFound;
                        }
                    }
                    return null;
                };
                const updatedSelected = findNode(data, selected._id);
                if (updatedSelected) setSelected(updatedSelected);
            } else if (data.length > 0) setSelected(data[0]);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to fetch categories.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Recursive update local state
    const updateTreeLocal = (list, id, fields) => {
        return list.map((node) => {
            if (node._id === id) return { ...node, ...fields };
            if (node.children) return { ...node, children: updateTreeLocal(node.children, id, fields) };
            return node;
        });
    };

    // Update category API
    const handleUpdate = async (updates) => {
        if (!selected) return;
        setLoading(true);
        try {
            const payload = {
                ...updates,
                slug: updates.name
                    ? updates.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
                    : selected.slug,
                isActive: updates.isActive !== undefined ? updates.isActive : selected.isActive
            };

            const { data } = await axios.patch(`${API_BASE}/${selected._id}`, payload);

            setCategories(updateTreeLocal(categories, selected._id, data));
            setSelected(data);
            toast.success('Category updated successfully!');
        } catch (error) {
            console.error('Failed to update category:', error.response?.data || error.message);
            toast.error('Update failed. Check console.');
        } finally {
            setLoading(false);
        }
    };

    // Create category callback
    const handleCreateCategory = async (newCategory, parentId) => {
        setIsModalOpen(false);
        toast.success(`Category "${newCategory.name}" created!`);
        await fetchCategories(); // refresh tree
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased">
            <CreateCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={handleCreateCategory}
                categories={categories}
            />

            {/* Header */}
            <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu size={20} />
                    </button>
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

            {/* Layout */}
            <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
                {/* Mobile sidebar overlay */}
                <div className={`fixed inset-0 bg-black/30 z-20 transition-opacity md:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setSidebarOpen(false)}></div>

                {/* Sidebar */}
                <aside className={`fixed md:static top-0 left-0 h-full w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-30 transform transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
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
                        {categories
                            .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(cat => (
                                <CategoryItem
                                    key={cat._id}
                                    item={cat}
                                    onSelect={(node) => {
                                        setSelected(node);
                                        setSidebarOpen(false); // auto close on mobile
                                    }}
                                    selectedId={selected?._id}
                                />
                            ))}
                    </nav>
                </aside>

                {/* Main Editor */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    {selected ? (
                        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Back button */}
                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-bold mb-4"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>

                            {/* Breadcrumb */}
                            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                <span>Catalog</span>
                                <ChevronRight size={12} />
                                <span className="text-blue-600">{selected.name}</span>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                        <p className="text-xl font-black text-slate-900">#{selected._id.toString().slice(-4)}</p>
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

                            {/* Form */}
                            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden mt-4">
                                <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="font-bold text-slate-900 text-lg">General Configuration</h2>
                                        <p className="text-sm text-slate-500">Manage category metadata and taxonomy placement.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleUpdate({
                                                name: selected.name,
                                                description: selected.description,
                                                isActive: selected.isActive
                                            })}
                                            className={`flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            disabled={loading}
                                        >
                                            <Save size={18} /> Save Changes
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-10 space-y-10">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                                            <input
                                                value={selected.name}
                                                onChange={(e) => setSelected({ ...selected, name: e.target.value })}
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
                                            onChange={(e) => setSelected({ ...selected, description: e.target.value })}
                                            className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-3xl px-6 py-4 text-sm font-medium text-slate-700 transition-all outline-none shadow-inner resize-none"
                                        />
                                    </div>

                                    {/* Active Navigation */}
                                    <div className="p-6 sm:p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={selected.isActive || false}
                                                onChange={(e) => setSelected({ ...selected, isActive: e.target.checked })}
                                            />
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