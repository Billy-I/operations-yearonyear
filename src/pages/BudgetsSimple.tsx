import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSort, FaTrash, FaPencilAlt, FaExchangeAlt } from 'react-icons/fa';
import { Budget, budgetService } from '../services/budgetService';
import Modal from '../components/Modal';

interface BudgetWithCalculations extends Budget {
  calculatedYield?: string;
  calculatedPrice?: string;
  calculatedGM?: string;
}

export const BudgetsSimple: React.FC = () => {
  const navigate = useNavigate();
  const [activeBudgets, setActiveBudgets] = useState<BudgetWithCalculations[]>([]);
  const [draftBudgets, setDraftBudgets] = useState<BudgetWithCalculations[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [summaryData, setSummaryData] = useState({
    totalArea: '0 ha',
    variableCost: '£0',
    operationalCost: '£0',
    totalSales: '£0',
    budgetedGrossMargin: '£0'
  });

  const calculateBudgetValues = (budget: Budget): BudgetWithCalculations => {
    // Default values based on crop type
    const defaultValues = {
      wheat: { yield: 9, price: 260 },
      barley: { yield: 8, price: 220 },
      oilseed_rape: { yield: 4, price: 400 },
      beans: { yield: 5, price: 280 }
    };

    const cropDefaults = defaultValues[budget.crop as keyof typeof defaultValues] || { yield: 0, price: 0 };

    // Calculate total variable costs per hectare
    const variableCosts = Object.values(budget.variableCosts).reduce((sum, cost) => {
      return sum + (parseFloat(cost) || 0);
    }, 0);

    // Calculate total operational costs per hectare
    const operationalCosts = Object.values(budget.operations).reduce((sum, operation) => {
      return sum + (operation.costPerHa || 0);
    }, 0);

    // Calculate gross margin
    const revenue = cropDefaults.yield * cropDefaults.price;
    const grossMargin = revenue - variableCosts - operationalCosts;

    return {
      ...budget,
      calculatedYield: `${cropDefaults.yield.toFixed(2)} t/ha`,
      calculatedPrice: `£${cropDefaults.price.toFixed(2)} /t`,
      calculatedGM: `£${grossMargin.toFixed(2)} /ha`
    };
  };

  const loadBudgets = async () => {
    try {
      const [active, draft] = await Promise.all([
        budgetService.getActiveBudgets(),
        budgetService.getDraftBudgets()
      ]);

      // Calculate values for each budget
      const activeWithCalculations = active.map(calculateBudgetValues);
      const draftWithCalculations = draft.map(calculateBudgetValues);

      setActiveBudgets(activeWithCalculations);
      setDraftBudgets(draftWithCalculations);
      calculateSummary(activeWithCalculations);
    } catch (error) {
      console.error('Error loading budgets:', error);
    }
  };

  useEffect(() => {
    // Only clear storage if it's the first time loading
    const isFirstLoad = !localStorage.getItem('initialized');
    if (isFirstLoad) {
      budgetService.clearStorage();
      localStorage.setItem('initialized', 'true');
    }
    loadBudgets();
  }, []);

  const handleToggleClick = (budget: Budget) => {
    setSelectedBudget(budget);
    setShowStatusModal(true);
  };

  const handleToggleConfirm = async () => {
    if (!selectedBudget) return;
    
    try {
      await budgetService.toggleStatus(selectedBudget.name);
      loadBudgets(); // Reload the budgets after toggle
    } catch (error) {
      console.error('Error toggling budget status:', error);
    }
  };

  const calculateSummary = (budgets: BudgetWithCalculations[]) => {
    const summary = budgets.reduce((acc, budget) => {
      const area = parseFloat(budget.area);
      const yieldValue = parseFloat(budget.calculatedYield || '0');
      const price = parseFloat(budget.calculatedPrice?.replace('£', '') || '0');
      const grossMargin = parseFloat(budget.calculatedGM?.replace('£', '') || '0');

      // Calculate total variable costs for this budget
      const variableCosts = Object.values(budget.variableCosts).reduce((sum, cost) => {
        return sum + (parseFloat(cost) || 0);
      }, 0);

      // Calculate total operational costs for this budget
      const operationalCosts = Object.values(budget.operations).reduce((sum, operation) => {
        return sum + (operation.costPerHa || 0);
      }, 0);

      return {
        totalArea: acc.totalArea + area,
        variableCost: acc.variableCost + (variableCosts * area),
        operationalCost: acc.operationalCost + (operationalCosts * area),
        totalSales: acc.totalSales + (yieldValue * price * area),
        budgetedGrossMargin: acc.budgetedGrossMargin + (grossMargin * area)
      };
    }, {
      totalArea: 0,
      variableCost: 0,
      operationalCost: 0,
      totalSales: 0,
      budgetedGrossMargin: 0
    });

    setSummaryData({
      totalArea: `${summary.totalArea.toFixed(2)} ha`,
      variableCost: `£${summary.variableCost.toFixed(2)}`,
      operationalCost: `£${summary.operationalCost.toFixed(2)}`,
      totalSales: `£${summary.totalSales.toFixed(2)}`,
      budgetedGrossMargin: `£${summary.budgetedGrossMargin.toFixed(2)}`
    });
  };

  const renderBudgetTable = (budgets: BudgetWithCalculations[], title: string) => (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-gray-900">{title}</h2>
        {title === 'Active Budgets' && (
          <button 
            onClick={() => navigate('/tracker/budgets-simple/add')}
            className="text-green-600 hover:text-green-700"
          >
            Add budgets +
          </button>
        )}
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Budget Name
                <FaSort className="inline ml-1" />
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Year
                <FaSort className="inline ml-1" />
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Crop
                <FaSort className="inline ml-1" />
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Area
                <FaSort className="inline ml-1" />
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Yield
                <FaSort className="inline ml-1" />
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Price
                <FaSort className="inline ml-1" />
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                GM
                <FaSort className="inline ml-1" />
              </th>
              <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget, index) => (
              <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{budget.name}</td>
                <td className="py-3 px-4 text-gray-600">{budget.year}</td>
                <td className="py-3 px-4 text-gray-600">{budget.crop}</td>
                <td className="py-3 px-4 text-gray-600">{budget.area}</td>
                <td className="py-3 px-4 text-gray-600">{budget.calculatedYield}</td>
                <td className="py-3 px-4 text-gray-600">{budget.calculatedPrice}</td>
                <td className="py-3 px-4 text-gray-600">{budget.calculatedGM}</td>
                <td className="py-3 px-4 text-center">
                  <button 
                    className="text-gray-600 hover:text-gray-900 mx-1"
                    title="Toggle Status"
                    onClick={() => handleToggleClick(budget)}
                  >
                    <FaExchangeAlt />
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-900 mx-1"
                    onClick={() => navigate(`/tracker/budgets-simple/add?budget=${budget.name}`)}
                    title="Edit Budget"
                  >
                    <FaPencilAlt />
                  </button>
                  <button className="text-gray-600 hover:text-red-600 mx-1">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Budgets Simple</h1>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">2025</span>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600">Total Area</div>
          <div className="mt-1 text-lg font-medium text-gray-900">{summaryData.totalArea}</div>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600">Variable Cost</div>
          <div className="mt-1 text-lg font-medium text-gray-900">{summaryData.variableCost}</div>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600">Operational Cost</div>
          <div className="mt-1 text-lg font-medium text-gray-900">{summaryData.operationalCost}</div>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600">Total Sales</div>
          <div className="mt-1 text-lg font-medium text-gray-900">{summaryData.totalSales}</div>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600">Budgeted Gross Margin</div>
          <div className="mt-1 text-lg font-medium text-gray-900">{summaryData.budgetedGrossMargin}</div>
        </div>
      </div>

      {renderBudgetTable(activeBudgets, 'Active Budgets')}
      {renderBudgetTable(draftBudgets, 'Draft Budgets')}

      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleToggleConfirm}
        title="Change Budget Status"
        confirmText="Change Status"
        confirmButtonClass="bg-blue-500 hover:bg-blue-600"
      >
        <p>
          Are you sure you want to change "{selectedBudget?.name}" to{' '}
          {selectedBudget?.status === 'active' ? 'draft' : 'active'} status?
        </p>
      </Modal>
    </div>
  );
};

export default BudgetsSimple;