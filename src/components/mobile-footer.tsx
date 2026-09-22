
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  Gift, 
  MapPin, 
  Mail, 
  Phone, 
  ChevronRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

interface MobileFooterProps {
  cms?: any;
}

export function MobileFooter({ cms }: MobileFooterProps) {
  const [mounted, setMounted] = useState(false);
  const config = cms?.data || {};

  useEffect(() => {
    setMounted(true);
  }, []);

  const PinterestIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-1.027 1.412-5.953 1.412-5.953s-.359-.72-.359-1.781c0-1.675.967-2.925 2.171-2.925 1.023 0 1.518.77 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.53 2.169 1.706 2.169 2.047 0 3.619-2.158 3.619-5.274 0-2.756-1.982-4.685-4.81-4.685-3.277 0-5.186 2.458-5.186 4.981 0 .99.38 2.048.854 2.507.094.092.107.171.078.286-.086.357-.278 1.132-.316 1.286-.051.201-.168.243-.387.142-1.442-.672-2.342-2.78-2.342-4.475 0-3.645 2.648-7 7.643-7 4.01 0 7.127 2.857 7.127 6.677 0 3.984-2.511 7.189-5.998 7.189-1.171 0-2.271-.608-2.648-1.316l-.721 2.744c-.261 1.002-.968 2.258-1.44 3.036 1.031.317 2.12.488 3.245.488 6.627 0 12-5.373 12-12S18.627 0 12.017 0z"/>
    </svg>
  );

  // Return a static placeholder or basic shell during SSR to avoid ID mismatches
  if (!mounted) {
    return (
      <footer className="lg:hidden w-full bg-gradient-to-b from-[#1F1F23] to-[#2B2B30] rounded-t-[24px] text-white pt-12 pb-24 px-6">
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-12 bg-white/5 rounded-full w-full"></div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="lg:hidden w-full overflow-hidden bg-gradient-to-b from-[#1F1F23] to-[#2B2B30] rounded-t-[24px] text-white pt-12 pb-24 px-6 space-y-12">
      
      {/* Newsletter Section */}
      <div className="space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest leading-tight">
          {config.newsletterTitle || "SIGN UP FOR OUR NEWSLETTER NOW!"}
        </h3>
        <div className="relative flex items-center">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-sky-500/50 transition-all"
          />
          <button 
            className="absolute right-1.5 w-10 h-10 bg-[#F57C00] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <Gift className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Follow Us Section */}
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
          Follow Us
        </h3>
        <div className="flex gap-6">
          <Link href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></Link>
          <Link href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></Link>
          <Link href="#" className="text-slate-400 hover:text-white transition-colors"><PinterestIcon /></Link>
          <Link href="#" className="text-slate-400 hover:text-white transition-colors"><Youtube className="h-5 w-5" /></Link>
          <Link href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="h-5 w-5 fill-current" /></Link>
        </div>
      </div>

      {/* Accordion Menu */}
      <div className="pt-4 border-t border-white/5">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="hq" className="border-white/10">
            <AccordionTrigger className="uppercase font-black text-[11px] tracking-widest text-white hover:no-underline py-5">
              OUR HEADQUARTERS
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-0 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#F57C00] shrink-0" />
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  {config.address || "42, Creative Hub, Sector 62,\nNoida, UP - 201301, India"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#F57C00]" />
                <p className="text-xs font-medium text-slate-400">{config.email || "care@giftartstudio.com"}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#F57C00]" />
                <p className="text-xs font-medium text-slate-400">{config.phone || "+91 98765 43210"}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cats" className="border-white/10">
            <AccordionTrigger className="uppercase font-black text-[11px] tracking-widest text-white hover:no-underline py-5">
              PRODUCT CATEGORIES
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-0">
              <ul className="grid grid-cols-1 gap-3">
                {["Bags", "Bottles", "Umbrellas", "Gift Sets", "Stationery", "Toys"].map((cat) => (
                  <li key={cat}>
                    <Link href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`} className="text-xs font-bold text-slate-400 flex items-center justify-between">
                      {cat} <ChevronRight className="h-3 w-3 opacity-20" />
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="links" className="border-white/10">
            <AccordionTrigger className="uppercase font-black text-[11px] tracking-widest text-white hover:no-underline py-5">
              QUICK LINKS
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-0">
              <ul className="grid grid-cols-1 gap-3">
                {["About Us", "Contact Us", "FAQ", "Privacy Policy", "Terms & Conditions"].map((link) => (
                  <li key={link}>
                    <Link href={`/${link.toLowerCase().replace(/ /g, '-')}`} className="text-xs font-bold text-slate-400 flex items-center justify-between">
                      {link} <ChevronRight className="h-3 w-3 opacity-20" />
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="service" className="border-white/10">
            <AccordionTrigger className="uppercase font-black text-[11px] tracking-widest text-white hover:no-underline py-5">
              CUSTOMER SERVICE
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-0">
              <ul className="grid grid-cols-1 gap-3">
                {["Track Order", "Shipping Policy", "Refund Policy", "Help Center"].map((link) => (
                  <li key={link}>
                    <Link href={`/${link.toLowerCase().replace(/ /g, '-')}`} className="text-xs font-bold text-slate-400 flex items-center justify-between">
                      {link} <ChevronRight className="h-3 w-3 opacity-20" />
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Copyright */}
      <div className="pt-4 text-center">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          © 2024 GiftArtStudio. Crafted with Magic.
        </p>
      </div>
    </footer>
  );
}
