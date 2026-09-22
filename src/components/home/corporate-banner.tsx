
"use client";

import { Button } from '@/components/ui/button';
import { Briefcase, CheckCircle2, ChevronRight, Package, Globe, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  { icon: Package, label: 'Bulk Orders' },
  { icon: Award, label: 'Employee kits' },
  { icon: Briefcase, label: 'Client Gifts' },
  { icon: Globe, label: 'Global Shipping' }
];

export function CorporateBanner() {
  return (
    <section className="py-24 container mx-auto px-4">
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 group shadow-2xl">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="flex-1 space-y-10 relative z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md">
            <Briefcase className="h-4 w-4 text-sky-400" />
            <span className="text-[10px] font-black text-sky-400 uppercase tracking-[0.25em]">Bespoke Solutions</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-headline font-black text-white leading-[1.1]">
            Corporate Gifting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 italic">Made Memorable</span>
          </h2>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Elevate your brand presence with custom welcome kits, premium employee rewards, and bespoke client gifts tailored to your identity.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {FEATURES.map((feat) => (
               <div key={feat.label} className="flex items-center gap-2 text-[10px] font-black text-slate-300 bg-white/5 px-4 py-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                 <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" />
                 {feat.label.toUpperCase()}
               </div>
             ))}
          </div>

          <div className="pt-6">
            <Button asChild size="lg" className="rounded-full bg-white hover:bg-slate-100 text-slate-900 px-12 py-8 h-auto font-black uppercase tracking-widest gap-3 shadow-xl group/btn transition-all">
              <Link href="/contact?subject=corporate">
                Get Bulk Quote <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-lg aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 rounded-[3rem] border border-white/20 p-8 shadow-2xl backdrop-blur-xl group-hover:rotate-1 transition-transform duration-700">
           <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
              <img 
                src="https://picsum.photos/seed/corp-set-demo/800/600" 
                alt="Corporate Gift Sets" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-400" /> Premium Curation
                </p>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
