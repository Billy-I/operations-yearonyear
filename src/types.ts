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

export interface CropData {
  hectares: number;
  endUseMarket?: {
    [key: string]: {
      hectares: number;
    }
  };
}

export interface EntityAssignment {
  id: string;
  entityType: 'crop' | 'variety' | 'field';
  entityId: string;
  entityName: string;
}

export interface Template {
  id: string;
  name: string;
  isDefault: boolean;
  isEditable: boolean;
  data: OperationsData;
  assignments: EntityAssignment[];
  activeAssignmentId?: string;
  // Keep for backward compatibility
  filterCombinations: FilterCombination[];
  activeFilterCombinationId?: string;
  columnOrder?: string[];
}

export interface FilterCombination {
  id: string;
  name: string;
  selectedCrop: string;
  selectedFilter: string;
  selectedSubFilters: string[];
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
    [key: string]: CropData;
  };
}