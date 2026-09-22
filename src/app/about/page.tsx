'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { KidsDecor } from '@/components/kids-decor';
import { Heart, Sparkles, ShieldCheck, Users, Star, Quote } from 'lucide-react';
import { WavySeparator } from '@/components/ui/wavy-separator';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />
      <KidsDecor />
      
      {/* Hero Header */}
      <div className="bg-[linear-gradient(135deg,#F0F9FF,#E0F2FE)] pt-32 pb-24 text-center border-b border-sky-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black text-sky-600 uppercase tracking-[0.3em] mb-4 block">The Heart of GiftArtStudio</span>
            <h1 className="text-5xl md:text-7xl font-headline font-black text-slate-800 mb-6">
              Our <span className="text-primary-foreground italic">Story</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium italic">
              "Creating magical keepsakes for life's most precious milestones."
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24 max-w-6xl relative z-10">
        
        {/* Meet Rohan Section */}
        <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Star className="h-3.5 w-3.5 fill-sky-600" />
              Meet the Founder
            </div>
            <h2 className="text-4xl md:text-5xl font-headline font-black text-slate-800 leading-tight">
              A Personal Journey <br />
              <span className="text-sky-600 italic">By Rohan</span>
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed font-medium text-lg">
              <p>
                Hi, I'm <span className="text-slate-900 font-black underline decoration-sky-200 underline-offset-4">Rohan</span>, the founder and owner of GiftArtStudio. My journey started in 2018 with a simple realization: in a world of mass production, the true magic lies in the personal touch.
              </p>
              <p>
                I've always been passionate about craftsmanship and the joy that a thoughtful gift can bring to a child's face. GiftArtStudio was born from the desire to create more than just products—I wanted to create companions for childhood adventures and keepsakes that families would cherish forever.
              </p>
              <p>
                Every backpack, lunch bag, and personalized accessory that leaves our studio is a piece of my vision. I personally ensure that we use only the highest quality materials and the safest inks, because your children deserve nothing but the absolute best.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] bg-white rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-[16px] border-white group">
              <Image 
                src="https://picsum.photos/seed/rohan-owner/800/1000" 
                alt="Rohan - Founder of GiftArtStudio" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                data-ai-hint="owner founder"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Founder & Owner</p>
                <h3 className="text-3xl font-headline font-black">Rohan</h3>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>

        <WavySeparator className="my-24" />

        {/* Philosophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {[
            { 
              icon: Heart, 
              title: "Handcrafted Love", 
              desc: "Every item is meticulously prepared in our boutique studio, ensuring a level of care that machines simply can't replicate." 
            },
            { 
              icon: Sparkles, 
              title: "Uniquely Yours", 
              desc: "Personalization isn't an add-on; it's our core. We believe every child's world should reflect their unique personality." 
            },
            { 
              icon: ShieldCheck, 
              title: "Safe & Durable", 
              desc: "Rohan's promise: we use only child-safe materials and robust stitching meant to last through years of play." 
            }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 hover:shadow-xl transition-all duration-500 text-center space-y-6 group"
            >
              <div className="w-20 h-20 bg-sky-50 rounded-[2rem] flex items-center justify-center mx-auto text-sky-600 group-hover:rotate-6 transition-transform">
                <item.icon className="h-10 w-10" />
              </div>
              <h4 className="text-xl font-headline font-black text-slate-800">{item.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed italic">"{item.desc}"</p>
            </motion.div>
          ))}
        </div>

        {/* Commitment Quote */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px]" />
          
          <Quote className="w-16 h-16 text-sky-400/20 mx-auto" />
          
          <h2 className="text-3xl md:text-5xl font-headline font-black text-white leading-tight max-w-4xl mx-auto">
            "My goal is to make every gift a milestone, and every unboxing a magical memory for your little ones."
          </h2>
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-1 bg-sky-500 rounded-full" />
            <p className="text-sky-400 font-black uppercase tracking-[0.4em] text-xs">Rohan • GiftArtStudio Owner</p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-32">
          {[
            { label: "Families Served", val: "50k+", icon: Users },
            { label: "Gifts Crafted", val: "120k+", icon: Heart },
            { label: "Happy Reviews", val: "15k+", icon: Star },
            { label: "Cities Reached", val: "500+", icon: ShieldCheck }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <p className="text-4xl font-black text-slate-800">{stat.val}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
