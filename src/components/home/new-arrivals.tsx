
"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { useMemo } from 'react';

interface NewArrivalsProps {
  cms?: {
    title?: string;
    cards?: Array<{
      title: string;
      imageUrl: string;
      url: string;
    }>;
  };
}

export function NewArrivals({ cms }: NewArrivalsProps) {
  const db = useFirestore();
  
  const arrivalsQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'products'),
      where('isNew', '==', true),
      limit(3)
    );
  }, [db]);

  const { data: products, loading } = useCollection<any>(arrivalsQuery);
  const title = cms?.title || "New Arrivals";

  const bgImage = "https://rohanwakkar.sirv.com/GiftArtStudio%202/website%20required%20shapes/website%20required%20shapes/new-arrivals-sectoon-background.png";

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Custom Background Image - Wraps only Header and Cards to control height and shadow stretching */}
      <div 
        className="relative pt-16 pb-24 md:pt-24 md:pb-36 bg-no-repeat z-10"
        style={{ 
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center center'
        }}
      >
        <div className="container mx-auto px-6 relative z-10">
          <header className="text-center mb-12 space-y-3">
            <h2 className="text-4xl md:text-6xl font-headline font-black text-[#9333EA] tracking-tight">
              {title}
            </h2>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-pink-500" /></div>
          ) : products && products.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 max-w-7xl mx-auto pb-12">
              {products.map((p: any, i: number) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ 
                    opacity: 1, 
                    // Precise alignment with background shadows
                    y: i === 1 ? 50 : 10, 
                    rotate: i === 0 ? -1 : i === 2 ? 1 : 0, 
                    scale: i === 1 ? 1.1 : 1 
                  }}
                  whileHover={{ scale: (i === 1 ? 1.1 : 1) + 0.02, rotate: 0, y: (i === 1 ? 50 : 10) - 10 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className={cn(
                    "w-full md:w-[28%] bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl relative group cursor-pointer border-4 border-white/80",
                    i === 1 && "z-20 md:w-[30%]"
                  )}
                >
                  {/* Decorative Flower Shape 1 (Blue) overlapping top-left of Card 1 */}
                  {i === 0 && (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-16 -left-16 w-32 h-32 md:w-44 md:h-44 opacity-100 z-30 hidden md:block pointer-events-none"
                    >
                       <Image src="https://rohanwakkar.sirv.com/GiftArtStudio%202/website%20required%20shapes/website%20required%20shapes/flower-element-2.png" alt="" fill className="object-contain" />
                    </motion.div>
                  )}

                  {/* Decorative Flower Shape 2 (Yellow) overlapping bottom-right of Card 3 */}
                  {i === 2 && (
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute -bottom-20 -right-20 w-36 h-36 md:w-48 md:h-48 opacity-100 z-30 hidden md:block pointer-events-none"
                    >
                       <Image src="https://rohanwakkar.sirv.com/GiftArtStudio%202/website%20required%20shapes/website%20required%20shapes/flower-element-1.png" alt="" fill className="object-contain" />
                    </motion.div>
                  )}

                  <Link href={`/product/${p.id}`} className="block h-full rounded-[2.2rem] md:rounded-[3.2rem] overflow-hidden">
                    <div className="aspect-square w-full bg-slate-50 overflow-hidden relative">
                      <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" unoptimized />
                    </div>
                    
                    <div className="bg-white p-6 md:p-8 space-y-4 flex flex-col items-center text-center">
                      <h3 className="font-black text-slate-800 text-sm md:text-lg leading-tight tracking-tight line-clamp-2 min-h-[2.5rem]">
                        {p.name}
                      </h3>
                      <div className="flex items-center justify-center w-28 md:w-36 h-7 md:h-9 bg-[#A78BFA] rounded-full shadow-lg shadow-[#A78BFA]/20 group-hover:bg-[#8B5CF6] transition-colors duration-300 text-white font-black text-[10px] md:text-[12px] uppercase tracking-widest">
                        BUY NOW
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 font-black uppercase tracking-widest text-xs italic">
              New collection coming soon...
            </div>
          )}
        </div>
      </div>

      {/* View All Collection Button - positioned below the pink background patch */}
      <div className="pt-8 pb-16 text-center bg-white relative z-20">
        <Link href="/shop/new/new-collection" className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px] group transition-all bg-[#9333EA] hover:bg-[#7E22CE] px-10 py-5 rounded-full shadow-2xl">
          View All Collection <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
