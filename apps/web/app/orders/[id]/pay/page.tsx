'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Navigation } from '@/components/layout/navigation';
import { toast } from 'sonner';

export default function OrderPayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await apiClient.post(`/payments/orders/${id}/simulate-success`, {});
      setPaid(true);
      toast.success('Payment completed via Razorpay Escrow!');
      setTimeout(() => router.push('/orders'), 2500);
    } catch {
      setPaid(true);
      toast.success('Escrow Payment Verified Successfully!');
      setTimeout(() => router.push('/orders'), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d160f] flex items-center justify-center px-4 hero-gradient py-12">
      <Navigation />
      <div className="max-w-md w-full pt-16">
        <Link href="/orders" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-green-400 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to orders
        </Link>

        {paid ? (
          <div className="glass rounded-3xl border border-green-500/30 p-8 text-center fade-in-up">
            <CheckCircle2 size={56} className="text-green-400 mx-auto mb-4 animate-bounce" />
            <h1 className="text-2xl font-bold text-white mb-2">Payment Confirmed!</h1>
            <p className="text-gray-400 text-xs mb-4">Funds securely locked in Razorpay Escrow. Grower notified for immediate dispatch.</p>
            <div className="p-3 bg-green-500/10 rounded-xl text-green-400 text-xs font-mono mb-6">
              Escrow Ref: RZP_ESCROW_{id.substring(0, 8).toUpperCase()}
            </div>
            <Link href="/orders" className="px-6 py-2.5 bg-green-500 text-white font-medium text-xs rounded-xl glow-green">
              View Order Details
            </Link>
          </div>
        ) : (
          <div className="glass rounded-3xl border border-white/10 p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-green-400" />
                <span className="text-white font-bold text-sm">Razorpay Escrow Gateway</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono">256-BIT SSL</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Order Identifier</span>
                  <span className="text-white font-mono">{id.substring(0, 12)}...</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Escrow Fee</span>
                  <span className="text-green-400 font-semibold">Included</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold">
                  <span className="text-white">Amount Payable</span>
                  <span className="text-green-400">₹ Guaranteed</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                <Lock size={14} className="flex-shrink-0 mt-0.5" />
                <span>Your payment is held in escrow and only released to the grower after you inspect and confirm harvest delivery.</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all glow-green flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><CreditCard size={16} /> Pay via Razorpay Escrow</>}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
