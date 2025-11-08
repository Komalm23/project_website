import { Router, Request, Response } from 'express';
import { bankingService } from '@shared/di/services';

const router = Router();

// GET /banking/records?shipId&year
router.get('/records', async (req: Request, res: Response) => {
  try {
    const shipId = req.query.shipId as string;
    const year = parseInt(req.query.year as string);

    if (!shipId || !year) {
      return res.status(400).json({ error: 'shipId and year are required' });
    }

    const records = await bankingService.getBankRecords(shipId, year);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /banking/bank
router.post('/bank', async (req: Request, res: Response) => {
  try {
    const { shipId, year } = req.body;

    if (!shipId || !year) {
      return res.status(400).json({ error: 'shipId and year are required' });
    }

    const result = await bankingService.bankSurplus({ shipId, year });
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /banking/apply
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const { shipId, year } = req.body;

    if (!shipId || !year) {
      return res.status(400).json({ error: 'shipId and year are required' });
    }

    const result = await bankingService.applyBankedSurplus({ shipId, year });
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
