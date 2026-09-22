'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface MobileBestSellersProps {
  cms?: any;
}

const DEFAULT_BANNER = "https://res.cloudinary.com/drjrbb4yn/image/upload/v1782027359/kids-image_pn17nh.png";

export function MobileBestSellers({ cms }: MobileBestSellersProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const db = useFirestore();
  
  const bestSellersQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'products'),
      where('isBestSeller', '==', true),
      limit(9)
    );
  }, [db]);
  
  const { data: products, loading } = useCollection<any>(bestSellersQuery);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(autoScroll);
  }, [emblaApi, onSelect]);

  // Group products by 3 for the carousel to match the reference layout
  const slides = useMemo(() => {
    const s = [];
    if (products) {
      for (let i = 0; i < products.length; i += 3) {
        s.push(products.slice(i, i + 3));
      }
    }
    return s;
  }, [products]);

  return (
    <section className="md:hidden px-4 py-6">
      <div className="bg-[#FFF0F7] rounded-[32px] p-6 shadow-sm overflow-hidden flex flex-col gap-5">
        
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-[#FF6B95] tracking-tight uppercase">
            {cms?.title || "Best Sellers"}
          </h2>
          <Link href="/shop/new/best-sellers" className="text-[10px] font-black text-[#FF6B95] uppercase tracking-widest opacity-80">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-pink-400" /></div>
        ) : products && products.length > 0 ? (
          <div className="relative pb-[120px]">
            {/* Banner Area */}
            <div className="relative w-full aspect-[1.6/1] rounded-[24px] overflow-hidden shadow-inner bg-gradient-to-br from-[#FF6B95] via-[#FF8DB1] to-[#FFD580] flex items-center justify-center">
              <div className="absolute inset-0 bg-black/5" />
              <h3 className="relative z-10 font-headline font-black text-2xl text-white tracking-tight drop-shadow-sm uppercase">
                Best Sellers
              </h3>
            </div>

            {/* Overlapping Products Carousel */}
            <div className="absolute bottom-0 left-0 right-0 z-20 px-2" ref={emblaRef}>
              <div className="flex">
                {slides.map((group, groupIdx) => (
                  <div key={groupIdx} className="flex-[0_0_100%] min-w-0 grid grid-cols-3 gap-2">
                    {group.map((p: any) => (
                      <Link key={p.id} href={`/product/${p.id}`} className="block">
                        <div className="bg-white rounded-[14px] p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.1)] flex flex-col h-full border border-pink-50/20">
                          <div className="relative aspect-square w-full rounded-[10px] overflow-hidden bg-slate-50 mb-1.5">
                            <Image 
                              src={p.image} 
                              alt={p.name} 
                              fill 
                              className="object-cover" 
                              unoptimized
                            />
                          </div>
                          <div className="px-1 pb-2 space-y-1.5">
                            <h3 className="text-[9px] font-bold text-slate-800 leading-tight line-clamp-2 uppercase">
                              {p.name}
                            </h3>
                            <p className="text-[11px] font-black text-[#FF6B95]">
                              ₹{p.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 italic text-pink-300 text-xs font-bold uppercase tracking-widest">
            Best sellers arriving...
          </div>
        )}

        {!loading && scrollSnaps.length > 0 && (
          <div className="flex justify-center pt-2">
            <div className="flex gap-1.5">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    selectedIndex === i ? "w-8 bg-[#FF6B95]" : "w-1.5 bg-pink-200"
                  )}
                  aria-label={`Go to slide group ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
