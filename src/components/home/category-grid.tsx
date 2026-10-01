"use client";

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

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
  const db = useFirestore();

  const categoriesQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, 'categories');
  }, [db]);

  const { data: dbCategories } = useCollection<any>(categoriesQuery);

  const cards = useMemo(() => {
    const bgColors = ['#F8BBD0', '#BBDEFB', '#F3E5F5', '#B2EBF2', '#FFF9E6', '#F0FFF4', '#E6FBFF', '#F5F3FF'];

    const activeDbCategories = (dbCategories || []).filter((c: any) => c.status !== 'Inactive');

    if (activeDbCategories.length > 0) {
      const formattedDbCards = activeDbCategories.map((cat: any, index: number) => ({
        title: cat.name,
        imageUrl: cat.image || '',
        url: `/category/${cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        backgroundColor: cat.backgroundColor || bgColors[index % bgColors.length],
      }));

      const baseCards = cms?.cards || DEFAULT_MOCK.cards;
      const dbTitles = new Set(formattedDbCards.map((c: any) => c.title.toLowerCase()));
      const remainingBase = baseCards.filter((c: any) => !dbTitles.has(c.title.toLowerCase()));

      return [...formattedDbCards, ...remainingBase];
    }

    return cms?.cards || DEFAULT_MOCK.cards;
  }, [dbCategories, cms]);

  // Desktop Embla: 4 slides per view, slidesToScroll: 4
  const [desktopEmblaRef, desktopEmblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 4,
    dragFree: false
  });

  // Mobile Embla: Page by page (each page contains 4 items in 2x2 grid)
  const [mobileEmblaRef, mobileEmblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    dragFree: false
  });

  const [desktopIndex, setDesktopIndex] = useState(0);
  const [desktopSnaps, setDesktopSnaps] = useState<number[]>([]);

  const [mobileIndex, setMobileIndex] = useState(0);
  const [mobileSnaps, setMobileSnaps] = useState<number[]>([]);

  // Desktop events
  const onDesktopInit = useCallback((api: any) => {
    setDesktopSnaps(api.scrollSnapList());
  }, []);

  const onDesktopSelect = useCallback(() => {
    if (!desktopEmblaApi) return;
    setDesktopIndex(desktopEmblaApi.selectedScrollSnap());
  }, [desktopEmblaApi]);

  useEffect(() => {
    if (!desktopEmblaApi) return;
    onDesktopInit(desktopEmblaApi);
    onDesktopSelect();
    desktopEmblaApi.on('reInit', onDesktopInit);
    desktopEmblaApi.on('reInit', onDesktopSelect);
    desktopEmblaApi.on('select', onDesktopSelect);
  }, [desktopEmblaApi, onDesktopInit, onDesktopSelect]);

  // Mobile events
  const onMobileInit = useCallback((api: any) => {
    setMobileSnaps(api.scrollSnapList());
  }, []);

  const onMobileSelect = useCallback(() => {
    if (!mobileEmblaApi) return;
    setMobileIndex(mobileEmblaApi.selectedScrollSnap());
  }, [mobileEmblaApi]);

  useEffect(() => {
    if (!mobileEmblaApi) return;
    onMobileInit(mobileEmblaApi);
    onMobileSelect();
    mobileEmblaApi.on('reInit', onMobileInit);
    mobileEmblaApi.on('reInit', onMobileSelect);
    mobileEmblaApi.on('select', onMobileSelect);
  }, [mobileEmblaApi, onMobileInit, onMobileSelect]);

  const scrollToDesktop = useCallback((index: number) => {
    if (desktopEmblaApi) desktopEmblaApi.scrollTo(index);
  }, [desktopEmblaApi]);

  const scrollToMobile = useCallback((index: number) => {
    if (mobileEmblaApi) mobileEmblaApi.scrollTo(index);
  }, [mobileEmblaApi]);

  // Chunk cards into pages of 4 for mobile view
  const mobilePages = useMemo(() => {
    const pages: any[][] = [];
    for (let i = 0; i < cards.length; i += 4) {
      pages.push(cards.slice(i, i + 4));
    }
    return pages;
  }, [cards]);

  const cardColors = [
    { border: 'border-[#FF5B84]', text: 'text-[#FF5B84]' },
    { border: 'border-[#039BE5]', text: 'text-[#039BE5]' },
    { border: 'border-[#FF5B84]', text: 'text-[#FF5B84]' },
    { border: 'border-[#00897B]', text: 'text-[#00897B]' }
  ];

  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Centered Heading */}
        <div className="flex flex-col items-center text-center justify-center w-full mb-10 md:mb-16">
          <h2 className="font-headline font-black text-3xl md:text-5xl lg:text-6xl text-slate-800 tracking-tight text-center mx-auto">
            Shop By <span className="text-sky-500">Category</span>
          </h2>
        </div>

        {/* Mobile View: Swipable 2x2 Pages of 4 Categories */}
        <div className="md:hidden relative overflow-hidden" ref={mobileEmblaRef}>
          <div className="flex">
            {mobilePages.map((pageCards, pageIdx) => (
              <div key={pageIdx} className="flex-[0_0_100%] min-w-0 grid grid-cols-2 gap-3.5 pb-6">
                {pageCards.map((cat: any, i: number) => {
                  const globalIdx = pageIdx * 4 + i;
                  const colorPair = cardColors[globalIdx % cardColors.length];

                  return (
                    <motion.div
                      key={globalIdx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="relative overflow-visible"
                    >
                      <Link 
                        href={cat.url || '#'}
                        className="block rounded-[2.2rem] aspect-[3/3.6] relative border-4 border-white shadow-lg overflow-visible"
                        style={{ backgroundColor: cat.backgroundColor || DEFAULT_MOCK.cards[globalIdx % 4]?.backgroundColor || '#F1F5F9' }}
                      >
                        {/* Title matching Desktop View Style */}
                        <div className="p-3.5 flex flex-col items-center z-10 relative">
                          <h3 className="font-headline font-black text-base sm:text-lg tracking-widest text-white drop-shadow-md mt-1 uppercase text-center">
                            {cat.title}
                          </h3>
                        </div>

                        {/* Image */}
                        {cat.imageUrl && (
                          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[110%] h-[88%] pointer-events-none">
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
            ))}
          </div>
        </div>

        {/* Mobile Page Dots */}
        {mobileSnaps.length > 1 && (
          <div className="flex md:hidden justify-center gap-2 mt-3">
            {mobileSnaps.map((_, index: number) => (
              <button
                key={index}
                onClick={() => scrollToMobile(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  mobileIndex === index ? "bg-sky-500 w-6" : "bg-slate-200 hover:bg-slate-300 w-2.5"
                )}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Desktop View: Swipable Carousel showing exactly 4 cards per view */}
        <div className="hidden md:block relative overflow-hidden" ref={desktopEmblaRef}>
          <div className="flex -ml-4 md:-ml-6 pb-12 md:pb-16">
            {cards.map((cat: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: (i % 4) * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex-[0_0_25%] min-w-0 pl-4 md:pl-6 group relative"
              >
                <Link 
                  href={cat.url || '#'}
                  className={cn(
                    "block rounded-[2.5rem] md:rounded-[3rem] aspect-[3/3.4] relative transition-all duration-700 hover:shadow-[0_45px_90px_-20px_rgba(0,0,0,0.25)] border-4 border-white shadow-lg overflow-visible"
                  )}
                  style={{ backgroundColor: cat.backgroundColor || DEFAULT_MOCK.cards[i % 4]?.backgroundColor || '#F1F5F9' }}
                >
                  <div className="p-5 md:p-6 flex flex-col items-center">
                    <h3 className="font-headline font-black text-lg md:text-xl lg:text-2xl tracking-widest text-white drop-shadow-md mt-2 uppercase text-center">
                      {cat.title}
                    </h3>
                  </div>

                  {cat.imageUrl && (
                    <div className="absolute -bottom-8 md:-bottom-12 left-1/2 -translate-x-1/2 w-[110%] md:w-[115%] h-[90%] md:h-[100%] transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 origin-bottom pointer-events-none">
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

        {/* Desktop Page Dots */}
        {desktopSnaps.length > 1 && (
          <div className="hidden md:flex justify-center gap-2.5 mt-2">
            {desktopSnaps.map((_, index: number) => (
              <button
                key={index}
                onClick={() => scrollToDesktop(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  desktopIndex === index ? "bg-[#FF69B4] w-6" : "bg-slate-200 hover:bg-slate-300 w-2.5"
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
