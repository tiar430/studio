export type ProgramStatus = 'Todo' | 'In Progress' | 'Done';

export type Program = {
  id: string;
  name: string;
  brand: string;
  type: string;
  status: ProgramStatus;
  target: number;
  pencapaian: number;
  startDate: string;
  endDate: string;
  rewardValue: number;
  userId: string;
};

export type Brand = {
    id: string;
    name: string;
    description?: string;
    logoUrl?: string;
    userId: string;
}
