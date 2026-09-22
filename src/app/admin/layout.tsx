'use client';

import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Loader2, ShieldAlert, Lock } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Fallback for legacy admin
const SUPER_ADMIN_EMAIL = "rohanswakkargiftartstudio@gmail.com";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userProfile, loading: docLoading } = useDoc<any>(userDocRef);

  const isLoginPage = pathname === '/admin/login';
  const loading = authLoading || (user && docLoading);
  
  const isAdmin = useMemo(() => {
    if (!user) return false;
    if (user.email === SUPER_ADMIN_EMAIL || user.email === 'testadmin@budgetdev.com') return true;
    if (userProfile && (userProfile.role === 'ADMIN' || userProfile.role === 'SUPER_ADMIN')) return true;
    return false;
  }, [user, userProfile]);

  useEffect(() => {
    if (!loading && !isLoginPage) {
      if (!user) {
        router.push('/admin/login');
      } else if (!isAdmin) {
        // Immediate expulsion for unauthorized users
        router.push('/');
      }
    }
  }, [user, isAdmin, loading, router, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Safety check: Ensure ONLY an admin is allowed past this point
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl space-y-8">
           <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto">
              <Lock className="h-10 w-10" />
           </div>
           <div className="space-y-2">
             <h2 className="text-2xl font-headline font-black text-slate-800 uppercase tracking-tight">Access Restricted</h2>
             <p className="text-sm text-slate-500 leading-relaxed font-medium">
               This panel is reserved for administrators. Unauthorized access attempts are logged.
             </p>
           </div>
           <Button asChild className="w-full h-14 rounded-2xl bg-slate-900 uppercase font-black text-xs tracking-widest">
             <Link href="/">Return to Store</Link>
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Master Control</h2>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
               <p className="text-xs font-black text-slate-800">{userProfile?.role === 'ADMIN' ? 'Administrator' : 'Boutique Owner'}</p>
               <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">{user.email}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-black">
               <ShieldAlert className="h-5 w-5" />
             </div>
          </div>
        </header>
        <div className="p-10 flex-1">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
