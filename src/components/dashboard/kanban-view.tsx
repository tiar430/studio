import type { Program, ProgramStatus } from '@/lib/types';
import { ProgramCard } from './program-card';

type KanbanViewProps = {
  programs: Program[];
  onEdit: (program: Program) => void;
  onDelete: (programId: string) => void;
};

const columns: { title: ProgramStatus; programs: Program[] }[] = [
  { title: 'Todo', programs: [] },
  { title: 'In Progress', programs: [] },
  { title: 'Done', programs: [] },
];

export function KanbanView({ programs, onEdit, onDelete }: KanbanViewProps) {
  const columnMap: Record<ProgramStatus, Program[]> = {
    'Todo': [],
    'In Progress': [],
    'Done': [],
  };

  programs.forEach(program => {
    if (columnMap[program.status]) {
      columnMap[program.status].push(program);
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(columnMap).map(([status, programsInColumn]) => (
        <div key={status} className="flex flex-col gap-4">
          <h2 className="font-headline text-xl font-semibold tracking-tight">{status} ({programsInColumn.length})</h2>
          <div className="flex flex-col gap-4">
            {programsInColumn.length > 0 ? (
                programsInColumn.map(program => (
                    <ProgramCard key={program.id} program={program} onEdit={onEdit} onDelete={onDelete} />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-muted-foreground h-48">
                    <p>No programs in this stage.</p>
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
