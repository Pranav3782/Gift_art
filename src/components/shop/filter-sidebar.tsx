'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Star, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface FilterSidebarProps {
  category?: string;
}

const CATEGORY_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Sale', href: '/shop/new/sale' },
  { name: 'Lifestyle Products', href: '/shop/kids/lifestyle' },
  { name: 'Quirky Stationery', href: '/shop/kids/stationery' },
  { name: 'Toys and Games', href: '/shop/kids/toys' },
  { name: 'Reels (IG/Fb)', href: '/shop/new/reels' },
  { name: 'Hampers', href: '/shop/kids/hampers' },
  { name: 'New Arrivals', href: '/shop/new/new-collection' },
  { name: 'Customised Gifts', href: '/collections' },
];

export function FilterSidebar({ category }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [price, setPrice] = useState([Number(searchParams.get('maxPrice')) || 5000]);
  const [rating, setRating] = useState(searchParams.get('rating') || '0');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(true);
  const [availability, setAvailability] = useState<'in-stock' | 'out-of-stock' | 'all'>('all');

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) newParams.delete(key);
        else newParams.set(key, value);
      });
      return newParams.toString();
    },
    [searchParams]
  );

  const handleApplyFilters = () => {
    const query = createQueryString({
      maxPrice: price[0].toString(),
      rating: rating !== '0' ? rating : null,
    });
    router.push(`${pathname}?${query}`, { scroll: false });
  };

  const handleReset = () => {
    setPrice([5000]);
    setRating('0');
    setAvailability('all');
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="space-y-10 lg:sticky lg:top-32">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="font-headline font-black text-xs uppercase tracking-[0.25em] text-slate-800 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#7E22CE]" /> Filters
        </h3>
        <button 
          onClick={handleReset}
          className="text-[10px] font-black uppercase text-[#7E22CE] hover:underline"
        >
          Reset
        </button>
      </div>

      {/* Categories Panel */}
      <div className="space-y-4">
        <button 
          onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          className="w-full flex items-center justify-between font-black text-[11px] uppercase tracking-widest text-slate-800 border-b border-slate-50 pb-2 text-left"
        >
          <span>Categories</span>
          {isCategoriesOpen ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
        </button>
        {isCategoriesOpen && (
          <div className="pl-1 flex flex-col gap-2.5">
            {CATEGORY_ITEMS.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="text-xs font-semibold text-slate-500 hover:text-[#7E22CE] hover:translate-x-1 transition-all duration-300 block"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="space-y-6">
        <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-400">Price Range</h4>
        <div className="space-y-6">
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
            <span>₹0</span>
            <span>₹5,000+</span>
          </div>
          <Slider 
            defaultValue={[5000]} 
            max={5000} 
            step={100} 
            value={price}
            onValueChange={setPrice}
          />
          <div className="text-center font-black text-purple-700 text-sm bg-[#F3E8FF] py-3 rounded-2xl border border-[#E9D5FF]">
            Under <span className="text-black">₹{price[0].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-6">
        <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-400">Min. Rating</h4>
        <RadioGroup value={rating} onValueChange={setRating} className="space-y-3">
          {[5, 4, 3].map((r) => (
            <div key={r} className="flex items-center gap-3">
              <RadioGroupItem value={r.toString()} id={`r-${r}`} className="border-purple-200 text-[#7E22CE]" />
              <Label htmlFor={`r-${r}`} className="flex items-center gap-2 cursor-pointer group">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < r ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter group-hover:text-[#7E22CE] transition-colors">& up</span>
              </Label>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <RadioGroupItem value="0" id="r-all" className="border-purple-200 text-[#7E22CE]" />
            <Label htmlFor="r-all" className="text-[10px] text-slate-400 font-black uppercase cursor-pointer">All Ratings</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Availability Panel */}
      <div className="space-y-4">
        <button 
          onClick={() => setIsAvailabilityOpen(!isAvailabilityOpen)}
          className="w-full flex items-center justify-between font-black text-[11px] uppercase tracking-widest text-slate-800 border-b border-slate-50 pb-2 text-left"
        >
          <span>Availability</span>
          {isAvailabilityOpen ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
        </button>
        {isAvailabilityOpen && (
          <div className="pl-1 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Checkbox 
                id="in-stock" 
                checked={availability === 'in-stock'} 
                onCheckedChange={() => setAvailability(availability === 'in-stock' ? 'all' : 'in-stock')} 
                className="rounded-md border-purple-200 data-[state=checked]:bg-[#7E22CE]" 
              />
              <Label htmlFor="in-stock" className="text-xs font-bold text-slate-600 cursor-pointer">In Stock (28)</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox 
                id="out-of-stock" 
                checked={availability === 'out-of-stock'} 
                onCheckedChange={() => setAvailability(availability === 'out-of-stock' ? 'all' : 'out-of-stock')} 
                className="rounded-md border-purple-200 data-[state=checked]:bg-[#7E22CE]" 
              />
              <Label htmlFor="out-of-stock" className="text-xs font-bold text-slate-600 cursor-pointer">Out of Stock (0)</Label>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Attributes */}
      {category === 'kids' && (
        <div className="space-y-6">
          <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-400">Age Group</h4>
          <div className="grid gap-3">
             {['0-2 Years', '3-5 Years', '6-9 Years', '10-12 Years'].map(age => (
               <div key={age} className="flex items-center gap-3">
                 <Checkbox id={age} className="rounded-md border-purple-200 data-[state=checked]:bg-[#7E22CE]" />
                 <Label htmlFor={age} className="text-sm font-bold text-slate-600 cursor-pointer">{age}</Label>
               </div>
             ))}
          </div>
        </div>
      )}

      {category === 'adults' && (
        <div className="space-y-6">
          <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-400">Shop For</h4>
          <div className="grid gap-3">
             {['Men', 'Women', 'Unisex'].map(g => (
               <div key={g} className="flex items-center gap-3">
                 <Checkbox id={g} className="rounded-md border-purple-200 data-[state=checked]:bg-[#7E22CE]" />
                 <Label htmlFor={g} className="text-sm font-bold text-slate-600 cursor-pointer">{g}</Label>
               </div>
             ))}
          </div>
        </div>
      )}

      <div className="pt-6">
        <Button 
          onClick={handleApplyFilters}
          className="w-full bg-[#7E22CE] hover:bg-[#6B21A8] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl h-14 shadow-xl shadow-purple-100"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
