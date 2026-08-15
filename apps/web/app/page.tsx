import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedListings } from '@/components/home/featured-listings';
import { HowItWorks } from '@/components/home/how-it-works';
import { TrustSignals } from '@/components/home/trust-signals';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Mushroom Marketplace — India\'s Premium Mushroom Trading Platform',
  description: 'Connect directly with verified mushroom growers. Fresh oyster, shiitake, button mushrooms — farm-to-table for restaurants, retailers & consumers across India.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0f1a0f]">
      <Navigation />
      <HeroSection />
      <FeaturedListings />
      <HowItWorks />
      <TrustSignals />
      <Footer />
    </main>
  );
}
