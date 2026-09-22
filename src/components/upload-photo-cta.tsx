
"use client";

import { Button } from '@/components/ui/button';
import { ImagePlus, Sparkles, Wand2 } from 'lucide-react';
import Image from 'next/image';

export function UploadPhotoCTA() {
  return (
    <section className="py-24 container mx-auto px-4">
      <div className="bg-[linear-gradient(135deg,#FFF0F5_0%,#FFDCE8_100%)] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 border-4 border-white shadow-2xl relative overflow-hidden">
        <Sparkles className="absolute top-10 left-10 text-primary opacity-20 h-20 w-20 animate-pulse" />
        
        <div className="relative w-full md:w-1/2 aspect-square max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-white group rotate-2 hover:rotate-0 transition-transform duration-500">
           <Image 
             src="https://picsum.photos/seed/upload-demo/600/600" 
             alt="Photo Gifting" 
             fill 
             className="object-cover group-hover:scale-110 transition-transform duration-700" 
             data-ai-hint="photo print gift"
           />
           <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <Wand2 className="h-16 w-16 text-white drop-shadow-lg" />
           </div>
        </div>

        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="space-y-4">
            <h3 className="text-4xl md:text-5xl font-headline font-black text-slate-800 leading-tight">
              Turn Memories Into <br />
              <span className="text-primary italic">Handcrafted Art</span>
            </h3>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Upload your favorite photos and we'll print them on premium mugs, cushions, and more. The perfect personal touch for your loved ones.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start pt-4">
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-8 h-auto font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20">
              <ImagePlus className="h-5 w-5" /> Upload Your Photo
            </Button>
            <Button variant="outline" className="rounded-full border-2 border-primary text-primary hover:bg-primary/5 px-10 py-8 h-auto font-black uppercase tracking-widest">
              View Photo Gifts
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
