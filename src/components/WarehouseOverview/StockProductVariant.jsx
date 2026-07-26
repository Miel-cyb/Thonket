import React, { useMemo, useId } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

/**
 * Safely parses numeric inputs to prevent NaN contamination in rendering/logic.
 */
const parseSafeNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
};

/**
 * Formats ISO date strings into clean, human-readable dates.
 */
const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return raw string if custom format
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }).format(date);
};

/**
 * Normalizes an individual record (batch or variant item) relative to the parent product context.
 */
const normalizeRecord = (item, parentProduct = {}, parentVariant = {}) => {
    const totalQuantity = parseSafeNumber(item.totalQuantity ?? item.stock, 0);
    const availableQuantity = parseSafeNumber(item.availableQuantity ?? item.availableStock ?? item.stock, 0);
    const reservedQuantity = parseSafeNumber(item.reservedQuantity, 0);
    const damagedQuantity = parseSafeNumber(item.damagedQuantity, 0);
    const expiredQuantity = parseSafeNumber(item.expiredQuantity, 0);

    return {
        // Traceability & Table Keys
        recordId: item.id || item.batchId || item.batchNumber || item.sku || Math.random().toString(36).substring(2, 9),

        // Identity
        productId: item.productId || parentProduct.id || parentProduct.productId || '—',
        productName: item.productName || parentProduct.name || parentProduct.productName || '—',
        categoryId: item.categoryId || parentProduct.categoryId || null,
        categoryName: item.categoryName || parentProduct.categoryName || parentProduct.category || null,

        // Variant Identity
        variantId: item.variantId || parentVariant.id || item.id || '—',
        variantName: item.variantName || parentVariant.name || item.name || item.size || 'Default Variant',
        sku: item.sku || parentVariant.sku || '—',

        // Batch / Traceability
        batchNumber: item.batchNumber || item.batchNo || null,
        lotNumber: item.lotNumber || item.lotNo || null,
        manufacturingDate: item.manufacturingDate || item.mfgDate || null,
        expiryDate: item.expiryDate || item.expDate || null,
        receivedDate: item.receivedDate || item.recDate || null,

        // Quantities
        totalQuantity,
        availableQuantity,
        reservedQuantity,
        damagedQuantity,
        expiredQuantity,

        // Measurement & Status
        unitOfMeasure: item.unitOfMeasure || item.uom || parentProduct.unitOfMeasure || 'units',
        stockStatus: item.stockStatus || null,

        // Timestamps
        lastStockUpdate: item.lastStockUpdate || item.updatedAt || null,
    };
};

const ProductVariantsTable = ({
    product = {},
    items = [], // Accepts array of variant/batch objects following the schema
    sizes = [], // Fallback prop for backward compatibility
    getExpiryBadge,
    getStockStatusBadge,
    className = '',
}) => {
    const tableId = useId();

    // Gap Fix: Flatten & normalize dataset conditionally inside useMemo
    const normalizedData = useMemo(() => {
        const rawList = items.length > 0 ? items : sizes;

        return rawList.flatMap((item) => {
            // Edge Case: If the variant contains an array of batches, unroll them into explicit rows
            if (Array.isArray(item.batches) && item.batches.length > 0) {
                return item.batches.map((batch) => normalizeRecord(batch, product, item));
            }
            return normalizeRecord(item, product, {});
        });
    }, [items, sizes, product]);

    return (
        <div className={`p-4 sm:p-5 pl-6 sm:pl-10 space-y-3 bg-muted/10 border-l-2 border-emerald-600 transition-all font-sans antialiased ${className}`}>
            {/* Header Meta Line */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span id={`label-${tableId}`} className="uppercase tracking-widest text-xs font-bold text-foreground/80">
                        Inventory & Batch Traceability
                    </span>
                    {product?.categoryName && (
                        <span className="text-xs bg-muted/80 text-muted-foreground px-2.5 py-0.5 rounded-full font-medium border border-border/40">
                            {product.categoryName}
                        </span>
                    )}
                </div>
                <span className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{normalizedData.length}</span> record
                    {normalizedData.length === 1 ? '' : 's'} for{' '}
                    <strong className="text-foreground font-semibold">"{product?.name || 'Product'}"</strong>
                </span>
            </div>

            {/* Embedded Responsive Table Container */}
            <div className="rounded-lg border border-border bg-card overflow-x-auto shadow-xs">
                <Table aria-labelledby={`label-${tableId}`}>
                    <TableHeader className="bg-muted/40 border-b border-border">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2.5 px-3.5 min-w-[150px]">
                                Variant / SKU
                            </TableHead>
                            <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2.5 px-3.5 min-w-[130px]">
                                Batch & Lot Info
                            </TableHead>
                            <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2.5 px-3.5 text-right min-w-[130px]">
                                Breakdown
                            </TableHead>
                            <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2.5 px-3.5 text-right min-w-[120px]">
                                Available Stock
                            </TableHead>
                            <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2.5 px-3.5 min-w-[130px]">
                                Dates / Expiry
                            </TableHead>
                            <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2.5 px-3.5 text-right min-w-[110px]">
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {normalizedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                                    No batch or variant inventory records available for this product.
                                </TableCell>
                            </TableRow>
                        ) : (
                            normalizedData.map((row, idx) => {
                                const formattedExpiry = formatDate(row.expiryDate);
                                const formattedMfg = formatDate(row.manufacturingDate);

                                // Guarantee completely unique, stable keys across complex datasets
                                const compositeKey = `${row.variantId}-${row.batchNumber || row.lotNumber || row.recordId}-${idx}`;

                                return (
                                    <TableRow
                                        key={compositeKey}
                                        className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0 text-sm"
                                    >
                                        {/* 1. Variant Identity */}
                                        <TableCell className="py-3.5 px-3.5 align-top">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-foreground font-semibold text-base tracking-tight leading-snug">
                                                    {row.variantName}
                                                </span>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="font-mono text-xs tracking-tight text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/50">
                                                        SKU: {row.sku}
                                                    </span>
                                                    {row.categoryName && (
                                                        <span className="text-xs text-muted-foreground">
                                                            • {row.categoryName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* 2. Batch & Lot Traceability */}
                                        <TableCell className="py-3.5 px-3.5 align-top font-mono text-xs">
                                            {row.batchNumber || row.lotNumber ? (
                                                <div className="flex flex-col gap-1">
                                                    {row.batchNumber && (
                                                        <span className="text-foreground font-medium text-sm">
                                                            <span className="text-muted-foreground font-normal">B:</span>{' '}
                                                            {row.batchNumber}
                                                        </span>
                                                    )}
                                                    {row.lotNumber && (
                                                        <span className="text-muted-foreground text-xs">
                                                            <span>L:</span> {row.lotNumber}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground/60 italic">—</span>
                                            )}
                                        </TableCell>

                                        {/* 3. Stock Breakdown */}
                                        <TableCell className="py-3.5 px-3.5 align-top text-right font-mono tabular-nums">
                                            <div className="inline-flex flex-col items-end gap-1 text-xs">
                                                <span className="text-foreground font-semibold text-sm">
                                                    Total: {row.totalQuantity}{' '}
                                                    <span className="text-xs font-sans text-muted-foreground font-normal">
                                                        {row.unitOfMeasure}
                                                    </span>
                                                </span>
                                                {(row.reservedQuantity > 0 || row.damagedQuantity > 0 || row.expiredQuantity > 0) && (
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        {row.reservedQuantity > 0 && (
                                                            <span className="text-amber-600 dark:text-amber-400">
                                                                {row.reservedQuantity} res
                                                            </span>
                                                        )}
                                                        {row.damagedQuantity > 0 && (
                                                            <span className="text-rose-600 dark:text-rose-400">
                                                                {row.damagedQuantity} dmg
                                                            </span>
                                                        )}
                                                        {row.expiredQuantity > 0 && (
                                                            <span className="text-destructive">
                                                                {row.expiredQuantity} exp
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* 4. Available Stock */}
                                        <TableCell className="py-3.5 px-3.5 align-top text-right font-mono font-bold text-base text-foreground tabular-nums">
                                            <div className="flex flex-col items-end">
                                                <span>{row.availableQuantity}</span>
                                                <span className="text-xs font-sans font-normal text-muted-foreground">
                                                    {row.unitOfMeasure} available
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* 5. Inventory Dates & Expiry Badge */}
                                        <TableCell className="py-3.5 px-3.5 align-top">
                                            <div className="flex flex-col gap-1">
                                                <div>
                                                    {getExpiryBadge ? (
                                                        getExpiryBadge(row.expiryDate)
                                                    ) : row.expiryDate ? (
                                                        <span className="font-mono text-sm text-foreground font-medium">
                                                            {formattedExpiry}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground/60 italic text-xs">
                                                            No Expiry
                                                        </span>
                                                    )}
                                                </div>

                                                {formattedMfg && (
                                                    <span className="text-xs text-muted-foreground">
                                                        Mfg: {formattedMfg}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* 6. Health / Stock Control Status */}
                                        <TableCell className="py-3.5 px-3.5 align-top text-right">
                                            {getStockStatusBadge ? (
                                                getStockStatusBadge(row.availableQuantity, row.stockStatus)
                                            ) : (
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border ${row.availableQuantity > 10
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                        : row.availableQuantity > 0
                                                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                                        }`}
                                                >
                                                    {row.stockStatus || (row.availableQuantity > 10 ? 'In Stock' : row.availableQuantity > 0 ? 'Low Stock' : 'Out of Stock')}
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default React.memo(ProductVariantsTable);