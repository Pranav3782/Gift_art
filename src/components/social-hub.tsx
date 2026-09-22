
"use client";

import Image from 'next/image';
import { Instagram, Sparkles } from 'lucide-react';

const SOCIAL_POSTS = [
  { id: 1, seed: 'kids-happy-unboxing' },
  { id: 2, seed: 'toddler-cute-backpack' },
  { id: 3, seed: 'kids-birthday-gifts' },
  { id: 4, seed: 'kids-school-ready' },
  { id: 5, seed: 'baby-nursery-decor' },
];

export function SocialHub() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Small decorative sparkle */}
      <Sparkles className="absolute top-10 right-10 text-primary/10 h-16 w-16" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl md:text-4xl font-headline font-black text-slate-800">
            Magic Moments on <span className="text-primary italic">Instagram</span>
          </h2>
          <p className="text-slate-500 font-medium italic">Join our community of happy parents @giftartstudio</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {SOCIAL_POSTS.map((post) => (
            <div key={post.id} className="aspect-square relative rounded-[2rem] overflow-hidden group bg-pink-50 border-4 border-white shadow-md hover:shadow-xl transition-all">
              <Image 
                src={`https://picsum.photos/seed/${post.seed}/500/500`} 
                alt="Instagram post" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                data-ai-hint="kids lifestyle"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="text-white h-10 w-10 drop-shadow-md" />
              </div>
            </div>
          ))}
          
          <div className="aspect-square relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary to-orange-400 flex flex-col items-center justify-center text-white p-4 text-center cursor-pointer hover:scale-[1.05] transition-transform shadow-xl group border-4 border-white">
             <Instagram className="h-10 w-10 mb-2 group-hover:rotate-12 transition-transform" />
             <div className="font-black text-sm uppercase tracking-wider">Follow The Magic</div>
             <div className="text-[10px] font-black opacity-80 mt-1">@giftartstudio</div>
          </div>
        </div>
      </div>
    </section>
  );
}
