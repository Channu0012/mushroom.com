import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function BlogPage() {
  const posts = [
    {
      title: 'How Bio-Controlled Indoor Farming Boosts Oyster Mushroom Yields by 40%',
      category: 'GROWING GUIDES',
      date: 'Aug 14, 2026',
      desc: 'Learn about modern substrate humidity, temperature triggers, and harvest timing for commercial cultivation.',
    },
    {
      title: 'Understanding Razorpay Escrow Protection for Agricultural Commodity Trade',
      category: 'PAYMENTS & TRUST',
      date: 'Aug 10, 2026',
      desc: 'How escrow safeguards both buyers and growers during bulk order transactions.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Mushroom Marketplace Insights</h1>
        <p className="text-gray-400 text-xs mb-8">Guides on mushroom cultivation, ag-tech innovation, and commercial trading</p>

        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((p) => (
            <div key={p.title} className="glass rounded-2xl border border-white/10 p-6 space-y-3 card-hover">
              <span className="text-green-400 text-[10px] font-semibold tracking-wider">{p.category}</span>
              <h2 className="text-white font-bold text-base leading-snug">{p.title}</h2>
              <p className="text-gray-400 text-xs">{p.desc}</p>
              <span className="text-gray-500 text-[10px] block pt-2">{p.date}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
