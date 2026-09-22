'use client';

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useCart } from '@/lib/store/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  ShieldCheck, 
  Loader2, 
  Navigation,
  CreditCard,
  Truck,
  ArrowLeft,
  ChevronRight,
  PackageCheck,
  Smartphone,
  ChevronDown,
  ShoppingBag,
  Trash2,
  Check
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CheckoutSchema, type CheckoutFormData } from '@/lib/validation/checkout';
import { cn } from '@/lib/utils';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, subtotal, cartCount, clearCart, removeFromCart } = useCart();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [isLocating, setIsLocating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'prepaid'>('cod');
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);

  useEffect(() => {
    if (!db) return;
    const fetchCoupons = async () => {
      try {
        const q = query(collection(db, 'coupons'), where('status', '==', 'Active'));
        const querySnapshot = await getDocs(q);
        const list: any[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setAvailableCoupons(list);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
      }
    };
    fetchCoupons();
  }, [db]);

  const handleApplyCoupon = () => {
    if (!couponCodeInput.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a coupon code." });
      return;
    }
    const cpn = availableCoupons.find(c => c.code.toLowerCase() === couponCodeInput.trim().toLowerCase());
    if (!cpn) {
      toast({ variant: "destructive", title: "Invalid Coupon", description: "This coupon code does not exist or is expired." });
      return;
    }
    setAppliedCoupon(cpn);
    toast({ title: "Coupon Applied", description: `${cpn.code} applied successfully!` });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    toast({ title: "Coupon Removed" });
  };

  const shipping = subtotal >= 999 ? 0 : 99;
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'Percentage') {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    }
    return Math.min(appliedCoupon.value, subtotal);
  }, [appliedCoupon, subtotal]);

  const total = Math.max(0, subtotal + shipping - discount);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Geolocation is not supported by your browser."
      });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'GiftArtStudio/1.0 (checkout-location-detection)'
              }
            }
          );
          
          if (!response.ok) {
            throw new Error("Failed to fetch address from geocoding service");
          }
          
          const data = await response.json();
          if (data && data.address) {
            const addr = data.address;
            
            const state = addr.state || '';
            const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || '';
            const pincode = addr.postcode || '';
            
            const addressParts = [];
            if (addr.building) addressParts.push(addr.building);
            if (addr.amenity) addressParts.push(addr.amenity);
            if (addr.house_number) addressParts.push(addr.house_number);
            if (addr.road) addressParts.push(addr.road);
            if (addr.suburb) addressParts.push(addr.suburb);
            if (addr.neighbourhood) addressParts.push(addr.neighbourhood);
            
            const addressLine1 = addressParts.filter(Boolean).join(', ');
            const addressLine2 = addr.neighbourhood || addr.suburb || '';

            setFormData(prev => ({
              ...prev,
              city: city,
              state: state,
              pincode: pincode.replace(/\s+/g, ''),
              addressLine1: addressLine1 || data.display_name || '',
              addressLine2: addressLine2
            }));
            
            toast({ title: "Location Detected!", description: "Address details updated." });
          } else {
            throw new Error("Invalid address response from geocoding service");
          }
        } catch (err) {
          console.error("Geolocation reverse geocoding error:", err);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not retrieve address details. Please fill in manually."
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = "Could not detect location. Please fill in manually.";
        if (error.code === 1) {
          msg = "Location permission denied. Please allow location access in your browser settings.";
        } else if (error.code === 2) {
          msg = "Location details unavailable. Please fill in manually.";
        } else if (error.code === 3) {
          msg = "Location request timed out. Please fill in manually.";
        }
        toast({
          variant: "destructive",
          title: "Location Error",
          description: msg
        });
      }
    );
  };

  const handleAddressSubmit = () => {
    const valid = CheckoutSchema.safeParse(formData);
    if (!valid.success) {
      toast({ variant: "destructive", title: "Wait!", description: valid.error.errors[0].message });
      return;
    }
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    if (!db) return;
    setIsProcessing(true);
    
    try {
      const orderData = {
        userId: user?.uid || 'guest',
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.quantity, customization: i.personalizationName })),
        total: total,
        discountAmount: discount,
        couponCode: appliedCoupon?.code || null,
        status: 'Pending',
        trackingStatus: 'Order Placed',
        shippingAddress: {
          line1: formData.addressLine1,
          line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // Increment usage count of applied coupon in Firestore
      if (appliedCoupon) {
        try {
          const couponDocRef = doc(db, 'coupons', appliedCoupon.id);
          await updateDoc(couponDocRef, {
            usageCount: increment(1)
          });
        } catch (couponErr) {
          console.error("Failed to update coupon usage count:", couponErr);
        }
      }

      clearCart();
      router.push(`/checkout/success?id=${docRef.id}`);
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to place order." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
           <PackageCheck className="h-16 w-16 text-slate-200" />
           <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Bag is Empty</h2>
           <Button asChild className="rounded-full bg-indigo-600 text-white px-10 h-14"><Link href="/collections">Shop Now</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]/30 relative overflow-x-hidden">
      {/* Ambient background blur glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full bg-indigo-200/20 blur-[100px] sm:blur-[120px] pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] sm:w-[600px] h-[500px] sm:h-[600px] rounded-full bg-pink-100/30 blur-[110px] sm:blur-[130px] pointer-events-none -z-10 animate-float" style={{ animationDelay: '2s' }} />
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-12 lg:pt-36 lg:pb-16 max-w-6xl">
        
        {/* Progress Header */}
        <div className="relative flex items-center justify-center mb-10 md:mb-14 max-w-md mx-auto px-4">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[3px] bg-slate-100 -z-10 rounded-full overflow-hidden">
            <div 
              className={cn("h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 transition-all duration-500 ease-out", step === 'address' ? "w-0" : "w-full")}
            />
          </div>
          <div className="flex items-center justify-between w-full relative z-10">
            <button 
              onClick={() => setStep('address')}
              className="flex flex-col items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 border-2 active:scale-95",
                step === 'address' 
                  ? "bg-gradient-to-tr from-indigo-600 to-violet-600 border-indigo-500 text-white shadow-lg shadow-indigo-200/50 scale-110" 
                  : step === 'payment'
                    ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-md shadow-emerald-50"
                    : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-500"
              )}>
                {step === 'payment' ? <Check className="h-4 w-4 stroke-[3.5px]" /> : "1"}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                step === 'address' ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"
              )}>
                Shipping
              </span>
            </button>

            <button 
              disabled={step === 'address' && !formData.phone}
              onClick={() => setStep('payment')}
              className="flex flex-col items-center gap-2.5 group cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 border-2 active:scale-95",
                step === 'payment' 
                  ? "bg-gradient-to-tr from-indigo-600 to-violet-600 border-indigo-500 text-white shadow-lg shadow-indigo-200/50 scale-110" 
                  : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-500"
              )}>
                2
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                step === 'payment' ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"
              )}>
                Payment
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Order Summary (Collapsible) */}
        <div className="block lg:hidden w-full mb-6">
          <button 
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:bg-slate-50 transition-all focus:outline-none"
          >
            <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-wider">
              <ShoppingBag className="h-4 w-4" />
              <span>{showMobileSummary ? 'Hide Order Summary' : 'Show Order Summary'}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", showMobileSummary && "rotate-180")} />
            </div>
            <span className="font-black text-slate-800 text-sm">₹{total.toLocaleString()}</span>
          </button>
          
          {showMobileSummary && (
            <div className="bg-white border-x border-b border-slate-100 rounded-b-2xl p-5 -mt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 shadow-inner">
              <div className="space-y-4 max-h-[200px] overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center justify-between group">
                    <div className="flex gap-3 items-center min-w-0 flex-1">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-50 border shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase truncate text-slate-800">{item.name}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Qty: {item.quantity} • {item.personalizationName || 'Standard'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <p className="text-[10px] font-black text-slate-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="p-1 rounded-md bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="COUPON CODE" 
                    value={couponCodeInput} 
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="h-9 bg-slate-50 border-slate-200 text-slate-800 rounded-lg placeholder:text-slate-400 text-[10px] font-black uppercase tracking-wider text-center focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                  />
                  <Button 
                    onClick={handleApplyCoupon}
                    type="button"
                    className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider px-3"
                  >
                    Apply
                  </Button>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between items-center bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5 text-[9px] text-emerald-600 font-bold uppercase tracking-wider">
                    <span>{appliedCoupon.code} Applied!</span>
                    <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-slate-600 underline uppercase text-[8px] font-black tracking-widest ml-2">Remove</button>
                  </div>
                )}

                {availableCoupons && availableCoupons.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Available Coupons:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {availableCoupons.map((cpn: any) => (
                        <button
                          key={cpn.id}
                          onClick={() => {
                            setCouponCodeInput(cpn.code);
                            setAppliedCoupon(cpn);
                            toast({ title: "Coupon Applied", description: `${cpn.code} applied successfully!` });
                          }}
                          className="bg-indigo-50/50 hover:bg-indigo-100/50 border border-indigo-100/50 rounded-md px-2 py-0.5 text-[8px] font-black uppercase text-indigo-600 tracking-wider transition-all cursor-pointer"
                        >
                          {cpn.code} ({cpn.discountType === 'Percentage' ? `${cpn.value}% OFF` : `₹${cpn.value} OFF`})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400"><span>Subtotal</span><span className="text-slate-800">₹{subtotal.toLocaleString()}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-emerald-600"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>
                )}
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400"><span>Shipping</span><span className={cn(shipping === 0 ? "text-emerald-600 font-bold" : "text-slate-800")}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6 w-full max-w-full overflow-x-hidden">
            {step === 'address' ? (
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(203,213,225,0.3)] border border-white/60 space-y-6 md:space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                   <div className="space-y-1">
                     <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Delivery Address</h2>
                     <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 font-bold uppercase">Provide accurate details for safe arrival</p>
                   </div>
                   <Button 
                     variant="outline" 
                     size="sm" 
                     onClick={handleDetectLocation} 
                     disabled={isLocating} 
                     className="w-full sm:w-auto h-11 sm:h-12 rounded-xl gap-2 font-black text-[9px] sm:text-[10px] uppercase border-2 border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-all duration-300 active:scale-95 flex items-center justify-center shadow-sm"
                   >
                     {isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5" />}
                     Detect My Location
                   </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">Full Name *</Label>
                    <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50/40 border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.06)] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-semibold transition-all duration-300" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">Email Address *</Label>
                    <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50/40 border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.06)] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-semibold transition-all duration-300" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">Phone *</Label>
                    <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91" className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50/40 border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.06)] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-semibold transition-all duration-300" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">Pincode *</Label>
                    <Input value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} maxLength={6} className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50/40 border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.06)] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-semibold transition-all duration-300" />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">House No, Building, Road *</Label>
                    <Input value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50/40 border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.06)] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-semibold transition-all duration-300" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">City *</Label>
                    <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50/40 border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.06)] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-semibold transition-all duration-300" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">State / Province *</Label>
                    <Input value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50/40 border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.06)] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-semibold transition-all duration-300" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button 
                    onClick={handleAddressSubmit} 
                    className="w-full sm:w-auto h-14 sm:h-16 px-10 sm:px-12 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white font-black uppercase text-xs tracking-widest gap-2 shadow-lg shadow-indigo-100 transition-all duration-300"
                  >
                    Continue to Payment <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(203,213,225,0.3)] border border-white/60 space-y-6 md:space-y-8">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div className="space-y-1">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Payment Selection</h2>
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 font-bold uppercase">Select your preferred payment method</p>
                    </div>
                    <Button variant="ghost" onClick={() => setStep('address')} className="h-9 rounded-lg text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 transition-colors">Edit Address</Button>
                 </div>

                 <div className="grid gap-4">
                    <div 
                      onClick={() => setPaymentMethod('cod')}
                      className={cn(
                        "p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between group active:scale-[0.99]", 
                        paymentMethod === 'cod' 
                          ? "border-indigo-600 bg-gradient-to-br from-indigo-50/30 to-violet-50/10 shadow-lg shadow-indigo-100/40 animate-pulse-once" 
                          : "hover:border-slate-200 border-slate-100 bg-slate-50/30"
                      )}
                    >
                       <div className="flex items-center gap-3 sm:gap-4">
                          <div className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-inner flex items-center justify-center transition-colors duration-300 shrink-0",
                            paymentMethod === 'cod' ? "text-indigo-600 border border-indigo-100" : "text-slate-400 border border-slate-100"
                          )}>
                             <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
                          </div>
                          <div className="text-left min-w-0">
                             <span className={cn(
                               "font-black text-xs sm:text-sm uppercase block transition-colors duration-300",
                               paymentMethod === 'cod' ? "text-slate-900" : "text-slate-800"
                             )}>
                               Cash on Delivery
                             </span>
                             <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 block uppercase mt-0.5">Pay with cash when package arrives</span>
                          </div>
                       </div>
                       {paymentMethod === 'cod' && (
                         <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-indigo-200">
                           <PackageCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                         </div>
                       )}
                    </div>

                    <div 
                      className={cn("p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 flex items-center justify-between opacity-60 border-slate-100 bg-slate-50/20 cursor-not-allowed")}
                    >
                       <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 shrink-0"><CreditCard className="h-5 w-5 sm:h-6 sm:w-6" /></div>
                          <div className="text-left min-w-0">
                             <span className="font-black text-xs sm:text-sm uppercase block text-slate-400">Online Payment</span>
                             <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 block uppercase mt-0.5">Credit/Debit card, UPI, Netbanking (Coming Soon)</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-xl sm:rounded-2xl text-emerald-700 border border-emerald-100/60 shadow-sm">
                       <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" />
                       <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">100% Encrypted & Safe Transaction</span>
                    </div>
                    <Button 
                      disabled={isProcessing} 
                      onClick={handlePlaceOrder}
                      className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98] text-white font-black uppercase text-xs sm:text-sm tracking-widest shadow-xl shadow-indigo-200/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                        <>
                          <span>Place Order (₹{total.toLocaleString()})</span>
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                 </div>
              </div>
            )}
          </div>

          {/* Sticky Summary */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-32">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 text-slate-800 shadow-[0_20px_50px_-15px_rgba(203,213,225,0.3)] border border-white/60 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
               <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 border-b border-slate-100 pb-6 text-slate-800">Bag Review <Smartphone className="h-4 w-4 text-indigo-600" /></h3>
               
                <div className="space-y-6 max-h-[300px] overflow-y-auto scrollbar-hide pr-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center justify-between group">
                      <div className="flex gap-4 items-center min-w-0 flex-1">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0"><Image src={item.image} alt={item.name} fill className="object-cover" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black uppercase truncate text-slate-800">{item.name}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Qty: {item.quantity} • {item.personalizationName || 'Standard'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <p className="text-[11px] font-black text-slate-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
               {/* Coupon Code Input & Available Coupons */}
               <div className="pt-6 border-t border-slate-100 space-y-4">
                 <div className="flex gap-2">
                   <Input 
                     type="text" 
                     placeholder="COUPON CODE" 
                     value={couponCodeInput} 
                     onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                     className="h-10 bg-slate-50/40 border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.06)] focus-visible:ring-0 focus-visible:ring-offset-0 text-xs font-black uppercase tracking-wider text-center transition-all duration-300"
                   />
                   <Button 
                     onClick={handleApplyCoupon}
                     type="button"
                     className="h-10 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white rounded-xl text-[10px] font-black uppercase tracking-wider px-4 transition-all duration-300 shadow-sm"
                   >
                     Apply
                   </Button>
                 </div>

                 {appliedCoupon && (
                   <div className="flex justify-between items-center bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                     <span>{appliedCoupon.code} Applied!</span>
                     <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-slate-600 underline uppercase text-[8px] font-black tracking-widest ml-2">Remove</button>
                   </div>
                 )}

                 {availableCoupons && availableCoupons.length > 0 && (
                   <div className="space-y-2">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Available Coupons:</p>
                     <div className="flex flex-wrap gap-2">
                       {availableCoupons.map((cpn: any) => (
                         <button
                           key={cpn.id}
                           onClick={() => {
                             setCouponCodeInput(cpn.code);
                             setAppliedCoupon(cpn);
                             toast({ title: "Coupon Applied", description: `${cpn.code} applied successfully!` });
                           }}
                           className="bg-indigo-50/50 hover:bg-indigo-100/50 border border-indigo-100/50 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase text-indigo-600 tracking-wider transition-all cursor-pointer hover:border-indigo-300"
                         >
                           {cpn.code} ({cpn.discountType === 'Percentage' ? `${cpn.value}% OFF` : `₹${cpn.value} OFF`})
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               <div className="pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400"><span>Subtotal</span><span className="text-slate-800">₹{subtotal.toLocaleString()}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-600"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>
                  )}
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400"><span>Shipping</span><span className={cn(shipping === 0 ? "text-emerald-600 font-bold" : "text-slate-800")}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                  <div className="flex justify-between items-end pt-4 border-t border-slate-50">
                     <div className="space-y-0.5">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Payable Amount</p>
                       <p className="text-3xl font-black text-slate-900">₹{total.toLocaleString()}</p>
                     </div>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </div>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </main>
  );
}
