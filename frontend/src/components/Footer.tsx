import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-kori-charcoal text-kori-cream/70 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🧊</span>
                            <span className="font-display text-lg font-semibold text-kori-cream">
                                Kori<span className="text-kori-sage-light">氷</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-kori-cream/50">
                            Premium artisanal Japanese ice cream, handcrafted in small batches with authentic ingredients.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="font-display text-sm font-semibold text-kori-cream mb-4 uppercase tracking-widest">Explore</h4>
                        <ul className="space-y-2">
                            <li><Link href="/products" className="text-sm hover:text-kori-sage-light transition-colors">All Flavors</Link></li>
                            <li><Link href="/products?category=seasonal" className="text-sm hover:text-kori-sage-light transition-colors">Seasonal Drops</Link></li>
                            <li><Link href="/products?category=limited_batch" className="text-sm hover:text-kori-sage-light transition-colors">Limited Batches</Link></li>
                            <li><Link href="/products?category=subscription" className="text-sm hover:text-kori-sage-light transition-colors">Kori Club</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-display text-sm font-semibold text-kori-cream mb-4 uppercase tracking-widest">Company</h4>
                        <ul className="space-y-2">
                            <li><span className="text-sm">Our Story</span></li>
                            <li><span className="text-sm">Sustainability</span></li>
                            <li><span className="text-sm">Careers</span></li>
                            <li><span className="text-sm">Press</span></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="font-display text-sm font-semibold text-kori-cream mb-4 uppercase tracking-widest">Connect</h4>
                        <ul className="space-y-2">
                            <li><span className="text-sm">Instagram</span></li>
                            <li><span className="text-sm">Twitter</span></li>
                            <li><span className="text-sm">hello@kori-ice.jp</span></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-kori-cream/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-kori-cream/30">© 2026 Kori氷. All rights reserved. Crafted with ♡ in Japan.</p>
                    <p className="text-xs text-kori-cream/30">🌿 Eco-friendly dry-ice packaging on every order</p>
                </div>
            </div>
        </footer>
    );
}
