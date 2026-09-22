
"use client";

import { Users, Gift, Star, Truck, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function StatsSection() {
  const stats = [
    { label: 'Happy Families', value: '50k+', icon: Users, color: 'text-sky-500' },
    { label: 'Gifts Crafted', value: '120k+', icon: Gift, color: 'text-rose-500' },
    { label: '5 Star Reviews', value: '15k+', icon: Star, color: 'text-amber-500' },
    { label: 'Cities Delivered', value: '500+', icon: Truck, color: 'text-emerald-500' },
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              viewport={{ once: true }}
              className="text-center space-y-2 group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Button asChild variant="ghost" className="rounded-xl h-14 px-8 border border-slate-100 hover:bg-slate-50 font-black uppercase text-xs tracking-[0.2em] gap-2 text-slate-500">
            <Link href="/contact">Become a Happy Customer <Plus className="h-4 w-4" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
