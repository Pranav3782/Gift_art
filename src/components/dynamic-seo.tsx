'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

export function DynamicSEO() {
  const pathname = usePathname();
  const db = useFirestore();
  const [productData, setProductData] = useState<any>(null);
  
  // Guard against undefined db during SSR
  const seoRef = useMemo(() => db ? doc(db, 'settings', 'seo') : null, [db]);
  const { data: globalSeo, loading: globalLoading } = useDoc<any>(seoRef);

  // Detect if we are on a product page
  const productId = useMemo(() => {
    if (pathname.startsWith('/product/')) {
      return pathname.split('/').pop();
    }
    return null;
  }, [pathname]);

  // If on product page, fetch product-specific SEO
  useEffect(() => {
    if (!db || !productId) {
      setProductData(null);
      return;
    }

    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'products', productId);
        // We use a simple fetch here instead of useDoc to avoid hook complexity in DynamicSEO
        const { getDoc } = await import('firebase/firestore');
        const snap = await getDoc(productRef);
        if (snap.exists()) {
          setProductData(snap.data());
        }
      } catch (e) {
        console.error("SEO Product fetch error", e);
      }
    };

    fetchProduct();
  }, [db, productId]);

  useEffect(() => {
    if (globalLoading || !globalSeo) return;

    try {
      const isProductPage = !!productData;
      const productSeo = productData?.seo || {};

      // Priority: Product SEO > Global SEO > Default
      const title = productSeo.title || productData?.name || globalSeo.defaultTitle || 'GiftArtStudio | Magical Personalized Gifts';
      const description = productSeo.description || productData?.description || globalSeo.defaultDescription || 'Discover premium handcrafted gifts for kids and adults.';
      const keywords = productSeo.keywords || globalSeo.keywords || '';
      const ogImage = productSeo.ogImage || productData?.image || globalSeo.ogImage || '';
      const canonical = productSeo.canonicalUrl || `${globalSeo.canonicalBase || ''}${pathname}`;
      const noIndex = productSeo.noIndex === true;

      document.title = title;
      
      const updateMeta = (name: string, content: string, isProperty = false) => {
        let el = document.querySelector(isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`);
        if (!el) {
          el = document.createElement('meta');
          if (isProperty) el.setAttribute('property', name);
          else el.setAttribute('name', name);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      updateMeta('description', description);
      updateMeta('keywords', keywords);
      
      updateMeta('og:title', productSeo.ogTitle || title, true);
      updateMeta('og:description', productSeo.ogDescription || description, true);
      updateMeta('og:url', canonical, true);
      updateMeta('og:image', ogImage, true);
      updateMeta('og:type', isProductPage ? 'og:product' : 'website', true);

      updateMeta('twitter:card', 'summary_large_image');
      updateMeta('twitter:site', globalSeo.twitterHandle || '');
      updateMeta('twitter:title', title);
      updateMeta('twitter:description', description);
      updateMeta('twitter:image', ogImage);

      // Robots
      updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

      // Canonical
      let canonicalEl = document.querySelector('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute('href', canonical);

      // JSON-LD Product Schema
      if (isProductPage) {
        const schemaId = 'product-schema';
        let schemaEl = document.getElementById(schemaId);
        if (!schemaEl) {
          schemaEl = document.createElement('script');
          schemaEl.setAttribute('type', 'application/ld+json');
          schemaEl.setAttribute('id', schemaId);
          document.head.appendChild(schemaEl);
        }

        const schema = {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": productData.name,
          "image": productData.image,
          "description": productData.description,
          "brand": {
            "@type": "Brand",
            "name": "GiftArtStudio"
          },
          "offers": {
            "@type": "Offer",
            "url": canonical,
            "priceCurrency": "INR",
            "price": productData.price,
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": productData.rating || 5,
            "reviewCount": productData.reviews || 10
          }
        };
        schemaEl.textContent = JSON.stringify(schema);
      }
    } catch (e) {
      // Fail silently for SEO injection
    }

  }, [pathname, globalSeo, globalLoading, productData]);

  return null;
}
