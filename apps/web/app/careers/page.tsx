import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Join the MushroomMarket Team</h1>
        <p className="text-gray-400 text-xs mb-8">We are building India&apos;s leading digital infrastructure for high-value agriculture.</p>

        <div className="glass rounded-3xl border border-white/10 p-8 text-center">
          <div className="text-4xl mb-3">🌱</div>
          <h2 className="text-xl font-bold text-white mb-2">Build the Future of Ag-Tech</h2>
          <p className="text-gray-400 text-xs max-w-md mx-auto mb-6">
            We are hiring full-stack engineers, agricultural agronomists, and logistics operation specialists across Bangalore, Pune, and Delhi.
          </p>
          <a href="mailto:careers@mushroommarket.in" className="inline-block px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold text-xs rounded-xl glow-green">
            Email Resume: careers@mushroommarket.in
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
