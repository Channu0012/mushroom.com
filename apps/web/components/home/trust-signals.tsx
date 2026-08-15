import { ShieldCheck, Lock, Award, Users } from 'lucide-react';

const signals = [
  {
    icon: ShieldCheck,
    title: 'Grower Verification',
    description: 'Every grower undergoes FSSAI certificate verification, farm inspection, and identity check before listing.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'All payments processed via Razorpay with PCI-DSS compliance. Money held in escrow until delivery confirmed.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'Verified reviews from real buyers only. Fake reviews automatically detected and removed.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Users,
    title: 'Dispute Protection',
    description: 'Dedicated support team resolves all disputes within 48 hours. Full refund if quality expectations aren\'t met.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
];

export function TrustSignals() {
  return (
    <section className="py-20 bg-[#0d150d] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="text-green-400 text-sm font-medium mb-2">WHY TRUST US</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Built on Trust</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Every feature is designed to protect both growers and buyers. We only win when you win.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {signals.map(({ icon: Icon, title, description, color, bg }) => (
            <div key={title} className="glass rounded-xl border border-white/5 p-6 card-hover">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon size={18} className={color} />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm">{title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-950/50 to-emerald-950/50 p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Start Trading?</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Join India&apos;s fastest-growing mushroom marketplace. Free to register, commission only on successful sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register?role=GROWER"
                className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all glow-green"
              >
                🌱 Register as Grower
              </a>
              <a
                href="/register?role=B2B_BUYER"
                className="px-6 py-3 border border-white/10 hover:border-green-500/30 text-gray-300 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5"
              >
                🏪 Register as Buyer
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
