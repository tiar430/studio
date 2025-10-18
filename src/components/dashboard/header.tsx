import {
  FileDown,
  FileUp,
  Filter,
  LayoutGrid,
  List,
  PlusCircle,
  Search,
} from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type HeaderProps = {
  view: 'kanban' | 'table';
  setView: (view: 'kanban' | 'table') => void;
  onAddProgram: () => void;
  onSearch: (term: string) => void;
  brands: string[];
  activeBrands: string[];
  onBrandFilterChange: (brand: string) => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
};

export function DashboardHeader({
  view,
  setView,
  onAddProgram,
  onSearch,
  brands,
  activeBrands,
  onBrandFilterChange,
  onImport,
  onExport,
}: HeaderProps) {
  const importInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Programs</h1>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search by program type..."
                className="w-full rounded-lg bg-card pl-8"
                onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Brand
                    </span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by brand</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {brands.map((brand) => (
                    <DropdownMenuCheckboxItem
                    key={brand}
                    checked={activeBrands.includes(brand)}
                    onCheckedChange={() => onBrandFilterChange(brand)}
                    >
                    {brand}
                    </DropdownMenuCheckboxItem>
                ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="hidden sm:flex">
                <Tabs value={view} onValueChange={(value) => setView(value as 'kanban' | 'table')}>
                    <TabsList>
                        <TabsTrigger value="kanban"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
                        <TabsTrigger value="table"><List className="h-4 w-4" /></TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-9 gap-1" onClick={onExport}>
                    <FileUp className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Export
                    </span>
                </Button>
                <input type="file" ref={importInputRef} className="hidden" onChange={onImport} accept=".csv" />
                <Button size="sm" variant="outline" className="h-9 gap-1" onClick={() => importInputRef.current?.click()}>
                    <FileDown className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Import
                    </span>
                </Button>
                <Button size="sm" className="h-9 gap-1" onClick={onAddProgram}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Program
                    </span>
                </Button>
            </div>
        </div>
    </div>
  );
}
