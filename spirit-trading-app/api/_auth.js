// Vérifie un Firebase ID token via l'API Google publique (sans firebase-admin)
export async function verifyFirebaseToken(authHeader) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  if (!token) return null;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  try {
    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!r.ok) return null;
    const data = await r.json();
    const user = data.users?.[0];
    if (!user?.localId) return null;
    return { uid: user.localId, email: user.email };
  } catch {
    return null;
  }
}
