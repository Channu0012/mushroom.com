import { Navigation } from '@/components/layout/navigation';
import { HeroSection } from '@/app/home/hero-section';
import { FeaturedListings } from '@/app/home/featured-listings';
import { HowItWorks } from '@/app/home/how-it-works';
import { TrustSignals } from '@/app/home/trust-signals';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <HeroSection />
      <FeaturedListings />
      <HowItWorks />
      <TrustSignals />
      <Footer />
    </main>
  );
}
