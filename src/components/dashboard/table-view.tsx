
'use client';

import { MoreHorizontal } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
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
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Program } from '@/lib/types';
import { format, differenceInDays, formatDistanceToNow } from 'date-fns';

type TableViewProps = {
  programs: Program[];
  onEdit: (program: Program) => void;
  onDelete: (programId: string) => void;
};

export function TableView({ programs, onEdit, onDelete }: TableViewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatCurrency = (value: number) => {
    if (!isClient) return 'Rp...';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">All Programs</CardTitle>
        <CardDescription>
          A comprehensive list of all ongoing and completed programs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Brand</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Achievement</TableHead>
              <TableHead>Time Gone</TableHead>
              <TableHead className="hidden md:table-cell">Reward</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program) => {
              const achievementProgress = (program.pencapaian / program.target) * 100;
              
              const startDate = new Date(program.startDate);
              const endDate = new Date(program.endDate);
              const today = new Date();
              const totalDuration = differenceInDays(endDate, startDate);
              const daysGone = differenceInDays(today, startDate);
              const timeGoneProgress = totalDuration > 0 ? (daysGone / totalDuration) * 100 : 0;
              const clampedTimeGone = Math.max(0, Math.min(100, timeGoneProgress));

              const reward = program.pencapaian * program.rewardValue;

              return (
                <TableRow key={program.id}>
                  <TableCell className="font-medium">{program.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{program.brand}</TableCell>
                  <TableCell className="hidden md:table-cell">{program.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{program.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-28">
                        <Progress value={achievementProgress} className="h-2" />
                        <span className="text-xs text-muted-foreground">{achievementProgress.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-28">
                        <Progress value={clampedTimeGone} className="h-2" />
                        <span className="text-xs text-muted-foreground">{isClient ? formatDistanceToNow(endDate, { addSuffix: true }) : '...'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatCurrency(reward)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => onEdit(program)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onDelete(program.id)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {programs.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
                No programs found. Try adjusting your filters.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
