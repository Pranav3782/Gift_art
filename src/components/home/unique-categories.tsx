
"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const GATEWAYS = [
  { 
    name: 'New Born', 
    image: 'https://picsum.photos/seed/cat-newborn/400/400', 
    color: 'bg-rose-50', 
    shape: 'blob-1', 
    href: '/collections' 
  },
  { 
    name: 'Toddlers', 
    image: 'https://picsum.photos/seed/cat-toddler/400/400', 
    color: 'bg-sky-50', 
    shape: 'blob-2', 
    href: '/collections' 
  },
  { 
    name: 'Schoolers', 
    image: 'https://picsum.photos/seed/cat-school/400/400', 
    color: 'bg-amber-50', 
    shape: 'blob-3', 
    href: '/collections' 
  },
  { 
    name: 'Personalized', 
    image: 'https://picsum.photos/seed/cat-pers/400/400', 
    color: 'bg-emerald-50', 
    shape: 'blob-4', 
    href: '/customization' 
  },
  { 
    name: 'Gift Sets', 
    image: 'https://picsum.photos/seed/cat-set/400/400', 
    color: 'bg-purple-50', 
    shape: 'blob-1', 
    href: '/collections' 
  },
  { 
    name: 'Bedtime', 
    image: 'https://picsum.photos/seed/cat-sleep/400/400', 
    color: 'bg-indigo-50', 
    shape: 'blob-2', 
    href: '/collections' 
  },
  { 
    name: 'Playtime', 
    image: 'https://picsum.photos/seed/cat-play/400/400', 
    color: 'bg-orange-50', 
    shape: 'blob-3', 
    href: '/collections' 
  },
  { 
    name: 'Backpacks', 
    image: 'https://picsum.photos/seed/cat-bags/400/400', 
    color: 'bg-blue-50', 
    shape: 'blob-4', 
    href: '/collections' 
  }
];

export function UniqueCategories() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    skipSnaps: false
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(autoScroll);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-14 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Carousel Indicators (Top) */}
        <div className="flex justify-center gap-2 mb-10 md:mb-16">
          {GATEWAYS.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 md:h-2 rounded-full transition-all duration-300",
                selectedIndex === i ? "w-6 md:w-8 bg-sky-500" : "w-1.5 md:w-2 bg-sky-100"
              )}
            />
          ))}
        </div>

        <div className="relative group/carousel">
          {/* Navigation Arrows */}
          <button 
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-8 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-sky-500 transition-all opacity-0 group-hover/carousel:opacity-100 border border-slate-50 hidden md:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-8 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-sky-500 transition-all opacity-0 group-hover/carousel:opacity-100 border border-slate-50 hidden md:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-6 md:-ml-12">
              {GATEWAYS.map((gate, i) => (
                <div key={i} className="flex-[0_0_180px] md:flex-[0_0_350px] min-w-0 pl-6 md:pl-12">
                  <Link 
                    href={gate.href}
                    className="group block text-center space-y-4 md:space-y-6"
                  >
                    <div className={cn(
                      "relative w-full aspect-square transition-all duration-700 flex items-center justify-center border-[8px] md:border-[12px] border-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] group-hover:-translate-y-1 md:group-hover:-translate-y-2 overflow-hidden",
                      gate.color,
                      gate.shape
                    )}>
                      <Image 
                        src={gate.image} 
                        alt={gate.name} 
                        fill 
                        className="object-cover p-6 md:p-10 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        data-ai-hint="category image"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black text-[10px] md:text-sm text-slate-800 uppercase tracking-[0.2em] group-hover:text-sky-600 transition-colors">
                        {gate.name}
                      </h3>
                      <div className="w-6 h-0.5 md:w-8 md:h-1 bg-sky-200 mx-auto rounded-full group-hover:w-10 md:group-hover:w-12 group-hover:bg-sky-500 transition-all duration-500" />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
