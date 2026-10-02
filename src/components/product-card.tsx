"use client";

import Image from 'next/image';
import Link from 'next/link';
import { memo, useState, useEffect, MouseEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/lib/types';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const { user } = useUser();
  const db = useFirestore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistDocId, setWishlistDocId] = useState<string | null>(null);

  // Check if item is in wishlist on load
  useEffect(() => {
    async function checkWishlist() {
      if (!user) {
        const savedWishlist = localStorage.getItem('giftart_wishlist');
        if (savedWishlist && product.id) {
          try {
            const items = JSON.parse(savedWishlist);
            const found = items.find((item: any) => item.productId === product.id);
            if (found) {
              setIsWishlisted(true);
              setWishlistDocId(found.id);
            } else {
              setIsWishlisted(false);
              setWishlistDocId(null);
            }
          } catch (e) {
            console.error('Failed to parse guest wishlist', e);
          }
        } else {
          setIsWishlisted(false);
          setWishlistDocId(null);
        }
        return;
      }

      if (!db || !product.id) return;
      try {
        const q = query(
          collection(db, 'wishlist'),
          where('userId', '==', user.uid),
          where('productId', '==', product.id)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setIsWishlisted(true);
          setWishlistDocId(snapshot.docs[0].id);
        } else {
          setIsWishlisted(false);
          setWishlistDocId(null);
        }
      } catch (err) {
        console.error("Error checking wishlist: ", err);
      }
    }
    checkWishlist();
  }, [db, user, product.id]);

  const handleToggleWishlist = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      try {
        const savedWishlist = localStorage.getItem('giftart_wishlist') || '[]';
        let items = JSON.parse(savedWishlist);
        const index = items.findIndex((item: any) => item.productId === product.id);

        if (index > -1) {
          items.splice(index, 1);
          localStorage.setItem('giftart_wishlist', JSON.stringify(items));
          setIsWishlisted(false);
          setWishlistDocId(null);
          toast({
            title: "Removed from Wishlist",
            description: `${product.name} removed from wishlist.`
          });
        } else {
          const newId = `local_${Date.now()}`;
          const newItem = {
            id: newId,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            addedAt: new Date().toISOString()
          };
          items.push(newItem);
          localStorage.setItem('giftart_wishlist', JSON.stringify(items));
          setIsWishlisted(true);
          setWishlistDocId(newId);
          toast({
            title: "Added to Wishlist",
            description: `${product.name} saved in wishlist.`
          });
        }
      } catch (err) {
        console.error("Error toggling guest wishlist: ", err);
      }
      return;
    }

    if (!db) return;

    try {
      if (isWishlisted && wishlistDocId) {
        await deleteDoc(doc(db, 'wishlist', wishlistDocId));
        setIsWishlisted(false);
        setWishlistDocId(null);
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} removed from your wishlist.`
        });
      } else {
        const newDoc = await addDoc(collection(db, 'wishlist'), {
          userId: user.uid,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          addedAt: new Date()
        });
        setIsWishlisted(true);
        setWishlistDocId(newDoc.id);
        toast({
          title: "Added to Wishlist",
          description: `${product.name} saved in your wishlist.`
        });
      }
    } catch (err) {
      console.error("Error toggling wishlist: ", err);
    }
  };

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast({
      title: "Added to Bag!",
      description: `${product.name} is ready for you.`
    });
  };

  const handleBuyNow = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    router.push('/checkout');
  };

  return (
    <Link href={`/product/${product.id}`} className="block h-full group">
      <Card className="relative h-full overflow-hidden bg-white border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[1.8rem] flex flex-col justify-between">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            data-ai-hint={product.imageHint}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            unoptimized
          />
          
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          {product.isBestSeller && (
            <div className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md shadow-sm z-10 uppercase tracking-widest">
              BEST SELLER
            </div>
          )}
          {product.isNew && !product.isBestSeller && (
            <div className="absolute top-2.5 left-2.5 bg-sky-600 text-white text-[8px] font-black px-2 py-0.5 rounded-md shadow-sm z-10 uppercase tracking-widest">
              NEW
            </div>
          )}

          {/* Favourite Heart Icon Button (Always visible on mobile & desktop) */}
          <button
            onClick={handleToggleWishlist}
            className={cn(
              "absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md",
              isWishlisted
                ? "bg-rose-50 text-rose-500 border border-rose-200"
                : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-white/40"
            )}
            aria-label="Toggle Favourite"
          >
            <Heart className={cn("h-4 w-4 transition-colors", isWishlisted && "fill-rose-500 text-rose-500")} />
          </button>
        </div>

        {/* Content Section */}
        <CardContent className="p-3.5 sm:p-4 space-y-2.5 bg-white relative flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="font-black text-xs sm:text-sm text-slate-800 leading-tight line-clamp-2 group-hover:text-sky-600 transition-colors">
              {product.name}
            </h4>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-slate-900">₹{product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <span className="text-[11px] text-slate-300 line-through font-bold">₹{product.oldPrice.toLocaleString()}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-black text-slate-400">{(product.rating ?? 5.0).toFixed(1)}</span>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now (Optimized & Compact for Mobile & Desktop) */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              onClick={handleAddToCart}
              className="flex-1 h-8 rounded-lg bg-purple-200 hover:bg-purple-300 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all px-1"
              title="Add to Cart"
            >
              <ShoppingCart className="h-3 w-3 text-black" />
              <span className="text-black">Add</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 h-8 rounded-lg bg-[#B57CFF] hover:bg-[#a163fa] text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider flex items-center justify-center gap-0.5 shadow-sm shadow-purple-500/20 active:scale-95 transition-all px-1"
              title="Buy Now"
            >
              <span>Buy Now</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";
