"use client";

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/lib/types';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

// Memoized ProductCard to prevent re-renders when parent slider updates.
// Optimized Next.js Image with accurate sizes for better responsive loading.
export const ProductCard = memo(({ product }: ProductCardProps) => {
  return (
    <Link href={`/product/${product.id}`} className="block h-full group">
      <Card className="relative h-full overflow-hidden bg-white border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem]">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            data-ai-hint={product.imageHint}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          {product.isBestSeller && (
            <div className="absolute top-3 left-3 bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg z-10 uppercase tracking-widest">
              BEST SELLER
            </div>
          )}
          {product.isNew && !product.isBestSeller && (
            <div className="absolute top-3 left-3 bg-sky-600 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg z-10 uppercase tracking-widest">
              NEW
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-5 space-y-3 bg-white relative">
          <div className="space-y-1">
            <h4 className="font-black text-sm text-slate-800 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h4>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black text-slate-800">₹{product.price.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-black text-slate-400">{(product.rating ?? 5.0).toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";
