'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- MOCK DATA ---
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

// CRM Data
const MOCK_QUIZ_STATS = {
    totalTaken: 2458,
    conversionRate: '68.4%',
    topProfile: 'Matcha Enthusiast',
    flavorBreakdown: [
        { name: 'Creamy & Comforting', percentage: 42, color: 'bg-[#F5E6C8]' },
        { name: 'Refreshing & Bright', percentage: 28, color: 'bg-[#D4E5F7]' },
        { name: 'Bold & Earthy', percentage: 18, color: 'bg-[#7B9971]' },
        { name: 'Delicate & Floral', percentage: 12, color: 'bg-[#E8C4B8]' },
    ]
};

const MOCK_LOYALTY_STATS = {
    activeMembers: 1845,
    pointsIssued: '2.4M',
    redemptionRate: '45%',
    tiers: [
        { name: 'Bronze', count: 1100, color: 'text-amber-700' },
        { name: 'Silver', count: 560, color: 'text-gray-500' },
        { name: 'Gold', count: 185, color: 'text-kori-gold' },
    ]
};

export default function AdminPage() {
    const [scmData, setScmData] = useState<ScmProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'crm' | 'scm' | 'usp'>('crm');
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
            return;
        }
        try {
            const parsedUser = JSON.parse(user);
            if (parsedUser.role !== 'admin') {
                router.push('/');
            }
        } catch {
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        async function fetchScm() {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:4000/api/v1/products/scm', {
                    headers: { Authorization: `Bearer ${token}` },
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
    const lowStockCount = scmData.filter(p => ['low_stock', 'pre_order'].includes(p.batch_status)).length;
    const totalRecommended = scmData.reduce((sum, p) => sum + p.recommended_batch_size, 0);

    return (
        <div className="wabi-sabi-bg min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header & Tabs */}
                <div className="mb-10 text-center">
                    <h1 className="font-display text-4xl font-bold text-kori-charcoal mb-4">
                        Management Dashboard
                    </h1>
                    <div className="flex flex-wrap justify-center gap-2">
                        {(['crm', 'scm', 'usp'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab
                                        ? 'bg-kori-charcoal text-kori-cream shadow-md'
                                        : 'bg-kori-cream/60 text-kori-charcoal-light hover:bg-kori-sage/10'
                                    }`}
                            >
                                {tab === 'crm' ? 'CRM Strategy' :
                                    tab === 'scm' ? 'Demand-Driven SCM' :
                                        'Market Uniqueness (USP)'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── TAB 1: CRM STRATEGY ─── */}
                {activeTab === 'crm' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="bg-kori-sage/10 border border-kori-sage/20 rounded-2xl p-6 mb-8">
                            <h2 className="font-display text-xl font-bold text-kori-sage mb-2">Strategy Overview: Customer Relationship Management</h2>
                            <p className="text-sm text-kori-charcoal-light/70">
                                Kori氷 employs a two-pronged CRM approach: <strong>Acquisition through personalization</strong> (Flavor Discovery Quiz) and <strong>Retention through gamified rewards</strong> (Kori Points Loyalty Program). This creates a virtuous cycle of data collection and repeat purchasing.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* CRM Component 1: Flavor Quiz */}
                            <div className="glass-card rounded-3xl p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-3xl">🎯</span>
                                    <div>
                                        <h3 className="font-display text-xl font-bold text-kori-charcoal">Flavor Discovery Quiz</h3>
                                        <p className="text-xs text-kori-charcoal-light/50">Acquisition & Profiling Component</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white/50 rounded-xl p-4 text-center">
                                        <p className="text-xs text-kori-charcoal-light/50 mb-1">Quizzes Completed</p>
                                        <p className="font-display text-2xl font-bold text-kori-charcoal">{MOCK_QUIZ_STATS.totalTaken}</p>
                                    </div>
                                    <div className="bg-white/50 rounded-xl p-4 text-center">
                                        <p className="text-xs text-kori-charcoal-light/50 mb-1">Conversion Rate</p>
                                        <p className="font-display text-2xl font-bold text-kori-sage">{MOCK_QUIZ_STATS.conversionRate}</p>
                                    </div>
                                </div>

                                <h4 className="text-sm font-semibold text-kori-charcoal mb-4">Customer Palate Distribution</h4>
                                <div className="space-y-4">
                                    {MOCK_QUIZ_STATS.flavorBreakdown.map(profile => (
                                        <div key={profile.name}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-kori-charcoal-light/70">{profile.name}</span>
                                                <span className="font-semibold text-kori-charcoal">{profile.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div className={`${profile.color} h-2 rounded-full`} style={{ width: `${profile.percentage}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-4 bg-kori-cream/50 rounded-xl">
                                    <p className="text-xs text-kori-charcoal-light/60 italic">
                                        <strong>Implementation Insight:</strong> By capturing flavor preferences before account creation, we reduce friction and generate highly targeted product recommendations, directly boosting initial conversion rates.
                                    </p>
                                </div>
                            </div>

                            {/* CRM Component 2: Loyalty Program */}
                            <div className="glass-card rounded-3xl p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-3xl">✦</span>
                                    <div>
                                        <h3 className="font-display text-xl font-bold text-kori-charcoal">Kori Points Loyalty</h3>
                                        <p className="text-xs text-kori-charcoal-light/50">Retention & LTV Component</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    <div className="bg-white/50 rounded-xl p-3 text-center">
                                        <p className="text-[10px] text-kori-charcoal-light/50 mb-1">Active</p>
                                        <p className="font-display text-xl font-bold text-kori-charcoal">{MOCK_LOYALTY_STATS.activeMembers}</p>
                                    </div>
                                    <div className="bg-white/50 rounded-xl p-3 text-center">
                                        <p className="text-[10px] text-kori-charcoal-light/50 mb-1">Issued</p>
                                        <p className="font-display text-xl font-bold text-kori-gold">{MOCK_LOYALTY_STATS.pointsIssued}</p>
                                    </div>
                                    <div className="bg-white/50 rounded-xl p-3 text-center">
                                        <p className="text-[10px] text-kori-charcoal-light/50 mb-1">Redeemed</p>
                                        <p className="font-display text-xl font-bold text-kori-charcoal">{MOCK_LOYALTY_STATS.redemptionRate}</p>
                                    </div>
                                </div>

                                <h4 className="text-sm font-semibold text-kori-charcoal mb-4">Tier Distribution</h4>
                                <div className="flex h-32 items-end gap-4 mb-6 px-4">
                                    {MOCK_LOYALTY_STATS.tiers.map((tier, i) => (
                                        <div key={tier.name} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="text-xs font-semibold text-kori-charcoal">{tier.count}</div>
                                            <div
                                                className={`w-full rounded-t-md ${i === 0 ? 'bg-amber-700/20' : i === 1 ? 'bg-gray-300' : 'bg-kori-gold/40'}`}
                                                style={{ height: `${(tier.count / MOCK_LOYALTY_STATS.tiers[0].count) * 100}%` }}
                                            />
                                            <div className={`text-xs font-medium ${tier.color}`}>{tier.name}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-kori-cream/50 rounded-xl">
                                    <p className="text-xs text-kori-charcoal-light/60 italic">
                                        <strong>Implementation Insight:</strong> A tiered point system incentivizes larger cart sizes and repeat purchases. 45% redemption rate indicates high program engagement, locking customers into the Kori ecosystem.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── TAB 2: SCM STRATEGY ─── */}
                {activeTab === 'scm' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
                            <h2 className="font-display text-xl font-bold text-blue-800 mb-2">Strategy Overview: Demand-Driven Supply Chain</h2>
                            <p className="text-sm text-blue-900/70">
                                Kori氷 utilizes a <strong>Make-to-Order / Pull System</strong> for premium limited batches. By leveraging algorithmic waitlists ("Pre-order"), we calculate exact production requirements beforehand, completely eliminating cold-storage bloat and expiration waste.
                            </p>
                        </div>

                        {/* Top SCM KPIs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-kori-sage">
                                <p className="text-xs text-kori-charcoal-light/50 mb-1">Total SKUs</p>
                                <p className="font-display text-3xl font-bold text-kori-charcoal">{scmData.length}</p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-400">
                                <p className="text-xs text-kori-charcoal-light/50 mb-1">Pre-order Demand</p>
                                <p className="font-display text-3xl font-bold text-blue-600">{totalWaitlist} <span className="text-sm font-normal text-kori-charcoal-light/40">pints</span></p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-amber-400">
                                <p className="text-xs text-kori-charcoal-light/50 mb-1">Low Stock Alerts</p>
                                <p className="font-display text-3xl font-bold text-amber-600">{lowStockCount}</p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-purple-400">
                                <p className="text-xs text-kori-charcoal-light/50 mb-1">Next Batch Forecast</p>
                                <p className="font-display text-3xl font-bold text-purple-600">{totalRecommended} <span className="text-sm font-normal text-kori-charcoal-light/40">pints</span></p>
                            </div>
                        </div>

                        {/* Inventory Table */}
                        <div className="glass-card rounded-3xl overflow-hidden mt-8">
                            <div className="p-6 border-b border-kori-sage/10 bg-white/40">
                                <h3 className="font-display text-lg font-bold text-kori-charcoal">Live Inventory & Production Forecast</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-kori-cream/30 text-xs font-semibold text-kori-charcoal-light/50 uppercase tracking-wider">
                                            <th className="text-left px-6 py-4">Product / SKU</th>
                                            <th className="text-left px-6 py-4">Category</th>
                                            <th className="text-center px-6 py-4">Current Stock</th>
                                            <th className="text-center px-6 py-4">Batch Status</th>
                                            <th className="text-center px-6 py-4">Waitlist Demand</th>
                                            <th className="text-center px-6 py-4">Rec. Mfg Size</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-kori-sage/5">
                                        {loading ? (
                                            <tr><td colSpan={6} className="text-center py-10 animate-pulse">Loading...</td></tr>
                                        ) : scmData.map((product) => (
                                            <tr key={product.id} className="hover:bg-white/40 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-display font-medium text-sm text-kori-charcoal">{product.name}</div>
                                                    <div className="text-[10px] text-kori-charcoal-light/40 font-mono mt-0.5">{product.sku}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${CATEGORY_BADGE[product.category] || ''}`}>
                                                        {product.category.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`font-semibold text-sm ${product.stock_quantity === 0 ? 'text-red-500' : product.stock_quantity <= 10 ? 'text-amber-600' : 'text-kori-charcoal'}`}>
                                                        {product.stock_quantity > 0 ? product.stock_quantity : '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${STATUS_COLORS[product.batch_status] || ''}`}>
                                                        {product.batch_status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {product.waitlist_count > 0 ? (
                                                        <span className="font-bold text-sm text-blue-600 flex items-center justify-center gap-1">
                                                            {product.waitlist_count} <span className="opacity-50 text-xs">👥</span>
                                                        </span>
                                                    ) : <span className="text-xs text-kori-charcoal-light/20">—</span>}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {product.recommended_batch_size > 0 ? (
                                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                                                            +{product.recommended_batch_size} units
                                                        </span>
                                                    ) : <span className="text-xs text-kori-charcoal-light/20">—</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* SCM Visualizer */}
                        <div className="bg-white rounded-3xl p-8 border border-kori-sage/10 shadow-sm">
                            <h3 className="font-display text-lg font-bold text-kori-charcoal mb-6">Limited Batch Production Workflow</h3>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                                <div className="flex-1 bg-kori-cream/30 p-4 rounded-xl w-full border border-kori-sage/10">
                                    <div className="text-3xl mb-2">📢</div>
                                    <div className="text-sm font-bold text-kori-charcoal">Flavor Announced</div>
                                    <div className="text-xs text-kori-charcoal-light/50">Demand generation phase</div>
                                </div>
                                <div className="text-kori-sage hidden md:block">➔</div>
                                <div className="text-kori-sage md:hidden">↓</div>
                                <div className="flex-1 bg-blue-50 p-4 rounded-xl w-full border border-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <div className="text-3xl mb-2">👥</div>
                                    <div className="text-sm font-bold text-blue-700">Waitlist Collection</div>
                                    <div className="text-xs text-blue-600/60">Algorithm aggregates exact qty</div>
                                </div>
                                <div className="text-kori-sage hidden md:block">➔</div>
                                <div className="text-kori-sage md:hidden">↓</div>
                                <div className="flex-1 bg-purple-50 p-4 rounded-xl w-full border border-purple-100">
                                    <div className="text-3xl mb-2">🏭</div>
                                    <div className="text-sm font-bold text-purple-700">Make-to-Order Mfg</div>
                                    <div className="text-xs text-purple-600/60">Zero overproduction waste</div>
                                </div>
                                <div className="text-kori-sage hidden md:block">➔</div>
                                <div className="text-kori-sage md:hidden">↓</div>
                                <div className="flex-1 bg-kori-sage/10 p-4 rounded-xl w-full border border-kori-sage/20">
                                    <div className="text-3xl mb-2">🌿</div>
                                    <div className="text-sm font-bold text-kori-sage">Dry-Ice Shipping</div>
                                    <div className="text-xs text-kori-sage/70">D2C direct fulfillment</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── TAB 3: UNIQUENESS & MARKET RESEARCH ─── */}
                {activeTab === 'usp' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-6 mb-8 text-center">
                            <h2 className="font-display text-2xl font-bold text-amber-800 mb-2">Market Uniqueness & Differentiation (USPs)</h2>
                            <p className="text-sm text-amber-900/70 max-w-2xl mx-auto">
                                Based on Q1 Market Surveys across 1,500 premium dessert consumers, Kori氷 establishes its market dominance through authenticity, technology-driven personalization, and a scarcity-based artisan model.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* USP 1 */}
                            <div className="glass-card rounded-3xl p-8 hover:-translate-y-1 transition-transform">
                                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl mb-6">🇯🇵</div>
                                <h3 className="font-display text-lg font-bold text-kori-charcoal mb-3">Authentic Regional Sourcing</h3>
                                <p className="text-sm text-kori-charcoal-light/60">
                                    Unlike competitors using artificial flavorings, 100% of core ingredients are imported from specific Japanese prefectures (e.g., Uji Matcha from Kyoto, Yuzu from Kochi).
                                </p>
                                <div className="mt-4 pt-4 border-t border-kori-sage/10">
                                    <div className="text-[10px] font-bold text-kori-charcoal-light/40 uppercase mb-1">Survey Response</div>
                                    <div className="text-lg font-bold text-kori-sage">92%</div>
                                    <div className="text-xs text-kori-charcoal-light/60">rated flavor authenticity as "Superior"</div>
                                </div>
                            </div>

                            {/* USP 2 */}
                            <div className="glass-card rounded-3xl p-8 hover:-translate-y-1 transition-transform">
                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-xl mb-6">🤖</div>
                                <h3 className="font-display text-lg font-bold text-kori-charcoal mb-3">Data-Driven Personalization</h3>
                                <p className="text-sm text-kori-charcoal-light/60">
                                    Through the bespoke Flavor Quiz algorithm, Kori replaces the overwhelming "paradox of choice" with curated, highly accurate flavor matchmaking for each customer.
                                </p>
                                <div className="mt-4 pt-4 border-t border-kori-sage/10">
                                    <div className="text-[10px] font-bold text-kori-charcoal-light/40 uppercase mb-1">Survey Response</div>
                                    <div className="text-lg font-bold text-blue-600">3.4x</div>
                                    <div className="text-xs text-kori-charcoal-light/60">higher cart conversion after taking the quiz</div>
                                </div>
                            </div>

                            {/* USP 3 */}
                            <div className="glass-card rounded-3xl p-8 hover:-translate-y-1 transition-transform">
                                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center text-xl mb-6">⏳</div>
                                <h3 className="font-display text-lg font-bold text-kori-charcoal mb-3">The "Drop" Scarcity Model</h3>
                                <p className="text-sm text-kori-charcoal-light/60">
                                    Borrowing from streetwear fashion, limited-batch flavors are released as "Drops". This drives FOMO, ensures zero waste, and maintains a highly engaged returning customer base.
                                </p>
                                <div className="mt-4 pt-4 border-t border-kori-sage/10">
                                    <div className="text-[10px] font-bold text-kori-charcoal-light/40 uppercase mb-1">Survey Response</div>
                                    <div className="text-lg font-bold text-amber-600">78%</div>
                                    <div className="text-xs text-kori-charcoal-light/60">subscribed to emails specifically for drop alerts</div>
                                </div>
                            </div>
                        </div>

                        {/* Competitor Matrix */}
                        <div className="glass-card rounded-3xl p-8 mt-8">
                            <h3 className="font-display text-xl font-bold text-kori-charcoal mb-6 text-center">Competitor Positioning Matrix</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="border-b-2 border-kori-sage/20">
                                            <th className="py-4 px-6 text-kori-charcoal-light/50 font-medium">Feature</th>
                                            <th className="py-4 px-6 text-kori-charcoal font-bold text-lg bg-kori-cream/30 rounded-t-xl text-center">Kori氷</th>
                                            <th className="py-4 px-6 text-kori-charcoal-light/50 font-medium text-center border-l border-kori-sage/10">Generic Artisanal Brands</th>
                                            <th className="py-4 px-6 text-kori-charcoal-light/50 font-medium text-center border-l border-kori-sage/10">Supermarket Premium</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-kori-sage/10">
                                        <tr className="hover:bg-white/40">
                                            <td className="py-4 px-6 font-medium text-kori-charcoal">Sourcing</td>
                                            <td className="py-4 px-6 bg-kori-cream/30 text-center text-kori-sage font-bold">100% Regional Japan</td>
                                            <td className="py-4 px-6 text-center border-l border-kori-sage/10 text-kori-charcoal-light/70">Local / Mixed</td>
                                            <td className="py-4 px-6 text-center border-l border-kori-sage/10 text-kori-charcoal-light/70">Artificial / Commercial</td>
                                        </tr>
                                        <tr className="hover:bg-white/40">
                                            <td className="py-4 px-6 font-medium text-kori-charcoal">Customer Acquisition</td>
                                            <td className="py-4 px-6 bg-kori-cream/30 text-center text-blue-600 font-bold">Flavor Profiling Quiz</td>
                                            <td className="py-4 px-6 text-center border-l border-kori-sage/10 text-kori-charcoal-light/70">Traditional Ads</td>
                                            <td className="py-4 px-6 text-center border-l border-kori-sage/10 text-kori-charcoal-light/70">Shelf Placement</td>
                                        </tr>
                                        <tr className="hover:bg-white/40">
                                            <td className="py-4 px-6 font-medium text-kori-charcoal">Supply Chain</td>
                                            <td className="py-4 px-6 bg-kori-cream/30 text-center text-purple-600 font-bold">Make-to-Order (Zero Waste)</td>
                                            <td className="py-4 px-6 text-center border-l border-kori-sage/10 text-kori-charcoal-light/70">Make-to-Stock</td>
                                            <td className="py-4 px-6 text-center border-l border-kori-sage/10 text-kori-charcoal-light/70">Mass Production</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
