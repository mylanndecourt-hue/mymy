const DEEPL_KEY = "3ec647e3-dafb-43b2-883f-a53d126cbf29:fx";

function todayParis() {
  return new Date().toLocaleDateString("fr-CA", { timeZone: "Europe/Paris" });
}

async function translateTitles(titles) {
  if (!titles.length) return null;
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
  const today = todayParis();

  // Fetch + filter pour aujourd'hui uniquement
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

  if (!events || !events.length) {
    // Fallback Finnhub (déjà filtré par date)
    try {
      const r = await fetch(`https://finnhub.io/api/v1/calendar/economic?from=${today}&to=${today}&token=d8v816hr01quam156hfgd8v816hr01quam156hg0`,
        { signal: AbortSignal.timeout(5000) });
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

  // Traduire uniquement les titres du jour (~10 max)
  const titles = [...new Set(events.map(e => e.title).filter(Boolean))];
  const map = await translateTitles(titles);
  if (map) events = events.map(e => ({ ...e, title: map[e.title] || e.title }));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(events);
}
