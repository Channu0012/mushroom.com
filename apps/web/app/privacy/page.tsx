import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <h1 className="text-3xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-400 text-xs mb-8">Last Updated: August 2026</p>

        <div className="glass rounded-3xl border border-white/10 p-8 space-y-6 text-xs text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-sm mb-2">1. Data Collection</h2>
            <p>We collect essential user account information including email address, full name, phone number, and farm location details for agricultural verification purposes.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-sm mb-2">2. Escrow & Payment Processing</h2>
            <p>All financial transactions and escrow holdings are securely processed through Razorpay. Bank account details provided for grower payouts are encrypted in accordance with RBI guidelines.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-sm mb-2">3. Data Protection</h2>
            <p>We adhere to strict data security standards and never sell user information to third-party advertisers.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
