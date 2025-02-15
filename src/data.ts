import { OperationsData } from './types';

export const initialData: OperationsData = {
  cultivation: {
    name: 'Cultivation',
    costPerHa: 380.29,
    totalCost: 114087,
    cropData: {
      'All crops': { hectares: 300, costPerHa: 380.29, totalCost: 114087 },
      'Barley': { hectares: 80, costPerHa: 380.29, totalCost: 30423 },
      'Wheat (Winter)': { hectares: 150, costPerHa: 380.29, totalCost: 57044 },
      'Linseed': { hectares: 70, costPerHa: 380.29, totalCost: 26620 }
    },
    subOperations: [
      {
        name: 'Plough',
        costPerHa: 59.29,
        totalCost: 17787,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 59.29, totalCost: 17787 },
          'Barley': { hectares: 80, costPerHa: 59.29, totalCost: 4743 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 59.29, totalCost: 8894 },
          'Linseed': { hectares: 70, costPerHa: 59.29, totalCost: 4150 }
        }
      },
      {
        name: 'Rotovating',
        costPerHa: 79.86,
        totalCost: 23958,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 79.86, totalCost: 23958 },
          'Barley': { hectares: 80, costPerHa: 79.86, totalCost: 6389 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 79.86, totalCost: 11979 },
          'Linseed': { hectares: 70, costPerHa: 79.86, totalCost: 5590 }
        }
      },
      {
        name: 'Sub-soiling/Flat lifting',
        costPerHa: 53.77,
        totalCost: 16131,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 53.77, totalCost: 16131 },
          'Barley': { hectares: 80, costPerHa: 53.77, totalCost: 4302 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 53.77, totalCost: 8066 },
          'Linseed': { hectares: 70, costPerHa: 53.77, totalCost: 3764 }
        }
      },
      {
        name: 'Discing',
        costPerHa: 35.17,
        totalCost: 10551,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 35.17, totalCost: 10551 },
          'Barley': { hectares: 80, costPerHa: 35.17, totalCost: 2814 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 35.17, totalCost: 5276 },
          'Linseed': { hectares: 70, costPerHa: 35.17, totalCost: 2462 }
        }
      },
      {
        name: 'Power harrowing',
        costPerHa: 52.51,
        totalCost: 15753,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 52.51, totalCost: 15753 },
          'Barley': { hectares: 80, costPerHa: 52.51, totalCost: 4201 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 52.51, totalCost: 7877 },
          'Linseed': { hectares: 70, costPerHa: 52.51, totalCost: 3676 }
        }
      },
      {
        name: 'Pressing',
        costPerHa: 28.72,
        totalCost: 8616,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 28.72, totalCost: 8616 },
          'Barley': { hectares: 80, costPerHa: 28.72, totalCost: 2298 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 28.72, totalCost: 4308 },
          'Linseed': { hectares: 70, costPerHa: 28.72, totalCost: 2010 }
        }
      },
      {
        name: 'Cultivation & Press',
        costPerHa: 56.05,
        totalCost: 16815,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 56.05, totalCost: 16815 },
          'Barley': { hectares: 80, costPerHa: 56.05, totalCost: 4484 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 56.05, totalCost: 8408 },
          'Linseed': { hectares: 70, costPerHa: 56.05, totalCost: 3924 }
        }
      },
      {
        name: 'Rolling (ring seedbeds)',
        costPerHa: 14.92,
        totalCost: 4476,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 14.92, totalCost: 4476 },
          'Barley': { hectares: 80, costPerHa: 14.92, totalCost: 1194 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 14.92, totalCost: 2238 },
          'Linseed': { hectares: 70, costPerHa: 14.92, totalCost: 1044 }
        }
      }
    ]
  },
  drilling: {
    name: 'Drilling',
    costPerHa: 51,
    totalCost: 15300,
    cropData: {
      'All crops': { hectares: 300, costPerHa: 51, totalCost: 15300 },
      'Barley': { hectares: 80, costPerHa: 51, totalCost: 4080 },
      'Wheat (Winter)': { hectares: 150, costPerHa: 51, totalCost: 7650 },
      'Linseed': { hectares: 70, costPerHa: 51, totalCost: 3570 }
    },
    subOperations: [
      {
        name: 'Drilling',
        costPerHa: 51,
        totalCost: 15300,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 51, totalCost: 15300 },
          'Barley': { hectares: 80, costPerHa: 51, totalCost: 4080 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 51, totalCost: 7650 },
          'Linseed': { hectares: 70, costPerHa: 51, totalCost: 3570 }
        }
      }
    ]
  },
  application: {
    name: 'Application',
    costPerHa: 116.93,
    totalCost: 35079,
    cropData: {
      'All crops': { hectares: 300, costPerHa: 116.93, totalCost: 35079 },
      'Barley': { hectares: 80, costPerHa: 116.93, totalCost: 9354 },
      'Wheat (Winter)': { hectares: 150, costPerHa: 116.93, totalCost: 17540 },
      'Linseed': { hectares: 70, costPerHa: 116.93, totalCost: 8185 }
    },
    subOperations: [
      {
        name: 'Fertiliser distribution',
        costPerHa: 10.28,
        totalCost: 3084,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 10.28, totalCost: 3084 },
          'Barley': { hectares: 80, costPerHa: 10.28, totalCost: 822 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 10.28, totalCost: 1542 },
          'Linseed': { hectares: 70, costPerHa: 10.28, totalCost: 720 }
        }
      },
      {
        name: 'Lime spreading',
        costPerHa: 77.21,
        totalCost: 23163,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 77.21, totalCost: 23163 },
          'Barley': { hectares: 80, costPerHa: 77.21, totalCost: 6177 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 77.21, totalCost: 11582 },
          'Linseed': { hectares: 70, costPerHa: 77.21, totalCost: 5405 }
        }
      },
      {
        name: 'Spraying',
        costPerHa: 9.60,
        totalCost: 2880,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 9.60, totalCost: 2880 },
          'Barley': { hectares: 80, costPerHa: 9.60, totalCost: 768 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 9.60, totalCost: 1440 },
          'Linseed': { hectares: 70, costPerHa: 9.60, totalCost: 672 }
        }
      },
      {
        name: 'Liquid fertiliser',
        costPerHa: 12.99,
        totalCost: 3897,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 12.99, totalCost: 3897 },
          'Barley': { hectares: 80, costPerHa: 12.99, totalCost: 1039 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 12.99, totalCost: 1949 },
          'Linseed': { hectares: 70, costPerHa: 12.99, totalCost: 909 }
        }
      },
      {
        name: 'Slug-pelleting',
        costPerHa: 6.85,
        totalCost: 2055,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 6.85, totalCost: 2055 },
          'Barley': { hectares: 80, costPerHa: 6.85, totalCost: 548 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 6.85, totalCost: 1028 },
          'Linseed': { hectares: 70, costPerHa: 6.85, totalCost: 480 }
        }
      }
    ]
  },
  harvesting: {
    name: 'Harvesting',
    costPerHa: 100.43,
    totalCost: 30129,
    cropData: {
      'All crops': { hectares: 300, costPerHa: 100.43, totalCost: 30129 },
      'Barley': { hectares: 80, costPerHa: 100.43, totalCost: 8034 },
      'Wheat (Winter)': { hectares: 150, costPerHa: 100.43, totalCost: 15065 },
      'Linseed': { hectares: 70, costPerHa: 100.43, totalCost: 7030 }
    },
    subOperations: [
      {
        name: 'Combining',
        costPerHa: 87.32,
        totalCost: 26196,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 87.32, totalCost: 26196 },
          'Barley': { hectares: 80, costPerHa: 87.32, totalCost: 6986 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 87.32, totalCost: 13098 },
          'Linseed': { hectares: 70, costPerHa: 87.32, totalCost: 6112 }
        }
      },
      {
        name: 'Grain Carting',
        costPerHa: 10.00,
        totalCost: 3000,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 10.00, totalCost: 3000 },
          'Barley': { hectares: 80, costPerHa: 10.00, totalCost: 800 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 10.00, totalCost: 1500 },
          'Linseed': { hectares: 70, costPerHa: 10.00, totalCost: 700 }
        }
      },
      {
        name: 'Bale Chasing',
        costPerHa: 3.11,
        totalCost: 933,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 3.11, totalCost: 933 },
          'Barley': { hectares: 80, costPerHa: 3.11, totalCost: 249 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 3.11, totalCost: 467 },
          'Linseed': { hectares: 70, costPerHa: 3.11, totalCost: 218 }
        }
      }
    ]
  },
  other: {
    name: 'Other',
    costPerHa: 0,
    totalCost: 0,
    cropData: {
      'All crops': { hectares: 300, costPerHa: 0, totalCost: 0 },
      'Barley': { hectares: 80, costPerHa: 0, totalCost: 0 },
      'Wheat (Winter)': { hectares: 150, costPerHa: 0, totalCost: 0 },
      'Linseed': { hectares: 70, costPerHa: 0, totalCost: 0 }
    },
    subOperations: [
      {
        name: 'No operations listed',
        costPerHa: 0,
        totalCost: 0,
        cropData: {
          'All crops': { hectares: 300, costPerHa: 0, totalCost: 0 },
          'Barley': { hectares: 80, costPerHa: 0, totalCost: 0 },
          'Wheat (Winter)': { hectares: 150, costPerHa: 0, totalCost: 0 },
          'Linseed': { hectares: 70, costPerHa: 0, totalCost: 0 }
        }
      }
    ]
  },
  totalHectares: 300,
  totalAverageCost: 648.65,
  totalCost: 194595,
  crops: {
    'All crops': { 
      hectares: 300
    },
    'Barley': { 
      hectares: 80,
      endUseMarket: {
        'feed': { hectares: 80 }
      }
    },
    'Wheat (Winter)': { 
      hectares: 150,
      endUseMarket: {
        'milling': { hectares: 90 },
        'feed': { hectares: 60 }
      }
    },
    'Linseed': { 
      hectares: 70
    }
  }
};