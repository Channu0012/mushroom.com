import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#0a120a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-green-500/20 group-hover:ring-green-400/40 transition-all">
                <Image
                  src="/logo.png"
                  alt="MushroomMarket Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-bold tracking-tight">
                Mushroom<span className="gradient-text">Market</span>
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              India&apos;s premier marketplace connecting mushroom growers with buyers across the country.
            </p>
            <div className="flex gap-3">
              {['Twitter', 'Instagram', 'LinkedIn'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 glass rounded-lg flex items-center justify-center text-gray-600 hover:text-green-400 text-xs transition-colors border border-white/5"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Marketplace</h4>
            <ul className="space-y-2">
              {[
                { href: '/listings', label: 'Browse Listings' },
                { href: '/requirements', label: 'Post Requirement' },
                { href: '/growers', label: 'Find Growers' },
                { href: '/register?role=GROWER', label: 'Become a Grower' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-600 hover:text-green-400 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/blog', label: 'Blog' },
                { href: '/careers', label: 'Careers' },
                { href: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-600 hover:text-green-400 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/refund', label: 'Refund Policy' },
                { href: '/grievance', label: 'Grievance Officer' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-600 hover:text-green-400 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-700 text-xs">
            © {currentYear} MushroomMarket. All rights reserved. Made with 🍄 in India.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-700">
            <span>🔒 Secured by Razorpay</span>
            <span>•</span>
            <span>ISO 27001 Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
