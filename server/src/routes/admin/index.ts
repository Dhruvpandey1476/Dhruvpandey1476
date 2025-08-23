import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';
import { requireRole } from '../../middleware/auth.js';

export default function adminRouter(prisma: PrismaClient) {
  const router = Router();

  router.use(requireRole('ADMIN'));

  // Fleet
  router.get('/fleet', async (_req, res) => {
    const vans = await prisma.van.findMany({ include: { driver: true } });
    res.json({ vans });
  });
  router.post('/fleet', async (req, res) => {
    const { identifier, capacityKWh } = req.body as { identifier: string; capacityKWh: number };
    const van = await prisma.van.create({ data: { identifier, capacityKWh, availableKWh: capacityKWh } });
    res.json({ van });
  });

  // Pricing config
  router.get('/pricing', async (_req, res) => {
    const cfg = await prisma.pricingConfig.findUnique({ where: { id: 'default' } });
    res.json({ config: cfg });
  });
  router.post('/pricing', async (req, res) => {
    const { baseAcCents, baseDcCents, baseSwapCents, perKmCents, surgeMultiplier } = req.body as any;
    const cfg = await prisma.pricingConfig.upsert({
      where: { id: 'default' },
      update: { baseAcCents, baseDcCents, baseSwapCents, perKmCents, surgeMultiplier },
      create: { id: 'default', baseAcCents, baseDcCents, baseSwapCents, perKmCents, surgeMultiplier }
    });
    res.json({ config: cfg });
  });

  // Analytics
  router.get('/analytics', async (_req, res) => {
    const [users, orders] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count()
    ]);
    const revenue = await prisma.booking.findMany({ where: { status: 'COMPLETED' }, select: { actualCostCents: true, estCostCents: true } });
    const sum = revenue.reduce((s, b) => s + (b.actualCostCents ?? b.estCostCents), 0);
    res.json({ users, orders, revenueCents: sum, co2SavedTons: 21.3 });
  });

  // Heatmap (bucket by ~0.05 degrees)
  router.get('/heatmap', async (_req, res) => {
    const bookings = await prisma.booking.findMany({ select: { lat: true, lng: true } });
    const buckets: Record<string, number> = {};
    for (const b of bookings) {
      const key = `${Math.round(b.lng / 0.05) * 0.05},${Math.round(b.lat / 0.05) * 0.05}`;
      buckets[key] = (buckets[key] || 0) + 1;
    }
    res.json({ buckets });
  });

  return router;
}