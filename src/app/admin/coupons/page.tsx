"use client";

import { useMemo, useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  Loader2,
  Tag
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function CouponsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  
  const couponsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'coupons'), orderBy('code', 'asc'));
  }, [db]);
  
  const { data: coupons, loading } = useCollection<any>(couponsQuery);

  const handleCreateCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!db) return;
    e.preventDefault();
    setIsCreating(true);
    const formData = new FormData(e.currentTarget);
    
    const couponData = {
      code: formData.get('code')?.toString().toUpperCase(),
      discountType: formData.get('discountType'),
      value: Number(formData.get('value')),
      status: 'Active',
      usageCount: 0,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'coupons'), couponData);
      toast({ title: "Coupon Created!", description: "New magic discount added." });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create coupon." });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm('Delete this coupon?')) return;
    try {
      await deleteDoc(doc(db, 'coupons', id));
      toast({ title: "Deleted" });
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to delete" });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">Coupon Vault</h1>
          <p className="text-sm text-slate-400 font-medium italic">Create and manage magical discounts for your customers.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
            ) : coupons && coupons.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {coupons.map((cpn, i) => (
                  <Card key={cpn.id} className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden group hover:shadow-xl transition-all duration-500">
                    <CardContent className="p-0">
                       <div className="p-8 space-y-6">
                          <div className="flex items-center justify-between">
                             <div className="px-4 py-2 rounded-2xl text-sm font-black tracking-widest uppercase border border-indigo-100 bg-indigo-50 text-indigo-600">
                                {cpn.code}
                             </div>
                             <button onClick={() => handleDelete(cpn.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                               <Trash2 className="h-5 w-5" />
                             </button>
                          </div>
                          <div>
                             <h3 className="text-2xl font-black text-slate-800">
                               {cpn.discountType === 'Percentage' ? `${cpn.value}% OFF` : `₹${cpn.value} OFF`}
                             </h3>
                             <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Status: {cpn.status}</p>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                             <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-300" />
                                <span className="text-xs font-black text-slate-800">{cpn.usageCount || 0} Times Used</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                <CheckCircle2 className="h-3 w-3" /> Active
                             </div>
                          </div>
                       </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                    <Tag className="h-8 w-8" />
                 </div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No active coupons in vault.</p>
              </div>
            )}
         </div>

         <div className="lg:col-span-1">
            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8 space-y-8 sticky top-32">
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Quick Create</h4>
               <form onSubmit={handleCreateCoupon} className="space-y-6">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coupon Code</Label>
                     <Input name="code" required placeholder="e.g. MAGIC20" className="rounded-xl h-12 bg-slate-50/50 border-slate-100" />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discount Type</Label>
                     <select name="discountType" className="w-full rounded-xl h-12 bg-slate-50/50 border border-slate-100 px-4 text-sm font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all">
                        <option value="Percentage">Percentage (%)</option>
                        <option value="Flat">Flat Amount (₹)</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Value</Label>
                     <Input name="value" type="number" required placeholder="15" className="rounded-xl h-12 bg-slate-50/50 border-slate-100" />
                  </div>
                  <Button disabled={isCreating} className="w-full h-14 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs gap-2">
                    {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create Coupon
                  </Button>
               </form>
            </Card>
         </div>
      </div>
    </div>
  );
}