
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LifeBuoy, MessageSquare, Plus, Send, Headphones } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">Help & Support</h1>
        <p className="text-sm text-slate-400 font-medium italic">Our studio assistants are ready to help you.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 md:p-12 border-b border-slate-50 bg-slate-50/30">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sky-600 shadow-sm border border-slate-100">
                   <MessageSquare className="h-6 w-6" />
                 </div>
                 <CardTitle className="text-xl font-headline font-black text-slate-800 uppercase tracking-tight">Raise a Magic Ticket</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
               <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Topic</Label>
                       <select className="w-full h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-4 text-sm font-bold text-slate-600 outline-none focus:border-sky-500 transition-all">
                          <option>Order Status</option>
                          <option>Customization Help</option>
                          <option>Delivery Issue</option>
                          <option>Refund/Returns</option>
                          <option>Other Queries</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Order ID (Optional)</Label>
                       <Input placeholder="e.g. #GS-12345" className="h-14 rounded-2xl border-2 focus-visible:ring-sky-500 bg-slate-50/30" />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">How can we help?</Label>
                     <Textarea placeholder="Describe your magical request..." className="min-h-[150px] rounded-[1.5rem] border-2 focus-visible:ring-sky-500 bg-slate-50/30 p-6 font-medium text-slate-600" />
                  </div>
                  <div className="pt-6 border-t border-slate-50 flex justify-end">
                    <Button className="rounded-2xl bg-sky-600 hover:bg-sky-700 h-16 px-12 font-black uppercase text-xs tracking-widest gap-3 shadow-xl shadow-sky-100">
                      Send Magic Ticket <Send className="h-5 w-5" />
                    </Button>
                  </div>
               </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
           <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8 bg-sky-50 space-y-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sky-600 shadow-sm">
                <Headphones className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-lg font-headline font-black text-slate-800 uppercase tracking-tight leading-none">Instant Help</h4>
                 <p className="text-slate-500 text-sm font-medium leading-relaxed">Available Mon-Sat, 10am to 7pm.</p>
              </div>
              <div className="space-y-3">
                 <Button variant="outline" className="w-full h-12 rounded-xl border-2 border-white bg-white/50 hover:bg-white font-black text-[10px] uppercase tracking-widest shadow-sm">
                   WhatsApp Support
                 </Button>
                 <Button variant="outline" className="w-full h-12 rounded-xl border-2 border-white bg-white/50 hover:bg-white font-black text-[10px] uppercase tracking-widest shadow-sm">
                   View Documentation
                 </Button>
              </div>
           </Card>

           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 space-y-6">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Open Tickets</h3>
              <div className="py-12 text-center text-slate-300 italic text-xs font-bold uppercase tracking-widest">
                No active tickets.
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
