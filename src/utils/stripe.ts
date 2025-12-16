
import Stripe from 'stripe';
import { IEnrollment } from '../interfaces/enrollment/IEnrollment'; 

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
 apiVersion: "2025-08-27.basil",
   appInfo: {
        name: "SKILLSEED",
    }
});





export async function createCheckoutSession(
  courseName: string,
  coursePrice: number,
  metadata: { courseId: string; userId: string }
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    mode: 'payment',//One-time charge (like buying a course)
    submit_type: 'auto',//Stripe automatically finishes the payment when user click pay button
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: courseName,
          },
          unit_amount: Math.round(coursePrice * 100),
        },
      },
    ],
success_url: `${process.env.FRONTEND_URL}/enroll-success?session_id={CHECKOUT_SESSION_ID}&courseId=${metadata.courseId}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-failed?courseId=${metadata.courseId}`, 
    metadata,
    ui_mode: 'hosted',
  });
}