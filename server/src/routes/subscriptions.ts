import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';

export default function subscriptionsRouter(prisma: PrismaClient) {
  const router = Router();

  router.get('/plans', async (_req, res) => {
    // For now return static plans if DB not seeded
    const plans = await prisma.subscriptionPlan.findMany().catch(() => []);
    if (plans.length === 0) {
      return res.json({ plans: [
        { id: 'basic', name: 'Basic 50', includedKWh: 50, priceCents: 1999 },
        { id: 'standard', name: 'Standard 120', includedKWh: 120, priceCents: 4499 },
        { id: 'pro', name: 'Pro 250', includedKWh: 250, priceCents: 7999 }
      ] });
    }
    res.json({ plans });
  });

  router.get('/me', async (req: any, res) => {
    if (!req.userId) return res.json({ active: false });
    const sub = await prisma.userSubscription.findFirst({ where: { userId: req.userId, active: true } }).catch(() => null);
    res.json({ active: !!sub, subscription: sub });
  });

  return router;
}