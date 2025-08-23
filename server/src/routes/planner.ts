import { Router } from 'express';

const router = Router();

router.post('/trip', async (req, res) => {
  const { batteryPercent, trips } = req.body as { batteryPercent: number; trips: Array<{ startTime: string; distanceKm: number }>; };
  const dailyKm = trips.reduce((s, t) => s + t.distanceKm, 0);
  const consumptionPerKm = 0.18; // kWh/km placeholder
  const neededKWh = dailyKm * consumptionPerKm;
  const capacityKWh = 60; // assume average EV
  const currentKWh = (batteryPercent / 100) * capacityKWh;
  const deficit = Math.max(0, neededKWh - currentKWh);

  const plan = deficit > 0
    ? [{ windowStart: new Date().toISOString(), kWh: Math.ceil(deficit), type: deficit > 20 ? 'DC' : 'AC', suggestion: 'Charge before first trip' }]
    : [];

  res.json({ recommended: plan });
});

export default router;