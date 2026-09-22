
'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export function ShopSidebar() {
  const [price, setPrice] = useState([3000]);

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-sm uppercase tracking-wider pb-2 border-b-2 border-pink-50">Categories</h3>
        <div className="space-y-3">
          {[
            { name: 'All Products', count: 124 },
            { name: 'Bags', count: 32 },
            { name: 'Pouches', count: 18 },
            { name: 'Water Bottles', count: 24 },
            { name: 'Lunch Bags', count: 20 },
            { name: 'Toys & Games', count: 16 },
            { name: 'Travel Essentials', count: 14 },
          ].map((cat) => (
            <div key={cat.name} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-2">
                <Checkbox id={`cat-${cat.name}`} className="border-pink-200 data-[state=checked]:bg-primary" />
                <Label htmlFor={`cat-${cat.name}`} className="text-sm text-slate-600 font-medium group-hover:text-primary transition-colors cursor-pointer">
                  {cat.name}
                </Label>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground bg-slate-50 px-2 py-0.5 rounded-full">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-sm uppercase tracking-wider pb-2 border-b-2 border-pink-50">Price Range</h3>
        <div className="space-y-6 pt-2">
          <div className="flex justify-between text-xs text-muted-foreground font-bold">
            <span>₹0</span>
            <span>₹5,000</span>
          </div>
          <Slider 
            defaultValue={[3000]} 
            max={5000} 
            step={100} 
            value={price}
            onValueChange={setPrice}
            className="cursor-pointer"
          />
          <div className="text-center font-bold text-primary text-sm">
            Up to ₹{price[0].toLocaleString()}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-sm uppercase tracking-wider pb-2 border-b-2 border-pink-50">Rating</h3>
        <RadioGroup defaultValue="4" className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <RadioGroupItem value={rating.toString()} id={`r-${rating}`} className="border-pink-200 text-primary" />
              <Label htmlFor={`r-${rating}`} className="flex items-center gap-1 cursor-pointer">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < rating ? 'fill-accent text-accent' : 'text-slate-200'}`} />
                ))}
                <span className="text-xs text-slate-500 font-medium ml-1">& up</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Age Group */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-sm uppercase tracking-wider pb-2 border-b-2 border-pink-50">Age Group</h3>
        <div className="space-y-3">
          {['0–2 Years', '3–5 Years', '6–9 Years', '10–12 Years'].map((age) => (
            <div key={age} className="flex items-center gap-2">
              <Checkbox id={`age-${age}`} className="border-pink-200" />
              <Label htmlFor={`age-${age}`} className="text-sm text-slate-600 font-medium cursor-pointer">{age}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11">Apply Filters</Button>
        <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 font-bold rounded-xl h-11">Clear All</Button>
      </div>
    </div>
  );
}
