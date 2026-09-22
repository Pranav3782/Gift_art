
"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEFAULT_MOCK = {
  title: "Shop by Category",
  cards: [
    { title: 'BAGS', imageUrl: 'https://rohanwakkar.sirv.com/ChatGPT%20Image%20Jun%2019%2C%202026%2C%2008_56_30%20PM.png', url: '/shop/kids/bags', backgroundColor: '#F8BBD0' },
    { title: 'Bottles', imageUrl: 'https://rohanwakkar.sirv.com/ChatGPT%20Image%20Jun%2019%2C%202026%2C%2009_00_07%20PM.png', url: '/shop/kids/water-bottles', backgroundColor: '#BBDEFB' },
    { title: 'Umbrellas', imageUrl: 'https://rohanwakkar.sirv.com/ChatGPT%20Image%20Jun%2019%2C%202026%2C%2009_05_54%20PM.png', url: '/shop/kids/umbrellas', backgroundColor: '#F3E5F5' },
    { title: 'Combos', imageUrl: 'https://rohanwakkar.sirv.com/ChatGPT%20Image%20Jun%2019%2C%202026%2C%2009_08_49%20PM.png', url: '/shop/kids/combos', backgroundColor: '#B2EBF2' },
  ]
};

export function CategoryGrid({ cms }: { cms?: any }) {
  const data = cms || DEFAULT_MOCK;
  const cards = data.cards || DEFAULT_MOCK.cards;

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect();
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  const renderTitle = (titleText: string) => {
    const text = titleText || "Shop by Category";
    if (text.toLowerCase().includes("category")) {
      return (
        <>
          Shop by <span className="text-sky-500">Category</span>
        </>
      );
    }
    return text;
  };

  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Centered Heading */}
        <div className="flex flex-col items-center text-center justify-center w-full mb-10 md:mb-16">
          <h2 className="font-headline font-black text-3xl md:text-5xl lg:text-6xl text-slate-800 tracking-tight text-center mx-auto">
            Shop By <span className="text-sky-500">Category</span>
          </h2>
        </div>

        {/* Mobile View: 2x2 Grid */}
        <div className="md:hidden grid grid-cols-2 gap-4 pb-8">
          {cards.slice(0, 4).map((cat: any, i: number) => {
            const colors = [
              { border: 'border-[#FF5B84]', text: 'text-[#FF5B84]' }, // bags
              { border: 'border-[#039BE5]', text: 'text-[#039BE5]' }, // bottles
              { border: 'border-[#FF5B84]', text: 'text-[#FF5B84]' }, // umbrellas
              { border: 'border-[#00897B]', text: 'text-[#00897B]' }  // combos
            ];
            const colorPair = colors[i % colors.length];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                viewport={{ once: true }}
                className="relative overflow-visible"
              >
                <Link 
                  href={cat.url || '#'}
                  className="block rounded-[2.5rem] aspect-[3/3.6] relative border-4 border-white shadow-lg overflow-visible"
                  style={{ backgroundColor: cat.backgroundColor || DEFAULT_MOCK.cards[i % 4]?.backgroundColor || '#F1F5F9' }}
                >
                  {/* Badge with Category Name */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-auto">
                    <div className={cn(
                      "bg-white border-[1.5px] px-3.5 py-1 rounded-md text-center shadow-sm",
                      colorPair.border
                    )}>
                      <span className={cn(
                        "font-black text-[10px] tracking-widest uppercase block whitespace-nowrap",
                        colorPair.text
                      )}>
                        {cat.title}
                      </span>
                    </div>
                  </div>

                  {/* Image */}
                  {cat.imageUrl && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[110%] h-[90%] pointer-events-none">
                      <Image 
                        src={cat.imageUrl} 
                        alt={cat.title} 
                        fill 
                        className="object-contain object-bottom drop-shadow-[0_15px_15px_rgba(0,0,0,0.18)]"
                        unoptimized
                      />
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop View: Carousel */}
        <div className="hidden md:block relative overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-8 pb-12 md:pb-16">
            {cards.map((cat: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_31%] min-w-0 pl-4 md:pl-8 group relative"
              >
                <Link 
                  href={cat.url || '#'}
                  className={cn(
                    "block rounded-[2.5rem] md:rounded-[3.5rem] aspect-[3/3.4] relative transition-all duration-700 hover:shadow-[0_45px_90px_-20px_rgba(0,0,0,0.25)] border-4 border-white shadow-lg overflow-visible"
                  )}
                  style={{ backgroundColor: cat.backgroundColor || DEFAULT_MOCK.cards[i % 4]?.backgroundColor || '#F1F5F9' }}
                >
                  <div className="p-6 md:p-8 flex flex-col items-center">
                    {/* Centered Larger and Bolder Title */}
                    <h3 className="font-headline font-black text-xl md:text-2xl lg:text-3xl tracking-widest text-white drop-shadow-md mt-2 md:mt-4 uppercase">
                      {cat.title}
                    </h3>
                  </div>

                  {/* Image positioned absolutely to overflow at the bottom (Direct child of relative Link) */}
                  {cat.imageUrl && (
                    <div className="absolute -bottom-10 md:-bottom-16 left-1/2 -translate-x-1/2 w-[110%] md:w-[120%] h-[95%] md:h-[105%] transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 origin-bottom pointer-events-none">
                      <Image 
                        src={cat.imageUrl} 
                        alt={cat.title} 
                        fill 
                        className="object-contain object-bottom drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)]"
                        unoptimized
                      />
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator Dots (Desktop Only) */}
        {scrollSnaps.length > 1 && (
          <div className="hidden md:flex justify-center gap-2.5 mt-2">
            {scrollSnaps.map((_, index: number) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  selectedIndex === index ? "bg-[#FF69B4] w-6" : "bg-slate-200 hover:bg-slate-300 w-2.5"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
