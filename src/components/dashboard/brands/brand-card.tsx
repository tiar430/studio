'use client';

import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import type { Brand } from '@/lib/types';

type BrandCardProps = {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
};

export function BrandCard({ brand, onEdit, onDelete }: BrandCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-4">
            <Image
                src={brand.logoUrl || `https://picsum.photos/seed/${brand.id}/40/40`}
                alt={`${brand.name} logo`}
                width={40}
                height={40}
                className="rounded-full"
                data-ai-hint="brand logo"
            />
            <div>
                <CardTitle className="font-headline text-lg">{brand.name}</CardTitle>
                {brand.description && <CardDescription>{brand.description}</CardDescription>}
            </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => onEdit(brand)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete(brand.id)} className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
    </Card>
  );
}
