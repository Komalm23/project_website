export interface Pool {
  id?: number;
  year: number;
  createdAt?: Date;
}

export interface PoolMember {
  poolId: number;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
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

