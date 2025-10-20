'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandForm } from '@/components/dashboard/brands/brand-form';
import { BrandList } from '@/components/dashboard/brands/brand-list';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Brand } from '@/lib/types';

export default function BrandsPage() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const brandsCollection = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/brands`);
  }, [firestore, user]);

  const { data: brands, isLoading } = useCollection<Omit<Brand, 'id'>>(brandsCollection);

  const handleAddBrand = () => {
    setEditingBrand(null);
    setIsFormOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setIsFormOpen(true);
  };

  const handleDeleteBrand = (brandId: string) => {
    if (!user) return;
    const brandDocRef = doc(firestore, `users/${user.uid}/brands`, brandId);
    deleteDocumentNonBlocking(brandDocRef);
    toast({
      title: 'Brand Deleted',
      description: 'The brand has been successfully removed.',
    });
  };

  const handleFormSubmit = (values: Omit<Brand, 'id' | 'userId'>) => {
    if (!user) return;

    if (editingBrand) {
      // Update
      const brandDocRef = doc(firestore, `users/${user.uid}/brands`, editingBrand.id);
      updateDocumentNonBlocking(brandDocRef, values);
      toast({ title: 'Success', description: 'Brand updated successfully.' });
    } else {
      // Create
      const newBrand = { ...values, userId: user.uid };
      if (brandsCollection) {
        addDocumentNonBlocking(brandsCollection, newBrand);
        toast({ title: 'Success', description: 'Brand created successfully.' });
      }
    }
    setIsFormOpen(false);
    setEditingBrand(null);
  };
  
  return (
    <>
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Brand Management</h1>
            <Button size="sm" className="h-9 gap-1" onClick={handleAddBrand}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Brand
                </span>
            </Button>
        </div>

        <div className="mt-4">
            <BrandList 
                brands={brands || []} 
                onEdit={handleEditBrand} 
                onDelete={handleDeleteBrand}
                isLoading={isLoading}
            />
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle className="font-headline">{editingBrand ? 'Edit Brand' : 'Create New Brand'}</DialogTitle>
                <DialogDescription>
                {editingBrand ? 'Update the details of your brand.' : 'Fill in the details to create a new brand.'}
                </DialogDescription>
            </DialogHeader>
            <BrandForm
                brand={editingBrand}
                onSubmit={handleFormSubmit}
            />
            </DialogContent>
        </Dialog>
    </>
  );
}
