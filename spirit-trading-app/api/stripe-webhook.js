// Webhook Stripe — appelé automatiquement après un paiement réussi
// Sauvegarde le statut d'abonnement dans Firestore

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function verifyStripeSignature(rawBody, signature, secret) {
  // Vérification HMAC-SHA256 de la signature Stripe
  const encoder = new TextEncoder();
  const parts = signature.split(",");
  const tPart = parts.find(p => p.startsWith("t="));
  const v1Part = parts.find(p => p.startsWith("v1="));
  if (!tPart || !v1Part) return false;

  const timestamp = tPart.slice(2);
  const expectedSig = v1Part.slice(3);
  const payload = `${timestamp}.${rawBody.toString("utf8")}`;

  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const computed = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");

  return computed === expectedSig;
}

async function saveToFirestore(uid, plan, sessionId) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const serviceKey = process.env.FIREBASE_SERVICE_KEY; // JSON stringifié
  if (!projectId || !serviceKey) return;

  // Appel REST Firestore (sans SDK)
  const planExpiry = {
    monthly:  () => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d.toISOString(); },
    annual:   () => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString(); },
    lifetime: () => "9999-12-31T00:00:00.000Z",
  };

  const data = {
    fields: {
      plan:        { stringValue: plan },
      sessionId:   { stringValue: sessionId },
      activatedAt: { stringValue: new Date().toISOString() },
      expiresAt:   { stringValue: (planExpiry[plan] || planExpiry.monthly)() },
      active:      { booleanValue: true },
    }
  };

  // Auth via Google service account pour l'API Firestore
  const creds = JSON.parse(serviceKey);
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: await makeJWT(creds),
    }),
  });
  if (!tokenRes.ok) return;
  const { access_token } = await tokenRes.json();

  await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}/subscription/status`,
    {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
}

async function makeJWT(creds) {
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now, exp: now + 3600,
  }));
  const unsigned = `${header}.${payload}`;

  // Import RSA private key
  const pemBody = creds.private_key.replace(/-----.*?-----/g, "").replace(/\s/g, "");
  const keyData = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8", keyData, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${unsigned}.${sigB64}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) return res.status(500).json({ error: "Webhook secret manquant" });

  const rawBody = await getRawBody(req);
  const signature = req.headers["stripe-signature"] || "";

  const valid = await verifyStripeSignature(rawBody, signature, WEBHOOK_SECRET);
  if (!valid) return res.status(400).json({ error: "Signature invalide" });

  let event;
  try { event = JSON.parse(rawBody.toString("utf8")); }
  catch { return res.status(400).json({ error: "JSON invalide" }); }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const uid  = session.metadata?.firebase_uid;
    const plan = session.metadata?.plan;
    if (uid && plan) {
      await saveToFirestore(uid, plan, session.id);
    }
  }

  res.status(200).json({ received: true });
}
