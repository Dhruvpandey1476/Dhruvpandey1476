import { Router } from 'express';
import type { PrismaClient, BookingStatus } from '@prisma/client';
import { requireRole } from '../../middleware/auth.js';

export default function providerJobsRouter(prisma: PrismaClient) {
  const router = Router();

  router.get('/nearby', requireRole('PROVIDER'), async (req: any, res) => {
    const { lat, lng } = req.query as any;
    const latNum = Number(lat); const lngNum = Number(lng);
    const bookings = await prisma.booking.findMany({ where: { status: 'PENDING' }, take: 25 });
    const withDistance = bookings.map((b) => ({
      ...b,
      distanceKm: haversineKm({ lat: b.lng, lng: b.lat }, { lat: lngNum, lng: latNum })
    })).sort((a, b) => a.distanceKm - b.distanceKm);
    res.json({ bookings: withDistance.slice(0, 10) });
  });

  router.post('/:id/accept', requireRole('PROVIDER'), async (req: any, res) => {
    const { vanId } = req.body as { vanId: string };
    const booking = await prisma.booking.update({ where: { id: req.params.id }, data: { status: 'ACCEPTED', vanId } });
    res.json({ booking });
  });

  router.post('/:id/reject', requireRole('PROVIDER'), async (req, res) => {
    const booking = await prisma.booking.update({ where: { id: req.params.id }, data: { status: 'CANCELLED' } });
    res.json({ booking });
  });

  router.post('/:id/status', requireRole('PROVIDER'), async (req, res) => {
    const { status } = req.body as { status: BookingStatus };
    const booking = await prisma.booking.update({ where: { id: req.params.id }, data: { status } });
    res.json({ booking });
  });

  return router;
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}