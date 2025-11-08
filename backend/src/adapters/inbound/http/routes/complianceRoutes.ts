import { Router, Request, Response } from 'express';
import { complianceService } from '@shared/di/services';

const router = Router();

// GET /compliance/cb?shipId&year
router.get('/cb', async (req: Request, res: Response) => {
  try {
    const shipId = req.query.shipId as string;
    const year = parseInt(req.query.year as string);

    if (!shipId || !year) {
      return res.status(400).json({ error: 'shipId and year are required' });
    }

    const balance = await complianceService.getComplianceBalance(shipId, year);
    res.json({
      cb_before: balance.cbBefore || balance.cbGco2eq,
      applied: balance.applied || 0,
      cb_after: balance.cbAfter || balance.cbGco2eq,
      year: balance.year,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /compliance/adjusted-cb?shipId&year
router.get('/adjusted-cb', async (req: Request, res: Response) => {
  try {
    const shipId = req.query.shipId as string;
    const year = parseInt(req.query.year as string);

    if (!year) {
      return res.status(400).json({ error: 'year is required' });
    }

    if (shipId) {
      // Single ship
      const adjusted = await complianceService.getAdjustedCB(shipId, year);
      res.json(adjusted);
    } else {
      // All ships for year
      const adjusted = await complianceService.getAllAdjustedCB(year);
      res.json(adjusted);
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
