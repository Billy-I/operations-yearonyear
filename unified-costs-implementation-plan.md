# Unified Costs Chart Implementation Plan

## Overview

This plan outlines the implementation steps for the new unified costs chart design based on the proposal. The implementation will focus on creating three distinct views while maintaining code quality and user experience.

## Implementation Phases

### Phase 1: Core Structure

1. **Chart Components**

   - Create new directory structure for chart components
   - Implement base chart container with view switching
   - Extract common chart utilities and types

2. **Data Structure Updates**

   - Define interfaces for benchmark data
   - Update metrics data structure
   - Add market range indicators

3. **Basic View Implementation**
   - Implement Cost Distribution View
   - Convert existing CombinedCostChart to new structure
   - Add view switching logic

### Phase 2: Enhanced Features

1. **Variable Costs Analysis View**

   - Implement combined chart with benchmarks
   - Add market range visualization
   - Create interactive chemical subcategories
   - Add percentage variance calculations

2. **Financial Impact View**

   - Implement waterfall chart
   - Add supporting metrics panel
   - Create gross/net margin calculations

3. **Interactive Elements**
   - Implement detailed tooltips
   - Add drill-down functionality
   - Create view-specific controls

### Phase 3: Refinement

1. **Performance Optimization**

   - Optimize chart rendering
   - Implement data memoization
   - Add loading states

2. **Visual Improvements**

   - Refine chart styling
   - Improve transitions
   - Enhance responsive behavior

3. **Testing and Documentation**
   - Add unit tests
   - Create component documentation
   - Update usage examples

## Component Structure

```
src/components/analytics/charts/
├── ChartContainer.tsx       # Main container with view switching
├── views/
│   ├── CostDistributionView.tsx
│   ├── VariableCostsView.tsx
│   └── FinancialImpactView.tsx
├── common/
│   ├── MarketRangeIndicator.tsx
│   ├── ChartTooltip.tsx
│   └── ViewControls.tsx
└── types/
    └── chart-types.ts
```

## Data Structure

```typescript
interface BenchmarkData {
  min: number;
  max: number;
  average: number;
  current: number;
}

interface VerifiedCost extends BenchmarkData {
  type: "seed" | "fertiliser" | "chemical";
  subCategories?: {
    [key: string]: BenchmarkData;
  };
}

interface CostBreakdown {
  variable: {
    [key: string]: VerifiedCost;
  };
  operations: {
    [key: string]: number;
  };
}
```

## View Features

### 1. Cost Distribution View

- Stacked/grouped bar visualization
- Clear section separation
- Market range indicators for verified costs
- Cost category filtering
- Unit toggling

### 2. Variable Costs Analysis View

- Combined chart with benchmarks
- Market position indicators
- Percentage variance display
- Chemical subcategory breakdown
- Cost per hectare/tonne toggle

### 3. Financial Impact View

- Waterfall chart progression
- Supporting metrics panel
- Margin calculations
- Production data integration
- Interactive tooltips

## Next Steps

1. Create new component structure
2. Update data interfaces
3. Implement base container
4. Begin view-specific implementations

## Migration Strategy

1. Keep existing CombinedCostChart during development
2. Gradually migrate features to new components
3. Test new implementation alongside existing
4. Switch to new implementation when ready
