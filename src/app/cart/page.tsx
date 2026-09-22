'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
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
      
      <div className="flex-1 container mx-auto px-4 pt-28 pb-12 lg:pt-36 lg:pb-16 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main List */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">Your Bag ({cartCount})</h1>
              {subtotal > 0 && subtotal < 999 && (
                <div className="hidden md:flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">
                  <Sparkles className="h-3.5 w-3.5" /> Add ₹{(999 - subtotal).toLocaleString()} for Free Shipping
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
                      className="bg-white rounded-[2rem] p-4 md:p-6 shadow-sm border border-slate-100 flex gap-4 md:gap-8 group"
                    >
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h3 className="font-black text-slate-800 text-sm md:text-lg uppercase leading-tight">{item.name}</h3>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">{item.personalizationName || 'Standard Edition'}</p>
                          </div>
                          <p className="font-black text-slate-800 text-sm md:text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center bg-slate-50 rounded-xl p-1 border">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-slate-400 hover:text-indigo-600"><Minus className="h-3.5 w-3.5" /></button>
                            <span className="w-8 text-center font-black text-slate-800 text-xs">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-slate-400 hover:text-indigo-600"><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-2.5 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 space-y-6">
                 <ShoppingBag className="h-12 w-12 text-slate-100 mx-auto" />
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Your shopping bag is currently empty.</p>
                 <Button asChild className="rounded-full text-white px-10 h-14 bg-indigo-600"><Link href="/collections">Discover Magic</Link></Button>
              </div>
            )}
          </div>

          {/* Sticky Summary */}
          {cart.length > 0 && (
            <aside className="lg:w-[400px]">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100 sticky top-32 space-y-8">
                <h3 className="text-xl font-headline font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">Summary <Sparkles className="h-5 w-5 text-amber-400" /></h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400"><span>Bag Subtotal</span><span className="text-slate-800">₹{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400"><span>Shipping</span><span className={cn(shipping === 0 ? "text-emerald-500" : "text-slate-800")}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                  <div className="pt-6 mt-6 border-t flex justify-between items-end">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Amount</p>
                      <p className="text-4xl font-black text-slate-800">₹{total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <Button asChild className="w-full h-18 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-indigo-100 group">
                    <Link href="/checkout" className="flex items-center justify-center gap-2">Secure Checkout <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></Link>
                  </Button>
                </div>

                <div className="pt-6 border-t border-slate-50 space-y-4">
                   <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure SSL Checkout</div>
                   <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400"><Truck className="h-4 w-4 text-indigo-400" /> Delivered in 3-5 Working Days</div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </main>
  );
}
