import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0e1a", surface: "#111827", card: "#1a2235", border: "#1e2d45",
  cyan: "#00d4ff", green: "#00e5a0", amber: "#f59e0b", red: "#ef4444",
  muted: "#4b5e7a", text: "#e2e8f0", textDim: "#94a3b8",
};

const initialTrades = [
  { id: 1, date: "2026-05-01", heure: "09:00", duree: 60, compte: "Phidias Compte Cash $25K", actif: "Nasdaq", direction: "LONG", setup: "Pullback", taille: 3, pnl: 129, rr: 0.8, respect: "Oui", regle_violee: "", notes_tech: "Trade Pullback sur Nasdaq, contexte long.", priere: true, heure_coucher: "00:00", sommeil: 7.5, ecrans: false, qualite_sommeil: 4, alimentation: "Mauvaise", discipline: 2, impulsif: false, emotion_avant: "Stressé", emotion_pendant: "Impatient", lecon: "Bonne execution, respecter le plan.", note: 4, joursPayoutValide: false },
  { id: 2, date: "2026-05-02", heure: "14:30", duree: 90, compte: "Phidias Compte Cash $25K", actif: "Nasdaq", direction: "LONG", setup: "Reversal", taille: 1, pnl: 43, rr: 0.7, respect: "Oui", regle_violee: "", notes_tech: "Trade Reversal sur Nasdaq, contexte long.", priere: true, heure_coucher: "22:00", sommeil: 4.9, ecrans: false, qualite_sommeil: 3, alimentation: "Neutre", discipline: 4, impulsif: false, emotion_avant: "En FOMO, Confiant", emotion_pendant: "Confiant", lecon: "Bonne execution, respecter le plan.", note: 4, joursPayoutValide: false },
  { id: 3, date: "2026-05-03", heure: "09:15", duree: 60, compte: "Apex Performance Account $50K", actif: "Gold", direction: "SHORT", setup: "Range", taille: 3, pnl: 76, rr: 2.6, respect: "Oui", regle_violee: "", notes_tech: "Trade Range sur Gold, contexte short.", priere: false, heure_coucher: "22:15", sommeil: 5.2, ecrans: false, qualite_sommeil: 3, alimentation: "Saine", discipline: 4, impulsif: false, emotion_avant: "Confiant, Neutre", emotion_pendant: "Stressé, Neutre", lecon: "Bonne execution, respecter le plan.", note: 3, joursPayoutValide: false },
  { id: 4, date: "2026-05-04", heure: "14:30", duree: 12, compte: "Apex Performance Account $50K", actif: "Nasdaq", direction: "SHORT", setup: "Pullback", taille: 3, pnl: -42, rr: 1.7, respect: "Oui", regle_violee: "", notes_tech: "Trade Pullback sur Nasdaq, contexte short.", priere: true, heure_coucher: "22:00", sommeil: 8.0, ecrans: true, qualite_sommeil: 4, alimentation: "Mauvaise", discipline: 2, impulsif: false, emotion_avant: "Impatient, Anxieux", emotion_pendant: "Euphorique, Impatient", lecon: "Rester discipline sur l'execution.", note: 4, joursPayoutValide: false },
  { id: 5, date: "2026-05-05", heure: "14:00", duree: 5, compte: "MyFundedFutures Funded $100K", actif: "Gold", direction: "SHORT", setup: "Scalp", taille: 2, pnl: 88, rr: 2.9, respect: "Non", regle_violee: "Taille trop grande", notes_tech: "Trade Scalp sur Gold, contexte short.", priere: false, heure_coucher: "22:30", sommeil: 7.9, ecrans: false, qualite_sommeil: 4, alimentation: "Neutre", discipline: 3, impulsif: true, emotion_avant: "Frustré", emotion_pendant: "Anxieux", lecon: "Bonne execution, respecter le plan.", note: 3, joursPayoutValide: false },
  { id: 6, date: "2026-05-06", heure: "10:15", duree: 8, compte: "Phidias Compte Cash $25K", actif: "Nasdaq", direction: "LONG", setup: "Scalp", taille: 2, pnl: 196, rr: 1.7, respect: "Oui", regle_violee: "", notes_tech: "Trade Scalp sur Nasdaq, contexte long.", priere: true, heure_coucher: "01:15", sommeil: 4.9, ecrans: true, qualite_sommeil: 3, alimentation: "Saine", discipline: 4, impulsif: false, emotion_avant: "Serein", emotion_pendant: "Confiant", lecon: "Bonne execution, respecter le plan.", note: 5, joursPayoutValide: true },
  { id: 7, date: "2026-05-07", heure: "14:15", duree: 5, compte: "Tradeify Challenge $50K", actif: "Nasdaq", direction: "SHORT", setup: "Range", taille: 3, pnl: -115, rr: 2.1, respect: "Oui", regle_violee: "", notes_tech: "Trade Range sur Nasdaq, contexte short.", priere: true, heure_coucher: "22:30", sommeil: 6.3, ecrans: true, qualite_sommeil: 4, alimentation: "Saine", discipline: 2, impulsif: false, emotion_avant: "Serein", emotion_pendant: "Impatient, Stressé", lecon: "Rester discipline sur l'execution.", note: 1, joursPayoutValide: false },
  { id: 8, date: "2026-05-08", heure: "15:15", duree: 8, compte: "Tradeify Challenge $50K", actif: "Nasdaq", direction: "SHORT", setup: "Pullback", taille: 2, pnl: -139, rr: 2.5, respect: "Non", regle_violee: "Stop trop serré", notes_tech: "Trade Pullback sur Nasdaq, contexte short.", priere: true, heure_coucher: "01:15", sommeil: 5.3, ecrans: false, qualite_sommeil: 3, alimentation: "Saine", discipline: 2, impulsif: true, emotion_avant: "Serein, Confiant", emotion_pendant: "Euphorique", lecon: "Rester discipline sur l'execution.", note: 2, joursPayoutValide: false },
  { id: 9, date: "2026-05-09", heure: "10:00", duree: 20, compte: "MyFundedFutures Funded $100K", actif: "Nasdaq", direction: "LONG", setup: "Scalp", taille: 1, pnl: -5, rr: 2.9, respect: "Oui", regle_violee: "", notes_tech: "Trade Scalp sur Nasdaq, contexte long.", priere: true, heure_coucher: "01:15", sommeil: 8.2, ecrans: true, qualite_sommeil: 5, alimentation: "Mauvaise", discipline: 2, impulsif: false, emotion_avant: "Euphorique", emotion_pendant: "Neutre", lecon: "Rester discipline sur l'execution.", note: 4, joursPayoutValide: false },
  { id: 10, date: "2026-05-10", heure: "09:00", duree: 5, compte: "Phidias Compte Cash $25K", actif: "Nasdaq", direction: "LONG", setup: "Scalp", taille: 2, pnl: 178, rr: 1.8, respect: "Partiel", regle_violee: "Entrée sans confirmation", notes_tech: "Trade Scalp sur Nasdaq, contexte long.", priere: false, heure_coucher: "00:30", sommeil: 7.9, ecrans: true, qualite_sommeil: 4, alimentation: "Saine", discipline: 4, impulsif: true, emotion_avant: "Confiant, Stressé", emotion_pendant: "Confiant", lecon: "Bonne execution, respecter le plan.", note: 5, joursPayoutValide: true },
  { id: 11, date: "2026-05-11", heure: "10:30", duree: 25, compte: "MyFundedFutures Funded $100K", actif: "Nasdaq", direction: "SHORT", setup: "Range", taille: 2, pnl: 92, rr: 2.8, respect: "Partiel", regle_violee: "Stop trop serré", notes_tech: "Trade Range sur Nasdaq, contexte short.", priere: true, heure_coucher: "00:00", sommeil: 8.2, ecrans: false, qualite_sommeil: 5, alimentation: "Neutre", discipline: 3, impulsif: true, emotion_avant: "Stressé, Anxieux", emotion_pendant: "Frustré", lecon: "Bonne execution, respecter le plan.", note: 5, joursPayoutValide: false },
  { id: 12, date: "2026-05-12", heure: "09:15", duree: 30, compte: "Phidias Compte Cash $25K", actif: "Nasdaq", direction: "LONG", setup: "Scalp", taille: 1, pnl: -107, rr: 1.2, respect: "Partiel", regle_violee: "Stop trop serré", notes_tech: "Trade Scalp sur Nasdaq, contexte long.", priere: true, heure_coucher: "23:30", sommeil: 6.9, ecrans: true, qualite_sommeil: 4, alimentation: "Neutre", discipline: 3, impulsif: false, emotion_avant: "Impatient", emotion_pendant: "Anxieux", lecon: "Rester discipline sur l'execution.", note: 1, joursPayoutValide: false },
  { id: 13, date: "2026-05-13", heure: "14:00", duree: 60, compte: "Apex Performance Account $50K", actif: "Nasdaq", direction: "LONG", setup: "Scalp", taille: 1, pnl: -305, rr: 2.6, respect: "Partiel", regle_violee: "Taille trop grande", notes_tech: "Trade Scalp sur Nasdaq, contexte long.", priere: false, heure_coucher: "23:15", sommeil: 6.8, ecrans: false, qualite_sommeil: 4, alimentation: "Mauvaise", discipline: 4, impulsif: true, emotion_avant: "Frustré", emotion_pendant: "Stressé", lecon: "Rester discipline sur l'execution.", note: 1, joursPayoutValide: false },
  { id: 14, date: "2026-05-14", heure: "14:00", duree: 15, compte: "Topstep Express Funded $50K", actif: "Gold", direction: "SHORT", setup: "Pullback", taille: 2, pnl: -57, rr: 0.9, respect: "Partiel", regle_violee: "Entrée sans confirmation", notes_tech: "Trade Pullback sur Gold, contexte short.", priere: true, heure_coucher: "22:30", sommeil: 7.3, ecrans: true, qualite_sommeil: 4, alimentation: "Mauvaise", discipline: 3, impulsif: false, emotion_avant: "En FOMO", emotion_pendant: "Anxieux", lecon: "Rester discipline sur l'execution.", note: 2, joursPayoutValide: false },
  { id: 15, date: "2026-05-15", heure: "13:00", duree: 60, compte: "Apex Performance Account $50K", actif: "Gold", direction: "LONG", setup: "Scalp", taille: 2, pnl: 138, rr: 0.6, respect: "Oui", regle_violee: "", notes_tech: "Trade Scalp sur Gold, contexte long.", priere: true, heure_coucher: "22:30", sommeil: 6.9, ecrans: false, qualite_sommeil: 4, alimentation: "Saine", discipline: 3, impulsif: false, emotion_avant: "Confiant, Euphorique", emotion_pendant: "Stressé, Anxieux", lecon: "Bonne execution, respecter le plan.", note: 4, joursPayoutValide: false },
  { id: 16, date: "2026-05-16", heure: "09:30", duree: 15, compte: "Tradeify Challenge $50K", actif: "Gold", direction: "SHORT", setup: "Reversal", taille: 2, pnl: -77, rr: 2.2, respect: "Partiel", regle_violee: "Taille trop grande", notes_tech: "Trade Reversal sur Gold, contexte short.", priere: false, heure_coucher: "00:45", sommeil: 6.7, ecrans: false, qualite_sommeil: 4, alimentation: "Mauvaise", discipline: 4, impulsif: true, emotion_avant: "Anxieux", emotion_pendant: "Impatient", lecon: "Rester discipline sur l'execution.", note: 2, joursPayoutValide: false },
  { id: 17, date: "2026-05-17", heure: "15:15", duree: 15, compte: "Apex Performance Account $50K", actif: "Gold", direction: "SHORT", setup: "Breakout", taille: 1, pnl: -288, rr: 2.2, respect: "Non", regle_violee: "Taille trop grande", notes_tech: "Trade Breakout sur Gold, contexte short.", priere: false, heure_coucher: "22:45", sommeil: 5.4, ecrans: true, qualite_sommeil: 3, alimentation: "Saine", discipline: 4, impulsif: true, emotion_avant: "En FOMO", emotion_pendant: "Stressé", lecon: "Rester discipline sur l'execution.", note: 1, joursPayoutValide: false },
  { id: 18, date: "2026-05-18", heure: "15:00", duree: 45, compte: "Tradeify Challenge $50K", actif: "Nasdaq", direction: "LONG", setup: "Range", taille: 1, pnl: 204, rr: 2.5, respect: "Oui", regle_violee: "", notes_tech: "Trade Range sur Nasdaq, contexte long.", priere: true, heure_coucher: "23:30", sommeil: 7.2, ecrans: false, qualite_sommeil: 4, alimentation: "Mauvaise", discipline: 3, impulsif: false, emotion_avant: "Impatient", emotion_pendant: "Impatient", lecon: "Bonne execution, respecter le plan.", note: 4, joursPayoutValide: true },
  { id: 19, date: "2026-05-19", heure: "10:30", duree: 30, compte: "MyFundedFutures Funded $100K", actif: "Nasdaq", direction: "SHORT", setup: "Pullback", taille: 2, pnl: -117, rr: 1.3, respect: "Non", regle_violee: "Stop trop serré", notes_tech: "Trade Pullback sur Nasdaq, contexte short.", priere: false, heure_coucher: "01:00", sommeil: 8.1, ecrans: false, qualite_sommeil: 4, alimentation: "Saine", discipline: 4, impulsif: true, emotion_avant: "Confiant", emotion_pendant: "Euphorique", lecon: "Rester discipline sur l'execution.", note: 2, joursPayoutValide: false },
  { id: 20, date: "2026-05-20", heure: "14:45", duree: 30, compte: "Apex Performance Account $50K", actif: "Gold", direction: "SHORT", setup: "Range", taille: 2, pnl: 288, rr: 1.8, respect: "Oui", regle_violee: "", notes_tech: "Trade Range sur Gold, contexte short.", priere: false, heure_coucher: "23:00", sommeil: 7.4, ecrans: false, qualite_sommeil: 4, alimentation: "Saine", discipline: 3, impulsif: false, emotion_avant: "Euphorique", emotion_pendant: "Serein", lecon: "Bonne execution, respecter le plan.", note: 5, joursPayoutValide: true },
  { id: 21, date: "2026-05-21", heure: "09:00", duree: 5, compte: "MyFundedFutures Funded $100K", actif: "Nasdaq", direction: "SHORT", setup: "Pullback", taille: 1, pnl: -68, rr: 1.2, respect: "Oui", regle_violee: "", notes_tech: "Trade Pullback sur Nasdaq, contexte short.", priere: true, heure_coucher: "22:00", sommeil: 5.8, ecrans: false, qualite_sommeil: 3, alimentation: "Neutre", discipline: 4, impulsif: false, emotion_avant: "Euphorique", emotion_pendant: "Confiant", lecon: "Rester discipline sur l'execution.", note: 3, joursPayoutValide: false },
  { id: 22, date: "2026-05-22", heure: "10:00", duree: 90, compte: "Tradeify Challenge $50K", actif: "Nasdaq", direction: "LONG", setup: "Pullback", taille: 2, pnl: -16, rr: 2.2, respect: "Partiel", regle_violee: "Entrée sans confirmation", notes_tech: "Trade Pullback sur Nasdaq, contexte long.", priere: false, heure_coucher: "23:00", sommeil: 6.8, ecrans: false, qualite_sommeil: 4, alimentation: "Mauvaise", discipline: 4, impulsif: true, emotion_avant: "Confiant, Neutre", emotion_pendant: "Confiant", lecon: "Rester discipline sur l'execution.", note: 4, joursPayoutValide: false },
  { id: 23, date: "2026-05-23", heure: "10:00", duree: 12, compte: "Phidias Compte Cash $25K", actif: "Nasdaq", direction: "LONG", setup: "Reversal", taille: 3, pnl: -64, rr: 1.6, respect: "Oui", regle_violee: "", notes_tech: "Trade Reversal sur Nasdaq, contexte long.", priere: true, heure_coucher: "00:45", sommeil: 6.0, ecrans: false, qualite_sommeil: 3, alimentation: "Mauvaise", discipline: 4, impulsif: false, emotion_avant: "Confiant", emotion_pendant: "Frustré", lecon: "Rester discipline sur l'execution.", note: 3, joursPayoutValide: false },
  { id: 24, date: "2026-05-24", heure: "11:30", duree: 20, compte: "Topstep Express Funded $50K", actif: "Nasdaq", direction: "SHORT", setup: "Range", taille: 1, pnl: -45, rr: 2.4, respect: "Oui", regle_violee: "", notes_tech: "Trade Range sur Nasdaq, contexte short.", priere: true, heure_coucher: "23:00", sommeil: 6.8, ecrans: true, qualite_sommeil: 4, alimentation: "Neutre", discipline: 3, impulsif: false, emotion_avant: "Neutre", emotion_pendant: "Stressé", lecon: "Rester discipline sur l'execution.", note: 2, joursPayoutValide: false },
  { id: 25, date: "2026-05-25", heure: "10:45", duree: 20, compte: "MyFundedFutures Funded $100K", actif: "Gold", direction: "LONG", setup: "Breakout", taille: 2, pnl: 212, rr: 1.1, respect: "Oui", regle_violee: "", notes_tech: "Trade Breakout sur Gold, contexte long.", priere: true, heure_coucher: "23:30", sommeil: 7.3, ecrans: true, qualite_sommeil: 4, alimentation: "Saine", discipline: 3, impulsif: false, emotion_avant: "Impatient", emotion_pendant: "Frustré", lecon: "Bonne execution, respecter le plan.", note: 5, joursPayoutValide: true },
  { id: 26, date: "2026-05-26", heure: "10:15", duree: 60, compte: "Topstep Express Funded $50K", actif: "Gold", direction: "SHORT", setup: "Scalp", taille: 3, pnl: 37, rr: 2.0, respect: "Oui", regle_violee: "", notes_tech: "Trade Scalp sur Gold, contexte short.", priere: false, heure_coucher: "23:45", sommeil: 8.4, ecrans: true, qualite_sommeil: 5, alimentation: "Neutre", discipline: 2, impulsif: false, emotion_avant: "Serein", emotion_pendant: "Impatient, Neutre", lecon: "Bonne execution, respecter le plan.", note: 4, joursPayoutValide: false },
  { id: 27, date: "2026-05-27", heure: "11:45", duree: 8, compte: "MyFundedFutures Funded $100K", actif: "Gold", direction: "SHORT", setup: "Pullback", taille: 1, pnl: -194, rr: 1.1, respect: "Partiel", regle_violee: "Taille trop grande", notes_tech: "Trade Pullback sur Gold, contexte short.", priere: true, heure_coucher: "23:45", sommeil: 7.9, ecrans: false, qualite_sommeil: 4, alimentation: "Mauvaise", discipline: 3, impulsif: true, emotion_avant: "Serein, Neutre", emotion_pendant: "Anxieux", lecon: "Rester discipline sur l'execution.", note: 2, joursPayoutValide: false },
  { id: 28, date: "2026-05-28", heure: "14:30", duree: 20, compte: "Tradeify Challenge $50K", actif: "Nasdaq", direction: "LONG", setup: "Pullback", taille: 3, pnl: -115, rr: 1.0, respect: "Partiel", regle_violee: "Stop trop serré", notes_tech: "Trade Pullback sur Nasdaq, contexte long.", priere: false, heure_coucher: "00:15", sommeil: 7.1, ecrans: false, qualite_sommeil: 4, alimentation: "Mauvaise", discipline: 3, impulsif: true, emotion_avant: "En FOMO", emotion_pendant: "Serein", lecon: "Rester discipline sur l'execution.", note: 1, joursPayoutValide: false },
  { id: 29, date: "2026-05-29", heure: "10:30", duree: 90, compte: "Topstep Express Funded $50K", actif: "Nasdaq", direction: "LONG", setup: "Pullback", taille: 2, pnl: 103, rr: 2.0, respect: "Oui", regle_violee: "", notes_tech: "Trade Pullback sur Nasdaq, contexte long.", priere: false, heure_coucher: "00:30", sommeil: 7.8, ecrans: true, qualite_sommeil: 4, alimentation: "Saine", discipline: 2, impulsif: false, emotion_avant: "Euphorique", emotion_pendant: "Impatient", lecon: "Bonne execution, respecter le plan.", note: 4, joursPayoutValide: false },
  { id: 30, date: "2026-05-30", heure: "09:30", duree: 8, compte: "Tradeify Challenge $50K", actif: "Nasdaq", direction: "LONG", setup: "Range", taille: 3, pnl: 36, rr: 2.1, respect: "Non", regle_violee: "Entrée sans confirmation", notes_tech: "Trade Range sur Nasdaq, contexte long.", priere: true, heure_coucher: "01:30", sommeil: 8.2, ecrans: false, qualite_sommeil: 5, alimentation: "Saine", discipline: 3, impulsif: true, emotion_avant: "En FOMO", emotion_pendant: "Euphorique", lecon: "Bonne execution, respecter le plan.", note: 3, joursPayoutValide: false },
];

// ─── CATALOGUE PROP FIRMS ─────────────────────────────────────────────────────
const PROP_FIRMS_CATALOG = {
  Topstep: {
    nom: "Topstep", couleur: "#00d4ff", emoji: "🏦", siteUrl: "https://www.topstep.com", reglesUrl: "https://support.topstep.com/hc/en-us/categories/4408836624791-Rules-Policies", discordUrl: "https://discord.com/invite/topstep",
    description: "Futures prop firm · XFA",
    tailles: [25000, 50000, 100000, 150000],
    typesCompte: [
      { id: "combine", label: "Trading Combine", desc: "Évaluation", couleurBadge: "#f59e0b" },
      { id: "xfa", label: "Express Funded", desc: "Financé (XFA)", couleurBadge: "#00e5a0" },
      { id: "live", label: "Live Funded", desc: "Compte live", couleurBadge: "#00d4ff" },
    ],
    reglesFondamentales: [
      { titre: "Toucher le MLL", consequence: "Compte fermé définitivement", detail: "Le Maximum Loss Limit se verrouille à $0 après le 1er payout. Le toucher = fin du compte, sans appel." },
      { titre: "Position overnight / week-end", consequence: "Compte fermé", detail: "Toute position ouverte après 15h10 CT ou le week-end = fermeture immédiate." },
      { titre: "Dépasser la taille max", consequence: "Violation de règle", detail: "Trader plus que les lots autorisés par ton palier = violation. La mise à jour se fait en début de session suivante." },
    ],
    regles: [
      { cat: "🚨 Règle absolue", titre: "Maximum Loss Limit (MLL)", desc: "Ne JAMAIS toucher le MLL. Commence à -$2 000, trail vers le haut. Se verrouille à $0 après premier payout. Violation = compte fermé définitivement.", critique: true },
      { cat: "📏 Taille", titre: "Scaling Plan (50K)", desc: "Solde < $1 500 → 2 contrats max\nSolde ≥ $1 500 → 3 contrats max\nSolde ≥ $2 000 → 5 contrats max\nMise à jour au début de la session suivante uniquement.", critique: false },
      { cat: "⏰ Horaires", titre: "Fermeture 15h10 CT", desc: "Toutes positions fermées à 15h10 CT (22h10 Paris). Pas de positions overnight ni week-end.", critique: false },
      { cat: "💰 Payout", titre: "5 jours à +$150 min", desc: "5 jours gagnants (non consécutifs) avec P&L ≥ $150. Split 90/10. Max payout = 50% du solde.", critique: false },
      { cat: "🎯 Objectif", titre: "Aucun profit target en XFA", desc: "Pas d'objectif de profit. Être consistent pour être callé en Live.", critique: false },
    ]
  },
  Phidias: {
    nom: "Phidias", couleur: "#f59e0b", emoji: "🏦", siteUrl: "https://phidiaspropfirm.com", reglesUrl: "https://phidiaspropfirm.com/rules", discordUrl: null,
    description: "Express to Live",
    tailles: [10000, 25000, 50000, 100000, 200000],
    typesCompte: [
      { id: "eval", label: "Évaluation E2L", desc: "Express to Live", couleurBadge: "#f59e0b" },
      { id: "cash", label: "Compte Cash", desc: "Financé (sim)", couleurBadge: "#00e5a0" },
      { id: "live", label: "Compte Live", desc: "Live chez Dorman", couleurBadge: "#a78bfa" },
    ],
    reglesFondamentales: [
      { titre: "Dépasser le stop statique -$500", consequence: "Compte liquidé immédiatement", detail: "Le drawdown ne trail pas — si le solde passe sous $49 500, liquidation automatique sans possibilité de récupérer." },
      { titre: "Position overnight (E2L)", consequence: "Violation / compte fermé", detail: "Sur E2L, toutes les positions doivent être clôturées avant la fin de journée." },
      { titre: "Dépasser les 5 minis", consequence: "Ordre rejeté / violation", detail: "Maximum 5 contrats mini (ou 50 micros) en tout temps pendant l'évaluation." },
    ],
    regles: [
      { cat: "📉 Drawdown", titre: "Stop statique à -$500", desc: "Drawdown FIXE à $500, ne trail jamais. Solde < $49 500 → liquidation immédiate.", critique: true },
      { cat: "🎯 Objectif", titre: "Profit target +$1 500", desc: "Atteindre +$1 500 pour valider l'éval. Zéro jour min, pas de consistance, pas de DLL.", critique: false },
      { cat: "📏 Taille", titre: "5 minis / 50 micros max", desc: "Limite de 5 contrats mini pendant toute l'évaluation.", critique: false },
      { cat: "⏰ Clôture", titre: "Pas de positions overnight", desc: "Toutes positions fermées avant fin de journée. E2L = intraday uniquement.", critique: false },
      { cat: "📰 News", titre: "News trading autorisé", desc: "Trading pendant les annonces économiques autorisé.", critique: false },
      { cat: "💰 Payout", titre: "Premier payout → LIVE", desc: "Premier payout sur CASH = switch automatique vers compte LIVE chez Dorman Trading. Split 80/20.", critique: false },
    ]
  },
  Apex: {
    nom: "Apex Trader Funding", couleur: "#a78bfa", emoji: "⚡", siteUrl: "https://apextraderfunding.com", reglesUrl: "https://apextraderfunding.com/help-center", discordUrl: "https://discord.com/invite/apextraderfunding",
    description: "EOD Evaluation",
    tailles: [25000, 50000, 75000, 100000, 150000, 250000, 300000],
    typesCompte: [
      { id: "eval", label: "EOD Evaluation", desc: "Évaluation", couleurBadge: "#f59e0b" },
      { id: "pa", label: "Performance Account", desc: "Financé (PA)", couleurBadge: "#00e5a0" },
      { id: "live", label: "Live Prop", desc: "Compte live réel", couleurBadge: "#a78bfa" },
    ],
    reglesFondamentales: [
      { titre: "Toucher le trailing drawdown EOD", consequence: "Compte fermé définitivement", detail: "Si le solde EOD touche le seuil trailing, fermeture immédiate du PA. Sur évaluation, fail instantané." },
      { titre: "Position ouverte à 16h59:59 ET", consequence: "Liquidation automatique", detail: "Apex ferme automatiquement toutes les positions à 16h59:59 ET. Si ça arrive trop souvent = risque de bannissement." },
      { titre: "Hedging entre comptes", consequence: "Bannissement permanent", detail: "Hedger ses propres comptes Apex entre eux = fermeture de tous les comptes, sans remboursement." },
      { titre: "Dépasser la taille du tier actuel", consequence: "Ordre rejeté automatiquement", detail: "Le PA commence au Tier 1 (2 contrats sur 50K). Dépasser la limite = ordre rejeté systématiquement." },
    ],
    regles: [
      { cat: "🚨 Règle absolue", titre: "Trailing Drawdown EOD -$2 500", desc: "Drawdown de $2 500 qui trail après le plus haut EOD. Se verrouille définitivement à $50 100 (solde initial +$100). Violation = compte fermé.", critique: true },
      { cat: "🎯 Objectif", titre: "Profit target +$3 000", desc: "Atteindre +$3 000 pour passer l'évaluation 50K. Pas de jours minimum sur les comptes EOD.", critique: false },
      { cat: "📏 Taille", titre: "Scaling Plan (50K)", desc: "Éval : 6 contrats max.\nPA Tier 1 : 2 contrats (début)\nPA Tier max : 4 contrats.\nMontée en tier selon solde EOD.", critique: false },
      { cat: "⏰ Horaires", titre: "Fermeture 16h59 ET", desc: "Toutes positions fermées à 16h59 ET (22h59 Paris). Apex ferme automatiquement à 16h59:59 ET.", critique: false },
      { cat: "💰 Payout", titre: "5 jours qualifiants à +$250 min", desc: "5 jours avec P&L ≥ $250 (50K EOD). Pas consécutifs. Split 90/10. Payout min $500.", critique: false },
      { cat: "⚠️ Consistance", titre: "Règle 50% (PA)", desc: "Aucun jour ne peut représenter plus de 50% du profit total lors d'une demande de payout.", critique: false },
    ]
  },
  MyFundedFutures: {
    nom: "MyFundedFutures", couleur: "#00e5a0", emoji: "🌱", siteUrl: "https://myfundedfutures.com", reglesUrl: "https://myfundedfutures.com/rules", discordUrl: null,
    description: "Starter / Expert",
    tailles: [50000, 100000, 150000],
    typesCompte: [
      { id: "eval", label: "Evaluation", desc: "Évaluation", couleurBadge: "#f59e0b" },
      { id: "funded", label: "Funded Account", desc: "Financé", couleurBadge: "#00e5a0" },
      { id: "live", label: "Live Account", desc: "Compte live", couleurBadge: "#00d4ff" },
    ],
    reglesFondamentales: [
      { titre: "Toucher le trailing drawdown EOD", consequence: "Compte fermé", detail: "Drawdown de $2 000 trailing sur les Starter 50K. Toucher le seuil = fermeture immédiate." },
      { titre: "Violation règle 40% (Starter)", consequence: "Payout refusé", detail: "Si un jour représente plus de 40% du profit total = demande de payout refusée automatiquement." },
      { titre: "Inactivité prolongée", consequence: "Compte désactivé", detail: "Pas de trade pendant 30 jours consécutifs = compte désactivé par MyFundedFutures." },
    ],
    regles: [
      { cat: "🚨 Drawdown", titre: "Trailing EOD -$2 000 (Starter)", desc: "Drawdown de $2 000 trailing EOD sur le compte Starter 50K. Violation = compte fermé.", critique: true },
      { cat: "🎯 Objectif", titre: "Profit target +$3 000 (Starter)", desc: "Atteindre +$3 000 pour passer l'éval Starter 50K. Plan Expert : +$4 000.", critique: false },
      { cat: "📏 Taille", titre: "Scaling Plan", desc: "Paliers à +$1 000, +$2 000, +$4 000, +$6 000.\nNombre de contrats augmente à chaque palier.", critique: false },
      { cat: "⚠️ Consistance", titre: "Règle 40% (Starter)", desc: "Aucun jour ne peut représenter plus de 40% du profit total. Pas de règle de consistance sur Expert.", critique: false },
      { cat: "⏰ Horaires", titre: "Fermeture 16h00 ET", desc: "Toutes positions fermées avant 16h00 ET. Pas de positions overnight.", critique: false },
      { cat: "💰 Payout", titre: "Split 90/10 · premiers $10K à 100%", desc: "100% des premiers $10 000 de profits. Puis 90/10. Payout min $500.", critique: false },
    ]
  },
  Tradeify: {
    nom: "Tradeify", couleur: "#f97316", emoji: "🔥", siteUrl: "https://tradeify.co", reglesUrl: "https://tradeify.co/rules", discordUrl: null,
    description: "Evaluation",
    tailles: [25000, 50000, 100000, 150000],
    typesCompte: [
      { id: "challenge", label: "Challenge", desc: "Évaluation", couleurBadge: "#f59e0b" },
      { id: "funded", label: "Funded Account", desc: "Financé", couleurBadge: "#00e5a0" },
      { id: "live", label: "Live Account", desc: "Compte live", couleurBadge: "#00d4ff" },
    ],
    reglesFondamentales: [
      { titre: "Toucher le trailing drawdown EOD", consequence: "Compte fermé définitivement", detail: "Drawdown de $2 500 trailing EOD sur 50K. Le toucher = fermeture permanente." },
      { titre: "Position overnight non autorisée", consequence: "Violation / compte fermé", detail: "Pas de positions overnight autorisées sauf sur les comptes swing spécifiques." },
      { titre: "Dépasser les 10 contrats", consequence: "Ordre rejeté", detail: "Limite stricte de 10 contrats mini sur le compte 50K." },
    ],
    regles: [
      { cat: "🚨 Drawdown", titre: "Trailing EOD -$2 500", desc: "Drawdown de $2 500 trailing EOD. Se verrouille une fois atteint le profit target. Violation = compte fermé.", critique: true },
      { cat: "🎯 Objectif", titre: "Profit target +$3 000", desc: "Atteindre +$3 000 sur le compte 50K. Pas de jours minimum requis.", critique: false },
      { cat: "📏 Taille", titre: "10 contrats max (50K)", desc: "Limite de 10 contrats pendant toute l'évaluation.", critique: false },
      { cat: "⏰ Horaires", titre: "Fermeture 16h59 ET", desc: "Toutes positions fermées à 16h59 ET. Pas de positions overnight.", critique: false },
      { cat: "💰 Payout", titre: "Split 80/20 → 90/10", desc: "80/20 au départ, monte à 90/10 après performances consistantes. Payout rapide.", critique: false },
      { cat: "📰 News", titre: "News trading autorisé", desc: "Trading pendant les annonces économiques autorisé.", critique: false },
    ]
  },
  Bulenox: {
    nom: "Bulenox", couleur: "#ec4899", emoji: "🐂", siteUrl: "https://bulenox.com", reglesUrl: "https://bulenox.com/rules", discordUrl: null,
    description: "Evaluation",
    tailles: [10000, 25000, 50000, 100000, 150000],
    typesCompte: [
      { id: "eval", label: "Evaluation", desc: "Évaluation", couleurBadge: "#f59e0b" },
      { id: "funded", label: "Funded Account", desc: "Financé", couleurBadge: "#00e5a0" },
      { id: "live", label: "Live Account", desc: "Compte live", couleurBadge: "#ec4899" },
    ],
    reglesFondamentales: [
      { titre: "Toucher le drawdown EOD -$2 000", consequence: "Compte fermé", detail: "Option EOD : si le solde de clôture passe sous le seuil, compte fermé immédiatement." },
      { titre: "Dépasser les 10 contrats", consequence: "Ordre rejeté", detail: "Maximum 10 contrats mini sur le compte 50K. Tout ordre au-delà est automatiquement rejeté." },
      { titre: "Position overnight non autorisée", consequence: "Violation / compte fermé", detail: "Pas de positions overnight sauf sur les comptes swing dédiés." },
    ],
    regles: [
      { cat: "🚨 Drawdown", titre: "EOD Trailing -$2 000", desc: "Drawdown de $2 000 trailing EOD. Option 2 uniquement EOD, très permissif en intraday.", critique: true },
      { cat: "🎯 Objectif", titre: "Profit target +$3 000", desc: "Atteindre +$3 000 sur le compte 50K. Pas de jours minimum.", critique: false },
      { cat: "📏 Taille", titre: "10 contrats max (50K)", desc: "Limite de 10 contrats mini pendant toute l'évaluation.", critique: false },
      { cat: "⏰ Horaires", titre: "Fermeture 16h59 ET", desc: "Toutes positions fermées à 16h59 ET. Pas de positions overnight.", critique: false },
      { cat: "💰 Payout", titre: "Split 80/20", desc: "80/20. Payout disponible après validation du compte.", critique: false },
      { cat: "✅ Avantage", titre: "Pas de DLL intraday (Option 2)", desc: "Avec l'Option EOD, pas de limite de perte journalière intraday. Seul le EOD compte.", critique: false },
    ]
  },
  Autre: {
    nom: "Autre prop firm", couleur: "#94a3b8", emoji: "🏢", siteUrl: "", reglesUrl: "", discordUrl: null,
    description: "Prop firm personnalisée",
    tailles: [10000, 25000, 50000, 100000, 150000, 200000],
    typesCompte: [
      { id: "eval", label: "Évaluation", desc: "Phase d'évaluation", couleurBadge: "#f59e0b" },
      { id: "funded", label: "Financé", desc: "Compte financé", couleurBadge: "#00e5a0" },
      { id: "live", label: "Live", desc: "Compte live réel", couleurBadge: "#00d4ff" },
    ],
    reglesFondamentales: [
      { titre: "Dépasser le drawdown maximum", consequence: "Compte fermé", detail: "Chaque prop firm ferme automatiquement le compte si le drawdown maximum est atteint." },
      { titre: "Violation des règles horaires", consequence: "Violation / compte fermé", detail: "Positions overnight, trading week-end ou après fermeture = violation critique selon la firm." },
    ],
    regles: [
      { cat: "📝 Info", titre: "Règles personnalisées", desc: "Renseigne les règles de ta prop firm dans la section Règles.", critique: false },
    ]
  },
};

const initialComptes = [
  { id: 1, nom: "Apex Performance Account $50K", numero: "APX-001", type: "Apex", typeCompte: "pa", taille: 50000, achat: 207, activation: 0, soldeInitial: 0, joursPayoutInitial: 0, payouts: [{ date: "2026-04-12", montant: 1850, devise: "USD" }, { date: "2026-05-20", montant: 2400, devise: "USD" }] },
  { id: 2, nom: "Topstep Express Funded $50K", numero: "TS-014", type: "Topstep", typeCompte: "xfa", taille: 50000, achat: 165, activation: 130, soldeInitial: 0, joursPayoutInitial: 0, payouts: [{ date: "2026-05-02", montant: 900, devise: "USD" }] },
  { id: 3, nom: "Phidias Compte Cash $25K", numero: "PH-007", type: "Phidias", typeCompte: "cash", taille: 25000, achat: 89, activation: 0, soldeInitial: 0, joursPayoutInitial: 0, payouts: [] },
  { id: 4, nom: "MyFundedFutures Funded $100K", numero: "MFF-022", type: "MyFundedFutures", typeCompte: "funded", taille: 100000, achat: 330, activation: 0, soldeInitial: 0, joursPayoutInitial: 0, payouts: [{ date: "2026-06-01", montant: 3200, devise: "USD" }] },
  { id: 5, nom: "Tradeify Challenge $50K", numero: "TF-003", type: "Tradeify", typeCompte: "challenge", taille: 50000, achat: 145, activation: 0, soldeInitial: -380, joursPayoutInitial: 0, payouts: [] },
];


const initialMentorQ = { mensuel: 0, moisDebut: new Date().toISOString().slice(0,7), actif: false };

const DEVISES = [
  { code: "USD", symbole: "$", label: "Dollar US", tauxParDefaut: 1 },
  { code: "EUR", symbole: "€", label: "Euro", tauxParDefaut: 0.807 },
  { code: "GBP", symbole: "£", label: "Livre sterling", tauxParDefaut: 0.719 },
  { code: "CHF", symbole: "Fr", label: "Franc suisse", tauxParDefaut: 0.805 },
  { code: "CAD", symbole: "CA$", label: "Dollar canadien", tauxParDefaut: 1.26 },
  { code: "AUD", symbole: "A$", label: "Dollar australien", tauxParDefaut: 1.43 },
  { code: "USDT", symbole: "₮", label: "Tether (crypto)", tauxParDefaut: 1 },
  { code: "BTC", symbole: "₿", label: "Bitcoin", tauxParDefaut: 0.000011 },
];
// Taux exprimés en "1 USD = X devise". Indicatifs (juin 2026), modifiables dans l'app.

// Taux de change indicatifs — base 1 USD = X devise (juin 2026, à ajuster manuellement)
// L'app les rend modifiables : ces valeurs ne sont qu'un point de départ.
const TAUX_CHANGE_DEFAUT = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CHF: 0.88,
  CAD: 1.37,
  AUD: 1.52,
  USDT: 1,
  BTC: 0.0000095,
};

// ─── CATALOGUE FISCAL ────────────────────────────────────────────────────────
// Taux indicatifs par pays — structure(s) usuelle(s) pour une activité de trading
// via prop firm. À ajuster manuellement selon la situation réelle (l'app permet
// de modifier le taux librement, ces valeurs ne sont qu'un point de départ).
const PAYS_FISCAL = {
  FR: { nom: "France", drapeau: "🇫🇷", imposeEnDeviseLocale: true, deviseFiscale: "EUR",
    structures: [
      { id: "micro_bnc", label: "Micro-entreprise (BNC)", emoji: "🌱", tauxDefaut: 25.6,
        note: "Cotisations sociales 25,6% du CA (régime général) + IR sur 66% du CA après abattement 34%",
        acre: true, tauxAcreAvant: 12.8, tauxAcreApres: 19.2, dateBasculeAcre: "2026-07-01",
        acreNote: "Réduction de cotisations la 1ère année (jusqu'à fin du 3e trimestre civil suivant le début d'activité). Le taux d'exonération dépend de la date de création : 50% si avant le 1er juillet 2026, 25% si après." },
      { id: "ei_reel", label: "Entreprise individuelle (réel)", emoji: "🏢", tauxDefaut: 45,
        note: "IR + cotisations sur bénéfice réel, taux progressif" },
      { id: "sasu", label: "SASU / Société", emoji: "🏛️", tauxDefaut: 25,
        note: "IS 25% + flat tax 30% sur dividendes si distribués" },
    ] },
  BE: { nom: "Belgique", drapeau: "🇧🇪", imposeEnDeviseLocale: true, deviseFiscale: "EUR",
    structures: [
      { id: "indep_pp", label: "Indépendant pers. physique", emoji: "🌱", tauxDefaut: 45, note: "IPP progressif + cotisations sociales ~20%" },
      { id: "srl", label: "Société (SRL)", emoji: "🏛️", tauxDefaut: 25, note: "ISOC 25% (20% PME sur première tranche)" },
    ] },
  CH: { nom: "Suisse", drapeau: "🇨🇭", imposeEnDeviseLocale: true, deviseFiscale: "CHF",
    structures: [
      { id: "indep", label: "Indépendant", emoji: "🌱", tauxDefaut: 22, note: "Variable selon canton, ~15-25%" },
      { id: "sa_sarl", label: "SA / Sàrl", emoji: "🏛️", tauxDefaut: 14, note: "Impôt sociétés variable selon canton, ~12-21%" },
    ] },
  CA: { nom: "Canada", drapeau: "🇨🇦", imposeEnDeviseLocale: true, deviseFiscale: "CAD",
    structures: [
      { id: "indep", label: "Travailleur autonome", emoji: "🌱", tauxDefaut: 30, note: "Fédéral + provincial, variable selon province" },
      { id: "inc", label: "Société (Inc.)", emoji: "🏛️", tauxDefaut: 15, note: "Taux fédéral PME ~9% + provincial" },
    ] },
  US: { nom: "États-Unis", drapeau: "🇺🇸", imposeEnDeviseLocale: false, deviseFiscale: "USD",
    structures: [
      { id: "sole_prop", label: "Sole Proprietor", emoji: "🌱", tauxDefaut: 30, note: "Federal + self-employment tax, variable selon état" },
      { id: "llc", label: "LLC", emoji: "🏛️", tauxDefaut: 25, note: "Pass-through, taux selon tranche fédérale + état" },
    ] },
  UK: { nom: "Royaume-Uni", drapeau: "🇬🇧", imposeEnDeviseLocale: true, deviseFiscale: "GBP",
    structures: [
      { id: "sole_trader", label: "Sole Trader", emoji: "🌱", tauxDefaut: 30, note: "Income Tax + National Insurance" },
      { id: "ltd", label: "Limited Company", emoji: "🏛️", tauxDefaut: 25, note: "Corporation Tax 19-25% selon profits" },
    ] },
  AUTRE: { nom: "Autre pays", drapeau: "🌍", imposeEnDeviseLocale: true, deviseFiscale: "USD",
    structures: [
      { id: "indep", label: "Indépendant", emoji: "🌱", tauxDefaut: 25, note: "À ajuster selon ta situation" },
      { id: "societe", label: "Société", emoji: "🏛️", tauxDefaut: 25, note: "À ajuster selon ta situation" },
    ] },
};

// Calcule si l'ACRE est encore active à la date du jour, et le taux réduit correspondant
const initialObjectifs = [];

const initialReglesPerso = [];

// Catalogue de quêtes — toujours visibles, indépendantes des objectifs déjà créés
const QUETES_CATALOG = [
  { id: "q1", emoji: "🏆", titre: "Mon premier payout", montant: 0, devise: "USD", note: "Le premier, le plus important. Il valide tout le reste.", deadline: "",
    checkAuto: (ctx) => ctx.totalPayouts > 0 },
  { id: "q2", emoji: "🏦", titre: "Valider une évaluation", montant: 0, devise: "USD", note: "Passer l'étape d'éval et accéder à un compte financé.", deadline: "",
    checkAuto: (ctx) => ctx.comptes.some(c => ["xfa","cash","live","pa","funded"].includes(c.typeCompte)) },
  { id: "q3", emoji: "🔑", titre: "Avoir 2 comptes financés actifs", montant: 0, devise: "USD", note: "Scaler en multipliant les comptes simultanément.", deadline: "",
    checkAuto: (ctx) => ctx.comptes.filter(c => ["xfa","cash","live","pa","funded"].includes(c.typeCompte)).length >= 2 },
  { id: "q4", emoji: "💼", titre: "Avoir 5 comptes financés actifs", montant: 0, devise: "USD", note: "Le portefeuille multi-comptes d'un pro.", deadline: "",
    checkAuto: (ctx) => ctx.comptes.filter(c => ["xfa","cash","live","pa","funded"].includes(c.typeCompte)).length >= 5 },
  { id: "q5", emoji: "📈", titre: "1 000$ de gain cumulé", montant: 1000, devise: "USD", note: "Premier millier — poser les fondations.", deadline: "",
    checkAuto: (ctx) => ctx.gainTotal >= 1000 },
  { id: "q6", emoji: "💰", titre: "5 000$ de gain cumulé", montant: 5000, devise: "USD", note: "Preuve de consistance sur la durée.", deadline: "",
    checkAuto: (ctx) => ctx.gainTotal >= 5000 },
  { id: "q7", emoji: "🚀", titre: "10 000$ de gain cumulé", montant: 10000, devise: "USD", note: "Un cap psychologique majeur.", deadline: "",
    checkAuto: (ctx) => ctx.gainTotal >= 10000 },
  { id: "q8", emoji: "🌟", titre: "25 000$ de gain cumulé", montant: 25000, devise: "USD", note: "Le niveau qui change une vie.", deadline: "",
    checkAuto: (ctx) => ctx.gainTotal >= 25000 },
  { id: "q9", emoji: "♻️", titre: "Être ROI positif (dépenses couvertes)", montant: 0, devise: "USD", note: "Quand les payouts dépassent tous tes frais investis.", deadline: "",
    checkAuto: (ctx) => ctx.totalDepenses > 0 && ctx.totalPayouts >= ctx.totalDepenses },
  { id: "q10", emoji: "📅", titre: "30 jours de trading discipliné", montant: 0, devise: "USD", note: "Un mois sans trade impulsif. La vraie victoire.", deadline: "",
    checkAuto: null }, // pas détectable automatiquement
  { id: "q11", emoji: "⭐", titre: "Finir un mois avec note moy. 4/5", montant: 0, devise: "USD", note: "La qualité avant la quantité.", deadline: "",
    checkAuto: (ctx) => ctx.trades.length >= 5 && (ctx.trades.reduce((a,t) => a + t.note, 0) / ctx.trades.length) >= 4 },
  { id: "q12", emoji: "🎯", titre: "Win rate > 60% sur 20 trades", montant: 0, devise: "USD", note: "La consistance est la clé.", deadline: "",
    checkAuto: (ctx) => ctx.trades.length >= 20 && (ctx.trades.filter(t => t.pnl > 0).length / ctx.trades.length) >= 0.6 },
];

// Construit le contexte global utilisé pour la détection automatique des quêtes/objectifs
function buildEcosystemContext(trades, comptes) {
  const totalPayouts = comptes.reduce((a, c) => a + (c.payouts || []).reduce((b, p) => b + p.montant, 0), 0);
  const gainTrades = trades.reduce((a, t) => a + t.pnl, 0);
  const gainSoldeInitial = comptes.reduce((a, c) => a + (c.soldeInitial || 0), 0);
  const gainTotal = totalPayouts + Math.max(0, gainTrades); // approx : payouts + P&L positif des trades
  const totalAchats = comptes.reduce((a, c) => a + (c.achat || 0) + (c.activation || 0), 0);
  return { trades, comptes, totalPayouts, gainTotal, totalDepenses: totalAchats };
}

// Sous-teintes pour comptes multiples dans une même prop firm
function getCouleurCompte(type, index, total) {
  const base = PROP_FIRMS_CATALOG[type]?.couleur || "#94a3b8";
  if (total <= 1) return base;
  // On modifie l'opacité/teinte selon l'index
  const hex = base.replace("#", "");
  const r = parseInt(hex.slice(0,2),16);
  const g = parseInt(hex.slice(2,4),16);
  const b = parseInt(hex.slice(4,6),16);
  const factor = 0.7 + (index / (total - 1)) * 0.3;
  const nr = Math.min(255, Math.round(r * factor));
  const ng = Math.min(255, Math.round(g * factor));
  const nb = Math.min(255, Math.round(b * factor));
  return `rgb(${nr},${ng},${nb})`;
}

function getDeviseSymbole(code) {
  return DEVISES.find(d => d.code === code)?.symbole || code;
}

// Convertit un montant d'une devise source vers une devise cible, en utilisant
// des taux personnalisés (base USD) si fournis, sinon les taux par défaut du catalogue.
function convertirDevise(montant, deviseSource, deviseCible, tauxPersonnalises = {}) {
  if (deviseSource === deviseCible) return montant;
  const getTaux = (code) => {
    const perso = tauxPersonnalises[code];
    if (typeof perso === "number" && perso > 0) return perso;
    return DEVISES.find(d => d.code === code)?.tauxParDefaut || 1;
  };
  const tauxSource = getTaux(deviseSource); // 1 USD = tauxSource [deviseSource]
  const tauxCible = getTaux(deviseCible);
  const montantEnUSD = montant / tauxSource;
  return montantEnUSD * tauxCible;
}

// Calcule si l'ACRE est encore active (dans les 4 trimestres civils suivant la création)
// et retourne le taux ACRE applicable selon la date de création de la structure.
function getStatutAcre(structureData, dateCreation) {
  if (!structureData?.acre || !dateCreation) return null;
  const debut = new Date(dateCreation);
  const aujourdhui = new Date();
  // Fin de droits ACRE = fin du 3e trimestre civil suivant le trimestre de création (~ jusqu'à 12 mois max)
  const finAcre = new Date(debut);
  finAcre.setMonth(finAcre.getMonth() + 12);
  const acreActive = aujourdhui <= finAcre;
  if (!acreActive) return { active: false };
  // Le taux ACRE dépend de la date de création par rapport au bascule (1er juillet 2026)
  const bascule = new Date(structureData.dateBasculeAcre || "2026-07-01");
  const tauxAcre = debut < bascule ? structureData.tauxAcreAvant : structureData.tauxAcreApres;
  const joursRestants = Math.max(0, Math.ceil((finAcre - aujourdhui) / 86400000));
  return { active: true, taux: tauxAcre, joursRestants, finAcre: finAcre.toISOString().split("T")[0] };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getLotsTopstep(solde) {
  if (solde >= 2000) return { lots: 5, color: COLORS.green, next: null };
  if (solde >= 1500) return { lots: 3, color: COLORS.cyan, next: { seuil: 2000, manque: 2000 - solde } };
  return { lots: 2, color: COLORS.amber, next: { seuil: 1500, manque: 1500 - solde } };
}
function getMLL(solde) { return solde >= 2000 ? 0 : solde - 2000; }
function getDrawdownColor(marge) { return marge > 1500 ? COLORS.green : marge > 800 ? COLORS.amber : COLORS.red; }
function moisEntre(debut, fin) {
  const [dy, dm] = debut.split("-").map(Number);
  const [fy, fm] = fin.split("-").map(Number);
  return (fy - dy) * 12 + (fm - dm) + 1;
}

// ─── COMPOSANTS UI ────────────────────────────────────────────────────────────
function Tag({ children, color = COLORS.cyan }) {
  return <span style={{ background: color + "20", color, border: `1px solid ${color}40`, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>{children}</span>;
}
function Card({ children, style = {}, onClick }) {
  return <div onClick={onClick} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>;
}
function StatBig({ label, value, color = COLORS.cyan, sub }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 30, fontWeight: 800, color, fontFamily: "monospace", letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ background: COLORS.border, borderRadius: 4, height: 6, overflow: "hidden", marginTop: 6 }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
    </div>
  );
}
function SectionTitle({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.cyan, textTransform: "uppercase", letterSpacing: 2, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 8, marginBottom: 14 }}>{children}</div>;
}
function Row({ label, value, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, marginBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>
      <span style={{ fontSize: 12, color: COLORS.textDim }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: color || COLORS.text, fontFamily: "monospace" }}>{value}</span>
    </div>
  );
}

// ─── DÉTAIL TRADE ─────────────────────────────────────────────────────────────
function DetailTrade({ trade, onBack, onEdit }) {
  const pnlColor = trade.pnl >= 0 ? COLORS.green : COLORS.red;
  const respectColor = trade.respect === "Oui" ? COLORS.green : trade.respect === "Partiel" ? COLORS.amber : COLORS.red;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.textDim, borderRadius: 8, padding: "8px 12px", fontSize: 13, cursor: "pointer" }}>← Retour</button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>Trade #{trade.id}</div>
            <div style={{ fontSize: 11, color: COLORS.muted }}>{trade.date} à {trade.heure}</div>
          </div>
        </div>
        {onEdit && (
          <button onClick={() => onEdit(trade)} style={{ background: COLORS.cyan + "20", border: `1px solid ${COLORS.cyan}40`, color: COLORS.cyan, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            ✎ Modifier
          </button>
        )}
      </div>


      {/* P&L + Note */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 42, fontWeight: 800, fontFamily: "monospace", color: pnlColor }}>
              {trade.pnl >= 0 ? "+" : ""}{trade.pnl}$
            </div>
            <div style={{ fontSize: 12, color: COLORS.textDim }}>R:R {trade.rr} · {trade.duree} min</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, color: COLORS.amber }}>{"⭐".repeat(trade.note)}</div>
            <div style={{ fontSize: 11, color: respectColor, fontWeight: 700, marginTop: 4 }}>
              {trade.respect === "Oui" ? "✓ Plan respecté" : trade.respect === "Partiel" ? "~ Partiel" : "✗ Non respecté"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
          <Tag color={trade.compte === "Topstep Funded" ? COLORS.cyan : COLORS.amber}>{trade.compte}</Tag>
          <Tag color={COLORS.muted}>{trade.actif}</Tag>
          <Tag color={trade.direction === "LONG" ? COLORS.green : COLORS.red}>{trade.direction}</Tag>
          <Tag color={COLORS.muted}>{trade.setup}</Tag>
          <Tag color={COLORS.muted}>{trade.taille} lot{trade.taille > 1 ? "s" : ""}</Tag>
          {trade.impulsif && <Tag color={COLORS.red}>⚡ Impulsif</Tag>}
        </div>
      </Card>

      {/* Technique */}
      <Card>
        <SectionTitle>🔧 Technique</SectionTitle>
        <Row label="Actif" value={trade.actif} />
        <Row label="Direction" value={trade.direction} color={trade.direction === "LONG" ? COLORS.green : COLORS.red} />
        <Row label="Setup" value={trade.setup} color={COLORS.cyan} />
        <Row label="Taille" value={`${trade.taille} contrat${trade.taille > 1 ? "s" : ""}`} />
        <Row label="P&L" value={`${trade.pnl >= 0 ? "+" : ""}${trade.pnl}$`} color={pnlColor} />
        <Row label="R:R" value={trade.rr} color={trade.rr >= 2 ? COLORS.green : trade.rr >= 1 ? COLORS.amber : COLORS.red} />
        <Row label="Durée" value={`${trade.duree} min`} />
        <Row label="Respect du plan" value={trade.respect} color={respectColor} />
        {trade.regle_violee && <Row label="Règle violée" value={trade.regle_violee} color={COLORS.red} />}
        {trade.notes_tech && (
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 6 }}>Notes techniques</div>
            <div style={{ background: COLORS.bg, borderRadius: 8, padding: 12, fontSize: 12, color: COLORS.text, lineHeight: 1.7 }}>{trade.notes_tech}</div>
          </div>
        )}
      </Card>

      {/* Discipline */}
      <Card>
        <SectionTitle>🌿 Discipline</SectionTitle>
        <Row label="Prière" value={trade.priere ? "✓ Oui" : "✗ Non"} color={trade.priere ? COLORS.green : COLORS.muted} />
        <Row label="Heure coucher" value={trade.heure_coucher} />
        <Row label="Sommeil" value={`${trade.sommeil}h`} color={trade.sommeil >= 7 ? COLORS.green : trade.sommeil >= 6 ? COLORS.amber : COLORS.red} />
        <Row label="Écrans avant dodo" value={trade.ecrans ? "⚠️ Oui" : "✓ Non"} color={trade.ecrans ? COLORS.amber : COLORS.green} />
        <Row label="Qualité sommeil" value={`${trade.qualite_sommeil}/5 ${"★".repeat(trade.qualite_sommeil)}${"☆".repeat(5 - trade.qualite_sommeil)}`} color={trade.qualite_sommeil >= 4 ? COLORS.green : trade.qualite_sommeil >= 3 ? COLORS.amber : COLORS.red} />
        <Row label="Alimentation" value={trade.alimentation} color={trade.alimentation === "Saine" ? COLORS.green : trade.alimentation === "Neutre" ? COLORS.amber : COLORS.red} />
      </Card>

      {/* Psychologie */}
      <Card>
        <SectionTitle>🧠 Psychologie</SectionTitle>
        <Row label="Impulsivité" value={trade.impulsif ? "⚡ Oui" : "✓ Non"} color={trade.impulsif ? COLORS.red : COLORS.green} />
        <Row label="Émotion avant" value={trade.emotion_avant} color={COLORS.amber} />
        <Row label="Émotion pendant" value={trade.emotion_pendant} color={COLORS.amber} />
        <Row label="Note globale" value={`${trade.note}/5`} color={COLORS.amber} />
        {trade.lecon && (
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 6 }}>📝 Leçon apprise</div>
            <div style={{ background: COLORS.bg, borderRadius: 8, padding: 12, fontSize: 12, color: COLORS.text, lineHeight: 1.7, fontStyle: "italic" }}>"{trade.lecon}"</div>
          </div>
        )}
      </Card>

      {/* Zone screenshot placeholder */}
      <Card>
        <SectionTitle>📸 Screenshots</SectionTitle>
        <div style={{ background: COLORS.bg, borderRadius: 8, border: `2px dashed ${COLORS.border}`, padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🖼️</div>
          <div style={{ fontSize: 13, color: COLORS.muted }}>Glisser-déposer tes screenshots ici</div>
          <div style={{ fontSize: 11, color: COLORS.border, marginTop: 4 }}>Entrée · Sortie · Contexte HTF</div>
        </div>
      </Card>

      <button onClick={onBack} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textDim, borderRadius: 10, padding: "14px", fontSize: 14, cursor: "pointer" }}>
        ← Retour au journal
      </button>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
// Jour de l'année (1–365) pour rotation quotidienne
function jourAnnee() {
  const now = new Date();
  const debut = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - debut) / 86400000);
}

// ─── VERSETS & AFFIRMATIONS CONTEXTUELS ──────────────────────────────────────
// Catégories : danger (MLL proche), perte (PnL négatif), patience (winrate bas),
//              gratitude (en gain), humilite (streak wins), neutre (défaut)

const VERSETS_CTX = {
  danger: [
    { texte: "Ne crains rien, car je suis avec toi ; ne te décourage pas, car je suis ton Dieu.", ref: "Ésaïe 41:10", label: "🛡️ Protection" },
    { texte: "L'Éternel est ma lumière et mon salut : de qui aurais-je crainte ?", ref: "Psaume 27:1", label: "🛡️ Protection" },
    { texte: "Ne vous inquiétez de rien ; mais en toute chose faites connaître vos besoins à Dieu.", ref: "Philippiens 4:6", label: "🛡️ Protection" },
    { texte: "L'Éternel te gardera de tout mal, il gardera ton âme.", ref: "Psaume 121:7", label: "🛡️ Protection" },
    { texte: "Gardez votre cœur plus que toute autre chose, car de lui viennent les sources de la vie.", ref: "Proverbes 4:23", label: "🛡️ Protection" },
    { texte: "L'Éternel est mon berger : je ne manquerai de rien.", ref: "Psaume 23:1", label: "🛡️ Protection" },
    { texte: "Dieu est pour nous un refuge et un appui, un secours qui ne manque jamais dans la détresse.", ref: "Psaume 46:1", label: "🛡️ Protection" },
    { texte: "Je vous laisse la paix, je vous donne ma paix. Que votre cœur ne se trouble point.", ref: "Jean 14:27", label: "🛡️ Protection" },
    { texte: "Veillez et priez, afin de ne pas tomber dans la tentation.", ref: "Matthieu 26:41", label: "🛡️ Protection" },
    { texte: "Sois sobre, veille. Ton adversaire rôde comme un lion rugissant.", ref: "1 Pierre 5:8", label: "🛡️ Protection" },
    { texte: "Celui qui demeure sous l'abri du Très-Haut repose à l'ombre du Tout-Puissant.", ref: "Psaume 91:1", label: "🛡️ Protection" },
    { texte: "Le nom de l'Éternel est une tour forte ; le juste s'y réfugie et se trouve en sûreté.", ref: "Proverbes 18:10", label: "🛡️ Protection" },
    { texte: "Tu me préserves de la détresse, tu m'entoures de chants de délivrance.", ref: "Psaume 32:7", label: "🛡️ Protection" },
    { texte: "Soyez sobres, veillez : votre adversaire le diable rôde, cherchant qui dévorer.", ref: "1 Pierre 5:8", label: "🛡️ Protection" },
    { texte: "Quand bien même je marcherais dans la vallée de l'ombre de la mort, je ne craindrais aucun mal.", ref: "Psaume 23:4", label: "🛡️ Protection" },
    { texte: "Revêtez-vous de toutes les armes de Dieu, afin de pouvoir tenir ferme contre les ruses du diable.", ref: "Éphésiens 6:11", label: "🛡️ Protection" },
    { texte: "Celui qui veille sur Israël ne sommeille ni ne dort.", ref: "Psaume 121:4", label: "🛡️ Protection" },
    { texte: "Mieux vaut peu, avec la crainte de l'Éternel, qu'un grand trésor, avec le trouble.", ref: "Proverbes 15:16", label: "🛡️ Protection" },
    { texte: "Demeurez en moi, et je demeurerai en vous.", ref: "Jean 15:4", label: "🛡️ Protection" },
    { texte: "Que la paix de Christ, à laquelle vous avez été appelés, règne dans vos cœurs.", ref: "Colossiens 3:15", label: "🛡️ Protection" },
  ],
  perte: [
    { texte: "Fortifie-toi et prends courage ! Ne t'effraie point et ne t'épouvante point.", ref: "Josué 1:9", label: "💪 Courage" },
    { texte: "Je puis tout par celui qui me fortifie.", ref: "Philippiens 4:13", label: "💪 Courage" },
    { texte: "Heureux l'homme qui supporte patiemment l'épreuve ; après avoir été éprouvé, il recevra la couronne.", ref: "Jacques 1:12", label: "💪 Courage" },
    { texte: "La persévérance produit un caractère éprouvé, et le caractère éprouvé, l'espérance.", ref: "Romains 5:4", label: "💪 Courage" },
    { texte: "Ne te lasse pas de faire le bien ; car nous moissonnerons au temps convenable.", ref: "Galates 6:9", label: "💪 Courage" },
    { texte: "C'est pourquoi ne perdez pas votre assurance, à laquelle est attachée une grande récompense.", ref: "Hébreux 10:35", label: "💪 Courage" },
    { texte: "Car je connais les projets que j'ai formés sur vous, des projets de paix et non de malheur.", ref: "Jérémie 29:11", label: "💪 Courage" },
    { texte: "Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles.", ref: "Ésaïe 40:31", label: "💪 Courage" },
    { texte: "Car Dieu ne nous a pas donné un esprit de timidité, mais un esprit de force, d'amour et de sagesse.", ref: "2 Timothée 1:7", label: "💪 Courage" },
    { texte: "Je sais que toutes choses concourent au bien de ceux qui aiment Dieu.", ref: "Romains 8:28", label: "💪 Courage" },
    { texte: "Mes frères, regardez comme un sujet de joie les diverses épreuves auxquelles vous pouvez être exposés.", ref: "Jacques 1:2", label: "💪 Courage" },
    { texte: "Voici, je fais une chose nouvelle, sur le point d'arriver : ne la connaîtrez-vous pas ?", ref: "Ésaïe 43:19", label: "💪 Courage" },
    { texte: "Le juste tombe sept fois, et il se relève.", ref: "Proverbes 24:16", label: "💪 Courage" },
    { texte: "Nous sommes pressés de toute manière, mais non réduits à l'extrémité ; dans la détresse, mais non dans le désespoir.", ref: "2 Corinthiens 4:8", label: "💪 Courage" },
    { texte: "Béni soit l'homme qui se confie dans l'Éternel, et dont l'Éternel est l'espérance.", ref: "Jérémie 17:7", label: "💪 Courage" },
    { texte: "L'épreuve de votre foi produit la patience.", ref: "Jacques 1:3", label: "💪 Courage" },
    { texte: "Je lève mes yeux vers les montagnes : d'où me viendra le secours ?", ref: "Psaume 121:1", label: "💪 Courage" },
    { texte: "Dieu est notre refuge et notre force, un secours toujours présent dans la détresse.", ref: "Psaume 46:1", label: "💪 Courage" },
    { texte: "Tout ce qui est né de Dieu triomphe du monde.", ref: "1 Jean 5:4", label: "💪 Courage" },
    { texte: "Soyez forts et que votre cœur s'affermisse, vous tous qui espérez en l'Éternel.", ref: "Psaume 31:24", label: "💪 Courage" },
    { texte: "Je ne mourrai pas, je vivrai, et je raconterai les œuvres de l'Éternel.", ref: "Psaume 118:17", label: "💪 Courage" },
    { texte: "Quand je suis faible, c'est alors que je suis fort.", ref: "2 Corinthiens 12:10", label: "💪 Courage" },
  ],
  patience: [
    { texte: "Les plans bien préparés mènent au succès ; les décisions précipitées mènent à l'échec.", ref: "Proverbes 21:5", label: "⏳ Patience" },
    { texte: "Remets ton sort à l'Éternel, espère en lui, et il agira.", ref: "Psaume 37:5", label: "⏳ Patience" },
    { texte: "L'Éternel affermit les pas de l'homme dont il approuve la voie.", ref: "Psaume 37:23", label: "⏳ Patience" },
    { texte: "Confie à l'Éternel tes œuvres, et tes projets réussiront.", ref: "Proverbes 16:3", label: "⏳ Patience" },
    { texte: "Le cœur de l'homme fait ses projets, mais c'est l'Éternel qui dirige ses pas.", ref: "Proverbes 16:9", label: "⏳ Patience" },
    { texte: "Dieu n'est pas injuste pour oublier votre travail et l'amour que vous avez montré.", ref: "Hébreux 6:10", label: "⏳ Patience" },
    { texte: "Mieux vaut un esprit patient qu'un esprit hautain.", ref: "Ecclésiaste 7:8", label: "⏳ Patience" },
    { texte: "Celui qui est lent à la colère vaut mieux qu'un héros, et celui qui domine son esprit, qu'un preneur de villes.", ref: "Proverbes 16:32", label: "⏳ Patience" },
    { texte: "Attends l'Éternel, fortifie-toi et que ton cœur s'affermisse ; oui, attends l'Éternel.", ref: "Psaume 27:14", label: "⏳ Patience" },
    { texte: "Il y a un temps pour tout, un temps pour toute chose sous les cieux.", ref: "Ecclésiaste 3:1", label: "⏳ Patience" },
    { texte: "Soyez patients dans l'affliction, persévérants dans la prière.", ref: "Romains 12:12", label: "⏳ Patience" },
    { texte: "Il est bon d'attendre en silence le secours de l'Éternel.", ref: "Lamentations 3:26", label: "⏳ Patience" },
    { texte: "Que la persévérance accomplisse parfaitement son œuvre, afin que vous soyez parfaits et accomplis.", ref: "Jacques 1:4", label: "⏳ Patience" },
    { texte: "Celui qui sème pour l'Esprit moissonnera pour l'Esprit la vie éternelle.", ref: "Galates 6:8", label: "⏳ Patience" },
    { texte: "Tout ce que vous faites, faites-le de bon cœur, comme pour le Seigneur et non pour des hommes.", ref: "Colossiens 3:23", label: "⏳ Patience" },
    { texte: "Plus que cela, soyez pleins de confiance dans les tribulations, sachant que la tribulation produit la persévérance.", ref: "Romains 5:3", label: "⏳ Patience" },
    { texte: "Un cœur tranquille est la vie du corps, mais l'envie est la carie des os.", ref: "Proverbes 14:30", label: "⏳ Patience" },
    { texte: "Apprenez de moi, car je suis doux et humble de cœur ; et vous trouverez du repos pour vos âmes.", ref: "Matthieu 11:29", label: "⏳ Patience" },
    { texte: "Heureux ceux qui sèment avec larmes, ils moissonneront avec chants d'allégresse.", ref: "Psaume 126:5", label: "⏳ Patience" },
    { texte: "Celui qui croit ne se précipite pas.", ref: "Ésaïe 28:16", label: "⏳ Patience" },
  ],
  gratitude: [
    { texte: "Tout est possible à celui qui croit.", ref: "Marc 9:23", label: "🙏 Gratitude" },
    { texte: "Cherche d'abord le royaume de Dieu et sa justice, et toutes ces choses te seront données.", ref: "Matthieu 6:33", label: "🙏 Gratitude" },
    { texte: "Soyez dans la joie, demeurez fermes, consolez-vous, vivez en paix.", ref: "2 Corinthiens 13:11", label: "🙏 Gratitude" },
    { texte: "L'espérance ne trompe point, parce que l'amour de Dieu est répandu dans nos cœurs.", ref: "Romains 5:5", label: "🙏 Gratitude" },
    { texte: "Heureux l'homme qui trouve la sagesse, l'homme qui acquiert l'intelligence.", ref: "Proverbes 3:13", label: "🙏 Gratitude" },
    { texte: "Rendez grâces en toutes choses, car c'est à votre égard la volonté de Dieu en Jésus-Christ.", ref: "1 Thessaloniciens 5:18", label: "🙏 Gratitude" },
    { texte: "Toute grâce excellente et tout don parfait descendent d'en haut, du Père des lumières.", ref: "Jacques 1:17", label: "🙏 Gratitude" },
    { texte: "C'est ici la journée que l'Éternel a faite : qu'elle soit pour nous un sujet d'allégresse et de joie.", ref: "Psaume 118:24", label: "🙏 Gratitude" },
    { texte: "Que toute la terre crie de joie à l'Éternel ! Servez l'Éternel, avec joie.", ref: "Psaume 100:1-2", label: "🙏 Gratitude" },
    { texte: "Béni soit le Dieu et Père de notre Seigneur Jésus-Christ, le Père des miséricordes.", ref: "2 Corinthiens 1:3", label: "🙏 Gratitude" },
    { texte: "Chantez à l'Éternel un cantique nouveau ! Chantez à l'Éternel, vous tous habitants de la terre.", ref: "Psaume 96:1", label: "🙏 Gratitude" },
    { texte: "L'Éternel est bon, sa miséricorde dure toujours, et sa fidélité de génération en génération.", ref: "Psaume 100:5", label: "🙏 Gratitude" },
    { texte: "Que celui qui se glorifie se glorifie en l'Éternel.", ref: "1 Corinthiens 1:31", label: "🙏 Gratitude" },
    { texte: "Toute la terre se prosterne devant toi et chante en ton honneur, elle chante ton nom.", ref: "Psaume 66:4", label: "🙏 Gratitude" },
    { texte: "Tu m'as fait connaître les sentiers de la vie, tu me rempliras de joie devant ta face.", ref: "Psaume 16:11", label: "🙏 Gratitude" },
    { texte: "Goûtez et voyez combien l'Éternel est bon ! Heureux l'homme qui se réfugie en lui !", ref: "Psaume 34:8", label: "🙏 Gratitude" },
    { texte: "Je rends grâces à mon Dieu de tout le souvenir que je garde de vous.", ref: "Philippiens 1:3", label: "🙏 Gratitude" },
    { texte: "L'Éternel est mon rocher, ma forteresse, mon libérateur.", ref: "Psaume 18:2", label: "🙏 Gratitude" },
    { texte: "La joie de l'Éternel sera votre force.", ref: "Néhémie 8:10", label: "🙏 Gratitude" },
    { texte: "Que tout ce qui respire loue l'Éternel !", ref: "Psaume 150:6", label: "🙏 Gratitude" },
  ],
  humilite: [
    { texte: "Celui qui est fidèle dans les petites choses l'est aussi dans les grandes.", ref: "Luc 16:10", label: "🤲 Humilité" },
    { texte: "Tout ce que ta main trouve à faire, fais-le de toute ta force.", ref: "Ecclésiaste 9:10", label: "🤲 Humilité" },
    { texte: "La sagesse est le principal ; acquiers la sagesse et l'intelligence.", ref: "Proverbes 4:7", label: "🤲 Humilité" },
    { texte: "Celui qui garde son âme garde sa vie ; celui qui ouvre trop les lèvres court à sa perte.", ref: "Proverbes 13:3", label: "🤲 Humilité" },
    { texte: "Avant la ruine, le cœur de l'homme s'élève ; avant la gloire, vient l'humilité.", ref: "Proverbes 18:12", label: "🤲 Humilité" },
    { texte: "Que personne ne cherche son propre intérêt, mais celui d'autrui.", ref: "1 Corinthiens 10:24", label: "🤲 Humilité" },
    { texte: "Ne faites rien par esprit de parti ou par vaine gloire, mais que chacun regarde aux autres comme supérieurs.", ref: "Philippiens 2:3", label: "🤲 Humilité" },
    { texte: "Dieu résiste aux orgueilleux, mais il fait grâce aux humbles.", ref: "Jacques 4:6", label: "🤲 Humilité" },
    { texte: "Celui qui s'élève sera abaissé, et celui qui s'abaisse sera élevé.", ref: "Luc 14:11", label: "🤲 Humilité" },
    { texte: "L'orgueil précède la ruine, et l'arrogance précède la chute.", ref: "Proverbes 16:18", label: "🤲 Humilité" },
    { texte: "Humiliez-vous donc sous la puissante main de Dieu, afin qu'il vous élève au temps convenable.", ref: "1 Pierre 5:6", label: "🤲 Humilité" },
    { texte: "Que votre lumière luise ainsi devant les hommes, afin qu'ils voient vos bonnes œuvres.", ref: "Matthieu 5:16", label: "🤲 Humilité" },
    { texte: "Mieux vaut être humble avec les humbles que de partager le butin avec les orgueilleux.", ref: "Proverbes 16:19", label: "🤲 Humilité" },
    { texte: "Un homme sage écoute les conseils.", ref: "Proverbes 12:15", label: "🤲 Humilité" },
    { texte: "Que celui qui pense être debout prenne garde de tomber.", ref: "1 Corinthiens 10:12", label: "🤲 Humilité" },
    { texte: "L'amour ne se vante point, il ne s'enfle point d'orgueil.", ref: "1 Corinthiens 13:4", label: "🤲 Humilité" },
    { texte: "Que celui qui est le plus grand parmi vous soit comme le plus petit, et celui qui gouverne comme celui qui sert.", ref: "Luc 22:26", label: "🤲 Humilité" },
    { texte: "L'oreille qui écoute la réprimande de la vie a sa demeure parmi les sages.", ref: "Proverbes 15:31", label: "🤲 Humilité" },
    { texte: "Recommande à l'Éternel tes œuvres, et tes projets réussiront.", ref: "Proverbes 16:3", label: "🤲 Humilité" },
    { texte: "Sachez-le, mes frères bien-aimés : que tout homme soit prompt à écouter, lent à parler.", ref: "Jacques 1:19", label: "🤲 Humilité" },
  ],
};

const AFFIRMATIONS_CTX = {
  danger: [
    { texte: "STOP. Respire. Le marché sera là demain. Mon compte aussi.", auteur: "Mindset Spirit Trading" },
    { texte: "Je m'arrête, je protège mon capital. C'est la décision la plus courageuse.", auteur: "Mindset Spirit Trading" },
    { texte: "La règle n°1 est de ne jamais perdre d'argent. La règle n°2 est de ne jamais oublier la règle n°1.", auteur: "Warren Buffett" },
    { texte: "Mon MLL est proche. La meilleure trade est de ne pas trader maintenant.", auteur: "Mindset Spirit Trading" },
    { texte: "Le risque vient du fait de ne pas savoir ce que l'on fait.", auteur: "Warren Buffett" },
    { texte: "Il vaut mieux sortir tôt et rater une partie du mouvement que de risquer son capital.", auteur: "Paul Tudor Jones" },
    { texte: "Je joue beaucoup plus à la défense qu'à l'attaque.", auteur: "Paul Tudor Jones" },
    { texte: "La gestion du risque est le sujet le plus important en trading. Si vous gardez ça à l'esprit, tout ira bien.", auteur: "Paul Tudor Jones" },
    { texte: "Ne risque jamais plus de 1 à 2% de ton capital sur une seule position.", auteur: "Principe de gestion du risque" },
    { texte: "Le marché peut rester irrationnel plus longtemps que tu ne peux rester solvable.", auteur: "John Maynard Keynes" },
    { texte: "Couper les pertes vite n'est pas un échec. C'est la compétence la plus rentable d'un trader.", auteur: "Mindset Spirit Trading" },
    { texte: "Préserver le capital est plus important que de faire un profit aujourd'hui.", auteur: "Mindset Spirit Trading" },
    { texte: "On ne peut contrôler le résultat, seulement le risque qu'on prend pour l'obtenir.", auteur: "Mark Douglas" },
    { texte: "Le danger n'est pas dans la perte, mais dans la perte non maîtrisée.", auteur: "Mindset Spirit Trading" },
    { texte: "Survivre d'abord, gagner ensuite.", auteur: "Ed Seykota" },
    { texte: "Quand le doute s'installe, il n'y a pas de doute : sors.", auteur: "Jesse Livermore" },
    { texte: "Un bon trader peut gagner de l'argent même avec un mauvais système de trading. Un mauvais trader perdra de l'argent même avec un bon système.", auteur: "Alexander Elder" },
    { texte: "Le capital que tu protèges aujourd'hui est le capital qui te permettra de trader demain.", auteur: "Mindset Spirit Trading" },
    { texte: "La discipline pèse des grammes, le regret pèse des tonnes.", auteur: "Jim Rohn" },
    { texte: "Ce n'est pas combien tu gagnes qui compte, c'est combien tu gardes.", auteur: "Robert Kiyosaki" },
  ],
  perte: [
    { texte: "Chaque trade perdant bien exécuté est une victoire de discipline.", auteur: "Mindset Spirit Trading" },
    { texte: "Les pertes font partie du métier. Ce qui compte c'est comment je réagis.", auteur: "Mindset Spirit Trading" },
    { texte: "Je ne perds jamais. Soit je gagne, soit j'apprends.", auteur: "Nelson Mandela" },
    { texte: "Un drawdown n'est pas une défaite. C'est une phase que tout trader traverse.", auteur: "Mindset Spirit Trading" },
    { texte: "Le succès, c'est aller d'échec en échec sans perdre son enthousiasme.", auteur: "Winston Churchill" },
    { texte: "Ce n'est pas la fin. C'est une correction sur le chemin de la réussite.", auteur: "Mindset Spirit Trading" },
    { texte: "Notre plus grande gloire n'est pas de ne jamais tomber, mais de se relever à chaque chute.", auteur: "Confucius" },
    { texte: "Les marchés peuvent rester faux plus longtemps que vous ne pouvez rester solvable, alors ne pariez jamais la ferme.", auteur: "George Soros" },
    { texte: "Le trading n'est pas une question d'avoir raison ou tort. C'est une question de combien d'argent tu gagnes quand tu as raison.", auteur: "George Soros" },
    { texte: "Je n'ai pas échoué. J'ai juste trouvé 10 000 façons qui ne fonctionnent pas.", auteur: "Thomas Edison" },
    { texte: "Tomber n'est pas échouer. Échouer, c'est rester là où l'on est tombé.", auteur: "Socrate" },
    { texte: "La chute n'est pas un échec. L'échec c'est de rester là où on est tombé.", auteur: "Socrate" },
    { texte: "C'est dans les moments difficiles qu'on découvre qui l'on est vraiment.", auteur: "Marc Aurèle" },
    { texte: "L'obstacle sur le chemin devient le chemin.", auteur: "Marc Aurèle" },
    { texte: "Ce qui ne nous tue pas nous rend plus forts.", auteur: "Friedrich Nietzsche" },
    { texte: "La persévérance n'est pas une course longue, ce sont plusieurs courtes courses l'une après l'autre.", auteur: "Walter Elliot" },
    { texte: "Le pessimiste se plaint du vent, l'optimiste espère qu'il va tourner, le réaliste ajuste ses voiles.", auteur: "William Arthur Ward" },
    { texte: "Il n'y a pas de honte à tomber. La honte, c'est de ne pas vouloir se relever.", auteur: "Mindset Spirit Trading" },
    { texte: "Le succès est la capacité d'aller d'un échec à l'autre sans perdre son enthousiasme.", auteur: "Winston Churchill" },
    { texte: "Chaque revers contient en lui la graine d'un avantage équivalent ou plus grand.", auteur: "Napoleon Hill" },
    { texte: "Je reviens demain, frais et discipliné. Le marché sera là.", auteur: "Mindset Spirit Trading" },
    { texte: "Les grandes choses ne viennent jamais de zones de confort.", auteur: "Mindset Spirit Trading" },
  ],
  patience: [
    { texte: "Ma patience est mon edge le plus puissant.", auteur: "Mindset Spirit Trading" },
    { texte: "Pas de setup parfait, pas de trade. C'est aussi simple que ça.", auteur: "Mindset Spirit Trading" },
    { texte: "Le marché ne récompense pas l'activité, il récompense le fait d'avoir raison.", auteur: "Jim Rogers" },
    { texte: "L'argent se fait en restant assis, pas en tradant.", auteur: "Jesse Livermore" },
    { texte: "Attendre le bon moment n'est pas de la faiblesse. C'est de la maîtrise.", auteur: "Mindset Spirit Trading" },
    { texte: "La patience est amère, mais son fruit est doux.", auteur: "Jean-Jacques Rousseau" },
    { texte: "Toutes les grandes choses sont accomplies progressivement.", auteur: "Lao Tseu" },
    { texte: "Un voyage de mille lieues commence toujours par un premier pas.", auteur: "Lao Tseu" },
    { texte: "L'eau finit par percer la pierre, non par sa force, mais par sa persévérance.", auteur: "Lao Tseu" },
    { texte: "Le succès est la somme de petits efforts répétés jour après jour.", auteur: "Robert Collier" },
    { texte: "Ce qui compte n'est pas la vitesse, mais la direction.", auteur: "Mindset Spirit Trading" },
    { texte: "Les bonnes choses arrivent à ceux qui savent attendre.", auteur: "Mindset Spirit Trading" },
    { texte: "Trader, c'est attendre patiemment de l'argent qui traîne par terre.", auteur: "Jim Rogers" },
    { texte: "La meilleure trade est parfois celle qu'on ne prend pas.", auteur: "Mindset Spirit Trading" },
    { texte: "Le génie, c'est 1% d'inspiration et 99% de transpiration.", auteur: "Thomas Edison" },
    { texte: "Un chasseur patient revient toujours avec quelque chose.", auteur: "Mindset Spirit Trading" },
    { texte: "On ne peut pas presser un fruit pour qu'il mûrisse plus vite.", auteur: "Mindset Spirit Trading" },
    { texte: "Je trade la qualité, pas la quantité.", auteur: "Mindset Spirit Trading" },
    { texte: "La sagesse, c'est savoir quand agir et quand ne rien faire.", auteur: "Mindset Spirit Trading" },
    { texte: "Le temps est un allié pour qui sait l'utiliser.", auteur: "Warren Buffett" },
    { texte: "On devient ce que l'on répète. L'excellence n'est pas un acte mais une habitude.", auteur: "Aristote" },
  ],
  gratitude: [
    { texte: "Je suis reconnaissant pour ces résultats. Je reste humble et discipliné.", auteur: "Mindset Spirit Trading" },
    { texte: "Le succès actuel est le fruit de ma discipline passée. Je continue.", auteur: "Mindset Spirit Trading" },
    { texte: "La gratitude transforme ce que nous avons en suffisance.", auteur: "Melody Beattie" },
    { texte: "Le bonheur n'est pas d'obtenir ce que l'on désire, mais d'apprécier ce que l'on a.", auteur: "Épictète" },
    { texte: "Mes efforts portent leurs fruits. Je reste ancré dans mon process.", auteur: "Mindset Spirit Trading" },
    { texte: "Ce n'est pas l'homme qui a peu qui est pauvre, c'est celui qui désire toujours plus.", auteur: "Sénèque" },
    { texte: "Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès.", auteur: "Albert Schweitzer" },
    { texte: "Réjouis-toi de ce que tu as accompli, puis vise plus haut.", auteur: "Mindset Spirit Trading" },
    { texte: "Celui qui n'est pas content de ce qu'il a ne serait pas content de ce qu'il voudrait avoir.", auteur: "Sénèque" },
    { texte: "Le bonheur dépend de nous-mêmes.", auteur: "Aristote" },
    { texte: "Une vie d'humilité dans la victoire prépare une vie de résilience dans la défaite.", auteur: "Mindset Spirit Trading" },
    { texte: "La reconnaissance est la mémoire du cœur.", auteur: "Jean-Baptiste Massieu" },
    { texte: "Je suis dans le bon chemin. Je maintiens le cap avec humilité.", auteur: "Mindset Spirit Trading" },
    { texte: "L'homme sage cherche en lui-même tout son bonheur.", auteur: "Confucius" },
    { texte: "En gain ne veut pas dire relâché. Je reste concentré.", auteur: "Mindset Spirit Trading" },
    { texte: "Le succès est rarement définitif, l'échec est rarement fatal. C'est le courage de continuer qui compte.", auteur: "Winston Churchill" },
    { texte: "Profiter du moment présent sans oublier de préparer demain.", auteur: "Mindset Spirit Trading" },
    { texte: "On récolte ce que l'on sème, avec le temps qu'il faut.", auteur: "Mindset Spirit Trading" },
    { texte: "L'humilité est le fondement de toutes les autres vertus.", auteur: "Confucius" },
    { texte: "Je suis reconnaissant, et c'est cette gratitude qui me garde discipliné.", auteur: "Mindset Spirit Trading" },
  ],
  humilite: [
    { texte: "Le marché peut reprendre ce qu'il a donné. Je reste discipliné.", auteur: "Mindset Spirit Trading" },
    { texte: "Une série de victoires n'est pas une invitation à prendre plus de risques.", auteur: "Mindset Spirit Trading" },
    { texte: "Reste affamé, reste fou.", auteur: "Steve Jobs" },
    { texte: "Le succès est un mauvais professeur. Il séduit les gens intelligents en leur faisant croire qu'ils ne peuvent pas perdre.", auteur: "Bill Gates" },
    { texte: "Mon process m'a mené ici. Je lui fais confiance et je ne le change pas.", auteur: "Mindset Spirit Trading" },
    { texte: "Plus je suis humble, plus je suis grand.", auteur: "Victor Hugo" },
    { texte: "L'orgueil est le plus grand obstacle à la connaissance.", auteur: "Stephen Hawking" },
    { texte: "On ne tombe jamais aussi bas que lorsqu'on croit ne plus pouvoir tomber.", auteur: "Mindset Spirit Trading" },
    { texte: "Même en streak, je respecte mes règles à la lettre.", auteur: "Mindset Spirit Trading" },
    { texte: "Le savoir s'accroît quand on le partage, l'orgueil diminue quand on le maîtrise.", auteur: "Mindset Spirit Trading" },
    { texte: "Reste humble ou tu seras humilié.", auteur: "Proverbe populaire" },
    { texte: "L'humilité n'est pas penser moins de soi, c'est penser moins à soi.", auteur: "C.S. Lewis" },
    { texte: "Je reste le même trader en gain qu'en perte : méthodique et humble.", auteur: "Mindset Spirit Trading" },
    { texte: "Plus la lampe est pleine d'huile, plus humble doit être sa flamme.", auteur: "Saint-Exupéry, esprit" },
    { texte: "Ce n'est pas l'arrivée à la cime qui compte, c'est de rester capable d'en redescendre.", auteur: "Mindset Spirit Trading" },
    { texte: "Le succès n'efface pas le travail qu'il a fallu pour l'obtenir.", auteur: "Mindset Spirit Trading" },
    { texte: "Tant que le résultat dépend du marché, je reste un élève du marché.", auteur: "Mindset Spirit Trading" },
    { texte: "Les hommes sages parlent parce qu'ils ont quelque chose à dire ; les fous, parce qu'ils doivent dire quelque chose.", auteur: "Platon" },
    { texte: "Un bon trader ne devient jamais trop confiant. Le marché punit toujours l'arrogance.", auteur: "Mindset Spirit Trading" },
    { texte: "L'humilité est la porte par laquelle entre la sagesse.", auteur: "Mindset Spirit Trading" },
  ],
};

// Détermine le contexte selon les stats du trader
function getContexte(allPnl, winRate, margeTopstep, streak) {
  if (margeTopstep < 400) return "danger";          // MLL très proche
  if (allPnl < -300) return "perte";                // En perte significative
  if (streak >= 3) return "humilite";               // Série de gains → rester humble
  if (allPnl > 200) return "gratitude";             // En gain → gratitude
  if (winRate < 45) return "patience";              // Win rate bas → patience
  return "perte";                                    // Défaut neutre → encouragement
}

function getVersetContextuel(contexte, jour) {
  const pool = VERSETS_CTX[contexte];
  return pool[jour % pool.length];
}

function getAffirmationContextuelle(contexte, jour) {
  const pool = AFFIRMATIONS_CTX[contexte];
  return pool[jour % pool.length];
}

// Génère un chemin SVG lissé (courbe de Bézier cubique) à partir d'une liste de points [x, y].
// Style "Apple Stocks" : courbe douce sans angles vifs, sans dépasser les valeurs min/max.
function smoothPath(points) {
  if (points.length < 2) return "";
  if (points.length === 2) return `M ${points[0][0]},${points[0][1]} L ${points[1][0]},${points[1][1]}`;
  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

// Mini courbe P&L SVG inline
function PnlCurve({ trades }) {
  if (trades.length < 2) return null;
  const cumul = [];
  let sum = 0;
  trades.forEach(t => { sum += t.pnl; cumul.push(sum); });
  const min = Math.min(0, ...cumul);
  const max = Math.max(0, ...cumul);
  const range = max - min || 1;
  const W = 280, H = 64, PAD_X = 4, PAD_Y = 8;
  const pts = cumul.map((v, i) => {
    const x = PAD_X + (i / (cumul.length - 1)) * (W - PAD_X * 2);
    const y = PAD_Y + (1 - (v - min) / range) * (H - PAD_Y * 2);
    return [x, y];
  });
  const zeroY = PAD_Y + (1 - (0 - min) / range) * (H - PAD_Y * 2);
  const lastVal = cumul[cumul.length - 1];
  const color = lastVal >= 0 ? "#34d399" : "#f87171"; // teintes douces, désaturées
  const linePath = smoothPath(pts);
  const fillPath = `${linePath} L ${pts[pts.length - 1][0]},${zeroY} L ${pts[0][0]},${zeroY} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {min < 0 && max > 0 && (
        <line x1={PAD_X} y1={zeroY} x2={W - PAD_X} y2={zeroY} stroke={COLORS.border} strokeWidth="1" strokeDasharray="2,3" opacity="0.6" />
      )}
      <path d={fillPath} fill="url(#pnlGrad)" stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.5" fill={color} />
    </svg>
  );
}

function Dashboard({ trades, comptes, onEditCompte, onNewCompte, onGoToAnalyse }) {
  // ── Tous les calculs D'ABORD ──
  const aUnCompteTopstep = comptes.some(c => c.type === "Topstep");
  const topstepTrades = trades.filter(t => {
    const compteAssocie = comptes.find(c => c.nom === t.compte);
    return compteAssocie?.type === "Topstep";
  });
  const soldeTopstep = topstepTrades.reduce((a, t) => a + t.pnl, 0);
  const mllTopstep = getMLL(soldeTopstep);
  const margeTopstep = aUnCompteTopstep ? (soldeTopstep - mllTopstep) : 9999; // pas de Topstep = jamais en "danger"
  const lotsInfo = getLotsTopstep(soldeTopstep);
  const joursValides = topstepTrades.filter(t => t.joursPayoutValide).length;
  const soldeInitialTotal = comptes.reduce((a, c) => a + (c.soldeInitial || 0), 0);
  const allPnl = soldeInitialTotal + trades.reduce((a, t) => a + t.pnl, 0);
  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl < 0).length;
  const winRate = trades.length ? Math.round((wins / trades.length) * 100) : 0;
  const notesMoy = trades.length ? (trades.reduce((a, t) => a + t.note, 0) / trades.length).toFixed(1) : "—";
  const pnlColor = allPnl >= 0 ? COLORS.green : COLORS.red;
  const hasData = trades.length > 0 || comptes.length > 0; // vue globale active dès qu'il y a un compte OU un trade
  const streak = (() => {
    let s = 0;
    for (let i = trades.length - 1; i >= 0; i--) {
      if (trades[i].pnl > 0) s++; else break;
    }
    return s;
  })();

  // ── Contexte APRÈS les calculs ──
  const jour = jourAnnee();
  const contexte = getContexte(allPnl, winRate, margeTopstep, streak);
  const bibleQuote = getVersetContextuel(contexte, jour);
  const affirmQuote = getAffirmationContextuelle(contexte, jour);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── HERO STATS + COURBE ── */}
      <div
        onClick={() => trades.length >= 10 && onGoToAnalyse && onGoToAnalyse()}
        style={{
          background: `linear-gradient(135deg, ${COLORS.card} 0%, #0f1a2e 100%)`,
          border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20,
          position: "relative", overflow: "hidden",
          cursor: trades.length >= 10 ? "pointer" : "default",
        }}
      >
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: COLORS.muted + "06", pointerEvents: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2 }}>Vue globale — tous comptes</div>
          {trades.length >= 10 && (
            <div style={{ fontSize: 9, color: COLORS.cyan, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
              🔬 Analyse →
            </div>
          )}
        </div>

        {!hasData ? (
          <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
            <div style={{ fontSize: 44, fontWeight: 800, fontFamily: "monospace", color: COLORS.border, letterSpacing: -2, lineHeight: 1 }}>$0.00</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>Ajoute un compte et commence à trader pour voir tes stats</div>
            <div style={{ margin: "16px 0 4px" }}>
              <svg width="100%" height="40" viewBox="0 0 300 40">
                <polyline points="0,30 50,30 80,30 100,30 130,30 160,30 200,30 250,30 300,30" fill="none" stroke={COLORS.border} strokeWidth="1.5" strokeDasharray="6,4" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "monospace", color: pnlColor, letterSpacing: -2, lineHeight: 1 }}>
                {allPnl >= 0 ? "+" : ""}{allPnl}$
              </div>
              <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>
                P&L cumulé · {allPnl >= 0 ? "📈 En gain" : "📉 En perte"}
                {streak > 1 && <span style={{ color: COLORS.green, marginLeft: 8 }}>🔥 {streak} wins de suite</span>}
              </div>
            </div>
            {trades.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <PnlCurve trades={trades} />
                {trades.length < 10 && (
                  <div style={{ fontSize: 10, color: COLORS.muted, textAlign: "center", marginTop: 8 }}>
                    Analyse disponible à partir de 10 trades ({trades.length}/10)
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {[
            { val: trades.length === 0 ? "—" : `${winRate}%`, label: "Win Rate" },
            { val: trades.length === 0 ? "0" : trades.length, label: "Trades" },
            { val: trades.length === 0 ? "—" : `${wins}W/${losses}L`, label: "Résultats" },
            { val: trades.length === 0 ? "—" : `${notesMoy}⭐`, label: "Note moy." },
          ].map((s, i) => (
            <div key={i} style={{ background: COLORS.bg + "cc", borderRadius: 8, padding: "10px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "monospace", color: trades.length === 0 ? COLORS.border : COLORS.cyan }}>{s.val}</div>
              <div style={{ fontSize: 9, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AFFIRMATION DU JOUR ── */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 20px", borderLeft: `3px solid ${COLORS.cyan}` }}>
        <div style={{ fontSize: 10, color: COLORS.cyan, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Mindset du jour</div>
        <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.65, fontStyle: "italic", marginBottom: 6 }}>"{affirmQuote.texte}"</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.cyan, opacity: 0.8 }}>— {affirmQuote.auteur}</div>
      </div>


      {/* ── VERSET BIBLE CONTEXTUEL ── */}
      {(() => {
        const ctxColors = { danger: "#ef4444", perte: "#f59e0b", patience: "#00d4ff", gratitude: "#00e5a0", humilite: "#a78bfa" };
        const ctxBg = { danger: "#1f1215", perte: "#1a1810", patience: "#0e1a24", gratitude: "#0e1f1a", humilite: "#16121f" };
        const c = ctxColors[contexte] || "#7a9abf";
        const bg = ctxBg[contexte] || "#151e30";
        return (
          <div style={{ background: bg, border: `1px solid ${c}30`, borderRadius: 12, padding: "16px 20px", borderLeft: `3px solid ${c}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: c, textTransform: "uppercase", letterSpacing: 2 }}>✦ Parole du jour</div>
              <div style={{ fontSize: 10, color: c + "99", background: c + "15", border: `1px solid ${c}30`, borderRadius: 20, padding: "2px 8px" }}>{bibleQuote.label}</div>
            </div>
            <div style={{ fontSize: 13, color: "#c8d8ec", lineHeight: 1.7, fontStyle: "italic", marginBottom: 6 }}>"{bibleQuote.texte}"</div>
            <div style={{ fontSize: 11, color: c + "80", fontWeight: 700 }}>— {bibleQuote.ref}</div>
          </div>
        );
      })()}


      <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2 }}>Comptes en temps réel</div>

      {comptes.length === 0 && (
        <div onClick={onNewCompte} style={{ background: COLORS.card, border: `2px dashed ${COLORS.border}`, borderRadius: 12, padding: 24, textAlign: "center", cursor: onNewCompte ? "pointer" : "default" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏦</div>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 4 }}>Aucun compte ajouté</div>
          <div style={{ fontSize: 11, color: COLORS.muted }}>Appuie ici ou sur <span style={{ color: COLORS.cyan, fontWeight: 700 }}>+ Compte</span> en haut pour commencer</div>
        </div>
      )}

      {/* Comptes dynamiques selon ce que l'utilisateur a réellement ajouté */}
      {comptes.map(c => {
        const compteTrades = trades.filter(t => t.compte === c.nom);
        const pnlTrades = compteTrades.reduce((a, t) => a + t.pnl, 0);
        const solde = (c.soldeInitial || 0) + pnlTrades; // solde initial (si compte déjà existant) + P&L des trades saisis
        const firm = PROP_FIRMS_CATALOG[c.type] || PROP_FIRMS_CATALOG["Autre"];
        const estTopstepLike = c.type === "Topstep";

        if (estTopstepLike) {
          // Si un MLL manuel a été renseigné à la création, on calcule l'offset par rapport
          // au MLL théorique du solde initial, puis on l'applique en trailing sur le solde actuel.
          const soldeInitialCompte = c.soldeInitial || 0;
          const mllTheoriqueInitial = getMLL(soldeInitialCompte);
          const offsetMLL = (c.mllManuel !== null && c.mllManuel !== undefined) ? (c.mllManuel - mllTheoriqueInitial) : 0;
          const mll = Math.min(0, getMLL(solde) + offsetMLL); // le MLL ne dépasse jamais 0 une fois verrouillé
          const marge = solde - mll;
          const lots = getLotsTopstep(solde);
          const joursOk = (c.joursPayoutInitial || 0) + compteTrades.filter(t => t.joursPayoutValide).length;
          return (
            <Card key={c.id} onClick={() => onEditCompte && onEditCompte(c)} style={{ borderLeft: `3px solid ${lots.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{firm.emoji} {c.nom.toUpperCase()}</div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                    <Tag color={firm.couleur}>{c.numero || "Funded"}</Tag>
                    <span style={{ color: COLORS.muted, fontSize: 10 }}>✎ modifier</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "monospace", color: solde >= 0 ? COLORS.green : COLORS.red }}>{solde >= 0 ? "+" : ""}{solde}$</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim }}>solde actuel</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[
                  { val: lots.lots, label: "lots max", color: lots.color },
                  { val: `${mll}$`, label: "MLL actuel", color: getDrawdownColor(marge) },
                  { val: `${joursOk}/5`, label: "jours payout", color: COLORS.cyan },
                ].map((s, i) => (
                  <div key={i} style={{ background: COLORS.bg, borderRadius: 8, padding: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "monospace", color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {lots.next && (
                <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10, marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>
                    <span>Prochain palier ({lots.lots === 2 ? 3 : 5} lots)</span>
                    <span style={{ color: COLORS.amber }}>+{lots.next.manque}$ manquants</span>
                  </div>
                  <ProgressBar value={solde} max={lots.next.seuil} color={COLORS.amber} />
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: COLORS.textDim }}>Marge avant liquidation</span>
                <span style={{ color: getDrawdownColor(marge), fontFamily: "monospace", fontWeight: 700 }}>{marge}$</span>
              </div>
              <ProgressBar value={marge} max={2000} color={getDrawdownColor(marge)} />
            </Card>
          );
        }

        // Carte générique pour les autres prop firms (Phidias, Apex, etc.)
        return (
          <Card key={c.id} onClick={() => onEditCompte && onEditCompte(c)} style={{ borderLeft: `3px solid ${firm.couleur}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{firm.emoji} {c.nom.toUpperCase()}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                  <Tag color={firm.couleur}>{c.numero || firm.description}</Tag>
                  <span style={{ color: COLORS.muted, fontSize: 10 }}>✎ modifier</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "monospace", color: solde >= 0 ? COLORS.green : COLORS.red }}>{solde >= 0 ? "+" : ""}{solde}$</div>
                <div style={{ fontSize: 11, color: COLORS.textDim }}>gain depuis début</div>
              </div>
            </div>
            {compteTrades.length === 0 && (
              <div style={{ textAlign: "center", padding: "12px 0", color: COLORS.muted, fontSize: 11 }}>Aucun trade enregistré sur ce compte</div>
            )}
          </Card>
        );
      })}

      {comptes.length > 0 && onNewCompte && (
        <button onClick={onNewCompte} style={{ background: "transparent", border: `1px dashed ${COLORS.border}`, color: COLORS.cyan, borderRadius: 12, padding: "14px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          + Ajouter un autre compte
        </button>
      )}
    </div>
  );
}

// ─── JOURNAL ──────────────────────────────────────────────────────────────────
function Journal({ trades, onNew, onDetail, initialVue = "liste" }) {
  const [filter, setFilter] = useState("Tous");
  const [vue, setVue] = useState(initialVue); // "liste" ou "analyse"
  const [showFilters, setShowFilters] = useState(false);
  const filtered = filter === "Tous" ? trades : trades.filter(t => t.compte === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Sous-onglets Liste / Analyse */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setVue("liste")} style={{ flex: 1, background: vue === "liste" ? COLORS.cyan + "20" : COLORS.card, border: `1px solid ${vue === "liste" ? COLORS.cyan : COLORS.border}`, color: vue === "liste" ? COLORS.cyan : COLORS.textDim, borderRadius: 8, padding: "9px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          📋 Liste
        </button>
        <button onClick={() => setVue("analyse")} style={{ flex: 1, background: vue === "analyse" ? COLORS.cyan + "20" : COLORS.card, border: `1px solid ${vue === "analyse" ? COLORS.cyan : COLORS.border}`, color: vue === "analyse" ? COLORS.cyan : COLORS.textDim, borderRadius: 8, padding: "9px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          🔬 Analyse
          {trades.length >= 10 && <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.green }} />}
        </button>
      </div>

      {vue === "analyse" ? (
        <Analyse trades={trades} />
      ) : (
        <>
          <div style={{ overflowX: "auto", paddingBottom: 4 }}>
            <div style={{ display: "flex", gap: 8, minWidth: "max-content" }}>
              {["Tous", ...new Set(trades.map(t => t.compte))].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? COLORS.cyan + "20" : COLORS.card, border: `1px solid ${filter === f ? COLORS.cyan : COLORS.border}`, color: filter === f ? COLORS.cyan : COLORS.textDim, borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>{f}</button>
              ))}
            </div>
          </div>
          <button onClick={onNew} style={{ background: COLORS.cyan, color: COLORS.bg, border: "none", borderRadius: 10, padding: "14px", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>+ Nouveau trade</button>
          {trades.length === 0 && (
            <div style={{ background: COLORS.card, border: `2px dashed ${COLORS.border}`, borderRadius: 12, padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
              <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 6 }}>Aucun trade enregistré</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>Clique sur <span style={{ color: COLORS.cyan, fontWeight: 700 }}>+ Nouveau trade</span> pour commencer ton journal</div>
            </div>
          )}
          {trades.length > 0 && <div style={{ fontSize: 11, color: COLORS.muted }}>Appuie sur un trade pour voir le détail →</div>}
          {filtered.map(t => (
            <Card key={t.id} onClick={() => onDetail(t)} style={{ borderLeft: `3px solid ${t.pnl >= 0 ? COLORS.green : COLORS.red}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                    <Tag color={(() => { const type = Object.keys(PROP_FIRMS_CATALOG).find(k => t.compte.toLowerCase().includes(k.toLowerCase())); return type ? PROP_FIRMS_CATALOG[type].couleur : COLORS.muted; })()}>{t.compte}</Tag>
                    <Tag color={COLORS.muted}>{t.actif}</Tag>
                    <Tag color={t.direction === "LONG" ? COLORS.green : COLORS.red}>{t.direction}</Tag>
                    <Tag color={COLORS.muted}>{t.setup}</Tag>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.textDim }}>{t.date} {t.heure} · R:R {t.rr} · {t.emotion_avant}</div>
                  {t.impulsif && <div style={{ fontSize: 10, color: COLORS.red, marginTop: 2 }}>⚡ Trade impulsif</div>}
                </div>
                <div style={{ textAlign: "right", marginLeft: 12 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "monospace", color: t.pnl >= 0 ? COLORS.green : COLORS.red }}>{t.pnl >= 0 ? "+" : ""}{t.pnl}$</div>
                  <div style={{ fontSize: 11, color: COLORS.amber }}>{"⭐".repeat(t.note)}</div>
                  <div style={{ fontSize: 10, color: t.respect === "Oui" ? COLORS.green : t.respect === "Partiel" ? COLORS.amber : COLORS.red }}>
                    {t.respect === "Oui" ? "✓ Respecté" : t.respect === "Partiel" ? "~ Partiel" : "✗ Violé"}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}

// ─── ANALYSE ────────────────────────────────────────────────────────────────
// ─── COMPOSANTS GRAPHIQUES (SVG natif, pas de lib externe) ───────────────────
function PieChart({ data, size = 140 }) {
  // data: [{ label, value, color }]
  const total = data.reduce((a, d) => a + Math.abs(d.value), 0);
  if (total === 0) return <div style={{ textAlign: "center", color: COLORS.muted, fontSize: 11, padding: 20 }}>Pas assez de données</div>;

  const r = size / 2;
  const strokeW = size * 0.16; // épaisseur de l'anneau
  const rInner = r - strokeW / 2;
  const circumference = 2 * Math.PI * rInner;
  let offsetAccum = 0;

  const slices = data.map(d => {
    const portion = Math.abs(d.value) / total;
    const dash = portion * circumference;
    const slice = { color: d.color, label: d.label, value: d.value, pct: Math.round(portion * 100), dash, offset: offsetAccum };
    offsetAccum += dash;
    return slice;
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={r} cy={r} r={rInner} fill="none" stroke={COLORS.bg} strokeWidth={strokeW} />
          {slices.map((s, i) => (
            <circle
              key={i} cx={r} cy={r} r={rInner} fill="none"
              stroke={s.color} strokeWidth={strokeW}
              strokeDasharray={`${s.dash} ${circumference - s.dash}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="butt"
              style={{ transition: "stroke-dasharray 0.4s ease" }}
            />
          ))}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 9, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Total</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text, fontFamily: "monospace" }}>{Math.round(total)}$</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <div style={{ fontSize: 11, color: COLORS.textDim, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.label}</div>
            <div style={{ fontSize: 11, color: COLORS.text, fontWeight: 700, fontFamily: "monospace" }}>{s.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChartHoriz({ data, maxLabel = 100 }) {
  // data: [{ label, value, color, sub }] — value in 0-100 (e.g. win rate %)
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: COLORS.textDim }}>{d.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: d.color }}>
              {d.value}%{d.sub && <span style={{ fontSize: 10, color: COLORS.muted, fontWeight: 400, marginLeft: 4 }}>· {d.sub}</span>}
            </span>
          </div>
          <div style={{ height: 6, background: COLORS.bg, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${(d.value / maxVal) * 100}%`, height: "100%", background: d.color, borderRadius: 3, transition: "width 0.6s ease", opacity: 0.85 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Courbe d'équité avec axes X (n° de trade) / Y (P&L cumulé en $), graduations et points interactifs
function EquityCurve({ trades: tradesRaw }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  if (tradesRaw.length < 2) return <div style={{ textAlign: "center", color: COLORS.muted, fontSize: 11, padding: 20 }}>Pas assez de données</div>;

  // Toujours trier chronologiquement (date + heure) pour que la courbe reflète le vrai
  // déroulé dans le temps, peu importe l'ordre de saisie ou d'import des trades.
  const trades = [...tradesRaw].sort((a, b) => {
    const da = new Date(`${a.date}T${a.heure || "00:00"}`);
    const db = new Date(`${b.date}T${b.heure || "00:00"}`);
    return da - db;
  });

  const cumul = [];
  let sum = 0;
  trades.forEach(t => { sum += t.pnl; cumul.push(sum); });

  const min = Math.min(0, ...cumul);
  const max = Math.max(0, ...cumul);
  const range = (max - min) || 1;

  const W = 320, H = 200;
  const padL = 46, padR = 12, padT = 14, padB = 28;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const xAt = (i) => padL + (cumul.length === 1 ? 0 : (i / (cumul.length - 1)) * plotW);
  const yAt = (v) => padT + (1 - (v - min) / range) * plotH;

  const pts = cumul.map((v, i) => [xAt(i), yAt(v)]);
  const zeroY = yAt(0);
  const lastVal = cumul[cumul.length - 1];
  const lineColor = lastVal >= 0 ? "#34d399" : "#f87171"; // teintes douces, cohérentes avec PnlCurve
  const linePath = smoothPath(pts);
  const fillPath = `${linePath} L ${pts[pts.length - 1][0]},${zeroY} L ${pts[0][0]},${zeroY} Z`;

  // Graduations Y : min, 0, max
  const yTicks = [...new Set([min, 0, max])].sort((a, b) => a - b);

  // Graduations X : début, milieu, fin (numéro de trade)
  const xTicks = cumul.length <= 4
    ? cumul.map((_, i) => i)
    : [0, Math.floor((cumul.length - 1) / 2), cumul.length - 1];

  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}
        onMouseLeave={() => setHoverIdx(null)}>
        <defs>
          <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.16" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Lignes de grille horizontales, fines et discrètes + labels Y */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={padL} y1={yAt(v)} x2={W - padR} y2={yAt(v)} stroke={COLORS.border} strokeWidth="1" strokeDasharray={v === 0 ? "2,3" : "0"} opacity={v === 0 ? 0.7 : 0.4} />
            <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fontSize="9" fill={COLORS.muted} fontFamily="monospace">
              {v >= 0 ? "+" : ""}{Math.round(v)}$
            </text>
          </g>
        ))}

        {/* Labels X */}
        {xTicks.map((i, idx) => (
          <text key={idx} x={xAt(i)} y={H - padB + 16} textAnchor="middle" fontSize="9" fill={COLORS.muted} fontFamily="monospace">
            #{i + 1}
          </text>
        ))}
        <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="9" fill={COLORS.textDim}>Trade n°</text>

        {/* Aire + courbe lissée, une seule couleur cohérente */}
        <path d={fillPath} fill="url(#equityGrad)" stroke="none" />
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points interactifs, discrets sauf au survol */}
        {cumul.map((v, i) => (
          <circle
            key={i}
            cx={xAt(i)} cy={yAt(v)}
            r={hoverIdx === i ? 4.5 : 0}
            fill={lineColor}
            stroke={COLORS.card}
            strokeWidth="1.5"
            style={{ cursor: "pointer", transition: "r 0.15s" }}
          />
        ))}
        {/* Zone invisible élargie pour faciliter le survol/tap sur mobile */}
        {cumul.map((v, i) => (
          <circle
            key={`hit-${i}`}
            cx={xAt(i)} cy={yAt(v)}
            r="10"
            fill="transparent"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHoverIdx(i)}
            onTouchStart={() => setHoverIdx(i)}
          />
        ))}
      </svg>

      {/* Tooltip */}
      {hoverIdx !== null && (
        <div style={{
          position: "absolute",
          left: `${(xAt(hoverIdx) / W) * 100}%`,
          top: `${Math.max(0, (yAt(cumul[hoverIdx]) / H) * 100 - 22)}%`,
          transform: "translateX(-50%)",
          background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8,
          padding: "6px 10px", fontSize: 10, whiteSpace: "nowrap", pointerEvents: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)", zIndex: 10,
        }}>
          <div style={{ color: COLORS.text, fontWeight: 700 }}>Trade #{hoverIdx + 1} · {trades[hoverIdx].date}</div>
          <div style={{ color: trades[hoverIdx].pnl >= 0 ? "#34d399" : "#f87171", fontFamily: "monospace" }}>
            {trades[hoverIdx].pnl >= 0 ? "+" : ""}{trades[hoverIdx].pnl}$ ce trade
          </div>
          <div style={{ color: COLORS.muted, fontFamily: "monospace" }}>
            Cumul : {cumul[hoverIdx] >= 0 ? "+" : ""}{cumul[hoverIdx]}$
          </div>
        </div>
      )}
    </div>
  );
}


const CHART_COLORS = ["#38bdf8", "#34d399", "#fbbf24", "#a78bfa", "#f472b6", "#fb923c", "#f87171", "#64748b"];

function Analyse({ trades }) {
  const MIN_TRADES = 10;
  const [showDetail, setShowDetail] = useState(false);

  if (trades.length < MIN_TRADES) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔬</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Analyse pas encore disponible</div>
          <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6, marginBottom: 16 }}>
            L'analyse se déclenche automatiquement à partir de {MIN_TRADES} trades enregistrés,<br />pour avoir assez de données et dégager de vraies tendances.
          </div>
          <div style={{ background: COLORS.bg, borderRadius: 10, padding: 14, maxWidth: 280, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.textDim, marginBottom: 6 }}>
              <span>Progression</span>
              <span style={{ color: COLORS.cyan, fontWeight: 700 }}>{trades.length} / {MIN_TRADES}</span>
            </div>
            <div style={{ height: 6, background: COLORS.border, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(100, (trades.length / MIN_TRADES) * 100)}%`, height: "100%", background: COLORS.cyan, transition: "width 0.5s" }} />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ── Helpers statistiques ──
  const avgPnl = (arr) => arr.length ? arr.reduce((a, t) => a + t.pnl, 0) / arr.length : 0;
  const winRate = (arr) => arr.length ? (arr.filter(t => t.pnl > 0).length / arr.length) * 100 : 0;
  const overallAvg = avgPnl(trades);
  const overallWR = winRate(trades);

  // Découpe l'historique en deux moitiés pour détecter tendance temporelle
  const half = Math.floor(trades.length / 2);
  const recents = trades.slice(half);
  const anciens = trades.slice(0, half);

  // ── 1. Analyse SOMMEIL ──
  const sommeilTrades = trades.filter(t => t.sommeil && t.sommeil > 0);
  let insightSommeil = null;
  if (sommeilTrades.length >= 6) {
    const bonSommeil = sommeilTrades.filter(t => t.sommeil >= 7);
    const mauvaisSommeil = sommeilTrades.filter(t => t.sommeil < 6);
    if (bonSommeil.length >= 3 && mauvaisSommeil.length >= 3) {
      const diff = avgPnl(bonSommeil) - avgPnl(mauvaisSommeil);
      const wrDiff = winRate(bonSommeil) - winRate(mauvaisSommeil);
      insightSommeil = {
        titre: "Sommeil",
        icon: "😴",
        significatif: Math.abs(diff) > Math.abs(overallAvg) * 0.3 || Math.abs(wrDiff) > 10,
        positif: diff > 0,
        texte: diff > 0
          ? `Avec 7h+ de sommeil, ton P&L moyen est de ${diff >= 0 ? "+" : ""}${diff.toFixed(0)}$ supérieur à tes sessions à moins de 6h (${avgPnl(bonSommeil).toFixed(0)}$ vs ${avgPnl(mauvaisSommeil).toFixed(0)}$). Ton win rate grimpe aussi de ${wrDiff.toFixed(0)} points.`
          : `Étonnamment, tes trades après un sommeil court (<6h) performent mieux en moyenne (${avgPnl(mauvaisSommeil).toFixed(0)}$ vs ${avgPnl(bonSommeil).toFixed(0)}$). À surveiller — ce n'est peut-être pas causal.`,
      };
    }
  }

  // ── 2. Analyse ALIMENTATION ──
  const alimTrades = trades.filter(t => t.alimentation);
  let insightAlim = null;
  const saine = alimTrades.filter(t => t.alimentation === "Saine");
  const mauvaise = alimTrades.filter(t => t.alimentation === "Mauvaise");
  if (saine.length >= 3 && mauvaise.length >= 3) {
    const diff = avgPnl(saine) - avgPnl(mauvaise);
    insightAlim = {
      titre: "Alimentation",
      icon: "🥗",
      significatif: Math.abs(diff) > Math.abs(overallAvg) * 0.3,
      positif: diff > 0,
      texte: diff > 0
        ? `Tes trades suivant une alimentation saine rapportent en moyenne ${diff.toFixed(0)}$ de plus que ceux suivant une mauvaise alimentation (${avgPnl(saine).toFixed(0)}$ vs ${avgPnl(mauvaise).toFixed(0)}$).`
        : `Pas de lien clair entre alimentation et performance sur tes données actuelles.`,
    };
  }

  // ── 3. Analyse HORAIRE (heure d'entrée) ──
  const heureTrades = trades.filter(t => t.heure);
  let insightHeure = null;
  if (heureTrades.length >= 8) {
    const parHeure = {};
    heureTrades.forEach(t => {
      const h = parseInt(t.heure.split(":")[0]);
      const tranche = h < 11 ? "Matin (avant 11h)" : h < 14 ? "Midi (11h-14h)" : "Après-midi (14h+)";
      if (!parHeure[tranche]) parHeure[tranche] = [];
      parHeure[tranche].push(t);
    });
    const tranches = Object.entries(parHeure).filter(([_, arr]) => arr.length >= 3);
    if (tranches.length >= 2) {
      const meilleure = tranches.reduce((best, cur) => avgPnl(cur[1]) > avgPnl(best[1]) ? cur : best);
      const pire = tranches.reduce((worst, cur) => avgPnl(cur[1]) < avgPnl(worst[1]) ? cur : worst);
      if (meilleure[0] !== pire[0]) {
        const diff = avgPnl(meilleure[1]) - avgPnl(pire[1]);
        insightHeure = {
          titre: "Horaire de trading",
          icon: "🕐",
          significatif: Math.abs(diff) > Math.abs(overallAvg) * 0.4,
          positif: true,
          texte: `Tes meilleurs trades sont sur la tranche "${meilleure[0]}" (${avgPnl(meilleure[1]).toFixed(0)}$ en moyenne, ${winRate(meilleure[1]).toFixed(0)}% win rate) contre "${pire[0]}" (${avgPnl(pire[1]).toFixed(0)}$ en moyenne).`,
        };
      }
    }
  }

  // ── 4. Analyse ÉMOTION AVANT ──
  let insightEmotion = null;
  const emotionGroups = {};
  trades.forEach(t => {
    if (!t.emotion_avant) return;
    t.emotion_avant.split(", ").forEach(em => {
      if (!em) return;
      if (!emotionGroups[em]) emotionGroups[em] = [];
      emotionGroups[em].push(t);
    });
  });
  const emotionsSignif = Object.entries(emotionGroups).filter(([_, arr]) => arr.length >= 3);
  if (emotionsSignif.length >= 2) {
    const meilleure = emotionsSignif.reduce((best, cur) => avgPnl(cur[1]) > avgPnl(best[1]) ? cur : best);
    const pire = emotionsSignif.reduce((worst, cur) => avgPnl(cur[1]) < avgPnl(worst[1]) ? cur : worst);
    if (meilleure[0] !== pire[0] && avgPnl(meilleure[1]) > avgPnl(pire[1])) {
      insightEmotion = {
        titre: "État émotionnel",
        icon: "🧠",
        significatif: (avgPnl(meilleure[1]) - avgPnl(pire[1])) > Math.abs(overallAvg) * 0.4,
        positif: true,
        texte: `Quand tu trades "${meilleure[0]}", ton P&L moyen est de ${avgPnl(meilleure[1]).toFixed(0)}$ (${winRate(meilleure[1]).toFixed(0)}% WR). À l'inverse, "${pire[0]}" donne ${avgPnl(pire[1]).toFixed(0)}$ en moyenne.`,
      };
    }
  }

  // ── 5. Analyse IMPULSIVITÉ ──
  const impulsifs = trades.filter(t => t.impulsif);
  const reflechis = trades.filter(t => !t.impulsif);
  let insightImpulsif = null;
  if (impulsifs.length >= 3 && reflechis.length >= 3) {
    const diff = avgPnl(reflechis) - avgPnl(impulsifs);
    insightImpulsif = {
      titre: "Impulsivité",
      icon: "⚡",
      significatif: Math.abs(diff) > Math.abs(overallAvg) * 0.3 || Math.abs(winRate(reflechis) - winRate(impulsifs)) > 15,
      positif: diff > 0,
      texte: `Tes trades impulsifs rapportent en moyenne ${avgPnl(impulsifs).toFixed(0)}$ (${winRate(impulsifs).toFixed(0)}% WR) contre ${avgPnl(reflechis).toFixed(0)}$ (${winRate(reflechis).toFixed(0)}% WR) pour tes trades réfléchis. Écart : ${diff >= 0 ? "+" : ""}${diff.toFixed(0)}$.`,
    };
  }

  // ── 6. Analyse SETUP ──
  let insightSetup = null;
  const setupGroups = {};
  trades.forEach(t => {
    if (!t.setup) return;
    if (!setupGroups[t.setup]) setupGroups[t.setup] = [];
    setupGroups[t.setup].push(t);
  });
  const setupsSignif = Object.entries(setupGroups).filter(([_, arr]) => arr.length >= 3);
  if (setupsSignif.length >= 2) {
    const meilleur = setupsSignif.reduce((best, cur) => avgPnl(cur[1]) > avgPnl(best[1]) ? cur : best);
    insightSetup = {
      titre: "Meilleur setup",
      icon: "🎯",
      significatif: avgPnl(meilleur[1]) > overallAvg * 1.3 && avgPnl(meilleur[1]) > 0,
      positif: true,
      texte: `Ton setup le plus rentable est "${meilleur[0]}" avec ${avgPnl(meilleur[1]).toFixed(0)}$ de moyenne et ${winRate(meilleur[1]).toFixed(0)}% de win rate sur ${meilleur[1].length} trades.`,
    };
  }

  // ── 7. Analyse DURÉE du trade ──
  const dureeTrades = trades.filter(t => t.duree && t.duree > 0);
  let insightDuree = null;
  if (dureeTrades.length >= 6) {
    const courts = dureeTrades.filter(t => t.duree <= 20);
    const longs = dureeTrades.filter(t => t.duree > 20);
    if (courts.length >= 3 && longs.length >= 3) {
      const diff = avgPnl(longs) - avgPnl(courts);
      insightDuree = {
        titre: "Durée du trade",
        icon: "⏱️",
        significatif: Math.abs(diff) > Math.abs(overallAvg) * 0.3,
        positif: diff > 0,
        texte: diff > 0
          ? `Tes trades qui durent plus de 20 min sont plus rentables en moyenne (${avgPnl(longs).toFixed(0)}$) que tes scalps rapides ≤20 min (${avgPnl(courts).toFixed(0)}$).`
          : `Tes trades rapides (≤20 min) performent mieux en moyenne (${avgPnl(courts).toFixed(0)}$) que tes trades longs (${avgPnl(longs).toFixed(0)}$).`,
      };
    }
  }

  // ── 8. Tendance récente ──
  let insightTendance = null;
  if (anciens.length >= 4 && recents.length >= 4) {
    const diff = avgPnl(recents) - avgPnl(anciens);
    insightTendance = {
      titre: "Évolution récente",
      icon: diff > 0 ? "📈" : "📉",
      significatif: Math.abs(diff) > Math.abs(overallAvg) * 0.4,
      positif: diff > 0,
      texte: diff > 0
        ? `Tu progresses : ta deuxième moitié de trades rapporte en moyenne ${diff.toFixed(0)}$ de plus que la première (${avgPnl(recents).toFixed(0)}$ vs ${avgPnl(anciens).toFixed(0)}$).`
        : `Légère baisse de régime : tes trades récents rapportent ${Math.abs(diff).toFixed(0)}$ de moins en moyenne que tes premiers trades. Repère ce qui a changé.`,
    };
  }

  // ── 9. Respect du plan ──
  const planRespecte = trades.filter(t => t.respect === "Oui");
  const planNonRespecte = trades.filter(t => t.respect === "Non");
  let insightPlan = null;
  if (planRespecte.length >= 3 && planNonRespecte.length >= 3) {
    const diff = avgPnl(planRespecte) - avgPnl(planNonRespecte);
    insightPlan = {
      titre: "Respect du plan",
      icon: "📋",
      significatif: Math.abs(diff) > Math.abs(overallAvg) * 0.3,
      positif: diff > 0,
      texte: `Quand tu respectes ton plan, tu fais ${avgPnl(planRespecte).toFixed(0)}$ en moyenne (${winRate(planRespecte).toFixed(0)}% WR) contre ${avgPnl(planNonRespecte).toFixed(0)}$ quand tu ne le respectes pas (${winRate(planNonRespecte).toFixed(0)}% WR).`,
    };
  }

  const allInsights = [insightPlan, insightImpulsif, insightSommeil, insightEmotion, insightSetup, insightHeure, insightAlim, insightDuree, insightTendance].filter(Boolean);
  const significatifs = allInsights.filter(i => i.significatif).sort((a, b) => (b.positif ? 1 : 0) - (a.positif ? 1 : 0));
  const autres = allInsights.filter(i => !i.significatif);

  // ── Synthèse automatique : points forts / axes d'amélioration, en phrases courtes ──
  // Pur calcul sur les insights déjà détectés, pas d'IA — se recalcule à chaque nouveau trade.
  const pointsForts = significatifs.filter(i => i.positif);
  const pointsAmeliorer = significatifs.filter(i => !i.positif);

  const titreEnPhrase = {
    "Respect du plan": "ton respect du plan",
    "Impulsivité": "ta gestion de l'impulsivité",
    "Sommeil": "ton sommeil",
    "État émotionnel": "ton état émotionnel avant trade",
    "Meilleur setup": "ton setup principal",
    "Horaire de trading": "ton horaire de trading",
    "Alimentation": "ton alimentation",
    "Durée du trade": "la durée de tes trades",
    "Évolution récente": "ta progression récente",
  };

  let syntheseTexte = "";
  if (pointsForts.length === 0 && pointsAmeliorer.length === 0) {
    syntheseTexte = "Tes résultats sont homogènes pour l'instant, sans facteur qui se démarque nettement. Continue à enregistrer tes trades pour affiner l'analyse.";
  } else {
    const partsForts = pointsForts.slice(0, 2).map(i => titreEnPhrase[i.titre] || i.titre.toLowerCase());
    const partsAmeliorer = pointsAmeliorer.slice(0, 2).map(i => titreEnPhrase[i.titre] || i.titre.toLowerCase());
    if (partsForts.length > 0) {
      syntheseTexte += `Ce qui marche bien : ${partsForts.join(" et ")}. `;
    }
    if (partsAmeliorer.length > 0) {
      syntheseTexte += `À travailler en priorité : ${partsAmeliorer.join(" et ")}.`;
    } else if (partsForts.length > 0) {
      syntheseTexte += "Continue sur cette voie, aucun point faible majeur ne ressort.";
    }
  }

  // ── Données pour les graphiques ──
  const avgPnlAbs = (arr) => arr.length ? Math.abs(arr.reduce((a, t) => a + t.pnl, 0)) : 0;

  // Camembert : répartition du P&L total par setup (en valeur absolue, gains + pertes)
  const pieSetup = Object.entries(setupGroups)
    .map(([label, arr]) => ({ label, value: avgPnlAbs(arr) || arr.length }))
    .filter(s => s.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
    .map((s, i) => ({ ...s, color: CHART_COLORS[i % CHART_COLORS.length] }));

  // Camembert : répartition du P&L total par émotion ressentie avant le trade
  const pieEmotion = Object.entries(emotionGroups)
    .map(([label, arr]) => ({ label, value: avgPnlAbs(arr) || arr.length }))
    .filter(s => s.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
    .map((s, i) => ({ ...s, color: CHART_COLORS[i % CHART_COLORS.length] }));

  // Barres win rate par tranche horaire (réutilise la logique de découpage horaire)
  const heureTranches = {};
  trades.filter(t => t.heure).forEach(t => {
    const h = parseInt(t.heure.split(":")[0]);
    const tranche = h < 11 ? "Matin (avant 11h)" : h < 14 ? "Midi (11h-14h)" : "Après-midi (14h+)";
    if (!heureTranches[tranche]) heureTranches[tranche] = [];
    heureTranches[tranche].push(t);
  });
  const barWinRateHoraire = Object.entries(heureTranches)
    .filter(([_, arr]) => arr.length >= 2)
    .map(([label, arr]) => ({
      label,
      value: Math.round(winRate(arr)),
      sub: `${arr.length} trades`,
      color: winRate(arr) >= 55 ? COLORS.green : winRate(arr) >= 40 ? COLORS.amber : COLORS.red,
    }));

  // ── Analyse croisée : sommeil × setup ──
  let insightCroise = null;
  const sommeilSetupGroups = {};
  trades.forEach(t => {
    if (!t.sommeil || !t.setup) return;
    const sKey = t.sommeil >= 7 ? "Bon sommeil" : "Sommeil court";
    const key = `${sKey} + ${t.setup}`;
    if (!sommeilSetupGroups[key]) sommeilSetupGroups[key] = [];
    sommeilSetupGroups[key].push(t);
  });
  const croisesSignif = Object.entries(sommeilSetupGroups).filter(([_, arr]) => arr.length >= 3);
  if (croisesSignif.length >= 2) {
    const meilleur = croisesSignif.reduce((best, cur) => avgPnl(cur[1]) > avgPnl(best[1]) ? cur : best);
    const pire = croisesSignif.reduce((worst, cur) => avgPnl(cur[1]) < avgPnl(worst[1]) ? cur : worst);
    if (meilleur[0] !== pire[0] && avgPnl(meilleur[1]) > avgPnl(pire[1]) + Math.abs(overallAvg) * 0.3) {
      insightCroise = {
        titre: "Combinaison gagnante",
        icon: "🔗",
        meilleur: meilleur[0],
        meilleurStats: `${avgPnl(meilleur[1]).toFixed(0)}$ en moyenne, ${winRate(meilleur[1]).toFixed(0)}% WR sur ${meilleur[1].length} trades`,
        pire: pire[0],
        pireStats: `${avgPnl(pire[1]).toFixed(0)}$ en moyenne, ${winRate(pire[1]).toFixed(0)}% WR sur ${pire[1].length} trades`,
      };
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── RÉSUMÉ VISUEL — vue d'ensemble en un coup d'œil ── */}
      <Card style={{ borderLeft: `3px solid ${COLORS.cyan}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2 }}>Analyse automatique</div>
          <div style={{ fontSize: 20 }}>🔬</div>
        </div>

        {/* Jauge respect du plan */}
        {(() => {
          const pctRespect = trades.length ? Math.round((planRespecte.length / trades.length) * 100) : 0;
          const couleurRespect = pctRespect >= 70 ? COLORS.green : pctRespect >= 45 ? COLORS.amber : COLORS.red;
          return (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: COLORS.textDim, fontWeight: 600 }}>Respect du plan</span>
                <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace", color: couleurRespect }}>{pctRespect}%</span>
              </div>
              <div style={{ height: 8, background: COLORS.bg, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${pctRespect}%`, height: "100%", background: couleurRespect, transition: "width 0.5s" }} />
              </div>
            </div>
          );
        })()}

        {/* Synthèse automatique en quelques lignes */}
        <div style={{ background: COLORS.bg, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: COLORS.cyan, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>📝 En résumé</div>
          <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>{syntheseTexte}</div>
        </div>

        {/* 3 indicateurs clés */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div style={{ background: COLORS.bg, borderRadius: 8, padding: "10px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: overallWR >= 55 ? COLORS.green : overallWR >= 40 ? COLORS.amber : COLORS.red }}>{overallWR.toFixed(0)}%</div>
            <div style={{ fontSize: 9, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>Win rate</div>
          </div>
          <div style={{ background: COLORS.bg, borderRadius: 8, padding: "10px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: overallAvg >= 0 ? COLORS.green : COLORS.red }}>{overallAvg >= 0 ? "+" : ""}{overallAvg.toFixed(0)}$</div>
            <div style={{ fontSize: 9, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>P&L moyen</div>
          </div>
          <div style={{ background: COLORS.bg, borderRadius: 8, padding: "10px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: significatifs.length > 0 ? COLORS.cyan : COLORS.muted }}>{significatifs.length}</div>
            <div style={{ fontSize: 9, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>Tendances</div>
          </div>
        </div>

        <div style={{ fontSize: 10, color: COLORS.muted, textAlign: "center", marginTop: 12 }}>
          Basé sur tes {trades.length} trades · mis à jour automatiquement
        </div>
      </Card>

      {/* Courbe d'équité — toujours visible */}
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>📈 Courbe d'équité</div>
        <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 12 }}>P&L cumulé trade après trade — survole un point pour le détail</div>
        <EquityCurve trades={trades} />
      </Card>

      {/* Détail P&L par émotion — toujours visible */}
      {(() => {
        // emotion_avant peut contenir plusieurs émotions ("Stressé, En FOMO") depuis le multi-select,
        // donc on regroupe par occurrence de chaque émotion individuelle plutôt que par égalité stricte.
        const detailEmotions = {};
        trades.forEach(t => {
          if (!t.emotion_avant) return;
          t.emotion_avant.split(", ").forEach(em => {
            if (!em) return;
            if (!detailEmotions[em]) detailEmotions[em] = [];
            detailEmotions[em].push(t);
          });
        });
        const entries = Object.entries(detailEmotions).sort((a, b) => b[1].length - a[1].length);
        if (entries.length === 0) return null;
        return (
          <Card>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>📊 Détail P&L par émotion</div>
            <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 12 }}>Émotions avant trade vs P&L réel</div>
            {entries.map(([em, emT]) => {
              const emPnl = emT.reduce((a, t) => a + t.pnl, 0);
              return (
                <div key={em} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 72, fontSize: 11, color: COLORS.textDim, flexShrink: 0 }}>{em}</div>
                  <div style={{ flex: 1, background: COLORS.bg, borderRadius: 4, height: 20, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, Math.abs(emPnl) / 5)}%`, height: "100%", background: emPnl >= 0 ? COLORS.green + "80" : COLORS.red + "80", display: "flex", alignItems: "center", paddingLeft: 6 }}>
                      <span style={{ fontSize: 10, color: COLORS.text, fontFamily: "monospace" }}>{emPnl >= 0 ? "+" : ""}{emPnl}$</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.textDim, width: 24, textAlign: "right", flexShrink: 0 }}>{emT.length}x</div>
                </div>
              );
            })}
          </Card>
        );
      })()}

      {/* Bouton afficher/masquer le détail */}
      <button onClick={() => setShowDetail(s => !s)} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.cyan, borderRadius: 10, padding: "12px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        {showDetail ? "▲ Masquer le détail" : "▼ Voir le détail complet"}
      </button>

      {showDetail && (
        <>
          {/* Insights significatifs */}
          {significatifs.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2 }}>Ce qui se dégage le plus</div>
              {significatifs.map((insight, i) => (
                <Card key={i} style={{ borderLeft: `3px solid ${insight.positif ? COLORS.green : COLORS.amber}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{insight.icon}</span>
                    <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text }}>{insight.titre}</div>
                    <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, color: insight.positif ? COLORS.green : COLORS.amber, background: (insight.positif ? COLORS.green : COLORS.amber) + "20", border: `1px solid ${(insight.positif ? COLORS.green : COLORS.amber)}40`, borderRadius: 20, padding: "2px 8px" }}>
                      PERTINENT
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6 }}>{insight.texte}</div>
                </Card>
              ))}
            </>
          )}

          {significatifs.length === 0 && (
            <Card style={{ textAlign: "center", padding: "24px 20px" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🧘</div>
              <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6 }}>
                Pas encore de tendance marquante détectée. Tes résultats semblent assez homogènes selon les critères analysés — continue à enregistrer tes trades pour affiner l'analyse.
              </div>
            </Card>
          )}

          {/* ── Analyse croisée sommeil × setup ── */}
          {insightCroise && (
            <>
              <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>Analyse croisée</div>
              <Card style={{ borderLeft: `3px solid ${COLORS.cyan}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{insightCroise.icon}</span>
                  <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text }}>{insightCroise.titre}</div>
                </div>
                <div style={{ background: COLORS.green + "10", border: `1px solid ${COLORS.green}30`, borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.green, marginBottom: 3 }}>✓ {insightCroise.meilleur}</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim }}>{insightCroise.meilleurStats}</div>
                </div>
                <div style={{ background: COLORS.red + "10", border: `1px solid ${COLORS.red}30`, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.red, marginBottom: 3 }}>✗ {insightCroise.pire}</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim }}>{insightCroise.pireStats}</div>
                </div>
                <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 10, fontStyle: "italic" }}>
                  Quand sommeil et setup s'alignent bien, l'écart de performance peut être significatif. Garde un œil sur cette combinaison.
                </div>
              </Card>
            </>
          )}

          {/* ── Graphiques visuels ── */}
          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>Vue graphique</div>

          {pieSetup.length >= 2 && (
            <Card>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>📊 Quel setup a le plus d'impact sur ton P&L</div>
              <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 12 }}>Sur quel setup se concentrent tes gains et pertes (en valeur, pas en nombre de trades)</div>
              <PieChart data={pieSetup} />
            </Card>
          )}

          {pieEmotion.length >= 2 && (
            <Card>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>🧠 Quelle émotion a le plus d'impact sur ton P&L</div>
              <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 12 }}>Sur quel état émotionnel avant trade se concentrent tes gains et pertes</div>
              <PieChart data={pieEmotion} />
            </Card>
          )}

          {barWinRateHoraire.length >= 2 && (
            <Card>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>🕐 Win rate par tranche horaire</div>
              <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 12 }}>Pourcentage de trades gagnants selon l'heure d'entrée</div>
              <BarChartHoriz data={barWinRateHoraire} />
            </Card>
          )}

          {/* Autres observations, moins marquantes */}
          {autres.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>Autres observations</div>
              <Card>
                {autres.map((insight, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < autres.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{insight.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.text, marginBottom: 2 }}>{insight.titre}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.5 }}>{insight.texte}</div>
                    </div>
                  </div>
                ))}
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}


// ─── NOUVEAU TRADE ────────────────────────────────────────────────────────────
function NouveauTrade({ onSave, onCancel, comptes = [], editTrade = null }) {
  const defaultCompte = comptes.length > 0 ? comptes[0].nom : "";
  const [form, setForm] = useState(() => {
    if (editTrade) {
      return {
        date: editTrade.date, heure: editTrade.heure, duree: editTrade.duree?.toString() || "",
        compte: editTrade.compte, actif: editTrade.actif, direction: editTrade.direction,
        setup: editTrade.setup, taille: editTrade.taille?.toString() || "",
        pnl: editTrade.pnl?.toString() || "", rr: editTrade.rr?.toString() || "",
        respect: editTrade.respect, regle_violee: editTrade.regle_violee || "", notes_tech: editTrade.notes_tech || "",
        priere: editTrade.priere, heure_coucher: editTrade.heure_coucher || "", sommeil: editTrade.sommeil?.toString() || "",
        ecrans: editTrade.ecrans, qualite_sommeil: editTrade.qualite_sommeil, alimentation: editTrade.alimentation,
        discipline: editTrade.discipline,
        impulsif: editTrade.impulsif,
        emotion_avant: editTrade.emotion_avant ? editTrade.emotion_avant.split(", ").filter(Boolean) : [],
        emotion_pendant: editTrade.emotion_pendant ? editTrade.emotion_pendant.split(", ").filter(Boolean) : [],
        emotion_apres: editTrade.emotion_apres ? editTrade.emotion_apres.split(", ").filter(Boolean) : [],
        lecon: editTrade.lecon || "", note: editTrade.note,
      };
    }
    return {
      date: new Date().toISOString().split("T")[0], heure: "09:30", duree: "",
      compte: defaultCompte, actif: "Nasdaq", direction: "LONG", setup: "Breakout", taille: "",
      pnl: "", rr: "", respect: "Oui", regle_violee: "", notes_tech: "",
      priere: false, heure_coucher: "", sommeil: "", ecrans: false, qualite_sommeil: 3,
      alimentation: "Neutre", discipline: 3,
      impulsif: false, emotion_avant: [], emotion_pendant: [], emotion_apres: [],
      lecon: "", note: 3,
    };
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [emotions, setEmotions] = useState([
    "Serein", "Confiant", "Neutre", "Stressé", "Anxieux",
    "Frustré", "Euphorique", "En FOMO", "Impatient", "En colère",
    "Déçu", "Surexcité", "Fatigué",
  ]);
  const [newEmotion, setNewEmotion] = useState("");
  const [showAddEmotion, setShowAddEmotion] = useState(null); // field name ou null

  const addEmotion = (field) => {
    const val = newEmotion.trim();
    if (!val || emotions.includes(val)) return;
    setEmotions(e => [...e, val]);
    set(field, val);
    setNewEmotion("");
    setShowAddEmotion(null);
  };

  const inp = { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 8, padding: "10px 12px", fontSize: 13, width: "100%", boxSizing: "border-box" };
  const lbl = { fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, display: "block" };

  const toggleEmotion = (field, em) => {
    const current = Array.isArray(form[field]) ? form[field] : form[field] ? [form[field]] : [];
    if (current.includes(em)) {
      set(field, current.filter(e => e !== em));
    } else {
      set(field, [...current, em]);
    }
  };

  const EmotionPicker = ({ field }) => {
    const selected = Array.isArray(form[field]) ? form[field] : form[field] ? [form[field]] : [];
    return (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {emotions.map(em => {
            const isSelected = selected.includes(em);
            return (
              <button key={em} onClick={() => toggleEmotion(field, em)} style={{ background: isSelected ? COLORS.amber + "25" : COLORS.bg, border: `1px solid ${isSelected ? COLORS.amber : COLORS.border}`, color: isSelected ? COLORS.amber : COLORS.textDim, borderRadius: 6, padding: "5px 9px", fontSize: 11, cursor: "pointer", fontWeight: isSelected ? 700 : 400, position: "relative" }}>
                {em}
                {isSelected && <span style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, borderRadius: "50%", background: COLORS.amber, border: `2px solid ${COLORS.bg}` }} />}
              </button>
            );
          })}
          <button onClick={() => setShowAddEmotion(showAddEmotion === field ? null : field)} style={{ background: "transparent", border: `1px dashed ${COLORS.border}`, color: COLORS.muted, borderRadius: 6, padding: "5px 9px", fontSize: 11, cursor: "pointer" }}>
            {showAddEmotion === field ? "✕" : "+ Ajouter"}
          </button>
        </div>
        {selected.length > 0 && (
          <div style={{ fontSize: 10, color: COLORS.amber, marginBottom: 6 }}>
            ✓ {selected.join(" · ")}
          </div>
        )}
        {showAddEmotion === field && (
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <input
              autoFocus
              placeholder="Nouvelle émotion..."
              value={newEmotion}
              onChange={e => setNewEmotion(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addEmotion(field)}
              style={{ ...inp, flex: 1, padding: "7px 10px", fontSize: 12 }}
            />
            <button onClick={() => addEmotion(field)} style={{ background: COLORS.amber, color: COLORS.bg, border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✓</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text }}>{editTrade ? `✎ Modifier le trade #${editTrade.id}` : "Nouveau trade"}</div>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
      </div>

      {/* Technique */}
      <Card>
        <SectionTitle>🔧 Technique</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div><label style={lbl}>Date</label><input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Heure</label><input type="time" value={form.heure} onChange={e => set("heure", e.target.value)} style={inp} /></div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>Durée du trade (min)</label>
          <input type="number" placeholder="ex: 45" value={form.duree} onChange={e => set("duree", e.target.value)} style={inp} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div><label style={lbl}>Compte</label>
            <select value={form.compte} onChange={e => set("compte", e.target.value)} style={inp}>
              {comptes.length > 0
                ? comptes.map(c => (
                    <option key={c.id} value={c.nom}>
                      {PROP_FIRMS_CATALOG[c.type]?.emoji} {c.nom}{c.numero ? ` — #${c.numero}` : ""}
                    </option>
                  ))
                : Object.keys(PROP_FIRMS_CATALOG).filter(k => k !== "Autre").map(k => (
                    <option key={k} value={`${PROP_FIRMS_CATALOG[k].nom} Eval`}>
                      {PROP_FIRMS_CATALOG[k].emoji} {PROP_FIRMS_CATALOG[k].nom}
                    </option>
                  ))
              }
            </select>
          </div>
          <div><label style={lbl}>Actif</label>
            <select value={form.actif} onChange={e => set("actif", e.target.value)} style={inp}>
              <option>Nasdaq</option><option>Gold</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>Direction</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["LONG", "SHORT"].map(d => (
              <button key={d} onClick={() => set("direction", d)} style={{ flex: 1, background: form.direction === d ? (d === "LONG" ? COLORS.green : COLORS.red) + "25" : COLORS.bg, border: `1px solid ${form.direction === d ? (d === "LONG" ? COLORS.green : COLORS.red) : COLORS.border}`, color: form.direction === d ? (d === "LONG" ? COLORS.green : COLORS.red) : COLORS.textDim, borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{d}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>Setup</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Breakout", "Pullback", "Reversal", "Range", "News", "Scalp", "Swing", "Autre"].map(s => (
              <button key={s} onClick={() => set("setup", s)} style={{ background: form.setup === s ? COLORS.cyan + "20" : COLORS.bg, border: `1px solid ${form.setup === s ? COLORS.cyan : COLORS.border}`, color: form.setup === s ? COLORS.cyan : COLORS.textDim, borderRadius: 6, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div><label style={lbl}>R:R</label><input type="number" step="0.1" placeholder="2.0" value={form.rr} onChange={e => set("rr", e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Taille</label><input type="number" placeholder="lots" value={form.taille} onChange={e => set("taille", e.target.value)} style={inp} /></div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>Respect du plan</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["Oui", "Partiel", "Non"].map(r => (
              <button key={r} onClick={() => set("respect", r)} style={{ flex: 1, background: form.respect === r ? (r === "Oui" ? COLORS.green : r === "Partiel" ? COLORS.amber : COLORS.red) + "20" : COLORS.bg, border: `1px solid ${form.respect === r ? (r === "Oui" ? COLORS.green : r === "Partiel" ? COLORS.amber : COLORS.red) : COLORS.border}`, color: form.respect === r ? (r === "Oui" ? COLORS.green : r === "Partiel" ? COLORS.amber : COLORS.red) : COLORS.textDim, borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{r}</button>
            ))}
          </div>
        </div>
        {form.respect !== "Oui" && (
          <div style={{ marginBottom: 10 }}>
            <label style={lbl}>Règle violée</label>
            <input type="text" placeholder="ex: Stop trop serré, entrée sans confirmation..." value={form.regle_violee} onChange={e => set("regle_violee", e.target.value)} style={inp} />
          </div>
        )}
        <div>
          <label style={lbl}>Notes techniques</label>
          <textarea placeholder="Analyse, confluences, contexte HTF..." value={form.notes_tech} onChange={e => set("notes_tech", e.target.value)} rows={3} style={{ ...inp, resize: "vertical" }} />
        </div>

        {/* P&L — le résultat du trade, mis en avant en dernier */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${COLORS.border}` }}>
          <label style={{ ...lbl, fontSize: 12, color: COLORS.text, marginBottom: 8 }}>💰 Gain / Perte du trade</label>
          <input
            type="number"
            placeholder="0"
            value={form.pnl}
            onChange={e => set("pnl", e.target.value)}
            style={{
              ...inp,
              fontSize: 28,
              fontWeight: 800,
              fontFamily: "monospace",
              textAlign: "center",
              padding: "16px 12px",
              color: form.pnl > 0 ? COLORS.green : form.pnl < 0 ? COLORS.red : COLORS.text,
              border: `2px solid ${form.pnl > 0 ? COLORS.green + "60" : form.pnl < 0 ? COLORS.red + "60" : COLORS.border}`,
            }}
          />
          <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 6, textAlign: "center" }}>En $ — négatif pour une perte</div>
        </div>
      </Card>

      {/* Discipline */}
      <Card>
        <SectionTitle>🌿 Discipline</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div>
            <label style={lbl}>Prière</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Oui", "Non"].map(v => <button key={v} onClick={() => set("priere", v === "Oui")} style={{ flex: 1, background: (form.priere ? "Oui" : "Non") === v ? COLORS.cyan + "20" : COLORS.bg, border: `1px solid ${(form.priere ? "Oui" : "Non") === v ? COLORS.cyan : COLORS.border}`, color: (form.priere ? "Oui" : "Non") === v ? COLORS.cyan : COLORS.textDim, borderRadius: 8, padding: 10, fontSize: 13, cursor: "pointer" }}>{v}</button>)}
            </div>
          </div>
          <div><label style={lbl}>Heure coucher</label><input type="time" value={form.heure_coucher} onChange={e => set("heure_coucher", e.target.value)} style={inp} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div><label style={lbl}>Sommeil (h)</label><input type="number" step="0.5" placeholder="7.5" value={form.sommeil} onChange={e => set("sommeil", e.target.value)} style={inp} /></div>
          <div>
            <label style={lbl}>Écrans avant dodo</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Non", "Oui"].map(v => <button key={v} onClick={() => set("ecrans", v === "Oui")} style={{ flex: 1, background: (form.ecrans ? "Oui" : "Non") === v ? (v === "Oui" ? COLORS.amber : COLORS.green) + "20" : COLORS.bg, border: `1px solid ${(form.ecrans ? "Oui" : "Non") === v ? (v === "Oui" ? COLORS.amber : COLORS.green) : COLORS.border}`, color: (form.ecrans ? "Oui" : "Non") === v ? (v === "Oui" ? COLORS.amber : COLORS.green) : COLORS.textDim, borderRadius: 8, padding: 10, fontSize: 13, cursor: "pointer" }}>{v}</button>)}
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>Qualité sommeil</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[1,2,3,4,5].map(n => <button key={n} onClick={() => set("qualite_sommeil", n)} style={{ flex: 1, background: form.qualite_sommeil >= n ? COLORS.cyan + "20" : COLORS.bg, border: `1px solid ${form.qualite_sommeil >= n ? COLORS.cyan : COLORS.border}`, color: form.qualite_sommeil >= n ? COLORS.cyan : COLORS.muted, borderRadius: 8, padding: 8, fontSize: 14, cursor: "pointer" }}>★</button>)}
          </div>
        </div>
        <div>
          <label style={lbl}>Alimentation</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["Saine", "Neutre", "Mauvaise"].map(a => <button key={a} onClick={() => set("alimentation", a)} style={{ flex: 1, background: form.alimentation === a ? COLORS.cyan + "20" : COLORS.bg, border: `1px solid ${form.alimentation === a ? COLORS.cyan : COLORS.border}`, color: form.alimentation === a ? COLORS.cyan : COLORS.textDim, borderRadius: 8, padding: 8, fontSize: 12, cursor: "pointer" }}>{a}</button>)}
          </div>
        </div>
      </Card>

      {/* Psychologie */}
      <Card>
        <SectionTitle>🧠 Psychologie</SectionTitle>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Impulsif ?</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["Non", "Oui"].map(v => <button key={v} onClick={() => set("impulsif", v === "Oui")} style={{ flex: 1, background: (form.impulsif ? "Oui" : "Non") === v ? (v === "Oui" ? COLORS.red : COLORS.green) + "20" : COLORS.bg, border: `1px solid ${(form.impulsif ? "Oui" : "Non") === v ? (v === "Oui" ? COLORS.red : COLORS.green) : COLORS.border}`, color: (form.impulsif ? "Oui" : "Non") === v ? (v === "Oui" ? COLORS.red : COLORS.green) : COLORS.textDim, borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{v}</button>)}
          </div>
        </div>
        <div style={{ marginBottom: 12 }}><label style={lbl}>Émotion avant</label><EmotionPicker field="emotion_avant" /></div>
        <div style={{ marginBottom: 12 }}><label style={lbl}>Émotion pendant</label><EmotionPicker field="emotion_pendant" /></div>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Note globale</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[1,2,3,4,5].map(n => <button key={n} onClick={() => set("note", n)} style={{ flex: 1, background: form.note >= n ? COLORS.amber + "20" : COLORS.bg, border: `1px solid ${form.note >= n ? COLORS.amber : COLORS.border}`, color: form.note >= n ? COLORS.amber : COLORS.muted, borderRadius: 8, padding: 10, fontSize: 16, cursor: "pointer" }}>⭐</button>)}
          </div>
        </div>
        <div>
          <label style={lbl}>Leçon apprise</label>
          <textarea placeholder="Ce que ce trade t'a appris..." value={form.lecon} onChange={e => set("lecon", e.target.value)} rows={3} style={{ ...inp, resize: "vertical" }} />
        </div>
      </Card>

      <button onClick={() => onSave(form, editTrade?.id)} style={{ background: COLORS.green, color: COLORS.bg, border: "none", borderRadius: 10, padding: 16, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
        {editTrade ? "✓ Mettre à jour le trade" : "✓ Enregistrer le trade"}
      </button>
    </div>
  );
}

// ─── RÈGLES ───────────────────────────────────────────────────────────────────
function Regles({ comptes, preselectedFirm = null, reglesPerso, setReglesPerso }) {
  const firmsInUse = [...new Set(comptes.map(c => c.type))].filter(t => PROP_FIRMS_CATALOG[t]);
  const allFirms = Object.keys(PROP_FIRMS_CATALOG);
  const [tab, setTab] = useState(preselectedFirm || firmsInUse[0] || "Topstep");
  const firm = PROP_FIRMS_CATALOG[tab] || PROP_FIRMS_CATALOG["Autre"];
  const couleur = firm.couleur;

  const [newRegle, setNewRegle] = useState({ titre: "", categorie: "Risque" });
  const [showRegleForm, setShowRegleForm] = useState(false);

  const inp = { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 8, padding: "10px 12px", fontSize: 13, width: "100%", boxSizing: "border-box" };
  const lbl = { fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, display: "block" };

  const addRegle = () => {
    if (!newRegle.titre) return;
    setReglesPerso(r => [...r, { id: Date.now(), ...newRegle, actif: true }]);
    setNewRegle({ titre: "", categorie: "Risque" });
    setShowRegleForm(false);
  };
  const toggleRegle = (id) => setReglesPerso(r => r.map(x => x.id === id ? { ...x, actif: !x.actif } : x));
  const removeRegle = (id) => setReglesPerso(r => r.filter(x => x.id !== id));
  const catColors = { Risque: COLORS.red, Quantité: COLORS.amber, Psychologie: COLORS.cyan, Technique: COLORS.green };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Onglets scrollables */}
      <div style={{ overflowX: "auto", paddingBottom: 4 }}>
        <div style={{ display: "flex", gap: 8, minWidth: "max-content" }}>
          <button onClick={() => setTab("REGLEMENTATION")} style={{ background: tab === "REGLEMENTATION" ? COLORS.amber + "25" : COLORS.card, border: `1px solid ${tab === "REGLEMENTATION" ? COLORS.amber : COLORS.border}`, color: tab === "REGLEMENTATION" ? COLORS.amber : COLORS.textDim, borderRadius: 8, padding: "8px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            🇫🇷 Réglementation
          </button>
          {allFirms.map(key => {
            const f = PROP_FIRMS_CATALOG[key];
            const actif = tab === key;
            const enUse = firmsInUse.includes(key);
            return (
              <button key={key} onClick={() => setTab(key)} style={{ background: actif ? f.couleur + "25" : COLORS.card, border: `1px solid ${actif ? f.couleur : COLORS.border}`, color: actif ? f.couleur : COLORS.textDim, borderRadius: 8, padding: "8px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", position: "relative" }}>
                {f.emoji} {f.nom}
                {enUse && <span style={{ position: "absolute", top: -3, right: -3, width: 7, height: 7, borderRadius: "50%", background: f.couleur, border: `2px solid ${COLORS.bg}` }} />}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "REGLEMENTATION" ? (
        <>
          <Card style={{ borderLeft: `3px solid ${COLORS.amber}`, padding: "14px 16px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>🇫🇷 Réglementation française — prop trading</div>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 4 }}>Ce que dit le cadre légal français sur l'activité de trading via prop firm. Information générale — consulte un expert-comptable pour ta situation précise.</div>
          </Card>

          <Card style={{ borderLeft: `3px solid ${COLORS.red}` }}>
            <div style={{ fontSize: 10, color: COLORS.red, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>⚠️ Statut juridique obligatoire</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>Aucune structure = travail dissimulé</div>
            <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6 }}>
              Recevoir des virements réguliers d'une prop firm sans déclarer cette activité via une structure légale (micro-entreprise ou société) s'apparente à du travail dissimulé. Une déclaration est obligatoire dès le premier payout.
            </div>
          </Card>

          <Card style={{ borderLeft: `3px solid ${COLORS.amber}` }}>
            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Qualification fiscale</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>Revenus en BNC, pas en plus-values</div>
            <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6 }}>
              Les gains issus d'une prop firm ne sont pas des plus-values mobilières (flat tax 30%). Le trader ne possède pas le capital tradé — il exécute un mandat pour le compte de la firme, qui reverse une part des profits. Ces revenus relèvent du régime des Bénéfices Non Commerciaux (BNC), quelle que soit la nationalité de la prop firm (USA, République tchèque, UAE...).
            </div>
          </Card>

          <Card style={{ borderLeft: `3px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Régime applicable</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>Micro-BNC ou réel selon le CA</div>
            <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6, whiteSpace: "pre-line" }}>
              {"Micro-entreprise (micro-BNC) :\nAbattement forfaitaire de 34% sur le CA encaissé. Cotisations sociales ~25,6% du CA en 2026. Simple, mais aucune charge réelle déductible au-delà de l'abattement.\n\nRégime réel (EI ou société) :\nUtile si tes charges réelles (frais de challenge, plateforme, formation...) dépassent 34% de ton CA brut. Comptabilité plus complexe."}
            </div>
          </Card>

          <Card style={{ borderLeft: `3px solid ${COLORS.cyan}` }}>
            <div style={{ fontSize: 10, color: COLORS.cyan, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Code APE / NAF à déclarer</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 10 }}>Lequel choisir pour le trading via prop firm</div>

            <div style={{ background: COLORS.bg, borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: COLORS.green }}>6499Z</span>
                <span style={{ background: COLORS.green + "20", border: `1px solid ${COLORS.green}40`, borderRadius: 20, padding: "2px 8px", fontSize: 9, fontWeight: 700, color: COLORS.green }}>RECOMMANDÉ</span>
              </div>
              <div style={{ fontSize: 11, color: COLORS.text, fontWeight: 600, marginBottom: 3 }}>Autres activités des services financiers, hors assurance et caisses de retraite, n.c.a.</div>
              <div style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.5 }}>Code le plus utilisé par les traders indépendants pour compte propre. C'est celui qui correspond le mieux à l'activité de trading via prop firm (tu ne gères pas l'argent de tiers).</div>
            </div>

            <div style={{ background: COLORS.bg, borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: COLORS.red }}>6612Z</span>
                <span style={{ background: COLORS.red + "20", border: `1px solid ${COLORS.red}40`, borderRadius: 20, padding: "2px 8px", fontSize: 9, fontWeight: 700, color: COLORS.red }}>À ÉVITER</span>
              </div>
              <div style={{ fontSize: 11, color: COLORS.text, fontWeight: 600, marginBottom: 3 }}>Courtage de valeurs mobilières et de marchandises</div>
              <div style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.5 }}>Concerne le courtage pour le compte de tiers, pas le trading pour compte propre. Ne correspond pas à l'activité prop firm — à ne pas déclarer pour ce type d'activité.</div>
            </div>

            <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 4, lineHeight: 1.6 }}>
              ⚠️ Le code APE est attribué par l'INSEE à partir de ta déclaration d'activité — tu ne le choisis pas directement, mais tu peux orienter le bon code en décrivant précisément ton activité ("opérations de trading pour compte propre via plateforme de financement externe") lors de l'immatriculation, et demander une rectification après coup si besoin.
            </div>
          </Card>

          <Card style={{ borderLeft: `3px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Vérification des plateformes</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>L'AMF ne régule pas les prop firms</div>
            <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6 }}>
              Les prop firms paient sur compte simulé/démo — elles n'ont pas besoin d'agrément AMF puisqu'elles ne gèrent pas l'argent de tiers sur les marchés réels. L'AMF publie en revanche des listes noires de plateformes frauduleuses sur d'autres segments (forex, crypto, options binaires) : utile pour vérifier un broker, pas directement applicable aux prop firms elles-mêmes.
            </div>
          </Card>

          {/* Liens officiels */}
          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>Sources officielles</div>
          <Card>
            {[
              { label: "AMF — Autorité des Marchés Financiers", desc: "Régulateur français, listes noires et mises en garde", url: "https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-noires-et-mises-en-garde", icon: "⚖️" },
              { label: "service-public.fr — Micro-entreprise", desc: "Statut juridique, démarches de création", url: "https://www.service-public.fr/professionnels-entreprises/vosdroits/F23961", icon: "📄" },
              { label: "URSSAF — Cotisations micro-entrepreneur", desc: "Taux de cotisations sociales à jour", url: "https://www.urssaf.fr/accueil/independants/independant/declarer-payer-cotisations/taux-cotisations-micro-entreprise.html", icon: "💼" },
              { label: "impots.gouv.fr — BNC", desc: "Déclaration des bénéfices non commerciaux", url: "https://www.impots.gouv.fr/professionnel/benefices-non-commerciaux-bnc", icon: "🧾" },
            ].map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: i < 3 ? `1px solid ${COLORS.border}` : "none", textDecoration: "none" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.cyan }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 2 }}>{s.desc}</div>
                </div>
                <span style={{ fontSize: 12, color: COLORS.muted }}>↗</span>
              </a>
            ))}
          </Card>

          <div style={{ fontSize: 10, color: COLORS.muted, textAlign: "center", marginTop: 4, fontStyle: "italic", lineHeight: 1.6 }}>
            Ces informations sont générales et ne remplacent pas l'avis d'un expert-comptable. Le module Structure & fiscalité de l'onglet ROI permet d'estimer ton imposition selon ta situation.
          </div>
        </>
      ) : (
        <>
      {/* Header */}
      <Card style={{ borderLeft: `3px solid ${couleur}`, padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>{firm.emoji} {firm.nom}</div>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{firm.description}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            {firmsInUse.includes(tab) && (
              <div style={{ background: couleur + "20", border: `1px solid ${couleur}40`, borderRadius: 20, padding: "3px 10px", fontSize: 10, color: couleur, fontWeight: 700 }}>● ACTIF</div>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              {firm?.siteUrl && (
                <a href={firm.siteUrl} target="_blank" rel="noopener noreferrer" style={{ background: couleur + "15", border: `1px solid ${couleur}30`, borderRadius: 6, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: couleur, textDecoration: "none" }}>🌐 Site</a>
              )}
              {firm?.reglesUrl && (
                <a href={firm.reglesUrl} target="_blank" rel="noopener noreferrer" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: COLORS.textDim, textDecoration: "none" }}>📋 Règles</a>
              )}
              {firm?.discordUrl && (
                <a href={firm.discordUrl} target="_blank" rel="noopener noreferrer" style={{ background: "#5865F215", border: "1px solid #5865F240", borderRadius: 6, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: "#5865F2", textDecoration: "none" }}>💬 Discord</a>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Règles */}
      {firm.regles.map((r, i) => (
        <Card key={i} style={{ borderLeft: `3px solid ${r.critique ? COLORS.red : COLORS.border}` }}>
          <div style={{ fontSize: 10, color: r.critique ? COLORS.red : COLORS.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{r.cat}{r.critique && " — CRITIQUE"}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>{r.titre}</div>
          <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6, whiteSpace: "pre-line" }}>{r.desc}</div>
        </Card>
      ))}
        </>
      )}

      {/* ── MES RÈGLES PERSONNELLES ── */}
      <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 8 }}>Mes règles personnelles</div>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <SectionTitle style={{ margin: 0 }}>📋 Mon cadre de discipline</SectionTitle>
          <button onClick={() => setShowRegleForm(s => !s)} style={{ background: COLORS.amber + "20", border: `1px solid ${COLORS.amber}40`, color: COLORS.amber, borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            {showRegleForm ? "✕" : "+ Ajouter"}
          </button>
        </div>

        {showRegleForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14, background: COLORS.bg, borderRadius: 8, padding: 12 }}>
            <div><label style={lbl}>Règle</label><input placeholder="ex: Max 3 trades par jour" value={newRegle.titre} onChange={e => setNewRegle(r => ({ ...r, titre: e.target.value }))} style={inp} /></div>
            <div><label style={lbl}>Catégorie</label>
              <select value={newRegle.categorie} onChange={e => setNewRegle(r => ({ ...r, categorie: e.target.value }))} style={inp}>
                {["Risque", "Quantité", "Psychologie", "Technique"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={addRegle} style={{ background: COLORS.amber, color: COLORS.bg, border: "none", borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>✓ Ajouter la règle</button>
          </div>
        )}

        {reglesPerso.length === 0 && !showRegleForm && (
          <div style={{ textAlign: "center", padding: "16px 0", color: COLORS.muted, fontSize: 12 }}>
            Aucune règle personnelle. Ajoute les tiennes pour cadrer ta discipline.
          </div>
        )}

        {reglesPerso.map(r => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
            <button onClick={() => toggleRegle(r.id)} style={{ background: r.actif ? COLORS.green + "20" : COLORS.surface, border: `1px solid ${r.actif ? COLORS.green : COLORS.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: r.actif ? COLORS.green : COLORS.muted, cursor: "pointer", flexShrink: 0 }}>{r.actif ? "ON" : "OFF"}</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: r.actif ? COLORS.text : COLORS.muted, fontWeight: 600 }}>{r.titre}</div>
              <div style={{ fontSize: 10, color: catColors[r.categorie] || COLORS.muted, marginTop: 2, fontWeight: 700 }}>{r.categorie}</div>
            </div>
            <button onClick={() => removeRegle(r.id)} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 14, cursor: "pointer" }}>✕</button>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── ROI ──────────────────────────────────────────────────────────────────────
function ROI({ comptes, setComptes, trades, onEditCompte, mentorQ, setMentorQ, fraisDivers, setFraisDivers, fiscal, setFiscal, deviseRecue, setDeviseRecue, deviseRef, setDeviseRef, tauxPerso, setTauxPerso }) {
  const [newPayout, setNewPayout] = useState({ compte: comptes[0]?.nom || "", montant: "", devise: "USD", date: new Date().toISOString().split("T")[0] });
  const [newFrais, setNewFrais] = useState({ label: "", montant: "", type: "unique", categorie: "autre" });
  const [showFraisForm, setShowFraisForm] = useState(false);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [editingFiscal, setEditingFiscal] = useState(false); // true = formulaire déplié, false = résumé compact
  const [showDeviseRecueForm, setShowDeviseRecueForm] = useState(false);
  const [showTauxForm, setShowTauxForm] = useState(false);

  const inp = { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 8, padding: "10px 12px", fontSize: 13, width: "100%", boxSizing: "border-box" };
  const lbl = { fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, display: "block" };

  const addPayout = () => {
    if (!newPayout.montant) return;
    setComptes(cs => cs.map(c => c.nom === newPayout.compte
      ? { ...c, payouts: [...c.payouts, { date: newPayout.date, montant: parseFloat(newPayout.montant), devise: newPayout.devise }] }
      : c));
    setNewPayout(p => ({ ...p, montant: "" }));
    setShowPayoutForm(false);
  };

  const addFrais = () => {
    if (!newFrais.label || !newFrais.montant) return;
    setFraisDivers(f => [...f, { id: Date.now(), ...newFrais, montant: parseFloat(newFrais.montant) }]);
    setNewFrais({ label: "", montant: "", type: "unique", categorie: "autre" });
    setShowFraisForm(false);
  };

  const removeFrais = (id) => setFraisDivers(f => f.filter(x => x.id !== id));

  // ── Calculs ──
  const today = new Date().toISOString().slice(0, 7);
  const moisMQ = moisEntre(mentorQ.moisDebut, today);
  const totalMQ = mentorQ.mensuel * moisMQ;
  const totalPropFirms = comptes.reduce((a, c) => a + c.achat + c.activation, 0);
  const totalFraisDivers = fraisDivers.reduce((a, f) => a + f.montant, 0);
  const totalDepenses = totalPropFirms + totalMQ + totalFraisDivers;
  const totalPayouts = comptes.reduce((a, c) => a + c.payouts.reduce((b, p) => b + p.montant, 0), 0);
  const symboleRecue = getDeviseSymbole(deviseRecue);
  const symboleRef = getDeviseSymbole(deviseRef);

  const totalPnl = trades ? trades.reduce((a, t) => a + t.pnl, 0) : 0;
  const resultatNet = totalPayouts - totalDepenses;
  const roi = totalDepenses ? ((resultatNet / totalDepenses) * 100) : 0;
  const tauxConversion = deviseRef === deviseRecue ? 1 : convertirDevise(1, deviseRecue, deviseRef, tauxPerso);
  const resultatNetConverti = deviseRef === deviseRecue ? resultatNet : convertirDevise(resultatNet, deviseRecue, deviseRef, tauxPerso);

  // Calcul fiscal — l'impôt s'applique TOUJOURS dans la devise fiscale du pays choisi
  // (ex: France impose en €, quelle que soit la devise dans laquelle l'argent a été reçu).
  // Cette conversion fiscale est automatique et indépendante de la conversion "Net après conversion".
  const fiscalStructureData = fiscal.actif ? PAYS_FISCAL[fiscal.pays]?.structures.find(s => s.id === fiscal.structure) : null;
  const fiscalPaysData = fiscal.actif ? PAYS_FISCAL[fiscal.pays] : null;
  const fiscalInfosAcreRaw = (fiscal.actif && fiscal.pays === "FR" && fiscalStructureData?.acre && fiscal.dateCreation) ? getStatutAcre(fiscalStructureData, fiscal.dateCreation) : null;
  const fiscalTauxEffectif = (fiscalInfosAcreRaw?.active && fiscal.acreActif) ? fiscalInfosAcreRaw.taux : fiscal.taux;
  const deviseFiscale = fiscalPaysData?.deviseFiscale || deviseRecue;
  const symboleFiscal = getDeviseSymbole(deviseFiscale);
  // Montant brut converti automatiquement dans la devise fiscale du pays (ex: $ → € pour la France)
  const resultatNetEnDeviseFiscale = (deviseFiscale === deviseRecue) ? resultatNet : convertirDevise(resultatNet, deviseRecue, deviseFiscale, tauxPerso);
  const netApresImpotGlobal = fiscal.actif
    ? resultatNetEnDeviseFiscale - (resultatNetEnDeviseFiscale > 0 ? resultatNetEnDeviseFiscale * (fiscalTauxEffectif / 100) : 0)
    : null;
  const montantImpotSeul = fiscal.actif && resultatNetEnDeviseFiscale > 0 ? resultatNetEnDeviseFiscale * (fiscalTauxEffectif / 100) : 0;

  // Case combinée : on part du montant déjà imposé (en devise fiscale), puis on convertit vers la devise cible choisie
  const netCombineFinal = (fiscal.actif && netApresImpotGlobal !== null)
    ? ((deviseRef === deviseFiscale) ? netApresImpotGlobal : convertirDevise(netApresImpotGlobal, deviseFiscale, deviseRef, tauxPerso))
    : null;

  // Écart généré par la conversion seule (différentiel par rapport au montant brut reçu)
  const ecartConversion = resultatNetConverti - resultatNet;

  // Grouper comptes par type pour couleurs
  const byType = {};
  comptes.forEach(c => { if (!byType[c.type]) byType[c.type] = []; byType[c.type].push(c); });

  const catLabels = { plateforme: "🖥 Plateforme", formation: "📚 Formation", abonnement: "🔄 Abonnement", autre: "📌 Autre" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── RÉSULTAT NET GLOBAL ── */}
      <Card style={{ borderLeft: `3px solid ${resultatNet >= 0 ? COLORS.green : COLORS.red}` }}>
        <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Bilan global</div>

        {/* ── ÉTAPE 1 : Montant brut reçu, devise cliquable ── */}
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 4 }}>Résultat brut</div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
            <span style={{ fontSize: 48, fontWeight: 800, fontFamily: "monospace", letterSpacing: -2, color: resultatNet >= 0 ? COLORS.green : COLORS.red, lineHeight: 1 }}>
              {resultatNet >= 0 ? "+" : ""}{resultatNet}
            </span>
            <button onClick={() => setShowDeviseRecueForm(s => !s)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 36, fontWeight: 800, fontFamily: "monospace", color: resultatNet >= 0 ? COLORS.green : COLORS.red, opacity: 0.8, textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 6 }}>
              {symboleRecue}
            </button>
          </div>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginTop: 6 }}>
            ROI <span style={{ color: roi >= 0 ? COLORS.green : COLORS.red, fontWeight: 700 }}>{roi >= 0 ? "+" : ""}{roi.toFixed(1)}%</span>
          </div>
        </div>

        {showDeviseRecueForm && (
          <div style={{ background: COLORS.bg, borderRadius: 10, padding: 12, marginBottom: 14 }}>
            <label style={lbl}>Mes payouts sont reçus en quelle devise ?</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {DEVISES.map(d => (
                <button key={d.code} onClick={() => { setDeviseRecue(d.code); setDeviseRef(d.code); setShowDeviseRecueForm(false); }} style={{ background: deviseRecue === d.code ? COLORS.green + "20" : COLORS.surface, border: `1px solid ${deviseRecue === d.code ? COLORS.green : COLORS.border}`, color: deviseRecue === d.code ? COLORS.green : COLORS.textDim, borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  {d.symbole} {d.code}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 8 }}>Change juste l'étiquette — aucune conversion appliquée. C'est la devise réelle dans laquelle tu reçois tes payouts (souvent $ pour les prop firms).</div>
          </div>
        )}

        {showTauxForm && (
          <div style={{ background: COLORS.bg, borderRadius: 10, padding: 12, marginBottom: 14 }}>
            <label style={lbl}>Convertir vers quelle devise ?</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              <button onClick={() => { setDeviseRef(deviseRecue); setShowTauxForm(false); }} style={{ background: deviseRef === deviseRecue ? COLORS.cyan + "20" : COLORS.surface, border: `1px solid ${deviseRef === deviseRecue ? COLORS.cyan : COLORS.border}`, color: deviseRef === deviseRecue ? COLORS.cyan : COLORS.textDim, borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                {symboleRecue} {deviseRecue} (aucune conversion)
              </button>
              {DEVISES.filter(d => d.code !== deviseRecue).map(d => (
                <button key={d.code} onClick={() => { setDeviseRef(d.code); setShowTauxForm(false); }} style={{ background: deviseRef === d.code ? COLORS.cyan + "20" : COLORS.surface, border: `1px solid ${deviseRef === d.code ? COLORS.cyan : COLORS.border}`, color: deviseRef === d.code ? COLORS.cyan : COLORS.textDim, borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  {d.symbole} {d.code}
                </button>
              ))}
            </div>
            {deviseRef !== deviseRecue && (
              <div>
                <label style={lbl}>Taux de change · 1 {deviseRecue} =</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number" step="0.0001"
                    placeholder={tauxConversion.toFixed(4)}
                    value={tauxPerso[deviseRef] ?? ""}
                    onChange={e => setTauxPerso(t => ({ ...t, [deviseRef]: e.target.value === "" ? undefined : parseFloat(e.target.value) }))}
                    style={{ ...inp, padding: "8px 10px", fontSize: 13, flex: 1 }}
                  />
                  <span style={{ fontSize: 13, color: COLORS.textDim, fontWeight: 700 }}>{getDeviseSymbole(deviseRef)}</span>
                </div>
                <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 6 }}>Taux indicatif pré-rempli. Modifie-le selon le taux réel du jour si besoin.</div>
              </div>
            )}
          </div>
        )}

        {/* ── 3 CASES TOUJOURS VISIBLES : impôt, conversion, combiné ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 4 }}>

          {/* Case 1 : Net après conversion — cliquable, grisée tant que pas de devise choisie */}
          <button onClick={() => setShowTauxForm(s => !s)} style={{ all: "unset", width: "100%", boxSizing: "border-box", cursor: "pointer" }}>
            {deviseRef !== deviseRecue ? (
              <div style={{ background: COLORS.cyan + "0f", border: `1px solid ${COLORS.cyan}25`, borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 10, color: COLORS.cyan, textTransform: "uppercase", letterSpacing: 1 }}>Net après conversion</div>
                    <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 1 }}>1$ = {tauxConversion} {deviseRef} · ✎ modifier</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: COLORS.cyan }}>
                    {resultatNetConverti >= 0 ? "+" : ""}{resultatNetConverti.toFixed(0)}{symboleRef}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 6, textAlign: "right" }}>
                  {ecartConversion >= 0 ? "+" : ""}{ecartConversion.toFixed(0)}{symboleRef} par rapport au brut {resultatNet}{symboleRecue}
                </div>
              </div>
            ) : (
              <div style={{ background: COLORS.bg + "60", border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.6 }}>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>Net après conversion</div>
                  <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 1 }}>Si besoin d'une conversion dans une autre devise →</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: COLORS.muted }}>—</div>
              </div>
            )}
          </button>

          {/* Case 2 : Net après impôt — toujours dans la devise fiscale du pays choisi (ex: € pour la France) */}
          {fiscal.actif && netApresImpotGlobal !== null ? (
            <div style={{ background: COLORS.bg, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>Net après impôt</div>
                  <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 1 }}>
                    Taux {fiscalTauxEffectif}%{deviseFiscale !== deviseRecue ? ` · imposé en ${deviseFiscale}` : ""}
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: COLORS.text }}>
                  {netApresImpotGlobal >= 0 ? "+" : ""}{netApresImpotGlobal.toFixed(0)}{symboleFiscal}
                </div>
              </div>
              {deviseFiscale !== deviseRecue && (
                <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 6 }}>
                  Brut {resultatNet}{symboleRecue} converti en {resultatNetEnDeviseFiscale.toFixed(0)}{symboleFiscal}
                </div>
              )}
              <div style={{ fontSize: 10, color: COLORS.muted, marginTop: deviseFiscale !== deviseRecue ? 2 : 6, textAlign: "right" }}>
                − {montantImpotSeul.toFixed(0)}{symboleFiscal} prélevés ({fiscalTauxEffectif}%)
              </div>
            </div>
          ) : (
            <div style={{ background: COLORS.bg + "60", border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.6 }}>
              <div>
                <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>Net après impôt</div>
                <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 1 }}>Active une structure dans l'onglet ci-dessous</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: COLORS.muted }}>—</div>
            </div>
          )}

          {/* Case 3 : Net après conversion & impôt — résultat final combiné */}
          {netCombineFinal !== null ? (
            <div style={{ background: COLORS.amber + "0f", border: `1px solid ${COLORS.amber}30`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.amber, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Net après conversion & impôt</div>
                  <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 1 }}>
                    Imposé en {deviseFiscale} (taux {fiscalTauxEffectif}%){deviseRef !== deviseFiscale ? `, puis converti en ${deviseRef}` : ""}
                  </div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "monospace", color: COLORS.amber }}>
                  {netCombineFinal >= 0 ? "+" : ""}{netCombineFinal.toFixed(0)}{symboleRef}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.muted, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${COLORS.amber}20` }}>
                <span>{netApresImpotGlobal >= 0 ? "+" : ""}{netApresImpotGlobal.toFixed(0)}{symboleFiscal} après impôt</span>
                {deviseRef !== deviseFiscale && <span>→ {netCombineFinal.toFixed(0)}{symboleRef} converti</span>}
              </div>
            </div>
          ) : (
            <div style={{ background: COLORS.bg + "60", border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: "12px 14px", opacity: 0.6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Net après conversion & impôt</div>
                  <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 1 }}>Disponible si les deux options sont activées</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "monospace", color: COLORS.muted }}>—</div>
              </div>
            </div>
          )}
        </div>

        {/* Entrées */}
        <div style={{ background: COLORS.green + "0f", border: `1px solid ${COLORS.green}25`, borderRadius: 10, overflow: "hidden", marginBottom: 10, marginTop: 14 }}>
          <div style={{ padding: "8px 14px", borderBottom: `1px solid ${COLORS.green}20` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.green, textTransform: "uppercase", letterSpacing: 1.5 }}>📈 Entrées</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: COLORS.green + "10" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>Payouts reçus (brut)</span>
            <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 800, color: COLORS.green }}>+{totalPayouts}$</span>
          </div>
        </div>

        {/* Dépenses */}
        <div style={{ background: COLORS.red + "0f", border: `1px solid ${COLORS.red}25`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "8px 14px", borderBottom: `1px solid ${COLORS.red}20` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.red, textTransform: "uppercase", letterSpacing: 1.5 }}>📉 Dépenses</div>
          </div>
          {totalPropFirms > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontSize: 12, color: COLORS.textDim }}>Comptes prop firms</span>
              <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: COLORS.red }}>-{totalPropFirms}$</span>
            </div>
          )}
          {totalMQ > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontSize: 12, color: COLORS.textDim }}>MentorQ ({moisMQ} mois)</span>
              <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: COLORS.red }}>-{totalMQ}$</span>
            </div>
          )}
          {totalFraisDivers > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontSize: 12, color: COLORS.textDim }}>Frais divers</span>
              <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: COLORS.red }}>-{totalFraisDivers}$</span>
            </div>
          )}
          {totalDepenses === 0 && (
            <div style={{ padding: "14px", textAlign: "center", color: COLORS.muted, fontSize: 11 }}>Aucune dépense enregistrée</div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: COLORS.red + "10" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>Total dépenses</span>
            <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 800, color: COLORS.red }}>-{totalDepenses}$</span>
          </div>
        </div>
      </Card>

      {/* ── MODULE FISCAL — Entreprise / Micro-entreprise ── */}
      {(() => {
        const paysData = PAYS_FISCAL[fiscal.pays];
        const structureData = paysData.structures.find(s => s.id === fiscal.structure);
        const infosAcreRaw = (fiscal.pays === "FR" && structureData?.acre && fiscal.dateCreation) ? getStatutAcre(structureData, fiscal.dateCreation) : null;
        const infosAcre = infosAcreRaw && infosAcreRaw.active ? {
          active: true,
          tauxReduit: infosAcreRaw.taux,
          tauxExoneration: 1 - (infosAcreRaw.taux / structureData.tauxDefaut),
          finAcre: new Date(infosAcreRaw.finAcre),
          joursRestants: infosAcreRaw.joursRestants,
        } : (infosAcreRaw ? { active: false, finAcre: new Date(infosAcreRaw.finAcre || fiscal.dateCreation) } : null);
        const tauxEffectif = (infosAcre?.active && fiscal.acreActif) ? infosAcre.tauxReduit : fiscal.taux;
        const impotEstime = fiscal.actif ? (resultatNet > 0 ? resultatNet * (tauxEffectif / 100) : 0) : 0;
        const netApresImpot = resultatNet - impotEstime;

        return (
          <Card style={{ borderLeft: `3px solid ${COLORS.amber}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: (fiscal.actif && editingFiscal) ? 14 : (fiscal.actif ? 0 : 4) }}>
              <div>
                <SectionTitle style={{ margin: 0 }}>{structureData.emoji} Structure & fiscalité</SectionTitle>
                {(!fiscal.actif) && <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Si ton activité de trading passe par une entreprise ou micro-entreprise.</div>}
              </div>
              {!fiscal.actif ? (
                <button onClick={() => {
                  setFiscal(f => ({ ...f, actif: true }));
                  setEditingFiscal(true);
                  // Par défaut, on aligne la devise de conversion sur la devise fiscale du pays choisi (ex: EUR pour la France)
                  const deviseDuPays = PAYS_FISCAL[fiscal.pays]?.deviseFiscale;
                  if (deviseDuPays && deviseRef === deviseRecue) setDeviseRef(deviseDuPays);
                }} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.muted, borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0, marginLeft: 10 }}>
                  Activer
                </button>
              ) : (
                <button onClick={() => setEditingFiscal(e => !e)} style={{ background: editingFiscal ? COLORS.amber + "20" : COLORS.bg, border: `1px solid ${editingFiscal ? COLORS.amber : COLORS.border}`, color: editingFiscal ? COLORS.amber : COLORS.muted, borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0, marginLeft: 10 }}>
                  {editingFiscal ? "✕ Fermer" : "✎ Modifier"}
                </button>
              )}
            </div>

            {/* ── RÉSUMÉ COMPACT — affiché une fois la structure créée, formulaire replié ── */}
            {fiscal.actif && !editingFiscal && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>{paysData.drapeau}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text }}>{structureData.emoji} {structureData.label}</div>
                    <div style={{ fontSize: 11, color: COLORS.textDim }}>{paysData.nom}{fiscal.dateCreation ? ` · créée le ${new Date(fiscal.dateCreation).toLocaleDateString("fr-FR")}` : ""}</div>
                  </div>
                  {infosAcre?.active && fiscal.acreActif && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: COLORS.green, background: COLORS.green + "20", border: `1px solid ${COLORS.green}40`, borderRadius: 20, padding: "2px 8px" }}>🎉 ACRE</span>
                  )}
                </div>
                <div style={{ background: COLORS.bg, borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 12, color: COLORS.textDim }}>Résultat brut (avant impôt)</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: resultatNet >= 0 ? COLORS.green : COLORS.red }}>{resultatNet >= 0 ? "+" : ""}{resultatNet}$</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 12, color: COLORS.textDim }}>Impôt estimé ({tauxEffectif}%)</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: COLORS.red }}>-{impotEstime.toFixed(0)}$</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>Net après impôt</span>
                    <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: netApresImpot >= 0 ? COLORS.green : COLORS.red }}>{netApresImpot >= 0 ? "+" : ""}{netApresImpot.toFixed(0)}$</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── FORMULAIRE DÉPLIÉ — création ou édition ── */}
            {fiscal.actif && editingFiscal && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Pays */}
                <div>
                  <label style={lbl}>Pays</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {Object.keys(PAYS_FISCAL).map(code => {
                      const p = PAYS_FISCAL[code];
                      const sel = fiscal.pays === code;
                      return (
                        <button key={code} onClick={() => {
                          const newStruct = p.structures[0];
                          setFiscal(f => ({ ...f, pays: code, structure: newStruct.id, taux: newStruct.tauxDefaut }));
                          if (p.deviseFiscale && deviseRef === deviseRecue) setDeviseRef(p.deviseFiscale);
                        }} style={{ background: sel ? COLORS.amber + "20" : COLORS.bg, border: `1px solid ${sel ? COLORS.amber : COLORS.border}`, color: sel ? COLORS.amber : COLORS.textDim, borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                          {p.drapeau} {p.nom}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Structure */}
                <div>
                  <label style={lbl}>Type de structure</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {paysData.structures.map(s => {
                      const sel = fiscal.structure === s.id;
                      return (
                        <button key={s.id} onClick={() => setFiscal(f => ({ ...f, structure: s.id, taux: s.tauxDefaut }))} style={{ background: sel ? COLORS.amber + "15" : COLORS.bg, border: `2px solid ${sel ? COLORS.amber : COLORS.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", textAlign: "left" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: sel ? COLORS.amber : COLORS.text }}>{s.emoji} {s.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: sel ? COLORS.amber : COLORS.muted }}>{s.tauxDefaut}%</div>
                          </div>
                          <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 3 }}>{s.note}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date de création de la structure */}
                <div>
                  <label style={lbl}>Date de création de la structure</label>
                  <input type="date" value={fiscal.dateCreation} onChange={e => setFiscal(f => ({ ...f, dateCreation: e.target.value }))} style={inp} />
                </div>

                {/* ACRE — uniquement micro-entreprise France */}
                {fiscal.pays === "FR" && fiscal.structure === "micro_bnc" && fiscal.dateCreation && infosAcre && (
                  <div style={{ background: infosAcre.active ? COLORS.green + "0f" : COLORS.bg, border: `1px solid ${infosAcre.active ? COLORS.green + "30" : COLORS.border}`, borderRadius: 10, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: infosAcre.active ? 8 : 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: infosAcre.active ? COLORS.green : COLORS.muted }}>
                        {infosAcre.active ? "🎉 ACRE active" : "⏳ ACRE expirée"}
                      </div>
                      {infosAcre.active && (
                        <button onClick={() => setFiscal(f => ({ ...f, acreActif: !f.acreActif }))} style={{ background: fiscal.acreActif ? COLORS.green + "20" : COLORS.bg, border: `1px solid ${fiscal.acreActif ? COLORS.green : COLORS.border}`, color: fiscal.acreActif ? COLORS.green : COLORS.muted, borderRadius: 20, padding: "4px 10px", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                          {fiscal.acreActif ? "✓ Appliquée" : "Appliquer"}
                        </button>
                      )}
                    </div>
                    {infosAcre.active ? (
                      <div style={{ fontSize: 10, color: COLORS.textDim, lineHeight: 1.6 }}>
                        Exonération de <span style={{ color: COLORS.green, fontWeight: 700 }}>{(infosAcre.tauxExoneration * 100).toFixed(0)}%</span> sur les cotisations sociales jusqu'au <span style={{ fontWeight: 700 }}>{infosAcre.finAcre.toLocaleDateString("fr-FR")}</span>.
                        {fiscal.acreActif && <> Taux réduit suggéré : <span style={{ color: COLORS.green, fontWeight: 700 }}>{infosAcre.tauxReduit.toFixed(1)}%</span> au lieu de {structureData.tauxDefaut}%.</>}
                      </div>
                    ) : (
                      <div style={{ fontSize: 10, color: COLORS.muted }}>L'ACRE était active jusqu'au {infosAcre.finAcre.toLocaleDateString("fr-FR")}, le taux plein s'applique désormais.</div>
                    )}
                  </div>
                )}

                {/* Taux modifiable */}
                <div>
                  <label style={lbl}>Taux d'imposition effectif (%) — modifiable</label>
                  <input type="number" step="0.1" value={fiscal.taux} onChange={e => setFiscal(f => ({ ...f, taux: parseFloat(e.target.value) || 0 }))} style={inp} />
                  <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 4 }}>
                    Valeur par défaut suggérée : {structureData.tauxDefaut}%.
                    {infosAcre?.active && fiscal.acreActif && <> Avec ACRE : <span style={{ color: COLORS.green, fontWeight: 700 }}>{infosAcre.tauxReduit.toFixed(1)}%</span>.</>}
                    {" "}Ajuste selon ta situation réelle.
                  </div>
                  {infosAcre?.active && fiscal.acreActif && Math.abs(fiscal.taux - structureData.tauxDefaut) < 0.01 && (
                    <button onClick={() => setFiscal(f => ({ ...f, taux: parseFloat(infosAcre.tauxReduit.toFixed(1)) }))} style={{ marginTop: 8, background: COLORS.green + "20", border: `1px solid ${COLORS.green}40`, color: COLORS.green, borderRadius: 8, padding: "7px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                      ↓ Appliquer le taux ACRE ({infosAcre.tauxReduit.toFixed(1)}%)
                    </button>
                  )}
                </div>

                {/* Estimation */}
                <div style={{ background: COLORS.bg, borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 12, color: COLORS.textDim }}>Résultat brut (avant impôt)</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: resultatNet >= 0 ? COLORS.green : COLORS.red }}>{resultatNet >= 0 ? "+" : ""}{resultatNet}$</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 12, color: COLORS.textDim }}>Impôt estimé ({tauxEffectif}%{infosAcre?.active && fiscal.acreActif ? " · ACRE" : ""})</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: COLORS.red }}>-{impotEstime.toFixed(0)}$</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>Net après impôt</span>
                    <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: netApresImpot >= 0 ? COLORS.green : COLORS.red }}>{netApresImpot >= 0 ? "+" : ""}{netApresImpot.toFixed(0)}$</span>
                  </div>
                </div>

                <button onClick={() => setEditingFiscal(false)} style={{ background: COLORS.amber, color: COLORS.bg, border: "none", borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                  ✓ Confirmer
                </button>
              </div>
            )}
          </Card>
        );
      })()}

      {/* ── DÉTAIL COMPTES ── */}
      <Card>
        <SectionTitle>🏦 Comptes prop firms</SectionTitle>
        {Object.entries(byType).map(([type, cs]) =>
          cs.map((c, idx) => {
            const couleur = getCouleurCompte(type, idx, cs.length);
            const inv = c.achat + c.activation;
            const rec = c.payouts.reduce((a, p) => a + p.montant, 0);
            const r = inv ? ((rec - inv) / inv * 100) : 0;
            return (
              <div key={c.id} onClick={() => onEditCompte && onEditCompte(c)} style={{ marginBottom: 12, borderLeft: `3px solid ${couleur}`, paddingLeft: 12, cursor: onEditCompte ? "pointer" : "default" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{PROP_FIRMS_CATALOG[type]?.emoji} {c.nom}</div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                      {c.numero && <span style={{ fontSize: 10, color: couleur, fontFamily: "monospace" }}>#{c.numero}</span>}
                      {onEditCompte && <span style={{ fontSize: 9, color: COLORS.muted }}>✎ modifier</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: r >= 0 ? COLORS.green : COLORS.red }}>{r >= 0 ? "+" : ""}{r.toFixed(0)}%</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  {[{ l: "Achat", v: `-${c.achat}$`, col: COLORS.red }, { l: "Activation", v: `-${c.activation}$`, col: COLORS.amber }, { l: "Payouts", v: `+${rec}$`, col: COLORS.green }].map((s, i) => (
                    <div key={i} style={{ background: COLORS.bg, borderRadius: 6, padding: "7px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: s.col }}>{s.v}</div>
                      <div style={{ fontSize: 9, color: COLORS.muted, textTransform: "uppercase", marginTop: 1 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                {c.payouts.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    {c.payouts.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.textDim, paddingTop: 4 }}>
                        <span>{p.date}</span>
                        <span style={{ color: COLORS.green, fontFamily: "monospace", fontWeight: 700 }}>+{p.montant}{getDeviseSymbole(p.devise || "USD")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Enregistrer un payout */}
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, marginTop: 4 }}>
          <button onClick={() => setShowPayoutForm(s => !s)} style={{ width: "100%", background: COLORS.green + "20", border: `1px solid ${COLORS.green}40`, color: COLORS.green, borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: showPayoutForm ? 12 : 0 }}>
            {showPayoutForm ? "✕ Annuler" : "+ Enregistrer un payout"}
          </button>
          {showPayoutForm && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <select value={newPayout.compte} onChange={e => setNewPayout(p => ({ ...p, compte: e.target.value }))} style={inp}>
                {comptes.map(c => <option key={c.id}>{c.nom}</option>)}
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
                <input type="number" placeholder="Montant" value={newPayout.montant} onChange={e => setNewPayout(p => ({ ...p, montant: e.target.value }))} style={inp} />
                <select value={newPayout.devise} onChange={e => setNewPayout(p => ({ ...p, devise: e.target.value }))} style={inp}>
                  {DEVISES.map(d => <option key={d.code} value={d.code}>{d.symbole} {d.code}</option>)}
                </select>
              </div>
              <input type="date" value={newPayout.date} onChange={e => setNewPayout(p => ({ ...p, date: e.target.value }))} style={inp} />
              <button onClick={addPayout} style={{ background: COLORS.green, color: COLORS.bg, border: "none", borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>✓ Confirmer le payout</button>
            </div>
          )}
        </div>
      </Card>

      {/* ── ENTRÉES DÉTAILLÉES ── */}
      <Card>
        <SectionTitle>📈 Toutes les entrées</SectionTitle>

        {(() => {
          const tousLesPayouts = comptes.flatMap(c =>
            (c.payouts || []).map(p => ({ ...p, compteNom: c.nom, compteType: c.type, compteId: c.id }))
          ).sort((a, b) => new Date(b.date) - new Date(a.date));

          if (tousLesPayouts.length === 0) {
            return <div style={{ textAlign: "center", padding: "16px 0", color: COLORS.muted, fontSize: 12 }}>Aucun payout enregistré</div>;
          }

          return tousLesPayouts.map((p, i) => {
            const total = byType[p.compteType]?.length || 1;
            const idx = byType[p.compteType]?.findIndex(c => c.id === p.compteId) || 0;
            const couleur = getCouleurCompte(p.compteType, idx, total);
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.bg, borderRadius: 8, padding: "10px 12px", marginBottom: 8, borderLeft: `3px solid ${couleur}` }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{PROP_FIRMS_CATALOG[p.compteType]?.emoji} {p.compteNom}</div>
                  <div style={{ fontSize: 10, color: COLORS.textDim }}>{p.date} · Payout</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "monospace", color: COLORS.green }}>+{p.montant}{getDeviseSymbole(p.devise || "USD")}</div>
              </div>
            );
          });
        })()}

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4, borderTop: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>Total toutes entrées</span>
          <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: COLORS.green }}>+{totalPayouts}$</span>
        </div>
      </Card>

      {/* ── FRAIS DÉTAILLÉS ── */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <SectionTitle style={{ margin: 0 }}>💸 Tous les frais</SectionTitle>
          <button onClick={() => setShowFraisForm(s => !s)} style={{ background: COLORS.cyan + "20", border: `1px solid ${COLORS.cyan}40`, color: COLORS.cyan, borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{showFraisForm ? "✕" : "+ Ajouter"}</button>
        </div>

        {/* Formation (optionnelle) */}
        {!mentorQ.actif ? (
          <button onClick={() => setMentorQ(m => ({ ...m, actif: true }))} style={{ width: "100%", background: COLORS.bg, border: `1px dashed ${COLORS.border}`, color: COLORS.muted, borderRadius: 8, padding: "10px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 8, textAlign: "left" }}>
            🎓 + Ajouter une formation (MentorQ, autre...)
          </button>
        ) : (
          <div style={{ background: COLORS.bg, borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <input
                value={mentorQ.nom || "Formation"}
                onChange={e => setMentorQ(m => ({ ...m, nom: e.target.value }))}
                placeholder="Nom de la formation"
                style={{ background: "transparent", border: "none", color: COLORS.text, fontSize: 12, fontWeight: 700, padding: 0, outline: "none", flex: 1 }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "monospace", color: COLORS.red }}>-{totalMQ}$</div>
                <button onClick={() => setMentorQ(m => ({ ...m, actif: false, mensuel: 0 }))} style={{ background: COLORS.red + "20", border: `1px solid ${COLORS.red}30`, color: COLORS.red, borderRadius: 6, padding: "2px 7px", fontSize: 11, cursor: "pointer" }}>✕</button>
              </div>
            </div>
            <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 8 }}>Mensuel · {moisMQ} mois</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <label style={lbl}>$/mois</label>
                <input type="number" placeholder="0" value={mentorQ.mensuel || ""} onChange={e => setMentorQ(m => ({ ...m, mensuel: parseFloat(e.target.value) || 0 }))} style={{ ...inp, padding: "7px 10px", fontSize: 12 }} />
              </div>
              <div>
                <label style={lbl}>Depuis</label>
                <input type="month" value={mentorQ.moisDebut} onChange={e => setMentorQ(m => ({ ...m, moisDebut: e.target.value }))} style={{ ...inp, padding: "7px 10px", fontSize: 12 }} />
              </div>
            </div>
          </div>
        )}

        {/* Prop firms achat/activation */}
        {comptes.map((c, idx) => {
          const total = byType[c.type]?.length || 1;
          const i = byType[c.type]?.indexOf(c) || 0;
          const couleur = getCouleurCompte(c.type, i, total);
          return (
            <div key={c.id} onClick={() => onEditCompte && onEditCompte(c)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.bg, borderRadius: 8, padding: "10px 12px", marginBottom: 8, borderLeft: `3px solid ${couleur}`, cursor: onEditCompte ? "pointer" : "default" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{PROP_FIRMS_CATALOG[c.type]?.emoji} {c.nom}</div>
                <div style={{ fontSize: 10, color: COLORS.textDim }}>
                  Achat {c.achat}$ {c.activation > 0 ? `+ Activation ${c.activation}$` : ""}
                  {c.numero && <span style={{ color: couleur, marginLeft: 6 }}>#{c.numero}</span>}
                  {onEditCompte && <span style={{ color: COLORS.muted, marginLeft: 6 }}>· ✎ modifier</span>}
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "monospace", color: COLORS.red }}>-{c.achat + c.activation}$</div>
            </div>
          );
        })}

        {/* Frais divers */}
        {fraisDivers.map(f => (
          <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.bg, borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{f.label}</div>
              <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: "uppercase" }}>{catLabels[f.categorie] || f.categorie} · {f.type}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "monospace", color: COLORS.red }}>-{f.montant}$</div>
              <button onClick={() => removeFrais(f.id)} style={{ background: COLORS.red + "20", border: `1px solid ${COLORS.red}30`, color: COLORS.red, borderRadius: 6, padding: "3px 7px", fontSize: 11, cursor: "pointer" }}>✕</button>
            </div>
          </div>
        ))}

        {/* Formulaire ajout frais */}
        {showFraisForm && (
          <div style={{ background: COLORS.bg, borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ marginBottom: 10 }}>
              <label style={lbl}>Nom</label>
              <input placeholder="ex: VPN, livre, séminaire..." value={newFrais.label} onChange={e => setNewFrais(f => ({ ...f, label: e.target.value }))} style={inp} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={lbl}>Montant ($)</label>
                <input type="number" placeholder="29" value={newFrais.montant} onChange={e => setNewFrais(f => ({ ...f, montant: e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={lbl}>Catégorie</label>
                <select value={newFrais.categorie} onChange={e => setNewFrais(f => ({ ...f, categorie: e.target.value }))} style={inp}>
                  <option value="plateforme">🖥 Plateforme</option>
                  <option value="formation">📚 Formation</option>
                  <option value="abonnement">🔄 Abonnement</option>
                  <option value="autre">📌 Autre</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={lbl}>Fréquence</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["unique", "mensuel", "annuel"].map(t => (
                  <button key={t} onClick={() => setNewFrais(f => ({ ...f, type: t }))} style={{ flex: 1, background: newFrais.type === t ? COLORS.cyan + "20" : COLORS.surface, border: `1px solid ${newFrais.type === t ? COLORS.cyan : COLORS.border}`, color: newFrais.type === t ? COLORS.cyan : COLORS.textDim, borderRadius: 8, padding: 8, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={addFrais} style={{ width: "100%", background: COLORS.cyan, color: COLORS.bg, border: "none", borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>✓ Ajouter ce frais</button>
          </div>
        )}

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4, borderTop: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>Total toutes dépenses</span>
          <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: COLORS.red }}>-{totalDepenses}$</span>
        </div>
      </Card>
    </div>
  );
}

// ─── AJOUT COMPTE ─────────────────────────────────────────────────────────────
function AjoutCompte({ onSave, onCancel, editCompte = null, onGoToRegles = null }) {
  const [type, setType] = useState(editCompte?.type || "Apex");
  const firm = PROP_FIRMS_CATALOG[type];
  const [taille, setTaille] = useState(editCompte?.taille || firm.tailles[1] || 50000);
  const [typeCompte, setTypeCompte] = useState(editCompte?.typeCompte || firm.typesCompte[0].id);
  const [numero, setNumero] = useState(editCompte?.numero || "");

  // Compte déjà existant (ouvert avant l'usage de l'app) → état initial personnalisable
  const [compteExistant, setCompteExistant] = useState(editCompte ? (editCompte.soldeInitial !== undefined && editCompte.soldeInitial !== 0) || editCompte._compteExistant : false);
  const [soldeInitial, setSoldeInitial] = useState(editCompte?.soldeInitial?.toString() || "");
  const [mllManuel, setMllManuel] = useState(editCompte?.mllManuel?.toString() || "");
  const [joursPayoutInitial, setJoursPayoutInitial] = useState(editCompte?.joursPayoutInitial?.toString() || "0");
  const [achat, setAchat] = useState(editCompte?.achat?.toString() || "");
  const [activation, setActivation] = useState(editCompte?.activation?.toString() || "");
  const [payoutsExistants, setPayoutsExistants] = useState(editCompte?.payouts || []);
  const [newPayoutExistant, setNewPayoutExistant] = useState({ date: new Date().toISOString().split("T")[0], montant: "", devise: "USD" });

  const addPayoutExistant = () => {
    if (!newPayoutExistant.montant) return;
    setPayoutsExistants(p => [...p, { ...newPayoutExistant, montant: parseFloat(newPayoutExistant.montant) }]);
    setNewPayoutExistant({ date: new Date().toISOString().split("T")[0], montant: "", devise: "USD" });
  };
  const removePayoutExistant = (idx) => setPayoutsExistants(p => p.filter((_, i) => i !== idx));
  const totalPayoutsExistants = payoutsExistants.reduce((a, p) => a + p.montant, 0);

  const handleSelectType = (key) => {
    setType(key);
    setTaille(PROP_FIRMS_CATALOG[key].tailles[1] || PROP_FIRMS_CATALOG[key].tailles[0]);
    setTypeCompte(PROP_FIRMS_CATALOG[key].typesCompte[0].id);
  };

  const inp = { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 8, padding: "10px 12px", fontSize: 13, width: "100%", boxSizing: "border-box" };
  const lbl = { fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, display: "block" };

  const formatK = (n) => n >= 1000 ? `${n/1000}K` : n;
  const estTopstepLike = type === "Topstep";

  // MLL calculé en direct si Topstep et solde initial renseigné
  const soldeInitialNum = parseFloat(soldeInitial) || 0;
  const mllCalcule = estTopstepLike ? getMLL(soldeInitialNum) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onCancel} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.textDim, borderRadius: 8, padding: "8px 12px", fontSize: 12, cursor: "pointer" }}>← Retour</button>
        <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text }}>{editCompte ? "Modifier le compte" : "Ajouter un compte"}</div>
      </div>

      {/* Sélecteur prop firm */}
      <Card>
        <SectionTitle>Prop Firm</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {Object.keys(PROP_FIRMS_CATALOG).map(key => {
            const f = PROP_FIRMS_CATALOG[key];
            const sel = type === key;
            return (
              <button key={key} onClick={() => handleSelectType(key)} style={{ background: sel ? f.couleur + "25" : COLORS.bg, border: `2px solid ${sel ? f.couleur : COLORS.border}`, color: sel ? f.couleur : COLORS.textDim, borderRadius: 10, padding: "10px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>{f.emoji}</span>
                <span>{f.nom}</span>
              </button>
            );
          })}
        </div>

        {/* Taille de compte */}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Taille du compte</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {firm.tailles.map(t => (
              <button key={t} onClick={() => setTaille(t)} style={{ background: taille === t ? firm.couleur + "25" : COLORS.bg, border: `2px solid ${taille === t ? firm.couleur : COLORS.border}`, color: taille === t ? firm.couleur : COLORS.textDim, borderRadius: 8, padding: "10px 16px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "monospace" }}>
                ${formatK(t)}
              </button>
            ))}
          </div>
        </div>

        {/* Type de compte */}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Type de compte</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {firm.typesCompte.map(tc => (
              <button key={tc.id} onClick={() => setTypeCompte(tc.id)} style={{ background: typeCompte === tc.id ? tc.couleurBadge + "25" : COLORS.bg, border: `2px solid ${typeCompte === tc.id ? tc.couleurBadge : COLORS.border}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", textAlign: "left", minWidth: 100 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: typeCompte === tc.id ? tc.couleurBadge : COLORS.text }}>{tc.label}</div>
                <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2 }}>{tc.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* N° compte optionnel */}
        <div>
          <label style={lbl}>N° de compte <span style={{ color: COLORS.muted, fontWeight: 400 }}>(optionnel)</span></label>
          <input placeholder="ex: TS-002, APX-01..." value={numero} onChange={e => setNumero(e.target.value)} style={inp} />
        </div>
      </Card>

      {/* Compte déjà existant — état initial */}
      <Card>
        <SectionTitle>📌 État du compte</SectionTitle>
        <div style={{ display: "flex", gap: 8, marginBottom: compteExistant ? 14 : 0 }}>
          <button onClick={() => setCompteExistant(false)} style={{ flex: 1, background: !compteExistant ? COLORS.cyan + "20" : COLORS.bg, border: `2px solid ${!compteExistant ? COLORS.cyan : COLORS.border}`, borderRadius: 10, padding: "12px 10px", cursor: "pointer", textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: !compteExistant ? COLORS.cyan : COLORS.text }}>🆕 Nouveau compte</div>
            <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2 }}>Je commence à $0, rien à renseigner</div>
          </button>
          <button onClick={() => setCompteExistant(true)} style={{ flex: 1, background: compteExistant ? COLORS.cyan + "20" : COLORS.bg, border: `2px solid ${compteExistant ? COLORS.cyan : COLORS.border}`, borderRadius: 10, padding: "12px 10px", cursor: "pointer", textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: compteExistant ? COLORS.cyan : COLORS.text }}>📂 Compte déjà ouvert</div>
            <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2 }}>Je l'ai depuis un moment, j'ai un historique</div>
          </button>
        </div>

        {compteExistant && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={lbl}>{estTopstepLike ? "Solde actuel du compte ($)" : "Gain/Perte cumulé actuel ($)"}</label>
              <input type="number" placeholder="ex: 850" value={soldeInitial} onChange={e => setSoldeInitial(e.target.value)} style={inp} />
              <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 4 }}>
                {estTopstepLike ? "Le solde actuel, pas le P&L. Sert à calculer ton MLL et tes lots disponibles." : "Le P&L cumulé depuis l'ouverture du compte."}
              </div>
            </div>

            {estTopstepLike && soldeInitial !== "" && (
              <div>
                <label style={lbl}>Maximum Loss Limit (MLL) actuel</label>
                <input type="number" placeholder={`${mllCalcule}`} value={mllManuel} onChange={e => setMllManuel(e.target.value)} style={inp} />
                <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 4 }}>
                  Suggestion auto : <span style={{ color: COLORS.cyan, fontWeight: 700 }}>{mllCalcule}$</span> — ajuste si ton MLL réel est différent (palier déjà passé, trailing custom...)
                </div>
              </div>
            )}

            {estTopstepLike && (
              <div>
                <label style={lbl}>Jours de payout déjà validés (sur 5)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[0,1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setJoursPayoutInitial(n.toString())} style={{ flex: 1, background: parseInt(joursPayoutInitial) === n ? COLORS.cyan + "20" : COLORS.bg, border: `1px solid ${parseInt(joursPayoutInitial) === n ? COLORS.cyan : COLORS.border}`, color: parseInt(joursPayoutInitial) === n ? COLORS.cyan : COLORS.muted, borderRadius: 8, padding: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{n}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Payouts déjà reçus sur ce compte */}
            <div>
              <label style={lbl}>Payouts déjà reçus sur ce compte</label>
              <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 8 }}>Si tu as déjà touché des payouts avant d'utiliser l'app, ajoute-les ici.</div>

              {payoutsExistants.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  {payoutsExistants.map((p, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.bg, borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: COLORS.textDim }}>{p.date}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: COLORS.green }}>+{p.montant}{getDeviseSymbole(p.devise || "USD")}</span>
                        <button onClick={() => removePayoutExistant(i)} style={{ background: COLORS.red + "20", border: `1px solid ${COLORS.red}30`, color: COLORS.red, borderRadius: 6, padding: "2px 7px", fontSize: 10, cursor: "pointer" }}>✕</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 4 }}>
                    <span style={{ fontSize: 11, color: COLORS.textDim }}>Total déjà reçu</span>
                    <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: COLORS.green }}>+{totalPayoutsExistants}$</span>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <input type="date" value={newPayoutExistant.date} onChange={e => setNewPayoutExistant(p => ({ ...p, date: e.target.value }))} style={{ ...inp, padding: "8px 10px", fontSize: 12 }} />
                <input type="number" placeholder="Montant" value={newPayoutExistant.montant} onChange={e => setNewPayoutExistant(p => ({ ...p, montant: e.target.value }))} style={{ ...inp, padding: "8px 10px", fontSize: 12 }} />
                <select value={newPayoutExistant.devise} onChange={e => setNewPayoutExistant(p => ({ ...p, devise: e.target.value }))} style={{ ...inp, padding: "8px 10px", fontSize: 12 }}>
                  {DEVISES.map(d => <option key={d.code} value={d.code}>{d.symbole} {d.code}</option>)}
                </select>
              </div>
              <button onClick={addPayoutExistant} style={{ width: "100%", background: COLORS.green + "20", border: `1px solid ${COLORS.green}40`, color: COLORS.green, borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
                + Ajouter ce payout
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Coûts du compte */}
      <Card>
        <SectionTitle>💸 Coûts</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><label style={lbl}>Achat ($)</label><input type="number" placeholder="0" value={achat} onChange={e => setAchat(e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Activation ($)</label><input type="number" placeholder="0" value={activation} onChange={e => setActivation(e.target.value)} style={inp} /></div>
        </div>
      </Card>

      {/* Aperçu récap */}
      <Card style={{ borderLeft: `3px solid ${firm.couleur}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>{firm.emoji} {firm.nom}</div>
            <div style={{ fontSize: 11, color: COLORS.textDim }}>{firm.description}</div>
            {(() => {
              const tc = firm.typesCompte.find(t => t.id === typeCompte);
              return tc ? (
                <div style={{ marginTop: 4, display: "inline-block", background: tc.couleurBadge + "20", border: `1px solid ${tc.couleurBadge}50`, borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700, color: tc.couleurBadge }}>{tc.label} · {tc.desc}</div>
              ) : null;
            })()}
          {/* Liens officiels */}
          {(firm.siteUrl || firm.reglesUrl || firm.discordUrl) && (
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {firm.siteUrl && (
                <a href={firm.siteUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, background: firm.couleur + "15", border: `1px solid ${firm.couleur}30`, borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: firm.couleur, textDecoration: "none" }}>
                  🌐 Site officiel
                </a>
              )}
              {firm.reglesUrl && (
                <a href={firm.reglesUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: COLORS.textDim, textDecoration: "none" }}>
                  📋 Règles complètes
                </a>
              )}
              {firm.discordUrl && (
                <a href={firm.discordUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, background: "#5865F215", border: "1px solid #5865F230", borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#5865F2", textDecoration: "none" }}>
                  💬 Discord
                </a>
              )}
            </div>
          )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace", color: firm.couleur }}>${formatK(taille)}</div>
            {numero && <div style={{ fontSize: 10, color: firm.couleur, fontFamily: "monospace" }}>#{numero}</div>}
          </div>
        </div>
        {/* Règle fondamentale principale — l'essentiel à savoir avant d'ouvrir le compte */}
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>À ne jamais enfreindre</div>
          {(firm.reglesFondamentales || []).slice(0, 1).map((r, i) => (
            <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>— {r.titre}</div>
                <div style={{ background: COLORS.muted + "30", borderRadius: 4, padding: "2px 8px", fontSize: 9, fontWeight: 700, color: COLORS.textDim, whiteSpace: "nowrap", marginLeft: 8 }}>compte coupé</div>
              </div>
              <div style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.6 }}>{r.detail}</div>
            </div>
          ))}
          {onGoToRegles && (
            <button onClick={() => onGoToRegles(type)} style={{ width: "100%", background: COLORS.bg, border: `1px dashed ${COLORS.border}`, color: COLORS.cyan, borderRadius: 8, padding: "10px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              📜 Voir toutes les règles {firm.nom} →
            </button>
          )}
        </div>
      </Card>

      {/* Nom final affiché */}
      {(() => {
        const tc = firm.typesCompte.find(t => t.id === typeCompte);
        return <div style={{ textAlign: "center", fontSize: 11, color: COLORS.textDim, marginBottom: 8 }}>
          Nom : <span style={{ color: firm.couleur, fontWeight: 700 }}>{firm.nom} {tc?.label} ${formatK(taille)}</span>
        </div>;
      })()}
      <button onClick={() => {
        const tc = firm.typesCompte.find(t => t.id === typeCompte);
        onSave({
          type,
          typeCompte,
          nom: `${firm.nom} ${tc?.label || ""} $${formatK(taille)}`,
          numero,
          taille,
          achat: parseFloat(achat) || 0,
          activation: parseFloat(activation) || 0,
          soldeInitial: compteExistant ? soldeInitialNum : 0,
          mllManuel: compteExistant && mllManuel !== "" ? parseFloat(mllManuel) : null,
          joursPayoutInitial: compteExistant ? (parseInt(joursPayoutInitial) || 0) : 0,
          payouts: payoutsExistants,
          _compteExistant: compteExistant,
        });
      }} style={{ background: firm.couleur, color: COLORS.bg, border: "none", borderRadius: 10, padding: 16, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
        {editCompte ? "✓ Enregistrer les modifications" : (() => {
          const tc = firm.typesCompte.find(t => t.id === typeCompte);
          return `✓ Ajouter — ${firm.nom} ${tc?.label || ""} $${formatK(taille)}`;
        })()}
      </button>
    </div>
  );
}

// ─── OBJECTIFS ────────────────────────────────────────────────────────────────
// ─── LE CHEMIN — contenu spirituel ────────────────────────────────────────────
// ─── LE CHEMIN — chapitres écrits par l'utilisateur, dans l'ordre de lecture ──
const initialChapitres = [
  { id: 1, ordre: 1, titre: "Trading et spiritualité, vraiment compatibles ?", texte: "", questions: [], verset: null },
  { id: 2, ordre: 2, titre: "L'interrogation de faire de l'argent, la culpabilité chrétienne. Comment en sortir ?", texte: "", questions: [], verset: null },
  { id: 3, ordre: 3, titre: "L'argent, un moyen pour le royaume de Dieu", texte: "", questions: [], verset: null },
];

function LeChemin({ chapitres, setChapitres }) {
  const [vue, setVue] = useState("liste"); // "liste" | "lecture" | "edition"
  const [chapitreActifId, setChapitreActifId] = useState(null);
  const [reponses, setReponses] = useState({});

  const chapitreActif = chapitres.find(c => c.id === chapitreActifId);
  const chapitresOrdonnes = [...chapitres].sort((a, b) => a.ordre - b.ordre);

  const inp = { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 8, padding: "10px 12px", fontSize: 13, width: "100%", boxSizing: "border-box", resize: "vertical" };
  const lbl = { fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, display: "block" };

  const ouvrirChapitre = (id) => { setChapitreActifId(id); setVue("lecture"); };
  const ouvrirEdition = (id) => { setChapitreActifId(id); setVue("edition"); };
  const ouvrirNouveauChapitre = () => { setChapitreActifId(null); setVue("edition"); };
  const retourListe = () => { setVue("liste"); setChapitreActifId(null); };

  const setReponse = (i, val) => setReponses(r => ({ ...r, [`${chapitreActifId}-${i}`]: val }));

  // ── VUE LISTE ──
  if (vue === "liste") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card style={{ background: `linear-gradient(135deg, ${COLORS.card} 0%, #0f1a2e 100%)`, borderLeft: `3px solid ${COLORS.cyan}`, textAlign: "center", padding: "24px 18px" }}>
          <div style={{ fontSize: 22, marginBottom: 10 }}>🪞</div>
          <div style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.7, fontStyle: "italic", fontWeight: 600 }}>
            "Le trading est comme un petit miroir, il révèle mon état intérieur."
          </div>
          <div style={{ height: 1, background: COLORS.border, margin: "16px auto", width: "40%" }} />
          <div style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.7, fontStyle: "italic", fontWeight: 600 }}>
            "Le Christ est le grand miroir dans lequel je me contemple pour apprendre à découvrir qui je suis en lui."
          </div>
        </Card>

        <button onClick={ouvrirNouveauChapitre} style={{ background: COLORS.cyan, color: COLORS.bg, border: "none", borderRadius: 10, padding: "14px", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          + Nouveau chapitre
        </button>

        {chapitresOrdonnes.length === 0 ? (
          <Card style={{ textAlign: "center", padding: "32px 20px" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📖</div>
            <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 6 }}>Aucun chapitre pour l'instant</div>
            <div style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.6 }}>
              Écris ton premier chapitre sur comment devenir un trader rentable en marchant selon l'Esprit.
            </div>
          </Card>
        ) : (
          chapitresOrdonnes.map((c, i) => (
            <Card key={c.id} onClick={() => ouvrirChapitre(c.id)} style={{ borderLeft: `3px solid ${COLORS.amber}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.amber + "20", border: `1px solid ${COLORS.amber}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.amber }}>{i + 1}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.titre || "Sans titre"}</div>
                  {c.texte && <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.texte.slice(0, 60)}{c.texte.length > 60 ? "…" : ""}</div>}
                </div>
                {c.verset && <span style={{ fontSize: 14, flexShrink: 0 }}>✦</span>}
              </div>
            </Card>
          ))
        )}

        <div style={{ fontSize: 10, color: COLORS.muted, textAlign: "center", marginTop: 4, fontStyle: "italic" }}>
          🕊️ {chapitresOrdonnes.length} chapitre{chapitresOrdonnes.length !== 1 ? "s" : ""} écrit{chapitresOrdonnes.length !== 1 ? "s" : ""}
        </div>
      </div>
    );
  }

  // ── VUE LECTURE ──
  if (vue === "lecture" && chapitreActif) {
    const idx = chapitresOrdonnes.findIndex(c => c.id === chapitreActif.id);
    const precedent = idx > 0 ? chapitresOrdonnes[idx - 1] : null;
    const suivant = idx < chapitresOrdonnes.length - 1 ? chapitresOrdonnes[idx + 1] : null;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={retourListe} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.textDim, borderRadius: 8, padding: "8px 12px", fontSize: 12, cursor: "pointer" }}>← Tous les chapitres</button>
          <button onClick={() => ouvrirEdition(chapitreActif.id)} style={{ background: COLORS.cyan + "20", border: `1px solid ${COLORS.cyan}40`, color: COLORS.cyan, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✎ Modifier</button>
        </div>

        <Card style={{ borderLeft: `3px solid ${COLORS.amber}` }}>
          <div style={{ fontSize: 10, color: COLORS.amber, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Chapitre {idx + 1}</div>
          <div style={{ fontSize: 19, fontWeight: 800, color: COLORS.text, marginBottom: 14, lineHeight: 1.3 }}>{chapitreActif.titre || "Sans titre"}</div>
          {chapitreActif.texte && (
            <div style={{ fontSize: 14, color: COLORS.textDim, lineHeight: 1.8, whiteSpace: "pre-line" }}>{chapitreActif.texte}</div>
          )}
        </Card>

        {chapitreActif.verset?.texte && (
          <Card style={{ background: `linear-gradient(135deg, #1a2235 0%, #151e30 100%)`, border: `1px solid #2a3a55` }}>
            <div style={{ fontSize: 10, color: "#7a9abf", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>✦ Verset associé</div>
            <div style={{ fontSize: 13, color: "#c8d8ec", lineHeight: 1.7, fontStyle: "italic", marginBottom: 6 }}>"{chapitreActif.verset.texte}"</div>
            {chapitreActif.verset.ref && <div style={{ fontSize: 11, color: "#4a6a8a", fontWeight: 700 }}>— {chapitreActif.verset.ref}</div>}
          </Card>
        )}

        {chapitreActif.questions && chapitreActif.questions.filter(q => q.trim()).length > 0 && (
          <>
            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>Questions de discernement</div>
            <Card>
              <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 14, lineHeight: 1.6 }}>
                Prends un moment pour répondre honnêtement. Ces notes restent privées, juste pour toi.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {chapitreActif.questions.filter(q => q.trim()).map((q, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 600, marginBottom: 8, lineHeight: 1.5 }}>{i + 1}. {q}</div>
                    <textarea
                      placeholder="Ta réponse..."
                      value={reponses[`${chapitreActif.id}-${i}`] || ""}
                      onChange={e => setReponse(i, e.target.value)}
                      rows={3}
                      style={inp}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          {precedent && (
            <button onClick={() => ouvrirChapitre(precedent.id)} style={{ flex: 1, background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.textDim, borderRadius: 8, padding: "10px", fontSize: 11, cursor: "pointer", textAlign: "left" }}>
              ← {precedent.titre || "Sans titre"}
            </button>
          )}
          {suivant && (
            <button onClick={() => ouvrirChapitre(suivant.id)} style={{ flex: 1, background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.textDim, borderRadius: 8, padding: "10px", fontSize: 11, cursor: "pointer", textAlign: "right" }}>
              {suivant.titre || "Sans titre"} →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── VUE ÉDITION (création ou modification) ──
  if (vue === "edition") {
    return <EditionChapitre chapitre={chapitreActif} chapitres={chapitres} setChapitres={setChapitres} onDone={(id) => { setChapitreActifId(id); setVue(id ? "lecture" : "liste"); }} onCancel={retourListe} />;
  }

  return null;
}

function EditionChapitre({ chapitre, chapitres, setChapitres, onDone, onCancel }) {
  const [titre, setTitre] = useState(chapitre?.titre || "");
  const [texte, setTexte] = useState(chapitre?.texte || "");
  const [versetTexte, setVersetTexte] = useState(chapitre?.verset?.texte || "");
  const [versetRef, setVersetRef] = useState(chapitre?.verset?.ref || "");
  const [questions, setQuestions] = useState(chapitre?.questions?.length ? chapitre.questions : ["", "", ""]);

  const inp = { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 8, padding: "10px 12px", fontSize: 13, width: "100%", boxSizing: "border-box", resize: "vertical" };
  const lbl = { fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, display: "block" };

  const setQuestion = (i, val) => setQuestions(q => q.map((x, idx) => idx === i ? val : x));
  const addQuestion = () => setQuestions(q => [...q, ""]);
  const removeQuestion = (i) => setQuestions(q => q.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (!titre.trim()) return;
    const questionsFiltrees = questions.filter(q => q.trim());
    if (chapitre) {
      setChapitres(prev => prev.map(c => c.id === chapitre.id ? {
        ...c, titre, texte, questions: questionsFiltrees,
        verset: versetTexte.trim() ? { texte: versetTexte, ref: versetRef } : null,
      } : c));
      onDone(chapitre.id);
    } else {
      const ordreMax = chapitres.length > 0 ? Math.max(...chapitres.map(c => c.ordre)) : 0;
      const newId = Date.now();
      setChapitres(prev => [...prev, {
        id: newId, ordre: ordreMax + 1, titre, texte, questions: questionsFiltrees,
        verset: versetTexte.trim() ? { texte: versetTexte, ref: versetRef } : null,
      }]);
      onDone(newId);
    }
  };

  const handleDelete = () => {
    if (!chapitre) return;
    setChapitres(prev => prev.filter(c => c.id !== chapitre.id));
    onCancel();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text }}>{chapitre ? "✎ Modifier le chapitre" : "+ Nouveau chapitre"}</div>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
      </div>

      <Card>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Titre du chapitre</label>
          <input placeholder="ex: Le miroir, La patience comme vertu..." value={titre} onChange={e => setTitre(e.target.value)} style={inp} />
        </div>
        <div>
          <label style={lbl}>Texte</label>
          <textarea placeholder="Développe ta réflexion ici..." value={texte} onChange={e => setTexte(e.target.value)} rows={10} style={inp} />
        </div>
      </Card>

      <Card>
        <SectionTitle>✦ Verset associé (optionnel)</SectionTitle>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>Texte du verset</label>
          <textarea placeholder="ex: Ne crains rien, car je suis avec toi..." value={versetTexte} onChange={e => setVersetTexte(e.target.value)} rows={2} style={inp} />
        </div>
        <div>
          <label style={lbl}>Référence</label>
          <input placeholder="ex: Ésaïe 41:10" value={versetRef} onChange={e => setVersetRef(e.target.value)} style={inp} />
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <SectionTitle style={{ margin: 0 }}>🤔 Questions de discernement (optionnel)</SectionTitle>
          <button onClick={addQuestion} style={{ background: COLORS.cyan + "20", border: `1px solid ${COLORS.cyan}40`, color: COLORS.cyan, borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>+ Ajouter</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {questions.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <input placeholder={`Question ${i + 1}...`} value={q} onChange={e => setQuestion(i, e.target.value)} style={{ ...inp, flex: 1 }} />
              <button onClick={() => removeQuestion(i)} style={{ background: COLORS.red + "20", border: `1px solid ${COLORS.red}30`, color: COLORS.red, borderRadius: 6, padding: "10px 12px", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
      </Card>

      <button onClick={handleSave} style={{ background: COLORS.cyan, color: COLORS.bg, border: "none", borderRadius: 10, padding: 16, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
        ✓ {chapitre ? "Enregistrer les modifications" : "Créer ce chapitre"}
      </button>

      {chapitre && (
        <button onClick={handleDelete} style={{ background: "none", border: `1px solid ${COLORS.red}40`, color: COLORS.red, borderRadius: 10, padding: 12, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          🗑️ Supprimer ce chapitre
        </button>
      )}
    </div>
  );
}

function Objectifs({ trades, comptes, objectifs, setObjectifs }) {
  const [newObj, setNewObj] = useState({ titre: "", montant: "", devise: "USD", deadline: "", note: "" });
  const [showObjForm, setShowObjForm] = useState(false);
  // Dérivé directement de la liste d'objectifs (source de vérité unique) au lieu d'un state
  // local séparé — évite toute désynchronisation quand on quitte/revient sur cet onglet.
  const questesAjoutees = objectifs.filter(o => o.questeId).map(o => o.questeId);
  const [justeValidees, setJusteValidees] = useState([]); // ids des quêtes auto-validées à l'instant (pour le badge "auto")

  const ctx = buildEcosystemContext(trades, comptes);
  const allPnl = ctx.gainTotal;
  const totalPayouts = ctx.totalPayouts;

  // ── Détection automatique : à chaque changement de trades/comptes, on vérifie
  // si une quête non encore ajoutée est désormais accomplie par les données réelles.
  useEffect(() => {
    const nouvellesValidees = [];
    QUETES_CATALOG.forEach(q => {
      if (!q.checkAuto) return;
      if (questesAjoutees.includes(q.id)) return;
      if (q.checkAuto(ctx)) {
        nouvellesValidees.push(q.id);
      }
    });
    if (nouvellesValidees.length > 0) {
      setObjectifs(o => [
        ...o,
        ...nouvellesValidees.map((qid, i) => {
          const q = QUETES_CATALOG.find(x => x.id === qid);
          return { id: Date.now() + i, questeId: qid, titre: q.titre, montant: q.montant, devise: q.devise, deadline: q.deadline, note: q.note, atteint: true, autoValidee: true };
        })
      ]);
      setJusteValidees(prev => [...prev, ...nouvellesValidees]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trades.length, comptes.length, totalPayouts, allPnl]);

  const inp = { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 8, padding: "10px 12px", fontSize: 13, width: "100%", boxSizing: "border-box" };
  const lbl = { fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, display: "block" };

  const encouragements = {
    proche: ["Tu y es presque, reste discipliné.", "Encore un effort, la ligne d'arrivée est proche.", "Chaque trade t'en rapproche."],
    debut: ["Chaque grand voyage commence par un premier pas.", "La constance battra toujours l'impatience.", "Construis ta fondation, les résultats suivront."],
    atteint: ["Objectif atteint. Tu l'as mérité.", "Le travail a payé. Maintenant vise plus haut.", "Félicitations. Reste humble et continue."],
  };

  const getEncouragement = (obj, progPct) => {
    if (obj.atteint) return encouragements.atteint[obj.id % 3];
    if (progPct >= 70) return encouragements.proche[obj.id % 3];
    return encouragements.debut[obj.id % 3];
  };

  const addObjectif = () => {
    if (!newObj.titre) return;
    setObjectifs(o => [...o, { id: Date.now(), ...newObj, montant: parseFloat(newObj.montant) || 0, atteint: false }]);
    setNewObj({ titre: "", montant: "", devise: "USD", deadline: "", note: "" });
    setShowObjForm(false);
  };

  const toggleAtteint = (id) => setObjectifs(o => o.map(x => x.id === id ? { ...x, atteint: !x.atteint } : x));
  const removeObj = (id) => setObjectifs(o => o.filter(x => x.id !== id));

  const addQuete = (q) => {
    setObjectifs(o => [...o, { id: Date.now(), questeId: q.id, titre: q.titre, montant: q.montant, devise: q.devise, deadline: q.deadline, note: q.note, atteint: false }]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── OBJECTIFS ── */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <SectionTitle style={{ margin: 0 }}>🎯 Mes objectifs</SectionTitle>
          <button onClick={() => setShowObjForm(s => !s)} style={{ background: COLORS.cyan + "20", border: `1px solid ${COLORS.cyan}40`, color: COLORS.cyan, borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            {showObjForm ? "✕" : "+ Ajouter"}
          </button>
        </div>

        {showObjForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, background: COLORS.bg, borderRadius: 8, padding: 12 }}>
            <div><label style={lbl}>Titre</label><input placeholder="ex: Premier payout Topstep" value={newObj.titre} onChange={e => setNewObj(o => ({ ...o, titre: e.target.value }))} style={inp} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
              <div><label style={lbl}>Montant cible</label><input type="number" placeholder="500" value={newObj.montant} onChange={e => setNewObj(o => ({ ...o, montant: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Devise</label>
                <select value={newObj.devise} onChange={e => setNewObj(o => ({ ...o, devise: e.target.value }))} style={inp}>
                  {DEVISES.map(d => <option key={d.code} value={d.code}>{d.symbole} {d.code}</option>)}
                </select>
              </div>
            </div>
            <div><label style={lbl}>Deadline</label><input type="date" value={newObj.deadline} onChange={e => setNewObj(o => ({ ...o, deadline: e.target.value }))} style={inp} /></div>
            <div><label style={lbl}>Note personnelle</label><input placeholder="Pourquoi cet objectif..." value={newObj.note} onChange={e => setNewObj(o => ({ ...o, note: e.target.value }))} style={inp} /></div>
            <button onClick={addObjectif} style={{ background: COLORS.cyan, color: COLORS.bg, border: "none", borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>✓ Créer l'objectif</button>
          </div>
        )}

        {objectifs.map(obj => {
          const progPct = obj.montant > 0 ? Math.min(100, Math.round((allPnl / obj.montant) * 100)) : 0;
          const sym = getDeviseSymbole(obj.devise);
          const enc = getEncouragement(obj, progPct);
          return (
            <div key={obj.id} style={{ background: COLORS.bg, borderRadius: 10, padding: 14, marginBottom: 10, borderLeft: `3px solid ${obj.atteint ? COLORS.green : COLORS.cyan}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: obj.atteint ? COLORS.green : COLORS.text }}>{obj.atteint ? "✓ " : ""}{obj.titre}</div>
                    {obj.autoValidee && <span style={{ fontSize: 9, fontWeight: 700, color: COLORS.cyan, background: COLORS.cyan + "20", border: `1px solid ${COLORS.cyan}40`, borderRadius: 20, padding: "1px 7px" }}>⚡ AUTO</span>}
                  </div>
                  {obj.deadline && <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 2 }}>Deadline : {obj.deadline}</div>}
                  {obj.note && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 3, fontStyle: "italic" }}>{obj.note}</div>}
                </div>
                <div style={{ display: "flex", gap: 6, marginLeft: 10 }}>
                  <button onClick={() => toggleAtteint(obj.id)} style={{ background: obj.atteint ? COLORS.green + "20" : COLORS.surface, border: `1px solid ${obj.atteint ? COLORS.green : COLORS.border}`, color: obj.atteint ? COLORS.green : COLORS.muted, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>{obj.atteint ? "✓" : "○"}</button>
                  <button onClick={() => removeObj(obj.id)} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 14, cursor: "pointer" }}>✕</button>
                </div>
              </div>
              {obj.montant > 0 && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
                    <span style={{ color: COLORS.textDim }}>Progression</span>
                    <span style={{ color: COLORS.cyan, fontFamily: "monospace", fontWeight: 700 }}>{sym}{allPnl} / {sym}{obj.montant} ({progPct}%)</span>
                  </div>
                  <div style={{ height: 4, background: COLORS.border, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ width: `${progPct}%`, height: "100%", background: obj.atteint ? COLORS.green : COLORS.cyan, transition: "width 0.5s" }} />
                  </div>
                </>
              )}
              <div style={{ fontSize: 11, color: COLORS.muted, fontStyle: "italic" }}>{enc}</div>
            </div>
          );
        })}
      </Card>

      {/* ── QUÊTES — toujours visibles, indépendantes des objectifs créés ── */}
      <Card>
        <div style={{ marginBottom: 12 }}>
          <SectionTitle style={{ margin: 0 }}>⚔️ Quêtes</SectionTitle>
          <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Idées d'objectifs à débloquer — clique pour l'ajouter à ta liste</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {QUETES_CATALOG.map(q => {
            const dejaAjoutee = questesAjoutees.includes(q.id);
            return (
              <button
                key={q.id}
                onClick={() => !dejaAjoutee && addQuete(q)}
                disabled={dejaAjoutee}
                style={{
                  background: dejaAjoutee ? COLORS.green + "10" : COLORS.bg,
                  border: `1px solid ${dejaAjoutee ? COLORS.green + "40" : COLORS.border}`,
                  borderRadius: 10, padding: "10px 14px",
                  cursor: dejaAjoutee ? "default" : "pointer",
                  display: "flex", alignItems: "center", gap: 10, textAlign: "left", width: "100%",
                  opacity: dejaAjoutee ? 0.6 : 1,
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{q.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: dejaAjoutee ? COLORS.green : COLORS.text }}>{q.titre}</div>
                  <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 2 }}>{q.note}</div>
                </div>
                <span style={{ fontSize: 14, color: dejaAjoutee ? COLORS.green : COLORS.border, flexShrink: 0, fontWeight: 700 }}>
                  {dejaAjoutee ? "✓" : "+"}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [trades, setTrades] = useState(initialTrades);
  const [comptes, setComptes] = useState(initialComptes);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [editingTrade, setEditingTrade] = useState(null); // trade en cours d'édition, ou null
  const [editingCompte, setEditingCompte] = useState(null); // compte en cours d'édition, ou null
  const [reglesPreselect, setReglesPreselect] = useState(null); // prop firm à présélectionner dans l'onglet Règles
  const [journalInitialVue, setJournalInitialVue] = useState("liste"); // permet d'ouvrir Journal directement sur Analyse

  // ── États remontés depuis ROI / Regles / Objectifs pour permettre l'export/import complet ──
  const [objectifs, setObjectifs] = useState(initialObjectifs);
  const [reglesPerso, setReglesPerso] = useState(initialReglesPerso);
  const [chapitres, setChapitres] = useState(initialChapitres);
  const [mentorQ, setMentorQ] = useState(initialMentorQ);
  const [fraisDivers, setFraisDivers] = useState([
    { id: 1, label: "Plateforme NinjaTrader", montant: 60, type: "mensuel", categorie: "plateforme" },
    { id: 2, label: "Flux de données Rithmic", montant: 35, type: "mensuel", categorie: "plateforme" },
    { id: 3, label: "TradingView Pro", montant: 180, type: "annuel", categorie: "plateforme" },
    { id: 4, label: "Formation MentorQ - module avancé", montant: 250, type: "unique", categorie: "formation" },
    { id: 5, label: "Livre Trading in the Zone", montant: 22, type: "unique", categorie: "formation" },
    { id: 6, label: "VPN pour exécution rapide", montant: 8, type: "mensuel", categorie: "abonnement" },
    { id: 7, label: "Écran trading additionnel", montant: 290, type: "unique", categorie: "autre" },
  ]);
  const [fiscal, setFiscal] = useState({ pays: "FR", structure: "sasu", taux: 25, actif: true, dateCreation: "2025-09-01", acreActif: false });
  const [deviseRecue, setDeviseRecue] = useState("USD");
  const [deviseRef, setDeviseRef] = useState(() => {
    if (fiscal.actif && PAYS_FISCAL[fiscal.pays]?.deviseFiscale) return PAYS_FISCAL[fiscal.pays].deviseFiscale;
    return "USD";
  });
  const [tauxPerso, setTauxPerso] = useState({});
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [showImportError, setShowImportError] = useState(false);
  const [storageReady, setStorageReady] = useState(false); // true une fois le chargement initial terminé
  const [showStorageSaved, setShowStorageSaved] = useState(false);

  // ── PERSISTANCE — chargement au démarrage, sauvegarde automatique à chaque changement ──
  const STORAGE_KEY = "spirit-trading-data";

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage?.get(STORAGE_KEY);
        if (result?.value) {
          const data = JSON.parse(result.value);
          if (Array.isArray(data.trades)) setTrades(data.trades);
          if (Array.isArray(data.comptes)) setComptes(data.comptes);
          if (Array.isArray(data.objectifs)) setObjectifs(data.objectifs);
          if (Array.isArray(data.reglesPerso)) setReglesPerso(data.reglesPerso);
          if (data.mentorQ) setMentorQ(data.mentorQ);
          if (Array.isArray(data.fraisDivers)) setFraisDivers(data.fraisDivers);
          if (data.fiscal) setFiscal(data.fiscal);
          if (data.deviseRecue) setDeviseRecue(data.deviseRecue);
          if (data.deviseRef) setDeviseRef(data.deviseRef);
          if (data.tauxPerso) setTauxPerso(data.tauxPerso);
          if (Array.isArray(data.chapitres)) setChapitres(data.chapitres);
        }
      } catch (err) {
        // Pas de sauvegarde existante, ou erreur de lecture — on démarre avec les valeurs par défaut
      } finally {
        setStorageReady(true);
      }
    })();
  }, []);

  // Sauvegarde automatique à chaque changement de donnée, une fois le chargement initial terminé
  useEffect(() => {
    if (!storageReady) return; // évite d'écraser le storage avant que le chargement initial soit fait
    const data = { trades, comptes, objectifs, reglesPerso, mentorQ, fraisDivers, fiscal, deviseRecue, deviseRef, tauxPerso, chapitres };
    const timeoutId = setTimeout(async () => {
      try {
        await window.storage?.set(STORAGE_KEY, JSON.stringify(data));
        setShowStorageSaved(true);
        setTimeout(() => setShowStorageSaved(false), 1500);
      } catch (err) {
        // Sauvegarde silencieusement échouée — l'export manuel reste disponible
      }
    }, 600); // debounce pour ne pas sauvegarder à chaque frappe de clavier
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trades, comptes, objectifs, reglesPerso, mentorQ, fraisDivers, fiscal, deviseRecue, deviseRef, tauxPerso, chapitres, storageReady]);

  const handleSaveTrade = (form, editId) => {
    const t = {
      id: editId || (trades.length > 0 ? Math.max(...trades.map(t => t.id)) + 1 : 1),
      date: form.date, heure: form.heure, duree: parseInt(form.duree) || 0,
      compte: form.compte, actif: form.actif, direction: form.direction, setup: form.setup,
      taille: parseInt(form.taille) || 1, pnl: parseFloat(form.pnl) || 0, rr: parseFloat(form.rr) || 0,
      respect: form.respect, regle_violee: form.regle_violee, notes_tech: form.notes_tech,
      priere: form.priere, heure_coucher: form.heure_coucher, sommeil: parseFloat(form.sommeil) || 0,
      ecrans: form.ecrans, qualite_sommeil: form.qualite_sommeil, alimentation: form.alimentation,
      discipline: form.discipline, impulsif: form.impulsif,
      emotion_avant: Array.isArray(form.emotion_avant) ? form.emotion_avant.join(", ") : form.emotion_avant,
      emotion_pendant: Array.isArray(form.emotion_pendant) ? form.emotion_pendant.join(", ") : form.emotion_pendant,
      emotion_apres: Array.isArray(form.emotion_apres) ? form.emotion_apres.join(", ") : form.emotion_apres,
      lecon: form.lecon, note: form.note, joursPayoutValide: (parseFloat(form.pnl) || 0) >= 150,
    };
    if (editId) {
      setTrades(prev => prev.map(tr => tr.id === editId ? t : tr));
      setEditingTrade(null);
      setSelectedTrade(t); // retourne sur le détail mis à jour
      setTab("journal");
    } else {
      setTrades(prev => [...prev, t]);
      setTab("journal");
    }
  };

  const handleEditTrade = (trade) => {
    setEditingTrade(trade);
    setSelectedTrade(null);
    setTab("nouveau");
  };

  const handleCancelEdit = () => {
    if (editingTrade) {
      setSelectedTrade(editingTrade);
      setEditingTrade(null);
    } else {
      setTab("journal");
    }
  };

  const handleAddCompte = (newC) => {
    if (editingCompte) {
      const ancienNom = editingCompte.nom;
      const nouveauNom = newC.nom;
      setComptes(prev => prev.map(c => c.id === editingCompte.id ? { ...c, ...newC, id: c.id, payouts: newC.payouts || [] } : c));
      // Si le nom du compte change (ex: changement de taille/type), on migre automatiquement
      // tous les trades déjà liés à l'ancien nom — sinon ils deviendraient orphelins et
      // disparaîtraient des stats du compte, du Dashboard et des filtres Journal.
      if (ancienNom && nouveauNom && ancienNom !== nouveauNom) {
        setTrades(prev => prev.map(t => t.compte === ancienNom ? { ...t, compte: nouveauNom } : t));
      }
      setEditingCompte(null);
    } else {
      setComptes(prev => [...prev, { ...newC, id: Date.now(), payouts: newC.payouts || [] }]);
    }
    setTab("dashboard");
  };

  const handleEditCompte = (compte) => {
    setEditingCompte(compte);
    setTab("ajout_compte");
  };

  const handleNewCompte = () => {
    setEditingCompte(null);
    setTab("ajout_compte");
  };

  const handleGoToRegles = (firmType) => {
    setReglesPreselect(firmType);
    setTab("regles");
  };

  const handleGoToAnalyse = () => {
    setJournalInitialVue("analyse");
    setTab("journal");
  };

  const handleCancelCompteEdit = () => {
    setEditingCompte(null);
    setTab("dashboard");
  };

  // ── EXPORT / IMPORT — sauvegarde complète de toutes les données de l'app ──
  const buildExportData = () => ({
    version: 1,
    exporteLe: new Date().toISOString(),
    trades, comptes, objectifs, reglesPerso, mentorQ, fraisDivers, fiscal,
    deviseRecue, deviseRef, tauxPerso, chapitres,
  });

  const handleExportJSON = () => {
    const data = buildExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `spirit-trading-sauvegarde-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (trades.length === 0) return;
    const headers = ["id","date","heure","duree","compte","actif","direction","setup","taille","pnl","rr","respect","regle_violee","notes_tech","priere","heure_coucher","sommeil","ecrans","qualite_sommeil","alimentation","discipline","impulsif","emotion_avant","emotion_pendant","emotion_apres","lecon","note"];
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return "";
      const s = String(val).replace(/"/g, '""');
      return /[",\n;]/.test(s) ? `"${s}"` : s;
    };
    const lines = [headers.join(";")];
    trades.forEach(t => {
      lines.push(headers.map(h => escapeCsv(t[h])).join(";"));
    });
    const csv = "\uFEFF" + lines.join("\n"); // BOM pour Excel/Sheets accents
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `spirit-trading-trades-${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data || typeof data !== "object") throw new Error("Format invalide");
        if (Array.isArray(data.trades)) setTrades(data.trades);
        if (Array.isArray(data.comptes)) setComptes(data.comptes);
        if (Array.isArray(data.objectifs)) setObjectifs(data.objectifs);
        if (Array.isArray(data.reglesPerso)) setReglesPerso(data.reglesPerso);
        if (data.mentorQ) setMentorQ(data.mentorQ);
        if (Array.isArray(data.fraisDivers)) setFraisDivers(data.fraisDivers);
        if (data.fiscal) setFiscal(data.fiscal);
        if (data.deviseRecue) setDeviseRecue(data.deviseRecue);
        if (data.deviseRef) setDeviseRef(data.deviseRef);
        if (data.tauxPerso) setTauxPerso(data.tauxPerso);
        if (Array.isArray(data.chapitres)) setChapitres(data.chapitres);
        setShowImportSuccess(true);
        setTimeout(() => setShowImportSuccess(false), 3000);
      } catch (err) {
        setShowImportError(true);
        setTimeout(() => setShowImportError(false), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // reset pour pouvoir réimporter le même fichier si besoin
  };

  const tabs = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "journal", icon: "📋", label: "Journal" },
    { id: "chemin", icon: "🪞", label: "Le Chemin" },
    { id: "objectifs", icon: "🎯", label: "Objectifs" },
    { id: "roi", icon: "💰", label: "ROI" },
    { id: "regles", icon: "📜", label: "Règles" },
  ];

  const showNav = tab !== "nouveau" && tab !== "ajout_compte" && !selectedTrade;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", color: COLORS.text }}>
      <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: "14px 20px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.text, letterSpacing: -0.5 }}>
              <span style={{ fontSize: 18 }}>🕊️</span> Spirit <span style={{ color: COLORS.cyan }}>Trading</span>
            </div>
            <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 1, letterSpacing: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", gap: 6 }}>
              {comptes.length === 0 ? "Aucun compte" : `${comptes.length} compte${comptes.length > 1 ? "s" : ""} actif${comptes.length > 1 ? "s" : ""}`}
              {storageReady && (
                <span style={{ color: showStorageSaved ? COLORS.green : COLORS.muted, opacity: showStorageSaved ? 1 : 0.5, transition: "color 0.3s, opacity 0.3s", fontSize: 9 }}>
                  {showStorageSaved ? "✓ enregistré" : "· auto-sauvegarde activée"}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", position: "relative" }}>
            <button onClick={() => setShowExportMenu(s => !s)} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textDim, borderRadius: 8, padding: "6px 9px", fontSize: 13, cursor: "pointer", lineHeight: 1 }}>
              💾
            </button>
            <button onClick={handleNewCompte} style={{ background: COLORS.cyan + "15", border: `1px solid ${COLORS.cyan}30`, color: COLORS.cyan, borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              + Compte
            </button>

            {showExportMenu && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 8, minWidth: 220, zIndex: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                <div style={{ fontSize: 9, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1.5, padding: "4px 8px 8px" }}>Sauvegarde des données</div>
                <button onClick={() => { handleExportJSON(); setShowExportMenu(false); }} style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: COLORS.text, padding: "10px 8px", fontSize: 12, cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  📦 Exporter tout (JSON)
                </button>
                <button onClick={() => { handleExportCSV(); setShowExportMenu(false); }} style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: COLORS.text, padding: "10px 8px", fontSize: 12, cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  📊 Exporter trades (CSV → Sheets)
                </button>
                <div style={{ height: 1, background: COLORS.border, margin: "4px 0" }} />
                <button onClick={() => { handleImportClick(); setShowExportMenu(false); }} style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: COLORS.cyan, padding: "10px 8px", fontSize: 12, cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  📥 Importer une sauvegarde (JSON)
                </button>
                <div style={{ fontSize: 9, color: COLORS.muted, padding: "6px 8px 2px", lineHeight: 1.5 }}>
                  Le CSV s'ouvre directement dans Google Sheets via Fichier → Importer.
                </div>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} style={{ display: "none" }} />
          </div>
        </div>

        {showImportSuccess && (
          <div style={{ marginTop: 10, background: COLORS.green + "15", border: `1px solid ${COLORS.green}40`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: COLORS.green, fontWeight: 700 }}>
            ✓ Sauvegarde importée avec succès
          </div>
        )}
        {showImportError && (
          <div style={{ marginTop: 10, background: COLORS.red + "15", border: `1px solid ${COLORS.red}40`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: COLORS.red, fontWeight: 700 }}>
            ✕ Fichier invalide — vérifie qu'il s'agit bien d'une sauvegarde Spirit Trading
          </div>
        )}
      </div>

      <div style={{ padding: "16px 16px 100px" }}>
        {selectedTrade
          ? <DetailTrade trade={selectedTrade} onBack={() => setSelectedTrade(null)} onEdit={handleEditTrade} />
          : tab === "dashboard" ? <Dashboard trades={trades} comptes={comptes} onEditCompte={handleEditCompte} onNewCompte={handleNewCompte} onGoToAnalyse={handleGoToAnalyse} />
          : tab === "journal" ? <Journal trades={trades} onNew={() => setTab("nouveau")} onDetail={setSelectedTrade} initialVue={journalInitialVue} />
          : tab === "nouveau" ? <NouveauTrade onSave={handleSaveTrade} onCancel={handleCancelEdit} comptes={comptes} editTrade={editingTrade} />
          : tab === "ajout_compte" ? <AjoutCompte onSave={handleAddCompte} onCancel={handleCancelCompteEdit} editCompte={editingCompte} onGoToRegles={handleGoToRegles} />
          : tab === "regles" ? <Regles comptes={comptes} preselectedFirm={reglesPreselect} reglesPerso={reglesPerso} setReglesPerso={setReglesPerso} />
          : tab === "objectifs" ? <Objectifs trades={trades} comptes={comptes} objectifs={objectifs} setObjectifs={setObjectifs} />
          : tab === "chemin" ? <LeChemin chapitres={chapitres} setChapitres={setChapitres} />
          : <ROI comptes={comptes} setComptes={setComptes} trades={trades} onEditCompte={handleEditCompte}
              mentorQ={mentorQ} setMentorQ={setMentorQ}
              fraisDivers={fraisDivers} setFraisDivers={setFraisDivers}
              fiscal={fiscal} setFiscal={setFiscal}
              deviseRecue={deviseRecue} setDeviseRecue={setDeviseRecue}
              deviseRef={deviseRef} setDeviseRef={setDeviseRef}
              tauxPerso={tauxPerso} setTauxPerso={setTauxPerso}
            />
        }
      </div>

      {showNav && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: COLORS.surface, borderTop: `1px solid ${COLORS.border}`, display: "flex", padding: "8px 0 12px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", color: tab === t.id ? COLORS.cyan : COLORS.muted, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0" }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ fontSize: 9, fontWeight: tab === t.id ? 700 : 400, letterSpacing: 0.5 }}>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
