import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MushroomMarket — India\'s Premier Mushroom Marketplace',
  description: 'Connect with verified mushroom growers across India. Fresh, quality mushrooms delivered to your door. Trade oyster, shiitake, button mushrooms and more.',
  keywords: 'mushroom marketplace, buy mushrooms india, mushroom growers, fresh mushrooms, oyster mushrooms, shiitake',
  openGraph: {
    title: 'MushroomMarket — India\'s Premier Mushroom Marketplace',
    description: 'Connect with verified mushroom growers. Fresh quality mushrooms B2B & B2C.',
    type: 'website',
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
