import { Router, Request, Response } from 'express';
import { routeService, comparisonUseCase } from '@shared/di/services';

const router = Router();

// GET /routes
router.get('/', async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.vesselType) filters.vesselType = req.query.vesselType as string;
    if (req.query.fuelType) filters.fuelType = req.query.fuelType as string;
    if (req.query.year) filters.year = parseInt(req.query.year as string);

    const routes = await routeService.getRoutes(filters);
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /routes/:routeId/baseline
router.post('/:routeId/baseline', async (req: Request, res: Response) => {
  try {
    await routeService.setBaseline(req.params.routeId);
    res.json({ success: true, message: 'Baseline set successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// GET /routes/comparison
router.get('/comparison', async (req: Request, res: Response) => {
  try {
    const data = await comparisonUseCase.computeComparison();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
