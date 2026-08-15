import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden hero-gradient">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-900/10 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium fade-in-up">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              India&apos;s First Mushroom Marketplace
            </div>

            {/* Headline */}
            <div className="space-y-4 fade-in-up" style={{ animationDelay: '100ms' }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Farm-Fresh
                <br />
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Mushrooms
                </span>
                <br />
                Direct to You
              </h1>
              <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                Connect directly with verified Indian growers. Fresh oyster, shiitake, button mushrooms and more — bypassing middlemen for restaurants, retailers, and conscious consumers.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 fade-in-up" style={{ animationDelay: '200ms' }}>
              <Link
                href="/listings"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all glow-green hover:scale-105"
              >
                Browse Listings
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/register?role=GROWER"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:border-green-500/30 text-gray-300 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5"
              >
                Sell Your Harvest
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-6 pt-4 fade-in-up" style={{ animationDelay: '300ms' }}>
              {[
                { icon: ShieldCheck, label: 'Verified Growers', value: '100%' },
                { icon: Truck, label: 'Fresh Delivery', value: 'Pan-India' },
                { icon: Star, label: 'Avg Rating', value: '4.8★' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <div className="flex justify-center mb-1">
                    <Icon size={18} className="text-green-400" />
                  </div>
                  <div className="text-white font-semibold text-sm">{value}</div>
                  <div className="text-gray-500 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative hidden lg:block fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="relative">
              {/* Main card */}
              <div className="glass rounded-2xl p-6 border border-white/10 glow-green">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">🍄</div>
                  <h3 className="text-white font-semibold">Oyster Mushrooms</h3>
                  <p className="text-gray-400 text-sm">Ravi&apos;s Green Farm, Pune</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Price/kg', value: '₹120' },
                    { label: 'Available', value: '50 kg' },
                    { label: 'Min Order', value: '2 kg' },
                    { label: 'Rating', value: '4.9 ★' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-green-400 font-semibold">{value}</div>
                      <div className="text-gray-500 text-xs">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge-verified text-xs px-2 py-1 rounded-full">✓ FSSAI Certified</span>
                  <span className="badge-verified text-xs px-2 py-1 rounded-full">✓ Verified</span>
                </div>
                <button className="w-full py-2.5 bg-green-500 hover:bg-green-400 text-white rounded-lg text-sm font-medium transition-colors">
                  Place Order →
                </button>
              </div>

              {/* Floating stat cards */}
              <div className="absolute -top-6 -right-6 glass rounded-xl p-3 border border-white/10">
                <div className="text-green-400 text-sm font-bold">+₹12,000</div>
                <div className="text-gray-500 text-xs">Today&apos;s GMV</div>
              </div>
              <div className="absolute -bottom-6 -left-6 glass rounded-xl p-3 border border-white/10">
                <div className="text-emerald-400 text-sm font-bold">47 Active</div>
                <div className="text-gray-500 text-xs">Live Listings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
