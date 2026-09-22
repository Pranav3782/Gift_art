"use client";

import { useState } from 'react';
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
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const categorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric and hyphens only'),
  description: z.string().optional(),
  status: z.enum(['Active', 'Inactive']),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: CategoryFormValues & { id: string };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      status: 'Active'
    }
  });

  const generateSlug = () => {
    const name = watch('name');
    if (name) {
      setValue('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''), { shouldValidate: true });
    }
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
          <Button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {initialData ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </div>
  );
}
