'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { KidsDecor } from '@/components/kids-decor';
import { Truck, Search, Package, MapPin, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />
      <KidsDecor />
      
      <div className="bg-[linear-gradient(135deg,#F0F9FF,#E0F2FE)] pt-28 pb-20 lg:pt-36 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-headline font-black text-slate-800 mb-4">
            Track Your <span className="text-primary-foreground italic">Order</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto font-medium">
            See the journey of your handcrafted gift from our studio to your doorstep.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10 max-w-3xl">
        <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-xl border border-sky-50 text-center space-y-8">
          <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto text-sky-600 shadow-inner">
            <Package className="h-10 w-10" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Enter Your Details</h3>
            <p className="text-sm text-slate-500 font-medium">Please enter your Order ID (from your confirmation email) and billing email.</p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <Input 
              placeholder="Order ID (e.g. #LJ-12345)" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="h-14 rounded-2xl border-2 focus-visible:ring-primary text-center font-bold" 
            />
            <Input 
              type="email"
              placeholder="Email Address" 
              className="h-14 rounded-2xl border-2 focus-visible:ring-primary text-center font-bold" 
            />
            <Button className="w-full h-14 bg-primary-foreground hover:bg-primary-foreground/90 text-white rounded-2xl font-black uppercase tracking-widest gap-2 shadow-lg shadow-sky-500/20">
              <Search className="h-5 w-5" /> Track Now
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: CheckCircle2, title: 'Order Placed', desc: 'Crafting process started.' },
            { icon: MapPin, title: 'In Transit', desc: 'Gift is on its way.' },
            { icon: Truck, title: 'Delivered', desc: 'Smiles at your door!' },
          ].map((item, i) => (
            <div key={i} className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/40">
              <item.icon className="h-6 w-6 text-sky-400 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
              <p className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-wider">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
