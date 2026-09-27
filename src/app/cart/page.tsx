'use client';

import { Navbar } from '@/components/navbar';
import { useCart } from '@/lib/store/cart-context';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight,
  Truck,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, cartCount } = useCart();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-slate-50/50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 pt-36 pb-12 md:pt-40 lg:pt-44 lg:pb-16 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Main List */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <h1 className="text-2xl sm:text-3xl font-headline font-black text-slate-900 uppercase tracking-tight">Your Bag ({cartCount})</h1>
              {subtotal > 0 && subtotal < 999 && (
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-200/80 w-fit">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Add ₹{(999 - subtotal).toLocaleString()} for Free Shipping
                </div>
              )}
            </div>

            {cart.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {cart.map((item, idx) => (
                    <motion.div 
                      key={`${item.id}-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200/80 flex gap-4 md:gap-6 group"
                    >
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 p-2">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h3 className="font-black text-slate-900 text-sm md:text-base uppercase leading-tight">{item.name}</h3>
                            <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest italic">{item.personalizationName || 'Standard Edition'}</p>
                          </div>
                          <p className="font-black text-slate-900 text-sm md:text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-200">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-slate-400 hover:text-sky-600 transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                            <span className="w-8 text-center font-black text-slate-800 text-xs">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-slate-400 hover:text-sky-600 transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-2 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 space-y-4">
                 <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto" />
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Your shopping bag is currently empty.</p>
                 <Button asChild className="rounded-xl text-white px-8 h-11 bg-sky-500 hover:bg-sky-600 font-black uppercase text-xs tracking-wider shadow-md shadow-sky-500/20"><Link href="/collections">Discover Magic</Link></Button>
              </div>
            )}
          </div>

          {/* Sticky Summary */}
          {cart.length > 0 && (
            <aside className="lg:w-[380px]">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm sticky top-36 space-y-6">
                <h3 className="text-lg font-headline font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-4">
                  <span>Summary</span>
                  <Sparkles className="h-4 w-4 text-sky-500" />
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400"><span>Bag Subtotal</span><span className="text-slate-800">₹{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400"><span>Shipping</span><span className={cn(shipping === 0 ? "text-emerald-600 font-bold" : "text-slate-800")}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-end">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Amount</p>
                      <p className="text-3xl font-black text-slate-900">₹{total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button asChild className="w-full h-12 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-wider text-xs md:text-sm shadow-md shadow-sky-500/20 active:scale-95 group transition-all">
                    <Link href="/checkout" className="flex items-center justify-center gap-2">Secure Checkout <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
                  </Button>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                   <div className="flex items-center gap-2.5 text-[10px] font-black uppercase text-slate-400"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure SSL Checkout</div>
                   <div className="flex items-center gap-2.5 text-[10px] font-black uppercase text-slate-400"><Truck className="h-4 w-4 text-sky-500" /> Delivered in 3-5 Working Days</div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
