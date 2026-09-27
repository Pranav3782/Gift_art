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
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 pt-32 md:pt-36 lg:pt-40 pb-16 w-full">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto text-sky-600 shadow-inner">
              <UserPlus className="h-7 w-7" />
            </div>
            <h1 className="text-3xl md:text-4xl font-headline font-black text-slate-900 tracking-tight">
              Join the <span className="text-sky-600 italic">Studio</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Create your account to start unboxing magical gifts.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label className="text-xs font-black uppercase tracking-wider text-slate-500 ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Rahul Sharma" 
                  className="pl-12 h-13 rounded-2xl border-2 border-slate-200 focus-visible:ring-sky-600 bg-slate-50/50 text-sm font-medium" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-black uppercase tracking-wider text-slate-500 ml-1">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com" 
                    className="pl-12 h-13 rounded-2xl border-2 border-slate-200 focus-visible:ring-sky-600 bg-slate-50/50 text-sm font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-black uppercase tracking-wider text-slate-500 ml-1">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91" 
                    className="pl-12 h-13 rounded-2xl border-2 border-slate-200 focus-visible:ring-sky-600 bg-slate-50/50 text-sm font-medium" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-black uppercase tracking-wider text-slate-500 ml-1">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    required
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••" 
                    className="pl-12 h-13 rounded-2xl border-2 border-slate-200 focus-visible:ring-sky-600 bg-slate-50/50 text-sm font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-black uppercase tracking-wider text-slate-500 ml-1">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    required
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••" 
                    className="pl-12 h-13 rounded-2xl border-2 border-slate-200 focus-visible:ring-sky-600 bg-slate-50/50 text-sm font-medium" 
                  />
                </div>
              </div>
            </div>

            <Button 
              disabled={loading}
              className="w-full h-14 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold uppercase tracking-wider text-xs gap-2 shadow-lg shadow-sky-500/20 active:scale-[0.99] transition-all mt-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Create Account <ArrowRight className="h-5 w-5" /></>}
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account? <Link href="/login" className="text-sky-600 font-black uppercase tracking-wider hover:underline ml-1">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
