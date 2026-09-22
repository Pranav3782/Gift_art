'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { KidsDecor } from '@/components/kids-decor';
import { Footer } from '@/components/footer';

// Core content sections
import { CategoryGrid } from '@/components/home/category-grid';
import { MobileNewArrivals } from '@/components/home/mobile-new-arrivals';
import { NewArrivals } from '@/components/home/new-arrivals';
import { MobileBestSellers } from '@/components/home/mobile-best-sellers';
import { BestSellers } from '@/components/home/best-sellers';
import { TrustBar } from '@/components/home/trust-bar';

// Dynamic heavy components
const FestiveSection = dynamic(() => import('@/components/home/festive-section').then(mod => mod.FestiveSection), { ssr: false });
const MobileFestiveCarousel = dynamic(() => import('@/components/home/mobile-festive-carousel').then(mod => mod.MobileFestiveCarousel), { ssr: false });
const WhyUs = dynamic(() => import('@/components/home/why-us').then(mod => mod.WhyUs), { ssr: false });
const MobileWhyUs = dynamic(() => import('@/components/home/mobile-why-us').then(mod => mod.MobileWhyUs), { ssr: false });
const MagicalMedia = dynamic(() => import('@/components/home/magical-media').then(mod => mod.MagicalMedia), { ssr: false });
const MagicalPicksMobile = dynamic(() => import('@/components/home/magical-picks-mobile').then(mod => mod.MagicalPicksMobile), { ssr: false });

export default function Home() {
  const db = useFirestore();
  
  // Memoize refs with path guards
  const desktopConfigRef = useMemo(() => db ? doc(db, 'homepageDesktop', 'config') : null, [db]);
  const mobileHeroRef = useMemo(() => db ? doc(db, 'mobile_homepage_sections', 'hero') : null, [db]);
  const mobileCatsRef = useMemo(() => db ? doc(db, 'mobile_homepage_sections', 'categories') : null, [db]);
  const mobileArrivalsRef = useMemo(() => db ? doc(db, 'mobile_homepage_sections', 'new-arrivals') : null, [db]);
  const mobileSellersRef = useMemo(() => db ? doc(db, 'mobile_homepage_sections', 'best-sellers') : null, [db]);
  const mobileReelsRef = useMemo(() => db ? doc(db, 'mobile_homepage_sections', 'reels') : null, [db]);
  const mobileFestiveRef = useMemo(() => db ? doc(db, 'mobile_homepage_sections', 'festive') : null, [db]);

  const { data: desktopCms } = useDoc<any>(desktopConfigRef);
  const { data: mobileHero } = useDoc<any>(mobileHeroRef);
  const { data: mobileCats } = useDoc<any>(mobileCatsRef);
  const { data: mobileArrivals } = useDoc<any>(mobileArrivalsRef);
  const { data: mobileSellers } = useDoc<any>(mobileSellersRef);
  const { data: mobileReels } = useDoc<any>(mobileReelsRef);
  const { data: mobileFestive } = useDoc<any>(mobileFestiveRef);

  return (
    <main className="min-h-screen bg-white relative overflow-x-hidden">
      <Navbar />
      <KidsDecor />

      {/* Hero Section */}
      <div className="lg:hidden">
        <Hero cms={mobileHero} isMobile />
      </div>
      <div className="hidden lg:block">
        <Hero cms={desktopCms?.heroBanner} />
      </div>
      
      <div className="flex flex-col">
        {/* Categories */}
        <div className="lg:hidden">
          <CategoryGrid cms={mobileCats} />
        </div>
        <div className="hidden lg:block">
          <CategoryGrid cms={desktopCms?.shopByCategory} />
        </div>

        {/* New Arrivals */}
        <div className="lg:hidden">
          <MobileNewArrivals cms={mobileArrivals} />
        </div>
        <div className="hidden lg:block">
          <NewArrivals cms={desktopCms?.newArrivals} />
        </div>

        {/* Bestsellers */}
        <div className="lg:hidden">
          <MobileBestSellers cms={mobileSellers} />
        </div>
        <div className="hidden lg:block">
          <BestSellers cms={desktopCms?.bestSellers} />
        </div>

        {/* Magical Media (Reels) */}
        <div className="lg:hidden">
          <MagicalPicksMobile cms={mobileReels} />
        </div>
        <div className="hidden lg:block">
          <MagicalMedia cms={desktopCms?.magicalReels} />
        </div>

        {/* Festive Collections / Featured Products */}
        <div className="lg:hidden">
          <MobileFestiveCarousel cms={mobileFestive} />
        </div>
        <div className="hidden lg:block">
          <FestiveSection cms={desktopCms?.featuredProducts} />
        </div>

        {/* Why Us */}
        <div className="lg:hidden">
          <MobileWhyUs />
        </div>
        <div className="hidden lg:block">
          <WhyUs cms={desktopCms?.whyChooseUs} />
        </div>

        {/* Trust Features */}
        <TrustBar cms={desktopCms?.trustFeatures} />
      </div>
      
      <Footer />
    </main>
  );
}
