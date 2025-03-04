import { Year } from '../../../../types/analytics';

/** 
 * Represents market benchmark data for a cost metric
 */
export interface BenchmarkData {
  min: number;
  max: number;
  average: number;
  current: number;
}

/**
 * Types of costs that have verified benchmark data
 */
export type VerifiedCostType = 'seed' | 'fertiliser' | 'chemical';

/**
 * Extended cost data including benchmark information
 */
export interface VerifiedCost extends BenchmarkData {
  type: VerifiedCostType;
  subCategories?: {
    [key: string]: BenchmarkData;
  };
}

/**
 * Represents the breakdown of costs into verified and operational categories
 */
export interface CostBreakdown {
  variable: {
    [key: string]: VerifiedCost;
  };
  operations: {
    [key: string]: number;
  };
}

/**
 * Available view types for the cost chart
 */
export type CostChartView =
  | 'distribution'
  | 'financial-impact'
  | 'financial-impact-stacked'
  | 'financial-impact-sunburst'
  | 'financial-impact-treemap'
  | 'financial-impact-gauge'
  | 'financial-impact-stepline'
  | 'multi-year-preview';

/**
 * Common props for all chart views
 */
export interface BaseChartProps {
  year: Year;
  costUnit: 'per_ha' | 'per_tonne' | 'total';
  hectares: number; // Used for converting between per hectare and total values
  onUnitChange: (unit: 'per_ha' | 'per_tonne' | 'total') => void;
}

/**
 * Cost distribution view specific props
 */
export interface CostDistributionViewProps extends BaseChartProps {
  costBreakdown: CostBreakdown;
  showVariableCosts: boolean;
  showOperationCosts: boolean;
  onToggleLayer: (layer: 'variable' | 'operations') => void;
}

/**
 * Financial impact view specific props (base for all financial impact views)
 */
export interface FinancialImpactViewProps extends BaseChartProps {
  revenue: number;
  variableCosts: number;
  operationCosts: number;
  yield: number;
  pricePerTonne: number;
  showOperationCosts?: boolean;
}

/**
 * Stacked Bar view specific props
 */
export interface FinancialImpactStackedViewProps extends FinancialImpactViewProps {}

/**
 * Sunburst view specific props
 */
export interface FinancialImpactSunburstViewProps extends FinancialImpactViewProps {}

/**
 * Treemap view specific props
 */
export interface FinancialImpactTreemapViewProps extends FinancialImpactViewProps {}

/**
 * Gauge view specific props
 */
export interface FinancialImpactGaugeViewProps extends FinancialImpactViewProps {
  targets?: {
    revenue?: number;
    margin?: number;
    costEfficiency?: number;
  };
}

/**
 * Step Line view specific props
 */
export interface FinancialImpactStepLineViewProps extends FinancialImpactViewProps {
  benchmarks?: {
    revenue?: number;
    variableCosts?: number;
    operationCosts?: number;
  };
}

/**
 * Main chart container props
 */
export interface ChartContainerProps extends BaseChartProps {
  costBreakdown: CostBreakdown;
  view: CostChartView;
  onViewChange: (view: CostChartView) => void;
  revenue: number;
  yield: number;
  pricePerTonne: number;
  showVariableCosts?: boolean;
  showOperationCosts?: boolean;
  onToggleLayer?: (layer: 'variable' | 'operations') => void;
}