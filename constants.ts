
import { LEDStrip, PSU, Voltage, LEDType, Controller, EthernetSwitch, MountingStructure, Cable, Fuse } from './types';

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
  { id: 's1', name: 'WS2812B 5V 60', voltage: Voltage.V5, type: LEDType.Addressable, wattsPerMeter: 18, ledsPerMeter: 60, pricePerMeter: 12.5, brand: 'BTF', ipRating: 'IP20' },
  { id: 's2', name: 'SK6812 5V RGBW', voltage: Voltage.V5, type: LEDType.RGBW, wattsPerMeter: 24, ledsPerMeter: 60, pricePerMeter: 22.0, brand: 'BTF', ipRating: 'IP20' },
  { id: 's3', name: 'WS2815 12V Ind.', voltage: Voltage.V12, type: LEDType.Addressable, wattsPerMeter: 14.4, ledsPerMeter: 60, pricePerMeter: 15.0, brand: 'MeanWell', ipRating: 'IP20' },
  { id: 's5', name: 'Outdoor RGB 24V', voltage: Voltage.V24, type: LEDType.RGB, wattsPerMeter: 12.0, ledsPerMeter: 60, pricePerMeter: 28.5, brand: 'OutdoorLED', ipRating: 'IP67' }
];

export const DEFAULT_PSUS: PSU[] = [
  { id: 'p1', name: 'LRS-350-5', voltage: Voltage.V5, maxWatts: 300, efficiency: 0.85, price: 45, brand: 'MeanWell', ipRating: 'IP20' },
  { id: 'p2', name: 'HLG-600H-24A', voltage: Voltage.V24, maxWatts: 600, efficiency: 0.96, price: 185, brand: 'MeanWell', ipRating: 'IP67' },
  { id: 'p3', name: 'LRS-350-12', voltage: Voltage.V12, maxWatts: 350, efficiency: 0.88, price: 48, brand: 'MeanWell', ipRating: 'IP20' }
];

export const DEFAULT_CONTROLLERS: Controller[] = [
  { id: 'c1', name: 'PixLite 16 MkII', type: 'ArtNet', ports: 16, maxPixelsPerPort: 1024, price: 350, brand: 'Advatek', ipRating: 'IP20' },
  { id: 'c2', name: 'Falcon F16v4', type: 'ArtNet', ports: 16, maxPixelsPerPort: 1024, price: 420, brand: 'Falcon', ipRating: 'IP20' },
  { id: 'c3', name: 'DMX 4Ch 24V', type: 'DMX', ports: 4, maxPixelsPerPort: 512, price: 85, brand: 'Generic', ipRating: 'IP65' }
];

export const DEFAULT_MOUNTINGS: MountingStructure[] = [
  { id: 'm1', name: 'Alu V-Channel 1m', material: 'Aluminum', pricePerMeter: 15.0, weightPerMeter: 0.4, ipRating: 'IP20' },
  { id: 'm2', name: 'Plastic Flex Profile', material: 'PVC', pricePerMeter: 8.5, weightPerMeter: 0.2, ipRating: 'IP67' },
  { id: 'm3', name: 'Heavy Duty Steel Truss', material: 'Steel', pricePerMeter: 45.0, weightPerMeter: 2.5, ipRating: 'IP20' }
];

export const DEFAULT_CABLES: Cable[] = [
  { id: 'cb1', name: '18AWG DC Power', gauge: 18, maxAmps: 7, pricePerMeter: 1.2, ipRating: 'IP20' },
  { id: 'cb2', name: '14AWG Heavy DC', gauge: 14, maxAmps: 15, pricePerMeter: 2.5, ipRating: 'IP67' },
  { id: 'cb3', name: '10AWG Trunk Power', gauge: 10, maxAmps: 30, pricePerMeter: 4.8, ipRating: 'IP67' }
];

export const DEFAULT_FUSES: Fuse[] = [
  { id: 'f1', name: '5A Blade Fuse', rating: 5, type: 'Automotive', price: 0.5 },
  { id: 'f2', name: '10A Blade Fuse', rating: 10, type: 'Automotive', price: 0.5 },
  { id: 'f3', name: '15A Blade Fuse', rating: 15, type: 'Automotive', price: 0.5 },
  { id: 'f4', name: '20A Industrial', rating: 20, type: 'Fast', price: 2.5 }
];

export const DEFAULT_SWITCHES: EthernetSwitch[] = [
  { id: 'sw1', name: 'Industrial 8-Port Switch', ports: 8, isPoE: false, price: 150 },
  { id: 'sw2', name: 'Netgear GS108LP (PoE)', ports: 8, isPoE: true, price: 90 }
];
