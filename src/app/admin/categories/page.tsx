"use client";

import { useMemo, useState } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Category } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Power, Loader2, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminCategoriesPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const categoriesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
  }, [db]);
  
  const { data: categories, loading } = useCollection<any>(categoriesQuery);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, 'categories', id));
      toast({ title: 'Category deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Failed to delete category', description: error.message, variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (cat: Category) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'categories', cat.id), {
        status: cat.status === 'Active' ? 'Inactive' : 'Active',
        updatedAt: new Date()
      });
      toast({ title: 'Category status updated' });
    } catch (error: any) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">Categories</h1>
          <p className="text-sm text-slate-400 font-medium">Manage product categories for your store.</p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        </Link>
      </div>

      <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {categories?.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <Tag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No categories found. Create your first category.</p>
              </div>
            )}
            {categories?.map((cat) => (
              <div key={cat.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 relative overflow-hidden border border-slate-100 shrink-0">
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} fill className="object-cover" unoptimized />
                    ) : (
                      <Tag className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800">{cat.name}</h3>
                    <p className="text-xs text-slate-400">/{cat.slug}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    cat.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {cat.status}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(cat)} title="Toggle Status">
                      <Power className={`w-4 h-4 ${cat.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`} />
                    </Button>
                    <Link href={`/admin/categories/${cat.id}`}>
                      <Button variant="ghost" size="icon" className="text-indigo-600">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </Link>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50" disabled={deletingId === cat.id}>
                          {deletingId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the category "{cat.name}". Any products in this category might become orphaned if not reassigned.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(cat.id)} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
