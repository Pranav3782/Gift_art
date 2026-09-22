"use client";

import { useMemo, useState } from 'react';
import { 
  Search, 
  Edit2, 
  Plus,
  Trash2,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Product, Category } from '@/lib/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminProductsPage() {
  const db = useFirestore();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const categoryFilter = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);
  const { data: allProducts, loading } = useCollection<any>(productsQuery);

  const categoriesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'categories'), orderBy('name', 'asc'));
  }, [db]);
  const { data: categories } = useCollection<any>(categoriesQuery);

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter(p => {
      // Handle legacy products by checking both categoryId and legacy category string
      if (categoryFilter && p.categoryId !== categoryFilter && p.category?.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      if (statusFilter !== 'All' && (p.status || 'Active') !== statusFilter) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [allProducts, categoryFilter, searchQuery, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, 'products', id));
      toast({ title: 'Product deleted' });
    } catch (error: any) {
      toast({ title: 'Failed to delete product', description: error.message, variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">Products</h1>
          <p className="text-sm text-slate-400 font-medium">Manage your entire product catalog.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search products by name..." 
            className="pl-10 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No products found matching your criteria.</p>
              </div>
            )}
            {filteredProducts.map((p) => {
              const catName = categories?.find(c => c.id === p.categoryId)?.name || p.category || 'Uncategorized';
              const status = p.status || 'Active';
              return (
                <div key={p.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {p.image ? (
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-lg">{p.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-widest">{catName}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                          status === 'Draft' ? 'bg-amber-50 text-amber-600' :
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="font-black text-slate-800 text-lg">₹{p.price?.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 font-medium">{p.stockQuantity !== undefined ? `${p.stockQuantity} in stock` : 'Stock unmanaged'}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/edit/${p.id}`}>
                        <Button variant="ghost" size="icon" className="text-indigo-600">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50" disabled={deletingId === p.id}>
                            {deletingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the product "{p.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
