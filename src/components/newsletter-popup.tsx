"use client";

import { useState, useEffect, useMemo } from 'react';
import { X, Facebook, Instagram, Twitter, CheckSquare, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export function NewsletterPopup() {
  const db = useFirestore();
  
  // Guard against undefined db during SSR
  const configRef = useMemo(() => db ? doc(db, 'homepage_sections', 'newsletter-popup') : null, [db]);
  const { data: config, loading } = useDoc<any>(configRef);
  
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (loading || !config || config.isVisible === false) return;

    const isHidden = localStorage.getItem('hideNewsletterPopup');
    if (!isHidden) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, config]);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideNewsletterPopup', 'true');
    }
    setIsOpen(false);
  };

  const TikTokIcon = () => (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-4 h-4"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );

  if (loading || !config || config.isVisible === false) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="newsletter-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#FEF3E2] rounded-[2.5rem] shadow-2xl border-[3px] border-dashed border-sky-400 mx-auto scrollbar-hide"
            >
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-[#FF6B95] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 md:p-12 space-y-6 text-center">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    {config.subtitle || "Sign Up Newsletter"}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-headline font-black text-[#2D3663] tracking-tight">
                    {config.title || "NEWSLETTER"}
                  </h2>
                </div>
                
                <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed mx-auto max-w-md">
                  {config.description || "Get 15% off your first purchase! Plus, be the first to know about sales, new product launches and exclusive offers!"}
                </p>

                <div className="relative max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row bg-white rounded-3xl sm:rounded-full p-1.5 shadow-sm border border-slate-100 items-center gap-2 sm:gap-0">
                    <input 
                      type="email" 
                      placeholder={config.data?.placeholder || "Enter Your Email"} 
                      className="bg-transparent border-none outline-none px-6 py-3 text-slate-700 flex-1 text-sm font-bold placeholder:text-slate-300 w-full sm:w-auto"
                    />
                    <button className="bg-[#FF6B95] text-white px-8 py-3 rounded-2xl sm:rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md active:scale-95 w-full sm:w-auto whitespace-nowrap">
                      {config.ctaText || "Subscribe"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 pt-2">
                  <Facebook className="w-5 h-5 text-slate-800 cursor-pointer hover:text-[#FF6B95] transition-colors" />
                  <Instagram className="w-5 h-5 text-slate-800 cursor-pointer hover:text-[#FF6B95] transition-colors" />
                  <Twitter className="w-5 h-5 text-slate-800 cursor-pointer hover:text-[#FF6B95] transition-colors fill-current" />
                  <TikTokIcon />
                </div>

                <div className="pt-4 flex justify-center">
                  <button 
                    onClick={() => setDontShowAgain(!dontShowAgain)}
                    className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest group"
                  >
                    {dontShowAgain ? (
                      <CheckSquare className="w-4 h-4 text-[#FF6B95]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                    )}
                    {config.data?.checkboxLabel || "Don't show this popup again"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}