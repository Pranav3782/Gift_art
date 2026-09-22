"use client";

import { use, useMemo, useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Tag, 
  Edit2, 
  Trash2, 
  ImagePlus,
  Box,
  ArrowLeft,
  Loader2,
  Star,
  Sparkles,
  Save,
  X,
  Lock,
  ChevronUp,
  ChevronDown,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useFirestore, useCollection, errorEmitter, FirestorePermissionError, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SUPER_ADMIN_EMAIL = "rohanswakkargiftartstudio@gmail.com";

function ProductForm({ isEdit, editingProduct, imageUrls, setImageUrls, isSaving, onSubmit }: {
  isEdit?: boolean;
  editingProduct: any;
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  isSaving: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const addImageUrl = () => setImageUrls((prev: string[]) => [...prev, '']);
  const removeImageUrl = (index: number) => setImageUrls((prev: string[]) => prev.filter((_: string, i: number) => i !== index));
  const updateImageUrl = (index: number, val: string) => {
    setImageUrls((prev: string[]) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };
  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImageUrls((prev: string[]) => {
      const newIdx = direction === 'up' ? index - 1 : index + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const updated = [...prev];
      [updated[index], updated[newIdx]] = [updated[newIdx], updated[index]];
      return updated;
    });
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-6 pb-6">
      <div className="col-span-2 flex items-center gap-2 pb-2 border-b border-slate-100">
        <Box className="h-4 w-4 text-indigo-500" />
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Core Details</h3>
      </div>
      <div className="col-span-2 space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Name</Label>
        <Input name="name" required defaultValue={editingProduct?.name || ''} placeholder="e.g. Personalized Sipper" className="rounded-xl h-12 border-slate-100" />
      </div>
      <div className="col-span-2 space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
        <Textarea name="description" defaultValue={editingProduct?.description || ''} placeholder="Short product story..." className="rounded-xl min-h-[100px] border-slate-100" />
      </div>
      
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (INR)</Label>
        <Input name="price" type="number" required defaultValue={editingProduct?.price || ''} placeholder="2499" className="rounded-xl h-12 border-slate-100" />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strike Price</Label>
        <Input name="oldPrice" type="number" defaultValue={editingProduct?.oldPrice || ''} placeholder="2999" className="rounded-xl h-12 border-slate-100" />
      </div>

      <div className="col-span-2 flex items-center gap-2 pb-2 mt-4 border-b border-slate-100">
        <Sparkles className="h-4 w-4 text-indigo-500" />
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Media & Tags</h3>
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Rating (1-5)</Label>
        <div className="relative">
          <Star className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
          <Input name="rating" type="number" step="0.1" min="1" max="5" defaultValue={editingProduct?.rating || 5.0} className="pl-11 rounded-xl h-12 border-slate-100" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Video URL (Reel)</Label>
        <div className="relative">
          <Video className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
          <Input name="videoUrl" defaultValue={editingProduct?.videoUrl || ''} placeholder="https://..." className="pl-11 rounded-xl h-12 border-slate-100" />
        </div>
      </div>

      <div className="col-span-2 space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Status</Label>
        <Select name="inventoryStatus" defaultValue={editingProduct?.inventoryStatus || 'In Stock'}>
          <SelectTrigger className="rounded-xl h-12 border-slate-100">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="In Stock">In Stock</SelectItem>
            <SelectItem value="Low Stock">Low Stock</SelectItem>
            <SelectItem value="Out of Stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-2 grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center space-x-3">
          <Checkbox id="isNew" name="isNew" defaultChecked={editingProduct?.isNew} />
          <Label htmlFor="isNew" className="text-xs font-black uppercase text-slate-700 cursor-pointer">New Arrival</Label>
        </div>
        <div className="flex items-center space-x-3">
          <Checkbox id="isBestSeller" name="isBestSeller" defaultChecked={editingProduct?.isBestSeller} />
          <Label htmlFor="isBestSeller" className="text-xs font-black uppercase text-slate-700 cursor-pointer">Best Seller</Label>
        </div>
      </div>

      <div className="col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gallery Images (First is main)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addImageUrl} className="h-8 rounded-lg text-[9px] font-black uppercase">
            <Plus className="h-3 w-3 mr-1" /> Add URL
          </Button>
        </div>
        <div className="space-y-3">
          {imageUrls.map((url: string, i: number) => (
            <div key={i} className="flex gap-2 items-center">
              <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border">
                {url && <img src={url} className="w-full h-full object-cover" alt="Preview" />}
              </div>
              <Input 
                value={url} 
                onChange={(e) => updateImageUrl(i, e.target.value)}
                placeholder="https://..." 
                className="flex-1 rounded-xl h-12 text-xs" 
              />
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => moveImage(i, 'up')} className="p-1 hover:bg-slate-100 rounded"><ChevronUp className="h-3 w-3" /></button>
                <button type="button" onClick={() => moveImage(i, 'down')} className="p-1 hover:bg-slate-100 rounded"><ChevronDown className="h-3 w-3" /></button>
              </div>
              <button type="button" onClick={() => removeImageUrl(i)} className="p-2 text-rose-400 hover:text-rose-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 pt-8">
        <Button type="submit" disabled={isSaving} className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-sm shadow-xl">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : isEdit ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {isEdit ? 'Save Changes' : 'Publish Product'}
        </Button>
      </div>
    </form>
  );
}

export default function CategoryProductsPage({ params }: { params: Promise<{ category: string, subcategory: string }> }) {
  const resolvedParams = use(params);
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const isAuthorized = user?.email === SUPER_ADMIN_EMAIL;

  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'products'),
      where('category', '==', resolvedParams.category),
      where('subcategory', '==', resolvedParams.subcategory)
    );
  }, [db, resolvedParams.category, resolvedParams.subcategory]);
  
  const { data: products, loading } = useCollection<any>(productsQuery);

  useEffect(() => {
    if (editingProduct) {
      setImageUrls(editingProduct.images || [editingProduct.image]);
    } else {
      setImageUrls(['']);
    }
  }, [editingProduct, isAddModalOpen]);

  const handleUpsertProduct = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    if (!db || !user || !isAuthorized) return;

    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const validImages = imageUrls.filter(url => url.trim() !== '');
    
    const productData: any = {
      name: formData.get('name'),
      description: formData.get('description') || 'Handcrafted with love.',
      price: Number(formData.get('price')),
      oldPrice: Number(formData.get('oldPrice')) || null,
      category: resolvedParams.category,
      subcategory: resolvedParams.subcategory,
      image: validImages[0] || '',
      images: validImages,
      videoUrl: formData.get('videoUrl') || '',
      couponCode: formData.get('couponCode') || '',
      couponDiscount: Number(formData.get('couponDiscount')) || null,
      inventoryStatus: formData.get('inventoryStatus') || 'In Stock',
      rating: Number(formData.get('rating')) || 5.0,
      reviews: editingProduct ? editingProduct.reviews : 0,
      isNew: formData.get('isNew') === 'on',
      isBestSeller: formData.get('isBestSeller') === 'on',
      updatedAt: serverTimestamp(),
      ...(editingProduct ? {} : { createdAt: serverTimestamp() })
    };

    if (editingProduct) {
      const docRef = doc(db, 'products', editingProduct.id);
      updateDoc(docRef, productData)
        .then(() => {
          toast({ title: "Product Updated!", description: "Changes saved successfully." });
          setEditingProduct(null);
        })
        .catch(async (err: any) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: productData,
          }));
        })
        .finally(() => setIsSaving(false));
    } else {
      addDoc(collection(db, 'products'), productData)
        .then(() => {
          toast({ title: "Product Added!", description: "The magic is now in your catalog." });
          setIsAddModalOpen(false);
        })
        .catch(async (err: any) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: 'products',
            operation: 'create',
            requestResourceData: productData,
          }));
        })
        .finally(() => setIsSaving(false));
    }
  }, [db, user, isAuthorized, imageUrls, resolvedParams.category, resolvedParams.subcategory, editingProduct, toast]);

  const pageTitle = `${resolvedParams.subcategory.replace(/-/g, ' ')}`.toUpperCase();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href="/admin/products" className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">{pageTitle}</h1>
        </div>

        {isAuthorized ? (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-10 font-black uppercase text-sm tracking-widest gap-2 shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all">
                <Plus className="h-5 w-5" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-0 max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader className="p-8 border-b bg-slate-50/50">
                <DialogTitle className="text-2xl font-headline font-black text-slate-800 uppercase tracking-tight">Create New Entry</DialogTitle>
              </DialogHeader>
              <div className="p-8 overflow-y-auto">
                <ProductForm editingProduct={editingProduct} imageUrls={imageUrls} setImageUrls={setImageUrls} isSaving={isSaving} onSubmit={handleUpsertProduct} />
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="bg-rose-50 px-6 py-4 rounded-2xl flex items-center gap-3 text-rose-600">
            <Lock className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Locked Mode</span>
          </div>
        )}
      </div>

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-0 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="p-8 border-b bg-slate-50/50">
            <DialogTitle className="text-2xl font-headline font-black text-slate-800 uppercase tracking-tight">Edit Metadata</DialogTitle>
          </DialogHeader>
          <div className="p-8 overflow-y-auto">
            {editingProduct && <ProductForm isEdit editingProduct={editingProduct} imageUrls={imageUrls} setImageUrls={setImageUrls} isSaving={isSaving} onSubmit={handleUpsertProduct} />}
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-32"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>
        ) : products && products.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-slate-50/50">
                <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 h-14">Identity</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 h-14">Pricing</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 h-14">Rating & Reels</TableHead>
                <TableHead className="px-8 text-right h-14"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow key={product.id} className="hover:bg-slate-50/30 border-slate-50 group">
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border shrink-0">
                        <Image src={product.image || 'https://placehold.co/100'} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-black text-sm text-slate-800">{product.name}</div>
                        <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{product.images?.length || 1} IMAGES</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-black text-sm text-slate-800">₹{product.price?.toLocaleString()}</div>
                    {product.couponCode && (
                       <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Code: {product.couponCode}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-black text-amber-600">
                         <Star className="h-3 w-3 fill-amber-600" /> {product.rating || 5.0}
                       </div>
                       {product.videoUrl && (
                         <div className="bg-indigo-50 p-1 rounded text-indigo-600" title="Has Reel">
                           <Video className="h-4 w-4" />
                         </div>
                       )}
                    </div>
                  </TableCell>
                  <TableCell className="px-8 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)} className="rounded-xl text-slate-300 hover:text-indigo-600 hover:bg-indigo-50"><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (db && confirm('Delete?')) deleteDoc(doc(db, 'products', product.id));
                      }} className="rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <Box className="h-10 w-10 text-slate-200" />
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
