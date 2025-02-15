import { Year } from '../constants/analytics';

export type { Year };

export interface MetricData {
  perTonne: number;
  perHectare: number;
}

export interface ChemicalBreakdown {
  traceElement: { [key in Year]: MetricData };
  herbicide: { [key in Year]: MetricData };
  fungicide: { [key in Year]: MetricData };
  adjuvant: { [key in Year]: MetricData };
}

export interface MetricsData {
  costOfProduction: { [key in Year]: MetricData };
  seed: { [key in Year]: MetricData };
  fertiliser: { [key in Year]: MetricData };
  chemicals: { [key in Year]: MetricData };
  chemicalBreakdown: ChemicalBreakdown;
  grossMargin: { [key in Year]: MetricData };
  cultivating: { [key in Year]: MetricData };
  drilling: { [key in Year]: MetricData };
  applications: { [key in Year]: MetricData };
  harvesting: { [key in Year]: MetricData };
  other: { [key in Year]: MetricData };
  production: { [key in Year]: MetricData };
  yield: { [key in Year]: MetricData };
  netMargin: { [key in Year]: MetricData };
}

export type UnitType = '£/t' | '£/ha';
export type ViewType = 'Variable' | 'Operations' | 'Total';
export type TabType = 'comparison' | 'rotation';
export type MetricType = keyof MetricsData | 'variableCosts' | 'operationsCosts' | 'totalCosts';