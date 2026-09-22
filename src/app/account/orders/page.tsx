'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';

const STATUS_MAP: any = {
  'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Shipped': 'bg-blue-50 text-blue-600 border-blue-100',
  'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
  'RTO': 'bg-rose-50 text-rose-600 border-rose-100',
  'Order Placed': 'bg-amber-50 text-amber-600 border-amber-100',
  'Processing': 'bg-sky-50 text-sky-600 border-sky-100',
  'Packed': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  'Out for Delivery': 'bg-purple-50 text-purple-600 border-purple-100',
};

export default function MyOrdersPage() {
  const { user } = useUser();
  const db = useFirestore();

  const ordersQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: orders, loading } = useCollection<any>(ordersQuery);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">My Orders</h1>
          <p className="text-sm text-slate-400 font-medium italic">Trace the journey of your handcrafted treasures.</p>
        </div>
        <Button asChild variant="outline" className="rounded-2xl border-2 border-sky-100 text-sky-600 h-12 font-black uppercase text-[10px] tracking-widest px-8">
          <Link href="/collections">Shop More Magic</Link>
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-sky-500" /></div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white group hover:shadow-2xl transition-all duration-500 overflow-hidden">
               <CardContent className="p-0">
                  <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-sky-50 group-hover:text-sky-500 transition-all duration-500">
                           <ShoppingBag className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                              <span className="font-black text-lg text-slate-800 uppercase tracking-tight">#{order.id?.slice(-8).toUpperCase()}</span>
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                Placed on {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                              </span>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                 <Package className="h-4 w-4 text-sky-400" /> {order.items?.length || 0} Items
                              </div>
                              <div className="w-1 h-1 rounded-full bg-slate-200" />
                              <div className="text-sm font-black text-slate-800">₹{order.total?.toLocaleString()}</div>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className={cn(
                          "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border",
                          STATUS_MAP[order.trackingStatus] || STATUS_MAP[order.status] || STATUS_MAP['Pending']
                        )}>
                           {order.trackingStatus || order.status || 'Pending'}
                        </div>
                        <Button asChild size="icon" variant="ghost" className="rounded-xl text-slate-300 hover:text-sky-600 hover:bg-sky-50 transition-all">
                           <Link href={`/account/tracking?id=${order.id}`}><ChevronRight className="h-6 w-6" /></Link>
                        </Button>
                     </div>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <ShoppingBag className="h-10 w-10" />
           </div>
           <h2 className="text-2xl font-black text-slate-800">Your bag is empty!</h2>
           <p className="text-slate-400 font-medium mt-2">Time to start unboxing some magic.</p>
           <Button asChild className="mt-8 rounded-full h-14 px-10 bg-sky-600">
              <Link href="/collections">Discover Gifts</Link>
           </Button>
        </div>
      )}
    </div>
  );
}
