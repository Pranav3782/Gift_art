"use client";

import { Footerdemo } from "@/components/ui/footer-section";
import { MobileFooter } from "@/components/mobile-footer";
import { MobileFooterPromo } from "@/components/home/mobile-footer-promo";
import { useMemo } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

function Footer() {
  const db = useFirestore();
  
  const footerRef = useMemo(() => {
    if (!db) return null;
    return doc(db, 'homepageDesktop', 'footer');
  }, [db]);
  
  const { data: footerConfig } = useDoc<any>(footerRef);

  return (
    <>
      <div className="hidden lg:block">
        <Footerdemo />
      </div>
      <MobileFooterPromo cms={footerConfig} />
      <MobileFooter cms={footerConfig} />
    </>
  );
}

export { Footer };
