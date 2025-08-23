import { Router } from 'express';

const router = Router();

router.post('/create-intent', async (req, res) => {
  const { amountCents, currency } = req.body as { amountCents: number; currency?: string };
  const cur = currency || 'inr';

  if (!process.env.STRIPE_SECRET) {
    return res.json({ provider: 'mock', clientSecret: 'pi_mock_secret', amountCents, currency: cur });
  }

  try {
    // Lazy import stripe only if available in env; avoid bundling when unused
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: '2024-06-20' as any });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: cur,
      automatic_payment_methods: { enabled: true }
    });
    return res.json({ provider: 'stripe', clientSecret: paymentIntent.client_secret });
  } catch (e) {
    return res.status(500).json({ error: 'Payment init failed' });
  }
});

router.post('/status', async (_req, res) => {
  res.json({ status: 'processing' });
});

export default router;