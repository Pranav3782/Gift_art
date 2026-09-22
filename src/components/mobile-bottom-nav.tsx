
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, User, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/store/cart-context';
import { useUser } from '@/firebase';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user } = useUser();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/collections', icon: LayoutGrid },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, count: cartCount },
    { label: 'Account', href: user ? '/account' : '/login', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] h-[72px]">
      <div className="flex justify-around items-center h-full max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300",
                isActive ? "text-[#B57CFF]" : "text-slate-400"
              )}
            >
              <div className="relative">
                <item.icon className={cn("h-6 w-6", isActive && "fill-[#B57CFF]/10")} strokeWidth={isActive ? 2.5 : 2} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#FF6B95] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                    {item.count}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-tight",
                isActive ? "font-black" : "font-medium"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
