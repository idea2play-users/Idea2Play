import Stripe from "stripe";
import { db } from "./firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { projectId } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Game Development Order",
            description: `Project ID: ${projectId}`
          },
          unit_amount: 5000 // $50
        },
        quantity: 1
      }
    ],
    success_url: `${req.headers.origin}/success.html`,
    cancel_url: `${req.headers.origin}/cancel.html`,
    metadata: {
      projectId
    }
  });

  res.json({ id: session.id });
}
