
"use client";

import { Send, Plane, Sparkles, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function Newsletter() {
  return (
    <section className="py-24 container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden group shadow-2xl"
      >
        {/* Decorative Elements */}
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-20"
        >
          <Plane className="w-12 h-12 text-white/20 -rotate-45" />
        </motion.div>
        
        <Plane className="absolute bottom-20 right-20 w-16 h-16 text-white/10 rotate-12 animate-float" />
        <Sparkles className="absolute top-10 right-1/4 w-8 h-8 text-white/30 animate-pulse" />
        
        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30"
          >
            <Sparkles className="h-3.5 w-3.5 text-white" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Join the Family</span>
          </motion.div>
          
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-headline font-black text-white leading-tight"
          >
            Get 10% Off Your <br /><span className="text-sky-200 italic">First Purchase</span>
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-sky-50/80 text-lg font-medium max-w-lg mx-auto"
          >
            Subscribe to get exclusive offers, new collection alerts and gifting inspiration straight to your inbox.
          </motion.p>
          
          <motion.form 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 bg-white/10 p-2 rounded-[2rem] border border-white/20 backdrop-blur-xl group-focus-within:border-white/40 transition-all"
          >
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-transparent border-none outline-none px-6 py-4 text-white placeholder:text-white/60 font-bold flex-1 text-sm"
              required
            />
            <Button className="bg-white hover:bg-sky-50 text-sky-600 rounded-[1.5rem] px-10 h-14 font-black uppercase tracking-widest gap-2 shadow-lg shadow-black/10 active:scale-95 transition-transform">
              Subscribe <Send className="h-4 w-4" />
            </Button>
          </motion.form>
          
          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">No spam, just magic. Unsubscribe anytime.</p>
            <Button asChild variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-widest h-10 px-6 gap-2">
              <Link href="/privacy-policy"><Gift className="h-3.5 w-3.5" /> View Member Perks</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
