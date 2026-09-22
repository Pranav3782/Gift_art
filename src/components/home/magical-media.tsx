"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';
import Image from 'next/image';

const DEFAULT_MOCK = {
  title: "Magical Reels",
  cards: [
    { id: 1, title: "Handcrafting Your Gifts", thumbnailUrl: "https://picsum.photos/seed/reels-1/450/800", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
    { id: 2, title: "Studio Magic", thumbnailUrl: "https://picsum.photos/seed/reels-2/450/800", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
    { id: 3, title: "Maya's Unboxing", thumbnailUrl: "https://picsum.photos/seed/reels-3/450/800", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { id: 4, title: "Gift Preview", thumbnailUrl: "https://picsum.photos/seed/reels-4/450/800", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" }
  ]
};

export function MagicalMedia({ cms }: { cms?: any }) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const data = cms || DEFAULT_MOCK;
  const reels = data.cards?.slice(0, 8) || DEFAULT_MOCK.cards;

  return (
    <section className="hidden md:block py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 space-y-3">
          <h2 className="font-headline font-black text-4xl md:text-5xl text-slate-800 tracking-tight">
            {data.title || DEFAULT_MOCK.title}
          </h2>
          <p className="text-slate-400 font-medium text-sm md:text-base max-w-2xl mx-auto">
            See our products in action through the eyes of happy little hearts.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto">
          {reels.map((reel: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative aspect-[9/16] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group cursor-pointer shadow-xl bg-slate-50 border-4 border-white"
              onClick={() => reel.url && setSelectedVideo(reel.url)}
            >
              <Image 
                src={reel.thumbnailUrl} 
                alt={reel.title} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute top-4 left-4 md:top-6 md:left-6">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white">
                  <Eye className="h-3 w-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">1.2K</span>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white font-black text-xs md:text-sm leading-tight uppercase tracking-tight">
                  {reel.title}
                </h3>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-2xl">
                  <Play className="h-5 w-5 text-sky-400 fill-sky-400 ml-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="rounded-full px-12 py-8 h-auto bg-sky-600 text-white font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 group">
            <Link href="/collections" className="flex items-center gap-3">
              View All Media <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden bg-black border-none rounded-[3rem] aspect-[9/16] shadow-2xl">
          <DialogTitle className="sr-only">Magical Reel Player</DialogTitle>
          <div className="relative h-full w-full">
            {selectedVideo && (
              <video 
                src={selectedVideo} 
                className="w-full h-full object-cover" 
                controls 
                autoPlay 
                loop
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}