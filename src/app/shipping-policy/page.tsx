'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Truck, Clock, ShieldCheck, Box, Globe, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShippingPolicyPage() {
  const lastUpdated = "May 24, 2024";

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-[linear-gradient(135deg,#F0F9FF,#E0F2FE)] pt-28 pb-20 lg:pt-36 text-center border-b border-sky-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-headline font-black text-slate-800 mb-4 tracking-tight">Shipping <span className="text-sky-600 italic">Policy</span></h1>
            <p className="text-sky-600 font-black text-[10px] uppercase tracking-[0.3em]">Last Updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="grid gap-12">
          
          <section className="bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border border-slate-50 space-y-8">
            <div className="flex items-center gap-4 text-sky-600">
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center shadow-inner">
                <Clock className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">Delivery Timelines</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm">Standard Gifts</h4>
                <p className="text-slate-500 font-medium leading-relaxed italic">"Dispatched within 24-48 hours. Expected delivery: 3-5 business days."</p>
              </div>
              <div className="p-8 bg-sky-50 rounded-[2rem] border border-sky-100 space-y-4">
                <h4 className="font-black text-sky-600 uppercase tracking-widest text-sm">Personalized Magic</h4>
                <p className="text-sky-700 font-medium leading-relaxed italic">"Requires 1-2 days of artisanal crafting. Expected delivery: 5-7 business days."</p>
              </div>
            </div>
          </section>

          <div className="grid md:grid-cols-3 gap-8">
             {[
               { icon: ShieldCheck, title: "Free Shipping", desc: "On all orders above ₹999 across India." },
               { icon: Box, title: "Handling Fee", desc: "A nominal charge of ₹40 for Cash on Delivery." },
               { icon: MapPin, title: "Pan-India Reach", desc: "We deliver to over 25,000+ pincodes." }
             ].map((item, i) => (
               <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 text-center space-y-4"
               >
                 <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                   <item.icon className="h-5 w-5" />
                 </div>
                 <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">{item.title}</h4>
                 <p className="text-slate-400 text-xs font-medium leading-relaxed italic">"{item.desc}"</p>
               </motion.div>
             ))}
          </div>

          <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[100px]" />
            <Globe className="w-16 h-16 text-sky-400/20 mx-auto mb-8 animate-pulse" />
            <h2 className="text-3xl md:text-5xl font-headline font-black tracking-tight leading-tight mb-6">
              Track Your Magic <br /> <span className="text-sky-400 italic">In Real-Time</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-10 font-medium text-lg leading-relaxed">
              Once your gift leaves our studio, we'll send a tracking link via email and WhatsApp so you can watch its journey.
            </p>
            <button className="bg-sky-500 hover:bg-sky-400 text-white px-12 py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-sky-500/20">
              Track My Order
            </button>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
