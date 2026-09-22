"use client";

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wand2, 
  ChevronRight, 
  Loader2, 
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package
} from 'lucide-react';
import Link from 'next/link';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const STATUS_MAP: any = {
  'Pending': { color: 'bg-amber-50 text-amber-600', icon: Clock },
  'Reviewing Design': { color: 'bg-sky-50 text-sky-600', icon: Wand2 },
  'Approved': { color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
  'In Production': { color: 'bg-indigo-50 text-indigo-600', icon: Package },
  'Delivered': { color: 'bg-slate-50 text-slate-600', icon: CheckCircle2 },
  'Cancelled': { color: 'bg-rose-50 text-rose-600', icon: AlertCircle },
};

export default function CustomizedOrdersPage() {
  const { user } = useUser();
  const db = useFirestore();

  const ordersQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'customized_orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: orders, loading } = useCollection<any>(ordersQuery);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">AI Creations</h1>
          <p className="text-sm text-slate-400 font-medium italic">Track your unique handcrafted AI designs.</p>
        </div>
        <Button asChild className="rounded-2xl bg-sky-600 hover:bg-sky-700 h-12 font-black uppercase text-[10px] tracking-widest px-8 shadow-xl shadow-sky-100">
          <Link href="/customization">Create New Magic</Link>
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-sky-500" /></div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-8">
          {orders.map((order) => {
            const status = STATUS_MAP[order.status] || STATUS_MAP['Pending'];
            return (
              <Card key={order.id} className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] bg-white group hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                     {/* Preview Side */}
                     <div className="w-full lg:w-72 aspect-square relative bg-slate-50 border-r border-slate-50">
                        <Image src={order.generatedDesignImage} alt="Design" fill className="object-cover" unoptimized />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-sky-600 shadow-sm border border-sky-100">AI GENERATED</div>
                     </div>

                     {/* Content Side */}
                     <div className="flex-1 p-8 md:p-10 space-y-6 flex flex-col justify-center">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                 <span className="font-black text-lg text-slate-800 uppercase tracking-tight">#{order.id?.slice(-8).toUpperCase()}</span>
                                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                                 </span>
                              </div>
                              <h3 className="font-bold text-slate-500">Customized {order.productName}</h3>
                           </div>
                           <div className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border self-start md:self-center", status.color)}>
                              <span className="flex items-center gap-2">
                                <status.icon className="h-3.5 w-3.5" />
                                {order.status}
                              </span>
                           </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Your Magic Prompt</p>
                           <p className="text-sm font-medium italic text-slate-600 leading-relaxed line-clamp-2">"{order.customPrompt}"</p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-slate-50">
                           <div className="flex items-center gap-8">
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Value</p>
                                 <p className="text-lg font-black text-slate-800">₹{order.price?.toLocaleString()}</p>
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Personalized For</p>
                                 <p className="text-xs font-black text-sky-600 uppercase tracking-tight">{order.customizationName || 'N/A'}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <Button asChild size="icon" variant="outline" className="rounded-xl border-slate-200 text-slate-400 hover:text-sky-600 hover:bg-sky-50">
                                 <a href={order.generatedDesignImage} download><Download className="h-4 w-4" /></a>
                              </Button>
                              <Button variant="outline" className="rounded-xl border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-widest px-6 h-10 hover:bg-slate-50">
                                 View Details
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Wand2 className="h-10 w-10" />
           </div>
           <h2 className="text-2xl font-black text-slate-800">No AI Magic Yet!</h2>
           <p className="text-slate-400 font-medium mt-2">Start your first AI customization to see it here.</p>
           <Button asChild className="mt-8 rounded-full h-14 px-10 bg-sky-600">
              <Link href="/customization">Design Now</Link>
           </Button>
        </div>
      )}
    </div>
  );
}
