'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
    id: number;
    sku: string;
    name: string;
    category: string;
    description: string;
    flavor_profile: { notes?: string[]; intensity?: string; origin?: string };
    price_cents: number;
    stock_quantity: number;
    batch_status: string;
    waitlist_count: number;
    image_url: string;
}

const CATEGORY_LABELS: Record<string, string> = {
    all: 'All Flavors',
    classic: 'Classic',
    seasonal: 'Seasonal',
    limited_batch: 'Limited Batch',
    subscription: 'Kori Club',
};

const FLAVOR_EMOJIS: Record<string, string> = {
    'Hokkaido Milk': '🥛',
    'Yuzu Citrus': '🍋',
    'Kyoto Matcha': '🍵',
    'Black Sesame': '🌑',
    'Sakura Blossom': '🌸',
    'Houjicha Amber': '🍂',
    'Wasabi Mint': '🌿',
    'Kori Club Box': '📦',
};

const BATCH_BADGE: Record<string, { text: string; class: string }> = {
    available: { text: 'In Stock', class: 'bg-kori-sage/10 text-kori-sage' },
    low_stock: { text: 'Low Stock', class: 'bg-amber-100 text-amber-700 scarcity-badge' },
    sold_out: { text: 'Sold Out', class: 'bg-red-100 text-red-600' },
    pre_order: { text: 'Pre-Order', class: 'bg-kori-ice text-blue-600' },
};

// Mock data for when API is unavailable
const MOCK_PRODUCTS: Product[] = [
    { id: 1, sku: 'KORI-HM-001', name: 'Hokkaido Milk', category: 'classic', description: 'Ultra-creamy ice cream made with pure Hokkaido milk from free-range cows.', flavor_profile: { notes: ['creamy', 'vanilla', 'milk'], intensity: 'mild', origin: 'Hokkaido' }, price_cents: 1480, stock_quantity: 50, batch_status: 'available', waitlist_count: 0, image_url: '' },
    { id: 2, sku: 'KORI-YZ-002', name: 'Yuzu Citrus', category: 'seasonal', description: 'Bright and tangy yuzu citrus sorbet blended into a silky ice cream base.', flavor_profile: { notes: ['citrus', 'tangy', 'refreshing'], intensity: 'bright', origin: 'Kochi' }, price_cents: 1580, stock_quantity: 15, batch_status: 'low_stock', waitlist_count: 0, image_url: '' },
    { id: 3, sku: 'KORI-KM-003', name: 'Kyoto Matcha', category: 'classic', description: 'Ceremonial-grade Uji matcha from Kyoto, stone-ground and folded into rich cream.', flavor_profile: { notes: ['matcha', 'earthy', 'umami'], intensity: 'rich', origin: 'Kyoto' }, price_cents: 1680, stock_quantity: 35, batch_status: 'available', waitlist_count: 0, image_url: '' },
    { id: 4, sku: 'KORI-BS-004', name: 'Black Sesame', category: 'classic', description: 'Toasted black sesame seeds ground into a nutty, deeply aromatic ice cream.', flavor_profile: { notes: ['nutty', 'roasted', 'sesame'], intensity: 'bold', origin: 'Kagoshima' }, price_cents: 1580, stock_quantity: 28, batch_status: 'available', waitlist_count: 0, image_url: '' },
    { id: 5, sku: 'KORI-SK-005', name: 'Sakura Blossom', category: 'seasonal', description: 'Delicate cherry blossom petals infused into a light, floral ice cream.', flavor_profile: { notes: ['floral', 'cherry', 'delicate'], intensity: 'light', origin: 'Yoshino' }, price_cents: 1780, stock_quantity: 8, batch_status: 'low_stock', waitlist_count: 0, image_url: '' },
    { id: 6, sku: 'KORI-HA-006', name: 'Houjicha Amber', category: 'limited_batch', description: 'Roasted green tea with caramel undertones. Limited release.', flavor_profile: { notes: ['roasted', 'caramel', 'tea'], intensity: 'warm', origin: 'Shizuoka' }, price_cents: 1980, stock_quantity: 0, batch_status: 'pre_order', waitlist_count: 47, image_url: '' },
    { id: 7, sku: 'KORI-WM-007', name: 'Wasabi Mint', category: 'limited_batch', description: 'Fresh wasabi meets cool peppermint in an unexpectedly harmonious creation.', flavor_profile: { notes: ['spicy', 'mint', 'fresh'], intensity: 'bold', origin: 'Shizuoka' }, price_cents: 2180, stock_quantity: 5, batch_status: 'low_stock', waitlist_count: 0, image_url: '' },
    { id: 8, sku: 'KORI-KB-008', name: 'Kori Club Box', category: 'subscription', description: 'Monthly curated tasting box with 4 rotating seasonal pints.', flavor_profile: { notes: ['variety', 'curated', 'seasonal'], intensity: 'varied', origin: 'Japan' }, price_cents: 4980, stock_quantity: 999, batch_status: 'available', waitlist_count: 0, image_url: '' },
];

function ProductsCatalog() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category') || 'all';
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState(categoryParam);
    const [flavorFilter, setFlavorFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setActiveCategory(categoryParam);
    }, [categoryParam]);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const url = activeCategory !== 'all'
                    ? `http://localhost:4000/api/v1/products?category=${activeCategory}`
                    : 'http://localhost:4000/api/v1/products';
                const res = await fetch(url);
                const json = await res.json();
                setProducts(json.data || []);
            } catch {
                // Use mock data when API is unavailable
                const filtered = activeCategory !== 'all'
                    ? MOCK_PRODUCTS.filter(p => p.category === activeCategory)
                    : MOCK_PRODUCTS;
                setProducts(filtered);
            }
            setLoading(false);
        }
        fetchProducts();
    }, [activeCategory]);

    const filteredProducts = flavorFilter
        ? products.filter(p =>
            p.flavor_profile?.notes?.some(n =>
                n.toLowerCase().includes(flavorFilter.toLowerCase())
            )
        )
        : products;

    return (
        <div className="wabi-sabi-bg min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-display text-4xl font-bold text-kori-charcoal mb-3">
                        Our Flavors
                    </h1>
                    <p className="text-sm text-kori-charcoal-light/50 max-w-md mx-auto">
                        Each flavor is a journey through Japan&apos;s regions, crafted in small batches with authentic ingredients.
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(key)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === key
                                ? 'bg-kori-charcoal text-kori-cream'
                                : 'bg-kori-cream/60 text-kori-charcoal-light hover:bg-kori-sage/10 hover:text-kori-sage'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Flavor Note Filter */}
                <div className="max-w-md mx-auto mb-10">
                    <input
                        type="text"
                        placeholder="Filter by flavor notes (e.g. matcha, citrus, nutty)..."
                        value={flavorFilter}
                        onChange={(e) => setFlavorFilter(e.target.value)}
                        className="w-full px-5 py-3 rounded-full bg-white/70 border border-kori-sage/15 text-sm text-kori-charcoal placeholder:text-kori-charcoal-light/30 focus:outline-none focus:border-kori-sage/40 transition-colors"
                    />
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="text-center py-20 text-kori-charcoal-light/40 animate-pulse">Loading flavors...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-kori-charcoal-light/40">No flavors match your filter.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => {
                            const badge = BATCH_BADGE[product.batch_status] || BATCH_BADGE.available;
                            const emoji = FLAVOR_EMOJIS[product.name] || '🍨';

                            return (
                                <div
                                    key={product.id}
                                    className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group"
                                >
                                    {/* Card Image Area */}
                                    <div className="relative h-48 bg-gradient-to-br from-kori-cream to-kori-sage/10 flex items-center justify-center">
                                        <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                                            {emoji}
                                        </span>
                                        {/* Batch Status Badge */}
                                        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                                            {badge.text}
                                        </span>
                                        {/* Stock indicator */}
                                        {product.batch_status === 'low_stock' && (
                                            <span className="absolute bottom-3 left-3 text-xs text-amber-700 bg-amber-100/80 px-2 py-1 rounded-full">
                                                Only {product.stock_quantity} pints left
                                            </span>
                                        )}
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-display text-base font-semibold text-kori-charcoal">
                                                {product.name}
                                            </h3>
                                            <span className="font-display text-base font-bold text-kori-sage">
                                                ¥{(product.price_cents / 100).toFixed(0)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-kori-charcoal-light/50 mb-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        {/* Flavor Notes */}
                                        {product.flavor_profile?.notes && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {product.flavor_profile.notes.map((note: string) => (
                                                    <span
                                                        key={note}
                                                        className="text-[10px] px-2 py-0.5 bg-kori-sage/8 text-kori-sage rounded-full"
                                                    >
                                                        {note}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Origin */}
                                        {product.flavor_profile?.origin && (
                                            <p className="text-[10px] text-kori-charcoal-light/30 mb-3">
                                                Origin: {product.flavor_profile.origin}
                                            </p>
                                        )}

                                        {/* Action Button */}
                                        {product.batch_status === 'sold_out' ? (
                                            <button disabled className="w-full py-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400 cursor-not-allowed">
                                                Sold Out
                                            </button>
                                        ) : product.batch_status === 'pre_order' ? (
                                            <button className="w-full py-2.5 rounded-full text-xs font-medium bg-kori-ice text-blue-600 hover:bg-blue-100 transition-colors">
                                                Join Waitlist ({product.waitlist_count} waiting)
                                            </button>
                                        ) : (
                                            <Link
                                                href="/checkout"
                                                className="block w-full py-2.5 rounded-full text-xs font-medium text-center bg-kori-charcoal text-kori-cream hover:bg-kori-sage transition-colors"
                                            >
                                                Add to Cart
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="wabi-sabi-bg min-h-screen flex items-center justify-center text-kori-charcoal-light/40 animate-pulse">Loading flavors...</div>}>
            <ProductsCatalog />
        </Suspense>
    );
}
