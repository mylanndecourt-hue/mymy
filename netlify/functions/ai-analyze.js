exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Clé API non configurée. Ajoute ANTHROPIC_API_KEY dans les variables d'environnement Netlify." }) };
  }

  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: "Invalid JSON" }; }

  const { stats } = body;

  const prompt = `Tu es un coach de trading professionnel. Analyse les statistiques de trading suivantes et donne des conseils personnalisés, directs et actionnables en français. Sois comme un mentor bienveillant mais honnête.

STATISTIQUES DU TRADER :
${JSON.stringify(stats, null, 2)}

Réponds en 3 sections bien séparées avec ces titres exacts :
**CE QUI MARCHE**
(2-3 phrases sur les points forts identifiés dans les données)

**CE QUE TU DOIS AMÉLIORER**
(2-3 phrases sur les axes de progression prioritaires)

**CE QUE TU DOIS ABSOLUMENT ÉVITER**
(2-3 phrases sur les comportements ou patterns qui te coûtent de l'argent)

Termine par une phrase de conclusion motivante et personnalisée basée sur les données.
Utilise le tutoiement. Sois précis, cite les chiffres réels. Évite les généralités.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Erreur API");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: data.content[0].text }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
