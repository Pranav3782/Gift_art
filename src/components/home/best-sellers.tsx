
"use client";

import { motion } from 'framer-motion';
import { Loader2, Star, Palette, Heart, Gift, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

// The high-resolution background provided by the user
const BG_ARTWORK = "https://res.cloudinary.com/drjrbb4yn/image/upload/v1782027359/kids-image_pn17nh.png";

// Reference image exact colors
const CARD_THEMES = [
  { bg: 'bg-[#FFF0D9]', pill: 'bg-[#FF6B95]' }, // Peach
  { bg: 'bg-[#E8F8F0]', pill: 'bg-[#FF6B95]' }, // Mint Green
  { bg: 'bg-[#FFEAF6]', pill: 'bg-[#FF6B95]' }, // Soft Pink
];

export function BestSellers({ cms }: { cms?: any }) {
  const db = useFirestore();

  const bestSellersQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'products'),
      where('isBestSeller', '==', true),
      limit(3)
    );
  }, [db]);

  const { data: products, loading } = useCollection<any>(bestSellersQuery);

  return (
    <section className="hidden md:block relative bg-white overflow-hidden py-12">
      {/* 3 Pointers at the top on a white background with generous whitespace */}
      <div className="max-w-[1440px] mx-auto px-6 mb-16">
        <div className="flex justify-center items-center gap-12 lg:gap-24">
          {/* Pointer 1 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#FFFBEB] flex items-center justify-center text-[#F59E0B] shadow-inner">
              <Star className="w-5 h-5 fill-[#F59E0B]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-black text-slate-800">Premium Quality</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">PERSONALIZED FOR MEMORIES</span>
            </div>
          </div>
          
          {/* Pointer 2 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#10B981] shadow-inner">
              <Palette className="w-5 h-5 fill-[#10B981]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-black text-slate-800">Unique & Handcrafted</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">250+ UNIQUE THEMES</span>
            </div>
          </div>
          
          {/* Pointer 3 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#FFF1F2] flex items-center justify-center text-[#F43F5E] shadow-inner">
              <Heart className="w-5 h-5 fill-[#F43F5E]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-black text-slate-800">Loved by Thousands</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">10,000+ HAPPY CUSTOMERS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        Container designed to maintain image aspect ratio without distortion.
        The padding and margins are adjusted to let the cards sit on the "floor" of the background.
      */}
      <div className="relative w-full max-w-[1440px] mx-auto overflow-visible">
        {/* Background Image Layer */}
        <div className="relative w-full aspect-[1440/1000]">
          <Image 
            src={BG_ARTWORK} 
            alt="Best Sellers" 
            fill 
            className="object-contain object-top"
            priority
            unoptimized
          />
        </div>

        {/* Logo and Header Overlay centered and overlapping top section of the background */}
        <div className="absolute top-[4%] left-0 right-0 z-20 flex flex-col items-center pointer-events-none">
          <div className="bg-white rounded-3xl shadow-xl shadow-[#0ea5e9]/5 px-8 py-3.5 flex items-center gap-3 border border-slate-100/50 pointer-events-auto">
            <div className="relative">
              <div className="w-9 h-9 bg-[#0ea5e9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <Gift className="w-5 h-5" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-headline font-black text-lg text-[#1E1B4B] tracking-tighter">
                GiftArtStudio
              </span>
              <span className="text-[7px] font-black text-[#0ea5e9] uppercase tracking-[0.3em]">
                MAGICAL GIFTS
              </span>
            </div>
          </div>

          <h2 className="mt-4 font-headline font-black text-white text-3xl md:text-4xl lg:text-5xl drop-shadow-sm tracking-tight">
            Best Sellers
          </h2>
        </div>

        {/* Product Cards Overlay - Positioned exactly as per reference */}
        <div className="absolute bottom-[5%] left-0 right-0 z-10 px-6">
          <div className="container mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-3 gap-6 lg:gap-12 max-w-6xl mx-auto w-full">
                {products.map((p: any, i: number) => {
                  const theme = CARD_THEMES[i % CARD_THEMES.length];
                  return (
                    <motion.div 
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className={cn(
                        "group cursor-pointer rounded-[3rem] overflow-hidden shadow-2xl flex flex-col transition-all hover:-translate-y-2 duration-300",
                        theme.bg
                      )}
                    >
                      <Link href={`/product/${p.id}`} className="flex flex-col h-full">
                        {/* Product Image Area - Edge-to-edge top, left, right to match reference */}
                        <div className="relative aspect-square w-full bg-white rounded-t-[3rem] overflow-hidden">
                          <Image 
                            src={p.image} 
                            alt={p.name} 
                            fill 
                            className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                            unoptimized 
                          />
                        </div>
                        
                        {/* Product Info Area - Centered and Bold as per Screenshot */}
                        <div className="p-6 pt-7 pb-10 flex-1 flex flex-col items-center justify-between text-center space-y-6">
                          <h3 className="font-black text-slate-800 text-[14px] lg:text-[17px] leading-snug tracking-tight max-w-[220px]">
                            {p.name}
                          </h3>
                          
                          {/* Signature Pink Pill Footer */}
                          <div className={cn(
                            "flex items-center justify-center w-28 h-7 md:h-9 rounded-full shadow-lg shadow-black/5 transition-all duration-500 group-hover:w-36 group-hover:brightness-110 text-white font-black text-[10px] md:text-[12px] uppercase tracking-widest",
                            theme.pill
                          )}>
                            BUY NOW
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 font-black uppercase tracking-widest text-xs italic">
                Gathering the Studio Favourites...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
