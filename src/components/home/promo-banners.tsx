
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Truck, Zap, Sparkles } from 'lucide-react';

export function PromoBanners() {
  return (
    <section className="py-24 container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-[#FF9E7D] rounded-[3rem] p-10 md:p-16 flex flex-col items-center text-center space-y-6 relative overflow-hidden group shadow-xl"
        >
           <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white"
           >
             <Truck className="h-8 w-8" />
           </motion.div>
           <h3 className="text-3xl md:text-4xl font-headline font-black text-white leading-tight">FREE SHIPPING FOR YOU</h3>
           <p className="text-white/80 font-bold uppercase tracking-widest text-sm">On all orders above ₹999</p>
           <Button asChild className="rounded-full bg-white text-[#FF9E7D] hover:bg-white/90 px-10 py-6 h-auto font-black uppercase tracking-widest shadow-xl group/btn">
             <Link href="/collections" className="flex items-center gap-2">
               Shop Now <Sparkles className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
             </Link>
           </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-[#56C5C0] rounded-[3rem] p-10 md:p-16 flex flex-col items-center text-center space-y-6 relative overflow-hidden group shadow-xl"
        >
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
           <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white"
           >
             <Zap className="h-8 w-8 fill-white" />
           </motion.div>
           <h3 className="text-3xl md:text-4xl font-headline font-black text-white leading-tight">EXTRA 10% OFF PREPAID</h3>
           <p className="text-white/80 font-bold uppercase tracking-widest text-sm">Automated at checkout</p>
           <Button asChild className="rounded-full bg-white text-[#56C5C0] hover:bg-white/90 px-10 py-6 h-auto font-black uppercase tracking-widest shadow-xl group/btn">
             <Link href="/collections" className="flex items-center gap-2">
               Start Saving <Sparkles className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
             </Link>
           </Button>
        </motion.div>
      </div>
    </section>
  );
}
