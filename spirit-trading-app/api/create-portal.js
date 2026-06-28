import { verifyFirebaseToken } from "./_auth.js";

const ALLOWED_ORIGINS = [
  "https://www.spirit-trading.com",
  "https://spirit-trading.com",
  "https://spirit-trading-app.vercel.app",
];

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await verifyFirebaseToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: "Non authentifié" });

  const { customerId } = req.body || {};
  if (!customerId) return res.status(400).json({ error: "customerId manquant" });

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) return res.status(500).json({ error: "Stripe non configuré" });

  const returnUrl = `${origin || "https://www.spirit-trading.com"}/compte`;

  try {
    const r = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ customer: customerId, return_url: returnUrl }),
    });

    if (!r.ok) {
      const err = await r.json();
      return res.status(502).json({ error: err.error?.message || "Erreur Stripe" });
    }

    const session = await r.json();
    return res.status(200).json({ url: session.url });
  } catch {
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
