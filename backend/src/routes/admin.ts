import { Router, Request, Response } from 'express';

export const adminRouter = Router();

adminRouter.get('/stats', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      totalDonors: 4820,
      activeRequests: 4,
      fulfilledRequests: 3640,
      averageResponseMinutes: 18.4,
      citiesCovered: 28,
      complianceScore: '100% Medical Blood Bank Compliant'
    }
  });
});
