"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQS = [
  { q: "Is personalization really free?", a: "Yes! At GiftArtStudio, we believe every gift should be unique. Basic name personalization is included in the price of the item." },
  { q: "How long does shipping take?", a: "Standard items ship in 24-48 hours. Personalized items require an extra 1-2 days for crafting. Total delivery time is usually 5-7 business days." },
  { q: "Can I return a customized item?", a: "Personalized items are non-returnable as they are made specifically for you. However, if an item arrives damaged, we offer a free replacement." },
  { q: "Do you offer bulk discounts?", a: "Yes! For orders above 10 units (school events, birthdays), please contact us for special pricing." }
];

export function FAQHome() {
  return (
    <section className="py-24 bg-[#E0F2FE]/20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16 space-y-4">
           <h2 className="text-3xl md:text-4xl font-headline font-black text-slate-800">FREQUENTLY ASKED QUESTIONS</h2>
           <p className="text-slate-500 font-medium">Quick answers to your most common curiosities.</p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-white">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b-slate-100 last:border-0">
                <AccordionTrigger className="text-left font-black text-slate-700 hover:text-sky-600 py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 font-medium leading-relaxed italic pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
