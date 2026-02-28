'use client';

import { useState, useEffect } from 'react';

interface ScmProduct {
    id: number;
    sku: string;
    name: string;
    category: string;
    stock_quantity: number;
    batch_status: string;
    waitlist_count: number;
    recommended_batch_size: number;
}

const MOCK_SCM_DATA: ScmProduct[] = [
    { id: 6, sku: 'KORI-HA-006', name: 'Houjicha Amber', category: 'limited_batch', stock_quantity: 0, batch_status: 'pre_order', waitlist_count: 47, recommended_batch_size: 47 },
    { id: 7, sku: 'KORI-WM-007', name: 'Wasabi Mint', category: 'limited_batch', stock_quantity: 5, batch_status: 'low_stock', waitlist_count: 0, recommended_batch_size: 30 },
    { id: 5, sku: 'KORI-SK-005', name: 'Sakura Blossom', category: 'seasonal', stock_quantity: 8, batch_status: 'low_stock', waitlist_count: 0, recommended_batch_size: 30 },
    { id: 2, sku: 'KORI-YZ-002', name: 'Yuzu Citrus', category: 'seasonal', stock_quantity: 15, batch_status: 'low_stock', waitlist_count: 0, recommended_batch_size: 30 },
    { id: 4, sku: 'KORI-BS-004', name: 'Black Sesame', category: 'classic', stock_quantity: 28, batch_status: 'available', waitlist_count: 0, recommended_batch_size: 0 },
    { id: 3, sku: 'KORI-KM-003', name: 'Kyoto Matcha', category: 'classic', stock_quantity: 35, batch_status: 'available', waitlist_count: 0, recommended_batch_size: 0 },
    { id: 1, sku: 'KORI-HM-001', name: 'Hokkaido Milk', category: 'classic', stock_quantity: 50, batch_status: 'available', waitlist_count: 0, recommended_batch_size: 0 },
    { id: 8, sku: 'KORI-KB-008', name: 'Kori Club Box', category: 'subscription', stock_quantity: 999, batch_status: 'available', waitlist_count: 0, recommended_batch_size: 0 },
];

const STATUS_COLORS: Record<string, string> = {
    available: 'bg-kori-sage/10 text-kori-sage',
    low_stock: 'bg-amber-100 text-amber-700',
    sold_out: 'bg-red-100 text-red-600',
    pre_order: 'bg-kori-ice text-blue-600',
};

const CATEGORY_BADGE: Record<string, string> = {
    classic: 'bg-gray-100 text-gray-600',
    seasonal: 'bg-pink-100 text-pink-600',
    limited_batch: 'bg-purple-100 text-purple-600',
    subscription: 'bg-kori-gold/10 text-kori-gold',
};

export default function AdminPage() {
    const [scmData, setScmData] = useState<ScmProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchScm() {
            setLoading(true);
            try {
                const res = await fetch('http://localhost:4000/api/v1/products/scm', {
                    headers: { Authorization: 'Bearer demo-token' },
                });
                const json = await res.json();
                setScmData(json.data || []);
            } catch {
                setScmData(MOCK_SCM_DATA);
            }
            setLoading(false);
        }
        fetchScm();
    }, []);

    const totalWaitlist = scmData.reduce((sum, p) => sum + p.waitlist_count, 0);
    const lowStockCount = scmData.filter(p => p.batch_status === 'low_stock' || p.batch_status === 'pre_order').length;
    const totalRecommended = scmData.reduce((sum, p) => sum + p.recommended_batch_size, 0);

    return (
        <div className="wabi-sabi-bg min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs px-3 py-1 bg-kori-charcoal text-kori-cream rounded-full font-medium">Admin</span>
                        <h1 className="font-display text-3xl font-bold text-kori-charcoal">
                            SCM Dashboard
                        </h1>
                    </div>
                    <p className="text-sm text-kori-charcoal-light/40">
                        Supply Chain Management — Demand Forecast & Inventory Overview
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    <div className="glass-card rounded-2xl p-6">
                        <p className="text-xs text-kori-charcoal-light/40 mb-1">Total Products</p>
                        <p className="font-display text-3xl font-bold text-kori-charcoal">{scmData.length}</p>
                    </div>
                    <div className="glass-card rounded-2xl p-6">
                        <p className="text-xs text-kori-charcoal-light/40 mb-1">Pre-order Waitlist</p>
                        <p className="font-display text-3xl font-bold text-blue-600">{totalWaitlist}</p>
                    </div>
                    <div className="glass-card rounded-2xl p-6">
                        <p className="text-xs text-kori-charcoal-light/40 mb-1">Low Stock / Pre-order</p>
                        <p className="font-display text-3xl font-bold text-amber-600">{lowStockCount}</p>
                    </div>
                    <div className="glass-card rounded-2xl p-6">
                        <p className="text-xs text-kori-charcoal-light/40 mb-1">Recommended Production</p>
                        <p className="font-display text-3xl font-bold text-kori-sage">{totalRecommended} pints</p>
                    </div>
                </div>

                {/* SCM Table */}
                {loading ? (
                    <div className="text-center py-20 text-kori-charcoal-light/40 animate-pulse">Loading SCM data...</div>
                ) : (
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-kori-sage/10">
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-kori-charcoal-light/50 uppercase tracking-wider">Product</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-kori-charcoal-light/50 uppercase tracking-wider">SKU</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-kori-charcoal-light/50 uppercase tracking-wider">Category</th>
                                        <th className="text-center px-6 py-4 text-xs font-semibold text-kori-charcoal-light/50 uppercase tracking-wider">Stock</th>
                                        <th className="text-center px-6 py-4 text-xs font-semibold text-kori-charcoal-light/50 uppercase tracking-wider">Batch Status</th>
                                        <th className="text-center px-6 py-4 text-xs font-semibold text-kori-charcoal-light/50 uppercase tracking-wider">Waitlist</th>
                                        <th className="text-center px-6 py-4 text-xs font-semibold text-kori-charcoal-light/50 uppercase tracking-wider">Rec. Batch</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scmData.map((product, i) => (
                                        <tr
                                            key={product.id}
                                            className={`border-b border-kori-sage/5 hover:bg-kori-sage/3 transition-colors ${i % 2 === 0 ? 'bg-white/30' : 'bg-kori-cream/20'
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-display font-medium text-sm text-kori-charcoal">{product.name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-kori-charcoal-light/40 font-mono">{product.sku}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${CATEGORY_BADGE[product.category] || ''}`}>
                                                    {product.category.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`font-semibold text-sm ${product.stock_quantity === 0 ? 'text-red-500' :
                                                        product.stock_quantity <= 10 ? 'text-amber-600' : 'text-kori-charcoal'
                                                    }`}>
                                                    {product.stock_quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[product.batch_status] || ''}`}>
                                                    {product.batch_status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {product.waitlist_count > 0 ? (
                                                    <span className="font-semibold text-sm text-blue-600">
                                                        {product.waitlist_count} 👥
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-kori-charcoal-light/20">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {product.recommended_batch_size > 0 ? (
                                                    <span className="bg-kori-sage/10 text-kori-sage px-3 py-1 rounded-full text-xs font-semibold">
                                                        {product.recommended_batch_size} pints
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-kori-charcoal-light/20">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Supply Chain Insight */}
                <div className="mt-8 glass-card rounded-2xl p-6">
                    <h3 className="font-display text-sm font-semibold text-kori-charcoal mb-3 uppercase tracking-wider">
                        Supply Chain Insight
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-kori-ice/30 rounded-xl px-5 py-4">
                            <p className="text-xs text-blue-600 font-medium mb-1">📋 Demand-Driven Manufacturing</p>
                            <p className="text-xs text-kori-charcoal-light/50">
                                Batch production sizes are calculated based on pre-order waitlist demand. This minimizes cold-storage costs and reduces overproduction waste.
                            </p>
                        </div>
                        <div className="bg-kori-sage/8 rounded-xl px-5 py-4">
                            <p className="text-xs text-kori-sage font-medium mb-1">🌿 Sustainability Metrics</p>
                            <p className="text-xs text-kori-charcoal-light/50">
                                All orders ship with eco-friendly dry-ice packaging. Artisanal scarcity model ensures zero waste—each batch is crafted to meet exact demand.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
