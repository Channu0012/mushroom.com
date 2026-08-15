'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { Suspense } from 'react';

const registerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Enter a valid phone number (e.g. +919876543210)').optional().or(z.literal('')),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and number'),
  role: z.enum(['GROWER', 'B2B_BUYER', 'CONSUMER']),
});

type RegisterForm = z.infer<typeof registerSchema>;

const ROLE_OPTIONS = [
  { value: 'GROWER', label: '🌱 Grower', description: 'I grow & sell mushrooms' },
  { value: 'B2B_BUYER', label: '🏪 Business Buyer', description: 'Restaurant, retail, or reseller' },
  { value: 'CONSUMER', label: '🛒 Consumer', description: 'Personal / home use' },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams?.get('role') as any) || 'CONSUMER';
  const { register: registerUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const result = await registerUser({ ...data, phone: data.phone || undefined });
      setSubmitted(true);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Check your email!</h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          We&apos;ve sent a verification link to your email. Click it to activate your account and start trading.
        </p>
        <Link href="/login" className="inline-block mt-4 text-green-400 hover:text-green-300 font-medium text-sm">
          Go to login →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Role selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">I want to...</label>
        <div className="grid grid-cols-3 gap-2">
          {ROLE_OPTIONS.map(({ value, label, description }) => (
            <button
              type="button"
              key={value}
              onClick={() => setValue('role', value as any)}
              className={`p-3 rounded-xl border text-center transition-all text-xs ${
                selectedRole === value
                  ? 'border-green-500/50 bg-green-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="font-medium mb-0.5">{label}</div>
              <div className="text-gray-500 text-[10px]">{description}</div>
            </button>
          ))}
        </div>
        {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            {...register('displayName')}
            type="text"
            id="displayName"
            placeholder="Ravi Kumar"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-all"
          />
        </div>
        {errors.displayName && <p className="text-red-400 text-xs mt-1">{errors.displayName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            {...register('email')}
            type="email"
            id="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-all"
          />
        </div>
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Phone (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Phone <span className="text-gray-600">(optional)</span>
        </label>
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            placeholder="+919876543210"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-all"
          />
        </div>
        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            placeholder="Min 8 chars, uppercase & number"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-400 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all glow-green"
      >
        {loading ? 'Creating account...' : <>Create Account <ArrowRight size={16} /></>}
      </button>

      <p className="text-center text-gray-600 text-xs">
        By creating an account, you agree to our{' '}
        <Link href="/terms" className="text-green-400 hover:text-green-300">Terms of Service</Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-green-400 hover:text-green-300">Privacy Policy</Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <span className="text-lg">🍄</span>
            </div>
            <span className="text-white font-semibold text-xl">MushroomMarket</span>
          </Link>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-gray-400 text-sm mt-1">Join India&apos;s mushroom trading community — free forever</p>
          </div>

          <Suspense fallback={<div className="animate-pulse space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-12 rounded-xl shimmer" />)}</div>}>
            <RegisterForm />
          </Suspense>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
