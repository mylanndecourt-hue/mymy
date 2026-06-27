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
    const ALLOWED_EMAIL = "mylanndecourt@gmail.com";
    getRedirectResult(auth)
      .then(result => {
        if (result?.user) {
          if (result.user.email === ALLOWED_EMAIL) setUser(result.user);
          else signOut(auth);
        }
      })
      .catch(err => {
        console.error("Redirect result error:", err.code, err.message);
      });
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && u.email !== ALLOWED_EMAIL) { signOut(auth); return; }
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

  // Landing page + connexion
  if (!user) {
    const PnlCurve = () => {
      const pts = [0,8,5,15,12,25,20,18,32,28,38,35,45,42,55,50,60,58,68,72,80,76,88,92,100];
      const h = 120, w = 400;
      const path = pts.map((v,i) => `${i === 0 ? "M" : "L"}${(i/(pts.length-1))*w},${h - (v/100)*h}`).join(" ");
      const fill = `${path} L${w},${h} L0,${h} Z`;
      return (
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="grd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00e5a0" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#00e5a0" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={fill} fill="url(#grd)" />
          <path d={path} fill="none" stroke="#00e5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    };

    const BarChart = () => {
      const bars = [45,72,38,88,55,91,63,74,82,48,95,67];
      const max = 100;
      return (
        <svg viewBox="0 0 260 90" style={{ width: "100%", height: "100%" }}>
          {bars.map((v,i) => {
            const h = (v/max)*80;
            const color = v > 70 ? "#00e5a0" : v > 50 ? "#818cf8" : "#ef4444";
            return <rect key={i} x={i*22+1} y={90-h} width={18} height={h} rx={4} fill={color} opacity={0.7}/>;
          })}
        </svg>
      );
    };

    const CalHeatmap = () => {
      const cells = Array.from({length:35}, (_,i) => ({ v: Math.random() }));
      return (
        <svg viewBox="0 0 175 70" style={{ width: "100%", height: "100%" }}>
          {cells.map((c,i) => {
            const col = i % 7, row = Math.floor(i/7);
            const color = c.v > 0.7 ? "#00e5a0" : c.v > 0.4 ? "#818cf8" : c.v > 0.2 ? "#1e2d45" : "#0d1520";
            return <rect key={i} x={col*26} y={row*14} width={23} height={11} rx={3} fill={color} opacity={0.8}/>;
          })}
        </svg>
      );
    };

    const DonutChart = () => (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#1e2d45" strokeWidth="16"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#00e5a0" strokeWidth="16" strokeDasharray="150 89" strokeDashoffset="25" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#818cf8" strokeWidth="16" strokeDasharray="60 179" strokeDashoffset="-125" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="16" strokeDasharray="29 210" strokeDashoffset="-185" strokeLinecap="round"/>
        <text x="50" y="54" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="800">69%</text>
      </svg>
    );

    const StatCard = ({ label, val, color, sub }) => (
      <div style={{ background: "rgba(17,24,37,0.9)", border: `1px solid ${color}30`, borderRadius: 12, padding: "14px 16px", minWidth: 110 }}>
        <div style={{ fontSize: 9, color: "#4b5e7a", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 900, color, letterSpacing: -1 }}>{val}</div>
        {sub && <div style={{ fontSize: 10, color: "#4b5e7a", marginTop: 2 }}>{sub}</div>}
      </div>
    );

    return (
      <div style={{ background: "#06060f", minHeight: "100vh", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", color: "#fff", overflow: "hidden", position: "relative" }}>
        <style>{`
          @keyframes drift { 0%{transform:translateY(0)} 50%{transform:translateY(-18px)} 100%{transform:translateY(0)} }
          @keyframes drift2 { 0%{transform:translateY(0)} 50%{transform:translateY(14px)} 100%{transform:translateY(0)} }
          @keyframes fadein { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes drawline { from{stroke-dashoffset:1000} to{stroke-dashoffset:0} }
          .drift1 { animation: drift 8s ease-in-out infinite; }
          .drift2 { animation: drift2 11s ease-in-out infinite; }
          .drift3 { animation: drift 14s ease-in-out infinite 2s; }
          .fi1 { animation: fadein 0.7s ease both 0.1s; }
          .fi2 { animation: fadein 0.7s ease both 0.25s; }
          .fi3 { animation: fadein 0.7s ease both 0.4s; }
          .fi4 { animation: fadein 0.7s ease both 0.55s; }
        `}</style>

        {/* ── Arrière-plan graphiques ── */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {/* Radial glow center */}
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)" }} />

          {/* P&L curve — left */}
          <div className="drift1" style={{ position: "absolute", left: "3%", top: "15%", width: 360, height: 120, opacity: 0.18 }}>
            <div style={{ fontSize: 9, color: "#00e5a0", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Courbe P&L cumulé</div>
            <PnlCurve />
          </div>

          {/* Stat cards — top right */}
          <div className="drift2" style={{ position: "absolute", right: "4%", top: "8%", display: "flex", gap: 10, opacity: 0.22 }}>
            <StatCard label="Win Rate" val="69%" color="#00e5a0" sub="347W / 153L" />
            <StatCard label="P&L Net" val="+12 840$" color="#00e5a0" sub="500 trades" />
          </div>

          {/* Bar chart — right side */}
          <div className="drift3" style={{ position: "absolute", right: "3%", top: "35%", width: 280, opacity: 0.16 }}>
            <div style={{ fontSize: 9, color: "#818cf8", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>P&L par setup</div>
            <BarChart />
          </div>

          {/* Heatmap calendar — bottom left */}
          <div className="drift1" style={{ position: "absolute", left: "3%", bottom: "14%", width: 220, opacity: 0.18 }}>
            <div style={{ fontSize: 9, color: "#818cf8", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Calendrier trading</div>
            <CalHeatmap />
          </div>

          {/* Donut fiscal — bottom right */}
          <div className="drift2" style={{ position: "absolute", right: "5%", bottom: "10%", width: 110, opacity: 0.2 }}>
            <div style={{ fontSize: 9, color: "#f59e0b", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Structure fiscale</div>
            <DonutChart />
          </div>

          {/* Extra stat cards — bottom center */}
          <div className="drift3" style={{ position: "absolute", left: "5%", top: "55%", display: "flex", gap: 10, opacity: 0.15 }}>
            <StatCard label="R/R Moyen" val="1.26" color="#818cf8" />
            <StatCard label="Respect plan" val="81%" color="#818cf8" />
          </div>

          {/* Second P&L curve — bottom */}
          <div className="drift2" style={{ position: "absolute", left: "30%", bottom: "8%", width: 300, height: 90, opacity: 0.12 }}>
            <div style={{ fontSize: 9, color: "#00d4ff", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Compte Topstep #2</div>
            <PnlCurve />
          </div>

          {/* Grid lines overlay */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} opacity={0.03}>
            {Array.from({length:12}).map((_,i) => <line key={i} x1="0" y1={`${(i/11)*100}%`} x2="100%" y2={`${(i/11)*100}%`} stroke="#fff" strokeWidth="1"/>)}
            {Array.from({length:8}).map((_,i) => <line key={i} x1={`${(i/7)*100}%`} y1="0" x2={`${(i/7)*100}%`} y2="100%" stroke="#fff" strokeWidth="1"/>)}
          </svg>
        </div>

        {/* ── Contenu centré ── */}
        <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
          {/* Logo */}
          <div className="fi1" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{ fontSize: 28 }}>🕊️</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#e2e8f0", letterSpacing: 1 }}>SPIRIT<span style={{ color: "#00d4ff" }}>.</span>TRADING</div>
          </div>

          {/* Badge */}
          <div className="fi1" style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 20, padding: "5px 14px", fontSize: 11, color: "#00d4ff", fontWeight: 700, letterSpacing: 1, marginBottom: 20 }}>
            {fr ? "Journal intelligent pour traders prop firm" : "Smart journal for prop firm traders"}
          </div>

          {/* Title */}
          <div className="fi2" style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2 }}>
              <span style={{ background: "linear-gradient(135deg,#00e5a0,#00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {fr ? "Le journal" : "The journal"}
              </span>
              <br />
              <span style={{ color: "#e2e8f0" }}>{fr ? "du trader prop firm." : "for prop firm traders."}</span>
            </div>
          </div>

          {/* Subtitle */}
          <div className="fi2" style={{ fontSize: 14, color: "#94a3b8", textAlign: "center", maxWidth: 380, lineHeight: 1.7, marginBottom: 36 }}>
            {fr
              ? <>Conçu pour les traders prop firm. Passe le funded, garde-le.<br /><span style={{ color: "#00e5a0", fontWeight: 600 }}>Comprends tes patterns perdants — et arrête.</span></>
              : <>Built for prop firm traders. Get funded, keep it.<br /><span style={{ color: "#00e5a0", fontWeight: 600 }}>Understand your losing patterns — and stop.</span></>
            }
          </div>

          {/* Login card */}
          <div className="fi3" style={{ background: "rgba(17,24,37,0.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,45,69,0.8)", borderRadius: 20, padding: "32px 36px", textAlign: "center", width: 320 }}>
            <button
              onClick={handleLogin}
              style={{
                width: "100%", padding: "14px 24px",
                background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,229,160,0.15))",
                border: "1px solid rgba(0,212,255,0.4)", borderRadius: 12,
                color: "#00d4ff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,212,255,0.2)"; e.currentTarget.style.borderColor = "rgba(0,212,255,0.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,229,160,0.15))"; e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16.5 19.2 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z"/><path fill="#FBBC05" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.7-5.5C29.7 36.8 27 37.6 24 37.6c-5.8 0-10.8-3.9-12.6-9.3l-7 5.4C7.8 41.2 15.3 46 24 46z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.8 2.3-2.2 4.2-4.1 5.6l6.7 5.5C42.4 36.2 46 30.6 46 24c0-1.3-.2-2.7-.5-4z"/></svg>
              {fr ? "Continuer avec Google" : "Continue with Google"}
            </button>
            <div style={{ fontSize: 10, color: "#4b5e7a", marginTop: 16, lineHeight: 1.7 }}>
              {fr ? "☁️ Données sauvegardées dans le cloud · Accès multi-appareils" : "☁️ Cloud-synced data · Multi-device access"}
            </div>
          </div>

          {/* Stats strip */}
          <div className="fi4" style={{ display: "flex", gap: 32, marginTop: 40, opacity: 0.6 }}>
            {[["500+","trades analysés"],["15+","prop firms"],["IA","coach intégré"],["☁️","cloud sync"]].map(([v,l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#e2e8f0" }}>{v}</div>
                <div style={{ fontSize: 10, color: "#4b5e7a" }}>{l}</div>
              </div>
            ))}
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
