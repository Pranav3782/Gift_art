'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAIL = "rohanswakkargiftartstudio@gmail.com";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) {
      toast({ variant: "destructive", title: "System Error", description: "Firebase is not initialized." });
      return;
    }
    if (email !== ADMIN_EMAIL) {
      toast({ variant: "destructive", title: "Access Denied", description: "This portal is for administrators only." });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Welcome Back, Chief!", description: "Admin dashboard access granted." });
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) {
      toast({ variant: "destructive", title: "System Error", description: "Firebase is not initialized." });
      return;
    }
    if (email !== ADMIN_EMAIL) {
      toast({ variant: "destructive", title: "Invalid Email", description: "Setup is restricted to the pre-authorized admin email." });
      return;
    }
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: 'Super Admin' });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: 'Super Admin',
        email: email,
        role: 'admin',
        createdAt: serverTimestamp()
      });

      toast({ title: "Admin Initialized!", description: "Permissions granted successfully." });
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Setup Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-800 text-center space-y-6 relative overflow-hidden">
          <div className="space-y-1">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 mb-2 shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-headline font-black text-slate-800">
              Admin <span className="text-indigo-600 italic">{isSetupMode ? 'Setup' : 'Login'}</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">
              {isSetupMode ? 'Claim your Super Admin spot.' : 'Restricted access for studio management.'}
            </p>
          </div>

          <form onSubmit={isSetupMode ? handleAdminSetup : handleLogin} className="space-y-3.5 text-left">
            <div className="space-y-1">
              <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                  required
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={ADMIN_EMAIL} 
                  className="pl-11 h-12 rounded-xl border-2 focus-visible:ring-indigo-500 bg-slate-50/50" 
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                  required
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="pl-11 h-12 rounded-xl border-2 focus-visible:ring-indigo-500 bg-slate-50/50" 
                />
              </div>
            </div>

            <Button 
              disabled={loading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{isSetupMode ? 'Initialize' : 'Enter Dashboard'} <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <div className="pt-2">
            <button 
              onClick={() => setIsSetupMode(!isSetupMode)}
              className="flex items-center justify-center gap-2 w-full text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-indigo-600 transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              {isSetupMode ? 'Standard login' : 'First-Time Setup'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
