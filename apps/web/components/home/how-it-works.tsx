import { UserCheck, ShoppingCart, Truck, Star } from 'lucide-react';

const steps = [
  {
    icon: UserCheck,
    step: '01',
    title: 'Get Verified',
    description: 'Growers submit farm details & FSSAI certificates. Buyers register their business. Verification takes 24-48 hours.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: ShoppingCart,
    step: '02',
    title: 'Browse & Order',
    description: 'Browse verified listings. Filter by mushroom type, location, price. Post requirements if you need regular supply.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: Truck,
    step: '03',
    title: 'Secure Fulfillment',
    description: 'Pay securely via Razorpay. Grower confirms and prepares your order. Track status in real-time.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: Star,
    step: '04',
    title: 'Review & Repeat',
    description: 'Confirm receipt and leave a verified review. Build long-term supplier relationships. Unlock bulk pricing.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-[#0f1a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="text-green-400 text-sm font-medium mb-2">SIMPLE PROCESS</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From farm gate to your kitchen or restaurant — a transparent, trust-first process designed for India.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, step, title, description, color, bg }) => (
            <div key={step} className="glass rounded-xl border border-white/5 p-6 relative card-hover">
              <div className="absolute top-4 right-4 text-4xl font-bold text-white/5">{step}</div>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon size={18} className={color} />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
