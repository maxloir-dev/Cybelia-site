import { Router, Request, Response } from 'express';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

router.post('/create-payment-intent', async (req: Request, res: Response) => {
  const { amount } = req.body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ error: 'Montant invalide' });
    return;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
