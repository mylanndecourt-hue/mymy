import { useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged, signInWithPopup, getRedirectResult, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase.js";
import App from "./App.jsx";

const COLORS = {
  bg: "#0a0e1a", surface: "#111827", card: "#1a2235", border: "#1e2d45",
  cyan: "#00d4ff", green: "#00e5a0", text: "#e2e8f0", dim: "#94a3b8", muted: "#4b5e7a",
};

// Emails propriétaires — accès permanent sans paiement
const OWNER_EMAILS = ["mylanndecourt@gmail.com"];

const SAVE_DEBOUNCE = 2000;
let saveTimer = null;

async function getSubscriptionStatus(uid) {
  try {
    const ref = doc(db, "users", uid, "subscription", "status");
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    if (!data.active) return null;
    if (data.expiresAt && data.expiresAt !== "9999-12-31T00:00:00.000Z") {
      if (new Date(data.expiresAt) < new Date()) return null;
    }
    return data;
  } catch {
    return null;
  }
}

export default function AppShell() {
  const lang = localStorage.getItem("spirit_lang") || "fr";
  const fr = lang === "fr";

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cloudData, setCloudData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [subscription, setSubscription] = useState(null); // null | { plan, active, ... }
  const [subLoading, setSubLoading] = useState(false);

  // Auth form state
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  // Checkout state
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) { setSubscription(null); return; }
      // Owners get free access
      if (OWNER_EMAILS.includes(u.email)) { setSubscription({ active: true, plan: "owner" }); return; }
      // Check subscription
      setSubLoading(true);
      const sub = await getSubscriptionStatus(u.uid);
      setSubscription(sub);
      setSubLoading(false);
    });
    return unsub;
  }, []);

  // Load Firestore data when user is confirmed active
  const isActive = user && (OWNER_EMAILS.includes(user.email) || subscription?.active);

  useEffect(() => {
    if (!isActive) { setCloudData(null); return; }
    setDataLoading(true);
    const ref = doc(db, "users", user.uid, "journal", "data");
    getDoc(ref).then((snap) => {
      setCloudData(snap.exists() ? snap.data() : {});
      setDataLoading(false);
    }).catch(() => { setCloudData({}); setDataLoading(false); });
  }, [isActive, user?.uid]);

  const handleDataChange = useCallback((data) => {
    if (!user) return;
    setSaveStatus("saving");
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try {
        const ref = doc(db, "users", user.uid, "journal", "data");
        await setDoc(ref, data, { merge: false });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch { setSaveStatus("idle"); }
    }, SAVE_DEBOUNCE);
  }, [user]);

  const handleLogout = async () => { await signOut(auth); };

  // ── Auth handlers ──
  const handleGoogleLogin = () => {
    setAuthError("");
    signInWithPopup(auth, googleProvider).catch(err => {
      setAuthError(err.message);
    });
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthError(""); setAuthSuccess(""); setAuthBusy(true);
    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (authMode === "signup") {
        if (password !== confirmPassword) { setAuthError(fr ? "Les mots de passe ne correspondent pas." : "Passwords do not match."); setAuthBusy(false); return; }
        if (password.length < 6) { setAuthError(fr ? "Mot de passe trop court (6 caractères min)." : "Password too short (min 6 chars)."); setAuthBusy(false); return; }
        await createUserWithEmailAndPassword(auth, email, password);
      } else if (authMode === "reset") {
        await sendPasswordResetEmail(auth, email);
        setAuthSuccess(fr ? "Email de réinitialisation envoyé !" : "Reset email sent!");
        setAuthBusy(false); return;
      }
    } catch (err) {
      const msg = {
        "auth/user-not-found": fr ? "Aucun compte avec cet email." : "No account with this email.",
        "auth/wrong-password": fr ? "Mot de passe incorrect." : "Wrong password.",
        "auth/email-already-in-use": fr ? "Cet email est déjà utilisé." : "Email already in use.",
        "auth/invalid-email": fr ? "Adresse email invalide." : "Invalid email address.",
        "auth/too-many-requests": fr ? "Trop de tentatives. Réessaie plus tard." : "Too many attempts. Try later.",
        "auth/invalid-credential": fr ? "Email ou mot de passe incorrect." : "Incorrect email or password.",
      }[err.code] || err.message;
      setAuthError(msg);
    }
    setAuthBusy(false);
  };

  // ── Stripe checkout ──
  const handleCheckout = async (plan) => {
    if (!user) return;
    setCheckoutLoading(true); setCheckoutError("");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else setCheckoutError(data.error || "Erreur Stripe");
    } catch { setCheckoutError(fr ? "Erreur réseau" : "Network error"); }
    setCheckoutLoading(false);
  };

  // ── Screens ──

  if (authLoading) return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: COLORS.cyan, fontSize: 14 }}>{fr ? "Chargement..." : "Loading..."}</div>
    </div>
  );

  // Not logged in → auth screen
  if (!user) return <AuthScreen fr={fr} authMode={authMode} setAuthMode={setAuthMode} email={email} setEmail={setEmail} password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} authError={authError} authSuccess={authSuccess} authBusy={authBusy} onEmailAuth={handleEmailAuth} onGoogle={handleGoogleLogin} />;

  // Logged in but checking subscription
  if (subLoading) return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: COLORS.cyan, fontSize: 14 }}>{fr ? "Vérification de ton abonnement..." : "Checking subscription..."}</div>
    </div>
  );

  // Logged in but no active subscription → paywall
  if (user && !OWNER_EMAILS.includes(user.email) && !subscription?.active) {
    return <PaywallScreen fr={fr} user={user} onCheckout={handleCheckout} onLogout={handleLogout} loading={checkoutLoading} error={checkoutError} />;
  }

  // Loading data
  if (dataLoading || cloudData === null) return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: COLORS.cyan, fontSize: 14 }}>{fr ? "Chargement de tes données..." : "Loading your data..."}</div>
    </div>
  );

  return <App user={user} cloudData={cloudData} onDataChange={handleDataChange} saveStatus={saveStatus} onLogout={handleLogout} />;
}

// ── Auth Screen ──
function AuthScreen({ fr, authMode, setAuthMode, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, authError, authSuccess, authBusy, onEmailAuth, onGoogle }) {
  const titles = { login: fr ? "Connexion" : "Sign in", signup: fr ? "Créer un compte" : "Create account", reset: fr ? "Mot de passe oublié" : "Reset password" };

  return (
    <div style={{ background: "#06060f", minHeight: "100vh", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <img src="/logo.png" alt="Spirit Trading" style={{ width: 48, height: 48, objectFit: "contain" }} />
        <div style={{ fontSize: 15, fontWeight: 800, color: "#e2e8f0", letterSpacing: 1 }}>SPIRIT<span style={{ color: "#00e5a0" }}>.</span>TRADING</div>
      </div>

      <div style={{ background: "rgba(17,24,37,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,45,69,0.8)", borderRadius: 20, padding: "32px 36px", width: "100%", maxWidth: 360 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#e2e8f0", marginBottom: 24, textAlign: "center" }}>{titles[authMode]}</div>

        <form onSubmit={onEmailAuth} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email" placeholder={fr ? "Adresse email" : "Email address"}
            value={email} onChange={e => setEmail(e.target.value)} required
            style={{ padding: "12px 14px", background: "#0d1520", border: "1px solid #1e2d45", borderRadius: 10, color: "#e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }}
          />
          {authMode !== "reset" && (
            <input
              type="password" placeholder={fr ? "Mot de passe" : "Password"}
              value={password} onChange={e => setPassword(e.target.value)} required
              style={{ padding: "12px 14px", background: "#0d1520", border: "1px solid #1e2d45", borderRadius: 10, color: "#e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }}
            />
          )}
          {authMode === "signup" && (
            <input
              type="password" placeholder={fr ? "Confirmer le mot de passe" : "Confirm password"}
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
              style={{ padding: "12px 14px", background: "#0d1520", border: "1px solid #1e2d45", borderRadius: 10, color: "#e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }}
            />
          )}

          {authError && <div style={{ fontSize: 12, color: "#ef4444", background: "#ef444415", border: "1px solid #ef444430", borderRadius: 8, padding: "8px 12px" }}>{authError}</div>}
          {authSuccess && <div style={{ fontSize: 12, color: "#00e5a0", background: "#00e5a015", border: "1px solid #00e5a030", borderRadius: 8, padding: "8px 12px" }}>{authSuccess}</div>}

          <button type="submit" disabled={authBusy} style={{ padding: "13px", background: "#00e5a0", color: "#06060f", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: authBusy ? "wait" : "pointer", marginTop: 4 }}>
            {authBusy ? "..." : authMode === "login" ? (fr ? "Se connecter" : "Sign in") : authMode === "signup" ? (fr ? "Créer mon compte" : "Create account") : (fr ? "Envoyer le lien" : "Send reset link")}
          </button>
        </form>

        {/* Divider */}
        {authMode !== "reset" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#1e2d45" }} />
              <span style={{ fontSize: 11, color: "#4b5e7a" }}>ou</span>
              <div style={{ flex: 1, height: 1, background: "#1e2d45" }} />
            </div>
            <button onClick={onGoogle} style={{ width: "100%", padding: "12px", background: "none", border: "1px solid #1e2d45", borderRadius: 10, color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16.5 19.2 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z"/><path fill="#FBBC05" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.7-5.5C29.7 36.8 27 37.6 24 37.6c-5.8 0-10.8-3.9-12.6-9.3l-7 5.4C7.8 41.2 15.3 46 24 46z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.8 2.3-2.2 4.2-4.1 5.6l6.7 5.5C42.4 36.2 46 30.6 46 24c0-1.3-.2-2.7-.5-4z"/></svg>
              Google
            </button>
          </>
        )}

        {/* Toggle links */}
        <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "#4b5e7a", display: "flex", flexDirection: "column", gap: 8 }}>
          {authMode === "login" && <>
            <button onClick={() => setAuthMode("signup")} style={{ background: "none", border: "none", color: "#00e5a0", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{fr ? "Créer un compte →" : "Create an account →"}</button>
            <button onClick={() => setAuthMode("reset")} style={{ background: "none", border: "none", color: "#4b5e7a", cursor: "pointer", fontSize: 11 }}>{fr ? "Mot de passe oublié ?" : "Forgot password?"}</button>
          </>}
          {authMode === "signup" && <button onClick={() => setAuthMode("login")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 12 }}>{fr ? "Déjà un compte ? Se connecter" : "Already have an account? Sign in"}</button>}
          {authMode === "reset" && <button onClick={() => setAuthMode("login")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 12 }}>{fr ? "← Retour à la connexion" : "← Back to sign in"}</button>}
        </div>
      </div>
    </div>
  );
}

// ── Paywall Screen ──
function PaywallScreen({ fr, user, onCheckout, onLogout, loading, error }) {
  return (
    <div style={{ background: "#06060f", minHeight: "100vh", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <img src="/logo.png" alt="Spirit Trading" style={{ width: 48, height: 48, objectFit: "contain" }} />
        <div style={{ fontSize: 15, fontWeight: 800, color: "#e2e8f0", letterSpacing: 1 }}>SPIRIT<span style={{ color: "#00e5a0" }}>.</span>TRADING</div>
      </div>

      <div style={{ background: "rgba(17,24,37,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,45,69,0.8)", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>{fr ? "Accès premium requis" : "Premium access required"}</div>
        <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 32, lineHeight: 1.7 }}>
          {fr ? <>Connecté en tant que <strong style={{ color: "#e2e8f0" }}>{user.email}</strong>.<br />Choisis un plan pour accéder à l'application.</> : <>Signed in as <strong style={{ color: "#e2e8f0" }}>{user.email}</strong>.<br />Choose a plan to access the app.</>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {/* Mensuel */}
          <div style={{ background: "#0d1520", border: "1px solid #1e2d45", borderRadius: 16, padding: "24px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#00e5a0", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Mensuel</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#e2e8f0" }}>7,99€<span style={{ fontSize: 13, fontWeight: 400, color: "#94a3b8" }}>/mois</span></div>
            <div style={{ fontSize: 11, color: "#4b5e7a", marginBottom: 20 }}>{fr ? "Sans engagement" : "No commitment"}</div>
            <button onClick={() => onCheckout("monthly")} disabled={loading} style={{ width: "100%", padding: "11px", background: "#00e5a0", color: "#06060f", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: loading ? "wait" : "pointer" }}>
              {loading ? "..." : fr ? "Commencer →" : "Start →"}
            </button>
          </div>
          {/* Annuel */}
          <div style={{ background: "#0d1520", border: "1px solid #818cf830", borderRadius: 16, padding: "24px 20px", position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#818cf8", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap" }}>🔥 {fr ? "2 mois offerts" : "2 months free"}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#818cf8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Annuel</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#e2e8f0" }}>79,99€<span style={{ fontSize: 13, fontWeight: 400, color: "#94a3b8" }}>/an</span></div>
            <div style={{ fontSize: 11, color: "#4b5e7a", marginBottom: 20 }}>6,67€/mois</div>
            <button onClick={() => onCheckout("annual")} disabled={loading} style={{ width: "100%", padding: "11px", background: "#818cf8", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: loading ? "wait" : "pointer" }}>
              {loading ? "..." : fr ? "Commencer →" : "Start →"}
            </button>
          </div>
        </div>

        {error && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 16 }}>{error}</div>}

        <div style={{ fontSize: 11, color: "#4b5e7a" }}>✓ {fr ? "Accès immédiat · Annulation en 1 clic · Données privées" : "Instant access · Cancel anytime · Private data"}</div>

        <button onClick={onLogout} style={{ marginTop: 20, background: "none", border: "none", color: "#4b5e7a", cursor: "pointer", fontSize: 12 }}>
          {fr ? "Se déconnecter" : "Sign out"}
        </button>
      </div>
    </div>
  );
}
