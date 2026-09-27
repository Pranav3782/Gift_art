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
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-1 flex flex-col justify-center items-center px-4 pt-28 md:pt-32 pb-12 w-full">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto text-sky-600 shadow-inner">
              <CircleUser className="h-6 w-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-headline font-black text-slate-900 tracking-tight">
              Welcome <span className="text-sky-600 italic">Back</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium max-w-[260px] mx-auto">
              Sign in to manage your orders & wishlist.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-700 ml-0.5">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  required
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="pl-10 h-11 rounded-xl border border-slate-200 focus-visible:ring-sky-600 bg-slate-50/40 text-xs font-medium focus:bg-white transition-colors" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-0.5">
                <Label className="text-[11px] font-bold text-slate-700">Password</Label>
                <button type="button" className="text-[11px] font-bold text-sky-600 hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  required
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="pl-10 h-11 rounded-xl border border-slate-200 focus-visible:ring-sky-600 bg-slate-50/40 text-xs font-medium focus:bg-white transition-colors" 
                />
              </div>
            </div>

            <Button 
              disabled={loading}
              className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs tracking-wide gap-2 shadow-md shadow-sky-500/15 active:scale-[0.99] transition-all mt-1"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-3 text-slate-400 font-bold tracking-wider">Or continue with</span></div>
          </div>

          <Button variant="outline" onClick={handleGoogleLogin} className="w-full h-11 rounded-xl gap-2.5 border border-slate-200 hover:bg-slate-50 font-bold text-xs tracking-tight active:scale-[0.99] transition-all">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google Login
          </Button>

          <div className="text-center pt-1">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account? <Link href="/signup" className="text-sky-600 font-bold hover:underline ml-1">Create One</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
