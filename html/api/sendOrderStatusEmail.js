import nodemailer from "nodemailer";
import { db } from "./firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ error: "Missing data" });
    }

    const snap = await db.collection("orders").doc(orderId).get();
    if (!snap.exists) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = snap.data();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: order.email,
      from: `"Idea2Play" <${process.env.ADMIN_EMAIL}>`,
      subject: `Order Update: ${status.replace("_", " ")}`,
      text: `Hello ${order.name}, your order is now ${status}.`,
    });

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Email failed" });
  }
}
