export const VIEW_MULTIPLIERS = {
  Variable: 1,
  Operations: 0.75,
  Total: 1.75
} as const;

export const AVAILABLE_YEARS = ['2019', '2020', '2021', '2022', '2023', '2024'] as const;

export const AVAILABLE_CROPS = [
  'Wheat (Winter)',
  'Field Bean (Spring)',
  'Barley (Winter)',
  'Linseed',
  'Oats (Spring)',
  'Mustard',
  'Maize (Forage)'
] as const;

export const AVAILABLE_FILTERS = [
  'None',
  'End Use Market',
  'End Use Group',
  'Field',
  'Variety'
] as const;

export type ViewType = keyof typeof VIEW_MULTIPLIERS;
export type UnitType = '£/t' | '£/ha' | 't/ha';
export type TabType = 'comparison' | 'rotation';
export type Year = typeof AVAILABLE_YEARS[number] | 'Yearly avg';