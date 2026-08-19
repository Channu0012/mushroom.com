import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MushroomMarket — India\'s Premier Mushroom Marketplace',
  description: 'Connect with verified mushroom growers across India. Fresh, quality mushrooms delivered to your door. Trade oyster, shiitake, button mushrooms and more.',
  keywords: 'mushroom marketplace, buy mushrooms india, mushroom growers, fresh mushrooms, oyster mushrooms, shiitake',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/icon.png',
  },
  openGraph: {
    title: 'MushroomMarket — India\'s Premier Mushroom Marketplace',
    description: 'Connect with verified mushroom growers. Fresh quality mushrooms B2B & B2C.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
