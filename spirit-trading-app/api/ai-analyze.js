const ALLOWED_ORIGINS = [
  "https://www.spirit-trading.com",
  "https://spirit-trading.com",
  "https://spirit-trading-app.vercel.app",
];

// Simple in-memory rate limiter (per serverless instance)
const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  rateLimitMap.set(ip, entry);
  return false;
}

function sanitizeNumber(val, fallback = 0) {
  const n = parseFloat(val);
  return isFinite(n) ? n : fallback;
}

function sanitizeString(val, maxLen = 100) {
  if (typeof val !== "string") return "";
  return val.replace(/[<>]/g, "").slice(0, maxLen);
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Trop de requêtes, réessaie dans une minute." });
  }

  const { stats, apiKey: bodyKey } = req.body || {};
  const ANTHROPIC_KEY = bodyKey || process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_KEY) {
    return res.status(400).json({ error: "Clé API manquante — saisis ta clé Anthropic dans l'app" });
  }
  if (!ANTHROPIC_KEY.startsWith("sk-ant-")) {
    return res.status(400).json({ error: "Clé API invalide" });
  }
  if (!stats || typeof stats !== "object") {
    return res.status(400).json({ error: "Données manquantes" });
  }

  // Validate and sanitize all stats fields
  const totalTrades = sanitizeNumber(stats.totalTrades);
  const winRate = sanitizeNumber(stats.winRate);
  const avgPnl = sanitizeNumber(stats.avgPnl);
  const avgRR = stats.avgRR != null ? sanitizeNumber(stats.avgRR) : null;
  const pctRespectPlan = stats.pctRespectPlan != null ? sanitizeNumber(stats.pctRespectPlan) : null;
  const tradesImpulsifs = stats.tradesImpulsifs != null ? sanitizeNumber(stats.tradesImpulsifs) : null;
  const avgPnlImpulsif = sanitizeNumber(stats.avgPnlImpulsif);
  const avgPnlNonImpulsif = sanitizeNumber(stats.avgPnlNonImpulsif);

  const setupStats = Array.isArray(stats.setupStats) ? stats.setupStats.slice(0, 5).map(s => ({
    setup: sanitizeString(s?.setup),
    winRate: sanitizeNumber(s?.winRate),
    pnl: sanitizeNumber(s?.pnl),
  })) : [];

  const jourStats = Array.isArray(stats.jourStats) ? stats.jourStats.slice(0, 7).map(j => ({
    jour: sanitizeString(j?.jour, 20),
    pnl: sanitizeNumber(j?.pnl),
  })) : [];

  const prompt = `Tu es un coach de trading professionnel. Analyse ces statistiques de trading et donne des conseils personnalisés en français, structurés en 3 sections claires :

## ✅ Ce qui marche
[2-3 points positifs concrets basés sur les chiffres]

## 📈 Ce que je dois améliorer
[2-3 axes d'amélioration précis]

## 🎯 Actions concrètes
[2-3 actions à mettre en place dès maintenant]

Statistiques :
- Total trades : ${totalTrades}
- Win rate : ${winRate}%
- P&L moyen/trade : ${avgPnl}$
- R/R moyen : ${avgRR ?? "N/A"}
- Respect du plan : ${pctRespectPlan ?? "N/A"}%
${setupStats.length ? `- Meilleur setup : ${setupStats[0].setup} (${setupStats[0].winRate}% WR, ${setupStats[0].pnl}$)` : ""}
${jourStats.length ? `- Meilleur jour : ${jourStats[0].jour} (${jourStats[0].pnl}$)` : ""}
${tradesImpulsifs != null ? `- Trades impulsifs : ${tradesImpulsifs} (PnL moy: ${avgPnlImpulsif}$ vs ${avgPnlNonImpulsif}$ non-impulsif)` : ""}

Sois direct, concis et bienveillant. Maximum 250 mots.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(502).json({ error: `Erreur API: ${r.status}` });
    }

    const data = await r.json();
    const text = data.content?.[0]?.text || "";
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
