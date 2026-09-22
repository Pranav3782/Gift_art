'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { 
  Star, 
  ShoppingCart, 
  Bolt, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Minus, 
  Wand2, 
  CheckCircle2, 
  Loader2, 
  Tag,
  Play,
  RotateCcw,
  Package,
  ChevronsLeft,
  ChevronsRight
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
import { motion, AnimatePresence } from 'framer-motion';
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
        // Guest mode checking via localStorage
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
      // Guest mode toggling via localStorage
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
            description: `${product.name} has been removed from guest wishlist.`
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
            description: `${product.name} is now saved in guest wishlist.`
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
          description: `${product.name} has been removed from your wishlist.`
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
          description: `${product.name} is now saved in your wishlist.`
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
    toast({ title: "Magic Added to Bag!", description: `${product.name} is ready for you.` });
  };

  const handleBuyNow = async () => {
    if (!isValidPrice) return;
    setIsProcessing(true);
    addToCart(product, quantity, { personalizationName });
    setTimeout(() => router.push('/checkout'), 400);
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
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start max-w-7xl mx-auto px-4 md:px-6">
      {/* Visual Side: Image Gallery */}
      <div className="lg:col-span-7 flex flex-col md:flex-row gap-5">
        <div className="hidden md:flex flex-col gap-3 shrink-0 overflow-y-auto scrollbar-hide max-h-[550px] w-24">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => onThumbClick(i)}
              className={cn(
                "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300",
                selectedImage === i 
                  ? "border-[#0ea5e9] shadow-lg shadow-sky-100 scale-105" 
                  : "border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" />
            </button>
          ))}
        </div>

        <div className="flex-1 relative group">
           <div className="overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 shadow-xl" ref={emblaRef}>
             <div className="flex">
               {galleryImages.map((img, i) => (
                 <div key={i} className="relative flex-[0_0_100%] min-w-0 aspect-[1/1] md:aspect-[4/5] overflow-hidden">
                   <Image 
                    src={img} 
                    alt={`${product.name}`} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    unoptimized
                   />
                 </div>
               ))}
             </div>
           </div>
           
           <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col gap-2 z-10">
              {product.isBestSeller && (
                <div className="bg-[#FFA500] text-white text-[8px] md:text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">
                  BEST SELLER
                </div>
              )}
              {product.isNew && (
                <div className="bg-[#0ea5e9] text-white text-[8px] md:text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">
                  NEW
                </div>
              )}
           </div>

           {product.videoUrl && (
             <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoOpen(true)}
              className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 hover:bg-white transition-all z-20 group/vid"
             >
                <div className="w-8 h-8 bg-[#0ea5e9] rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover/vid:rotate-12">
                  <Play className="h-4 w-4 fill-white ml-0.5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Watch Reel</span>
             </motion.button>
           )}

           <div className="flex md:hidden justify-center gap-2 mt-4">
             {galleryImages.map((_, i) => (
               <div key={i} className={cn("h-1.5 rounded-full transition-all duration-300", selectedImage === i ? "w-6 bg-[#0ea5e9]" : "w-1.5 bg-slate-200")} />
             ))}
           </div>
        </div>
      </div>

      {/* Info Side: Details & Purchase */}
      <div className="lg:col-span-5 space-y-4 md:space-y-10 md:sticky md:top-32 pb-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 md:space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-[#0ea5e9] rounded-full text-[9px] font-black uppercase tracking-[0.15em] border border-sky-100">
            {product.category} • {product.subcategory}
          </div>

          <h1 className="text-2xl md:text-5xl font-headline font-black text-slate-800 leading-tight tracking-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-[#FFA500] text-[#FFA500]" />
              <span className="text-sm font-black text-slate-800">{product.rating?.toFixed(1) || '5.0'}</span>
              <span className="text-xs text-slate-400 font-bold ml-1 uppercase">({product.reviews || 0} Reviews)</span>
            </div>
            {product.inventoryStatus === 'In Stock' && (
              <div className="flex items-center gap-1.5 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                <CheckCircle2 className="h-3.5 w-3.5" /> Handcrafted Ready
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-4">
            {isValidPrice ? (
              <>
                <span className="text-3xl md:text-5xl font-black text-slate-800">₹{product.price.toLocaleString()}</span>
                {product.oldPrice && (
                  <span className="text-xl text-slate-300 line-through font-bold">₹{product.oldPrice.toLocaleString()}</span>
                )}
              </>
            ) : (
              <span className="text-3xl md:text-5xl font-black text-slate-800">Price Unavailable</span>
            )}
          </div>

          <div className="text-slate-500 font-medium italic text-xs md:text-lg leading-relaxed border-l-4 border-sky-100 pl-4 py-1">
            "{product.description}"
          </div>
        </motion.div>

        <div className="space-y-4 md:space-y-8">
          {/* Customization Toggle */}
          <div className="pt-2">
             <div className="bg-white border-2 border-dashed border-sky-100 rounded-2xl p-4 space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Wand2 className="h-3 w-3 text-[#0ea5e9]" /> CUSTOMIZE WITH NAME <span className="text-[#FF6B95] font-bold text-[8px] lowercase tracking-normal"> (Name characters should be under 10 alphabet)</span>
                </p>
                <Input 
                  placeholder="NAME FOR PERSONALIZATION" 
                  value={personalizationName}
                  onChange={(e) => setPersonalizationName(e.target.value.toUpperCase())}
                  className="h-12 rounded-xl border-none font-black tracking-widest text-xs bg-slate-50/50"
                  maxLength={10}
                />
             </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 py-1">
             <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-slate-400 hover:text-[#0ea5e9]"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-black text-slate-800 text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-slate-400 hover:text-[#0ea5e9]"
                >
                  <Plus className="h-4 w-4" />
                </button>
             </div>
          </div>

          {/* Desktop Only Buttons - Hidden on Mobile because of Sticky Bar */}
          <div className="hidden lg:flex flex-col gap-5">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
              <Button 
                onClick={handleBuyNow} 
                disabled={isProcessing || !isValidPrice}
                className="w-full h-20 rounded-2xl bg-gradient-to-r from-[#9333EA] to-[#DB2777] hover:from-[#a855f7] hover:to-[#ec4899] text-white hover:text-white font-black uppercase tracking-[0.2em] text-lg shadow-2xl relative overflow-hidden flex items-center justify-center gap-4 animate-buy-now border-4 border-white/20 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <ChevronsLeft className="h-6 w-6 opacity-80" />
                    <span>BUY NOW</span>
                    <ChevronsRight className="h-6 w-6 opacity-80" />
                  </>
                )}
              </Button>
            </motion.div>

            <div className="flex gap-4">
              <Button 
                onClick={handleAddToCart} 
                disabled={!isValidPrice}
                variant="ghost" 
                className="flex-1 h-12 text-slate-600 font-black uppercase tracking-[0.15em] text-xs gap-3 hover:bg-slate-50 transition-all border border-slate-100 rounded-2xl disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" /> ADD TO CART
              </Button>
              <Button
                onClick={handleToggleWishlist}
                variant="outline"
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all shrink-0",
                  isWishlisted 
                    ? "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600" 
                    : "border-slate-100 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-500"
                )}
              >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-rose-500")} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-black border-none rounded-[2.5rem] aspect-[9/16] shadow-2xl">
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

      {/* Persistent Mobile Sticky CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#FFF0F7]/95 backdrop-blur-xl border-t border-pink-100/80 p-4 pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 max-w-md mx-auto">
           <Button 
            onClick={handleToggleWishlist}
            variant="outline"
            className={cn(
              "w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0",
              isWishlisted 
                ? "border-rose-200 bg-rose-50 text-rose-500" 
                : "border-slate-100 bg-white text-slate-400"
            )}
           >
             <Heart className={cn("h-5 w-5", isWishlisted && "fill-rose-500")} />
           </Button>
           <Button 
            onClick={handleAddToCart}
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-2 border-sky-100 bg-sky-50 font-black text-[9px] uppercase tracking-widest text-sky-600 hover:bg-sky-100/80 transition-colors"
           >
             <ShoppingCart className="h-4 w-4 mr-2" /> Add To Cart
           </Button>
           <Button 
            onClick={handleBuyNow}
            disabled={isProcessing}
            className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-[#9333EA] to-[#DB2777] hover:from-[#a855f7] hover:to-[#ec4899] text-white hover:text-white font-black text-xs uppercase tracking-widest gap-2 animate-buy-now border-2 border-white/20"
           >
             {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <>BUY NOW <ChevronsRight className="h-4 w-4" /></>}
           </Button>
        </div>
      </div>
    </div>
  );
}
