'use client';

import { useState } from 'react';

const MOCK_USER = {
    fullName: 'Takeshi Yamamoto',
    email: 'takeshi@kori.jp',
    loyaltyPoints: 2450,
    tier: 'silver',
    favoriteFlavors: ['matcha', 'creamy', 'floral'],
    newsletterSubscribed: true,
};

const MOCK_ORDERS = [
    {
        id: 1,
        orderNumber: 'KORI-1709312400-A3F2B1',
        status: 'delivered',
        trackingStatus: 'Delivered',
        totalCents: 6620,
        ecoPackaging: true,
        createdAt: '2026-02-25',
        items: [
            { name: 'Kyoto Matcha', quantity: 2, emoji: '🍵' },
            { name: 'Hokkaido Milk', quantity: 1, emoji: '🥛' },
        ],
    },
    {
        id: 2,
        orderNumber: 'KORI-1709398800-C1D4E2',
        status: 'processing',
        trackingStatus: 'Preparing your order',
        totalCents: 3560,
        ecoPackaging: true,
        createdAt: '2026-02-27',
        items: [
            { name: 'Sakura Blossom', quantity: 1, emoji: '🌸' },
            { name: 'Yuzu Citrus', quantity: 1, emoji: '🍋' },
        ],
    },
    {
        id: 3,
        orderNumber: 'KORI-1709485200-F5G6H3',
        status: 'shipped',
        trackingStatus: 'In transit — arriving Mar 2',
        totalCents: 4980,
        ecoPackaging: true,
        createdAt: '2026-02-28',
        items: [
            { name: 'Kori Club Box', quantity: 1, emoji: '📦' },
        ],
    },
];

const TIER_INFO: Record<string, { label: string; color: string; next: string; pointsNeeded: number }> = {
    bronze: { label: 'Bronze', color: 'bg-amber-700/10 text-amber-700', next: 'Silver', pointsNeeded: 2000 },
    silver: { label: 'Silver', color: 'bg-gray-200 text-gray-600', next: 'Gold', pointsNeeded: 5000 },
    gold: { label: 'Gold', color: 'bg-kori-gold/15 text-kori-gold', next: 'Max Tier', pointsNeeded: 99999 },
};

const STATUS_BADGE: Record<string, { class: string; icon: string }> = {
    pending: { class: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
    processing: { class: 'bg-blue-100 text-blue-700', icon: '🔄' },
    shipped: { class: 'bg-purple-100 text-purple-700', icon: '📬' },
    delivered: { class: 'bg-kori-sage/10 text-kori-sage', icon: '✅' },
};

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'orders' | 'loyalty' | 'preferences'>('orders');
    const user = MOCK_USER;
    const tier = TIER_INFO[user.tier] || TIER_INFO.bronze;
    const progress = Math.min(100, (user.loyaltyPoints / tier.pointsNeeded) * 100);

    return (
        <div className="wabi-sabi-bg min-h-screen">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="font-display text-3xl font-bold text-kori-charcoal mb-1">
                        Welcome back, {user.fullName.split(' ')[0]}
                    </h1>
                    <p className="text-sm text-kori-charcoal-light/40">Your Kori氷 account dashboard</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <div className="glass-card rounded-2xl p-6 text-center">
                        <span className="text-3xl block mb-2">✦</span>
                        <p className="font-display text-2xl font-bold text-kori-gold">{user.loyaltyPoints.toLocaleString()}</p>
                        <p className="text-xs text-kori-charcoal-light/40">Kori Points</p>
                    </div>
                    <div className="glass-card rounded-2xl p-6 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${tier.color}`}>
                            {tier.label} Tier
                        </span>
                        <div className="w-full bg-kori-sage/10 rounded-full h-2 mt-2">
                            <div
                                className="bg-kori-gold h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-kori-charcoal-light/30 mt-1">
                            {tier.next !== 'Max Tier' ? `${tier.pointsNeeded - user.loyaltyPoints} pts to ${tier.next}` : '🎉 Max Tier reached!'}
                        </p>
                    </div>
                    <div className="glass-card rounded-2xl p-6 text-center">
                        <span className="text-3xl block mb-2">📦</span>
                        <p className="font-display text-2xl font-bold text-kori-charcoal">{MOCK_ORDERS.length}</p>
                        <p className="text-xs text-kori-charcoal-light/40">Total Orders</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 justify-center">
                    {(['orders', 'loyalty', 'preferences'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize ${activeTab === tab
                                    ? 'bg-kori-charcoal text-kori-cream'
                                    : 'bg-kori-cream/60 text-kori-charcoal-light hover:bg-kori-sage/10'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-4 animate-fade-in">
                        {MOCK_ORDERS.map(order => {
                            const status = STATUS_BADGE[order.status] || STATUS_BADGE.pending;
                            return (
                                <div key={order.id} className="glass-card rounded-2xl p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-kori-charcoal-light/30 mb-1">Order #{order.orderNumber}</p>
                                            <p className="text-xs text-kori-charcoal-light/40">{order.createdAt}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.class}`}>
                                                {status.icon} {order.trackingStatus}
                                            </span>
                                            <span className="font-display font-semibold text-kori-charcoal">
                                                ¥{(order.totalCents / 100).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="bg-kori-cream/50 rounded-xl px-4 py-2 flex items-center gap-2">
                                                <span className="text-lg">{item.emoji}</span>
                                                <span className="text-sm text-kori-charcoal">{item.name}</span>
                                                <span className="text-xs text-kori-charcoal-light/40">×{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {order.ecoPackaging && (
                                        <p className="text-[10px] text-kori-sage mt-3">🌿 Eco-friendly dry-ice packaging</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Loyalty Tab */}
                {activeTab === 'loyalty' && (
                    <div className="animate-fade-in max-w-lg mx-auto">
                        <div className="glass-card rounded-2xl p-8 text-center mb-6">
                            <span className="text-5xl block mb-4">✦</span>
                            <p className="font-display text-4xl font-bold text-kori-gold mb-2">
                                {user.loyaltyPoints.toLocaleString()}
                            </p>
                            <p className="text-sm text-kori-charcoal-light/50 mb-6">Kori Points Available</p>

                            <div className="space-y-3 text-left">
                                <div className="bg-kori-cream/50 rounded-xl px-5 py-3 flex justify-between items-center">
                                    <span className="text-sm text-kori-charcoal">Early Access to Limited Drops</span>
                                    <span className="text-xs font-medium text-kori-gold">500 pts</span>
                                </div>
                                <div className="bg-kori-cream/50 rounded-xl px-5 py-3 flex justify-between items-center">
                                    <span className="text-sm text-kori-charcoal">Free Pint Upgrade</span>
                                    <span className="text-xs font-medium text-kori-gold">1,000 pts</span>
                                </div>
                                <div className="bg-kori-cream/50 rounded-xl px-5 py-3 flex justify-between items-center">
                                    <span className="text-sm text-kori-charcoal">Exclusive Tasting Event</span>
                                    <span className="text-xs font-medium text-kori-gold">3,000 pts</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-kori-charcoal-light/30 text-center">
                            Earn 10 points per ¥1 spent. Points never expire.
                        </p>
                    </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                    <div className="animate-fade-in max-w-lg mx-auto">
                        <div className="glass-card rounded-2xl p-8">
                            <h3 className="font-display text-lg font-semibold text-kori-charcoal mb-6">Your Flavor Preferences</h3>
                            <div className="mb-6">
                                <label className="text-xs text-kori-charcoal-light/40 block mb-2">Favorite Flavor Notes</label>
                                <div className="flex flex-wrap gap-2">
                                    {user.favoriteFlavors.map(f => (
                                        <span key={f} className="px-3 py-1 bg-kori-sage/10 text-kori-sage rounded-full text-xs font-medium">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="text-xs text-kori-charcoal-light/40 block mb-2">Newsletter</label>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-5 rounded-full ${user.newsletterSubscribed ? 'bg-kori-sage' : 'bg-gray-300'} relative cursor-pointer transition-colors`}>
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${user.newsletterSubscribed ? 'left-5' : 'left-0.5'}`} />
                                    </div>
                                    <span className="text-sm text-kori-charcoal-light/60">
                                        {user.newsletterSubscribed ? 'Subscribed to exclusive offers' : 'Not subscribed'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-kori-charcoal-light/40 block mb-2">Account Info</label>
                                <p className="text-sm text-kori-charcoal">{user.fullName}</p>
                                <p className="text-xs text-kori-charcoal-light/40">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
