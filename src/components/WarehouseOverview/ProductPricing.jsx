'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import {
    Plus, CheckCircle2, Edit2, Trash2,
    ChevronLeft, History, Tag, Box, AlertCircle
} from 'lucide-react';

const ProductPricing = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [variants, setVariants] = useState([]);
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeVariant, setActiveVariant] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [variantsRes, pricesRes] = await Promise.all([
                    fetch(`https://thonket-product-price-service.onrender.com/api/variants?productId=${productId}`),
                    fetch(`https://thonket-product-price-service.onrender.com/api/prices?productId=${productId}`)
                ]);

                if (!variantsRes.ok || !pricesRes.ok) throw new Error("Data sync failed");

                const variantsData = await variantsRes.json();
                const pricesData = await pricesRes.json();

                setVariants(variantsData);
                setPrices(pricesData);
                if (variantsData.length > 0) setActiveVariant(variantsData[0]._id);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productId]);

    const activeVariantPrices = prices.filter(p => p.variantId?._id === activeVariant || p.variantId === activeVariant);
    const activePrice = activeVariantPrices.find(p => p.isActive);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="h-12 w-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Syncing Pricing Data...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all font-medium"
                    >
                        <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                        Back to Inventory
                    </button>
                    <button
                        onClick={() => navigate(`/products/${productId}/variants/new`)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl shadow hover:bg-gray-50 font-semibold transition"
                    >
                        <Box size={16} /> New Variant
                    </button>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Tag size={16} className="text-purple-600" />
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Pricing Intelligence</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{variants[0]?.productId?.name || 'Product Details'}</h1>
                </div>

                {/* Variant Tabs */}
                <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
                    {variants.map(v => (
                        <button
                            key={v._id}
                            onClick={() => setActiveVariant(v._id)}
                            className={`px-5 py-2 rounded-xl text-xs font-semibold transition ${activeVariant === v._id
                                    ? 'bg-purple-50 text-purple-700 shadow-inner'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            {v.sku}
                        </button>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Price Card */}
                        {activePrice ? (
                            <div className="bg-white rounded-3xl p-8 shadow-lg relative overflow-hidden border border-gray-200">
                                <div className="absolute top-6 right-6">
                                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 uppercase">
                                        <CheckCircle2 size={12} /> Active
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Live Market Price</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-extrabold">{activePrice.currency} {activePrice.basePrice.toLocaleString()}</span>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Effective: <span className="text-gray-900 font-semibold">{new Date(activePrice.validFrom).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/products/${productId}/prices/${activePrice._id}/edit`)}
                                        className="text-gray-400 hover:text-purple-600 transition"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center shadow-sm">
                                <div className="inline-flex p-5 bg-gray-100 rounded-full text-gray-300 mb-5">
                                    <AlertCircle size={36} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Price</h3>
                                <p className="text-gray-500 text-sm mb-6">This variant has no live price yet.</p>
                                <button
                                    onClick={() => navigate(`/products/${productId}/prices/new?variantId=${activeVariant}`)}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition shadow-md"
                                >
                                    Initialize Pricing
                                </button>
                            </div>
                        )}

                        {/* Price History */}
                        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <History size={18} className="text-gray-400" />
                                    <h2 className="font-bold text-sm uppercase tracking-widest text-gray-600">Audit Logs & History</h2>
                                </div>
                                <button
                                    onClick={() => navigate(`/products/${productId}/prices/new?variantId=${activeVariant}`)}
                                    className="text-purple-600 font-semibold text-xs hover:underline"
                                >
                                    + Adjust Price
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                                            <th className="px-6 py-4 text-left">Amount</th>
                                            <th className="px-4 py-4 text-left">Period</th>
                                            <th className="px-4 py-4 text-left">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {activeVariantPrices.map(p => (
                                            <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-semibold">{p.currency} {p.basePrice.toFixed(2)}</td>
                                                <td className="px-4 py-4 text-gray-500 text-xs">{new Date(p.validFrom).toLocaleDateString()} → {p.validTo ? new Date(p.validTo).toLocaleDateString() : 'Present'}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`text-xs font-bold uppercase ${p.isActive ? 'text-emerald-500' : 'text-gray-300'}`}>{p.isActive ? 'Active' : 'Archived'}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => navigate(`/products/${productId}/prices/${p._id}/edit`)} className="text-gray-400 hover:text-gray-900"><Edit2 size={16} /></button>
                                                    <button onClick={() => { if (window.confirm('Archive this record?')) setPrices(prices.filter(pr => pr._id !== p._id)) }} className="text-gray-400 hover:text-rose-600"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Variant Metadata</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">SKU ID</p>
                                    <p className="font-mono font-bold text-gray-700">{variants.find(v => v._id === activeVariant)?.sku || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Internal Reference</p>
                                    <p className="font-mono font-bold text-gray-700">#{activeVariant?.slice(-8)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductPricing;
