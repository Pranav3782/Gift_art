'use client';

import { use, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { KidsDecor } from '@/components/kids-decor';
import { FilterSidebar } from '@/components/shop/filter-sidebar';
import { ShopContent } from '@/components/shop/shop-content';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { RelatedProducts } from '@/components/shop/related-products';

interface ShopPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default function CatalogPage({ params }: ShopPageProps) {
  const resolvedParams = use(params);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const category = resolvedParams.slug[0];
  const subcategory = resolvedParams.slug[1];

  const pageTitle = subcategory 
    ? subcategory.replace(/-/g, ' ').toUpperCase() 
    : category.replace(/-/g, ' ').toUpperCase();

  return (
    <main className="min-h-screen bg-white relative overflow-x-hidden">
      <Navbar />
      <KidsDecor />
      
      <div className="pt-32 md:pt-36 lg:pt-44">
        <div className="container mx-auto px-4 py-4 md:py-6 text-center flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-headline font-black tracking-tight text-slate-800 uppercase">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterSidebar category={category} />
          </aside>

          {/* Filter Sheet for Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetContent side="left" className="w-[320px] sm:w-[400px] p-6 sm:p-8 overflow-y-auto bg-white border-none rounded-r-[2.5rem] shadow-2xl">
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
              subcategory={subcategory} 
              onOpenFilters={() => setIsFilterOpen(true)} 
            />
          </div>
        </div>
      </div>

      <RelatedProducts currentProductId="none" category={category} />
    </main>
  );
}
