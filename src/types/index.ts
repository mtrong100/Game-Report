export interface GameRecord {
  id: string;
  game: string;
  win: number;
  loss: number;
  total: number;
  date: string; // DD/MM/YYYY
  time: string;
  timestamp: number; // For sorting
}

export type SortOption = 'date' | 'win' | 'loss' | 'total';
export type SortDirection = 'asc' | 'desc';
