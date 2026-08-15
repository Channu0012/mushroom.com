import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0f0a] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                <span className="text-sm">🍄</span>
              </div>
              <span className="text-white font-semibold">MushroomMarket</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              India&apos;s trusted marketplace connecting mushroom growers with buyers. Fresh, verified, farm-to-table.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Marketplace</h4>
            <ul className="space-y-2">
              {['Browse Listings', 'Post Requirement', 'Find Growers', 'Price Guide'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3 text-sm">For Growers</h4>
            <ul className="space-y-2">
              {['Create Listing', 'Manage Farm', 'Get Verified', 'Grow Guide'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Support</h4>
            <ul className="space-y-2">
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2024 Mushroom Marketplace. Made with ❤️ in India.</p>
          <div className="flex items-center gap-4">
            <span className="text-green-500 text-xs font-medium px-2 py-1 bg-green-500/10 rounded-full">🇮🇳 India First</span>
            <span className="text-gray-600 text-xs">Razorpay Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
