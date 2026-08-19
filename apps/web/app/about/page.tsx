'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Star,
  Lock,
  Eye,
  Users,
  TrendingUp,
  Sprout,
  Target,
  Search,
  FileText,
  BarChart3,
  Repeat,
  MapPin,
  ChevronRight,
  CheckCircle,
  XCircle,
  Quote,
  Zap,
  Globe,
  Truck,
  Network,
} from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { apiClient } from '@/lib/api-client';

/* ================================================================
   1. HERO
   ================================================================ */
function AboutHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-24 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
          Mushrooms should have a market
          <br />
          <span className="gradient-text">before they&apos;re harvested.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
          We connect mushroom growers with buyers looking for reliable supply — making it easier to sell, source, and build long-term business relationships.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/listings"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all glow-green hover:scale-[1.02]"
          >
            Explore Marketplace
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/register?role=GROWER"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 glass border border-green-500/20 text-green-400 font-semibold rounded-xl transition-all hover:bg-green-500/10"
          >
            I&apos;m a Grower
          </Link>
          <Link
            href="/register?role=B2B_BUYER"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 glass border border-white/10 text-white font-medium rounded-xl transition-all hover:bg-white/5"
          >
            I&apos;m a Buyer
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   2. THE PROBLEM
   ================================================================ */
function ProblemSection() {
  const growerProblems = [
    'Unsold harvest going to waste',
    'No consistent, reliable buyers',
    'Price uncertainty every season',
    'Demand is scattered and invisible',
  ];
  const buyerProblems = [
    'Unreliable mushroom suppliers',
    'Inconsistent quality every batch',
    'Hard and slow sourcing process',
    'No transparency on origin or pricing',
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a120a] border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">The problem is real</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Both sides of the mushroom market struggle — and nobody wins when supply can&apos;t find demand.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Growers card */}
          <div className="glass rounded-2xl border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                <Sprout size={20} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">For Growers</h3>
            </div>
            <ul className="space-y-3">
              {growerProblems.map((p) => (
                <li key={p} className="flex items-start gap-3 text-gray-400 text-sm">
                  <XCircle size={16} className="text-red-400/60 mt-0.5 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Buyers card */}
          <div className="glass rounded-2xl border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <Search size={20} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">For Buyers</h3>
            </div>
            <ul className="space-y-3">
              {buyerProblems.map((p) => (
                <li key={p} className="flex items-start gap-3 text-gray-400 text-sm">
                  <XCircle size={16} className="text-red-400/60 mt-0.5 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-xl font-semibold text-white">
          We connect <span className="gradient-text">both sides.</span>
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   3. MARKETPLACE PHILOSOPHY / FLOW
   ================================================================ */
function MarketplaceFlow() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How it works</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-14">
          Supply meets demand. Buyers can post requirements. Growers respond. Simple.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {/* Grower */}
          <div className="glass rounded-2xl border border-green-500/20 p-6 w-full md:w-56 text-center">
            <div className="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center mx-auto mb-3">
              <Sprout size={24} className="text-green-400" />
            </div>
            <h3 className="text-white font-bold mb-1">Grower</h3>
            <p className="text-gray-500 text-xs">Lists mushrooms, discovers demand</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center px-3">
            <div className="w-12 h-[2px] bg-gradient-to-r from-green-500/60 to-green-400/30" />
            <ChevronRight size={18} className="text-green-400 -ml-1" />
          </div>
          <div className="md:hidden py-1">
            <ChevronRight size={18} className="text-green-400 rotate-90" />
          </div>

          {/* Marketplace */}
          <div className="glass rounded-2xl border border-green-500/30 p-6 w-full md:w-64 text-center glow-green">
            <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
              <BarChart3 size={28} className="text-green-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Marketplace</h3>
            <p className="text-gray-400 text-xs">Where supply meets demand</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center px-3">
            <ChevronRight size={18} className="text-blue-400 -mr-1 rotate-180" />
            <div className="w-12 h-[2px] bg-gradient-to-r from-blue-400/30 to-blue-500/60" />
          </div>
          <div className="md:hidden py-1">
            <ChevronRight size={18} className="text-blue-400 rotate-90" />
          </div>

          {/* Buyer */}
          <div className="glass rounded-2xl border border-blue-500/20 p-6 w-full md:w-56 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center mx-auto mb-3">
              <Target size={24} className="text-blue-400" />
            </div>
            <h3 className="text-white font-bold mb-1">Buyer</h3>
            <p className="text-gray-500 text-xs">Posts requirements, finds supply</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   4. FOR GROWERS / FOR BUYERS
   ================================================================ */
function UserTypeCards() {
  const growerPerks = [
    { icon: FileText, text: 'List your mushrooms with full details' },
    { icon: Users, text: 'Discover verified buyers near you' },
    { icon: Target, text: 'Respond to real buyer requirements' },
    { icon: Repeat, text: 'Build repeat customer relationships' },
  ];
  const buyerPerks = [
    { icon: Search, text: 'Search supply by type, location, price' },
    { icon: Sprout, text: 'Find verified growers you can trust' },
    { icon: FileText, text: 'Post requirements — growers come to you' },
    { icon: BarChart3, text: 'Compare offers and choose the best' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a120a] border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Built for both sides</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Growers */}
          <div className="glass rounded-2xl border border-green-500/15 p-8 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-6">For Growers</h3>
            <ul className="space-y-4 flex-1">
              {growerPerks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-green-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{text}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register?role=GROWER"
              className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all"
            >
              Join as Grower
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Buyers */}
          <div className="glass rounded-2xl border border-blue-500/15 p-8 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-6">For Buyers</h3>
            <ul className="space-y-4 flex-1">
              {buyerPerks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-blue-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{text}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register?role=B2B_BUYER"
              className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all"
            >
              Join as Buyer
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   5. DEMAND STARTS HERE — Requirement Preview Card
   ================================================================ */
function RequirementPreviewCard() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Demand starts <span className="gradient-text">here</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-3">
              Buyers post exactly what they need. Growers discover real demand and respond directly.
            </p>
            <p className="text-gray-500 text-sm">
              No guessing. No cold calls. Real requirements from real businesses.
            </p>
          </div>

          {/* Fake requirement card */}
          <div className="glass rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                Active Requirement
              </span>
              <span className="text-xs text-gray-600">2h ago</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Mushroom Type</span>
                <span className="text-white text-sm font-medium">Oyster (White)</span>
              </div>
              <div className="h-[1px] bg-white/5" />
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Quantity</span>
                <span className="text-white text-sm font-medium">200 kg / week</span>
              </div>
              <div className="h-[1px] bg-white/5" />
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Location</span>
                <span className="text-white text-sm font-medium">Bengaluru, KA</span>
              </div>
              <div className="h-[1px] bg-white/5" />
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Budget</span>
                <span className="text-white text-sm font-medium">&#8377;100 – &#8377;140 / kg</span>
              </div>
              <div className="h-[1px] bg-white/5" />
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Frequency</span>
                <span className="text-white text-sm font-medium">Weekly, ongoing</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <p className="text-gray-600 text-xs mb-3">Are you a grower who can fulfill this?</p>
              <Link
                href="/register?role=GROWER"
                className="inline-flex items-center gap-1.5 text-green-400 text-sm font-semibold hover:text-green-300 transition-colors"
              >
                Respond to Requirements <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   6. TRUST SECTION
   ================================================================ */
function TrustSection() {
  const trustItems = [
    { icon: ShieldCheck, label: 'Verified Growers', desc: 'Every farm goes through a verification process' },
    { icon: Users, label: 'Verified Businesses', desc: 'Buyers are validated before they can transact' },
    { icon: Eye, label: 'Transparent Listings', desc: 'Real prices, real photos, real availability' },
    { icon: Star, label: 'Transaction Reviews', desc: 'Reviews from actual completed orders only' },
    { icon: Lock, label: 'Secure Payments', desc: 'Protected through Razorpay payment gateway' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a120a] border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Trust is earned</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We build trust through real transactions, not fake numbers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trustItems.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass rounded-xl border border-white/5 p-5 card-hover">
              <Icon size={22} className="text-green-400 mb-3" />
              <h3 className="text-white font-semibold text-sm mb-1">{label}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   7. HONESTY SECTION — "What We Don't Do"
   ================================================================ */
function HonestySection() {
  const dont = [
    'Fake listings to inflate numbers',
    'Fake reviews or paid testimonials',
    'Hidden fees or surprise charges',
    'Pretend supply exists when it doesn\'t',
  ];
  const doItems = [
    'Connect real growers with real buyers',
    'Show real demand posted by real businesses',
    'Enable real, trackable transactions',
    'Build long-term trade relationships',
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Our honesty policy</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl border border-red-500/10 p-8">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <XCircle size={20} className="text-red-400" />
              We don&apos;t
            </h3>
            <ul className="space-y-3">
              {dont.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400/60 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl border border-green-500/10 p-8">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <CheckCircle size={20} className="text-green-400" />
              We do
            </h3>
            <ul className="space-y-3">
              {doItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   8. FOUNDER MESSAGE
   ================================================================ */
function FounderMessage() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a120a] border-y border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <Quote size={32} className="text-green-500/30 mx-auto mb-6" />
        <blockquote className="space-y-4 mb-8">
          <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed">
            We didn&apos;t want to build another listing website.
          </p>
          <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed">
            We wanted to build the place where supply and demand actually meet.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            Start small. Build trust. Improve every transaction.
          </p>
        </blockquote>
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-green-400 font-bold text-sm">C</span>
          </div>
          <div className="text-left">
            <p className="text-white text-sm font-semibold">Channu</p>
            <p className="text-gray-600 text-xs">Founder, MushroomMarket</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   9. NORTH STAR
   ================================================================ */
function NorthStar() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <Star size={14} />
          Our North Star
        </div>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug">
          A grower should never struggle to find a buyer,
          <br className="hidden sm:block" />
          <span className="gradient-text"> and a buyer should never struggle to find reliable mushroom supply.</span>
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   10. MARKETPLACE STATS (LIVE DATA)
   ================================================================ */
function MarketplaceStats() {
  const [stats, setStats] = useState<{
    growers: number | null;
    buyers: number | null;
    listings: number | null;
  }>({ growers: null, buyers: null, listings: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await apiClient.get<any>('/analytics/marketplace');
        setStats({
          growers: data?.totalGrowers ?? null,
          buyers: data?.totalBuyers ?? null,
          listings: data?.totalListings ?? null,
        });
      } catch {
        // API not available — leave nulls
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const hasData = stats.growers || stats.buyers || stats.listings;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a120a] border-y border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-8">Marketplace right now</h2>

        {loading ? (
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer rounded-xl h-20" />
            ))}
          </div>
        ) : hasData ? (
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-green-400">
                {stats.growers ?? 0}
              </div>
              <div className="text-gray-500 text-xs mt-1">Active Growers</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {stats.buyers ?? 0}
              </div>
              <div className="text-gray-500 text-xs mt-1">Registered Buyers</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-green-400">
                {stats.listings ?? 0}
              </div>
              <div className="text-gray-500 text-xs mt-1">Live Listings</div>
            </div>
          </div>
        ) : (
          <div className="glass rounded-2xl border border-white/10 p-8">
            <p className="text-gray-400 text-lg font-medium">We&apos;re just getting started.</p>
            <p className="text-gray-600 text-sm mt-2">
              Be among the first growers and buyers on the platform.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold rounded-xl transition-all"
            >
              Join Early <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================================================================
   11. LOCATION / EXPANSION
   ================================================================ */
function LocationSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <MapPin size={14} />
          Coverage
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Starting in <span className="gradient-text">Bengaluru</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Expanding across India — one city, one grower, one transaction at a time.
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   12. FUTURE VISION
   ================================================================ */
function VisionSection() {
  const today = [
    { icon: Sprout, label: 'Mushroom Marketplace' },
  ];
  const future = [
    { icon: Truck, label: 'Supply Chain' },
    { icon: BarChart3, label: 'Procurement Tools' },
    { icon: Globe, label: 'Logistics Network' },
    { icon: Network, label: 'Industry Network' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a120a] border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Where we&apos;re going</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-green-400 mb-4">Today</h3>
            {today.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 p-4 glass rounded-xl border border-green-500/20">
                <Icon size={20} className="text-green-400" />
                <span className="text-white font-medium">{label}</span>
                <span className="ml-auto text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Live</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Future</h3>
            <div className="space-y-3">
              {future.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 p-4 glass rounded-xl border border-white/5 opacity-70">
                  <Icon size={20} className="text-gray-500" />
                  <span className="text-gray-400 font-medium">{label}</span>
                  <span className="ml-auto text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">Coming</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   13. FINAL CTA
   ================================================================ */
function FinalCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
          You grow mushrooms.
          <br />
          <span className="gradient-text">We help you find the market.</span>
        </h2>
        <p className="text-gray-500 mb-10 max-w-lg mx-auto">
          Whether you&apos;re growing or buying — this is where it starts.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/register?role=GROWER"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all glow-green hover:scale-[1.02]"
          >
            I&apos;m a Grower
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/register?role=B2B_BUYER"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 glass border border-blue-500/20 text-blue-400 font-semibold rounded-xl transition-all hover:bg-blue-500/10"
          >
            I&apos;m a Buyer
          </Link>
          <Link
            href="/listings"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 glass border border-white/10 text-white font-medium rounded-xl transition-all hover:bg-white/5"
          >
            Explore Marketplace
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   14. MINI REQUIREMENT FORM
   ================================================================ */
function RequirementFormMini() {
  const [form, setForm] = useState({
    mushroomType: '',
    quantity: '',
    location: '',
    date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to full requirement creation with prefilled data
    const params = new URLSearchParams();
    if (form.mushroomType) params.set('type', form.mushroomType);
    if (form.quantity) params.set('qty', form.quantity);
    if (form.location) params.set('loc', form.location);
    if (form.date) params.set('date', form.date);
    window.location.href = `/requirements/new?${params.toString()}`;
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all';

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a120a] border-t border-white/5">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Can&apos;t find what you need?
          </h2>
          <p className="text-gray-500 text-sm">
            Post a requirement and let growers come to you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl border border-white/10 p-6 sm:p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Mushroom Type</label>
              <select
                value={form.mushroomType}
                onChange={(e) => setForm({ ...form, mushroomType: e.target.value })}
                className={inputClass}
              >
                <option value="">Select type</option>
                <option value="oyster">Oyster</option>
                <option value="button">Button</option>
                <option value="shiitake">Shiitake</option>
                <option value="milky">Milky</option>
                <option value="paddy-straw">Paddy Straw</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Quantity (kg)</label>
              <input
                type="text"
                placeholder="e.g. 100"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Delivery Location</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Required By</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all glow-green flex items-center justify-center gap-2"
          >
            <Zap size={16} />
            Post Requirement
          </button>
        </form>
      </div>
    </section>
  );
}

/* ================================================================
   PAGE
   ================================================================ */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <AboutHero />
      <ProblemSection />
      <MarketplaceFlow />
      <UserTypeCards />
      <RequirementPreviewCard />
      <TrustSection />
      <HonestySection />
      <FounderMessage />
      <NorthStar />
      <MarketplaceStats />
      <LocationSection />
      <VisionSection />
      <FinalCTA />
      <RequirementFormMini />
      <Footer />
    </main>
  );
}
