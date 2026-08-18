'use client';

import { Bell, ShieldCheck, ShoppingBag, Check } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';

export default function NotificationsPage() {
  const notifications = [
    {
      id: '1',
      title: 'Order Status Update',
      message: 'Your order #ORD-8492 for 50kg Oyster mushrooms has been accepted by GreenEarth Bio Farm.',
      time: '15 mins ago',
      type: 'ORDER',
    },
    {
      id: '2',
      title: 'KYC Verification Approved',
      message: 'Your farm profile verification status has been updated to VERIFIED. You can now post featured listings.',
      time: '1 hour ago',
      type: 'VERIFICATION',
    },
    {
      id: '3',
      title: 'Escrow Payment Released',
      message: 'Payment of ₹12,500 has been released from escrow for Order #ORD-8301.',
      time: '1 day ago',
      type: 'PAYMENT',
    },
  ];

  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell size={24} className="text-green-400" />
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
          </div>
          <span className="text-xs text-gray-500">3 unread</span>
        </div>

        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="glass rounded-2xl border border-white/10 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0 mt-0.5">
                {n.type === 'VERIFICATION' ? <ShieldCheck size={18} /> : <ShoppingBag size={18} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">{n.title}</h3>
                  <span className="text-gray-500 text-[10px]">{n.time}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
