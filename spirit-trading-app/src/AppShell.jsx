import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase.js";
import App from "./App.jsx";

const COLORS = {
  bg: "#0a0e1a", surface: "#111827", card: "#1a2235", border: "#1e2d45",
  cyan: "#00d4ff", text: "#e2e8f0", textDim: "#94a3b8", muted: "#4b5e7a",
};

// Délai de debounce pour l'écriture Firestore (ms)
const SAVE_DEBOUNCE = 2000;

let saveTimer = null;

export default function AppShell() {
  const lang = localStorage.getItem("spirit_lang") || "fr";
  const fr = lang === "fr";
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cloudData, setCloudData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "saved"

  // Écoute l'état d'authentification + gère le retour de redirection Google
  useEffect(() => {
    getRedirectResult(auth)
      .then(result => { if (result?.user) setUser(result.user); })
      .catch(err => {
        console.error("Redirect result error:", err.code, err.message);
      });
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Charge les données depuis Firestore quand l'utilisateur se connecte
  useEffect(() => {
    if (!user) {
      setCloudData(null);
      return;
    }
    setDataLoading(true);
    const ref = doc(db, "users", user.uid, "journal", "data");
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setCloudData(snap.data());
      } else {
        setCloudData({}); // données vides = l'app utilisera ses initialStates
      }
      setDataLoading(false);
    }).catch((err) => {
      console.error("Erreur chargement Firestore:", err);
      setCloudData({});
      setDataLoading(false);
    });
  }, [user]);

  // Fonction de sauvegarde avec debounce
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
      } catch (err) {
        console.error("Erreur sauvegarde Firestore:", err);
        setSaveStatus("idle");
      }
    }, SAVE_DEBOUNCE);
  }, [user]);

  const handleLogin = () => {
    signInWithPopup(auth, googleProvider).catch(err => {
      console.error("Erreur connexion:", err.code, err.message);
    });

  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Écran de chargement auth
  if (authLoading) {
    return (
      <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: COLORS.cyan, fontSize: 14 }}>{fr ? "Chargement..." : "Loading..."}</div>
      </div>
    );
  }

  // Écran de connexion
  if (!user) {
    return (
      <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "48px 40px", textAlign: "center", maxWidth: 360, width: "90%" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🕊️</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, marginBottom: 4 }}>
            Spirit <span style={{ color: COLORS.cyan }}>Trading</span>
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 32 }}>
            {fr ? "Ton journal de trading intelligent" : "Your intelligent trading journal"}
          </div>
          <button
            onClick={handleLogin}
            style={{
              width: "100%", padding: "12px 24px", background: COLORS.cyan + "20",
              border: `1px solid ${COLORS.cyan}50`, borderRadius: 10, color: COLORS.cyan,
              fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", gap: 10,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16.5 19.2 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z"/><path fill="#FBBC05" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.7-5.5C29.7 36.8 27 37.6 24 37.6c-5.8 0-10.8-3.9-12.6-9.3l-7 5.4C7.8 41.2 15.3 46 24 46z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.8 2.3-2.2 4.2-4.1 5.6l6.7 5.5C42.4 36.2 46 30.6 46 24c0-1.3-.2-2.7-.5-4z"/></svg>
            {fr ? "Continuer avec Google" : "Continue with Google"}
          </button>
          <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 20, lineHeight: 1.6 }}>
            {fr ? <>Tes données sont sauvegardées en toute sécurité<br />dans le cloud et accessibles depuis n'importe quel appareil.</> : <>Your data is securely saved<br />in the cloud and accessible from any device.</>}
          </div>
        </div>
      </div>
    );
  }

  // Chargement des données cloud
  if (dataLoading || cloudData === null) {
    return (
      <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: COLORS.cyan, fontSize: 14 }}>{fr ? "Chargement de tes données..." : "Loading your data..."}</div>
      </div>
    );
  }

  return (
    <App
      user={user}
      cloudData={cloudData}
      onDataChange={handleDataChange}
      saveStatus={saveStatus}
      onLogout={handleLogout}
    />
  );
}
