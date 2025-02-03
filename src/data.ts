import { OperationsData } from './types';

export const initialData: OperationsData = {
  cultivation: {
    name: 'Cultivation',
    costPerHa: 150, // Sum of sub-operations costs per hectare
    totalCost: 8100, // 150 × 54 hectares
    cropData: {
      'All crops': { hectares: 54, costPerHa: 150, totalCost: 8100 },
      'Barley': { hectares: 15, costPerHa: 140, totalCost: 2100 },
      'Wheat (Winter)': { hectares: 25, costPerHa: 155, totalCost: 3875 },
      'Linseed': { hectares: 14, costPerHa: 151, totalCost: 2114 }
    },
    subOperations: [
      {
        name: 'Ploughing',
        costPerHa: 74,
        totalCost: 3996, // 74 × 54 hectares
        cropData: {
          'All crops': { hectares: 54, costPerHa: 74, totalCost: 3996 },
          'Barley': { hectares: 15, costPerHa: 70, totalCost: 1050 },
          'Wheat (Winter)': { hectares: 25, costPerHa: 76, totalCost: 1900 },
          'Linseed': { hectares: 14, costPerHa: 75, totalCost: 1050 }
        }
      },
      {
        name: 'Discing',
        costPerHa: 35,
        totalCost: 1890, // 35 × 54 hectares
        cropData: {
          'All crops': { hectares: 54, costPerHa: 35, totalCost: 1890 },
          'Barley': { hectares: 15, costPerHa: 32, totalCost: 480 },
          'Wheat (Winter)': { hectares: 25, costPerHa: 37, totalCost: 925 },
          'Linseed': { hectares: 14, costPerHa: 35, totalCost: 490 }
        }
      },
      {
        name: 'Rolling',
        costPerHa: 41,
        totalCost: 2214, // 41 × 54 hectares
        cropData: {
          'All crops': { hectares: 54, costPerHa: 41, totalCost: 2214 },
          'Barley': { hectares: 15, costPerHa: 38, totalCost: 570 },
          'Wheat (Winter)': { hectares: 25, costPerHa: 42, totalCost: 1050 },
          'Linseed': { hectares: 14, costPerHa: 41, totalCost: 574 }
        }
      }
    ]
  },
  drilling: {
    name: 'Drilling',
    costPerHa: 158, // Sum of sub-operations costs per hectare
    totalCost: 8532, // 158 × 54 hectares
    cropData: {
      'All crops': { hectares: 54, costPerHa: 158, totalCost: 8532 },
      'Barley': { hectares: 15, costPerHa: 152, totalCost: 2280 },
      'Wheat (Winter)': { hectares: 25, costPerHa: 162, totalCost: 4050 },
      'Linseed': { hectares: 14, costPerHa: 157, totalCost: 2198 }
    },
    subOperations: [
      {
        name: 'Seed drilling',
        costPerHa: 85,
        totalCost: 4590, // 85 × 54 hectares
        cropData: {
          'All crops': { hectares: 54, costPerHa: 85, totalCost: 4590 },
          'Barley': { hectares: 15, costPerHa: 82, totalCost: 1230 },
          'Wheat (Winter)': { hectares: 25, costPerHa: 87, totalCost: 2175 },
          'Linseed': { hectares: 14, costPerHa: 85, totalCost: 1190 }
        }
      },
      {
        name: 'Fertilizer application',
        costPerHa: 73,
        totalCost: 3942, // 73 × 54 hectares
        cropData: {
          'All crops': { hectares: 54, costPerHa: 73, totalCost: 3942 },
          'Barley': { hectares: 15, costPerHa: 70, totalCost: 1050 },
          'Wheat (Winter)': { hectares: 25, costPerHa: 75, totalCost: 1875 },
          'Linseed': { hectares: 14, costPerHa: 72, totalCost: 1008 }
        }
      }
    ]
  },
  application: {
    name: 'Application - Fert.',
    costPerHa: 297, // Sum of sub-operations costs per hectare
    totalCost: 16038, // 297 × 54 hectares
    cropData: {
      'All crops': { hectares: 54, costPerHa: 297, totalCost: 16038 },
      'Barley': { hectares: 15, costPerHa: 292, totalCost: 4380 },
      'Wheat (Winter)': { hectares: 25, costPerHa: 301, totalCost: 7525 },
      'Linseed': { hectares: 14, costPerHa: 296, totalCost: 4144 }
    },
    subOperations: [
      {
        name: 'Nitrogen application',
        costPerHa: 155,
        totalCost: 8370, // 155 × 54 hectares
        cropData: {
          'All crops': { hectares: 54, costPerHa: 155, totalCost: 8370 },
          'Barley': { hectares: 15, costPerHa: 152, totalCost: 2280 },
          'Wheat (Winter)': { hectares: 25, costPerHa: 157, totalCost: 3925 },
          'Linseed': { hectares: 14, costPerHa: 155, totalCost: 2170 }
        }
      },
      {
        name: 'Phosphate application',
        costPerHa: 142,
        totalCost: 7668, // 142 × 54 hectares
        cropData: {
          'All crops': { hectares: 54, costPerHa: 142, totalCost: 7668 },
          'Barley': { hectares: 15, costPerHa: 140, totalCost: 2100 },
          'Wheat (Winter)': { hectares: 25, costPerHa: 144, totalCost: 3600 },
          'Linseed': { hectares: 14, costPerHa: 141, totalCost: 1974 }
        }
      }
    ]
  },
  harvesting: {
    name: 'Harvesting',
    costPerHa: 203, // Sum of sub-operations costs per hectare
    totalCost: 10962, // 203 × 54 hectares
    cropData: {
      'All crops': { hectares: 54, costPerHa: 203, totalCost: 10962 },
      'Barley': { hectares: 15, costPerHa: 197, totalCost: 2955 },
      'Wheat (Winter)': { hectares: 25, costPerHa: 207, totalCost: 5175 },
      'Linseed': { hectares: 14, costPerHa: 202, totalCost: 2828 }
    },
    subOperations: [
      {
        name: 'Combine harvesting',
        costPerHa: 105,
        totalCost: 5670, // 105 × 54 hectares
        cropData: {
          'All crops': { hectares: 54, costPerHa: 105, totalCost: 5670 },
          'Barley': { hectares: 15, costPerHa: 102, totalCost: 1530 },
          'Wheat (Winter)': { hectares: 25, costPerHa: 107, totalCost: 2675 },
          'Linseed': { hectares: 14, costPerHa: 105, totalCost: 1470 }
        }
      },
      {
        name: 'Grain carting',
        costPerHa: 98,
        totalCost: 5292, // 98 × 54 hectares
        cropData: {
          'All crops': { hectares: 54, costPerHa: 98, totalCost: 5292 },
          'Barley': { hectares: 15, costPerHa: 95, totalCost: 1425 },
          'Wheat (Winter)': { hectares: 25, costPerHa: 100, totalCost: 2500 },
          'Linseed': { hectares: 14, costPerHa: 97, totalCost: 1358 }
        }
      }
    ]
  },
  other: {
    name: 'Other',
    costPerHa: 247, // Sum of sub-operations costs per hectare
    totalCost: 13338, // 247 × 54 hectares
    cropData: {
      'All crops': { hectares: 54, costPerHa: 247, totalCost: 13338 },
      'Barley': { hectares: 15, costPerHa: 241, totalCost: 3615 },
      'Wheat (Winter)': { hectares: 25, costPerHa: 251, totalCost: 6275 },
      'Linseed': { hectares: 14, costPerHa: 247, totalCost: 3458 }
    },
    subOperations: [
      {
        name: 'Crop walking',
        costPerHa: 125,
        totalCost: 6750, // 125 × 54 hectares
        cropData: {
          'All crops': { hectares: 54, costPerHa: 125, totalCost: 6750 },
          'Barley': { hectares: 15, costPerHa: 122, totalCost: 1830 },
          'Wheat (Winter)': { hectares: 25, costPerHa: 127, totalCost: 3175 },
          'Linseed': { hectares: 14, costPerHa: 125, totalCost: 1750 }
        }
      },
      {
        name: 'Field margin maintenance',
        costPerHa: 122,
        totalCost: 6588, // 122 × 54 hectares
        cropData: {
          'All crops': { hectares: 54, costPerHa: 122, totalCost: 6588 },
          'Barley': { hectares: 15, costPerHa: 119, totalCost: 1785 },
          'Wheat (Winter)': { hectares: 25, costPerHa: 124, totalCost: 3100 },
          'Linseed': { hectares: 14, costPerHa: 122, totalCost: 1708 }
        }
      }
    ]
  },
  totalHectares: 54,
  totalAverageCost: 1055, // Sum of all category costs per hectare
  totalCost: 56970, // Sum of all category total costs
  crops: {
    'All crops': { hectares: 54 },
    'Barley': { hectares: 15 },
    'Wheat (Winter)': { hectares: 25 },
    'Linseed': { hectares: 14 }
  }
};