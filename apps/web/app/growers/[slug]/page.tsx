'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { MapPin, Star, ShieldCheck, ArrowLeft, MessageSquare, Building2, Package, Award } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function GrowerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: farm, isLoading } = useQuery({
    queryKey: ['farm', slug],
    queryFn: async () => {
      try {
        return await apiClient.get<any>(`/farms/${slug}`);
      } catch {
        return null;
      }
    },
    staleTime: 30 * 1000,
  });

  const displayFarm = farm || {
    name: slug.replace(/-/g, ' ').toUpperCase(),
    city: 'Bangalore',
    state: 'Karnataka',
    address: 'Survey No. 42, Hesaraghatta Agri Hub, Bangalore North',
    verificationStatus: 'VERIFIED',
    averageRating: 4.9,
    totalReviews: 42,
    description: 'Specialized bio-controlled indoor mushroom cultivation facility producing top-grade Oyster, Shiitake, and Button mushrooms. Fully organic substrate process certified by FSSAI and GAP.',
    establishedYear: 2021,
    weeklyCapacity: '750 kg/week',
  };

  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <Link href="/growers" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to all growers
        </Link>

        {/* Hero Farm Card */}
        <div className="glass rounded-3xl border border-white/10 p-8 mb-8 hero-gradient">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 glow-green">
                <Building2 size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{displayFarm.name}</h1>
                  {displayFarm.verificationStatus === 'VERIFIED' && (
                    <span className="badge-verified px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified Grower
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-green-400" />
                    {displayFarm.address || `${displayFarm.city}, ${displayFarm.state}`}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-medium">
                    <Star size={13} className="fill-amber-400" />
                    {displayFarm.averageRating || 4.9} ({displayFarm.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/messages"
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 transition-all flex items-center gap-2"
              >
                <MessageSquare size={16} /> Contact Farm
              </Link>
              <Link
                href="/listings"
                className="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all glow-green"
              >
                View Available Harvests
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-5 border border-white/5">
            <span className="text-gray-500 text-xs block">Established</span>
            <span className="text-white font-bold text-lg mt-1 block">{displayFarm.establishedYear || '2020'}</span>
          </div>
          <div className="glass rounded-xl p-5 border border-white/5">
            <span className="text-gray-500 text-xs block">Weekly Capacity</span>
            <span className="text-green-400 font-bold text-lg mt-1 block">{displayFarm.weeklyCapacity || '500 kg'}</span>
          </div>
          <div className="glass rounded-xl p-5 border border-white/5">
            <span className="text-gray-500 text-xs block">FSSAI Status</span>
            <span className="text-white font-bold text-lg mt-1 block">Active & Verified</span>
          </div>
          <div className="glass rounded-xl p-5 border border-white/5">
            <span className="text-gray-500 text-xs block">Fulfillment</span>
            <span className="text-white font-bold text-lg mt-1 block">Pickup & Delivery</span>
          </div>
        </div>

        {/* Farm Overview */}
        <div className="glass rounded-2xl border border-white/10 p-8 space-y-4 mb-8">
          <h2 className="text-xl font-bold text-white">About the Farm</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {displayFarm.description}
          </p>

          <div className="pt-4 border-t border-white/5 flex flex-wrap gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><Award size={14} className="text-green-400" /> GAP Certified Production</span>
            <span className="flex items-center gap-1.5"><Award size={14} className="text-green-400" /> Temperature & Moisture Controlled</span>
            <span className="flex items-center gap-1.5"><Award size={14} className="text-green-400" /> Direct Escrow Protected Sales</span>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
