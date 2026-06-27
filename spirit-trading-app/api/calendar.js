const ALLOWED_ORIGINS = [
  "https://www.spirit-trading.com",
  "https://spirit-trading.com",
  "https://spirit-trading-app.vercel.app",
];

// Simple in-memory rate limiter (per serverless instance)
const rateLimitMap = new Map();
const RATE_LIMIT = 20;
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

function todayParis() {
  return new Date().toLocaleDateString("fr-CA", { timeZone: "Europe/Paris" });
}

async function translateTitles(titles) {
  const DEEPL_KEY = process.env.DEEPL_KEY;
  if (!DEEPL_KEY || !titles.length) return null;
  try {
    const body = titles.map(t => `text=${encodeURIComponent(t)}`).join("&")
      + "&target_lang=FR&source_lang=EN";
    const r = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${DEEPL_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) return null;
    const data = await r.json();
    const map = {};
    titles.forEach((t, i) => { map[t] = data.translations[i]?.text || t; });
    return map;
  } catch { return null; }
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Trop de requêtes, réessaie dans une minute." });
  }

  const today = todayParis();
  const FINNHUB_KEY = process.env.FINNHUB_KEY;

  let events = null;
  try {
    const r = await fetch("https://nfs.faireconomy.media/ff_calendar_thisweek.json", {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000),
    });
    if (r.ok) {
      const all = await r.json();
      events = all.filter(a => {
        if (!a.date) return false;
        const d = new Date(a.date);
        return !isNaN(d) && d.toLocaleDateString("fr-CA", { timeZone: "Europe/Paris" }) === today;
      });
    }
  } catch {}

  if ((!events || !events.length) && FINNHUB_KEY) {
    try {
      const r = await fetch(
        `https://finnhub.io/api/v1/calendar/economic?from=${today}&to=${today}&token=${FINNHUB_KEY}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (r.ok) {
        const d = await r.json();
        events = (d.economicCalendar || []).map(a => ({
          title: a.event, country: a.country, date: a.time,
          impact: a.impact, forecast: a.estimate, previous: a.prev, actual: a.actual,
        }));
      }
    } catch {}
  }

  if (!events) return res.status(500).json({ error: "no data" });

  const titles = [...new Set(events.map(e => e.title).filter(Boolean))];
  const map = await translateTitles(titles);
  if (map) events = events.map(e => ({ ...e, title: map[e.title] || e.title }));

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(events);
}
