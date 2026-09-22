'use client';

import { useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const db = useFirestore();
  
  // SSR-safe query memoization
  const relatedQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'products'), 
      where('category', '==', category),
      limit(5)
    );
  }, [db, category]);
  
  const { data: products, loading } = useCollection<any>(relatedQuery);
  const related = products?.filter(p => p.id !== currentProductId).slice(0, 4);

  if (loading) return null;
  if (!related || related.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50/50 overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-slate-100 mb-2 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-sky-500" />
            <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Handpicked Magic</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-headline font-black text-slate-800 tracking-tight">
            You May Also <span className="text-sky-600 italic">Love</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
          {related.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
