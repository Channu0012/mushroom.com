'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

function ListingCard({ listing }: { listing: any }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="glass rounded-2xl border border-white/5 p-5 card-hover block group"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
          {listing.mushroomType?.emoji || '🍄'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-snug">{listing.title}</h3>
          <p className="text-green-400 text-xs mt-1">{listing.mushroomType?.name}</p>
        </div>
        {listing.farm?.verificationStatus === 'VERIFIED' && (
          <span className="badge-verified px-2 py-0.5 rounded-full text-xs flex items-center gap-1 flex-shrink-0">
            <ShieldCheck size={9} /> Verified
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-white">₹{listing.pricePerKg}</span>
          <span className="text-gray-500 text-xs">/kg</span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">{Number(listing.availableQuantityKg).toFixed(0)} kg available</div>
          {listing.farm?.city && (
            <div className="text-xs text-gray-600 flex items-center gap-1 justify-end mt-0.5">
              <MapPin size={9} />{listing.farm.city}
            </div>
          )}
        </div>
      </div>

      {listing.farm?.averageRating && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/5">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <span className="text-xs text-amber-400 font-medium">{Number(listing.farm.averageRating).toFixed(1)}</span>
          <span className="text-xs text-gray-600">({listing.farm.totalReviews || 0} reviews)</span>
        </div>
      )}
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl border border-white/5 p-5 space-y-4">
      <div className="flex gap-3">
        <div className="w-14 h-14 rounded-xl shimmer flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 shimmer rounded-lg" />
          <div className="h-3 w-1/2 shimmer rounded-lg" />
        </div>
      </div>
      <div className="h-6 shimmer rounded-lg" />
      <div className="h-3 shimmer rounded-lg" />
    </div>
  );
}

export function FeaturedListings() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-listings'],
    queryFn: () => apiClient.get<any>('/listings?limit=8&sortBy=createdAt&sortDir=desc'),
    staleTime: 60 * 1000,
  });

  const listings = data?.data || [];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="text-green-400 text-xs font-semibold uppercase tracking-widest">Fresh Today</span>
          <h2 className="text-3xl font-bold text-white mt-1">Latest Listings</h2>
          <p className="text-gray-500 text-sm mt-2">Freshly added by verified growers</p>
        </div>
        <Link
          href="/listings"
          id="view-all-listings-btn"
          className="hidden sm:flex items-center gap-2 text-sm text-green-400 hover:text-green-300 font-medium transition-colors"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl border border-white/5">
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-gray-400 font-medium">No listings yet</p>
          <p className="text-gray-600 text-sm mt-2">Be the first grower to list your harvest!</p>
          <Link href="/register" className="inline-block mt-4 px-6 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg text-sm font-medium transition-colors">
            List Your Harvest
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {listings.map((listing: any) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      <div className="text-center mt-8 sm:hidden">
        <Link href="/listings" className="text-green-400 text-sm font-medium">
          View all listings →
        </Link>
      </div>
    </section>
  );
}
