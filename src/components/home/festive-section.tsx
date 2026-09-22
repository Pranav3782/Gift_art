"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { useMemo } from 'react';

interface FestiveSectionProps {
  cms?: {
    title?: string;
    bannerUrl?: string;
    cards?: Array<{
      title: string;
      imageUrl: string;
      url: string;
      isActive?: boolean;
    }>;
  };
}

const DEFAULT_BANNER = "https://res.cloudinary.com/dwgnnr10/image/upload/v1785341862/festive-section-image-_zy2mxi.png";

export function FestiveSection({ cms }: FestiveSectionProps) {
  const db = useFirestore();
  
  const festiveQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'products'),
      where('category', '==', 'new'),
      where('subcategory', '==', 'festive'),
      limit(3)
    );
  }, [db]);

  const { data: products, loading } = useCollection<any>(festiveQuery);

  const bannerUrl = cms?.bannerUrl || DEFAULT_BANNER;
  const sectionTitle = cms?.title || "Celebration Gifts Collection";

  return (
    <section className="hidden md:block bg-white py-12 overflow-hidden relative">
      <div className="container mx-auto px-4 mb-10 text-center space-y-3">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border border-amber-100"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Festive Magic</span>
        </motion.div>
        <h2 className="text-5xl md:text-7xl font-headline font-black text-slate-800 tracking-tight leading-tight">
          {sectionTitle}
        </h2>
      </div>

      <div 
        className="relative w-full h-[600px] transition-all duration-700 brightness-95"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)), url('${bannerUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="relative -mt-16 z-20 flex flex-col md:flex-row items-stretch justify-center gap-8 lg:gap-12 max-w-6xl mx-auto">
          {loading ? (
            <div className="w-full py-20 flex justify-center bg-white/80 backdrop-blur-md rounded-[3rem] shadow-xl">
              <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
            </div>
          ) : products && products.length > 0 ? (
            products.map((p: any, i: number) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -15 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, type: 'spring' }}
                className="w-full md:flex-1 bg-[#EA580C] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col group cursor-pointer"
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
                  
                  {/* Product Info Area - Dark Orange background bottom patch */}
                  <div className="p-8 pt-7 pb-10 flex-1 flex flex-col items-center text-center space-y-6">
                     <h3 className="font-black text-white text-base lg:text-[17px] leading-snug tracking-tight line-clamp-2 min-h-[3rem]">
                       {p.name}
                     </h3>
                     <div className="flex items-center justify-center w-32 h-7 md:h-9 bg-[#FF69B4] rounded-full shadow-lg shadow-black/5 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 text-white font-black text-[10px] md:text-[12px] uppercase tracking-widest">
                       BUY NOW
                     </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="w-full py-16 text-center bg-white/80 backdrop-blur-md rounded-[3rem] border-4 border-dashed border-amber-100">
               <p className="text-amber-600 font-black uppercase tracking-widest text-xs italic">Magical festive collection arriving soon...</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 text-center">
         <Button asChild variant="outline" className="rounded-full border-2 border-slate-100 text-slate-400 hover:text-sky-600 hover:bg-sky-50 px-12 h-16 font-black uppercase text-xs tracking-widest gap-3 transition-all">
           <Link href="/shop/new/festive">View Entire Collection <ArrowRight className="h-4 w-4" /></Link>
         </Button>
      </div>
    </section>
  );
}
