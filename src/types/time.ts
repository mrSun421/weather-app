export type TimePreset = 'day' | 'morning' | 'afternoon' | 'evening' | 'custom';

export interface TimeRange {
  preset: TimePreset;
  from: number;
  to: number;
} 