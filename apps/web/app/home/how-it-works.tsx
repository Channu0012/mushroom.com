import { UserCheck, Search, ShoppingCart, Truck } from 'lucide-react';

const STEPS = [
  {
    icon: UserCheck,
    step: '01',
    title: 'Register & Get Verified',
    description: 'Create your account as a grower or buyer. Growers submit farm details and get verified by our team.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: Search,
    step: '02',
    title: 'Browse or List',
    description: 'Buyers search fresh listings by mushroom type, location, and price. Growers create detailed listings.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: ShoppingCart,
    step: '03',
    title: 'Place Your Order',
    description: 'Secure checkout with Razorpay. Escrow-protected payments ensure both parties are protected.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: Truck,
    step: '04',
    title: 'Fresh Delivery',
    description: 'Track your order in real time. Growers fulfill via pickup or delivery. Rate your experience.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-[#0a120a]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-green-400 text-xs font-semibold uppercase tracking-widest">Simple Process</span>
          <h2 className="text-3xl font-bold text-white mt-2">How MushroomMarket Works</h2>
          <p className="text-gray-500 text-base mt-3 max-w-xl mx-auto">
            From farm to table in 4 easy steps — transparent, fast, and secure.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.step} className="relative group">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent z-0 -translate-x-1/2" />
              )}

              <div className={`glass rounded-2xl border ${step.border} p-6 h-full card-hover`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${step.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <step.icon size={20} className={step.color} />
                  </div>
                  <span className="text-3xl font-black text-white/10">{step.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
