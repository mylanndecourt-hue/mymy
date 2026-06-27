import { verifyFirebaseToken } from "./_auth.js";

const ALLOWED_ORIGINS = [
  "https://www.spirit-trading.com",
  "https://spirit-trading.com",
  "https://spirit-trading-app.vercel.app",
];

const PLANS = {
  monthly:  { priceId: process.env.STRIPE_PRICE_MONTHLY,  mode: "subscription" },
  annual:   { priceId: process.env.STRIPE_PRICE_ANNUAL,   mode: "subscription" },
  lifetime: { priceId: process.env.STRIPE_PRICE_LIFETIME, mode: "payment" },
};

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Auth Firebase requise
  const user = await verifyFirebaseToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: "Non authentifié" });

  const { plan } = req.body || {};
  if (!plan || !PLANS[plan]) {
    return res.status(400).json({ error: "Plan invalide" });
  }

  const { priceId, mode } = PLANS[plan];
  if (!priceId) {
    return res.status(500).json({ error: "Price ID manquant — configure les variables d'environnement" });
  }

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) return res.status(500).json({ error: "Stripe non configuré" });

  const successUrl = `${origin || "https://www.spirit-trading.com"}/?payment=success&plan=${plan}`;
  const cancelUrl  = `${origin || "https://www.spirit-trading.com"}/?payment=cancelled`;

  try {
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[]": "card",
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        "mode": mode,
        "success_url": successUrl,
        "cancel_url": cancelUrl,
        "customer_email": user.email,
        "metadata[firebase_uid]": user.uid,
        "metadata[plan]": plan,
      }),
    });

    if (!r.ok) {
      const err = await r.json();
      return res.status(502).json({ error: err.error?.message || "Erreur Stripe" });
    }

    const session = await r.json();
    return res.status(200).json({ url: session.url });
  } catch (e) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
