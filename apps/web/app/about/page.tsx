import Link from 'next/link';
import { ShieldCheck, TrendingUp, Users, Leaf, ArrowRight, Heart, Award } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Zero Middlemen Exploitation',
    description: 'We connect growers straight to buyers, ensuring farmers keep 90%+ of end value.',
    color: 'text-green-400',
  },
  {
    icon: Leaf,
    title: '100% Quality & Traceability',
    description: 'Every harvest listed can be traced back to its specific farm batch and harvest timestamp.',
    color: 'text-emerald-400',
  },
  {
    icon: TrendingUp,
    title: 'Empowering Rural Ag-Tech',
    description: 'Building modern digital tools for mushroom growers in 18 states across India.',
    color: 'text-blue-400',
  },
  {
    icon: Award,
    title: 'Guaranteed Escrow Security',
    description: 'Funds are protected with Razorpay escrow until the buyer confirms harvest quality.',
    color: 'text-amber-400',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="pt-20">
        {/* Hero */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center hero-gradient">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass border border-green-500/25 text-green-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Heart size={14} /> Our Mission
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
            Transforming India&apos;s Mushroom Ecosystem
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
            MushroomMarket was founded to bridge the gap between hard-working mushroom growers and commercial buyers, restaurants, and health-conscious households across India.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/listings" className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all glow-green">
              Explore Marketplace
            </Link>
            <Link href="/register?role=GROWER" className="px-6 py-3 glass border border-white/10 text-white font-medium rounded-xl hover:bg-white/5 transition-all">
              Join as a Grower
            </Link>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Our Core Principles</h2>
            <p className="text-gray-500 text-sm">Why thousands of agricultural producers trust MushroomMarket</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val) => (
              <div key={val.title} className="glass rounded-2xl border border-white/10 p-6 card-hover">
                <val.icon size={28} className={`${val.color} mb-4`} />
                <h3 className="text-white font-bold text-base mb-2">{val.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-[#0a120a] border-y border-white/5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-green-400">2,400+</div>
              <div className="text-xs text-gray-500 mt-1">Verified Farms</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">18</div>
              <div className="text-xs text-gray-500 mt-1">States Covered</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-green-400">₹12Cr+</div>
              <div className="text-xs text-gray-500 mt-1">Grower Revenue Generated</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">99.2%</div>
              <div className="text-xs text-gray-500 mt-1">Order Satisfaction Rate</div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
