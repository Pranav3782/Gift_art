import { Truck, Tag, Phone, Instagram, Facebook, Youtube } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="flex bg-[#FDE68A] text-amber-900 text-[10px] md:text-xs font-black py-2 px-4 items-center justify-between gap-2 flex-wrap uppercase tracking-widest border-b border-amber-200/50">
      <div className="flex items-center gap-1.5">
        <Truck className="h-3 w-3" />
        <span>Free Shipping on orders above ₹999</span>
      </div>
      <div className="hidden sm:flex items-center gap-1.5">
        <Tag className="h-3 w-3" />
        <span>Extra 10% Off on Prepaid Orders</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Phone number hidden on mobile (default), visible from sm (640px) up */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Phone className="h-3 w-3" />
          <span>+91 98765 43210</span>
        </div>
        <div className="hidden md:flex items-center gap-3 ml-4">
          <Instagram className="h-3.5 w-3.5 cursor-pointer hover:opacity-70 transition-opacity" />
          <Facebook className="h-3.5 w-3.5 cursor-pointer hover:opacity-70 transition-opacity" />
          <Youtube className="h-3.5 w-3.5 cursor-pointer hover:opacity-70 transition-opacity" />
        </div>
      </div>
    </div>
  );
}
