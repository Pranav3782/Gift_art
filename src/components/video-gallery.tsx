
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Play, Eye, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const VIDEOS = [
  {
    id: 1,
    title: "Handcrafting Your Gifts",
    thumbnail: "https://picsum.photos/seed/kids-craft/450/800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    views: "1.2k",
    duration: "0:15"
  },
  {
    id: 2,
    title: "Studio Magic",
    thumbnail: "https://picsum.photos/seed/kids-studio/450/800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    views: "892",
    duration: "0:12"
  },
  {
    id: 3,
    title: "Maya's Unboxing",
    thumbnail: "https://picsum.photos/seed/kids-review/450/800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    views: "2.3k",
    duration: "0:25"
  },
  {
    id: 4,
    title: "Gift Preview",
    thumbnail: "https://picsum.photos/seed/kids-unbox/450/800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    views: "567",
    duration: "0:18"
  }
];

export function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const selectedVideoData = VIDEOS.find(v => v.videoUrl === selectedVideo);

  return (
    <section id="videos" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-black text-[11px] uppercase tracking-wider">
            <Play className="h-3 w-3 fill-primary" />
            <span>Watch the Magic</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-headline font-black tracking-tight text-slate-800">
            Magical <span className="text-primary italic">Reels</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            See our products in action through the eyes of happy little hearts.
          </p>
        </div>

        <div className="flex overflow-x-auto pb-12 scrollbar-hide -mx-4 px-4 gap-6 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-4 md:mx-0 md:px-0 md:pb-0 md:gap-8">
          {VIDEOS.map((video) => (
            <div 
              key={video.id} 
              className="flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-none snap-center group cursor-pointer space-y-4"
              onClick={() => setSelectedVideo(video.videoUrl)}
            >
              <div className="relative aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl border-4 border-white ring-1 ring-pink-100">
                <Image 
                  src={video.thumbnail} 
                  alt={video.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  data-ai-hint="kids reel"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white text-[10px] font-black uppercase z-10 border border-white/30">
                  <Eye className="h-3 w-3" />
                  {video.views}
                </div>

                <div className="absolute bottom-5 left-5 right-5 z-10">
                  <h3 className="text-sm font-black text-white leading-tight line-clamp-2">
                    {video.title}
                  </h3>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                  <div className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl">
                    <Play className="h-5 w-5 text-primary fill-primary ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden bg-black border-none rounded-[3rem] aspect-[9/16]">
          <DialogTitle className="sr-only">
            {selectedVideoData ? `Video: ${selectedVideoData.title}` : "Magical Reel Player"}
          </DialogTitle>
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
