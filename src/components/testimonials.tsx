"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, Heart } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="py-20 bg-[linear-gradient(135deg,#FFF0F5,#FFEAF3)] relative overflow-hidden">
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/5 rounded-full"></div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-extrabold text-center mb-16">
          What Parents Have To Say <span className="text-primary italic">♥</span>
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          <div className="relative w-56 h-64 md:w-64 md:h-72 rounded-[20px] overflow-hidden shadow-2xl shrink-0">
            <Image 
              src={PlaceHolderImages.find(img => img.id === 'customer-1')?.imageUrl || ""} 
              alt="Happy Parent" 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-primary/10"></div>
          </div>
          
          <div className="max-w-xl space-y-6 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="h-6 w-6 fill-[#FFA500] text-[#FFA500]" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl font-body italic text-foreground leading-relaxed">
              "The quality is amazing and my daughter absolutely loved her personalized backpack. Thank you Little Joys for making her day so special!"
            </blockquote>
            <div className="text-primary font-extrabold text-lg">– Neha Sharma</div>
            
            <div className="flex justify-center lg:justify-start gap-2 pt-4">
              <span className="w-2 h-2 rounded-full bg-muted"></span>
              <span className="w-6 h-2 rounded-full bg-primary"></span>
              <span className="w-2 h-2 rounded-full bg-muted"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}