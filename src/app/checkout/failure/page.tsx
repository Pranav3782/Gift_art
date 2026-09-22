'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, ShoppingBag, HeadphonesIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FailurePage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-12 lg:pt-36 lg:pb-16 text-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-xl mx-auto space-y-10"
        >
          {/* Error Visual */}
          <div className="relative w-24 h-24 mx-auto">
             <div className="absolute inset-0 bg-rose-500 rounded-3xl rotate-12 opacity-10" />
             <div className="absolute inset-0 bg-white border-2 border-rose-100 rounded-3xl flex items-center justify-center text-rose-500 shadow-xl">
                <AlertCircle className="h-10 w-10" />
             </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-headline font-black text-slate-800 uppercase tracking-tight">Oh Snap! Payment Failed</h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              We couldn't process your payment. Don't worry, your cart items are safe and sound in your bag.
            </p>
          </div>

          <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 text-left space-y-3">
             <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
               Possible Reasons:
             </h4>
             <ul className="text-xs font-bold text-rose-400 space-y-1 ml-4 list-disc">
               <li>Insufficient funds in your account</li>
               <li>Incorrect card or UPI details provided</li>
               <li>Temporary bank server issue</li>
             </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-2xl bg-rose-500 hover:bg-rose-600 text-white px-10 h-16 font-black uppercase tracking-widest gap-2 shadow-xl shadow-rose-500/20 active:scale-95">
              <Link href="/checkout"><RefreshCw className="h-5 w-5" /> Retry Payment</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl border-2 border-slate-100 text-slate-400 hover:bg-slate-50 px-10 h-16 font-black uppercase tracking-widest gap-2 active:scale-95">
              <Link href="/cart"><ArrowLeft className="h-5 w-5" /> Return to Bag</Link>
            </Button>
          </div>

          <div className="pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Still having trouble?</p>
             <button className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">
               <HeadphonesIcon className="h-4 w-4" /> Contact Studio Support
             </button>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>
    </main>
  );
}
