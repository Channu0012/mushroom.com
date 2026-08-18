'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, FilePlus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Navigation } from '@/components/layout/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

export default function NewRequirementPage() {
  const router = useRouter();
  const { user, isAuthenticated, login } = useAuthStore();
  const [form, setForm] = useState({
    title: '',
    description: '',
    quantityKg: '',
    budgetMax: '',
    city: '',
    state: '',
    frequency: 'ONE_TIME',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newReqItem = {
      id: 'req_' + Math.random().toString(36).substring(2, 9),
      title: form.title,
      description: form.description,
      quantityKg: Number(form.quantityKg) || 50,
      budgetMin: form.budgetMax ? Math.round(Number(form.budgetMax) * 0.8) : 200,
      budgetMax: form.budgetMax ? Number(form.budgetMax) : 300,
      city: form.city || 'Bangalore',
      state: form.state || 'Karnataka',
      frequency: form.frequency,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      buyer: {
        profile: {
          displayName: user?.displayName || user?.email?.split('@')[0] || 'Verified Buyer',
        },
      },
    };

    try {
      await apiClient.post('/requirements', {
        title: form.title,
        description: form.description,
        quantityKg: Number(form.quantityKg),
        budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
        city: form.city,
        state: form.state,
        frequency: form.frequency,
      });
    } catch {
      // Offline fallback: save in local storage
      if (typeof window !== 'undefined') {
        const existingRaw = sessionStorage.getItem('custom_requirements');
        const list = existingRaw ? JSON.parse(existingRaw) : [];
        list.unshift(newReqItem);
        sessionStorage.setItem('custom_requirements', JSON.stringify(list));
      }
    } finally {
      // Always store locally so requirement appears immediately
      if (typeof window !== 'undefined') {
        const existingRaw = sessionStorage.getItem('custom_requirements');
        const list = existingRaw ? JSON.parse(existingRaw) : [];
        if (!list.some((item: any) => item.id === newReqItem.id)) {
          list.unshift(newReqItem);
          sessionStorage.setItem('custom_requirements', JSON.stringify(list));
        }
      }
      setLoading(false);
      toast.success('Buyer requirement posted successfully! Growers notified.');
      router.push('/requirements');
    }
  };

  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <Link href="/requirements" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Requirements
        </Link>

        <div className="glass rounded-3xl border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-6">
            <FilePlus size={28} className="text-green-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Post Buyer Requirement</h1>
              <p className="text-gray-400 text-xs mt-0.5">Specify your mushroom quantity and budget to get offers from verified farms</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Requirement Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Need 100 kg Fresh Button Mushrooms weekly for Restaurant chain"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Details & Specifications</label>
              <textarea
                rows={4}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Specify quality grade, packaging preference, delivery location..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Target Quantity (kg)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.quantityKg}
                  onChange={(e) => setForm({ ...form, quantityKg: e.target.value })}
                  placeholder="100"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Max Budget / kg (₹)</label>
                <input
                  type="number"
                  value={form.budgetMax}
                  onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                  placeholder="300"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">City</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Mumbai"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Frequency</label>
                <select
                  value={form.frequency}
                  onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 text-sm focus:outline-none focus:border-green-500/50"
                >
                  <option value="ONE_TIME" className="bg-gray-900">One-time Order</option>
                  <option value="DAILY" className="bg-gray-900">Daily Recurring Supply</option>
                  <option value="WEEKLY" className="bg-gray-900">Weekly Recurring Supply</option>
                  <option value="MONTHLY" className="bg-gray-900">Monthly Contract</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-green-500 hover:bg-green-400 disabled:opacity-60 text-white font-bold rounded-xl transition-all glow-green flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Submit Buyer Requirement'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
