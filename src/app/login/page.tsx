'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { CircleUser, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({ variant: "destructive", title: "System Error", description: "Firebase is not initialized." });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Welcome back!", description: "Logged in successfully." });
      router.push('/');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast({ variant: "destructive", title: "System Error", description: "Firebase is not initialized." });
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Google Login Failed", description: error.message });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <div className="flex-1 flex items-start md:items-center justify-center p-4 pt-36 md:pt-28 lg:pt-36 pb-8">
        <div className="w-full max-w-md bg-white rounded-[3.5rem] p-8 md:p-10 shadow-2xl border border-slate-100 text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-50 rounded-full blur-3xl opacity-50"></div>
          
          <div className="space-y-1">
            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto text-sky-600 mb-2 shadow-inner">
              <CircleUser className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-headline font-black text-slate-800 tracking-tight">
              Welcome <span className="text-sky-600 italic">Back</span>
            </h1>
            <p className="text-sm text-slate-400 font-medium max-w-[240px] mx-auto leading-tight">
              Manage your magical orders and wishlist.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                  required
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="rahul@example.com" 
                  className="pl-12 h-14 rounded-2xl border-2 border-slate-100 focus-visible:ring-sky-500 bg-slate-50/30 text-sm font-bold" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</Label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input 
                  required
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="pl-12 h-14 rounded-2xl border-2 border-slate-100 focus-visible:ring-sky-500 bg-slate-50/30 text-sm font-bold" 
                />
              </div>
            </div>
            
            <div className="text-right pr-2">
              <button type="button" className="text-[11px] font-black text-sky-600 hover:underline uppercase tracking-tighter">Forgot Password?</button>
            </div>

            <Button 
              disabled={loading}
              className="w-full h-14 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs gap-2 shadow-xl shadow-sky-500/20 active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[9px] uppercase"><span className="bg-white px-3 text-slate-400 font-bold tracking-widest">Or continue with</span></div>
          </div>

          <Button variant="outline" onClick={handleGoogleLogin} className="w-full h-14 rounded-2xl gap-3 border-2 border-slate-100 hover:bg-slate-50 font-black text-xs uppercase tracking-tight active:scale-95 transition-all">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" /> Google Login
          </Button>

          <div className="pt-2">
             <p className="text-[11px] text-slate-400 font-bold">
              Don't have an account? <Link href="/signup" className="text-sky-600 font-black uppercase tracking-widest hover:underline ml-1">Create One</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
