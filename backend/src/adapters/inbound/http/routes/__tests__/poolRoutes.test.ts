import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import poolRoutes from '../poolRoutes';

const app = express();
app.use(express.json());
app.use('/api/pools', poolRoutes);

describe('Pool Routes', () => {
  it('POST /pools should require members and year', async () => {
    const res = await request(app).post('/api/pools').send({});
    expect(res.status).toBe(400);
  });

  it('POST /pools should require members array', async () => {
    const res = await request(app).post('/api/pools').send({ year: 2024 });
    expect(res.status).toBe(400);
  });
});

