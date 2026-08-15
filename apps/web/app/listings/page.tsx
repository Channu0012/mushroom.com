'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, MapPin, Star, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Navigation } from '@/components/layout/navigation';
import { debounce } from 'lodash';

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
          <div className="text-white font-semibold text-sm">{Number(listing.minOrderQuantityKg).toFixed(1)}</div>
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
  const [filters, setFilters] = useState({
    fulfillmentMethod: '',
    minPrice: '',
    maxPrice: '',
    state: '',
    verifiedOnly: false,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [q, setQ] = useState('');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['listings', q, filters, page],
    queryFn: () =>
      apiClient.get<any>('/listings', {
        q: q || undefined,
        page,
        limit: 12,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== false)),
      }),
    staleTime: 30 * 1000,
  });

  const listings = data?.data || [];
  const meta = data?.meta;

  const debouncedSearch = useCallback(
    debounce((val: string) => {
      setQ(val);
      setPage(1);
    }, 300),
    [],
  );

  return (
    <main className="min-h-screen bg-[#0f1a0f]">
      <Navigation />
      <div className="pt-20">
        {/* Header */}
        <div className="border-b border-white/5 bg-[#0a0f0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-white mb-4">Browse Listings</h1>

            {/* Search bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="search-listings"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
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

            {/* Filter panel */}
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

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {meta && (
            <p className="text-gray-500 text-sm mb-6">
              {meta.total} listing{meta.total !== 1 ? 's' : ''} found
              {q && <span> for &quot;<span className="text-white">{q}</span>&quot;</span>}
            </p>
          )}

          {isLoading || isFetching ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass rounded-xl border border-white/5 p-4 space-y-3">
                  <div className="flex gap-3"><div className="w-14 h-14 rounded-xl shimmer" /><div className="flex-1 space-y-2"><div className="h-4 shimmer rounded" /><div className="h-3 w-2/3 shimmer rounded" /></div></div>
                  <div className="grid grid-cols-3 gap-2">{[...Array(3)].map((_, j) => <div key={j} className="h-12 shimmer rounded-lg" />)}</div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-400 text-lg font-medium">No listings found</p>
              <p className="text-gray-600 text-sm mt-2">Try adjusting your search or filters</p>
              {q && (
                <button onClick={() => { setSearchQuery(''); setQ(''); }} className="mt-4 text-green-400 hover:text-green-300 text-sm">
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {listings.map((listing: any) => <ListingCard key={listing.id} listing={listing} />)}
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!meta.hasPrev}
                    className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400 text-sm">Page {meta.page} of {meta.totalPages}</span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={!meta.hasNext}
                    className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
