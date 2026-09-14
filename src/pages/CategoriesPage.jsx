import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Plus, Save, Trash2, Globe, Layers,
    ShieldCheck, Search, Network,
    ArrowLeft, GitBranch, Settings2, ChevronRight, Menu,
    AlertTriangle, X
} from 'lucide-react';
import { CategoryItem } from '../components/OperationsDashboard/setup/catalog/CategoryItem';
import { CreateCategoryModal } from '../components/OperationsDashboard/setup/catalog/CreateCategoryForm';
import { API_ENDPOINTS } from '../utils/urls';
import { toast } from 'react-hot-toast';

const API_BASE = API_ENDPOINTS.CATEGORIES;

/**
 * Commercial-grade Confirmation Modal Component
 */
const ConfirmDialog = ({ isOpen, title, message, confirmText = 'Confirm', isDanger = false, onConfirm, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDanger ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{message}</p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all ${isDanger ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/10' : 'bg-slate-900 hover:bg-slate-800'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CategoriesPage = () => {
    const navigate = useNavigate();
    const { orgId } = useParams();
    const activeOrgId = orgId || 'ORG-DEFAULT';

    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Confirmation Modal States for Enterprise UX
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
    const [pendingNodeSelection, setPendingNodeSelection] = useState(null);
    const [initialFormState, setInitialFormState] = useState(null);

    // Track dirty form state accurately
    const isDirty = selected && initialFormState && (
        selected.name !== initialFormState.name ||
        selected.description !== initialFormState.description ||
        selected.isActive !== initialFormState.isActive
    );

    const fetchCategories = async (preserveSelectionId = null) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_BASE}/${activeOrgId}/hierarchy/all`);
            setCategories(data);

            const targetId = preserveSelectionId || selected?._id;
            if (targetId) {
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
                const updatedSelected = findNode(data, targetId);
                if (updatedSelected) {
                    setSelected(updatedSelected);
                    setInitialFormState({
                        name: updatedSelected.name,
                        description: updatedSelected.description,
                        isActive: updatedSelected.isActive ?? true
                    });
                } else if (data.length > 0) {
                    setSelected(data[0]);
                    setInitialFormState({
                        name: data[0].name,
                        description: data[0].description,
                        isActive: data[0].isActive ?? true
                    });
                }
            } else if (data.length > 0) {
                setSelected(data[0]);
                setInitialFormState({
                    name: data[0].name,
                    description: data[0].description,
                    isActive: data[0].isActive ?? true
                });
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch catalog taxonomy.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [activeOrgId]);

    const updateTreeLocal = (list, id, fields) => {
        return list.map((node) => {
            if (node._id === id) return { ...node, ...fields };
            if (node.children) return { ...node, children: updateTreeLocal(node.children, id, fields) };
            return node;
        });
    };

    const removeNodeFromTreeLocal = (list, id) => {
        return list
            .filter((node) => node._id !== id)
            .map((node) => {
                if (node.children) {
                    return { ...node, children: removeNodeFromTreeLocal(node.children, id) };
                }
                return node;
            });
    };

    // Node selection guard protecting unsaved data loss
    const handleSelectNodeAttempt = (node) => {
        if (selected && selected._id === node._id) return;
        if (isDirty) {
            setPendingNodeSelection(node);
            setUnsavedModalOpen(true);
        } else {
            setSelected(node);
            setInitialFormState({
                name: node.name,
                description: node.description,
                isActive: node.isActive ?? true
            });
            setSidebarOpen(false);
        }
    };

    const handleUpdate = async () => {
        if (!selected) return;

        // Comprehensive frontend input validation
        if (!selected.name || !selected.name.trim()) {
            toast.error('Category name cannot be empty.');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Updating category...');
        try {
            const generatedSlug = selected.name
                ? selected.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
                : selected.slug;

            const payload = {
                name: selected.name.trim(),
                description: selected.description ? selected.description.trim() : '',
                slug: generatedSlug,
                isActive: selected.isActive !== undefined ? selected.isActive : true
            };

            const response = await axios.patch(`${API_BASE}/${activeOrgId}/${selected._id}`, payload);
            // Handle different possible API response wrappers (e.g., response.data.data vs response.data)
            const updatedData = response.data?.data || response.data;

            setCategories(updateTreeLocal(categories, selected._id, updatedData));
            setSelected(updatedData);
            setInitialFormState({
                name: updatedData.name,
                description: updatedData.description,
                isActive: updatedData.isActive ?? true
            });

            toast.success('Category updated successfully!', { id: toastId });
        } catch (error) {
            console.error('Failed to update category:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || error.message || 'Server error occurred.';
            toast.error(`Update failed: ${errorMessage}`, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        if (!selected) return;
        setDeleteModalOpen(false);
        setLoading(true);
        try {
            await axios.delete(`${API_BASE}/${activeOrgId}/${selected._id}`);
            toast.success('Category successfully deleted.');
            const newCategories = removeNodeFromTreeLocal(categories, selected._id);
            setCategories(newCategories);
            setSelected(null);
            setInitialFormState(null);
        } catch (error) {
            console.error('Failed to delete category:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Deletion failed. Ensure child nodes or associated products are removed first.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (newCategory, parentId) => {
        setIsModalOpen(false);
        toast.success(`Category "${newCategory.name}" created successfully.`);
        await fetchCategories(newCategory._id);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
            {/* Enterprise Confirm Dialogs */}
            <ConfirmDialog
                isOpen={deleteModalOpen}
                title="Delete Category Node"
                message={`Are you sure you want to delete "${selected?.name}"? This action is permanent and affects downstream inventory assignments.`}
                confirmText="Delete Category"
                isDanger={true}
                onConfirm={handleDeleteCategory}
                onClose={() => setDeleteModalOpen(false)}
            />

            <ConfirmDialog
                isOpen={unsavedModalOpen}
                title="Unsaved Changes"
                message="You have unsaved changes on the current category configuration. Do you want to discard changes and switch nodes?"
                confirmText="Discard & Switch"
                isDanger={true}
                onConfirm={() => {
                    setUnsavedModalOpen(false);
                    if (pendingNodeSelection) {
                        setSelected(pendingNodeSelection);
                        setInitialFormState({
                            name: pendingNodeSelection.name,
                            description: pendingNodeSelection.description,
                            isActive: pendingNodeSelection.isActive ?? true
                        });
                        setPendingNodeSelection(null);
                    }
                    setSidebarOpen(false);
                }}
                onClose={() => {
                    setUnsavedModalOpen(false);
                    setPendingNodeSelection(null);
                }}
            />

            <CreateCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={handleCreateCategory}
                categories={categories}
                organizationId={activeOrgId}
            />

            {/* Header */}
            <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu size={22} />
                    </button>
                    <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md shadow-slate-900/10">
                        <Network size={22} />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-slate-900 tracking-tight">Product Category Manager</h1>
                        <p className="text-xs font-semibold text-slate-400">Enterprise Edition • Org: {activeOrgId}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(`/products/list`)}
                        className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all shadow-xs"
                    >
                        <Plus size={18} className="text-slate-500" /> Product Lists
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-600/10"
                    >
                        <Plus size={18} /> New Category
                    </button>
                </div>
            </header>

            {/* Layout Container */}
            <div className="flex flex-1 overflow-hidden relative">
                <div
                    className={`fixed inset-0 bg-slate-900/40 z-40 transition-opacity md:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setSidebarOpen(false)}
                />

                {/* Sidebar */}
                <aside className={`fixed md:static top-0 left-0 bottom-0 w-80 bg-white border-r border-slate-200 flex flex-col z-50 transform transition-transform duration-300 md:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 border-b border-slate-100">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filter taxonomy..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">Category Tree</p>
                        {categories
                            .filter(cat => cat.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(cat => (
                                <CategoryItem
                                    key={cat._id}
                                    item={cat}
                                    onSelect={handleSelectNodeAttempt}
                                    selectedId={selected?._id}
                                />
                            ))}
                    </nav>
                </aside>

                {/* Main Editor View */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    {selected ? (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors"
                                    >
                                        <ArrowLeft size={16} /> Back to Dashboard
                                    </button>

                                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider pt-1">
                                        <span>Catalog</span>
                                        <ChevronRight size={14} className="text-slate-300" />
                                        <span className="text-blue-600 font-bold">{selected.name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Widgets Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <Layers size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Children</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{selected.children?.length || 0}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                        <GitBranch size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Node ID</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-0.5">#{selected._id?.toString().slice(-4)}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                        <Settings2 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{(selected.children && selected.children.length > 0) ? 'Branch' : 'Leaf'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Configuration Panel Form */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-bold text-slate-900 text-base">General Configuration</h2>
                                            {isDirty && (
                                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-md border border-amber-200">
                                                    Unsaved Changes
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500">Manage category metadata and taxonomy placement.</p>
                                    </div>
                                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                                        <button
                                            type="button"
                                            onClick={() => setDeleteModalOpen(true)}
                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                            title="Delete Category"
                                            disabled={loading}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            className={`flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-xs ${loading || !isDirty ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            disabled={loading || !isDirty}
                                        >
                                            <Save size={18} /> Save Changes
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-0.5">Display Name</label>
                                            <input
                                                value={selected.name || ''}
                                                onChange={(e) => setSelected({ ...selected, name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-0.5">URL Key (Slug)</label>
                                            <div className="relative">
                                                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    value={selected.name ? selected.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : selected.slug || ''}
                                                    readOnly
                                                    className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-0.5">SEO Description</label>
                                        <textarea
                                            rows={4}
                                            value={selected.description || ''}
                                            onChange={(e) => setSelected({ ...selected, description: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-all outline-none resize-none"
                                            placeholder="Provide a comprehensive search description details..."
                                        />
                                    </div>

                                    {/* Visibility Segment */}
                                    <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-3.5">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-xs border border-slate-100 shrink-0">
                                                <ShieldCheck size={22} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 text-sm sm:text-base">Active Navigation</p>
                                                <p className="text-sm text-slate-500 mt-0.5">Determine if this category is visible in your client storefront menu configurations.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={selected.isActive || false}
                                                onChange={(e) => setSelected({ ...selected, isActive: e.target.checked })}
                                            />
                                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
                            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4 border border-slate-200/40 shadow-inner">
                                <Network size={28} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">No Node Selected</h3>
                            <p className="text-slate-500 text-sm max-w-xs mt-1">Select a taxonomic hierarchy tree row folder structure segment link from the left structural panel to review or customize values.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CategoriesPage;