# Costs and Metrics Improvement Plan

## 1. Combined Margin Card

### Current State

- Gross Margin displayed separately (£567.00/ha in current view)
- Net Margin missing from high-level view
- Users need to look in different places for profitability metrics

### Proposed Changes

- Create a combined "Profitability" card that shows:
  - Gross Margin (£567.00/ha)
  - Net Margin
  - Percentage difference between the two
- Use visual hierarchy to show relationship between metrics
- Consider adding a small trend indicator

## 2. Cost Metrics Standardization

### Current Issues

- Inconsistent cost per tonne (£285.00/t) and per hectare (£2394.00/ha) between views
- Unclear whether high-level metrics should show total or broken down costs

### Standardization Approach

1. High-Level View Metrics:

   - Show only total costs for simplicity and clarity
   - Add tooltips explaining what's included in the total
   - Move detailed breakdowns (Variable/Operations) to expandable sections

2. Detailed View:
   - Maintain current breakdown of costs
   - Ensure calculations are consistent with high-level view
   - Add clear labels indicating what's included in each calculation

## 3. Implementation Priority

1. High Priority:

   - Combine Gross/Net Margin display in top section
   - Standardize high-level cost calculations
   - Add tooltips explaining metrics

2. Medium Priority:

   - Update detailed view calculations
   - Ensure consistency between views
   - Add visual indicators for cost breakdowns

3. Low Priority:
   - Add trend indicators
   - Enhance visual presentation
   - Implement advanced filtering options

## 4. Technical Considerations

### Component Updates

1. ExplorerCropDetails.tsx:

   - Add new combined margin card
   - Update cost calculation logic
   - Ensure consistent metrics across views

2. ExpandableCostPanel.tsx:

   - Update to reflect standardized calculations
   - Add clear labeling for cost breakdowns

3. DetailedPerformanceTable.tsx:
   - Ensure consistency with high-level metrics
   - Add tooltips explaining calculations

### Data Flow

- Maintain single source of truth for calculations
- Implement consistent calculation methods
- Add validation for metric consistency

## 5. UI/UX Improvements

### New Profitability Card Design

```
┌─────────────────────────┐
│     PROFITABILITY      │
├─────────────────────────┤
│ Gross Margin: £567/ha  │
│ Net Margin:   £487/ha  │
│ ────────────────────── │
│ Difference:   -£80/ha  │
└─────────────────────────┘
```

### Enhanced Tooltips

- Add detailed explanations of calculations
- Show breakdown of included costs
- Provide context for metrics

## 6. Next Steps

1. Review and approve design changes
2. Switch to Code mode for implementation
3. Test consistency across all views
4. Gather user feedback
5. Make adjustments based on feedback

Would you like to proceed with these improvements? Once approved, we can switch to Code mode to implement the changes.
