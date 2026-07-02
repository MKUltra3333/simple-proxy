export type Market = {
  id: string;
  name: string;
  town: string;
  lat: number;
  lon: number;
  transport: number;
};

export type Produce = {
  name: string;
  price: number;
  chg: number;
  unit: string;
  icon: string;
  hist: number[];
  crop: 'annual' | 'tree';
  blight: boolean;
  exportCrop?: boolean;
};

export type Buyer = {
  name: string;
  type: string;
  crops: string[];
  phone: string;
  volume: string;
  town: string;
};

export const markets: Market[] = [
  {
    id: 'gak',
    name: 'Gakoromone',
    town: 'Meru town',
    lat: -0.0463,
    lon: 37.6559,
    transport: 7,
  },
  {
    id: 'mak',
    name: 'Makutano',
    town: 'Makutano',
    lat: 0.054,
    lon: 37.646,
    transport: 10,
  },
  {
    id: 'maua',
    name: 'Maua',
    town: 'Igembe',
    lat: 0.2333,
    lon: 37.938,
    transport: 15,
  },
];

export const produce: Produce[] = [
  {
    name: 'Tomatoes',
    price: 62,
    chg: 14.2,
    unit: 'kg',
    icon: 'TO',
    hist: [52, 54, 53, 57, 59, 60, 62],
    crop: 'annual',
    blight: true,
  },
  {
    name: 'Irish potatoes',
    price: 48,
    chg: 6.1,
    unit: 'kg',
    icon: 'IP',
    hist: [44, 45, 45, 46, 47, 47, 48],
    crop: 'annual',
    blight: true,
  },
  {
    name: 'Hass avocado',
    price: 70,
    chg: 9,
    unit: 'kg',
    icon: 'HA',
    hist: [60, 62, 64, 65, 67, 68, 70],
    crop: 'tree',
    blight: false,
    exportCrop: true,
  },
  {
    name: 'French beans',
    price: 110,
    chg: -5.2,
    unit: 'kg',
    icon: 'FB',
    hist: [122, 119, 117, 114, 113, 111, 110],
    crop: 'annual',
    blight: false,
    exportCrop: true,
  },
  {
    name: 'Bananas',
    price: 35,
    chg: 2.8,
    unit: 'kg',
    icon: 'BA',
    hist: [33, 34, 34, 33, 35, 34, 35],
    crop: 'tree',
    blight: false,
  },
  {
    name: 'Maize',
    price: 55,
    chg: -2,
    unit: 'kg',
    icon: 'MZ',
    hist: [58, 57, 57, 56, 56, 55, 55],
    crop: 'annual',
    blight: false,
  },
];

export const buyers: Buyer[] = [
  {
    name: 'Naivas Supermarket - Meru',
    type: 'Supermarket',
    crops: ['Tomatoes', 'Cabbage', 'Bananas'],
    phone: '254700111222',
    volume: 'Daily, 3-6 crates',
    town: 'Meru town',
  },
  {
    name: 'Kenya Avocado Exporters',
    type: 'Exporter',
    crops: ['Hass avocado', 'French beans'],
    phone: '254700333444',
    volume: 'Weekly, 1-4 tonnes',
    town: 'Makutano',
  },
  {
    name: 'Gakoromone broker - J. Kirimi',
    type: 'Broker',
    crops: ['Irish potatoes', 'Maize', 'Tomatoes'],
    phone: '254700555666',
    volume: 'Farm-gate collection',
    town: 'Meru town',
  },
  {
    name: 'Maua Miraa Dealers Assoc.',
    type: 'Miraa market',
    crops: ['Miraa', 'Bananas'],
    phone: '254700777888',
    volume: 'Daily, same-day freight',
    town: 'Igembe',
  },
];

export const cropMeta: Record<
  string,
  { kind: 'annual' | 'tree'; blight: boolean; ideal: string }
> = {
  Tomatoes: {
    kind: 'annual',
    blight: true,
    ideal: 'Plant Oct-Nov during short rains',
  },
  'Irish potatoes': {
    kind: 'annual',
    blight: true,
    ideal: 'Plant Mar-Apr and Oct-Nov',
  },
  'French beans': {
    kind: 'annual',
    blight: false,
    ideal: 'Stagger every 2 weeks for export',
  },
  Maize: {
    kind: 'annual',
    blight: false,
    ideal: 'Plant at onset of long rains',
  },
  'Hass avocado': {
    kind: 'tree',
    blight: false,
    ideal: 'Harvest by oil maturity',
  },
  Bananas: {
    kind: 'tree',
    blight: false,
    ideal: 'Year-round; keep mulched',
  },
};

export const fallbackWeather = [
  {
    cond: 'sun',
    hi: 23,
    lo: 12,
    rain: 0,
    pop: 5,
    hum: 55,
    humMax: 62,
    wind: 9,
    smIndex: 50,
    et0: 4.2,
  },
  {
    cond: 'fog',
    hi: 22,
    lo: 11,
    rain: 1,
    pop: 35,
    hum: 78,
    humMax: 88,
    wind: 6,
    smIndex: 48,
    et0: 2.8,
  },
  {
    cond: 'cloud',
    hi: 21,
    lo: 12,
    rain: 2,
    pop: 45,
    hum: 74,
    humMax: 84,
    wind: 8,
    smIndex: 47,
    et0: 3.1,
  },
  {
    cond: 'fog',
    hi: 22,
    lo: 11,
    rain: 1,
    pop: 30,
    hum: 76,
    humMax: 86,
    wind: 5,
    smIndex: 45,
    et0: 2.9,
  },
  {
    cond: 'sun',
    hi: 24,
    lo: 13,
    rain: 0,
    pop: 10,
    hum: 52,
    humMax: 60,
    wind: 11,
    smIndex: 41,
    et0: 4.6,
  },
  {
    cond: 'sun',
    hi: 24,
    lo: 13,
    rain: 0,
    pop: 5,
    hum: 50,
    humMax: 58,
    wind: 12,
    smIndex: 38,
    et0: 4.7,
  },
  {
    cond: 'cloud',
    hi: 22,
    lo: 12,
    rain: 3,
    pop: 50,
    hum: 72,
    humMax: 82,
    wind: 9,
    smIndex: 40,
    et0: 3,
  },
];

export const fallbackLabels = [
  'Today',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
  'Mon',
  'Tue',
];
