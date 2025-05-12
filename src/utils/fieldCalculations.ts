import { FieldData } from '../data/fieldData';
import { Year } from '../types/analytics';

const CURRENT_YEAR: Year = '2024';
const PREVIOUS_YEAR: Year = '2023';

export function getFieldSize(field: FieldData): number {
  return field.metrics[CURRENT_YEAR]?.yield || 0;
}

export function getTotalGroupSize(fields: FieldData[]): number {
  return fields.reduce((sum, field) => sum + getFieldSize(field), 0);
}

export function getFieldCropDetails(field: FieldData) {
  return {
    currentCrop: field.metrics[CURRENT_YEAR]?.cropType || 'Not set',
    previousCrop: field.metrics[PREVIOUS_YEAR]?.cropType || 'Not set',
    currentYear: CURRENT_YEAR,
    previousYear: PREVIOUS_YEAR,
    size: getFieldSize(field)
  };
}