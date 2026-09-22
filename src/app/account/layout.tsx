'use client';

import { useUser } from '@/firebase';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  User, 
  ShoppingBag, 
  Truck, 
  LifeBuoy, 
  LogOut, 
  ChevronRight,
  Heart,
  Loader2,
  Wand2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
      </div>
    );
  }

  const navItems = [
    { label: 'Profile Settings', href: '/account', icon: User },
    { label: 'My Orders', href: '/account/orders', icon: ShoppingBag },
    { label: 'AI Custom Orders', href: '/account/customized-orders', icon: Wand2 },
    { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { label: 'Track Delivery', href: '/account/tracking', icon: Truck },
    { label: 'Help & Support', href: '/account/support', icon: LifeBuoy },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 pt-28 lg:pt-36">
        {/* Mobile Collapsible Account Menu */}
        <div className="lg:hidden mb-8 relative z-30">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between text-slate-700 font-bold text-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                {(() => {
                  const ActiveIcon = navItems.find(item => item.href === pathname)?.icon || User;
                  return <ActiveIcon className="h-5 w-5" />;
                })()}
              </div>
              <span>{navItems.find(item => item.href === pathname)?.label || 'Profile Settings'}</span>
            </div>
            <ChevronRight className={cn("h-5 w-5 text-slate-400 transition-transform", isMobileMenuOpen && "rotate-90")} />
          </button>

          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 p-2 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                      isActive 
                        ? "bg-sky-50 text-sky-600 font-black" 
                        : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <ItemIcon className={cn("h-4 w-4", isActive ? "text-sky-600" : "text-slate-400")} />
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="h-3 w-3 text-sky-600" />}
                  </Link>
                );
              })}
              <div className="pt-2 mt-2 border-t border-slate-50 px-2">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    auth && signOut(auth);
                  }}
                  className="w-full flex items-center gap-3 px-2 py-3 text-slate-400 hover:text-rose-500 rounded-xl transition-all font-bold text-xs"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden sticky top-32">
              <div className="p-8 bg-sky-600 text-white text-center space-y-4">
                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center text-3xl font-black">
                  {user.displayName?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="font-headline font-black text-xl leading-none">{user.displayName || 'Friend'}</h3>
                  <p className="text-sky-100 text-xs mt-2 uppercase tracking-widest font-bold">Studio Collector</p>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all group",
                        isActive 
                          ? "bg-sky-50 text-sky-600 shadow-sm" 
                          : "text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon className={cn("h-5 w-5", isActive ? "text-sky-600" : "text-slate-300 group-hover:text-sky-400")} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-sm font-bold tracking-tight">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </Link>
                  );
                })}
                <div className="pt-4 mt-4 border-t border-slate-50">
                  <button 
                    onClick={() => auth && signOut(auth)}
                    className="w-full flex items-center gap-4 px-6 py-3.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>
          <div className="lg:col-span-9">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
