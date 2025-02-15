export interface CropData {
  name: string;
  area: string;
  marketRange: {
    min: number;
    max: number;
    current: number;
  };
  cop: {
    value: number;
    hasWarning?: boolean;
  };
  cost: {
    value: number;
  };
  yield: {
    value: number;
    hasWarning?: boolean;
  };
  gm: {
    value: number;
    isInfo?: boolean;
  };
}

export const cropData: CropData[] = [
  {
    name: "Wheat (Winter)",
    area: "612.34 ha",
    marketRange: { min: 45.17, max: 152.14, current: 98 },
    cop: { value: 97.12, hasWarning: true },
    cost: { value: 769.43 },
    yield: { value: 8.30, hasWarning: true },
    gm: { value: 1048.74 }
  },
  {
    name: "Field Bean (Spring)",
    area: "233.47 ha",
    marketRange: { min: 54.88, max: 160.19, current: 80 },
    cop: { value: 62.78 },
    cost: { value: 346.63 },
    yield: { value: 5.55 },
    gm: { value: 873.58 }
  },
  {
    name: "Barley (Winter)",
    area: "171.40 ha",
    marketRange: { min: 38.72, max: 142.97, current: 90 },
    cop: { value: 71.24 },
    cost: { value: 630.34 },
    yield: { value: 10.11 },
    gm: { value: 986.63 }
  },
  {
    name: "Linseed",
    area: "155.18 ha",
    marketRange: { min: 129.00, max: 244.60, current: 200 },
    cop: { value: 244.60 },
    cost: { value: 478.46 },
    yield: { value: 1.99 },
    gm: { value: 343.07 }
  },
  {
    name: "Oats (Spring)",
    area: "122.79 ha",
    marketRange: { min: 35.46, max: 103.22, current: 70 },
    cop: { value: 53.26 },
    cost: { value: 380.49 },
    yield: { value: 7.14 },
    gm: { value: 1048.28 }
  }
];