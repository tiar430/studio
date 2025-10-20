'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROGRAM_STATUSES } from '@/lib/data';
import type { Program, Brand } from '@/lib/types';
import { useCollection, useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';

const programFormSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    brand: z.string().min(1, 'Brand is required.'),
    type: z.string().min(1, 'Type is required.'),
    status: z.enum(PROGRAM_STATUSES),
    target: z.coerce.number().min(0, 'Target must be a positive number.'),
    pencapaian: z.coerce.number().min(0, 'Achievement must be a positive number.'),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid start date.'),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end date.'),
    rewardValue: z.coerce.number().min(0, 'Reward value must be positive.'),
  })
  .refine(
    (data) => data.pencapaian <= data.target,
    {
      message: 'Achievement cannot exceed target.',
      path: ['pencapaian'],
    }
  )
  .refine(
    (data) => new Date(data.startDate) < new Date(data.endDate),
    {
      message: 'End date must be after start date.',
      path: ['endDate'],
    }
  );

type ProgramFormValues = z.infer<typeof programFormSchema>;

interface ProgramFormProps {
  program?: Omit<Program, 'userId'> | null;
  onSubmit: (values: ProgramFormValues) => void;
}

export function ProgramForm({ program, onSubmit }: ProgramFormProps) {
    const { user } = useAuth();
    const firestore = useFirestore();

    const brandsCollection = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, `users/${user.uid}/brands`);
    }, [firestore, user]);

    const { data: brandsData } = useCollection<Omit<Brand, 'id' | 'userId'>>(brandsCollection);
    
    const brands = useMemo(() => brandsData?.map(b => b.name) || [], [brandsData]);

  const defaultValues: Partial<ProgramFormValues> = program
    ? {
        ...program,
      }
    : {
        name: '',
        brand: '',
        type: '',
        status: 'Todo',
        target: 0,
        pencapaian: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        rewardValue: 0,
      };

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues,
    resetOptions: {
        keepDirtyValues: true,
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Q3 Sales Campaign" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Marketing" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROGRAM_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pencapaian"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pencapaian (Achievement)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="rewardValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reward Value</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {program ? 'Save Changes' : 'Create Program'}
        </Button>
      </form>
    </Form>
  );
}
