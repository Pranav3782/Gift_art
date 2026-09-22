"use client";

import { useState, useMemo, ChangeEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useCollection, useStorage } from '@/firebase';
import { collection, addDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { Category } from '@/lib/types';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description needs to be at least 10 characters'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  oldPrice: z.coerce.number().optional(),
  stockQuantity: z.coerce.number().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  status: z.enum(['Active', 'Draft', 'Out of Stock', 'Archived']),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || (initialData?.image ? [initialData.image] : []));
  
  const db = useFirestore();
  const storage = useStorage();
  const router = useRouter();
  const { toast } = useToast();

  const categoriesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'categories'), orderBy('name', 'asc'));
  }, [db]);
  const { data: categories } = useCollection<any>(categoriesQuery);

  const { register, handleSubmit, control, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      oldPrice: initialData?.oldPrice || undefined,
      stockQuantity: initialData?.stockQuantity || 0,
      categoryId: initialData?.categoryId || '',
      status: initialData?.status || 'Active',
    }
  });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !storage) return;
    const file = e.target.files[0];
    
    // Check type and size
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file type', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({ title: 'File too large (max 5MB)', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      uploadTask.on('state_changed', 
        null,
        (error) => {
          toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImages(prev => [...prev, downloadURL]);
          setUploading(false);
        }
      );
    } catch (error: any) {
      toast({ title: 'Upload error', description: error.message, variant: 'destructive' });
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!db) return;
    if (images.length === 0) {
      toast({ title: 'At least one image is required', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Find category slug to maintain backward compatibility for old routing if needed
      const cat = categories?.find(c => c.id === data.categoryId);
      
      const productPayload = {
        ...data,
        image: images[0], // Main image
        images: images,
        category: cat?.slug || '', // Legacy support
        subcategory: '', // Deprecated
        inventoryStatus: data.stockQuantity === 0 ? 'Out of Stock' : (data.stockQuantity < 5 ? 'Low Stock' : 'In Stock'),
        updatedAt: new Date(),
      };

      if (initialData?.id) {
        await updateDoc(doc(db, 'products', initialData.id), productPayload);
        toast({ title: 'Product updated successfully' });
      } else {
        await addDoc(collection(db, 'products'), {
          ...productPayload,
          createdAt: new Date(),
        });
        toast({ title: 'Product created successfully' });
      }
      
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      toast({ title: 'Error saving product', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g. Traditional Cow Ghee" className="rounded-xl" />
              {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && <p className="text-xs text-rose-500">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} placeholder="Detailed product description..." className="rounded-xl min-h-[150px]" />
              {errors.description && <p className="text-xs text-rose-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" {...register('price')} className="rounded-xl" />
                {errors.price && <p className="text-xs text-rose-500">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="oldPrice">Old Price (₹) - Optional</Label>
                <Input id="oldPrice" type="number" {...register('oldPrice')} className="rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input id="stockQuantity" type="number" {...register('stockQuantity')} className="rounded-xl" />
                {errors.stockQuantity && <p className="text-xs text-rose-500">{errors.stockQuantity.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Images */}
          <div className="space-y-6">
            <div>
              <Label className="block mb-2">Product Images</Label>
              <p className="text-xs text-slate-500 mb-4">First image will be used as the main thumbnail. Max 5MB per image.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                {images.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
                    <Image src={url} alt={`Product ${i+1}`} fill className="object-cover" />
                    {i === 0 && (
                      <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest">Primary</div>
                    )}
                    <button 
                      type="button" 
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-indigo-600 group">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">Upload Image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading || !storage} />
                </label>
              </div>
              {!storage && (
                 <div className="p-4 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold">
                   Firebase Storage is not initialized. Check your .env setup.
                 </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex gap-4">
          <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => router.push('/admin/products')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {initialData ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
