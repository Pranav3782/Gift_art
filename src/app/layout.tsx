
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { CartProvider } from '@/lib/store/cart-context';
import { NewsletterPopup } from '@/components/newsletter-popup';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { FirebaseClientProvider } from '@/firebase';
import { DynamicSEO } from '@/components/dynamic-seo';
import { EngagementSystem } from '@/components/engagement-system';
import { LivePurchaseNotifications } from '@/components/live-purchase-notifications';

export const metadata: Metadata = {
  title: 'GiftArtStudio | Magical Personalized Gifts',
  description: 'Unique, premium, and personalized greetings handcrafted with love.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><defs><linearGradient id=%22g%22 x1=%220%%22 y1=%220%%22 x2=%22100%%22 y2=%22100%%22><stop offset=%220%%22 style=%22stop-color:%230369A1%22/><stop offset=%22100%%22 style=%22stop-color:%23BAE6FD%22/></linearGradient></defs><rect width=%22100%22 height=%22100%22 rx=%2224%22 fill=%22url(%23g)%22/><text y=%22.75em%22 x=%2250%%22 text-anchor=%22middle%22 font-size=%2265%22 font-weight=%22900%22 font-family=%22Nunito, sans-serif%22 fill=%22white%22>G</text></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Baloo+2:wght@400..800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 lg:pb-0 pb-20">
        <FirebaseClientProvider>
          <DynamicSEO />
          <CartProvider>
            {children}
            <EngagementSystem />
            <LivePurchaseNotifications />
            <NewsletterPopup />
            <WhatsAppButton />
            <Toaster />
            <MobileBottomNav />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
