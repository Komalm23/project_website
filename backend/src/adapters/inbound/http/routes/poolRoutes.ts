import { Router, Request, Response } from 'express';
import { poolingService } from '@shared/di/services';

const router = Router();

// POST /pools
router.post('/', async (req: Request, res: Response) => {
  try {
    const { members, year } = req.body;

    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: 'members array is required' });
    }

    if (!year) {
      return res.status(400).json({ error: 'year is required' });
    }

    const result = await poolingService.createPool({ members, year });
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
