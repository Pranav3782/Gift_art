"use client";

import { Star, Palette, Heart, Rocket } from 'lucide-react';

export function ValueStrip() {
  const values = [
    { icon: '⭐', title: 'Premium Quality', desc: 'Handcrafted with love' },
    { icon: '🎨', title: 'Unique & Handcrafted', desc: 'One-of-a-kind designs' },
    { icon: '❤️', title: 'Loved by Thousands', desc: '10,000+ happy families' },
    { icon: '🚀', title: 'Fast & Free Delivery', desc: 'Pan-India shipping' }
  ];

  return (
    <section className="hidden md:block bg-white py-12 border-y-2 border-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-around items-center gap-10">
          {values.map((val, i) => (
            <div key={i} className="flex items-center gap-5 group">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                {val.icon}
              </div>
              <div className="space-y-0.5">
                <strong className="block text-slate-800 text-base font-black tracking-tight">{val.title}</strong>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{val.desc}</span>
              </div>
              {i < values.length - 1 && (
                <div className="hidden lg:block w-px h-12 bg-slate-100 ml-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
