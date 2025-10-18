"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { BRANDS, initialPrograms } from '@/lib/data';
import type { Program } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard/header';
import { KanbanView } from '@/components/dashboard/kanban-view';
import { TableView } from '@/components/dashboard/table-view';
import { ProgramForm } from '@/components/dashboard/program-form';
import { differenceInDays } from 'date-fns';

export default function DashboardPage() {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }
  }, []);
  
  useEffect(() => {
    const checkProgramDeadlines = () => {
      programs.forEach(program => {
        const daysLeft = differenceInDays(new Date(program.endDate), new Date());
        if (daysLeft > 0 && daysLeft <= 7 && program.status !== 'Done') {
          if (Notification.permission === 'granted') {
            new Notification('Program Nearing Deadline', {
              body: `"${program.name}" is ending in ${daysLeft} day(s).`,
              icon: '/favicon.ico'
            });
          }
        }
      });
    };
  
    const intervalId = setInterval(checkProgramDeadlines, 1000 * 60 * 60 * 24); // Check once a day
    checkProgramDeadlines(); // Initial check
  
    return () => clearInterval(intervalId);
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    return programs
      .filter((program) =>
        program.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((program) =>
        activeBrands.length === 0 ? true : activeBrands.includes(program.brand)
      );
  }, [programs, searchTerm, activeBrands]);

  const handleBrandFilterChange = (brand: string) => {
    setActiveBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const handleAddProgram = () => {
    setEditingProgram(null);
    setIsFormOpen(true);
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setIsFormOpen(true);
  };

  const handleDeleteProgram = (programId: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== programId));
    toast({
      title: 'Program Deleted',
      description: 'The program has been successfully removed.',
    });
  };

  const handleFormSubmit = (values: Omit<Program, 'id'>) => {
    if (editingProgram) {
      // Update
      setPrograms(programs.map(p => p.id === editingProgram.id ? { ...p, ...values } : p));
      toast({ title: 'Success', description: 'Program updated successfully.' });
    } else {
      // Create
      const newProgram = { ...values, id: `PROG-${Date.now()}` };
      setPrograms([newProgram, ...programs]);
      toast({ title: 'Success', description: 'Program created successfully.' });
    }
    setIsFormOpen(false);
    setEditingProgram(null);
  };

  const handleExport = () => {
    const headers = Object.keys(programs[0]).join(',');
    const csv = [
      headers,
      ...programs.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'programs.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Exported', description: 'Program data exported to CSV.' });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const importedPrograms: Program[] = lines.slice(1).map(line => {
          const data = line.split(',').map(d => d.trim());
          if (data.length !== headers.length) return null;
          let program: any = {};
          headers.forEach((header, index) => {
            const value = data[index];
            if (['target', 'pencapaian', 'rewardValue'].includes(header)) {
                program[header] = Number(value);
            } else {
                program[header] = value;
            }
          });
          return program as Program;
        }).filter((p): p is Program => p !== null && p.id);
        
        // Naive merge: overwrite existing, add new
        const newPrograms = [...programs];
        importedPrograms.forEach(imp => {
            const existingIndex = newPrograms.findIndex(p => p.id === imp.id);
            if (existingIndex !== -1) {
                newPrograms[existingIndex] = imp;
            } else {
                newPrograms.push(imp);
            }
        });

        setPrograms(newPrograms);
        toast({ title: 'Import Complete', description: `${importedPrograms.length} programs imported.` });
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <DashboardHeader
        view={view}
        setView={setView}
        onAddProgram={handleAddProgram}
        onSearch={setSearchTerm}
        brands={BRANDS}
        activeBrands={activeBrands}
        onBrandFilterChange={handleBrandFilterChange}
        onImport={handleImport}
        onExport={handleExport}
      />
      <div className="mt-4">
        {view === 'kanban' ? (
          <KanbanView programs={filteredPrograms} onEdit={handleEditProgram} onDelete={handleDeleteProgram} />
        ) : (
          <TableView programs={filteredPrograms} onEdit={handleEditProgram} onDelete={handleDeleteProgram} />
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingProgram ? 'Edit Program' : 'Create New Program'}</DialogTitle>
            <DialogDescription>
              {editingProgram ? 'Update the details of your program.' : 'Fill in the details to create a new program.'}
            </DialogDescription>
          </DialogHeader>
          <ProgramForm
            program={editingProgram}
            onSubmit={handleFormSubmit}
            brands={BRANDS}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
