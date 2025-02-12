import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { metricsData } from '../data/metricsData';
import { Operation } from '../types';
import OperationRow from '../components/OperationRow';
import { Plus } from 'lucide-react';
import AddOperationPanel from '../components/AddOperationPanel';
import { initialData } from '../data';
import { Budget, budgetService } from '../services/budgetService';

const AddBudget: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const budgetNameToEdit = searchParams.get('budget');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const loadBudget = async () => {
      if (budgetNameToEdit) {
        try {
          const budget = await budgetService.getBudgetByName(budgetNameToEdit);
          setBudgetDetails({
            name: budget.name,
            crop: budget.crop,
            area: budget.area,
            yield: budget.yield,
            price: budget.price
          });
          setVariableCosts(budget.variableCosts);
          setOperations(budget.operations);
          setIsEditMode(true);
        } catch (error) {
          console.error('Error loading budget:', error);
          alert('Budget not found');
          navigate('/tracker/budgets-alt');
          return;
        }
      }
    };

    loadBudget();
  }, [budgetNameToEdit, navigate]);

  const [budgetDetails, setBudgetDetails] = useState({
    name: '',
    crop: '',
    area: '',
    yield: '',
    price: ''
  });

  const [grossMargin, setGrossMargin] = useState('');

  const [showStatusModal, setShowStatusModal] = useState(false);

  const [variableCosts, setVariableCosts] = useState({
    seed: '',
    fertiliser: '',
    chemical: ''
  });

  // Initialize operations with the complete structure from initialData
  const [operations, setOperations] = useState<{ [key: string]: Operation }>({
    cultivation: initialData.cultivation,
    drilling: initialData.drilling,
    application: initialData.application,
    harvesting: initialData.harvesting,
    other: initialData.other
  });

  useEffect(() => {
    calculateGrossMargin();
  }, [budgetDetails.yield, budgetDetails.price, variableCosts, operations]);

  const calculateGrossMargin = () => {
    if (!budgetDetails.yield || !budgetDetails.price) {
      setGrossMargin('');
      return;
    }

    // Calculate total revenue per hectare
    const revenue = parseFloat(budgetDetails.yield) * parseFloat(budgetDetails.price);

    // Calculate total variable costs per hectare
    const totalVariableCosts = Object.values(variableCosts).reduce((sum, cost) => {
      return sum + (cost ? parseFloat(cost) : 0);
    }, 0);

    // Calculate total operational costs per hectare
    const totalOperationalCosts = Object.values(operations).reduce((sum, operation) => {
      return sum + (operation.costPerHa || 0);
    }, 0);

    // Calculate gross margin per hectare
    const grossMarginPerHa = revenue - totalVariableCosts - totalOperationalCosts;
    setGrossMargin(grossMarginPerHa.toFixed(2));
  };

  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [addOperationPanel, setAddOperationPanel] = useState<{
    isOpen: boolean;
    category: string;
  }>({
    isOpen: false,
    category: 'cultivation'
  });

  const loadThreeYearAverage = () => {
    setVariableCosts({
      seed: metricsData.seed['Yearly avg'].perHectare.toString(),
      fertiliser: metricsData.fertiliser['Yearly avg'].perHectare.toString(),
      chemical: metricsData.chemicals['Yearly avg'].perHectare.toString()
    });
  };

  const validateBudget = () => {
    if (!budgetDetails.name || !budgetDetails.crop || !budgetDetails.area || !budgetDetails.yield || !budgetDetails.price) {
      alert('Please fill in all budget details');
      return false;
    }
    return true;
  };

  const handleAddBudget = () => {
    if (validateBudget()) {
      if (isEditMode) {
        // When editing, keep the existing status
        handleStatusSelection(undefined);
      } else {
        setShowStatusModal(true);
      }
    }
  };

  const handleStatusSelection = async (status?: 'draft' | 'active') => {
    try {
      const currentStatus = isEditMode
        ? (await budgetService.getBudgetByName(budgetDetails.name)).status
        : status!;

      const budget: Budget = {
        ...budgetDetails,
        status: currentStatus,
        variableCosts,
        operations,
        grossMargin
      };
      
      await budgetService.addBudget(budget);
      setShowStatusModal(false);
      navigate('/tracker/budgets-alt');
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
    }
  };

  const handleBudgetDetailsChange = (field: keyof typeof budgetDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBudgetDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleVariableCostChange = (field: keyof typeof variableCosts) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariableCosts(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const updateMainCategoryCost = (category: string, newCost: number) => {
    setOperations(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        costPerHa: newCost,
        totalCost: newCost * initialData.totalHectares,
        cropData: {
          ...prev[category].cropData,
          'All crops': {
            hectares: initialData.totalHectares,
            costPerHa: newCost,
            totalCost: newCost * initialData.totalHectares
          }
        }
      }
    }));
  };

  const handleAddOperation = (category: string, newOperation: Omit<Operation, 'totalCost'>) => {
    setOperations(prev => {
      const operation = prev[category];
      const totalCost = newOperation.costPerHa * initialData.totalHectares;
      
      const fullOperation: Operation = {
        ...newOperation,
        totalCost,
        cropData: {
          'All crops': { 
            hectares: initialData.totalHectares, 
            costPerHa: newOperation.costPerHa, 
            totalCost 
          }
        }
      };

      const newSubOperations = [...(operation.subOperations || []), fullOperation];
      const avgCost = newSubOperations.reduce((sum, op) => sum + op.costPerHa, 0);
      const totalCategoryCost = avgCost * initialData.totalHectares;

      return {
        ...prev,
        [category]: {
          ...operation,
          costPerHa: avgCost,
          totalCost: totalCategoryCost,
          subOperations: newSubOperations,
          cropData: {
            ...operation.cropData,
            'All crops': {
              hectares: initialData.totalHectares,
              costPerHa: avgCost,
              totalCost: totalCategoryCost
            }
          }
        }
      };
    });
  };

  const handleSubOperationCostUpdate = (category: string, subIndex: number, newCost: number) => {
    setOperations(prev => {
      const operation = prev[category];
      if (!operation.subOperations) return prev;

      const newSubOperations = operation.subOperations.map((subOp, i) =>
        i === subIndex
          ? { 
              ...subOp, 
              costPerHa: newCost, 
              totalCost: newCost * initialData.totalHectares,
              cropData: {
                ...subOp.cropData,
                'All crops': { 
                  hectares: initialData.totalHectares, 
                  costPerHa: newCost, 
                  totalCost: newCost * initialData.totalHectares 
                }
              }
            }
          : subOp
      );

      const avgCost = newSubOperations.reduce((sum, op) => sum + op.costPerHa, 0);
      const totalCost = avgCost * initialData.totalHectares;

      return {
        ...prev,
        [category]: {
          ...operation,
          costPerHa: avgCost,
          totalCost: totalCost,
          subOperations: newSubOperations,
          cropData: {
            ...operation.cropData,
            'All crops': {
              hectares: initialData.totalHectares,
              costPerHa: avgCost,
              totalCost: totalCost
            }
          }
        }
      };
    });
  };

  const handleDeleteSubOperation = (category: string, index: number) => {
    setOperations(prev => {
      const operation = prev[category];
      if (!operation.subOperations) return prev;

      const newSubOperations = operation.subOperations.filter((_, i) => i !== index);
      const avgCost = newSubOperations.length > 0
        ? newSubOperations.reduce((sum, op) => sum + op.costPerHa, 0)
        : 0;
      const totalCost = avgCost * initialData.totalHectares;

      return {
        ...prev,
        [category]: {
          ...operation,
          costPerHa: avgCost,
          totalCost: totalCost,
          subOperations: newSubOperations,
          cropData: {
            ...operation.cropData,
            'All crops': {
              hectares: initialData.totalHectares,
              costPerHa: avgCost,
              totalCost: totalCost
            }
          }
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">{isEditMode ? 'Edit Budget' : 'Add Budget'}</h1>
            <Link
              to="/tracker/budgets-alt"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
          <div className="mt-6">
            <div className="space-y-6">
              {/* Budget Details */}
              <div className="bg-white overflow-hidden border border-gray-200 rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Budget Details</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <label htmlFor="budgetName" className="block text-sm font-medium text-gray-700">
                        Budget Name
                      </label>
                      <input
                        type="text"
                        id="budgetName"
                        value={budgetDetails.name}
                        onChange={handleBudgetDetailsChange('name')}
                        readOnly={isEditMode}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="crop" className="block text-sm font-medium text-gray-700">
                        Crop
                      </label>
                      <select
                        id="crop"
                        value={budgetDetails.crop}
                        onChange={handleBudgetDetailsChange('crop')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select a crop</option>
                        <option value="wheat">Wheat</option>
                        <option value="barley">Barley</option>
                        <option value="oilseed_rape">Oilseed Rape</option>
                        <option value="beans">Beans</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                        Area (ha)
                      </label>
                      <input
                        type="number"
                        id="area"
                        value={budgetDetails.area}
                        onChange={handleBudgetDetailsChange('area')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="yield" className="block text-sm font-medium text-gray-700">
                        Yield (t/ha)
                      </label>
                      <input
                        type="number"
                        id="yield"
                        value={budgetDetails.yield}
                        onChange={handleBudgetDetailsChange('yield')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price (£/t)
                      </label>
                      <input
                        type="number"
                        id="price"
                        value={budgetDetails.price}
                        onChange={handleBudgetDetailsChange('price')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Gross Margin (£/ha)
                      </label>
                      <div className="mt-1 block w-full py-2 px-3 text-gray-700">
                        {grossMargin ? `£${grossMargin}` : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Variable Costs Table */}
              <div className="bg-white overflow-hidden border border-gray-200 rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Variable Costs</h3>
                  <button
                    type="button"
                    onClick={loadThreeYearAverage}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Load 3-Year Average Values
                  </button>
                </div>
                <div className="border-t border-gray-200">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value (£/ha)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Seed</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="number"
                            value={variableCosts.seed}
                            onChange={handleVariableCostChange('seed')}
                            className="border border-gray-300 rounded-md p-1"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Fertiliser</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="number"
                            value={variableCosts.fertiliser}
                            onChange={handleVariableCostChange('fertiliser')}
                            className="border border-gray-300 rounded-md p-1"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Chemical</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="number"
                            value={variableCosts.chemical}
                            onChange={handleVariableCostChange('chemical')}
                            className="border border-gray-300 rounded-md p-1"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Operations Table */}
              <div className="bg-white overflow-hidden border border-gray-200 rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Operation Costs</h3>
                </div>
                <div className="border-t border-gray-200">
                  <div className="flex items-center px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">
                    <div className="flex-1">Operation Category</div>
                    <div className="w-48 text-right pr-12">Cost/ha</div>
                    <div className="w-48 text-right pr-12">Total Cost</div>
                    <div className="w-10"></div>
                  </div>
                  <div>
                    {Object.entries(operations).map(([category, operation]) => (
                      <div key={category}>
                        <OperationRow
                          operation={operation}
                          isExpandable={true}
                          isExpanded={expandedSections.includes(category)}
                          onToggle={() => toggleSection(category)}
                          onUpdateCost={(newCost) => updateMainCategoryCost(category, newCost)}
                        />
                        {expandedSections.includes(category) && (
                          <>
                            {operation.subOperations?.map((subOp, index) => (
                              <div key={index} className="pl-8">
                                <OperationRow
                                  operation={subOp}
                                  isSubOperation={true}
                                  onDelete={() => handleDeleteSubOperation(category, index)}
                                  onUpdateCost={(newCost) => handleSubOperationCostUpdate(category, index, newCost)}
                                />
                              </div>
                            ))}
                            <div className="bg-gray-50 pl-8 pr-4 py-2 border-b border-gray-200">
                              <button
                                onClick={() => setAddOperationPanel({ isOpen: true, category })}
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <Plus size={16} className="mr-1" />
                                Add operation
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddBudget}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isEditMode ? 'Update Budget' : 'Add Budget'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Selection Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Budget Status</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleStatusSelection('draft')}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleStatusSelection('active')}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save as Active
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {Object.entries(operations).map(([category, operation]) => (
        <AddOperationPanel
          key={category}
          isOpen={addOperationPanel.isOpen && addOperationPanel.category === category}
          onClose={() => setAddOperationPanel({ isOpen: false, category: 'cultivation' })}
          onAdd={(newOperation) => handleAddOperation(category, newOperation)}
          categoryName={operation.name}
          existingOperations={operation.subOperations?.map(op => op.name) || []}
        />
      ))}
    </div>
  );
};

export default AddBudget;