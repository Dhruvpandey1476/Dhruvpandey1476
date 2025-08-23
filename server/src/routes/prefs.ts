import { Router } from 'express';
import type { PrismaClient, ChargeType } from '@prisma/client';
import { requireRole } from '../middleware/auth.js';

export default function prefsRouter(prisma: PrismaClient) {
  const router = Router();

  router.get('/me', requireRole('USER', 'PROVIDER', 'ADMIN'), async (req: any, res) => {
    const pref = await prisma.userPreference.findUnique({ where: { userId: req.userId } });
    res.json({ preference: pref });
  });

  router.post('/me', requireRole('USER', 'PROVIDER', 'ADMIN'), async (req: any, res) => {
    const { preferredChargeType, lowBatteryReminder } = req.body as { preferredChargeType?: ChargeType; lowBatteryReminder?: boolean };
    const pref = await prisma.userPreference.upsert({ where: { userId: req.userId }, update: { preferredChargeType, lowBatteryReminder }, create: { userId: req.userId, preferredChargeType, lowBatteryReminder: lowBatteryReminder ?? true } });
    res.json({ preference: pref });
  });

  router.get('/rewards', requireRole('USER', 'PROVIDER', 'ADMIN'), async (req: any, res) => {
    const entries = await prisma.rewardLedger.findMany({ where: { userId: req.userId } });
    const total = entries.reduce((s, e) => s + e.points, 0);
    res.json({ totalPoints: total, entries });
  });

  return router;
}