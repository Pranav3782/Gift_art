'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { KidsDecor } from '@/components/kids-decor';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const FAQ_DATA = [
  {
    category: "Ordering & Customization",
    questions: [
      { q: "How do I personalize my order?", a: "On each product page, you'll see a 'Personalize' box. Simply enter the name or text you'd like (max 12 characters) and we'll handle the rest!" },
      { q: "Can I change the name after placing the order?", a: "Changes can only be made within 2 hours of placing the order as our crafting process starts quickly. Please contact us on WhatsApp immediately for changes." },
      { q: "Do you offer gift wrapping?", a: "Yes! You can select premium gift wrapping at checkout for a small fee of ₹49. We include a beautiful ribbon and a handwritten-style note." }
    ]
  },
  {
    category: "Shipping & Delivery",
    questions: [
      { q: "How long will my order take to arrive?", a: "Standard orders take 3-5 business days. Personalized orders take 5-7 business days to account for our meticulous crafting process." },
      { q: "Is delivery free?", a: "Delivery is FREE on all orders above ₹999. For orders below that, a flat shipping fee of ₹99 applies." },
      { q: "Where do you ship from?", a: "All our magical gifts are handcrafted and shipped from our studio in Noida, Uttar Pradesh." }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      { q: "Can I return a personalized item?", a: "Unfortunately, personalized items cannot be returned or exchanged unless they are received damaged or have a manufacturing defect." },
      { q: "How do I initiate a return?", a: "Simply email us at care@giftartstudio.com or WhatsApp us with your order ID. Our team will guide you through the process." }
    ]
  }
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />
      <KidsDecor />
      
      <div className="bg-[linear-gradient(135deg,#F0F9FF,#E0F2FE)] pt-28 pb-20 lg:pt-36 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-headline font-black text-slate-800 mb-6">
            Frequently Asked <span className="text-primary-foreground italic">Questions</span>
          </h1>
          <div className="max-w-xl mx-auto relative">
            <Input placeholder="Search for answers..." className="h-14 pl-12 rounded-2xl bg-white border-2 border-sky-100 shadow-xl focus-visible:ring-primary" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl relative z-10">
        <div className="space-y-12">
          {FAQ_DATA.map((cat, idx) => (
            <div key={idx} className="space-y-6">
              <h2 className="text-xl font-headline font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-sky-500" /> {cat.category}
              </h2>
              <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-sky-50">
                <Accordion type="single" collapsible className="w-full">
                  {cat.questions.map((item, qIdx) => (
                    <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`} className="border-b-sky-50 last:border-0">
                      <AccordionTrigger className="text-left font-bold text-slate-700 hover:text-sky-600 transition-colors py-4 px-2">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-500 leading-relaxed pb-4 px-2 font-medium italic">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-primary-foreground text-white rounded-[3rem] p-10 md:p-12 text-center shadow-2xl shadow-sky-500/20 space-y-6 relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <h3 className="text-2xl font-black uppercase tracking-tight">Still have questions?</h3>
          <p className="text-sky-100 font-medium italic opacity-80">Can't find the answer you're looking for? Our friendly support team is here to help.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-sky-800 px-8 py-3.5 rounded-xl font-black transition-transform active:scale-95 shadow-lg">Chat on WhatsApp</button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-black transition-transform active:scale-95 border border-white/20">Email Support</button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
