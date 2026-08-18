import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <h1 className="text-3xl font-bold text-white mb-4">Refund & Escrow Guarantee Policy</h1>
        <p className="text-gray-400 text-xs mb-8">Escrow Protection Standards</p>

        <div className="glass rounded-3xl border border-white/10 p-8 space-y-6 text-xs text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-sm mb-2">1. 100% Escrow Protection</h2>
            <p>Every buyer order is protected in Razorpay Escrow. If the delivered harvest fails weight or quality inspection, buyers can raise a claim within 24 hours for a full refund.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-sm mb-2">2. Resolution Timeline</h2>
            <p>Disputes are reviewed by our dedicated agricultural quality inspection team within 24 business hours.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
