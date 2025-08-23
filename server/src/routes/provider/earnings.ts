import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';
import { requireRole } from '../../middleware/auth.js';

export default function providerEarningsRouter(prisma: PrismaClient) {
  const router = Router();

  router.get('/summary', requireRole('PROVIDER'), async (req: any, res) => {
    const period = (req.query.period as string) || 'day';
    const since = period === 'week' ? daysAgo(7) : period === 'month' ? daysAgo(30) : daysAgo(1);
    const completed = await prisma.booking.findMany({ where: { status: 'COMPLETED', updatedAt: { gte: since } } });
    const revenue = completed.reduce((s, b) => s + (b.actualCostCents ?? b.estCostCents), 0);
    res.json({ period, revenueCents: revenue, count: completed.length });
  });

  return router;
}

function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d; }