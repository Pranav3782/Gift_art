"use client";

import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeroProps {
  cms?: any;
  isMobile?: boolean;
}

const DEFAULT_MOCK = {
  imageUrl: "https://rohanwakkar.sirv.com/main-home-banner-website-design-home-page.png",
  subHeading: "UNIQUE, PERSONALIZED GIFTS",
  heading: "Unique Gifts, Made for Kids",
  description: "Create unforgettable childhood memories with our premium handcrafted collection of personalized bags, toys, and essentials.",
  primaryButtonText: "Explore Shop",
  primaryButtonUrl: "/shop/new/best-sellers",
  secondaryButtonText: "All Categories",
  secondaryButtonUrl: "/collections"
};

const MOBILE_SPECIFIC_MOCK = {
  imageUrl: "https://rohanwakkar.sirv.com/WhatsApp%20Image%202026-06-20%20at%206.03.34%20PM.jpeg",
  subHeading: "UNIQUE BOUTIQUE GIFTS",
  heading: "Gifts Made Extra Special",
  description: "Memorable handcrafted treasures for your little ones.",
  primaryButtonText: "Shop Now",
  primaryButtonUrl: "/shop/new/best-sellers",
  secondaryButtonText: "View Catalog",
  secondaryButtonUrl: "/collections"
};

export const Hero = memo(({ cms, isMobile }: HeroProps) => {
  const fallback = isMobile ? MOBILE_SPECIFIC_MOCK : DEFAULT_MOCK;
  const data = cms || fallback;
  
  const bannerImage = data.imageUrl || data.bannerUrl || fallback.imageUrl;

  return (
    <section 
      className="relative overflow-hidden flex items-center pt-[110px] pb-12 md:pt-[140px] md:pb-16 lg:pt-[160px] lg:pb-20 w-full aspect-[3/5] md:aspect-auto lg:aspect-[4924/2684] md:min-h-[700px] lg:min-h-0 bg-sky-50 transition-all duration-700"
    >
      {/* Background Image Layer starting from the very top of the hero section */}
      <div 
        className="absolute inset-0 z-10 bg-no-repeat bg-cover bg-[position:center_top]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05)), url('${bannerImage}')`,
        }}
      />
      {/* Content Container */}
      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col items-center text-center space-y-6 md:space-y-10 max-w-4xl mx-auto">
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-sky-100"
          >
             <Sparkles className="h-3.5 w-3.5 text-sky-500" />
             <span className="text-[9px] md:text-[11px] font-black text-sky-600 uppercase tracking-[0.25em]">
               {data.subHeading || fallback.subHeading}
             </span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-headline font-black text-3xl md:text-6xl lg:text-7xl leading-[1.15] text-slate-800 tracking-tight drop-shadow-sm"
          >
            {data.heading || fallback.heading}
          </motion.h1>

          <motion.p 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-xl font-bold leading-relaxed text-slate-600 max-w-2xl"
          >
            {data.description || fallback.description}
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-3 w-full sm:w-auto mx-auto"
          >
            <Button asChild className="w-44 md:w-52 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white h-11 md:h-13 text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-xl gap-2 group active:scale-95 transition-all">
              <Link href={data.primaryButtonUrl || fallback.primaryButtonUrl || '#'}>
                {data.primaryButtonText || fallback.primaryButtonText} <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-44 md:w-52 rounded-2xl bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 h-11 md:h-13 text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all">
              <Link href={data.secondaryButtonUrl || fallback.secondaryButtonUrl || '#'}>
                {data.secondaryButtonText || fallback.secondaryButtonText}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
