"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Ticket, 
  Undo2,
  Search, 
  Gift,
  ChevronRight,
  LogOut,
  ChevronDown,
  FolderOpen,
  Wand2,
  Tags
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useFirestore, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy } from 'firebase/firestore';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Category } from '@/lib/types';

const CORE_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'All Products', href: '/admin/products', icon: FolderOpen },
  { label: 'Categories', href: '/admin/categories', icon: Tags }, // NEW: Manage Categories
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Custom AI Orders', href: '/admin/customized-orders', icon: Wand2 },
  { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { label: 'RTO Management', href: '/admin/rto', icon: Undo2 },
  { label: 'SEO Settings', href: '/admin/seo', icon: Search },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  // Fetch dynamic categories
  const categoriesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'categories'), orderBy('name', 'asc'));
  }, [db]);
  const { data: categories } = useCollection<any>(categoriesQuery);

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-100 flex flex-col h-full lg:h-screen sticky top-0 overflow-y-auto scrollbar-hide">
      <div className="p-6 lg:p-8 shrink-0 flex items-center justify-between">
        <Link href="/admin/dashboard" onClick={handleLinkClick} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Gift className="h-6 w-6" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-headline font-black text-xl text-slate-800 tracking-tighter">Admin<span className="text-indigo-600 italic">Studio</span></span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">GiftArt Management</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {/* Core Management Items */}
        <div className="space-y-1 mb-6">
          {CORE_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "bg-indigo-50 text-indigo-600 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </div>

        {/* Dynamic Catalog Categories */}
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Store Catalog</p>
          
          <Collapsible
            open={openGroups.includes('categories') || pathname.startsWith('/admin/products')}
            onOpenChange={() => toggleGroup('categories')}
            className="space-y-1"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all font-bold text-sm">
              <div className="flex items-center gap-3">
                <FolderOpen className="h-5 w-5 text-slate-400" />
                <span className="tracking-tight">Products by Category</span>
              </div>
              <ChevronDown className={cn("h-4 w-4 transition-transform", (openGroups.includes('categories') || pathname.startsWith('/admin/products')) && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-10 pr-2 pb-2">
              {categories?.map((cat) => {
                const href = `/admin/products?category=${cat.slug}`;
                const isActive = pathname === '/admin/products' && typeof window !== 'undefined' && window.location.search.includes(`category=${cat.slug}`);
                return (
                  <Link
                    key={cat.id}
                    href={href}
                    onClick={handleLinkClick}
                    className={cn(
                      "block px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                      isActive 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                        : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50"
                    )}
                  >
                    {cat.name}
                  </Link>
                );
              })}
              {(!categories || categories.length === 0) && (
                <div className="px-4 py-2 text-xs text-slate-400 italic">No categories yet.</div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </nav>

      <div className="p-6 border-t border-slate-50 shrink-0">
        <button
          onClick={() => {
            if (onClose) onClose();
            if (auth) signOut(auth).then(() => router.push('/admin/login'));
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
        >
          <LogOut className="h-5 w-5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
