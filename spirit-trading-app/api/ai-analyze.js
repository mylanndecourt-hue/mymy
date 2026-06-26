export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { stats, apiKey: bodyKey } = req.body || {};
  const ANTHROPIC_KEY = bodyKey || process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) {
    return res.status(500).json({ error: "Clé API manquante — saisis ta clé Anthropic dans l'app" });
  }
  if (!stats) return res.status(400).json({ error: "Données manquantes" });

  const prompt = `Tu es un coach de trading professionnel. Analyse ces statistiques de trading et donne des conseils personnalisés en français, structurés en 3 sections claires :

## ✅ Ce qui marche
[2-3 points positifs concrets basés sur les chiffres]

## 📈 Ce que je dois améliorer
[2-3 axes d'amélioration précis]

## 🎯 Actions concrètes
[2-3 actions à mettre en place dès maintenant]

Statistiques :
- Total trades : ${stats.totalTrades}
- Win rate : ${stats.winRate}%
- P&L moyen/trade : ${stats.avgPnl}$
- R/R moyen : ${stats.avgRR || "N/A"}
- Respect du plan : ${stats.pctRespectPlan || "N/A"}%
${stats.setupStats?.length ? `- Meilleur setup : ${stats.setupStats[0]?.setup} (${stats.setupStats[0]?.winRate}% WR, ${stats.setupStats[0]?.pnl}$)` : ""}
${stats.jourStats?.length ? `- Meilleur jour : ${stats.jourStats[0]?.jour} (${stats.jourStats[0]?.pnl}$)` : ""}
${stats.tradesImpulsifs ? `- Trades impulsifs : ${stats.tradesImpulsifs} (PnL moy: ${stats.avgPnlImpulsif}$ vs ${stats.avgPnlNonImpulsif}$ non-impulsif)` : ""}

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
      return res.status(500).json({ error: `API Anthropic: ${r.status} — ${err.slice(0, 200)}` });
    }

    const data = await r.json();
    const text = data.content?.[0]?.text || "";
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
