export interface Route {
  id?: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO₂e/MJ
  fuelConsumption: number; // t
  distance: number; // km
  totalEmissions: number; // t
  isBaseline: boolean;
}

