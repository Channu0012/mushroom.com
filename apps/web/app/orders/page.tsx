'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Package, ShieldCheck, ArrowLeft, CreditCard } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Navigation } from '@/components/layout/navigation';
import { useAuthStore } from '@/stores/auth.store';

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      try {
        return await apiClient.get<any>('/orders?limit=20');
      } catch {
        return { data: [] };
      }
    },
    enabled: isAuthenticated,
  });

  const orders = data?.data || [];

  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Order History & Escrow Tracking</h1>
            <p className="text-gray-400 text-xs mt-1">Track payments, delivery status, and escrow releases</p>
          </div>
          <Link href="/listings" className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white font-semibold text-xs rounded-xl transition-all">
            + New Order
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 shimmer h-24" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="glass rounded-3xl border border-white/10 p-12 text-center">
            <Package size={40} className="text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Orders Placed Yet</h3>
            <p className="text-gray-400 text-xs max-w-sm mx-auto mb-6">Explore our fresh listings from verified farms across India and place your first harvest order.</p>
            <Link href="/listings" className="px-6 py-2.5 bg-green-500 hover:bg-green-400 text-white font-medium text-xs rounded-xl glow-green">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord: any) => (
              <div key={ord.id} className="glass rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-sm">Order #{ord.orderNumber || ord.id.substring(0, 8)}</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-semibold border border-green-500/20">
                      {ord.status}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    {ord.listing?.title || 'Harvest Order'} • {ord.quantityKg} kg
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-white/5 pt-3 sm:pt-0">
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-base">₹{ord.totalAmount}</div>
                    <div className="text-gray-500 text-[10px]">Escrow Protected</div>
                  </div>
                  {ord.status === 'PENDING_PAYMENT' && (
                    <Link
                      href={`/orders/${ord.id}/pay`}
                      className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 glow-green"
                    >
                      <CreditCard size={14} /> Pay Now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
