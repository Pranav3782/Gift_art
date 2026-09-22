"use client";

import Image from 'next/image';
import { Heart, Instagram, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const IG_POSTS = [
  { user: '@momlife_neha', likes: '1.2k', review: 'My daughter absolutely loved her personalized unicorn backpack.', product: 'Unicorn Backpack', img: 'https://picsum.photos/seed/ig1/500/500' },
  { user: '@papa_vicky', likes: '890', review: 'Perfect corporate gifts for our new team members. High quality!', product: 'Luxe Wallet', img: 'https://picsum.photos/seed/ig2/500/500' },
  { user: '@creative_riya', likes: '2.1k', review: 'The dino bottle is a hit! No leaks and looks so cool.', product: 'Rocket Bottle', img: 'https://picsum.photos/seed/ig3/500/500' },
  { user: '@sharma_family', likes: '1.5k', review: 'Birthday return gifts solved. Kids were so happy.', product: 'School Kits', img: 'https://picsum.photos/seed/ig4/500/500' },
  { user: '@globetrotter_amit', likes: '760', review: 'Finally a passport holder that fits my style.', product: 'Travel Wallet', img: 'https://picsum.photos/seed/ig5/500/500' },
  { user: '@school_vibes', likes: '1.1k', review: 'Magical vibes in the classroom with this pouch.', product: 'Galaxy Pouch', img: 'https://picsum.photos/seed/ig6/500/500' },
];

export function InstagramSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 text-pink-100 animate-pulse opacity-20">
        <Sparkles className="w-full h-full" />
      </div>
      <Heart className="absolute bottom-20 left-10 w-12 h-12 text-rose-100 animate-float opacity-40" />
      <Star className="absolute top-40 left-1/4 w-8 h-8 text-amber-100 animate-pulse" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
            <Instagram className="h-3.5 w-3.5" />
            <span>Social Magic</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-headline font-black text-slate-800 tracking-tight">
            Loved By Families <span className="text-rose-500 italic">On Instagram</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
            Real smiles. Real moments. Real families loving their GiftArt creations.
          </p>
        </div>

        <div className="flex overflow-x-auto pb-12 scrollbar-hide -mx-4 px-4 gap-6 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:mx-0 sm:px-0 sm:pb-0 sm:gap-8">
          {IG_POSTS.map((post, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="flex-[0_0_85%] sm:flex-none snap-center bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden group"
            >
              <div className="relative aspect-square">
                <Image src={post.img} alt="IG Post" fill className="object-cover" data-ai-hint="happy child gift" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl">
                  <Instagram className="h-4 w-4 text-pink-600" />
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-slate-800 tracking-wider">{post.user}</span>
                  <div className="flex items-center gap-1 text-rose-500 font-bold text-[10px]">
                    <Heart className="h-3 w-3 fill-rose-500" /> {post.likes}
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"{post.review}"</p>
                <div className="pt-4 border-t border-slate-50">
                  <span className="text-[9px] font-black uppercase text-sky-600 tracking-widest bg-sky-50 px-3 py-1.5 rounded-full">
                    {post.product}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
