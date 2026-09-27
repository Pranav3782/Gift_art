'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search, Eye, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductQuickView } from './product-quick-view';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

interface ShopContentProps {
  category?: string;
  subcategory?: string;
  onOpenFilters: () => void;
}

export function ShopContent({ category, subcategory, onOpenFilters }: ShopContentProps) {
  const [searchQuery, setSearchBar] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  const db = useFirestore();
  const searchParams = useSearchParams();

  const sort = searchParams.get('sort') || 'featured';
  const itemsPerPage = searchParams.get('itemsPerPage') || 'all';

  // Safe memoization of collection reference
  const productsCol = useMemo(() => db ? collection(db, 'products') : null, [db]);

  // Fetch all products from Firestore
  const { data: allProducts, loading } = useCollection<any>(productsCol);

  // Filter Logic applied to live Firestore data
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    let result = [...allProducts];
    
    // 1. Path filtering
    if (category && category !== 'new') {
      result = result.filter(p => 
        p.category?.toLowerCase() === category.toLowerCase() || 
        p.categoryId === category
      );
    }
    
    if (subcategory) {
      if (category === 'new') {
        if (subcategory === 'best-sellers') {
          result = result.filter(p => p.isBestSeller === true || p.subcategory === 'best-sellers');
        } else if (subcategory === 'new-collection') {
          result = result.filter(p => p.subcategory === 'new-collection');
        } else if (subcategory === 'new-launch') {
          result = result.filter(p => p.subcategory === 'new-launch');
        } else if (subcategory === 'festive') {
          result = result.filter(p => p.subcategory === 'festive');
        } else {
          result = result.filter(p => p.subcategory?.toLowerCase() === subcategory.toLowerCase());
        }
      } else {
        result = result.filter(p => p.subcategory?.toLowerCase() === subcategory.toLowerCase());
      }
    }
    
    // 2. URL Search Params filtering
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 10000;
    const rating = Number(searchParams.get('rating')) || 0;
    
    result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);
    if (rating > 0) result = result.filter(p => p.rating >= rating);

    // 3. Search query filtering
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 4. Sorting
    if (sort === 'low-high') result.sort((a, b) => a.price - b.price);
    if (sort === 'high-low') result.sort((a, b) => b.price - a.price);
    if (sort === 'newest' || sort === 'date-new') result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
    if (sort === 'date-old') result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? 1 : -1));
    if (sort === 'alpha-asc') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'alpha-desc') result.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === 'best-selling') result.sort((a, b) => (a.isBestSeller === b.isBestSeller ? 0 : a.isBestSeller ? -1 : 1));
    
    return result;
  }, [allProducts, category, subcategory, searchQuery, sort, searchParams]);

  // Slices items per page dynamically
  const displayedProducts = useMemo(() => {
    const limitNum = itemsPerPage === 'all' ? filteredProducts.length : Number(itemsPerPage);
    return filteredProducts.slice(0, limitNum);
  }, [filteredProducts, itemsPerPage]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Opening Studio Catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls Top Bar (Search Icon + Filter Icon ONLY) */}
      <div className="flex items-center gap-3 w-full">
        {/* Search Bar with Search Icon */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchBar(e.target.value)}
            className="w-full bg-white border border-slate-200 h-11 pl-11 pr-4 rounded-xl text-sm font-bold focus:outline-none focus:border-sky-500 shadow-sm transition-all"
          />
        </div>

        {/* Filter Button with Filter Icon */}
        <Button 
          variant="outline" 
          className="h-11 px-5 rounded-xl border-slate-200 bg-white font-black text-xs uppercase tracking-widest gap-2 flex items-center shrink-0 shadow-sm hover:bg-sky-50 hover:text-sky-600 hover:border-sky-300 transition-all"
          onClick={onOpenFilters}
        >
          <SlidersHorizontal className="h-4 w-4 text-sky-500" /> Filter
        </Button>
      </div>

      {/* Grid Content: Bags / Products listed out right from top */}
      <AnimatePresence mode="wait">
        {displayedProducts.length > 0 ? (
          <motion.div 
            key={`${category}-${subcategory}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border-4 border-dashed border-slate-50">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search className="h-8 w-8" />
             </div>
             <h2 className="text-xl font-black text-slate-800">No Products Found</h2>
             <p className="text-slate-400 font-medium text-xs mt-1">Try adjusting your search terms or filters.</p>
             <Button 
              variant="link" 
              asChild
              className="mt-4 text-sky-600 font-black uppercase tracking-widest text-[10px]"
             >
               <Link href={category ? `/category/${category}` : '/collections'}>Clear All Filters</Link>
             </Button>
          </div>
        )}
      </AnimatePresence>

      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
