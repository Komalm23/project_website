export interface BankEntry {
  id?: number;
  shipId: string;
  year: number;
  amountGco2eq: number;
  createdAt?: Date;
}

export interface BankingRequest {
  shipId: string;
  year: number;
}

export interface BankingResponse {
  success: boolean;
  message?: string;
  cb_before?: number;
  cb_after?: number;
}

