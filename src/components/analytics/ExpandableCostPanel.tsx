import { useState } from 'react';
import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
import { Year, MetricData } from '../../types/analytics';

interface CostCategory {
  name: string;
  data: { [key in Year]: MetricData };
  subcategories?: CostCategory[];
}

interface CostFilters {
  variable?: boolean;
  operations?: boolean;
}

// Define which categories belong to each main category
const VARIABLE_CATEGORIES = ['seed', 'fertiliser', 'chemicals'];
const OPERATIONS_CATEGORIES = ['cultivating', 'drilling', 'applications', 'harvesting'];

interface ExpandableCostPanelProps {
  title: string;
  categories: CostCategory[];
  selectedYear: Year;
  costFilters: CostFilters;
}

function CostRow({
  category,
  level = 0,
  selectedYear
}: {
  category: CostCategory;
  level?: number;
  selectedYear: Year;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  const currentData = category.data[selectedYear];

  // Market range position (mock data - would come from actual market data)
  const marketMin = currentData.perHectare * 0.7;
  const marketMax = currentData.perHectare * 1.3;
  const position = ((currentData.perHectare - marketMin) / (marketMax - marketMin)) * 100;

  return (
    <>
      <tr className="border-b border-gray-100">
        <td className="py-3">
          <div className="flex items-center" style={{ paddingLeft: `${level * 1.5}rem` }}>
            {hasSubcategories && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mr-2 text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <span className="flex items-center">
              {category.name}
              <div className="relative group ml-2">
                <HelpCircle size={14} className="text-gray-400 cursor-help" />
                <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded p-2 w-48 left-0 mt-1">
                  View costs and market comparison for {category.name.toLowerCase()}
                </div>
              </div>
            </span>
          </div>
        </td>
        <td className="text-right py-3">
          <span>£{currentData.perTonne.toFixed(2)}/t</span>
        </td>
        <td className="text-right py-3">
          <span>£{currentData.perHectare.toFixed(2)}/ha</span>
        </td>
        <td className="py-3 px-4">
          <div className="relative group">
            <div className="w-48 h-2 bg-gray-100 rounded-full relative overflow-hidden mx-auto">
              <div
                className="absolute top-0 h-full bg-gray-600 rounded-full"
                style={{
                  left: '0%',
                  width: '100%',
                  opacity: 0.2
                }}
              />
              <div
                className="absolute top-0 h-full bg-blue-600 rounded-full w-2"
                style={{
                  left: `${position}%`,
                  transform: 'translateX(-50%)'
                }}
              />
            </div>
            <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded p-2 w-48 left-1/2 -translate-x-1/2 mt-1">
              Market range: £{marketMin.toFixed(0)} - £{marketMax.toFixed(0)}/ha
              <br />
              Your cost: £{currentData.perHectare.toFixed(0)}/ha
            </div>
          </div>
        </td>
      </tr>
      {isExpanded && category.subcategories?.map((subcategory) => (
        <CostRow
          key={subcategory.name}
          category={subcategory}
          level={level + 1}
          selectedYear={selectedYear}
        />
      ))}
    </>
  );
}

export default function ExpandableCostPanel({
  title,
  categories,
  selectedYear,
  costFilters
}: ExpandableCostPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter categories based on the panel type (variable or operations)
  const filteredCategories = categories.filter(() => {
    if (title === "Variable Costs") {
      return costFilters.variable ?? true;
    }
    if (title === "Operation Costs") {
      return costFilters.operations ?? true;
    }
    return true;
  });

  // Calculate total costs for visible categories
  const totalCosts = filteredCategories.reduce((acc, category) => {
    const currentData = category.data[selectedYear];
    return {
      perTonne: acc.perTonne + currentData.perTonne,
      perHectare: acc.perHectare + currentData.perHectare
    };
  }, { perTonne: 0, perHectare: 0 });

  return (
    <div className="bg-white rounded-lg shadow">
      <div
        className="p-4 border-b border-gray-200 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold">{title}</h3>
          <div className="text-sm text-gray-500">
            Total: £{totalCosts.perHectare.toFixed(2)}/ha
          </div>
        </div>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </div>
      
      {isExpanded && (
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 font-medium text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>Category</span>
                    <div className="relative group">
                      <HelpCircle size={14} className="text-gray-400 cursor-help" />
                      <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded p-2 w-48 left-0 mt-1">
                        Breakdown of cost categories and their components
                      </div>
                    </div>
                  </div>
                </th>
                <th className="text-right py-3 font-medium text-gray-600">
                  <div className="flex items-center justify-end space-x-2">
                    <span>Cost (£/t)</span>
                    <div className="relative group">
                      <HelpCircle size={14} className="text-gray-400 cursor-help" />
                      <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded p-2 w-48 right-0 mt-1">
                        Cost per tonne, with year-on-year change indicator
                      </div>
                    </div>
                  </div>
                </th>
                <th className="text-right py-3 font-medium text-gray-600">
                  <div className="flex items-center justify-end space-x-2">
                    <span>Cost (£/ha)</span>
                    <div className="relative group">
                      <HelpCircle size={14} className="text-gray-400 cursor-help" />
                      <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded p-2 w-48 right-0 mt-1">
                        Cost per hectare, with year-on-year change indicator
                      </div>
                    </div>
                  </div>
                </th>
                <th className="text-center py-3 font-medium text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <span>Market Range</span>
                    <div className="relative group">
                      <HelpCircle size={14} className="text-gray-400 cursor-help" />
                      <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded p-2 w-48 right-0 mt-1">
                        Your position within the market range for this cost category
                      </div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <CostRow
                  key={category.name}
                  category={{
                    ...category,
                    // Only show chemical subcategories when variable costs are active
                    subcategories: category.name.toLowerCase() === 'chemicals' && !costFilters.variable
                      ? []
                      : category.subcategories
                  }}
                  selectedYear={selectedYear}
                />
              ))}
              <tr className="border-t-2 border-gray-200 font-medium bg-gray-50">
                <td className="py-3">Total {title}</td>
                <td className="text-right py-3">£{totalCosts.perTonne.toFixed(2)}/t</td>
                <td className="text-right py-3">£{totalCosts.perHectare.toFixed(2)}/ha</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}