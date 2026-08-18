'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, FileText, Calculator, TrendingUp, ShieldCheck, ArrowRight, Download, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

export default function CommercialBuyerPortal() {
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState<number>(200);
  const [basePrice, setBasePrice] = useState<number>(220);
  const [contractFreq, setContractFreq] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [gstNumber, setGstNumber] = useState('29AABCU9639R1ZM');

  // Wholesale Discount Tier Calculation
  const discountPercent = quantity >= 500 ? 20 : quantity >= 200 ? 12 : quantity >= 50 ? 5 : 0;
  const subtotal = quantity * basePrice;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const gstAmount = Math.round(((subtotal - discountAmount) * 0.05) * 100) / 100; // 5% GST on fresh produce
  const totalAmount = Math.round(subtotal - discountAmount + gstAmount);

  const handleContractCreate = () => {
    toast.success(`Recurring ${contractFreq} supply contract initialized for ${quantity} kg!`);
  };

  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={14} /> Commercial B2B Buyer Hub
              </span>
              <span className="badge-verified px-2.5 py-0.5 rounded-full text-[10px] font-semibold">GST Registered</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Wholesale Procurement & Contracts</h1>
            <p className="text-gray-400 text-xs mt-1">Bulk ordering, tier discounts, recurring contracts, and GST tax credit invoices</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/requirements/new"
              className="px-4 py-2.5 bg-green-500 hover:bg-green-400 text-white font-bold text-xs rounded-xl transition-all glow-green flex items-center gap-1.5"
            >
              <Plus size={15} /> Post Commercial RFP
            </Link>
            <Link
              href="/orders"
              className="px-4 py-2.5 glass border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-semibold rounded-xl transition-all"
            >
              Track B2B Orders
            </Link>
          </div>
        </div>

        {/* Top Grid Tools */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Wholesale Pricing Calculator */}
          <div className="lg:col-span-2 glass rounded-3xl border border-white/10 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Calculator size={22} className="text-green-400" />
              <h2 className="text-xl font-bold text-white">Wholesale Volume Price Tier Calculator</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">
                  Order Volume (kg) — <span className="text-green-400 font-bold">{quantity} kg</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-green-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                  <span>20 kg (Standard)</span>
                  <span>200 kg (-12%)</span>
                  <span>500+ kg (-20%)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Base Price / kg (₹)</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-green-500/50"
                />
              </div>
            </div>

            {/* Discount Tiers Display */}
            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <div className={`p-3 rounded-xl border text-xs ${quantity >= 50 && quantity < 200 ? 'border-green-500 bg-green-500/10 text-white' : 'border-white/5 text-gray-500'}`}>
                <div className="font-bold">Tier 1 (50kg+)</div>
                <div className="text-[11px] text-green-400 font-semibold mt-0.5">5% Discount</div>
              </div>
              <div className={`p-3 rounded-xl border text-xs ${quantity >= 200 && quantity < 500 ? 'border-green-500 bg-green-500/10 text-white' : 'border-white/5 text-gray-500'}`}>
                <div className="font-bold">Tier 2 (200kg+)</div>
                <div className="text-[11px] text-green-400 font-semibold mt-0.5">12% Discount</div>
              </div>
              <div className={`p-3 rounded-xl border text-xs ${quantity >= 500 ? 'border-green-500 bg-green-500/10 text-white' : 'border-white/5 text-gray-500'}`}>
                <div className="font-bold">Tier 3 (500kg+)</div>
                <div className="text-[11px] text-green-400 font-semibold mt-0.5">20% Discount</div>
              </div>
            </div>

            {/* Price Output Summary */}
            <div className="bg-white/5 rounded-2xl p-5 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({quantity} kg × ₹{basePrice})</span>
                <span className="text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-400 font-medium">
                <span>Wholesale Tier Discount ({discountPercent}%)</span>
                <span>- ₹{discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>GST (5% Agricultural Produce)</span>
                <span className="text-white">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between text-base font-extrabold">
                <span className="text-white">Total B2B Invoice Amount</span>
                <span className="text-green-400">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Recurring Contract Setup */}
          <div className="glass rounded-3xl border border-white/10 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw size={20} className="text-blue-400" />
                <h3 className="text-lg font-bold text-white">Automated Recurring Supply</h3>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Lock in farm capacity with guaranteed weekly or monthly harvest deliveries at fixed wholesale pricing.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Supply Cycle</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setContractFreq('WEEKLY')}
                      className={`py-2 text-xs font-bold rounded-xl border ${contractFreq === 'WEEKLY' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/10 text-gray-500'}`}
                    >
                      Weekly Batch
                    </button>
                    <button
                      type="button"
                      onClick={() => setContractFreq('MONTHLY')}
                      className={`py-2 text-xs font-bold rounded-xl border ${contractFreq === 'MONTHLY' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/10 text-gray-500'}`}
                    >
                      Monthly Contract
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">GSTIN for Tax Credit</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleContractCreate}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> Initialize Supply Contract
            </button>
          </div>
        </div>

        {/* Commercial Quality & Certifications Section */}
        <div className="glass rounded-3xl border border-white/10 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Quality Audit & Certification Desk</h3>
              <p className="text-gray-400 text-xs mt-0.5">Download FSSAI, GAP, and lab test reports for your compliance filings</p>
            </div>
            <span className="text-xs text-green-400 font-semibold flex items-center gap-1"><ShieldCheck size={14} /> 100% Certified Farms</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'FSSAI Food Safety Compliance Certificate', code: 'FSSAI_LIC_2026_AGRO', date: 'Valid thru 2028' },
              { title: 'GAP (Good Agricultural Practices) Audit Report', code: 'GAP_IND_84920_VERIFIED', date: 'Inspected July 2026' },
              { title: 'Heavy Metal & Residue Free Lab Test', code: 'NABL_LAB_TEST_2026', date: 'Batch #8492' },
            ].map((cert) => (
              <div key={cert.code} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-xs mb-1">{cert.title}</div>
                  <div className="text-gray-500 text-[10px] font-mono">{cert.code} • {cert.date}</div>
                </div>
                <button
                  onClick={() => toast.success(`Downloading ${cert.code}.pdf`)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-green-400 border border-white/10 transition-all"
                  title="Download PDF"
                >
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
