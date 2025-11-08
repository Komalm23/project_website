import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import bankingRoutes from '../bankingRoutes';

const app = express();
app.use(express.json());
app.use('/api/banking', bankingRoutes);

describe('Banking Routes', () => {
  it('POST /banking/bank should require shipId and year', async () => {
    const res = await request(app).post('/api/banking/bank').send({});
    expect(res.status).toBe(400);
  });

  it('POST /banking/apply should require shipId and year', async () => {
    const res = await request(app).post('/api/banking/apply').send({});
    expect(res.status).toBe(400);
  });
});

