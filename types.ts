
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
  maxRunLength: number; // in meters before power injection
  cri?: number;
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
  formFactor: 'Enclosed' | 'DIN-Rail' | 'Rainproof';
}

export interface Controller {
  id: string;
  name: string;
  type: 'ArtNet' | 'sACN' | 'DMX' | 'SPI';
  ports: number;
  maxPixelsPerPort: number;
  price: number;
  brand: string;
  ipRating: string;
}

export interface Cable {
  id: string;
  name: string;
  gauge: number; // AWG
  cores: number;
  pricePerMeter: number;
  ipRating: string;
  type: 'Power' | 'Data' | 'Hybrid';
}

export interface Fuse {
  id: string;
  name: string;
  rating: number; // Amps
  type: 'Fast' | 'Slow' | 'Automotive';
  price: number;
}

export interface Mounting {
  id: string;
  name: string;
  material: 'Aluminum' | 'Plastic' | 'Steel';
  pricePerMeter: number;
  heatDissipationFactor: number; // 0 to 1
  ipRating: string;
}

export interface FixtureShape {
  id: string;
  name: string;
  shapeType: 'Rectangle' | 'Triangle' | 'Circle' | 'Custom';
  stripId: string;
  totalLength: number;
  mountingId: string;
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
  fixtureId: string; // References a custom fixture definition
  wireGauge: number; 
  wireLength: number;
  x: number; 
  y: number; 
  rotation: number;
  subsystemId: string;
  fuseId: string;
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
  fixtures: FixtureShape[];
  ethernetSwitches: { id: string, name: string, x: number, y: number }[];
  safetyFactor: number;
}
