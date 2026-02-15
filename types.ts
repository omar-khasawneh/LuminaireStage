
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

// Added missing EthernetSwitch interface
export interface EthernetSwitch {
  id: string;
  name: string;
  ports: number;
  poe: boolean;
  price: number;
  brand: string;
  ipRating: string;
}

export interface MountingStructure {
  id: string;
  name: string;
  material: string;
  pricePerMeter: number;
  weightPerMeter: number;
}

export interface Cable {
  id: string;
  name: string;
  gauge: number; // AWG
  maxAmps: number;
  pricePerMeter: number;
}

export interface Fuse {
  id: string;
  name: string;
  rating: number; // Amps
  type: string;
  price: number;
}

export interface FixtureDefinition {
  id: string;
  name: string;
  stripId: string;
  length: number;
  mountingId: string;
  shape: 'Line' | 'Rectangle' | 'Circle' | 'Triangle';
}

export interface Zone {
  id: string;
  name: string;
  fixtureDefinitionId: string;
  subsystemId: string;
  wireLength: number; // Set in Step 3
  wireGauge: number;  // Adjusted in Step 4
  fuseId: string;     // Selected in Step 4
  x: number;
  y: number;
  rotation: number;
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
  subsystems: Subsystem[];
  zones: Zone[];
  fixtureDefinitions: FixtureDefinition[];
  // Added missing ethernetSwitches property
  ethernetSwitches: EthernetSwitch[];
  venueType: 'Indoor' | 'Outdoor' | 'Club' | 'Arena';
  safetyFactor: number;
}