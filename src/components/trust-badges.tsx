import { Medal, Gift, Heart, Truck } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Medal,
    title: 'Premium Quality',
    desc: 'Carefully selected, safe & durable products.'
  },
  {
    icon: Gift,
    title: 'Unique & Personalized',
    desc: 'Make every gift extra special with personalization.'
  },
  {
    icon: Heart,
    title: 'Loved by Thousands',
    desc: 'Rated 4.8★ by happy parents & kids.'
  },
  {
    icon: Truck,
    title: 'Fast & Free Delivery',
    desc: 'Quick delivery across India on orders above ₹999.'
  }
];

export function TrustBadges() {
  return (
    <section className="py-12 bg-background border-y border-pink-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start gap-4 max-w-[280px] mx-auto sm:mx-0">
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-primary flex-shrink-0">
                <item.icon className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h5 className="font-extrabold text-sm text-foreground">{item.title}</h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}