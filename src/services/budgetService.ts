import { Operation } from '../types';

export interface Budget {
  name: string;
  crop: string;
  area: string;
  yield: string;
  price: string;
  grossMargin: string;
  status: 'draft' | 'active';
  year: string;
  variableCosts: {
    seed: string;
    fertiliser: string;
    chemical: string;
  };
  operations: { [key: string]: Operation };
}

const STORAGE_KEY = 'budgets';

const formatCurrency = (value: number): string => {
  return `£${value.toFixed(2)} /ha`;
};

const getBudgetsFromStorage = (): Budget[] => {
  const storedBudgets = localStorage.getItem(STORAGE_KEY);
  return storedBudgets ? JSON.parse(storedBudgets) : [];
};

const saveBudgetsToStorage = (budgets: Budget[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
};

export const budgetService = {
  clearStorage: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  addBudget: async (budget: Budget) => {
    try {
      // Ensure year exists
      const budgetWithYear = {
        ...budget,
        year: budget.year || new Date().getFullYear().toString()
      };

      // Only validate for new budgets (not during edit)
      const existingBudgets = await budgetService.getBudgets();
      const existingBudget = existingBudgets.find((b: Budget) => b.name === budget.name);
      if (!existingBudget) {
        await budgetService.validateBudget(budgetWithYear.name, budgetWithYear.year);
      }

      const budgets = getBudgetsFromStorage();
      
      // Format the values before saving
      const formattedBudget: Budget = {
        ...budgetWithYear,
        yield: `${budgetWithYear.yield} t/ha`,
        price: `£${budgetWithYear.price} /t`,
        area: `${budgetWithYear.area} ha`,
        grossMargin: formatCurrency(parseFloat(budgetWithYear.grossMargin))
      };
      
      // Remove existing budget if it exists
      const filteredBudgets = budgets.filter(b => b.name !== budgetWithYear.name);
      filteredBudgets.push(formattedBudget);
      saveBudgetsToStorage(filteredBudgets);
      return Promise.resolve(formattedBudget);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getBudgets: () => {
    return Promise.resolve(getBudgetsFromStorage());
  },

  getActiveBudgets: () => {
    const budgets = getBudgetsFromStorage();
    return Promise.resolve(budgets.filter(budget => budget.status === 'active'));
  },

  getDraftBudgets: () => {
    const budgets = getBudgetsFromStorage();
    return Promise.resolve(budgets.filter(budget => budget.status === 'draft'));
  },

  toggleStatus: async (budgetName: string) => {
    const budgets = getBudgetsFromStorage();
    const budgetToToggle = budgets.find(b => b.name === budgetName);
    
    if (!budgetToToggle) {
      return Promise.reject(new Error('Budget not found'));
    }

    // Create a new array without the budget we want to toggle
    const filteredBudgets = budgets.filter(b => b.name !== budgetName);
    
    // Add the budget back with toggled status
    const newStatus: 'draft' | 'active' = budgetToToggle.status === 'active' ? 'draft' : 'active';
    const toggledBudget: Budget = {
      ...budgetToToggle,
      status: newStatus
    };
    
    filteredBudgets.push(toggledBudget);
    saveBudgetsToStorage(filteredBudgets);
    return Promise.resolve(toggledBudget);
  },

  validateBudget: async (name: string, year: string) => {
    const budgets = getBudgetsFromStorage();
    const exists = budgets.some(b => b.name === name && b.year === year);
    if (exists) {
      throw new Error(`A budget with name "${name}" already exists for year ${year}`);
    }
    return Promise.resolve(true);
  },

  getBudgetByName: async (budgetName: string) => {
    const budgets = getBudgetsFromStorage();
    const budget = budgets.find(b => b.name === budgetName);
    
    if (budget) {
      // Remove units from stored values for editing and ensure year exists
      return Promise.resolve({
        ...budget,
        yield: budget.yield ? budget.yield.split(' ')[0] : '',
        price: budget.price ? budget.price.replace(/[£\s\/t]/g, '') : '',
        area: budget.area ? budget.area.split(' ')[0] : '',
        grossMargin: budget.grossMargin ? budget.grossMargin.replace(/[£\s\/ha]/g, '') : '',
        year: budget.year || new Date().getFullYear().toString()
      });
    }
    
    return Promise.reject(new Error('Budget not found'));
  }
};