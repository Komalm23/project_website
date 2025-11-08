export interface AdjustedCB {
  shipId: string;
  adjustedCB: number;
  cb_before: number;
}

export interface PoolMember {
  shipId: string;
  cb_before: number;
  cb_after: number;
}

export interface PoolRequest {
  members: string[];
  year: number;
}

export interface PoolResponse {
  success: boolean;
  message?: string;
  members?: PoolMember[];
  poolSum?: number;
}

