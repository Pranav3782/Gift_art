"use client";

import React, { useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ProductCard } from '@/components/product-card';
import { ChevronLeft, ChevronRight, Rocket, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';

export function TrendingCarousel() {
  const db = useFirestore();
  
  // Safe memoization for SSR
  const trendingQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), limit(8));
  }, [db]);

  const { data: trendingProducts, loading } = useCollection<any>(trendingQuery);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    loop: true
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Floating Rockets */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [-45, -40, -45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-16 h-16 text-sky-100 opacity-40 pointer-events-none"
      >
        <Rocket className="w-full h-full" />
      </motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8"
        >
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="h-3.5 w-3.5" /> Popular Right Now
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-black text-slate-800 tracking-tight leading-tight">
              Trending <span className="text-sky-600 italic relative inline-block">
                This Week
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-sky-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-lg">
              Most loved by parents and gift shoppers this season. Handpicked for quality and joy.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={scrollPrev}
              variant="outline" 
              size="icon" 
              className="w-14 h-14 rounded-2xl border-2 border-slate-100 hover:border-sky-500 hover:text-sky-500 transition-all bg-white shadow-sm active:scale-95"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button 
              onClick={scrollNext}
              variant="outline" 
              size="icon" 
              className="w-14 h-14 rounded-2xl border-2 border-slate-100 hover:border-sky-500 hover:text-sky-500 transition-all bg-white shadow-sm active:scale-95"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="py-24 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-sky-500" /></div>
        ) : trendingProducts && trendingProducts.length > 0 ? (
          <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
            <div className="flex gap-6 md:gap-10">
              {trendingProducts.map((product: any, i: number) => (
                <motion.div 
                  key={product.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-[0_0_280px] md:flex-[0_0_340px] min-w-0"
                >
                  <div className="transition-transform hover:-translate-y-4 duration-500">
                    <ProductCard product={product} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-24 text-center border-4 border-dashed border-slate-50 rounded-[3rem]">
            <p className="text-slate-300 font-black uppercase tracking-widest text-sm">Waiting for the magic to arrive...</p>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Button asChild size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-12 py-8 h-auto font-black uppercase tracking-widest gap-3 shadow-xl active:scale-95 group">
            <Link href="/customization">
              Start Customizing <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}