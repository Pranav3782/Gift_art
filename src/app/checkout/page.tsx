'use client';

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/navbar';
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
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 relative overflow-x-hidden">
      {/* Ambient background blur glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full bg-sky-200/20 blur-[100px] sm:blur-[120px] pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] sm:w-[600px] h-[500px] sm:h-[600px] rounded-full bg-sky-100/30 blur-[110px] sm:blur-[130px] pointer-events-none -z-10 animate-float" style={{ animationDelay: '2s' }} />
      <Navbar />
      <div className="container mx-auto px-4 pt-36 pb-12 md:pt-40 lg:pt-44 lg:pb-16 max-w-6xl">
        
        {/* Progress Header */}
        <div className="relative flex items-center justify-center mb-8 md:mb-12 max-w-md mx-auto px-4">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[3px] bg-slate-100 -z-10 rounded-full overflow-hidden">
            <div 
              className={cn("h-full bg-sky-500 transition-all duration-500 ease-out", step === 'address' ? "w-0" : "w-full")}
            />
          </div>
          <div className="flex items-center justify-between w-full relative z-10">
            <button 
              onClick={() => setStep('address')}
              className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 border-2 active:scale-95",
                step === 'address' 
                  ? "bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-200/50 scale-105" 
                  : step === 'payment'
                    ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm shadow-emerald-50"
                    : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-500"
              )}>
                {step === 'payment' ? <Check className="h-4 w-4 stroke-[3.5px]" /> : "1"}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                step === 'address' ? "text-sky-600" : "text-slate-400 group-hover:text-slate-500"
              )}>
                Shipping
              </span>
            </button>

            <button 
              disabled={step === 'address' && !formData.phone}
              onClick={() => setStep('payment')}
              className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 border-2 active:scale-95",
                step === 'payment' 
                  ? "bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-200/50 scale-105" 
                  : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-500"
              )}>
                2
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                step === 'payment' ? "text-sky-600" : "text-slate-400 group-hover:text-slate-500"
              )}>
                Payment
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Order Summary (Collapsible & Compact Theme Aligned) */}
        <div className="block lg:hidden w-full mb-6">
          <button 
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            className="w-full bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:bg-slate-50/80 transition-all focus:outline-none"
          >
            <div className="flex items-center gap-2 text-sky-600 font-black text-xs uppercase tracking-wider">
              <ShoppingBag className="h-4 w-4" />
              <span>{showMobileSummary ? 'Hide Order Summary' : 'Show Order Summary'}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-300 text-sky-500", showMobileSummary && "rotate-180")} />
            </div>
            <span className="font-black text-slate-900 text-sm">₹{total.toLocaleString()}</span>
          </button>
          
          {showMobileSummary && (
            <div className="bg-white border-x border-b border-slate-200/80 rounded-b-2xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 shadow-inner">
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 pt-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center justify-between group">
                    <div className="flex gap-3 items-center min-w-0 flex-1">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 p-1">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase truncate text-slate-800">{item.name}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Qty: {item.quantity} • {item.personalizationName || 'Standard'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <p className="text-[10px] font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
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

              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="COUPON CODE" 
                    value={couponCodeInput} 
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="h-9 bg-slate-50 border-slate-200 text-slate-800 rounded-lg placeholder:text-slate-400 text-[10px] font-black uppercase tracking-wider text-center focus-visible:ring-sky-500 focus-visible:border-sky-500"
                  />
                  <Button 
                    onClick={handleApplyCoupon}
                    type="button"
                    className="h-9 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider px-3"
                  >
                    Apply
                  </Button>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between items-center bg-emerald-50/50 border border-emerald-100 rounded-lg p-2 text-[9px] text-emerald-600 font-bold uppercase tracking-wider">
                    <span>{appliedCoupon.code} Applied!</span>
                    <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-slate-600 underline uppercase text-[8px] font-black tracking-widest ml-2">Remove</button>
                  </div>
                )}

                {availableCoupons && availableCoupons.length > 0 && (
                  <div className="space-y-1.5 pt-1">
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
                          className="bg-sky-50 hover:bg-sky-100 border border-sky-100 rounded-md px-2 py-0.5 text-[8px] font-black uppercase text-sky-600 tracking-wider transition-all cursor-pointer"
                        >
                          {cpn.code} ({cpn.discountType === 'Percentage' ? `${cpn.value}% OFF` : `₹${cpn.value} OFF`})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
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
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                   <div className="space-y-0.5">
                     <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">Delivery Address</h2>
                     <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase">Provide accurate details for safe arrival</p>
                   </div>
                   <Button 
                     variant="outline" 
                     size="sm" 
                     onClick={handleDetectLocation} 
                     disabled={isLocating} 
                     className="w-full sm:w-auto h-9 sm:h-10 rounded-xl gap-1.5 font-black text-[9px] uppercase border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all duration-300 active:scale-95 flex items-center justify-center shadow-sm"
                   >
                     {isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-500" /> : <Navigation className="h-3.5 w-3.5 text-sky-500" />}
                     Detect My Location
                   </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">Full Name *</Label>
                    <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="h-11 sm:h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:border-sky-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs font-semibold transition-all" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">Email Address *</Label>
                    <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" className="h-11 sm:h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:border-sky-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs font-semibold transition-all" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">Phone *</Label>
                    <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91" className="h-11 sm:h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:border-sky-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs font-semibold transition-all" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">Pincode *</Label>
                    <Input value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} maxLength={6} className="h-11 sm:h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:border-sky-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs font-semibold transition-all" />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">House No, Building, Road *</Label>
                    <Input value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} className="h-11 sm:h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:border-sky-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs font-semibold transition-all" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">City *</Label>
                    <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-11 sm:h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:border-sky-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs font-semibold transition-all" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">State / Province *</Label>
                    <Input value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="h-11 sm:h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:border-sky-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs font-semibold transition-all" />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button 
                    onClick={handleAddressSubmit} 
                    className="w-full sm:w-auto h-10 sm:h-11 px-6 sm:px-8 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black uppercase text-xs tracking-wider gap-1.5 shadow-sm transition-all duration-300"
                  >
                    <span>Continue to Payment</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="space-y-0.5">
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">Payment Selection</h2>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase">Select your preferred payment method</p>
                    </div>
                    <Button variant="ghost" onClick={() => setStep('address')} className="h-8 rounded-lg text-[9px] font-black uppercase tracking-wider text-sky-600 hover:bg-sky-50 transition-colors">Edit Address</Button>
                 </div>

                 <div className="grid gap-3">
                    <div 
                      onClick={() => setPaymentMethod('cod')}
                      className={cn(
                        "p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between group active:scale-[0.99]", 
                        paymentMethod === 'cod' 
                          ? "border-sky-500 bg-sky-50/40 shadow-sm shadow-sky-100/40" 
                          : "hover:border-slate-200 border-slate-100 bg-slate-50/30"
                      )}
                    >
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center transition-colors shrink-0",
                            paymentMethod === 'cod' ? "text-sky-600 border border-sky-200" : "text-slate-400 border border-slate-100"
                          )}>
                             <Truck className="h-5 w-5" />
                          </div>
                          <div className="text-left min-w-0">
                             <span className={cn(
                               "font-black text-xs sm:text-sm uppercase block transition-colors",
                               paymentMethod === 'cod' ? "text-slate-900" : "text-slate-800"
                             )}>
                                Cash on Delivery
                             </span>
                             <span className="text-[9px] font-bold text-slate-400 block uppercase mt-0.5">Pay with cash when package arrives</span>
                          </div>
                       </div>
                       {paymentMethod === 'cod' && (
                         <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-sky-200">
                           <PackageCheck className="h-3.5 w-3.5" />
                         </div>
                       )}
                    </div>

                    <div 
                      className={cn("p-4 rounded-2xl border-2 flex items-center justify-between opacity-60 border-slate-100 bg-slate-50/20 cursor-not-allowed")}
                    >
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 shrink-0"><CreditCard className="h-5 w-5" /></div>
                          <div className="text-left min-w-0">
                             <span className="font-black text-xs sm:text-sm uppercase block text-slate-400">Online Payment</span>
                             <span className="text-[9px] font-bold text-slate-400 block uppercase mt-0.5">Credit/Debit card, UPI, Netbanking (Coming Soon)</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-center gap-2.5 p-3 bg-emerald-50/60 rounded-xl text-emerald-700 border border-emerald-100/80 shadow-sm">
                       <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                       <span className="text-[9px] font-black uppercase tracking-wider">100% Encrypted & Safe Transaction</span>
                    </div>
                    
                    {/* Place Order Button (Compact & Theme Aligned for Mobile & Desktop) */}
                    <Button 
                      disabled={isProcessing} 
                      onClick={handlePlaceOrder}
                      className="w-full h-11 sm:h-12 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-black uppercase text-xs sm:text-sm tracking-wider shadow-md shadow-sky-500/20 transition-all duration-300 flex items-center justify-center gap-1.5"
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : (
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

          {/* Sticky Desktop Summary (Theme Aligned) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-36">
            <div className="bg-white rounded-3xl p-6 text-slate-800 border border-slate-200/80 shadow-sm space-y-6 relative overflow-hidden">
               <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-4 text-slate-900">
                 <ShoppingBag className="h-4 w-4 text-sky-500" />
                 <span>Bag Review</span>
               </h3>
               
                <div className="space-y-4 max-h-[280px] overflow-y-auto scrollbar-hide pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center justify-between group">
                      <div className="flex gap-3 items-center min-w-0 flex-1">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 p-1">
                          <Image src={item.image} alt={item.name} fill className="object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase truncate text-slate-800">{item.name}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Qty: {item.quantity} • {item.personalizationName || 'Standard'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <p className="text-[10px] font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
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

               {/* Coupon Code Input & Available Coupons */}
               <div className="pt-4 border-t border-slate-100 space-y-3">
                 <div className="flex gap-2">
                   <Input 
                     type="text" 
                     placeholder="COUPON CODE" 
                     value={couponCodeInput} 
                     onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                     className="h-9 bg-slate-50 border-slate-200 text-slate-800 rounded-lg placeholder:text-slate-400 text-[10px] font-black uppercase tracking-wider text-center focus-visible:ring-sky-500 focus-visible:border-sky-500"
                   />
                   <Button 
                     onClick={handleApplyCoupon}
                     type="button"
                     className="h-9 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider px-3"
                   >
                     Apply
                   </Button>
                 </div>

                 {appliedCoupon && (
                   <div className="flex justify-between items-center bg-emerald-50/50 border border-emerald-100 rounded-lg p-2 text-[9px] text-emerald-600 font-bold uppercase tracking-wider">
                     <span>{appliedCoupon.code} Applied!</span>
                     <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-slate-600 underline uppercase text-[8px] font-black tracking-widest ml-2">Remove</button>
                   </div>
                 )}

                 {availableCoupons && availableCoupons.length > 0 && (
                   <div className="space-y-1.5 pt-1">
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
                           className="bg-sky-50 hover:bg-sky-100 border border-sky-100 rounded-md px-2 py-0.5 text-[8px] font-black uppercase text-sky-600 tracking-wider transition-all cursor-pointer"
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
                  <div className="flex justify-between items-end pt-3 border-t border-slate-100">
                     <div className="space-y-0.5">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Payable Amount</p>
                       <p className="text-2xl font-black text-slate-900">₹{total.toLocaleString()}</p>
                     </div>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
