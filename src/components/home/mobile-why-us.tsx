'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MobileWhyUsProps {
  cms?: any;
}

const DEFAULT_FEATURES = [
  {
    title: 'Exclusive Collections',
    desc: 'One-of-a-kind gifts that make every moment special.',
    iconUrl: '/images/why-choose-us/exclusive-collections.svg',
  },
  {
    title: 'Happiness Guaranteed',
    desc: 'Crafted with love to deliver smiles on every occasion.',
    iconUrl: '/images/why-choose-us/happiness-guaranteed.svg',
  },
  {
    title: 'We Care',
    desc: 'Supporting communities and the environment in every step we take.',
    iconUrl: '/images/why-choose-us/we-care.svg',
  }
];

export function MobileWhyUs({ cms }: MobileWhyUsProps) {
  const features = cms?.cards?.length ? cms.cards : DEFAULT_FEATURES;

  return (
    <section className="md:hidden px-4 py-8">
      <div className="bg-[#F5FBFF] rounded-[24px] p-6 md:p-8 space-y-8 shadow-sm border border-sky-50">

        {/* Header Area */}
        <div className="text-center space-y-2">
          <p className="text-[12px] font-bold text-sky-400 uppercase tracking-widest">
            {cms?.subtitle || "Our Promise"}
          </p>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
            {cms?.title || "Why Choose Us"}
          </h2>
          <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto pt-2">
            {cms?.description || "Gifts only with the spirit of love & care for little, Little Gifts has millions of satisfied customers & forums for our lasting assurances."}
          </p>
        </div>

        {/* Feature Rows */}
        <div className="space-y-5">
          {features.map((feat: any, i: number) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              {/* Icon */}
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={feat.iconUrl}
                    alt={feat.title}
                    className="w-9 h-9 object-contain"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="space-y-1 flex-1 pt-1">
                <h4 className="text-sm font-black text-sky-500 tracking-tight">
                  {feat.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              {/* Decorative dot marker */}
              <div className="shrink-0 pt-1">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-sky-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
