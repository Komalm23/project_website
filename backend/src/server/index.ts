import express from 'express';
import cors from 'cors';
import routeRoutes from '../adapters/inbound/http/routes/routeRoutes';
import complianceRoutes from '../adapters/inbound/http/routes/complianceRoutes';
import bankingRoutes from '../adapters/inbound/http/routes/bankingRoutes';
import poolRoutes from '../adapters/inbound/http/routes/poolRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/routes', routeRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/banking', bankingRoutes);
app.use('/api/pools', poolRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

