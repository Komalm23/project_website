export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number; // Compliance Balance in gCO₂eq
  cbBefore?: number;
  applied?: number;
  cbAfter?: number;
}

export interface AdjustedCB {
  shipId: string;
  adjustedCB: number;
  cb_before: number;
}

