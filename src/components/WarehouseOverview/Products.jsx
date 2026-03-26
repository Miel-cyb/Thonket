'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Navbar from './Navbar';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Box,
} from 'lucide-react';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [availableCategories, setAvailableCategories] = useState(['all']);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://thonket-product-price-service.onrender.com/api/products'
        );
        const data = await response.json();

        const normalized = data.map((p) => ({
          ...p,
          displayCategory: p.categoryId?.name || 'General',
        }));

        setProducts(normalized);
        setAvailableCategories([
          'all',
          ...Array.from(new Set(normalized.map((p) => p.displayCategory))),
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      category === 'all' ||
      p.displayCategory.toLowerCase() === category.toLowerCase();
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRemove = (id) => {
    if (window.confirm('Remove product from warehouse inventory?')) {
      setProducts(products.filter((p) => p._id !== id));
    }
  };

  const stats = [
    { label: 'Total SKUs', value: products.length, icon: Box },
    {
      label: 'Active Products',
      value: products.filter((p) => p.isActive).length,
      icon: TrendingUp,
    },
    {
      label: 'Categories',
      value: availableCategories.length - 1,
      icon: BarChart3,
    },
  ];

  if (loading) return <SkeletonLoader />;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900">
      <Navbar onSearch={(val) => setSearchTerm(val)} />

      <main className="mx-auto max-w-7xl px-6 pb-20">
        {/* HEADER */}
        <header className="pt-10 pb-8 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Warehouse
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Products
            </h1>
            <p className="mt-2 text-base text-slate-500">
              A clear, real-time view of everything stored and managed in your warehouse.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90 active:scale-[0.98]">
            <Plus size={18} />
            Add Product
          </button>
        </header>

        {/* METRICS */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <stat.icon size={20} className="text-slate-400" />
              </div>
              <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </section>

        {/* FILTERS */}
        <section className="mt-10 flex gap-3 overflow-x-auto">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${category === cat ? 'bg-black text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* TABLE (DESKTOP) */}
        <section className="mt-8 hidden md:block">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="pl-6 text-sm font-medium text-slate-500">Product</TableHead>
                  <TableHead className="text-sm font-medium text-slate-500">Category</TableHead>
                  <TableHead className="text-sm font-medium text-slate-500">Status</TableHead>
                  <TableHead className="pr-6 text-right text-sm font-medium text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length ? (
                  filteredProducts.map((p) => (
                    <TableRow key={p._id} className="hover:bg-slate-50 transition">
                      <TableCell className="pl-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                            <Package size={18} className="text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-sm text-slate-500">{p.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{p.displayCategory}</TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${p.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {p.isActive ? 'Active' : 'Archived'}
                        </span>
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex justify-end gap-2 flex-wrap">
                          {/* Pricing — Obvious & Highlighted */}
                          <button
                            onClick={() => navigate(`/products/${p._id}/pricing`)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition"
                          >
                            <TrendingUp size={16} />
                            <span>Pricing</span>
                          </button>

                          {/* Edit */}
                          <button className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100 transition">
                            <Edit2 size={16} />
                            <span>Edit</span>
                          </button>

                          {/* Remove */}
                          <button
                            onClick={() => handleRemove(p._id)}
                            className="flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1 text-sm font-medium text-rose-600 hover:bg-rose-100 transition"
                          >
                            <Trash2 size={16} />
                            <span>Remove</span>
                          </button>

                          {/* Details */}
                          <button
                            onClick={() => navigate(`/products/${p._id}`)}
                            className="flex items-center gap-1 rounded-lg bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                          >
                            <ChevronRight size={16} />
                            <span>Details</span>
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-16 text-center text-slate-400">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* MOBILE */}
        <section className="mt-6 grid gap-4 md:hidden">
          {filteredProducts.map((p) => (
            <div key={p._id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <Package size={18} className="text-slate-400" />
                <span className={`text-sm font-medium ${p.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {p.isActive ? 'Active' : 'Archived'}
                </span>
              </div>

              <p className="mt-3 font-medium">{p.name}</p>
              <p className="text-sm text-slate-500">{p.brand} · {p.displayCategory}</p>

              <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                <button
                  onClick={() => navigate(`/products/${p._id}/pricing`)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <TrendingUp size={16} />
                  <span>Pricing</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition">
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleRemove(p._id)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100 transition"
                >
                  <Trash2 size={16} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="min-h-screen bg-[#F9FAFB] p-8 animate-pulse">
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="h-10 w-64 rounded-xl bg-slate-200" />
      <div className="grid grid-cols-3 gap-6">
        <div className="h-28 rounded-2xl bg-slate-200" />
        <div className="h-28 rounded-2xl bg-slate-200" />
        <div className="h-28 rounded-2xl bg-slate-200" />
      </div>
      <div className="h-[360px] rounded-2xl bg-white border" />
    </div>
  </div>
);

export default Products;
