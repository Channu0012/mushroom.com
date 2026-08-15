'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { MapPin, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

function ListingCard({ listing }: { listing: any }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="glass rounded-xl border border-white/5 p-4 card-hover block"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 text-2xl">
          {listing.mushroomType?.emoji || '🍄'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm leading-tight truncate">{listing.title}</h3>
          <p className="text-gray-400 text-xs mt-0.5 truncate">{listing.mushroomType?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="text-green-400 font-bold text-sm">₹{listing.pricePerKg}/kg</div>
          <div className="text-gray-500 text-xs">Price</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="text-white font-semibold text-sm">{listing.availableQuantityKg} kg</div>
          <div className="text-gray-500 text-xs">Available</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        {listing.farm?.verificationStatus === 'VERIFIED' && (
          <span className="badge-verified px-1.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck size={10} />
            Verified
          </span>
        )}
        {listing.farm?.city && (
          <span className="flex items-center gap-1">
            <MapPin size={10} />
            {listing.farm.city}
          </span>
        )}
        {listing.farm?.averageRating && (
          <span className="flex items-center gap-1 ml-auto">
            <Star size={10} className="text-amber-400 fill-amber-400" />
            {Number(listing.farm.averageRating).toFixed(1)}
          </span>
        )}
      </div>
    </Link>
  );
}

function LoadingCard() {
  return (
    <div className="glass rounded-xl border border-white/5 p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded shimmer" />
          <div className="h-3 w-2/3 rounded shimmer" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="h-12 rounded-lg shimmer" />
        <div className="h-12 rounded-lg shimmer" />
      </div>
      <div className="h-3 w-1/2 rounded shimmer" />
    </div>
  );
}

export function FeaturedListings() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-listings'],
    queryFn: () => apiClient.get<any>('/listings?limit=6&sortBy=createdAt&sortOrder=desc'),
    staleTime: 5 * 60 * 1000,
  });

  const listings = data?.data || [];

  return (
    <section className="py-20 bg-[#0d150d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-green-400 text-sm font-medium mb-2">FRESH TODAY</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest Listings</h2>
          </div>
          <Link
            href="/listings"
            className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 font-medium transition-colors"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <LoadingCard key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🌱</div>
            <p className="text-gray-400">No listings yet. Be the first to add your harvest!</p>
            <Link href="/register?role=GROWER" className="mt-4 inline-block text-green-400 hover:text-green-300 text-sm font-medium">
              Start selling →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
