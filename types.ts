
export enum Voltage {
  V5 = 5,
  V12 = 12,
  V24 = 24,
  V48 = 48
}

export enum LEDType {
  RGB = 'RGB',
  RGBW = 'RGBW',
  Addressable = 'Addressable',
  White = 'Single Color'
}

export interface LEDStrip {
  id: string;
  name: string;
  voltage: Voltage;
  type: LEDType;
  wattsPerMeter: number;
  ledsPerMeter: number;
  pricePerMeter: number;
  brand: string;
  ipRating: string;
}

export interface PSU {
  id: string;
  name: string;
  voltage: Voltage;
  maxWatts: number;
  efficiency: number;
  price: number;
  brand: string;
  ipRating: string;
}

export interface Controller {
  id: string;
  name: string;
  type: 'ArtNet' | 'sACN' | 'DMX' | 'SPI';
  ports: number;
  maxPixelsPerPort: number;
  price: number;
  brand: string;
}

export interface EthernetSwitch {
  id: string;
  name: string;
  ports: number;
  isPoE: boolean;
  price: number;
}

export interface Zone {
  id: string;
  name: string;
  stripId: string;
  length: number; 
  wireGauge: number; 
  wireLength: number;
  x: number; 
  y: number; 
  rotation: number;
  subsystemId: string;
}

export interface Subsystem {
  id: string;
  name: string;
  psuId: string;
  controllerId: string;
  x: number;
  y: number;
}

export interface Project {
  id: string;
  name: string;
  venueType: 'Indoor' | 'Outdoor' | 'Club' | 'Arena';
  subsystems: Subsystem[];
  zones: Zone[];
  ethernetSwitches: { id: string, name: string, x: number, y: number }[];
  safetyFactor: number;
}
