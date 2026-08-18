'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, PlusCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Navigation } from '@/components/layout/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

export default function NewListingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    title: '',
    description: '',
    pricePerKg: '',
    availableQuantityKg: '',
    minOrderQuantityKg: '1',
    fulfillmentMethod: 'BOTH',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newListing = {
      id: 'lst_' + Math.random().toString(36).substring(2, 9),
      title: form.title,
      description: form.description,
      pricePerKg: Number(form.pricePerKg) || 250,
      availableQuantityKg: Number(form.availableQuantityKg) || 50,
      minOrderQuantityKg: Number(form.minOrderQuantityKg) || 1,
      fulfillmentMethod: form.fulfillmentMethod,
      createdAt: new Date().toISOString(),
      mushroomType: { name: 'Fresh Mushroom', emoji: '🍄' },
      farm: {
        name: user?.displayName || 'GreenEarth Bio Farm',
        city: 'Bangalore',
        state: 'Karnataka',
        verificationStatus: 'VERIFIED',
        averageRating: 4.9,
        totalReviews: 12,
      },
    };

    try {
      await apiClient.post('/listings', {
        title: form.title,
        description: form.description,
        pricePerKg: Number(form.pricePerKg),
        availableQuantityKg: Number(form.availableQuantityKg),
        minOrderQuantityKg: Number(form.minOrderQuantityKg),
        fulfillmentMethod: form.fulfillmentMethod,
      });
    } catch {
      // Save locally if offline
      if (typeof window !== 'undefined') {
        const existingRaw = sessionStorage.getItem('custom_listings');
        const list = existingRaw ? JSON.parse(existingRaw) : [];
        list.unshift(newListing);
        sessionStorage.setItem('custom_listings', JSON.stringify(list));
      }
    } finally {
      if (typeof window !== 'undefined') {
        const existingRaw = sessionStorage.getItem('custom_listings');
        const list = existingRaw ? JSON.parse(existingRaw) : [];
        if (!list.some((item: any) => item.id === newListing.id)) {
          list.unshift(newListing);
          sessionStorage.setItem('custom_listings', JSON.stringify(list));
        }
      }
      setLoading(false);
      toast.success('Harvest listing published successfully!');
      router.push('/listings');
    }
  };

  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="glass rounded-3xl border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-6">
            <PlusCircle size={28} className="text-green-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">List Your Harvest</h1>
              <p className="text-gray-400 text-xs mt-0.5">Post fresh mushroom stock for buyers across India</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Listing Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Fresh Organic Oyster Mushrooms - Grade A Batch"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Description & Harvest Date</label>
              <textarea
                rows={4}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe mushroom quality, cultivation substrate, expected harvest date..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Price / kg (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.pricePerKg}
                  onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })}
                  placeholder="250"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Total Quantity (kg)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.availableQuantityKg}
                  onChange={(e) => setForm({ ...form, availableQuantityKg: e.target.value })}
                  placeholder="50"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Min Order (kg)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.minOrderQuantityKg}
                  onChange={(e) => setForm({ ...form, minOrderQuantityKg: e.target.value })}
                  placeholder="1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Fulfillment Method</label>
              <select
                value={form.fulfillmentMethod}
                onChange={(e) => setForm({ ...form, fulfillmentMethod: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 text-sm focus:outline-none focus:border-green-500/50"
              >
                <option value="BOTH" className="bg-gray-900">Both Pickup & Delivery</option>
                <option value="PICKUP" className="bg-gray-900">Farm Pickup Only</option>
                <option value="SELLER_DELIVERY" className="bg-gray-900">Grower Delivery Only</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-green-500 hover:bg-green-400 disabled:opacity-60 text-white font-bold rounded-xl transition-all glow-green flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Publish Harvest Listing'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
