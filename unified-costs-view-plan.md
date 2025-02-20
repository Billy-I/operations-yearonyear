# Unified Costs View Implementation Plan

## Overview

Transform the current multi-view cost display into a single, comprehensive view that maintains clarity while providing easy access to all cost-related information. The design will follow a progressive disclosure pattern to manage complexity.

## Layout Structure

### 1. Top Section - Key Performance Indicators (No Changes)

Maintain the current KPI cards layout showing:

- Yield
- Cost per hectare
- Number of fields
- Harvested area
- Cost per tonne
- Total cost
- Production
- Gross margin

### 2. Middle Section - Interactive Cost Overview

#### 2.1 Combined Cost Visualization

Replace the current separate views with a unified visualization:

```
[Cost Breakdown Chart]
- Stacked bar chart showing:
  * Variable costs (bottom layer)
  * Operation costs (middle layer)
  * Total costs (line overlay)
- Interactive legend to toggle visibility of each layer
- Year selection maintained at top
```

#### 2.2 Cost Analysis Panel

Collapsible sections showing detailed breakdowns:

```
[Variable Costs]
├── Seed
├── Fertiliser
└── Chemicals
    ├── Herbicide
    ├── Fungicide
    ├── Adjuvant
    └── Trace Element

[Operation Costs]
├── Cultivations
├── Drilling
├── Applications
└── Harvesting

[Financial Summary]
├── Gross Margin
└── Net Margin
```

### 3. Bottom Section - Detailed Analysis

#### 3.1 Performance Table

Enhanced version of current performance table:

```
[Performance By: Variety/Field/Region]
- Sortable columns
- Expandable rows showing:
  * Variable cost breakdown
  * Operation cost breakdown
  * Margin analysis
```

#### 3.2 Cost Categories

Improved category visualization:

```
[Cost Categories]
- Combined view of all cost categories
- Visual indicators for:
  * Market range
  * Your performance
  * Year-on-year change
```

## Interactive Features

### 1. Progressive Disclosure

- Start with high-level overview
- Allow drilling down into details through:
  - Expandable panels
  - Tooltips for additional context
  - "Show more" buttons for detailed breakdowns

### 2. Data Filtering

- Time period selection
- Cost category filtering
- Performance metric selection

### 3. Visualization Options

- Toggle between different chart types:
  - Stacked bar (default)
  - Line chart
  - Grouped bar
- Ability to focus on specific cost categories

## Implementation Benefits

1. **Unified View**

   - All cost information available in one place
   - No need to switch between different views
   - Clear relationship between different cost types

2. **Better Context**

   - See how variable and operation costs contribute to total
   - Understand relationships between different cost categories
   - Easy comparison of performance metrics

3. **Improved UX**
   - Progressive disclosure prevents information overload
   - Interactive elements provide flexibility
   - Consistent layout maintains familiarity

## Technical Considerations

1. **Data Management**

   - Utilize existing MetricsData interface
   - No changes needed to data structure
   - Leverage existing ViewType enum for filtering

2. **Component Structure**

   - Create new combined visualization component
   - Refactor existing components for reuse
   - Implement new interactive features

3. **Performance**
   - Lazy load detailed data
   - Optimize chart rendering
   - Cache expanded state

## Next Steps

1. Create new components:

   - CombinedCostChart
   - ExpandableCostPanel
   - DetailedPerformanceTable

2. Modify existing components:

   - Update KPI cards for unified view
   - Enhance data tables with expansion capability
   - Add interactive controls

3. Implement progressive disclosure:

   - Add expansion/collapse functionality
   - Create detailed view components
   - Add transition animations

4. Add new interactive features:
   - Layer toggling
   - Advanced filtering
   - Custom view options

Would you like me to proceed with switching to Code mode to implement this plan?
