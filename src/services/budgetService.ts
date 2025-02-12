import { Operation } from '../types';

export interface Budget {
  name: string;
  crop: string;
  area: string;
  yield: string;
  price: string;
  grossMargin: string;
  status: 'draft' | 'active';
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
  addBudget: (budget: Budget) => {
    const budgets = getBudgetsFromStorage();
    
    // Format the values before saving
    const formattedBudget = {
      ...budget,
      yield: `${budget.yield} t/ha`,
      price: `£${budget.price} /t`,
      area: `${budget.area} ha`,
      grossMargin: formatCurrency(parseFloat(budget.grossMargin))
    };
    
    budgets.push(formattedBudget);
    saveBudgetsToStorage(budgets);
    return Promise.resolve(formattedBudget);
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
    const budgetIndex = budgets.findIndex(b => b.name === budgetName);
    
    if (budgetIndex !== -1) {
      budgets[budgetIndex].status = budgets[budgetIndex].status === 'active' ? 'draft' : 'active';
      saveBudgetsToStorage(budgets);
      return Promise.resolve(budgets[budgetIndex]);
    }
    
    return Promise.reject(new Error('Budget not found'));
  },

  getBudgetByName: async (budgetName: string) => {
    const budgets = getBudgetsFromStorage();
    const budget = budgets.find(b => b.name === budgetName);
    
    if (budget) {
      // Remove units from stored values for editing
      return Promise.resolve({
        ...budget,
        yield: budget.yield ? budget.yield.split(' ')[0] : '',
        price: budget.price ? budget.price.replace(/[£\s\/t]/g, '') : '',
        area: budget.area ? budget.area.split(' ')[0] : '',
        grossMargin: budget.grossMargin ? budget.grossMargin.replace(/[£\s\/ha]/g, '') : ''
      });
    }
    
    return Promise.reject(new Error('Budget not found'));
  }
};