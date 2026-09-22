'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useCart } from '@/lib/store/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Heart, Trash2, ShoppingCart, Loader2, Gift, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function WishlistPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const wishlistQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'wishlist'), where('userId', '==', user.uid));
  }, [db, user]);

  const { data: wishlistItems, loading } = useCollection<any>(wishlistQuery);

  const handleRemove = async (docId: string, name: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'wishlist', docId));
      toast({
        title: "Removed from Wishlist",
        description: `${name} has been removed.`
      });
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast({
        title: "Error",
        description: "Could not remove item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      rating: 5.0,
      reviews: 0,
      category: '',
      subcategory: '',
      description: '',
      inventoryStatus: 'In Stock',
      images: [item.image],
      imageHint: ''
    }, 1);
    toast({
      title: "Added to Bag!",
      description: `${item.name} is ready for checkout.`
    });
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Opening your wishlist...</p>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 md:p-16 text-center space-y-8 max-w-2xl mx-auto">
        <div className="w-24 h-24 rounded-full bg-rose-50 border-2 border-dashed border-rose-200 flex items-center justify-center text-rose-400 mx-auto">
          <Heart className="h-10 w-10 fill-rose-100" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">Your Wishlist is Empty</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">Save your favorite magical treasures here to check back on them later.</p>
        </div>

        <Button asChild className="rounded-full bg-sky-600 hover:bg-sky-500 px-10 h-14 font-black uppercase text-xs tracking-widest gap-2">
          <Link href="/collections">
            Explore Magical Gifts <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-100">
          <Heart className="h-6 w-6 fill-rose-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-black text-slate-800 tracking-tight">My Wishlist</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {wishlistItems.map((item: any) => (
          <Card key={item.id} className="relative overflow-hidden bg-white border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] flex flex-col h-full group">
            {/* Image section */}
            <div className="relative aspect-square overflow-hidden bg-slate-50 shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                unoptimized
              />
              <button 
                onClick={() => handleRemove(item.id, item.name)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-sm z-10"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Content section */}
            <CardContent className="p-4 md:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
              <div className="space-y-1">
                <h4 className="font-black text-xs md:text-sm text-slate-800 leading-tight line-clamp-2 hover:text-sky-600 transition-colors">
                  {item.name}
                </h4>
              </div>

              <div className="space-y-3">
                <span className="text-sm md:text-base font-black text-slate-800 block">₹{item.price.toLocaleString()}</span>
                <Button 
                  onClick={() => handleAddToCart(item)}
                  className="w-full h-10 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 font-bold text-xs tracking-wide gap-2 border border-sky-100"
                >
                  <ShoppingCart className="h-3.5 w-3.5" /> Add to Bag
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
