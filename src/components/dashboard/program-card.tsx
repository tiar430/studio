
'use client';

import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Program } from '@/lib/types';
import { format, differenceInDays, formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

type ProgramCardProps = {
  program: Program;
  onEdit: (program: Program) => void;
  onDelete: (programId: string) => void;
};

export function ProgramCard({ program, onEdit, onDelete }: ProgramCardProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const achievementProgress = (program.pencapaian / program.target) * 100;
  
    const startDate = new Date(program.startDate);
    const endDate = new Date(program.endDate);
    const today = new Date();
  
    const totalDuration = differenceInDays(endDate, startDate);
    const daysGone = differenceInDays(today, startDate);
    const timeGoneProgress = totalDuration > 0 ? (daysGone / totalDuration) * 100 : 0;
    const clampedTimeGone = Math.max(0, Math.min(100, timeGoneProgress));
    
    const reward = program.pencapaian * program.rewardValue;

    const formatCurrency = (value: number) => {
        if (!isClient) return 'Rp...';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    const formatNumber = (value: number) => {
        if (!isClient) return '...';
        return value.toLocaleString('id-ID');
    }

    return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start">
            <div className="flex-1">
                <CardTitle className="font-headline text-lg group-hover:underline">{program.name}</CardTitle>
                <CardDescription>{program.brand} - {program.type}</CardDescription>
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
                <DropdownMenuItem onSelect={() => onEdit(program)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onDelete(program.id)} className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
            <div className="flex justify-between mb-1 text-xs text-muted-foreground">
                <span>Achievement</span>
                <span>{achievementProgress.toFixed(0)}%</span>
            </div>
            <Progress value={achievementProgress} aria-label={`${achievementProgress.toFixed(0)}% achievement`} />
            <p className="text-xs text-muted-foreground mt-1 text-right">{formatNumber(program.pencapaian)} / {formatNumber(program.target)}</p>
        </div>
        <div>
            <div className="flex justify-between mb-1 text-xs text-muted-foreground">
                <span>Time Gone</span>
                <span>{clampedTimeGone.toFixed(0)}%</span>
            </div>
            <Progress value={clampedTimeGone} aria-label={`${clampedTimeGone.toFixed(0)}% time gone`} />
            <p className="text-xs text-muted-foreground mt-1 text-right">
                {isClient ? `Ends in ${formatDistanceToNow(endDate, { addSuffix: true })}` : 'Calculating...'}
            </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="outline">{program.status}</Badge>
        <div className="text-sm font-semibold text-foreground">
            Reward: {formatCurrency(reward)}
        </div>
      </CardFooter>
    </Card>
    );
}
