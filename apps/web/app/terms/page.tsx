import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <h1 className="text-3xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-gray-400 text-xs mb-8">Last Updated: August 2026</p>

        <div className="glass rounded-3xl border border-white/10 p-8 space-y-6 text-xs text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-sm mb-2">1. Marketplace Platform Agreement</h2>
            <p>MushroomMarket operates as an online marketplace facilitating commercial transactions between verified mushroom growers and buyers.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-sm mb-2">2. Grower Verification</h2>
            <p>Growers must submit valid government identification and farm location evidence for verification before listing commercial produce.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
