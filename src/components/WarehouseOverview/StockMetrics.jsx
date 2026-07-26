'use client';

import React from 'react';
import {
    Boxes,
    Package,
    Layers,
    AlertTriangle,
    XCircle,
    Clock,
    AlertOctagon,
    BookmarkCheck,
    Truck,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
} from 'lucide-react';

const StockMetrics = ({ metrics }) => {
    // Default fallback values matching the requested spec
    const data = {
        totalSKUs: metrics?.totalSKUs ?? 850,
        availableStock: metrics?.availableStock ?? '1.2M Units',
        stockBatches: metrics?.stockBatches ?? '2,400',
        lowStockCount: metrics?.lowStockCount ?? 45,
        outOfStockCount: metrics?.outOfStockCount ?? 12,
        expiringCount: metrics?.expiringCount ?? 35,
        damagedCount: metrics?.damagedCount ?? 120,
        reservedStock: metrics?.reservedStock ?? '15,000 Units',
        incomingStock: metrics?.incomingStock ?? '50,000 Units',
        todaysInbound: metrics?.todaysInbound ?? '+5,000',
        todaysOutbound: metrics?.todaysOutbound ?? '-2,500',
    };

    return (
        <div className="space-y-6 font-sans antialiased">
            {/* Section 1: Overview & Active Holdings */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Core Holdings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                    {/* Total SKUs */}
                    <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                Total SKUs
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-foreground">
                                {data.totalSKUs.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-2.5 bg-primary/10 rounded-lg text-primary hidden sm:block">
                            <Boxes className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Available Stock */}
                    <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                Available Stock
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-foreground">
                                {data.availableStock}
                            </p>
                        </div>
                        <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 hidden sm:block">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Stock Batches */}
                    <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                Active Batches
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-foreground">
                                {data.stockBatches}
                            </p>
                        </div>
                        <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 hidden sm:block">
                            <Layers className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Stock Alerts & Action Items */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Risk & Inventory Health
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                    {/* Low Stock */}
                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 shadow-2xs flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold uppercase tracking-wide">
                                Low Stock Alerts
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {data.lowStockCount}
                            </p>
                        </div>
                        <div className="p-2.5 bg-amber-500/15 rounded-lg text-amber-600 dark:text-amber-400 hidden sm:block">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Out of Stock */}
                    <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 shadow-2xs flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-rose-700 dark:text-rose-300 font-semibold uppercase tracking-wide">
                                Out Of Stock
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400">
                                {data.outOfStockCount}
                            </p>
                        </div>
                        <div className="p-2.5 bg-rose-500/15 rounded-lg text-rose-600 dark:text-rose-400 hidden sm:block">
                            <XCircle className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Expiring Soon */}
                    <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/5 dark:bg-orange-500/10 shadow-2xs flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-orange-700 dark:text-orange-300 font-semibold uppercase tracking-wide">
                                Expiring Soon
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {data.expiringCount}
                            </p>
                        </div>
                        <div className="p-2.5 bg-orange-500/15 rounded-lg text-orange-600 dark:text-orange-400 hidden sm:block">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Damaged Stock */}
                    <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 dark:bg-red-500/10 shadow-2xs flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-red-700 dark:text-red-300 font-semibold uppercase tracking-wide">
                                Damaged Stock
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                                {data.damagedCount}
                            </p>
                        </div>
                        <div className="p-2.5 bg-red-500/15 rounded-lg text-red-600 dark:text-red-400 hidden sm:block">
                            <AlertOctagon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Stock Movement & Pipeline */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Movement & Pipeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                    {/* Reserved Stock */}
                    <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                Reserved Stock
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-foreground">
                                {data.reservedStock}
                            </p>
                        </div>
                        <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400 hidden sm:block">
                            <BookmarkCheck className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Incoming Stock */}
                    <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                Incoming Stock
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-foreground">
                                {data.incomingStock}
                            </p>
                        </div>
                        <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400 hidden sm:block">
                            <Truck className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Today's Movement */}
                    <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs flex items-center justify-between">
                        <div className="space-y-1 w-full">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                Today's Movement
                            </p>
                            <div className="flex items-center gap-3 pt-0.5">
                                <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                    <ArrowUpRight className="w-4 h-4" />
                                    {data.todaysInbound}
                                </span>
                                <span className="text-muted-foreground/40">|</span>
                                <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 dark:text-rose-400">
                                    <ArrowDownRight className="w-4 h-4" />
                                    {data.todaysOutbound}
                                </span>
                            </div>
                        </div>
                        <div className="p-2.5 bg-sky-500/10 rounded-lg text-sky-600 dark:text-sky-400 hidden sm:block">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockMetrics;