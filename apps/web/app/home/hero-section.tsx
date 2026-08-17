'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, TrendingUp, Leaf } from 'lucide-react';

const MUSHROOM_TYPES = [
  { emoji: '🦪', name: 'Oyster', color: 'from-cyan-500/20 to-blue-500/10' },
  { emoji: '🍄', name: 'Button', color: 'from-amber-500/20 to-orange-500/10' },
  { emoji: '🌿', name: 'Shiitake', color: 'from-green-500/20 to-emerald-500/10' },
  { emoji: '✨', name: 'Reishi', color: 'from-purple-500/20 to-pink-500/10' },
  { emoji: '🔮', name: 'Lion\'s Mane', color: 'from-violet-500/20 to-indigo-500/10' },
  { emoji: '🌾', name: 'Milky', color: 'from-yellow-500/20 to-amber-500/10' },
];

const STATS = [
  { value: '2,400+', label: 'Verified Growers' },
  { value: '18 States', label: 'Coverage Across India' },
  { value: '₹12Cr+', label: 'GMV Processed' },
  { value: '98.4%', label: 'On-time Delivery' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-16">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/25 text-green-400 text-xs font-semibold uppercase tracking-wider mb-8 fade-in-up">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          India&apos;s #1 Mushroom Marketplace — Now Live
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
          Farm-Fresh Mushrooms,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            Direct to Your Door
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
          Connect with verified growers across India. Source premium quality mushrooms for restaurants, retailers, and homes — with guaranteed freshness.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/listings"
            id="hero-browse-btn"
            className="group flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all glow-green text-base"
          >
            Browse Fresh Listings
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/register"
            id="hero-sell-btn"
            className="px-8 py-4 glass border border-white/15 hover:border-green-500/40 text-white font-semibold rounded-xl transition-all text-base hover:bg-white/5"
          >
            Sell Your Harvest →
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16 fade-in-up" style={{ animationDelay: '0.4s' }}>
          {STATS.map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 border border-white/5">
              <div className="text-2xl font-bold text-green-400">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mushroom type pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 fade-in-up" style={{ animationDelay: '0.5s' }}>
          <span className="text-gray-600 text-sm">Browse by type:</span>
          {MUSHROOM_TYPES.map((m) => (
            <Link
              key={m.name}
              href={`/listings?type=${m.name.toLowerCase()}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${m.color} border border-white/8 text-sm text-gray-300 hover:text-white hover:border-green-500/30 transition-all`}
            >
              <span>{m.emoji}</span>
              <span>{m.name}</span>
            </Link>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-8 mt-16 text-gray-600 text-xs fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-green-500" />
            All Growers Verified
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-green-500" />
            Live Pricing
          </div>
          <div className="flex items-center gap-1.5">
            <Leaf size={14} className="text-green-500" />
            100% Fresh Guarantee
          </div>
        </div>
      </div>
    </section>
  );
}
