'use client';

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { KidsDecor } from '@/components/kids-decor';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateCustomDesign } from '@/ai/flows/generate-custom-design';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Wand2, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  RotateCcw, 
  CheckCircle2, 
  ShoppingBag,
  Info,
  Gift,
  Search
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function CustomizationPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  // State
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Select, 2: Prompt, 3: Preview
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    prompt: '',
    name: '',
    occasion: '',
    instructions: ''
  });

  // Fetch Products
  const productsQuery = useMemo(() => db ? collection(db, 'products') : null, [db]);
  const { data: products, loading: productsLoading } = useCollection<any>(productsQuery);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  // Handlers
  const handleGenerate = async () => {
    if (!formData.prompt) {
      toast({ variant: "destructive", title: "Wait!", description: "Please enter a customization prompt." });
      return;
    }
    
    setIsGenerating(true);
    try {
      // For images, we need to pass a data URI or a accessible URL. 
      // Firestore images are usually URLs. Nano-banana works best with data URIs if they are small, 
      // but it also takes URLs if they are accessible.
      const result = await generateCustomDesign({
        productImage: selectedProduct.image,
        prompt: formData.prompt,
        name: formData.name,
        instructions: formData.instructions
      });
      setGeneratedImage(result.generatedImageUrl);
      setStep(3);
    } catch (err) {
      toast({ variant: "destructive", title: "Magic Glitch", description: "The AI is feeling shy. Please try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!db || !user) {
      router.push('/login');
      return;
    }

    setIsOrdering(true);
    try {
      const orderData = {
        userId: user.uid,
        customerName: user.displayName || 'Friend',
        customerEmail: user.email,
        phone: '', // Could be fetched from user profile if exists
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        originalProductImage: selectedProduct.image,
        generatedDesignImage: generatedImage,
        customPrompt: formData.prompt,
        customizationName: formData.name,
        occasion: formData.occasion,
        specialInstructions: formData.instructions,
        quantity: 1,
        price: selectedProduct.price + 500, // Premium for AI customization
        status: 'Pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'customized_orders'), orderData);
      toast({ title: "Order Placed!", description: "Our artisans will review your AI design soon." });
      router.push('/account/customized-orders');
    } catch (err) {
      toast({ variant: "destructive", title: "Order Failed", description: "Something went wrong. Please contact support." });
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      <Navbar />
      <KidsDecor />
      
      <div className="container mx-auto px-4 pt-32 pb-24 max-w-6xl relative z-10">
        
        {/* Progress Header */}
        <div className="flex items-center justify-center mb-16 gap-4">
           {[1, 2, 3].map((s) => (
             <div key={s} className="flex items-center">
               <div className={cn(
                 "w-12 h-12 rounded-full flex items-center justify-center font-black text-sm transition-all shadow-lg",
                 step === s ? "bg-sky-600 text-white scale-110" : step > s ? "bg-emerald-500 text-white" : "bg-white text-slate-300"
               )}>
                 {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
               </div>
               {s < 3 && <div className={cn("w-12 md:w-20 h-1 mx-2 rounded-full", step > s ? "bg-emerald-500" : "bg-slate-200")} />}
             </div>
           ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Select Product */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-headline font-black text-slate-800 tracking-tight">
                  Select a <span className="text-sky-600 italic">Canvas</span>
                </h1>
                <p className="text-slate-500 font-medium max-w-xl mx-auto">Choose any item from our boutique to begin your AI customization journey.</p>
              </div>

              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-12 h-14 rounded-2xl bg-white border-none shadow-xl"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {productsLoading ? (
                  Array(8).fill(0).map((_, i) => <div key={i} className="aspect-square bg-white rounded-[2rem] animate-pulse shadow-sm" />)
                ) : filteredProducts.map(p => (
                  <motion.div 
                    key={p.id}
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "bg-white rounded-[2.5rem] p-4 shadow-sm cursor-pointer border-4 transition-all group",
                      selectedProduct?.id === p.id ? "border-sky-500 shadow-sky-100" : "border-transparent"
                    )}
                    onClick={() => setSelectedProduct(p)}
                  >
                    <div className="relative aspect-square rounded-[1.8rem] overflow-hidden bg-slate-50 mb-4">
                      <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight truncate px-2">{p.name}</h4>
                      <p className="text-xs font-bold text-sky-500 mt-1">₹{p.price.toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center pt-8">
                <Button 
                  disabled={!selectedProduct}
                  onClick={() => setStep(2)}
                  className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-sm tracking-widest gap-3 shadow-2xl active:scale-95 transition-all"
                >
                  Continue to Magic <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Customization Inputs */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-2 gap-12 items-start"
            >
              <div className="space-y-8 bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl">
                <div className="space-y-2">
                  <h2 className="text-3xl font-headline font-black text-slate-800 uppercase">Craft Your Vision</h2>
                  <p className="text-slate-400 font-medium">Describe how you want your {selectedProduct?.name} to look.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Customization Prompt *</Label>
                    <Textarea 
                      placeholder='e.g. "Add my name Rohan in golden letters on a royal blue background with floral patterns."' 
                      className="min-h-[150px] rounded-2xl border-2 border-slate-100 p-6 font-medium bg-slate-50/50"
                      value={formData.prompt}
                      onChange={e => setFormData({...formData, prompt: e.target.value})}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Personalization Name</Label>
                      <Input 
                        placeholder="e.g. Maya" 
                        className="h-14 rounded-xl border-2 border-slate-100 font-bold"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">The Occasion</Label>
                      <Input 
                        placeholder="e.g. Birthday" 
                        className="h-14 rounded-xl border-2 border-slate-100 font-bold"
                        value={formData.occasion}
                        onChange={e => setFormData({...formData, occasion: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Special Instructions (Optional)</Label>
                    <Input 
                      placeholder="e.g. Keep the logo visible at top right." 
                      className="h-14 rounded-xl border-2 border-slate-100 font-bold"
                      value={formData.instructions}
                      onChange={e => setFormData({...formData, instructions: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="h-16 px-8 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase text-xs"
                  >
                    Back
                  </Button>
                  <Button 
                    disabled={isGenerating}
                    onClick={handleGenerate}
                    className="flex-1 h-16 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black uppercase text-sm tracking-widest gap-3 shadow-xl active:scale-95 transition-all"
                  >
                    {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                    Generate AI Design
                  </Button>
                </div>
              </div>

              <div className="space-y-8 sticky top-32">
                 <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-3xl" />
                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 border-b border-white/10 pb-6 mb-8">
                       <Info className="h-5 w-5 text-sky-400" /> Pro Tips
                    </h3>
                    <ul className="space-y-6">
                      {[
                        { t: 'Be Descriptive', d: 'Mention colors, styles (e.g. "Cartoon", "Minimalist") and specific placement.' },
                        { t: 'Golden Rule', d: 'AI works best when you mention the desired outcome, not the process.' },
                        { t: 'Artisan Review', d: 'Every AI design is manually reviewed by our studio team for feasibility.' }
                      ].map((tip, i) => (
                        <li key={i} className="flex gap-4">
                           <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sky-400 shrink-0 font-black text-xs">{i+1}</div>
                           <div>
                              <p className="text-sm font-black uppercase tracking-tight">{tip.t}</p>
                              <p className="text-xs text-slate-400 font-medium leading-relaxed italic">{tip.d}</p>
                           </div>
                        </li>
                      ))}
                    </ul>
                 </div>
                 
                 <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100 flex items-center gap-6">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border">
                      <Image src={selectedProduct?.image} alt="Selected" fill className="object-cover" unoptimized />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Selected Base</p>
                       <h4 className="text-lg font-black text-slate-800 leading-tight">{selectedProduct?.name}</h4>
                       <p className="text-sm font-bold text-sky-500">₹{selectedProduct?.price.toLocaleString()}</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Preview & Place Order */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-50 text-sky-600 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border border-sky-100 shadow-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Generation Complete
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-headline font-black text-slate-800 tracking-tight">The <span className="text-sky-600 italic">Magic</span> Reveal</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                {/* Original View */}
                <div className="bg-white rounded-[4rem] p-10 shadow-xl border border-slate-50 space-y-8 flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-400 text-xs uppercase tracking-widest">Original Product</h3>
                    <div className="h-2 w-2 rounded-full bg-slate-200" />
                  </div>
                  <div className="flex-1 relative aspect-square rounded-[3rem] overflow-hidden bg-slate-50 border shadow-inner">
                    <Image src={selectedProduct?.image} alt="Original" fill className="object-cover" unoptimized />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-black text-slate-800">{selectedProduct?.name}</p>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Base Price: ₹{selectedProduct?.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Generated View */}
                <div className="bg-white rounded-[4rem] p-10 shadow-2xl border-4 border-sky-100 space-y-8 flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl" />
                  <div className="flex items-center justify-between relative z-10">
                    <h3 className="font-black text-sky-600 text-xs uppercase tracking-widest">AI Generated Design</h3>
                    <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                  </div>
                  <div className="flex-1 relative aspect-square rounded-[3rem] overflow-hidden bg-white shadow-[0_40px_80px_rgba(0,0,0,0.1)] border-2 border-white ring-1 ring-sky-100">
                    <Image src={generatedImage!} alt="Generated Preview" fill className="object-cover" unoptimized />
                  </div>
                  <div className="text-center space-y-1 relative z-10">
                    <p className="text-sm font-black text-sky-600">Exclusive AI Custom Edition</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Est. Crafted Price: ₹{(selectedProduct?.price + 500).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white grid md:grid-cols-3 gap-12">
                 <div className="md:col-span-2 space-y-8">
                    <div className="space-y-4">
                       <h4 className="text-sm font-black uppercase tracking-widest text-sky-400">Design Details</h4>
                       <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-6">
                          <div>
                             <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Custom Prompt</p>
                             <p className="text-lg font-medium italic leading-relaxed">"{formData.prompt}"</p>
                          </div>
                          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                             <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Personalization</p>
                                <p className="font-black uppercase tracking-tight text-sky-500">{formData.name || 'N/A'}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Occasion</p>
                                <p className="font-black uppercase tracking-tight text-rose-400">{formData.occasion || 'Special Event'}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col justify-center space-y-4">
                    <Button 
                      disabled={isOrdering}
                      onClick={handlePlaceOrder}
                      className="h-20 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black uppercase text-sm tracking-widest gap-3 shadow-2xl active:scale-95 transition-all"
                    >
                      {isOrdering ? <Loader2 className="h-6 w-6 animate-spin" /> : <ShoppingBag className="h-6 w-6" />}
                      Place Customized Order
                    </Button>
                    <button 
                      onClick={() => setStep(2)}
                      className="h-16 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" /> Regenerate Design
                    </button>
                    <div className="flex items-center gap-2 justify-center pt-4 opacity-40">
                       <Gift className="h-4 w-4 text-sky-400" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Handcrafted Artisanal Quality</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <Footer />
    </main>
  );
}
