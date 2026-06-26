export const handler = async (event) => {
  const today = new Date().toISOString().slice(0, 10);
  const from = event.queryStringParameters?.from || today;
  const to   = event.queryStringParameters?.to   || today;

  const sources = [
    // Source 1 : nfs.faireconomy.media (miroir ForexFactory)
    async () => {
      const r = await fetch("https://nfs.faireconomy.media/ff_calendar_thisweek.json", {
        headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) throw new Error(`ff status ${r.status}`);
      const raw = await r.json();
      if (!Array.isArray(raw)) throw new Error("ff bad format");
      return raw.map(a => ({
        event:    a.title,
        country:  a.country,
        time:     a.date,
        impact:   a.impact === "High" ? "high" : a.impact === "Medium" ? "medium" : "low",
        estimate: a.forecast  || null,
        prev:     a.previous  || null,
        actual:   a.actual    || null,
        unit:     "",
        source:   "ff",
      }));
    },
    // Source 2 : Finnhub economic calendar
    async () => {
      const url = `https://finnhub.io/api/v1/calendar/economic?from=${from}&to=${to}&token=d8v816hr01quam156hfgd8v816hr01quam156hg0`;
      const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!r.ok) throw new Error(`fh status ${r.status}`);
      const data = await r.json();
      const list = data.economicCalendar || [];
      return list.map(a => ({
        event:    a.event,
        country:  a.country,
        time:     a.time,
        impact:   a.impact,
        estimate: a.estimate != null ? String(a.estimate) : null,
        prev:     a.prev     != null ? String(a.prev)     : null,
        actual:   a.actual   != null ? String(a.actual)   : null,
        unit:     a.unit || "",
        source:   "finnhub",
      }));
    },
  ];

  let lastErr = "unknown";
  for (const fn of sources) {
    try {
      const data = await fn();
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=1800",
        },
        body: JSON.stringify(data),
      };
    } catch (e) {
      lastErr = e.message;
      continue;
    }
  }

  return {
    statusCode: 500,
    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    body: JSON.stringify({ error: lastErr }),
  };
};
