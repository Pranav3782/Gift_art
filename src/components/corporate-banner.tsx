
import { Button } from '@/components/ui/button';
import { Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function CorporateBanner() {
  return (
    <section className="py-24 container mx-auto px-4">
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
        
        <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
            <Briefcase className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Bulk & Business Gifting</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-headline font-black text-white leading-tight">
            Elevate Your <br />
            <span className="text-primary italic">Corporate Presence</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto md:mx-0">
            Custom branded kits, premium employee rewards, and bespoke client gifts tailored to your brand.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
             {[ 'Logo Branding', 'Custom Packaging', 'Global Delivery' ].map(feat => (
               <div key={feat} className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 px-4 py-2 rounded-xl">
                 <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {feat}
               </div>
             ))}
          </div>
          <Button asChild className="rounded-full bg-white hover:bg-slate-100 text-slate-900 px-10 py-8 h-auto font-black uppercase tracking-widest gap-2">
            <Link href="/contact?subject=corporate">Get Quote <ChevronRight className="h-5 w-5" /></Link>
          </Button>
        </div>

        <div className="flex-1 relative aspect-[4/3] w-full max-w-md bg-white/5 rounded-[2rem] border border-white/10 p-4 shadow-2xl backdrop-blur-sm group-hover:-rotate-1 transition-transform duration-500">
           <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
             <Briefcase className="w-64 h-64 text-white" />
           </div>
           <div className="relative z-10 h-full w-full rounded-[1.5rem] bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-sm italic p-12 text-center">
             Premium Corporate Gift Sets Visual
           </div>
        </div>
      </div>
    </section>
  );
}
