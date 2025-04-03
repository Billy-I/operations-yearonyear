import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import AddBudgetPanel from '../components/AddBudgetPanel';

interface SummaryItem {
  label: string;
  value: string;
  isBold?: boolean; // Optional flag for bold values
}

interface SummaryCardProps {
  title: string;
  items: SummaryItem[];
  info?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, items, info }) => (
    <div className="p-4 border border-gray-200 rounded-lg flex flex-col justify-between h-full"> {/* Added flex, justify-between, h-full */}
      <div> {/* Wrapper for title and info */}
        <div className="flex items-center justify-between gap-1 mb-2"> {/* Added justify-between */}
          <span className="text-sm font-medium text-gray-900">{title}</span> {/* Changed styling */}
          {info && (
            <span className="text-gray-400 hover:text-gray-600 cursor-help" title={info}>
              {/* Using Heroicon question mark circle */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </span>
          )}
        </div>
      </div>
      <div className="space-y-1"> {/* Wrapper for items */}
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-baseline"> {/* Align items */}
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className={`text-sm ${item.isBold ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{item.value}</span> {/* Conditional bold */}
          </div>
        ))}
      </div>
    </div>
);

interface CropRowProps {
  crop: string;
  area: string;
  seed: string;
  fertiliser: string;
  chemical: string;
  yield: string;
  price: string;
  gm: string;
  onEdit: () => void; // Add onEdit prop
}

const CropRow: React.FC<CropRowProps> = ({ crop, area, seed, fertiliser, chemical, yield: yieldValue, price, gm, onEdit }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="py-3 px-4 text-gray-900">{crop}</td>
    <td className="py-3 px-4 text-gray-600">{area}</td>
    <td className="py-3 px-4 text-gray-600">{seed}</td>
    <td className="py-3 px-4 text-gray-600">{fertiliser}</td>
    <td className="py-3 px-4 text-gray-600">{chemical}</td>
    <td className="py-3 px-4 text-gray-600">{yieldValue}</td>
    <td className="py-3 px-4 text-gray-600">{price}</td>
    <td className="py-3 px-4 text-gray-600">{gm}</td>
    <td className="py-3 px-4">
      <button onClick={onEdit} className="text-gray-600 hover:text-gray-900"> {/* Call onEdit */}
        ✏️
      </button>
    </td>
  </tr>
);

interface OperationsRowProps {
  crop: string;
  cultivation: string;
  drilling: string;
  application: string;
  harvesting: string;
  other: string;
  netMargin?: string;
  onEdit: () => void; // Add onEdit prop
}

const OperationsRow: React.FC<OperationsRowProps> = ({ 
  crop, 
  cultivation,
  drilling,
  application,
  harvesting,
  other,
  netMargin,
  onEdit // Destructure onEdit
}) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="py-3 px-4 text-gray-900">{crop}</td>
    <td className="py-3 px-4 text-gray-600">{cultivation}</td>
    <td className="py-3 px-4 text-gray-600">{drilling}</td>
    <td className="py-3 px-4 text-gray-600">{application}</td>
    <td className="py-3 px-4 text-gray-600">{harvesting}</td>
    <td className="py-3 px-4 text-gray-600">{other}</td>
    <td className="py-3 px-4 text-gray-600">{netMargin}</td>
    <td className="py-3 px-4">
      <button onClick={onEdit} className="text-gray-600 hover:text-gray-900"> {/* Call onEdit */}
        ✏️
      </button>
    </td>
  </tr>
);

const Budgets: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialYear = searchParams.get('year') || '2025'; // Default to 2025
  const initialCrop = searchParams.get('crop') ? decodeURIComponent(searchParams.get('crop')!) : 'All Crops'; // Default to All Crops

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedCrop, setSelectedCrop] = useState(initialCrop);
  const [panelMode, setPanelMode] = useState<'add' | 'edit'>('add'); // State for panel mode
  const [editingBudgetData, setEditingBudgetData] = useState<any>(null); // State for data being edited
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  // Add initial onEdit handlers to the initial data
  const [variableCosts, setVariableCosts] = useState<CropRowProps[]>(() => [
    {
      crop: "Wheat (Winter)", area: "130.00 ha", seed: "£130.00 /ha", fertiliser: "£130.00 /ha",
      chemical: "£130.00 /ha", yield: "130.00 t/ha", price: "£130.00 /t", gm: "£16,510.00 /ha",
      onEdit: () => {} // Placeholder, will be replaced by handleEdit below
    },
    {
      crop: "Triticale (Spring)", area: "182.00 ha", seed: "£182.00 /ha", fertiliser: "£182.00 /ha",
      chemical: "£182.00 /ha", yield: "182.00 t/ha", price: "£182.00 /t", gm: "£32,578.00 /ha",
      onEdit: () => {}
    },
    {
      crop: "Vining Pea", area: "108.00 ha", seed: "£108.00 /ha", fertiliser: "£108.00 /ha",
      chemical: "£108.00 /ha", yield: "108.00 t/ha", price: "£108.00 /t", gm: "£11,340.00 /ha",
      onEdit: () => {}
    }
  ].map(item => ({ ...item, onEdit: () => handleEdit(item, 'variable') }))); // Assign actual handler

  const [operationsCosts, setOperationsCosts] = useState<OperationsRowProps[]>([]);

  // Initialize operations costs with calculated net margins
  useEffect(() => {
    // Calculate net margin for a crop
    const calculateNetMargin = (cropName: string) => {
      // Find the matching variable cost entry
      const variableCost = variableCosts.find(vc => vc.crop === cropName);
      
      if (!variableCost) return "£0.00";
      
      // Parse the gross margin from the variable costs
      const grossMargin = parseFloat(variableCost.gm.replace('£', '').replace(',', '').split(' ')[0]);
      
      // Calculate total operations costs for this crop
      const operationCost = initialOperationsCosts.find(oc => oc.crop === cropName);
      
      if (!operationCost) return "£0.00";
      
      const totalOperationsCost = 
        parseFloat(operationCost.cultivation.replace('£', '').replace(',', '')) +
        parseFloat(operationCost.drilling.replace('£', '').replace(',', '')) +
        parseFloat(operationCost.application.replace('£', '').replace(',', '')) +
        parseFloat(operationCost.harvesting.replace('£', '').replace(',', '')) +
        parseFloat(operationCost.other.replace('£', '').replace(',', ''));
      
      // Calculate net margin (gross margin - operations costs)
      const netMargin = grossMargin - totalOperationsCost;
      
      // Format with commas for thousands
      return netMargin >= 0 
        ? `£${netMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `-£${Math.abs(netMargin).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Add initial onEdit handlers
    const initialOperationsCostsData = [
       {
         crop: "Wheat (Winter)", cultivation: "£6,500.00", drilling: "£3,900.00",
         application: "£2,600.00", harvesting: "£5,200.00", other: "£1,300.00"
       },
       {
         crop: "Triticale (Spring)", cultivation: "£9,100.00", drilling: "£5,460.00",
         application: "£3,640.00", harvesting: "£7,280.00", other: "£1,820.00"
       }
     ];

    const initialOperationsCosts: OperationsRowProps[] = initialOperationsCostsData.map(item => ({
        ...item,
        onEdit: () => handleEdit(item, 'operations') // Assign actual handler
    }));

    // Calculate and add net margin for each operations cost
    const operationsWithNetMargin = initialOperationsCosts.map(cost => ({
      ...cost,
      netMargin: calculateNetMargin(cost.crop)
    }));

    setOperationsCosts(operationsWithNetMargin);
    // TODO: Filter or fetch data based on selectedYear and selectedCrop here
    // For now, using hardcoded data.

  }, [variableCosts, selectedYear, selectedCrop]); // Recalculate when variable costs, year, or crop change

  // Calculate net margin for a crop - used for new operations costs
  const calculateNetMargin = (cropName: string) => {
    // Find the matching variable cost entry
    const variableCost = variableCosts.find(vc => vc.crop === cropName);
    // Find the matching operations cost entry
    const operationCost = operationsCosts.find(oc => oc.crop === cropName);
    
    if (!variableCost || !operationCost) return "£0.00";
    
    // Parse the gross margin from the variable costs
    const grossMargin = parseFloat(variableCost.gm.replace('£', '').replace(',', '').split(' ')[0]);
    
    // Calculate total operations costs
    const totalOperationsCost = 
      parseFloat(operationCost.cultivation.replace('£', '').replace(',', '')) +
      parseFloat(operationCost.drilling.replace('£', '').replace(',', '')) +
      parseFloat(operationCost.application.replace('£', '').replace(',', '')) +
      parseFloat(operationCost.harvesting.replace('£', '').replace(',', '')) +
      parseFloat(operationCost.other.replace('£', '').replace(',', ''));
    
    // Calculate net margin (gross margin - operations costs)
    const netMargin = grossMargin - totalOperationsCost;
    
    // Format with commas for thousands
    return netMargin >= 0 
      ? `£${netMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `-£${Math.abs(netMargin).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
    // Function to handle opening the panel for editing
    const handleEdit = (itemData: any, type: 'variable' | 'operations') => {
      // Helper to extract number from formatted string (e.g., "£130.00 /ha" -> 130.00)
      const parseValue = (valueString: string | undefined): string => {
        if (!valueString) return '';
        // Remove currency symbols (£) and commas (,) only
        const cleaned = valueString.replace(/[£,]/g, '');
        // Parse the remaining string as a float
        const number = parseFloat(cleaned);
        // Return the number as a string, or an empty string if parsing failed
        return isNaN(number) ? '' : number.toString();
      };

      // Find matching data from the other table
      const crop = itemData.crop;
      const matchingVariableCost = variableCosts.find(c => c.crop === crop);
      const matchingOperationsCost = operationsCosts.find(c => c.crop === crop);

      // Combine both variable and operations data
      const dataToEdit = {
        type, // Keep track of which table was clicked
        crop: itemData.crop,
        // Variable costs data
        area: matchingVariableCost ? parseValue(matchingVariableCost.area) : '',
        seed: matchingVariableCost ? parseValue(matchingVariableCost.seed) : '',
        fertiliser: matchingVariableCost ? parseValue(matchingVariableCost.fertiliser) : '',
        chemical: matchingVariableCost ? parseValue(matchingVariableCost.chemical) : '',
        yield: matchingVariableCost ? parseValue(matchingVariableCost.yield) : '',
        price: matchingVariableCost ? parseValue(matchingVariableCost.price) : '',
        // Operations costs data
        cultivation: matchingOperationsCost ? parseValue(matchingOperationsCost.cultivation) : '',
        drilling: matchingOperationsCost ? parseValue(matchingOperationsCost.drilling) : '',
        application: matchingOperationsCost ? parseValue(matchingOperationsCost.application) : '',
        harvesting: matchingOperationsCost ? parseValue(matchingOperationsCost.harvesting) : '',
        other: matchingOperationsCost ? parseValue(matchingOperationsCost.other) : '',
      };

      setEditingBudgetData(dataToEdit);
      setPanelMode('edit');
      setIsPanelOpen(true);
    };

  // Renamed function to handle both add and edit (eventually)
  const handleSaveBudget = (data: any, mode: 'add' | 'edit') => {
    // Helper to format number to currency string
    const formatCurrency = (value: string | number | undefined, unit: string = ''): string => {
      const num = parseFloat(value?.toString() || '0');
      const formatted = `£${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      return unit ? `${formatted} ${unit}` : formatted;
    };
     // Helper to format number with unit
    const formatUnit = (value: string | number | undefined, unit: string): string => {
      const num = parseFloat(value?.toString() || '0');
      return `${num.toFixed(2)} ${unit}`;
    };


    if (data.type === 'variable') {
      const grossMargin = data.yield && data.price
        ? (Number(data.yield) * Number(data.price))
        : 0;

      // Create the budget data object *without* onEdit first
      const budgetData: Omit<CropRowProps, 'onEdit'> = {
        crop: data.crop,
        area: formatUnit(data.area, 'ha'),
        seed: formatCurrency(data.seed, '/ha'),
        fertiliser: formatCurrency(data.fertiliser, '/ha'),
        chemical: formatCurrency(data.chemical, '/ha'),
        yield: formatUnit(data.yield, 't/ha'),
        price: formatCurrency(data.price, '/t'),
        gm: formatCurrency(grossMargin, '/ha')
      };

      // Now create the final object including the onEdit handler
      const finalBudgetData: CropRowProps = {
          ...budgetData,
          onEdit: () => handleEdit(budgetData, 'variable') // Pass the *unformatted* data to handleEdit if needed, or re-parse
      };


      if (mode === 'edit') {
        setVariableCosts(prev => prev.map(cost =>
          cost.crop === data.crop ? finalBudgetData : cost // Use finalBudgetData with onEdit
        ));
      } else { // mode === 'add'
         // Check if crop already exists before adding
        const exists = variableCosts.some(cost => cost.crop === data.crop);
        if (!exists) {
            setVariableCosts(prev => [...prev, finalBudgetData]); // Use finalBudgetData with onEdit
        } else {
            // Optionally handle the case where the crop already exists (e.g., show an error)
            console.warn(`Budget for crop "${data.crop}" already exists.`);
        }
      }
    }

    // For Operations costs
    else if (data.type === 'operations') {
       // Create budget data object *without* onEdit and netMargin first
       const budgetData: Omit<OperationsRowProps, 'onEdit' | 'netMargin'> = {
         crop: data.crop,
         cultivation: formatCurrency(data.cultivation),
         drilling: formatCurrency(data.drilling),
         application: formatCurrency(data.application),
         harvesting: formatCurrency(data.harvesting),
         other: formatCurrency(data.other),
       };

       // Calculate net margin separately
       const variableCost = variableCosts.find(vc => vc.crop === data.crop);
       let netMarginStr = '£0.00';
       if (variableCost) {
         const grossMargin = parseFloat(variableCost.gm.replace(/[£,]/g, '').split(' ')[0] || '0');
         const totalOperationsCost =
           parseFloat(data.cultivation || '0') +
           parseFloat(data.drilling || '0') +
           parseFloat(data.application || '0') +
           parseFloat(data.harvesting || '0') +
           parseFloat(data.other || '0');
         const netMargin = grossMargin - totalOperationsCost;
         netMarginStr = formatCurrency(netMargin);
       }

       // Create the final object including netMargin and onEdit
       const finalBudgetData: OperationsRowProps = {
           ...budgetData,
           netMargin: netMarginStr,
           onEdit: () => handleEdit(budgetData, 'operations') // Pass unformatted data if needed
       };


      if (mode === 'edit') {
        setOperationsCosts(prev => prev.map(cost =>
          cost.crop === data.crop ? finalBudgetData : cost // Use finalBudgetData with onEdit
        ));
      } else { // mode === 'add'
         // Check if crop already exists before adding
         const exists = operationsCosts.some(cost => cost.crop === data.crop);
         if (!exists) {
            setOperationsCosts(prev => [...prev, finalBudgetData]); // Use finalBudgetData with onEdit
         } else {
             console.warn(`Operations budget for crop "${data.crop}" already exists.`);
         }
      }
    }

    setIsPanelOpen(false);
  };

  // --- Calculations for Summary Cards ---
  const formatCurrencyValue = (value: number): string => {
    // Use en-GB for £ symbol placement
    return value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatAreaValue = (value: number): string => {
    return `${value.toFixed(2)} ha`;
  };

  const parseValue = (valueString: string | undefined, removeChars: string = '£,'): number => {
      if (!valueString) return 0;
      // Remove specified characters and any whitespace around them, also units like /ha, /t
      const cleaned = valueString.replace(new RegExp(`[${removeChars}\\s/a-zA-Z]+`, 'g'), '').trim();
      const number = parseFloat(cleaned);
      return isNaN(number) ? 0 : number;
  };


  const totalArea = variableCosts.reduce((total, cost) => total + parseValue(cost.area, 'ha'), 0);
  // Placeholder for harvested area as it's not in the data
  const harvestedAreaValue = 0;
  const harvestedAreaPercentage = totalArea > 0 ? (harvestedAreaValue / totalArea) * 100 : 0;
  const harvestedAreaDisplay = `${harvestedAreaValue.toFixed(2)} ha (${harvestedAreaPercentage.toFixed(0)}%)`;


  const totalInputCosts = variableCosts.reduce((total, cost) => {
    const area = parseValue(cost.area, 'ha');
    const seed = parseValue(cost.seed);
    const fertiliser = parseValue(cost.fertiliser);
    const chemical = parseValue(cost.chemical);
    // Costs are per ha, so multiply by area
    return total + (seed + fertiliser + chemical) * area;
  }, 0);

  const totalOperationsCosts = operationsCosts.reduce((total, cost) => {
    // These costs seem to be totals already, not per ha based on AddBudgetPanel logic and table totals
    return total +
      parseValue(cost.cultivation) +
      parseValue(cost.drilling) +
      parseValue(cost.application) +
      parseValue(cost.harvesting) +
      parseValue(cost.other);
  }, 0);

  const totalCosts = totalInputCosts + totalOperationsCosts;

  const totalSales = variableCosts.reduce((total, cost) => {
      const area = parseValue(cost.area, 'ha');
      const yieldVal = parseValue(cost.yield, 't/ha');
      const price = parseValue(cost.price, '/t');
      return total + (yieldVal * price * area);
  }, 0);

  // Gross Margin = Total Sales - Total Input Costs
  const budgetedGrossMargin = totalSales - totalInputCosts;

  // Net Margin = Gross Margin - Total Operations Costs
  const calculatedNetMargin = budgetedGrossMargin - totalOperationsCosts;

  // --- End Calculations ---


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">Budgets</h1>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{selectedYear}</span>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 bg-white"
        >
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          {/* Add more years if needed */}
        </select>
      </div>

      <h2 className="text-xl font-medium text-gray-900 mb-4">Summary</h2>
      {/* Updated grid for responsiveness and content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <SummaryCard
            title="Area Information"
            info="Details about the total and harvested farm area."
            items={[
              { label: "Total Area", value: formatAreaValue(totalArea), isBold: true },
              { label: "Harvested area", value: harvestedAreaDisplay, isBold: true }, // Using placeholder
            ]}
          />
          <SummaryCard
            title="Costs"
            info="Breakdown of input and operational costs."
            items={[
              { label: "Input", value: formatCurrencyValue(totalInputCosts), isBold: true },
              { label: "Operations", value: formatCurrencyValue(totalOperationsCosts), isBold: true },
              { label: "Total", value: formatCurrencyValue(totalCosts), isBold: false }, // Total is not bold in image
            ]}
          />
          <SummaryCard
            title="Sales"
            info="Total projected sales based on yield and price."
            items={[
              { label: "Total Sales", value: formatCurrencyValue(totalSales), isBold: true },
            ]}
          />
          <SummaryCard
            title="Profitability"
            info="Budgeted gross and net margins."
            items={[
              { label: "Budgeted Gross Margin", value: formatCurrencyValue(budgetedGrossMargin), isBold: true },
              { label: "Budgeted Net Margin", value: formatCurrencyValue(calculatedNetMargin), isBold: true },
            ]}
          />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900">Crops</h2>
          <button 
            onClick={() => {
              setPanelMode('add'); // Set mode to 'add'
              setEditingBudgetData(null); // Clear any editing data
              setIsPanelOpen(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            + Add budgets
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Variable Costs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Crop</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Area</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Seed</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Fertiliser</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Chemical</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Yield</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Price</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">GM</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {variableCosts.map((cost, index) => (
                  <CropRow key={index} {...cost} onEdit={() => handleEdit(cost, 'variable')} />
                ))}
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-medium">
                  <td className="py-3 px-4 text-gray-900">Total Variable Costs</td>
                  <td className="py-3 px-4 text-gray-900">{variableCosts.reduce((total, cost) => total + parseFloat(cost.area.split(' ')[0]), 0).toFixed(2)} ha</td>
                  <td className="py-3 px-4 text-gray-900">£{variableCosts.reduce((total, cost) => total + parseFloat(cost.seed.split('£')[1].split(' ')[0]) * parseFloat(cost.area.split(' ')[0]), 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-900">£{variableCosts.reduce((total, cost) => total + parseFloat(cost.fertiliser.split('£')[1].split(' ')[0]) * parseFloat(cost.area.split(' ')[0]), 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-900">£{variableCosts.reduce((total, cost) => total + parseFloat(cost.chemical.split('£')[1].split(' ')[0]) * parseFloat(cost.area.split(' ')[0]), 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-900">{variableCosts.reduce((total, cost) => total + parseFloat(cost.yield.split(' ')[0]) * parseFloat(cost.area.split(' ')[0]), 0).toFixed(2)} t</td>
                  <td className="py-3 px-4 text-gray-900">-</td>
                  <td className="py-3 px-4 text-gray-900">£{variableCosts.reduce((total, cost) => total + parseFloat(cost.gm.split('£')[1].split(' ')[0]) * parseFloat(cost.area.split(' ')[0]), 0).toFixed(2)}</td>
                  <td className="py-3 px-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Operations Costs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Crop</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Cultivation</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Drilling</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Application</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Harvesting</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Other</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Net Margin</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {operationsCosts.map((cost, index) => (
                  <OperationsRow key={index} {...cost} onEdit={() => handleEdit(cost, 'operations')} />
                ))}
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-medium">
                  <td className="py-3 px-4 text-gray-900">Total Operations Costs</td>
                  <td className="py-3 px-4 text-gray-900">£{operationsCosts.reduce((total, cost) => total + parseFloat(cost.cultivation.split('£')[1]), 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-900">£{operationsCosts.reduce((total, cost) => total + parseFloat(cost.drilling.split('£')[1]), 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-900">£{operationsCosts.reduce((total, cost) => total + parseFloat(cost.application.split('£')[1]), 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-900">£{operationsCosts.reduce((total, cost) => total + parseFloat(cost.harvesting.split('£')[1]), 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-900">£{operationsCosts.reduce((total, cost) => total + parseFloat(cost.other.split('£')[1]), 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-900">
                    {(() => {
                      const totalNetMargin = operationsCosts.reduce((total, cost) => {
                        if (!cost.netMargin) return total;
                        
                        // Handle both positive and negative values
                        const isNegative = cost.netMargin.startsWith('-');
                        const valueStr = isNegative ? cost.netMargin.substring(2) : cost.netMargin.substring(1);
                        const value = parseFloat(valueStr.replace(',', ''));
                        
                        return total + (isNegative ? -value : value);
                      }, 0);
                      
                      // Format with commas for thousands
                      return totalNetMargin >= 0 
                        ? `£${totalNetMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : `-£${Math.abs(totalNetMargin).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    })()}
                  </td>
                  <td className="py-3 px-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddBudgetPanel
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
          setEditingBudgetData(null); // Clear editing data on close
        }}
        onSave={handleSaveBudget}
        mode={panelMode} // Pass the current mode
        initialData={editingBudgetData} // Pass data for editing
      />
    </div>
  );
};

export default Budgets;