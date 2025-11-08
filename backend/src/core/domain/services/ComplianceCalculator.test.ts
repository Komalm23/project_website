import { describe, it, expect } from 'vitest';
import { ComplianceCalculator } from './ComplianceCalculator';

describe('ComplianceCalculator', () => {
  describe('calculateEnergyInScope', () => {
    it('should calculate energy in scope correctly', () => {
      const fuelConsumption = 5000; // t
      const energy = ComplianceCalculator.calculateEnergyInScope(fuelConsumption);
      expect(energy).toBe(5000 * 41000); // 205,000,000 MJ
    });
  });

  describe('calculateCB', () => {
    it('should calculate positive CB for surplus', () => {
      const actualIntensity = 85.0; // Below target
      const fuelConsumption = 5000;
      const cb = ComplianceCalculator.calculateCB(actualIntensity, fuelConsumption);
      expect(cb).toBeGreaterThan(0); // Surplus
    });

    it('should calculate negative CB for deficit', () => {
      const actualIntensity = 95.0; // Above target
      const fuelConsumption = 5000;
      const cb = ComplianceCalculator.calculateCB(actualIntensity, fuelConsumption);
      expect(cb).toBeLessThan(0); // Deficit
    });

    it('should calculate zero CB when at target', () => {
      const targetIntensity = 89.3368;
      const fuelConsumption = 5000;
      const cb = ComplianceCalculator.calculateCB(targetIntensity, fuelConsumption, targetIntensity);
      expect(cb).toBe(0);
    });
  });
});

