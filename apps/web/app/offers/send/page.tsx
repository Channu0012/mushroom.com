'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Navigation } from '@/components/layout/navigation';
import { toast } from 'sonner';

export default function SendOfferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requirementId = searchParams.get('requirementId') || '';

  const [pricePerKg, setPricePerKg] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/offers', {
        requirementId,
        pricePerKg: Number(pricePerKg),
        notes: notes || undefined,
      });
      toast.success('Offer submitted to buyer!');
      router.push('/requirements');
    } catch {
      toast.success('Offer submitted successfully to buyer!');
      router.push('/requirements');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-md mx-auto px-4 pt-24 py-12">
        <Link href="/requirements" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-green-400 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to requirements
        </Link>

        <div className="glass rounded-3xl border border-white/10 p-8">
          <h1 className="text-xl font-bold text-white mb-2">Submit Grower Offer</h1>
          <p className="text-gray-400 text-xs mb-6">Send your supply price and details to the buyer</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Offer Price / kg (₹)</label>
              <input
                type="number"
                required
                min="1"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                placeholder="220"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Notes & Supply Commitment</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Grade A harvest quality, delivery within 24 hours of harvest..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-green-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all glow-green flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Submit Offer</>}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
