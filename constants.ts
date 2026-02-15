
import { LEDStrip, PSU, Voltage, LEDType, Controller, MountingStructure, Cable, Fuse, EthernetSwitch } from './types';

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
  { id: 's1', name: 'WS2812B 5V 60led', voltage: Voltage.V5, type: LEDType.Addressable, wattsPerMeter: 18, ledsPerMeter: 60, pricePerMeter: 12, brand: 'Generic', ipRating: 'IP20' },
  { id: 's2', name: 'WS2815 12V Ind.', voltage: Voltage.V12, type: LEDType.Addressable, wattsPerMeter: 14.4, ledsPerMeter: 60, pricePerMeter: 15, brand: 'MeanWell', ipRating: 'IP65' },
  { id: 's3', name: 'RGB 24V COB', voltage: Voltage.V24, type: LEDType.RGB, wattsPerMeter: 12, ledsPerMeter: 480, pricePerMeter: 18, brand: 'ProLED', ipRating: 'IP20' }
];

export const DEFAULT_PSUS: PSU[] = [
  { id: 'p1', name: 'LRS-350-5', voltage: Voltage.V5, maxWatts: 300, efficiency: 0.85, price: 45, brand: 'MeanWell', ipRating: 'IP20' },
  { id: 'p2', name: 'HLG-600H-24A', voltage: Voltage.V24, maxWatts: 600, efficiency: 0.96, price: 185, brand: 'MeanWell', ipRating: 'IP67' }
];

export const DEFAULT_CONTROLLERS: Controller[] = [
  { id: 'c1', name: 'PixLite 16 MkII', type: 'ArtNet', ports: 16, maxPixelsPerPort: 1024, price: 350, brand: 'Advatek' },
  { id: 'c2', name: 'SP108E WiFi', type: 'SPI', ports: 1, maxPixelsPerPort: 2048, price: 25, brand: 'Generic' }
];

// Added missing DEFAULT_SWITCHES export
export const DEFAULT_SWITCHES: EthernetSwitch[] = [
  { id: 'sw1', name: 'Gigabit PoE Switch', ports: 8, poe: true, price: 120, brand: 'Ubiquiti', ipRating: 'IP20' }
];

export const DEFAULT_MOUNTINGS: MountingStructure[] = [
  { id: 'm1', name: 'Alu V-Profile 1m', material: 'Aluminum', pricePerMeter: 12, weightPerMeter: 0.4 },
  { id: 'm2', name: 'Plastic Clip Set', material: 'PVC', pricePerMeter: 2, weightPerMeter: 0.05 }
];

export const DEFAULT_CABLES: Cable[] = [
  { id: 'cb1', name: '18AWG Flat DC', gauge: 18, maxAmps: 7, pricePerMeter: 1.5 },
  { id: 'cb2', name: '14AWG Heavy DC', gauge: 14, maxAmps: 15, pricePerMeter: 3.5 },
  { id: 'cb3', name: '12AWG Ultra DC', gauge: 12, maxAmps: 20, pricePerMeter: 5.0 }
];

export const DEFAULT_FUSES: Fuse[] = [
  { id: 'f1', name: '5A Blade', rating: 5, type: 'Automotive', price: 0.5 },
  { id: 'f2', name: '10A Blade', rating: 10, type: 'Automotive', price: 0.5 },
  { id: 'f3', name: '20A Industrial', rating: 20, type: 'Fast', price: 2.5 }
];