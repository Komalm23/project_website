import { PoolingRepository } from '@core/ports/outbound/PoolingRepository';
import { AdjustedCB, PoolRequest, PoolResponse } from '@core/domain/entities/Pooling';
import { apiRequest } from '@shared/config/api';

export class PoolingApiClient implements PoolingRepository {
  async fetchAdjustedCB(year: number): Promise<AdjustedCB[]> {
    return apiRequest<AdjustedCB[]>(`/compliance/adjusted-cb?year=${year}`);
  }

  async createPool(request: PoolRequest): Promise<PoolResponse> {
    return apiRequest<PoolResponse>('/pools', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

