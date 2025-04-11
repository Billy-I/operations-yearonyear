import { useState, useEffect } from 'react'; // Added useEffect
import { useParams, useLocation } from 'react-router-dom'; // Import useLocation
import { HelpCircle, ArrowLeft, Info, Package, Tractor, TableProperties, ChevronDown, ChevronUp } from 'lucide-react'; // Added Info, Package, Tractor, TableProperties, Chevrons
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, ReferenceLine } from 'recharts'; // Added PieChart, Pie, Cell, ReferenceLine
import Modal from '../components/Modal'; // Import Modal component

// Hardcoded data for UI implementation
const CROP_AREA_HA = 641.16;
const NUM_FIELDS = 36; // Hardcoded from image
// Placeholder data for Sales & Profitability (replace with dynamic fetching later)
const ACHIEVED_PRICE_PER_T = 219.17; // Example non-zero price for Wheat (Winter)
const PERCENT_SOLD = 45; // Example percentage for Wheat (Winter)
const MIN_PRICE_SOLD = 200.00; // Example
const MAX_PRICE_SOLD = 250.00; // Example

const budgetedInputCosts = {
  seed: 120.00,
  fertiliser: 250.00,
  chemical: 350.00,
};

const actualInputCosts = {
  seed: 102.32,       // From original image
  fertiliser: 284.89, // From original image
  chemical: 382.22,   // From original image
};

const budgetedOperationsCosts = {
  cultivation: 50.00,
  drilling: 30.00,
  application: 80.00,
  harvesting: 70.00,
  other: 10.00,
};

const actualOperationsCosts = {
  cultivation: 55.00, // Example data
  drilling: 32.00,    // Example data
  application: 85.00, // Example data
  harvesting: 75.00,  // Example data
  other: 12.00,     // Example data
};

// Placeholder 3-Year Average Data
const avg3YrInputCosts = {
  seed: 110.00,
  fertiliser: 260.00,
  chemical: 360.00,
};

const avg3YrOperationsCosts = {
  cultivation: 52.00,
  drilling: 31.00,
  application: 82.00,
  harvesting: 72.00,
  other: 11.00,
};

// --- Calculation Logic ---
const calculateVariance = (budget: number, actual: number) => {
  const variance = actual - budget;
  const variancePercent = budget === 0 ? 0 : (variance / budget) * 100;
  return { variance, variancePercent };
};

// Calculate variance against 3-year average
const calculateVariance3YrAvg = (avg3yr: number, actual: number) => {
  const variance = actual - avg3yr;
  const variancePercent = avg3yr === 0 ? 0 : (variance / avg3yr) * 100;
  return { variance3YrAvg: variance, variance3YrAvgPercent: variancePercent };
};

// Calculate Input Cost Details (including totals)
const inputCostDetails = Object.keys(budgetedInputCosts).map((key) => {
  const budgetHa = budgetedInputCosts[key as keyof typeof budgetedInputCosts];
  const actualHa = actualInputCosts[key as keyof typeof actualInputCosts];
  const { variance: varianceHa, variancePercent } = calculateVariance(budgetHa, actualHa); // Variance vs Budget
  const avg3YrHa = avg3YrInputCosts[key as keyof typeof avg3YrInputCosts];
  const { variance3YrAvg, variance3YrAvgPercent } = calculateVariance3YrAvg(avg3YrHa, actualHa); // Variance vs 3yr Avg
  const budgetTotal = budgetHa * CROP_AREA_HA;
  const actualTotal = actualHa * CROP_AREA_HA;
  const varianceTotal = actualTotal - budgetTotal;
  const avg3YrTotal = avg3YrHa * CROP_AREA_HA;
  const variance3YrAvgTotal = actualTotal - avg3YrTotal;
  return {
    category: key.charAt(0).toUpperCase() + key.slice(1),
    budgetHa, actualHa, varianceHa, variancePercent, // Budget related
    avg3YrHa, variance3YrAvg, variance3YrAvgPercent, // 3yr Avg related
    budgetTotal, actualTotal, varianceTotal, // Budget totals
    avg3YrTotal, variance3YrAvgTotal // 3yr Avg totals
  };
});

// Calculate Operations Cost Details (including totals)
const operationsCostDetails = Object.keys(budgetedOperationsCosts).map((key) => {
  const budgetHa = budgetedOperationsCosts[key as keyof typeof budgetedOperationsCosts];
  const actualHa = actualOperationsCosts[key as keyof typeof actualOperationsCosts];
  const { variance: varianceHa, variancePercent } = calculateVariance(budgetHa, actualHa); // Variance vs Budget
  const avg3YrHa = avg3YrOperationsCosts[key as keyof typeof avg3YrOperationsCosts];
  const { variance3YrAvg, variance3YrAvgPercent } = calculateVariance3YrAvg(avg3YrHa, actualHa); // Variance vs 3yr Avg
  const budgetTotal = budgetHa * CROP_AREA_HA;
  const actualTotal = actualHa * CROP_AREA_HA;
  const varianceTotal = actualTotal - budgetTotal;
  const avg3YrTotal = avg3YrHa * CROP_AREA_HA;
  const variance3YrAvgTotal = actualTotal - avg3YrTotal;
  return {
    category: key.charAt(0).toUpperCase() + key.slice(1),
    budgetHa, actualHa, varianceHa, variancePercent, // Budget related
    avg3YrHa, variance3YrAvg, variance3YrAvgPercent, // 3yr Avg related
    budgetTotal, actualTotal, varianceTotal, // Budget totals
    avg3YrTotal, variance3YrAvgTotal // 3yr Avg totals
  };
});

// Input Totals (Per Hectare)
const totalBudgetInputCostHa = inputCostDetails.reduce((sum, item) => sum + item.budgetHa, 0);
const totalActualInputCostHa = inputCostDetails.reduce((sum, item) => sum + item.actualHa, 0);
const totalVarianceInputCostHa = totalActualInputCostHa - totalBudgetInputCostHa;
const totalVarianceInputPercent = totalBudgetInputCostHa === 0 ? 0 : (totalVarianceInputCostHa / totalBudgetInputCostHa) * 100; // Vs Budget
const totalAvg3YrInputCostHa = inputCostDetails.reduce((sum, item) => sum + item.avg3YrHa, 0);
const totalVariance3YrAvgInputHa = totalActualInputCostHa - totalAvg3YrInputCostHa;
const totalVariance3YrAvgInputPercent = totalAvg3YrInputCostHa === 0 ? 0 : (totalVariance3YrAvgInputHa / totalAvg3YrInputCostHa) * 100; // Vs 3yr Avg

// Input Totals (Total Cost)
const totalBudgetInputCost = inputCostDetails.reduce((sum, item) => sum + item.budgetTotal, 0);
const totalActualInputCost = inputCostDetails.reduce((sum, item) => sum + item.actualTotal, 0);
const totalVarianceInputCost = totalActualInputCost - totalBudgetInputCost; // Vs Budget
const totalAvg3YrInputCost = inputCostDetails.reduce((sum, item) => sum + item.avg3YrTotal, 0);
const totalVariance3YrAvgInputCost = totalActualInputCost - totalAvg3YrInputCost; // Vs 3yr Avg

// Operations Totals (Per Hectare)
const totalBudgetOpsCostHa = operationsCostDetails.reduce((sum, item) => sum + item.budgetHa, 0);
const totalActualOpsCostHa = operationsCostDetails.reduce((sum, item) => sum + item.actualHa, 0);
const totalVarianceOpsCostHa = totalActualOpsCostHa - totalBudgetOpsCostHa;
const totalVarianceOpsPercent = totalBudgetOpsCostHa === 0 ? 0 : (totalVarianceOpsCostHa / totalBudgetOpsCostHa) * 100; // Vs Budget
const totalAvg3YrOpsCostHa = operationsCostDetails.reduce((sum, item) => sum + item.avg3YrHa, 0);
const totalVariance3YrAvgOpsHa = totalActualOpsCostHa - totalAvg3YrOpsCostHa;
const totalVariance3YrAvgOpsPercent = totalAvg3YrOpsCostHa === 0 ? 0 : (totalVariance3YrAvgOpsHa / totalAvg3YrOpsCostHa) * 100; // Vs 3yr Avg

// Operations Totals (Total Cost)
const totalBudgetOpsCost = operationsCostDetails.reduce((sum, item) => sum + item.budgetTotal, 0);
const totalActualOpsCost = operationsCostDetails.reduce((sum, item) => sum + item.actualTotal, 0);
const totalVarianceOpsCost = totalActualOpsCost - totalBudgetOpsCost; // Vs Budget
const totalAvg3YrOpsCost = operationsCostDetails.reduce((sum, item) => sum + item.avg3YrTotal, 0);
const totalVariance3YrAvgOpsCost = totalActualOpsCost - totalAvg3YrOpsCost; // Vs 3yr Avg


// Total Budget Costs (Combined)
const totalBudgetCostHa = totalBudgetInputCostHa + totalBudgetOpsCostHa;
const totalBudgetCost = totalBudgetCostHa * CROP_AREA_HA;

// Total Actual Costs (Combined)
const totalActualCostHa = totalActualInputCostHa + totalActualOpsCostHa;
const totalActualCost = totalActualCostHa * CROP_AREA_HA;

// Total Variance (Combined)
const totalVarianceHa = totalActualCostHa - totalBudgetCostHa;
const totalVariancePercent = totalBudgetCostHa === 0 ? 0 : (totalVarianceHa / totalBudgetCostHa) * 100;


const yieldValue = 8.3; // From original image
const productionTotal = CROP_AREA_HA * yieldValue;
// Cost per tonne calculations (handle potential division by zero)
const combinedCostOfProduction = yieldValue > 0 ? totalActualCostHa / yieldValue : 0;
const inputCostPerTonne = yieldValue > 0 ? totalActualInputCostHa / yieldValue : 0;
const opsCostPerTonne = yieldValue > 0 ? totalActualOpsCostHa / yieldValue : 0;


// --- Chart Data ---
// Define monthly accumulation data for each series
const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

const createAccumulation = (totalValue: number, shape: number[]): number[] => {
    const accumulation: number[] = [0];
    const steps = shape.length;
    let currentTotal = 0;
    for (let i = 0; i < steps; i++) {
        currentTotal += (totalValue / steps) * shape[i];
        accumulation.push(Math.min(currentTotal, totalValue));
    }
    accumulation[accumulation.length - 1] = totalValue;
    return accumulation;
};

const inputShape = [0.1, 0.2, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 0.95, 0.98, 1, 1];
const opsShape =   [0.1, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 0.98, 1];
const totalShape = opsShape;

const actualInputsData = createAccumulation(totalActualInputCostHa, inputShape);
const actualOpsData = createAccumulation(totalActualOpsCostHa, opsShape);
const budgetInputsData = createAccumulation(totalBudgetInputCostHa, inputShape);
const budgetOpsData = createAccumulation(totalBudgetOpsCostHa, opsShape);
const actualTotalData = createAccumulation(totalActualCostHa, totalShape);
const budgetTotalData = createAccumulation(totalBudgetCostHa, totalShape);

const benchmarks = [
  { bestInClass2024: 0, bestInClass2023: 0, priorAverage: 0 },
  { bestInClass2024: 10, bestInClass2023: 15, priorAverage: 15 },
  { bestInClass2024: 40, bestInClass2023: 45, priorAverage: 45 },
  { bestInClass2024: 90, bestInClass2023: 80, priorAverage: 160 },
  { bestInClass2024: 95, bestInClass2023: 85, priorAverage: 170 },
  { bestInClass2024: 100, bestInClass2023: 90, priorAverage: 180 },
  { bestInClass2024: 105, bestInClass2023: 95, priorAverage: 190 },
  { bestInClass2024: 110, bestInClass2023: 100, priorAverage: 280 },
  { bestInClass2024: 150, bestInClass2023: 140, priorAverage: 420 },
  { bestInClass2024: 250, bestInClass2023: 200, priorAverage: 580 },
  { bestInClass2024: 350, bestInClass2023: 280, priorAverage: 680 },
  { bestInClass2024: 380, bestInClass2023: 300, priorAverage: 730 },
  { bestInClass2024: 390, bestInClass2023: 310, priorAverage: 740 }
];

// Combine all chart data
const combinedChartData = months.map((month, index) => ({
    month,
    actualInputs: actualInputsData[index],
    actualOps: actualOpsData[index],
    budgetInputs: budgetInputsData[index],
    budgetOps: budgetOpsData[index],
    actualTotal: actualTotalData[index],
    budgetTotal: budgetTotalData[index],
    bestInClass2024: benchmarks[index].bestInClass2024,
    bestInClass2023: benchmarks[index].bestInClass2023,
    priorAverage: benchmarks[index].priorAverage,
}));

// Data for Pie Charts
const compositionPieData = [
  { name: 'Input Costs', value: totalActualInputCost },
  { name: 'Operations Costs', value: totalActualOpsCost }
].filter(item => item.value > 0);

const inputBreakdownPieData = Object.entries(actualInputCosts).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value * CROP_AREA_HA
})).filter(item => item.value > 0);

const operationsBreakdownPieData = Object.entries(actualOperationsCosts).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value * CROP_AREA_HA
})).filter(item => item.value > 0);


const PIE_COLORS = ['#3b82f6', '#10b981']; // Blue for Input, Green for Ops
const INPUT_PIE_COLORS = ['#60a5fa', '#3b82f6', '#1d4ed8']; // Shades of blue
const OPS_PIE_COLORS = ['#34d399', '#10b981', '#059669', '#047857', '#065f46']; // Shades of green

// Placeholder data for the Variable Costs Per Variety Modal
const variableCostsPerVarietyData = [
  { category: 'Seed', kwsExtaseTotal: 35030.97, kwsExtaseHa: 94.99, crusoeTotal: 13703.42, crusoeHa: 102.10, mayflowerTotal: 10986.54, mayflowerHa: 100.22 },
  { category: 'Fertiliser', kwsExtaseTotal: 190374.27, kwsExtaseHa: 516.24, crusoeTotal: 68453.34, crusoeHa: 510.05, mayflowerTotal: 59391.90, mayflowerHa: 541.80 },
  { category: 'Chemical Foliar Fertiliser', kwsExtaseTotal: 768.07, kwsExtaseHa: 2.08, crusoeTotal: 276.83, crusoeHa: 2.06, mayflowerTotal: 250.38, mayflowerHa: 2.28 },
  { category: 'Chemical Herbicide', kwsExtaseTotal: 48442.04, kwsExtaseHa: 131.36, crusoeTotal: 16259.18, crusoeHa: 121.15, mayflowerTotal: 14710.34, mayflowerHa: 134.19 },
  { category: 'Chemical Anti-Foam', kwsExtaseTotal: 648.90, kwsExtaseHa: 1.76, crusoeTotal: 235.64, crusoeHa: 1.76, mayflowerTotal: 192.54, mayflowerHa: 1.76 },
  { category: 'Chemical Adjuvant', kwsExtaseTotal: 7019.82, kwsExtaseHa: 19.04, crusoeTotal: 2303.60, crusoeHa: 17.16, mayflowerTotal: 2042.45, mayflowerHa: 18.63 },
  { category: 'Chemical Fungicide', kwsExtaseTotal: 57836.05, kwsExtaseHa: 156.84, crusoeTotal: 20367.25, crusoeHa: 151.76, mayflowerTotal: 16763.96, mayflowerHa: 152.93 },
  { category: 'Chemical Trace Element', kwsExtaseTotal: 9464.01, kwsExtaseHa: 25.66, crusoeTotal: 3013.39, crusoeHa: 22.45, mayflowerTotal: 2737.06, mayflowerHa: 24.97 },
  { category: 'Chemical Plant Growth Regulator', kwsExtaseTotal: 10433.64, kwsExtaseHa: 28.29, crusoeTotal: 2795.27, crusoeHa: 20.83, mayflowerTotal: 2208.52, mayflowerHa: 20.15 },
];

// --- Data Interfaces ---
interface ContractData {
  variety: string;
  purchaseCompany: string;
  contractNumber: string;
  deliveryDate: string;
  contractQuantity: number;
  budgetDeliveredPrice: number;
  premium: number;
  totalPrice: number;
}

interface SalesData {
  variety: string;
  purchaseCompany: string;
  contractNumber: string;
  quantity: number;
  quality: string;
  soldDate: string;
  deliveredPriceSold: number;
  premium: number;
  penalty: number;
  totalPrice: number;
}

// Placeholder data for Sales & Contracts Modal (2025)
const contractsData2025: ContractData[] = [
  // Add some plausible contract data for 2025 if needed, or leave empty
  { variety: 'KWS Extase', purchaseCompany: 'Frontier Agriculture Ltd', contractNumber: 'PT160367', deliveryDate: '01-01-2025', contractQuantity: 406.00, budgetDeliveredPrice: 205.00, premium: 0.00, totalPrice: 83230.00 },
  // ... more contracts for 2025
];
const salesData2025: SalesData[] = [
  // Likely empty for 2025 initially
];


// Helper to format currency
const formatCurrency = (value: number) => `£${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Helper to format Profit/Loss currency with color
const formatProfitLossCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
        return <span className="text-gray-500">N/A</span>;
    }
    const isProfit = value >= 0;
    const sign = isProfit ? '' : '-';
    const color = isProfit ? 'text-green-600' : 'text-red-600';
    const displayValue = formatCurrency(Math.abs(value));
    // Remove the currency symbol from displayValue before prepending the sign
    return <span className={color}>{sign}{displayValue.replace('£','')}</span>;
};

const formatVariancePercent = (value: number) => {
    const sign = value > 0 ? '+' : '';
    const color = value > 0 ? 'text-red-600' : value < 0 ? 'text-green-600' : 'text-gray-600';
    return <span className={color}>{sign}{value.toFixed(0)}%</span>;
};
// New formatter for 3yr Avg Variance %
const formatVariance3YrAvgPercent = (value: number) => {
    const sign = value > 0 ? '+' : '';
    const color = value > 0 ? 'text-red-600' : value < 0 ? 'text-green-600' : 'text-gray-600';
    // Using slightly different styling or keeping it same as budget variance for now
    return <span className={color}>{sign}{value.toFixed(0)}%</span>;
};
const formatVarianceValue = (value: number) => {
    const sign = value > 0 ? '+' : value < 0 ? '-' : '';
    return `${sign}£${Math.abs(value).toFixed(2)}`;
};

type CostTableViewUnit = 'perHa' | 'total';

// Define keys for chart lines and groups
type LineKey = 'actualInputs' | 'actualOps' | 'budgetInputs' | 'budgetOps' | 'actualTotal' | 'budgetTotal' | 'bestInClass2024' | 'bestInClass2023' | 'priorAverage';
type GroupKey = 'inputs' | 'ops' | 'totals' | 'benchmarks';

// Map lines to groups
const lineGroupMap: Record<LineKey, GroupKey> = {
    actualInputs: 'inputs',
    budgetInputs: 'inputs',
    actualOps: 'ops',
    budgetOps: 'ops',
    actualTotal: 'totals',
    budgetTotal: 'totals',
    bestInClass2024: 'benchmarks',
    bestInClass2023: 'benchmarks',
    priorAverage: 'benchmarks',
};

// Helper for Pie Chart Label Rendering
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't render label if slice is too small

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export default function CropDetails() {
  const { crop } = useParams();
  const location = useLocation(); // Get location object
  const searchParams = new URLSearchParams(location.search); // Parse query params
  const yearFromUrl = searchParams.get('year') || '2025'; // Get year, default to 2025
  const [selectedYear, setSelectedYear] = useState(yearFromUrl); // Initialize state with URL year
  const [inputCostViewUnit, setInputCostViewUnit] = useState<CostTableViewUnit>('perHa');
  const [operationsCostViewUnit, setOperationsCostViewUnit] = useState<CostTableViewUnit>('perHa');
  const [includeOperationsCosts, setIncludeOperationsCosts] = useState(true); // State for Cost Categories toggle
  const [isVarietyCostModalOpen, setIsVarietyCostModalOpen] = useState(false); // State for the variety cost modal
  const [isSalesContractsModalOpen, setIsSalesContractsModalOpen] = useState(false); // State for the sales/contracts modal
  const [salesContractsModalTab, setSalesContractsModalTab] = useState<'Contracts' | 'Sales'>('Contracts'); // State for modal tab

  // State for group visibility - Benchmarks default off
  const [visibleGroups, setVisibleGroups] = useState<Record<GroupKey, boolean>>({
    inputs: true,
    ops: true,
    totals: true,
    benchmarks: false, // Default benchmarks off
  });

  // State for individual line visibility (controlled by legend clicks)
  const [visibleLines, setVisibleLines] = useState<Record<LineKey, boolean>>({
    actualInputs: true,
    actualOps: true,
    budgetInputs: true,
    budgetOps: true,
    actualTotal: true,
    budgetTotal: true,
    bestInClass2024: true,
    bestInClass2023: true,
    priorAverage: true,
  });

  // Handler for group checkbox changes
  const handleGroupToggle = (group: GroupKey) => {
    setVisibleGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  // Legend click handler (toggles individual lines)
  const handleLegendClick = (data: any) => {
    const key = data.dataKey as LineKey;
    if (key) {
      setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  // Custom legend formatter (greys out if individual line is toggled off)
  const formatLegendValue = (value: string, entry: any) => {
    const key = entry.dataKey as LineKey;
    const groupKey = lineGroupMap[key];
    // Grey out if group is hidden OR individual line is hidden OR (Ops/Totals group and includeOperationsCosts is false)
    const isGroupVisible = visibleGroups[groupKey];
    const isLineVisible = visibleLines[key];
    const isOpsRelatedHidden = !includeOperationsCosts && (groupKey === 'ops' || groupKey === 'totals');
    const color = isGroupVisible && isLineVisible && !isOpsRelatedHidden ? entry.color : '#ccc';
    return <span style={{ color }}>{value}</span>;
  };

  // Calculate display values based on toggle
  const displayActualTotalCostHa = includeOperationsCosts ? totalActualCostHa : totalActualInputCostHa;
  const displayActualTotalCost = includeOperationsCosts ? totalActualCost : totalActualInputCost;
  // Recalculate break-even based on toggle
  const displayBreakEvenCost = includeOperationsCosts
      ? (yieldValue > 0 ? totalActualCostHa / yieldValue : 0)
      : (yieldValue > 0 ? totalActualInputCostHa / yieldValue : 0);

  // Sales & Profitability Calculations (using placeholders)
  const quantitySoldT = (productionTotal * PERCENT_SOLD) / 100;
  const remainingQtyT = productionTotal - quantitySoldT;
  const totalRevenue = ACHIEVED_PRICE_PER_T * quantitySoldT; // Based on avg price achieved
  const potentialValueLeft = remainingQtyT * ACHIEVED_PRICE_PER_T; // Example: using current avg price
  const totalPotentialValue = totalRevenue + potentialValueLeft;

  // Margin and Profit/Loss based on the *sold* portion and *average* achieved price
  const grossMarginPerTonne = ACHIEVED_PRICE_PER_T - inputCostPerTonne; // Always based on input cost
  const netMarginPerTonne = ACHIEVED_PRICE_PER_T - displayBreakEvenCost; // Based on toggle state via displayBreakEvenCost
  // Calculate cost attributable to the sold portion
  const costOfSoldPortion = displayActualTotalCost * (PERCENT_SOLD / 100);
  const displayTotalProfitLoss = totalRevenue - costOfSoldPortion;


  // Helper component for the toggle buttons
  const UnitToggleButton = ({ label, value, currentUnit, setUnit }: {
    label: string;
    value: CostTableViewUnit;
    currentUnit: CostTableViewUnit;
    setUnit: (unit: CostTableViewUnit) => void;
  }) => (
    <button
      onClick={() => setUnit(value)}
      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
        currentUnit === value
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/tracker/crop-progress" className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-sm text-gray-600">Tracker / Crop Progress / {crop}</div>
            <h1 className="text-2xl font-bold text-gray-900">{crop}</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Changed button to Link and added query params */}
          <Link
            to={`/tracker/budgets?year=${selectedYear}&crop=${encodeURIComponent(crop || '')}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center text-sm"
          >
            Add budgets
            <span className="ml-1">→</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-white border border-gray-300 px-3 py-2 rounded-md text-sm">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent border-none focus:ring-0 p-0 text-gray-700"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option> {/* Add 2025 option */}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start text-sm text-blue-800">
        <Info size={18} className="mr-3 mt-0.5 flex-shrink-0 text-blue-600" />
        <div>
          <span className="font-medium">Using Baseline Operations Data:</span> If you haven't updated your Operations data the current Operations Cost to date column uses the Yagro's baseline of the previous year. You can Visit the <Link to={`/data/operations?year=${selectedYear}&crop=${encodeURIComponent(crop || '')}`} className="font-medium underline hover:text-blue-700">Operations page</Link> to edit the Operations data for this current year.
          <a href="#" className="ml-2 font-medium underline hover:text-blue-700 block mt-1">Learn more</a>
        </div>
      </div>

      {/* Cost Categories Toggle */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center text-sm">
        <span className="font-medium text-gray-700 mr-4">Cost Categories:</span>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeOperationsCosts}
            onChange={(e) => setIncludeOperationsCosts(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600 rounded"
          />
          <span className="text-gray-700">Include Operations Costs in Totals</span>
        </label>
        <span title="How do these affect my values?" className="ml-2 cursor-help">
          <HelpCircle size={16} className="text-gray-400" />
        </span>
      </div>


      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow p-6">

        {/* Crop Production Section - Updated */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Area Information */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <h3 className="text-sm font-medium text-gray-600">Area Information</h3>
              <div>
                <div className="text-xs text-gray-500"># Fields</div>
                <div className="text-lg font-semibold text-gray-900">{NUM_FIELDS}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Field area</div>
                <div className="text-lg font-semibold text-gray-900">{CROP_AREA_HA.toFixed(2)} ha</div>
              </div>
            </div>

            {/* Card 2: Costs - Updated for Toggle */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
               {/* ... (content mostly unchanged, ensure displayActualTotalCost etc. are used if not already) ... */}
               <h3 className="text-sm font-medium text-gray-600 mb-3">Costs</h3>
               <div className={`grid ${includeOperationsCosts ? 'grid-cols-2' : 'grid-cols-1'} gap-x-4 gap-y-2 text-left`}>
                 {/* Headers */}
                 <div className="text-xs font-medium text-gray-500 flex items-center"><Package size={14} className="mr-1 text-gray-400" />Inputs</div>
                 {includeOperationsCosts && <div className="text-xs font-medium text-gray-500 flex items-center"><Tractor size={14} className="mr-1 text-gray-400" />Operations <span className="ml-1 cursor-help relative tooltip-container"><HelpCircle size={12} className="text-gray-400" /><span className="tooltip-text bg-gray-800 text-white text-xs rounded py-1 px-2 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap opacity-0 transition-opacity duration-300 pointer-events-none">Operations costs may include baseline estimates. Visit Operations Center to update actuals for current season accuracy.</span></span></div>}

                 {/* Total Cost Row - Use display value */}
                 <div className="text-sm font-semibold text-gray-900">{formatCurrency(totalActualInputCost)}</div>
                 {includeOperationsCosts && <div className="text-sm font-semibold text-gray-900">{formatCurrency(totalActualOpsCost)}</div>}

                 {/* Cost per Ha Row - Use display value */}
                 <div className="text-sm font-semibold text-gray-900">{formatCurrency(totalActualInputCostHa)}<span className="text-xs text-gray-500">/ha</span></div>
                 {includeOperationsCosts && <div className="text-sm font-semibold text-gray-900">{formatCurrency(totalActualOpsCostHa)}<span className="text-xs text-gray-500">/ha</span></div>}

                 {/* Cost per Tonne Row - Use display value */}
                 <div className="text-sm font-semibold text-gray-900">{formatCurrency(inputCostPerTonne)}<span className="text-xs text-gray-500">/t</span></div>
                 {includeOperationsCosts && <div className="text-sm font-semibold text-gray-900">{formatCurrency(opsCostPerTonne)}<span className="text-xs text-gray-500">/t</span></div>}
               {/* Display Combined Total Cost */}
               <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">Total Cost ({includeOperationsCosts ? 'Inputs + Operations' : 'Inputs Only'})</div>
                  <div className="text-lg font-semibold text-gray-900">{formatCurrency(displayActualTotalCost)}</div>
                  <div className="text-sm text-gray-600">{formatCurrency(displayActualTotalCostHa)}<span className="text-xs text-gray-500">/ha</span></div>
               </div>
               </div>
               {/* Overall Total Cost - Updated */}
            </div>

            {/* Card 3: Yield and Production */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <h3 className="text-sm font-medium text-gray-600">Yield and Production</h3>
              <div>
                <div className="text-xs text-gray-500">Yield</div>
                <div className="text-lg font-semibold text-gray-900">{yieldValue.toFixed(2)} t/ha</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Production</div>
                <div className="text-lg font-semibold text-gray-900">{productionTotal.toFixed(2)} t</div>
              </div>
              {/* Removed £ Achieved from here, will be in Sales section */}
            </div>

        </div>

        {/* Costs Section */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          {/* Renamed Section Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Cost Performance Over Time</h2>
          <div className="flex items-center text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md mb-6 border border-yellow-200">
            <span className="mr-2">⚠️</span>
            <span>Your most recent Product Application data is from Wed Jul 17 2024.</span>
            <button className="text-blue-600 hover:underline ml-2 font-medium">Upload new data here.</button>
          </div>

          {/* Chart Group Toggles */}
          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
            {(Object.keys(visibleGroups) as GroupKey[]).map((group) => (
              <label key={group} className={`flex items-center space-x-2 text-sm ${(!includeOperationsCosts && (group === 'ops' || group === 'totals')) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={visibleGroups[group]}
                  onChange={() => handleGroupToggle(group)}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  disabled={!includeOperationsCosts && (group === 'ops' || group === 'totals')} // Disable if ops excluded
                />
                <span className="capitalize text-gray-700">{group === 'ops' ? 'Operations' : group}</span>
              </label>
            ))}
          </div>

          {/* Chart Area Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart Container */}
            <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ResponsiveContainer width="100%" height={400}>
                 {/* LineChart with group visibility */}
                <LineChart data={combinedChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" label={{ value: 'Cost £/ha', angle: -90, position: 'insideLeft', style: {fontSize: '12px'} }} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend onClick={handleLegendClick} formatter={formatLegendValue} wrapperStyle={{ fontSize: "12px", paddingTop: '10px' }} />
                  {/* Inputs */}
                  <Line yAxisId="left" type="monotone" dataKey="actualInputs" name="Inputs - Actual" stroke="#3b82f6" strokeWidth={2} dot={false} hide={!visibleGroups.inputs || !visibleLines.actualInputs} /> {/* Blue */}
                  <Line yAxisId="left" type="monotone" dataKey="budgetInputs" name="Inputs - Budget" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} hide={!visibleGroups.inputs || !visibleLines.budgetInputs} /> {/* Blue Dashed */}
                  {/* Operations */}
                  <Line yAxisId="left" type="monotone" dataKey="actualOps" name="Operations - Actual" stroke="#10b981" strokeWidth={2} dot={false} hide={!includeOperationsCosts || !visibleGroups.ops || !visibleLines.actualOps} /> {/* Green */}
                  <Line yAxisId="left" type="monotone" dataKey="budgetOps" name="Operations - Budget" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} hide={!includeOperationsCosts || !visibleGroups.ops || !visibleLines.budgetOps} /> {/* Green Dashed */}
                  {/* Benchmarks */}
                  <Line yAxisId="left" type="monotone" dataKey="bestInClass2024" name="Best in Class 2024" stroke="#a855f7" strokeWidth={1} dot={false} hide={!visibleGroups.benchmarks || !visibleLines.bestInClass2024} /> {/* Purple */}
                  <Line yAxisId="left" type="monotone" dataKey="bestInClass2023" name="Best in Class 2023" stroke="#ec4899" strokeWidth={1} dot={false} hide={!visibleGroups.benchmarks || !visibleLines.bestInClass2023} /> {/* Pink */}
                  <Line yAxisId="left" type="monotone" dataKey="priorAverage" name="Prior Average" stroke="#f97316" strokeWidth={1} dot={false} hide={!visibleGroups.benchmarks || !visibleLines.priorAverage} /> {/* Orange */}
                  {/* Total (Hidden by default via group toggle) */}
                  <Line yAxisId="left" type="monotone" dataKey="actualTotal" name="Total - Actual" stroke="#1f2937" strokeWidth={2} dot={false} hide={!includeOperationsCosts || !visibleGroups.totals || !visibleLines.actualTotal} /> {/* Dark Gray */}
                  <Line yAxisId="left" type="monotone" dataKey="budgetTotal" name="Total - Budget" stroke="#1f2937" strokeWidth={2} strokeDasharray="5 5" dot={false} hide={!includeOperationsCosts || !visibleGroups.totals || !visibleLines.budgetTotal} /> {/* Dark Gray Dashed */}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Charts Container */}
            <div className="space-y-6">
                 {/* Removed duplicated combined pie chart */}
                <div className="w-full"> {/* Wrapper div for multiple charts */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Inputs Breakdown</h3>
                   {/* Increased height and outerRadius */}
                   <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={inputBreakdownPieData} cx="50%" cy="50%" labelLine={false} outerRadius={70} fill="#8884d8" dataKey="value" label={renderCustomizedLabel} >
                        {inputBreakdownPieData.map((entry, index) => ( <Cell key={`cell-input-${index}`} fill={INPUT_PIE_COLORS[index % INPUT_PIE_COLORS.length]} /> ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{fontSize: "12px"}}/>
                    </PieChart>
                  </ResponsiveContainer>

                  {totalActualOpsCost > 0 ? (
                    <div className="mt-4 w-full"> {/* Added mt-4 and w-full */}
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Operations Breakdown</h3>
                      {/* Increased height and outerRadius */}
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                           <Pie data={operationsBreakdownPieData} cx="50%" cy="50%" labelLine={false} outerRadius={70} fill="#8884d8" dataKey="value" label={renderCustomizedLabel} >
                             {operationsBreakdownPieData.map((entry, index) => ( <Cell key={`cell-ops-${index}`} fill={OPS_PIE_COLORS[index % OPS_PIE_COLORS.length]} /> ))}
                           </Pie>
                           <Tooltip formatter={(value: number) => formatCurrency(value)} />
                           <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{fontSize: "12px"}}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="mt-4 text-center text-gray-500 text-sm">No Operations cost data available.</div>
                  )}
                </div>
            </div>
          </div>
        </div>

          {/* Input Costs Table */}
           <div className="mt-8"> {/* Adjusted margin if needed */}
             <div className="flex justify-between items-center mb-3">
               <div className="flex items-center"> {/* Wrap title and icon */}
                 <h3 className="text-lg font-semibold text-gray-800 mr-2">Inputs</h3>
                 <button
                   onClick={() => setIsVarietyCostModalOpen(true)}
                   className="text-gray-600 bg-gray-100 border border-gray-300 hover:bg-gray-200 p-1 rounded shadow-sm"
                   title="View Variable Costs Per Variety"
                 >
                   <TableProperties size={18} />
                 </button>
               </div>
               {/* Unit Toggle */}
               <div className="flex space-x-1 bg-gray-200 p-1 rounded-md">
                 <UnitToggleButton label="£/ha" value="perHa" currentUnit={inputCostViewUnit} setUnit={setInputCostViewUnit} />
                 <UnitToggleButton label="£ Total" value="total" currentUnit={inputCostViewUnit} setUnit={setInputCostViewUnit} />
               </div>
             </div>
             <div className="overflow-x-auto border border-gray-200 rounded-lg">
               <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {inputCostViewUnit === 'perHa' ? 'Actual £/ha' : 'Actual £ Total'}
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Budget <Info size={12} className="inline ml-1 text-gray-400" />
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % 3yr Avg Variance <Info size={12} className="inline ml-1 text-gray-400" />
                      </th>
                    </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {inputCostDetails.map((item) => (
                      <tr key={item.category}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(inputCostViewUnit === 'perHa' ? item.actualHa : item.actualTotal)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">{formatVariancePercent(item.variancePercent)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">{formatVariance3YrAvgPercent(item.variance3YrAvgPercent)}</td>
                      </tr>
                   ))}
                 </tbody>
                 <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Totals</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">{formatCurrency(inputCostViewUnit === 'perHa' ? totalActualInputCostHa : totalActualInputCost)}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold">{formatVariancePercent(totalVarianceInputPercent)}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold">{formatVariance3YrAvgPercent(totalVariance3YrAvgInputPercent)}</td>
                    </tr>
                 </tfoot>
               </table>
             </div>
          </div>

          {/* Operations Costs Table - Conditional */}
          {includeOperationsCosts && (
            <div className="mt-8">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="text-lg font-semibold text-gray-800 flex items-center">Operations <span className="ml-2 cursor-help relative tooltip-container"><HelpCircle size={14} className="text-gray-400" /><span className="tooltip-text bg-gray-800 text-white text-xs rounded py-1 px-2 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap opacity-0 transition-opacity duration-300 pointer-events-none">Operations costs may include baseline estimates. Visit Operations Center to update actuals for current season accuracy.</span></span></h3>
                 {/* Unit Toggle */}
                 <div className="flex space-x-1 bg-gray-200 p-1 rounded-md">
                   <UnitToggleButton label="£/ha" value="perHa" currentUnit={operationsCostViewUnit} setUnit={setOperationsCostViewUnit} />
                   <UnitToggleButton label="£ Total" value="total" currentUnit={operationsCostViewUnit} setUnit={setOperationsCostViewUnit} />
                 </div>
               </div>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {operationsCostViewUnit === 'perHa' ? 'Actual £/ha' : 'Actual £ Total'}
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Budget <Info size={12} className="inline ml-1 text-gray-400" />
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % 3yr Avg Variance <Info size={12} className="inline ml-1 text-gray-400" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {operationsCostDetails.map((item) => (
                      <tr key={item.category}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(operationsCostViewUnit === 'perHa' ? item.actualHa : item.actualTotal)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">{formatVariancePercent(item.variancePercent)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">{formatVariance3YrAvgPercent(item.variance3YrAvgPercent)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Totals</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">{formatCurrency(operationsCostViewUnit === 'perHa' ? totalActualOpsCostHa : totalActualOpsCost)}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold">{formatVariancePercent(totalVarianceOpsPercent)}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold">{formatVariance3YrAvgPercent(totalVariance3YrAvgOpsPercent)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sales Section (Keep original structure) */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales</h2>
          <div className="flex items-center text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md mb-6 border border-yellow-200">
            <span className="mr-2">⚠️</span>
            <span>Your most recent contracts data is from Mon Feb 05 2024.</span>
            <button className="text-blue-600 hover:underline ml-2 font-medium">Upload new data here.</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Graph */}
            <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ResponsiveContainer width="100%" height={400}>
                 <BarChart data={[
                   { month: 'November 2024', quantity: 120, quantityContract: 60, price: 220, priceContract: 215 },
                   { month: 'December', quantity: 90, quantityContract: 0, price: 225, priceContract: 220 },
                   { month: 'January 2025', quantity: 210, quantityContract: 35, price: 215, priceContract: 210 }
                 ]} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                   <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                   <YAxis yAxisId="left" orientation="left" label={{ value: 'Price £/t', angle: -90, position: 'insideLeft', style: {fontSize: '12px'} }} tick={{ fontSize: 12 }} />
                   <YAxis yAxisId="right" orientation="right" label={{ value: 'Quantity t', angle: 90, position: 'insideRight', style: {fontSize: '12px'} }} tick={{ fontSize: 12 }} />
                   <Tooltip />
                   <Legend wrapperStyle={{ fontSize: "12px" }} />
                   <Bar yAxisId="right" dataKey="quantity" name="Quantity" fill="#1f2937" />
                   <Bar yAxisId="right" dataKey="quantityContract" name="Quantity (contract)" fill="#6b7280" />
                   <Bar yAxisId="left" dataKey="price" name="Price" fill="#9ca3af" />
                   <Bar yAxisId="left" dataKey="priceContract" name="Price (contract)" fill="#d1d5db" />
                   {/* Add Break-Even Line */}
                   <ReferenceLine
                     y={displayBreakEvenCost}
                     yAxisId="left"
                     stroke="red"
                     strokeDasharray="3 3"
                     strokeWidth={2}
                     label={{ value: `Break-Even (${formatCurrency(displayBreakEvenCost)}/t)`, position: 'insideTopRight', fill: 'red', fontSize: 10 }}
                   />
                 </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Sales Summary Cards */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-sm text-gray-600">Sold</div>
                    <div className="font-semibold text-gray-900">2436.00 t</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Remaining</div>
                    <div className="font-semibold text-gray-900">2643.79 t</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600 h-2 rounded-full" style={{ width: '48%' }} />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Min price', value: formatCurrency(MIN_PRICE_SOLD), unit: '/t' },
                  { label: 'Avg. price', value: formatCurrency(ACHIEVED_PRICE_PER_T), unit: '/t' },
                  { label: 'Max price', value: formatCurrency(MAX_PRICE_SOLD), unit: '/t' },
                  { label: 'Total Revenue (Sold)', value: formatCurrency(totalRevenue) },
                  { type: 'divider' }, // Visual separator
                  { label: `Break-Even Cost (${includeOperationsCosts ? 'Inputs+Operations' : 'Inputs Only'})`, value: formatCurrency(displayBreakEvenCost), unit: '/t' },
                  // Always show Gross Margin
                  { label: `Margin (Gross)`, value: formatProfitLossCurrency(grossMarginPerTonne), unit: '/t' },
                  // Conditionally show Net Margin
                  ...(includeOperationsCosts ? [{ label: `Margin (Net)`, value: formatProfitLossCurrency(netMarginPerTonne), unit: '/t' }] : []),
                  { label: 'Total Profit/Loss (Sold)', value: formatProfitLossCurrency(displayTotalProfitLoss) },
                  { type: 'divider' }, // Visual separator
                  { label: 'Potential value left to sell', value: formatCurrency(potentialValueLeft) },
                  { label: 'Total potential value', value: formatCurrency(totalPotentialValue) },
                ].map(item => (
                  item.type === 'divider' ?
                  <div key={Math.random()} className="my-2 border-t border-gray-200"></div> :
                  <div key={item.label} className="flex justify-between items-center py-1">
                    <span className="text-xs text-gray-500 flex items-center">
                      {item.label}
                      <Info size={12} className="ml-1 text-gray-400 cursor-help" />
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {/* Check if value is a JSX element (from formatProfitLossCurrency) */}
                      {typeof item.value === 'string' || typeof item.value === 'number' ? item.value : item.value}
                      {item.unit && <span className="text-xs text-gray-500 ml-1">{item.unit}</span>}
                    </span>
                  </div>
                ))}
              </div>
              <button onClick={() => setIsSalesContractsModalOpen(true)} className="w-full mt-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm font-medium">
                View sales / contracts →
              </button>
            </div>
          </div>
        </div>

      </div> {/* End Main Content Area */}

       {/* Variable Costs Per Variety Modal */}
       <Modal isOpen={isVarietyCostModalOpen} onClose={() => setIsVarietyCostModalOpen(false)} onConfirm={() => {}} title="Variable Costs To Date, Per Variety">
         <div className="overflow-x-auto">
           <table className="min-w-full divide-y divide-gray-200 text-sm">
             <thead className="bg-gray-50">
               <tr>
                 <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Category</th>
                 <th scope="col" colSpan={2} className="px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider border-l border-r">KWS Extase</th>
                 <th scope="col" colSpan={2} className="px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider border-r">Crusoe</th>
                 <th scope="col" colSpan={2} className="px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Mayflower</th>
               </tr>
               <tr>
                 <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider"></th>
                 <th scope="col" className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider border-l">£ Total</th>
                 <th scope="col" className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider border-r">£/ha</th>
                 <th scope="col" className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">£ Total</th>
                 <th scope="col" className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider border-r">£/ha</th>
                 <th scope="col" className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">£ Total</th>
                 <th scope="col" className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">£/ha</th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {variableCostsPerVarietyData.map((item) => (
                 <tr key={item.category}>
                   <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{item.category}</td>
                   <td className="px-4 py-2 whitespace-nowrap text-right text-gray-500 border-l">{formatCurrency(item.kwsExtaseTotal)}</td>
                   <td className="px-4 py-2 whitespace-nowrap text-right text-gray-500 border-r">{formatCurrency(item.kwsExtaseHa)}</td>
                   <td className="px-4 py-2 whitespace-nowrap text-right text-gray-500">{formatCurrency(item.crusoeTotal)}</td>
                   <td className="px-4 py-2 whitespace-nowrap text-right text-gray-500 border-r">{formatCurrency(item.crusoeHa)}</td>
                   <td className="px-4 py-2 whitespace-nowrap text-right text-gray-500">{formatCurrency(item.mayflowerTotal)}</td>
                   <td className="px-4 py-2 whitespace-nowrap text-right text-gray-500">{formatCurrency(item.mayflowerHa)}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </Modal>

       {/* Sales & Contracts Modal */}
       <Modal
         isOpen={isSalesContractsModalOpen}
         onClose={() => setIsSalesContractsModalOpen(false)}
         onConfirm={() => {}} // Add dummy confirm handler as it's required by ModalProps
         title={`${crop} Contracts & Sales In ${selectedYear}`}
         // Size is controlled by max-w- class in Modal.tsx component
       >
         <div className="p-1"> {/* Add padding around the modal content */}
           {/* Tabs */}
           <div className="mb-4 border-b border-gray-200">
             <nav className="-mb-px flex space-x-6" aria-label="Tabs">
               <button
                 onClick={() => setSalesContractsModalTab('Contracts')}
                 className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                   salesContractsModalTab === 'Contracts'
                     ? 'border-blue-500 text-blue-600'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 Contracts
               </button>
               <button
                 onClick={() => setSalesContractsModalTab('Sales')}
                 className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                   salesContractsModalTab === 'Sales'
                     ? 'border-blue-500 text-blue-600'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 Sales
               </button>
             </nav>
           </div>

           {/* Content based on tab */}
           <div className="overflow-x-auto">
             {salesContractsModalTab === 'Contracts' && (
               <table className="min-w-full divide-y divide-gray-200 text-sm">
                 <thead className="bg-gray-50">
                   <tr>
                     {/* Add sort icons if needed later */}
                     <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Variety</th>
                     <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Purchase Company</th>
                     <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Contract Number</th>
                     <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                     <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Contract Quantity</th>
                     <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Budget Delivered Price</th>
                     <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                     <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {contractsData2025.length > 0 ? (
                     contractsData2025.map((contract, index) => (
                       <tr key={index} className="hover:bg-gray-50">
                         <td className="px-3 py-2 whitespace-nowrap">{contract.variety}</td>
                         <td className="px-3 py-2 whitespace-nowrap">{contract.purchaseCompany}</td>
                         <td className="px-3 py-2 whitespace-nowrap">{contract.contractNumber}</td>
                         <td className="px-3 py-2 whitespace-nowrap">{contract.deliveryDate}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-right">{contract.contractQuantity.toFixed(2)} t</td>
                         <td className="px-3 py-2 whitespace-nowrap text-right">{formatCurrency(contract.budgetDeliveredPrice)} /t</td>
                         <td className="px-3 py-2 whitespace-nowrap text-right">{formatCurrency(contract.premium)} /t</td>
                         <td className="px-3 py-2 whitespace-nowrap text-right">{formatCurrency(contract.totalPrice)}</td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan={8} className="text-center py-4 text-gray-500">There are no contracts to show for {selectedYear}.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             )}

             {salesContractsModalTab === 'Sales' && (
               <table className="min-w-full divide-y divide-gray-200 text-sm">
                 <thead className="bg-gray-50">
                   <tr>
                     {/* Add sort icons if needed later */}
                     <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Variety</th>
                     <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Purchase Company</th>
                     <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Contract Number</th>
                     <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                     <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                     <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Sold Date</th>
                     <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Delivered Price Sold</th>
                     <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                     <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Penalty</th>
                     <th scope="col" className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {salesData2025.length > 0 ? (
                     salesData2025.map((sale, index) => (
                       <tr key={index} className="hover:bg-gray-50">
                         {/* Populate with actual sales data fields */}
                         <td className="px-3 py-2 whitespace-nowrap">{/* sale.variety */}</td>
                         <td className="px-3 py-2 whitespace-nowrap">{/* sale.purchaseCompany */}</td>
                         <td className="px-3 py-2 whitespace-nowrap">{/* sale.contractNumber */}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-right">{/* sale.quantity */} t</td>
                         <td className="px-3 py-2 whitespace-nowrap">{/* sale.quality */}</td>
                         <td className="px-3 py-2 whitespace-nowrap">{/* sale.soldDate */}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-right">{/* formatCurrency(sale.deliveredPriceSold) */} /t</td>
                         <td className="px-3 py-2 whitespace-nowrap text-right">{/* formatCurrency(sale.premium) */} /t</td>
                         <td className="px-3 py-2 whitespace-nowrap text-right">{/* formatCurrency(sale.penalty) */} /t</td>
                         <td className="px-3 py-2 whitespace-nowrap text-right">{/* formatCurrency(sale.totalPrice) */}</td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan={10} className="text-center py-4 text-gray-500">There are no sales records to show for {selectedYear}.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             )}
           </div>
         </div>
       </Modal>

    </div> // End Page Container
  );
}
