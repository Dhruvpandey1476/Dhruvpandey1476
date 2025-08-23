import { Router } from 'express';
import type { Server as SocketIOServer } from 'socket.io';
import type { PrismaClient, ChargeType, BookingStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';

function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing token' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev') as any;
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export default function bookingRouter(io: SocketIOServer, prisma: PrismaClient) {
  const router = Router();

  router.post('/estimate', async (req, res) => {
    const { type, kWh, distanceKm } = req.body as { type: ChargeType; kWh: number; distanceKm: number };
    const base = type === 'DC' ? 18 : type === 'SWAP' ? 16 : 12; // cents per kWh
    const surge = 1.0; // placeholder for dynamic pricing
    const travelFee = Math.ceil(distanceKm) * 50; // cents per km
    const energyCost = Math.ceil(kWh) * base * surge;
    const estMinutes = Math.ceil(kWh * (type === 'DC' ? 3 : 8));
    res.json({ estCostCents: energyCost + travelFee, estMinutes });
  });

  router.post('/', authMiddleware, async (req: any, res) => {
    const { type, lat, lng, scheduledAt } = req.body as { type: ChargeType; lat: number; lng: number; scheduledAt?: string };
    const estimate = { estCostCents: 2500, estMinutes: 45 };

    const booking = await prisma.booking.create({
      data: {
        userId: req.userId,
        type,
        lat,
        lng,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        estCostCents: estimate.estCostCents,
        estMinutes: estimate.estMinutes
      }
    });

    io.emit('booking:new', { id: booking.id, lat, lng, type });
    res.json({ booking });
  });

  router.get('/:id', authMiddleware, async (req, res) => {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) return res.status(404).json({ error: 'Not found' });
    res.json({ booking });
  });

  router.post('/:id/status', async (req, res) => {
    const { status, vanId } = req.body as { status: BookingStatus; vanId?: string };
    const booking = await prisma.booking.update({ where: { id: req.params.id }, data: { status, vanId } });
    io.emit('booking:status', { id: booking.id, status, vanId });
    res.json({ booking });
  });

  return router;
}