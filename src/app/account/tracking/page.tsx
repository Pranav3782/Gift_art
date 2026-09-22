
'use client';

import { useSearchParams } from 'next/navigation';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Loader2, 
  AlertCircle,
  ShoppingBag,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const TRACKING_STEPS = [
  { status: 'Order Placed', icon: Clock },
  { status: 'Processing', icon: Package },
  { status: 'Packed', icon: ShoppingBag },
  { status: 'Shipped', icon: Truck },
  { status: 'Out for Delivery', icon: MapPin },
  { status: 'Delivered', icon: CheckCircle2 },
];

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const db = useFirestore();
  
  const orderRef = useMemo(() => {
    if (!db || !orderId) return null;
    return doc(db, 'orders', orderId);
  }, [db, orderId]);

  const { data: order, loading } = useDoc<any>(orderRef);

  if (!orderId) {
    return (
      <div className="py-20 text-center space-y-6">
        <AlertCircle className="h-12 w-12 text-slate-200 mx-auto" />
        <h2 className="text-2xl font-black uppercase tracking-widest text-slate-800">No Order Selected</h2>
        <p className="text-slate-400 max-w-xs mx-auto text-sm">Please select an order from your history to track its progress.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>;
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-6">
        <AlertCircle className="h-12 w-12 text-rose-200 mx-auto" />
        <h2 className="text-2xl font-black uppercase tracking-widest text-slate-800">Order Not Found</h2>
      </div>
    );
  }

  const getActiveStep = () => {
    if (order.trackingStatus) {
      const idx = TRACKING_STEPS.findIndex(s => s.status.toLowerCase() === order.trackingStatus.toLowerCase());
      if (idx !== -1) return idx;
      if (order.trackingStatus.toLowerCase() === 'in transit') return 3; // 'In Transit' maps to Shipped
    }
    const status = (order.status || '').toLowerCase();
    if (status === 'delivered') return 5; // Delivered
    if (status === 'shipped') return 3; // Shipped
    if (status === 'pending') return 0; // Order Placed
    return 0;
  };

  const activeStep = getActiveStep();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">Live Tracking</h1>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Order ID: #{orderId.slice(-8).toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
           <Calendar className="h-4 w-4 text-slate-300" />
           <div className="leading-tight">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Placed On</p>
              <p className="text-xs font-bold text-slate-700">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}</p>
           </div>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden">
        <CardContent className="p-8 md:p-16">
          <div className="relative">
            {/* Visual Timeline Bar */}
            <div className="absolute left-[27px] top-6 bottom-6 w-[3px] bg-slate-100 md:hidden rounded-full overflow-hidden">
              <div 
                className="w-full bg-indigo-600 transition-all duration-500 ease-out"
                style={{ height: `${(activeStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
              />
            </div>
            <div className="hidden md:block absolute left-[8%] right-[8%] top-7 h-[3px] bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${(activeStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-12 relative z-10">
              {TRACKING_STEPS.map((step, idx) => {
                const isPast = idx < activeStep;
                const isCurrent = idx === activeStep;
                
                return (
                  <div key={step.status} className="flex md:flex-col items-center gap-6 md:gap-4 md:text-center md:flex-1">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg",
                      isPast ? "bg-indigo-600 text-white" : isCurrent ? "bg-indigo-500 text-white scale-110 shadow-indigo-200" : "bg-white text-slate-300 border border-slate-100"
                    )}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        isPast ? "text-slate-400" : isCurrent ? "text-indigo-600" : "text-slate-300"
                      )}>{step.status}</p>
                      {isCurrent && <p className="text-[8px] font-bold text-slate-400 uppercase">IN PROGRESS</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
         <Card className="border-none shadow-sm rounded-[2.5rem] p-8 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
            <div className="relative z-10 space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Shipping To</h4>
               <p className="font-bold text-sm leading-relaxed text-slate-300 italic">
                 {order.customerName} <br />
                 {order.shippingAddress.line1}, {order.shippingAddress.line2 && order.shippingAddress.line2 + ','} <br />
                 {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
               </p>
            </div>
         </Card>

         <Card className="border-none shadow-sm rounded-[2.5rem] p-8 bg-white border border-slate-100 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Order Summary</h4>
            <div className="space-y-4">
               {order.items?.map((item: any, i: number) => (
                 <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600">{item.qty}x {item.name}</span>
                    <span className="font-black text-slate-800">₹{item.price.toLocaleString()}</span>
                 </div>
               ))}
               <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Paid</span>
                  <span className="text-2xl font-black text-indigo-600">₹{order.total?.toLocaleString()}</span>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}
