'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { FileText, CreditCard, Gift, Scale, ShieldAlert, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsConditionsPage() {
  const lastUpdated = "May 24, 2024";

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-slate-50 pt-28 pb-20 lg:pt-36 text-center border-b border-slate-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-headline font-black text-slate-800 mb-4 tracking-tight">Terms & <span className="text-sky-600 italic">Conditions</span></h1>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Revised: {lastUpdated}</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="space-y-12">
          
          {[
            {
              icon: FileText,
              title: "Agreement to Terms",
              desc: "By accessing GiftArtStudio and placing an order, you agree to be bound by these terms. If you disagree with any part, you may not access our services."
            },
            {
              icon: Gift,
              title: "Personalized Orders",
              desc: "Personalization details are final once the crafting process begins (usually within 2 hours of order placement). Customers are responsible for verifying spellings and selections before checkout."
            },
            {
              icon: CreditCard,
              title: "Pricing & Payments",
              desc: "All prices are in INR and subject to change. Payments must be made in full via our secure gateways. We reserve the right to cancel orders in case of pricing errors."
            },
            {
              icon: Globe,
              title: "Intellectual Property",
              desc: "All designs, logos, and custom graphics created by GiftArtStudio are our intellectual property. Unauthorized reproduction or use is strictly prohibited."
            },
            {
              icon: ShieldAlert,
              title: "Limitation of Liability",
              desc: "GiftArtStudio shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our products or website."
            },
            {
              icon: Scale,
              title: "Governing Law",
              desc: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Noida, Uttar Pradesh."
            }
          ].map((term, i) => (
            <motion.section 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 group hover:shadow-xl transition-all duration-500"
            >
              <div className="flex items-center gap-6 mb-6">
                <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 shadow-inner group-hover:rotate-6 transition-transform">
                  <term.icon className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-headline font-black text-slate-800 uppercase tracking-tight">{term.title}</h2>
              </div>
              <p className="text-slate-500 leading-relaxed font-medium text-lg italic pl-20 border-l-4 border-sky-100">
                {term.desc}
              </p>
            </motion.section>
          ))}

        </div>

        <div className="mt-20 p-12 border-4 border-dashed border-sky-100 rounded-[3rem] text-center">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-2">Need Clarification?</h3>
          <p className="text-slate-400 mb-6 font-medium italic">"We believe in transparency. If any term is unclear, please reach out to us."</p>
          <button className="bg-sky-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-sky-700 transition-colors shadow-xl shadow-sky-100">Chat with Us</button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
