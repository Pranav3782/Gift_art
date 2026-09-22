
"use client";

import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function FeatureHighlight() {
  return (
    <section className="py-10 md:py-24 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-24">
          
          {/* Side: Content */}
          <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="space-y-4 md:space-y-6"
            >
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="h-[2px] w-6 md:w-8 bg-sky-200" />
                <span className="text-[9px] md:text-[10px] font-black text-sky-400 uppercase tracking-[0.3em]">Handcrafted Luxury</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl xl:text-6xl font-headline font-black text-slate-800 leading-[1.2] tracking-tight">
                Personalized Bliss For <br />
                <span className="text-primary-foreground italic relative inline-block">
                  Precious Moments
                  <svg className="absolute -bottom-2 left-0 w-full h-1.5 md:h-2.5 text-sky-100" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>
              </h2>
              
              <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Our bespoke collections are designed to capture the essence of childhood. Every stitch is a promise of quality and joy.
              </p>
            </motion.div>

            <motion.ul 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 md:gap-y-4 gap-x-8 max-w-[280px] md:max-w-md mx-auto lg:mx-0 text-left"
            >
              {['Premium Fabrics', 'Custom Printing', 'Eco-Friendly Inks', 'Handmade Love'].map(item => (
                <motion.li 
                  key={item}
                  variants={{ initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 } }}
                  className="flex items-center gap-3 text-xs md:text-sm font-bold text-slate-600"
                >
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 md:h-3.5 md:w-3.5 text-emerald-500" />
                  </div>
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: true }}
              className="pt-2 flex flex-col sm:flex-row justify-center lg:justify-start gap-4 items-center"
            >
              <Button asChild size="lg" className="w-[90%] sm:w-auto rounded-full bg-[#FF6B95] hover:bg-[#F43F5E] text-white px-10 py-6 md:py-8 h-auto font-black uppercase tracking-widest text-xs md:text-sm shadow-xl active:scale-95 transition-all">
                <Link href="/customization" className="flex items-center justify-center gap-2">
                  Shop Now <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-[90%] sm:w-auto rounded-full border-2 border-slate-100 text-slate-500 hover:bg-slate-50 px-8 py-6 md:py-8 h-auto font-black uppercase tracking-widest text-xs active:scale-95 transition-all">
                <Link href="/about" className="flex items-center justify-center gap-2">
                  Our Story <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Side: Organic Blob Shape with Kids Decorations */}
          <div className="flex-1 relative w-full lg:w-1/2 flex justify-center order-2 lg:order-1 pt-12 pb-16 md:py-0">
            <div className="relative w-full aspect-square max-w-[240px] md:max-w-md">
               
               {/* ☀️ Smiling Sun - Top Left */}
               <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -left-6 md:-top-16 md:-left-12 w-16 h-16 md:w-28 md:h-28 z-20"
               >
                 <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400 fill-current">
                   <circle cx="50" cy="50" r="25" />
                   {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                     <line 
                        key={angle}
                        x1="50" y1="20" x2="50" y2="5"
                        stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                        transform={`rotate(${angle} 50 50)`}
                     />
                   ))}
                   {/* Smile */}
                   <circle cx="43" cy="45" r="3" fill="#334155" />
                   <circle cx="57" cy="45" r="3" fill="#334155" />
                   <path d="M40 55 Q 50 65 60 55" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                 </svg>
               </motion.div>

               {/* 🚀 Rocket Overlap - Mid Left */}
               <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[-20px] top-[25%] md:left-[-40px] z-30 w-16 md:w-32 pointer-events-none"
               >
                 {/* Trailing Swiggle Lines */}
                 <svg className="absolute -left-12 top-1/2 w-16 h-8 text-sky-100 -translate-y-1/2 -z-10 opacity-60" viewBox="0 0 100 40">
                   <path d="M0 20 Q 25 10 50 20 T 100 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                 </svg>
                 <img 
                   src="https://rohanwakkar.sirv.com/rocket%20.png" 
                   alt="Rocket" 
                   className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.1)] -rotate-12"
                 />
               </motion.div>

               {/* Accent Stroke: Yellow (Top Right) */}
               <div className="absolute -top-4 -right-4 w-24 h-24 border-t-8 border-r-8 border-amber-200/40 rounded-tr-[4rem] -z-10" />
               
               {/* Accent Stroke: Blue (Bottom Left) */}
               <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-8 border-l-8 border-sky-200/40 rounded-bl-[4rem] -z-10" />

               {/* Main Organic Blob Frame */}
               <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative w-full h-full bg-white shadow-[0_30px_60px_-10px_rgba(0,0,0,0.08)] blob-shape border-[8px] md:border-[16px] border-slate-50/50 overflow-hidden z-10"
               >
                  <Image 
                    src="https://rohanwakkar.sirv.com/ChatGPT%20Image%20Jun%206%2C%202026%2C%2008_36_50%20PM.png"
                    alt="Personalized Bliss"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    data-ai-hint="personalized gift"
                  />
               </motion.div>

               {/* ✨ Sparkles & Stars - Bottom Right */}
               <motion.div 
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-8 -right-4 md:-bottom-12 md:-right-8 flex gap-4 z-20"
               >
                 <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-sky-400" />
                 <div className="mt-4 rotate-12">
                   <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-10 md:h-10 text-amber-300 fill-current">
                     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                   </svg>
                 </div>
               </motion.div>
            </div>
          </div>

        </div>
      </div>
      <style jsx>{`
        .blob-shape {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
      `}</style>
    </section>
  );
}
