import { Year } from '../types/analytics';

export interface FieldData {
  id: string;
  name: string;
  rotations: {
    [key in Year]?: string;
  };
  metrics: {
    [key in Year]: {
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
  }
];