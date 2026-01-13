import Stripe from "stripe";
import { db } from "./firebaseAdmin";
import bodyParser from "body-parser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];

  const rawBody = await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => (data += chunk));
    req.on("end", () => resolve(data));
  });

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await db.collection("orders").add({
      projectId: session.metadata.projectId,
      amount: session.amount_total,
      status: "paid",
      createdAt: new Date()
    });
  }

  res.json({ received: true });
}
