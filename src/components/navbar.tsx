"use client";

import { useState, useEffect, memo, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  Gift, 
  X,
  Sparkles,
  CircleUser,
  ShoppingBag,
  Home,
  LayoutGrid,
  Star,
  Heart,
  PackageSearch,
  User,
  Info,
  Mail,
  ChevronDown,
  Plus,
  LogOut,
  Settings,
  Search,
  Baby,
  UserCircle,
  Shapes,
  Loader2,
  ArrowRight,
  Wand2,
  ChevronRight,
  Minus,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/store/cart-context';
import { useUser, useAuth, useFirestore, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection } from 'firebase/firestore';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AnnouncementBar } from './announcement-bar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const NAV_STRUCTURE = [
  {
    label: 'HOME',
    icon: Home,
    type: 'link',
    href: '/'
  },
  {
    label: 'NEW',
    icon: Sparkles,
    type: 'dropdown',
    items: [
      { label: 'New Collection', href: '/shop/new/new-collection' },
      { label: 'New Launch', href: '/shop/new/new-launch' },
      { label: 'Best Sellers', href: '/shop/new/best-sellers' },
      { label: 'Festive', href: '/shop/new/festive' },
    ]
  },
  {
    label: 'PERSONALISED',
    icon: Gift,
    type: 'dropdown',
    items: [
      { label: 'All Personalised', href: '/category/personalized-gifts' },
      { label: 'Mugs', href: '/shop/personalized-gifts/mugs' },
      { label: 'Bottles', href: '/shop/personalized-gifts/bottles' },
      { label: 'Passport Covers', href: '/shop/personalized-gifts/passport-covers' },
      { label: 'Laptop Bags', href: '/shop/personalized-gifts/laptop-bags' },
    ]
  },
  {
    label: 'KIDS',
    icon: Baby,
    type: 'dropdown',
    items: [
      { label: 'All Kids', href: '/category/kids' },
      { label: 'School Bags', href: '/shop/kids/bags' },
      { label: 'Water Bottles', href: '/shop/kids/water-bottles' },
      { label: 'Lunch Boxes', href: '/shop/kids/lunch-boxes' },
      { label: 'Umbrellas', href: '/shop/kids/umbrellas' },
      { label: 'Combos', href: '/shop/kids/combos' },
      { label: 'Stationery', href: '/shop/kids/stationery' },
    ]
  },
  {
    label: 'ADULTS',
    icon: UserCircle,
    type: 'dropdown',
    items: [
      { label: 'All Adults', href: '/category/adults' },
      { label: 'Mens Collection', href: '/shop/adults/mens' },
      { label: 'Womens Collection', href: '/shop/adults/womens' },
      { label: 'Unisex', href: '/shop/adults/unisex' },
    ]
  },
  {
    label: 'ACCESSORIES',
    icon: Shapes,
    type: 'dropdown',
    items: [
      { label: 'All Accessories', href: '/category/accessories' },
      { label: 'Travel Accessories', href: '/shop/accessories/travel-combo' },
      { label: 'Gift Boxes', href: '/shop/accessories/gift-boxes' },
      { label: 'Desk Accessories', href: '/shop/accessories/desk' },
    ]
  },
  {
    label: 'ABOUT US',
    icon: Info,
    type: 'link',
    href: '/about'
  },
  {
    label: 'CUSTOMIZE',
    icon: Wand2,
    type: 'link',
    href: '/customization'
  },
];

const MobileNavItem = ({ item, pathname }: { item: any, pathname: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;

  if (item.type === 'link') {
    return (
      <SheetClose asChild>
        <Link 
          href={item.href} 
          className={cn(
            "flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300",
            pathname === item.href ? "bg-[#FFF0F7] text-[#FF69B4]" : "text-slate-600 hover:bg-slate-50"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Icon className={cn("h-6 w-6", pathname === item.href ? "text-[#FF69B4]" : "text-slate-400")} strokeWidth={1.5} />
            </div>
            <span className="text-sm font-bold tracking-tight">{item.label}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
      </SheetClose>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className={cn(
        "flex items-center justify-between w-full px-6 py-4 rounded-2xl transition-all duration-300",
        isOpen ? "bg-slate-50 text-[#0ea5e9]" : "text-slate-600 hover:bg-slate-50"
      )}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Icon className={cn("h-6 w-6", isOpen ? "text-[#0ea5e9]" : "text-slate-400")} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-bold tracking-tight">{item.label}</span>
        </div>
        {isOpen ? <Minus className="h-4 w-4 text-slate-300" /> : <Plus className="h-4 w-4 text-slate-300" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6 py-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
        {item.items.map((subItem: any) => (
          <SheetClose asChild key={subItem.href}>
            <Link 
              href={subItem.href}
              className={cn(
                "block pl-14 pr-4 py-3 rounded-xl text-xs font-bold transition-all",
                pathname === subItem.href ? "text-[#0ea5e9] bg-sky-50" : "text-slate-400 hover:text-[#0ea5e9]"
              )}
            >
              {subItem.label}
            </Link>
          </SheetClose>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export function Navbar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  const { cartCount } = useCart();
  const { user } = useUser();
  const auth = useAuth();

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItemClass = (href: string) => cn(
    "text-[11px] font-extrabold tracking-[0.1em] uppercase transition-all flex items-center gap-1.5 whitespace-nowrap py-2",
    pathname === href ? "text-[#1E1B4B]" : "text-[#2E1065] hover:text-[#4C1D95]"
  );

  return (
<header className="fixed inset-x-0 top-0 z-[9999] overflow-visible">
      <div className="lg:hidden">
        <AnnouncementBar />
      </div>
      {/* Main Navbar Container with Custom Torn-Paper Background */}
      <div
  className={cn(
    "relative w-full overflow-visible transition-all duration-300",
    isDesktop ? "h-28 bg-transparent" : "h-24 bg-transparent"
  )}
>
        {/* Background Layer (Responsive Implementation) */}
        {mounted && (
  <div
    className="absolute inset-0 overflow-visible -z-10 pointer-events-none"
  >
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2",
        isDesktop ? "-top-[30px]" : "-top-10"
      )}
      style={{
        width: "100vw",
        height: isDesktop ? "auto" : "175px",
        aspectRatio: isDesktop ? "7476/1212" : "auto",
        backgroundImage:
          "url('https://rohanwakkar.sirv.com/website-Top-bar-.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundSize: isDesktop ? "100% 100%" : "200vw 100%",
      }}
    />
  </div>
)}
<div className="container mx-auto flex items-center justify-between h-20 lg:h-20 px-4 md:px-6 relative z-10 gap-4">
          
          <div className="lg:hidden shrink-0">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <button className="p-2 -ml-2 text-slate-700 hover:text-sky-600 transition-colors focus:outline-none">
                  <Menu className="h-7 w-7" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-[380px] p-0 border-none bg-white overflow-y-auto scrollbar-hide [&>button]:hidden">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col h-full min-h-screen">
                  <div className="flex items-center justify-between px-6 pt-8 pb-4">
                    <Link href="/" className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#0ea5e9] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                        <Gift className="h-7 w-7" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline font-black text-xl text-[#0ea5e9] tracking-tighter leading-tight">GiftArtStudio</span>
                        <span className="text-[8px] font-black text-[#0ea5e9]/70 uppercase tracking-[0.2em]">Magical Gifts</span>
                      </div>
                    </Link>
                    <SheetClose className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 hover:bg-rose-50 hover:text-rose-500 transition-colors border border-slate-200 shadow-sm">
                      <X className="h-5 w-5" strokeWidth={2.5} />
                    </SheetClose>
                  </div>

                  <div className="flex-1 px-4 py-6 space-y-1">
                    {NAV_STRUCTURE.map((item, idx) => (
                      <MobileNavItem key={idx} item={item} pathname={pathname} />
                    ))}
                    <div className="h-px bg-slate-100 mx-6 my-6" />
                    {user ? (
                      <div className="px-4 space-y-2">
                         <Link href="/account" className="flex items-center gap-4 px-4 py-4 bg-sky-50 rounded-2xl border border-sky-100">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sky-600 font-black shadow-sm">
                              {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-800 leading-tight">{user.displayName || 'Account'}</p>
                               <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">View Profile</p>
                            </div>
                         </Link>
                         <button 
                          onClick={() => auth && signOut(auth)}
                          className="w-full flex items-center gap-4 px-6 py-4 text-rose-500 font-bold text-sm hover:bg-rose-50 rounded-2xl transition-colors"
                         >
                            <LogOut className="h-5 w-5" /> Sign Out
                         </button>
                      </div>
                    ) : (
                      <div className="px-6">
                        <Button asChild className="w-full h-14 rounded-2xl bg-[#B57CFF] hover:bg-[#a163fa] font-black uppercase text-xs tracking-widest shadow-lg shadow-purple-500/20">
                          <Link href="/login">Sign In / Join Studio</Link>
                        </Button>
                      </div>
                    )}

                    <div className="px-6 pt-4 pb-12">
                      <SheetClose asChild>
                        <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-black uppercase text-xs tracking-widest gap-2">
                          <X className="h-4 w-4" /> Close Menu
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <Link href="/" className="group flex items-center gap-2.5 relative shrink-0">
            <div className="relative">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-[#0ea5e9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20 transition-all duration-500">
                <Gift className="w-5 h-5 drop-shadow-md" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-headline font-black text-lg md:text-xl text-[#1E1B4B] tracking-tighter">
                GiftArtStudio
              </span>
              <span className="text-[7px] font-black text-[#1E1B4B]/70 uppercase tracking-[0.3em]">
                MAGICAL GIFTS
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center justify-evenly flex-1 mx-4 xl:mx-8">
            {NAV_STRUCTURE.map((group) => (
              group.type === 'dropdown' ? (
                <DropdownMenu key={group.label}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-[11px] font-extrabold tracking-[0.1em] uppercase text-[#2E1065] hover:text-[#4C1D95] outline-none transition-colors py-2 whitespace-nowrap">
                    {group.label} <ChevronDown className="h-3 w-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={15} className="z-[10000] min-w-[220px] p-3 rounded-2xl border-slate-100 shadow-2xl bg-white">
                    {group.items?.map((item) => (
                      <DropdownMenuItem key={item.label} asChild className="focus:bg-sky-50 focus:text-sky-600 rounded-xl p-0 overflow-hidden">
                        <Link href={item.href} className="w-full text-[11px] font-bold tracking-widest uppercase text-slate-500 p-4 transition-all">
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={group.label} href={group.href!} className={navItemClass(group.href!)}>{group.label}</Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4 shrink-0 lg:order-4">
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-slate-700 hover:bg-slate-50/50 transition-all relative">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF69B4] text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">2</span>
            </button>

            <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 rounded-full text-[#2E1065] hover:bg-slate-50/50 transition-all">
              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF69B4] text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="shrink-0">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center w-10 h-10 rounded-full text-[#2E1065] hover:bg-slate-50/50 transition-all">
                      <CircleUser className="h-6 w-6" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-[10000] w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                    <DropdownMenuItem asChild className="rounded-xl mt-1">
                      <Link href="/account" className="flex items-center gap-3 w-full py-2.5 font-bold text-sm">
                        <Settings className="h-4 w-4" /> Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link href="/account/orders" className="flex items-center gap-3 w-full py-2.5 font-bold text-sm">
                        <ShoppingBag className="h-4 w-4" /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem onClick={() => auth && signOut(auth)} className="rounded-xl focus:bg-rose-50 focus:text-rose-600">
                      <div className="flex items-center gap-3 w-full py-2.5 font-bold text-sm">
                        <LogOut className="h-5 w-5" /> Sign Out
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="flex items-center justify-center w-10 h-10 rounded-full text-[#2E1065] hover:bg-slate-50/50 transition-all">
                  <CircleUser className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
