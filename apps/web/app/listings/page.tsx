'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Search, MapPin, Star, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Navigation } from '@/components/layout/navigation';

const FULFILLMENT_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'PICKUP', label: 'Pickup' },
  { value: 'SELLER_DELIVERY', label: 'Delivery' },
  { value: 'BOTH', label: 'Both' },
];

function ListingCard({ listing }: { listing: any }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="glass rounded-xl border border-white/5 p-4 card-hover block fade-in-up"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 text-3xl">
          {listing.mushroomType?.emoji || '🍄'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-tight">{listing.title}</h3>
          <p className="text-green-400 text-xs mt-0.5">{listing.mushroomType?.name}</p>
          <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{listing.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="text-green-400 font-bold text-sm">₹{listing.pricePerKg}</div>
          <div className="text-gray-600 text-xs">per kg</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="text-white font-semibold text-sm">{Number(listing.availableQuantityKg).toFixed(1)}</div>
          <div className="text-gray-600 text-xs">kg avail.</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="text-white font-semibold text-sm">{Number(listing.minOrderQuantityKg || 1).toFixed(1)}</div>
          <div className="text-gray-600 text-xs">kg min</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          {listing.farm?.verificationStatus === 'VERIFIED' && (
            <span className="badge-verified px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck size={9} />
              Verified
            </span>
          )}
          {listing.farm?.city && (
            <span className="flex items-center gap-1">
              <MapPin size={9} />
              {listing.farm.city}
            </span>
          )}
        </div>
        {listing.farm?.averageRating && (
          <span className="flex items-center gap-1">
            <Star size={9} className="text-amber-400 fill-amber-400" />
            {Number(listing.farm.averageRating).toFixed(1)}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState({
    fulfillmentMethod: '',
    minPrice: '',
    maxPrice: '',
    verifiedOnly: false,
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [localListings, setLocalListings] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('custom_listings');
      if (raw) {
        try {
          setLocalListings(JSON.parse(raw));
        } catch {}
      }
    }
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setQ(val);
      setPage(1);
    }, 300);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['listings', q, filters, page],
    queryFn: async () => {
      try {
        return await apiClient.get<any>('/listings', {
          q: q || undefined,
          page,
          limit: 12,
          ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== false)),
        });
      } catch {
        return { data: [] };
      }
    },
    staleTime: 30 * 1000,
  });

  const apiListings = data?.data || [];
  const combinedListings = [...localListings, ...apiListings.filter(a => !localListings.some(l => l.id === a.id))];

  // Fallback demo listings if empty
  const listings = combinedListings.length > 0 ? combinedListings : [
    {
      id: 'lst_demo_1',
      title: 'Fresh Organic Oyster Mushrooms - Grade A Batch',
      description: 'Harvested fresh daily from bio-controlled indoor farm. High protein, zero pesticides.',
      pricePerKg: 240,
      availableQuantityKg: 150,
      minOrderQuantityKg: 5,
      fulfillmentMethod: 'BOTH',
      mushroomType: { name: 'Oyster', emoji: '🦪' },
      farm: { name: 'GreenEarth Bio Farm', city: 'Bangalore', state: 'Karnataka', verificationStatus: 'VERIFIED', averageRating: 4.9 },
    },
    {
      id: 'lst_demo_2',
      title: 'Premium White Button Mushrooms (Commercial Grade)',
      description: 'Firm texture, ideal for restaurants, retail stores, and food processors.',
      pricePerKg: 190,
      availableQuantityKg: 500,
      minOrderQuantityKg: 10,
      fulfillmentMethod: 'BOTH',
      mushroomType: { name: 'Button', emoji: '🍄' },
      farm: { name: 'Himalayan Organic Fungi', city: 'Solan', state: 'Himachal Pradesh', verificationStatus: 'VERIFIED', averageRating: 4.8 },
    },
    {
      id: 'lst_demo_3',
      title: 'Fresh Exotic Shiitake Mushrooms - Cold Chain Ready',
      description: 'Authentic rich umami flavor, vacuum sealed upon harvest.',
      pricePerKg: 650,
      availableQuantityKg: 80,
      minOrderQuantityKg: 2,
      fulfillmentMethod: 'SELLER_DELIVERY',
      mushroomType: { name: 'Shiitake', emoji: '🌿' },
      farm: { name: 'Nilgiri Specialty Spores', city: 'Ooty', state: 'Tamil Nadu', verificationStatus: 'VERIFIED', averageRating: 4.9 },
    },
  ];

  return (
    <main className="min-h-screen bg-[#0f1a0f]">
      <Navigation />
      <div className="pt-20">
        <div className="border-b border-white/5 bg-[#0a0f0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Browse Harvest Listings</h1>
                <p className="text-gray-400 text-sm mt-1">Sourced directly from verified farms across India</p>
              </div>

              <Link
                href="/listings/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white font-medium text-sm rounded-xl transition-all glow-green"
              >
                + List Your Harvest
              </Link>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="search-listings"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search oyster, shiitake, button..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  showFilters ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <select
                  value={filters.fulfillmentMethod}
                  onChange={(e) => setFilters({ ...filters, fulfillmentMethod: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-green-500/50"
                >
                  {FULFILLMENT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Min price (₹)"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-green-500/50"
                />

                <input
                  type="number"
                  placeholder="Max price (₹)"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-green-500/50"
                />

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                    className="accent-green-500"
                  />
                  <span className="text-gray-300 text-sm">Verified only</span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass rounded-xl border border-white/5 p-4 space-y-3">
                  <div className="flex gap-3"><div className="w-14 h-14 rounded-xl shimmer" /><div className="flex-1 space-y-2"><div className="h-4 shimmer rounded" /><div className="h-3 w-2/3 shimmer rounded" /></div></div>
                  <div className="grid grid-cols-3 gap-2">{[...Array(3)].map((_, j) => <div key={j} className="h-12 shimmer rounded-lg" />)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings.map((listing: any) => <ListingCard key={listing.id} listing={listing} />)}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
