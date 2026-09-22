"use client";

import { useMemo, useState } from 'react';
import { 
  Undo2, 
  AlertTriangle, 
  RefreshCw, 
  Search,
  ChevronRight,
  ShieldAlert,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function RTOPage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");
  
  const rtoQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'rto'), orderBy('lastUpdate', 'desc'));
  }, [db]);
  
  const { data: cases, loading } = useCollection<any>(rtoQuery);

  const filteredCases = cases?.filter((c: any) => 
    c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">RTO Management</h1>
          <p className="text-sm text-slate-400 font-medium italic">Monitor and minimize Return to Origin losses.</p>
        </div>
        <div className="flex gap-4">
           <Card className="border-none shadow-sm bg-rose-50 px-6 py-3 flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              <div>
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Live RTO Cases</p>
                <p className="text-sm font-black text-rose-600">{cases?.length || 0} Issues</p>
              </div>
           </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <Card className="border-none shadow-sm rounded-[2rem] p-8 bg-white space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Filters</h4>
                <div className="space-y-2">
                   {['All Cases', 'Action Required', 'In Transit', 'Completed'].map(f => (
                     <button key={f} className={cn(
                       "w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-tight transition-all",
                       f === 'All Cases' ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50"
                     )}>{f}</button>
                   ))}
                </div>
              </div>
           </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
             <Input 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Search RTO by ID, Order or Reason..." 
               className="pl-11 h-14 rounded-2xl border-none shadow-sm bg-white focus-visible:ring-indigo-500" 
             />
           </div>

           <div className="space-y-4">
              {loading ? (
                <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
              ) : filteredCases && filteredCases.length > 0 ? (
                filteredCases.map((rto: any) => (
                  <Card key={rto.id} className="border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-xl transition-all duration-500 overflow-hidden">
                     <CardContent className="p-0">
                        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-all duration-500">
                                 <Undo2 className="h-6 w-6" />
                              </div>
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className="font-black text-slate-800">{rto.id}</span>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">FOR {rto.orderId}</span>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                       <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> {rto.reason}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                       <MapPin className="h-3.5 w-3.5" /> {rto.city}
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-6">
                              <div className={cn(
                                 "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                 "bg-amber-50 text-amber-600 border-amber-100"
                              )}>
                                 {rto.status || 'Pending'}
                              </div>
                              <Button size="icon" variant="ghost" className="rounded-xl text-slate-300 hover:text-indigo-600 hover:bg-indigo-50">
                                 <ChevronRight className="h-5 w-5" />
                              </Button>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100 text-slate-300 font-bold uppercase tracking-widest text-xs">
                  No RTO cases recorded.
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}