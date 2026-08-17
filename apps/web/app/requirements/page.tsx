'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Search, MapPin, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Navigation } from '@/components/layout/navigation';
import { useAuthStore } from '@/stores/auth.store';

export default function RequirementsPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['requirements', q, page],
    queryFn: () => apiClient.get<any>('/requirements', { q: q || undefined, page, limit: 12 }),
    staleTime: 30 * 1000,
  });

  const requirements = data?.data || [];
  const meta = data?.meta;

  return (
    <main className="min-h-screen bg-[#0f1a0f]">
      <Navigation />
      <div className="pt-20">
        <div className="border-b border-white/5 bg-[#0a0f0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Buyer Requirements</h1>
                <p className="text-gray-400 text-sm mt-1">Browse active demand posts from B2B buyers & growers across India</p>
              </div>

              {(user?.role === 'B2B_BUYER' || user?.role === 'CONSUMER') && (
                <Link
                  href="/requirements/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white font-medium text-sm rounded-xl transition-all glow-green"
                >
                  <Plus size={16} />
                  Post Requirement
                </Link>
              )}
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search requirements by mushroom type, city..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-xl border border-white/5 p-5 space-y-3">
                  <div className="h-4 w-3/4 rounded shimmer" />
                  <div className="h-3 w-1/2 rounded shimmer" />
                  <div className="h-16 rounded-lg shimmer" />
                </div>
              ))}
            </div>
          ) : requirements.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-400 font-medium">No buyer requirements found.</p>
              <p className="text-gray-600 text-sm mt-1">Check back later or post your own demand!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {requirements.map((req: any) => (
                <div key={req.id} className="glass rounded-xl border border-white/5 p-5 flex flex-col justify-between card-hover">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
                        {req.frequency || 'ONE_TIME'}
                      </span>
                      <span className="text-green-400 font-bold text-sm">
                        {req.quantityKg} kg
                      </span>
                    </div>

                    <h3 className="text-white font-semibold text-base mb-1">{req.title}</h3>
                    <p className="text-gray-400 text-xs line-clamp-2 mb-4">{req.description}</p>

                    <div className="space-y-1.5 text-xs text-gray-400 border-t border-white/5 pt-3">
                      {req.city && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-gray-500" />
                          <span>{req.city}, {req.state}</span>
                        </div>
                      )}
                      {req.budgetMax && (
                        <div className="text-gray-300 font-medium">
                          Budget: ₹{req.budgetMin || 0} - ₹{req.budgetMax} / kg
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">
                      By {req.buyer?.profile?.displayName || 'Verified Buyer'}
                    </span>

                    {user?.role === 'GROWER' && (
                      <Link
                        href={`/offers/send?requirementId=${req.id}`}
                        className="px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium transition-colors"
                      >
                        Send Offer →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
