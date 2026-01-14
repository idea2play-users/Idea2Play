import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { projectId } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: "Game Order" },
        unit_amount: 5000,
      },
      quantity: 1,
    }],
    success_url: `${req.headers.origin}/success.html`,
    cancel_url: `${req.headers.origin}/cancel.html`,
    metadata: { projectId },
  });

  res.json({ id: session.id });
}
