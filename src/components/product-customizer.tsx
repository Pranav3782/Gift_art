
"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Loader2, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function ProductCustomizer() {
  const [name, setName] = useState('Oliver');
  const [selectedStyle, setSelectedStyle] = useState('Playful');
  const [selectedColor, setSelectedColor] = useState('text-primary');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const styles = ['Playful', 'Classic', 'Elegant', 'Bold'];
  const colors = [
    { name: 'Blush', class: 'text-primary' },
    { name: 'Magenta', class: 'text-accent' },
    { name: 'Ocean', class: 'text-blue-500' },
    { name: 'Mint', class: 'text-emerald-500' },
  ];

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Standard path for customized item in prototype
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Magic Added!",
        description: "Your customized design is now in your bag.",
      });
      router.push('/cart');
    }, 1000);
  };

  return (
    <section id="customizer" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-headline font-bold mb-4">Product Customizer</h2>
            <p className="text-muted-foreground">See your gift come to life with a real-time preview.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-[3rem] overflow-hidden shadow-xl">
            <div className="p-8 lg:p-12 space-y-8">
              <div className="space-y-4">
                <Label htmlFor="cust-name">What name should we use?</Label>
                <Input
                  id="cust-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a name..."
                  className="rounded-2xl border-2 focus-visible:ring-primary h-12 text-lg"
                  maxLength={12}
                />
              </div>

              <div className="space-y-4">
                <Label>Choose a Font Style</Label>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map(style => (
                    <Button
                      key={style}
                      variant={selectedStyle === style ? 'default' : 'outline'}
                      onClick={() => setSelectedStyle(style)}
                      className="rounded-xl h-12"
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Thread Color</Label>
                <div className="flex gap-4">
                  {colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.class)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all",
                        selectedColor === color.class ? "border-slate-800 scale-110" : "border-transparent",
                        color.class.replace('text-', 'bg-')
                      )}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-accent hover:bg-accent/90 text-white rounded-2xl h-14 text-lg gap-2"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingBag className="h-5 w-5" />}
                Add to Bag - ₹3,600
              </Button>
            </div>

            <div className="bg-muted p-8 flex items-center justify-center relative min-h-[400px]">
              <div className="relative w-full aspect-square max-w-sm rounded-[2rem] overflow-hidden shadow-lg bg-white">
                <Image
                  src={PlaceHolderImages.find(img => img.id === 'backpack-pink')?.imageUrl || ''}
                  alt="Preview"
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 flex items-center justify-center pt-8">
                  <span className={cn(
                    "text-4xl md:text-5xl font-bold tracking-tight transform -rotate-12 transition-all duration-500",
                    selectedColor,
                    selectedStyle === 'Playful' && "font-headline italic",
                    selectedStyle === 'Classic' && "font-serif",
                    selectedStyle === 'Elegant' && "font-light",
                    selectedStyle === 'Bold' && "font-headline font-black uppercase"
                  )}>
                    {name || 'Your Name'}
                  </span>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Live Preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
