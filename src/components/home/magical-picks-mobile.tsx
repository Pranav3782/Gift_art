
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';

const DEFAULT_REELS = [
  { title: "Heartwarming Moments", thumbnailUrl: "https://picsum.photos/seed/mreel1/300/533", videoUrl: "" },
  { title: "Travel Adventures", thumbnailUrl: "https://picsum.photos/seed/mreel2/300/533", videoUrl: "" },
  { title: "Celebration Vibes", thumbnailUrl: "https://picsum.photos/seed/mreel3/300/533", videoUrl: "" },
  { title: "Gift Happiness", thumbnailUrl: "https://picsum.photos/seed/mreel4/300/533", videoUrl: "" }
];

export function MagicalPicksMobile({ cms }: { cms?: any }) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const reels = cms?.data?.reels || DEFAULT_REELS;

  return (
    <section className="md:hidden py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-10 space-y-2">
          <h2 className="font-headline font-black text-3xl text-slate-800 tracking-tight">
            Magical <span className="text-sky-400">Reels</span>
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-[280px] mx-auto leading-relaxed">
            {cms?.subtitle || "See our products in action through the eyes of happy little hearts."}
          </p>
        </div>

        {/* Reels Row - Exactly 4 cards in one row */}
        <div className="flex gap-2 w-full">
          {reels.slice(0, 4).map((reel: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="relative flex-1 aspect-[9/16] rounded-[18px] overflow-hidden group cursor-pointer shadow-md bg-slate-50"
              onClick={() => reel.videoUrl && setSelectedVideo(reel.videoUrl)}
            >
              {/* Thumbnail */}
              {reel.thumbnailUrl ? (
                <Image 
                  src={reel.thumbnailUrl} 
                  alt={reel.title} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white/50" />
                </div>
              )}

              {/* Top Icon Overlay */}
              <div className="absolute top-2 left-2 w-5 h-5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-white fill-white" />
              </div>

              {/* Overlay Gradient & Title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <h3 className="text-white font-black text-[9px] leading-tight uppercase tracking-tighter">
                  {reel.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden bg-black border-none rounded-[3rem] aspect-[9/16] shadow-2xl">
          <DialogTitle className="sr-only">Magical Reels Player</DialogTitle>
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
