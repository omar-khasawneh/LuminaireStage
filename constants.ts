
import { LEDStrip, PSU, Voltage, LEDType, Controller, EthernetSwitch, Cable, Fuse, Mounting } from './types';

export const WIRE_RESISTANCE: Record<number, number> = {
  10: 0.00327,
  12: 0.00521,
  14: 0.00828,
  16: 0.0132,
  18: 0.0209,
  20: 0.0333,
  22: 0.053,
  24: 0.0842
};

export const DEFAULT_STRIPS: LEDStrip[] = [
  { id: 's1', name: 'WS2812B Econ', voltage: Voltage.V5, type: LEDType.Addressable, wattsPerMeter: 18, ledsPerMeter: 60, pricePerMeter: 12.5, brand: 'generic', ipRating: 'IP20', maxRunLength: 4 },
  { id: 's2', name: 'SK6812 Pro', voltage: Voltage.V5, type: LEDType.Addressable, wattsPerMeter: 24, ledsPerMeter: 60, pricePerMeter: 22.0, brand: 'BTF-Lighting', ipRating: 'IP20', maxRunLength: 3 },
  { id: 's3', name: 'Hi-Power 24V RGB', voltage: Voltage.V24, type: LEDType.RGB, wattsPerMeter: 14.4, ledsPerMeter: 60, pricePerMeter: 15.0, brand: 'MeanWell', ipRating: 'IP20', maxRunLength: 10 },
  { id: 's5', name: 'Outdoor RGB 24V', voltage: Voltage.V24, type: LEDType.RGB, wattsPerMeter: 12.0, ledsPerMeter: 60, pricePerMeter: 28.5, brand: 'OutdoorLED', ipRating: 'IP67', maxRunLength: 15 }
];

export const DEFAULT_PSUS: PSU[] = [
  { id: 'p1', name: 'LRS-350-5 (Ind.)', voltage: Voltage.V5, maxWatts: 300, efficiency: 0.85, price: 45, brand: 'MeanWell', ipRating: 'IP20', formFactor: 'Enclosed' },
  { id: 'p2', name: 'HLG-600H-24A (Out.)', voltage: Voltage.V24, maxWatts: 600, efficiency: 0.96, price: 185, brand: 'MeanWell', ipRating: 'IP67', formFactor: 'Rainproof' }
];

export const DEFAULT_CONTROLLERS: Controller[] = [
  { id: 'c1', name: 'PixLite 16 MkII', type: 'ArtNet', ports: 16, maxPixelsPerPort: 1024, price: 350, brand: 'Advatek', ipRating: 'IP20' },
  { id: 'c2', name: 'Falcon F16v4 Outdoor', type: 'ArtNet', ports: 16, maxPixelsPerPort: 1024, price: 520, brand: 'Falcon', ipRating: 'IP65' }
];

export const DEFAULT_CABLES: Cable[] = [
  { id: 'cb1', name: '14AWG 2-Core Power', gauge: 14, cores: 2, pricePerMeter: 2.5, ipRating: 'IP20', type: 'Power' },
  { id: 'cb2', name: '12AWG Outdoor Power', gauge: 12, cores: 2, pricePerMeter: 4.8, ipRating: 'IP67', type: 'Power' },
  { id: 'cb3', name: 'Shielded Data Cat6', gauge: 23, cores: 8, pricePerMeter: 3.2, ipRating: 'IP65', type: 'Data' }
];

export const DEFAULT_FUSES: Fuse[] = [
  { id: 'f1', name: '5A Blade Fuse', rating: 5, type: 'Fast', price: 0.5 },
  { id: 'f2', name: '10A Blade Fuse', rating: 10, type: 'Fast', price: 0.5 },
  { id: 'f3', name: '20A Industrial', rating: 20, type: 'Slow', price: 4.5 }
];

export const DEFAULT_MOUNTING: Mounting[] = [
  { id: 'm1', name: 'Alu V-Profile 45deg', material: 'Aluminum', pricePerMeter: 12.0, heatDissipationFactor: 0.9, ipRating: 'IP20' },
  { id: 'm2', name: 'Plastic Flex Channel', material: 'Plastic', pricePerMeter: 4.5, heatDissipationFactor: 0.3, ipRating: 'IP67' }
];

export const DEFAULT_SWITCHES: EthernetSwitch[] = [
  { id: 'sw1', name: 'Industrial 8-Port Switch', ports: 8, isPoE: false, price: 150 },
  { id: 'sw2', name: 'Netgear GS108LP (PoE)', ports: 8, isPoE: true, price: 90 }
];
