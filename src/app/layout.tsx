import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import BackgroundAudio from '@/components/BackgroundAudio';
import { getSettings } from '@/lib/db';

export const metadata: Metadata = {
  title: '1Bagg3dCrew • Live Your Life On Air | Stance Merch & Air Suspension',
  description: 'Official store for 1Bagg3dCrew. Luxury streetwear, 450GSM hoodies, automotive graphic tees, and precision performance air suspension systems. EST. 2026.',
  keywords: ['1bagg3dcrew', '1bagg3d', 'air suspension', 'stance', 'bagged', 'streetwear', 'car apparel', 'live your life on air'],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }
    ]
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en" className="dark bg-black">
      <body className="bg-black text-zinc-100 min-h-screen antialiased selection:bg-white selection:text-black flex flex-col justify-between">
        <CartProvider>
          <Navbar announcement={settings.announcement} />
          <CartDrawer />
          <BackgroundAudio />
          <main className="flex-1 w-full bg-black">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
