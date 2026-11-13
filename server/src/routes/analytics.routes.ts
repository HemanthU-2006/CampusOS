import { Router, Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

// GET /api/search?q=
router.get(
  '/search',
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const results = await AnalyticsService.searchAll(query);
    ApiResponse.success(res, { results }, 'Search results');
  })
);

// GET /api/analytics
router.get(
  '/analytics',
  authenticate,
  roleGuard('admin', 'faculty'),
  asyncHandler(async (_req: Request, res: Response) => {
    const analytics = await AnalyticsService.getCampusAnalytics();
    ApiResponse.success(res, { analytics }, 'Campus analytics report');
  })
);

export default router;
