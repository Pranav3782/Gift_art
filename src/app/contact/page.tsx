'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { KidsDecor } from '@/components/kids-decor';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />
      <KidsDecor />
      
      <div className="bg-[linear-gradient(135deg,#F0F9FF,#E0F2FE)] pt-28 pb-16 lg:pt-36 text-center border-b border-sky-100">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-headline font-black text-slate-800 mb-4">
            Contact <span className="text-primary-foreground italic">Us</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto font-medium">
            We'd love to hear from you! Whether you have a question about our gifts or just want to say hi.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Info Side */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-sky-50 space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-headline font-bold text-slate-800">Get in Touch</h2>
                <p className="text-sm text-slate-500 font-medium">Our team is available Mon-Sat, 10am to 7pm.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center shrink-0 text-sky-600 shadow-inner">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Call or WhatsApp</h4>
                    <p className="text-sm text-slate-600 font-bold">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center shrink-0 text-sky-600 shadow-inner">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Email Us</h4>
                    <p className="text-sm text-slate-600 font-bold">care@giftartstudio.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center shrink-0 text-sky-600 shadow-inner">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Our Studio</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      42, Creative Hub, Sector 62,<br />
                      Noida, UP - 201301, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-sky-50">
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  {['Instagram', 'Facebook', 'Twitter'].map(social => (
                    <div key={social} className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 hover:bg-sky-600 hover:text-white transition-all cursor-pointer shadow-sm">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl border border-sky-50">
              <h3 className="text-2xl font-headline font-bold text-slate-800 mb-8">Send us a Message</h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black ml-1 uppercase tracking-widest text-slate-400">Full Name</Label>
                    <Input placeholder="e.g. Rahul Sharma" className="rounded-xl border-2 border-slate-100 h-12 focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black ml-1 uppercase tracking-widest text-slate-400">Email Address</Label>
                    <Input type="email" placeholder="rahul@example.com" className="rounded-xl border-2 border-slate-100 h-12 focus-visible:ring-primary" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black ml-1 uppercase tracking-widest text-slate-400">Phone Number</Label>
                    <Input placeholder="+91" className="rounded-xl border-2 border-slate-100 h-12 focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black ml-1 uppercase tracking-widest text-slate-400">Subject</Label>
                    <Input placeholder="e.g. Order Status" className="rounded-xl border-2 border-slate-100 h-12 focus-visible:ring-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black ml-1 uppercase tracking-widest text-slate-400">Your Message</Label>
                  <Textarea placeholder="Tell us how we can help..." className="rounded-2xl border-2 border-slate-100 min-h-[150px] focus-visible:ring-primary" />
                </div>

                <Button className="w-full md:w-auto px-10 h-14 bg-primary-foreground hover:bg-primary-foreground/90 rounded-2xl font-black text-sm uppercase tracking-widest gap-2 shadow-xl shadow-sky-500/20 transition-transform active:scale-95">
                  <Send className="h-5 w-5" /> Send Message
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
