'use client';

import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Product } from '@/lib/types';
import { ProductDetails } from './product-details';
import { X } from 'lucide-react';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-0 overflow-y-auto max-h-[90vh] rounded-[3rem] border-none shadow-2xl bg-white scrollbar-hide">
        <DialogTitle className="sr-only">Quick View: {product.name}</DialogTitle>
        <DialogDescription className="sr-only">View product highlights and add to bag</DialogDescription>
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute right-8 top-8 z-[60] w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all shadow-xl hover:scale-110 active:scale-95 border border-slate-100"
          >
            <X className="h-6 w-6 text-slate-800" />
          </button>
          <div className="p-2 md:p-6 lg:p-8">
            <ProductDetails product={product} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
