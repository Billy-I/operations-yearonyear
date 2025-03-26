import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Plus, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { initialData } from '../data';
import { metricsData } from '../data/metricsData';

// Add animation styles
const fadeInAnimation = {
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  '.animate-fadeIn': {
    animation: 'fadeIn 0.3s ease-in-out'
  }
};

// Add the style element to the document
const injectStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(styleEl);
  return () => {
    document.head.removeChild(styleEl);
  };
};

interface AddBudgetPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

interface TabVisitState {
  variable: boolean;
  operations: boolean;
}

const AVAILABLE_CROPS = ['Barley', 'Wheat (Winter)', 'Linseed'];

type TabType = 'variable' | 'operations';
type LoadOptionType = 'operations_3year' | 'yagro' | 'operations' | 'variable';

// Define interface for sub-operations
interface SubOperation {
  id: string;
  name: string;
  cost: string;
}

// Define interface for operation categories with sub-operations
interface OperationCategory {
  name: string;
  expanded: boolean; // Whether the category is expanded to show sub-operations
  subOperations: SubOperation[];
}

// Default sub-operations data for each category
const defaultOperations: Record<string, SubOperation[]> = {
  cultivation: [
    { id: 'plough', name: 'Plough', cost: '' },
    { id: 'rotovating', name: 'Rotovating', cost: '' },
    { id: 'subsoiling', name: 'Sub-soiling/Flat lifting', cost: '' },
    { id: 'discing', name: 'Discing', cost: '' }
  ],
  drilling: [
    { id: 'drilling', name: 'Drilling', cost: '' }
  ],
  application: [
    { id: 'fertiliser', name: 'Fertiliser distribution', cost: '' },
    { id: 'spraying', name: 'Spraying', cost: '' }
  ],
  harvesting: [
    { id: 'combining', name: 'Combining', cost: '' },
    { id: 'baling', name: 'Bale Chasing', cost: '' }
  ],
  other: [
    { id: 'other', name: 'Other', cost: '' }
  ]
};

const AddBudgetPanel: React.FC<AddBudgetPanelProps> = ({ isOpen, onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState<TabType>('variable');
  const [isLoadMenuOpen, setIsLoadMenuOpen] = useState(false);
  const [operationDetailsOpen, setOperationDetailsOpen] = useState(false);
  const [variableDetailsOpen, setVariableDetailsOpen] = useState(true);
  const [tabsVisited, setTabsVisited] = useState<TabVisitState>({ variable: false, operations: false });
  
  // State for operation categories with sub-operations
  const [operationCategories, setOperationCategories] = useState<OperationCategory[]>([
    { name: 'cultivation', expanded: false, subOperations: [...defaultOperations.cultivation] },
    { name: 'drilling', expanded: false, subOperations: [...defaultOperations.drilling] },
    { name: 'application', expanded: false, subOperations: [...defaultOperations.application] },
    { name: 'harvesting', expanded: false, subOperations: [...defaultOperations.harvesting] },
    { name: 'other', expanded: false, subOperations: [...defaultOperations.other] }
  ]);
  
  const [formData, setFormData] = useState({
    crop: AVAILABLE_CROPS[0],
    // Variable costs
    area: '',
    seed: '',
    fertiliser: '',
    chemical: '',
    yield: '',
    price: '',
    // Operation costs
    cultivation: '',
    drilling: '',
    application: '',
    harvesting: '',
    other: ''
  });

  const operationsCostsRef = useRef<HTMLDivElement>(null);
  const variableCostsRef = useRef<HTMLDivElement>(null);
  const loadMenuRef = useRef<HTMLDivElement>(null);
  
  // Inject animation styles
  React.useEffect(() => {
    const cleanup = injectStyles();
    return cleanup;
  }, []);
  
  // Mark tabs as visited when they are selected
  useEffect(() => {
    if (activeTab === 'variable') {
      setTabsVisited(prev => ({ ...prev, variable: true }));
    } else if (activeTab === 'operations') {
      setTabsVisited(prev => ({ ...prev, operations: true }));
    }
  }, [activeTab]);
  
  // Calculate total variable costs value
  const calculateVariableTotal = (): string => {
    const yieldValue = parseFloat(formData.yield) || 0;
    const price = parseFloat(formData.price) || 0;
    
    return (yieldValue * price).toFixed(2);
  };
  
  // Toggle category expansion
  const toggleCategoryExpansion = (categoryName: string) => {
    setOperationCategories(prev =>
      prev.map(category =>
        category.name === categoryName
          ? { ...category, expanded: !category.expanded }
          : category
      )
    );
  };
  
  // Add a new sub-operation to a category
  const addSubOperation = (categoryName: string) => {
    const newId = `new-${Date.now()}`;
    setOperationCategories(prev =>
      prev.map(category =>
        category.name === categoryName
          ? {
              ...category,
              subOperations: [
                ...category.subOperations,
                { id: newId, name: 'New Operation', cost: '' }
              ]
            }
          : category
      )
    );
  };
  
  // Remove a sub-operation from a category
  const removeSubOperation = (categoryName: string, operationId: string) => {
    setOperationCategories(prev =>
      prev.map(category =>
        category.name === categoryName
          ? {
              ...category,
              subOperations: category.subOperations.filter(op => op.id !== operationId)
            }
          : category
      )
    );
    
    // Recalculate the category total
    updateCategoryTotal(categoryName);
  };
  
  // Update a sub-operation
  const updateSubOperation = (categoryName: string, operationId: string, field: 'name' | 'cost', value: string) => {
    setOperationCategories(prev =>
      prev.map(category =>
        category.name === categoryName
          ? {
              ...category,
              subOperations: category.subOperations.map(op =>
                op.id === operationId
                  ? { ...op, [field]: value }
                  : op
              )
            }
          : category
      )
    );
    
    // If cost was updated, recalculate the total for the category
    if (field === 'cost') {
      updateCategoryTotal(categoryName);
    }
  };
  
  // Calculate total cost for a category from its sub-operations
  const updateCategoryTotal = (categoryName: string) => {
    const category = operationCategories.find(cat => cat.name === categoryName);
    if (!category) return;
    
    const total = category.subOperations.reduce((sum, op) => {
      const cost = parseFloat(op.cost) || 0;
      return sum + cost;
    }, 0);
    
    setFormData(prev => ({
      ...prev,
      [categoryName]: total.toString()
    }));
  };
  
  // Calculate all category totals
  const updateAllCategoryTotals = () => {
    operationCategories.forEach(category => {
      updateCategoryTotal(category.name);
    });
  };
  
  // Handle click outside for dropdown menu
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loadMenuRef.current && !loadMenuRef.current.contains(event.target as Node)) {
        setIsLoadMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate total operations costs
  const calculateOperationsTotal = (): string => {
    const cultivation = parseFloat(formData.cultivation) || 0;
    const drilling = parseFloat(formData.drilling) || 0;
    const application = parseFloat(formData.application) || 0;
    const harvesting = parseFloat(formData.harvesting) || 0;
    const other = parseFloat(formData.other) || 0;
    
    return (cultivation + drilling + application + harvesting + other).toFixed(2);
  };

  // Navigate to operations tab
  const goToOperationsTab = () => {
    setActiveTab('operations');
    setTimeout(() => {
      operationsCostsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Navigate to variable costs tab
  const goToVariableTab = () => {
    setActiveTab('variable');
    setTimeout(() => {
      variableCostsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadBaseline = (source: LoadOptionType) => {
    setIsLoadMenuOpen(false); // Close dropdown after selection
    
    // For variable costs tab
    if (source === 'variable') {
      setFormData(prev => ({
        ...prev,
        seed: metricsData.seed['Yearly avg'].perHectare.toString(),
        fertiliser: metricsData.fertiliser['Yearly avg'].perHectare.toString(),
        chemical: metricsData.chemicals['Yearly avg'].perHectare.toString()
      }));
      return;
    }
    
    // Switch to operations tab for operations-related data
    setActiveTab('operations');
    setTimeout(() => {
      operationsCostsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    // Create a new copy of operation categories with populated costs based on the source
    let newOperationCategories: OperationCategory[] = [...operationCategories];
    
    // Update sub-operations based on source
    if (source === 'yagro') {
      // Yagro baseline
      const yagroValues = {
        'cultivation': '290.61',
        'drilling': '233.61',
        'application': '350.07',
        'harvesting': '430.99',
        'other': '223.71'
      };
      
      // Distribute values among sub-operations
      newOperationCategories = distributeValuesToSubOperations(yagroValues);
    }
    else if (source === 'operations_3year') {
      // 3-year average
      const threeYearValues = {
        'cultivation': metricsData.cultivating['Yearly avg'].perHectare.toString(),
        'drilling': metricsData.drilling['Yearly avg'].perHectare.toString(),
        'application': metricsData.applications['Yearly avg'].perHectare.toString(),
        'harvesting': metricsData.harvesting['Yearly avg'].perHectare.toString(),
        'other': metricsData.other['Yearly avg'].perHectare.toString()
      };
      
      // Distribute values among sub-operations
      newOperationCategories = distributeValuesToSubOperations(threeYearValues);
    }
    else {
      // Operations center custom baseline (past years)
      const operationsData = initialData;
      const crop = formData.crop;
      
      // Get values from operations data for the selected crop
      const customValues = {
        'cultivation': operationsData.cultivation?.cropData?.[crop]?.costPerHa?.toString() || '0',
        'drilling': operationsData.drilling?.cropData?.[crop]?.costPerHa?.toString() || '0',
        'application': operationsData.application?.cropData?.[crop]?.costPerHa?.toString() || '0',
        'harvesting': operationsData.harvesting?.cropData?.[crop]?.costPerHa?.toString() || '0',
        'other': operationsData.other?.cropData?.[crop]?.costPerHa?.toString() || '0'
      };
      
      // Distribute values among sub-operations
      newOperationCategories = distributeValuesToSubOperations(customValues);
    }
    
    // Update state with new operation categories
    setOperationCategories(newOperationCategories);
    
    // Update formData with totals
    const updatedFormData = { ...formData };
    newOperationCategories.forEach(category => {
      const total = category.subOperations.reduce((sum, op) => {
        return sum + (parseFloat(op.cost) || 0);
      }, 0);
      
      // Use type-safe approach for updating formData
      if (category.name === 'cultivation') {
        updatedFormData.cultivation = total.toString();
      } else if (category.name === 'drilling') {
        updatedFormData.drilling = total.toString();
      } else if (category.name === 'application') {
        updatedFormData.application = total.toString();
      } else if (category.name === 'harvesting') {
        updatedFormData.harvesting = total.toString();
      } else if (category.name === 'other') {
        updatedFormData.other = total.toString();
      }
    });
    
    setFormData(updatedFormData);
  };

  // Helper function to distribute total values among sub-operations
  const distributeValuesToSubOperations = (totalValues: Record<string, string>) => {
    return operationCategories.map(category => {
      const totalValue = parseFloat(totalValues[category.name]) || 0;
      const subOpCount = category.subOperations.length;
      
      if (subOpCount === 0) {
        return category;
      }
      
      // If there's only one sub-operation, give it the total value
      if (subOpCount === 1) {
        return {
          ...category,
          subOperations: [{ ...category.subOperations[0], cost: totalValue.toString() }]
        };
      }
      
      // Otherwise, distribute the total value proportionally
      // For demonstration, we're distributing evenly, but this could be more sophisticated
      const valuePerOp = (totalValue / subOpCount).toFixed(2);
      
      return {
        ...category,
        subOperations: category.subOperations.map(op => ({
          ...op,
          cost: valuePerOp
        }))
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit both variable and operation costs
    const variableCosts = {
      type: 'variable',
      crop: formData.crop,
      area: formData.area || '0',
      seed: formData.seed || '0',
      fertiliser: formData.fertiliser || '0',
      chemical: formData.chemical || '0',
      yield: formData.yield || '0',
      price: formData.price || '0'
    };

    const operationCosts = {
      type: 'operations',
      crop: formData.crop,
      cultivation: formData.cultivation || '0',
      drilling: formData.drilling || '0',
      application: formData.application || '0',
      harvesting: formData.harvesting || '0',
      other: formData.other || '0'
    };

    // Submit both sets of data
    onAdd(variableCosts);
    onAdd(operationCosts);

    // Reset form
    setFormData({
      crop: AVAILABLE_CROPS[0],
      area: '',
      seed: '',
      fertiliser: '',
      chemical: '',
      yield: '',
      price: '',
      cultivation: '',
      drilling: '',
      application: '',
      harvesting: '',
      other: ''
    });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
      <div className="h-full flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-gray-900">Add Budget</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  {AVAILABLE_CROPS.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              {/* Tabbed interface */}
              <div className="border-t border-gray-200 pt-4">
                <div className="mb-4">
                  <div className="inline-flex w-full rounded-lg">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 text-sm font-medium border rounded-lg ${
                        activeTab === 'variable'
                          ? 'text-blue-700 bg-blue-50 border-blue-300'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => setActiveTab('variable')}
                    >
                      Variable Costs
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 text-sm font-medium border rounded-lg ml-2 ${
                        activeTab === 'operations'
                          ? 'text-blue-700 bg-blue-50 border-blue-300'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => setActiveTab('operations')}
                    >
                      Operation Costs
                    </button>
                  </div>
                </div>

                {/* Variable Costs Tab */}
                {activeTab === 'variable' && (
                  <div ref={variableCostsRef}>
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => loadBaseline('variable')}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Load 3-Year Average Values
                      </button>
                    </div>
                    
                    {/* Variable Costs Summary */}
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Variable Costs Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Seed</span>
                          <span className="font-medium">£{formData.seed || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fertiliser</span>
                          <span className="font-medium">£{formData.fertiliser || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Chemical</span>
                          <span className="font-medium">£{formData.chemical || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Yield</span>
                          <span className="font-medium">{formData.yield || '0.00'} t/ha</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price</span>
                          <span className="font-medium">£{formData.price || '0.00'}/t</span>
                        </div>
                        <div className="border-t border-gray-200 pt-1 mt-1">
                          <div className="flex justify-between font-medium">
                            <span>Total Value</span>
                            <span>£{calculateVariableTotal()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
          
                    {/* Details section toggle */}
                    <button
                      type="button"
                      onClick={() => setVariableDetailsOpen(!variableDetailsOpen)}
                      className="w-full px-3 py-2 mb-4 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex justify-between items-center"
                    >
                      <span>{variableDetailsOpen ? 'Hide Details' : 'Edit Details'}</span>
                      <ChevronDown size={16} className={`transform ${variableDetailsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Variable costs detail inputs */}
                    {variableDetailsOpen && (
                      <div className="space-y-4 animate-fadeIn">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Area (ha)</label>
                          <input
                            type="number"
                            name="area"
                            value={formData.area}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Seed (£/ha)</label>
                          <input
                            type="number"
                            name="seed"
                            value={formData.seed}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fertiliser (£/ha)</label>
                          <input
                            type="number"
                            name="fertiliser"
                            value={formData.fertiliser}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Chemical (£/ha)</label>
                          <input
                            type="number"
                            name="chemical"
                            value={formData.chemical}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Yield (t/ha)</label>
                          <input
                            type="number"
                            name="yield"
                            value={formData.yield}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (£/t)</label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                      </div>
                    )}

                    {/* Navigation button to Operations tab */}
                    <button
                      type="button"
                      onClick={goToOperationsTab}
                      className="mt-4 w-full flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      <span className="mr-2">Continue to Operations</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* Operation Costs Tab */}
                {activeTab === 'operations' && (
                  <div ref={operationsCostsRef}>
                    {/* Load options dropdown */}
                    <div className="mb-4 relative" ref={loadMenuRef}>
                      <button
                        type="button"
                        onClick={() => setIsLoadMenuOpen(!isLoadMenuOpen)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex justify-between items-center"
                      >
                        <span>Load Data</span>
                        <ChevronDown size={16} />
                      </button>
                      
                      {isLoadMenuOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            type="button"
                            onClick={() => loadBaseline('operations_3year')}
                            className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                          >
                            Load 3-Year Average
                          </button>
                          <button
                            type="button"
                            onClick={() => loadBaseline('yagro')}
                            className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                          >
                            Load Yagro Baseline
                          </button>
                          <button
                            type="button"
                            onClick={() => loadBaseline('operations')}
                            className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                          >
                            Load Past Years Custom Baseline
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Operations Summary */}
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Operations Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cultivation</span>
                          <span className="font-medium">£{formData.cultivation || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Drilling</span>
                          <span className="font-medium">£{formData.drilling || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Application</span>
                          <span className="font-medium">£{formData.application || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Harvesting</span>
                          <span className="font-medium">£{formData.harvesting || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Other</span>
                          <span className="font-medium">£{formData.other || '0.00'}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-1 mt-1">
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>£{calculateOperationsTotal()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details section toggle */}
                    <button
                      type="button"
                      onClick={() => setOperationDetailsOpen(!operationDetailsOpen)}
                      className="w-full px-3 py-2 mb-4 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex justify-between items-center"
                    >
                      <span>{operationDetailsOpen ? 'Hide Details' : 'Edit Details'}</span>
                      <ChevronDown size={16} className={`transform ${operationDetailsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Operation costs detail inputs */}
                    {operationDetailsOpen && (
                      <div className="space-y-4 animate-fadeIn">
                        {operationCategories.map(category => (
                          <div key={category.name} className="space-y-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{category.name}</label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={formData[category.name as keyof typeof formData]}
                                  onChange={(e) => {
                                    setFormData(prev => ({
                                      ...prev,
                                      [category.name]: e.target.value
                                    }));
                                  }}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                  placeholder="0.00"
                                />
                                <button
                                  type="button"
                                  onClick={() => toggleCategoryExpansion(category.name)}
                                  className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                >
                                  <ChevronRight size={16} className={`transform transition-transform ${category.expanded ? 'rotate-90' : ''}`} />
                                </button>
                              </div>
                            </div>
                            {category.expanded && (
                              <div className="pl-4 space-y-2 border-l-2 border-gray-100">
                                {category.subOperations.map(operation => (
                                  <div key={operation.id} className="flex gap-2 items-center">
                                    <input
                                      type="text"
                                      value={operation.name}
                                      onChange={(e) => updateSubOperation(category.name, operation.id, 'name', e.target.value)}
                                      className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                      placeholder="Operation name"
                                    />
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden" style={{ width: "120px" }}>
                                      <span className="px-2 bg-gray-50 text-gray-600">£</span>
                                      <input
                                        type="number"
                                        value={operation.cost}
                                        onChange={(e) => updateSubOperation(category.name, operation.id, 'cost', e.target.value)}
                                        className="w-full py-2 px-2 text-sm border-0"
                                        placeholder="0.00"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeSubOperation(category.name, operation.id)}
                                      className="text-red-500 hover:text-red-700 px-2"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addSubOperation(category.name)}
                                  className="w-full flex items-center justify-center px-3 py-2 text-sm border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400"
                                >
                                  <Plus size={14} className="mr-1" />
                                  <span>Add {category.name} operation</span>
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Navigation button back to Variable Costs tab */}
                    <button
                      type="button"
                      onClick={goToVariableTab}
                      className="mt-4 w-full flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      <ArrowLeft size={16} />
                      <span className="ml-2">Back to Variable Costs</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Add Budget
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetPanel;