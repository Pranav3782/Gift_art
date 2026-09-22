'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface MobileNewArrivalsProps {
  cms?: any;
}

export function MobileNewArrivals({ cms }: MobileNewArrivalsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const db = useFirestore();
  
  const arrivalsQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'products'),
      where('isNew', '==', true),
      limit(6)
    );
  }, [db]);
  
  const { data: products, loading } = useCollection<any>(arrivalsQuery);

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

  return (
    <section className="md:hidden relative">
      <div className="px-4 py-8">
        <div className="bg-[#F8F2FF] rounded-[24px] p-6 shadow-sm overflow-hidden min-h-[300px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0">
                 <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                    <path 
                      d="M50 15 C60 15 65 25 65 35 C75 35 85 40 85 50 C85 60 75 65 65 65 C65 75 60 85 50 85 C40 85 35 75 35 65 C25 65 15 60 15 50 C15 40 25 35 35 35 C35 25 40 15 50 15 Z" 
                      fill="#34D399" 
                    />
                    <circle cx="50" cy="50" r="10" fill="#F59E0B" />
                 </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#7E22CE] tracking-tight">
                {cms?.title || "New Arrivals"}
              </h2>
            </div>
            <Link href="/shop/new/new-collection" className="text-xs font-black text-[#7E22CE] uppercase tracking-widest">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-purple-400" /></div>
          ) : products && products.length > 0 ? (
            <>
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-2">
                  {products.map((p: any) => (
                    <div key={p.id} className="flex-[0_0_calc((100%-16px)/3)] min-w-0">
                      <Link href={`/product/${p.id}`} className="block h-full">
                        <div className="bg-white rounded-[16px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] h-full flex flex-col border border-purple-50/50">
                          <div className="relative aspect-[4/5] w-full bg-slate-50">
                            <Image 
                              src={p.image} 
                              alt={p.name} 
                              fill 
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="p-2 space-y-1.5 flex-1 flex flex-col justify-between">
                            <h3 className="text-[10px] font-bold text-slate-800 leading-tight line-clamp-2">
                              {p.name}
                            </h3>
                            <p className="text-[12px] font-black text-[#7E22CE]">
                              ₹{p.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-8">
                {scrollSnaps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      selectedIndex === i ? "w-6 bg-[#06B6D4]" : "w-2 bg-[#E2E8F0]"
                    )}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10 italic text-purple-300 text-xs font-bold uppercase tracking-widest">
              Fresh arrivals loading...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
