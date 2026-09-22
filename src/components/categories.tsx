
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Gift, User, Smile, Briefcase, Plane, ShoppingBag, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  {
    name: "Men's Gifts",
    image: "https://picsum.photos/seed/men-gift-box/600/800",
    color: "bg-[#EBF5FF]",
    accent: "bg-blue-400",
    icon: Gift,
    link: "/shop/Men",
    imageHint: "gift box"
  },
  {
    name: "Women's Gifts",
    image: "https://picsum.photos/seed/women-backpack/600/800",
    color: "bg-[#FFF0F5]",
    accent: "bg-pink-400",
    icon: User,
    link: "/shop/Women",
    imageHint: "pink backpack"
  },
  {
    name: "Kids' Corner",
    image: "https://picsum.photos/seed/kids-dino/600/800",
    color: "bg-[#FFF9E6]",
    accent: "bg-amber-400",
    icon: Smile,
    link: "/shop/Kids",
    imageHint: "dinosaur bag"
  },
  {
    name: "Corporate Gifting",
    image: "https://picsum.photos/seed/corp-set/600/800",
    color: "bg-[#F0FFF4]",
    accent: "bg-emerald-400",
    icon: Briefcase,
    link: "/shop/Corporate",
    imageHint: "corporate gift"
  },
  {
    name: "Travel Essentials",
    image: "https://picsum.photos/seed/travel-bag/600/800",
    color: "bg-[#E6FBFF]",
    accent: "bg-cyan-400",
    icon: Plane,
    link: "/shop/Travel",
    imageHint: "travel suitcase"
  },
  {
    name: "Fashion Accessories",
    image: "https://picsum.photos/seed/fashion-handbag/600/800",
    color: "bg-[#F5F3FF]",
    accent: "bg-purple-400",
    icon: ShoppingBag,
    link: "/shop/Fashion",
    imageHint: "green handbag"
  }
];

export function Categories() {
  return (
    <section id="categories" className="py-24 bg-[#F0F9FF]/30 relative overflow-hidden">
      {/* Whimsical Background Decorations */}
      <div className="absolute top-10 left-10 opacity-20 animate-bounce">
        <Rocket className="w-16 h-16 text-sky-400 -rotate-45" />
      </div>
      <div className="absolute top-20 right-10 opacity-20 animate-float">
        <div className="relative w-20 h-20">
            <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400 fill-current">
                <path d="M50 10 C30 10 15 30 15 50 C15 70 50 90 50 90 C50 90 85 70 85 50 C85 30 70 10 50 10 Z" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-headline font-black text-slate-800 tracking-tight">
            Shop by <span className="text-sky-600">Category</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Explore our collections crafted for <span className="text-sky-500 font-bold">every personality</span> and occasion.
          </p>
          <div className="flex justify-center pt-2">
            <div className="w-12 h-1 bg-sky-200 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
          {CATEGORIES.map((category) => (
            <Link 
              key={category.name} 
              href={category.link}
              className="group flex flex-col items-center"
            >
              <div className={cn(
                "relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl flex flex-col",
                category.color
              )}>
                {/* Floating Icon Circle */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg shadow-black/5 border-2 border-white",
                    category.accent
                  )}>
                    <category.icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Product Image Area */}
                <div className="flex-1 relative mt-12 mb-16 px-4">
                  <Image 
                    src={category.image} 
                    alt={category.name} 
                    fill 
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={category.imageHint}
                  />
                </div>

                {/* Footer Section */}
                <div className="absolute bottom-0 left-0 right-0 bg-white p-5 text-center flex flex-col items-center gap-2">
                  <span className="font-headline font-black text-[11px] md:text-xs text-slate-800 uppercase tracking-wider">
                    {category.name}
                  </span>
                  <div className={cn("w-6 h-1.5 rounded-full opacity-60", category.accent)} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
