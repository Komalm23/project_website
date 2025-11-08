import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import complianceRoutes from '../complianceRoutes';

const app = express();
app.use(express.json());
app.use('/api/compliance', complianceRoutes);

describe('Compliance Routes', () => {
  it('GET /compliance/cb should require shipId and year', async () => {
    const res = await request(app).get('/api/compliance/cb');
    expect(res.status).toBe(400);
  });

  it('GET /compliance/adjusted-cb should require shipId or year', async () => {
    const res = await request(app).get('/api/compliance/adjusted-cb');
    expect(res.status).toBe(400);
  });
});

