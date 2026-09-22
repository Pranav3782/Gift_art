
"use client";

import { Truck, ShieldCheck, Heart, Headphones, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FeaturesList() {
  const items = [
    { icon: Truck, title: 'Pan India Shipping', desc: 'We deliver magic to 25,000+ pincodes across the country with real-time tracking.', color: 'bg-sky-50', iconColor: 'text-sky-500' },
    { icon: ShieldCheck, title: 'Secure Checkout', desc: 'Your security is our priority. SSL-encrypted payments powered by secure gateways.', color: 'bg-emerald-50', iconColor: 'text-emerald-500' },
    { icon: Heart, title: 'Curated with Care', desc: 'Every product is handpicked and quality-tested for child safety and durability.', color: 'bg-rose-50', iconColor: 'text-rose-500' },
    { icon: Headphones, title: 'Dedicated Support', desc: 'Need help? Our friendly studio assistants are just a WhatsApp message away.', color: 'bg-amber-50', iconColor: 'text-amber-500' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 container mx-auto px-4 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 space-y-4"
      >
        <h2 className="text-3xl md:text-4xl font-headline font-black text-slate-800">UNMATCHED PROMISE</h2>
        <p className="text-slate-500 font-medium">Everything we do is designed to bring a smile to your face.</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-6"
      >
        {items.map((item, i) => (
          <motion.div 
            key={i} 
            variants={itemAnim}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shrink-0 shadow-inner`}>
              <item.icon className={`h-7 w-7 ${item.iconColor}`} />
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{item.title}</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
            <div className="shrink-0 hidden sm:block">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <Button asChild variant="link" className="text-sky-600 font-black uppercase tracking-widest text-xs">
          <Link href="/faqs">View All Help Topics</Link>
        </Button>
      </motion.div>
    </section>
  );
}
