import { Year } from '../types/analytics';

export interface FieldData {
  id: string;
  name: string;
  size: number;  // Size in hectares
  rotations: {
    [key in Year]?: string;
  };
  metrics: {
    [key in Year]?: { // Make metrics optional per year
      cropType: string;
      yield: number;
      costOfProduction: number;
      grossMargin: number;
    };
  };
}

export const fieldsData: FieldData[] = [
  {
    id: "field1",
    name: "Field 1",
    size: 12.5,
    rotations: {
      '2019': 'Wheat(Winter)',
      '2020': 'Wheat(Winter)',
      '2021': 'Barley',
      '2022': 'Wheat(Winter)',
      '2023': 'Oilseed Rape',
      '2024': 'Wheat(Winter)',
    },
    metrics: {
      '2019': {
        cropType: 'Wheat(Winter)',
        yield: 8.18,
        costOfProduction: 185.42,
        grossMargin: 676.00
      },
      '2020': {
        cropType: 'Wheat(Winter)',
        yield: 8.25,
        costOfProduction: 195.60,
        grossMargin: 793.40
      },
      '2021': {
        cropType: 'Barley',
        yield: 7.2,
        costOfProduction: 175.30,
        grossMargin: 580.50
      },
      '2022': {
        cropType: 'Wheat(Winter)',
        yield: 8.15,
        costOfProduction: 178.25,
        grossMargin: 813.80
      },
      '2023': {
        cropType: 'Oilseed Rape',
        yield: 4.2,
        costOfProduction: 320.50,
        grossMargin: 950.30
      },
      '2024': {
        cropType: 'Wheat(Winter)',
        yield: 8.22,
        costOfProduction: 184.75,
        grossMargin: 685.50
      },
      'Yearly avg': {
        cropType: '',
        yield: 7.37,
        costOfProduction: 206.47,
        grossMargin: 749.92
      }
    }
  },
  {
    id: "field2",
    name: "Field 2",
    size: 15.8,
    rotations: {
      '2019': 'Barley',
      '2020': 'Wheat(Winter)',
      '2021': 'Oilseed Rape',
      '2022': 'Wheat(Winter)',
      '2023': 'Wheat(Winter)',
      '2024': 'Barley',
    },
    metrics: {
      '2019': {
        cropType: 'Barley',
        yield: 7.1,
        costOfProduction: 170.30,
        grossMargin: 570.50
      },
      '2020': {
        cropType: 'Wheat(Winter)',
        yield: 8.30,
        costOfProduction: 190.60,
        grossMargin: 780.40
      },
      '2021': {
        cropType: 'Oilseed Rape',
        yield: 4.1,
        costOfProduction: 315.30,
        grossMargin: 940.50
      },
      '2022': {
        cropType: 'Wheat(Winter)',
        yield: 8.20,
        costOfProduction: 175.25,
        grossMargin: 810.80
      },
      '2023': {
        cropType: 'Wheat(Winter)',
        yield: 8.25,
        costOfProduction: 180.50,
        grossMargin: 815.30
      },
      '2024': {
        cropType: 'Barley',
        yield: 7.2,
        costOfProduction: 172.75,
        grossMargin: 575.50
      },
      'Yearly avg': {
        cropType: '',
        yield: 7.19,
        costOfProduction: 200.78,
        grossMargin: 748.83
      }
    }
  },
  {
    id: "field3",
    name: "Field 3",
    size: 8.2,
    rotations: { // Simplified rotations for mock data
      '2023': 'Beans',
      '2024': 'Wheat(Winter)',
    },
    metrics: { // Simplified metrics for mock data
      '2023': { cropType: 'Beans', yield: 5.0, costOfProduction: 250.00, grossMargin: 700.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.0, costOfProduction: 180.00, grossMargin: 650.00 },
      'Yearly avg': { cropType: '', yield: 6.5, costOfProduction: 215.00, grossMargin: 675.00 }
    }
  },
  {
    id: "field4",
    name: "Field 4",
    size: 10.4,
    rotations: {
      '2023': 'Oilseed Rape',
      '2024': 'Barley',
    },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.0, costOfProduction: 300.00, grossMargin: 900.00 },
      '2024': { cropType: 'Barley', yield: 7.0, costOfProduction: 170.00, grossMargin: 550.00 },
      'Yearly avg': { cropType: '', yield: 5.5, costOfProduction: 235.00, grossMargin: 725.00 }
    }
  },
  {
    id: "field5",
    name: "Field 5",
    size: 9.6,
    rotations: {
      '2023': 'Wheat(Winter)',
      '2024': 'Fallow',
    },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.5, costOfProduction: 190.00, grossMargin: 850.00 },
      '2024': { cropType: 'Fallow', yield: 0, costOfProduction: 50.00, grossMargin: -50.00 },
      'Yearly avg': { cropType: '', yield: 4.25, costOfProduction: 120.00, grossMargin: 400.00 }
    }
  },
  {
    id: "field6",
    name: "Field 6",
    size: 14.3,
    rotations: {
      '2023': 'Barley',
      '2024': 'Wheat(Winter)',
    },
    metrics: {
      '2023': { cropType: 'Barley', yield: 7.2, costOfProduction: 175.00, grossMargin: 580.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.3, costOfProduction: 185.00, grossMargin: 750.00 },
      'Yearly avg': { cropType: '', yield: 7.75, costOfProduction: 180.00, grossMargin: 665.00 }
    }
  },
  {
    id: "field7",
    name: "Long Field North",
    size: 18.7,
    rotations: {
      '2023': 'Wheat(Winter)',
      '2024': 'Oilseed Rape',
    },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.4, costOfProduction: 188.00, grossMargin: 820.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.2, costOfProduction: 310.00, grossMargin: 920.00 },
      'Yearly avg': { cropType: '', yield: 6.3, costOfProduction: 249.00, grossMargin: 870.00 }
    }
  },
  {
    id: "field8",
    name: "Long Field South",
    size: 16.9,
    rotations: {
      '2023': 'Wheat(Winter)',
      '2024': 'Barley',
    },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.1, costOfProduction: 182.00, grossMargin: 795.00 },
      '2024': { cropType: 'Barley', yield: 7.3, costOfProduction: 173.00, grossMargin: 585.00 },
      'Yearly avg': { cropType: '', yield: 7.7, costOfProduction: 177.50, grossMargin: 690.00 }
    }
  },
  {
    id: "field9",
    name: "Hill Top",
    size: 11.2,
    rotations: {
      '2023': 'Beans',
      '2024': 'Wheat(Winter)',
    },
    metrics: {
      '2023': { cropType: 'Beans', yield: 4.8, costOfProduction: 245.00, grossMargin: 680.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.9, costOfProduction: 180.00, grossMargin: 730.00 },
      'Yearly avg': { cropType: '', yield: 6.35, costOfProduction: 212.50, grossMargin: 705.00 }
    }
  },
  {
    id: "field10",
    name: "Bottom Meadow",
    size: 13.5,
    rotations: {
      '2023': 'Oilseed Rape',
      '2024': 'Wheat(Winter)',
    },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.1, costOfProduction: 305.00, grossMargin: 890.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.2, costOfProduction: 183.00, grossMargin: 760.00 },
      'Yearly avg': { cropType: '', yield: 6.15, costOfProduction: 244.00, grossMargin: 825.00 }
    }
  },
  {
    id: "field11",
    name: "River Field",
    size: 20.1,
    rotations: {
      '2023': 'Wheat(Winter)',
      '2024': 'Beans',
    },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.6, costOfProduction: 186.00, grossMargin: 840.00 },
      '2024': { cropType: 'Beans', yield: 4.9, costOfProduction: 248.00, grossMargin: 690.00 },
      'Yearly avg': { cropType: '', yield: 6.75, costOfProduction: 217.00, grossMargin: 765.00 }
    }
  },
  {
    id: "field12",
    name: "Church Field",
    size: 15.8,
    rotations: {
      '2023': 'Barley',
      '2024': 'Oilseed Rape',
    },
    metrics: {
      '2023': { cropType: 'Barley', yield: 7.4, costOfProduction: 176.00, grossMargin: 590.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.3, costOfProduction: 315.00, grossMargin: 930.00 },
      'Yearly avg': { cropType: '', yield: 5.85, costOfProduction: 245.50, grossMargin: 760.00 }
    }
  },
  {
    id: "field13",
    name: "Upper Common",
    size: 22.4,
    rotations: {
      '2023': 'Wheat(Winter)',
      '2024': 'Oilseed Rape',
    },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.3, costOfProduction: 182.00, grossMargin: 810.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.4, costOfProduction: 312.00, grossMargin: 925.00 },
      'Yearly avg': { cropType: '', yield: 6.35, costOfProduction: 247.00, grossMargin: 867.50 }
    }
  },
  {
    id: "field14",
    name: "Lower Common",
    size: 19.8,
    rotations: {
      '2023': 'Barley',
      '2024': 'Wheat(Winter)',
    },
    metrics: {
      '2023': { cropType: 'Barley', yield: 7.1, costOfProduction: 171.00, grossMargin: 575.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.1, costOfProduction: 181.00, grossMargin: 745.00 },
      'Yearly avg': { cropType: '', yield: 7.6, costOfProduction: 176.00, grossMargin: 660.00 }
    }
  },
  {
    id: "field15",
    name: "Mill Field",
    size: 16.2,
    rotations: {
      '2023': 'Beans',
      '2024': 'Wheat(Winter)',
    },
    metrics: {
      '2023': { cropType: 'Beans', yield: 4.9, costOfProduction: 242.00, grossMargin: 685.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.0, costOfProduction: 179.00, grossMargin: 735.00 },
      'Yearly avg': { cropType: '', yield: 6.45, costOfProduction: 210.50, grossMargin: 710.00 }
    }
  },
  {
    id: "field16",
    name: "Old Castle Field",
    size: 14.7,
    rotations: {
      '2023': 'Wheat(Winter)',
      '2024': 'Barley',
    },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.4, costOfProduction: 184.00, grossMargin: 825.00 },
      '2024': { cropType: 'Barley', yield: 7.3, costOfProduction: 174.00, grossMargin: 585.00 },
      'Yearly avg': { cropType: '', yield: 7.85, costOfProduction: 179.00, grossMargin: 705.00 }
    }
  },
  {
    id: "field17",
    name: "Railway Field",
    size: 17.9,
    rotations: {
      '2023': 'Oilseed Rape',
      '2024': 'Wheat(Winter)',
    },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.2, costOfProduction: 308.00, grossMargin: 895.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.2, costOfProduction: 182.00, grossMargin: 755.00 },
      'Yearly avg': { cropType: '', yield: 6.2, costOfProduction: 245.00, grossMargin: 825.00 }
    }
  }
];