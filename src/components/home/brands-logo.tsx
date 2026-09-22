import Image from 'next/image';

export function BrandsLogo() {
  return (
    <section className="py-20 bg-white border-t border-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Featured & Trusted By</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="relative w-24 h-12">
              <Image 
                src={`https://picsum.photos/seed/brand${i}/200/100`} 
                alt="Brand" 
                fill 
                className="object-contain" 
                data-ai-hint="logo company"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
