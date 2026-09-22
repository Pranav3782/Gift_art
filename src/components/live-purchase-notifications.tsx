'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

const PURCHASES = [
  {
    name: "Someone",
    product: "A perfect combo for pool",
    location: "Jalna, India",
    time: "2 hours ago",
    image: "https://rohanwakkar.sirv.com/toneed.png"
  },
  {
    name: "Sneha",
    product: "K pop theme Personalized mat set combo",
    location: "Pune, India",
    time: "15 mins ago",
    image: "https://rohanwakkar.sirv.com/bags%201vs.png"
  },
  {
    name: "Anjali",
    product: "Universal gadget pouch",
    location: "Mumbai, India",
    time: "45 mins ago",
    image: "https://rohanwakkar.sirv.com/ChatGPT%20Image%20Jun%2019%2C%202026%2C%2009_00_07%20PM.png"
  },
  {
    name: "Someone",
    product: "Personalized Temperature Bottle",
    location: "Delhi, India",
    time: "1 hour ago",
    image: "https://rohanwakkar.sirv.com/ChatGPT%20Image%20Jun%2019%2C%202026%2C%2009_05_54%20PM.png"
  },
  {
    name: "Vikram",
    product: "Velvet Jewellery Organiser Box",
    location: "Bangalore, India",
    time: "3 hours ago",
    image: "https://rohanwakkar.sirv.com/ChatGPT%20Image%20Jun%2019%2C%202026%2C%2009_08_49%20PM.png"
  }
];

export function LivePurchaseNotifications() {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Initial display after 8 seconds
    const startTimer = setTimeout(() => {
      setShow(true);
    }, 8000);

    const interval = setInterval(() => {
      setShow(false);
      // Wait for exit transition, then load next purchase and display
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % PURCHASES.length);
        setShow(true);
      }, 800);
    }, 15000); // Trigger every 15 seconds

    // Hide popup after 6 seconds of display
    let hideTimer: NodeJS.Timeout;
    if (show) {
      hideTimer = setTimeout(() => {
        setShow(false);
      }, 6000);
    }

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [show]);

  if (PURCHASES.length === 0) return null;

  const current = PURCHASES[index];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="fixed bottom-24 lg:bottom-10 left-4 md:left-auto md:right-20 lg:right-24 z-[100] bg-white rounded-2xl shadow-2xl border border-slate-100 p-3.5 max-w-[320px] md:max-w-[360px] flex items-center gap-3.5"
        >
          {/* Product Thumbnail */}
          <div className="relative w-14 h-14 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-50">
            <Image 
              src={current.image} 
              alt={current.product} 
              fill 
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Text Info */}
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-[11px] font-medium text-slate-500 leading-tight">
              {current.name} recently bought a
            </p>
            <h4 className="text-xs font-black text-slate-800 truncate mt-0.5 leading-snug">
              {current.product}
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 font-bold">
              {current.time}, from {current.location}
            </p>
          </div>

          {/* Close button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShow(false);
            }}
            className="text-slate-300 hover:text-slate-500 transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
