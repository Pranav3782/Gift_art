'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { UserPlus, Mail, Lock, Phone, User, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAIL = "rohanswakkargiftartstudio@gmail.com";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) {
      toast({ variant: "destructive", title: "System Error", description: "Firebase is not initialized." });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Passwords Mismatch", description: "Please ensure both passwords are the same." });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.name });

      const role = formData.email === ADMIN_EMAIL ? 'admin' : 'user';

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        role: role,
        createdAt: serverTimestamp()
      });

      toast({ title: "Welcome to the Family!", description: "Your magical journey starts now." });
      
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Signup Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <div className="flex-1 flex items-start md:items-center justify-center p-4 pt-36 md:pt-28 lg:pt-36 pb-8">
        <div className="w-full max-w-lg bg-white rounded-[3.5rem] p-8 md:p-10 shadow-2xl border border-slate-100 text-center space-y-5 relative overflow-hidden">
          <div className="space-y-1">
            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto text-sky-600 mb-1 shadow-inner">
              <UserPlus className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-headline font-black text-slate-800 tracking-tight">Join the <span className="text-sky-600 italic">Studio</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">Create your account to start unboxing magic.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-3.5 text-left">
            <div className="space-y-1">
              <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</Label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Rahul Sharma" 
                  className="pl-12 h-12 rounded-2xl border-2 border-slate-100 focus-visible:ring-sky-600 bg-slate-50/50 text-sm font-bold" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="email@box.com" 
                    className="pl-11 h-12 rounded-2xl border-2 border-slate-100 focus-visible:ring-sky-600 bg-slate-50/50 text-xs font-bold" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91" 
                    className="pl-11 h-12 rounded-2xl border-2 border-slate-100 focus-visible:ring-sky-600 bg-slate-50/50 text-xs font-bold" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    required
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••" 
                    className="pl-11 h-12 rounded-2xl border-2 border-slate-100 focus-visible:ring-sky-600 bg-slate-50/50 text-xs font-bold" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Confirm</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    required
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••" 
                    className="pl-11 h-12 rounded-2xl border-2 border-slate-100 focus-visible:ring-sky-600 bg-slate-50/50 text-xs font-bold" 
                  />
                </div>
              </div>
            </div>

            <Button 
              disabled={loading}
              className="w-full h-14 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-sky-500/20 active:scale-95 transition-all mt-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <p className="text-[11px] text-slate-400 font-bold pt-1">
            Already have an account? <Link href="/login" className="text-sky-600 font-black uppercase tracking-widest hover:underline ml-1">Log In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
