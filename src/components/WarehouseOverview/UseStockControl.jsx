'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { API_ENDPOINTS } from '../../utils/urls';
import {
    Package, AlertTriangle, CheckCircle, RefreshCw, Search,
    ChevronDown, ChevronRight, Filter, AlertCircle, X, Sliders, Layers
} from 'lucide-react';

// Stock Control Hook - Manages product stock control state, fetching, filtering, and pagination
export const useStockControl = (initialProducts = []) => {
    const [products, setProducts] = useState(initialProducts);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [stockStatusFilter, setStockStatusFilter] = useState('All');

    const [apiCategories, setApiCategories] = useState([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

    const [expandedProducts, setExpandedProducts] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [newStock, setNewStock] = useState(0);

    const inventory_endpoint = API_ENDPOINTS?.INVENTORY;
    const category_endpoint = API_ENDPOINTS?.CATEGORIES;

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

    const normalizeInventoryData = (rawData) => {
        const items = Array.isArray(rawData)
            ? rawData
            : Array.isArray(rawData?.data)
                ? rawData.data
                : Array.isArray(rawData?.products)
                    ? rawData.products
                    : [];

        return items.map((item) => {
            const productId = item?._id?.productId || item?.id || item?._id || String(Math.random());
            const warehouseId = item?._id?.warehouseId || item?.warehouseId || '';
            const productName = item?.productName || item?.name || item?.sku || 'Unnamed Product';
            const sku = item?.sku || '';
            const brand = item?.brand || '';
            const category = item?.category || 'All';
            const unitOfMeasure = item?.unitOfMeasure || 'UNIT';

            const rawBatches = Array.isArray(item?.batches) ? item.batches : [];
            const sizes = rawBatches.map((batch) => ({
                inventoryId: batch?.inventoryId || '',
                sku: sku,
                name: batch?.batchNumber || batch?.lotNumber || 'Default Batch',
                batchNumber: batch?.batchNumber || '',
                batch: batch?.batchNumber || '',
                lotNumber: batch?.lotNumber || null,
                location: batch?.location || 'DEFAULT',
                status: batch?.status || 'AVAILABLE',
                stock: Number(batch?.totalQuantity ?? batch?.availableQuantity ?? 0),
                unitCost: Number(batch?.unitCost || 0),
                totalValuation: Number(batch?.totalValuation || 0),
                expiryDate: batch?.expiryDate || null,
                mfgDate: batch?.mfgDate || null,
                sourceReference: batch?.sourceReference || null,
            }));

            const normalizedSizes = sizes.length > 0 ? sizes : [{
                inventoryId: '',
                sku: sku,
                name: 'Standard Stock',
                batchNumber: '',
                batch: '',
                location: 'DEFAULT',
                status: 'AVAILABLE',
                stock: Number(item?.totalStock || 0),
                unitCost: 0,
                totalValuation: Number(item?.totalValuation || 0),
                expiryDate: null,
            }];

            return {
                id: String(productId),
                warehouseId: String(warehouseId),
                name: productName,
                sku: sku,
                brand: brand,
                category: category,
                unitOfMeasure: unitOfMeasure,
                totalStock: Number(item?.totalStock || 0),
                totalAvailable: Number(item?.totalAvailable || 0),
                totalReserved: Number(item?.totalReserved || 0),
                totalValuation: Number(item?.totalValuation || 0),
                sizes: normalizedSizes,
                raw: item
            };
        });
    };

    const fetchInventory = useCallback(async () => {
        if (!inventory_endpoint) {
            setError('Inventory API endpoint is not defined in API_ENDPOINTS.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(inventory_endpoint, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            const normalizedProducts = normalizeInventoryData(result);
            setProducts(normalizedProducts);
        } catch (err) {
            console.error('Error fetching inventory data:', err);
            setError(err.message || 'Failed to load inventory data.');
        } finally {
            setIsLoading(false);
        }
    }, [inventory_endpoint]);

    useEffect(() => {
        if (!category_endpoint) return;
        let isMounted = true;

        const fetchCategories = async () => {
            setIsCategoriesLoading(true);
            try {
                const response = await fetch(`${category_endpoint}/hierarchy/all`);
                if (!response.ok) throw new Error('Failed to fetch categories');
                const result = await response.json();
                const rawCategoryTree = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];
                const parsedCategories = flattenCategories(rawCategoryTree);

                if (isMounted) setApiCategories(parsedCategories);
            } catch (err) {
                console.error('Error fetching categories from endpoint:', err);
            } finally {
                if (isMounted) setIsCategoriesLoading(false);
            }
        };

        fetchCategories();
        return () => { isMounted = false; };
    }, [category_endpoint]);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    const getExpiryInfo = (expiryDateStr) => {
        if (!expiryDateStr) return { status: 'none', label: 'N/A', daysRemaining: null };
        const today = new Date();
        const expiryDate = new Date(expiryDateStr);
        if (isNaN(expiryDate.getTime())) return { status: 'none', label: 'N/A', daysRemaining: null };

        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { status: 'expired', label: 'Expired', daysRemaining: diffDays };
        if (diffDays <= 30) return { status: 'warning', label: `Expires in ${diffDays}d`, daysRemaining: diffDays };
        return { status: 'ok', label: expiryDate.toLocaleDateString(), daysRemaining: diffDays };
    };

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

        return ['All', ...Array.from(new Set([...apiCatNames, ...fallbackCats]))];
    }, [apiCategories, products]);

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
                    matchesCategory = catName === targetCategory || catSlug === targetCategory || catId === selectedCategory;
                }
            }

            const search = (searchTerm || '').toLowerCase();
            const matchesSearch =
                !search ||
                String(product.name || '').toLowerCase().includes(search) ||
                String(product.id || '').toLowerCase().includes(search) ||
                String(product.sku || '').toLowerCase().includes(search) ||
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

    const metrics = useMemo(() => {
        const safeProducts = Array.isArray(products) ? products : [];
        let totalVariants = 0, lowStockCount = 0, outOfStockCount = 0, expiringCount = 0;

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

        return { totalProducts: safeProducts.length, totalVariants, lowStockCount, outOfStockCount, expiringCount };
    }, [products]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredProducts.slice(start, start + pageSize);
    }, [filteredProducts, currentPage, pageSize]);

    const toggleExpand = (productId) => {
        if (!productId) return;
        setExpandedProducts((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) next.delete(productId);
            else next.add(productId);
            return next;
        });
    };

    const expandAll = () => setExpandedProducts(new Set(paginatedProducts.map((p) => p?.id).filter(Boolean)));
    const collapseAll = () => setExpandedProducts(new Set());

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
                        s?.inventoryId === selectedVariant.inventoryId ||
                        (s?.name === selectedVariant.name &&
                            (s?.batchNumber || s?.batch) === (selectedVariant.batchNumber || selectedVariant.batch));
                    return isTarget ? { ...s, stock: targetStock } : s;
                });

                const newTotalStock = updatedSizes.reduce((acc, curr) => acc + Number(curr.stock || 0), 0);
                return { ...p, sizes: updatedSizes, totalStock: newTotalStock };
            }
            return p;
        });

        setProducts(updatedProducts);
        setIsModalOpen(false);
        setSelectedProduct(null);
        setSelectedVariant(null);
    };

    return {
        products, setProducts, isLoading, error, refetch: fetchInventory,
        searchTerm, setSearchTerm, selectedCategory, setSelectedCategory,
        stockStatusFilter, setStockStatusFilter, isCategoriesLoading, expandedProducts,
        currentPage, setCurrentPage, pageSize, setPageSize, isModalOpen, setIsModalOpen,
        selectedProduct, selectedVariant, newStock, setNewStock, categories, filteredProducts,
        metrics, totalPages, paginatedProducts, toggleExpand, expandAll, collapseAll,
        openAdjustModal, handleStockUpdate, getExpiryInfo
    };
};