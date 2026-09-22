"use client";

import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-hide">
      <Link href="/" className="hover:text-sky-600 flex items-center gap-1 shrink-0">
        <Home className="h-3 w-3" />
        Home
      </Link>
      
      {segments.map((seg, i) => {
        const href = `/${segments.slice(0, i + 1).join('/')}`;
        const isLast = i === segments.length - 1;
        const label = seg.replace(/-/g, ' ');
        
        return (
          <div key={href} className="flex items-center gap-2 shrink-0">
            <ChevronRight className="h-2.5 w-2.5 text-slate-300" />
            {isLast ? (
              <span className="text-sky-600 font-black">{label}</span>
            ) : (
              <Link href={href} className="hover:text-sky-600 transition-colors">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
