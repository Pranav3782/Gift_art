'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ShieldCheck, Lock, Eye, Users, Bell, Cookie } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 24, 2024";

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Header */}
      <div className="bg-slate-50 pt-28 pb-20 lg:pt-36 text-center border-b border-slate-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-headline font-black text-slate-800 mb-4 tracking-tight">Privacy <span className="text-sky-600 italic">Policy</span></h1>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Last Updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="grid gap-8 md:gap-12">
          
          {[
            {
              icon: ShieldCheck,
              title: "Information Collection",
              desc: "We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email, shipping address, and payment details processed through our secure gateway."
            },
            {
              icon: Eye,
              title: "How We Use Your Data",
              desc: "Your data is used to process orders, provide customer support, and improve our services. With your consent, we may send you magical updates about new collections and exclusive studio offers."
            },
            {
              icon: Lock,
              title: "Data Security",
              desc: "We implement industry-standard security measures to protect your personal information. All transactions are processed through SSL-encrypted gateways to ensure your sensitive details remain private."
            },
            {
              icon: Users,
              title: "Third-Party Sharing",
              desc: "We never sell your data. We only share necessary details with trusted partners (like shipping carriers and payment processors) required to fulfill your order and deliver your gifts."
            },
            {
              icon: Cookie,
              title: "Cookies & Tracking",
              desc: "We use cookies to enhance your browsing experience, remember your bag items, and understand how you interact with our studio. You can manage cookie preferences through your browser settings."
            },
            {
              icon: Bell,
              title: "Your Rights",
              desc: "You have the right to access, correct, or delete your personal information at any time. Simply log into your account settings or contact our support assistants for help."
            }
          ].map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col md:flex-row gap-8 items-start hover:shadow-xl transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center shrink-0 text-sky-600 shadow-inner group-hover:scale-110 transition-transform">
                <section.icon className="h-7 w-7" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-headline font-black text-slate-800 uppercase tracking-tight">{section.title}</h2>
                <p className="text-slate-500 leading-relaxed font-medium text-lg italic">"{section.desc}"</p>
              </div>
            </motion.div>
          ))}

        </div>

        <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-center text-white relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[100px]" />
          <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Questions about your privacy?</h3>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto font-medium">Our studio assistants are ready to help you with any data-related queries.</p>
          <button className="bg-white text-slate-900 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-sky-50 transition-colors">Contact Privacy Team</button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
