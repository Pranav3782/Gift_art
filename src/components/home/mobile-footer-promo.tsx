"use client";

import React from 'react';
import { Medal, Sparkles, Heart, Truck, Gift } from 'lucide-react';

interface MobileFooterPromoProps {
  cms?: any;
}

const TRUST_ITEMS = [
  { icon: Medal, label: 'Premium Quality' },
  { icon: Sparkles, label: 'Unique & Personalised' },
  { icon: Heart, label: 'Loved by Thousands' },
  { icon: Truck, label: 'Fast & Free Delivery' },
];

export function MobileFooterPromo({ cms }: MobileFooterPromoProps) {
  const isVisible = cms?.isVisible !== false;
  if (!isVisible) return null;

  return (
    <section className="md:hidden px-4 pb-20 pt-8 bg-white space-y-12">
      {/* Brand Logo Header */}
      <div className="flex flex-col items-center gap-2 mb-12">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 bg-[#0ea5e9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Gift className="w-6 h-6 drop-shadow-md" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-headline font-black text-xl text-[#1E1B4B] tracking-tighter">GiftArtStudio</span>
            <span className="text-[7px] font-black text-[#1E1B4B]/70 uppercase tracking-[0.3em]">MAGICAL GIFTS</span>
          </div>
        </div>
      </div>

      {/* Trust Features Row */}
      <div className="grid grid-cols-4 gap-2">
        {TRUST_ITEMS.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-[#1E1B4B] shadow-sm">
              <item.icon className="h-6 w-6 stroke-[1.5]" />
            </div>
            <p className="text-[10px] font-bold text-[#1E1B4B] leading-tight px-1">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
