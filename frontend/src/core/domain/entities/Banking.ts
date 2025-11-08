export interface ComplianceBalance {
  cb_before: number;
  applied: number;
  cb_after: number;
  year: number;
}

export interface BankingRequest {
  year: number;
}

export interface BankingResponse {
  success: boolean;
  message?: string;
  cb_before?: number;
  cb_after?: number;
}

