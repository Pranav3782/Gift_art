
'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { LayoutGrid, List, SlidersHorizontal, Search, Package, Eye, Heart, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/store/cart-context';
import { useToast } from '@/hooks/use-toast';
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
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('featured');
  const [itemsPerPage, setItemsPerPage] = useState('20');
  const [searchQuery, setSearchBar] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  const db = useFirestore();
  const searchParams = useSearchParams();

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
      // Special logic for "new" collection landing pages
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
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Opening Studio Catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search & Tool Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search in this collection..."
            value={searchQuery}
            onChange={(e) => setSearchBar(e.target.value)}
            className="w-full bg-white border border-slate-100 h-12 pl-12 pr-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500/50 shadow-sm transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Button 
            variant="outline" 
            size="sm" 
            className="lg:hidden h-12 rounded-xl border-slate-100 bg-white font-black text-[10px] uppercase tracking-widest gap-2"
            onClick={onOpenFilters}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
          </Button>

          {/* Items Per Page Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider whitespace-nowrap">
              ITEMS PER PAGE
            </span>
            <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
              <SelectTrigger className="w-[80px] h-12 rounded-2xl border-slate-100 bg-white font-bold text-xs shadow-sm">
                <SelectValue placeholder="20" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100">
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="36">36</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Sort By Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider whitespace-nowrap">
              SORT BY
            </span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px] h-12 rounded-2xl border-slate-100 bg-white font-bold text-xs shadow-sm">
                <SelectValue placeholder="Best selling" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100">
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="best-selling">Best selling</SelectItem>
                <SelectItem value="alpha-asc">Alphabetically, A-Z</SelectItem>
                <SelectItem value="alpha-desc">Alphabetically, Z-A</SelectItem>
                <SelectItem value="low-high">Price, low to high</SelectItem>
                <SelectItem value="high-low">Price, high to low</SelectItem>
                <SelectItem value="date-new">Date, new to old</SelectItem>
                <SelectItem value="date-old">Date, old to new</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1 border border-slate-100 rounded-2xl p-1 bg-white shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-10 w-10 rounded-xl transition-all", view === 'grid' ? "bg-sky-50 text-sky-600 shadow-inner" : "text-slate-300")}
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-10 w-10 rounded-xl transition-all", view === 'list' ? "bg-sky-50 text-sky-600 shadow-inner" : "text-slate-300")}
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
         <Package className="h-4 w-4 text-slate-300" />
         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
           Displaying <span className="text-slate-800">{filteredProducts.length}</span> Magical Handcrafted Items
         </p>
      </div>

      {/* Grid Content */}
      <AnimatePresence mode="wait">
        {displayedProducts.length > 0 ? (
          <motion.div 
            key={`${category}-${subcategory}-${view}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "grid gap-8",
              view === 'grid' ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            )}
          >
            {displayedProducts.map((product) => (
              <div key={product.id} className="group relative">
                {view === 'grid' ? (
                  <div className="relative">
                    <ProductCard product={product} />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-20">
                       <Button 
                        size="icon" 
                        variant="secondary" 
                        className="w-10 h-10 rounded-full shadow-xl bg-white hover:bg-sky-50 hover:text-sky-600"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQuickViewProduct(product);
                        }}
                       >
                         <Eye className="h-4 w-4" />
                       </Button>
                       <Button 
                        size="icon" 
                        variant="secondary" 
                        className="w-10 h-10 rounded-full shadow-xl bg-white hover:bg-rose-50 hover:text-rose-500"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                       >
                         <Heart className="h-4 w-4" />
                       </Button>
                    </div>
                    <div className="absolute bottom-32 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                       <Button 
                        asChild
                        className="w-full bg-slate-900/90 backdrop-blur-md hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl h-11"
                       >
                         <Link href={`/product/${product.id}`}>
                           Buy Now
                         </Link>
                       </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-500">
                    <div className="relative w-full sm:w-72 aspect-square flex-shrink-0 bg-slate-50 overflow-hidden">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                      {product.isBestSeller && <span className="absolute top-6 left-6 bg-amber-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">BEST SELLER</span>}
                    </div>
                    <div className="p-8 flex flex-col justify-center flex-1 space-y-4">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-sky-500 uppercase tracking-[0.25em] leading-none">{product.category} • {product.subcategory}</div>
                        <h3 className="text-2xl font-headline font-black text-slate-800 group-hover:text-sky-600 transition-colors leading-tight">{product.name}</h3>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-black text-slate-800">₹{product.price.toLocaleString()}</span>
                        {product.oldPrice && <span className="text-lg text-slate-300 line-through font-bold">₹{product.oldPrice.toLocaleString()}</span>}
                      </div>

                      <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl italic line-clamp-2">"{product.description}"</p>
                      
                      <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-1.5">
                           <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn("h-3.5 w-3.5", i < Math.floor(product.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-100')} />
                            ))}
                          </div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">({product.reviews || 0} Reviews)</span>
                        </div>
                        <div className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full", product.inventoryStatus === 'In Stock' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                          {product.inventoryStatus}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button 
                          asChild
                          className="bg-sky-600 hover:bg-sky-700 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl px-10 h-14 shadow-xl shadow-sky-100"
                        >
                          <Link href={`/product/${product.id}`}>
                             Buy Now
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setQuickViewProduct(product)}
                          className="rounded-2xl border-2 border-slate-100 text-slate-400 hover:bg-slate-50 font-black text-[11px] uppercase tracking-[0.2em] px-8 h-14"
                        >
                          <Eye className="h-4 w-4 mr-2" /> Quick View
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Search className="h-10 w-10" />
             </div>
             <h2 className="text-2xl font-black text-slate-800">No Magic Found</h2>
             <p className="text-slate-400 font-medium mt-2">Try adjusting your filters or search terms.</p>
             <Button 
              variant="link" 
              asChild
              className="mt-6 text-sky-600 font-black uppercase tracking-widest text-[10px]"
             >
               <Link href={category ? `/shop/${category}` : '/shop/new/new-collection'}>Clear All Filters</Link>
             </Button>
          </div>
        )}
      </AnimatePresence>

      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
