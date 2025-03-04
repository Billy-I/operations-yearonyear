import { Year, MetricsData, UnitType, MetricData } from '../types/analytics';
import { metricsData } from '../data/metricsData';
import { cropData } from '../data/cropData';

// Helper function to get hectares for a crop
const getHectares = (crop: string): number => {
  const cropInfo = cropData.find(c => c.name === crop);
  if (!cropInfo) return 1; // Default to 1 if crop not found
  const areaStr = cropInfo.area;
  const hectares = parseFloat(areaStr.split(' ')[0]);
  return isNaN(hectares) ? 1 : hectares;
};

export const getValue = (metric: keyof MetricsData, year: string, unit: UnitType, crop?: string): number => {
  try {
    // Cast to any to bypass TypeScript's type checking
    const data = (metricsData[metric] as any)[year] as MetricData;
    if (!data) return 0;
    
    // For Yield and Production, always return the same value in tonnes regardless of unit selection
    if (metric === 'yield' || metric === 'production') {
      // For yield and production, we always want to show the value in tonnes
      // The perTonne field actually contains the total tonnes value
      return data.perTonne;
    }
    
    if (unit === '£') {
      // For total numbers in £, multiply the per hectare value by the number of hectares
      const hectares = crop ? getHectares(crop) : 1;
      return data.perHectare * hectares;
    }
    
    return unit === '£/t' ? data.perTonne : data.perHectare;
  } catch (error) {
    console.error(`Error getting value for ${metric} in ${year}:`, error);
    return 0;
  }
};

export const getVariableCosts = (year: string, unit: UnitType, crop?: string): number => {
  try {
    return getValue('seed', year, unit, crop) +
           getValue('fertiliser', year, unit, crop) +
           getValue('chemicals', year, unit, crop);
  } catch (error) {
    console.error(`Error calculating variable costs for ${year}:`, error);
    return 0;
  }
};

export const getOperationsCosts = (year: string, unit: UnitType, crop?: string): number => {
  try {
    return getValue('cultivating', year, unit, crop) +
           getValue('drilling', year, unit, crop) +
           getValue('applications', year, unit, crop) +
           getValue('harvesting', year, unit, crop) +
           getValue('other', year, unit, crop);
  } catch (error) {
    console.error(`Error calculating operations costs for ${year}:`, error);
    return 0;
  }
};

export const getTotalCosts = (year: string, unit: UnitType, crop?: string): number => {
  try {
    return getVariableCosts(year, unit, crop) + getOperationsCosts(year, unit, crop);
  } catch (error) {
    console.error(`Error calculating total costs for ${year}:`, error);
    return 0;
  }
};