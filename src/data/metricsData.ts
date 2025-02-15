import { MetricsData, Year } from '../types/analytics';

const createYearData = (perTonne: number, perHectare: number) => ({
  perTonne,
  perHectare
});

const createYearlyData = () => ({
  '2019': createYearData(0, 0),
  '2020': createYearData(0, 0),
  '2021': createYearData(0, 0),
  '2022': createYearData(150, 450),
  '2023': createYearData(165, 495),
  '2024': createYearData(180, 540),
  'Yearly avg': createYearData(165, 495)
});

export const metricsData: MetricsData = {
  costOfProduction: {
    '2019': createYearData(130, 390),
    '2020': createYearData(135, 405),
    '2021': createYearData(140, 420),
    '2022': createYearData(150, 450),
    '2023': createYearData(165, 495),
    '2024': createYearData(180, 540),
    'Yearly avg': createYearData(150, 450)
  },
  seed: {
    '2019': createYearData(45, 135),
    '2020': createYearData(48, 144),
    '2021': createYearData(50, 150),
    '2022': createYearData(52, 156),
    '2023': createYearData(55, 165),
    '2024': createYearData(58, 174),
    'Yearly avg': createYearData(51.33, 154)
  },
  fertiliser: {
    '2019': createYearData(120, 360),
    '2020': createYearData(125, 375),
    '2021': createYearData(130, 390),
    '2022': createYearData(135, 405),
    '2023': createYearData(140, 420),
    '2024': createYearData(145, 435),
    'Yearly avg': createYearData(132.5, 397.5)
  },
  chemicals: {
    '2019': createYearData(80, 240),
    '2020': createYearData(85, 255),
    '2021': createYearData(90, 270),
    '2022': createYearData(95, 285),
    '2023': createYearData(100, 300),
    '2024': createYearData(105, 315),
    'Yearly avg': createYearData(92.5, 277.5)
  },
  chemicalBreakdown: {
    traceElement: {
      '2019': createYearData(20, 60),
      '2020': createYearData(21, 63),
      '2021': createYearData(22, 66),
      '2022': createYearData(23, 69),
      '2023': createYearData(25, 75),
      '2024': createYearData(26, 78),
      'Yearly avg': createYearData(22.83, 68.5)
    },
    herbicide: {
      '2019': createYearData(25, 75),
      '2020': createYearData(27, 81),
      '2021': createYearData(29, 87),
      '2022': createYearData(31, 93),
      '2023': createYearData(32, 96),
      '2024': createYearData(34, 102),
      'Yearly avg': createYearData(29.67, 89)
    },
    fungicide: {
      '2019': createYearData(20, 60),
      '2020': createYearData(21, 63),
      '2021': createYearData(23, 69),
      '2022': createYearData(25, 75),
      '2023': createYearData(26, 78),
      '2024': createYearData(27, 81),
      'Yearly avg': createYearData(23.67, 71)
    },
    adjuvant: {
      '2019': createYearData(15, 45),
      '2020': createYearData(16, 48),
      '2021': createYearData(16, 48),
      '2022': createYearData(16, 48),
      '2023': createYearData(17, 51),
      '2024': createYearData(18, 54),
      'Yearly avg': createYearData(16.33, 49)
    }
  },
  grossMargin: {
    '2019': createYearData(850, 2550),
    '2020': createYearData(900, 2700),
    '2021': createYearData(950, 2850),
    '2022': createYearData(1000, 3000),
    '2023': createYearData(1050, 3150),
    '2024': createYearData(1100, 3300),
    'Yearly avg': createYearData(975, 2925)
  },
  cultivating: {
    '2019': createYearData(65, 195),
    '2020': createYearData(68, 204),
    '2021': createYearData(70, 210),
    '2022': createYearData(73, 219),
    '2023': createYearData(75, 225),
    '2024': createYearData(78, 234),
    'Yearly avg': createYearData(71.5, 214.5)
  },
  drilling: {
    '2019': createYearData(45, 135),
    '2020': createYearData(48, 144),
    '2021': createYearData(50, 150),
    '2022': createYearData(52, 156),
    '2023': createYearData(55, 165),
    '2024': createYearData(58, 174),
    'Yearly avg': createYearData(51.33, 154)
  },
  applications: {
    '2019': createYearData(35, 105),
    '2020': createYearData(37, 111),
    '2021': createYearData(39, 117),
    '2022': createYearData(41, 123),
    '2023': createYearData(43, 129),
    '2024': createYearData(45, 135),
    'Yearly avg': createYearData(40, 120)
  },
  harvesting: {
    '2019': createYearData(75, 225),
    '2020': createYearData(78, 234),
    '2021': createYearData(81, 243),
    '2022': createYearData(84, 252),
    '2023': createYearData(87, 261),
    '2024': createYearData(90, 270),
    'Yearly avg': createYearData(82.5, 247.5)
  },
  other: {
    '2019': createYearData(25, 75),
    '2020': createYearData(27, 81),
    '2021': createYearData(29, 87),
    '2022': createYearData(31, 93),
    '2023': createYearData(33, 99),
    '2024': createYearData(35, 105),
    'Yearly avg': createYearData(30, 90)
  },
  production: {
    '2019': createYearData(650, 1950),
    '2020': createYearData(675, 2025),
    '2021': createYearData(700, 2100),
    '2022': createYearData(725, 2175),
    '2023': createYearData(750, 2250),
    '2024': createYearData(775, 2325),
    'Yearly avg': createYearData(712.5, 2137.5)
  },
  yield: {
    '2019': createYearData(7.8, 23.4),
    '2020': createYearData(8.0, 24.0),
    '2021': createYearData(8.2, 24.6),
    '2022': createYearData(8.4, 25.2),
    '2023': createYearData(8.6, 25.8),
    '2024': createYearData(8.8, 26.4),
    'Yearly avg': createYearData(8.3, 24.9)
  },
  netMargin: {
    '2019': createYearData(200, 600),
    '2020': createYearData(225, 675),
    '2021': createYearData(250, 750),
    '2022': createYearData(275, 825),
    '2023': createYearData(300, 900),
    '2024': createYearData(325, 975),
    'Yearly avg': createYearData(262.5, 787.5)
  }
};

// Year-on-year metrics for the dashboard
export const yearOnYear = [
  {
    name: "Average Yield",
    value: "8.2 t/ha",
    trend: 5.2
  },
  {
    name: "Cost per Hectare",
    value: "£542.30",
    trend: -2.8
  },
  {
    name: "Gross Margin",
    value: "£986.45/ha",
    trend: 3.4
  },
  {
    name: "Total Revenue",
    value: "£2.1M",
    trend: 1.2
  }
];