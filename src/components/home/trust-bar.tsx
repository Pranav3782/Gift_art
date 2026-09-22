
"use client";

import { Truck, Recycle, Zap, Star, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

const DEFAULT_MOCK = {
  items: [
    { title: 'Free Shipping', description: 'On orders ₹999+', icon: '🚚' },
    { title: 'Eco Reusable', description: '100% sustainable', icon: '♻️' },
    { title: 'Best Value', description: '3–5 business days', icon: '⚡' }
  ]
};

const FallbackIcons = [Truck, ShieldCheck, Zap];

export function TrustBar({ cms }: { cms?: any }) {
  const data = cms || DEFAULT_MOCK;
  const items = data.items?.slice(0, 3) || DEFAULT_MOCK.items;

  return (
    <section className="hidden md:block py-12 bg-white border-t border-slate-50">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-around gap-12 text-center md:text-left">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-12 group last:hidden lg:last:flex">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110">
                {item.icon || '🎁'}
              </div>
              <div>
                <strong className="block text-base font-black text-slate-800 uppercase tracking-tight">{item.title}</strong>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.description}</span>
              </div>
            </div>
            {i < items.length - 1 && <div className="hidden md:block w-px h-12 bg-slate-100" />}
          </div>
        ))}

        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex gap-1.5 text-[#FFA500]">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center md:text-left">
            Personalised Favourites <br />Loved by Everyone
          </span>
        </div>
      </div>
    </section>
  );
}
