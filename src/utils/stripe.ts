
import Stripe from 'stripe';
import { IEnrollment } from '../interfaces/enrollment/IEnrollment'; 

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
   appInfo: {
        name: "SKILLSEED",
    }
});

const CURRENCY = 'usd';

export function formatAmountForStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat([], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(0);
  const zeroDecimalCurrency = !parts.some(part => part.type === 'decimal');
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

export async function createCheckoutSession(
  courseName: string,
  coursePrice: number,
  metadata: { courseId: string; userId: string }
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    submit_type: 'auto',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: courseName,
          },
          unit_amount: formatAmountForStripe(coursePrice, CURRENCY),
        },
      },
    ],
success_url: `${process.env.FRONTEND_URL}/enroll-success?session_id={CHECKOUT_SESSION_ID}&courseId=${metadata.courseId}`,
    cancel_url: `${process.env.FRONTEND_URL}/courses`, // Adjust to specific course page if needed
    metadata,
    ui_mode: 'hosted',
  });
}