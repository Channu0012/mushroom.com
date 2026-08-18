'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Heart, Clock, Truck, ShieldCheck, ArrowRight, Check, BookOpen } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { toast } from 'sonner';

const SUBSCRIPTION_BOXES = [
  {
    id: 'box-gourmet',
    name: 'Gourmet Chef Box',
    emoji: '🍄',
    tag: 'MOST POPULAR',
    weight: '2 kg / week',
    items: ['500g Fresh Oyster', '500g Button', '500g Shiitake', '500g Lion\'s Mane'],
    price: 899,
    savings: 'Save 25%',
  },
  {
    id: 'box-health',
    name: 'Wellness & Medicinal Box',
    emoji: '✨',
    tag: 'IMMUNITY BOOST',
    weight: '1.5 kg / week',
    items: ['500g Reishi Slices', '500g Lion\'s Mane', '500g Organic Shiitake'],
    price: 1199,
    savings: 'Save 30%',
  },
  {
    id: 'box-family',
    name: 'Daily Family Harvest Box',
    emoji: '🥗',
    tag: 'EVERYDAY FRESH',
    weight: '3 kg / week',
    items: ['1.5kg Farm Button', '1.5kg White Oyster'],
    price: 699,
    savings: 'Save 20%',
  },
];

const CULINARY_TIPS = [
  {
    title: 'How to Keep Mushrooms Fresh for 10+ Days',
    desc: 'Store in a paper bag inside your refrigerator crisper drawer. Never wash with water until right before cooking!',
  },
  {
    title: 'Sautéing vs Roasting: Releasing Deep Umami',
    desc: 'Cook mushrooms dry in a hot pan for 3 minutes to release moisture before adding oil or butter for max caramelization.',
  },
  {
    title: 'Freezing & Dehydrating Surplus Harvest',
    desc: 'Slice and steam mushrooms for 3 minutes before freezing, or dehydrate at 50°C for shelf-stable mushroom powder.',
  },
];

export default function ConsumerPortal() {
  const [selectedBox, setSelectedBox] = useState<string>('box-gourmet');

  const handleSubscribe = (boxName: string) => {
    toast.success(`Subscribed to ${boxName}! Fresh weekly delivery scheduled.`);
  };

  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        {/* Hero */}
        <div className="glass rounded-3xl border border-white/10 p-8 mb-10 hero-gradient">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles size={14} /> Farm-to-Table Retail Store
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Fresh Organic Mushrooms Delivered Weekly</h1>
              <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                Harvested within 6 hours of dispatch from verified local farms. Zero chemical preservatives. 100% money-back freshness guarantee.
              </p>
            </div>
            <Link
              href="/listings"
              className="px-6 py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold text-sm rounded-xl transition-all glow-green flex-shrink-0"
            >
              Browse Individual Packs →
            </Link>
          </div>
        </div>

        {/* Weekly Subscription Boxes */}
        <div className="mb-14">
          <div className="text-center mb-10">
            <span className="text-green-400 text-xs font-semibold uppercase tracking-widest">Subscription Store</span>
            <h2 className="text-3xl font-bold text-white mt-1">Weekly Farm Fresh Boxes</h2>
            <p className="text-gray-400 text-sm mt-2">Pause, modify, or cancel anytime with 1 click</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SUBSCRIPTION_BOXES.map((box) => (
              <div
                key={box.id}
                className={`glass rounded-3xl border ${selectedBox === box.id ? 'border-green-500 bg-green-500/5' : 'border-white/10'} p-7 card-hover flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{box.emoji}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-extrabold tracking-wider">
                      {box.tag}
                    </span>
                  </div>

                  <h3 className="text-white font-extrabold text-xl mb-1">{box.name}</h3>
                  <div className="text-gray-400 text-xs font-medium mb-4">{box.weight}</div>

                  <div className="space-y-2 mb-6">
                    {box.items.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-gray-300">
                        <Check size={14} className="text-green-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-4 pt-4 border-t border-white/5">
                    <div>
                      <span className="text-2xl font-extrabold text-white">₹{box.price}</span>
                      <span className="text-gray-500 text-xs">/week</span>
                    </div>
                    <span className="text-xs text-green-400 font-bold">{box.savings}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBox(box.id);
                      handleSubscribe(box.name);
                    }}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all ${
                      selectedBox === box.id
                        ? 'bg-green-500 text-white glow-green'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    Subscribe Weekly
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Culinary & Storage Guide */}
        <div className="glass rounded-3xl border border-white/10 p-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={22} className="text-amber-400" />
            <h2 className="text-xl font-bold text-white">Mushroom Storage & Culinary Guide</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {CULINARY_TIPS.map((tip) => (
              <div key={tip.title} className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-2">
                <h3 className="text-white font-bold text-sm leading-snug">{tip.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
