
"use client";

import { Star, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function KidsDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 
        Background decorations simplified to prevent visual clutter.
        Clouds and ghosted rockets removed for a high-end luxury feel.
      */}

      {/* Subtle Magical Floating Icons - Very Low Opacity */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[10%] opacity-[0.03]"
      >
        <Star className="w-16 h-16 text-slate-400 fill-slate-400" />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.05, 0.03] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] right-[12%]"
      >
        <Sparkles className="w-12 h-12 text-sky-400" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[25%] left-[8%] opacity-[0.02]"
      >
        <Heart className="w-20 h-20 text-rose-400 fill-rose-400" />
      </motion.div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[10%] right-[15%] opacity-[0.03]"
      >
        <Star className="w-10 h-10 text-amber-400 fill-amber-400" />
      </motion.div>
    </div>
  );
}
