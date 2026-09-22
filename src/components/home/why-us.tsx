'use client';

import { motion } from 'framer-motion';
import { Star, Smile, Heart } from 'lucide-react';
import { TornPaper } from '@/components/ui/torn-paper';

const DEFAULT_MOCK = {
  title: "Why Choose Us",
  description: "Enduring with this spirit where sky is even not the limit, GiftArtStudio continues to add sunshine in the lives of your darling rainbows.",
  cards: [
    { title: 'Exclusive Collections', description: 'On our toes with the ever evolving dynamics and keeping up the exclusivity.', iconUrl: '/images/why-choose-us/exclusive-collections.svg' },
    { title: 'Happiness Guaranteed', description: 'Unbox sheer excitement and joy wrapped within each of our offerings.', iconUrl: '/images/why-choose-us/happiness-guaranteed.svg' },
    { title: 'We Care', description: 'Designing customised and child-friendly products to promote imagination and life-skills.', iconUrl: '/images/why-choose-us/we-care.svg' }
  ]
};

const FallbackIcons = [Star, Smile, Heart];

export function WhyUs({ cms }: { cms?: any }) {
  const data = cms || DEFAULT_MOCK;
  const cards = data.cards?.slice(0, 3) || DEFAULT_MOCK.cards;

  return (
    <section className="hidden md:block relative bg-white overflow-hidden py-12">
      {/* Light Blue background banner patch wrapper */}
      <div className="bg-[#EAF6FF] py-20 relative">
        {/* Torn Paper Top Border */}
        <TornPaper position="top" className="absolute top-0 left-0 right-0 z-30" />

        <div className="container mx-auto px-4 max-w-6xl relative z-20 my-6">
          {/* Centered White Card providing breathing space and structure */}
          <div className="bg-white rounded-[3.5rem] shadow-xl shadow-sky-900/5 p-12 md:p-16 max-w-5xl mx-auto border border-sky-100/50">
            {/* Section Header */}
            <div className="text-center mb-16 space-y-3">
              <span className="text-[12px] font-black text-sky-500 uppercase tracking-[0.3em] block">
                OUR PROMISE
              </span>
              <h2 className="text-4xl md:text-5xl font-headline font-black text-slate-800 tracking-tight">
                {data.title || DEFAULT_MOCK.title}
              </h2>
              <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium pt-2">
                {data.description || DEFAULT_MOCK.description}
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {cards.map((feature: any, i: number) => {
                const IconComp = FallbackIcons[i] || Heart;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center space-y-6 group"
                  >
                    {/* Floating Line Icon directly on White Card to match design reference */}
                    <div className="w-24 h-24 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6">
                      {feature.iconUrl ? (
                        <img src={feature.iconUrl} alt={feature.title} className="w-20 h-20 object-contain" />
                      ) : (
                        <IconComp className="w-20 h-20 text-sky-500" />
                      )}
                    </div>
                    <h4 className="text-xl md:text-2xl font-headline font-black text-[#0ea5e9]">
                      {feature.title}
                    </h4>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium px-4">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Torn Paper Bottom Border */}
        <TornPaper position="bottom" className="absolute bottom-0 left-0 right-0 z-30" />
      </div>
    </section>
  );
}