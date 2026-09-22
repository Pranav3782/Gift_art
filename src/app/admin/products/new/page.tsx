"use client";

import { ProductForm } from '@/components/admin/product-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-slate-800 hover:shadow-md transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">New Product</h1>
          <p className="text-sm text-slate-400 font-medium">Add a new item to your store catalog.</p>
        </div>
      </div>
      
      <ProductForm />
    </div>
  );
}
