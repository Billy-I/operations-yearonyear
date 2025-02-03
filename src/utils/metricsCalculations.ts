import { Year, MetricsData } from '../types/analytics';
import { metricsData } from '../data/metricsData';

export const getValue = (metric: keyof MetricsData, year: string, unit: '£/t' | '£/ha'): number => {
  const data = metricsData[metric][year as Year];
  if (!data) return 0;
  return unit === '£/t' ? data.perTonne : data.perHectare;
};

export const getVariableCosts = (year: string, unit: '£/t' | '£/ha'): number => {
  return getValue('seed', year, unit) + 
         getValue('fertiliser', year, unit) + 
         getValue('chemicals', year, unit);
};

export const getOperationsCosts = (year: string, unit: '£/t' | '£/ha'): number => {
  return getValue('cultivating', year, unit) + 
         getValue('drilling', year, unit) + 
         getValue('applications', year, unit) + 
         getValue('harvesting', year, unit) + 
         getValue('other', year, unit);
};

export const getTotalCosts = (year: string, unit: '£/t' | '£/ha'): number => {
  return getVariableCosts(year, unit) + getOperationsCosts(year, unit);
};