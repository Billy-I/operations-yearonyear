export interface Operation {
  name: string;
  costPerHa: number;
  totalCost: number;
  subOperations?: Operation[];
  cropData?: {
    [key: string]: {
      hectares: number;
      costPerHa: number;
      totalCost: number;
    }
  };
}

export interface OperationsData {
  cultivation: Operation;
  drilling: Operation;
  application: Operation;
  harvesting: Operation;
  other: Operation;
  totalHectares: number;
  totalAverageCost: number;
  totalCost: number;
  crops: {
    [key: string]: {
      hectares: number;
    }
  };
}