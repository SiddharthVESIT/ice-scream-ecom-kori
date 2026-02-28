'use client';

import FlavorQuiz from '@/components/FlavorQuiz';
import Link from 'next/link';

const SEASONAL_DROPS = [
  { name: 'Sakura Blossom', tag: 'Spring Special', emoji: '🌸', color: 'bg-pink-50 border-pink-200/40' },
  { name: 'Yuzu Citrus', tag: 'Low Stock', emoji: '🍋', color: 'bg-yellow-50 border-yellow-200/40' },
  { name: 'Houjicha Amber', tag: 'Pre-Order', emoji: '🍂', color: 'bg-amber-50 border-amber-200/40' },
];

export default function HomePage() {
  return (
    <div className="wabi-sabi-bg">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-kori-sage/5 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-kori-pale-yellow/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-kori-ice/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <span className="inline-block text-6xl mb-6">🧊</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-kori-charcoal leading-tight mb-4">
              Kori<span className="text-kori-sage">氷</span>
            </h1>
            <p className="font-display text-lg md:text-xl text-kori-charcoal-light/60 font-light tracking-wide mb-2">
              Premium Artisanal Japanese Ice Cream
            </p>
          </div>
          <p className="animate-fade-in-delay text-sm md:text-base text-kori-charcoal-light/40 max-w-md mx-auto mb-10 leading-relaxed">
            Handcrafted in small batches with authentic ingredients sourced from Japan&apos;s finest regions. Each pint tells a story.
          </p>
          <div className="animate-fade-in-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-3 bg-kori-charcoal text-kori-cream rounded-full text-sm font-medium hover:bg-kori-sage transition-all duration-300 hover:scale-105"
            >
              Explore Flavors
            </Link>
            <Link
              href="/products?category=subscription"
              className="px-8 py-3 border border-kori-gold/40 text-kori-gold rounded-full text-sm font-medium hover:bg-kori-gold/10 transition-all duration-300"
            >
              Join Kori Club ✦
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Flavor Discovery Quiz ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl font-semibold text-kori-charcoal mb-3">
            Discover Your Flavor
          </h2>
          <p className="text-sm text-kori-charcoal-light/50 max-w-md mx-auto">
            Answer three questions and we&apos;ll match you with your perfect Japanese ice cream profile.
          </p>
        </div>
        <FlavorQuiz />
      </section>

      {/* ─── Seasonal Drops ─── */}
      <section className="py-20 px-6 bg-kori-cream/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold text-kori-charcoal mb-3">
              Seasonal Drops
            </h2>
            <p className="text-sm text-kori-charcoal-light/50">
              Limited releases crafted with the season&apos;s finest ingredients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEASONAL_DROPS.map((drop, i) => (
              <div
                key={drop.name}
                className={`${drop.color} border rounded-2xl p-8 text-center hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                  {drop.emoji}
                </span>
                <h3 className="font-display text-lg font-semibold text-kori-charcoal mb-1">
                  {drop.name}
                </h3>
                <span className="inline-block text-xs font-medium text-kori-sage bg-kori-sage/10 px-3 py-1 rounded-full">
                  {drop.tag}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="text-sm text-kori-charcoal-light/50 hover:text-kori-sage underline underline-offset-4 transition-colors"
            >
              View all flavors →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Kori Club CTA ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-kori-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-kori-sage/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <span className="text-3xl mb-4 block">📦</span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-kori-charcoal mb-3">
                Kori Club
              </h2>
              <p className="text-sm text-kori-charcoal-light/50 max-w-md mx-auto mb-3">
                Monthly curated tasting box with 4 rotating seasonal pints. Get early access to limited drops.
              </p>
              <p className="font-display text-2xl font-bold text-kori-gold mb-6">
                ¥4,980<span className="text-sm font-normal text-kori-charcoal-light/40">/month</span>
              </p>
              <Link
                href="/products?category=subscription"
                className="inline-block px-8 py-3 bg-kori-gold text-white rounded-full text-sm font-medium hover:bg-kori-gold/90 transition-all duration-300 hover:scale-105"
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Newsletter / Exclusive Offers ─── */}
      <section className="py-16 px-6 bg-kori-charcoal">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-2xl font-semibold text-kori-cream mb-3">
            Exclusive Offers
          </h2>
          <p className="text-sm text-kori-cream/40 mb-8">
            Sign up for early access to limited drops, exclusive discounts, and flavor news.
          </p>
          <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-3 bg-kori-cream/10 border border-kori-cream/10 rounded-full text-sm text-kori-cream placeholder:text-kori-cream/30 focus:outline-none focus:border-kori-sage/40 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-kori-sage text-white rounded-full text-sm font-medium hover:bg-kori-sage/90 transition-all duration-300"
            >
              Join
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
