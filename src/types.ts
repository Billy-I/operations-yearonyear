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
// --- Field Group Types ---

// Represents a single field, primarily for selection in groups
export interface Field {
  id: string;
  name: string;
  // Add other relevant properties from FieldData if needed for display/logic
}

// Represents a field group created and managed by the user within this application
export interface UserFieldGroup {
  id: string; // Unique ID generated within this application (e.g., UUID)
  name: string;
  fieldIds: string[]; // Array of Field IDs belonging to this group
  isFmsCopy?: boolean; // Flag indicating if this group was originally copied from an FMS group
  originalFmsId?: string; // The ID of the FMS group it was copied from, if applicable
}

// Represents a field group ingested from an external source (read-only)
export interface FmsFieldGroup {
  id: string; // Unique identifier from the source system
  name: string;
  fieldIds: string[];
  readonly: true; // Marker to indicate it's read-only in the UI context
}