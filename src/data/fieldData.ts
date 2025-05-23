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
,
  {
    id: "field18",
    name: "North Boundary Field",
    size: 25.0,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.0, costOfProduction: 180.00, grossMargin: 750.00 },
      '2024': { cropType: 'Barley', yield: 7.0, costOfProduction: 170.00, grossMargin: 600.00 },
      'Yearly avg': { cropType: '', yield: 7.5, costOfProduction: 175.00, grossMargin: 675.00 }
    }
  },
  {
    id: "field19",
    name: "South Boundary Field",
    size: 22.5,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.0, costOfProduction: 300.00, grossMargin: 900.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.1, costOfProduction: 182.00, grossMargin: 760.00 },
      'Yearly avg': { cropType: '', yield: 6.05, costOfProduction: 241.00, grossMargin: 830.00 }
    }
  },
  {
    id: "field20",
    name: "East Paddock",
    size: 18.3,
    rotations: { '2023': 'Beans', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 5.2, costOfProduction: 255.00, grossMargin: 710.00 },
      '2024': { cropType: 'Barley', yield: 6.8, costOfProduction: 165.00, grossMargin: 580.00 },
      'Yearly avg': { cropType: '', yield: 6.0, costOfProduction: 210.00, grossMargin: 645.00 }
    }
  },
  {
    id: "field21",
    name: "West Paddock",
    size: 19.1,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.3, costOfProduction: 188.00, grossMargin: 770.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.1, costOfProduction: 305.00, grossMargin: 890.00 },
      'Yearly avg': { cropType: '', yield: 6.2, costOfProduction: 246.50, grossMargin: 830.00 }
    }
  },
  {
    id: "field22",
    name: "The Triangle",
    size: 7.7,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 7.1, costOfProduction: 172.00, grossMargin: 590.00 },
      '2024': { cropType: 'Beans', yield: 4.8, costOfProduction: 248.00, grossMargin: 680.00 },
      'Yearly avg': { cropType: '', yield: 5.95, costOfProduction: 210.00, grossMargin: 635.00 }
    }
  },
  {
    id: "field23",
    name: "The Square",
    size: 10.0,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 3.9, costOfProduction: 295.00, grossMargin: 880.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.0, costOfProduction: 180.00, grossMargin: 750.00 },
      'Yearly avg': { cropType: '', yield: 5.95, costOfProduction: 237.50, grossMargin: 815.00 }
    }
  },
  {
    id: "field24",
    name: "Orchard View",
    size: 12.8,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.2, costOfProduction: 185.00, grossMargin: 765.00 },
      '2024': { cropType: 'Barley', yield: 7.2, costOfProduction: 175.00, grossMargin: 610.00 },
      'Yearly avg': { cropType: '', yield: 7.7, costOfProduction: 180.00, grossMargin: 687.50 }
    }
  },
  {
    id: "field25",
    name: "Valley Bottom",
    size: 30.5,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 5.5, costOfProduction: 260.00, grossMargin: 720.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.5, costOfProduction: 190.00, grossMargin: 780.00 },
      'Yearly avg': { cropType: '', yield: 7.0, costOfProduction: 225.00, grossMargin: 750.00 }
    }
  },
  {
    id: "field26",
    name: "Hillside Slope North",
    size: 14.9,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.3, costOfProduction: 310.00, grossMargin: 910.00 },
      '2024': { cropType: 'Barley', yield: 6.9, costOfProduction: 168.00, grossMargin: 585.00 },
      'Yearly avg': { cropType: '', yield: 5.6, costOfProduction: 239.00, grossMargin: 747.50 }
    }
  },
  {
    id: "field27",
    name: "Hillside Slope South",
    size: 15.2,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.1, costOfProduction: 183.00, grossMargin: 760.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.0, costOfProduction: 300.00, grossMargin: 890.00 },
      'Yearly avg': { cropType: '', yield: 6.05, costOfProduction: 241.50, grossMargin: 825.00 }
    }
  },
  {
    id: "field28",
    name: "Copse Corner",
    size: 9.3,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 7.0, costOfProduction: 170.00, grossMargin: 580.00 },
      '2024': { cropType: 'Beans', yield: 4.7, costOfProduction: 245.00, grossMargin: 670.00 },
      'Yearly avg': { cropType: '', yield: 5.85, costOfProduction: 207.50, grossMargin: 625.00 }
    }
  },
  {
    id: "field29",
    name: "Roadside Strip",
    size: 6.5,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 3.8, costOfProduction: 290.00, grossMargin: 870.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.9, costOfProduction: 178.00, grossMargin: 740.00 },
      'Yearly avg': { cropType: '', yield: 5.85, costOfProduction: 234.00, grossMargin: 805.00 }
    }
  },
  {
    id: "field30",
    name: "The Long Acre",
    size: 28.0,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.4, costOfProduction: 189.00, grossMargin: 775.00 },
      '2024': { cropType: 'Barley', yield: 7.3, costOfProduction: 178.00, grossMargin: 615.00 },
      'Yearly avg': { cropType: '', yield: 7.85, costOfProduction: 183.50, grossMargin: 695.00 }
    }
  },
  {
    id: "field31",
    name: "The Short Acre",
    size: 5.1,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 5.0, costOfProduction: 250.00, grossMargin: 690.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.8, costOfProduction: 175.00, grossMargin: 730.00 },
      'Yearly avg': { cropType: '', yield: 6.4, costOfProduction: 212.50, grossMargin: 710.00 }
    }
  },
  {
    id: "field32",
    name: "Pylon Field",
    size: 11.8,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.2, costOfProduction: 308.00, grossMargin: 905.00 },
      '2024': { cropType: 'Barley', yield: 7.0, costOfProduction: 170.00, grossMargin: 595.00 },
      'Yearly avg': { cropType: '', yield: 5.6, costOfProduction: 239.00, grossMargin: 750.00 }
    }
  },
  {
    id: "field33",
    name: "Reservoir Field",
    size: 16.6,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.0, costOfProduction: 181.00, grossMargin: 755.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.1, costOfProduction: 303.00, grossMargin: 885.00 },
      'Yearly avg': { cropType: '', yield: 6.05, costOfProduction: 242.00, grossMargin: 820.00 }
    }
  },
  {
    id: "field34",
    name: "Windmill View",
    size: 13.3,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 6.9, costOfProduction: 169.00, grossMargin: 575.00 },
      '2024': { cropType: 'Beans', yield: 4.9, costOfProduction: 249.00, grossMargin: 685.00 },
      'Yearly avg': { cropType: '', yield: 5.9, costOfProduction: 209.00, grossMargin: 630.00 }
    }
  },
  {
    id: "field35",
    name: "The Dell",
    size: 8.8,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.0, costOfProduction: 298.00, grossMargin: 880.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.1, costOfProduction: 182.00, grossMargin: 758.00 },
      'Yearly avg': { cropType: '', yield: 6.05, costOfProduction: 240.00, grossMargin: 819.00 }
    }
  },
  {
    id: "field36",
    name: "The Plateau",
    size: 21.2,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.5, costOfProduction: 192.00, grossMargin: 785.00 },
      '2024': { cropType: 'Barley', yield: 7.4, costOfProduction: 179.00, grossMargin: 620.00 },
      'Yearly avg': { cropType: '', yield: 7.95, costOfProduction: 185.50, grossMargin: 702.50 }
    }
  },
  {
    id: "field37",
    name: "The Gully",
    size: 10.6,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 5.1, costOfProduction: 252.00, grossMargin: 695.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.9, costOfProduction: 179.00, grossMargin: 745.00 },
      'Yearly avg': { cropType: '', yield: 6.5, costOfProduction: 215.50, grossMargin: 720.00 }
    }
  },
  {
    id: "field38",
    name: "Boundary West",
    size: 17.4,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.4, costOfProduction: 312.00, grossMargin: 915.00 },
      '2024': { cropType: 'Barley', yield: 7.1, costOfProduction: 173.00, grossMargin: 600.00 },
      'Yearly avg': { cropType: '', yield: 5.75, costOfProduction: 242.50, grossMargin: 757.50 }
    }
  },
  {
    id: "field39",
    name: "Boundary East",
    size: 16.1,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.2, costOfProduction: 184.00, grossMargin: 762.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 3.9, costOfProduction: 297.00, grossMargin: 875.00 },
      'Yearly avg': { cropType: '', yield: 6.05, costOfProduction: 240.50, grossMargin: 818.50 }
    }
  },
  {
    id: "field40",
    name: "Central Large Field",
    size: 35.0,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 7.5, costOfProduction: 180.00, grossMargin: 625.00 },
      '2024': { cropType: 'Beans', yield: 5.3, costOfProduction: 258.00, grossMargin: 700.00 },
      'Yearly avg': { cropType: '', yield: 6.4, costOfProduction: 219.00, grossMargin: 662.50 }
    }
  },
  {
    id: "field41",
    name: "Central Small Field",
    size: 4.5,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 3.7, costOfProduction: 288.00, grossMargin: 865.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.7, costOfProduction: 174.00, grossMargin: 725.00 },
      'Yearly avg': { cropType: '', yield: 5.7, costOfProduction: 231.00, grossMargin: 795.00 }
    }
  },
  {
    id: "field42",
    name: "The Nook",
    size: 3.2,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 7.9, costOfProduction: 179.00, grossMargin: 740.00 },
      '2024': { cropType: 'Barley', yield: 6.8, costOfProduction: 167.00, grossMargin: 570.00 },
      'Yearly avg': { cropType: '', yield: 7.35, costOfProduction: 173.00, grossMargin: 655.00 }
    }
  },
  {
    id: "field43",
    name: "The Cranny",
    size: 2.9,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 4.6, costOfProduction: 243.00, grossMargin: 665.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.6, costOfProduction: 172.00, grossMargin: 720.00 },
      'Yearly avg': { cropType: '', yield: 6.1, costOfProduction: 207.50, grossMargin: 692.50 }
    }
  },
  {
    id: "field44",
    name: "Far North Strip",
    size: 19.5,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.5, costOfProduction: 315.00, grossMargin: 920.00 },
      '2024': { cropType: 'Barley', yield: 7.2, costOfProduction: 176.00, grossMargin: 605.00 },
      'Yearly avg': { cropType: '', yield: 5.85, costOfProduction: 245.50, grossMargin: 762.50 }
    }
  },
  {
    id: "field45",
    name: "Far South Strip",
    size: 20.3,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.6, costOfProduction: 193.00, grossMargin: 790.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.2, costOfProduction: 307.00, grossMargin: 895.00 },
      'Yearly avg': { cropType: '', yield: 6.4, costOfProduction: 250.00, grossMargin: 842.50 }
    }
  },
  {
    id: "field46",
    name: "Middle East Patch",
    size: 10.1,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 7.3, costOfProduction: 177.00, grossMargin: 610.00 },
      '2024': { cropType: 'Beans', yield: 5.0, costOfProduction: 251.00, grossMargin: 690.00 },
      'Yearly avg': { cropType: '', yield: 6.15, costOfProduction: 214.00, grossMargin: 650.00 }
    }
  },
  {
    id: "field47",
    name: "Middle West Patch",
    size: 9.9,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.1, costOfProduction: 304.00, grossMargin: 888.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.0, costOfProduction: 180.00, grossMargin: 750.00 },
      'Yearly avg': { cropType: '', yield: 6.05, costOfProduction: 242.00, grossMargin: 819.00 }
    }
  },
  {
    id: "field48",
    name: "The Bend North",
    size: 11.1,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.1, costOfProduction: 182.00, grossMargin: 758.00 },
      '2024': { cropType: 'Barley', yield: 7.0, costOfProduction: 171.00, grossMargin: 598.00 },
      'Yearly avg': { cropType: '', yield: 7.55, costOfProduction: 176.50, grossMargin: 678.00 }
    }
  },
  {
    id: "field49",
    name: "The Bend South",
    size: 10.9,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 4.9, costOfProduction: 249.00, grossMargin: 688.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.8, costOfProduction: 176.00, grossMargin: 738.00 },
      'Yearly avg': { cropType: '', yield: 6.35, costOfProduction: 212.50, grossMargin: 713.00 }
    }
  },
  {
    id: "field50",
    name: "The Curve East",
    size: 14.0,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.3, costOfProduction: 311.00, grossMargin: 912.00 },
      '2024': { cropType: 'Barley', yield: 7.1, costOfProduction: 174.00, grossMargin: 602.00 },
      'Yearly avg': { cropType: '', yield: 5.7, costOfProduction: 242.50, grossMargin: 757.00 }
    }
  },
  {
    id: "field51",
    name: "The Curve West",
    size: 13.8,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.3, costOfProduction: 187.00, grossMargin: 772.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.0, costOfProduction: 301.00, grossMargin: 882.00 },
      'Yearly avg': { cropType: '', yield: 6.15, costOfProduction: 244.00, grossMargin: 827.00 }
    }
  },
  {
    id: "field52",
    name: "Homestead North",
    size: 8.1,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 6.9, costOfProduction: 168.00, grossMargin: 572.00 },
      '2024': { cropType: 'Beans', yield: 4.8, costOfProduction: 247.00, grossMargin: 678.00 },
      'Yearly avg': { cropType: '', yield: 5.85, costOfProduction: 207.50, grossMargin: 625.00 }
    }
  },
  {
    id: "field53",
    name: "Homestead South",
    size: 7.9,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 3.9, costOfProduction: 296.00, grossMargin: 878.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.9, costOfProduction: 178.00, grossMargin: 742.00 },
      'Yearly avg': { cropType: '', yield: 5.9, costOfProduction: 237.00, grossMargin: 810.00 }
    }
  },
  {
    id: "field54",
    name: "The Flat North",
    size: 23.0,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.7, costOfProduction: 195.00, grossMargin: 795.00 },
      '2024': { cropType: 'Barley', yield: 7.5, costOfProduction: 180.00, grossMargin: 630.00 },
      'Yearly avg': { cropType: '', yield: 8.1, costOfProduction: 187.50, grossMargin: 712.50 }
    }
  },
  {
    id: "field55",
    name: "The Flat South",
    size: 24.5,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 5.6, costOfProduction: 262.00, grossMargin: 725.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.6, costOfProduction: 192.00, grossMargin: 785.00 },
      'Yearly avg': { cropType: '', yield: 7.1, costOfProduction: 227.00, grossMargin: 755.00 }
    }
  },
  {
    id: "field56",
    name: "The Rise East",
    size: 12.1,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.4, costOfProduction: 313.00, grossMargin: 918.00 },
      '2024': { cropType: 'Barley', yield: 7.2, costOfProduction: 175.00, grossMargin: 608.00 },
      'Yearly avg': { cropType: '', yield: 5.8, costOfProduction: 244.00, grossMargin: 763.00 }
    }
  },
  {
    id: "field57",
    name: "The Rise West",
    size: 11.9,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.2, costOfProduction: 185.00, grossMargin: 768.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.1, costOfProduction: 302.00, grossMargin: 885.00 },
      'Yearly avg': { cropType: '', yield: 6.15, costOfProduction: 243.50, grossMargin: 826.50 }
    }
  },
  {
    id: "field58",
    name: "The Dip North",
    size: 9.1,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 7.1, costOfProduction: 173.00, grossMargin: 592.00 },
      '2024': { cropType: 'Beans', yield: 4.9, costOfProduction: 250.00, grossMargin: 682.00 },
      'Yearly avg': { cropType: '', yield: 6.0, costOfProduction: 211.50, grossMargin: 637.00 }
    }
  },
  {
    id: "field59",
    name: "The Dip South",
    size: 8.9,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.0, costOfProduction: 299.00, grossMargin: 882.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.0, costOfProduction: 181.00, grossMargin: 752.00 },
      'Yearly avg': { cropType: '', yield: 6.0, costOfProduction: 240.00, grossMargin: 817.00 }
    }
  },
  {
    id: "field60",
    name: "The Ridge East",
    size: 15.6,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.4, costOfProduction: 190.00, grossMargin: 782.00 },
      '2024': { cropType: 'Barley', yield: 7.3, costOfProduction: 177.00, grossMargin: 618.00 },
      'Yearly avg': { cropType: '', yield: 7.85, costOfProduction: 183.50, grossMargin: 700.00 }
    }
  },
  {
    id: "field61",
    name: "The Ridge West",
    size: 15.4,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 5.2, costOfProduction: 256.00, grossMargin: 712.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.1, costOfProduction: 183.00, grossMargin: 762.00 },
      'Yearly avg': { cropType: '', yield: 6.65, costOfProduction: 219.50, grossMargin: 737.00 }
    }
  },
  {
    id: "field62",
    name: "The Hollow North",
    size: 10.4,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.2, costOfProduction: 309.00, grossMargin: 908.00 },
      '2024': { cropType: 'Barley', yield: 7.0, costOfProduction: 172.00, grossMargin: 592.00 },
      'Yearly avg': { cropType: '', yield: 5.6, costOfProduction: 240.50, grossMargin: 750.00 }
    }
  },
  {
    id: "field63",
    name: "The Hollow South",
    size: 10.2,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.0, costOfProduction: 180.00, grossMargin: 750.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.1, costOfProduction: 304.00, grossMargin: 880.00 },
      'Yearly avg': { cropType: '', yield: 6.05, costOfProduction: 242.00, grossMargin: 815.00 }
    }
  },
  {
    id: "field64",
    name: "The Knoll East",
    size: 6.3,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 6.8, costOfProduction: 167.00, grossMargin: 568.00 },
      '2024': { cropType: 'Beans', yield: 4.7, costOfProduction: 246.00, grossMargin: 672.00 },
      'Yearly avg': { cropType: '', yield: 5.75, costOfProduction: 206.50, grossMargin: 620.00 }
    }
  },
  {
    id: "field65",
    name: "The Knoll West",
    size: 6.1,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 3.8, costOfProduction: 294.00, grossMargin: 872.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.8, costOfProduction: 177.00, grossMargin: 738.00 },
      'Yearly avg': { cropType: '', yield: 5.8, costOfProduction: 235.50, grossMargin: 805.00 }
    }
  },
  {
    id: "field66",
    name: "The Bank North",
    size: 17.0,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.5, costOfProduction: 191.00, grossMargin: 788.00 },
      '2024': { cropType: 'Barley', yield: 7.4, costOfProduction: 178.00, grossMargin: 622.00 },
      'Yearly avg': { cropType: '', yield: 7.95, costOfProduction: 184.50, grossMargin: 705.00 }
    }
  },
  {
    id: "field67",
    name: "The Bank South",
    size: 16.8,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 5.3, costOfProduction: 257.00, grossMargin: 718.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.2, costOfProduction: 184.00, grossMargin: 768.00 },
      'Yearly avg': { cropType: '', yield: 6.75, costOfProduction: 220.50, grossMargin: 743.00 }
    }
  },
  {
    id: "field68",
    name: "The Slope East",
    size: 13.0,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.3, costOfProduction: 310.00, grossMargin: 910.00 },
      '2024': { cropType: 'Barley', yield: 7.1, costOfProduction: 173.00, grossMargin: 600.00 },
      'Yearly avg': { cropType: '', yield: 5.7, costOfProduction: 241.50, grossMargin: 755.00 }
    }
  },
  {
    id: "field69",
    name: "The Slope West",
    size: 12.8,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.1, costOfProduction: 183.00, grossMargin: 760.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.0, costOfProduction: 300.00, grossMargin: 880.00 },
      'Yearly avg': { cropType: '', yield: 6.05, costOfProduction: 241.50, grossMargin: 820.00 }
    }
  },
  {
    id: "field70",
    name: "The Plain North",
    size: 26.0,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 7.6, costOfProduction: 181.00, grossMargin: 632.00 },
      '2024': { cropType: 'Beans', yield: 5.4, costOfProduction: 259.00, grossMargin: 708.00 },
      'Yearly avg': { cropType: '', yield: 6.5, costOfProduction: 220.00, grossMargin: 670.00 }
    }
  },
  {
    id: "field71",
    name: "The Plain South",
    size: 25.8,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.5, costOfProduction: 314.00, grossMargin: 915.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.3, costOfProduction: 186.00, grossMargin: 770.00 },
      'Yearly avg': { cropType: '', yield: 6.4, costOfProduction: 250.00, grossMargin: 842.50 }
    }
  },
  {
    id: "field72",
    name: "The Expanse East",
    size: 33.0,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.8, costOfProduction: 196.00, grossMargin: 800.00 },
      '2024': { cropType: 'Barley', yield: 7.6, costOfProduction: 182.00, grossMargin: 635.00 },
      'Yearly avg': { cropType: '', yield: 8.2, costOfProduction: 189.00, grossMargin: 717.50 }
    }
  },
  {
    id: "field73",
    name: "The Expanse West",
    size: 32.8,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 5.7, costOfProduction: 263.00, grossMargin: 728.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.7, costOfProduction: 193.00, grossMargin: 788.00 },
      'Yearly avg': { cropType: '', yield: 7.2, costOfProduction: 228.00, grossMargin: 758.00 }
    }
  },
  {
    id: "field74",
    name: "The Stretch North",
    size: 20.8,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.6, costOfProduction: 316.00, grossMargin: 922.00 },
      '2024': { cropType: 'Barley', yield: 7.3, costOfProduction: 177.00, grossMargin: 612.00 },
      'Yearly avg': { cropType: '', yield: 5.95, costOfProduction: 246.50, grossMargin: 767.00 }
    }
  },
  {
    id: "field75",
    name: "The Stretch South",
    size: 20.6,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.4, costOfProduction: 188.00, grossMargin: 778.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.2, costOfProduction: 306.00, grossMargin: 892.00 },
      'Yearly avg': { cropType: '', yield: 6.3, costOfProduction: 247.00, grossMargin: 835.00 }
    }
  },
  {
    id: "field76",
    name: "The Corner North-East",
    size: 5.8,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 6.7, costOfProduction: 166.00, grossMargin: 562.00 },
      '2024': { cropType: 'Beans', yield: 4.6, costOfProduction: 244.00, grossMargin: 668.00 },
      'Yearly avg': { cropType: '', yield: 5.65, costOfProduction: 205.00, grossMargin: 615.00 }
    }
  },
  {
    id: "field77",
    name: "The Corner North-West",
    size: 5.6,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 3.7, costOfProduction: 292.00, grossMargin: 868.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.7, costOfProduction: 175.00, grossMargin: 732.00 },
      'Yearly avg': { cropType: '', yield: 5.7, costOfProduction: 233.50, grossMargin: 800.00 }
    }
  },
  {
    id: "field78",
    name: "The Corner South-East",
    size: 5.4,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 7.8, costOfProduction: 177.00, grossMargin: 735.00 },
      '2024': { cropType: 'Barley', yield: 6.6, costOfProduction: 164.00, grossMargin: 558.00 },
      'Yearly avg': { cropType: '', yield: 7.2, costOfProduction: 170.50, grossMargin: 646.50 }
    }
  },
  {
    id: "field79",
    name: "The Corner South-West",
    size: 5.2,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 4.5, costOfProduction: 241.00, grossMargin: 662.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.5, costOfProduction: 171.00, grossMargin: 718.00 },
      'Yearly avg': { cropType: '', yield: 6.0, costOfProduction: 206.00, grossMargin: 690.00 }
    }
  },
  {
    id: "field80",
    name: "The Patch North",
    size: 4.3,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 3.6, costOfProduction: 290.00, grossMargin: 862.00 },
      '2024': { cropType: 'Barley', yield: 6.5, costOfProduction: 162.00, grossMargin: 552.00 },
      'Yearly avg': { cropType: '', yield: 5.05, costOfProduction: 226.00, grossMargin: 707.00 }
    }
  },
  {
    id: "field81",
    name: "The Patch South",
    size: 4.1,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 7.6, costOfProduction: 173.00, grossMargin: 728.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 3.8, costOfProduction: 295.00, grossMargin: 870.00 },
      'Yearly avg': { cropType: '', yield: 5.7, costOfProduction: 234.00, grossMargin: 799.00 }
    }
  },
  {
    id: "field82",
    name: "The Patch East",
    size: 3.9,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 6.4, costOfProduction: 160.00, grossMargin: 548.00 },
      '2024': { cropType: 'Beans', yield: 4.4, costOfProduction: 239.00, grossMargin: 658.00 },
      'Yearly avg': { cropType: '', yield: 5.4, costOfProduction: 199.50, grossMargin: 603.00 }
    }
  },
  {
    id: "field83",
    name: "The Patch West",
    size: 3.7,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 3.5, costOfProduction: 287.00, grossMargin: 858.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.4, costOfProduction: 169.00, grossMargin: 712.00 },
      'Yearly avg': { cropType: '', yield: 5.45, costOfProduction: 228.00, grossMargin: 785.00 }
    }
  },
  {
    id: "field84",
    name: "The Strip North-East",
    size: 8.7,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.0, costOfProduction: 180.00, grossMargin: 750.00 },
      '2024': { cropType: 'Barley', yield: 6.9, costOfProduction: 168.00, grossMargin: 588.00 },
      'Yearly avg': { cropType: '', yield: 7.45, costOfProduction: 174.00, grossMargin: 669.00 }
    }
  },
  {
    id: "field85",
    name: "The Strip North-West",
    size: 8.5,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 4.8, costOfProduction: 247.00, grossMargin: 678.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.9, costOfProduction: 178.00, grossMargin: 740.00 },
      'Yearly avg': { cropType: '', yield: 6.35, costOfProduction: 212.50, grossMargin: 709.00 }
    }
  },
  {
    id: "field86",
    name: "The Strip South-East",
    size: 8.3,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.1, costOfProduction: 303.00, grossMargin: 885.00 },
      '2024': { cropType: 'Barley', yield: 6.8, costOfProduction: 167.00, grossMargin: 582.00 },
      'Yearly avg': { cropType: '', yield: 5.45, costOfProduction: 235.00, grossMargin: 733.50 }
    }
  },
  {
    id: "field87",
    name: "The Strip South-West",
    size: 8.1,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 7.9, costOfProduction: 179.00, grossMargin: 742.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 3.9, costOfProduction: 297.00, grossMargin: 872.00 },
      'Yearly avg': { cropType: '', yield: 5.9, costOfProduction: 238.00, grossMargin: 807.00 }
    }
  },
  {
    id: "field88",
    name: "The Plot North",
    size: 2.7,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 6.3, costOfProduction: 158.00, grossMargin: 542.00 },
      '2024': { cropType: 'Beans', yield: 4.3, costOfProduction: 237.00, grossMargin: 652.00 },
      'Yearly avg': { cropType: '', yield: 5.3, costOfProduction: 197.50, grossMargin: 597.00 }
    }
  },
  {
    id: "field89",
    name: "The Plot South",
    size: 2.5,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 3.4, costOfProduction: 285.00, grossMargin: 852.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.3, costOfProduction: 167.00, grossMargin: 708.00 },
      'Yearly avg': { cropType: '', yield: 5.35, costOfProduction: 226.00, grossMargin: 780.00 }
    }
  },
  {
    id: "field90",
    name: "The Plot East",
    size: 2.3,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 7.5, costOfProduction: 171.00, grossMargin: 722.00 },
      '2024': { cropType: 'Barley', yield: 6.2, costOfProduction: 156.00, grossMargin: 538.00 },
      'Yearly avg': { cropType: '', yield: 6.85, costOfProduction: 163.50, grossMargin: 630.00 }
    }
  },
  {
    id: "field91",
    name: "The Plot West",
    size: 2.1,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 4.2, costOfProduction: 235.00, grossMargin: 648.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 7.2, costOfProduction: 165.00, grossMargin: 702.00 },
      'Yearly avg': { cropType: '', yield: 5.7, costOfProduction: 200.00, grossMargin: 675.00 }
    }
  },
  {
    id: "field92",
    name: "The Triangle North",
    size: 9.7,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.2, costOfProduction: 306.00, grossMargin: 892.00 },
      '2024': { cropType: 'Barley', yield: 7.0, costOfProduction: 170.00, grossMargin: 590.00 },
      'Yearly avg': { cropType: '', yield: 5.6, costOfProduction: 238.00, grossMargin: 741.00 }
    }
  },
  {
    id: "field93",
    name: "The Triangle South",
    size: 9.5,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.1, costOfProduction: 182.00, grossMargin: 755.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.0, costOfProduction: 299.00, grossMargin: 875.00 },
      'Yearly avg': { cropType: '', yield: 6.05, costOfProduction: 240.50, grossMargin: 815.00 }
    }
  },
  {
    id: "field94",
    name: "The Triangle East",
    size: 9.3,
    rotations: { '2023': 'Barley', '2024': 'Beans' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 6.9, costOfProduction: 169.00, grossMargin: 585.00 },
      '2024': { cropType: 'Beans', yield: 4.8, costOfProduction: 248.00, grossMargin: 675.00 },
      'Yearly avg': { cropType: '', yield: 5.85, costOfProduction: 208.50, grossMargin: 630.00 }
    }
  },
  {
    id: "field95",
    name: "The Triangle West",
    size: 9.1,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.0, costOfProduction: 300.00, grossMargin: 880.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.0, costOfProduction: 180.00, grossMargin: 750.00 },
      'Yearly avg': { cropType: '', yield: 6.0, costOfProduction: 240.00, grossMargin: 815.00 }
    }
  },
  {
    id: "field96",
    name: "The Rectangle North",
    size: 18.7,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.3, costOfProduction: 187.00, grossMargin: 770.00 },
      '2024': { cropType: 'Barley', yield: 7.2, costOfProduction: 175.00, grossMargin: 610.00 },
      'Yearly avg': { cropType: '', yield: 7.75, costOfProduction: 181.00, grossMargin: 690.00 }
    }
  },
  {
    id: "field97",
    name: "The Rectangle South",
    size: 18.5,
    rotations: { '2023': 'Beans', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Beans', yield: 5.4, costOfProduction: 258.00, grossMargin: 715.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.4, costOfProduction: 189.00, grossMargin: 775.00 },
      'Yearly avg': { cropType: '', yield: 6.9, costOfProduction: 223.50, grossMargin: 745.00 }
    }
  },
  {
    id: "field98",
    name: "The Rectangle East",
    size: 18.3,
    rotations: { '2023': 'Oilseed Rape', '2024': 'Barley' },
    metrics: {
      '2023': { cropType: 'Oilseed Rape', yield: 4.4, costOfProduction: 311.00, grossMargin: 910.00 },
      '2024': { cropType: 'Barley', yield: 7.1, costOfProduction: 173.00, grossMargin: 605.00 },
      'Yearly avg': { cropType: '', yield: 5.75, costOfProduction: 242.00, grossMargin: 757.50 }
    }
  },
  {
    id: "field99",
    name: "The Rectangle West",
    size: 18.1,
    rotations: { '2023': 'Wheat(Winter)', '2024': 'Oilseed Rape' },
    metrics: {
      '2023': { cropType: 'Wheat(Winter)', yield: 8.2, costOfProduction: 185.00, grossMargin: 765.00 },
      '2024': { cropType: 'Oilseed Rape', yield: 4.1, costOfProduction: 302.00, grossMargin: 882.00 },
      'Yearly avg': { cropType: '', yield: 6.15, costOfProduction: 243.50, grossMargin: 823.50 }
    }
  },
  {
    id: "field100",
    name: "Centenary Field",
    size: 10.0,
    rotations: { '2023': 'Barley', '2024': 'Wheat(Winter)' },
    metrics: {
      '2023': { cropType: 'Barley', yield: 7.0, costOfProduction: 170.00, grossMargin: 600.00 },
      '2024': { cropType: 'Wheat(Winter)', yield: 8.0, costOfProduction: 180.00, grossMargin: 750.00 },
      'Yearly avg': { cropType: '', yield: 7.5, costOfProduction: 175.00, grossMargin: 675.00 }
    }
  }
];