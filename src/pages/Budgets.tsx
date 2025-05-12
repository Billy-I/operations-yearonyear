import React, { useState, useEffect, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { Popover, Transition } from '@headlessui/react';
import { PencilIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
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
  gm: string; // Gross Margin per hectare
  onEdit: () => void;
  onDelete: (crop: string) => void; // Add onDelete prop
}

const CropRow: React.FC<CropRowProps> = ({ crop, area, seed, fertiliser, chemical, yield: yieldValue, price, gm, onEdit, onDelete }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="py-3 px-4 text-gray-900">{crop}</td>
    <td className="py-3 px-4 text-gray-600">{area}</td>
    <td className="py-3 px-4 text-gray-600">{seed}</td>
    <td className="py-3 px-4 text-gray-600">{fertiliser}</td>
    <td className="py-3 px-4 text-gray-600">{chemical}</td>
    <td className="py-3 px-4 text-gray-600">{yieldValue}</td>
    <td className="py-3 px-4 text-gray-600">{price}</td>
    <td className="py-3 px-4 text-gray-600">{gm}</td>
    <td className="py-3 px-4 text-center">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className="p-1 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Popover.Button
                    as="button"
                    onClick={onEdit}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <PencilIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>Edit</span>
                  </Popover.Button>
                  <Popover.Button
                    as="button"
                    onClick={() => onDelete(crop)}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
                  >
                    <TrashIcon className="mr-3 h-5 w-5 text-red-400" aria-hidden="true" />
                    <span>Delete</span>
                  </Popover.Button>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </td>
  </tr>
);

interface OperationsRowProps {
  crop: string;
  cultivation: string; // Stored as Total £
  drilling: string;     // Stored as Total £
  application: string;  // Stored as Total £
  harvesting: string;   // Stored as Total £
  other: string;        // Stored as Total £
  netMargin?: string;   // Stored as Total £
  onEdit: () => void;
  onDelete: (crop: string) => void; // Add onDelete prop
}

// This component receives already formatted strings based on the toggle
const OperationsRow: React.FC<OperationsRowProps> = ({
  crop,
  cultivation,
  drilling,
  application,
  harvesting,
  other,
  netMargin,
  onEdit,
  onDelete
}) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="py-3 px-4 text-gray-900">{crop}</td>
    <td className="py-3 px-4 text-gray-600">{cultivation}</td>
    <td className="py-3 px-4 text-gray-600">{drilling}</td>
    <td className="py-3 px-4 text-gray-600">{application}</td>
    <td className="py-3 px-4 text-gray-600">{harvesting}</td>
    <td className="py-3 px-4 text-gray-600">{other}</td>
    <td className="py-3 px-4 text-gray-600">{netMargin ?? '-'}</td> {/* Display '-' if netMargin is undefined */}
    <td className="py-3 px-4 text-center">
       <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className="p-1 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Popover.Button
                    as="button"
                    onClick={onEdit}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <PencilIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>Edit</span>
                  </Popover.Button>
                  <Popover.Button
                    as="button"
                    onClick={() => onDelete(crop)}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
                  >
                    <TrashIcon className="mr-3 h-5 w-5 text-red-400" aria-hidden="true" />
                    <span>Delete</span>
                  </Popover.Button>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </td>
  </tr>
);

const Budgets: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialYear = searchParams.get('year') || '2025';
  const initialCrop = searchParams.get('crop') ? decodeURIComponent(searchParams.get('crop')!) : 'All Crops';

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedCrop, setSelectedCrop] = useState(initialCrop);
  const [panelMode, setPanelMode] = useState<'add' | 'edit'>('add');
  const [editingBudgetData, setEditingBudgetData] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [operationsCostUnit, setOperationsCostUnit] = useState<'total' | 'perHa'>('total');

  // --- Utility Functions ---
  const formatCurrencyValue = (value: number, unit: 'total' | 'perHa' = 'total'): string => {
    const formatted = value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return unit === 'perHa' ? `${formatted} /ha` : formatted;
  };

  const formatAreaValue = (value: number): string => {
    return `${value.toFixed(2)} ha`;
  };

  const parseValue = (valueString: string | undefined, removeChars: string = '£,'): number => {
      if (!valueString) return 0;
      // Remove specified characters, units, and whitespace. Handle potential negative sign.
      const cleaned = valueString.replace(new RegExp(`[${removeChars}\\s/a-zA-Z]+`, 'g'), '').trim();
      const number = parseFloat(cleaned);
      // Check if original string started with '-' after removing currency/commas but before removing letters/units
      const mightBeNegative = valueString.replace(/[£,]/g, '').trim().startsWith('-');
      const finalNumber = isNaN(number) ? 0 : (mightBeNegative && number > 0 ? -number : number); // Ensure negative sign is preserved if needed
      return finalNumber;
  };
  // --- End Utility Functions ---

  // --- State Initialization ---
  const [variableCosts, setVariableCosts] = useState<CropRowProps[]>([]);
  const [operationsCosts, setOperationsCosts] = useState<OperationsRowProps[]>([]);

  // Initial data setup and net margin calculation
  useEffect(() => {
    // Define initial variable costs data structure
    const initialVariableCostsData = [
      {
        crop: "Wheat (Winter)", area: "130.00 ha", seed: "£130.00 /ha", fertiliser: "£130.00 /ha",
        chemical: "£130.00 /ha", yield: "130.00 t/ha", price: "£130.00 /t", gm: "£16510.00 /ha" // Example GM/ha
      },
      {
        crop: "Triticale (Spring)", area: "182.00 ha", seed: "£182.00 /ha", fertiliser: "£182.00 /ha",
        chemical: "£182.00 /ha", yield: "182.00 t/ha", price: "£182.00 /t", gm: "£32578.00 /ha" // Example GM/ha
      },
      {
        crop: "Vining Pea", area: "108.00 ha", seed: "£108.00 /ha", fertiliser: "£108.00 /ha",
        chemical: "£108.00 /ha", yield: "108.00 t/ha", price: "£108.00 /t", gm: "£11340.00 /ha" // Example GM/ha
      }
    ];

    // Define initial operations costs data structure (Total £)
    const initialOperationsCostsData = [
       {
         crop: "Wheat (Winter)", cultivation: "£6500.00", drilling: "£3900.00",
         application: "£2600.00", harvesting: "£5200.00", other: "£1300.00"
       },
       {
         crop: "Triticale (Spring)", cultivation: "£9100.00", drilling: "£5460.00",
         application: "£3640.00", harvesting: "£7280.00", other: "£1820.00"
       }
     ];

    // Calculate net margin (Total £)
    const calculateNetMarginTotal = (cropName: string, currentVarCosts: CropRowProps[], currentOpCosts: Omit<OperationsRowProps, 'netMargin' | 'onEdit' | 'onDelete'>) => {
      const variableCost = currentVarCosts.find(vc => vc.crop === cropName);
      if (!variableCost) return formatCurrencyValue(0);

      const area = parseValue(variableCost.area, 'ha');
      const grossMarginPerHa = parseValue(variableCost.gm); // GM is stored per ha
      const totalGrossMargin = grossMarginPerHa * area;

      const totalOperationsCost =
        parseValue(currentOpCosts.cultivation) +
        parseValue(currentOpCosts.drilling) +
        parseValue(currentOpCosts.application) +
        parseValue(currentOpCosts.harvesting) +
        parseValue(currentOpCosts.other);

      const netMargin = totalGrossMargin - totalOperationsCost;
      return formatCurrencyValue(netMargin);
    };

    // Map initial variable costs data and add onEdit/onDelete
    const initialVariableCostsWithHandlers = initialVariableCostsData.map(item => ({
        ...item,
        onEdit: () => handleEdit(item, 'variable'),
        onDelete: (crop: string) => handleDelete(crop, 'variable') // Pass type
    }));
    setVariableCosts(initialVariableCostsWithHandlers);

    // Map initial operations costs data, calculate net margin, and add onEdit/onDelete
    const initialOperationsCostsWithHandlersAndMargin = initialOperationsCostsData.map(item => {
        const netMargin = calculateNetMarginTotal(item.crop, initialVariableCostsWithHandlers, item); // Use updated variable costs list here
        return {
            ...item,
            netMargin: netMargin,
            onEdit: () => handleEdit(item, 'operations'),
            onDelete: (crop: string) => handleDelete(crop, 'operations') // Ensure onDelete is passed
        };
    });
    setOperationsCosts(initialOperationsCostsWithHandlersAndMargin); // Set the state

    // TODO: Filter or fetch data based on selectedYear and selectedCrop here

  }, [selectedYear, selectedCrop]); // Rerun only when year/crop changes, not variableCosts


  // --- Edit Handling ---
  const handleEdit = (itemData: any, type: 'variable' | 'operations') => {
    const parseEditValue = (valueString: string | undefined): string => {
      if (!valueString) return '';
      const cleaned = valueString.replace(/[£,]/g, '');
      const numberMatch = cleaned.match(/^-?\d+(\.\d+)?/);
      return numberMatch ? numberMatch[0] : '';
    };

    const crop = itemData.crop;
    let dataToEdit: any = {
      type,
      crop: itemData.crop,
    };

    if (type === 'variable') {
      const matchingVariableCost = variableCosts.find(c => c.crop === crop);
      if (matchingVariableCost) {
        dataToEdit = {
          ...dataToEdit,
          area: parseEditValue(matchingVariableCost.area),
          seed: parseEditValue(matchingVariableCost.seed),
          fertiliser: parseEditValue(matchingVariableCost.fertiliser),
          chemical: parseEditValue(matchingVariableCost.chemical),
          yield: parseEditValue(matchingVariableCost.yield),
          price: parseEditValue(matchingVariableCost.price),
        };
      }
    } else { // operations
      const matchingOperationsCost = operationsCosts.find(c => c.crop === crop);
      if (matchingOperationsCost) {
        dataToEdit = {
          ...dataToEdit,
          cultivation: parseEditValue(matchingOperationsCost.cultivation),
          drilling: parseEditValue(matchingOperationsCost.drilling),
          application: parseEditValue(matchingOperationsCost.application),
          harvesting: parseEditValue(matchingOperationsCost.harvesting),
          other: parseEditValue(matchingOperationsCost.other),
        };
      }
    }

    setEditingBudgetData(dataToEdit);
    setPanelMode('edit');
    setIsPanelOpen(true);
  };

  // --- Save Handling ---
  const handleSaveBudget = (data: any, mode: 'add' | 'edit') => {
     const formatCurrency = (value: string | number | undefined, unitSuffix: string = ''): string => {
        const num = parseFloat(value?.toString() || '0');
        const formatted = num.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return unitSuffix ? `${formatted} ${unitSuffix}` : formatted;
     };
     const formatUnit = (value: string | number | undefined, unit: string): string => {
       const num = parseFloat(value?.toString() || '0');
       return `${num.toFixed(2)} ${unit}`;
     };

    // Recalculate Net Margin (Total £) based on potentially updated data
    const recalculateNetMarginTotal = (cropName: string, currentVarCosts: CropRowProps[], currentOpCostsData: any): string => {
        const variableCost = currentVarCosts.find(vc => vc.crop === cropName);
        if (!variableCost) return formatCurrency(0);

        const area = parseValue(variableCost.area, 'ha');
        const grossMarginPerHa = parseValue(variableCost.gm); // GM is stored per ha
        const totalGrossMargin = grossMarginPerHa * area;

        // Use the potentially updated operations data passed in 'currentOpCostsData'
        const totalOperationsCost =
            parseFloat(currentOpCostsData.cultivation || '0') +
            parseFloat(currentOpCostsData.drilling || '0') +
            parseFloat(currentOpCostsData.application || '0') +
            parseFloat(currentOpCostsData.harvesting || '0') +
            parseFloat(currentOpCostsData.other || '0');

        const netMargin = totalGrossMargin - totalOperationsCost;
        return formatCurrency(netMargin);
    };

    if (data.type === 'variable') {
      // Calculate GM per hectare from input data
      const gmPerHa = (Number(data.yield || 0) * Number(data.price || 0)) -
                      (Number(data.seed || 0) + Number(data.fertiliser || 0) + Number(data.chemical || 0));

      const budgetData: Omit<CropRowProps, 'onEdit' | 'onDelete'> = {
        crop: data.crop,
        area: formatUnit(data.area, 'ha'),
        seed: formatCurrency(data.seed, '/ha'),
        fertiliser: formatCurrency(data.fertiliser, '/ha'),
        chemical: formatCurrency(data.chemical, '/ha'),
        yield: formatUnit(data.yield, 't/ha'),
        price: formatCurrency(data.price, '/t'),
        gm: formatCurrency(gmPerHa, '/ha') // Store GM per ha
      };

      const finalBudgetData: CropRowProps = {
          ...budgetData,
          onEdit: () => handleEdit(budgetData, 'variable'),
          onDelete: (crop: string) => handleDelete(crop, 'variable')
      };

      let updatedVariableCosts: CropRowProps[];
      if (mode === 'edit') {
        updatedVariableCosts = variableCosts.map(cost =>
          cost.crop === data.crop ? finalBudgetData : cost
        );
      } else {
        const exists = variableCosts.some(cost => cost.crop === data.crop);
        if (!exists) {
            updatedVariableCosts = [...variableCosts, finalBudgetData];
        } else {
            console.warn(`Variable budget for crop "${data.crop}" already exists.`);
            updatedVariableCosts = variableCosts;
        }
      }
      setVariableCosts(updatedVariableCosts);

      // After updating variable costs, recalculate and update net margins in *existing* operations costs using map
      setOperationsCosts(prevOpsCosts => prevOpsCosts.map(opCost => {
          // Check if this is the operations cost item corresponding to the updated variable cost
          if (opCost.crop === data.crop) {
              // Recalculate net margin using the *updated* variable costs list and this opCost item's data
              const newNetMargin = recalculateNetMarginTotal(data.crop, updatedVariableCosts, opCost);

              // Return a *new* object containing all original properties (including handlers from opCost)
              // but with the updated netMargin.
              return {
                  ...opCost, // Spread the existing object from the map callback (includes handlers)
                  netMargin: newNetMargin // Override only the netMargin
              };
          }
          // If it's not the item to update, return it unchanged
          return opCost;
      }));

    } else if (data.type === 'operations') {
       const budgetData: Omit<OperationsRowProps, 'onEdit' | 'onDelete' | 'netMargin'> = {
         crop: data.crop,
         cultivation: formatCurrency(data.cultivation), // Store as total £
         drilling: formatCurrency(data.drilling),
         application: formatCurrency(data.application),
         harvesting: formatCurrency(data.harvesting),
         other: formatCurrency(data.other),
       };

       // Recalculate net margin using current variable costs and the *new* operations data
       const netMarginStr = recalculateNetMarginTotal(data.crop, variableCosts, data);

       const finalBudgetData: OperationsRowProps = {
           ...budgetData,
           netMargin: netMarginStr, // Store total net margin
           onEdit: () => handleEdit(budgetData, 'operations'),
           onDelete: (crop: string) => handleDelete(crop, 'operations')
       };

      if (mode === 'edit') {
        setOperationsCosts(prev => prev.map(cost =>
          cost.crop === data.crop ? finalBudgetData : cost
        ));
      } else {
         const exists = operationsCosts.some(cost => cost.crop === data.crop);
         if (!exists) {
            // Ensure corresponding variable cost exists before adding operations
            const varCostExists = variableCosts.some(vc => vc.crop === data.crop);
            if (varCostExists) {
                setOperationsCosts(prev => [...prev, finalBudgetData]);
            } else {
                console.warn(`Cannot add operations budget for crop "${data.crop}" as no variable budget exists.`);
            }
         } else {
             console.warn(`Operations budget for crop "${data.crop}" already exists.`);
         }
      }
    }

    setIsPanelOpen(false);
    setEditingBudgetData(null);
  };

  // --- Delete Handling ---
  const handleDelete = (cropToDelete: string, type: 'variable' | 'operations') => {
    const confirmBoth = window.confirm(`Do you want to delete BOTH variable and operations budgets for "${cropToDelete}"?`);

    if (confirmBoth) {
      setVariableCosts(prev => prev.filter(cost => cost.crop !== cropToDelete));
      setOperationsCosts(prev => prev.filter(cost => cost.crop !== cropToDelete));
    } else {
      const confirmSingle = window.confirm(`Delete only the ${type} budget for "${cropToDelete}"?`);
      if (confirmSingle) {
        if (type === 'variable') {
          setVariableCosts(prev => prev.filter(cost => cost.crop !== cropToDelete));
          // Also remove the corresponding operations cost if only variable is deleted?
          // For now, let's keep operations cost even if variable is deleted,
          // but the net margin calculation might become invalid or need adjustment.
          // Consider adding a check or warning if operations exist without variable costs.
        } else { // type === 'operations'
          setOperationsCosts(prev => prev.filter(cost => cost.crop !== cropToDelete));
        }
      }
    }
  };


  // --- Calculations for Summary Cards (depend on state) ---
  const totalArea = variableCosts.reduce((total, cost) => total + parseValue(cost.area, 'ha'), 0);
  const harvestedAreaValue = 0; // Placeholder
  const harvestedAreaPercentage = totalArea > 0 ? (harvestedAreaValue / totalArea) * 100 : 0;
  const harvestedAreaDisplay = `${harvestedAreaValue.toFixed(2)} ha (${harvestedAreaPercentage.toFixed(0)}%)`;

  const totalInputCosts = variableCosts.reduce((total, cost) => {
    const area = parseValue(cost.area, 'ha');
    const seed = parseValue(cost.seed);
    const fertiliser = parseValue(cost.fertiliser);
    const chemical = parseValue(cost.chemical);
    return total + (seed + fertiliser + chemical) * area;
  }, 0);

  const totalOperationsCostsValue = operationsCosts.reduce((total, cost) => {
    return total +
      parseValue(cost.cultivation) + parseValue(cost.drilling) +
      parseValue(cost.application) + parseValue(cost.harvesting) +
      parseValue(cost.other);
  }, 0);

  const totalCosts = totalInputCosts + totalOperationsCostsValue;

  const totalSales = variableCosts.reduce((total, cost) => {
      const area = parseValue(cost.area, 'ha');
      const yieldVal = parseValue(cost.yield, 't/ha');
      const price = parseValue(cost.price, '/t');
      return total + (yieldVal * price * area);
  }, 0);

  const budgetedGrossMargin = totalSales - totalInputCosts;
  const calculatedNetMargin = budgetedGrossMargin - totalOperationsCostsValue;
  // --- End Calculations ---


  return (
    <div className="p-6">
      {/* Header */}
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
        </select>
      </div>

      {/* Summary Cards */}
      <h2 className="text-xl font-medium text-gray-900 mb-4">Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <SummaryCard
            title="Area Information" info="Details about the total and harvested farm area."
            items={[
              { label: "Total Area", value: formatAreaValue(totalArea), isBold: true },
              { label: "Harvested area", value: harvestedAreaDisplay, isBold: true },
            ]} />
          <SummaryCard
            title="Costs" info="Breakdown of input and operational costs."
            items={[
              { label: "Input", value: formatCurrencyValue(totalInputCosts), isBold: true },
              { label: "Operations", value: formatCurrencyValue(totalOperationsCostsValue), isBold: true },
              { label: "Total", value: formatCurrencyValue(totalCosts), isBold: false },
            ]} />
          <SummaryCard
            title="Sales" info="Total projected sales based on yield and price."
            items={[ { label: "Total Sales", value: formatCurrencyValue(totalSales), isBold: true } ]} />
          <SummaryCard
            title="Profitability" info="Budgeted gross and net margins."
            items={[
              { label: "Budgeted Gross Margin", value: formatCurrencyValue(budgetedGrossMargin), isBold: true },
              { label: "Budgeted Net Margin", value: formatCurrencyValue(calculatedNetMargin), isBold: true },
            ]} />
      </div>

      {/* Variable Costs Table */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900">Crops</h2>
          <button
            onClick={() => { setPanelMode('add'); setEditingBudgetData(null); setIsPanelOpen(true); }}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          > + Add budgets </button>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Variable Costs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Crop</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Area (ha)</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Seed (£/ha)</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Fertiliser (£/ha)</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Chemical (£/ha)</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Yield (t/ha)</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Price (£/t)</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">GM (£/ha)</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {variableCosts.map((cost) => (
                  <CropRow key={cost.crop} {...cost} />
                ))}
                {/* Total Variable Costs Row */}
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-medium">
                  <td className="py-3 px-4 text-gray-900">Total Variable Costs</td>
                  <td className="py-3 px-4 text-gray-900">{formatAreaValue(variableCosts.reduce((total, cost) => total + parseValue(cost.area, 'ha'), 0))}</td>
                  {/* Totals below are sum of (value/ha * area) */}
                  <td className="py-3 px-4 text-gray-900">{formatCurrencyValue(variableCosts.reduce((total, cost) => total + parseValue(cost.seed) * parseValue(cost.area, 'ha'), 0))}</td>
                  <td className="py-3 px-4 text-gray-900">{formatCurrencyValue(variableCosts.reduce((total, cost) => total + parseValue(cost.fertiliser) * parseValue(cost.area, 'ha'), 0))}</td>
                  <td className="py-3 px-4 text-gray-900">{formatCurrencyValue(variableCosts.reduce((total, cost) => total + parseValue(cost.chemical) * parseValue(cost.area, 'ha'), 0))}</td>
                  <td className="py-3 px-4 text-gray-900">{variableCosts.reduce((total, cost) => total + parseValue(cost.yield, 't/ha') * parseValue(cost.area, 'ha'), 0).toFixed(2)} t</td>
                  <td className="py-3 px-4 text-gray-900">-</td> {/* Price total doesn't make sense */}
                  {/* Total Gross Margin (Sum of GM/ha * Area for each crop) */}
                  <td className="py-3 px-4 text-gray-900">{formatCurrencyValue(variableCosts.reduce((total, cost) => total + parseValue(cost.gm) * parseValue(cost.area, 'ha'), 0))}</td>
                  <td className="py-3 px-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Operations Costs Table */}
      <div className="mb-8">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Header with Toggle */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Operations Costs</h3>
            <div className="flex items-center space-x-1 border border-gray-300 rounded-md p-0.5">
              <button
                onClick={() => setOperationsCostUnit('total')}
                className={`px-2 py-0.5 rounded-md text-xs ${operationsCostUnit === 'total' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              > £ Total </button>
              <button
                onClick={() => setOperationsCostUnit('perHa')}
                className={`px-2 py-0.5 rounded-md text-xs ${operationsCostUnit === 'perHa' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              > £ /ha </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Crop</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Cultivation ({operationsCostUnit === 'total' ? '£' : '£/ha'})</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Drilling ({operationsCostUnit === 'total' ? '£' : '£/ha'})</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Application ({operationsCostUnit === 'total' ? '£' : '£/ha'})</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Harvesting ({operationsCostUnit === 'total' ? '£' : '£/ha'})</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Other ({operationsCostUnit === 'total' ? '£' : '£/ha'})</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Net Margin ({operationsCostUnit === 'total' ? '£' : '£/ha'})</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {/* Operations Costs Rows - Dynamically render based on unit */}
                {operationsCosts.map((cost) => {
                  const vCost = variableCosts.find(vc => vc.crop === cost.crop);
                  const area = vCost ? parseValue(vCost.area, 'ha') : 0;

                  // Display helper for individual cost categories
                  const displayCost = (valueStr: string | undefined) => {
                    const numValue = parseValue(valueStr); // Stored as Total £
                    if (operationsCostUnit === 'perHa') {
                      const perHaValue = area > 0 ? numValue / area : 0;
                      return formatCurrencyValue(perHaValue, 'perHa');
                    }
                    return formatCurrencyValue(numValue, 'total');
                  };

                  // Display helper for Net Margin (which is also stored as Total £)
                  const displayNetMargin = (valueStr: string | undefined) => {
                    const numValue = parseValue(valueStr); // Stored as Total £
                    if (operationsCostUnit === 'perHa') {
                      const perHaValue = area > 0 ? numValue / area : 0;
                      return formatCurrencyValue(perHaValue, 'perHa');
                    }
                    return formatCurrencyValue(numValue, 'total');
                  };

                  return (
                    <OperationsRow
                      key={cost.crop}
                      crop={cost.crop}
                      cultivation={displayCost(cost.cultivation)}
                      drilling={displayCost(cost.drilling)}
                      application={displayCost(cost.application)}
                      harvesting={displayCost(cost.harvesting)}
                      other={displayCost(cost.other)}
                      netMargin={displayNetMargin(cost.netMargin)}
                      onEdit={() => handleEdit(cost, 'operations')}
                      onDelete={cost.onDelete} // Add the missing onDelete prop
                    />
                  );
                })}
                {/* Total Operations Costs Row - Dynamically calculate based on unit */}
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-medium">
                  <td className="py-3 px-4 text-gray-900">Total Operations Costs</td>
                  {/* Calculate and display totals based on toggle state */}
                  {[ 'cultivation', 'drilling', 'application', 'harvesting', 'other'].map(key => (
                    <td key={key} className="py-3 px-4 text-gray-900">
                      {formatCurrencyValue(operationsCosts.reduce((total, cost) => {
                        const vCost = variableCosts.find(vc => vc.crop === cost.crop);
                        const area = vCost ? parseValue(vCost.area, 'ha') : 0;
                        const value = parseValue((cost as any)[key]); // Get total numeric value
                        // If perHa, sum the calculated per-ha values; otherwise, sum total values
                        const valueToAdd = (operationsCostUnit === 'perHa' && area > 0) ? value / area : value;
                        return total + valueToAdd;
                      }, 0), operationsCostUnit)}
                    </td>
                  ))}
                  {/* Total Net Margin Calculation - Dynamic */}
                  <td className="py-3 px-4 text-gray-900">
                    {formatCurrencyValue(operationsCosts.reduce((total, cost) => {
                      const vCost = variableCosts.find(vc => vc.crop === cost.crop);
                      const area = vCost ? parseValue(vCost.area, 'ha') : 0;
                      const value = parseValue(cost.netMargin); // Get total numeric value
                      // If perHa, sum the calculated per-ha values; otherwise, sum total values
                      const valueToAdd = (operationsCostUnit === 'perHa' && area > 0) ? value / area : value;
                      return total + valueToAdd;
                    }, 0), operationsCostUnit)}
                  </td>
                  <td className="py-3 px-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Panel */}
      <AddBudgetPanel
        isOpen={isPanelOpen}
        onClose={() => { setIsPanelOpen(false); setEditingBudgetData(null); }}
        onSave={handleSaveBudget}
        mode={panelMode}
        initialData={editingBudgetData}
      />
    </div>
  );
};

export default Budgets;