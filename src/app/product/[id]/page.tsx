'use client';

import { use, useMemo } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { KidsDecor } from '@/components/kids-decor';
import { ProductDetails } from '@/components/shop/product-details';
import { RelatedProducts } from '@/components/shop/related-products';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const db = useFirestore();
  
  const productRef = useMemo(() => db ? doc(db, 'products', resolvedParams.id) : null, [db, resolvedParams.id]);
  const { data: product, loading } = useDoc<any>(productRef);

  return (
    <main className="min-h-screen bg-white relative overflow-x-hidden">
      <Navbar />
      <KidsDecor />

      <div className="pt-28 md:pt-36 lg:pt-40 pb-24 relative z-10">
        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Opening the Magic Box...</p>
          </div>
        ) : product ? (
          <>
            <ProductDetails product={product} />
            <div className="mt-20">
              <RelatedProducts currentProductId={product.id} category={product.category} />
            </div>
          </>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
               <AlertCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
               <h2 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">Product Not Found</h2>
               <p className="text-slate-400 font-medium max-w-xs mx-auto">This treasure seems to have vanished from our studio.</p>
            </div>
            <Button asChild className="rounded-full bg-sky-600 px-10 h-14">
               <Link href="/collections" className="flex items-center gap-2"><ShoppingBag className="h-5 w-5" /> Shop Other Gifts</Link>
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
