"use client";

import { use, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { KidsDecor } from '@/components/kids-decor';
import { FilterSidebar } from '@/components/shop/filter-sidebar';
import { ShopContent } from '@/components/shop/shop-content';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { RelatedProducts } from '@/components/shop/related-products';

interface CategoryPageProps {
  params: Promise<{
    categoryName: string;
  }>;
}

export default function CategoryLandingPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const category = resolvedParams.categoryName;
  const pageTitle = category.replace(/-/g, ' ').toUpperCase();

  return (
    <main className="min-h-screen bg-white relative overflow-x-hidden">
      <Navbar />
      <KidsDecor />
      
      <div className="pt-28 lg:pt-36">
        <div className="container mx-auto px-4 py-8 text-center flex flex-col items-center border-b border-slate-50">
          <h1 className="text-3xl md:text-5xl font-headline font-black tracking-tight text-slate-800 uppercase">
            {pageTitle}
          </h1>
          <p className="text-[10px] md:text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest italic opacity-80">
            Discover our curated {pageTitle.toLowerCase()} collection.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterSidebar category={category} />
          </aside>

          {/* Mobile Filter Sheet */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-8 overflow-y-auto bg-white border-none rounded-r-[3rem] shadow-2xl">
              <SheetHeader className="sr-only">
                <SheetTitle>Shop Filters</SheetTitle>
              </SheetHeader>
              <FilterSidebar category={category} />
            </SheetContent>
          </Sheet>

          {/* Main Content Area */}
          <div className="flex-1">
            <ShopContent 
              category={category} 
              onOpenFilters={() => setIsFilterOpen(true)} 
            />
          </div>
        </div>
      </div>

      <RelatedProducts currentProductId="none" category={category} />
      
      <Footer />
    </main>
  );
}
