'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

const ROLES = [
  { value: 'B2B_BUYER', label: '🏬 Commercial Buyer', desc: 'Restaurants, hotels, wholesalers' },
  { value: 'CONSUMER', label: '🛒 Consumer', desc: 'Personal & household purchases' },
  { value: 'GROWER', label: '🌾 Mushroom Grower', desc: 'Farmers & commercial producers' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    role: 'B2B_BUYER',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter (A-Z).';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter (a-z).';
    if (!/\d/.test(pwd)) return 'Password must contain at least one number (0-9).';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const pwdError = validatePassword(form.password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    setIsLoading(true);
    try {
      // Clean up phone format if provided
      const cleanedData = {
        ...form,
        phone: form.phone ? form.phone.trim() : undefined,
      };

      const result = await register(cleanedData);
      setSuccess(result.message || 'Account created successfully! You can now log in.');
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      if (Array.isArray(apiMsg)) {
        setError(apiMsg.join(' • '));
      } else if (typeof apiMsg === 'string') {
        setError(apiMsg);
      } else {
        setError('Registration failed. Please check your details or try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#0d160f] flex items-center justify-center px-4">
        <div className="glass rounded-3xl border border-green-500/30 p-10 max-w-md w-full text-center fade-in-up">
          <CheckCircle size={52} className="text-green-400 mx-auto mb-4 animate-bounce" />
          <h1 className="text-2xl font-bold text-white mb-2">Account Created!</h1>
          <p className="text-gray-300 text-sm mb-4">{success}</p>
          <p className="text-gray-500 text-xs">Redirecting to sign in page...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d160f] flex items-center justify-center px-4 py-12 hero-gradient">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-green-500/20 group-hover:ring-green-400/40 transition-all group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="MushroomMarket Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Mushroom<span className="gradient-text">Market</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 text-sm mt-1">Join India&apos;s largest verified mushroom network</p>
        </div>

        <div className="glass rounded-3xl border border-white/10 p-8">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs mb-6">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      form.role === role.value
                        ? 'border-green-500/60 bg-green-500/15 text-white font-bold'
                        : 'border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs">{role.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="displayName" className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
              <input
                id="displayName"
                type="text"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                required
                placeholder="Ravi Kumar"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
              <input
                id="reg-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="ravi@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-gray-400 mb-1.5">
                Phone Number <span className="text-gray-600">(optional, e.g. +919876543210)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+919876543210"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                  placeholder="e.g. Pass1234!"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-500">
                <Info size={12} className="flex-shrink-0" />
                <span>Must be min. 8 chars with 1 uppercase (A-Z), 1 lowercase (a-z), and 1 number (0-9)</span>
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-green-500 hover:bg-green-400 disabled:opacity-60 text-white font-bold rounded-xl transition-all glow-green text-sm flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-6">
            Already registered?{' '}
            <Link href="/login" className="text-green-400 hover:text-green-300 font-semibold">Sign in here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
