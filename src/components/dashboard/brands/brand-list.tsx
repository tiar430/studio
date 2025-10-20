'use client';

import { BrandCard } from './brand-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Brand } from '@/lib/types';

type BrandListProps = {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
  isLoading: boolean;
};

export function BrandList({ brands, onEdit, onDelete, isLoading }: BrandListProps) {
    if (isLoading) {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
            ))}
          </div>
        );
    }
  
    if (brands.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-muted-foreground h-48">
                <p>No brands found.</p>
                <p className="text-sm">Click Add Brand to get started.</p>
            </div>
        );
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
