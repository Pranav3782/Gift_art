"use client";

import { useMemo } from 'react';
import { CategoryForm } from '@/components/admin/category-form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function EditCategoryPage() {
  const params = useParams();
  const id = params.id as string;
  const db = useFirestore();
  
  const docRef = useMemo(() => {
    if (!db || !id) return null;
    return doc(db, 'categories', id);
  }, [db, id]);
  
  const { data: category, loading } = useDoc<any>(docRef);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /></div>;
  }

  if (!category) {
    return <div className="py-20 text-center text-slate-400">Category not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-slate-800 hover:shadow-md transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">Edit Category</h1>
          <p className="text-sm text-slate-400 font-medium">Update details for {category.name}.</p>
        </div>
      </div>
      
      <CategoryForm initialData={{ id: category.id, ...category }} />
    </div>
  );
}
