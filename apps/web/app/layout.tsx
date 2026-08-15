import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Mushroom Marketplace — India\'s Premium Mushroom Trading Platform',
    template: '%s | Mushroom Marketplace',
  },
  description: 'Connect directly with verified mushroom growers across India. Fresh oyster, shiitake, button mushrooms and more — sourced farm-to-table for restaurants, retailers, and consumers.',
  keywords: ['mushroom', 'marketplace', 'India', 'oyster mushroom', 'shiitake', 'growers', 'wholesale', 'organic'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Mushroom Marketplace',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: { fontFamily: 'var(--font-inter)' },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
