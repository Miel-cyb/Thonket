'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Filter, ChevronDown, ChevronRight, Search, Layers, X } from 'lucide-react';

const CategoryFilterToolbar = ({
    categories = [],
    selectedCategory = null,
    onSelectCategory = () => { },
    stockStatusFilter = 'All',
    onSelectStockStatus = () => { },
    className = '',
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedParentId, setExpandedParentId] = useState(null);

    // Helper: Safely identify "All" selections
    const isAllCategory = useCallback((cat) => {
        if (!cat) return true;
        if (typeof cat === 'string') {
            const trimmed = cat.trim().toLowerCase();
            return trimmed === '' || trimmed === 'all' || trimmed === 'all categories';
        }
        if (typeof cat === 'object') {
            const name = (cat.name || cat.categoryName || cat.label || '').trim().toLowerCase();
            return name === 'all' || name === 'all categories';
        }
        return false;
    }, []);

    // Helper: Extract display name safely from string or object
    const getCategoryName = useCallback((cat) => {
        if (!cat || isAllCategory(cat)) return '';
        if (typeof cat === 'string') return cat.trim();

        const possibleName =
            cat.name ||
            cat.categoryName ||
            cat.category_name ||
            cat.displayName ||
            cat.display_name ||
            cat.label ||
            cat.title ||
            cat.category_title ||
            cat.name_en ||
            cat.category?.name ||
            cat.category;

        return typeof possibleName === 'string' ? possibleName.trim() : '';
    }, [isAllCategory]);

    // Helper: Extract unique key/ID safely
    const getCategoryId = useCallback((cat, indexFallback = '') => {
        if (!cat || isAllCategory(cat)) return null;
        if (typeof cat === 'string') return cat.trim();

        const resolvedId = cat._id || cat.id || cat.categoryId || cat.category_id || cat.slug;
        if (resolvedId !== undefined && resolvedId !== null) return String(resolvedId);

        const name = getCategoryName(cat);
        return name ? `name-${name}` : `cat-fallback-${indexFallback}`;
    }, [getCategoryName, isAllCategory]);

    // Active category trackers
    const activeName = useMemo(() => {
        if (isAllCategory(selectedCategory)) return null;
        return typeof selectedCategory === 'string' ? selectedCategory.trim() : getCategoryName(selectedCategory);
    }, [selectedCategory, getCategoryName, isAllCategory]);

    const activeId = useMemo(() => {
        if (isAllCategory(selectedCategory)) return null;
        return typeof selectedCategory === 'string' ? selectedCategory.trim() : getCategoryId(selectedCategory);
    }, [selectedCategory, getCategoryId, isAllCategory]);

    // Match check between item and current selection
    const isCategorySelected = useCallback(
        (cat) => {
            if (!cat || isAllCategory(cat) || (!activeId && !activeName)) return false;
            const catId = getCategoryId(cat);
            const catName = getCategoryName(cat);

            if (activeId && catId && activeId.toLowerCase() === catId.toLowerCase()) return true;
            if (activeName && catName && activeName.toLowerCase() === catName.toLowerCase()) return true;

            return false;
        },
        [activeId, activeName, getCategoryId, getCategoryName, isAllCategory]
    );

    // Retrieve subcategories if items are nested objects
    const getSubcategories = useCallback((cat) => {
        if (!cat || typeof cat === 'string' || isAllCategory(cat)) return [];
        const subs = cat.children || cat.subcategories || cat.subs || cat.sub_categories || [];
        return Array.isArray(subs) ? subs : [];
    }, [isAllCategory]);

    // Clean category array: Filter out empty strings and redundant 'All' items
    const validCategories = useMemo(() => {
        if (!Array.isArray(categories)) return [];
        return categories.filter((cat) => {
            if (isAllCategory(cat)) return false;
            const name = getCategoryName(cat);
            return Boolean(name);
        });
    }, [categories, getCategoryName, isAllCategory]);

    // Active parent lookup for subcategory drawers
    const activeParent = useMemo(() => {
        if (!activeId && !activeName) return null;

        for (const parent of validCategories) {
            if (isCategorySelected(parent)) return parent;
            const children = getSubcategories(parent);
            if (children.some((child) => isCategorySelected(child))) {
                return parent;
            }
        }
        return null;
    }, [validCategories, activeId, activeName, isCategorySelected, getSubcategories]);

    const activeParentKey = activeParent ? getCategoryId(activeParent) : null;
    const effectiveExpandedId = expandedParentId ?? activeParentKey;

    const toggleExpand = (catKey, e) => {
        e.stopPropagation();
        setExpandedParentId((prev) => (prev === catKey ? null : catKey));
    };

    // Filter categories by user search query
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return validCategories;
        const query = searchQuery.toLowerCase().trim();

        return validCategories
            .map((cat, idx) => {
                const parentName = getCategoryName(cat).toLowerCase();
                const parentMatches = parentName.includes(query);

                const rawChildren = getSubcategories(cat);
                const matchingChildren = rawChildren.filter((child) =>
                    getCategoryName(child).toLowerCase().includes(query)
                );

                if (parentMatches || matchingChildren.length > 0) {
                    return {
                        ...(typeof cat === 'object' ? cat : { name: cat }),
                        filteredSubs: parentMatches ? rawChildren : matchingChildren,
                        _tempKey: getCategoryId(cat, idx),
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [validCategories, searchQuery, getCategoryName, getCategoryId, getSubcategories]);

    // Reset selection to All
    const handleSelectAll = () => {
        onSelectCategory(null);
        setExpandedParentId(null);
    };

    return (
        <div className={`flex flex-col gap-3.5 p-4 rounded-xl border border-border/80 bg-card shadow-xs transition-all font-sans antialiased ${className}`}>
            {/* TOOLBAR CONTROLS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-background border border-input text-sm rounded-lg pl-9 pr-9 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-foreground placeholder:text-muted-foreground transition-all"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Stock Health Filter */}
                <div className="flex items-center gap-2.5 min-w-[200px] shrink-0">
                    <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                    <select
                        value={stockStatusFilter}
                        onChange={(e) => onSelectStockStatus(e.target.value)}
                        className="w-full bg-background border border-input text-sm font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-foreground cursor-pointer transition-all"
                    >
                        <option value="All">All Health Statuses</option>
                        <option value="low">Low Stock (&lt; 10)</option>
                        <option value="out">Out of Stock (0)</option>
                        <option value="expired">Expiry Risk / Expired</option>
                    </select>
                </div>
            </div>

            {/* CATEGORIES WRAPPER */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* "All Categories" Reset Button */}
                <button
                    type="button"
                    onClick={handleSelectAll}
                    className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 shrink-0 border ${isAllCategory(selectedCategory)
                        ? 'bg-emerald-600 text-white shadow-xs border-emerald-600 font-semibold'
                        : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border-transparent'
                        }`}
                >
                    <Layers className="w-4 h-4" />
                    <span>All Categories</span>
                </button>

                {/* Render Categories */}
                {filteredCategories.map((cat, index) => {
                    const catName = getCategoryName(cat);
                    const catKey = cat._tempKey || getCategoryId(cat, index);

                    const children = cat.filteredSubs || getSubcategories(cat);
                    const hasChildren = children.length > 0;

                    const isDirectlySelected = isCategorySelected(cat);
                    const isParentActive = activeParentKey === catKey;
                    const isExpanded = effectiveExpandedId === catKey;

                    return (
                        <div key={catKey} className="inline-flex items-center">
                            <div
                                className={`inline-flex items-center rounded-lg border transition-all ${isDirectlySelected
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                    : isParentActive
                                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-semibold'
                                        : 'bg-background hover:bg-muted border-border text-foreground'
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => onSelectCategory(cat)}
                                    className="px-3 py-1.5 text-sm font-medium flex items-center gap-2"
                                >
                                    <span>{catName}</span>
                                    {hasChildren && (
                                        <span
                                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isDirectlySelected
                                                ? 'bg-white/20 text-white'
                                                : 'bg-muted-foreground/15 text-muted-foreground'
                                                }`}
                                        >
                                            {children.length}
                                        </span>
                                    )}
                                </button>

                                {hasChildren && (
                                    <button
                                        type="button"
                                        onClick={(e) => toggleExpand(catKey, e)}
                                        className="pr-2.5 pl-1 py-1.5 border-l border-border/40 hover:opacity-80 transition-opacity"
                                        aria-label="Toggle subcategories"
                                    >
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* NESTED SUBCATEGORIES DRAWER */}
            {filteredCategories.map((cat, index) => {
                const catName = getCategoryName(cat);
                const catKey = cat._tempKey || getCategoryId(cat, index);
                const children = (cat.filteredSubs || getSubcategories(cat)).filter(
                    (sub) => getCategoryName(sub).length > 0
                );

                const isExpanded = effectiveExpandedId === catKey;
                if (!isExpanded || children.length === 0) return null;

                return (
                    <div
                        key={`sub-drawer-${catKey}`}
                        className="p-3 rounded-xl bg-muted/30 border border-border/60 animate-in fade-in slide-in-from-top-1 duration-150 space-y-2"
                    >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>{catName} Subcategories</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => onSelectCategory(cat)}
                                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${isCategorySelected(cat)
                                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 font-semibold'
                                    : 'bg-background hover:bg-muted text-muted-foreground border-border/50'
                                    }`}
                            >
                                All {catName}
                            </button>

                            {children.map((sub, subIdx) => {
                                const subName = getCategoryName(sub);
                                const subKey = getCategoryId(sub, `${index}-${subIdx}`);
                                return (
                                    <button
                                        key={subKey}
                                        type="button"
                                        onClick={() => onSelectCategory(sub)}
                                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${isCategorySelected(sub)
                                            ? 'bg-emerald-600 text-white font-semibold border-emerald-600 shadow-xs'
                                            : 'bg-background hover:bg-muted border-border/70 text-foreground'
                                            }`}
                                    >
                                        {subName}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CategoryFilterToolbar;