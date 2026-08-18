'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Send, User, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Navigation } from '@/components/layout/navigation';
import { useAuthStore } from '@/stores/auth.store';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      try {
        return await apiClient.get<any[]>('/conversations');
      } catch {
        return [];
      }
    },
    enabled: !!user,
  });

  const chatList = conversations || [
    {
      id: 'conv-1',
      otherUser: { name: 'GreenEarth Bio Farm', role: 'GROWER', verified: true },
      lastMessage: 'Your 50kg Oyster mushroom order will be dispatched tomorrow morning.',
      updatedAt: '10 mins ago',
    },
    {
      id: 'conv-2',
      otherUser: { name: 'Royal Spice Hotel', role: 'B2B_BUYER', verified: true },
      lastMessage: 'Can you supply 20kg Button mushrooms daily starting Monday?',
      updatedAt: '2 hours ago',
    },
  ];

  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <h1 className="text-2xl font-bold text-white mb-6">Messages & Negotiation</h1>

        <div className="glass rounded-3xl border border-white/10 h-[600px] grid md:grid-cols-3 overflow-hidden">
          {/* Conversation List */}
          <div className="border-r border-white/5 divide-y divide-white/5 overflow-y-auto">
            {chatList.map((chat: any) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                  selectedChat === chat.id ? 'bg-green-500/10' : 'hover:bg-white/5'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-xs flex-shrink-0">
                  {chat.otherUser?.name?.charAt(0) || '💬'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-xs truncate">{chat.otherUser?.name}</span>
                    <span className="text-gray-500 text-[10px]">{chat.updatedAt}</span>
                  </div>
                  <p className="text-gray-400 text-xs truncate mt-1">{chat.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 flex flex-col justify-between p-6 bg-[#0a120a]">
            {selectedChat ? (
              <>
                <div className="border-b border-white/5 pb-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-xs">
                      G
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">GreenEarth Bio Farm</h3>
                      <span className="text-green-400 text-[10px] flex items-center gap-1"><ShieldCheck size={10} /> KYC Verified Farm</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-2 mb-4">
                  <div className="bg-white/5 rounded-2xl p-3 max-w-sm text-xs text-gray-300">
                    Hello! We saw your order inquiry for 50kg Oyster mushrooms.
                  </div>
                  <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-3 max-w-sm ml-auto text-xs text-white">
                    Hi! Is fresh cold-chain delivery available to Bangalore North?
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 max-w-sm text-xs text-gray-300">
                    Yes! Your 50kg Oyster mushroom order will be dispatched tomorrow morning.
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message or negotiate pricing..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-green-500/50"
                  />
                  <button
                    onClick={() => setMessageInput('')}
                    className="px-4 py-2.5 bg-green-500 hover:bg-green-400 text-white rounded-xl text-xs font-semibold glow-green"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <MessageSquare size={40} className="mb-2" />
                <p className="text-sm font-medium">Select a conversation to view messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
