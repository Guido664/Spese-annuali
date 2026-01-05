export enum Frequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  frequency: Frequency;
  category?: string; // AI implied category
}

export const FrequencyLabels: Record<Frequency, string> = {
  [Frequency.DAILY]: 'Giornaliero',
  [Frequency.WEEKLY]: 'Settimanale',
  [Frequency.MONTHLY]: 'Mensile',
  [Frequency.QUARTERLY]: 'Trimestrale',
  [Frequency.YEARLY]: 'Annuale',
};

export const FrequencyMultipliers: Record<Frequency, number> = {
  [Frequency.DAILY]: 365,
  [Frequency.WEEKLY]: 52,
  [Frequency.MONTHLY]: 12,
  [Frequency.QUARTERLY]: 4,
  [Frequency.YEARLY]: 1,
};