"use client";

import { useUser, useDoc, useFirestore, useCollection } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { doc, updateDoc, collection, query, where } from 'firebase/firestore';
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Calendar, Loader2, Save, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const profileRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const ordersQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'orders'), where('userId', '==', user.uid));
  }, [db, user]);
  
  const { data: profile, loading } = useDoc<any>(profileRef);
  const { data: orders } = useCollection<any>(ordersQuery);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        phoneNumber: profile.phoneNumber || ''
      });
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    if (!db || !user) return;
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), formData);
      toast({ title: "Profile Updated!", description: "Your changes have been saved." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const orderCount = orders?.length || 0;

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-headline font-black text-slate-900 uppercase tracking-tight">Account Profile</h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium italic">Keep your personal magic details up to date.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        <div className="md:col-span-2">
          <Card className="border border-slate-200/80 shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="p-5 sm:p-8 border-b border-slate-100 bg-slate-50/50">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm border border-slate-100">
                   <User className="h-5 w-5" />
                 </div>
                 <CardTitle className="text-lg font-headline font-black text-slate-900 uppercase tracking-tight">Personal Details</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-8">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input 
                        value={formData.displayName}
                        onChange={e => setFormData({...formData, displayName: e.target.value})}
                        className="pl-10 h-11 sm:h-12 rounded-xl border-slate-200 focus-visible:ring-sky-500 bg-slate-50/30 text-xs font-semibold" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email (Primary)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input 
                        disabled
                        value={user?.email || ''}
                        className="pl-10 h-11 sm:h-12 rounded-xl border-slate-200 bg-slate-50 opacity-60 text-xs font-semibold" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input 
                        value={formData.phoneNumber}
                        onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                        className="pl-10 h-11 sm:h-12 rounded-xl border-slate-200 focus-visible:ring-sky-500 bg-slate-50/30 text-xs font-semibold" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Member Since</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input 
                        disabled
                        value={profile?.createdAt?.toDate ? profile.createdAt.toDate().toLocaleDateString() : 'N/A'}
                        className="pl-10 h-11 sm:h-12 rounded-xl border-slate-200 bg-slate-50 opacity-60 text-xs font-semibold" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button 
                    disabled={isSaving}
                    className="w-full sm:w-auto h-10 sm:h-11 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black uppercase text-xs tracking-wider gap-2 shadow-sm shadow-sky-500/20 active:scale-95 transition-all"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save My Details
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="border-none shadow-md rounded-3xl p-6 bg-slate-900 text-white relative overflow-hidden group">
              <Sparkles className="absolute top-4 right-4 text-sky-400 opacity-50 h-6 w-6 animate-pulse" />
              <div className="relative z-10 space-y-4">
                 <h4 className="text-base font-headline font-black uppercase tracking-widest">Collector Status</h4>
                 <p className="text-slate-400 font-medium leading-relaxed italic text-xs">
                   {orderCount > 0 
                    ? `You've unboxed ${orderCount} treasures so far. Your journey is inspiring!`
                    : "You've unboxed 0 treasures so far. Start your collection today to earn Magic Points!"}
                 </p>
                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 transition-all duration-1000" style={{ width: `${Math.min(orderCount * 10, 100)}%` }} />
                 </div>
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Level: {orderCount > 5 ? 'Veteran Collector' : orderCount > 0 ? 'Active Explorer' : 'New Explorer'}</p>
              </div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-500 rounded-full blur-3xl opacity-50" />
           </Card>
        </div>
      </div>
    </div>
  );
}
