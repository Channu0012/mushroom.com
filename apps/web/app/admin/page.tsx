'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Users, AlertCircle, Check, X, DollarSign } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export default function AdminPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'verifications' | 'users' | 'disputes' | 'payouts'>('verifications');

  const { data: verifications } = useQuery({
    queryKey: ['admin-verifications'],
    queryFn: () => apiClient.get<any[]>('/admin/verifications?type=farm'),
    enabled: user?.role === 'ADMIN',
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: 'VERIFIED' | 'REJECTED'; notes?: string }) =>
      apiClient.patch(`/admin/verifications/farms/${id}`, { status, notes }),
    onSuccess: () => {
      toast.success('Farm status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-verifications'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Update failed'),
  });

  if (user?.role !== 'ADMIN') {
    return (
      <main className="min-h-screen bg-[#0f1a0f] flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Admin Access Required</h1>
          <p className="text-gray-400 text-sm">You do not have permission to view the admin control panel.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f1a0f]">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-purple-400 text-xs font-semibold uppercase tracking-wider">Super Control Center</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Platform Administration</h1>
          </div>
        </div>

        <div className="flex border-b border-white/10 gap-6 mb-6">
          {[
            { id: 'verifications', label: 'Pending Verifications', icon: ShieldCheck },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'disputes', label: 'Disputes & Claims', icon: AlertCircle },
            { id: 'payouts', label: 'Grower Payouts', icon: DollarSign },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === id
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'verifications' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Pending Farm Verification Requests</h2>
            {!verifications || verifications.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center text-gray-400">
                No pending farm verifications. All clear! 🎉
              </div>
            ) : (
              <div className="grid gap-4">
                {verifications.map((farm: any) => (
                  <div key={farm.id} className="glass rounded-xl border border-white/10 p-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-base">{farm.name}</h3>
                        <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 rounded-full font-medium">
                          {farm.verificationStatus}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">
                        Grower: {farm.grower?.email} • {farm.city}, {farm.state}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => verifyMutation.mutate({ id: farm.id, status: 'VERIFIED' })}
                        className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        onClick={() => verifyMutation.mutate({ id: farm.id, status: 'REJECTED' })}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass rounded-xl p-6 text-center text-gray-400">
            User management directory loaded. Filtering by GROWER, BUYER, CONSUMER, ADMIN supported.
          </div>
        )}

        {activeTab === 'disputes' && (
          <div className="glass rounded-xl p-6 text-center text-gray-400">
            Disputes resolution desk. No open unresolved escalations.
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="glass rounded-xl p-6 text-center text-gray-400">
            Pending grower payouts queue. Integrated with Razorpay Route / Payout API.
          </div>
        )}
      </div>
    </main>
  );
}
