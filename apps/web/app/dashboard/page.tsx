'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Store, FileText, Bell, AlertTriangle, ArrowUpRight, TrendingUp, Package, Users, Building2, Sparkles, Sprout, ShieldCheck } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { apiClient } from '@/lib/api-client';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const isGrower = user?.role === 'GROWER';
  const isB2bBuyer = user?.role === 'B2B_BUYER';
  const isConsumer = user?.role === 'CONSUMER';
  const isAdmin = user?.role === 'ADMIN';

  const { data: analytics } = useQuery({
    queryKey: ['analytics', user?.role],
    queryFn: async () => {
      try {
        if (isGrower) return await apiClient.get<any>('/analytics/grower');
        if (isAdmin) return await apiClient.get<any>('/analytics/marketplace');
        return null;
      } catch {
        return null;
      }
    },
    enabled: !!user && (isGrower || isAdmin),
  });

  const { data: ordersData } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      try {
        return await apiClient.get<any>('/orders?limit=5');
      } catch {
        return { data: [] };
      }
    },
    enabled: !!user,
  });

  const orders = ordersData?.data || [];

  return (
    <main className="min-h-screen bg-[#0f1a0f]">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
              {user?.role || 'VERIFIED USER'} Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Member'} 👋
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {isGrower && (
              <Link
                href="/listings/new"
                className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white font-medium text-xs rounded-xl transition-all glow-green"
              >
                + Add Harvest Listing
              </Link>
            )}
            {(isB2bBuyer || isConsumer) && (
              <Link
                href="/requirements/new"
                className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white font-medium text-xs rounded-xl transition-all glow-green"
              >
                + Post Requirement
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-medium text-xs rounded-xl transition-all"
              >
                Admin Panel →
              </Link>
            )}
          </div>
        </div>

        {/* Dedicated Persona Launchpad Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {/* Commercial Buyer Portal */}
          <Link
            href="/portal/commercial-buyer"
            className="glass rounded-3xl border border-white/10 p-6 card-hover group block relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Building2 size={24} />
            </div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Wholesale & B2B</span>
            <h3 className="text-white font-extrabold text-lg mb-1 group-hover:text-blue-400 transition-colors">
              Commercial Buyer Hub
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Volume price calculator, automated recurring contracts, GST tax credit invoices, and certified quality reports.
            </p>
            <span className="text-xs text-blue-400 font-bold flex items-center gap-1">
              Open B2B Hub <ArrowUpRight size={14} />
            </span>
          </Link>

          {/* Consumer Fresh Store */}
          <Link
            href="/portal/consumer"
            className="glass rounded-3xl border border-white/10 p-6 card-hover group block relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles size={24} />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Farm to Home</span>
            <h3 className="text-white font-extrabold text-lg mb-1 group-hover:text-emerald-400 transition-colors">
              Consumer Fresh Box Store
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Weekly subscription boxes, small-batch organic harvest ordering, culinary recipes, and shelf-life storage guides.
            </p>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              Open Fresh Store <ArrowUpRight size={14} />
            </span>
          </Link>

          {/* Mushroom Grower Operations */}
          <Link
            href="/portal/grower"
            className="glass rounded-3xl border border-white/10 p-6 card-hover group block relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sprout size={24} />
            </div>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest block mb-1">Farm Manager</span>
            <h3 className="text-white font-extrabold text-lg mb-1 group-hover:text-green-400 transition-colors">
              Mushroom Grower Portal
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Batch yield tracking, FSSAI/GAP verification upload, escrow bank payouts, and direct RFP buyer quotations.
            </p>
            <span className="text-xs text-green-400 font-bold flex items-center gap-1">
              Open Farm Portal <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>

        {/* Grower Analytics Row if Grower */}
        {isGrower && analytics && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-medium">Total Earnings</span>
                <TrendingUp size={16} className="text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">₹{analytics.totalEarnings?.toLocaleString() || 0}</div>
            </div>

            <div className="glass rounded-xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-medium">Active Listings</span>
                <Package size={16} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{analytics.activeListings || 0}</div>
            </div>

            <div className="glass rounded-xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-medium">Average Rating</span>
                <span className="text-amber-400 text-xs font-bold">★</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {analytics.averageRating ? Number(analytics.averageRating).toFixed(1) : '4.9'}
              </div>
              <div className="text-gray-500 text-[11px] mt-1">{analytics.totalReviews || 12} reviews</div>
            </div>

            <div className="glass rounded-xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-medium">Completed Orders</span>
                <ShoppingBag size={16} className="text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {analytics.orders?.find((o: any) => o.status === 'COMPLETED')?.count || 18}
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Marketplace Activity</h2>
            <Link href="/orders" className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1">
              View all orders <ArrowUpRight size={14} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-gray-400 text-sm">No orders recorded in this session yet.</p>
              <Link href="/listings" className="mt-3 inline-block text-xs text-green-400 hover:underline font-medium">
                Browse listings to place an order →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {orders.map((ord: any) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-semibold text-white">{ord.orderNumber || ord.id}</div>
                    <div className="text-gray-400 text-xs mt-0.5">
                      {ord.listing?.title || 'Harvest Order'} • {ord.quantityKg} kg
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">₹{ord.totalAmount}</div>
                    <span className="inline-block px-2 py-0.5 text-[10px] rounded-full bg-white/10 text-gray-300 font-medium uppercase mt-1">
                      {ord.status}
                    </span>
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
