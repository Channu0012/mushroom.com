'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, ShieldCheck, Truck, ShoppingCart, MessageSquare, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Navigation } from '@/components/layout/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [quantity, setQuantity] = useState<number>(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      try {
        return await apiClient.get<any>(`/listings/${id}`);
      } catch (err) {
        if (typeof window !== 'undefined') {
          const customRaw = sessionStorage.getItem('custom_listings');
          if (customRaw) {
            const list = JSON.parse(customRaw);
            const found = list.find((item: any) => item.id === id);
            if (found) return found;
          }
        }
        
        // Demo fallbacks
        const demoListings: Record<string, any> = {
          lst_demo_1: {
            id: 'lst_demo_1',
            title: 'Fresh Organic Oyster Mushrooms - Grade A Batch',
            description: 'Harvested fresh daily from bio-controlled indoor farm in Pune/Bangalore. High protein, zero pesticides.\n\nOptimal storage at 2-4°C. Ideal for culinary restaurants, retail distribution, and health-conscious buyers.',
            pricePerKg: 240,
            availableQuantityKg: 150,
            minOrderQuantityKg: 5,
            fulfillmentMethod: 'BOTH',
            mushroomType: { name: 'Oyster', emoji: '🦪' },
            farm: { name: 'GreenEarth Bio Farm', city: 'Bangalore', state: 'Karnataka', verificationStatus: 'VERIFIED', averageRating: 4.9, totalReviews: 14, grower: { id: 'usr_grower_1' } },
            reviews: [
              { id: 'r1', rating: 5, comment: 'Phenomenal freshness and clean packaging! Arrived on schedule.', reviewer: { profile: { displayName: 'Oberoi Kitchens' } } }
            ]
          },
          lst_demo_2: {
            id: 'lst_demo_2',
            title: 'Premium White Button Mushrooms (Commercial Grade)',
            description: 'Firm texture, ideal for restaurants, retail stores, and food processors.\n\nFSSAI certified batch grown under controlled humidity and temperature.',
            pricePerKg: 190,
            availableQuantityKg: 500,
            minOrderQuantityKg: 10,
            fulfillmentMethod: 'BOTH',
            mushroomType: { name: 'Button', emoji: '🍄' },
            farm: { name: 'Himalayan Organic Fungi', city: 'Solan', state: 'Himachal Pradesh', verificationStatus: 'VERIFIED', averageRating: 4.8, totalReviews: 8, grower: { id: 'usr_grower_2' } },
            reviews: []
          },
          lst_demo_3: {
            id: 'lst_demo_3',
            title: 'Fresh Exotic Shiitake Mushrooms - Cold Chain Ready',
            description: 'Authentic rich umami flavor, vacuum sealed upon harvest.\n\nSuitable for gourmet dining, high-end Asian cuisine, and specialized grocery markets.',
            pricePerKg: 650,
            availableQuantityKg: 80,
            minOrderQuantityKg: 2,
            fulfillmentMethod: 'SELLER_DELIVERY',
            mushroomType: { name: 'Shiitake', emoji: '🌿' },
            farm: { name: 'Nilgiri Specialty Spores', city: 'Ooty', state: 'Tamil Nadu', verificationStatus: 'VERIFIED', averageRating: 4.9, totalReviews: 12, grower: { id: 'usr_grower_3' } },
            reviews: []
          }
        };

        if (demoListings[id]) return demoListings[id];
        throw err;
      }
    },
    staleTime: 30 * 1000,
  });

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to place an order');
      router.push(`/login?redirect=/listings/${id}`);
      return;
    }

    if (user?.role === 'GROWER' && user.id === listing?.growerId) {
      toast.error('You cannot order from your own listing');
      return;
    }

    setIsOrdering(true);
    try {
      const order = await apiClient.post<any>('/orders', {
        listingId: id,
        quantityKg: Number(quantity),
        notes: deliveryNotes || undefined,
      });

      toast.success(`Order ${order.orderNumber} created! Redirecting to payment...`);
      router.push(`/orders/${order.id}/pay`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to create order. Please try again.';
      toast.error(msg);
    } finally {
      setIsOrdering(false);
    }
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to message the grower');
      router.push(`/login?redirect=/listings/${id}`);
      return;
    }

    try {
      const conversation = await apiClient.post<any>('/conversations', {
        otherUserId: listing.farm?.grower?.id || listing.growerId,
        listingId: id,
      });
      router.push(`/messages?conversationId=${conversation.id}`);
    } catch (err: any) {
      toast.error('Could not start conversation');
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0f1a0f]">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 rounded-2xl shimmer" />
              <div className="h-10 w-2/3 rounded-lg shimmer" />
              <div className="h-24 rounded-xl shimmer" />
            </div>
            <div className="h-96 rounded-2xl shimmer" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="min-h-screen bg-[#0f1a0f]">
        <Navigation />
        <div className="max-w-md mx-auto text-center pt-32 px-4">
          <div className="text-5xl mb-4">🍄</div>
          <h1 className="text-xl font-bold text-white mb-2">Listing Not Found</h1>
          <p className="text-gray-400 text-sm mb-6">This listing may have expired or been removed by the grower.</p>
          <Link href="/listings" className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-xl">
            Back to Listings
          </Link>
        </div>
      </main>
    );
  }

  const unitPrice = Number(listing.pricePerKg);
  const minQty = Number(listing.minOrderQuantityKg || 1);
  const maxQty = Number(listing.availableQuantityKg);
  const currentQty = Math.max(minQty, Math.min(quantity, maxQty));
  const subtotal = Math.round(unitPrice * currentQty * 100) / 100;
  const platformFee = Math.round(subtotal * 0.03 * 100) / 100;
  const totalAmount = Math.round((subtotal + platformFee) * 100) / 100;

  return (
    <main className="min-h-screen bg-[#0f1a0f]">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        {/* Back Link */}
        <Link href="/listings" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 mb-6 transition-colors">
          <ArrowLeft size={16} />
          Back to all listings
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header / Title */}
            <div className="glass rounded-2xl border border-white/10 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-3">
                    {listing.mushroomType?.emoji || '🍄'} {listing.mushroomType?.name}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{listing.title}</h1>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">₹{listing.pricePerKg}</div>
                  <div className="text-gray-500 text-xs">per kilogram</div>
                </div>
              </div>

              {/* Farm Info */}
              {listing.farm && (
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">
                      {listing.farm.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Link href={`/growers/${listing.farm.slug}`} className="text-white text-sm font-medium hover:text-green-400">
                          {listing.farm.name}
                        </Link>
                        {listing.farm.verificationStatus === 'VERIFIED' && (
                          <ShieldCheck size={14} className="text-green-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {listing.farm.city}, {listing.farm.state}
                        </span>
                        {listing.farm.averageRating && (
                          <span className="flex items-center gap-1">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            {Number(listing.farm.averageRating).toFixed(1)} ({listing.farm.totalReviews || 0} reviews)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleStartChat}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium border border-white/10 transition-all"
                  >
                    <MessageSquare size={14} />
                    Chat with Grower
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">About this Harvest</h2>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {listing.description || 'No detailed description provided by the grower.'}
              </p>

              {/* Attributes Grid */}
              <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Available Quantity</div>
                  <div className="text-white font-semibold text-sm">{listing.availableQuantityKg} kg</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Minimum Order</div>
                  <div className="text-white font-semibold text-sm">{listing.minOrderQuantityKg || 1} kg</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Fulfillment</div>
                  <div className="text-white font-semibold text-sm">{listing.fulfillmentMethod}</div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Verified Buyer Reviews</h2>
              {listing.reviews && listing.reviews.length > 0 ? (
                <div className="space-y-4">
                  {listing.reviews.map((rev: any) => (
                    <div key={rev.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium text-sm">
                          {rev.reviewer?.profile?.displayName || 'Verified Buyer'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs">
                          <Star size={12} className="fill-amber-400" />
                          {rev.rating}.0
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No reviews for this listing yet.</p>
              )}
            </div>
          </div>

          {/* Right Sidebar: Order Checkout Card */}
          <div className="space-y-6">
            <div className="glass rounded-2xl border border-white/10 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Place Order</h2>

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                {/* Quantity Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Order Quantity (kg)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(minQty, currentQty - 1))}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg border border-white/10 flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={minQty}
                      max={maxQty}
                      step="0.5"
                      value={currentQty}
                      onChange={(e) => setQuantity(parseFloat(e.target.value) || minQty)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-center text-white font-bold text-base focus:outline-none focus:border-green-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(maxQty, currentQty + 1))}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg border border-white/10 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                    <span>Min: {minQty} kg</span>
                    <span>Max: {maxQty} kg</span>
                  </div>
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Delivery Instructions <span className="text-gray-600">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Preferred time window, address landmark, etc."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-green-500/50"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="bg-white/5 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>₹{unitPrice} × {currentQty} kg</span>
                    <span className="text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Platform Service Fee (3%)</span>
                    <span className="text-white">₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold">
                    <span className="text-white">Total Amount</span>
                    <span className="text-green-400">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isOrdering || maxQty < minQty}
                  className="w-full py-3 bg-green-500 hover:bg-green-400 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold rounded-xl transition-all glow-green flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  {isOrdering ? 'Creating Order...' : 'Proceed to Checkout'}
                </button>
              </form>

              {/* Guarantees */}
              <div className="mt-6 space-y-2 text-[11px] text-gray-400 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Check size={12} className="text-green-400" />
                  <span>Razorpay 256-bit Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={12} className="text-green-400" />
                  <span>Money held in escrow until delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={12} className="text-green-400" />
                  <span>100% Quality & Weight Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
