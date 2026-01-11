import nodemailer from "nodemailer";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// --- Initialize Firebase Admin (only once)
if (!global._firebaseAdminInitialized) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
  global._firebaseAdminInitialized = true;
}

const db = getFirestore();

export default async function handler(req, res) {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ error: "Missing data" });
    }

    // 🔍 Get order data
    const orderRef = db.collection("orders").doc(orderId);
    const snap = await orderRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = snap.data();

    // ✉️ Email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    // 📬 Send email
    await transporter.sendMail({
      from: `"Idea2Play" <${process.env.ADMIN_EMAIL}>`,
      to: order.email,
      subject: `Your Idea2Play order is now ${status.replace("_", " ")}`,
      text: `
Hello ${order.name},

Your order for "${order.projectTitle}" has been updated.

Current status: ${status.replace("_", " ")}

Thank you for using Idea2Play!
`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email failed" });
  }
}
