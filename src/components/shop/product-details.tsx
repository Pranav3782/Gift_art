'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Plus, 
  Minus, 
  Wand2, 
  CheckCircle2, 
  Loader2, 
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/lib/store/cart-context';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [personalizationName, setPersonalizationName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  const { toast } = useToast();
  const { addToCart } = useCart();
  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

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

  const handleToggleWishlist = async () => {
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
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const galleryImages = useMemo(() => {
    const list = (product.images?.length ? product.images : [product.image]).filter(Boolean);
    if (!list.length) return ['https://placehold.co/800'];
    return list;
  }, [product]);

  const isValidPrice = typeof product.price === 'number' && !isNaN(product.price);

  const handleAddToCart = () => {
    if (!isValidPrice) return;
    addToCart(product, quantity, { personalizationName });
    toast({ title: "Added to Bag!", description: `${product.name} is ready for you.` });
  };

  const handleBuyNow = async () => {
    if (!isValidPrice) return;
    setIsProcessing(true);
    addToCart(product, quantity, { personalizationName });
    setTimeout(() => router.push('/checkout'), 300);
  };

  const onThumbClick = (idx: number) => {
    setSelectedImage(idx);
    emblaApi?.scrollTo(idx);
  };

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => {
      setSelectedImage(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  return (
    <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-start max-w-7xl mx-auto px-4 md:px-6">
      {/* Visual Side: Image Gallery */}
      <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
        {/* Thumbnails (Desktop) */}
        <div className="hidden md:flex flex-col gap-2.5 shrink-0 overflow-y-auto scrollbar-hide max-h-[480px] w-20">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => onThumbClick(i)}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 bg-slate-50",
                selectedImage === i 
                  ? "border-sky-500 shadow-sm scale-105" 
                  : "border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt={`Thumb ${i}`} fill className="object-contain p-1" />
            </button>
          ))}
        </div>

        {/* Main Display Image (Mobile & Desktop) */}
        <div className="flex-1 relative group">
          <div className="overflow-hidden rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100 shadow-sm" ref={emblaRef}>
            <div className="flex">
              {galleryImages.map((img, i) => (
                <div key={i} className="relative flex-[0_0_100%] min-w-0 aspect-square md:aspect-[4/4.5] overflow-hidden bg-slate-50 p-2 md:p-4">
                  <Image 
                    src={img} 
                    alt={`${product.name}`} 
                    fill 
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute top-3 left-3 md:top-5 md:left-5 flex flex-col gap-1.5 z-10">
            {product.isBestSeller && (
              <div className="bg-amber-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-md shadow-sm uppercase tracking-widest">
                BEST SELLER
              </div>
            )}
            {product.isNew && (
              <div className="bg-sky-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-md shadow-sm uppercase tracking-widest">
                NEW
              </div>
            )}
          </div>

          {product.videoUrl && (
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsVideoOpen(true)}
              className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2 border border-slate-100 text-slate-800 z-20 group/vid"
            >
              <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-sm">
                <Play className="h-3 w-3 fill-white ml-0.5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Watch Reel</span>
            </motion.button>
          )}

          {/* Mobile Dot Indicators */}
          <div className="flex md:hidden justify-center gap-1.5 mt-3">
            {galleryImages.map((_, i) => (
              <div key={i} className={cn("h-1.5 rounded-full transition-all duration-300", selectedImage === i ? "w-5 bg-sky-500" : "w-1.5 bg-slate-200")} />
            ))}
          </div>
        </div>
      </div>

      {/* Info Side: Details & Action Controls */}
      <div className="lg:col-span-5 space-y-4 md:sticky md:top-36">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[9px] font-black uppercase tracking-wider border border-sky-100">
            {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
          </div>

          <h1 className="text-2xl md:text-4xl font-headline font-black text-slate-800 leading-tight tracking-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-black text-slate-800">{product.rating?.toFixed(1) || '5.0'}</span>
              <span className="text-[11px] text-slate-400 font-bold ml-0.5 uppercase">({product.reviews || 0} Reviews)</span>
            </div>
            {product.inventoryStatus === 'In Stock' && (
              <div className="flex items-center gap-1 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> In Stock
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            {isValidPrice ? (
              <>
                <span className="text-3xl md:text-4xl font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                {product.oldPrice && (
                  <span className="text-lg text-slate-300 line-through font-bold">₹{product.oldPrice.toLocaleString()}</span>
                )}
              </>
            ) : (
              <span className="text-2xl font-black text-slate-800">Price Unavailable</span>
            )}
          </div>

          <p className="text-slate-500 font-medium italic text-xs leading-relaxed border-l-2 border-sky-300 pl-3 py-0.5">
            "{product.description}"
          </p>
        </motion.div>

        <div className="space-y-4 pt-1">
          {/* Customization Toggle */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Wand2 className="h-3 w-3 text-sky-500" /> CUSTOMIZE WITH NAME <span className="text-rose-500 font-semibold text-[9px] lowercase tracking-normal">(max 10 letters)</span>
            </p>
            <Input 
              placeholder="NAME FOR PERSONALIZATION" 
              value={personalizationName}
              onChange={(e) => setPersonalizationName(e.target.value.toUpperCase())}
              className="h-10 rounded-lg border-slate-200 font-black tracking-widest text-xs bg-white focus:border-sky-500"
              maxLength={10}
            />
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3 py-0.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Quantity:</span>
            <div className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center font-black text-slate-800 text-xs">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* In-Page Action Buttons (Visible on Mobile & Desktop) */}
          <div className="flex items-center gap-2 pt-1">
            <Button 
              onClick={handleAddToCart} 
              disabled={!isValidPrice}
              className="flex-1 h-10 md:h-11 rounded-xl bg-purple-200 hover:bg-purple-300 text-black font-black uppercase tracking-wider text-[11px] md:text-xs gap-1.5 shadow-sm transition-all active:scale-95 px-3"
            >
              <ShoppingCart className="h-3.5 w-3.5 text-black" /> Add to Cart
            </Button>

            <Button 
              onClick={handleBuyNow} 
              disabled={isProcessing || !isValidPrice}
              className="flex-1 h-10 md:h-11 rounded-xl bg-[#B57CFF] hover:bg-[#a163fa] text-white font-black uppercase tracking-wider text-[11px] md:text-xs gap-1 shadow-sm shadow-purple-500/20 transition-all active:scale-95 px-3"
            >
              {isProcessing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>Buy Now</>
              )}
            </Button>

            <Button
              onClick={handleToggleWishlist}
              variant="outline"
              className={cn(
                "w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center border transition-all shrink-0 shadow-sm",
                isWishlisted 
                  ? "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100" 
                  : "border-slate-200 bg-white text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200"
              )}
              aria-label="Wishlist"
            >
              <Heart className={cn("h-4 w-4 md:h-5 md:w-5", isWishlisted && "fill-rose-500 text-rose-500")} />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-black border-none rounded-3xl aspect-[9/16] shadow-2xl">
          <DialogTitle className="sr-only">Product Reel</DialogTitle>
          <div className="relative h-full w-full">
            {product.videoUrl && (
              <video 
                src={product.videoUrl} 
                className="w-full h-full object-cover" 
                controls 
                autoPlay 
                loop
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Persistent Mobile Sticky CTA Bar (Compact, Sleek & Theme Aligned) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-slate-100 px-3 py-2 pb-4 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <Button 
            onClick={handleToggleWishlist}
            variant="outline"
            className={cn(
              "w-9 h-9 rounded-lg border flex items-center justify-center transition-all shrink-0 shadow-sm",
              isWishlisted 
                ? "border-rose-200 bg-rose-50 text-rose-500" 
                : "border-slate-200 bg-white text-slate-400"
            )}
            aria-label="Wishlist"
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-rose-500 text-rose-500")} />
          </Button>

          <Button 
            onClick={handleAddToCart}
            className="flex-1 h-9 rounded-lg bg-purple-200 hover:bg-purple-300 text-black font-black text-[10px] uppercase tracking-wider gap-1 shadow-sm active:scale-95 px-2"
          >
            <ShoppingCart className="h-3 w-3 text-black" /> Add to Cart
          </Button>

          <Button 
            onClick={handleBuyNow}
            disabled={isProcessing}
            className="flex-1 h-9 rounded-lg bg-[#B57CFF] hover:bg-[#a163fa] text-white font-black text-[10px] uppercase tracking-wider gap-1 shadow-sm shadow-purple-500/20 active:scale-95 px-2"
          >
            {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <>Buy Now</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
