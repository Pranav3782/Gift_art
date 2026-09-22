'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, X, ArrowRight, Sparkles, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Premium Wishlist & Cart Engagement System.
 * Naturally encourages conversion based on smart user behavior triggers.
 */
export function EngagementSystem() {
  const pathname = usePathname();
  const { cart, subtotal, cartCount } = useCart();
  const { user } = useUser();
  const db = useFirestore();

  // Wishlist fetching (Safe check for existence)
  const wishlistQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'wishlist'), where('userId', '==', user.uid), limit(3));
  }, [db, user]);
  
  const { data: wishlistItems } = useCollection<any>(wishlistQuery);

  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Prevention logic: Don't show on distraction-free or core action pages
  const isIgnoredPage = useMemo(() => {
    const ignored = ['/checkout', '/login', '/signup', '/admin', '/cart', '/success', '/failure'];
    return ignored.some(p => pathname.startsWith(p));
  }, [pathname]);

  useEffect(() => {
    if (isIgnoredPage || isDismissed) {
      setIsVisible(false);
      return;
    }

    // Persist dismissal for the current session
    const dismissedSession = sessionStorage.getItem('engagement_dismissed');
    if (dismissedSession) {
      setIsDismissed(true);
      return;
    }

    const showEngagement = () => {
      // Logic: Only show if there's actually something to show
      const hasCart = cart.length > 0;
      const hasWish = wishlistItems && wishlistItems.length > 0;
      
      if ((hasCart || hasWish) && !isVisible) {
        setIsVisible(true);
      }
    };

    // Trigger 1: Scroll Depth (> 50%)
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0 && scrolled / total > 0.5) showEngagement();
    };

    // Trigger 2: Inactivity (User stops interacting for 45s)
    let inactivityTimer: NodeJS.Timeout;
    const resetInactivity = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(showEngagement, 45000);
    };

    // Trigger 3: Exit Intent (Mouse moves out of viewport top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) showEngagement();
    };

    // Trigger 4: Session Revisit / Delayed Appearance
    const initialTimer = setTimeout(showEngagement, 20000); // 20s initial wait

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', resetInactivity);
    window.addEventListener('keydown', resetInactivity);
    document.addEventListener('mouseleave', handleMouseLeave);
    resetInactivity();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', resetInactivity);
      window.removeEventListener('keydown', resetInactivity);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(inactivityTimer);
      clearTimeout(initialTimer);
    };
  }, [isIgnoredPage, isDismissed, cart.length, wishlistItems, isVisible, pathname]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('engagement_dismissed', 'true');
  };

  const hasCartItems = cart.length > 0;
  const hasWishlistItems = wishlistItems && wishlistItems.length > 0;

  if (isIgnoredPage || !isVisible || (!hasCartItems && !hasWishlistItems)) return null;

  // Decision: Show Cart Engagement if items exist, fallback to Wishlist
  const displayType = hasCartItems ? 'cart' : 'wishlist';
  const displayItems = hasCartItems ? cart.slice(0, 3) : (wishlistItems || []).slice(0, 3);
  const totalValue = hasCartItems ? subtotal : displayItems.reduce((acc: number, curr: any) => acc + (curr.price || 0), 0);
  const count = hasCartItems ? cartCount : (wishlistItems?.length || 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100, opacity: 0, scale: 0.9 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: 100, opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 22, stiffness: 120 }}
        className="fixed bottom-24 lg:bottom-10 right-6 z-[120] w-[320px] md:w-[380px]"
      >
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.18)] border border-slate-100 overflow-hidden relative group"
        >
          {/* Header Accent */}
          <div className={cn(
            "h-1.5 w-full",
            displayType === 'cart' ? "bg-sky-500" : "bg-rose-500"
          )} />

          {/* Close Action */}
          <button 
            onClick={handleDismiss}
            className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-3">
              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                displayType === 'cart' ? "bg-sky-50 text-sky-600 border-sky-100" : "bg-rose-50 text-rose-600 border-rose-100"
              )}>
                {displayType === 'cart' ? <ShoppingCart className="h-3 w-3" /> : <Heart className="h-3 w-3" />}
                <span>{displayType === 'cart' ? 'Your Bag is Ready' : 'Wishlist waiting'}</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-headline font-black text-slate-800 leading-tight">
                {displayType === 'cart' 
                  ? "Your selected treasures are waiting for unboxing!" 
                  : "Complete your unique gift collection today."}
              </h3>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex -space-x-4 overflow-hidden py-1">
                {displayItems.map((item: any, i: number) => (
                  <div key={i} className="relative w-14 h-14 rounded-2xl border-4 border-white bg-slate-50 overflow-hidden shadow-md transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <Image 
                      src={item.image} 
                      alt="Thumbnail" 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
                {count > 3 && (
                  <div className="relative w-14 h-14 rounded-2xl border-4 border-white bg-slate-900 flex items-center justify-center text-[11px] font-black text-white shadow-md">
                    +{count - 3}
                  </div>
                )}
              </div>
              
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {count} {count === 1 ? 'item' : 'items'} saved
                </p>
                <p className="text-lg font-black text-slate-800">
                   ₹{totalValue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button asChild className={cn(
                "w-full h-16 rounded-2xl text-white font-black uppercase text-xs tracking-widest gap-3 shadow-2xl relative overflow-hidden group/btn transition-all active:scale-95",
                displayType === 'cart' ? "bg-slate-900 hover:bg-slate-800" : "bg-rose-500 hover:bg-rose-600"
              )}>
                <Link href={displayType === 'cart' ? '/cart' : '/wishlist'}>
                  <motion.div
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-2"
                  >
                    {displayType === 'cart' ? 'Checkout Now' : 'View Wishlist'}
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </motion.div>
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 opacity-30 grayscale pointer-events-none">
               <div className="w-10 h-0.5 bg-slate-200 rounded-full" />
               <Sparkles className="h-3 w-3" />
               <div className="w-10 h-0.5 bg-slate-200 rounded-full" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
