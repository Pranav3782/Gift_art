'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { RotateCcw, AlertCircle, CheckCircle2, ShieldOff, Heart, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReturnsRefundsPage() {
  const lastUpdated = "May 24, 2024";

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-[linear-gradient(135deg,#FFF0F5,#FFE4EE)] pt-28 pb-20 lg:pt-36 text-center border-b border-rose-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-headline font-black text-slate-800 mb-4 tracking-tight">Returns & <span className="text-rose-500 italic">Refunds</span></h1>
            <p className="text-rose-400 font-black text-[10px] uppercase tracking-[0.3em]">Last Updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="space-y-12">
          
          <section className="bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border border-slate-50 space-y-10 group hover:shadow-xl transition-all duration-500">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner group-hover:rotate-12 transition-transform">
                <RotateCcw className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight leading-none">Easy Return Window</h2>
            </div>
            <div className="space-y-6 text-slate-600 border-l-4 border-rose-100 pl-8 ml-8">
              <p className="text-lg font-medium italic leading-relaxed">
                "We offer a 7-day magic-guarantee. If your standard item isn't exactly what you dreamed of, you can return it within 7 days of delivery."
              </p>
              <div className="flex items-center gap-3 p-4 bg-rose-50/50 rounded-2xl border border-rose-100 text-rose-600 text-sm font-bold italic">
                <AlertCircle className="h-5 w-5 shrink-0" />
                Items must be unused, in original packaging, with all magical tags intact.
              </div>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 space-y-6">
              <div className="flex items-center gap-4 text-slate-800">
                <ShieldOff className="h-6 w-6 text-rose-500" />
                <h3 className="text-xl font-headline font-black uppercase tracking-tight">Non-Returnable</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Personalized items with names or custom prints.",
                  "Items on Final Sale or Clearance events.",
                  "Gift Cards or promotional coupons."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-500 text-sm font-medium italic">
                    <CheckCircle2 className="h-4 w-4 text-slate-200 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 space-y-6">
              <div className="flex items-center gap-4 text-slate-800">
                <RotateCcw className="h-6 w-6 text-sky-500" />
                <h3 className="text-xl font-headline font-black uppercase tracking-tight">Refund Journey</h3>
              </div>
              <div className="space-y-4 text-slate-500 text-sm font-medium italic leading-relaxed">
                <p>Once your item returns to our studio, it undergoes a quality unboxing. Upon approval, your refund will be processed within 5-7 business days.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Prepaid: Refund to original method.</li>
                  <li>COD: Refund as studio credit.</li>
                </ul>
              </div>
            </div>
          </div>

          <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px]" />
            <Heart className="w-16 h-16 text-rose-400/20 mx-auto mb-8 animate-pulse" />
            <h2 className="text-3xl md:text-5xl font-headline font-black tracking-tight leading-tight mb-6">
              Damaged Or Wrong Item? <br /> <span className="text-rose-400 italic">We'll Fix It Instantly.</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-10 font-medium text-lg leading-relaxed">
              If your gift arrived with a glitch, email us photos at care@giftartstudio.com within 48 hours. We'll replace it for free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-rose-500 hover:bg-rose-400 text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-rose-500/20 flex items-center justify-center gap-3">
                <MessageSquare className="h-4 w-4" /> WhatsApp Support
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-10 py-5 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3">
                Email Studio Team
              </button>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
