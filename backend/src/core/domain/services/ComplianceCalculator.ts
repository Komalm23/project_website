// Core formulas for Compliance Balance calculation

const TARGET_INTENSITY_2025 = 89.3368; // gCO₂e/MJ
const ENERGY_PER_TONNE = 41000; // MJ/t

export class ComplianceCalculator {
  /**
   * Calculate energy in scope (MJ)
   * Energy = fuelConsumption × 41,000 MJ/t
   */
  static calculateEnergyInScope(fuelConsumption: number): number {
    return fuelConsumption * ENERGY_PER_TONNE;
  }

  /**
   * Calculate Compliance Balance
   * CB = (Target - Actual) × Energy in scope
   * Positive CB = Surplus, Negative CB = Deficit
   */
  static calculateCB(
    actualIntensity: number,
    fuelConsumption: number,
    targetIntensity: number = TARGET_INTENSITY_2025
  ): number {
    const energyInScope = this.calculateEnergyInScope(fuelConsumption);
    return (targetIntensity - actualIntensity) * energyInScope;
  }

  /**
   * Get target intensity for a given year
   */
  static getTargetIntensity(year: number): number {
    // For now, using 2025 target for all years
    // Can be extended with year-based logic
    return TARGET_INTENSITY_2025;
  }
}

