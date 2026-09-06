'use client';

import React from 'react';
import Navbar from './Navbar';
import ProductVariantsTable from './StockProductVariant';
import StockMetrics from './StockMetrics';
import CategoryFilterToolbar from './StockCategoryFilerToolBar';
import StockAdjustModal from './StockAdjustModal';
import { useStockControl } from './UseStockControl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertTriangle,
  Package,
  XCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Calendar,
  Clock,
  ChevronsLeft,
  ChevronLeft,
  ChevronsRight,
  Maximize2,
  Minimize2,
  Loader2,
  Layers,
} from 'lucide-react';

const INITIAL_DUMMY_PRODUCTS = [];

const StockControl = ({ products = INITIAL_DUMMY_PRODUCTS, setProducts: setParentProducts }) => {
  const {
    products: currentProducts,
    setProducts,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    stockStatusFilter,
    setStockStatusFilter,
    isCategoriesLoading,
    expandedProducts,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isModalOpen,
    setIsModalOpen,
    selectedProduct,
    selectedVariant,
    newStock,
    setNewStock,
    categories,
    filteredProducts,
    metrics,
    totalPages,
    paginatedProducts,
    toggleExpand,
    expandAll,
    collapseAll,
    openAdjustModal,
    handleStockUpdate,
    getExpiryInfo,
  } = useStockControl(products);

  const handleSetProducts = (newProds) => {
    setProducts(newProds);
    if (typeof setParentProducts === 'function') setParentProducts(newProds);
  };

  const getStockStatusBadge = (stock) => {
    const stockNum = Number(stock) || 0;
    if (stockNum === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200/60 dark:border-red-900/50 shadow-2xs">
          <XCircle className="w-3.5 h-3.5 shrink-0" /> Out of Stock
        </span>
      );
    }
    if (stockNum < 10) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50 shadow-2xs">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Low ({stockNum})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50 shadow-2xs">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> In Stock ({stockNum})
      </span>
    );
  };

  const getExpiryBadge = (expiryDateStr) => {
    const { status, label } = getExpiryInfo(expiryDateStr);
    if (status === 'none') return <span className="text-xs text-muted-foreground">—</span>;
    if (status === 'expired') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800">
          <Calendar className="w-3.5 h-3.5 shrink-0" /> Expired
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          <Clock className="w-3.5 h-3.5 shrink-0" /> {label}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
        <Calendar className="w-3.5 h-3.5 shrink-0" /> {label}
      </span>
    );
  };

  const renderCategoryName = (category) => {
    if (!category) return 'Uncategorized';
    if (typeof category === 'object') return category.name || 'Uncategorized';
    return String(category);
  };

  const renderBatchNumbersLabel = (sizes = []) => {
    const batches = Array.from(new Set(sizes.map((s) => s?.batchNumber || s?.batch).filter(Boolean)));
    if (batches.length === 0) return 'No Batch';
    if (batches.length <= 2) return batches.join(', ');
    return `${batches.length} Batches`;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-background/50 text-foreground text-sm antialiased pb-16">
      <Navbar onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Stock Control</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {filteredProducts.length} Items
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor inventory across multi-variant SKUs, batch numbers, and expiration timelines.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={expandAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/80 bg-card hover:bg-muted/60 text-xs font-semibold text-foreground transition-all shadow-2xs hover:shadow-xs active:scale-[0.98]"
            >
              <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" /> Expand All
            </button>
            <button
              onClick={collapseAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/80 bg-card hover:bg-muted/60 text-xs font-semibold text-foreground transition-all shadow-2xs hover:shadow-xs active:scale-[0.98]"
            >
              <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" /> Collapse
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <StockMetrics metrics={metrics} />

        {/* Filters Toolbar */}
        <div className="relative">
          {isCategoriesLoading && (
            <div className="absolute right-3 top-3 text-xs text-muted-foreground flex items-center gap-1.5 bg-background/80 px-2 py-1 rounded backdrop-blur-xs z-10">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> Loading categories...
            </div>
          )}
          <CategoryFilterToolbar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }}
            stockStatusFilter={stockStatusFilter}
            onSelectStockStatus={(status) => { setStockStatusFilter(status); setCurrentPage(1); }}
          />
        </div>

        {/* Main Content Area */}
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-border/80 rounded-2xl bg-card shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No inventory items found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              We couldn't find any products matching your search criteria or active filters. Try resetting your search.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent border-b border-border/60">
                  <TableHead className="w-[48px] px-3 py-3 text-center"></TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground min-w-[220px] py-3">Product Family</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground w-[160px] py-3">Category</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground w-[140px] py-3">Brand</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground w-[150px] py-3">Batch Num</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground w-[100px] py-3">Variants</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground w-[150px] py-3 text-right pr-6">Total Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/50">
                {paginatedProducts.map((product, idx) => {
                  if (!product) return null;
                  const productId = product.id || `product-${idx}`;
                  const isExpanded = expandedProducts.has(productId);
                  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
                  const totalProductStock = sizes.reduce((acc, s) => acc + (Number(s?.stock) || 0), 0);

                  return (
                    <React.Fragment key={productId}>
                      <TableRow
                        className={`transition-colors cursor-pointer group ${isExpanded ? 'bg-muted/30' : 'hover:bg-muted/20'}`}
                        onClick={() => toggleExpand(productId)}
                      >
                        <TableCell className="p-3 text-center align-middle">
                          <button
                            type="button"
                            className="p-1 rounded-md hover:bg-muted text-muted-foreground group-hover:text-foreground transition-colors"
                            onClick={(e) => { e.stopPropagation(); toggleExpand(productId); }}
                            aria-label={isExpanded ? "Collapse product variants" : "Expand product variants"}
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-primary font-bold" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <div className="font-medium text-sm text-foreground leading-tight group-hover:text-primary transition-colors">
                            {product.name || 'Unnamed Product'}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground mt-0.5">ID: {productId}</div>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted/60 text-muted-foreground border border-border/40">
                            {renderCategoryName(product.category)}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5 text-xs font-medium text-foreground">
                          {product.brand || 'Generic'}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-muted/40 px-2 py-0.5 rounded border border-border/40 text-foreground">
                            <Layers className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span className="truncate max-w-[110px]">{renderBatchNumbersLabel(sizes)}</span>
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5 text-xs font-medium text-muted-foreground font-mono">
                          {sizes.length} SKU{sizes.length === 1 ? '' : 's'}
                        </TableCell>
                        <TableCell className="py-3.5 text-right pr-6 align-middle">
                          {getStockStatusBadge(totalProductStock)}
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow className="bg-muted/15 hover:bg-muted/15">
                          <TableCell colSpan={7} className="p-0 border-b border-border/60">
                            <div className="px-6 py-4 bg-muted/10 border-y border-border/40 shadow-inner">
                              <ProductVariantsTable
                                product={product}
                                sizes={sizes}
                                getExpiryBadge={getExpiryBadge}
                                getStockStatusBadge={getStockStatusBadge}
                                onOpenAdjustModal={openAdjustModal}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 border-t border-border/60 bg-muted/10 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value) || 10); setCurrentPage(1); }}
                  className="bg-background border border-input rounded-md px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="font-medium">
                Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} items
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2.5 font-semibold text-foreground">
                  {currentPage} / {totalPages || 1}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <StockAdjustModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedProduct={selectedProduct}
        selectedVariant={selectedVariant}
        newStock={newStock}
        setNewStock={setNewStock}
        onSave={() => {
          handleStockUpdate();
          handleSetProducts(currentProducts);
        }}
      />
    </div>
  );
};

export default StockControl;