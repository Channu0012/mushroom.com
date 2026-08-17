'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

const ROLES = [
  { value: 'BUYER', label: '🛒 Buyer', desc: 'Restaurants, retailers, end consumers' },
  { value: 'GROWER', label: '🌾 Grower', desc: 'Mushroom farmers & producers' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    role: 'BUYER',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const result = await register(form);
      setSuccess(result.message || 'Account created! Please check your email to verify.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#0d160f] flex items-center justify-center px-4">
        <div className="glass rounded-2xl border border-green-500/20 p-10 max-w-md w-full text-center">
          <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Check Your Email!</h1>
          <p className="text-gray-400 text-sm">{success}</p>
          <p className="text-gray-600 text-xs mt-4">Redirecting to login...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d160f] flex items-center justify-center px-4 py-10 hero-gradient">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <span className="text-xl">🍄</span>
            </div>
            <span className="text-white font-bold text-xl">
              Mushroom<span className="text-green-400">Market</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join 2,400+ growers and buyers</p>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      form.role === role.value
                        ? 'border-green-500/50 bg-green-500/10 text-white'
                        : 'border-white/10 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    <div className="font-medium text-sm">{role.label}</div>
                    <div className="text-xs mt-0.5 opacity-70">{role.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input
                id="displayName"
                type="text"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                required
                placeholder="Your full name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-400 mb-2">Email address</label>
              <input
                id="reg-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">Phone (optional)</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all glow-green text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-center text-gray-700 text-xs">
              By registering, you agree to our{' '}
              <Link href="/terms" className="text-green-400 hover:text-green-300">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-green-400 hover:text-green-300">Privacy Policy</Link>.
            </p>
          </form>

          <p className="text-center text-gray-600 text-sm mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
