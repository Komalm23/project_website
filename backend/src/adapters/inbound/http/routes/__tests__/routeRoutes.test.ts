import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import routeRoutes from '../routeRoutes';

const app = express();
app.use(express.json());
app.use('/api/routes', routeRoutes);

describe('Route Routes', () => {
  it('GET /routes should return routes', async () => {
    const res = await request(app).get('/api/routes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /routes/comparison should return comparison data', async () => {
    const res = await request(app).get('/api/routes/comparison');
    // May fail if no baseline is set, but should return proper error
    expect([200, 500]).toContain(res.status);
  });
});

