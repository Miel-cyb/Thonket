import React, { useState } from 'react';
import {
    Layers,
    Box,
    Plus,
    Tag,
    Percent,
    Settings,
    Search
} from 'lucide-react';
import ConfigTile from './ConfigTile'; // Importing the separated card component

/**
 * Main SystemConfiguration View Component
 */
export default function SystemConfiguration({
    navigate = (path) => console.log(`Navigating to: ${path}`)
}) {
    const [searchQuery, setSearchQuery] = useState('');

    // Static list configuration data structure
    const configTilesData = [
        {
            id: 'category-architecture',
            title: "Category Architecture",
            description: "Define the global taxonomy and parent-child relationships for all products.",
            icon: Layers,
            path: '/products/categories'
        },
        {
            id: 'master-product',
            title: "Master Product List",
            description: "Central repository for base SKU data, localized descriptions, and media.",
            icon: Box,
            path: '/products/list'
        },
        {
            id: 'variant-matrix',
            title: "Variant Matrix",
            description: "Manage dynamic attributes like weight-based pricing, size, and color variants.",
            icon: Plus,
            path: '/products/variants'
        },
        {
            id: 'price-optimization',
            title: "Price Optimization",
            description: "Configure wholesale tiers, regional tax rules, and dynamic base prices.",
            icon: Tag,
            path: '/products/pricing'
        },
        {
            id: 'promotion-logic',
            title: "Promotion Logic",
            description: "Set up advanced discount stacking, flash sale triggers, and coupon rules.",
            icon: Percent,
            path: '/products/promotions'
        },
        {
            id: 'operational-rules',
            title: "Operational Rules",
            description: "Define SLA thresholds, auto-dispatch logic, and courier priority weights.",
            icon: Settings,
            path: '/operations/rules'
        }
    ];

    // Client-side quick search filtering logic
    const filteredTiles = configTilesData.filter(tile =>
        tile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tile.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">

                {/* Header section with interactive search filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Infrastructure</h2>
                        <p className="text-[14px] font-medium text-slate-500">Manage catalog architecture and commercial rules</p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search settings..."
                            className="bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-3.5 text-sm w-full md:w-80 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                {/* Dynamic Responsive Grid Layout */}
                {filteredTiles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTiles.map((tile) => (
                            <ConfigTile
                                key={tile.id}
                                title={tile.title}
                                description={tile.description}
                                icon={tile.icon}
                                onClick={() => navigate(tile.path)}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty state view when no search results match */
                    <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <p className="text-sm font-medium text-slate-400">No infrastructure settings found matching "{searchQuery}"</p>
                    </div>
                )}

            </div>
        </div>
    );
}