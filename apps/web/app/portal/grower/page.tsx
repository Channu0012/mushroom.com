'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sprout, ShieldCheck, DollarSign, Package, Upload, Plus, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

export default function GrowerPortal() {
  const { user } = useAuthStore();
  const [payoutAmount, setPayoutAmount] = useState('24500');
  const [isUploading, setIsUploading] = useState(false);
  const [fssaiLicense, setFssaiLicense] = useState('22221003000492');

  const handlePayoutRequest = () => {
    toast.success(`Payout request of ₹${payoutAmount} submitted to Razorpay Route!`);
  };

  const handleUploadKyc = (docName: string) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success(`${docName} uploaded! Verification team notified.`);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sprout size={14} /> Grower Operations & Farm Portal
              </span>
              <span className="badge-verified px-2.5 py-0.5 rounded-full text-[10px] font-semibold">FSSAI Certified</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Farm Management & Escrow Payouts</h1>
            <p className="text-gray-400 text-xs mt-1">Batch yield tracking, harvest scheduling, buyer RFP responses, and bank payouts</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/listings/new"
              className="px-4 py-2.5 bg-green-500 hover:bg-green-400 text-white font-bold text-xs rounded-xl transition-all glow-green flex items-center gap-1.5"
            >
              <Plus size={15} /> Publish Harvest Listing
            </Link>
            <Link
              href="/requirements"
              className="px-4 py-2.5 glass border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-semibold rounded-xl transition-all"
            >
              Browse Buyer RFPs →
            </Link>
          </div>
        </div>

        {/* Operational Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">Escrow Balance</span>
              <DollarSign size={16} className="text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">₹38,400</div>
            <div className="text-gray-500 text-[10px] mt-1">Pending buyer inspection release</div>
          </div>

          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">Total Earnings Disbursed</span>
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">₹1,84,200</div>
            <div className="text-gray-500 text-[10px] mt-1">Via Razorpay Route API</div>
          </div>

          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">Active Cold Storage Stock</span>
              <Package size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">250 kg</div>
            <div className="text-gray-500 text-[10px] mt-1">Oyster & Button batches</div>
          </div>

          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">Verification Status</span>
              <ShieldCheck size={16} className="text-green-400" />
            </div>
            <div className="text-lg font-bold text-green-400 flex items-center gap-1">
              <CheckCircle2 size={16} /> VERIFIED FARM
            </div>
            <div className="text-gray-500 text-[10px] mt-1">KYC Tier 1 Complete</div>
          </div>
        </div>

        {/* Middle Two Panels */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Bank Payout Request Panel */}
          <div className="glass rounded-3xl border border-white/10 p-8">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={22} className="text-green-400" />
              <h2 className="text-xl font-bold text-white">Request Bank Payout</h2>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Disburse your cleared escrow earnings directly into your registered bank account via Razorpay Route.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Amount to Payout (₹)</label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-base focus:outline-none focus:border-green-500/50"
                />
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-xs space-y-1.5 text-gray-400">
                <div className="flex justify-between"><span>Registered Account</span><span className="text-white font-mono">HDFC Bank •••• 4892</span></div>
                <div className="flex justify-between"><span>IFSC Code</span><span className="text-white font-mono">HDFC0000240</span></div>
                <div className="flex justify-between"><span>Payout Settlement Time</span><span className="text-green-400 font-semibold">Instant T+0</span></div>
              </div>
            </div>

            <button
              onClick={handlePayoutRequest}
              className="w-full py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl text-xs transition-all glow-green"
            >
              Transfer Funds to Bank Account
            </button>
          </div>

          {/* KYC Document Verification Upload */}
          <div className="glass rounded-3xl border border-white/10 p-8">
            <div className="flex items-center gap-2 mb-4">
              <Upload size={22} className="text-blue-400" />
              <h2 className="text-xl font-bold text-white">Farm Verification Documents</h2>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Upload your farm certifications to earn the <span className="text-green-400 font-bold">VERIFIED GROWER</span> badge and boost buyer trust.
            </p>

            <div className="space-y-4">
              {[
                { name: 'FSSAI License Document', status: 'VERIFIED', action: 'Upload FSSAI' },
                { name: 'Good Agricultural Practices (GAP) Certificate', status: 'VERIFIED', action: 'Upload GAP' },
                { name: 'Aadhaar / Farm Ownership Proof', status: 'VERIFIED', action: 'Upload ID' },
              ].map((doc) => (
                <div key={doc.name} className="bg-white/5 rounded-xl p-3.5 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-xs">{doc.name}</div>
                    <span className="text-green-400 text-[10px] font-semibold flex items-center gap-1 mt-0.5"><CheckCircle2 size={10} /> Verified</span>
                  </div>
                  <button
                    onClick={() => handleUploadKyc(doc.name)}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold transition-all"
                  >
                    Re-upload
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
