"use client";

import { useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase';
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';

const categorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric and hyphens only'),
  description: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(['Active', 'Inactive']),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: any;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      image: initialData?.image || '',
      status: initialData?.status || 'Active'
    }
  });

  const imageUrl = watch('image');

  const generateSlug = () => {
    const name = watch('name');
    if (name) {
      setValue('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''), { shouldValidate: true });
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file type', description: 'Please select an image file', variant: 'destructive' });
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawResult = event.target?.result as string;
        const img = new window.Image();
        img.onload = () => {
          // Resize image to max 800x800 for optimal fast payload
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.85);
            setValue('image', compressedUrl, { shouldValidate: true });
          } else {
            setValue('image', rawResult, { shouldValidate: true });
          }
          setUploading(false);
          toast({ title: 'Picture processed successfully' });
        };
        img.onerror = () => {
          setValue('image', rawResult, { shouldValidate: true });
          setUploading(false);
        };
        img.src = rawResult;
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploading(false);
      toast({ title: 'Upload error', description: err.message || 'Failed to process image file', variant: 'destructive' });
    }
  };

  const removeImage = () => {
    setValue('image', '', { shouldValidate: true });
  };

  const onSubmit = async (data: CategoryFormValues) => {
    if (!db) return;
    setLoading(true);
    try {
      // Check for slug uniqueness
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, where('slug', '==', data.slug));
      const existing = await getDocs(q);

      if (!existing.empty && existing.docs[0].id !== initialData?.id) {
        toast({ title: 'Validation Error', description: 'This slug is already in use by another category.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      if (initialData?.id) {
        await updateDoc(doc(db, 'categories', initialData.id), {
          ...data,
          updatedAt: new Date()
        });
        toast({ title: 'Category updated successfully' });
      } else {
        await addDoc(categoriesRef, {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast({ title: 'Category created successfully' });
      }
      router.push('/admin/categories');
      router.refresh();
    } catch (error: any) {
      toast({ title: 'Error saving category', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input id="name" {...register('name')} placeholder="e.g. Organic Oils" className="rounded-xl" />
          {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="slug">URL Slug</Label>
            <button type="button" onClick={generateSlug} className="text-xs text-indigo-600 font-bold hover:underline">Generate from Name</button>
          </div>
          <Input id="slug" {...register('slug')} placeholder="e.g. organic-oils" className="rounded-xl" />
          {errors.slug && <p className="text-xs text-rose-500">{errors.slug.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} placeholder="Category description..." className="rounded-xl min-h-[100px]" />
        </div>

        {/* Category Image Field (Optional) */}
        <div className="space-y-3">
          <Label>Category Picture <span className="text-slate-400 font-normal">(Optional)</span></Label>
          <p className="text-xs text-slate-500">Upload an optional picture for this category. If uploaded, it will be displayed on the landing page in the Shop By Category section.</p>
          
          {imageUrl ? (
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-slate-200 group">
              <Image src={imageUrl} alt="Category preview" fill className="object-cover" unoptimized />
              <button 
                type="button" 
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="w-full h-36 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-colors flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-indigo-600 group">
              {uploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">Click to Upload Category Picture</span>
                  <span className="text-[10px] text-slate-400 mt-1">Instant upload (PNG, JPG, WEBP)</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          )}

          {/* Direct Image URL Input (Optional) */}
          <div className="pt-1">
            <Label htmlFor="image-url" className="text-xs text-slate-500">Or paste image URL directly:</Label>
            <Input 
              id="image-url"
              type="text" 
              placeholder="https://example.com/image.jpg" 
              value={imageUrl || ''} 
              onChange={(e) => setValue('image', e.target.value, { shouldValidate: true })} 
              className="rounded-xl mt-1 text-xs"
            />
          </div>

          {errors.image && <p className="text-xs text-rose-500">{errors.image.message}</p>}
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div>
            <p className="font-bold text-sm text-slate-800">Active Status</p>
            <p className="text-xs text-slate-500">Should this category be visible on the store?</p>
          </div>
          <Switch 
            checked={watch('status') === 'Active'} 
            onCheckedChange={(c) => setValue('status', c ? 'Active' : 'Inactive')} 
          />
        </div>

        <div className="pt-4 flex gap-4">
          <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => router.push('/admin/categories')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || uploading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {initialData ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </div>
  );
}


