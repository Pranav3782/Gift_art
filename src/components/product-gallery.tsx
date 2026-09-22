"use client";

import { useMemo } from 'react';
import { ProductCard } from './product-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, limit, query } from 'firebase/firestore';
import Link from 'next/link';

interface ProductGalleryProps {
  title?: string;
  subtitle?: string;
}

export function ProductGallery({ 
  title = "Our Bestsellers", 
  subtitle = "Handpicked favorites loved by little explorers." 
}: ProductGalleryProps) {
  const db = useFirestore();
  
  // Safe memoization for SSR
  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), limit(12));
  }, [db]);

  const { data: products, loading } = useCollection<any>(productsQuery);
  const displayProducts = products?.slice(0, 8);

  return (
    <section id="gallery" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 rounded-full text-[10px] font-black text-sky-600 uppercase tracking-[0.2em] mb-2">
              <Sparkles className="h-3 w-3" /> Popular Picks
            </div>
            <h2 className="text-3xl md:text-5xl font-headline font-extrabold flex items-center justify-center md:justify-start gap-4 text-slate-800 tracking-tight">
              {title.split(' ').map((word, i) => (
                <span key={i} className={i === title.split(' ').length - 1 ? "text-sky-600 italic" : ""}>{word} </span>
              ))}
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-lg">{subtitle}</p>
          </div>
          <Button asChild variant="outline" className="rounded-full border-2 border-sky-100 text-sky-600 hover:bg-sky-50 px-8 py-6 h-auto text-sm font-black uppercase tracking-widest">
             <Link href="/collections">View All Collection</Link>
          </Button>
        </div>

        <div className="relative group/gallery">
          {/* Scroll Navigation */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-sky-600 opacity-0 group-hover/gallery:opacity-100 transition-all hover:scale-110 hidden lg:flex border border-sky-50">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-sky-600 opacity-0 group-hover/gallery:opacity-100 transition-all hover:scale-110 hidden lg:flex border border-sky-50">
            <ChevronRight className="h-6 w-6" />
          </button>

          {loading ? (
             <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-sky-500" /></div>
          ) : displayProducts && displayProducts.length > 0 ? (
            <div className="flex gap-6 md:gap-10 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {displayProducts.map(product => (
                <div key={product.id} className="w-[280px] md:w-[320px] flex-shrink-0 transition-all hover:-translate-y-3 duration-500">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-300 italic uppercase tracking-widest font-black text-sm border-2 border-dashed border-slate-50 rounded-[3rem]">
              The catalog is currently being handcrafted...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}