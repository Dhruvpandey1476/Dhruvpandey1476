import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';

export default function vansRouter(prisma: PrismaClient) {
  const router = Router();

  router.get('/', async (_req, res) => {
    const vans = await prisma.van.findMany({ where: { isActive: true }, include: { driver: true } });
    res.json({ vans });
  });

  router.post('/', async (req, res) => {
    const { identifier, capacityKWh } = req.body as { identifier: string; capacityKWh: number };
    const van = await prisma.van.create({ data: { identifier, capacityKWh, availableKWh: capacityKWh } });
    res.json({ van });
  });

  router.post('/:id/assign', async (req, res) => {
    const { providerProfileId } = req.body as { providerProfileId: string };
    const van = await prisma.van.update({ where: { id: req.params.id }, data: { driverId: providerProfileId } });
    res.json({ van });
  });

  return router;
}