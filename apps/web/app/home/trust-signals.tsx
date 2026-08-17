import { ShieldCheck, Zap, Lock, HeartHandshake, BadgeCheck, Globe } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'KYC Verified Growers',
    description: 'Every grower on our platform is KYC verified with government-issued IDs and farm inspection.',
    color: 'text-green-400',
    bg: 'from-green-500/15 to-green-500/5',
    border: 'border-green-500/20',
  },
  {
    icon: Lock,
    title: 'Escrow-Protected Payments',
    description: 'Your money stays in escrow until you confirm delivery. Powered by Razorpay.',
    color: 'text-blue-400',
    bg: 'from-blue-500/15 to-blue-500/5',
    border: 'border-blue-500/20',
  },
  {
    icon: Zap,
    title: 'Real-Time Freshness Tracking',
    description: 'Live order updates from harvest to delivery. Know exactly when your mushrooms arrive.',
    color: 'text-amber-400',
    bg: 'from-amber-500/15 to-amber-500/5',
    border: 'border-amber-500/20',
  },
  {
    icon: HeartHandshake,
    title: 'Dispute Resolution',
    description: 'Fair dispute resolution with our dedicated team. Quality issues are resolved within 24 hours.',
    color: 'text-rose-400',
    bg: 'from-rose-500/15 to-rose-500/5',
    border: 'border-rose-500/20',
  },
  {
    icon: BadgeCheck,
    title: 'Quality Certification',
    description: 'Growers can earn quality badges — Organic, GAP Certified, Premium — verified by our team.',
    color: 'text-purple-400',
    bg: 'from-purple-500/15 to-purple-500/5',
    border: 'border-purple-500/20',
  },
  {
    icon: Globe,
    title: 'Pan-India Network',
    description: 'Sourcing from 18 states across India. Get the best seasonal varieties from regional growers.',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/15 to-cyan-500/5',
    border: 'border-cyan-500/20',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ramesh Kumar',
    role: 'Oyster Mushroom Grower, Karnataka',
    quote: 'I doubled my income in 3 months after joining MushroomMarket. The verification process gave buyers confidence in my farm.',
    rating: 5,
    avatar: 'RK',
  },
  {
    name: 'Chef Priya Sharma',
    role: 'Restaurant Owner, Mumbai',
    quote: 'Consistent quality and on-time delivery. I now source 100% of my mushrooms through this platform. Zero hassle.',
    rating: 5,
    avatar: 'PS',
  },
  {
    name: 'Vikram Anand',
    role: 'Retail Chain Buyer, Bangalore',
    quote: 'The wholesale pricing and bulk ordering features are exactly what we needed. Excellent platform for B2B sourcing.',
    rating: 5,
    avatar: 'VA',
  },
];

export function TrustSignals() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Why trust us */}
        <div className="text-center mb-14">
          <span className="text-green-400 text-xs font-semibold uppercase tracking-widest">Why Us</span>
          <h2 className="text-3xl font-bold text-white mt-2">Built on Trust & Transparency</h2>
          <p className="text-gray-500 text-base mt-3 max-w-xl mx-auto">
            We don&apos;t just connect buyers and sellers — we ensure every transaction is safe, fair, and traceable.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className={`bg-gradient-to-br ${item.bg} border ${item.border} rounded-2xl p-6 card-hover`}
            >
              <item.icon size={24} className={`${item.color} mb-4`} />
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-10">
          <span className="text-green-400 text-xs font-semibold uppercase tracking-widest">Testimonials</span>
          <h2 className="text-3xl font-bold text-white mt-2">What Our Users Say</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="glass rounded-2xl border border-white/5 p-6 card-hover">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-gray-600 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
