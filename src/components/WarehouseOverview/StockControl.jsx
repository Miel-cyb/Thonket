'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './Navbar';
import ProductVariantsTable from './StockProductVariant';
import StockMetrics from './StockMetrics';
import CategoryFilterToolbar from './StockCategoryFilerToolBar';
import { API_ENDPOINTS } from '../../utils/urls';
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
  Plus,
  Minus,
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

const StockControl = ({ products = INITIAL_DUMMY_PRODUCTS, setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState('All');

  // Categories Endpoint State
  const [apiCategories, setApiCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  // Master-Detail expansion state
  const [expandedProducts, setExpandedProducts] = useState(new Set());

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [newStock, setNewStock] = useState(0);

  const category_endpoint = API_ENDPOINTS?.CATEGORIES;

  // Safe category flattener
  const flattenCategories = (categoryList = []) => {
    let result = [];
    if (!Array.isArray(categoryList)) return result;

    categoryList.forEach((cat) => {
      if (!cat || cat.isActive === false) return;

      result.push({
        id: cat._id || cat.id || String(Math.random()),
        name: cat.name || cat.title || 'Unnamed Category',
        slug: cat.slug || '',
        parentId: cat.parentCategoryId || null,
        level: cat.level ?? 0,
      });

      if (Array.isArray(cat.children) && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children));
      }
    });

    return result;
  };

  // Fetch Categories from Endpoint
  useEffect(() => {
    if (!category_endpoint) return;

    let isMounted = true;
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const response = await fetch(`${category_endpoint}/hierarchy/all`);
        if (!response.ok) throw new Error('Failed to fetch categories');

        const result = await response.json();

        const rawCategoryTree = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        const parsedCategories = flattenCategories(rawCategoryTree);

        if (isMounted) {
          setApiCategories(parsedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories from endpoint:', error);
      } {
        if (isMounted) setIsCategoriesLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [category_endpoint]);

  // Helper to calculate Expiry Status safely
  const getExpiryInfo = (expiryDateStr) => {
    if (!expiryDateStr) return { status: 'none', label: 'N/A', daysRemaining: null };

    const today = new Date();
    const expiryDate = new Date(expiryDateStr);
    if (isNaN(expiryDate.getTime())) {
      return { status: 'none', label: 'N/A', daysRemaining: null };
    }

    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', label: 'Expired', daysRemaining: diffDays };
    }
    if (diffDays <= 30) {
      return { status: 'warning', label: `Expires in ${diffDays}d`, daysRemaining: diffDays };
    }
    return { status: 'ok', label: expiryDate.toLocaleDateString(), daysRemaining: diffDays };
  };

  // Combine fetched API category names with fallback product categories
  const categories = useMemo(() => {
    const apiCatNames = apiCategories.map((c) => c.name).filter(Boolean);

    const safeProducts = Array.isArray(products) ? products : [];
    const fallbackCats = safeProducts
      .map((p) => {
        if (!p) return null;
        if (typeof p.category === 'object' && p.category !== null) return p.category?.name;
        if (typeof p.category === 'string') return p.category;
        return null;
      })
      .filter(Boolean);

    const combined = new Set([...apiCatNames, ...fallbackCats]);
    return ['All', ...Array.from(combined)];
  }, [apiCategories, products]);

  // Safely Filter Products (includes searching by Batch Number)
  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];

    return safeProducts.filter((product) => {
      if (!product || typeof product !== 'object') return false;

      const sizes = Array.isArray(product.sizes) ? product.sizes : [];
      let matchesCategory = selectedCategory === 'All';

      if (!matchesCategory) {
        const prodCat = product.category;
        const targetCategory = (selectedCategory || '').toLowerCase();

        if (typeof prodCat === 'string') {
          matchesCategory = prodCat.toLowerCase() === targetCategory;
        } else if (prodCat && typeof prodCat === 'object') {
          const catName = String(prodCat.name || '').toLowerCase();
          const catSlug = String(prodCat.slug || '').toLowerCase();
          const catId = String(prodCat._id || prodCat.id || '');

          matchesCategory =
            catName === targetCategory ||
            catSlug === targetCategory ||
            catId === selectedCategory;
        }
      }

      const search = (searchTerm || '').toLowerCase();
      const matchesSearch =
        !search ||
        String(product.name || '').toLowerCase().includes(search) ||
        String(product.id || '').toLowerCase().includes(search) ||
        String(product.brand || '').toLowerCase().includes(search) ||
        sizes.some(
          (s) =>
            String(s?.sku || '').toLowerCase().includes(search) ||
            String(s?.batchNumber || '').toLowerCase().includes(search) ||
            String(s?.batch || '').toLowerCase().includes(search)
        );

      let matchesStatus = true;
      if (stockStatusFilter === 'low') {
        matchesStatus = sizes.some((s) => {
          const stk = Number(s?.stock) || 0;
          return stk > 0 && stk < 10;
        });
      } else if (stockStatusFilter === 'out') {
        matchesStatus = sizes.some((s) => (Number(s?.stock) || 0) === 0);
      } else if (stockStatusFilter === 'expired') {
        matchesStatus = sizes.some((s) => {
          const { status } = getExpiryInfo(s?.expiryDate);
          return status === 'expired' || status === 'warning';
        });
      }

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, stockStatusFilter]);

  // KPI Metrics calculation
  const metrics = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];

    let totalVariants = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let expiringCount = 0;

    safeProducts.forEach((p) => {
      if (!p) return;
      const sizes = Array.isArray(p.sizes) ? p.sizes : [];

      sizes.forEach((s) => {
        totalVariants++;
        const stock = Number(s?.stock) || 0;
        if (stock === 0) outOfStockCount++;
        else if (stock < 10) lowStockCount++;

        const { status } = getExpiryInfo(s?.expiryDate);
        if (status === 'expired' || status === 'warning') expiringCount++;
      });
    });

    return {
      totalProducts: safeProducts.length,
      totalVariants,
      lowStockCount,
      outOfStockCount,
      expiringCount,
    };
  }, [products]);

  // Paginated View
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Expand / Collapse Handlers
  const toggleExpand = (productId) => {
    if (!productId) return;
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const expandAll = () => {
    const allIds = paginatedProducts.map((p) => p?.id).filter(Boolean);
    setExpandedProducts(new Set(allIds));
  };

  const collapseAll = () => {
    setExpandedProducts(new Set());
  };

  // Adjust Modal Handlers
  const openAdjustModal = (product, variant) => {
    setSelectedProduct(product);
    setSelectedVariant(variant);
    setNewStock(Number(variant?.stock) || 0);
    setIsModalOpen(true);
  };

  const handleStockUpdate = () => {
    if (!selectedProduct || !selectedVariant) return;

    const targetStock = Math.max(0, Number(newStock) || 0);
    const safeProducts = Array.isArray(products) ? products : [];

    const updatedProducts = safeProducts.map((p) => {
      if (p?.id === selectedProduct.id) {
        const sizes = Array.isArray(p.sizes) ? p.sizes : [];
        const updatedSizes = sizes.map((s) => {
          const isTarget =
            s?.sku === selectedVariant.sku ||
            (s?.name === selectedVariant.name &&
              (s?.batchNumber || s?.batch) === (selectedVariant.batchNumber || selectedVariant.batch));

          if (isTarget) {
            return { ...s, stock: targetStock };
          }
          return s;
        });

        return {
          ...p,
          sizes: updatedSizes,
        };
      }
      return p;
    });

    if (typeof setProducts === 'function') setProducts(updatedProducts);
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  // Render Badges (Increased font size to text-sm)
  const getStockStatusBadge = (stock) => {
    const stockNum = Number(stock) || 0;
    if (stockNum === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/60 dark:border-red-900/50">
          <XCircle className="w-4 h-4" /> Out of Stock
        </span>
      );
    }
    if (stockNum < 10) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50">
          <AlertTriangle className="w-4 h-4" /> Low ({stockNum})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50">
        <CheckCircle2 className="w-4 h-4" /> In Stock ({stockNum})
      </span>
    );
  };

  const getExpiryBadge = (expiryDateStr) => {
    const { status, label } = getExpiryInfo(expiryDateStr);

    if (status === 'none') {
      return <span className="text-sm text-muted-foreground">—</span>;
    }
    if (status === 'expired') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-sm font-medium bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800">
          <Calendar className="w-4 h-4" /> Expired
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-sm font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          <Clock className="w-4 h-4" /> {label}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground font-mono">
        <Calendar className="w-4 h-4" /> {label}
      </span>
    );
  };

  const renderCategoryName = (category) => {
    if (!category) return 'Uncategorized';
    if (typeof category === 'object') return category.name || 'Uncategorized';
    return String(category);
  };

  // Helper to format unique batch numbers into a clean string label
  const renderBatchNumbersLabel = (sizes = []) => {
    const batches = Array.from(
      new Set(
        sizes
          .map((s) => s?.batchNumber || s?.batch)
          .filter(Boolean)
      )
    );

    if (batches.length === 0) return 'No Batch';
    if (batches.length <= 2) return batches.join(', ');
    return `${batches.length} Batches`;
  };

  return (
    <div className="w-full min-h-screen bg-background/50 text-foreground text-base">
      <Navbar onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); }} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Stock Control</h1>
            <p className="text-base text-muted-foreground mt-1.5">
              Monitor inventory across multi-variant SKUs, batch numbers, and expiration timelines.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={expandAll}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-accent text-sm font-medium transition-colors shadow-sm"
            >
              <Maximize2 className="w-4 h-4 text-muted-foreground" /> Expand All
            </button>
            <button
              onClick={collapseAll}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-accent text-sm font-medium transition-colors shadow-sm"
            >
              <Minimize2 className="w-4 h-4 text-muted-foreground" /> Collapse
            </button>
          </div>
        </div>

        {/* Metrics Component */}
        <StockMetrics metrics={metrics} />

        {/* Category & Filter Toolbar Component */}
        <div className="relative">
          {isCategoriesLoading && (
            <div className="absolute right-2 top-2 text-sm text-muted-foreground flex items-center gap-1.5">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading categories...
            </div>
          )}
          <CategoryFilterToolbar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            stockStatusFilter={stockStatusFilter}
            onSelectStockStatus={(status) => {
              setStockStatusFilter(status);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Main Hierarchical Table Container */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-xl bg-card">
            <Package className="w-14 h-14 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-lg font-semibold text-foreground">No inventory items found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search queries or status filters.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent border-b border-border/60">
                  <TableHead className="w-[52px] px-3 py-4 text-center"></TableHead>
                  <TableHead className="font-bold text-sm uppercase tracking-wider text-muted-foreground min-w-[240px] py-4">
                    Product Family
                  </TableHead>
                  <TableHead className="font-bold text-sm uppercase tracking-wider text-muted-foreground w-[180px] py-4">
                    Category
                  </TableHead>
                  <TableHead className="font-bold text-sm uppercase tracking-wider text-muted-foreground w-[150px] py-4">
                    Brand
                  </TableHead>
                  <TableHead className="font-bold text-sm uppercase tracking-wider text-muted-foreground w-[160px] py-4">
                    Batch Num
                  </TableHead>
                  <TableHead className="font-bold text-sm uppercase tracking-wider text-muted-foreground w-[110px] py-4">
                    Variants
                  </TableHead>
                  <TableHead className="font-bold text-sm uppercase tracking-wider text-muted-foreground w-[160px] py-4 text-right pr-6">
                    Total Stock
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product, idx) => {
                  if (!product) return null;

                  const productId = product.id || `product-${idx}`;
                  const isExpanded = expandedProducts.has(productId);
                  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
                  const totalProductStock = sizes.reduce((acc, s) => acc + (Number(s?.stock) || 0), 0);

                  return (
                    <React.Fragment key={productId}>
                      {/* Parent Product Row */}
                      <TableRow
                        className="hover:bg-muted/40 transition-colors cursor-pointer border-b border-border/40"
                        onClick={() => toggleExpand(productId)}
                      >
                        <TableCell className="p-3 text-center align-middle">
                          <button
                            type="button"
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(productId);
                            }}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-foreground" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="font-semibold text-base text-foreground leading-snug">
                            {product.name || 'Unnamed Product'}
                          </div>
                          <div className="text-sm font-mono text-muted-foreground mt-0.5">
                            #{productId}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-muted text-muted-foreground border border-border/50">
                            {renderCategoryName(product.category)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-sm font-medium text-foreground">
                          {product.brand || 'Generic'}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm font-mono bg-muted/60 px-3 py-1 rounded-md border border-border/40 text-foreground font-medium">
                            <Layers className="w-4 h-4 text-muted-foreground" />
                            {renderBatchNumbersLabel(sizes)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-sm font-medium text-foreground font-mono">
                          {sizes.length} SKUs
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6 align-middle">
                          {getStockStatusBadge(totalProductStock)}
                        </TableCell>
                      </TableRow>

                      {/* Expanded Sub-Table */}
                      {isExpanded && (
                        <TableRow className="bg-muted/10 hover:bg-muted/10">
                          <TableCell colSpan={7} className="p-0 border-b border-border/60">
                            <div className="px-6 py-5 bg-muted/5">
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

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border/60 bg-muted/20 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value) || 10);
                    setCurrentPage(1);
                  }}
                  className="bg-background border border-input rounded-md px-3 py-1 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>per page</span>
              </div>

              <div className="font-medium text-sm">
                Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} items
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-2 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronsLeft className="w-5 h-5" />
                </button>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="p-2 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-3 font-semibold text-foreground text-sm">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="p-2 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-2 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronsRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Adjust Stock Modal */}
      {isModalOpen && selectedProduct && selectedVariant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded-xl shadow-xl p-6 w-full max-w-md space-y-6">
            <div className="flex justify-between items-start border-b border-border/60 pb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Adjust Stock</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Reconcile warehouse inventory level.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-base p-1 rounded-md transition"
              >
                ✕
              </button>
            </div>

            {/* Context Badge showing Variant + Batch Number */}
            <div className="bg-muted/40 p-4 rounded-lg border border-border/40 text-sm space-y-2.5">
              <div className="font-semibold text-foreground text-base">{selectedProduct.name}</div>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div>Variant: <strong className="text-foreground">{selectedVariant.name}</strong></div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">
                    {selectedVariant.batchNumber || selectedVariant.batch || 'N/A'}
                  </span>
                </div>
                <div>SKU: <strong className="text-foreground font-mono">{selectedVariant.sku || 'N/A'}</strong></div>
                <div>Expiry: <strong className="text-foreground font-mono">{selectedVariant.expiryDate || 'N/A'}</strong></div>
              </div>
            </div>

            {/* Counter */}
            <div className="space-y-3">
              <label htmlFor="newStock" className="block text-xs font-bold uppercase text-muted-foreground tracking-wider">
                Target Stock
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNewStock((prev) => Math.max(0, (Number(prev) || 0) - 1))}
                  className="p-3 rounded-lg border border-border bg-muted hover:bg-muted/80 text-foreground transition"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  id="newStock"
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewStock(val === '' ? '' : Math.max(0, parseInt(val, 10) || 0));
                  }}
                  className="border border-input rounded-lg px-3 py-2.5 text-center w-full bg-background font-bold text-xl focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setNewStock((prev) => (Number(prev) || 0) + 1)}
                  className="p-3 rounded-lg border border-border bg-muted hover:bg-muted/80 text-foreground transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Incremental Quick-Buttons */}
              <div className="flex gap-2 pt-1">
                {[+5, +10, +25, -5].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setNewStock((prev) => Math.max(0, (Number(prev) || 0) + amt))}
                    className="flex-1 text-sm py-2 rounded-md border border-border/60 bg-muted/30 hover:bg-muted font-semibold transition"
                  >
                    {amt > 0 ? `+${amt}` : amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStockUpdate}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Dummy Data
const INITIAL_DUMMY_PRODUCTS = [
  {
    id: 'PROD-101',
    name: 'Amoxicillin 500mg Capsules',
    brand: 'PharmaCorp',
    category: { id: 'cat-1', name: 'Antibiotics' },
    sizes: [
      {
        name: 'Pack of 100',
        sku: 'AMX-500-B001',
        batchNumber: 'BATCH-2025-A',
        stock: 45,
        expiryDate: '2027-08-15',
        price: 24.99,
      },
      {
        name: 'Pack of 100',
        sku: 'AMX-500-B002',
        batchNumber: 'BATCH-2025-B',
        stock: 5,
        expiryDate: '2026-09-01',
        price: 24.99,
      },
      {
        name: 'Pack of 500',
        sku: 'AMX-500-B003',
        batchNumber: 'BATCH-2025-A',
        stock: 120,
        expiryDate: '2028-01-10',
        price: 89.99,
      },
    ],
  },
  {
    id: 'PROD-102',
    name: 'Paracetamol 500mg Tablets',
    brand: 'HealthCare Direct',
    category: { id: 'cat-2', name: 'Analgesics' },
    sizes: [
      {
        name: 'Box of 24',
        sku: 'PCM-500-24-A',
        batchNumber: 'BT-9901',
        stock: 200,
        expiryDate: '2027-12-31',
        price: 4.50,
      },
      {
        name: 'Box of 24',
        sku: 'PCM-500-24-B',
        batchNumber: 'BT-9902',
        stock: 0,
        expiryDate: '2026-08-10',
        price: 4.50,
      },
      {
        name: 'Box of 100',
        sku: 'PCM-500-100-A',
        batchNumber: 'BT-9901',
        stock: 80,
        expiryDate: '2027-12-31',
        price: 12.00,
      },
    ],
  },
  {
    id: 'PROD-103',
    name: 'Vitamin C 1000mg Chewables',
    brand: 'NutriLife',
    category: 'Supplements',
    sizes: [
      {
        name: 'Bottle of 60',
        sku: 'VITC-60-B1',
        batchNumber: 'LOT-2024-08',
        stock: 15,
        expiryDate: '2026-08-20',
        price: 14.20,
      },
      {
        name: 'Bottle of 60',
        sku: 'VITC-60-B2',
        batchNumber: 'LOT-2025-01',
        stock: 150,
        expiryDate: '2027-01-15',
        price: 14.20,
      },
    ],
  },
];

export default StockControl;