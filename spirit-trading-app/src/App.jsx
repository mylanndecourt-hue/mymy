import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  bg: "#0a0e1a", surface: "#111827", card: "#1a2235", border: "#1e2d45",
  cyan: "#00d4ff", green: "#00e5a0", amber: "#f59e0b", red: "#ef4444",
  muted: "#4b5e7a", text: "#e2e8f0", textDim: "#94a3b8",
};

const TR = {
  fr: {
    // Nav
    dashboard: "Dashboard", journal: "Journal", analyse: "Analyse",
    chemin: "Le Chemin", objectifs: "Objectifs", roi: "Fiscalité", regles: "Règles", session: "Session",
    // Header
    noAccount: "Aucun compte", accounts: (n) => `${n} compte${n > 1 ? "s" : ""} actif${n > 1 ? "s" : ""}`,
    saved: "✓ enregistré", autoSave: "· auto-sauvegarde activée",
    addAccount: "Ajouter un compte prop firm", logout: "Déconnexion",
    exportJson: "📦 Exporter tout (JSON)", exportCsv: "📊 Exporter trades (CSV → Sheets)",
    importJson: "📥 Importer une sauvegarde (JSON)",
    importSuccess: "✓ Sauvegarde importée avec succès",
    importError: "✕ Fichier invalide — vérifie qu'il s'agit bien d'une sauvegarde Spirit Trading",
    saveData: "Sauvegarde des données",
    csvHint: "Le CSV s'ouvre directement dans Google Sheets via Fichier → Importer.",
    // Dashboard
    totalPnl: "P&L Brut (latent)", winRate: "Win Rate", avgRR: "Ratio R/R moy.",
    totalTrades: "Trades total", bestDay: "Meilleure journée", worstDay: "Pire journée",
    avgTrade: "Moy. par trade", consistency: "Consistance",
    recentTrades: "Trades récents", noTrades: "Aucun trade enregistré",
    newTrade: "+ Nouveau trade",
    inGain: "En gain", inLoss: "En perte",
    winsInRow: (n) => `🔥 ${n} wins de suite`,
    totalRecorded: "total enregistrés",
    avgNote: "Note moyenne", execQuality: "qualité d'exécution",
    pnlCurve: "Courbe P&L cumulé", analyseArrow: "Analyse →",
    addTradesToSeeCurve: "Ajoute des trades pour voir la courbe",
    analyseAvailableFrom: (n, cur) => `Analyse disponible à partir de ${n} trades (${cur}/${n})`,
    mindsetDuJour: "Mindset du jour",
    paroleDuJour: "✦ Parole du jour",
    comptesTempsReel: "Comptes en temps réel",
    noAccountAdded: "Aucun compte ajouté",
    clickHereOrPlus: (label) => `Appuie ici ou sur ${label} en haut pour commencer`,
    modifyShort: "✎ modifier",
    soldeActuel: "solde actuel",
    gainDepuisDebut: "gain depuis début",
    lotsMax: "lots max",
    mllActuel: "MLL actuel",
    joursPayout: "jours payout",
    nextLevel: (lots) => `Prochain palier (${lots} lots)`,
    missing: (n) => `+${n}$ manquants`,
    margeAvantLiquidation: "Marge avant liquidation",
    noTradeOnAccount: "Aucun trade enregistré sur ce compte",
    addAnotherAccount: "+ Ajouter un autre compte",
    // Journal
    allEntries: "Toutes les entrées", filters: "Filtres", search: "Rechercher...",
    date: "Date", account: "Compte", asset: "Actif", direction: "Direction",
    setup: "Setup", pnl: "P&L", rr: "R/R", plan: "Plan", note: "Note",
    edit: "Modifier", delete: "Supprimer", noResult: "Aucun résultat",
    sortBy: "Trier par",
    filterBy: "Filtrer",
    result: "Résultat",
    gain: "Gain", loss: "Perte", all: "Tous",
    from: "Du", to: "Au",
    resetFilters: "✕ Réinitialiser les filtres",
    tradeCount: (n, total, hasFilter) => `${n} trade${n > 1 ? "s" : ""}${hasFilter ? ` (filtré sur ${total})` : ""} — clique pour voir le détail`,
    noTradesYet: "Aucun trade enregistré",
    clickNewTrade: (label) => `Clique sur ${label} pour commencer`,
    sortDateDesc: "Date ↓ (récent en premier)",
    sortDateAsc: "Date ↑ (ancien en premier)",
    sortGainDesc: "Gain ↓ (meilleurs en premier)",
    sortGainAsc: "Gain ↑ (pertes en premier)",
    sortNoteDesc: "Note ↓ (meilleures en premier)",
    sortRRDesc: "R:R ↓ (plus haut en premier)",
    // Analyse
    diagnostic: "🧠 Diagnostic",
    diagSubtitle: (n) => `Analyse automatique basée sur ${n} trades enregistrés`,
    diagWorks: "✅ Ce qui marche", diagStop: "🛑 Ce qu'il faut arrêter", diagImprove: "🔧 Ce sur quoi s'améliorer",
    notEnoughTrades: "Pas encore disponible",
    notEnoughDesc: (n) => `L'analyse se déclenche à partir de ${n} trades.`,
    progression: "Progression",
    kpiWinRate: "Win Rate", kpiAvgPnl: "P&L moyen / trade", kpiRR: "Ratio R/R",
    kpiRespect: "Respect du plan",
    setupDist: "📊 Répartition par setup", emotionDist: "📊 Répartition par émotion",
    propPnl: "🏦 P&L par prop firm", propPnlSub: "Résultat total des trades par compte",
    setupWR: "🎯 Taux de réussite par setup", setupWRSub: "Win rate de chaque setup",
    propWR: "🏦 Taux de réussite par prop firm", propWRSub: "Win rate des trades par compte",
    equity: "📈 Courbe d'équité", equitySub: "P&L cumulé trade après trade",
    hourWR: "🕐 Win rate par horaire", hourWRSub: "Pourcentage de trades gagnants par tranche",
    emotionPnl: "📊 P&L par émotion", emotionPnlSub: "Émotions avant trade vs P&L réel",
    bestEmotion: "Meilleure", bestDayChart: "Meilleur",
    dayChart: "📆 Jour le plus rentable", dayChartSub: "P&L par jour",
    noData: "Pas assez de données",
    // ROI
    bilanGlobal: "Bilan global", grossResult: "Résultat brut", netResult: "Net après impôt",
    totalInvest: "Total investi", totalPayouts: "Total payouts", roi: "ROI",
    felicitations: "🏆 Félicitations — tu fais partie des <strong>0.9%</strong> de traders rentables.",
    receivePayoutsIn: "Mes payouts sont reçus en quelle devise ?",
    convertTo: "Convertir vers quelle devise ?",
    noConversion: "aucune conversion",
    exchangeRate: (d) => `Taux de change · 1 ${d} =`,
    exchangeHint: "Taux indicatif pré-rempli. Modifie-le selon le taux réel du jour si besoin.",
    netAfterConversion: "Net après conversion",
    netAfterTax: "Net après impôt",
    netAfterBoth: "Net après conversion & impôt",
    taxedIn: (d, rate) => `Imposé en ${d} (taux ${rate}%)`,
    thenConverted: (d) => `, puis converti en ${d}`,
    availableWhenBoth: "Disponible si les deux options sont activées",
    taxRate: (rate) => `Taux ${rate}%`,
    incomes: "📈 Entrées",
    expenses: "📉 Dépenses",
    payoutsReceived: "Payouts reçus (brut)",
    propFirmAccounts: "Comptes prop firms",
    miscFees: "Frais divers",
    totalExpenses: "Total dépenses",
    noPayout: "Aucun payout enregistré",
    noExpense: "Aucune dépense enregistrée",
    allIncomes: "📈 Toutes les entrées",
    allFees: "💸 Tous les frais",
    totalAllIncomes: "Total toutes entrées",
    totalAllExpenses: "Total toutes dépenses",
    registerPayout: "+ Enregistrer un payout",
    cancelPayout: "✕ Annuler",
    confirmPayout: "✓ Confirmer le payout",
    addFee: "+ Ajouter",
    addFormation: "🎓 + Ajouter une formation (MentorQ, autre...)",
    monthly: "Mensuel", since: "Depuis",
    feeName: "Nom", feeAmount: "Montant ($)", feeCategory: "Catégorie", feeFrequency: "Fréquence",
    confirmFee: "✓ Ajouter ce frais",
    investmentTotal: "Investissement total",
    totalPayoutsAccount: "Total payouts ce compte",
    nbPayouts: "Nb de payouts",
    roiAccount: "ROI compte",
    payoutReceived: "Payout reçu",
    structureFiscal: "Structure & fiscalité",
    activate: "Activer",
    modify: "✎ Modifier",
    close: "✕ Fermer",
    confirm: "✓ Confirmer",
    country: "Pays",
    structureType: "Type de structure",
    creationDate: "Date de création de la structure",
    effectiveTaxRate: "Taux d'imposition effectif (%) — modifiable",
    defaultSuggested: (rate) => `Défaut suggéré : ${rate}%. Ajuste selon ta situation réelle.`,
    grossResult2: "Brut", taxEstimated: (rate) => `Impôt estimé (${rate}%)`,
    taxLine: (rate) => `Impôt (${rate}%)`,
    structureDesc: "Si ton activité de trading passe par une entreprise ou micro-entreprise.",
    propFirmAccountsSection: "🏦 Comptes prop firms",
    // Nouveau trade
    save: "Enregistrer", cancel: "Annuler", addTrade: "Ajouter un trade", editTrade: "Modifier le trade",
    editTradeTitle: (id) => `✎ Modifier le trade #${id}`,
    newTradeTitle: "Nouveau trade",
    technique: "🔧 Technique",
    discipline: "🌿 Discipline",
    psychologie: "🧠 Psychologie",
    tradeDuration: "Durée du trade (min)",
    planRespect: "Respect du plan",
    violatedRule: "Règle violée",
    techNotes: "Notes techniques",
    gainLoss: "💰 Gain / Perte du trade",
    negativeForLoss: "En $ — négatif pour une perte",
    prayer: "Prière",
    bedtime: "Heure coucher",
    sleep: "Sommeil (h)",
    screensBeforeBed: "Écrans avant dodo",
    sleepQuality: "Qualité sommeil",
    diet: "Alimentation",
    impulsive: "Impulsif ?",
    emotionBefore: "Émotion avant",
    emotionDuring: "Émotion pendant",
    globalNote: "Note globale",
    lessonLearned: "Leçon apprise",
    lessonPlaceholder: "Ce que ce trade t'a appris...",
    techNotesPlaceholder: "Analyse, confluences, contexte HTF...",
    violatedRulePlaceholder: "ex: Stop trop serré, entrée sans confirmation...",
    durationPlaceholder: "ex: 45",
    newEmotionPlaceholder: "Nouvelle émotion...",
    addEmotion: "+ Ajouter",
    saveTradeBtn: "✓ Enregistrer le trade",
    updateTradeBtn: "✓ Mettre à jour le trade",
    // AjoutCompte
    back: "← Retour",
    addAccount2: "Ajouter un compte",
    editAccount: "Modifier le compte",
    propFirmLabel: "Prop Firm",
    accountSize: "Taille du compte",
    accountType: "Type de compte",
    accountNumber: "N° de compte",
    accountNumberOpt: "(optionnel)",
    accountState: "📌 État du compte",
    newAccount: "🆕 Nouveau compte",
    newAccountDesc: "Je commence à $0, rien à renseigner",
    existingAccount: "📂 Compte déjà ouvert",
    existingAccountDesc: "Je l'ai depuis un moment, j'ai un historique",
    currentBalance: "Solde actuel du compte ($)",
    cumulatedPnl: "Gain/Perte cumulé actuel ($)",
    topstepBalanceHint: "Le solde actuel, pas le P&L. Sert à calculer ton MLL et tes lots disponibles.",
    otherPnlHint: "Le P&L cumulé depuis l'ouverture du compte.",
    mllCurrent: "Maximum Loss Limit (MLL) actuel",
    mllHint: (calc) => `Suggestion auto : ${calc}$ — ajuste si ton MLL réel est différent (palier déjà passé, trailing custom...)`,
    validatedPayoutDays: "Jours de payout déjà validés (sur 5)",
    existingPayouts: "Payouts déjà reçus sur ce compte",
    existingPayoutsHint: "Si tu as déjà touché des payouts avant d'utiliser l'app, ajoute-les ici.",
    alreadyReceived: "Total déjà reçu",
    addThisPayout: "+ Ajouter ce payout",
    costs: "💸 Coûts",
    purchase: "Achat ($)",
    activationCost: "Activation ($)",
    doNotViolate: "À ne jamais enfreindre",
    accountCut: "compte coupé",
    seeAllRules: (firm) => `📜 Voir toutes les règles ${firm} →`,
    nameLabel: "Nom",
    saveChanges: "✓ Enregistrer les modifications",
    addAccountBtn: (firm, label, size) => `✓ Ajouter — ${firm} ${label} $${size}`,
    // Regles
    regulation: "🇫🇷 Réglementation",
    myRules: "Mes règles perso",
    addRule: "+ Ajouter une règle",
    ruleTitle: "Titre de la règle",
    ruleCategory: "Catégorie",
    cancelRule: "✕ Annuler",
    saveRule: "✓ Ajouter",
    noPersonalRules: "Aucune règle personnelle ajoutée",
    addPersonalRulesHint: "Clique sur \"+ Ajouter une règle\" pour créer tes propres règles.",
    // Objectifs
    myObjectives: "🎯 Mes objectifs",
    addObjective: "+ Ajouter",
    objectiveTitle: "Titre",
    targetAmount: "Montant cible",
    currency: "Devise",
    deadline: "Deadline",
    personalNote: "Note personnelle",
    personalNotePlaceholder: "Pourquoi cet objectif...",
    createObjective: "✓ Créer l'objectif",
    progressLabel: "Progression",
    questsSection: "⚔️ Quêtes",
    questsHint: "Idées d'objectifs à débloquer — clique pour l'ajouter à ta liste",
    // LeChemin
    newChapter: "+ Nouveau chapitre",
    noChapters: "Aucun chapitre pour l'instant",
    noChaptersHint: "Écris ton premier chapitre sur comment devenir un trader rentable en marchant selon l'Esprit.",
    chaptersCount: (n) => `🕊️ ${n} chapitre${n !== 1 ? "s" : ""} écrit${n !== 1 ? "s" : ""}`,
    allChapters: "← Tous les chapitres",
    chapterLabel: "Chapitre",
    noTitle: "Sans titre",
    discernmentQuestions: "Questions de discernement",
    discernmentHint: "Prends un moment pour répondre honnêtement. Ces notes restent privées, juste pour toi.",
    answerPlaceholder: "Ta réponse...",
    associatedVerse: "✦ Verset associé",
    editChapter: "✎ Modifier",
    editChapterTitle: "✎ Modifier le chapitre",
    newChapterTitle: "+ Nouveau chapitre",
    chapterTitleLabel: "Titre du chapitre",
    chapterTitlePlaceholder: "ex: Le miroir, La patience comme vertu...",
    chapterText: "Texte",
    chapterTextPlaceholder: "Développe ta réflexion ici...",
    verseAssociated: "✦ Verset associé (optionnel)",
    verseText: "Texte du verset",
    verseTextPlaceholder: "ex: Ne crains rien, car je suis avec toi...",
    verseRef: "Référence",
    verseRefPlaceholder: "ex: Ésaïe 41:10",
    discernmentOptional: "🤔 Questions de discernement (optionnel)",
    questionPlaceholder: (i) => `Question ${i + 1}...`,
    saveChapter: (isEdit) => isEdit ? "✓ Enregistrer les modifications" : "✓ Créer ce chapitre",
    deleteChapter: "🗑️ Supprimer ce chapitre",
    // DetailTrade
    tradeBack: "← Retour",
    tradeTech: "🔧 Technique",
    tradeDiscipline: "🌿 Discipline",
    tradePsycho: "🧠 Psychologie",
    tradeScreenshots: "📸 Screenshots",
    screenshotHint: "Glisser-déposer tes screenshots ici",
    screenshotSub: "Entrée · Sortie · Contexte HTF",
    backToJournal: "← Retour au journal",
    planRespected: "✓ Plan respecté",
    planPartial: "~ Partiel",
    planNotRespected: "✗ Non respecté",
    labelActif: "Actif", labelDirection: "Direction", labelSetup: "Setup",
    labelTaille: "Taille", labelPnl: "P&L", labelRR: "R:R",
    labelDuree: "Durée", labelRespect: "Respect du plan", labelViolated: "Règle violée",
    labelNotesTech: "Notes techniques", labelPrayer: "Prière", labelBedtime: "Heure coucher",
    labelSleep: "Sommeil", labelScreens: "Écrans avant dodo", labelSleepQuality: "Qualité sommeil",
    labelDiet: "Alimentation", labelImpulsive: "Impulsivité",
    labelEmotionBefore: "Émotion avant", labelEmotionDuring: "Émotion pendant",
    labelGlobalNote: "Note globale", labelLesson: "📝 Leçon apprise",
    impulsiveYes: "⚡ Oui", impulsiveNo: "✓ Non",
    prayerYes: "✓ Oui", prayerNo: "✗ Non",
    screensYes: "⚠️ Oui", screensNo: "✓ Non",
    contract: (n) => `${n} contrat${n > 1 ? "s" : ""}`,
    lotLabel: (n) => `${n} lot${n > 1 ? "s" : ""}`,
    // General
    yes: "Oui", no: "Non", partial: "Partiel", long: "LONG", short: "SHORT",
    loading: "Chargement...", loadingData: "Chargement de tes données...",
    loginTitle: "Ton journal de trading intelligent",
    loginBtn: "Continuer avec Google",
    loginFooter: "Tes données sont sauvegardées en toute sécurité\ndans le cloud et accessibles depuis n'importe quel appareil.",
  },
  en: {
    // Nav
    dashboard: "Dashboard", journal: "Journal", analyse: "Analysis",
    chemin: "The Path", objectifs: "Goals", roi: "ROI", regles: "Rules",
    // Header
    noAccount: "No account", accounts: (n) => `${n} active account${n > 1 ? "s" : ""}`,
    saved: "✓ saved", autoSave: "· auto-save enabled",
    addAccount: "Add a prop firm account", logout: "Logout",
    exportJson: "📦 Export all (JSON)", exportCsv: "📊 Export trades (CSV → Sheets)",
    importJson: "📥 Import a backup (JSON)",
    importSuccess: "✓ Backup imported successfully",
    importError: "✕ Invalid file — make sure it's a Spirit Trading backup",
    saveData: "Data backup",
    csvHint: "The CSV opens directly in Google Sheets via File → Import.",
    // Dashboard
    totalTrades: "Total trades", bestDay: "Best day", worstDay: "Worst day",
    avgTrade: "Avg per trade", consistency: "Consistency",
    recentTrades: "Recent trades", noTrades: "No trades recorded",
    newTrade: "+ New trade",
    inGain: "In profit", inLoss: "In loss",
    winsInRow: (n) => `🔥 ${n} wins in a row`,
    totalRecorded: "total recorded",
    avgNote: "Avg rating", execQuality: "execution quality",
    pnlCurve: "Cumulative P&L curve", analyseArrow: "Analysis →",
    addTradesToSeeCurve: "Add trades to see the curve",
    analyseAvailableFrom: (n, cur) => `Analysis available from ${n} trades (${cur}/${n})`,
    mindsetDuJour: "Mindset of the day",
    paroleDuJour: "✦ Verse of the day",
    comptesTempsReel: "Accounts — live",
    noAccountAdded: "No account added",
    clickHereOrPlus: (label) => `Tap here or ${label} above to get started`,
    modifyShort: "✎ edit",
    soldeActuel: "current balance",
    gainDepuisDebut: "gain since start",
    lotsMax: "max lots",
    mllActuel: "current MLL",
    joursPayout: "payout days",
    nextLevel: (lots) => `Next level (${lots} lots)`,
    missing: (n) => `+${n}$ needed`,
    margeAvantLiquidation: "Margin before liquidation",
    noTradeOnAccount: "No trades recorded on this account",
    addAnotherAccount: "+ Add another account",
    // Journal
    allEntries: "All entries", filters: "Filters", search: "Search...",
    date: "Date", account: "Account", asset: "Asset", direction: "Direction",
    setup: "Setup", pnl: "P&L", rr: "R/R", plan: "Plan", note: "Note",
    edit: "Edit", delete: "Delete", noResult: "No results",
    sortBy: "Sort by",
    filterBy: "Filter",
    result: "Result",
    gain: "Win", loss: "Loss", all: "All",
    from: "From", to: "To",
    resetFilters: "✕ Reset filters",
    tradeCount: (n, total, hasFilter) => `${n} trade${n > 1 ? "s" : ""}${hasFilter ? ` (filtered from ${total})` : ""} — click to see details`,
    noTradesYet: "No trades recorded",
    clickNewTrade: (label) => `Click ${label} to get started`,
    sortDateDesc: "Date ↓ (newest first)",
    sortDateAsc: "Date ↑ (oldest first)",
    sortGainDesc: "Gain ↓ (best first)",
    sortGainAsc: "Gain ↑ (losses first)",
    sortNoteDesc: "Rating ↓ (best first)",
    sortRRDesc: "R:R ↓ (highest first)",
    // Analyse
    diagnostic: "🧠 Diagnostic",
    diagSubtitle: (n) => `Automatic analysis based on ${n} recorded trades`,
    diagWorks: "✅ What's working", diagStop: "🛑 What to stop", diagImprove: "🔧 What to improve",
    notEnoughTrades: "Not yet available",
    notEnoughDesc: (n) => `Analysis starts from ${n} trades.`,
    progression: "Progress",
    kpiWinRate: "Win Rate", kpiAvgPnl: "Avg P&L / trade", kpiRR: "R/R Ratio",
    kpiRespect: "Plan discipline",
    setupDist: "📊 Setup breakdown", emotionDist: "📊 Emotion breakdown",
    propPnl: "🏦 P&L by prop firm", propPnlSub: "Total result per account",
    setupWR: "🎯 Win rate by setup", setupWRSub: "Win rate per setup",
    propWR: "🏦 Win rate by prop firm", propWRSub: "Win rate per account",
    equity: "📈 Equity curve", equitySub: "Cumulative P&L trade by trade",
    hourWR: "🕐 Win rate by time", hourWRSub: "Winning trade percentage by time slot",
    emotionPnl: "📊 P&L by emotion", emotionPnlSub: "Pre-trade emotion vs actual P&L",
    bestEmotion: "Best", bestDayChart: "Best",
    dayChart: "📆 Most profitable day", dayChartSub: "P&L by day",
    noData: "Not enough data",
    // ROI
    // ROI
    bilanGlobal: "Global summary", grossResult: "Gross result", netResult: "Net after tax",
    totalInvest: "Total invested", totalPayouts: "Total payouts", roi: "ROI",
    felicitations: "🏆 Congratulations — you are among the <strong>0.9%</strong> of profitable traders.",
    receivePayoutsIn: "In which currency do you receive your payouts?",
    noConversion: "no conversion",
    exchangeRate: (d) => `Exchange rate · 1 ${d} =`,
    exchangeHint: "Pre-filled indicative rate. Edit with today's actual rate if needed.",
    netAfterConversion: "Net after conversion",
    netAfterTax: "Net after tax",
    netAfterBoth: "Net after conversion & tax",
    taxedIn: (d, rate) => `Taxed in ${d} (rate ${rate}%)`,
    thenConverted: (d) => `, then converted to ${d}`,
    availableWhenBoth: "Available when both options are enabled",
    taxRate: (rate) => `Rate ${rate}%`,
    incomes: "📈 Income",
    expenses: "📉 Expenses",
    payoutsReceived: "Payouts received (gross)",
    propFirmAccounts: "Prop firm accounts",
    miscFees: "Misc fees",
    totalExpenses: "Total expenses",
    noPayout: "No payout recorded",
    noExpense: "No expense recorded",
    allIncomes: "📈 All income",
    allFees: "💸 All fees",
    totalAllIncomes: "Total all income",
    totalAllExpenses: "Total all expenses",
    registerPayout: "+ Record a payout",
    cancelPayout: "✕ Cancel",
    confirmPayout: "✓ Confirm payout",
    addFee: "+ Add",
    addFormation: "🎓 + Add training (MentorQ, other...)",
    monthly: "Monthly", since: "Since",
    feeName: "Name", feeAmount: "Amount ($)", feeCategory: "Category", feeFrequency: "Frequency",
    confirmFee: "✓ Add this fee",
    investmentTotal: "Total investment",
    totalPayoutsAccount: "Total payouts this account",
    nbPayouts: "# payouts",
    roiAccount: "Account ROI",
    payoutReceived: "Payout received",
    structureFiscal: "Structure & taxation",
    activate: "Enable",
    modify: "✎ Edit",
    close: "✕ Close",
    confirm: "✓ Confirm",
    country: "Country",
    structureType: "Structure type",
    creationDate: "Structure creation date",
    effectiveTaxRate: "Effective tax rate (%) — editable",
    defaultSuggested: (rate) => `Default suggestion: ${rate}%. Adjust to your actual situation.`,
    grossResult2: "Gross", taxEstimated: (rate) => `Estimated tax (${rate}%)`,
    taxLine: (rate) => `Tax (${rate}%)`,
    structureDesc: "If your trading activity runs through a company or micro-business.",
    propFirmAccountsSection: "🏦 Prop firm accounts",
    // Nouveau trade
    save: "Save", cancel: "Cancel", addTrade: "Add a trade", editTrade: "Edit trade",
    editTradeTitle: (id) => `✎ Edit trade #${id}`,
    newTradeTitle: "New trade",
    technique: "🔧 Technical",
    discipline: "🌿 Discipline",
    psychologie: "🧠 Psychology",
    tradeDuration: "Trade duration (min)",
    planRespect: "Plan respect",
    violatedRule: "Violated rule",
    techNotes: "Technical notes",
    gainLoss: "💰 Trade gain / loss",
    negativeForLoss: "In $ — negative for a loss",
    prayer: "Prayer",
    bedtime: "Bedtime",
    sleep: "Sleep (h)",
    screensBeforeBed: "Screens before bed",
    sleepQuality: "Sleep quality",
    diet: "Diet",
    impulsive: "Impulsive?",
    emotionBefore: "Emotion before",
    emotionDuring: "Emotion during",
    globalNote: "Overall rating",
    lessonLearned: "Lesson learned",
    lessonPlaceholder: "What this trade taught you...",
    techNotesPlaceholder: "Analysis, confluences, HTF context...",
    violatedRulePlaceholder: "e.g. Stop too tight, entry without confirmation...",
    durationPlaceholder: "e.g. 45",
    newEmotionPlaceholder: "New emotion...",
    addEmotion: "+ Add",
    saveTradeBtn: "✓ Save trade",
    updateTradeBtn: "✓ Update trade",
    // AjoutCompte
    back: "← Back",
    addAccount2: "Add an account",
    editAccount: "Edit account",
    propFirmLabel: "Prop Firm",
    accountSize: "Account size",
    accountType: "Account type",
    accountNumber: "Account #",
    accountNumberOpt: "(optional)",
    accountState: "📌 Account status",
    newAccount: "🆕 New account",
    newAccountDesc: "Starting at $0, nothing to fill in",
    existingAccount: "📂 Already open",
    existingAccountDesc: "I've had it for a while, I have history",
    currentBalance: "Current account balance ($)",
    cumulatedPnl: "Current cumulative gain/loss ($)",
    topstepBalanceHint: "The current balance, not P&L. Used to calculate your MLL and available lots.",
    otherPnlHint: "Cumulative P&L since the account was opened.",
    mllCurrent: "Current Maximum Loss Limit (MLL)",
    mllHint: (calc) => `Auto suggestion: ${calc}$ — adjust if your real MLL differs (tier already reached, custom trailing...)`,
    validatedPayoutDays: "Payout days already validated (out of 5)",
    existingPayouts: "Payouts already received on this account",
    existingPayoutsHint: "If you already received payouts before using the app, add them here.",
    alreadyReceived: "Total already received",
    addThisPayout: "+ Add this payout",
    costs: "💸 Costs",
    purchase: "Purchase ($)",
    activationCost: "Activation ($)",
    doNotViolate: "Never violate",
    accountCut: "account cut",
    seeAllRules: (firm) => `📜 See all ${firm} rules →`,
    nameLabel: "Name",
    saveChanges: "✓ Save changes",
    addAccountBtn: (firm, label, size) => `✓ Add — ${firm} ${label} $${size}`,
    // Regles
    regulation: "🇫🇷 Regulation",
    myRules: "My personal rules",
    addRule: "+ Add a rule",
    ruleTitle: "Rule title",
    ruleCategory: "Category",
    cancelRule: "✕ Cancel",
    saveRule: "✓ Add",
    noPersonalRules: "No personal rules added",
    addPersonalRulesHint: "Click \"+ Add a rule\" to create your own rules.",
    // Objectifs
    myObjectives: "🎯 My goals",
    addObjective: "+ Add",
    objectiveTitle: "Title",
    targetAmount: "Target amount",
    currency: "Currency",
    deadline: "Deadline",
    personalNote: "Personal note",
    personalNotePlaceholder: "Why this goal...",
    createObjective: "✓ Create goal",
    progressLabel: "Progress",
    questsSection: "⚔️ Quests",
    questsHint: "Goal ideas to unlock — click to add to your list",
    // LeChemin
    newChapter: "+ New chapter",
    noChapters: "No chapters yet",
    noChaptersHint: "Write your first chapter on becoming a profitable trader walking in the Spirit.",
    chaptersCount: (n) => `🕊️ ${n} chapter${n !== 1 ? "s" : ""} written`,
    allChapters: "← All chapters",
    chapterLabel: "Chapter",
    noTitle: "Untitled",
    discernmentQuestions: "Discernment questions",
    discernmentHint: "Take a moment to answer honestly. These notes remain private, just for you.",
    answerPlaceholder: "Your answer...",
    associatedVerse: "✦ Associated verse",
    editChapter: "✎ Edit",
    editChapterTitle: "✎ Edit chapter",
    newChapterTitle: "+ New chapter",
    chapterTitleLabel: "Chapter title",
    chapterTitlePlaceholder: "e.g. The mirror, Patience as virtue...",
    chapterText: "Text",
    chapterTextPlaceholder: "Develop your reflection here...",
    verseAssociated: "✦ Associated verse (optional)",
    verseText: "Verse text",
    verseTextPlaceholder: "e.g. Fear not, for I am with you...",
    verseRef: "Reference",
    verseRefPlaceholder: "e.g. Isaiah 41:10",
    discernmentOptional: "🤔 Discernment questions (optional)",
    questionPlaceholder: (i) => `Question ${i + 1}...`,
    saveChapter: (isEdit) => isEdit ? "✓ Save changes" : "✓ Create this chapter",
    deleteChapter: "🗑️ Delete this chapter",
    // DetailTrade
    tradeBack: "← Back",
    tradeTech: "🔧 Technical",
    tradeDiscipline: "🌿 Discipline",
    tradePsycho: "🧠 Psychology",
    tradeScreenshots: "📸 Screenshots",
    screenshotHint: "Drag and drop your screenshots here",
    screenshotSub: "Entry · Exit · HTF Context",
    backToJournal: "← Back to journal",
    planRespected: "✓ Plan respected",
    planPartial: "~ Partial",
    planNotRespected: "✗ Not respected",
    labelActif: "Asset", labelDirection: "Direction", labelSetup: "Setup",
    labelTaille: "Size", labelPnl: "P&L", labelRR: "R:R",
    labelDuree: "Duration", labelRespect: "Plan respect", labelViolated: "Violated rule",
    labelNotesTech: "Technical notes", labelPrayer: "Prayer", labelBedtime: "Bedtime",
    labelSleep: "Sleep", labelScreens: "Screens before bed", labelSleepQuality: "Sleep quality",
    labelDiet: "Diet", labelImpulsive: "Impulsiveness",
    labelEmotionBefore: "Emotion before", labelEmotionDuring: "Emotion during",
    labelGlobalNote: "Overall rating", labelLesson: "📝 Lesson learned",
    impulsiveYes: "⚡ Yes", impulsiveNo: "✓ No",
    prayerYes: "✓ Yes", prayerNo: "✗ No",
    screensYes: "⚠️ Yes", screensNo: "✓ No",
    contract: (n) => `${n} contract${n > 1 ? "s" : ""}`,
    lotLabel: (n) => `${n} lot${n > 1 ? "s" : ""}`,
    // General
    yes: "Yes", no: "No", partial: "Partial", long: "LONG", short: "SHORT",
    loading: "Loading...", loadingData: "Loading your data...",
    loginTitle: "Your intelligent trading journal",
    loginBtn: "Continue with Google",
    loginFooter: "Your data is securely saved\nin the cloud and accessible from any device.",
  },
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













  { id: 28, date: "2026-05-28", heure: "14:30", duree: 20, compte: "Tradeify Challenge $50K", actif: "Nasdaq", direction: "LONG", setup: "Pullback", taille: 3, pnl: -115, rr: 1.0, respect: "Partiel", regle_violee: "Stop trop serré", notes_tech: "Trade Pullback sur Nasdaq, contexte long.", priere: false, heure_coucher: "00:15", sommeil: 7.1, ecrans: false, qualite_sommeil: 4, alimentation: "Mauvaise", discipline: 3, impulsif: true, emotion_avant: "En FOMO", emotion_pendant: "Serein", lecon: "Rester discipline sur l'execution.", note: 1, joursPayoutValide: false },
  { id: 28, date: "2026-05-28", heure: "14:30", duree: 20, compte: "Tradeify Challenge $50K", actif: "Nasdaq", direction: "LONG", setup: "Pullback", taille: 3, pnl: -115, rr: 1.0, respect: "Partiel", regle_violee: "Stop trop serré", notes_tech: "Trade Pullback sur Nasdaq, contexte long.", priere: false, heure_coucher: "00:15", sommeil: 7.1, ecrans: false, qualite_sommeil: 4, alimentation: "Mauvaise", discipline: 3, impulsif: true, emotion_avant: "En FOMO", emotion_pendant: "Serein", lecon: "Rester discipline sur l'execution.", note: 1, joursPayoutValide: false },
  { id: 29, date: "2026-05-29", heure: "10:30", duree: 90, compte: "Topstep Express Funded $50K", actif: "Nasdaq", direction: "LONG", setup: "Pullback", taille: 2, pnl: 103, rr: 2.0, respect: "Oui", regle_violee: "", notes_tech: "Trade Pullback sur Nasdaq, contexte long.", priere: false, heure_coucher: "00:30", sommeil: 7.8, ecrans: true, qualite_sommeil: 4, alimentation: "Saine", discipline: 2, impulsif: false, emotion_avant: "Euphorique", emotion_pendant: "Impatient", lecon: "Bonne execution, respecter le plan.", note: 4, joursPayoutValide: false },
  { id: 30, date: "2026-05-30", heure: "09:30", duree: 8, compte: "Tradeify Challenge $50K", actif: "Nasdaq", direction: "LONG", setup: "Range", taille: 3, pnl: 36, rr: 2.1, respect: "Non", regle_violee: "Entrée sans confirmation", notes_tech: "Trade Range sur Nasdaq, contexte long.", priere: true, heure_coucher: "01:30", sommeil: 8.2, ecrans: false, qualite_sommeil: 5, alimentation: "Saine", discipline: 3, impulsif: true, emotion_avant: "En FOMO", emotion_pendant: "Euphorique", lecon: "Bonne execution, respecter le plan.", note: 3, joursPayoutValide: false },
];

// ─── CATALOGUE PROP FIRMS ─────────────────────────────────────────────────────
const PROP_FIRMS_CATALOG = {
  Topstep: {
    nom: "Topstep", couleur: "#00d4ff", emoji: "🏦", logo: "/firms/topstep.png", siteUrl: "https://www.topstep.com", reglesUrl: "https://support.topstep.com/hc/en-us/categories/4408836624791-Rules-Policies", discordUrl: "https://discord.com/invite/topstep",
    description: "Futures prop firm · XFA",
    typesCompte: [
      { id: "combine", label: "Trading Combine", desc: "Évaluation", couleurBadge: "#f59e0b", payoutRegles: { type: "profit_target", montants: { 50000: 3000, 100000: 6000, 150000: 9000 }, label: "Atteindre le profit target pour passer en XFA" } },
      { id: "xfa", label: "Express Funded", desc: "Financé (XFA)", couleurBadge: "#00e5a0", payoutRegles: { type: "jours_gagnants", nombre: 5, minParJour: 150, label: "5 jours gagnants à +$150 min (non consécutifs)" } },
      { id: "live", label: "Live Funded", desc: "Compte live", couleurBadge: "#00d4ff", payoutRegles: { type: "libre", label: "Payout hebdomadaire — aucun jour minimum requis" } },
    ],
    reglesFondamentales: [
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
    nom: "Phidias", couleur: "#f59e0b", emoji: "🏦", logo: "/firms/phidias.png", siteUrl: "https://phidiaspropfirm.com", reglesUrl: "https://phidiaspropfirm.com/rules", discordUrl: null,
    description: "Express to Live",
    tailles: [10000, 25000, 50000, 100000, 200000],
    typesCompte: [
      { id: "eval", label: "Évaluation E2L", desc: "Express to Live", couleurBadge: "#f59e0b", payoutRegles: { type: "profit_target", montant: 1500, label: "Atteindre +$1 500 de profit (zéro jour minimum)" } },
      { id: "cash", label: "Compte Cash", desc: "Financé (sim)", couleurBadge: "#00e5a0", payoutRegles: { type: "libre", label: "Premier payout = switch automatique vers le compte Live" } },
      { id: "live", label: "Compte Live", desc: "Live chez Dorman", couleurBadge: "#a78bfa", payoutRegles: { type: "libre", label: "Payout libre — split 80/20" } },
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
    nom: "Apex Trader Funding", couleur: "#a78bfa", emoji: "⚡", logo: "/firms/apex.png", siteUrl: "https://apextraderfunding.com", reglesUrl: "https://apextraderfunding.com/help-center", discordUrl: "https://discord.com/invite/apextraderfunding",
    description: "EOD Evaluation",
    tailles: [25000, 50000, 75000, 100000, 150000, 250000, 300000],
    typesCompte: [
      { id: "eval", label: "EOD Evaluation", desc: "Évaluation", couleurBadge: "#f59e0b", payoutRegles: { type: "profit_target", montants: { 25000: 1500, 50000: 2500, 75000: 2750, 100000: 3000, 150000: 5000, 250000: 6500, 300000: 7500 }, label: "Atteindre le profit target EOD pour passer en PA" } },
      { id: "pa", label: "Performance Account", desc: "Financé (PA)", couleurBadge: "#00e5a0", payoutRegles: { type: "jours_gagnants", nombre: 10, minParJour: 0, label: "10 jours de trading minimum — pas de montant minimum par jour" } },
      { id: "live", label: "Live Prop", desc: "Compte live réel", couleurBadge: "#a78bfa", payoutRegles: { type: "libre", label: "Payout libre sur le compte live" } },
    ],
    reglesFondamentales: [
      { titre: "Toucher le trailing drawdown EOD", consequence: "Compte fermé définitivement", detail: "Si le solde EOD touche le seuil trailing, fermeture immédiate du PA. Sur évaluation, fail instantané." },
      { titre: "Position ouverte à 16h59:59 ET", consequence: "Liquidation automatique", detail: "Apex ferme automatiquement toutes les positions à 16h59:59 ET. Si ça arrive trop souvent = risque de bannissement." },
      { titre: "Hedging entre comptes", consequence: "Bannissement permanent", detail: "Hedger ses propres comptes Apex entre eux = fermeture de tous les comptes, sans remboursement." },
      { titre: "Dépasser la taille du tier actuel", consequence: "Ordre rejeté automatiquement", detail: "Le PA commence au Tier 1 (2 contrats sur 50K). Dépasser la limite = ordre rejeté systématiquement." },




























































































      { titre: "Violation des règles horaires", consequence: "Violation / compte fermé", detail: "Positions overnight, trading week-end ou après fermeture = violation critique selon la firm." },
    ],
    regles: [
      { cat: "📝 Info", titre: "Règles personnalisées", desc: "Renseigne les règles de ta prop firm dans la section Règles.", critique: false },
    ]
  },
  Tradeify: {
    nom: "Tradeify", couleur: "#f97316", emoji: "🔥", logo: "/firms/tradeify.png", siteUrl: "https://tradeify.co", reglesUrl: "https://tradeify.co/rules", discordUrl: null,
    description: "Futures · Challenge & Funded",
    tailles: [25000, 50000, 100000, 150000],
    typesCompte: [
      { id: "challenge", label: "Challenge", desc: "Évaluation", couleurBadge: "#f59e0b", payoutRegles: { type: "profit_target", montants: { 25000: 1500, 50000: 3000, 100000: 6000, 150000: 9000 }, label: "Atteindre le profit target pour passer en Funded" } },
      { id: "funded", label: "Funded Account", desc: "Compte financé", couleurBadge: "#00e5a0", payoutRegles: { type: "jours_trading", nombre: 10, label: "10 jours de trading minimum avant le premier payout" } },
    ],
    reglesFondamentales: [
      { titre: "Trailing Drawdown", consequence: "Compte fermé", detail: "Le drawdown trail le solde le plus haut atteint. Ne pas toucher le seuil." },
    ],
    regles: [
      { cat: "📉 Drawdown", titre: "Trailing Max Drawdown", desc: "Trail le solde le plus haut. Violation = compte fermé.", critique: true },
      { cat: "💰 Payout", titre: "Payouts hebdomadaires", desc: "Premier payout après 10 jours de trading. Ensuite hebdomadaire.", critique: false },
      { cat: "📝 Info", titre: "Règles personnalisées", desc: "Renseigne les règles spécifiques dans la section Règles.", critique: false },
    ]
  },
  MyFundedFutures: {
    nom: "MyFundedFutures", couleur: "#06b6d4", emoji: "🌊", logo: "/firms/myfundedfutures.png", siteUrl: "https://myfundedfutures.com", reglesUrl: "https://myfundedfutures.com/rules", discordUrl: null,
    description: "Futures · Sim & Live",
    tailles: [50000, 100000, 150000, 200000],
    typesCompte: [
      { id: "eval", label: "Evaluation", desc: "Phase d'évaluation", couleurBadge: "#f59e0b", payoutRegles: { type: "profit_target", montants: { 50000: 3000, 100000: 6000, 150000: 9000, 200000: 12000 }, label: "Atteindre le profit target pour passer en Funded" } },
      { id: "funded", label: "Funded (Sim)", desc: "Compte financé sim", couleurBadge: "#00e5a0", payoutRegles: { type: "jours_trading", nombre: 10, label: "10 jours de trading minimum avant le premier payout" } },
      { id: "live", label: "Live Account", desc: "Compte live réel", couleurBadge: "#06b6d4", payoutRegles: { type: "libre", label: "Payout libre sur le compte live" } },
    ],
    reglesFondamentales: [
      { titre: "Max Daily Loss", consequence: "Compte bloqué", detail: "Perte journalière max à ne pas dépasser. Reset quotidien." },
      { titre: "Max Trailing Drawdown", consequence: "Compte fermé", detail: "Drawdown trail le solde le plus haut. Violation = fermeture définitive." },
    ],
    regles: [
      { cat: "📉 Drawdown", titre: "Trailing Drawdown", desc: "Trail le solde le plus haut intraday. Violation = fermeture.", critique: true },
      { cat: "💰 Payout", titre: "Payout après 10 jours", desc: "10 jours de trading minimum, puis demande de payout disponible.", critique: false },
      { cat: "📝 Info", titre: "Règles personnalisées", desc: "Renseigne les règles spécifiques dans la section Règles.", critique: false },
    ]
  },
  Bulenox: {
    nom: "Bulenox", couleur: "#8b5cf6", emoji: "🐂", logo: "/firms/bulenox.png", siteUrl: "https://bulenox.com", reglesUrl: "https://bulenox.com/rules", discordUrl: null,
    description: "Futures · Evaluation & Funded",
    tailles: [10000, 25000, 50000, 100000, 150000, 200000],
    typesCompte: [
      { id: "eval", label: "Evaluation", desc: "Phase d'évaluation", couleurBadge: "#f59e0b", payoutRegles: { type: "profit_target", montants: { 10000: 1000, 25000: 2500, 50000: 5000, 100000: 10000, 150000: 15000, 200000: 20000 }, label: "Atteindre le profit target pour passer en Funded" } },
      { id: "funded", label: "Funded", desc: "Compte financé", couleurBadge: "#8b5cf6", payoutRegles: { type: "profit_target", montant: 500, label: "Profit minimum de $500 avant de demander un payout" } },
    ],
    reglesFondamentales: [
      { titre: "Daily Loss Limit", consequence: "Compte bloqué", detail: "Perte journalière max à ne pas dépasser." },
      { titre: "Max Trailing Drawdown", consequence: "Compte fermé", detail: "Drawdown trail le solde EOD. Violation = fermeture." },
    ],
    regles: [
      { cat: "📉 Drawdown", titre: "EOD Trailing Drawdown", desc: "Trail le solde EOD (fin de journée). Pas intraday.", critique: true },
      { cat: "💰 Payout", titre: "Premier payout à +$500", desc: "Profit minimum de $500 avant le premier retrait.", critique: false },
      { cat: "📝 Info", titre: "Règles personnalisées", desc: "Renseigne les règles spécifiques dans la section Règles.", critique: false },
    ]
  },
  Earn2Trade: {
    nom: "Earn2Trade", couleur: "#10b981", emoji: "📈", logo: "/firms/earn2trade.png", siteUrl: "https://earn2trade.com", reglesUrl: "https://earn2trade.com/gauntlet-rules", discordUrl: null,
    description: "Futures · Gauntlet Mini & Pro",
    tailles: [25000, 50000, 100000, 150000, 200000],
    typesCompte: [
      { id: "gauntlet_mini", label: "Gauntlet Mini™", desc: "Évaluation rapide", couleurBadge: "#f59e0b", payoutRegles: { type: "profit_target", montants: { 50000: 3000, 100000: 6000, 150000: 9000, 200000: 11000 }, label: "Atteindre le profit target pour passer en Funded" } },
      { id: "gauntlet", label: "Gauntlet™", desc: "Évaluation complète", couleurBadge: "#10b981", payoutRegles: { type: "profit_target", montants: { 25000: 1750, 50000: 3000, 100000: 6000 }, label: "Atteindre le profit target + nombre de jours min" } },
      { id: "funded", label: "Funded (Vera)", desc: "Compte financé via Vera Trading", couleurBadge: "#00e5a0", payoutRegles: { type: "libre", label: "Payout libre via Vera Trading — split 80/20" } },
    ],
    reglesFondamentales: [
      { titre: "Daily Loss Limit", consequence: "Journée terminée", detail: "Dépasser le DLL = fin de journée de trading automatique." },
      { titre: "Max Trailing Drawdown", consequence: "Évaluation échouée", detail: "Le trailing drawdown est calculé EOD sur le Gauntlet." },
    ],
    regles: [
      { cat: "📉 Drawdown", titre: "Trailing Drawdown EOD", desc: "Calculé en fin de journée. Gauntlet Mini = intraday.", critique: true },
      { cat: "🎯 Objectif", titre: "Profit target requis", desc: "Atteindre l'objectif de profit avant d'être éligible au funded.", critique: false },
      { cat: "💰 Payout", titre: "Payout via Vera Trading", desc: "Compte live géré par Vera Trading. Split 80/20.", critique: false },
    ]
  },
  TradeDay: {
    nom: "TradeDay", couleur: "#ec4899", emoji: "📅", logo: "/firms/tradeday.png", siteUrl: "https://tradeday.com", reglesUrl: "https://tradeday.com/rules", discordUrl: null,
    description: "Futures · Simple & Transparent",
    tailles: [10000, 25000, 50000, 100000, 150000, 200000],
    typesCompte: [
      { id: "eval", label: "Evaluation", desc: "Phase d'évaluation", couleurBadge: "#f59e0b", payoutRegles: { type: "profit_target", montants: { 50000: 3000, 100000: 6000, 150000: 9000 }, label: "Atteindre le profit target pour passer en Funded" } },
      { id: "funded", label: "Funded", desc: "Compte financé", couleurBadge: "#ec4899", payoutRegles: { type: "jours_gagnants", nombre: 10, minParJour: 0, label: "10 jours gagnants minimum avant le premier payout" } },
    ],
    reglesFondamentales: [
      { titre: "Daily Loss Limit", consequence: "Compte bloqué", detail: "Perte journalière max. Reset chaque jour à minuit CT." },
      { titre: "Max Drawdown", consequence: "Compte fermé", detail: "Ne pas dépasser le drawdown maximum absolu." },
    ],
    regles: [
      { cat: "📉 Drawdown", titre: "Max Drawdown statique", desc: "Drawdown fixe, ne trail pas. Simple et transparent.", critique: true },
      { cat: "💰 Payout", titre: "Payout après 10 jours gagnants", desc: "10 jours de trading gagnants pour le premier payout.", critique: false },
      { cat: "📝 Info", titre: "Règles personnalisées", desc: "Renseigne les règles spécifiques dans la section Règles.", critique: false },
    ]
  },
  EliteTrader: {
    nom: "Elite Trader Funding", couleur: "#f59e0b", emoji: "👑", logo: "/firms/elitetrader.png", siteUrl: "https://elitetraderfunding.com", reglesUrl: "https://elitetraderfunding.com/rules", discordUrl: null,
    description: "Futures · EOD Drawdown",
    tailles: [50000, 100000, 150000, 200000, 300000],
    typesCompte: [
      { id: "eval", label: "Evaluation", desc: "Phase d'évaluation", couleurBadge: "#f59e0b", payoutRegles: { type: "profit_target", montants: { 50000: 3000, 100000: 6000, 150000: 9000, 200000: 12000, 300000: 18000 }, label: "Atteindre le profit target EOD pour passer en PA" } },
      { id: "pa", label: "Performance Account", desc: "Compte financé", couleurBadge: "#00e5a0", payoutRegles: { type: "jours_gagnants", nombre: 10, minParJour: 0, label: "10 jours de trading minimum — EOD trailing drawdown verrouillé à $0 après 1er payout" } },
    ],
    reglesFondamentales: [
      { titre: "EOD Trailing Drawdown", consequence: "Compte fermé", detail: "Trail EOD. Verrouille à $0 après premier payout comme Apex." },
    ],
    regles: [
      { cat: "📉 Drawdown", titre: "EOD Trailing Drawdown", desc: "Trail le solde EOD. Verrouille à $0 après premier payout.", critique: true },
      { cat: "💰 Payout", titre: "Premier payout → drawdown verrouillé", desc: "Comme Apex, le drawdown se fige à $0 après le premier retrait.", critique: false },
    ]
  },
  TakeProfitTrader: {
    nom: "Take Profit Trader", couleur: "#34d399", emoji: "💰", logo: "/firms/takeprofittrader.png", siteUrl: "https://takeprofittrader.com", reglesUrl: "https://takeprofittrader.com/rules", discordUrl: null,
    description: "Futures · Flexible Rules",
    tailles: [25000, 50000, 100000, 150000],
    typesCompte: [
      { id: "eval", label: "Evaluation", desc: "Phase d'évaluation", couleurBadge: "#f59e0b", payoutRegles: { type: "profit_target", montants: { 25000: 1500, 50000: 3000, 100000: 6000, 150000: 9000 }, label: "Atteindre le profit target pour passer en Funded" } },
      { id: "funded", label: "Funded", desc: "Compte financé", couleurBadge: "#34d399", payoutRegles: { type: "libre", label: "Payout hebdomadaire — aucun jour minimum requis" } },
    ],
    reglesFondamentales: [
      { titre: "Daily Loss Limit", consequence: "Journée terminée", detail: "DLL strict. Trading suspendu pour la journée si atteint." },
    ],
    regles: [
      { cat: "📉 Drawdown", titre: "Trailing Drawdown", desc: "Trail intraday. Violation = compte fermé.", critique: true },
      { cat: "💰 Payout", titre: "Payout hebdomadaire", desc: "Demande de payout disponible chaque semaine.", critique: false },
    ]
  },
  Funded4Traders: {
    nom: "Funded4Traders", couleur: "#6366f1", emoji: "🎯", logo: "/firms/funded4traders.png", siteUrl: "https://funded4traders.com", reglesUrl: "https://funded4traders.com/rules", discordUrl: null,
    description: "Futures · Multi-step eval",
    tailles: [25000, 50000, 100000, 200000],
    typesCompte: [
      { id: "eval_1", label: "Step 1", desc: "Première évaluation", couleurBadge: "#f59e0b", payoutRegles: { type: "profit_target", montants: { 25000: 2000, 50000: 4000, 100000: 8000, 200000: 16000 }, label: "Atteindre le profit target Step 1" } },
      { id: "eval_2", label: "Step 2", desc: "Deuxième évaluation", couleurBadge: "#f97316", payoutRegles: { type: "profit_target", montants: { 25000: 1250, 50000: 2500, 100000: 5000, 200000: 10000 }, label: "Atteindre le profit target Step 2 pour passer en Funded" } },
      { id: "funded", label: "Funded", desc: "Compte financé", couleurBadge: "#6366f1", payoutRegles: { type: "libre", label: "Payout libre — aucun jour minimum requis" } },
    ],
    reglesFondamentales: [
      { titre: "Max Daily Loss", consequence: "Journée bloquée", detail: "Perte journalière max. Reset quotidien." },
    ],
    regles: [
      { cat: "📉 Drawdown", titre: "Max Trailing Drawdown", desc: "Trail intraday sur funded. Violation = fermeture.", critique: true },
      { cat: "📝 Info", titre: "Règles personnalisées", desc: "Renseigne les règles spécifiques dans la section Règles.", critique: false },
    ]
  },
  Autre: {
    nom: "Autre", couleur: "#818cf8", emoji: "🏦", siteUrl: null, reglesUrl: null, discordUrl: null,
    description: "Prop firm personnalisée",
    tailles: [10000, 25000, 50000, 100000, 150000, 200000],
    typesCompte: [
      { id: "eval", label: "Évaluation", desc: "Phase d'évaluation", couleurBadge: "#f59e0b", payoutRegles: { type: "profit_target", montantPct: 0.06, label: "Atteindre le profit target de l'évaluation (estimé à 6%)" } },
      { id: "funded", label: "Financé", desc: "Compte financé", couleurBadge: "#818cf8", payoutRegles: { type: "libre", label: "Règles de payout personnalisées" } },
      { id: "live", label: "Live", desc: "Compte live", couleurBadge: "#00e5a0", payoutRegles: { type: "libre", label: "Payout libre sur compte live" } },
    ],
    reglesFondamentales: [],
    regles: [{ cat: "📝 Info", titre: "Règles personnalisées", desc: "Renseigne les règles de ta prop firm dans la section Règles.", critique: false }]
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

const PAYS_FISCAL = {
  FR: {
    nom: "France", label: "France", deviseFiscale: "EUR", flag: "🇫🇷", drapeau: "🇫🇷",
    structures: [
      { id: "sasu", label: "SASU / SAS", emoji: "🏢", tauxDefaut: 25, taux: 25, note: "IS 25% — ACRE n'impacte pas l'impôt sur les bénéfices" },
      { id: "eurl", label: "EURL / SARL", emoji: "🏬", tauxDefaut: 25, taux: 25, note: "IS 25% — ACRE n'impacte pas l'impôt sur les bénéfices" },
      { id: "micro_bnc", label: "Micro-BNC", emoji: "📋", tauxDefaut: 22, taux: 22, note: "Bénéfices Non Commerciaux — cotisations ~22%", acre: { taux1: 0, taux2: 50, mois: 12 } },
      { id: "ei", label: "EI / Auto-entrepreneur", emoji: "🧑‍💼", tauxDefaut: 22, taux: 22, note: "Entreprise individuelle — charges sociales ~22%", acre: { taux1: 0, taux2: 50, mois: 12 } },
      { id: "pf", label: "Personne physique (IR)", emoji: "👤", tauxDefaut: 30, taux: 30, note: "Imposition sur le revenu — TMI 30% (indicatif)", ir: true },
    ],
  },
  BE: {
    nom: "Belgique", label: "Belgique", deviseFiscale: "EUR", flag: "🇧🇪", drapeau: "🇧🇪",
    structures: [
      { id: "sa", label: "SA / SPRL", emoji: "🏢", tauxDefaut: 25, taux: 25, note: "Société anonyme — IS 25%" },
      { id: "pf", label: "Personne physique", emoji: "👤", tauxDefaut: 50, taux: 50, note: "IR — tranche max ~50%", ir: true },
    ],
  },
  CH: {
    nom: "Suisse", label: "Suisse", deviseFiscale: "CHF", flag: "🇨🇭", drapeau: "🇨🇭",
    structures: [
      { id: "sa", label: "SA", emoji: "🏢", tauxDefaut: 20, taux: 20, note: "Société anonyme — IS ~20% (varie par canton)" },
      { id: "sarl", label: "Sàrl", emoji: "🏬", tauxDefaut: 20, taux: 20, note: "Société à responsabilité limitée" },
      { id: "pf", label: "Personne physique", emoji: "👤", tauxDefaut: 35, taux: 35, note: "IR — varie par canton, ~35% indicatif", ir: true },
    ],
  },
  LU: {
    nom: "Luxembourg", label: "Luxembourg", deviseFiscale: "EUR", flag: "🇱🇺", drapeau: "🇱🇺",
    structures: [
      { id: "sa", label: "SA", emoji: "🏢", tauxDefaut: 17, taux: 17, note: "Société anonyme — IS 17%" },
      { id: "sarl", label: "Sàrl", emoji: "🏬", tauxDefaut: 17, taux: 17, note: "Société à responsabilité limitée" },
      { id: "pf", label: "Personne physique", emoji: "👤", tauxDefaut: 42, taux: 42, note: "IR — tranche max 42%", ir: true },
    ],
  },
  UK: {
    nom: "Royaume-Uni", label: "Royaume-Uni", deviseFiscale: "GBP", flag: "🇬🇧", drapeau: "🇬🇧",
    structures: [
      { id: "ltd", label: "Ltd (IS)", emoji: "🏢", tauxDefaut: 25, taux: 25, note: "Limited company — Corporation Tax 25%" },
      { id: "pf", label: "Self-employed", emoji: "👤", tauxDefaut: 40, taux: 40, note: "IR — tranche haute ~40%", ir: true },
    ],
  },
  US: {
    nom: "États-Unis", label: "États-Unis", deviseFiscale: "USD", flag: "🇺🇸", drapeau: "🇺🇸",
    structures: [
      { id: "llc", label: "LLC", emoji: "🏢", tauxDefaut: 21, taux: 21, note: "Federal corporate tax rate 21%" },
      { id: "pf", label: "Self-employed", emoji: "👤", tauxDefaut: 37, taux: 37, note: "IR — top marginal rate 37%", ir: true },
    ],
  },
  CA: {
    nom: "Canada", label: "Canada", deviseFiscale: "CAD", flag: "🇨🇦", drapeau: "🇨🇦",
    structures: [
      { id: "corp", label: "Corporation", emoji: "🏢", tauxDefaut: 15, taux: 15, note: "Federal corporate tax 15%" },
      { id: "pf", label: "Particulier", emoji: "👤", tauxDefaut: 33, taux: 33, note: "IR fédéral — tranche max 33%", ir: true },
    ],
  },
  AU: {
    nom: "Australie", label: "Australie", deviseFiscale: "AUD", flag: "🇦🇺", drapeau: "🇦🇺",
    structures: [
      { id: "pty", label: "Pty Ltd", emoji: "🏢", tauxDefaut: 30, taux: 30, note: "Proprietary Limited — IS 30%" },
      { id: "pf", label: "Particulier", emoji: "👤", tauxDefaut: 45, taux: 45, note: "IR — tranche max 45%", ir: true },
    ],
  },
};

const initialObjectifs = [];
const initialReglesPerso = [];
const initialChapitres = [];

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
  CAD: 1.36,
  AUD: 1.53,
  USDT: 1,
  BTC: 0.000011,
};



















// Mini courbe P&L SVG inline
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
  const finAcre = new Date(debut);
  finAcre.setMonth(finAcre.getMonth() + 12);
  if (aujourdhui > finAcre) return null;
  return structureData.acre;
}

function moisEntre(debut, fin) {
  const [dy, dm] = debut.split("-").map(Number);
  const [fy, fm] = fin.split("-").map(Number);
  return fm - dm + (fy - dy) * 12;
}

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
function DetailTrade({ trade, onBack, onEdit, lang = "fr" }) {
  const T = TR[lang]; const fr = lang === "fr";
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

// Topstep : Trailing Drawdown — le MLL (Max Loss Level) remonte avec les gains jusqu'à se verrouiller à 0
function getMLL(solde) {
  const drawdown = 2000; // seuil Topstep standard $50K
  // le MLL suit le solde à la hausse mais ne descend jamais sous 0 (verrouillé quand on est profitable)
  return Math.min(0, solde - drawdown);
}

// Couleur selon la marge de drawdown restante
function getDrawdownColor(marge) {
  if (marge <= 200) return COLORS.red;
  if (marge <= 600) return COLORS.amber;
  return COLORS.green;
}

// Lots autorisés par Topstep selon le solde courant
function getLotsTopstep(solde) {
  if (solde < -1500) return { lots: 0, label: "Suspendu ⛔" };
  if (solde < 0)     return { lots: 3, label: "3 contrats" };
  if (solde < 5000)  return { lots: 5, label: "5 contrats" };
  if (solde < 10000) return { lots: 10, label: "10 contrats" };
  return { lots: 15, label: "15 contrats" };
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
function PnlCurve({ trades, height = 180, positive, onTradeClick }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [containerW, setContainerW] = useState(600);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      setContainerW(entries[0].contentRect.width || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  if (trades.length < 1) return null;

  const rawCumul = [];
  let sum = 0;
  trades.forEach(t => { sum += t.pnl; rawCumul.push(sum); });
  // Toujours commencer à 0 pour avoir une courbe même avec 1 trade
  const cumul = [0, ...rawCumul];
  const tradesWithStart = [null, ...trades]; // null = point de départ virtuel

  const PAD_L = 52, PAD_R = 16, PAD_T = 12, PAD_B = 28;
  const W = containerW, H = height;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const absMax = Math.max(Math.abs(Math.min(0, ...cumul)), Math.abs(Math.max(0, ...cumul)), 1);
  const minVal = -absMax, maxVal = absMax, range = maxVal - minVal;

  const pts = cumul.map((v, i) => [
    PAD_L + (i / (cumul.length - 1)) * chartW,
    PAD_T + (1 - (v - minVal) / range) * chartH,
  ]);
  const zeroY = PAD_T + (1 - (0 - minVal) / range) * chartH;
  const linePath = `M ${pts.map(([x,y]) => `${x},${y}`).join(" L ")}`;
  const fillPath = `${linePath} L ${pts[pts.length-1][0]},${zeroY} L ${pts[0][0]},${zeroY} Z`;

  const yTicks = 4, yStep = range / yTicks;
  const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => {
    const val = minVal + i * yStep;
    return { val: Math.round(val), y: PAD_T + (1 - (val - minVal) / range) * chartH };
  });

  const realCount = rawCumul.length;
  const xTickCount = Math.min(5, realCount);
  const xLabels = Array.from({ length: xTickCount }, (_, i) => {
    const realIdx = Math.round(i * (realCount - 1) / Math.max(1, xTickCount - 1));
    const ptsIdx = realIdx + 1; // +1 car cumul commence à 0
    return { label: `#${realIdx + 1}`, x: PAD_L + (ptsIdx / (cumul.length - 1)) * chartW };
  });

  const GREEN = "#22c55e", RED = "#ef4444";
  const hovTrade = hoverIdx !== null ? tradesWithStart[hoverIdx] : null;
  const hovCumul = hoverIdx !== null ? cumul[hoverIdx] : null;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }} onMouseMove={handleMouseMove}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", height: H }}>
        <defs>
          <clipPath id="clipPosI">
            <rect x={PAD_L} y={PAD_T} width={chartW} height={Math.max(0, zeroY - PAD_T)} />
          </clipPath>
          <clipPath id="clipNegI">
            <rect x={PAD_L} y={zeroY} width={chartW} height={Math.max(0, PAD_T + chartH - zeroY)} />
          </clipPath>
          <linearGradient id="fillPosI" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GREEN} stopOpacity="0.18" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="fillNegI" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={RED} stopOpacity="0.02" />
            <stop offset="100%" stopColor={RED} stopOpacity="0.18" />
          </linearGradient>
        </defs>
        {yLabels.map((t, i) => (
          <g key={i}>
            <line x1={PAD_L} y1={t.y} x2={W - PAD_R} y2={t.y} stroke="#1e2d45" strokeWidth="1" />
            <text x={PAD_L - 6} y={t.y + 4} textAnchor="end" fontSize="9" fill="#4b5e7a">{t.val >= 0 ? "+" : ""}{t.val}$</text>
          </g>
        ))}
        <line x1={PAD_L} y1={zeroY} x2={W - PAD_R} y2={zeroY} stroke="#4b5e7a" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.7" />
        <path d={fillPath} fill="url(#fillPosI)" clipPath="url(#clipPosI)" />
        <path d={fillPath} fill="url(#fillNegI)" clipPath="url(#clipNegI)" />
        <path d={linePath} fill="none" stroke={GREEN} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#clipPosI)" />
        <path d={linePath} fill="none" stroke={RED} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#clipNegI)" />
        {xLabels.map((t, i) => (
          <text key={i} x={t.x} y={H - 4} textAnchor="middle" fontSize="9" fill="#4b5e7a">{t.label}</text>
        ))}
        {hoverIdx !== null && (
          <g>
            <line x1={pts[hoverIdx][0]} y1={PAD_T} x2={pts[hoverIdx][0]} y2={PAD_T + chartH} stroke="#ffffff18" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx={pts[hoverIdx][0]} cy={pts[hoverIdx][1]} r={5} fill={cumul[hoverIdx] >= 0 ? GREEN : RED} stroke="#06060f" strokeWidth="2" />
          </g>
        )}
        {pts.map((pt, i) => (
          <circle key={i} cx={pt[0]} cy={pt[1]} r={8} fill="transparent" style={{ cursor: i > 0 ? "pointer" : "default" }}
            onMouseEnter={() => i > 0 && setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}
            onClick={() => i > 0 && onTradeClick && onTradeClick(tradesWithStart[i])} />
        ))}
      </svg>

      {/* Tooltip */}
      {hovTrade && (
        <div style={{
          position: "absolute",
          left: mousePos.x + 14,
          top: Math.max(0, mousePos.y - 60),
          background: "#0e0e1a",
          border: `1px solid ${hovTrade.pnl >= 0 ? "#22c55e40" : "#ef444440"}`,
          borderRadius: 10,
          padding: "10px 14px",
          pointerEvents: "none",
          zIndex: 100,
          minWidth: 160,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>
          <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>Trade #{hoverIdx + 1} · {hovTrade.date}</div>
          <div style={{ fontSize: 16, fontWeight: 900, fontFamily: "monospace", color: hovTrade.pnl >= 0 ? "#22c55e" : "#ef4444", marginBottom: 4 }}>
            {hovTrade.pnl >= 0 ? "+" : ""}{hovTrade.pnl.toFixed(0)}$
          </div>
          {hovTrade.compte && <div style={{ fontSize: 10, color: "#888" }}>📂 {hovTrade.compte}</div>}
          {hovTrade.setup && <div style={{ fontSize: 10, color: "#888" }}>⚡ {hovTrade.setup}</div>}
          {hovTrade.note && <div style={{ fontSize: 10, color: "#888" }}>⭐ {hovTrade.note}/5</div>}
          <div style={{ fontSize: 10, color: "#555", marginTop: 6, fontStyle: "italic" }}>Clique pour voir le trade</div>
          <div style={{ marginTop: 6, fontSize: 10, color: "#444" }}>Cumul : {hovCumul >= 0 ? "+" : ""}{Math.round(hovCumul)}$</div>
        </div>
      )}
    </div>
  );
}

function EquityCurve({ trades }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  if (!trades || trades.length < 2) return null;
  const sorted = [...trades].sort((a, b) => {
    const da = new Date(`${a.date}T${a.heure || "00:00"}`);
    const db = new Date(`${b.date}T${b.heure || "00:00"}`);
    return da - db;
  });

  const cumul = [];
  let sum = 0;
  sorted.forEach(t => { sum += t.pnl; cumul.push(sum); });

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
  const lineColor = lastVal >= 0 ? "#34d399" : "#f87171";
  const linePath = smoothPath(pts);
  const fillPath = `${linePath} L ${pts[pts.length - 1][0]},${zeroY} L ${pts[0][0]},${zeroY} Z`;

  const yTicks = [...new Set([min, 0, max])].sort((a, b) => a - b);

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
        {yTicks.map((v, i) => {
          const y = yAt(v);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#1e2d45" strokeWidth="0.8" />
              <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="8" fill="#4b5e7a">{v >= 0 ? "+" : ""}{Math.round(v)}$</text>
            </g>
          );
        })}
        <line x1={padL} y1={zeroY} x2={W - padR} y2={zeroY} stroke="#4b5e7a" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.6" />
        <path d={fillPath} fill="url(#equityGrad)" opacity="0.8" />
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {xTicks.map((idx, i) => (
          <text key={i} x={xAt(idx)} y={H - padB + 12} textAnchor="middle" fontSize="8" fill="#4b5e7a">#{idx + 1}</text>
        ))}
        {hoverIdx !== null && (
          <circle cx={pts[hoverIdx][0]} cy={pts[hoverIdx][1]} r={3.5} fill={lineColor} />
        )}
        {pts.map((pt, i) => (
          <rect key={i} x={i === 0 ? padL : (pts[i-1][0] + pt[0]) / 2} y={padT}
            width={i === 0 ? (pts.length > 1 ? (pts[1][0] + pt[0]) / 2 - padL : plotW) : (i === pts.length - 1 ? W - padR - (pts[i-1][0] + pt[0]) / 2 : (pts[Math.min(i+1, pts.length-1)][0] - pts[Math.max(i-1, 0)][0]) / 2)}
            height={plotH} fill="transparent" style={{ cursor: "pointer" }}
            onMouseEnter={() => setHoverIdx(i)} />
        ))}
      </svg>
    </div>
  );
}






































// ── JOURS FÉRIÉS MARCHÉS ────────────────────────────────────────────────────
// Calcule Pâques (algo Meeus/Jones/Butcher)
function getEaster(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// nième jour de la semaine dans un mois (ex: 3e lundi de janvier)
function nthWeekday(year, month, weekday, n) {
  // month 0-based, weekday 0=Sun..6=Sat, n 1-based (ou -1 = dernier)
  if (n === -1) {
    const last = new Date(year, month + 1, 0);
    const diff = (weekday - last.getDay() + 7) % 7;
    return new Date(year, month, last.getDate() - diff);
  }
  const first = new Date(year, month, 1);
  const diff = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + diff + (n - 1) * 7);
}

function toYMD(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// Ajuste au lundi suivant si dimanche, lundi précédent si samedi
function observed(d) {
  const day = d.getDay();
  if (day === 0) return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  if (day === 6) return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
  return d;
}

function getMarketHolidays(year) {
  const easter = getEaster(year);
  const goodFriday = new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() - 2);
  const easterMonday = new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + 1);

  const holidays = {};
  const add = (date, label, exchanges, type = "closed", extra = {}) => {
    const key = toYMD(date);
    if (!holidays[key]) holidays[key] = [];
    holidays[key].push({ label, exchanges, type, ...extra });
  };

  // ── USA / CME / NYSE ──────────────────────────────────────────────────────
  add(observed(new Date(year, 0, 1)),  "Jour de l'An",          ["CME","NYSE"], "closed");
  add(nthWeekday(year, 0, 1, 3),       "Martin Luther King Jr.", ["CME","NYSE"], "closed");
  add(nthWeekday(year, 1, 1, 3),       "Presidents' Day",        ["CME","NYSE"], "closed");
  add(goodFriday,                       "Vendredi Saint",         ["CME","NYSE"], "closed");
  add(nthWeekday(year, 4, 1, -1),      "Memorial Day",           ["CME","NYSE"], "closed");
  add(observed(new Date(year, 5, 19)), "Juneteenth",             ["CME","NYSE"], "closed");
  add(observed(new Date(year, 6, 4)),  "Fête Nationale US",      ["CME","NYSE"], "closed");
  add(nthWeekday(year, 8, 1, 1),       "Labor Day",              ["CME","NYSE"], "closed");
  add(nthWeekday(year, 10, 4, 4),      "Thanksgiving",           ["CME","NYSE"], "closed");
  // Black Friday — fermeture anticipée CME (13h CT)
  add(new Date(year, 10, nthWeekday(year, 10, 4, 4).getDate() + 1), "Black Friday", ["CME","NYSE"], "early_close", { closeTime: "13h00 CT" });
  add(observed(new Date(year, 11, 25)), "Noël",                  ["CME","NYSE"], "closed");

  // ── EURONEXT / PARIS ─────────────────────────────────────────────────────
  // Seules les vraies fermetures de bourse (Euronext ferme uniquement ces 6 jours)
  add(new Date(year, 0, 1),   "Jour de l'An",          ["Euronext"], "closed");
  add(goodFriday,              "Vendredi Saint",         ["Euronext"], "closed");
  add(easterMonday,            "Lundi de Pâques",        ["Euronext"], "closed");
  add(new Date(year, 4, 1),   "Fête du Travail (1er Mai)", ["Euronext"], "closed");
  add(new Date(year, 11, 25), "Noël",                   ["Euronext"], "closed");
  add(new Date(year, 11, 26), "Lendemain de Noël",      ["Euronext"], "closed");

  return holidays;
}

// Cache des jours fériés pour les 5 prochaines années
const HOLIDAYS_CACHE = (() => {
  const thisYear = new Date().getFullYear();
  const all = {};
  for (let y = thisYear - 1; y <= thisYear + 4; y++) {
    Object.assign(all, getMarketHolidays(y));
  }
  return all;
})();

function UnifiedCalendar({ trades, sessions = {}, user, onDayOpen, lang = "fr" }) {
  const fr = lang === "fr";
  const authFetch = makeAuthFetch(user);
  const G = { green: "#00e5a0", red: "#ef4444", amber: "#f59e0b", purple: "#818cf8", dim: "#6b7280", border: "#1a1a2e", card: "#0e0e1a", text: "#e5e7eb" };

  const today = new Date();
  const todayStr = toYMD(today);

  const [viewDate, setViewDate] = useState(() => {
    const allDates = trades.map(t => t.date).filter(Boolean).sort();
    if (allDates.length === 0) return new Date();
    return new Date(allDates[allDates.length - 1] + "T12:00:00");
  });
  const [ecoByDate, setEcoByDate] = useState({});

  useEffect(() => {
    const cacheKey = `ff_eco7_cal_${todayStr}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) { setEcoByDate(JSON.parse(cached)); return; }
    (async () => {
      try {
        const r = await authFetch("/api/calendar");
        if (!r.ok) return;
        const data = await r.json();
        if (!Array.isArray(data)) return;
        const byDate = {};
        data.forEach(a => {
          const raw = a.time || a.date || "";
          if (!raw) return;
          const d = new Date(raw);
          if (isNaN(d)) return;
          const dateStr = d.toLocaleDateString("fr-CA", { timeZone: "Europe/Paris" });
          if (!byDate[dateStr]) byDate[dateStr] = [];
          byDate[dateStr].push({ event: a.event || a.title || "—", impact: (a.impact || "low").toLowerCase(), country: a.country || "USD" });
        });
        sessionStorage.setItem(cacheKey, JSON.stringify(byDate));
        setEcoByDate(byDate);
      } catch {}
    })();
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = new Date(year, month, 1).toLocaleDateString(fr ? "fr-FR" : "en-US", { month: "long", year: "numeric" });

  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToday = () => setViewDate(new Date());

  // Grouper trades par date
  const byDate = {};
  trades.forEach(t => {
    if (!t.date) return;
    if (!byDate[t.date]) byDate[t.date] = [];
    byDate[t.date].push(t);
  });

  const EMOTION_EMOJI = { "Confiant": "😊", "Serein": "😌", "Stressé": "😰", "Anxieux": "😟", "Frustré": "😤", "Euphorique": "🤩", "Impatient": "⚡", "En FOMO": "😱", "Neutre": "😐" };
  const FOOD_EMOJI = { "Saine": "🥗", "Neutre": "🍽️", "Mauvaise": "🍔" };

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const [popover, setPopover] = useState(null);

  const dayHeaders = fr ? ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"] : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  return (
    <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "20px 22px", position: "relative" }}
      onMouseLeave={() => setPopover(null)}>

      {/* Popover */}
      {popover && (
        <div style={{ position: "fixed", zIndex: 999, top: Math.min(popover.y + 12, window.innerHeight - 260), left: Math.min(popover.x + 12, window.innerWidth - 300), background: "#0e0e1a", border: "1px solid #2a2a3e", borderRadius: 14, padding: "14px 16px", minWidth: 260, maxWidth: 300, boxShadow: "0 16px 48px rgba(0,0,0,0.85)", pointerEvents: "none" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: G.text, marginBottom: 10 }}>
            {new Date(popover.iso + "T12:00:00").toLocaleDateString(fr ? "fr-FR" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
          {/* Jours fériés / bourse fermée */}
          {popover.hols.map((h, i) => (
            <div key={i} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{h.type === "closed" ? "🔴" : "🟡"}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: h.type === "closed" ? G.red : G.amber }}>{h.type === "closed" ? (fr ? "Bourse fermée" : "Market closed") : (fr ? "Clôture anticipée" : "Early close")}</div>
                <div style={{ fontSize: 12, color: G.text }}>{h.label}</div>
              </div>
            </div>
          ))}
          {/* Annonces éco */}
          {popover.eco.length > 0 && (
            <div style={{ borderTop: popover.hols.length > 0 ? "1px solid #1a1a2e" : "none", paddingTop: popover.hols.length > 0 ? 8 : 0, marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: G.dim, fontWeight: 700, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>📰 {fr ? "Annonces éco" : "Eco events"}</div>
              {popover.eco.filter(e => e.impact === "high" || e.impact === "medium").map((e, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: e.impact === "high" ? G.red : G.amber, flexShrink: 0, display: "inline-block" }} />
                  <span style={{ fontSize: 11, color: G.text }}>{e.event}</span>
                  <span style={{ fontSize: 10, color: G.dim, marginLeft: "auto" }}>{e.country}</span>
                </div>
              ))}
            </div>
          )}
          {/* PnL trades */}
          {popover.hasTrades && (
            <div style={{ borderTop: "1px solid #1a1a2e", paddingTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: G.dim }}>P&L</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: popover.pnl >= 0 ? G.green : G.red }}>{popover.pnl >= 0 ? "+" : ""}{Math.round(popover.pnl)}$</span>
              </div>
              <div style={{ fontSize: 10, color: G.dim, marginTop: 2 }}>{popover.nbTrades} trade{popover.nbTrades > 1 ? "s" : ""} · {popover.wins}W/{popover.nbTrades - popover.wins}L</div>
            </div>
          )}
          {popover.mainEmotion && EMOTION_EMOJI[popover.mainEmotion] && (
            <div style={{ marginTop: 6, fontSize: 11, color: G.dim }}>{EMOTION_EMOJI[popover.mainEmotion]} {popover.mainEmotion}</div>
          )}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>📅 {fr ? "Calendrier de trading" : "Trading calendar"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={prevMonth} style={{ background: "none", border: `1px solid ${G.border}`, color: G.text, borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <span style={{ fontSize: 13, fontWeight: 800, color: G.text, minWidth: 130, textAlign: "center", textTransform: "capitalize" }}>{monthLabel}</span>
          <button onClick={nextMonth} style={{ background: "none", border: `1px solid ${G.border}`, color: G.text, borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          <button onClick={goToday} style={{ background: "rgba(129,140,248,0.1)", border: `1px solid ${G.purple}40`, color: G.purple, borderRadius: 8, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>{fr ? "Aujourd'hui" : "Today"}</button>
        </div>
      </div>

      {/* En-têtes */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
        {dayHeaders.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: G.dim, letterSpacing: 1, padding: "4px 0", textTransform: "uppercase" }}>{d}</div>)}
      </div>

      {/* Grille */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((iso, idx) => {
          if (!iso) return <div key={idx} />;
          const dayTrades = byDate[iso] || [];
          const sess = sessions[iso] || {};
          const pnl = dayTrades.reduce((s, t) => s + (t.pnl || 0), 0);
          const wins = dayTrades.filter(t => (t.pnl || 0) > 0).length;
          const hasTrades = dayTrades.length > 0;
          const hasSession = Object.keys(sess).length > 0;
          const mainEmotion = (sess.etat_esprit || [])[0] || (dayTrades[0]?.emotion_avant || "").split(",")[0].trim() || null;
          const food = sess.alimentation || dayTrades[0]?.alimentation;
          const sport = !!sess.sport;
          const hols = HOLIDAYS_CACHE[iso] || [];
          const isClosed = hols.some(h => h.type === "closed");
          const isEarly = hols.some(h => h.type === "early");
          const eco = ecoByDate[iso] || [];
          const hasHigh = eco.some(e => e.impact === "high");
          const hasMed = eco.some(e => e.impact === "medium");
          const isToday = iso === todayStr;
          const isFuture = iso > todayStr;
          const isWeekend = idx % 7 >= 5;
          const clickable = (hasTrades || hasSession) && !isFuture && onDayOpen;

          let borderColor = G.border;
          if (isClosed || isEarly) borderColor = "rgba(239,68,68,0.5)";
          if (hasTrades) borderColor = pnl >= 0 ? "#00e5a040" : "#ef444440";
          if (isToday) borderColor = G.purple;

          return (
            <div key={iso}
              style={{ background: hasTrades || hasSession ? "rgba(255,255,255,0.025)" : "transparent", border: `1.5px solid ${borderColor}`, borderRadius: 10, minHeight: 80, padding: "8px 8px", display: "flex", flexDirection: "column", gap: 3, cursor: clickable ? "pointer" : "default", opacity: isFuture ? 0.3 : 1, transition: "filter 0.1s, border-color 0.15s", boxShadow: isToday ? `0 0 0 2px ${G.purple}` : "none" }}
              onMouseEnter={e => { if (clickable || hols.length > 0 || eco.length > 0) { e.currentTarget.style.filter = "brightness(1.15)"; setPopover({ iso, hols, eco, hasTrades, pnl, nbTrades: dayTrades.length, wins, mainEmotion, x: e.clientX, y: e.clientY }); } }}
              onMouseMove={e => setPopover(p => p ? { ...p, x: e.clientX, y: e.clientY } : null)}
              onMouseLeave={e => { e.currentTarget.style.filter = ""; setPopover(null); }}
              onClick={() => clickable && onDayOpen(iso)}>
              {/* Ligne numéro + indicateurs */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 12, fontWeight: isToday ? 900 : 600, color: isToday ? G.purple : isWeekend ? "#374151" : hasTrades || hasSession ? G.text : G.dim, lineHeight: 1 }}>{parseInt(iso.slice(8))}</span>
                <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                  {isClosed && <span style={{ fontSize: 10 }}>🔴</span>}
                  {isEarly && <span style={{ fontSize: 10 }}>🟡</span>}
                  {hasHigh && <span style={{ width: 6, height: 6, borderRadius: "50%", background: G.red, display: "inline-block" }} />}
                  {!hasHigh && hasMed && <span style={{ width: 6, height: 6, borderRadius: "50%", background: G.amber, display: "inline-block" }} />}
                </div>
              </div>
              {/* Férié label */}
              {hols.length > 0 && <div style={{ fontSize: 8, color: isClosed ? G.red : G.amber, lineHeight: 1.2, fontWeight: 600 }}>{hols[0].label.length > 12 ? hols[0].label.slice(0, 11) + "…" : hols[0].label}</div>}
              {/* PnL */}
              {hasTrades && <div style={{ fontSize: 11, fontWeight: 800, color: pnl >= 0 ? G.green : G.red, lineHeight: 1, marginTop: 2 }}>{pnl >= 0 ? "+" : ""}{Math.abs(pnl) >= 1000 ? `${(pnl/1000).toFixed(1)}k` : Math.round(pnl)}$</div>}
              {hasTrades && <div style={{ fontSize: 9, color: G.dim }}>{dayTrades.length}T · {wins}W/{dayTrades.length - wins}L</div>}
              {/* Icônes état */}
              {(hasTrades || hasSession) && (
                <div style={{ display: "flex", gap: 2, fontSize: 10, flexWrap: "wrap", marginTop: "auto" }}>
                  {mainEmotion && EMOTION_EMOJI[mainEmotion] && <span title={mainEmotion}>{EMOTION_EMOJI[mainEmotion]}</span>}
                  {sport && <span title="Sport">🏃</span>}
                  {food && FOOD_EMOJI[food] && <span title={food}>{FOOD_EMOJI[food]}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
        {[
          { dot: false, sw: 10, sh: 10, bg: "rgba(239,68,68,0.2)", border: "rgba(239,68,68,0.5)", label: fr ? "🔴 Bourse fermée" : "🔴 Market closed" },
          { dot: false, sw: 10, sh: 10, bg: "rgba(245,158,11,0.2)", border: "rgba(245,158,11,0.5)", label: fr ? "🟡 Clôture anticipée" : "🟡 Early close" },
          { dot: false, sw: 10, sh: 10, bg: "rgba(0,229,160,0.2)", border: "rgba(0,229,160,0.5)", label: fr ? "Jour profitable" : "Profitable day" },
          { dot: false, sw: 10, sh: 10, bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", label: fr ? "Jour perdant" : "Losing day" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: item.sw, height: item.sh, borderRadius: 3, background: item.bg, border: `1px solid ${item.border}` }} />
            <span style={{ fontSize: 10, color: G.dim }}>{item.label}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: G.red, display: "inline-block" }} />
          <span style={{ fontSize: 10, color: G.dim }}>{fr ? "Annonce forte" : "High impact"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: G.amber, display: "inline-block" }} />
          <span style={{ fontSize: 10, color: G.dim }}>{fr ? "Annonce moyenne" : "Med impact"}</span>
        </div>
      </div>
    </div>
  );
}

function CalendrierTrading({ trades, user }) {
  const authFetch = makeAuthFetch(user);
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [ecoByDate, setEcoByDate] = useState({});

  // Fetch annonces éco et grouper par date
  useEffect(() => {
    const cacheKey = `ff_eco7_cal_${toYMD(today)}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) { setEcoByDate(JSON.parse(cached)); return; }
    (async () => {
      try {
        const r = await authFetch("/api/calendar");
        if (!r.ok) return;
        const data = await r.json();
        if (!Array.isArray(data)) return;
        const byDate = {};
        data.forEach(a => {
          const raw = a.time || a.date || "";
          if (!raw) return;
          const d = new Date(raw);
          if (isNaN(d)) return;
          const dateStr = d.toLocaleDateString("fr-CA", { timeZone: "Europe/Paris" });
          if (!byDate[dateStr]) byDate[dateStr] = [];
          byDate[dateStr].push({ event: a.event || a.title || "—", impact: (a.impact || "low").toLowerCase(), country: a.country || "USD" });
        });
        sessionStorage.setItem(cacheKey, JSON.stringify(byDate));
        setEcoByDate(byDate);
      } catch {}
    })();
  }, []);

  // PnL, nb trades et wins par date
  const pnlByDate = {};
  const countByDate = {};
  const winByDate = {};
  trades.forEach(t => {
    if (!t.date) return;
    pnlByDate[t.date] = (pnlByDate[t.date] || 0) + (t.pnl || 0);
    countByDate[t.date] = (countByDate[t.date] || 0) + 1;
    if ((t.pnl || 0) > 0) winByDate[t.date] = (winByDate[t.date] || 0) + 1;
  });

  const maxAbs = Math.max(1, ...Object.values(pnlByDate).map(Math.abs));

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  // Quel jour de semaine commence le mois (0=Dim, adapter à Lun=0)
  const startWd = (firstDay.getDay() + 6) % 7; // 0=Lun
  const daysInMonth = lastDay.getDate();

  const todayStr = toYMD(today);
  const G = { green: "#00e5a0", red: "#ef4444", amber: "#f59e0b", purple: "#818cf8", dim: "#6b7280", border: "#1a1a2e", card: "#0e0e1a" };

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1); };

  const [popover, setPopover] = useState(null); // { hols, pnl, dateStr, x, y }

  const EXCHANGE_LINKS = {
    "CME":      { label: "CME Group", flag: "🇺🇸", pays: "États-Unis", url: "https://www.cmegroup.com/tools-information/holiday-calendar.html" },
    "NYSE":     { label: "NYSE",      flag: "🇺🇸", pays: "États-Unis", url: "https://www.nyse.com/markets/hours-calendars" },
    "Euronext": { label: "Euronext",  flag: "🇪🇺", pays: "Europe",     url: "https://www.euronext.com/en/trade/trading-hours-and-calendar" },
  };

  const cells = [];
  // Cases vides avant le 1er
  for (let i = 0; i < startWd; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "20px 22px", position: "relative" }}
      onMouseLeave={() => setPopover(null)}>

      {/* Popover hoverable */}
      {popover && (
        <div style={{
          position: "fixed", zIndex: 999,
          top: Math.min(popover.y + 12, window.innerHeight - 220),
          left: Math.min(popover.x + 12, window.innerWidth - 300),
          background: "#0e0e1a", border: `1px solid #2a2a3e`,
          borderRadius: 14, padding: "14px 16px", minWidth: 260, maxWidth: 300,
          boxShadow: "0 16px 48px rgba(0,0,0,0.85)",
          pointerEvents: "auto",
        }}>
          {/* Date */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "#e5e7eb", marginBottom: 10 }}>
            {new Date(popover.dateStr + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>

          {/* Jours fériés */}
          {popover.hols.map((h, i) => {
            // Regrouper les exchanges par pays
            const byPays = {};
            h.exchanges.forEach(ex => {
              const info = EXCHANGE_LINKS[ex];
              if (!info) return;
              if (!byPays[info.pays]) byPays[info.pays] = { flag: info.flag, exchanges: [] };
              byPays[info.pays].exchanges.push({ ex, ...info });
            });
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{h.type === "closed" ? "🔴" : "🟡"}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: h.type === "closed" ? G.red : G.amber }}>
                      {h.type === "closed" ? "Bourse fermée" : "Clôture anticipée"}
                    </div>
                    <div style={{ fontSize: 13, color: "#e5e7eb", fontWeight: 600 }}>{h.label}</div>
                  </div>
                </div>
                {/* Pays + bourses */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 24 }}>
                  {Object.entries(byPays).map(([pays, { flag, exchanges }]) => (
                    <div key={pays} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{flag}</span>
                      <span style={{ fontSize: 11, color: G.dim, minWidth: 70 }}>{pays}</span>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {exchanges.map(({ ex, label, url }) => (
                          <a key={ex} href={url} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ fontSize: 10, color: G.purple, textDecoration: "none", background: `${G.purple}15`, border: `1px solid ${G.purple}30`, borderRadius: 6, padding: "3px 9px", display: "inline-flex", alignItems: "center", gap: 3 }}>
                            {label} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Annonces éco */}
          {popover.ecoDay && popover.ecoDay.length > 0 && (
            <div style={{ borderTop: "1px solid #1a1a2e", paddingTop: 8, marginTop: 4 }}>
              <div style={{ fontSize: 10, color: G.dim, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>📰 Annonces économiques</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {popover.ecoDay.filter(e => e.impact === "high" || e.impact === "medium").map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: e.impact === "high" ? G.red : G.amber, flexShrink: 0, display: "inline-block" }} />
                    <span style={{ fontSize: 11, color: "#e5e7eb" }}>{e.event}</span>
                    <span style={{ fontSize: 10, color: G.dim, marginLeft: "auto" }}>{e.country}</span>
                  </div>
                ))}
                {popover.ecoDay.filter(e => e.impact !== "high" && e.impact !== "medium").length > 0 && (
                  <div style={{ fontSize: 10, color: G.dim }}>+ {popover.ecoDay.filter(e => e.impact !== "high" && e.impact !== "medium").length} annonce(s) faible(s)</div>
                )}
              </div>
            </div>
          )}

          {/* P&L si trade ce jour */}
          {popover.pnl !== undefined && (
            <div style={{ borderTop: "1px solid #1a1a2e", paddingTop: 8, marginTop: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: G.dim }}>P&L du jour</span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: popover.pnl >= 0 ? G.green : G.red }}>
                  {popover.pnl >= 0 ? "+" : ""}{popover.pnl.toFixed(0)}$
                </span>
              </div>
              {popover.nbTrades > 0 && (
                <div style={{ fontSize: 10, color: G.dim, marginTop: 3 }}>{popover.nbTrades} trade{popover.nbTrades > 1 ? "s" : ""} ce jour</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>
          📅 Calendrier de trading
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={prevMonth} style={{ background: "none", border: `1px solid ${G.border}`, color: "#e5e7eb", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 13 }}>‹</button>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#e5e7eb", minWidth: 130, textAlign: "center" }}>
            {MOIS_FR[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth} style={{ background: "none", border: `1px solid ${G.border}`, color: "#e5e7eb", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 13 }}>›</button>
          <button onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}
            style={{ background: "rgba(129,140,248,0.1)", border: `1px solid ${G.purple}40`, color: G.purple, borderRadius: 8, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>
            Aujourd'hui
          </button>
        </div>
      </div>

      {/* En-têtes jours */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"].map(j => (
          <div key={j} style={{ textAlign: "center", fontSize: 11, color: G.dim, fontWeight: 700, padding: "8px 0", letterSpacing: 0.3 }}>{j}</div>
        ))}
      </div>

      {/* Grille */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const dateStr = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const pnl = pnlByDate[dateStr];
          const nbTrades = countByDate[dateStr] || 0;
          const nbWins = winByDate[dateStr] || 0;
          const hols = HOLIDAYS_CACHE[dateStr] || [];
          const isClosed = hols.some(h => h.type === "closed");
          const isEarly = hols.some(h => h.type === "early");
          const isToday = dateStr === todayStr;
          const isWeekend = idx % 7 >= 5;
          const hasTrade = pnl !== undefined;
          const ecoDay = ecoByDate[dateStr] || [];
          const hasHigh = ecoDay.some(e => e.impact === "high");
          const hasMed = ecoDay.some(e => e.impact === "medium");

          const dayColor = isWeekend ? "#374151" : "#6b7280";
          const bg = "rgba(255,255,255,0.02)";
          let borderColor = G.border;

          if (isClosed || isEarly || hasHigh || hasMed) borderColor = "rgba(239,68,68,0.55)";
          if (isToday) borderColor = G.purple;

          const hasInfo = hols.length > 0 || hasTrade || ecoDay.length > 0;
          return (
            <div key={dateStr} style={{
              background: bg, border: `1.5px solid ${borderColor}`,
              borderRadius: 10, minHeight: 80, padding: "8px 10px",
              display: "flex", flexDirection: "column", gap: 3,
              cursor: hasInfo ? "pointer" : "default",
              boxShadow: isToday ? `0 0 0 2px ${G.purple}` : "none",
              transition: "filter 0.1s",
            }}
            onMouseEnter={e => {
              if (hasInfo) { e.currentTarget.style.filter = "brightness(1.15)"; setPopover({ hols, pnl, nbTrades, ecoDay, dateStr, x: e.clientX, y: e.clientY }); }
            }}
            onMouseMove={e => { if (hasInfo) setPopover(p => p ? { ...p, x: e.clientX, y: e.clientY } : null); }}
            onMouseLeave={e => { e.currentTarget.style.filter = ""; setPopover(null); }}>

              {/* Ligne 1: numéro + indicateurs fériés */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, fontWeight: isToday ? 900 : 600, color: isToday ? G.purple : dayColor, lineHeight: 1 }}>{day}</span>
                <div style={{ display: "flex", gap: 3 }}>
                  {isClosed && <span style={{ fontSize: 11 }}>🔴</span>}
                  {isEarly && <span style={{ fontSize: 11 }}>🟡</span>}
                  {hasHigh && <span style={{ width: 7, height: 7, borderRadius: "50%", background: G.red, display: "inline-block", marginTop: 3 }} title="Annonce impact fort" />}
                  {!hasHigh && hasMed && <span style={{ width: 7, height: 7, borderRadius: "50%", background: G.amber, display: "inline-block", marginTop: 3 }} title="Annonce impact moyen" />}
                </div>
              </div>

              {/* Férié label */}
              {hols.length > 0 && (
                <div style={{ fontSize: 9, color: isClosed ? G.red : G.amber, lineHeight: 1.3, fontWeight: 600 }}>
                  {hols[0].label.length > 14 ? hols[0].label.slice(0, 13) + "…" : hols[0].label}
                </div>
              )}

              {/* Résumé journée */}
              {hasTrade && (
                <div style={{ marginTop: "auto" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace", color: pnl >= 0 ? G.green : G.red, lineHeight: 1 }}>
                    {pnl >= 0 ? "+" : ""}{Math.abs(pnl) >= 1000 ? `${(pnl/1000).toFixed(1)}k` : pnl.toFixed(0)}$
                  </div>
                  <div style={{ display: "flex", gap: 5, alignItems: "center", marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: G.dim }}>{nbTrades} trade{nbTrades > 1 ? "s" : ""}</span>
                    <span style={{ fontSize: 9, color: G.dim }}>·</span>
                    <span style={{ fontSize: 10, color: nbWins / nbTrades >= 0.5 ? G.green : G.red }}>
                      {nbWins}W/{nbTrades - nbWins}L
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
        {[
          { color: "rgba(239,68,68,0.4)", border: "rgba(239,68,68,0.6)", dot: false, label: "🔴 Bourse fermée" },
          { color: "rgba(245,158,11,0.2)", border: "rgba(245,158,11,0.5)", dot: false, label: "🟡 Clôture anticipée" },
          { color: "rgba(0,229,160,0.2)", border: "rgba(0,229,160,0.5)", dot: false, label: "Jour profitable" },
          { color: "rgba(239,68,68,0.2)", border: "rgba(239,68,68,0.5)", dot: false, label: "Jour perdant" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color, border: `1px solid ${item.border}` }} />
            <span style={{ fontSize: 10, color: G.dim }}>{item.label}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: G.red, display: "inline-block" }} />
          <span style={{ fontSize: 10, color: G.dim }}>Annonce forte</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: G.amber, display: "inline-block" }} />
          <span style={{ fontSize: 10, color: G.dim }}>Annonce moyenne</span>
        </div>
      </div>
    </div>
  );
}

const JOURS_SEMAINE = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const JOURS_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const MOIS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function getJourIndex(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return (d.getDay() + 6) % 7;
}

function CalendrierPnL({ trades }) {
  const today = new Date();
  const [viewMode, setViewMode] = useState("mois"); // mois | semaine | jour
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);

  // Grouper les trades par date
  const tradesByDate = {};
  trades.forEach(t => {
    if (!t.date) return;
    if (!tradesByDate[t.date]) tradesByDate[t.date] = [];
    tradesByDate[t.date].push(t);
  });

  const allPnls = Object.values(tradesByDate).map(arr => Math.abs(arr.reduce((a, t) => a + t.pnl, 0)));
  const maxPnl = Math.max(...allPnls, 1);

  const pnlColor = (pnl, intensity = 1) => {
    if (pnl === 0) return "transparent";
    const alpha = Math.min(0.55, 0.08 + (Math.abs(pnl) / maxPnl) * 0.45 * intensity);
    return pnl > 0 ? `rgba(34,197,94,${alpha})` : `rgba(239,68,68,${alpha})`;
  };

  const fmt = (d) => {
    const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,"0"), day = String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${day}`;
  };

  const todayStr = fmt(today);

  // ── VUE MOIS ──
  const renderMois = () => {
    const year = currentDate.getFullYear(), month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7; // 0=Lun

    // Toutes les semaines du mois (lignes)
    const days = [];
    for (let i = 0; i < startOffset; i++) {
      const d = new Date(year, month, 1 - startOffset + i);
      days.push({ date: fmt(d), inMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: fmt(d), inMonth: true });
    }
    while (days.length % 7 !== 0) {
      const d = new Date(year, month + 1, days.length - startOffset - lastDay.getDate() + 1);
      days.push({ date: fmt(d), inMonth: false });
    }

    // Semaines avec résumé samedi
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i+7));

    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr) 100px", gap: 1, marginBottom: 1 }}>
          {[...JOURS_SEMAINE, "Semaine"].map(j => (
            <div key={j} style={{ textAlign: "center", fontSize: 10, color: j === "Sam" || j === "Dim" ? COLORS.muted : COLORS.textDim, padding: "6px 0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{j}</div>
          ))}
        </div>
        {weeks.map((week, wi) => {
          const weekTrades = week.flatMap(d => tradesByDate[d.date] || []);
          const weekPnl = weekTrades.reduce((a, t) => a + t.pnl, 0);
          return (
            <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr) 100px", gap: 1, marginBottom: 1 }}>
              {week.map((d, di) => {
                const dayTrades = tradesByDate[d.date] || [];
                const dayPnl = dayTrades.reduce((a, t) => a + t.pnl, 0);
                const isToday = d.date === todayStr;
                const isSelected = d.date === selectedDay;
                const isWeekend = di >= 5;
                return (
                  <div key={d.date} onClick={() => { if (dayTrades.length > 0) { setSelectedDay(d.date === selectedDay ? null : d.date); setViewMode("jour"); } }}
                    style={{ minHeight: 64, padding: "6px 8px", background: isSelected ? COLORS.cyan + "25" : pnlColor(dayPnl), border: isToday ? `2px solid ${COLORS.cyan}` : isSelected ? `1px solid ${COLORS.cyan}` : `1px solid ${COLORS.border}20`, borderRadius: 4, cursor: dayTrades.length > 0 ? "pointer" : "default", opacity: d.inMonth ? 1 : 0.35, position: "relative", transition: "opacity .15s" }}>
                    <div style={{ fontSize: 10, color: isToday ? COLORS.cyan : isWeekend ? COLORS.muted : COLORS.textDim, fontWeight: isToday ? 800 : 400 }}>{parseInt(d.date.split("-")[2])}</div>
                    {dayTrades.length > 0 && (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 800, fontFamily: "monospace", color: dayPnl >= 0 ? COLORS.green : COLORS.red, marginTop: 4 }}>{dayPnl >= 0 ? "+" : ""}{dayPnl.toFixed(0)}$</div>
                        <div style={{ fontSize: 9, color: COLORS.muted, marginTop: 2 }}>{dayTrades.length} trade{dayTrades.length > 1 ? "s" : ""}</div>
                      </>
                    )}
                  </div>
                );
              })}
              {/* Résumé semaine */}
              <div style={{ minHeight: 64, padding: "6px 8px", background: pnlColor(weekPnl, 0.6), border: `1px solid ${COLORS.border}30`, borderRadius: 4, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div style={{ fontSize: 9, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>S{wi+1}</div>
                {weekTrades.length > 0 ? (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: weekPnl >= 0 ? COLORS.green : COLORS.red }}>{weekPnl >= 0 ? "+" : ""}{weekPnl.toFixed(0)}$</div>
                    <div style={{ fontSize: 9, color: COLORS.muted, marginTop: 2 }}>{weekTrades.length} trades</div>
                  </>
                ) : <div style={{ fontSize: 10, color: COLORS.muted }}>—</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ── VUE SEMAINE ──
  const renderSemaine = () => {
    const d = new Date(currentDate);
    const dayOfWeek = (d.getDay() + 6) % 7;
    const monday = new Date(d); monday.setDate(d.getDate() - dayOfWeek);
    const weekDays = Array.from({ length: 7 }, (_, i) => { const x = new Date(monday); x.setDate(monday.getDate() + i); return fmt(x); });
    const weekPnl = weekDays.flatMap(date => tradesByDate[date] || []).reduce((a, t) => a + t.pnl, 0);
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 8 }}>
          {weekDays.map((date, i) => {
            const dayTrades = tradesByDate[date] || [];
            const dayPnl = dayTrades.reduce((a, t) => a + t.pnl, 0);
            const isToday = date === todayStr;
            return (
              <div key={date} onClick={() => { setSelectedDay(date); setViewMode("jour"); }}
                style={{ minHeight: 100, padding: "10px 8px", background: pnlColor(dayPnl), border: isToday ? `2px solid ${COLORS.cyan}` : `1px solid ${COLORS.border}30`, borderRadius: 8, cursor: dayTrades.length > 0 ? "pointer" : "default" }}>
                <div style={{ fontSize: 10, color: isToday ? COLORS.cyan : COLORS.muted, fontWeight: 700, marginBottom: 6 }}>{JOURS_SEMAINE[i]} {parseInt(date.split("-")[2])}</div>
                {dayTrades.length > 0 ? (
                  <>
                    <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: dayPnl >= 0 ? COLORS.green : COLORS.red }}>{dayPnl >= 0 ? "+" : ""}{dayPnl.toFixed(0)}$</div>
                    <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 4 }}>{dayTrades.length} trade{dayTrades.length > 1 ? "s" : ""}</div>
                  </>
                ) : <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 6 }}>—</div>}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: weekPnl >= 0 ? COLORS.green : COLORS.red, padding: "6px 0" }}>Total semaine : {weekPnl >= 0 ? "+" : ""}{weekPnl.toFixed(2)}$</div>
      </div>
    );
  };

  // ── VUE JOUR ──
  const renderJour = () => {
    const date = selectedDay || todayStr;
    const dayTrades = (tradesByDate[date] || []).sort((a, b) => (a.heure || "").localeCompare(b.heure || ""));
    const dayPnl = dayTrades.reduce((a, t) => a + t.pnl, 0);
    const d = new Date(date + "T12:00:00");
    const jourNom = JOURS_FULL[(d.getDay() + 6) % 7];
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{jourNom} {parseInt(date.split("-")[2])} {MOIS_FR[d.getMonth()]} {d.getFullYear()}</div>
          {dayTrades.length > 0 && <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: dayPnl >= 0 ? COLORS.green : COLORS.red }}>{dayPnl >= 0 ? "+" : ""}{dayPnl.toFixed(2)}$</div>}
        </div>
        {dayTrades.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: COLORS.muted, fontSize: 12 }}>Aucun trade ce jour</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {dayTrades.map((t, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.bg, borderRadius: 8, padding: "10px 14px", borderLeft: `3px solid ${t.pnl >= 0 ? COLORS.green : COLORS.red}` }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{t.actif} · {t.direction} · {t.setup}</div>
                  <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2 }}>{t.heure || "—"} · {t.compte} · {t.duree ? `${t.duree}min` : ""}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: t.pnl >= 0 ? COLORS.green : COLORS.red }}>{t.pnl >= 0 ? "+" : ""}{t.pnl}$</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Navigation
  const navPrev = () => {
    if (viewMode === "mois") setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    else if (viewMode === "semaine") { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); }
    else { const d = new Date(selectedDay || todayStr); d.setDate(d.getDate() - 1); setSelectedDay(fmt(d)); }
  };
  const navNext = () => {
    if (viewMode === "mois") setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    else if (viewMode === "semaine") { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); }
    else { const d = new Date(selectedDay || todayStr); d.setDate(d.getDate() + 1); setSelectedDay(fmt(d)); }
  };

  const navLabel = () => {
    if (viewMode === "mois") return `${MOIS_FR[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    if (viewMode === "semaine") {
      const d = new Date(currentDate);
      const dow = (d.getDay() + 6) % 7;
      const mon = new Date(d); mon.setDate(d.getDate() - dow);
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
      return `${mon.getDate()} ${MOIS_FR[mon.getMonth()].slice(0,3)} — ${sun.getDate()} ${MOIS_FR[sun.getMonth()].slice(0,3)}`;
    }
    const date = selectedDay || todayStr;
    const d2 = new Date(date + "T12:00:00");
    return `${d2.getDate()} ${MOIS_FR[d2.getMonth()]} ${d2.getFullYear()}`;
  };

  const periodPnl = (() => {
    if (viewMode === "mois") {
      const y = currentDate.getFullYear(), m = currentDate.getMonth();
      return { pnl: trades.filter(t => { const d = new Date(t.date + "T12:00:00"); return d.getFullYear() === y && d.getMonth() === m; }).reduce((a, t) => a + t.pnl, 0), label: "ce mois" };
    }
    if (viewMode === "semaine") {
      const d = new Date(currentDate);
      const dow = (d.getDay() + 6) % 7;
      const mon = new Date(d); mon.setDate(d.getDate() - dow);
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
      const dates = Array.from({ length: 7 }, (_, i) => { const x = new Date(mon); x.setDate(mon.getDate() + i); return fmt(x); });
      return { pnl: dates.flatMap(date => tradesByDate[date] || []).reduce((a, t) => a + t.pnl, 0), label: "cette semaine" };
    }
    const date = selectedDay || todayStr;
    return { pnl: (tradesByDate[date] || []).reduce((a, t) => a + t.pnl, 0), label: "ce jour" };
  })();

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <SectionTitle style={{ margin: 0 }}>📅 Calendrier</SectionTitle>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {["jour","semaine","mois"].map(m => (
            <button key={m} onClick={() => setViewMode(m)} style={{ background: viewMode === m ? COLORS.cyan + "20" : COLORS.bg, border: `1px solid ${viewMode === m ? COLORS.cyan : COLORS.border}`, color: viewMode === m ? COLORS.cyan : COLORS.muted, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{m}</button>
          ))}
        </div>
      </div>

      {/* Résultat de la période AU-DESSUS de la navigation date */}
      {trades.length > 0 && (
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{periodPnl.label}</div>
          <div style={{ display: "inline-block", padding: "14px 28px", borderRadius: 14, background: periodPnl.pnl >= 0 ? `linear-gradient(135deg, ${COLORS.green}18, ${COLORS.green}06)` : `linear-gradient(135deg, ${COLORS.red}18, ${COLORS.red}06)`, border: `1.5px solid ${periodPnl.pnl >= 0 ? COLORS.green + "50" : COLORS.red + "50"}`, boxShadow: `0 0 24px ${periodPnl.pnl >= 0 ? COLORS.green + "20" : COLORS.red + "20"}` }}>
            <div style={{ fontSize: 38, fontWeight: 800, fontFamily: "monospace", letterSpacing: -1, color: periodPnl.pnl >= 0 ? COLORS.green : COLORS.red, lineHeight: 1 }}>
              {periodPnl.pnl >= 0 ? "+" : ""}{periodPnl.pnl.toFixed(0)}<span style={{ fontSize: 28, opacity: 0.8 }}>$</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button onClick={navPrev} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.muted, borderRadius: 6, padding: "4px 10px", fontSize: 13, cursor: "pointer" }}>‹</button>
        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{navLabel()}</span>
        <button onClick={navNext} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.muted, borderRadius: 6, padding: "4px 10px", fontSize: 13, cursor: "pointer" }}>›</button>
      </div>
      {viewMode === "mois" && renderMois()}
      {viewMode === "semaine" && renderSemaine()}
      {viewMode === "jour" && renderJour()}
    </Card>
  );
}

function DetailCompte({ compte, trades, onBack, onEdit, onValidateEval, onBlowAccount, lang = "fr" }) {
  const fr = lang === "fr";
  const firm = PROP_FIRMS_CATALOG[compte.type] || PROP_FIRMS_CATALOG["Autre"];
  const tradeDuCompte = trades.filter(t => t.compte === compte.nom);
  const pnlCompte = tradeDuCompte.reduce((a, t) => a + t.pnl, 0);
  const payoutsCompte = (compte.payouts || []).reduce((a, p) => a + p.montant, 0);
  const wins = tradeDuCompte.filter(t => t.pnl > 0).length;
  const losses = tradeDuCompte.filter(t => t.pnl < 0).length;
  const winRate = tradeDuCompte.length ? Math.round((wins / tradeDuCompte.length) * 100) : 0;
  const avgPnl = tradeDuCompte.length ? (pnlCompte / tradeDuCompte.length).toFixed(0) : 0;
  const notesMoy = tradeDuCompte.length ? (tradeDuCompte.reduce((a, t) => a + (t.note || 0), 0) / tradeDuCompte.length).toFixed(1) : null;
  const joursValides = tradeDuCompte.filter(t => t.joursPayoutValide).length;
  const pnlPos = pnlCompte >= 0;
  const G = { green: "#00e5a0", purple: "#818cf8", red: "#ef4444", amber: "#f59e0b", dim: "#6b7280", muted: "#374151" };
  const card = { background: "linear-gradient(135deg,#0e0e1a,#0a0a14)", border: "1px solid #1a1a2e", borderRadius: 16, padding: "20px 24px" };

  // Payout rules
  const typeData = firm.typesCompte?.find(tc => tc.id === compte.typeCompte);
  const regles = typeData?.payoutRegles;

  // Détection validation éval
  const currentTypeIdx = firm.typesCompte?.findIndex(tc => tc.id === compte.typeCompte) ?? -1;
  const nextType = currentTypeIdx >= 0 && currentTypeIdx < (firm.typesCompte?.length ?? 0) - 1
    ? firm.typesCompte[currentTypeIdx + 1]
    : null;
  const isEval = regles?.type === "profit_target" || regles?.type === "jours_gagnants" || regles?.type === "jours_trading";
  const targetMontant = regles?.montant
    || (regles?.montants ? (regles.montants[compte.taille] ?? null) : null)
    || (regles?.montantPct ? Math.round(compte.taille * regles.montantPct) : null);
  const evalReached = isEval && nextType && (
    (regles.type === "profit_target" && targetMontant && pnlCompte >= targetMontant) ||
    (regles.type === "jours_gagnants" && regles.nombre && joursValides >= regles.nombre) ||
    (regles.type === "jours_trading" && regles.nombre && tradeDuCompte.length >= regles.nombre)
  );
  const [showValidModal, setShowValidModal] = useState(false);
  const [showBlowModal, setShowBlowModal] = useState(false);

  const recentTrades = [...tradeDuCompte].sort((a, b) => b.date > a.date ? 1 : -1).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ══ BANNIÈRE FÉLICITATIONS ══ */}
      {evalReached && (
        <div style={{ background: `linear-gradient(135deg, ${firm.couleur}18, ${firm.couleur}08)`, border: `1px solid ${firm.couleur}50`, borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, animation: "glow-pulse 3s ease-in-out infinite" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 40, lineHeight: 1 }}>🏆</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: firm.couleur, letterSpacing: -0.3 }}>Objectif atteint ! Félicitations 🎉</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>
                {regles.type === "profit_target" && `+${pnlCompte.toFixed(0)}$ sur objectif ${targetMontant}$`}
                {regles.type === "jours_gagnants" && `${joursValides} jours validés sur ${regles.nombre} requis`}
                {regles.type === "jours_trading" && `${tradeDuCompte.length} jours tradés sur ${regles.nombre} requis`}
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Tu peux maintenant passer en <span style={{ color: firm.couleur, fontWeight: 700 }}>{nextType.label}</span></div>
            </div>
          </div>
          <button onClick={() => setShowValidModal(true)} style={{ background: firm.couleur, color: "#06060f", border: "none", borderRadius: 10, padding: "12px 22px", fontSize: 13, fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap", boxShadow: `0 0 20px ${firm.couleur}40` }}>
            Valider le compte →
          </button>
        </div>
      )}

      {/* ══ MODAL VALIDATION ══ */}
      {showValidModal && nextType && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0a0a14", border: `1px solid ${firm.couleur}40`, borderRadius: 20, padding: "40px 36px", maxWidth: 460, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎊</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: -0.5, marginBottom: 8 }}>Compte validé !</h2>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, marginBottom: 8 }}>
              Ton évaluation <strong style={{ color: firm.couleur }}>{typeData?.label}</strong> est réussie.
            </p>
            <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.7, marginBottom: 28 }}>
              Un nouveau compte <strong style={{ color: firm.couleur }}>{nextType.label}</strong> va être créé automatiquement pour <strong>{firm.nom}</strong>.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowValidModal(false)} style={{ flex: 1, background: "none", border: "1px solid #1a1a2e", color: "#6b7280", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Annuler
              </button>
              <button onClick={() => { onValidateEval && onValidateEval(compte, nextType); setShowValidModal(false); }} style={{ flex: 2, background: firm.couleur, color: "#06060f", border: "none", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 0 20px ${firm.couleur}40` }}>
                ✓ Créer le compte {nextType.label}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal compte cramé */}
      {showBlowModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0a0a14", border: "1px solid #ef444440", borderRadius: 20, padding: "40px 36px", maxWidth: 420, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔥</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Compte perdu</h2>
            <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.7, marginBottom: 28 }}>
              Tu es sur le point de marquer le compte <strong style={{ color: "#ef4444" }}>{compte.nom}</strong> comme <strong>cramé / perdu</strong>.<br />
              Les trades sont conservés dans l'analyse globale.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowBlowModal(false)} style={{ flex: 1, background: "none", border: "1px solid #1a1a2e", color: "#6b7280", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Annuler
              </button>
              <button onClick={() => { onBlowAccount && onBlowAccount(compte.id); setShowBlowModal(false); }} style={{ flex: 2, background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                🔥 Confirmer — compte cramé
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "#0e0e1a", border: "1px solid #1a1a2e", color: "#666", borderRadius: 10, padding: "8px 14px", fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>← Retour</button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 11, color: firm.couleur, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>{firm.emoji} {compte.type} · {typeData?.label || compte.typeCompte}</div>
              {compte.blown && <span style={{ fontSize: 10, fontWeight: 800, color: "#ef4444", background: "#ef444420", border: "1px solid #ef444440", borderRadius: 20, padding: "2px 8px", letterSpacing: 0.5 }}>🔥 CRAMÉ</span>}
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, opacity: compte.blown ? 0.5 : 1 }}>{compte.nom}</div>
            {compte.numero && <div style={{ fontSize: 12, color: G.dim, marginTop: 2 }}>Compte #{compte.numero}</div>}
            {compte.blown && compte.blownAt && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>Perdu le {compte.blownAt}</div>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {!compte.blown && (
            <button onClick={() => setShowBlowModal(true)} style={{ background: "#ef444410", border: "1px solid #ef444430", color: "#ef4444", borderRadius: 10, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>🔥 Compte cramé</button>
          )}
          <button onClick={onEdit} style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", color: "#aaa", borderRadius: 10, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>✏️ Modifier</button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: fr ? "P&L Total" : "Total P&L", val: `${pnlPos ? "+" : ""}${pnlCompte.toFixed(0)}$`, color: pnlPos ? G.green : G.red },
          { label: fr ? "Payouts reçus" : "Payouts received", val: payoutsCompte > 0 ? `+${payoutsCompte.toFixed(0)}$` : "—", color: payoutsCompte > 0 ? G.green : G.dim },
          { label: fr ? "Win Rate" : "Win Rate", val: tradeDuCompte.length ? `${winRate}%` : "—", color: winRate >= 55 ? G.green : winRate >= 40 ? G.amber : G.red },
          { label: fr ? "Trades" : "Trades", val: tradeDuCompte.length, color: "#fff" },
        ].map((k, i) => (
          <div key={i} style={{ ...card }}>
            <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, fontFamily: "monospace", color: k.color, letterSpacing: -1 }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* ══ GRAPHIQUE PnL CUMULATIF ══ */}
      {tradeDuCompte.length > 0 && (() => {
        const sorted = [...tradeDuCompte].sort((a, b) => a.date > b.date ? 1 : a.date < b.date ? -1 : 0);
        const cumul = [];
        let running = 0;
        sorted.forEach(t => { running += (t.pnl || 0); cumul.push(running); });
        const W = 600, H = 180, PAD = { t: 20, r: 20, b: 30, l: 52 };
        const iW = W - PAD.l - PAD.r, iH = H - PAD.t - PAD.b;
        const allVals = [...cumul, 0, targetMontant ? targetMontant * 1.05 : null].filter(v => v !== null);
        const minVal = Math.min(...allVals);
        const maxVal = Math.max(...allVals);
        const range = maxVal - minVal || 1;
        const xOf = i => PAD.l + (i / (cumul.length - 1 || 1)) * iW;
        const yOf = v => PAD.t + iH - ((v - minVal) / range) * iH;
        const pts = cumul.map((v, i) => `${xOf(i)},${yOf(v)}`).join(" ");
        const zeroY = yOf(0);
        const targetY = targetMontant ? yOf(targetMontant) : null;
        const lastX = xOf(cumul.length - 1);
        const lastY = yOf(cumul[cumul.length - 1]);
        const firmColor = firm.couleur || "#00e5a0";
        const lastPnl = cumul[cumul.length - 1];
        return (
          <div style={{ background: "linear-gradient(135deg,#0e0e1a,#0a0a14)", border: "1px solid #1a1a2e", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>P&L Cumulatif</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: lastPnl >= 0 ? G.green : G.red }}>{lastPnl >= 0 ? "+" : ""}{lastPnl.toFixed(0)}$</div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
              <defs>
                <linearGradient id={`pnl-fill-${compte.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lastPnl >= 0 ? G.green : G.red} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={lastPnl >= 0 ? G.green : G.red} stopOpacity="0.02" />
                </linearGradient>
                <clipPath id={`clip-above-${compte.id}`}>
                  <rect x={PAD.l} y={PAD.t} width={iW} height={Math.max(0, zeroY - PAD.t)} />
                </clipPath>
                <clipPath id={`clip-below-${compte.id}`}>
                  <rect x={PAD.l} y={zeroY} width={iW} height={Math.max(0, PAD.t + iH - zeroY)} />
                </clipPath>
              </defs>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(f => {
                const y = PAD.t + iH * f;
                const val = maxVal - f * range;
                return (
                  <g key={f}>
                    <line x1={PAD.l} y1={y} x2={PAD.l + iW} y2={y} stroke="#1a1a2e" strokeWidth="1" />
                    <text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#4b5563">{val >= 0 ? "+" : ""}{Math.round(val)}</text>
                  </g>
                );
              })}
              {/* Zero line */}
              {zeroY >= PAD.t && zeroY <= PAD.t + iH && (
                <line x1={PAD.l} y1={zeroY} x2={PAD.l + iW} y2={zeroY} stroke="#374151" strokeWidth="1.5" strokeDasharray="4,4" />
              )}
              {/* Target line */}
              {targetY !== null && targetY >= PAD.t && targetY <= PAD.t + iH && (
                <g>
                  <line x1={PAD.l} y1={targetY} x2={PAD.l + iW} y2={targetY} stroke={firmColor} strokeWidth="1.5" strokeDasharray="6,4" opacity="0.7" />
                  <rect x={PAD.l + iW - 68} y={targetY - 11} width={66} height={14} rx={3} fill="#0a0a14" />
                  <text x={PAD.l + iW - 4} y={targetY + 2} textAnchor="end" fontSize="9" fill={firmColor} fontWeight="700">Target ${targetMontant}</text>
                </g>
              )}
              {/* Fill above zero */}
              <polygon points={`${PAD.l},${zeroY} ${cumul.map((v, i) => `${xOf(i)},${yOf(v)}`).join(" ")} ${lastX},${zeroY}`}
                fill="#00e5a0" opacity="0.08" clipPath={`url(#clip-above-${compte.id})`} />
              {/* Fill below zero */}
              <polygon points={`${PAD.l},${zeroY} ${cumul.map((v, i) => `${xOf(i)},${yOf(v)}`).join(" ")} ${lastX},${zeroY}`}
                fill="#ef4444" opacity="0.12" clipPath={`url(#clip-below-${compte.id})`} />
              {/* Line */}
              {cumul.length > 1 ? (
                <polyline points={pts} fill="none" stroke={lastPnl >= 0 ? G.green : G.red} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              ) : (
                <circle cx={xOf(0)} cy={yOf(cumul[0])} r="4" fill={lastPnl >= 0 ? G.green : G.red} />
              )}
              {/* Last dot */}
              <circle cx={lastX} cy={lastY} r="4" fill={lastPnl >= 0 ? G.green : G.red} />
              <circle cx={lastX} cy={lastY} r="7" fill="none" stroke={lastPnl >= 0 ? G.green : G.red} strokeWidth="1.5" opacity="0.4" />
              {/* X axis labels */}
              {[0, Math.floor((cumul.length - 1) / 2), cumul.length - 1].filter((v, i, arr) => arr.indexOf(v) === i && v >= 0).map(i => (
                <text key={i} x={xOf(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#4b5563">T{i + 1}</text>
              ))}
            </svg>
          </div>
        );
      })()}

      {/* Stats + règles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

        {/* Infos compte */}
        <div style={{ ...card }}>
          <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16, fontWeight: 700 }}>Informations</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: fr ? "Taille du compte" : "Account size", val: `$${(compte.taille / 1000).toFixed(0)}K` },
              { label: fr ? "Coût d'achat" : "Purchase cost", val: compte.achat ? `${compte.achat}$` : "—" },
              { label: fr ? "Note moyenne" : "Avg note", val: notesMoy ? `${notesMoy} ✦` : "—" },
              { label: fr ? "P&L moyen / trade" : "Avg P&L/trade", val: tradeDuCompte.length ? `${Number(avgPnl) >= 0 ? "+" : ""}${avgPnl}$` : "—" },
              { label: fr ? "Jours validés" : "Valid days", val: joursValides || "0" },
              { label: fr ? "Victoires / Défaites" : "Wins / Losses", val: `${wins}W · ${losses}L` },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: i < 5 ? "1px solid #1a1a2e" : "none" }}>
                <div style={{ fontSize: 12, color: G.dim }}>{row.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{row.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Règles payout */}
        <div style={{ ...card }}>
          <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16, fontWeight: 700 }}>Règles payout</div>
          {regles ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {regles.type === "jours_gagnants" && (
                <>
                  <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>Jours gagnants requis : <span style={{ color: firm.couleur, fontWeight: 700 }}>{joursValides} / {regles.nombre}</span></div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {Array.from({ length: regles.nombre }, (_, i) => (
                      <div key={i} style={{ width: 36, height: 36, borderRadius: 8, background: i < joursValides ? firm.couleur + "30" : "#0e0e1a", border: `2px solid ${i < joursValides ? firm.couleur : "#1a1a2e"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: i < joursValides ? firm.couleur : "#333", fontWeight: 700 }}>{i < joursValides ? "✓" : i + 1}</div>
                    ))}
                  </div>
                  {regles.minParJour && <div style={{ fontSize: 11, color: G.dim, marginTop: 4 }}>Minimum par jour : <span style={{ color: "#fff" }}>${regles.minParJour}</span></div>}
                </>
              )}
              {regles.type === "profit_target" && (
                <>
                  <div style={{ fontSize: 12, color: "#aaa" }}>Objectif profit : <span style={{ color: firm.couleur, fontWeight: 700 }}>${targetMontant || "—"}</span></div>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ fontSize: 11, color: G.dim }}>Progression</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: pnlPos ? G.green : G.red }}>{pnlPos ? "+" : ""}{pnlCompte.toFixed(0)}$ / ${targetMontant || "?"}</div>
                    </div>
                    <div style={{ height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, Math.max(0, (pnlCompte / (targetMontant || 1)) * 100))}%`, height: "100%", background: firm.couleur, borderRadius: 3, transition: "width 0.5s" }} />
                    </div>
                  </div>
                </>
              )}
              {regles.type === "jours_trading" && (
                <div style={{ fontSize: 12, color: "#aaa" }}>Jours de trading requis : <span style={{ color: firm.couleur, fontWeight: 700 }}>{tradeDuCompte.length} / {regles.nombre}</span></div>
              )}
              {regles.type === "libre" && (
                <div style={{ fontSize: 12, color: G.dim, fontStyle: "italic" }}>Payout libre — aucune contrainte de jours.</div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: G.dim, fontStyle: "italic" }}>Aucune règle définie.</div>
          )}

          {/* Liens officiels */}
          {(firm.siteUrl || firm.reglesUrl) && (
            <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {firm.siteUrl && (
                <a href={firm.siteUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0e0e1a", border: `1px solid ${firm.couleur}40`, color: firm.couleur, borderRadius: 8, padding: "7px 14px", fontSize: 11, fontWeight: 700, textDecoration: "none", cursor: "pointer" }}>
                  🌐 Site officiel
                </a>
              )}
              {firm.reglesUrl && (
                <a href={firm.reglesUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0e0e1a", border: "1px solid #2a2a3e", color: "#aaa", borderRadius: 8, padding: "7px 14px", fontSize: 11, fontWeight: 700, textDecoration: "none", cursor: "pointer" }}>
                  📋 Règles officielles
                </a>
              )}
              {firm.discordUrl && (
                <a href={firm.discordUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0e0e1a", border: "1px solid #5865f220", color: "#5865f2", borderRadius: 8, padding: "7px 14px", fontSize: 11, fontWeight: 700, textDecoration: "none", cursor: "pointer" }}>
                  💬 Discord
                </a>
              )}
            </div>
          )}

          {/* Payouts history */}
          {(compte.payouts || []).length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10, fontWeight: 700 }}>Historique payouts</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[...(compte.payouts || [])].sort((a, b) => b.date > a.date ? 1 : -1).map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "6px 0", borderBottom: "1px solid #1a1a2e" }}>
                    <span style={{ color: G.dim }}>{p.date}</span>
                    <span style={{ color: G.green, fontWeight: 700 }}>+{p.montant}{p.devise || "$"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── GRAPHIQUE DE PROGRESSION VERS L'OBJECTIF ── */}
      {isEval && targetMontant && (
        <div style={{ ...card }}>
          <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16, fontWeight: 700 }}>
            📈 {fr ? "Progression vers l'objectif" : "Progression to target"}
          </div>
          {(() => {
            const sorted = [...tradeDuCompte].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
            // Points cumulatifs : commence à 0
            const points = [0];
            sorted.forEach(t => points.push((points[points.length - 1] || 0) + (t.pnl || 0)));
            const current = points[points.length - 1];
            const pct = Math.min(100, Math.max(0, Math.round((current / targetMontant) * 100)));
            const couleur = firm.couleur || G.green;

            // Mini SVG sparkline
            const W = 500, H = 100, PAD = 10;
            const maxY = Math.max(targetMontant * 1.1, ...points);
            const minY = Math.min(0, ...points);
            const rangeY = maxY - minY || 1;
            const toX = (i) => PAD + (i / Math.max(1, points.length - 1)) * (W - PAD * 2);
            const toY = (v) => H - PAD - ((v - minY) / rangeY) * (H - PAD * 2);
            const targetY = toY(targetMontant);
            const pathD = points.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
            const fillD = pathD + ` L${toX(points.length - 1).toFixed(1)},${toY(0).toFixed(1)} L${toX(0).toFixed(1)},${toY(0).toFixed(1)} Z`;

            return (
              <div>
                {/* Barre de progression */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>{fr ? "Progression" : "Progress"}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: current >= targetMontant ? G.green : couleur }}>
                    {current >= 0 ? "+" : ""}{current.toFixed(0)}$ / {targetMontant}$
                  </span>
                </div>
                <div style={{ height: 10, background: "#1a1a2e", borderRadius: 6, overflow: "hidden", marginBottom: 20 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${couleur}80, ${couleur})`, borderRadius: 6, transition: "width 0.5s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: G.dim, marginBottom: 16 }}>
                  <span>0$</span>
                  <span style={{ color: couleur, fontWeight: 700 }}>{pct}% atteint</span>
                  <span style={{ color: couleur }}>{fr ? "Objectif" : "Target"} : {targetMontant}$</span>
                </div>

                {/* Sparkline */}
                <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 120, display: "block", overflow: "visible" }}>
                  <defs>
                    <linearGradient id="progFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={couleur} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={couleur} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* Zone remplie */}
                  {points.length > 1 && <path d={fillD} fill="url(#progFill)" />}
                  {/* Ligne */}
                  {points.length > 1 && <path d={pathD} fill="none" stroke={couleur} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
                  {/* Point unique */}
                  {points.length === 1 && <circle cx={toX(0)} cy={toY(0)} r="4" fill={couleur} />}
                  {/* Ligne cible */}
                  <line x1={PAD} y1={targetY} x2={W - PAD} y2={targetY} stroke={couleur} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
                  <text x={W - PAD + 4} y={targetY + 4} fontSize="10" fill={couleur} opacity="0.8">{targetMontant}$</text>
                  {/* Ligne zéro */}
                  <line x1={PAD} y1={toY(0)} x2={W - PAD} y2={toY(0)} stroke="#374151" strokeWidth="1" />
                  {/* Point courant */}
                  {points.length > 0 && (
                    <circle cx={toX(points.length - 1)} cy={toY(current)} r="5" fill={current >= targetMontant ? G.green : couleur} stroke="#0a0a14" strokeWidth="2" />
                  )}
                </svg>

                {tradeDuCompte.length === 0 && (
                  <div style={{ textAlign: "center", fontSize: 12, color: G.dim, marginTop: 8 }}>
                    {fr ? "Ajoute ton premier trade pour voir ta progression" : "Add your first trade to see your progress"}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Derniers trades */}
      {recentTrades.length > 0 && (
        <div style={{ ...card }}>
          <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14, fontWeight: 700 }}>Derniers trades sur ce compte</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {recentTrades.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#0a0a14", borderRadius: 10, border: `1px solid ${t.pnl >= 0 ? G.green + "20" : G.red + "20"}`, borderLeft: `3px solid ${t.pnl >= 0 ? G.green : G.red}` }}>
                <div style={{ fontSize: 11, color: G.dim, minWidth: 80 }}>{t.date}</div>
                <div style={{ fontSize: 12, color: "#fff", flex: 1 }}>{t.setup || t.actif || "—"}</div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: t.pnl >= 0 ? G.green : G.red }}>{t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(0)}$</div>
                {t.note && <div style={{ fontSize: 11, color: G.dim }}>{t.note}/5 ✦</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courbe P&L du compte */}
      {tradeDuCompte.length >= 2 && (
        <div style={{ ...card }}>
          <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14, fontWeight: 700 }}>Courbe P&L</div>
          <PnlCurve trades={tradeDuCompte} height={180} positive={pnlPos} />
        </div>
      )}

    </div>
  );
}

function Dashboard({ trades, comptes, sessions = {}, onEditCompte, onNewCompte, onNewTrade, onNewSession, onGoToAnalyse, onTradeDetail, onViewCompte, onDayOpen, lang = "fr", user }) {
  const T = TR[lang]; const fr = lang === "fr";

  // ── Calculs ──
  const EVAL_TYPES = ["combine", "eval", "eval_1", "eval_2", "gauntlet_mini", "gauntlet", "challenge"];
  const aUnCompteTopstep = comptes.some(c => c.type === "Topstep");
  const aUnCompteTopstepFunded = comptes.some(c => c.type === "Topstep" && !EVAL_TYPES.includes(c.typeCompte));
  const topstepTrades = trades.filter(t => comptes.find(c => c.nom === t.compte)?.type === "Topstep");
  const soldeTopstep = topstepTrades.reduce((a, t) => a + t.pnl, 0);
  const mllTopstep = getMLL(soldeTopstep);
  const margeTopstep = aUnCompteTopstep ? (soldeTopstep - mllTopstep) : 9999;
  const lotsInfo = getLotsTopstep(soldeTopstep);
  const joursValides = topstepTrades.filter(t => t.joursPayoutValide).length;
  const soldeInitialTotal = comptes.reduce((a, c) => a + (c.soldeInitial || 0), 0);
  const allPnl = soldeInitialTotal + trades.reduce((a, t) => a + t.pnl, 0);
  const totalPayouts = comptes.reduce((a, c) => a + (c.payouts || []).reduce((s, p) => s + p.montant, 0), 0);
  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl < 0).length;
  const winRate = trades.length ? Math.round((wins / trades.length) * 100) : 0;
  const notesMoy = trades.length ? (trades.reduce((a, t) => a + t.note, 0) / trades.length).toFixed(1) : null;
  const avgPnl = trades.length ? (allPnl / trades.length).toFixed(0) : 0;
  const pnlPositif = allPnl >= 0;
  const streak = (() => { let s = 0; for (let i = trades.length - 1; i >= 0; i--) { if (trades[i].pnl > 0) s++; else break; } return s; })();
  const hasData = trades.length > 0 || comptes.length > 0;

  // Contexte spirituel
  const jour = jourAnnee();
  const contexte = getContexte(allPnl, winRate, margeTopstep, streak);
  const bibleQuote = getVersetContextuel(contexte, jour);
  const affirmQuote = getAffirmationContextuelle(contexte, jour);

  // Styles communs
  const card = { background: "linear-gradient(135deg,#0e0e1a,#0a0a14)", border: "1px solid #1a1a2e", borderRadius: 16, padding: "20px 24px" };
  const G = { green: "#00e5a0", purple: "#818cf8", red: "#ef4444", amber: "#f59e0b", muted: "#374151", dim: "#6b7280" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "4px 0" }}>

      {/* ── HEADER ── */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: G.green, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>
            {fr ? "Module" : "Module"} · <span style={{ color: "#fff" }}>Dashboard</span>
          </div>
          <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, letterSpacing: -1.5, lineHeight: 1, margin: 0 }}>
            {fr ? <>Vue d'ensemble<br /><span style={{ background: "linear-gradient(135deg,#00e5a0,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>de ton trading.</span></> : <>Overview of<br /><span style={{ background: "linear-gradient(135deg,#00e5a0,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>your trading.</span></>}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button onClick={onNewTrade} style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", color: "#818cf8", borderRadius: 12, padding: "10px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            ➕ {fr ? "Ajouter un trade" : "Add a trade"}
          </button>
          <button onClick={onNewSession} style={{ background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.3)", color: "#00e5a0", borderRadius: 12, padding: "10px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            🌅 {fr ? "Commencer une session" : "Start a session"}
          </button>
          <button data-tutorial="add-account" onClick={onNewCompte} style={{ background: "linear-gradient(135deg,#00e5a0,#00b37a)", border: "none", color: "#06060f", borderRadius: 12, padding: "10px 18px", fontSize: 12, fontWeight: 800, cursor: "pointer", boxShadow: "0 0 20px rgba(0,229,160,0.25)" }}>
            {T.addAccount}
          </button>
        </div>
      </div>

      {/* ── KPI ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          {
            label: fr ? "P&L Global (gains latents)" : "Global P&L (unrealized)",
            val: hasData ? `${pnlPositif ? "+" : ""}${allPnl.toFixed(0)}$` : "—",
            color: hasData ? (pnlPositif ? G.green : G.red) : G.muted,
            sub: hasData ? (pnlPositif ? (fr ? "En gain" : "In profit") : (fr ? "En perte" : "In loss")) : (fr ? "Aucun trade" : "No trades"),
            glow: pnlPositif ? G.green : G.red,
          },
          {
            label: fr ? "Win Rate" : "Win Rate",
            val: trades.length ? `${winRate}%` : "—",
            color: winRate >= 55 ? G.green : winRate >= 45 ? G.amber : G.red,
            sub: `${wins}W / ${losses}L`,
            glow: null,
          },
          {
            label: fr ? "Trades" : "Trades",
            val: trades.length,
            color: "#fff",
            sub: streak > 1 ? (fr ? `${streak} en série` : `${streak} in a row`) : (fr ? "Journalisés" : "Recorded"),
            glow: null,
          },
          {
            label: fr ? "Payouts reçus" : "Payouts received",
            val: totalPayouts > 0 ? `+${totalPayouts.toFixed(0)}$` : "—",
            color: totalPayouts > 0 ? G.green : G.muted,
            sub: fr ? `${comptes.length} compte${comptes.length > 1 ? "s" : ""}` : `${comptes.length} account${comptes.length > 1 ? "s" : ""}`,
            glow: null,
          },
        ].map((k, i) => (
          <div key={i} style={{ ...card, position: "relative", overflow: "hidden" }}>
            {k.glow && hasData && <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: k.glow + "15", filter: "blur(20px)", pointerEvents: "none" }} />}
            <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "monospace", color: k.color, letterSpacing: -1, lineHeight: 1, marginBottom: 6 }}>{k.val}</div>
            <div style={{ fontSize: 11, color: G.muted }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── STATS RAPIDES ── */}
      {trades.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${aUnCompteTopstepFunded ? 3 : 2},1fr)`, gap: 12 }}>
          {[
            { label: fr ? "Note moyenne" : "Avg note", val: notesMoy ? `${notesMoy} ✦` : "—", sub: fr ? "Qualité d'exécution" : "Execution quality", color: "#fff" },
            { label: fr ? "P&L moyen / trade" : "Avg P&L / trade", val: `${Number(avgPnl) >= 0 ? "+" : ""}${avgPnl}$`, sub: fr ? "Sur tous les trades" : "On all trades", color: Number(avgPnl) >= 0 ? G.green : G.red },
            ...(aUnCompteTopstepFunded ? [{ label: fr ? "Jours Topstep validés" : "Topstep valid days", val: joursValides, sub: fr ? "Jours ≥ $150" : "Days ≥ $150", color: joursValides >= 5 ? G.green : "#fff" }] : []),
          ].map((s, i) => (
            <div key={i} style={{ ...card }}>
              <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "monospace", color: s.color, letterSpacing: -1 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: G.muted, marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── LIGNE PRINCIPALE : Courbe + Spirituel ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 12 }}>

        {/* Courbe P&L */}
        <div style={{ ...card, cursor: trades.length >= 10 ? "pointer" : "default" }} onClick={() => trades.length >= 10 && onGoToAnalyse && onGoToAnalyse()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5 }}>{fr ? "Courbe P&L" : "P&L Curve"}</div>
              {trades.length > 0 && <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "monospace", color: pnlPositif ? G.green : G.red, marginTop: 2 }}>{pnlPositif ? "+" : ""}{allPnl.toFixed(0)}$</div>}
            </div>
            {trades.length >= 10 && (
              <div style={{ fontSize: 10, color: G.green, fontWeight: 700, background: G.green + "15", border: `1px solid ${G.green}30`, borderRadius: 20, padding: "4px 10px" }}>
                {fr ? "Voir analyse →" : "See analysis →"}
              </div>
            )}
          </div>
          {trades.length >= 1 ? (
            <PnlCurve trades={trades} height={200} positive={pnlPositif} onTradeClick={t => onTradeDetail && onTradeDetail(t)} />
          ) : (
            <button onClick={onNewCompte} style={{ height: 200, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "none", border: "none", cursor: "pointer", borderRadius: 12, transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#00e5a008"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <div style={{ fontSize: 32 }}>📈</div>
              <div style={{ fontSize: 13, color: G.dim, textAlign: "center", lineHeight: 1.6 }}>
                {fr ? "Ajoute ton premier trade\npour voir ta courbe P&L" : "Add your first trade\nto see your P&L curve"}
              </div>
            </button>
          )}
        </div>

        {/* Bloc spirituel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {bibleQuote && (
            <div style={{ ...card, flex: 1, borderLeft: `2px solid ${G.purple}` }}>
              <div style={{ fontSize: 9, color: G.purple, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>📖 {bibleQuote.label}</div>
              <div style={{ fontSize: 12, color: "#c4c4d4", lineHeight: 1.6, fontStyle: "italic", marginBottom: 6 }}>"{bibleQuote.texte}"</div>
              <div style={{ fontSize: 10, color: G.muted, fontWeight: 700 }}>— {bibleQuote.ref}</div>
            </div>
          )}
          {affirmQuote && (
            <div style={{ ...card, flex: 1, borderLeft: `2px solid ${G.green}` }}>
              <div style={{ fontSize: 9, color: G.green, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>💡 {fr ? "Affirmation" : "Affirmation"}</div>
              <div style={{ fontSize: 12, color: "#c4c4d4", lineHeight: 1.6, fontStyle: "italic" }}>"{affirmQuote.texte}"</div>
            </div>
          )}
        </div>
      </div>

      {/* ── CALENDRIER DE TRADING ── */}
      <UnifiedCalendar trades={trades} sessions={sessions} user={user} onDayOpen={onDayOpen} lang={lang} />

      {/* ── COMPTES ── */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: G.dim, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>{fr ? "Mes comptes" : "My accounts"} · <span style={{ color: G.green }}>{comptes.length}</span></div>
        </div>
        {comptes.length === 0 ? (
          <div style={{ ...card, textAlign: "center", padding: "40px 24px" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏦</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{fr ? "Aucun compte ajouté" : "No account yet"}</div>
            <div style={{ fontSize: 12, color: G.dim, marginBottom: 16 }}>{fr ? "Ajoute ton premier compte prop firm pour commencer." : "Add your first prop firm account to get started."}</div>
            <button onClick={onNewCompte} style={{ background: "linear-gradient(135deg,#00e5a0,#00b37a)", border: "none", color: "#06060f", borderRadius: 10, padding: "10px 20px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>{T.addAccount}</button>
          </div>
        ) : (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12,
            ...(comptes.length > 4 ? { maxHeight: 420, overflowY: "auto", paddingRight: 4, scrollbarWidth: "thin" } : {}),
          }}>
            {comptes.map(c => {
              const firm = PROP_FIRMS_CATALOG[c.type] || PROP_FIRMS_CATALOG["Autre"];
              const tradeDuCompte = trades.filter(t => t.compte === c.nom);
              const pnlCompte = tradeDuCompte.reduce((a, t) => a + t.pnl, 0);
              const payoutsCompte = (c.payouts || []).reduce((a, p) => a + p.montant, 0);
              const pnlPos = pnlCompte >= 0;
              const isTopstep = c.type === "Topstep";
              const marge = isTopstep ? margeTopstep : null;

              return (
                <div key={c.id}
                  onClick={() => onViewCompte && onViewCompte(c)}
                  style={{ ...card, cursor: "pointer", position: "relative", overflow: "hidden", transition: "transform .15s, border-color .15s", borderColor: c.blown ? "#ef444440" : firm.couleur + "40", opacity: c.blown ? 0.75 : 1 }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {/* Glow */}
                  <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: c.blown ? "#ef444412" : firm.couleur + "12", filter: "blur(30px)", pointerEvents: "none" }} />
                  {/* Badge cramé */}
                  {c.blown && <div style={{ position: "absolute", top: 10, right: 10, fontSize: 10, fontWeight: 800, color: "#ef4444", background: "#ef444420", border: "1px solid #ef444440", borderRadius: 20, padding: "2px 8px" }}>🔥 CRAMÉ</div>}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <FirmLogo firm={firm} size={20} style={{ borderRadius: 4 }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: firm.couleur, textTransform: "uppercase", letterSpacing: 1 }}>{c.type}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{c.nom}</div>
                      {c.numero && <div style={{ fontSize: 10, color: G.dim, marginTop: 2 }}>#{c.numero}</div>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "monospace", color: pnlPos ? G.green : G.red }}>{pnlPos ? "+" : ""}{pnlCompte.toFixed(0)}$</div>
                      <div style={{ fontSize: 10, color: G.dim, marginTop: 2 }}>{fr ? "P&L trades" : "Trade P&L"}</div>
                    </div>
                  </div>

                  <div style={{ height: 1, background: "#1a1a2e", marginBottom: 12 }} />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: G.dim, marginBottom: 2 }}>{fr ? "Taille" : "Size"}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>${(c.taille / 1000).toFixed(0)}K</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: G.dim, marginBottom: 2 }}>{fr ? "Payouts reçus" : "Payouts"}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: payoutsCompte > 0 ? G.green : G.muted }}>{payoutsCompte > 0 ? `+${payoutsCompte.toFixed(0)}$` : "—"}</div>
                    </div>
                    {isTopstep && marge !== null && (
                      <div style={{ gridColumn: "1/-1" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <div style={{ fontSize: 10, color: G.dim }}>MLL — marge restante</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: getDrawdownColor(marge) }}>{marge.toFixed(0)}$</div>
                        </div>
                        <div style={{ height: 3, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: `${Math.min(100, (marge / 2000) * 100)}%`, height: "100%", background: getDrawdownColor(marge), borderRadius: 2, transition: "width 0.5s" }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}



// ─── JOURNAL ──────────────────────────────────────────────────────────────────
function Journal({ trades, onNew, onDetail, initialVue = "liste", lang = "fr" }) {
  const T = TR[lang];
  const [showPanel, setShowPanel] = useState(false);
  const [filters, setFilters] = useState({ compte: "Tous", resultat: "Tous", direction: "Tous", setup: "Tous", dateFrom: "", dateTo: "" });
  const [sort, setSort] = useState({ key: "date", dir: "desc" });
  const comptes = ["Tous", ...new Set(trades.map(t => t.compte))];
  const setups = ["Tous", ...new Set(trades.map(t => t.setup).filter(Boolean))];
  const activeCount = Object.entries(filters).filter(([k, v]) => v !== "Tous" && v !== "").length;

  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const resetFilters = () => setFilters({ compte: "Tous", resultat: "Tous", direction: "Tous", setup: "Tous", dateFrom: "", dateTo: "" });

  const SORT_OPTIONS = [
    { key: "date", dir: "desc", label: T.sortDateDesc },
    { key: "date", dir: "asc",  label: T.sortDateAsc },
    { key: "pnl",  dir: "desc", label: T.sortGainDesc },
    { key: "pnl",  dir: "asc",  label: T.sortGainAsc },
    { key: "note", dir: "desc", label: T.sortNoteDesc },
    { key: "rr",   dir: "desc", label: T.sortRRDesc },
  ];

  const filtered = trades
    .filter(t => {
      if (filters.compte !== "Tous" && t.compte !== filters.compte) return false;
      if (filters.resultat === T.gain && t.pnl <= 0) return false;
      if (filters.resultat === T.loss && t.pnl >= 0) return false;
      if (filters.direction !== "Tous" && t.direction !== filters.direction) return false;
      if (filters.setup !== "Tous" && t.setup !== filters.setup) return false;
      if (filters.dateFrom && t.date < filters.dateFrom) return false;
      if (filters.dateTo && t.date > filters.dateTo) return false;
      return true;
    })
    .sort((a, b) => {
      const aVal = sort.key === "date" ? `${a.date}T${a.heure||""}` : a[sort.key];
      const bVal = sort.key === "date" ? `${b.date}T${b.heure||""}` : b[sort.key];
      if (sort.dir === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  const hasFilter = activeCount > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2, flex: 1 }}>{T.allEntries}</div>
        <select value={sort.key + ":" + sort.dir} onChange={e => { const [k,d] = e.target.value.split(":"); setSort({key:k,dir:d}); }}
          style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.textDim, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>
          {SORT_OPTIONS.map((o, i) => <option key={i} value={o.key+":"+o.dir}>{o.label}</option>)}
        </select>
        <button onClick={() => setShowPanel(p => !p)}
          style={{ background: activeCount > 0 ? COLORS.cyan + "20" : COLORS.card, border: `1px solid ${activeCount > 0 ? COLORS.cyan : COLORS.border}`, color: activeCount > 0 ? COLORS.cyan : COLORS.textDim, borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>
          {T.filters}{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        {onNew && <button onClick={onNew} style={{ background: COLORS.cyan + "20", border: `1px solid ${COLORS.cyan}40`, color: COLORS.cyan, borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>+ {T.newTrade}</button>}
      </div>

      {/* Filter panel */}
      {showPanel && (
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            {[
              { label: T.account, key: "compte", opts: comptes },
              { label: T.result, key: "resultat", opts: ["Tous", T.gain, T.loss] },
              { label: T.direction, key: "direction", opts: ["Tous", "LONG", "SHORT"] },
              { label: "Setup", key: "setup", opts: setups },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 4 }}>{f.label}</div>
                <select value={filters[f.key]} onChange={e => setF(f.key, e.target.value)}
                  style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 6, padding: "5px 8px", fontSize: 12 }}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          {activeCount > 0 && <button onClick={resetFilters} style={{ marginTop: 8, background: "transparent", border: "none", color: COLORS.red, fontSize: 11, cursor: "pointer" }}>{T.resetFilters}</button>}
        </Card>
      )}

      {/* Trade list */}
      {filtered.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "40px 20px", color: COLORS.muted }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
          <div>{trades.length === 0 ? T.noTradesYet : T.noResult}</div>
          {trades.length === 0 && onNew && <button onClick={onNew} style={{ marginTop: 12, background: COLORS.cyan + "20", border: `1px solid ${COLORS.cyan}40`, color: COLORS.cyan, borderRadius: 8, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>+ {T.newTrade}</button>}
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 10, color: COLORS.muted }}>{T.tradeCount(filtered.length, trades.length, hasFilter)}</div>
          {filtered.map(t => {
            const pnlC = t.pnl >= 0 ? COLORS.green : COLORS.red;
            return (
              <div key={t.id} onClick={() => onDetail && onDetail(t)}
                style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${pnlC}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: COLORS.muted }}>{t.date}</span>
                    <Tag color={t.direction === "LONG" ? COLORS.green : COLORS.red}>{t.direction}</Tag>
                    {t.setup && <Tag color={COLORS.amber}>{t.setup}</Tag>}
                    <span style={{ fontSize: 11, color: COLORS.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.compte}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 11, color: COLORS.textDim }}>
                    <span>{t.actif}</span>
                    {t.rr ? <span>R:R {t.rr}</span> : null}
                    {t.note ? <span>⭐{t.note}</span> : null}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: pnlC }}>{t.pnl >= 0 ? "+" : ""}{t.pnl}$</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


function DonutChart({ data, size = 120 }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 50); return () => clearTimeout(t); }, []);
  const total = data.reduce((a, d) => a + d.value, 0);
  if (total === 0) return null;
  const r = 48, cx = size / 2, cy = size / 2, stroke = 4, circumference = 2 * Math.PI * r;
  const gap = 3;
  let offset = 0;
  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const len = Math.max(0, pct * circumference - gap);
    const slice = { ...d, pct, len, offset };
    offset += pct * circumference;
    return slice;
  });
  const pct0 = Math.round((data[0]?.value / total) * 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <style>{`@keyframes donut-spin { from { stroke-dashoffset: ${circumference}; } to { stroke-dashoffset: 0; } }`}</style>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#12122a" strokeWidth={stroke} />
      {slices.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${animated ? s.len : 0} ${circumference}`}
          strokeDashoffset={-s.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: `stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.12}s`, filter: `drop-shadow(0 0 4px ${s.color}60)` }}
        />
      ))}
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">{pct0}%</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="#4a4a6a" fontWeight="600">TRADES</text>
    </svg>
  );
}

function AnalysePage({ trades, comptes, onDetail, lang = "fr", user }) {
  const authFetch = makeAuthFetch(user);
  const T = TR[lang]; const fr = lang === "fr";
  const MIN_TRADES = 5;
  const G = { green: "#00e5a0", red: "#ef4444", amber: "#f59e0b", purple: "#818cf8", cyan: "#00d4ff", dim: "#6b7280", muted: "#374151" };

  if (trades.length < MIN_TRADES) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔬</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>{T.notEnoughTrades}</div>
          <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6 }}>{T.notEnoughDesc(MIN_TRADES)}</div>
          <div style={{ background: COLORS.bg, borderRadius: 10, padding: 14, maxWidth: 280, margin: "16px auto 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.textDim, marginBottom: 6 }}>
              <span>{T.progression}</span>
              <span style={{ color: COLORS.cyan, fontWeight: 700 }}>{trades.length} / {MIN_TRADES}</span>
            </div>
            <ProgressBar value={trades.length} max={MIN_TRADES} color={COLORS.cyan} />
          </div>
        </Card>
      </div>
    );
  }

  const wins = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl < 0);
  const winRate = Math.round((wins.length / trades.length) * 100);
  const avgPnl = (trades.reduce((a, t) => a + t.pnl, 0) / trades.length).toFixed(0);
  const avgRR = trades.filter(t => t.rr).length ? (trades.filter(t => t.rr).reduce((a, t) => a + t.rr, 0) / trades.filter(t => t.rr).length).toFixed(2) : "—";
  const planRespect = trades.filter(t => t.respect === "Oui");
  const pctRespect = Math.round((planRespect.length / trades.length) * 100);
  const sorted = [...trades].sort((a, b) => `${a.date}T${a.heure||""}` > `${b.date}T${b.heure||""}` ? 1 : -1);

  // ── Groupements ──
  const grp = (arr, key) => arr.reduce((acc, t) => { const k = t[key] || "—"; if (!acc[k]) acc[k] = []; acc[k].push(t); return acc; }, {});

  const setupGroups = grp(trades.filter(t => t.setup), "setup");
  const setupStats = Object.entries(setupGroups).map(([s, arr]) => ({ label: s, count: arr.length, wr: Math.round((arr.filter(t => t.pnl > 0).length / arr.length) * 100), pnl: arr.reduce((a, t) => a + t.pnl, 0), avgPnl: arr.reduce((a, t) => a + t.pnl, 0) / arr.length })).sort((a, b) => b.count - a.count);

  const dirGroups = grp(trades.filter(t => t.direction), "direction");
  const dirStats = Object.entries(dirGroups).map(([d, arr]) => ({ label: d, count: arr.length, wr: Math.round((arr.filter(t => t.pnl > 0).length / arr.length) * 100), pnl: arr.reduce((a, t) => a + t.pnl, 0) }));

  const propGroups = grp(trades, "compte");
  const propStats = Object.entries(propGroups).map(([c, arr]) => ({ label: c, pnl: arr.reduce((a, t) => a + t.pnl, 0), count: arr.length })).sort((a, b) => b.pnl - a.pnl);

  const emotionGroups = {};
  trades.forEach(t => { const em = t.emotion_avant; if (!em) return; (Array.isArray(em) ? em : em.split(",").map(e => e.trim())).forEach(e => { if (!e) return; if (!emotionGroups[e]) emotionGroups[e] = []; emotionGroups[e].push(t); }); });
  const emotionStats = Object.entries(emotionGroups).map(([e, arr]) => ({ label: e, avg: arr.reduce((a, t) => a + t.pnl, 0) / arr.length, count: arr.length })).sort((a, b) => b.avg - a.avg);

  const dayGroups = {};
  trades.forEach(t => { const d = new Date(t.date + "T12:00:00").toLocaleDateString(fr ? "fr-FR" : "en-US", { weekday: "long" }); if (!dayGroups[d]) dayGroups[d] = []; dayGroups[d].push(t); });
  const dayStats = Object.entries(dayGroups).map(([d, arr]) => ({ label: d, pnl: arr.reduce((a, t) => a + t.pnl, 0), count: arr.length, wr: Math.round((arr.filter(t => t.pnl > 0).length / arr.length) * 100) })).sort((a, b) => b.pnl - a.pnl);

  const actifGroups = grp(trades.filter(t => t.actif), "actif");
  const actifStats = Object.entries(actifGroups).map(([a, arr]) => ({ label: a, count: arr.length, wr: Math.round((arr.filter(t => t.pnl > 0).length / arr.length) * 100), pnl: arr.reduce((a, t) => a + t.pnl, 0) })).sort((a, b) => b.count - a.count);

  const impulsifTrades = trades.filter(t => t.impulsif);
  const nonImpulsifTrades = trades.filter(t => !t.impulsif);
  const avgImpulsif = impulsifTrades.length ? (impulsifTrades.reduce((a, t) => a + t.pnl, 0) / impulsifTrades.length) : null;
  const avgNonImpulsif = nonImpulsifTrades.length ? (nonImpulsifTrades.reduce((a, t) => a + t.pnl, 0) / nonImpulsifTrades.length) : null;

  // ── 3 blocs d'insights en langage naturel ──
  const goodSentences = [];
  const improveSentences = [];
  const avoidSentences = [];

  const goodSetups = setupStats.filter(s => s.count >= 3 && s.wr >= 60);
  const badSetups = setupStats.filter(s => s.count >= 3 && s.wr < 40);
  const midSetups = setupStats.filter(s => s.count >= 3 && s.wr >= 40 && s.wr < 60);

  if (goodSetups.length > 0) {
    const best = goodSetups[0];
    goodSentences.push(`Ton setup "${best.label}" est clairement ton point fort avec ${best.wr}% de win rate sur ${best.count} trades — c'est là que tu génères le plus de valeur, continue à le travailler en priorité.`);
  }
  if (goodSetups.length > 1) {
    const others = goodSetups.slice(1).map(s => `"${s.label}" (${s.wr}%)`).join(", ");
    goodSentences.push(`Les setups ${others} fonctionnent aussi bien au-dessus de 60% — tu peux y allouer plus de taille en toute confiance.`);
  }

  const bestDir = [...dirStats].sort((a, b) => b.wr - a.wr)[0];
  const worstDir = [...dirStats].sort((a, b) => a.wr - b.wr)[0];
  if (bestDir && bestDir.wr >= 60) goodSentences.push(`Tu es nettement meilleur en ${bestDir.label} avec ${bestDir.wr}% de réussite — c'est ta direction naturelle, exploite-la davantage.`);

  if (dayStats.length > 0 && dayStats[0].pnl > 0 && dayStats[0].count >= 2) {
    const d = dayStats[0];
    goodSentences.push(`Le ${d.label} est ton meilleur jour de la semaine (${d.wr}% WR, +${d.pnl.toFixed(0)}$ cumulé) — assure-toi d'être dans les meilleures conditions ce jour-là.`);
  }

  if (emotionStats.length > 0 && emotionStats[0].avg > 0 && emotionStats[0].count >= 2) {
    const e = emotionStats[0];
    goodSentences.push(`Quand tu trades en état "${e.label}", ton résultat moyen est de +${e.avg.toFixed(0)}$ par trade — c'est ton état optimal, apprends à le reproduire.`);
  }

  if (avgNonImpulsif !== null && avgImpulsif !== null && avgNonImpulsif > avgImpulsif) {
    goodSentences.push(`Lorsque tu respectes ton plan de trading, tu dégages en moyenne +${avgNonImpulsif.toFixed(0)}$ par trade — la discipline est ta meilleure edge.`);
  }

  if (pctRespect >= 70) goodSentences.push(`Tu respectes ton plan ${pctRespect}% du temps, c'est un excellent niveau de discipline — maintiens cet effort.`);

  if (goodSentences.length === 0) goodSentences.push("Continue à enregistrer tes trades, les patterns positifs vont commencer à émerger d'ici quelques sessions.");

  // Améliorer
  if (midSetups.length > 0) {
    const s = midSetups[0];
    improveSentences.push(`Ton setup "${s.label}" tourne autour de ${s.wr}% — il n'est pas mauvais mais pas encore fiable. Analyse ce qui différencie tes trades gagnants des perdants sur ce setup spécifiquement.`);
  }
  if (pctRespect >= 50 && pctRespect < 70) improveSentences.push(`Tu respectes ton plan ${pctRespect}% du temps. C'est un bon début mais il reste une marge de progression — chaque écart au plan est une perte potentielle évitable.`);
  if (parseFloat(avgRR) > 0 && parseFloat(avgRR) < 1.5) improveSentences.push(`Ton R/R moyen est de ${avgRR} — essaie de viser au moins 1.5 en déplaçant ton stop ou en laissant courir tes gagnants plus longtemps.`);
  if (dayStats.length >= 3) {
    const midDays = dayStats.filter(d => d.pnl >= 0 && d.count >= 2).slice(1);
    if (midDays.length > 0) improveSentences.push(`Le ${midDays[0].label} est correct mais pas exceptionnel. Travaille ta routine pré-session ce jour-là pour en tirer plus de valeur.`);
  }
  if (improveSentences.length === 0) improveSentences.push("Tes statistiques ne montrent pas encore de zone d'amélioration claire. Continue à renseigner tes trades avec précision pour affiner l'analyse.");

  // Éviter
  if (badSetups.length > 0) {
    const s = badSetups[0];
    avoidSentences.push(`Le setup "${s.label}" te coûte de l'argent avec seulement ${s.wr}% de win rate sur ${s.count} trades (${s.pnl.toFixed(0)}$ de P&L cumulé) — arrête de le prendre jusqu'à avoir compris pourquoi il échoue.`);
  }
  if (worstDir && worstDir.wr < 40 && dirStats.length > 1) avoidSentences.push(`Tes trades en ${worstDir.label} ne fonctionnent pas (${worstDir.wr}% WR) — évite cette direction ou réduis drastiquement ta taille jusqu'à avoir résolu le problème.`);
  if (dayStats.length > 0) {
    const worst = dayStats[dayStats.length - 1];
    if (worst.pnl < 0 && worst.count >= 2) avoidSentences.push(`Le ${worst.label} est ton pire jour de la semaine avec ${worst.pnl.toFixed(0)}$ de pertes cumulées — envisage sérieusement de ne pas trader ce jour-là.`);
  }
  if (emotionStats.length > 0) {
    const worst = emotionStats[emotionStats.length - 1];
    if (worst.avg < 0 && worst.count >= 2) avoidSentences.push(`Quand tu es "${worst.label}", tu perds en moyenne ${worst.avg.toFixed(0)}$ par trade — c'est un signal clair : dans cet état, reste hors du marché.`);
  }
  if (avgImpulsif !== null && avgImpulsif < 0) avoidSentences.push(`Tes trades impulsifs te coûtent en moyenne ${avgImpulsif.toFixed(0)}$ chacun, contre +${avgNonImpulsif?.toFixed(0) || "?"}$ en trading normal — l'impulsivité est ton ennemi numéro un.`);
  if (pctRespect < 50) avoidSentences.push(`Tu ne respectes ton plan que ${pctRespect}% du temps. Chaque déviation non planifiée est une source de perte évitable — la discipline n'est pas optionnelle.`);
  if (avoidSentences.length === 0) avoidSentences.push("Aucun pattern négatif significatif détecté pour l'instant — continue à journaliser avec précision pour que l'analyse reste fiable.");

  const card = { background: "linear-gradient(135deg,#0e0e1a,#0a0a14)", border: "1px solid #1a1a2e", borderRadius: 16, padding: "20px 24px" };

  // ── IA ──
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [aiKey, setAiKey] = useState(() => localStorage.getItem("spirit_anthropic_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const saveAiKey = (k) => { setAiKey(k); localStorage.setItem("spirit_anthropic_key", k); };

  const runAiAnalysis = async () => {
    if (!aiKey) { setShowKeyInput(true); return; }
    setAiLoading(true); setAiResult(null); setAiError(null);
    const stats = {
      totalTrades: trades.length, winRate, avgPnl: Number(avgPnl), avgRR,
      pctRespectPlan: pctRespect,
      setupStats: setupStats.map(s => ({ setup: s.label, trades: s.count, winRate: s.wr, pnl: Math.round(s.pnl) })),
      directionStats: dirStats.map(d => ({ direction: d.label, trades: d.count, winRate: d.wr, pnl: Math.round(d.pnl) })),
      jourStats: dayStats.map(d => ({ jour: d.label, trades: d.count, winRate: d.wr, pnl: Math.round(d.pnl) })),
      emotionStats: emotionStats.slice(0, 6).map(e => ({ emotion: e.label, trades: e.count, avgPnl: Math.round(e.avg) })),
      tradesImpulsifs: impulsifTrades.length, avgPnlImpulsif: avgImpulsif ? Math.round(avgImpulsif) : null,
      avgPnlNonImpulsif: avgNonImpulsif ? Math.round(avgNonImpulsif) : null,
      actifStats: actifStats.map(a => ({ actif: a.label, trades: a.count, winRate: a.wr, pnl: Math.round(a.pnl) })),
    };
    try {
      const res = await authFetch("/api/ai-analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stats, apiKey: aiKey }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiResult(data.text);
    } catch (e) { setAiError(e.message); }
    setAiLoading(false);
  };

  const parseAiSections = (text) => {
    const sections = [
      { key: "marche", title: "✅ Ce qui marche", color: G.green, content: "" },
      { key: "ameliorer", title: "📈 Ce que je dois améliorer", color: G.amber, content: "" },
      { key: "eviter", title: "🚨 Ce que je dois absolument éviter", color: G.red, content: "" },
    ];
    const patterns = [/\*\*CE QUI MARCHE\*\*/i, /\*\*CE QUE TU DOIS AM[EÉ]LIORER\*\*/i, /\*\*CE QUE TU DOIS ABSOLUMENT [EÉ]VITER\*\*/i];
    let current = -1;
    let inConclusion = false;
    const conclusionLines = [];

    text.split("\n").forEach(line => {
      // Séparateur --- ou ligne vide après 3e section = début conclusion
      if (current === 2 && /^---+$/.test(line.trim())) { inConclusion = true; return; }
      if (inConclusion) { if (line.trim()) conclusionLines.push(line.replace(/\*\*/g, "").trim()); return; }
      const matched = patterns.findIndex(p => p.test(line));
      if (matched !== -1) { current = matched; return; }
      if (current >= 0 && line.trim()) sections[current].content += (sections[current].content ? "\n" : "") + line.replace(/\*\*/g, "").trim();
    });

    // fallback si pas de headers trouvés
    if (sections.every(s => !s.content)) {
      const paras = text.split(/\n\n+/).filter(p => p.trim());
      sections[0].content = paras[0] || "";
      sections[1].content = paras[1] || "";
      sections[2].content = paras[2] || "";
      return { sections, conclusion: paras[3] || "" };
    }

    return { sections, conclusion: conclusionLines.join(" ") };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── ANALYSE IA (pleine largeur) ── */}
      <div style={{ ...card, border: "1px solid #818cf830", background: "linear-gradient(135deg,#0d0d1e,#0a0a14)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: aiResult ? 20 : 0 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#818cf8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>✦ Analyse par IA</div>
            {!aiResult && !aiLoading && <div style={{ fontSize: 12, color: "#555" }}>Claude analyse tes {trades.length} trades et te donne des conseils personnalisés.</div>}
          </div>
          {!aiLoading && (
            <button onClick={runAiAnalysis} style={{ background: "linear-gradient(135deg,#818cf8,#6366f1)", border: "none", color: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, boxShadow: "0 4px 16px #818cf830" }}>
              {aiResult ? "🔄 Relancer" : "✦ Analyser mes trades"}
            </button>
          )}
          {aiLoading && (
            <div style={{ fontSize: 11, color: "#818cf8", fontWeight: 700 }}>Analyse en cours par l'IA…</div>
          )}
        </div>
        {aiLoading && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", marginBottom: 8 }}>
              <span>Analyse en cours…</span>
              <span style={{ color: "#818cf8" }}>IA</span>
            </div>
            <div style={{ height: 4, background: "#1a1a2e", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg, #818cf8, #6366f1, #818cf8)", backgroundSize: "200% 100%", borderRadius: 4, animation: "shimmer 1.5s linear infinite" }} />
            </div>
          </div>
        )}
        {(showKeyInput || (!aiKey && !aiResult)) && (
          <div style={{ marginTop: 14, background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.2)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#818cf8", fontWeight: 700, marginBottom: 8 }}>🔑 Clé API Anthropic requise</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 10 }}>
              Obtiens ta clé sur <span style={{ color: "#818cf8" }}>console.anthropic.com</span> → API Keys. Elle est sauvegardée localement.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="password"
                placeholder="sk-ant-api03-..."
                value={aiKey}
                onChange={e => setAiKey(e.target.value)}
                style={{ flex: 1, background: "#0a0a14", border: "1px solid #2a2a3e", borderRadius: 8, padding: "9px 12px", color: "#e5e7eb", fontSize: 12, outline: "none", fontFamily: "monospace" }}
              />
              <button
                onClick={() => { saveAiKey(aiKey); setShowKeyInput(false); }}
                disabled={!aiKey.startsWith("sk-")}
                style={{ background: aiKey.startsWith("sk-") ? "#818cf8" : "#1a1a2e", border: "none", color: aiKey.startsWith("sk-") ? "#fff" : "#555", borderRadius: 8, padding: "0 16px", fontSize: 12, fontWeight: 700, cursor: aiKey.startsWith("sk-") ? "pointer" : "default" }}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        )}
        {aiKey && !showKeyInput && !aiResult && !aiLoading && (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 10, color: "#2a6e2a", background: "#00e5a010", borderRadius: 6, padding: "3px 8px", fontWeight: 700 }}>✓ Clé configurée</div>
            <button onClick={() => { setShowKeyInput(true); setAiKey(""); }} style={{ fontSize: 10, color: "#555", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Modifier</button>
          </div>
        )}
        {aiError && <div style={{ marginTop: 12, fontSize: 12, color: "#ef4444", background: "#ef444410", borderRadius: 8, padding: "10px 14px" }}>⚠️ {aiError}</div>}
        {aiResult && (() => {
          const { sections, conclusion } = parseAiSections(aiResult);
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {sections.map((s, i) => (
                  <div key={i} style={{ background: "#0a0a14", border: `1px solid ${s.color}25`, borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: s.color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>{s.title}</div>
                    {s.content.split("\n").map((line, j) => (
                      <p key={j} style={{ margin: "0 0 8px", fontSize: 12, color: "#c4c4d4", lineHeight: 1.75 }}>{line}</p>
                    ))}
                  </div>
                ))}
              </div>
              {conclusion && (
                <div style={{ background: "linear-gradient(135deg,#0d0d20,#0a0a14)", border: "1px solid #818cf830", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 18, flexShrink: 0 }}>✦</div>
                  <p style={{ margin: 0, fontSize: 13, color: "#c4c4d4", lineHeight: 1.75, fontStyle: "italic" }}>{conclusion}</p>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {[
          { label: "Win Rate", val: `${winRate}%`, color: winRate >= 50 ? G.green : G.amber, sub: `${wins.length}W / ${losses.length}L` },
          { label: "P&L moyen/trade", val: `${avgPnl >= 0 ? "+" : ""}${avgPnl}$`, color: avgPnl >= 0 ? G.green : G.red, sub: `${trades.length} trades` },
          { label: "R/R moyen", val: avgRR, color: G.cyan, sub: "" },
          { label: "Respect du plan", val: `${pctRespect}%`, color: pctRespect >= 70 ? G.green : G.amber, sub: `${planRespect.length}/${trades.length}` },
        ].map((k, i) => (
          <div key={i} style={{ ...card }}>
            <div style={{ fontSize: 10, color: G.dim, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color: k.color }}>{k.val}</div>
            <div style={{ fontSize: 10, color: G.muted, marginTop: 5 }}>{k.sub}</div>
          </div>
        ))}
      </div>

          {/* ── COURBE P&L + CAMEMBERTS intégrés (pleine largeur) ── */}
      <div style={{ ...card }}>
        <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12, fontWeight: 700 }}>Courbe P&L cumulative</div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center" }}>

          {/* Gauche : Win/Loss + Long/Short */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            {/* Win / Loss */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 9, color: G.dim, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Win / Loss</div>
              <DonutChart size={100} data={[
                { value: wins.length, color: G.green },
                { value: losses.length, color: G.red },
              ]} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: G.green, boxShadow: `0 0 5px ${G.green}` }} />
                  <div style={{ fontSize: 10, color: "#aaa" }}>Wins</div>
                  <div style={{ fontSize: 10, color: G.green, fontWeight: 600 }}>{wins.length}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: G.red, boxShadow: `0 0 5px ${G.red}` }} />
                  <div style={{ fontSize: 10, color: "#aaa" }}>Losses</div>
                  <div style={{ fontSize: 10, color: G.red, fontWeight: 600 }}>{losses.length}</div>
                </div>
              </div>
            </div>
            {/* Long / Short */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 9, color: G.dim, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>L / S</div>
              <DonutChart size={100} data={[
                { value: dirGroups["LONG"]?.length || 0, color: G.green },
                { value: dirGroups["SHORT"]?.length || 0, color: G.purple },
              ]} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {dirStats.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: d.label === "LONG" ? G.green : G.purple, boxShadow: `0 0 5px ${d.label === "LONG" ? G.green : G.purple}` }} />
                    <div style={{ fontSize: 10, color: "#aaa" }}>{d.label}</div>
                    <div style={{ fontSize: 10, color: d.wr >= 50 ? G.green : G.red, fontWeight: 600 }}>{d.wr}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Centre : courbe */}
          <PnlCurve trades={sorted} height={260} onTradeClick={t => onDetail && onDetail(t)} />

          {/* Droite : Setups + Actifs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            {setupStats.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 9, color: G.dim, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Setups</div>
                <DonutChart size={100} data={setupStats.slice(0, 5).map((s, i) => ({ value: s.count, color: [G.green, G.purple, G.amber, G.cyan, G.red][i] }))} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {setupStats.slice(0, 5).map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: [G.green, G.purple, G.amber, G.cyan, G.red][i], flexShrink: 0, boxShadow: `0 0 4px ${[G.green, G.purple, G.amber, G.cyan, G.red][i]}` }} />
                      <div style={{ fontSize: 10, color: "#aaa", maxWidth: 65, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {actifStats.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 9, color: G.dim, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Actifs</div>
                <DonutChart size={100} data={actifStats.slice(0, 5).map((s, i) => ({ value: s.count, color: [G.cyan, G.amber, G.green, G.purple, G.red][i] }))} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {actifStats.slice(0, 5).map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: [G.cyan, G.amber, G.green, G.purple, G.red][i], flexShrink: 0, boxShadow: `0 0 4px ${[G.cyan, G.amber, G.green, G.purple, G.red][i]}` }} />
                      <div style={{ fontSize: 10, color: "#aaa" }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: s.wr >= 50 ? G.green : G.red, fontWeight: 600 }}>{s.wr}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── SECTIONS VERTICALES ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ══ PSYCHOLOGIE (en premier) ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 10, color: G.purple, textTransform: "uppercase", letterSpacing: 2, fontWeight: 800, paddingLeft: 4 }}>🧠 Psychologie & Comportement</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {/* Émotions */}
            {emotionStats.length > 0 && (
              <div style={{ ...card }}>
                <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, fontWeight: 700 }}>P&L moyen par émotion</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {emotionStats.slice(0, 7).map((e, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#0a0a14", borderRadius: 8, borderLeft: `3px solid ${e.avg >= 0 ? G.green : G.red}` }}>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{e.label} <span style={{ color: G.dim, fontSize: 10 }}>×{e.count}</span></div>
                      <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: e.avg >= 0 ? G.green : G.red }}>{e.avg >= 0 ? "+" : ""}{e.avg.toFixed(0)}$</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Respect du plan */}
            <div style={{ ...card }}>
              <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, fontWeight: 700 }}>Respect du plan</div>
              {[
                { label: "✅ Respecté", val: trades.filter(t => t.respect === "Oui").length, color: G.green },
                { label: "⚠️ Partiel", val: trades.filter(t => t.respect === "Partiel").length, color: G.amber },
                { label: "❌ Non respecté", val: trades.filter(t => t.respect === "Non").length, color: G.red },
              ].map((r, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aaa", marginBottom: 4 }}>
                    <span>{r.label}</span>
                    <span style={{ color: r.color, fontWeight: 700 }}>{r.val} ({trades.length ? Math.round(r.val / trades.length * 100) : 0}%)</span>
                  </div>
                  <div style={{ height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${trades.length ? r.val / trades.length * 100 : 0}%`, height: "100%", background: r.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Impulsivité */}
            {impulsifTrades.length > 0 && (
              <div style={{ ...card, borderLeft: `3px solid ${G.amber}` }}>
                <div style={{ fontSize: 10, color: G.amber, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, fontWeight: 700 }}>⚠️ Trades impulsifs</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: G.dim, marginBottom: 6 }}>Impulsifs ({impulsifTrades.length})</div>
                    <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "monospace", color: avgImpulsif >= 0 ? G.green : G.red }}>{avgImpulsif >= 0 ? "+" : ""}{avgImpulsif?.toFixed(0)}$/trade</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: G.dim, marginBottom: 6 }}>Normaux ({nonImpulsifTrades.length})</div>
                    <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "monospace", color: avgNonImpulsif >= 0 ? G.green : G.red }}>{avgNonImpulsif >= 0 ? "+" : ""}{avgNonImpulsif?.toFixed(0)}$/trade</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Sommeil + Discipline */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {(() => {
              const sommeilGroups = {};
              trades.forEach(t => { if (t.qualite_sommeil) { const k = t.qualite_sommeil; if (!sommeilGroups[k]) sommeilGroups[k] = []; sommeilGroups[k].push(t); } });
              const sommeilStats = Object.entries(sommeilGroups).map(([k, arr]) => ({ label: `${k}★`, avg: arr.reduce((a, t) => a + t.pnl, 0) / arr.length, count: arr.length })).sort((a, b) => a.label.localeCompare(b.label));
              if (sommeilStats.length < 2) return null;
              return (
                <div style={{ ...card }}>
                  <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, fontWeight: 700 }}>😴 Qualité de sommeil → P&L</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {sommeilStats.map((s, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#0a0a14", borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: "#aaa" }}>{s.label} <span style={{ color: G.dim, fontSize: 10 }}>×{s.count}</span></div>
                        <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: s.avg >= 0 ? G.green : G.red }}>{s.avg >= 0 ? "+" : ""}{s.avg.toFixed(0)}$/trade</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            {(() => {
              const discGroups = {};
              trades.forEach(t => { if (t.discipline) { const k = t.discipline; if (!discGroups[k]) discGroups[k] = []; discGroups[k].push(t); } });
              const discStats = Object.entries(discGroups).map(([k, arr]) => ({ label: `${k}★`, avg: arr.reduce((a, t) => a + t.pnl, 0) / arr.length, count: arr.length })).sort((a, b) => a.label.localeCompare(b.label));
              if (discStats.length < 2) return null;
              return (
                <div style={{ ...card }}>
                  <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, fontWeight: 700 }}>🎯 Discipline → P&L</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {discStats.map((s, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#0a0a14", borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: "#aaa" }}>{s.label} <span style={{ color: G.dim, fontSize: 10 }}>×{s.count}</span></div>
                        <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: s.avg >= 0 ? G.green : G.red }}>{s.avg >= 0 ? "+" : ""}{s.avg.toFixed(0)}$/trade</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ══ PERFORMANCE (en second) ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 10, color: G.green, textTransform: "uppercase", letterSpacing: 2, fontWeight: 800, paddingLeft: 4 }}>📊 Performance & Exécution</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {setupStats.length > 0 && (
          <div style={{ ...card }}>
            <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, fontWeight: 700 }}>Win Rate par setup</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {setupStats.map((s, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{s.label} <span style={{ color: G.dim }}>({s.count})</span></div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: s.wr >= 60 ? G.green : s.wr >= 45 ? G.amber : G.red }}>{s.wr}% · {s.pnl >= 0 ? "+" : ""}{s.pnl.toFixed(0)}$</div>
                  </div>
                  <div style={{ height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${s.wr}%`, height: "100%", background: s.wr >= 60 ? G.green : s.wr >= 45 ? G.amber : G.red, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {dayStats.length > 0 && (
          <div style={{ ...card }}>
            <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, fontWeight: 700 }}>Performance par jour</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {dayStats.map((d, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 11, color: "#aaa", textTransform: "capitalize" }}>{d.label} <span style={{ color: G.dim }}>({d.count})</span></div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: d.pnl >= 0 ? G.green : G.red }}>{d.pnl >= 0 ? "+" : ""}{d.pnl.toFixed(0)}$ · {d.wr}%</div>
                  </div>
                  <div style={{ height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${d.wr}%`, height: "100%", background: d.wr >= 60 ? G.green : d.wr >= 45 ? G.amber : G.red, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </div>{/* fin grid setup/jours */}

          {/* P&L par compte — diagramme vertical */}
          {propStats.length > 0 && (() => {
            const maxAbs = Math.max(...propStats.map(p => Math.abs(p.pnl)), 1);
            const BAR_H = 70;
            return (
              <div style={{ ...card }}>
                <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16, fontWeight: 700 }}>P&L par compte</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: BAR_H * 2 + 56, overflowX: "auto" }}>
                  {propStats.map((p, i) => {
                    const firm = comptes.find(c => c.nom === p.label);
                    const firmData = firm ? (PROP_FIRMS_CATALOG[firm.type] || PROP_FIRMS_CATALOG["Autre"]) : null;
                    const ratio = Math.abs(p.pnl) / maxAbs;
                    const barH = Math.max(4, Math.round(ratio * BAR_H));
                    const shortName = firmData?.emoji ? `${firmData.emoji} ${firm?.type || p.label}` : p.label.split(" ")[0];
                    // Plus le gain est élevé = vert vif ; plus la perte est grande = rouge profond
                    const alpha = 0.3 + ratio * 0.7; // 0.3 → 1.0
                    const barColor = p.pnl >= 0
                      ? `rgba(0, 229, 160, ${alpha})`
                      : `rgba(239, 68, 68, ${alpha})`;
                    const glowColor = p.pnl >= 0 ? G.green : G.red;
                    const color = p.pnl >= 0 ? G.green : G.red;
                    return (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 0", minWidth: 52 }}>
                        {/* montant au-dessus si positif */}
                        <div style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "monospace", whiteSpace: "nowrap", minHeight: 16, marginBottom: 2 }}>
                          {p.pnl >= 0 ? `+${p.pnl.toFixed(0)}$` : ""}
                        </div>
                        {/* barre positive */}
                        <div style={{ width: "100%", height: BAR_H, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                          {p.pnl >= 0 && (
                            <div style={{ width: "40%", height: barH, background: barColor, borderRadius: "3px 3px 0 0", boxShadow: `0 0 8px ${glowColor}50` }} />
                          )}
                        </div>
                        {/* ligne zéro */}
                        <div style={{ width: "100%", height: 1, background: "#2a2a3e" }} />
                        {/* barre négative */}
                        <div style={{ width: "100%", height: BAR_H, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                          {p.pnl < 0 && (
                            <div style={{ width: "40%", height: barH, background: barColor, borderRadius: "0 0 3px 3px", boxShadow: `0 0 8px ${glowColor}50` }} />
                          )}
                        </div>
                        {/* montant en dessous si négatif */}
                        <div style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "monospace", whiteSpace: "nowrap", minHeight: 16, marginTop: 2 }}>
                          {p.pnl < 0 ? `${p.pnl.toFixed(0)}$` : ""}
                        </div>
                        {/* nom firm */}
                        <div style={{ fontSize: 11, color: firmData?.couleur || "#888", fontWeight: 700, marginTop: 4, textAlign: "center", whiteSpace: "nowrap" }}>
                          {firmData?.emoji || ""} {firm?.type || p.label.split(" ")[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ── HEATMAP JOUR × HEURE ── */}
          {(() => {
            const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
            const heures = Array.from({ length: 14 }, (_, i) => i + 7);
            const jourMap = { "lundi": 0, "mardi": 1, "mercredi": 2, "jeudi": 3, "vendredi": 4 };

            // Trouver lundi de la semaine contenant une date
            const getMondayOf = (d) => {
              const day = new Date(d);
              const wd = (day.getDay() + 6) % 7;
              day.setDate(day.getDate() - wd);
              day.setHours(0, 0, 0, 0);
              return day;
            };

            // Semaines disponibles (lunettes qui ont au moins 1 trade)
            const weekSet = new Set();
            trades.forEach(t => { if (t.date) weekSet.add(getMondayOf(t.date + "T12:00:00").toISOString().slice(0, 10)); });
            const allWeeks = [...weekSet].sort();

            const [heatPopover, setHeatPopover] = useState(null);
            const [weekMode, setWeekMode] = useState("all"); // "all" | ISO date string of monday
            const [weekIdx, setWeekIdx] = useState(allWeeks.length - 1);

            const selectedWeek = weekMode === "all" ? null : allWeeks[weekIdx];

            // Construire grille
            const grid = Array.from({ length: 5 }, () => Array.from({ length: 14 }, () => ({ pnl: 0, count: 0, trades: [] })));
            trades.forEach(t => {
              if (!t.date || !t.heure) return;
              if (selectedWeek) {
                const monday = getMondayOf(t.date + "T12:00:00").toISOString().slice(0, 10);
                if (monday !== selectedWeek) return;
              }
              const jourLabel = new Date(t.date + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase();
              const jourIdx = jourMap[jourLabel];
              if (jourIdx === undefined) return;
              const h = parseInt(t.heure?.split(":")[0] || "0");
              const hIdx = h - 7;
              if (hIdx < 0 || hIdx >= 14) return;
              grid[jourIdx][hIdx].pnl += t.pnl;
              grid[jourIdx][hIdx].count += 1;
              grid[jourIdx][hIdx].trades.push(t);
            });

            const allPnls = grid.flat().filter(c => c.count > 0).map(c => c.pnl);
            if (allPnls.length === 0 && weekMode === "all") return null;
            const maxAbs = Math.max(...allPnls.map(Math.abs), 1);

            // Couleurs sobres: fond très subtil, bordure gauche colorée
            const cellStyle = (pnl, count) => {
              if (count === 0) return { bg: "rgba(255,255,255,0.02)", borderLeft: "3px solid transparent" };
              const ratio = Math.min(Math.abs(pnl) / maxAbs, 1);
              const bgAlpha = 0.04 + ratio * 0.10;
              const borderAlpha = 0.4 + ratio * 0.6;
              return pnl >= 0
                ? { bg: `rgba(0,229,160,${bgAlpha.toFixed(2)})`, borderLeft: `3px solid rgba(0,229,160,${borderAlpha.toFixed(2)})` }
                : { bg: `rgba(239,68,68,${bgAlpha.toFixed(2)})`, borderLeft: `3px solid rgba(239,68,68,${borderAlpha.toFixed(2)})` };
            };

            // Dates de la semaine affichée
            const weekDates = selectedWeek ? Array.from({ length: 5 }, (_, i) => {
              const d = new Date(selectedWeek + "T12:00:00");
              d.setDate(d.getDate() + i);
              return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
            }) : null;

            const handleCellClick = (cellTrades, jour, heure) => {
              if (cellTrades.length === 0) return;
              if (cellTrades.length === 1) { onDetail && onDetail(cellTrades[0]); return; }
              setHeatPopover({ trades: cellTrades, jour, heure });
            };

            const weekLabel = selectedWeek
              ? (() => {
                  const d = new Date(selectedWeek + "T12:00:00");
                  const end = new Date(d); end.setDate(end.getDate() + 4);
                  return `${d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`;
                })()
              : "Toutes les semaines";

            return (
              <div style={{ ...card, position: "relative" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: G.text }}>🕐 Heatmap Jour × Heure</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => setWeekMode("all")} style={{ background: weekMode === "all" ? `${G.purple}20` : "none", border: `1px solid ${weekMode === "all" ? G.purple : G.border}`, color: weekMode === "all" ? G.purple : G.dim, borderRadius: 8, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>Global</button>
                    <button onClick={() => { setWeekMode("week"); setWeekIdx(allWeeks.length - 1); }} disabled={allWeeks.length === 0} style={{ background: weekMode === "week" ? `${G.purple}20` : "none", border: `1px solid ${weekMode === "week" ? G.purple : G.border}`, color: weekMode === "week" ? G.purple : G.dim, borderRadius: 8, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>Par semaine</button>
                    {weekMode === "week" && allWeeks.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button onClick={() => setWeekIdx(i => Math.max(0, i - 1))} disabled={weekIdx === 0} style={{ background: "none", border: `1px solid ${G.border}`, color: "#e5e7eb", borderRadius: 6, width: 24, height: 24, cursor: "pointer", fontSize: 12, opacity: weekIdx === 0 ? 0.3 : 1 }}>‹</button>
                        <span style={{ fontSize: 11, color: "#e5e7eb", fontWeight: 600, minWidth: 160, textAlign: "center" }}>{weekLabel}</span>
                        <button onClick={() => setWeekIdx(i => Math.min(allWeeks.length - 1, i + 1))} disabled={weekIdx === allWeeks.length - 1} style={{ background: "none", border: `1px solid ${G.border}`, color: "#e5e7eb", borderRadius: 6, width: 24, height: 24, cursor: "pointer", fontSize: 12, opacity: weekIdx === allWeeks.length - 1 ? 0.3 : 1 }}>›</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Popover multi-trades */}
                {heatPopover && (
                  <div style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", zIndex: 100, background: "#0e0e1a", border: "1px solid #2a2a3e", borderRadius: 12, padding: 16, minWidth: 280, boxShadow: "0 16px 48px rgba(0,0,0,0.8)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{heatPopover.jour} · {heatPopover.heure}h — {heatPopover.trades.length} trades</div>
                      <button onClick={() => setHeatPopover(null)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>✕</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {heatPopover.trades.map((t, i) => (
                        <button key={i} onClick={() => { onDetail && onDetail(t); setHeatPopover(null); }}
                          style={{ background: "#0a0a14", border: `1px solid ${t.pnl >= 0 ? G.green : G.red}30`, borderLeft: `3px solid ${t.pnl >= 0 ? G.green : G.red}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit" }}>
                          <div style={{ textAlign: "left" }}>
                            <div style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{t.date} · {t.heure}</div>
                            <div style={{ fontSize: 10, color: "#666" }}>{t.setup || "—"} · {t.actif || "—"}</div>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: t.pnl >= 0 ? G.green : G.red }}>{t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(0)}$</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ overflowX: "auto" }}>
                  <table style={{ borderCollapse: "separate", borderSpacing: 3, width: "100%" }}>
                    <thead>
                      <tr>
                        <td style={{ width: 90, fontSize: 9, color: G.dim }} />
                        {heures.map(h => (
                          <td key={h} style={{ fontSize: 11, color: "#666", textAlign: "center", paddingBottom: 6, fontWeight: 600 }}>{h}h</td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {jours.map((jour, ji) => (
                        <tr key={ji}>
                          <td style={{ verticalAlign: "middle", paddingRight: 10, whiteSpace: "nowrap" }}>
                            <div style={{ fontSize: 12, color: "#ccc", fontWeight: 700 }}>{jour}</div>
                            {weekDates && <div style={{ fontSize: 10, color: G.dim, marginTop: 1 }}>{weekDates[ji]}</div>}
                          </td>
                          {heures.map((h, hi) => {
                            const cell = grid[ji][hi];
                            const { bg, borderLeft } = cellStyle(cell.pnl, cell.count);
                            return (
                              <td key={hi}
                                onClick={() => handleCellClick(cell.trades, jours[ji], heures[hi])}
                                style={{ background: bg, borderLeft, borderRadius: 6, height: 56, minWidth: 52, textAlign: "center", verticalAlign: "middle", cursor: cell.count > 0 ? "pointer" : "default", transition: "filter 0.15s" }}
                                onMouseEnter={e => { if (cell.count > 0) e.currentTarget.style.filter = "brightness(1.4)"; }}
                                onMouseLeave={e => { e.currentTarget.style.filter = ""; }}>
                                {cell.count > 0 && (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                    <span style={{ fontSize: 11, color: cell.pnl >= 0 ? G.green : "#ef4444", fontWeight: 700, fontFamily: "monospace" }}>
                                      {cell.pnl >= 0 ? "+" : ""}{Math.abs(cell.pnl) >= 1000 ? `${(cell.pnl/1000).toFixed(1)}k` : cell.pnl.toFixed(0)}$
                                    </span>
                                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{cell.count}t</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Légende */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 9, color: G.dim }}>Perte</span>
                  {[0.08, 0.12, 0.18, 0.22].map((a, i) => (
                    <div key={i} style={{ width: 14, height: 8, borderRadius: 2, background: `rgba(239,68,68,${a})`, borderLeft: `2px solid rgba(239,68,68,${0.4 + i * 0.15})` }} />
                  ))}
                  <div style={{ width: 1, height: 10, background: "#2a2a3e", margin: "0 4px" }} />
                  {[0.08, 0.12, 0.18, 0.22].map((a, i) => (
                    <div key={i} style={{ width: 14, height: 8, borderRadius: 2, background: `rgba(0,229,160,${a})`, borderLeft: `2px solid rgba(0,229,160,${0.4 + i * 0.15})` }} />
                  ))}
                  <span style={{ fontSize: 9, color: G.dim }}>Gain</span>
                </div>
              </div>
            );
          })()}

        {/* Calendrier de trading */}
        <UnifiedCalendar trades={trades} user={user} lang={lang} />

        </div>{/* fin section performance */}

      </div>{/* fin sections verticales */}

    </div>
  );
}

function NouveauTrade({ onSave, onCancel, comptes = [], editTrade = null, defaultDate = null, templates = [], onSaveTemplate, lang = "fr" }) {
  const T = TR[lang];
  const defaultCompte = comptes.length > 0 ? comptes[0].nom : "";
  const [form, setForm] = useState(() => {
    if (editTrade) {
    }
    return {
      date: defaultDate || new Date().toISOString().split("T")[0], heure: "09:30", duree: "",
      compte: defaultCompte, actif: "Nasdaq", direction: "LONG", setup: "Breakout", taille: "",
      pnl: "", rr: "", respect: "Oui", regle_violee: "", notes_tech: "",
      priere: false, heure_coucher: "", sommeil: "", ecrans: false, qualite_sommeil: 3,
      alimentation: "Neutre", discipline: 3,
      impulsif: false, emotion_avant: [], emotion_pendant: [], emotion_apres: [],
      lecon: "", note: 3,
    };
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [showTplEditor, setShowTplEditor] = useState(null); // template en cours d'édition (objet)
  const [tplEditing, setTplEditing] = useState(null); // copie locale pour édition

  const applyTemplate = (tpl) => {
    if (tpl.vide) return;
    if (tpl.actif) set("actif", tpl.actif);
    if (tpl.direction) set("direction", tpl.direction);
    if (tpl.setup) set("setup", tpl.setup);
    if (tpl.taille) set("taille", tpl.taille);
    if (tpl.heure) set("heure", tpl.heure);
    if (tpl.duree) set("duree", tpl.duree);
    if (tpl.compte && comptes.find(c => c.nom === tpl.compte)) set("compte", tpl.compte);
  };

  const saveCurrentAsTemplate = (tplId) => {
    const tpl = templates.find(t => t.id === tplId);
    if (!tpl) return;
    const updated = { ...tpl, actif: form.actif, direction: form.direction, setup: form.setup, taille: form.taille, heure: form.heure, duree: form.duree, compte: form.compte, vide: false };
    onSaveTemplate?.(updated);
  };

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
            {showAddEmotion === field ? "✕" : T.addEmotion}
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
              placeholder={T.newEmotionPlaceholder}
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


  const fr = lang === "fr";
  const G = { green: "#00e5a0", red: "#ef4444", amber: "#f59e0b", purple: "#818cf8", cyan: "#22d3ee", dim: "#6b7280", border: "#1a1a2e", card: "#0a0a14", bg: "#06060f", text: "#e5e7eb" };
  const bubble = (active, color = G.purple) => ({
    background: active ? color + "20" : "rgba(255,255,255,0.03)",
    border: `1.5px solid ${active ? color : "#1f2937"}`,
    color: active ? color : "#6b7280",
    borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: active ? 700 : 500,
    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap",
  });
  const sectionTitle = (icon, label) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
      <span>{icon}</span>{label}
    </div>
  );
  const fieldLabel = (label) => (
    <div style={{ fontSize: 11, color: G.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{label}</div>
  );

  const ACTIFS_QUICK = ["NQ", "ES", "MNQ", "MES", "Gold", "DAX", "CL", "BTC"];
  const [step, setStep] = useState(1);
  const STEPS = [fr ? "Le trade" : "The trade", fr ? "Analyse" : "Analysis", fr ? "Psychologie" : "Psychology", fr ? "Leçons" : "Lessons", fr ? "Note" : "Rating"];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 0 }}>

      {/* ── HEADER ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: G.green, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
            {fr ? "Nouveau trade" : "New trade"}
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, margin: 0, lineHeight: 1 }}>
            {fr ? <>Journalise<br /><span style={{ background: "linear-gradient(135deg,#00e5a0,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ton trade.</span></> : <>Log your<br /><span style={{ background: "linear-gradient(135deg,#00e5a0,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>trade.</span></>}
          </h2>
        </div>
        <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #1f2937", color: G.dim, borderRadius: 10, width: 36, height: 36, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
      </div>

      {/* ── PROGRESS DOTS ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div onClick={() => i < step - 1 && setStep(i + 1)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: i < step - 1 ? "pointer" : "default" }}>
              <div style={{ width: i === step - 1 ? 24 : 8, height: 8, borderRadius: 4, background: i < step - 1 ? G.purple : i === step - 1 ? G.purple : "#1e1e2e", transition: "all 0.3s", boxShadow: i === step - 1 ? `0 0 12px ${G.purple}60` : "none", opacity: i < step - 1 ? 0.5 : 1 }} />
              <div style={{ fontSize: 9, color: i === step - 1 ? G.purple : i < step - 1 ? `${G.purple}70` : "#333", fontWeight: i === step - 1 ? 700 : 400, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>{s}</div>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: i < step - 1 ? `${G.purple}50` : "#1e1e2e", marginBottom: 16, flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      {/* ── STEP 1 : LE TRADE ── */}
      {step === 1 && (<div style={{ background: G.card, border: "1px solid #0f172a", borderRadius: 20, padding: "24px 22px", marginBottom: 12 }}>
        {!editTrade && templates.filter(t => !t.vide).length > 0 && (
          <div style={{ marginBottom: 20 }}>
            {fieldLabel("⚡ Templates")}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {templates.filter(t => !t.vide).map(tpl => (
                <button key={tpl.id} onClick={() => applyTemplate(tpl)} style={{ ...bubble(false, G.purple), border: "1.5px solid #818cf840", color: G.purple, background: "#818cf810", display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "10px 14px", borderRadius: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{tpl.nom}</span>
                  <span style={{ fontSize: 10, color: G.dim, marginTop: 2 }}>{tpl.actif}{tpl.direction ? ` · ${tpl.direction}` : ""}{tpl.setup ? ` · ${tpl.setup}` : ""}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1. RÉSULTAT */}
        {(() => {
          const pnlVal = Number(form.pnl);
          const isPos = pnlVal > 0, isNeg = pnlVal < 0;
          const pnlColor = isPos ? G.green : isNeg ? G.red : "#ffffff";
          return (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: pnlColor, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                {isPos ? (fr ? "✦ GAIN" : "✦ PROFIT") : isNeg ? (fr ? "✦ PERTE" : "✦ LOSS") : (fr ? "RÉSULTAT (P&L)" : "RESULT (P&L)")}
              </div>
              <div style={{ position: "relative" }}>
                <input type="number" placeholder="0" value={form.pnl} onChange={e => set("pnl", e.target.value)}
                  style={{ background: "rgba(255,255,255,0.03)", border: `2px solid ${isPos ? G.green + "60" : isNeg ? G.red + "60" : "#1f2937"}`, borderRadius: 14, color: pnlColor, fontSize: 32, fontWeight: 900, textAlign: "center", padding: "14px 40px 14px 20px", width: "100%", boxSizing: "border-box", fontFamily: "inherit", outline: "none", transition: "all 0.3s" }} />
                <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, color: pnlColor, opacity: 0.5 }}>$</div>
              </div>
            </div>
          );
        })()}

        {/* 2. DIRECTION */}
        <div style={{ marginBottom: 20 }}>
          {fieldLabel("Direction")}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => set("direction", "LONG")} style={{ ...bubble(form.direction === "LONG", G.green), flex: 1, padding: "14px 0", fontSize: 15, fontWeight: 800, borderRadius: 14, textAlign: "center" }}>▲ LONG</button>
            <button onClick={() => set("direction", "SHORT")} style={{ ...bubble(form.direction === "SHORT", G.red), flex: 1, padding: "14px 0", fontSize: 15, fontWeight: 800, borderRadius: 14, textAlign: "center" }}>▼ SHORT</button>
          </div>
        </div>

        {/* 3. COMPTE */}
        <div style={{ marginBottom: 20 }}>
          {fieldLabel(fr ? "Compte" : "Account")}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {comptes.map(c => (
              <button key={c.id || c.nom} onClick={() => set("compte", c.nom)} style={bubble(form.compte === c.nom, G.cyan)}>{c.nom}</button>
            ))}
            {comptes.length === 0 && <span style={{ fontSize: 12, color: G.dim }}>{fr ? "Aucun compte — crée-en un d'abord" : "No account — create one first"}</span>}
          </div>
        </div>

        {/* 4. ACTIF */}
        <div style={{ marginBottom: 20 }}>
          {fieldLabel(fr ? "Actif" : "Asset")}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            {ACTIFS_QUICK.map(a => (<button key={a} onClick={() => set("actif", a)} style={bubble(form.actif === a, G.cyan)}>{a}</button>))}
          </div>
          <input value={ACTIFS_QUICK.includes(form.actif) ? "" : form.actif} onChange={e => set("actif", e.target.value)} placeholder={fr ? "Autre actif…" : "Other asset…"} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1f2937", borderRadius: 10, color: G.text, fontSize: 13, padding: "9px 14px", width: "100%", boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} />
        </div>

        {/* 5. SETUP */}
        <div style={{ marginBottom: 20 }}>
          {fieldLabel("Setup")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Breakout", "Pullback", "Reversal", "Range", "News", "Scalp", "Swing", "ICT", fr ? "Autre" : "Other"].map(s => (
              <button key={s} onClick={() => set("setup", s)} style={bubble(form.setup === s, G.purple)}>{s}</button>
            ))}
          </div>
        </div>

        {/* 6. DATE / HEURE / DURÉE */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
          {[
            { label: fr ? "Date" : "Date", key: "date", type: "date" },
            { label: fr ? "Heure entrée" : "Entry time", key: "heure", type: "time" },
            { label: fr ? "Durée (min)" : "Duration (min)", key: "duree", type: "number", placeholder: "15" },
          ].map(f => (
            <div key={f.key}>
              {fieldLabel(f.label)}
              <input type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1f2937", borderRadius: 10, color: G.text, fontSize: 13, padding: "9px 12px", width: "100%", boxSizing: "border-box", fontFamily: "inherit", colorScheme: "dark", outline: "none" }} />
            </div>
          ))}
        </div>

        {/* 7. TAILLE / RR */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: fr ? "Taille (contrats)" : "Size (contracts)", key: "taille", placeholder: "1" },
            { label: "R/R", key: "rr", placeholder: "2.0" },
          ].map(f => (
            <div key={f.key}>
              {fieldLabel(f.label)}
              <input type="number" step="0.1" value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1f2937", borderRadius: 10, color: G.text, fontSize: 13, padding: "9px 12px", width: "100%", boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} />
            </div>
          ))}
        </div>
      </div>)}

      {/* ── STEP 2 : ANALYSE ── */}
      {step === 2 && (<div style={{ background: G.card, border: "1px solid #0f172a", borderRadius: 20, padding: "24px 22px", marginBottom: 12 }}>
        {sectionTitle("🎯", fr ? "Analyse" : "Analysis")}

        <div style={{ marginBottom: 20 }}>
          {fieldLabel(fr ? "Respect du plan" : "Plan respected")}
          <div style={{ display: "flex", gap: 10 }}>
            {[["Oui", G.green, T.yes], ["Partiel", G.amber, T.partial], ["Non", G.red, T.no]].map(([r, c, label]) => (
              <button key={r} onClick={() => set("respect", r)} style={{ ...bubble(form.respect === r, c), flex: 1, padding: "12px 0", fontWeight: 700, fontSize: 13, textAlign: "center", borderRadius: 14 }}>{label}</button>
            ))}
          </div>
        </div>

        {form.respect !== "Oui" && (
          <div style={{ marginBottom: 20 }}>
            {fieldLabel(fr ? "Règle violée" : "Violated rule")}
            <input type="text" placeholder={T.violatedRulePlaceholder} value={form.regle_violee} onChange={e => set("regle_violee", e.target.value)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1f2937", borderRadius: 10, color: G.text, fontSize: 13, padding: "9px 14px", width: "100%", boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} />
          </div>
        )}

        <div>
          {fieldLabel(fr ? "Notes techniques" : "Technical notes")}
          <textarea placeholder={T.techNotesPlaceholder} value={form.notes_tech} onChange={e => set("notes_tech", e.target.value)} rows={4} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1f2937", borderRadius: 10, color: G.text, fontSize: 13, padding: "12px 14px", width: "100%", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", outline: "none" }} />
        </div>
      </div>)}

      {/* ── STEP 3 : PSYCHOLOGIE ── */}
      {step === 3 && (<div style={{ background: G.card, border: "1px solid #0f172a", borderRadius: 20, padding: "24px 22px", marginBottom: 12 }}>
        {sectionTitle("🧠", fr ? "Psychologie" : "Psychology")}

        <div style={{ marginBottom: 18 }}>
          {fieldLabel(fr ? "🌅 Émotions avant" : "🌅 Emotions before")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {emotions.map(em => {
              const sel = (Array.isArray(form.emotion_avant) ? form.emotion_avant : form.emotion_avant ? [form.emotion_avant] : []).includes(em);
              return <button key={em} onClick={() => toggleEmotion("emotion_avant", em)} style={bubble(sel, G.amber)}>{em}</button>;
            })}
            <button onClick={() => setShowAddEmotion(showAddEmotion === "emotion_avant" ? null : "emotion_avant")} style={{ ...bubble(false), border: "1.5px dashed #1f2937" }}>+ {fr ? "Autre" : "Other"}</button>
          </div>
          {showAddEmotion === "emotion_avant" && (
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input autoFocus placeholder={T.newEmotionPlaceholder} value={newEmotion} onChange={e => setNewEmotion(e.target.value)} onKeyDown={e => e.key === "Enter" && addEmotion("emotion_avant")} style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid #1f2937", borderRadius: 10, color: G.text, fontSize: 13, padding: "8px 12px", fontFamily: "inherit", outline: "none" }} />
              <button onClick={() => addEmotion("emotion_avant")} style={{ background: G.amber, color: "#000", border: "none", borderRadius: 10, padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✓</button>
            </div>
          )}
        </div>

        <div style={{ marginBottom: 18 }}>
          {fieldLabel(fr ? "⚡ Émotions pendant" : "⚡ Emotions during")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {emotions.map(em => {
              const sel = (Array.isArray(form.emotion_pendant) ? form.emotion_pendant : form.emotion_pendant ? [form.emotion_pendant] : []).includes(em);
              return <button key={em} onClick={() => toggleEmotion("emotion_pendant", em)} style={bubble(sel, G.amber)}>{em}</button>;
            })}
            <button onClick={() => setShowAddEmotion(showAddEmotion === "emotion_pendant" ? null : "emotion_pendant")} style={{ ...bubble(false), border: "1.5px dashed #1f2937" }}>+ {fr ? "Autre" : "Other"}</button>
          </div>
          {showAddEmotion === "emotion_pendant" && (
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input autoFocus placeholder={T.newEmotionPlaceholder} value={newEmotion} onChange={e => setNewEmotion(e.target.value)} onKeyDown={e => e.key === "Enter" && addEmotion("emotion_pendant")} style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid #1f2937", borderRadius: 10, color: G.text, fontSize: 13, padding: "8px 12px", fontFamily: "inherit", outline: "none" }} />
              <button onClick={() => addEmotion("emotion_pendant")} style={{ background: G.amber, color: "#000", border: "none", borderRadius: 10, padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✓</button>
            </div>
          )}
        </div>

      </div>)}

      {/* ── STEP 4 : LEÇONS APPRISES ── */}
      {step === 4 && (<div style={{ background: G.card, border: "1px solid #0f172a", borderRadius: 20, padding: "24px 22px", marginBottom: 12 }}>
        {sectionTitle("📝", fr ? "Leçons apprises" : "Lessons learned")}
        <div style={{ fontSize: 13, color: G.dim, marginBottom: 16 }}>{fr ? "Ce que ce trade t'a appris…" : "What this trade taught you…"}</div>
        <textarea placeholder={T.lessonPlaceholder} value={form.lecon} onChange={e => set("lecon", e.target.value)} rows={8} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1f2937", borderRadius: 10, color: G.text, fontSize: 13, padding: "12px 14px", width: "100%", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", outline: "none" }} />
      </div>)}

      {/* ── STEP 5 : NOTE GLOBALE ── */}
      {step === 5 && (<div style={{ background: G.card, border: "1px solid #0f172a", borderRadius: 20, padding: "24px 22px", marginBottom: 12 }}>
        {sectionTitle("🎯", fr ? "Note globale du trade" : "Trade rating")}
        <div style={{ fontSize: 13, color: G.dim, marginBottom: 28 }}>{fr ? "Comment évalues-tu ce trade dans l'ensemble ?" : "How do you rate this trade overall?"}</div>
        {(() => {
          const note = form.note || 0;
          const pct = (note / 5) * 100;
          const trackColor = note === 0 ? "#1f2937"
            : note <= 1 ? "#ef4444"
            : note <= 2 ? "#f97316"
            : note <= 3 ? "#f59e0b"
            : note <= 4 ? "#84cc16"
            : "#00e5a0";
          const labels = fr
            ? ["—", "Mauvais", "Moyen", "Correct", "Bon", "Excellent"]
            : ["—", "Poor", "Below avg", "Average", "Good", "Excellent"];
          return (
            <div>
              {/* Label + valeur */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: trackColor, transition: "color 0.3s" }}>{labels[note]}</div>
                <div style={{ fontSize: 13, color: G.dim }}>{note > 0 ? `${note}/5` : "—"}</div>
              </div>
              {/* Barre gradient cliquable */}
              <div style={{ position: "relative", height: 16, borderRadius: 8, background: "#1a1a2e", cursor: "pointer", marginBottom: 20 }}
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const val = Math.max(1, Math.min(5, Math.ceil((x / rect.width) * 5)));
                  set("note", val);
                }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 8, background: `linear-gradient(90deg, #ef4444, #f97316, #f59e0b, #84cc16, #00e5a0)`, transition: "width 0.3s", backgroundSize: "500% 100%", backgroundPosition: "left" }} />
                {note > 0 && <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%, -50%)", width: 24, height: 24, borderRadius: "50%", background: trackColor, border: "3px solid #0a0a14", boxShadow: `0 0 12px ${trackColor}80`, transition: "all 0.3s" }} />}
              </div>
              {/* Boutons 1-5 */}
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => {
                  const c = n <= 1 ? "#ef4444" : n <= 2 ? "#f97316" : n <= 3 ? "#f59e0b" : n <= 4 ? "#84cc16" : "#00e5a0";
                  return (
                    <button key={n} onClick={() => set("note", note === n ? 0 : n)}
                      style={{ flex: 1, background: note >= n ? c + "20" : "rgba(255,255,255,0.03)", border: `1.5px solid ${note >= n ? c : "#1f2937"}`, borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: note >= n ? 800 : 500, color: note >= n ? c : G.dim, cursor: "pointer", transition: "all 0.2s" }}>
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}
        {!editTrade && templates.length > 0 && (
          <div style={{ marginTop: 24 }}>
            {fieldLabel("⚡ " + (fr ? "Enregistrer comme template" : "Save as template"))}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {templates.map(tpl => (
                <button key={tpl.id} onClick={() => saveCurrentAsTemplate(tpl.id)} style={{ ...bubble(false, G.purple), background: "#818cf808", border: "1.5px solid #818cf830" }}>→ {tpl.nom}</button>
              ))}
            </div>
          </div>
        )}
      </div>)}

      {/* ── NAVIGATION ── */}
      <div style={{ display: "flex", gap: 10 }}>
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid #1f2937", color: G.dim, borderRadius: 16, padding: "16px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            ← {fr ? "Précédent" : "Back"}
          </button>
        )}
        {step < STEPS.length ? (
          <button onClick={() => setStep(s => s + 1)} style={{ flex: 2, background: G.purple, color: "#fff", border: "none", borderRadius: 16, padding: "16px", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.3, boxShadow: `0 0 24px ${G.purple}40` }}>
            {fr ? "Suivant →" : "Next →"}
          </button>
        ) : (
          <button onClick={() => onSave(form, editTrade?.id)} style={{ flex: 2, background: "linear-gradient(135deg,#00e5a0,#00b37a)", color: "#06060f", border: "none", borderRadius: 16, padding: "16px", fontSize: 15, fontWeight: 900, cursor: "pointer", letterSpacing: 0.3, boxShadow: "0 0 30px rgba(0,229,160,0.2)", fontFamily: "inherit" }}>
            {editTrade ? T.updateTradeBtn : (fr ? "✓ Enregistrer le trade" : "✓ Save trade")}
          </button>
        )}
      </div>

      {/* Modal éditeur de template */}
      {showTplEditor !== null && tplEditing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0a0a14", border: "1px solid #818cf840", borderRadius: 20, padding: "32px 28px", maxWidth: 400, width: "100%" }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", marginBottom: 20 }}>⚡ Modifier le template</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["Nom", "nom", "text", "Mon template"], ["Actif", "actif", "text", "NQ, ES…"], ["Setup", "setup", "text", "Breakout, ICT…"]].map(([lbl, key, type, ph]) => (
                <div key={key}>
                  <label style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>{lbl}</label>
                  <input type={type} value={tplEditing[key]} onChange={e => setTplEditing(t => ({ ...t, [key]: e.target.value }))} placeholder={ph} style={{ background: "#0e0e1a", border: "1px solid #2a2a3e", color: "#fff", borderRadius: 8, padding: "9px 12px", fontSize: 13, width: "100%", boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>Direction</label>
                  <select value={tplEditing.direction} onChange={e => setTplEditing(t => ({ ...t, direction: e.target.value }))} style={{ background: "#0e0e1a", border: "1px solid #2a2a3e", color: "#fff", borderRadius: 8, padding: "9px 12px", fontSize: 13, width: "100%", boxSizing: "border-box", fontFamily: "inherit" }}>
                    <option value="LONG">LONG</option><option value="SHORT">SHORT</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>{fr ? "Taille" : "Size"}</label>
                  <input type="number" value={tplEditing.taille} onChange={e => setTplEditing(t => ({ ...t, taille: e.target.value }))} placeholder="1" style={{ background: "#0e0e1a", border: "1px solid #2a2a3e", color: "#fff", borderRadius: 8, padding: "9px 12px", fontSize: 13, width: "100%", boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>{fr ? "Compte" : "Account"}</label>
                <select value={tplEditing.compte} onChange={e => setTplEditing(t => ({ ...t, compte: e.target.value }))} style={{ background: "#0e0e1a", border: "1px solid #2a2a3e", color: "#fff", borderRadius: 8, padding: "9px 12px", fontSize: 13, width: "100%", boxSizing: "border-box", fontFamily: "inherit" }}>
                  <option value="">— {fr ? "Aucun" : "None"} —</option>
                  {comptes.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={() => { setShowTplEditor(null); setTplEditing(null); }} style={{ flex: 1, background: "none", border: "1px solid #1a1a2e", color: "#6b7280", borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{fr ? "Annuler" : "Cancel"}</button>
              <button onClick={() => { onSaveTemplate?.({ ...tplEditing, vide: !tplEditing.actif && !tplEditing.setup }); setShowTplEditor(null); setTplEditing(null); }} style={{ flex: 2, background: G.purple, color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>✓ {fr ? "Enregistrer" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RÈGLES ───────────────────────────────────────────────────────────────────
function Regles({ comptes, preselectedFirm = null, reglesPerso, setReglesPerso, lang = "fr" }) {
  const T = TR[lang];
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
  const catColors = { Risque: COLORS.red, Quantite: COLORS.amber, Psychologie: COLORS.cyan, Technique: COLORS.green };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ overflowX: "auto", paddingBottom: 4 }}>
        <div style={{ display: "flex", gap: 8, minWidth: "max-content" }}>
          {allFirms.map(key => {
            const f = PROP_FIRMS_CATALOG[key];
            const actif = tab === key;
            const enUse = firmsInUse.includes(key);
            return (
              <button key={key} onClick={() => setTab(key)} style={{ background: actif ? f.couleur + "25" : COLORS.card, border: `1px solid ${actif ? f.couleur : COLORS.border}`, color: actif ? f.couleur : COLORS.textDim, borderRadius: 8, padding: "8px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", position: "relative", display: "flex", alignItems: "center", gap: 6 }}>
                <FirmLogo firm={f} size={16} style={{ borderRadius: 3, opacity: actif ? 1 : 0.6 }} />{f.nom}
                {enUse && <span style={{ position: "absolute", top: -3, right: -3, width: 7, height: 7, borderRadius: "50%", background: f.couleur, border: `2px solid ${COLORS.bg}` }} />}
              </button>
            );
          })}
        </div>
      </div>
      {tab !== "REGLEMENTATION" && firm.reglesFondamentales && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {firm.reglesFondamentales.map((r, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${couleur}30`, borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: couleur, fontSize: 14, marginTop: 1 }}>&#9670;</span>
              <div>
                <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{r.titre}</div>
                {r.detail && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 3 }}>{r.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{lang === "fr" ? "Mes regles perso" : "My personal rules"}</div>
          <button onClick={() => setShowRegleForm(s => !s)} style={{ background: COLORS.cyan + "20", border: `1px solid ${COLORS.cyan}`, color: COLORS.cyan, borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>+</button>
        </div>
        {showRegleForm && (
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 12, marginBottom: 8 }}>
            <input placeholder={lang === "fr" ? "Titre de la regle..." : "Rule title..."} value={newRegle.titre} onChange={e => setNewRegle(r => ({ ...r, titre: e.target.value }))} style={{ ...inp, marginBottom: 8 }} />
            <select value={newRegle.categorie} onChange={e => setNewRegle(r => ({ ...r, categorie: e.target.value }))} style={{ ...inp, marginBottom: 8 }}>
              {["Risque", "Quantite", "Psychologie", "Technique"].map(c => <option key={c}>{c}</option>)}
            </select>
            <button onClick={addRegle} style={{ background: COLORS.green, color: COLORS.bg, border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{lang === "fr" ? "Ajouter" : "Add"}</button>
          </div>
        )}
        {reglesPerso.map(r => (
          <div key={r.id} style={{ background: COLORS.card, border: `1px solid ${catColors[r.categorie] || COLORS.border}30`, borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, opacity: r.actif ? 1 : 0.5 }}>
            <div>
              <span style={{ fontSize: 10, color: catColors[r.categorie] || COLORS.muted, fontWeight: 700, marginRight: 6, textTransform: "uppercase" }}>{r.categorie}</span>
              <span style={{ fontSize: 13, color: COLORS.text }}>{r.titre}</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => toggleRegle(r.id)} style={{ background: "none", border: "none", color: r.actif ? COLORS.green : COLORS.muted, cursor: "pointer", fontSize: 16 }}>{r.actif ? "OK" : "O"}</button>
              <button onClick={() => removeRegle(r.id)} style={{ background: "none", border: "none", color: COLORS.red, cursor: "pointer", fontSize: 14 }}>x</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function getCouleurCompte(type, idx, total) {
  const palette = ["#00e5a0","#818cf8","#f59e0b","#ef4444","#38bdf8","#a78bfa","#34d399","#fb923c"];
  const firmColor = PROP_FIRMS_CATALOG[type]?.couleur;
  if (firmColor) return firmColor;
  return palette[idx % palette.length];
}

function ROI({ comptes, setComptes, trades, onEditCompte, mentorQ, setMentorQ, fraisDivers, setFraisDivers, fiscal, setFiscal, deviseRecue, setDeviseRecue, deviseRef, setDeviseRef, tauxPerso, setTauxPerso, lang = "fr" }) {
  const fr = lang === "fr";
  const [editingFiscal, setEditingFiscal] = useState(false);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [showFraisForm, setShowFraisForm] = useState(false);
  const [newPayout, setNewPayout] = useState({ compte: comptes[0]?.nom || "", montant: "", devise: "USD", date: new Date().toISOString().slice(0, 10) });
  const [newFrais, setNewFrais] = useState({ label: "", montant: "", type: "unique", categorie: "autre" });
  useEffect(() => {
    if ((!newPayout.compte || !comptes.find(c => c.nom === newPayout.compte)) && comptes.length > 0) {
      setNewPayout(p => ({ ...p, compte: comptes[0].nom }));
    }
  }, [comptes]);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [displayVal, setDisplayVal] = useState(0);
  const [showDeviseMenu, setShowDeviseMenu] = useState(false);
  const [showDeviseRefMenu, setShowDeviseRefMenu] = useState(false);
  const [showDeviseRecueMenu, setShowDeviseRecueMenu] = useState(false);

  // ── Calculs ──
  const today = new Date().toISOString().slice(0, 7);
  const moisMQ = mentorQ.moisDebut ? moisEntre(mentorQ.moisDebut, today) : 0;
  const totalMQ = (mentorQ.mensuel || 0) * moisMQ;
  const totalPropFirms = comptes.reduce((a, c) => a + (c.achat || 0) + (c.activation || 0), 0);
  const totalFraisDivers = fraisDivers.reduce((a, f) => {
    if (f.type === "mensuel") return a + f.montant * 12;
    return a + f.montant;
  }, 0);
  const totalDepenses = totalPropFirms + totalMQ + totalFraisDivers;
  const totalPayouts = comptes.reduce((a, c) => a + (c.payouts || []).reduce((b, p) => b + (p.montant || 0), 0), 0);
  const resultatNet = totalPayouts - totalDepenses;
  const roiPct = totalDepenses > 0 ? ((resultatNet / totalDepenses) * 100).toFixed(1) : "—";

  // Fiscal
  const paysData = PAYS_FISCAL[fiscal.pays] || PAYS_FISCAL["FR"];
  const structureData = paysData.structures.find(s => s.id === fiscal.structure) || paysData.structures[0];
  const acreData = (fiscal.pays === "FR" && structureData?.acre && fiscal.dateCreation) ? getStatutAcre(structureData, fiscal.dateCreation) : null;
  const acreActifEffectif = acreData !== null && fiscal.acreActif;
  const tauxEffectif = acreActifEffectif ? Math.round((structureData.taux || 0) * (1 - (acreData?.taux2 || 50) / 100)) : fiscal.taux;
  const infosAcre = acreData ? {
    active: true,
    tauxReduit: tauxEffectif,
    tauxExoneration: (acreData?.taux2 || 50) / 100,
    finAcre: (() => { const d = new Date(fiscal.dateCreation); d.setMonth(d.getMonth() + (acreData?.mois || 12)); return d; })(),
  } : null;
  // Conversion devise
  useEffect(() => {
    if (deviseRecue === deviseRef) { setTauxPerso(t => ({ ...t, [`${deviseRecue}_${deviseRef}`]: 1 })); return; }
    const key = `${deviseRecue}_${deviseRef}`;
    fetch(`https://api.exchangerate-api.com/v4/latest/${deviseRecue}`)
      .then(r => r.json())
      .then(data => {
        const rate = data?.rates?.[deviseRef];
        if (rate) setTauxPerso(t => ({ ...t, [key]: rate }));
      })
      .catch(() => {});
  }, [deviseRecue, deviseRef]);

  useEffect(() => {
    let start = 0; const end = totalPayouts; const duration = 900;
    if (end === 0) { setDisplayVal(0); return; }
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplayVal(end); clearInterval(timer); }
      else setDisplayVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [totalPayouts]);

  const symboleRecue = getDeviseSymbole(deviseRecue);
  const symboleRef = getDeviseSymbole(deviseRef);
  const tauxConv = tauxPerso?.[`${deviseRecue}_${deviseRef}`] || 1;
  const brutConverti = totalPayouts * tauxConv;
  // IS (SASU/EURL) → impôt sur bénéfice net (CA − charges). Micro/EI/IR → impôt sur CA brut.
  const isIS = fiscal.actif && structureData && !structureData.ir && !["micro_bnc","ei"].includes(structureData.id);
  const baseImposable = isIS ? Math.max(0, brutConverti - totalDepenses) : brutConverti;
  const impotEstime = fiscal.actif ? (baseImposable > 0 ? baseImposable * (tauxEffectif / 100) : 0) : 0;
  // Net final = payouts convertis − dépenses − impôt
  const netApresImpot = brutConverti - totalDepenses - impotEstime;
  const netConverti = Math.round(netApresImpot);

  // Regroupement par type
  const byType = comptes.reduce((acc, c) => {
    const t = c.type || "Autre";
    if (!acc[t]) acc[t] = [];
    acc[t].push(c);
    return acc;
  }, {});

  const addPayout = () => {
    if (!newPayout.montant) return;
    setComptes(cs => cs.map(c => c.nom === newPayout.compte
      ? { ...c, payouts: [...(c.payouts || []), { date: newPayout.date, montant: parseFloat(newPayout.montant), devise: newPayout.devise }] }
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

  const inp = { background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a2e", color: "#e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 13, width: "100%", boxSizing: "border-box", fontFamily: "inherit" };
  const card = { background: "linear-gradient(135deg,#0e0e1a,#0a0a14)", border: "1px solid #1a1a2e", borderRadius: 16, padding: "20px 24px" };
  const G = { green: "#00e5a0", red: "#ef4444", amber: "#f59e0b", purple: "#818cf8", muted: "#374151", dim: "#6b7280" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: G.green, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>
          Module · <span style={{ color: "#fff" }}>ROI & Fiscalité</span>
        </div>
        <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 900, letterSpacing: -1.5, lineHeight: 1, margin: 0 }}>
          {fr ? <>Rentabilité<br /><span style={{ background: "linear-gradient(135deg,#00e5a0,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>de ton activité.</span></> : <>Profitability<br /><span style={{ background: "linear-gradient(135deg,#00e5a0,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>of your activity.</span></>}
        </h1>
      </div>

      {/* ── LIGNE 1 : Grand encadré résultat + Fiscalité ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>

        {/* Colonne gauche : Grand encadré vert + conversion + net après impôt */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Grand encadré total payouts */}
          <div style={{ ...card, borderLeft: `3px solid ${resultatNet >= 0 ? G.green : G.red}`, background: resultatNet >= 0 ? "linear-gradient(135deg,#001a0e,#0a0a14)" : "linear-gradient(135deg,#1a0000,#0a0a14)" }}>
            <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>{fr ? "Bilan global" : "Global result"}</div>

            {/* Montant principal */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>{fr ? "Total payouts reçus" : "Total payouts received"}</div>
              <div style={{ display: "inline-block", padding: "20px 36px", borderRadius: 16, background: `${G.green}10`, border: `1.5px solid ${G.green}50`, boxShadow: `0 0 40px ${G.green}22, 0 0 80px ${G.green}0a`, animation: "roiFlame 3s ease-in-out infinite" }}>
                <style>{`@keyframes roiFlame { 0%,100% { box-shadow: 0 0 28px #00e5a022, 0 0 60px #00e5a00a; } 50% { box-shadow: 0 0 48px #00e5a040, 0 0 90px #00e5a018; } }`}</style>
                <div style={{ fontSize: 52, fontWeight: 900, fontFamily: "monospace", letterSpacing: -2, color: G.green, lineHeight: 1, display: "flex", alignItems: "baseline", gap: 4 }}>
                  +{displayVal}
                  <span style={{ position: "relative" }}>
                    <button onClick={() => setShowDeviseMenu(s => !s)} style={{ fontSize: 32, fontWeight: 900, fontFamily: "monospace", color: G.green, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 4, opacity: 0.85 }} title="Changer la devise">
                      {symboleRecue}
                    </button>
                    {showDeviseMenu && (
                      <div style={{ position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#0e0e1a", border: `1px solid ${G.green}40`, borderRadius: 12, padding: 8, zIndex: 100, minWidth: 160, boxShadow: `0 8px 32px rgba(0,0,0,0.6)` }}>
                        <div style={{ fontSize: 9, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, padding: "4px 8px 8px" }}>Devise reçue</div>
                        {DEVISES.filter(d => !["USDT","BTC"].includes(d.code)).map(d => (
                          <button key={d.code} onClick={() => { setDeviseRecue(d.code); setShowDeviseMenu(false); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: deviseRecue === d.code ? `${G.green}15` : "none", border: "none", color: deviseRecue === d.code ? G.green : "#e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: deviseRecue === d.code ? 700 : 400, cursor: "pointer", textAlign: "left" }}>
                            <span style={{ fontFamily: "monospace", fontWeight: 800, minWidth: 24 }}>{d.symbole}</span>
                            <span style={{ color: G.dim, fontSize: 11 }}>{d.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Flèche */}
            <div style={{ textAlign: "center", color: G.dim, fontSize: 16, margin: "4px 0" }}>↓</div>

            {/* Bloc violet — Entrées (payouts + conversion) */}
            <div style={{ background: "rgba(129,140,248,0.08)", borderRadius: 14, border: `1.5px solid ${G.purple}35`, padding: "14px 16px", marginBottom: 4, position: "relative" }}>
              <div style={{ fontSize: 9, color: G.purple, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, opacity: 0.8 }}>📈 Entrées</div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: G.dim }}>Payouts reçus</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "#e5e7eb" }}>+{totalPayouts}{symboleRecue}</span>
              </div>

              {deviseRecue !== deviseRef && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: G.dim }}>Conversion {deviseRecue}→{deviseRef} ×{tauxConv.toFixed(4)}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: brutConverti < totalPayouts ? G.red : G.green }}>
                    {brutConverti < totalPayouts ? "-" : "+"}{Math.abs(Math.round(totalPayouts - brutConverti))}{symboleRef}
                  </span>
                </div>
              )}

              <div style={{ borderTop: `1px solid ${G.purple}25`, margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: G.dim }}>Brut {deviseRecue !== deviseRef ? `(${deviseRef})` : ""}</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, fontFamily: "monospace", color: G.purple, letterSpacing: -1 }}>+{Math.round(brutConverti)}</span>
                  <span style={{ position: "relative" }}>
                    <button onClick={() => setShowDeviseRefMenu(s => !s)} style={{ fontSize: 13, fontWeight: 900, fontFamily: "monospace", color: G.purple, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3, opacity: 0.85 }} title="Changer la devise de référence">{symboleRef}</button>
                    {showDeviseRefMenu && (
                      <div style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 0, background: "#0e0e1a", border: `1px solid ${G.purple}40`, borderRadius: 12, padding: 8, zIndex: 100, minWidth: 160, boxShadow: `0 8px 32px rgba(0,0,0,0.6)` }}>
                        <div style={{ fontSize: 9, color: G.dim, textTransform: "uppercase", letterSpacing: 1.5, padding: "4px 8px 8px" }}>Devise de référence</div>
                        {DEVISES.filter(d => !["USDT","BTC"].includes(d.code)).map(d => (
                          <button key={d.code} onClick={() => { setDeviseRef(d.code); setShowDeviseRefMenu(false); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: deviseRef === d.code ? `${G.purple}15` : "none", border: "none", color: deviseRef === d.code ? G.purple : "#e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: deviseRef === d.code ? 700 : 400, cursor: "pointer", textAlign: "left" }}>
                            <span style={{ fontFamily: "monospace", fontWeight: 800, minWidth: 24 }}>{d.symbole}</span>
                            <span style={{ color: G.dim, fontSize: 11 }}>{d.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Flèche */}
            <div style={{ textAlign: "center", color: G.dim, fontSize: 16, margin: "4px 0" }}>↓</div>

            {/* Bloc rouge — Dépenses (toujours affiché) */}
            {totalDepenses > 0 && (
              <div style={{ background: "rgba(239,68,68,0.06)", borderRadius: 14, border: `1.5px solid ${G.red}30`, padding: "14px 16px", marginBottom: 4 }}>
                <div style={{ fontSize: 9, color: G.red, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, opacity: 0.8 }}>📉 Dépenses</div>

                {totalPropFirms > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: G.dim }}>Comptes prop firms</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "#e5e7eb" }}>-{totalPropFirms}{symboleRef}</span>
                  </div>
                )}
                {totalMQ > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: G.dim }}>Formation / MentorQ</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "#e5e7eb" }}>-{totalMQ}{symboleRef}</span>
                  </div>
                )}
                {totalFraisDivers > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: G.dim }}>Frais divers</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "#e5e7eb" }}>-{Math.round(totalFraisDivers)}{symboleRef}</span>
                  </div>
                )}

                <div style={{ borderTop: `1px solid ${G.red}20`, margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: G.dim }}>Total dépenses</span>
                  <span style={{ fontSize: 18, fontWeight: 900, fontFamily: "monospace", color: G.red, letterSpacing: -1 }}>-{Math.round(totalDepenses)}{symboleRef}</span>
                </div>
              </div>
            )}

            {/* Flèche */}
            <div style={{ textAlign: "center", color: G.dim, fontSize: 16, margin: "4px 0" }}>↓</div>

            {/* Bloc résultat net */}
            {(() => {
              const netBrut = Math.round(brutConverti) - Math.round(totalDepenses);
              const netFinal = netBrut - Math.round(impotEstime);
              const couleur = netFinal >= 0 ? G.green : G.red;
              return (
                <div style={{ background: netFinal >= 0 ? `${G.green}0d` : `${G.red}0d`, borderRadius: 14, border: `1.5px solid ${couleur}40`, padding: "14px 16px", boxShadow: `0 0 28px ${couleur}10` }}>
                  <div style={{ fontSize: 9, color: couleur, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, opacity: 0.8 }}>💰 Résultat</div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: G.dim }}>Brut après conversion</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "#e5e7eb" }}>+{Math.round(brutConverti)}{symboleRef}</span>
                  </div>

                  {totalDepenses > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: G.dim }}>− Dépenses totales</span>
                      <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: G.red }}>-{Math.round(totalDepenses)}{symboleRef}</span>
                    </div>
                  )}

                  {fiscal.actif && impotEstime > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: G.dim }}>− Impôt ({tauxEffectif}% sur {isIS ? "bénéfice" : "CA"} · {structureData?.label})</span>
                      <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: G.red }}>-{Math.round(impotEstime)}{symboleRef}</span>
                    </div>
                  )}

                  {!fiscal.actif && (
                    <div style={{ fontSize: 11, color: G.dim, marginBottom: 6, fontStyle: "italic", opacity: 0.7 }}>Fiscalité non activée</div>
                  )}

                  <div style={{ borderTop: `1px solid ${couleur}25`, margin: "8px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#e5e7eb" }}>Net final</span>
                    <span style={{ fontSize: 28, fontWeight: 900, fontFamily: "monospace", color: couleur, letterSpacing: -1 }}>{netFinal >= 0 ? "+" : ""}{netFinal}{symboleRef}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Card séparée — Ajouter un payout */}
          <div style={{ ...card, borderLeft: `3px solid ${G.green}` }}>
            <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Enregistrer un payout</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <select value={newPayout.compte} onChange={e => setNewPayout(p => ({ ...p, compte: e.target.value }))} style={{ background: "#0e0e1a", border: "1px solid #1a1a2e", color: "#e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 12, outline: "none" }}>
                {comptes.map(c => <option key={c.nom} value={c.nom}>{c.nom}</option>)}
              </select>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" placeholder="Montant" value={newPayout.montant} onChange={e => setNewPayout(p => ({ ...p, montant: e.target.value }))} style={{ flex: 1, background: "#0e0e1a", border: "1px solid #1a1a2e", color: "#e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 12, outline: "none" }} />
                <select value={newPayout.devise} onChange={e => setNewPayout(p => ({ ...p, devise: e.target.value }))} style={{ background: "#0e0e1a", border: "1px solid #1a1a2e", color: "#e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 12, outline: "none", minWidth: 84 }}>
                  {DEVISES.map(d => <option key={d.code} value={d.code}>{d.symbole} {d.code}</option>)}
                </select>
              </div>
              <input type="date" value={newPayout.date} onChange={e => setNewPayout(p => ({ ...p, date: e.target.value }))} style={{ background: "#0e0e1a", border: "1px solid #1a1a2e", color: "#e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 12, outline: "none" }} />
              <button onClick={addPayout} disabled={!newPayout.montant || !newPayout.compte} style={{ background: newPayout.montant && newPayout.compte ? G.green : "#1a1a2e", color: newPayout.montant && newPayout.compte ? "#06060f" : G.dim, border: "none", borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 800, cursor: newPayout.montant && newPayout.compte ? "pointer" : "default", transition: "all 0.2s" }}>
                ✓ Confirmer le payout
              </button>
            </div>
          </div>

          {/* ROI global */}
          <div style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: G.dim }}>ROI global</div>
            <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "monospace", color: roiPct !== "—" && Number(roiPct) >= 0 ? G.green : G.red }}>
              {roiPct !== "—" ? `${Number(roiPct) >= 0 ? "+" : ""}${roiPct}%` : "—"}
            </div>
          </div>
        </div>

        {/* Colonne droite : Fiscalité */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ ...card, borderLeft: `3px solid ${G.amber}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: fiscal.actif ? 14 : 4 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb" }}>Structure & fiscalité</div>
                {!fiscal.actif && <div style={{ fontSize: 11, color: G.dim, marginTop: 4 }}>Si ton activité de trading passe par une structure.</div>}
              </div>
              {!fiscal.actif ? (
                <button data-tutorial="fiscal-structure" onClick={() => { setFiscal(f => ({ ...f, actif: true })); setEditingFiscal(true); }} style={{ background: `${G.amber}15`, border: `1px solid ${G.amber}50`, color: G.amber, borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Activer
                </button>
              ) : (
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setEditingFiscal(e => !e)} style={{ background: editingFiscal ? `${G.amber}20` : "rgba(255,255,255,0.03)", border: `1px solid ${editingFiscal ? G.amber : "#1a1a2e"}`, color: editingFiscal ? G.amber : G.dim, borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    {editingFiscal ? "✕ Fermer" : "✎ Modifier"}
                  </button>
                  <button onClick={() => { setFiscal(f => ({ ...f, actif: false })); setEditingFiscal(false); }} style={{ background: `${G.red}15`, border: `1px solid ${G.red}50`, color: G.red, borderRadius: 20, padding: "5px 10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✕</button>
                </div>
              )}
            </div>

            {fiscal.actif && !editingFiscal && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>{paysData.drapeau || paysData.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb" }}>{structureData.emoji} {structureData.label}</div>
                    <div style={{ fontSize: 11, color: G.dim }}>{paysData.nom || paysData.label}{fiscal.dateCreation ? ` · créée le ${new Date(fiscal.dateCreation).toLocaleDateString("fr-FR")}` : ""}</div>
                  </div>
                  {structureData?.acre && fiscal.acreActif && <span style={{ fontSize: 9, fontWeight: 700, color: G.green, background: `${G.green}20`, border: `1px solid ${G.green}40`, borderRadius: 20, padding: "2px 8px" }}>ACRE</span>}
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0e0e1a" }}>
                    <span style={{ fontSize: 12, color: G.dim }}>Résultat brut</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: resultatNet >= 0 ? G.green : G.red }}>{resultatNet >= 0 ? "+" : ""}{resultatNet.toFixed(0)}$</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0e0e1a" }}>
                    <span style={{ fontSize: 12, color: G.dim }}>Impôt estimé ({tauxEffectif}% sur {isIS ? "bénéfice" : "CA"})</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: G.red }}>-{impotEstime.toFixed(0)}$</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#e5e7eb" }}>Net après impôt</span>
                    <span style={{ fontSize: 18, fontWeight: 900, fontFamily: "monospace", color: netApresImpot >= 0 ? G.green : G.red }}>{netApresImpot >= 0 ? "+" : ""}{netApresImpot.toFixed(0)}$</span>
                  </div>
                </div>
              </div>
            )}

            {fiscal.actif && editingFiscal && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Pays</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {Object.keys(PAYS_FISCAL).map(code => {
                      const p = PAYS_FISCAL[code]; const sel = fiscal.pays === code;
                      return <button key={code} onClick={() => { const ns = p.structures[0]; setFiscal(f => ({ ...f, pays: code, structure: ns.id, taux: ns.tauxDefaut || 0 })); }} style={{ background: sel ? `${G.amber}20` : "rgba(255,255,255,0.02)", border: `1px solid ${sel ? G.amber : "#1a1a2e"}`, color: sel ? G.amber : "#e5e7eb", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
                        <img src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`} alt={code} style={{ width: 18, height: 13, borderRadius: 2, objectFit: "cover" }} />
                        {p.label}
                      </button>;
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Structure</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[...paysData.structures].sort((a, b) => (b.tauxDefaut || 0) - (a.tauxDefaut || 0)).map(s => {
                      const sel = fiscal.structure === s.id;
                      return <button key={s.id} onClick={() => setFiscal(f => ({ ...f, structure: s.id, taux: s.tauxDefaut || 0 }))} style={{ background: sel ? `${G.amber}12` : "rgba(255,255,255,0.02)", border: `2px solid ${sel ? G.amber : "#1a1a2e"}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", textAlign: "left", width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: sel ? G.amber : "#e5e7eb" }}>{s.emoji} {s.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: sel ? G.amber : G.dim }}>{s.tauxDefaut}%</div>
                        </div>
                        {s.note && <div style={{ fontSize: 10, color: G.dim, marginTop: 3 }}>{s.note}</div>}
                      </button>;
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Date de création</div>
                  <input type="date" value={fiscal.dateCreation || ""} onChange={e => setFiscal(f => ({ ...f, dateCreation: e.target.value }))} style={inp} />
                </div>
                {fiscal.pays === "FR" && !!structureData?.acre && !!fiscal.dateCreation && (
                  <div style={{ background: infosAcre.active ? `${G.green}0f` : "rgba(255,255,255,0.02)", border: `1px solid ${infosAcre.active ? `${G.green}30` : "#1a1a2e"}`, borderRadius: 10, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: infosAcre.active ? 8 : 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: infosAcre.active ? G.green : G.dim }}>{infosAcre.active ? "ACRE active" : "ACRE expirée"}</div>
                      {infosAcre.active && <button onClick={() => setFiscal(f => { const a = !f.acreActif; const acreReducedRate = Math.round((structureData.taux || 0) * (1 - (acreData?.taux2 || 50) / 100)); return { ...f, acreActif: a, taux: a ? acreReducedRate : structureData.taux }; })} style={{ background: fiscal.acreActif ? `${G.green}20` : "rgba(255,255,255,0.02)", border: `1px solid ${fiscal.acreActif ? G.green : "#1a1a2e"}`, color: fiscal.acreActif ? G.green : G.dim, borderRadius: 20, padding: "4px 10px", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{fiscal.acreActif ? "✓ Appliquée" : "Appliquer"}</button>}
                    </div>
                    {infosAcre.active && <div style={{ fontSize: 10, color: G.dim, lineHeight: 1.6 }}>Exonération de <span style={{ color: G.green, fontWeight: 700 }}>{(infosAcre.tauxExoneration * 100).toFixed(0)}%</span> jusqu'au <span style={{ fontWeight: 700 }}>{infosAcre.finAcre.toLocaleDateString("fr-FR")}</span>.{fiscal.acreActif && <> Taux réduit : <span style={{ color: G.green, fontWeight: 700 }}>{infosAcre.tauxReduit.toFixed(1)}%</span>.</>}</div>}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Taux effectif (%)</div>
                  <input type="number" step="0.1" value={fiscal.taux} onChange={e => setFiscal(f => ({ ...f, taux: parseFloat(e.target.value) || 0 }))} style={inp} />
                  <div style={{ fontSize: 10, color: G.dim, marginTop: 4 }}>Défaut suggéré : {structureData.tauxDefaut}%</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0e0e1a" }}><span style={{ fontSize: 12, color: G.dim }}>Brut</span><span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: resultatNet >= 0 ? G.green : G.red }}>{resultatNet >= 0 ? "+" : ""}{resultatNet.toFixed(0)}$</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0e0e1a" }}><span style={{ fontSize: 12, color: G.dim }}>Impôt ({tauxEffectif}%)</span><span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: G.red }}>-{impotEstime.toFixed(0)}$</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0" }}><span style={{ fontSize: 12, fontWeight: 700, color: "#e5e7eb" }}>Net après impôt</span><span style={{ fontSize: 18, fontWeight: 900, fontFamily: "monospace", color: netApresImpot >= 0 ? G.green : G.red }}>{netApresImpot >= 0 ? "+" : ""}{netApresImpot.toFixed(0)}$</span></div>
                </div>
                <button onClick={() => setEditingFiscal(false)} style={{ background: G.amber, color: "#06060f", border: "none", borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>✓ Confirmer</button>
              </div>
            )}
          </div>

          {/* MentorQ */}
          <div style={card}>
            <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>MentorQ / Formation</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: G.dim, marginBottom: 6 }}>Mensuel ($)</div>
                <input type="number" value={mentorQ.mensuel || 0} onChange={e => setMentorQ(m => ({ ...m, mensuel: parseFloat(e.target.value) || 0 }))} style={inp} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: G.dim, marginBottom: 6 }}>Début</div>
                <input type="month" value={mentorQ.moisDebut || ""} onChange={e => setMentorQ(m => ({ ...m, moisDebut: e.target.value }))} style={inp} />
              </div>
            </div>
            {totalMQ > 0 && <div style={{ fontSize: 12, color: G.red, fontFamily: "monospace", fontWeight: 700 }}>-{totalMQ.toFixed(0)}$ ({moisMQ} mois)</div>}
          </div>

          {/* Frais divers */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2 }}>Frais divers</div>
              <button onClick={() => setShowFraisForm(s => !s)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a2e", color: G.green, borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>+ Ajouter</button>
            </div>
            {showFraisForm && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12, background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 12 }}>
                <input placeholder="Libellé" value={newFrais.label} onChange={e => setNewFrais(f => ({ ...f, label: e.target.value }))} style={inp} />
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
                  <input type="number" placeholder="Montant" value={newFrais.montant} onChange={e => setNewFrais(f => ({ ...f, montant: e.target.value }))} style={inp} />
                  <select value={newFrais.type} onChange={e => setNewFrais(f => ({ ...f, type: e.target.value }))} style={inp}>
                    <option value="unique">Unique</option><option value="mensuel">/mois</option><option value="annuel">/an</option>
                  </select>
                </div>
                <button onClick={addFrais} style={{ background: G.green, color: "#06060f", border: "none", borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>✓ Confirmer</button>
              </div>
            )}
            {fraisDivers.map(f => (
              <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #0e0e1a", gap: 8 }}>
                <input value={f.label} onChange={e => setFraisDivers(prev => prev.map(x => x.id === f.id ? { ...x, label: e.target.value } : x))}
                  style={{ background: "none", border: "none", color: "#ccc", fontSize: 12, flex: 1, fontFamily: "inherit", padding: 0 }} />
                <span style={{ fontSize: 10, color: G.dim }}>{f.type}</span>
                <span style={{ fontSize: 12, fontFamily: "monospace", color: G.red, fontWeight: 700 }}>-{f.montant}$</span>
                <button onClick={() => setFraisDivers(prev => prev.filter(x => x.id !== f.id))} style={{ background: "none", border: "none", color: G.muted, cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>
              </div>
            ))}
            {fraisDivers.length === 0 && !showFraisForm && <div style={{ fontSize: 11, color: G.dim, textAlign: "center", padding: "8px 0" }}>Aucun frais</div>}
          </div>
        </div>
      </div>

      {/* ── LIGNE 2 : Comptes prop firms + Historique payouts ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Comptes */}
        <div style={card}>
          <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Comptes prop firms</div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 90px 70px", gap: 6, padding: "0 0 6px", borderBottom: "1px solid #0e0e1a", marginBottom: 6 }}>
            {["Compte", "Achat", "Activation", "Payouts", "ROI"].map(h => (
              <div key={h} style={{ fontSize: 9, color: G.dim, textTransform: "uppercase", fontWeight: 700, textAlign: h === "Compte" ? "left" : "right" }}>{h}</div>
            ))}
          </div>
          {Object.entries(byType).map(([type, cs]) =>
            cs.map((c, idx) => {
              const couleur = getCouleurCompte(type, idx, cs.length);
              const inv = (c.achat || 0) + (c.activation || 0);
              const rec = (c.payouts || []).reduce((a, p) => a + (p.montant || 0), 0);
              const r = inv ? ((rec - inv) / inv * 100) : 0;
              return (
                <div key={c.id} onClick={() => onEditCompte && onEditCompte(c)}
                  style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 90px 70px", gap: 6, padding: "7px 8px", borderLeft: `3px solid ${couleur}`, borderRadius: 6, marginBottom: 4, cursor: onEditCompte ? "pointer" : "default", background: "rgba(255,255,255,0.02)", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#e5e7eb" }}>{PROP_FIRMS_CATALOG[type]?.emoji} {c.nom}</div>
                    {c.numero && <div style={{ fontSize: 9, color: couleur, fontFamily: "monospace" }}>#{c.numero}</div>}
                  </div>
                  <div style={{ textAlign: "right", fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: G.red }}>-{c.achat || 0}$</div>
                  <div style={{ textAlign: "right", fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: G.amber }}>-{c.activation || 0}$</div>
                  <div style={{ textAlign: "right", fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: G.green }}>+{rec}$</div>
                  <div style={{ textAlign: "right", fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: r >= 0 ? G.green : G.red }}>{r >= 0 ? "+" : ""}{r.toFixed(0)}%</div>
                </div>
              );
            })
          )}
          {comptes.length === 0 && <div style={{ fontSize: 11, color: G.dim, textAlign: "center", padding: "16px 0" }}>Aucun compte enregistré</div>}

          {/* Ajouter payout */}
          <div style={{ borderTop: "1px solid #0e0e1a", paddingTop: 12, marginTop: 8 }}>
            <button onClick={() => setShowPayoutForm(s => !s)} style={{ width: "100%", background: `${G.green}15`, border: `1px solid ${G.green}30`, color: G.green, borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: showPayoutForm ? 12 : 0 }}>
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
                <button onClick={addPayout} style={{ background: G.green, color: "#06060f", border: "none", borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>✓ Confirmer le payout</button>
              </div>
            )}
          </div>
        </div>

        {/* Historique payouts */}
        <div style={card}>
          <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Toutes les entrées</div>
          {(() => {
            const tousLesPayouts = comptes.flatMap(c =>
              (c.payouts || []).map(p => ({ ...p, compteNom: c.nom, compteType: c.type, compteId: c.id }))
            ).sort((a, b) => new Date(b.date) - new Date(a.date));
            if (tousLesPayouts.length === 0) return <div style={{ textAlign: "center", padding: "16px 0", color: G.dim, fontSize: 11 }}>Aucun payout enregistré</div>;
            return tousLesPayouts.map((p, i) => {
              const cs = byType[p.compteType] || [];
              const idx = cs.findIndex(c => c.id === p.compteId);
              const couleur = getCouleurCompte(p.compteType, idx >= 0 ? idx : 0, cs.length || 1);
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "10px 12px", marginBottom: 8, borderLeft: `3px solid ${couleur}` }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#e5e7eb" }}>{PROP_FIRMS_CATALOG[p.compteType]?.emoji} {p.compteNom}</div>
                    <div style={{ fontSize: 10, color: G.dim }}>{p.date}</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "monospace", color: G.green }}>+{p.montant}{getDeviseSymbole(p.devise || "USD")}</div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
function getDeviseSymbole(code) {
  return DEVISES.find(d => d.code === code)?.symbole || code || "$";
}

function buildEcosystemContext(trades, comptes) {
  const gainTotal = trades.reduce((a, t) => a + t.pnl, 0);
  const totalPayouts = comptes.reduce((a, c) => a + (c.payouts || []).reduce((s, p) => s + p.montant, 0), 0);
  const nbTrades = trades.length;
  const wins = trades.filter(t => t.pnl > 0).length;
  const winRate = nbTrades ? Math.round((wins / nbTrades) * 100) : 0;
  const nbComptes = comptes.length;
  const joursValides = trades.filter(t => t.joursPayoutValide).length;
  return { gainTotal, totalPayouts, nbTrades, wins, winRate, nbComptes, joursValides };
}

const QUETES_CATALOG = [
  { id: "q1", emoji: "🎯", titre: "Premier trade journalisé", note: "Enregistre ton premier trade dans le journal", montant: 0, devise: "USD", deadline: "", checkAuto: (ctx) => ctx.nbTrades >= 1 },
  { id: "q2", emoji: "📋", titre: "10 trades journalisés", note: "La constance commence par l'habitude de noter", montant: 0, devise: "USD", deadline: "", checkAuto: (ctx) => ctx.nbTrades >= 10 },
  { id: "q3", emoji: "🏆", titre: "50 trades journalisés", note: "Tu fais partie des traders sérieux", montant: 0, devise: "USD", deadline: "", checkAuto: (ctx) => ctx.nbTrades >= 50 },
  { id: "q4", emoji: "💰", titre: "Premier payout reçu", note: "Tu as reçu ton premier paiement de prop firm", montant: 0, devise: "USD", deadline: "", checkAuto: (ctx) => ctx.totalPayouts > 0 },
  { id: "q5", emoji: "🚀", titre: "$1 000 de payouts cumulés", note: "Tu génères un revenu réel depuis le trading", montant: 1000, devise: "USD", deadline: "", checkAuto: (ctx) => ctx.totalPayouts >= 1000 },
  { id: "q6", emoji: "💎", titre: "$5 000 de payouts cumulés", note: "Tu es dans le top 5% des traders financés", montant: 5000, devise: "USD", deadline: "", checkAuto: (ctx) => ctx.totalPayouts >= 5000 },
  { id: "q7", emoji: "📈", titre: "Win rate ≥ 50%", note: "Plus de la moitié de tes trades sont gagnants", montant: 0, devise: "USD", deadline: "", checkAuto: (ctx) => ctx.nbTrades >= 10 && ctx.winRate >= 50 },
  { id: "q8", emoji: "🏦", titre: "3 comptes actifs", note: "Diversifie tes risques sur plusieurs comptes", montant: 0, devise: "USD", deadline: "", checkAuto: (ctx) => ctx.nbComptes >= 3 },
  { id: "q9", emoji: "🌟", titre: "5 jours Topstep validés", note: "5 jours à +$150 minimum", montant: 0, devise: "USD", deadline: "", checkAuto: (ctx) => ctx.joursValides >= 5 },
  { id: "q10", emoji: "🧘", titre: "PnL global positif", note: "Ton compte global est dans le vert", montant: 0, devise: "USD", deadline: "", checkAuto: (ctx) => ctx.gainTotal > 0 },
];

function Objectifs({ trades, comptes, objectifs, setObjectifs, lang = "fr" }) {
  const T = TR[lang]; const fr = lang === "fr";
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
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>

      {/* ── COLONNE GAUCHE : Objectifs perso ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>

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

      </div>{/* fin colonne gauche */}

      {/* ── COLONNE DROITE : Quêtes ── */}
      <div style={{ width: "48%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>

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

      </div>{/* fin colonne droite */}
    </div>
  );
}

const CHECKLIST_DEFAULT = [
  { id: "annonces",  icon: "📰", label: "Annonces économiques vérifiées", sub: "NFP, CPI, Fed, BCE… aucun event majeur pendant ma session" },
  { id: "contexte",  icon: "🗺️", label: "Contexte de marché analysé",    sub: "Bias directionnel identifié — haussier, baissier ou range" },
  { id: "niveaux",   icon: "📐", label: "Niveaux clés tracés",            sub: "Supports, résistances, zones d'intérêt sur le graphique" },
  { id: "plan",      icon: "📋", label: "Plan de trade défini",           sub: "Je sais quel(s) setup(s) je cherche aujourd'hui" },
  { id: "mll",       icon: "🛡️", label: "MLL / drawdown vérifié",        sub: "Je connais ma marge restante et je respecte mes limites" },
  { id: "maxperte",  icon: "🔴", label: "Max de pertes fixé",             sub: "Si j'atteins ce seuil aujourd'hui, j'arrête la session" },
  { id: "mental",    icon: "🧠", label: "État mental OK",                 sub: "Je suis calme, focalisé, sans pression émotionnelle" },
  { id: "ecrans",    icon: "📵", label: "Distractions coupées",           sub: "Téléphone silencieux, notifications off, environnement calme" },
];

const HUMEURS = [
  { val: 1, emoji: "😣", label: "Très mauvaise" },
  { val: 2, emoji: "😕", label: "Mauvaise" },
  { val: 3, emoji: "😐", label: "Neutre" },
  { val: 4, emoji: "🙂", label: "Bonne" },
  { val: 5, emoji: "🔥", label: "Excellente" },
];

function SessionDuJour({ sessions, setSessions, user }) {
  const authFetch = makeAuthFetch(user);
  const today = new Date().toISOString().slice(0, 10);
  const session = sessions?.[today] || {};

  const set = (key, val) => setSessions(prev => ({
    ...prev,
    [today]: { ...(prev?.[today] || {}), [key]: val },
  }));

  const checklist = session.checklist || {};
  const intention = session.intention || "";
  const humeur = session.humeur ?? null;
  const customItems = session.customItems || [];

  const [step, setStep] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const STEPS = ["Annonces", "État d'esprit", "Préparation", "Corps & Vie", "Intention", "Checklist"];
  const [newItem, setNewItem] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  // Annonces économiques via Netlify Function
  const [annonces, setAnnonces] = useState(null);
  const [annoncesErr, setAnnoncesErr] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const cacheKey = `ff_eco7_${today}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) { setAnnonces(JSON.parse(cached)); return; }
    (async () => {
      try {
        const r = await authFetch("/api/calendar");
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        if (data && data.error) throw new Error(data.error);
        if (cancelled) return;
        const normalize = a => ({
          event:    a.event   || a.title    || "—",
          country:  a.country || "USD",
          time:     a.time    || a.date     || "",
          impact:   (a.impact || "low").toLowerCase(),
          estimate: a.estimate ?? a.forecast ?? null,
          prev:     a.prev    ?? a.previous ?? null,
          actual:   a.actual  ?? null,
          unit:     a.unit    || "",
        });
        const list = (Array.isArray(data) ? data : [])
          .map(normalize)
          .filter(a => {
            if (!a.time) return false;
            const d = new Date(a.time);
            if (isNaN(d)) return false;
            return d.toLocaleDateString("fr-CA", { timeZone: "Europe/Paris" }) === today;
          })
          .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
        sessionStorage.setItem(cacheKey, JSON.stringify(list));
        setAnnonces(list);
        if (list.length > 0) set("annonces", list);
      } catch (e) {
        if (!cancelled) setAnnoncesErr("Erreur : " + e.message);
      }
    })();
    return () => { cancelled = true; };
  }, [today]);

  const toggleCheck = (id) => set("checklist", { ...checklist, [id]: !checklist[id] });

  const allItems = [...CHECKLIST_DEFAULT, ...customItems];
  const done = allItems.filter(i => checklist[i.id]).length;
  const total = allItems.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const addCustom = () => {
    if (!newItem.trim()) return;
    const id = "custom_" + Date.now();
    set("customItems", [...customItems, { id, icon: "✏️", label: newItem.trim(), sub: "" }]);
    setNewItem("");
    setShowAdd(false);
  };

  const removeCustom = (id) => {
    set("customItems", customItems.filter(i => i.id !== id));
    const newCk = { ...checklist }; delete newCk[id];
    set("checklist", newCk);
  };

  const G = { green: "#00e5a0", red: "#ef4444", purple: "#818cf8", amber: "#f59e0b", dim: "#6b7280", bg: "#0a0a14", card: "#0e0e1a", border: "#1a1a2e" };

  const dateLabel = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // Statut marché du jour
  const todayHolidays = HOLIDAYS_CACHE[today] || [];
  const earlyClose = todayHolidays.filter(h => h.type === "early_close");
  const fullClose  = todayHolidays.filter(h => h.type !== "early_close");
  const dowToday   = new Date().getDay(); // 0=dim, 6=sam
  const isWeekend  = dowToday === 0 || dowToday === 6;

  const ECHANGES_INFO = {
    "CME":      { flag: "🇺🇸", label: "CME Group" },
    "NYSE":     { flag: "🇺🇸", label: "NYSE" },
    "Euronext": { flag: "🇪🇺", label: "Euronext" },
  };

  const formatExchanges = (exList) => {
    const byPays = {};
    exList.forEach(ex => {
      const info = ECHANGES_INFO[ex] || { flag: "🌐", label: ex };
      if (!byPays[info.flag]) byPays[info.flag] = [];
      byPays[info.flag].push(info.label);
    });
    return Object.entries(byPays).map(([flag, names]) => `${flag} ${names.join(" · ")}`).join("  |  ");
  };

  // Score de complétion de la session
  const completionItems = [
    { label: "État d'esprit",    done: (session.etat_esprit || []).length > 0 },
    { label: "Plan de trading",  done: !!session.plan_trading },
    { label: "Intimité avec Dieu", done: !!session.intimite_dieu },
    { label: "Sport",            done: !!session.sport },
    { label: "Tierce personne",  done: !!session.tierce },
    { label: "Alimentation",     done: !!session.alimentation },
    { label: "Sommeil",          done: !!session.qualite_sommeil },
    { label: "Intention",        done: (session.intention || "").trim().length > 10 },
    { label: "Checklist",        done: pct === 100 },
  ];
  const completionDone = completionItems.filter(i => i.done).length;
  const completionPct = Math.round((completionDone / completionItems.length) * 100);
  const completionColor = completionPct === 100 ? G.green : completionPct >= 50 ? G.amber : G.purple;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 16px", display: "flex", flexDirection: "column", gap: 20, color: "#e5e7eb" }}>

      {/* Header + progression */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: G.green, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>
          Préparation · <span style={{ color: "#fff" }}>{dateLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
          <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, letterSpacing: -1.2, lineHeight: 1, margin: 0 }}>
            Session<br />
            <span style={{ background: "linear-gradient(135deg,#00e5a0,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>du jour.</span>
          </h1>
          {/* Cercle de complétion */}
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="#1a1a2e" strokeWidth="6" />
              <circle cx="36" cy="36" r="30" fill="none" stroke={completionColor} strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - completionPct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
              <text x="36" y="40" textAnchor="middle" fill={completionColor} fontSize="14" fontWeight="800" fontFamily="inherit">{completionPct}%</text>
            </svg>
            <div style={{ fontSize: 10, color: G.dim, marginTop: 2 }}>
              {completionDone}/{completionItems.length} complétés
            </div>
          </div>
        </div>

        {/* Barre de progression linéaire */}
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ height: 6, background: "#1a1a2e", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${completionPct}%`, background: `linear-gradient(90deg, ${G.purple}, ${completionColor})`, borderRadius: 6, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {completionItems.map((item, i) => (
              <div key={i} style={{
                fontSize: 10, padding: "3px 8px", borderRadius: 20,
                background: item.done ? `${completionColor}18` : "rgba(255,255,255,0.03)",
                border: `1px solid ${item.done ? completionColor + "50" : "#1a1a2e"}`,
                color: item.done ? completionColor : G.dim,
                fontWeight: item.done ? 700 : 400,
              }}>
                {item.done ? "✓ " : ""}{item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bandeau statut marché */}
      {isWeekend ? (
        <div style={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>💤</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Weekend — marchés fermés</div>
            <div style={{ fontSize: 11, color: "#4b5563", marginTop: 2 }}>Les marchés rouvrent lundi. Profite pour analyser et préparer la semaine.</div>
          </div>
        </div>
      ) : fullClose.length > 0 ? (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, padding: "14px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>🔴</span>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#ef4444" }}>Journée sans trading — marché(s) fermé(s)</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingLeft: 34 }}>
            {fullClose.map((h, i) => (
              <div key={i} style={{ fontSize: 12, color: "#fca5a5" }}>
                <span style={{ fontWeight: 700 }}>{h.label}</span>
                <span style={{ color: "#6b7280", marginLeft: 8 }}>{formatExchanges(h.exchanges)}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, paddingLeft: 34, fontSize: 11, color: "#6b7280", fontStyle: "italic" }}>
            Pas de position ouverte aujourd'hui. Tu peux utiliser ce temps pour réviser ton journal ou backtester.
          </div>
        </div>
      ) : earlyClose.length > 0 ? (
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 14, padding: "14px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>🟡</span>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#f59e0b" }}>Clôture anticipée aujourd'hui</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingLeft: 34 }}>
            {earlyClose.map((h, i) => (
              <div key={i} style={{ fontSize: 12, color: "#fcd34d" }}>
                <span style={{ fontWeight: 700 }}>{h.label}</span>
                {h.closeTime && <span style={{ background: "rgba(245,158,11,0.15)", borderRadius: 4, padding: "1px 6px", marginLeft: 8, fontWeight: 700 }}>Fermeture {h.closeTime}</span>}
                <span style={{ color: "#6b7280", marginLeft: 8 }}>{formatExchanges(h.exchanges)}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, paddingLeft: 34, fontSize: 11, color: "#6b7280", fontStyle: "italic" }}>
            Adapte ta gestion du temps : les séances peuvent être moins liquides en fin de journée.
          </div>
        </div>
      ) : (
        <div style={{ background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.2)", borderRadius: 14, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>🟢</span>
          <div style={{ fontSize: 12, color: "#00e5a0", fontWeight: 600 }}>Marchés ouverts — séance normale</div>
        </div>
      )}

      {/* Progress dots */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div onClick={() => i < step - 1 && setStep(i + 1)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: i < step - 1 ? "pointer" : "default" }}>
              <div style={{ width: i === step - 1 ? 24 : 8, height: 8, borderRadius: 4, background: i < step - 1 ? G.purple : i === step - 1 ? G.purple : "#1e1e2e", transition: "all 0.3s", boxShadow: i === step - 1 ? `0 0 12px ${G.purple}60` : "none", opacity: i < step - 1 ? 0.5 : 1 }} />
              <div style={{ fontSize: 9, color: i === step - 1 ? G.purple : i < step - 1 ? `${G.purple}70` : "#333", fontWeight: i === step - 1 ? 700 : 400, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>{s}</div>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: i < step - 1 ? `${G.purple}50` : "#1e1e2e", marginBottom: 16, flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      {/* Annonces économiques */}
      {step === 1 && (<div>
      {(() => {
        const PAYS_FLAG = { USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", CAD: "🇨🇦", AUD: "🇦🇺", CHF: "🇨🇭", CNY: "🇨🇳", NZD: "🇳🇿", US: "🇺🇸", EU: "🇪🇺", GB: "🇬🇧" };
        const IMPACT_STYLE = {
          high:   { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",  label: "Fort" },
          medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)", label: "Moyen" },
          low:    { color: "#6b7280", bg: "rgba(107,114,128,0.08)", border: G.border,               label: "Faible" },
        };
        const fmtTime = (timeStr) => {
          if (!timeStr) return "--:--";
          const d = new Date(timeStr);
          if (isNaN(d)) return "--:--";
          return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
        };
        const fmtVal = (v, unit) => v != null ? `${v}${unit ? " " + unit : ""}` : "—";

        const important = (annonces || []).filter(a => a.impact === "high" || a.impact === "medium");
        const lowAnnonces = (annonces || []).filter(a => a.impact === "low" || !a.impact);
        const highCount = (annonces || []).filter(a => a.impact === "high").length;
        const medCount = (annonces || []).filter(a => a.impact === "medium").length;

        return (
          <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "18px 20px" }}>
            {/* Header fixe */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2 }}>📰 Points importants</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: G.text, marginTop: 2 }}>Annonces économiques</div>
            </div>

            {/* Sous-titre comptage */}
            {annonces && annonces.length > 0 && (
              <div style={{ display: "flex", gap: 10, marginBottom: 14, marginTop: 6 }}>
                {highCount > 0 && <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 700 }}>● {highCount} fort</span>}
                {medCount > 0 && <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>● {medCount} moyen</span>}
                {lowAnnonces.length > 0 && <span style={{ fontSize: 11, color: G.dim }}>● {lowAnnonces.length} faible</span>}
              </div>
            )}

            {/* Chargement / erreur / vide */}
            {annonces === null && !annoncesErr && (
              <div style={{ fontSize: 12, color: G.dim, textAlign: "center", padding: "12px 0" }}>Chargement…</div>
            )}
            {annoncesErr && (
              <div style={{ fontSize: 12, color: G.red, padding: "8px 0" }}>{annoncesErr}</div>
            )}
            {annonces && annonces.length === 0 && (
              <div style={{ fontSize: 12, color: G.dim, padding: "8px 0" }}>Aucune annonce prévue aujourd'hui.</div>
            )}

            {/* Cartes importantes toujours visibles */}
            {important.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: lowAnnonces.length > 0 ? 10 : 0 }}>
                {important.map((a, i) => {
                  const imp = IMPACT_STYLE[a.impact];
                  const flag = PAYS_FLAG[a.country] || "🌐";
                  return (
                    <div key={i} style={{
                      background: imp.bg,
                      border: `1px solid ${imp.border}`,
                      borderRadius: 12, padding: "12px 14px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", fontFamily: "monospace" }}>{fmtTime(a.time)}</span>
                        <span style={{ fontSize: 14 }}>{flag}</span>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: imp.color, lineHeight: 1.3, marginBottom: 4 }}>{a.event}</div>
                      <div style={{ display: "flex", gap: 8, fontSize: 10, color: G.dim, flexWrap: "wrap" }}>
                        {a.prev != null && <span>Préc. <b style={{ color: "#9ca3af" }}>{fmtVal(a.prev, a.unit)}</b></span>}
                        {a.estimate != null && <span>Est. <b style={{ color: G.amber }}>{fmtVal(a.estimate, a.unit)}</b></span>}
                        {a.actual != null && <span>Réel <b style={{ color: a.actual >= (a.estimate ?? a.prev ?? 0) ? G.green : G.red }}>{fmtVal(a.actual, a.unit)}</b></span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {important.length === 0 && annonces && annonces.length > 0 && (
              <div style={{ fontSize: 12, color: G.dim, marginBottom: 10 }}>Aucune annonce importante aujourd'hui.</div>
            )}

            {/* Bouton déplier les faibles */}
            {lowAnnonces.length > 0 && (
              <button onClick={() => setExpanded(v => !v)} style={{
                width: "100%", background: "none", border: `1px dashed ${G.border}`,
                borderRadius: 10, padding: "8px", color: G.dim, fontSize: 11,
                cursor: "pointer", marginBottom: expanded ? 10 : 0,
              }}>
                {expanded ? "▲ Masquer les annonces faibles" : `▼ Voir ${lowAnnonces.length} annonce(s) faible(s)`}
              </button>
            )}

            {/* Liste faibles dépliable */}
            {expanded && lowAnnonces.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {lowAnnonces.map((a, i) => {
                  const imp = IMPACT_STYLE.low;
                  const flag = PAYS_FLAG[a.country] || "🌐";
                  return (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${G.border}`,
                      borderLeft: `3px solid ${imp.color}`,
                      borderRadius: 10, padding: "10px 14px",
                      display: "grid", gridTemplateColumns: "44px 1fr auto", alignItems: "center", gap: 12,
                    }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: "monospace" }}>{fmtTime(a.time)}</div>
                        <div style={{ fontSize: 16, lineHeight: 1, marginTop: 2 }}>{flag}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#d1d5db", marginBottom: 3 }}>{a.event}</div>
                        <div style={{ display: "flex", gap: 10, fontSize: 10, color: G.dim }}>
                          {a.prev != null && <span>Préc. <b style={{ color: "#9ca3af" }}>{fmtVal(a.prev, a.unit)}</b></span>}
                          {a.estimate != null && <span>Est. <b style={{ color: G.amber }}>{fmtVal(a.estimate, a.unit)}</b></span>}
                          {a.actual != null && <span>Réel <b style={{ color: a.actual >= (a.estimate ?? a.prev ?? 0) ? G.green : G.red }}>{fmtVal(a.actual, a.unit)}</b></span>}
                        </div>
                      </div>
                      <div style={{ background: imp.bg, color: imp.color, fontSize: 9, fontWeight: 800, borderRadius: 6, padding: "3px 7px", whiteSpace: "nowrap", letterSpacing: 0.5 }}>
                        FAIBLE
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}
      </div>)}

      {/* Aujourd'hui je me sens */}
      {step === 2 && (<div>
      {(() => {
        const ETATS = [
          { val: "concentré",       label: "Concentré",         emoji: "🎯" },
          { val: "déterminé",       label: "Déterminé",         emoji: "💪" },
          { val: "envie_apprendre", label: "Envie d'apprendre", emoji: "📚" },
          { val: "serein",          label: "Serein",            emoji: "🧘" },
          { val: "motivé",          label: "Motivé",            emoji: "🔥" },
          { val: "préoccupé",       label: "Préoccupé",         emoji: "😟" },
          { val: "pas_la_tete",     label: "Pas la tête à ça",  emoji: "😶" },
          { val: "fatigué",         label: "Fatigué",           emoji: "😪" },
          { val: "impatient",       label: "Impatient",         emoji: "⚡" },
          { val: "stressé",         label: "Stressé",           emoji: "😰" },
        ];
        const POSITIFS = ["concentré","déterminé","envie_apprendre","serein","motivé"];
        const selected = session.etat_esprit || [];
        const toggle = (val) => {
          const next = selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val];
          set("etat_esprit", next);
        };
        return (
          <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "20px 22px" }}>
            <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>💭 Aujourd'hui je me sens…</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ETATS.map(e => {
                const isSelected = selected.includes(e.val);
                const isPos = POSITIFS.includes(e.val);
                const color = isPos ? G.green : G.amber;
                return (
                  <button key={e.val} onClick={() => toggle(e.val)} style={{
                    padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: isSelected ? 700 : 400,
                    background: isSelected ? `${color}20` : "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${isSelected ? color : G.border}`,
                    color: isSelected ? color : G.dim,
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "all 0.15s",
                  }}>
                    <span>{e.emoji}</span>
                    <span>{e.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}
      </div>)}

      {/* Étape 3 — Préparation mentale & spirituelle */}
      {step === 3 && (<div>
      {(() => {
        const tierce = session.tierce ?? null;
        const BtnOuiNon = ({ current, onChange, ouiColor, nonColor }) => (
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { val: "Oui", color: ouiColor || G.green },
              { val: "Non", color: nonColor || G.red },
            ].map(({ val, color }) => (
              <button key={val} onClick={() => onChange(current === val ? null : val)} style={{
                flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700,
                background: current === val ? `${color}22` : "rgba(255,255,255,0.03)",
                border: `1.5px solid ${current === val ? color : G.border}`,
                color: current === val ? color : G.dim,
                transition: "all 0.15s",
              }}>{val}</button>
            ))}
          </div>
        );
        return (
          <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "20px 22px" }}>
            <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 18 }}>🧠 Préparation</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <div style={{ fontSize: 12, color: G.text, fontWeight: 600, marginBottom: 8 }}>📋 Ai-je un plan de trading clair ?</div>
                <BtnOuiNon current={session.plan_trading ?? null} onChange={v => set("plan_trading", v)} ouiColor={G.green} nonColor={G.amber} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: G.text, fontWeight: 600, marginBottom: 8 }}>🙏 Temps d'intimité avec Dieu</div>
                <BtnOuiNon current={session.intimite_dieu ?? null} onChange={v => set("intimite_dieu", v)} ouiColor={G.green} nonColor={G.amber} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: G.text, fontWeight: 600, marginBottom: 8 }}>👤 Présence d'une tierce personne dans le lieu de trade ?</div>
                <BtnOuiNon current={tierce} onChange={v => set("tierce", v)} ouiColor={G.amber} nonColor={G.green} />
              </div>
            </div>
          </div>
        );
      })()}
      </div>)}

      {/* Étape 4 — Corps & Hygiène de vie */}
      {step === 4 && (<div>
      {(() => {
        const sport = session.sport ?? null;
        const alimentation = session.alimentation ?? null;
        const qualiteSommeil = session.qualite_sommeil ?? null;
        const heureCoucher = session.heure_coucher ?? "";
        const tempsSommeil = session.temps_sommeil ?? "";
        const ecrans = session.ecrans ?? null;

        const BtnOuiNon = ({ current, onChange, ouiColor, nonColor }) => (
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { val: "Oui", color: ouiColor || G.green },
              { val: "Non", color: nonColor || G.red },
            ].map(({ val, color }) => (
              <button key={val} onClick={() => onChange(current === val ? null : val)} style={{
                flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700,
                background: current === val ? `${color}22` : "rgba(255,255,255,0.03)",
                border: `1.5px solid ${current === val ? color : G.border}`,
                color: current === val ? color : G.dim,
                transition: "all 0.15s",
              }}>{val}</button>
            ))}
          </div>
        );

        const ALIMENTS = [
          { val: "Saine",    emoji: "🥗", color: G.green },
          { val: "Neutre",   emoji: "🍱", color: G.amber },
          { val: "Mauvaise", emoji: "🍔", color: G.red },
        ];

        return (
          <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "20px 22px" }}>
            <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 18 }}>🏃 Corps & Hygiène de vie</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              <div>
                <div style={{ fontSize: 12, color: G.text, fontWeight: 600, marginBottom: 8 }}>🏃 Sport aujourd'hui ?</div>
                <BtnOuiNon current={sport} onChange={v => set("sport", v)} ouiColor={G.green} nonColor={G.red} />
              </div>

              <div>
                <div style={{ fontSize: 12, color: G.text, fontWeight: 600, marginBottom: 8 }}>🍽️ Alimentation</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {ALIMENTS.map(a => (
                    <button key={a.val} onClick={() => set("alimentation", alimentation === a.val ? null : a.val)} style={{
                      flex: 1, padding: "10px 4px", borderRadius: 12, cursor: "pointer",
                      background: alimentation === a.val ? `${a.color}18` : "rgba(255,255,255,0.02)",
                      border: `1.5px solid ${alimentation === a.val ? a.color : G.border}`,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.15s",
                    }}>
                      <span style={{ fontSize: 22 }}>{a.emoji}</span>
                      <span style={{ fontSize: 10, color: alimentation === a.val ? a.color : G.dim, fontWeight: alimentation === a.val ? 700 : 400 }}>{a.val}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, color: G.text, fontWeight: 600, marginBottom: 10 }}>😴 Sommeil</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, background: G.card, border: `2px solid ${G.border}`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap", fontWeight: 700 }}>🌙 Coucher</div>
                      <input
                        type="time"
                        value={heureCoucher}
                        onChange={e => set("heure_coucher", e.target.value)}
                        style={{ background: "transparent", border: "none", color: "#e5e7eb", fontSize: 20, fontWeight: 800, outline: "none", flex: 1, textAlign: "center", colorScheme: "dark" }}
                      />
                    </div>
                    <div style={{ flex: 1, background: G.card, border: `2px solid ${G.border}`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap", fontWeight: 700 }}>⏱️ Sommeil (h)</div>
                      <input
                        type="number"
                        min="0" max="24" step="0.5"
                        value={tempsSommeil}
                        onChange={e => set("temps_sommeil", e.target.value)}
                        placeholder="7.5"
                        style={{ background: "transparent", border: "none", color: "#e5e7eb", fontSize: 20, fontWeight: 800, outline: "none", flex: 1, textAlign: "center", colorScheme: "dark" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: G.dim, marginBottom: 6 }}>📱 Écrans avant de dormir ?</div>
                    <BtnOuiNon current={ecrans} onChange={v => set("ecrans", v)} ouiColor={G.amber} nonColor={G.green} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: G.dim, marginBottom: 8 }}>Qualité du sommeil</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[1,2,3,4,5].map(n => {
                        const color = n <= 2 ? G.red : n === 3 ? G.amber : G.green;
                        const active = qualiteSommeil >= n;
                        return (
                          <button key={n} onClick={() => set("qualite_sommeil", qualiteSommeil === n ? null : n)} style={{
                            flex: 1, padding: "12px 0", borderRadius: 10, cursor: "pointer",
                            fontSize: 13, fontWeight: 700,
                            background: active ? `${color}22` : "rgba(255,255,255,0.04)",
                            border: `1.5px solid ${active ? color : G.border}`,
                            color: active ? color : G.dim,
                            transition: "all 0.15s",
                            boxShadow: active ? `0 0 10px ${color}30` : "none",
                          }}>{n}</button>
                        );
                      })}
                    </div>
                    {qualiteSommeil && (
                      <div style={{ fontSize: 11, color: qualiteSommeil <= 2 ? G.red : qualiteSommeil === 3 ? G.amber : G.green, marginTop: 6, textAlign: "center", fontWeight: 600 }}>
                        {qualiteSommeil}/5 — {qualiteSommeil <= 2 ? "Mauvais" : qualiteSommeil === 3 ? "Moyen" : qualiteSommeil === 4 ? "Bon" : "Excellent"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      })()}
      </div>)}

      {/* Intention */}
      {step === 5 && (
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "20px 22px" }}>
        <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>✍️ Intention du jour</div>
        <textarea
          value={intention}
          onChange={e => set("intention", e.target.value)}
          placeholder={"Aujourd'hui je prévois… Quel est mon objectif pour cette session ? Sur quel actif ? Quel setup je cherche ? Comment je me sens ?"}
          rows={5}
          style={{
            width: "100%", background: "rgba(255,255,255,0.02)", border: `1px solid ${G.border}`,
            borderRadius: 12, padding: "14px 16px", color: "#e5e7eb", fontSize: 14, lineHeight: 1.7,
            resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box",
          }}
        />
      </div>
      )}

      {/* Checklist */}
      {step === 6 && (
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 2 }}>✅ Checklist pré-session</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 11, color: pct === 100 ? G.green : G.dim, fontWeight: 700 }}>{done}/{total}</div>
            <div style={{ width: 80, height: 4, background: G.border, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? G.green : G.purple, borderRadius: 4, transition: "width 0.3s" }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CHECKLIST_DEFAULT.map(item => {
            const checked = !!checklist[item.id];
            return (
              <button key={item.id} onClick={() => toggleCheck(item.id)} style={{
                background: checked ? `${G.green}0c` : "rgba(255,255,255,0.02)",
                border: `1px solid ${checked ? G.green + "40" : G.border}`,
                borderRadius: 12, padding: "12px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: checked ? G.green : "#e5e7eb", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: G.dim }}>{item.sub}</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  border: `2px solid ${checked ? G.green : G.border}`,
                  background: checked ? G.green : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}>
                  {checked && <span style={{ fontSize: 12, color: "#06060f", fontWeight: 900 }}>✓</span>}
                </div>
              </button>
            );
          })}

          {/* Items personnalisés */}
          {customItems.map(item => {
            const checked = !!checklist[item.id];
            return (
              <div key={item.id} style={{ position: "relative" }}>
                <button onClick={() => toggleCheck(item.id)} style={{
                  width: "100%", background: checked ? `${G.purple}0c` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${checked ? G.purple + "40" : G.border}`,
                  borderRadius: 12, padding: "12px 44px 12px 16px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 20 }}>✏️</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: checked ? G.purple : "#e5e7eb" }}>{item.label}</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    border: `2px solid ${checked ? G.purple : G.border}`,
                    background: checked ? G.purple : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {checked && <span style={{ fontSize: 12, color: "#fff", fontWeight: 900 }}>✓</span>}
                  </div>
                </button>
                <button onClick={() => removeCustom(item.id)} style={{
                  position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)",
                  background: "none", border: "none", color: G.dim, cursor: "pointer", fontSize: 14, padding: 4,
                }}>✕</button>
              </div>
            );
          })}

          {/* Ajouter item */}
          {showAdd ? (
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <input
                autoFocus
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addCustom(); if (e.key === "Escape") { setShowAdd(false); setNewItem(""); } }}
                placeholder="Ajouter un point de vérification…"
                style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: `1px solid ${G.border}`, borderRadius: 10, padding: "10px 14px", color: "#e5e7eb", fontSize: 13, outline: "none", fontFamily: "inherit" }}
              />
              <button onClick={addCustom} style={{ background: `${G.purple}20`, border: `1px solid ${G.purple}50`, color: G.purple, borderRadius: 10, padding: "0 16px", fontSize: 18, fontWeight: 700, cursor: "pointer" }}>+</button>
              <button onClick={() => { setShowAdd(false); setNewItem(""); }} style={{ background: "none", border: `1px solid ${G.border}`, color: G.dim, borderRadius: 10, padding: "0 12px", fontSize: 13, cursor: "pointer" }}>✕</button>
            </div>
          ) : (
            <button onClick={() => setShowAdd(true)} style={{
              background: "none", border: `1px dashed ${G.border}`, borderRadius: 12, padding: "10px 16px",
              color: G.dim, fontSize: 12, cursor: "pointer", textAlign: "left", marginTop: 4,
              transition: "all 0.15s",
            }}>
              + Ajouter un point personnalisé
            </button>
          )}
        </div>

      </div>)}

      {/* Bottom navigation */}
      <div style={{ display: "flex", gap: 10 }}>
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, background: "#0e0e1a", border: `1px solid ${G.border}`, color: "#888", borderRadius: 12, padding: "13px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>← Retour</button>
        )}
        {step < 6 && (
          <button onClick={() => setStep(s => s + 1)} style={{ flex: 2, background: G.purple, border: "none", color: "#fff", borderRadius: 12, padding: "13px 0", fontSize: 13, fontWeight: 800, cursor: "pointer", boxShadow: `0 0 20px ${G.purple}40` }}>Suivant →</button>
        )}
      </div>

      {/* Bouton de validation — apparaît quand checklist complète à l'étape 6 */}
      {step === 6 && pct === 100 && (() => {
        const validated = !!session.validatedAt;
        const heure = session.validatedAt
          ? new Date(session.validatedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
          : null;

        if (validated) {
          const etatLabels = { concentré: "Concentré 🎯", déterminé: "Déterminé 💪", envie_apprendre: "Envie d'apprendre 📚", serein: "Serein 🧘", motivé: "Motivé 🔥", préoccupé: "Préoccupé 😟", pas_la_tete: "Pas la tête à ça 😶", fatigué: "Fatigué 😪", impatient: "Impatient ⚡", stressé: "Stressé 😰" };
          const POSITIFS = ["concentré","déterminé","envie_apprendre","serein","motivé"];
          const etats = session.etat_esprit || [];
          const highAnnonces = (annonces || []).filter(a => a.impact === "high" || a.impact === "medium");
          const Row = ({ icon, label, children }) => (
            <div style={{ display: "flex", gap: 12, paddingBottom: 14, borderBottom: `1px solid ${G.border}` }}>
              <div style={{ fontSize: 16, width: 22, flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: G.dim, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 5 }}>{label}</div>
                {children}
              </div>
            </div>
          );
          return (
            <div style={{ background: "linear-gradient(135deg,#001a0e,#0a0a14)", border: `1.5px solid ${G.green}50`, borderRadius: 20, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 0, boxShadow: `0 0 48px ${G.green}18` }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ fontSize: 32 }}>🚀</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: G.green }}>Session validée à {heure}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>Reste fidèle à ton plan.</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Annonces */}
                <Row icon="📢" label="Annonces du jour">
                  {highAnnonces.length === 0
                    ? <div style={{ fontSize: 12, color: G.dim }}>Aucune annonce majeure</div>
                    : highAnnonces.map((a, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.impact === "high" ? G.red : G.amber, flexShrink: 0 }} />
                          <div style={{ fontSize: 12, color: G.text, fontWeight: 600 }}>{a.title || a.event}</div>
                          {a.country && <div style={{ fontSize: 11, color: G.dim }}>{a.country}</div>}
                        </div>
                      ))
                  }
                </Row>

                {/* État d'esprit */}
                <Row icon="💭" label="État d'esprit">
                  {etats.length === 0
                    ? <div style={{ fontSize: 12, color: G.dim }}>Non renseigné</div>
                    : <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {etats.map(e => {
                          const isPos = POSITIFS.includes(e);
                          return <span key={e} style={{ fontSize: 11, fontWeight: 700, color: isPos ? G.green : G.amber, background: isPos ? `${G.green}15` : `${G.amber}15`, borderRadius: 20, padding: "4px 10px" }}>{etatLabels[e] || e}</span>;
                        })}
                      </div>
                  }
                </Row>

                {/* Plan de trading */}
                <Row icon="📋" label="Plan de trading">
                  <div style={{ fontSize: 12, fontWeight: 700, color: session.plan_trading === "Oui" ? G.green : session.plan_trading === "Non" ? G.amber : G.dim }}>
                    {session.plan_trading === "Oui" ? "✓ Plan clair défini" : session.plan_trading === "Non" ? "⚠️ Pas de plan — sois prudent" : "Non renseigné"}
                  </div>
                </Row>

                {/* Intention */}
                {(session.intention || "").trim().length > 0 && (
                  <Row icon="✍️" label="Intention du jour">
                    <div style={{ fontSize: 12, color: G.text, lineHeight: 1.6, fontStyle: "italic" }}>
                      "{session.intention.trim()}"
                    </div>
                  </Row>
                )}
              </div>

              <button
                onClick={() => set("validatedAt", null)}
                style={{ marginTop: 20, background: "none", border: `1px solid #1a1a2e`, color: "#374151", borderRadius: 10, padding: "6px 16px", fontSize: 11, cursor: "pointer", alignSelf: "center" }}
              >
                Annuler la validation
              </button>
            </div>
          );
        }

        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 2 }}>
              Checklist complète · {total}/{total} points validés
            </div>
            <button
              onClick={() => set("validatedAt", new Date().toISOString())}
              style={{
                width: "100%",
                background: "linear-gradient(135deg,#00e5a0,#00b37a)",
                border: "none", borderRadius: 18,
                padding: "22px 32px",
                fontSize: 18, fontWeight: 900, color: "#06060f",
                cursor: "pointer", letterSpacing: -0.3,
                boxShadow: "0 0 40px rgba(0,229,160,0.35), 0 8px 32px rgba(0,0,0,0.4)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.01)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(0,229,160,0.5), 0 12px 40px rgba(0,0,0,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,229,160,0.35), 0 8px 32px rgba(0,0,0,0.4)"; }}
            >
              ✓ Je valide ma session — je suis prêt à trader
            </button>
          </div>
        );
      })()}

    </div>
  );
}

function Tarifs({ lang = "fr", user }) {
  const fr = lang === "fr";
  const G = { purple: "#818cf8", green: "#00e5a0", amber: "#f59e0b", red: "#ef4444", bg: "#06060f", card: "#0a0a14", border: "#1a1a2e", text: "#e5e7eb", dim: "#6b7280" };
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const handleSubscribe = async (planId) => {
    setError("");
    setLoading(planId);
    try {
      const token = user?.getIdToken ? await user.getIdToken() : null;
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(null); return; }
      window.open(data.url, "_blank", "noopener,noreferrer");
      setLoading(null);
    } catch (e) {
      setError("Erreur réseau, réessaie.");
      setLoading(null);
    }
  };

  const plans = [
    {
      id: "monthly",
      badge: null,
      name: fr ? "Mensuel" : "Monthly",
      price: "7,99€",
      period: fr ? "/mois" : "/month",
      priceNote: fr ? "Sans engagement" : "No commitment",
      color: G.purple,
      features: [
        fr ? "Journal de trading illimité" : "Unlimited trading journal",
        fr ? "Analyse IA personnalisée" : "Personalized AI analysis",
        fr ? "Dashboard & statistiques" : "Dashboard & statistics",
        fr ? "Calendrier économique" : "Economic calendar",
        fr ? "Sync cloud multi-appareils" : "Multi-device cloud sync",
        fr ? "Suivi prop firms" : "Prop firm tracking",
      ],
      cta: fr ? "Commencer — 7,99€/mois" : "Start — €7.99/month",
    },
    {
      id: "annual",
      badge: fr ? "🔥 2 mois offerts" : "🔥 2 months free",
      name: fr ? "Annuel" : "Annual",
      price: "79,99€",
      period: fr ? "/an" : "/year",
      priceNote: fr ? "soit 6,67€/mois — économise 15,89€" : "€6.67/month — save €15.89",
      color: G.green,
      features: [
        fr ? "Tout le plan Mensuel" : "Everything in Monthly",
        fr ? "2 mois offerts vs mensuel" : "2 months free vs monthly",
        fr ? "Accès prioritaire aux nouvelles fonctionnalités" : "Priority access to new features",
        fr ? "Support prioritaire" : "Priority support",
      ],
      cta: fr ? "Choisir l'Annuel — 79,99€/an" : "Choose Annual — €79.99/year",
    },
  ];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 11, color: G.purple, textTransform: "uppercase", letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>
          {fr ? "TARIFS" : "PRICING"}
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: G.text, lineHeight: 1.2, marginBottom: 12 }}>
          {fr ? "Investis dans ta discipline." : "Invest in your discipline."}
        </div>
        <div style={{ fontSize: 14, color: G.dim, maxWidth: 420, margin: "0 auto" }}>
          {fr
            ? "Un outil pensé pour les traders prop firm sérieux. Annule quand tu veux."
            : "Built for serious prop firm traders. Cancel anytime."}
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, maxWidth: 640, margin: "0 auto" }}>
        {plans.map(p => (
          <div key={p.id} style={{
            background: G.card,
            border: `1.5px solid ${p.id === "annual" ? p.color + "60" : G.border}`,
            borderRadius: 20, padding: "28px 24px",
            display: "flex", flexDirection: "column", gap: 0,
            position: "relative",
            boxShadow: p.id === "annual" ? `0 0 40px ${p.color}18` : "none",
          }}>
            {/* Badge */}
            {p.badge && (
              <div style={{
                position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                background: p.color, color: p.id === "lifetime" ? "#06060f" : "#06060f",
                fontSize: 10, fontWeight: 800, borderRadius: 20, padding: "4px 14px",
                whiteSpace: "nowrap", letterSpacing: 0.5,
              }}>{p.badge}</div>
            )}

            {/* Name */}
            <div style={{ fontSize: 10, color: p.color, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 16 }}>{p.name}</div>

            {/* Price */}
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: G.text, letterSpacing: -1 }}>{p.price.split(",")[0]}</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: G.text }}>,{p.price.split(",")[1]}</span>
              <span style={{ fontSize: 14, color: G.dim, fontWeight: 500 }}>{p.period}</span>
            </div>
            <div style={{ fontSize: 11, color: p.color, fontWeight: 700, marginBottom: 24 }}>{p.priceNote}</div>

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, marginBottom: 28 }}>
              {p.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${p.color}22`, border: `1.5px solid ${p.color}60`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 9, color: p.color, fontWeight: 900 }}>✓</span>
                  </div>
                  <div style={{ fontSize: 12, color: G.text, lineHeight: 1.4 }}>{f}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => handleSubscribe(p.id)}
              disabled={!!loading}
              style={{
                background: p.id === "annual" ? p.color : "transparent",
                border: `1.5px solid ${p.color}`,
                color: p.id === "annual" ? "#06060f" : p.color,
                borderRadius: 12, padding: "13px 0",
                fontSize: 12, fontWeight: 800,
                cursor: loading ? "wait" : "pointer",
                width: "100%", transition: "all 0.15s",
                opacity: loading && loading !== p.id ? 0.5 : 1,
                boxShadow: p.id === "annual" ? `0 0 24px ${p.color}40` : "none",
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = p.color; e.currentTarget.style.color = "#06060f"; } }}
              onMouseLeave={e => { if (p.id !== "annual" && !loading) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = p.color; } }}
            >
              {loading === p.id ? "Redirection…" : p.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: G.red, background: `${G.red}15`, border: `1px solid ${G.red}40`, borderRadius: 8, padding: "10px 16px" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Footer note */}
      <div style={{ textAlign: "center", marginTop: 36, fontSize: 12, color: G.dim }}>
        {fr
          ? "💳 Paiement sécurisé via Stripe · Annulation à tout moment · TVA incluse"
          : "💳 Secure payment via Stripe · Cancel anytime · VAT included"}
      </div>
    </div>
  );
}

function LeChemin({ chapitres, setChapitres, lang = "fr" }) {
  const fr = lang === "fr";
  return (
    <div style={{ padding: 32, color: "#fff" }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>🪞 {fr ? "Le Chemin" : "The Path"}</div>
      <div style={{ color: "#555", fontSize: 13 }}>{fr ? "Module en cours de construction." : "Module coming soon."}</div>
    </div>
  );
}

function FirmLogo({ firm, size = 28, style = {} }) {
  const fd = typeof firm === "string" ? (PROP_FIRMS_CATALOG[firm] || PROP_FIRMS_CATALOG["Autre"]) : firm;
  const [err, setErr] = useState(false);
  if (!fd?.logo || err) {
    return <span style={{ fontSize: size * 0.85, lineHeight: 1, ...style }}>{fd?.emoji || "🏦"}</span>;
  }
  return (
    <img
      src={fd.logo}
      alt={fd.nom}
      onError={() => setErr(true)}
      style={{ width: size, height: size, objectFit: "contain", borderRadius: 6, ...style }}
    />
  );
}

function AjoutCompte({ onSave, onCancel, editCompte = null, onGoToRegles, lang = "fr" }) {
  const fr = lang === "fr";
  const inp = { width: "100%", background: "#0e0e1a", border: "1px solid #1a1a2e", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" };
  const lbl = (txt, sub) => (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1.2 }}>{txt}</div>
      {sub && <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{sub}</div>}
    </div>
  );

  const [step, setStep] = useState(editCompte ? 3 : 1);
  const [form, setForm] = useState(editCompte || {
    nom: "", numero: "", type: "Apex", typeCompte: "pa",
    taille: 50000, achat: 0, activation: 0,
    soldeInitial: 0, joursPayoutInitial: 0,
    mll: null, balanceActuelle: null,
    payouts: [], isNew: true,
  });
  const [newPayoutEntry, setNewPayoutEntry] = useState({ montant: "", devise: "USD", date: new Date().toISOString().slice(0, 10) });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const firmData = PROP_FIRMS_CATALOG[form.type] || PROP_FIRMS_CATALOG["Autre"];
  const C = firmData.couleur || "#818cf8";
  const tailles = firmData.tailles || [25000, 50000, 100000, 150000, 200000, 300000];

  const STEPS = editCompte ? ["Configuration", "Statut"] : ["Prop firm", "Type & Taille", "Numéro", "Statut"];
  const totalSteps = STEPS.length;
  const stepIdx = editCompte ? step - 3 : step - 1;

  const navBtn = (label, onClick, disabled, primary) => (
    <button onClick={onClick} disabled={disabled} style={{ flex: primary ? 2 : 1, background: primary ? (disabled ? "#1a1a2e" : C) : "#0e0e1a", border: primary ? "none" : "1px solid #1a1a2e", color: primary ? (disabled ? "#444" : "#06060f") : "#888", borderRadius: 10, padding: "12px 0", fontSize: 13, fontWeight: primary ? 800 : 600, cursor: disabled ? "default" : "pointer", transition: "all 0.2s" }}>
      {label}
    </button>
  );

  return (
    <div style={{ padding: "32px 36px", color: "#fff", position: "relative" }}>

      {/* Progress dots */}
      {!editCompte && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                onClick={() => i < stepIdx && setStep(i + 1)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: i < stepIdx ? "pointer" : "default" }}
                title={i < stepIdx ? `Retour à : ${s}` : undefined}>
                <div style={{ width: i === stepIdx ? 24 : 8, height: 8, borderRadius: 4, background: i < stepIdx ? C : i === stepIdx ? C : "#1e1e2e", transition: "all 0.3s", boxShadow: i === stepIdx ? `0 0 12px ${C}60` : "none", opacity: i < stepIdx ? 0.6 : 1 }} />
                <div style={{ fontSize: 9, color: i === stepIdx ? C : i < stepIdx ? `${C}80` : "#333", fontWeight: i === stepIdx ? 700 : 400, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap", textDecoration: i < stepIdx ? "underline" : "none", textDecorationStyle: "dotted", textUnderlineOffset: 2 }}>{s}</div>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: i < stepIdx ? `${C}60` : "#1e1e2e", marginBottom: 16, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      )}

      {/* ÉTAPE 1 — Bulles de prop firms */}
      {step === 1 && (
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8, marginBottom: 4 }}>Prop firm</div>
          <div style={{ fontSize: 12, color: "#333", marginBottom: 28 }}>Sélectionne ta plateforme</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {Object.entries(PROP_FIRMS_CATALOG).map(([key, fd]) => (
              <button key={key}
                onClick={() => { set("type", key); set("typeCompte", fd.typesCompte?.[0]?.id || "funded"); set("taille", fd.tailles?.[1] || fd.tailles?.[0] || 50000); setStep(2); }}
                style={{ display: "flex", alignItems: "center", gap: 10, background: "#0e0e1a", border: "1px solid #1a1a2e", borderLeft: `3px solid ${fd.couleur}`, borderRadius: 10, padding: "16px 16px", cursor: "pointer", transition: "all 0.15s", textAlign: "left" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#13131f"; e.currentTarget.style.borderColor = `#1a1a2e`; e.currentTarget.style.borderLeftColor = fd.couleur; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0e0e1a"; e.currentTarget.style.borderColor = "#1a1a2e"; e.currentTarget.style.borderLeftColor = fd.couleur; e.currentTarget.style.transform = "none"; }}>
                <div style={{ flexShrink: 0, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FirmLogo firm={fd} size={28} />
                </div>
                <div style={{ overflow: "hidden", minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: fd.couleur, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd.nom}</div>
                  <div style={{ fontSize: 10, color: "#3a3a4e", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ÉTAPE 2 — Type de compte + Taille */}
      {step === 2 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <FirmLogo firm={firmData} size={36} style={{ borderRadius: 8 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C, letterSpacing: -0.3 }}>{firmData.nom}</div>
              <div style={{ fontSize: 10, color: "#555" }}>{firmData.description}</div>
            </div>
          </div>

          {lbl("Type de compte")}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {firmData.typesCompte?.map(t => (
              <button key={t.id} onClick={() => set("typeCompte", t.id)} style={{ background: form.typeCompte === t.id ? `${t.couleurBadge}15` : "#0e0e1a", border: `1.5px solid ${form.typeCompte === t.id ? t.couleurBadge : "#1a1a2e"}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.15s" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: form.typeCompte === t.id ? t.couleurBadge : "#e5e7eb" }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{t.desc}</div>
                </div>
                {form.typeCompte === t.id && <span style={{ fontSize: 16, color: t.couleurBadge }}>✓</span>}
              </button>
            ))}
          </div>

          {lbl("Taille du compte")}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {tailles.map(t => (
              <button key={t} onClick={() => set("taille", t)} style={{ background: form.taille === t ? C : "#0e0e1a", color: form.taille === t ? "#06060f" : "#888", border: `1px solid ${form.taille === t ? C : "#1a1a2e"}`, borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: form.taille === t ? 800 : 400, cursor: "pointer", transition: "all 0.15s" }}>
                ${(t / 1000).toFixed(0)}K
              </button>
            ))}
            <input type="number" placeholder="Autre..." value={tailles.includes(form.taille) ? "" : (form.taille || "")} onChange={e => set("taille", parseFloat(e.target.value) || 0)} style={{ ...inp, width: 90, padding: "9px 12px" }} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {navBtn("← Retour", () => setStep(1), false, false)}
            {navBtn("Suivant →", () => setStep(3), false, true)}
          </div>
        </>
      )}

      {/* ÉTAPE 3 — Numéro de compte + nom + coûts */}
      {step === 3 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 18 }}>{firmData.emoji}</span>
            <div style={{ fontSize: 15, fontWeight: 800, color: C }}>
              {firmData.nom} · {firmData.typesCompte?.find(t => t.id === form.typeCompte)?.label} · ${(form.taille / 1000).toFixed(0)}K
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            {lbl("Numéro / ID du compte")}
            <input value={form.numero} onChange={e => set("numero", e.target.value)} placeholder="ex: APX-001" style={inp} autoFocus />
          </div>

          <div style={{ marginBottom: 14 }}>
            {lbl("Nom du compte", "Laisse vide pour auto-générer")}
            <input value={form.nom} onChange={e => set("nom", e.target.value)} placeholder={`${firmData.nom} ${firmData.typesCompte?.find(t => t.id === form.typeCompte)?.label || ""} $${(form.taille/1000).toFixed(0)}K`} style={inp} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            <div>
              {lbl("Coût d'achat ($)")}
              <input type="number" value={form.achat || ""} onChange={e => set("achat", parseFloat(e.target.value) || 0)} placeholder="0" style={inp} />
            </div>
            <div>
              {lbl("Frais d'activation ($)")}
              <input type="number" value={form.activation || ""} onChange={e => set("activation", parseFloat(e.target.value) || 0)} placeholder="0" style={inp} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {!editCompte && navBtn("← Retour", () => setStep(2), false, false)}
            {navBtn("Suivant →", () => {
              if (!form.nom) set("nom", `${firmData.nom} ${firmData.typesCompte?.find(t => t.id === form.typeCompte)?.label || ""} $${(form.taille/1000).toFixed(0)}K`);
              setStep(4);
            }, false, true)}
          </div>
        </>
      )}

      {/* ÉTAPE 4 — Nouveau ou existant */}
      {step === 4 && (
        <>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, letterSpacing: -0.3 }}>Statut du compte</div>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 20 }}>Ce compte est-il déjà ouvert ou tu viens de l'ouvrir ?</div>

          {/* Choix nouveau / existant */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {[
              { val: true, icon: "🆕", title: "Nouveau compte", desc: "Je viens de l'ouvrir, pas encore de trades" },
              { val: false, icon: "📂", title: "Compte existant", desc: "Il y a déjà des données à importer" },
            ].map(opt => (
              <button key={String(opt.val)} onClick={() => set("isNew", opt.val)} style={{ background: form.isNew === opt.val ? `${C}15` : "#0e0e1a", border: `1.5px solid ${form.isNew === opt.val ? C : "#1a1a2e"}`, borderRadius: 12, padding: "18px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{opt.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: form.isNew === opt.val ? C : "#e5e7eb", marginBottom: 4 }}>{opt.title}</div>
                <div style={{ fontSize: 11, color: "#555" }}>{opt.desc}</div>
              </button>
            ))}
          </div>

          {/* Compte existant — données à importer */}
          {!form.isNew && (() => {
            const typeData = firmData.typesCompte?.find(t => t.id === form.typeCompte);
            const pr = typeData?.payoutRegles;
            return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>

              {/* Règle de payout de la firme — affichage adaptatif */}
              {pr && (
                <div style={{ background: `${C}0d`, border: `1px solid ${C}25`, borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ fontSize: 9, color: C, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Règle de payout · {typeData.label}</div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{pr.label}</div>
                </div>
              )}

              {/* JOURS GAGNANTS — cases cliquables adaptées au nombre requis */}
              {pr?.type === "jours_gagnants" && (
                <div>
                  {lbl(`Jours ${pr.minParJour > 0 ? `gagnants (≥ $${pr.minParJour}/j)` : "gagnants"} déjà validés`, `sur ${pr.nombre} requis`)}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {Array.from({ length: pr.nombre }, (_, i) => i + 1).map(n => (
                      <button key={n} onClick={() => set("joursPayoutInitial", form.joursPayoutInitial === n ? n - 1 : n)}
                        style={{ width: 44, height: 44, borderRadius: 10, border: `2px solid ${form.joursPayoutInitial >= n ? C : "#1a1a2e"}`, background: form.joursPayoutInitial >= n ? `${C}20` : "#0e0e1a", color: form.joursPayoutInitial >= n ? C : "#444", fontSize: 14, fontWeight: 800, cursor: "pointer", transition: "all 0.15s" }}>
                        {n}
                      </button>
                    ))}
                    <button onClick={() => set("joursPayoutInitial", 0)} style={{ width: 44, height: 44, borderRadius: 10, border: "1px solid #1a1a2e", background: "none", color: "#333", fontSize: 11, cursor: "pointer" }}>✕</button>
                  </div>
                  <div style={{ fontSize: 11, color: form.joursPayoutInitial > 0 ? C : "#444", marginTop: 6 }}>
                    {form.joursPayoutInitial > 0 ? `${form.joursPayoutInitial} / ${pr.nombre} jours validés` : "Aucun jour validé"}
                  </div>
                </div>
              )}

              {/* JOURS DE TRADING — compteur numérique */}
              {pr?.type === "jours_trading" && (
                <div>
                  {lbl("Jours de trading déjà effectués", `sur ${pr.nombre} requis avant payout`)}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => set("joursPayoutInitial", Math.max(0, (form.joursPayoutInitial || 0) - 1))} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #1a1a2e", background: "#0e0e1a", color: "#888", fontSize: 18, cursor: "pointer" }}>−</button>
                    <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "monospace", color: C, minWidth: 40, textAlign: "center" }}>{form.joursPayoutInitial || 0}</div>
                    <button onClick={() => set("joursPayoutInitial", Math.min(pr.nombre, (form.joursPayoutInitial || 0) + 1))} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #1a1a2e", background: "#0e0e1a", color: "#888", fontSize: 18, cursor: "pointer" }}>+</button>
                    <div style={{ fontSize: 11, color: "#555" }}>/ {pr.nombre} jours</div>
                  </div>
                </div>
              )}

              {/* PROFIT TARGET — montant atteint */}
              {pr?.type === "profit_target" && (
                <div>
                  {lbl("Profit actuel ($)", pr.montant ? `Objectif : +$${pr.montant}` : "Profit réalisé jusqu'ici")}
                  <input type="number" value={form.soldeInitial || ""} onChange={e => set("soldeInitial", parseFloat(e.target.value) || 0)} placeholder={pr.montant ? `Objectif : ${pr.montant}` : "ex: 850"} style={inp} />
                  {pr.montant && (
                    <div style={{ marginTop: 6, height: 4, borderRadius: 2, background: "#1a1a2e", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(100, ((form.soldeInitial || 0) / pr.montant) * 100)}%`, background: C, borderRadius: 2, transition: "width 0.3s" }} />
                    </div>
                  )}
                </div>
              )}

              {/* LIBRE — aucune règle spécifique */}
              {(!pr || pr?.type === "libre") && (
                <div style={{ fontSize: 11, color: "#555", fontStyle: "italic", padding: "8px 0" }}>
                  Aucun prérequis de jours ou de profit avant le premier payout.
                </div>
              )}

              {/* Balance actuelle + MLL */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  {lbl("Balance actuelle ($)", "Solde du compte en ce moment")}
                  <input type="number" value={form.balanceActuelle ?? ""} onChange={e => set("balanceActuelle", parseFloat(e.target.value) || null)} placeholder={`${form.taille}`} style={inp} />
                </div>
                <div>
                  {lbl("MLL actuel ($)", "Maximum Loss Limit restant")}
                  <input type="number" value={form.mll ?? ""} onChange={e => set("mll", parseFloat(e.target.value) || null)} placeholder="ex: 48500" style={inp} />
                </div>
              </div>

              {/* Payouts déjà reçus */}
              <div>
                {lbl("Payouts déjà reçus", "Ajoute chaque payout reçu avant l'app")}
                {form.payouts.length > 0 && (
                  <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                    {form.payouts.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0e0e1a", border: "1px solid #1a1a2e", borderRadius: 8, padding: "8px 12px" }}>
                        <span style={{ fontSize: 12, fontFamily: "monospace", color: C }}>+{p.montant} {p.devise}</span>
                        <span style={{ fontSize: 11, color: "#555" }}>{p.date}</span>
                        <button onClick={() => set("payouts", form.payouts.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 14, padding: "0 4px" }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="number" placeholder="Montant" value={newPayoutEntry.montant} onChange={e => setNewPayoutEntry(p => ({ ...p, montant: e.target.value }))} style={{ ...inp, flex: 1 }} />
                  <select value={newPayoutEntry.devise} onChange={e => setNewPayoutEntry(p => ({ ...p, devise: e.target.value }))} style={{ ...inp, width: 84 }}>
                    {["USD","EUR","GBP","CAD","CHF","AUD"].map(d => <option key={d}>{d}</option>)}
                  </select>
                  <input type="date" value={newPayoutEntry.date} onChange={e => setNewPayoutEntry(p => ({ ...p, date: e.target.value }))} style={{ ...inp, width: 140 }} />
                  <button onClick={() => { if (!newPayoutEntry.montant) return; set("payouts", [...form.payouts, { montant: parseFloat(newPayoutEntry.montant), devise: newPayoutEntry.devise, date: newPayoutEntry.date }]); setNewPayoutEntry(p => ({ ...p, montant: "" })); }} style={{ background: `${C}20`, border: `1px solid ${C}50`, color: C, borderRadius: 8, padding: "0 14px", fontSize: 18, fontWeight: 700, cursor: "pointer" }}>+</button>
                </div>
              </div>
            </div>
            );
          })()}

          <div style={{ display: "flex", gap: 10 }}>
            {navBtn("← Retour", () => setStep(3), false, false)}
            {navBtn("✓ Enregistrer le compte", () => onSave({ ...form, nom: form.nom || `${firmData.nom} ${firmData.typesCompte?.find(t => t.id === form.typeCompte)?.label || ""} $${(form.taille/1000).toFixed(0)}K` }), false, true)}
          </div>
        </>
      )}

    </div>
  );
}

function LandingPage({ onEnter, onCheckout, lang }) {
  const fr = lang === "fr";
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);

  const sections = ["hero", "problem", "solution", "modules", "pricing", "cta"];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollTop / window.innerHeight);
      setActiveSection(Math.min(idx, sections.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (idx) => {
    containerRef.current?.scrollTo({ top: idx * window.innerHeight, behavior: "smooth" });
  };

  const features = fr ? [
    { icon: "📓", title: "Journal de trades", desc: "Setup, émotion, discipline, leçon — tout en un. Identifie tes patterns gagnants sur le long terme.", color: "#00e5a0" },
    { icon: "📊", title: "Dashboard analytique", desc: "Win rate, R/R, PnL par compte, courbe d'équité. Tes stats en temps réel.", color: "#818cf8" },
    { icon: "🏛️", title: "Fiscalité prop firm", desc: "Micro-BNC, SASU, auto-entrepreneur. Calcul d'impôt + actualités fiscales dédiées traders.", color: "#f59e0b" },
    { icon: "🧠", title: "Session du jour", desc: "Checklist pré-session, plan du jour, état émotionnel. La routine du trader pro.", color: "#ec4899" },
    { icon: "🎯", title: "Objectifs & quêtes", desc: "Des objectifs chiffrés et des quêtes qui te guident du premier funded au retrait régulier.", color: "#00e5a0" },
    { icon: "📋", title: "Règles prop firms", desc: "Règles détaillées d'Apex, Topstep, FTMO et +15 prop firms. Ne viole plus rien par erreur.", color: "#818cf8" },
  ] : [
    { icon: "📓", title: "Trade Journal", desc: "Setup, emotion, discipline, lesson — all in one. Identify your winning patterns over time.", color: "#00e5a0" },
    { icon: "📊", title: "Analytics Dashboard", desc: "Win rate, R/R, PnL per account, equity curve. Your stats in real time.", color: "#818cf8" },
    { icon: "🏛️", title: "Prop Firm Taxation", desc: "Micro-BNC, SASU, self-employed. Tax estimate + dedicated fiscal news for traders.", color: "#f59e0b" },
    { icon: "🧠", title: "Daily Session", desc: "Pre-session checklist, day plan, emotional state. The professional trader routine.", color: "#ec4899" },
    { icon: "🎯", title: "Goals & Quests", desc: "Measurable goals and quests that guide you from first funded to consistent withdrawals.", color: "#00e5a0" },
    { icon: "📋", title: "Prop Firm Rules", desc: "Detailed rules for Apex, Topstep, FTMO and 15+ prop firms. Never break a rule by accident.", color: "#818cf8" },
  ];

  const problems = fr ? [
    { num: "01", title: "Aucune trace de vos trades", desc: "Vous tradez depuis des mois mais impossible de savoir quel setup fonctionne vraiment. Sans journal structuré, vous répétez les mêmes erreurs." },
    { num: "02", title: "Vos comptes funded mal gérés", desc: "Vous jongglez entre plusieurs prop firms, payouts, frais d'activation. Impossible de savoir quel compte est réellement rentable." },
    { num: "03", title: "La fiscalité, une zone grise", desc: "Comment déclarer vos payouts ? BNC, micro-entreprise, SASU ? La plupart des traders funded ne savent pas comment gérer l'aspect fiscal." },
  ] : [
    { num: "01", title: "No record of your trades", desc: "You've been trading for months but can't tell which setup actually works. Without a structured journal, you repeat the same mistakes." },
    { num: "02", title: "Poorly managed funded accounts", desc: "You're juggling multiple prop firms, payouts, activation fees. Impossible to know which account is actually profitable." },
    { num: "03", title: "Taxes — a grey zone", desc: "How do you declare your payouts? BNC, micro-business, SASU? Most funded traders don't know how to handle the tax side." },
  ];

  return (
    <div ref={containerRef} style={{ height:"100vh", overflowY:"scroll", scrollSnapType:"y proximity", background:"#06060f", fontFamily:"'Inter','Segoe UI',sans-serif", color:"#fff", scrollBehavior:"smooth" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #06060f; }
        ::-webkit-scrollbar-thumb { background: #00e5a040; border-radius: 4px; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes glow-pulse { 0%,100% { opacity:.4; } 50% { opacity:.8; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
        @keyframes spin-slow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 900'%3E%3Cline x1='0' y1='150' x2='1440' y2='150' stroke='%23ffffff' stroke-opacity='0.05' stroke-width='1'/%3E%3Cline x1='0' y1='300' x2='1440' y2='300' stroke='%23ffffff' stroke-opacity='0.05' stroke-width='1'/%3E%3Cline x1='0' y1='450' x2='1440' y2='450' stroke='%23ffffff' stroke-opacity='0.05' stroke-width='1'/%3E%3Cline x1='0' y1='600' x2='1440' y2='600' stroke='%23ffffff' stroke-opacity='0.05' stroke-width='1'/%3E%3Cline x1='0' y1='750' x2='1440' y2='750' stroke='%23ffffff' stroke-opacity='0.05' stroke-width='1'/%3E%3Cline x1='180' y1='0' x2='180' y2='900' stroke='%23ffffff' stroke-opacity='0.04' stroke-width='1'/%3E%3Cline x1='360' y1='0' x2='360' y2='900' stroke='%23ffffff' stroke-opacity='0.04' stroke-width='1'/%3E%3Cline x1='540' y1='0' x2='540' y2='900' stroke='%23ffffff' stroke-opacity='0.04' stroke-width='1'/%3E%3Cline x1='720' y1='0' x2='720' y2='900' stroke='%23ffffff' stroke-opacity='0.04' stroke-width='1'/%3E%3Cline x1='900' y1='0' x2='900' y2='900' stroke='%23ffffff' stroke-opacity='0.04' stroke-width='1'/%3E%3Cline x1='1080' y1='0' x2='1080' y2='900' stroke='%23ffffff' stroke-opacity='0.04' stroke-width='1'/%3E%3Cline x1='1260' y1='0' x2='1260' y2='900' stroke='%23ffffff' stroke-opacity='0.04' stroke-width='1'/%3E%3Cpath d='M20,750 C100,720 200,670 320,620 C440,570 500,610 620,555 C740,500 800,530 920,465 C1040,400 1080,428 1130,380' stroke='%2300e5a0' stroke-width='2.5' stroke-linecap='round' fill='none' opacity='0.45'/%3E%3Crect x='990' y='762' width='18' height='53' rx='3' fill='%2300e5a0' opacity='0.38'/%3E%3Crect x='1014' y='742' width='18' height='73' rx='3' fill='%2300e5a0' opacity='0.38'/%3E%3Crect x='1038' y='795' width='18' height='20' rx='3' fill='%23ef4444' opacity='0.38'/%3E%3Crect x='1062' y='730' width='18' height='85' rx='3' fill='%2300e5a0' opacity='0.38'/%3E%3Crect x='1086' y='770' width='18' height='45' rx='3' fill='%23818cf8' opacity='0.38'/%3E%3Crect x='1110' y='752' width='18' height='63' rx='3' fill='%23818cf8' opacity='0.38'/%3E%3Crect x='1134' y='798' width='18' height='17' rx='3' fill='%23ef4444' opacity='0.38'/%3E%3Crect x='1158' y='728' width='18' height='87' rx='3' fill='%2300e5a0' opacity='0.38'/%3E%3Crect x='1210' y='145' width='196' height='82' rx='10' fill='%230a0a14' fill-opacity='0.85' stroke='%2300e5a0' stroke-opacity='0.35' stroke-width='1'/%3E%3Crect x='1210' y='242' width='196' height='82' rx='10' fill='%230a0a14' fill-opacity='0.85' stroke='%2300e5a0' stroke-opacity='0.35' stroke-width='1'/%3E%3Crect x='1210' y='339' width='196' height='82' rx='10' fill='%230a0a14' fill-opacity='0.85' stroke='%23818cf8' stroke-opacity='0.35' stroke-width='1'/%3E%3Ctext x='1226' y='170' fill='%2300e5a0' fill-opacity='0.55' font-size='9' font-weight='700'%3EWIN RATE%3C/text%3E%3Ctext x='1226' y='200' fill='%2300e5a0' fill-opacity='0.65' font-size='26' font-weight='900'%3E69%25%3C/text%3E%3Ctext x='1226' y='218' fill='%234b5e7a' font-size='9'%3E347W / 153L%3C/text%3E%3Ctext x='1226' y='268' fill='%2300e5a0' fill-opacity='0.55' font-size='9' font-weight='700'%3EP%26amp%3BL NET%3C/text%3E%3Ctext x='1226' y='298' fill='%2300e5a0' fill-opacity='0.65' font-size='20' font-weight='900'%3E%2B12 840%24%3C/text%3E%3Ctext x='1226' y='316' fill='%234b5e7a' font-size='9'%3E500 trades%3C/text%3E%3Ctext x='1226' y='365' fill='%23818cf8' fill-opacity='0.55' font-size='9' font-weight='700'%3ER%2FR MOYEN%3C/text%3E%3Ctext x='1226' y='395' fill='%23818cf8' fill-opacity='0.65' font-size='26' font-weight='900'%3E1.26%3C/text%3E%3Ctext x='1226' y='413' fill='%234b5e7a' font-size='9'%3Erespect plan 81%25%3C/text%3E%3Crect x='30' y='775' width='28' height='11' rx='2' fill='%2300e5a0' opacity='0.42'/%3E%3Crect x='62' y='775' width='28' height='11' rx='2' fill='%2300e5a0' opacity='0.42'/%3E%3Crect x='94' y='775' width='28' height='11' rx='2' fill='%231e2d45' opacity='0.7'/%3E%3Crect x='126' y='775' width='28' height='11' rx='2' fill='%23818cf8' opacity='0.42'/%3E%3Crect x='158' y='775' width='28' height='11' rx='2' fill='%2300e5a0' opacity='0.42'/%3E%3Crect x='190' y='775' width='28' height='11' rx='2' fill='%231e2d45' opacity='0.7'/%3E%3Crect x='222' y='775' width='28' height='11' rx='2' fill='%2300e5a0' opacity='0.42'/%3E%3Crect x='30' y='790' width='28' height='11' rx='2' fill='%231e2d45' opacity='0.7'/%3E%3Crect x='62' y='790' width='28' height='11' rx='2' fill='%2300e5a0' opacity='0.42'/%3E%3Crect x='94' y='790' width='28' height='11' rx='2' fill='%2300e5a0' opacity='0.42'/%3E%3Crect x='126' y='790' width='28' height='11' rx='2' fill='%231e2d45' opacity='0.7'/%3E%3Crect x='158' y='790' width='28' height='11' rx='2' fill='%23818cf8' opacity='0.42'/%3E%3Crect x='190' y='790' width='28' height='11' rx='2' fill='%231e2d45' opacity='0.7'/%3E%3Crect x='222' y='790' width='28' height='11' rx='2' fill='%231e2d45' opacity='0.7'/%3E%3Crect x='30' y='805' width='28' height='11' rx='2' fill='%2300e5a0' opacity='0.42'/%3E%3Crect x='62' y='805' width='28' height='11' rx='2' fill='%231e2d45' opacity='0.7'/%3E%3Crect x='94' y='805' width='28' height='11' rx='2' fill='%23818cf8' opacity='0.42'/%3E%3Crect x='126' y='805' width='28' height='11' rx='2' fill='%2300e5a0' opacity='0.42'/%3E%3Crect x='158' y='805' width='28' height='11' rx='2' fill='%2300e5a0' opacity='0.42'/%3E%3Crect x='190' y='805' width='28' height='11' rx='2' fill='%231e2d45' opacity='0.7'/%3E%3Crect x='222' y='805' width='28' height='11' rx='2' fill='%2300e5a0' opacity='0.42'/%3E%3Ccircle cx='680' cy='852' r='36' fill='none' stroke='%231e2d45' stroke-width='13'/%3E%3Ccircle cx='680' cy='852' r='36' fill='none' stroke='%2300e5a0' stroke-width='13' stroke-dasharray='142 84' stroke-dashoffset='22' stroke-linecap='round' opacity='0.45'/%3E%3Ccircle cx='680' cy='852' r='36' fill='none' stroke='%23818cf8' stroke-width='13' stroke-dasharray='56 170' stroke-dashoffset='-122' stroke-linecap='round' opacity='0.45'/%3E%3Ccircle cx='680' cy='852' r='36' fill='none' stroke='%23f59e0b' stroke-width='13' stroke-dasharray='25 201' stroke-dashoffset='-178' stroke-linecap='round' opacity='0.45'/%3E%3Cpath d='M400,875 C480,860 550,838 660,815 C770,792 830,810 940,788 C1050,766 1100,779 1160,758' stroke='%2300d4ff' stroke-width='2' stroke-linecap='round' fill='none' opacity='0.32'/%3E%3C/svg%3E");
          background-size: cover;
          background-position: center;
          pointer-events: none;
          z-index: 0;
        }

        .land-section { scroll-snap-align:start; height:100vh; position:relative; display:flex; flex-direction:column; overflow:hidden; }
        .land-nav-dot { width:6px; height:6px; border-radius:50%; background:#333; cursor:pointer; transition:all .3s; }
        .land-nav-dot.active { background:#00e5a0; width:6px; height:20px; border-radius:3px; }
        .land-cta { background:#00e5a0; color:#06060f; border:none; border-radius:10px; padding:15px 36px; font-size:15px; font-weight:800; cursor:pointer; letter-spacing:.2px; transition:all .2s; display:inline-flex; align-items:center; gap:10px; }
        .land-cta:hover { background:#00ffb3; transform:translateY(-2px); box-shadow:0 12px 40px #00e5a040; }
        .land-cta-outline { background:transparent; color:#fff; border:1.5px solid #ffffff30; border-radius:10px; padding:14px 28px; font-size:14px; font-weight:700; cursor:pointer; transition:all .2s; }
        .land-cta-outline:hover { border-color:#ffffff80; background:#ffffff08; }
        .land-feat-card { background:linear-gradient(135deg,#0e0e1a,#0a0a14); border:1px solid #1a1a2e; border-radius:20px; padding:28px 24px; transition:all .3s; position:relative; overflow:hidden; }
        .land-feat-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--accent)08,transparent); opacity:0; transition:opacity .3s; }
        .land-feat-card:hover { border-color:var(--accent)50; transform:translateY(-4px); box-shadow:0 20px 60px var(--accent)15; }
        .land-feat-card:hover::before { opacity:1; }
        .land-prob-card { background:#0c0c18; border:1px solid #1a1a2e; border-left:3px solid #00e5a0; border-radius:16px; padding:32px 28px; }
        .grad-text { background:linear-gradient(135deg,#00e5a0,#818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .noise-bg::after { content:''; position:absolute; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events:none; z-index:0; }
      `}</style>

      {/* NAVBAR fixed */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, padding:"0 48px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(6,6,15,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid #ffffff08" }}>
        <div style={{ display:"flex", alignItems:"center", gap:2, cursor:"pointer" }} onClick={() => scrollTo(0)}>
          <span style={{ fontSize:20, fontWeight:900, letterSpacing:-1 }}>spirit</span>
          <span style={{ fontSize:20, fontWeight:900, letterSpacing:-1, color:"#00e5a0" }}>.</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:36 }}>
          {(fr ? ["Problème","Solution","Modules"] : ["Problem","Solution","Modules"]).map((label, i) => (
            <span key={label} onClick={() => scrollTo(i+1)} style={{ fontSize:13, fontWeight:600, color:"#666", cursor:"pointer", transition:"color .2s", letterSpacing:.3 }}
              onMouseEnter={e => e.target.style.color="#fff"} onMouseLeave={e => e.target.style.color="#666"}>{label}</span>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={onEnter} style={{ padding:"9px 20px", fontSize:13, fontWeight:700, background:"transparent", border:"1px solid rgba(255,255,255,0.15)", color:"#e5e7eb", borderRadius:8, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.35)"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; e.currentTarget.style.color="#e5e7eb"; }}>
            {fr ? "Se connecter" : "Log in"}
          </button>
          <button className="land-cta" onClick={onEnter} style={{ padding:"9px 20px", fontSize:13, borderRadius:8 }}>
            {fr ? "S'inscrire" : "Sign up"}
          </button>
        </div>
      </nav>

      {/* DOT NAV */}
      <div style={{ position:"fixed", right:24, top:"50%", transform:"translateY(-50%)", zIndex:200, display:"flex", flexDirection:"column", gap:10, alignItems:"center" }}>
        {sections.map((_, i) => (
          <div key={i} className={`land-nav-dot${activeSection === i ? " active" : ""}`} onClick={() => scrollTo(i)} />
        ))}
      </div>

      {/* ── SECTION 1 : HERO ── */}
      <section className="land-section noise-bg hero-section" style={{ justifyContent:"center", alignItems:"center", textAlign:"center", padding:"64px 24px 0", background:"radial-gradient(ellipse 80% 60% at 50% 20%,#00e5a010 0%,transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%,#818cf808 0%,transparent 60%), #06060f" }}>
        {/* Orb */}
        <div style={{ position:"absolute", top:"15%", left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(circle,#00e5a012 0%,transparent 70%)", borderRadius:"50%", animation:"glow-pulse 4s ease-in-out infinite", pointerEvents:"none" }} />

        {/* ── Background charts via CSS ::before (see .hero-section::before in <style>) ── */}
        {false && <svg
          style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }}
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 900"
        >
          <defs>
            <linearGradient id="gPnl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00e5a0" stopOpacity="0.28"/>
              <stop offset="100%" stopColor="#00e5a0" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="gPnl2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.22"/>
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({length:9}).map((_,i) => <line key={`h${i}`} x1="0" y1={(i+1)*90} x2="1440" y2={(i+1)*90} stroke="rgba(255,255,255,0.035)" strokeWidth="1"/>)}
          {Array.from({length:13}).map((_,i) => <line key={`v${i}`} x1={(i+1)*110} y1="0" x2={(i+1)*110} y2="900" stroke="rgba(255,255,255,0.035)" strokeWidth="1"/>)}

          {/* ── P&L curve LEFT ── */}
          <g opacity="0.5">
            <text x="32" y="185" fill="#00e5a0" fontSize="9" fontWeight="700" letterSpacing="1.5" textTransform="uppercase" opacity="0.6">COURBE P&amp;L CUMULÉ</text>
            <path d="M30,360 C80,350 120,320 180,295 C240,270 265,295 330,265 C395,235 430,250 490,215 C555,180 590,200 650,165 C715,130 750,148 810,115 C875,82 905,98 960,70 C1010,45 1030,58 1060,42" fill="url(#gPnl)"/>
            <path d="M30,360 C80,350 120,320 180,295 C240,270 265,295 330,265 C395,235 430,250 490,215 C555,180 590,200 650,165 C715,130 750,148 810,115 C875,82 905,98 960,70 C1010,45 1030,58 1060,42" fill="none" stroke="#00e5a0" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
          </g>

          {/* ── Stat cards RIGHT ── */}
          <g opacity="0.38">
            {/* Card 1 — Win Rate */}
            <rect x="1210" y="130" width="200" height="90" rx="12" fill="rgba(10,10,20,0.85)" stroke="#00e5a040" strokeWidth="1"/>
            <text x="1226" y="155" fill="#4b5e7a" fontSize="9" letterSpacing="1.5">WIN RATE</text>
            <text x="1226" y="185" fill="#00e5a0" fontSize="26" fontWeight="900" letterSpacing="-1">69%</text>
            <text x="1226" y="207" fill="#4b5e7a" fontSize="9">347W / 153L</text>
            {/* Card 2 — P&L */}
            <rect x="1210" y="235" width="200" height="90" rx="12" fill="rgba(10,10,20,0.85)" stroke="#00e5a040" strokeWidth="1"/>
            <text x="1226" y="260" fill="#4b5e7a" fontSize="9" letterSpacing="1.5">P&amp;L NET</text>
            <text x="1226" y="290" fill="#00e5a0" fontSize="22" fontWeight="900" letterSpacing="-1">+12 840$</text>
            <text x="1226" y="312" fill="#4b5e7a" fontSize="9">500 trades</text>
            {/* Card 3 — R/R */}
            <rect x="1210" y="340" width="200" height="90" rx="12" fill="rgba(10,10,20,0.85)" stroke="#818cf840" strokeWidth="1"/>
            <text x="1226" y="365" fill="#4b5e7a" fontSize="9" letterSpacing="1.5">R/R MOYEN</text>
            <text x="1226" y="395" fill="#818cf8" fontSize="26" fontWeight="900" letterSpacing="-1">1.26</text>
            <text x="1226" y="417" fill="#4b5e7a" fontSize="9">respect plan 81%</text>
          </g>

          {/* ── Bar chart bottom right ── */}
          <g opacity="0.38">
            <text x="950" y="760" fill="#818cf8" fontSize="9" fontWeight="700" letterSpacing="1.5" opacity="0.7">P&amp;L PAR SETUP</text>
            {[55,82,38,91,63,74,48,95,70,44,88,60].map((v,i) => {
              const h = (v/100)*90;
              const c = v>70?"#00e5a0":v>50?"#818cf8":"#ef4444";
              return <rect key={i} x={950+i*24} y={870-h} width={20} height={h} rx={3} fill={c} opacity={0.65}/>;
            })}
          </g>

          {/* ── Calendar heatmap bottom left ── */}
          <g opacity="0.38">
            <text x="32" y="755" fill="#818cf8" fontSize="9" fontWeight="700" letterSpacing="1.5" opacity="0.7">CALENDRIER TRADING</text>
            {[1,1,0,1,1,0,1, 0,1,1,0,1,0,0, 1,0,1,1,1,0,1, 0,1,0,0,1,1,0, 1,1,0,1,0,1,1].map((v,i) => {
              const col=i%7, row=Math.floor(i/7);
              const colors=["#0d1520","#1a2540","#818cf8","#00e5a0"];
              const ci = v===0 ? (i%3===0?1:0) : (i%5===0?3:2);
              return <rect key={i} x={32+col*38} y={770+row*16} width={34} height={13} rx={3} fill={colors[ci]} opacity={0.75}/>;
            })}
          </g>

          {/* ── Donut fiscal bottom center ── */}
          <g opacity="0.35">
            <text x="620" y="800" fill="#f59e0b" fontSize="9" fontWeight="700" letterSpacing="1.5" opacity="0.7">STRUCTURE FISCALE</text>
            <circle cx="680" cy="855" r="34" fill="none" stroke="#1e2d45" strokeWidth="12"/>
            <circle cx="680" cy="855" r="34" fill="none" stroke="#00e5a0" strokeWidth="12" strokeDasharray="134 80" strokeDashoffset="24" strokeLinecap="round"/>
            <circle cx="680" cy="855" r="34" fill="none" stroke="#818cf8" strokeWidth="12" strokeDasharray="54 160" strokeDashoffset="-110" strokeLinecap="round"/>
            <circle cx="680" cy="855" r="34" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="26 188" strokeDashoffset="-164" strokeLinecap="round"/>
            <text x="680" y="860" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="800" opacity="0.7">69%</text>
          </g>

          {/* ── Second P&L curve bottom ── */}
          <g opacity="0.32">
            <text x="400" y="810" fill="#00d4ff" fontSize="9" fontWeight="700" letterSpacing="1.5" opacity="0.6">COMPTE APEX #2</text>
            <path d="M400,880 C450,875 480,855 530,840 C580,825 610,838 660,820 C710,802 740,815 790,795 C840,775 865,785 900,768" fill="url(#gPnl2)"/>
            <path d="M400,880 C450,875 480,855 530,840 C580,825 610,838 660,820 C710,802 740,815 790,795 C840,775 865,785 900,768" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
          </g>
        </svg>}

        <div style={{ position:"relative", zIndex:1, animation:"fadeUp .9s ease forwards" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#00e5a010", border:"1px solid #00e5a025", borderRadius:20, padding:"6px 18px", fontSize:11, fontWeight:700, color:"#00e5a0", letterSpacing:2, textTransform:"uppercase", marginBottom:32 }}>
            <span style={{ width:6, height:6, background:"#00e5a0", borderRadius:"50%", display:"inline-block", animation:"glow-pulse 2s ease-in-out infinite" }} />
            Journal de trading intelligent
          </div>

          <h1 style={{ fontSize:"clamp(40px,7vw,80px)", fontWeight:900, lineHeight:1.05, margin:"0 0 24px", letterSpacing:-3, maxWidth:900 }}>
            <span className="grad-text">Le journal</span><br />du trader prop firm.
          </h1>

          <p style={{ fontSize:"clamp(15px,2vw,18px)", color:"#555", lineHeight:1.8, maxWidth:560, margin:"0 auto 48px", fontWeight:400 }}>
            Conçu pour les traders prop firm. Passe le funded, garde-le.<br /><span style={{ color:"#00e5a0", fontWeight:600 }}>Comprends tes patterns perdants — et arrête.</span>
          </p>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, flexWrap:"wrap" }}>
            <button className="land-cta" onClick={onEnter}>
              Accéder à mon espace <span style={{ fontSize:18 }}>→</span>
            </button>
            <button className="land-cta-outline" onClick={() => scrollTo(4)}>
              💳 {fr ? "Voir les tarifs" : "See pricing"}
            </button>
            <button className="land-cta-outline" onClick={() => scrollTo(1)}>
              {fr ? "Découvrir" : "Learn more"}
            </button>
          </div>

          <div style={{ marginTop:64, display:"flex", justifyContent:"center", gap:48, flexWrap:"wrap" }}>
            {[["500+", "trades analysés"], ["15+", "prop firms"], ["IA", "coach intégré"], ["☁️", "Cloud sync"]].map(([v,l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:900, color:"#fff", letterSpacing:-1 }}>{v}</div>
                <div style={{ fontSize:11, color:"#444", fontWeight:600, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, opacity:.3, cursor:"pointer" }} onClick={() => scrollTo(1)}>
          <span style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase", fontWeight:600 }}>scroll</span>
          <div style={{ width:1, height:40, background:"linear-gradient(to bottom,#fff,transparent)" }} />
        </div>
      </section>

      {/* ── SECTION 2 : PROBLÈME ── */}
      <section className="land-section" style={{ justifyContent:"center", padding:"64px 48px 0", background:"#06060f" }}>
        <div style={{ maxWidth:1100, width:"100%", margin:"0 auto", animation:"fadeUp .7s ease forwards" }}>
          <div style={{ marginBottom:56 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#00e5a0", letterSpacing:3, textTransform:"uppercase", marginBottom:16 }}>
              {fr ? "Le problème" : "The problem"}
            </div>
            <h2 style={{ fontSize:"clamp(28px,5vw,56px)", fontWeight:900, letterSpacing:-2, margin:0, lineHeight:1.1 }}>
              {fr ? <>Pourquoi la plupart des<br /><span className="grad-text">traders funded échouent.</span></> : <>Why most funded<br /><span className="grad-text">traders fail.</span></>}
            </h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {problems.map(p => (
              <div key={p.num} className="land-prob-card">
                <div style={{ fontSize:40, fontWeight:900, color:"#0e0e1a", fontFamily:"monospace", marginBottom:16, letterSpacing:-2 }}>{p.num}</div>
                <div style={{ fontSize:16, fontWeight:800, color:"#fff", marginBottom:12, lineHeight:1.3 }}>{p.title}</div>
                <div style={{ fontSize:13, color:"#555", lineHeight:1.75 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 : SOLUTION ── */}
      <section className="land-section" style={{ justifyContent:"center", alignItems:"center", padding:"64px 48px 0", background:"radial-gradient(ellipse 70% 50% at 50% 50%,#00e5a008 0%,transparent 70%), #06060f" }}>
        <div style={{ maxWidth:900, width:"100%", margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#00e5a0", letterSpacing:3, textTransform:"uppercase", marginBottom:20 }}>
            {fr ? "La solution" : "The solution"}
          </div>
          <h2 style={{ fontSize:"clamp(28px,5vw,60px)", fontWeight:900, letterSpacing:-2, margin:"0 0 24px", lineHeight:1.1 }}>
            {fr ? <>Un écosystème complet<br /><span className="grad-text">pensé pour les traders funded.</span></> : <>A complete ecosystem<br /><span className="grad-text">built for funded traders.</span></>}
          </h2>
          <p style={{ fontSize:16, color:"#555", lineHeight:1.8, maxWidth:640, margin:"0 auto 56px" }}>
            {fr ? "Spirit Trading centralise tout : journal de trades structuré, suivi de vos comptes prop firms, gestion fiscale et routine quotidienne. Un seul outil, zéro dispersion." : "Spirit Trading centralizes everything: structured trade journal, prop firm account tracking, tax management and daily routine. One tool, zero dispersion."}
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, textAlign:"left" }}>
            {(fr ? [
              ["✓", "Journal structuré par trade"], ["✓", "Suivi multi-comptes prop firms"], ["✓", "Calcul fiscal automatique"],
              ["✓", "Session & checklist quotidienne"], ["✓", "Objectifs & progression"], ["✓", "Règles prop firms intégrées"],
            ] : [
              ["✓", "Structured trade journal"], ["✓", "Multi-account prop firm tracking"], ["✓", "Automatic tax calculation"],
              ["✓", "Daily session & checklist"], ["✓", "Goals & progression"], ["✓", "Built-in prop firm rules"],
            ]).map(([icon, text]) => (
              <div key={text} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", background:"#0c0c18", borderRadius:12, border:"1px solid #1a1a2e" }}>
                <span style={{ color:"#00e5a0", fontWeight:900, fontSize:14 }}>{icon}</span>
                <span style={{ fontSize:13, fontWeight:600, color:"#ccc" }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop:48 }}>
            <button className="land-cta" onClick={onEnter}>
              {fr ? "Accéder à l'app →" : "Open app →"}
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 : MODULES ── */}
      <section className="land-section" style={{ padding:"64px 48px 0", background:"#06060f", overflowY:"auto", scrollSnapAlign:"start" }}>
        <div style={{ maxWidth:1200, width:"100%", margin:"0 auto" }}>
          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#00e5a0", letterSpacing:3, textTransform:"uppercase", marginBottom:16 }}>
              {fr ? "Les modules" : "The modules"}
            </div>
            <h2 style={{ fontSize:"clamp(24px,4vw,48px)", fontWeight:900, letterSpacing:-2, margin:0, lineHeight:1.1 }}>
              {fr ? <>6 modules.<br /><span className="grad-text">Tout ce qu'il te faut.</span></> : <>6 modules.<br /><span className="grad-text">Everything you need.</span></>}
            </h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {features.map(f => (
              <div key={f.title} className="land-feat-card" style={{ "--accent": f.color }}>
                <div style={{ fontSize:32, marginBottom:16 }}>{f.icon}</div>
                <div style={{ fontSize:15, fontWeight:800, color:"#fff", marginBottom:10 }}>{f.title}</div>
                <div style={{ fontSize:12.5, color:"#555", lineHeight:1.7 }}>{f.desc}</div>
                <div style={{ marginTop:20, width:32, height:2, background:f.color, borderRadius:2 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5 : TARIFS ── */}
      <section className="land-section" style={{ justifyContent:"center", alignItems:"center", padding:"64px 24px", background:"#06060f" }}>
        <div style={{ position:"relative", zIndex:1, maxWidth:760, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#818cf8", letterSpacing:3, textTransform:"uppercase", marginBottom:16 }}>
            {fr ? "Tarifs simples" : "Simple pricing"}
          </div>
          <h2 style={{ fontSize:"clamp(28px,5vw,52px)", fontWeight:900, letterSpacing:-2, margin:"0 0 12px", lineHeight:1.1 }}>
            {fr ? <>Investis dans <span className="grad-text">ta discipline</span></> : <>Invest in <span className="grad-text">your discipline</span></>}
          </h2>
          <p style={{ fontSize:14, color:"#444", marginBottom:48, lineHeight:1.7 }}>
            {fr ? "Sans engagement. Annule quand tu veux." : "No commitment. Cancel anytime."}
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, maxWidth:600, margin:"0 auto 40px" }}>
            {[
              { badge: null,            price: fr ? "7,99€"  : "€7.99",  period: fr ? "/mois"    : "/month", note: fr ? "Sans engagement"           : "No commitment",              color: "#00e5a0", label: fr ? "Mensuel"  : "Monthly", plan: "monthly" },
              { badge: fr ? "🔥 2 mois offerts" : "🔥 2 months free", price: fr ? "79,99€" : "€79.99", period: fr ? "/an"      : "/year",  note: fr ? "soit 6,67€/mois — économise 15,89€" : "only €6.67/mo — save €15.89", color: "#818cf8", label: fr ? "Annuel"   : "Annual",  plan: "annual"  },
            ].map(p => (
              <div key={p.label} style={{ background:"#0a0a14", border:`1px solid ${p.color}30`, borderRadius:16, padding:"28px 24px", textAlign:"left", position:"relative", overflow:"hidden" }}>
                {p.badge && <div style={{ position:"absolute", top:14, right:14, background:`${p.color}20`, color:p.color, fontSize:10, fontWeight:800, padding:"3px 8px", borderRadius:20, letterSpacing:0.5 }}>{p.badge}</div>}
                <div style={{ fontSize:11, fontWeight:700, color:p.color, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>{p.label}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:6 }}>
                  <span style={{ fontSize:36, fontWeight:900, color:"#fff", letterSpacing:-1 }}>{p.price.split(",")[0]}</span>
                  <span style={{ fontSize:18, fontWeight:900, color:"#fff" }}>,{p.price.split(",")[1]}</span>
                  <span style={{ fontSize:13, color:"#555", fontWeight:600 }}>{p.period}</span>
                </div>
                <div style={{ fontSize:11, color:"#444", marginBottom:20 }}>{p.note}</div>
                <button onClick={() => onCheckout ? onCheckout(p.plan) : onEnter()} style={{ width:"100%", background:`${p.color}15`, border:`1px solid ${p.color}40`, color:p.color, borderRadius:8, padding:"10px 0", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${p.color}25`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${p.color}15`; }}>
                  {fr ? "Commencer →" : "Get started →"}
                </button>
              </div>
            ))}
          </div>
          <p style={{ fontSize:12, color:"#333" }}>
            {fr ? "✓ Accès immédiat  ·  ✓ Données privées  ·  ✓ Annulation en 1 clic" : "✓ Instant access  ·  ✓ Private data  ·  ✓ Cancel in 1 click"}
          </p>
        </div>
      </section>

      {/* ── SECTION 6 : CTA FINAL ── */}
      <section className="land-section" style={{ justifyContent:"center", alignItems:"center", padding:"64px 24px 0", background:"radial-gradient(ellipse 80% 60% at 50% 50%,#00e5a00a 0%,transparent 70%), #06060f", textAlign:"center" }}>
        <div style={{ position:"relative", zIndex:1, maxWidth:720 }}>
          {/* Big glow */}
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:500, height:500, background:"radial-gradient(circle,#00e5a015,transparent 70%)", borderRadius:"50%", pointerEvents:"none", animation:"glow-pulse 5s ease-in-out infinite" }} />

          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#00e5a0", letterSpacing:3, textTransform:"uppercase", marginBottom:24 }}>
              {fr ? "Prêt à commencer ?" : "Ready to start?"}
            </div>
            <h2 style={{ fontSize:"clamp(32px,6vw,68px)", fontWeight:900, letterSpacing:-3, margin:"0 0 20px", lineHeight:1.05 }}>
              {fr ? <><span className="grad-text">Votre espace</span><br />vous attend.</> : <><span className="grad-text">Your dashboard</span><br />is waiting.</>}
            </h2>
            <p style={{ fontSize:16, color:"#444", marginBottom:48, lineHeight:1.7 }}>
              {fr ? "Synchronisé en temps réel. Multi-appareils. 100% privé." : "Real-time sync. Multi-device. 100% private."}
            </p>
            <button className="land-cta" onClick={onEnter} style={{ fontSize:17, padding:"18px 48px", borderRadius:14 }}>
              {fr ? "Accéder à mon espace →" : "Open my dashboard →"}
            </button>
          </div>
        </div>

        <footer style={{ position:"absolute", bottom:0, left:0, right:0, padding:"20px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #0e0e1e" }}>
          <div style={{ display:"flex", alignItems:"center", gap:2 }}>
            <span style={{ fontWeight:900, fontSize:14 }}>spirit</span>
            <span style={{ fontWeight:900, fontSize:14, color:"#00e5a0" }}>.</span>
          </div>
          <div style={{ fontSize:11, color:"#333", letterSpacing:.5 }}>
            {fr ? "Outil personnel — non affilié à une prop firm" : "Personal tool — not affiliated with any prop firm"}
          </div>
        </footer>
      </section>
    </div>
  );
}

function SessionCalendar({ trades, sessions = {}, onDetail, onNew, onDayOpen, lang = "fr" }) {
  const fr = lang === "fr";
  const G = { green: "#00e5a0", red: "#ef4444", purple: "#818cf8", amber: "#f59e0b", card: "#0a0a14", border: "#1a1a2e", text: "#e5e7eb", dim: "#6b7280", bg: "#06060f" };

  const today = new Date().toISOString().slice(0, 10);
  const [viewDate, setViewDate] = useState(() => {
    // Centrer sur le mois ayant le plus de trades, sinon mois actuel
    const allDates = trades.map(t => t.date).filter(Boolean);
    if (allDates.length === 0) return new Date();
    const latest = allDates.sort().pop();
    return new Date(latest + "T12:00:00");
  });


  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthLabel = new Date(year, month, 1).toLocaleDateString(fr ? "fr-FR" : "en-US", { month: "long", year: "numeric" });

  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // Grouper trades par date
  const byDate = {};
  trades.forEach(t => {
    if (!t.date) return;
    if (!byDate[t.date]) byDate[t.date] = [];
    byDate[t.date].push(t);
  });

  // Générer les jours du mois (grille lun→dim)
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Décalage lundi=0
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push(iso);
  }
  // Compléter à multiple de 7
  while (cells.length % 7 !== 0) cells.push(null);

  const EMOTION_EMOJI = { "Confiant": "😊", "Serein": "😌", "Stressé": "😰", "Anxieux": "😟", "Frustré": "😤", "Euphorique": "🤩", "Impatient": "⚡", "En FOMO": "😱", "Neutre": "😐" };
  const FOOD_EMOJI = { "Saine": "🥗", "Neutre": "🍽️", "Mauvaise": "🍔" };

  const getDayData = (iso) => {
    const dayTrades = (byDate[iso] || []).sort((a, b) => (a.heure || "").localeCompare(b.heure || ""));
    const sess = sessions[iso] || {};
    const pnl = dayTrades.reduce((s, t) => s + (t.pnl || 0), 0);
    const wins = dayTrades.filter(t => (t.pnl || 0) > 0).length;
    // Émotion : depuis session, sinon depuis trades
    const emotions = (sess.etat_esprit || []);
    const emotionFromTrade = dayTrades[0]?.emotion_avant ? dayTrades[0].emotion_avant.split(",")[0].trim() : null;
    const mainEmotion = emotions[0] || emotionFromTrade;
    // Nourriture : depuis session sinon trade
    const food = sess.alimentation || dayTrades[0]?.alimentation;
    const sport = !!sess.sport;
    const sommeil = sess.qualite_sommeil || dayTrades[0]?.qualite_sommeil;
    const hasSession = Object.keys(sess).length > 0;
    const annonces = sess.annonces || [];
    const annonceHigh = annonces.filter(a => a.impact === "high").length;
    const annonceMed = annonces.filter(a => a.impact === "medium").length;
    return { dayTrades, pnl, wins, mainEmotion, food, sport, sommeil, hasSession, hasTrades: dayTrades.length > 0, annonces, annonceHigh, annonceMed };
  };

  const dayHeaders = fr ? ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"] : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  return (
    <div>
      {/* Navigation mois */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={prevMonth} style={{ background: G.card, border: `1px solid ${G.border}`, color: G.dim, borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
        <div style={{ fontSize: 15, fontWeight: 800, color: G.text, textTransform: "capitalize", letterSpacing: 0.3 }}>{monthLabel}</div>
        <button onClick={nextMonth} style={{ background: G.card, border: `1px solid ${G.border}`, color: G.dim, borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      </div>

      {/* En-têtes jours */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
        {dayHeaders.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: G.dim, letterSpacing: 1, padding: "4px 0", textTransform: "uppercase" }}>{d}</div>
        ))}
      </div>

      {/* Grille calendrier */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((iso, i) => {
          if (!iso) return <div key={i} />;
          const { dayTrades, pnl, mainEmotion, food, sport, hasTrades, hasSession, annonces, annonceHigh, annonceMed } = getDayData(iso);
          const isToday = iso === today;
          const isFuture = iso > today;
          const dayNum = parseInt(iso.slice(8));
          const clickable = (hasTrades || hasSession) && !isFuture;

          return (
            <button key={iso} onClick={() => clickable && onDayOpen(iso)}
              style={{
                background: hasTrades || hasSession ? G.card : "transparent",
                border: `1px solid ${isToday ? G.green + "60" : hasTrades ? (pnl >= 0 ? G.green + "30" : G.red + "30") : hasSession ? G.border : "transparent"}`,
                borderRadius: 10, padding: "8px 6px", cursor: clickable ? "pointer" : "default",
                fontFamily: "inherit", textAlign: "center", minHeight: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                opacity: isFuture ? 0.3 : 1, transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (clickable) e.currentTarget.style.borderColor = G.purple + "60"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = isToday ? G.green + "60" : hasTrades ? (pnl >= 0 ? G.green + "30" : G.red + "30") : hasSession ? G.border : "transparent"; }}>
              {/* Numéro du jour */}
              <div style={{ fontSize: 12, fontWeight: isToday ? 900 : 600, color: isToday ? G.green : hasTrades || hasSession ? G.text : G.dim }}>{dayNum}</div>
              {/* PnL */}
              {hasTrades && (
                <div style={{ fontSize: 11, fontWeight: 800, color: pnl >= 0 ? G.green : G.red, lineHeight: 1 }}>
                  {pnl >= 0 ? "+" : ""}{Math.round(pnl)}$
                </div>
              )}
              {/* Nb trades */}
              {hasTrades && (
                <div style={{ fontSize: 9, color: G.dim, fontWeight: 600 }}>{dayTrades.length}T</div>
              )}
              {/* Icônes état */}
              {(hasTrades || hasSession) && (
                <div style={{ display: "flex", gap: 2, fontSize: 10, flexWrap: "wrap", justifyContent: "center" }}>
                  {mainEmotion && EMOTION_EMOJI[mainEmotion] && <span title={mainEmotion}>{EMOTION_EMOJI[mainEmotion]}</span>}
                  {sport && <span title="Sport">🏃</span>}
                  {food && FOOD_EMOJI[food] && <span title={food}>{FOOD_EMOJI[food]}</span>}
                </div>
              )}
              {annonces.length > 0 && (
                <div style={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", marginTop: 2 }} title={`${annonces.length} annonce(s) économique(s)`}>
                  {annonceHigh > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 1, background: "#ef444420", border: "1px solid #ef444440", borderRadius: 4, padding: "1px 4px", fontSize: 8, fontWeight: 700, color: "#ef4444" }}>📰 {annonceHigh}</span>}
                  {annonceMed > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 1, background: "#f59e0b20", border: "1px solid #f59e0b40", borderRadius: 4, padding: "1px 4px", fontSize: 8, fontWeight: 700, color: "#f59e0b" }}>📰 {annonceMed}</span>}
                  {annonceHigh === 0 && annonceMed === 0 && annonces.length > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(255,255,255,0.04)", border: "1px solid #1a1a2e", borderRadius: 4, padding: "1px 4px", fontSize: 8, fontWeight: 600, color: "#6b7280" }}>📰 {annonces.length}</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}

function TutorialOverlay({ step, onNext, onSkip, lang = "fr", onNavigate }) {
  const fr = lang === "fr";
  const [bubblePos, setBubblePos] = useState({ top: "50%", left: "50%", arrowDir: "none" });

  const STEPS = [
    {
      id: "add-account",
      tab: "dashboard",
      num: 1,
      icon: "🏦",
      title: fr ? "Ajouter ton compte prop firm" : "Add your prop firm account",
      desc: fr
        ? "Commence par créer le compte que tu trades. C'est la base de tout — tes trades, ton PnL et tes statistiques seront liés à ce compte."
        : "Start by creating the account you trade with. Everything — your trades, PnL and stats — will be linked to it.",
      action: fr ? "Clique sur « Ajouter un compte prop firm »" : "Click « Add a prop firm account »",
    },
    {
      id: "fiscal-structure",
      tab: "roi",
      num: 2,
      icon: "🏛️",
      title: fr ? "Configurer ta structure fiscale" : "Set up your tax structure",
      desc: fr
        ? "Renseigne ton pays et ta structure (auto-entrepreneur, SASU...) pour que Spirit calcule automatiquement tes impôts sur tes payouts. Optionnel, tu peux le faire plus tard."
        : "Set your country and structure (self-employed, LLC...) so Spirit automatically calculates your taxes on payouts. Optional — you can do it later.",
      action: fr ? "Clique sur « Activer »" : "Click « Activate »",
    },
    {
      id: "new-session",
      tab: "session",
      num: 3,
      icon: "🌅",
      title: fr ? "Enregistrer ton premier trade" : "Record your first trade",
      desc: fr
        ? "Lance une nouvelle session de trading pour préparer ta journée (checklist, annonces, état d'esprit), puis ajoute tes trades. Tout est connecté."
        : "Start a new trading session to prepare your day (checklist, announcements, mindset), then log your trades. Everything is connected.",
      action: fr ? "Clique sur « Nouvelle session de trading »" : "Click « New trading session »",
    },
  ];

  const current = STEPS[step];

  useEffect(() => {
    // Navigate to the right tab for this step
    if (onNavigate) onNavigate(current.tab);
  }, [step]);

  useEffect(() => {
    // Find and position bubble near the target element
    const timeout = setTimeout(() => {
      const el = document.querySelector(`[data-tutorial="${current.id}"]`);
      if (!el) { setBubblePos({ top: "50%", left: "50%", arrowDir: "none", centered: true }); return; }
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const bubbleH = 260;
      const bubbleW = 340;
      // Prefer showing below, fallback above
      let top, left, arrowDir;
      if (rect.bottom + bubbleH + 20 < vh) {
        top = rect.bottom + 16;
        arrowDir = "up";
      } else {
        top = rect.top - bubbleH - 16;
        arrowDir = "down";
      }
      left = Math.max(16, Math.min(rect.left + rect.width / 2 - bubbleW / 2, vw - bubbleW - 16));
      setBubblePos({ top, left, arrowDir, centered: false, targetRect: rect });
    }, 200);
    return () => clearTimeout(timeout);
  }, [step]);

  if (!current) return null;

  return (
    <>
      {/* CSS pour pulse */}
      <style>{`
        @keyframes tutorial-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,229,160,0.6), 0 0 0 0 rgba(0,229,160,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(0,229,160,0.15), 0 0 0 16px rgba(0,229,160,0.05); }
        }
        [data-tutorial="${current.id}"] {
          animation: tutorial-pulse 1.8s ease-in-out infinite !important;
          outline: 2px solid #00e5a0 !important;
          outline-offset: 3px !important;
          position: relative !important;
          z-index: 901 !important;
        }
      `}</style>

      {/* Overlay semi-transparent */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 900 }} onClick={onSkip} />

      {/* Bulle */}
      <div style={{
        position: "fixed",
        top: bubblePos.centered ? "50%" : bubblePos.top,
        left: bubblePos.centered ? "50%" : bubblePos.left,
        transform: bubblePos.centered ? "translate(-50%,-50%)" : "none",
        zIndex: 902,
        width: 340,
        background: "#0e0e1a",
        border: "1px solid #818cf840",
        borderRadius: 16,
        padding: "22px 22px 18px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(129,140,248,0.1)",
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}>
        {/* Flèche vers l'élément */}
        {!bubblePos.centered && bubblePos.arrowDir === "up" && (
          <div style={{ position: "absolute", top: -8, left: 32, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "8px solid #818cf840" }} />
        )}
        {!bubblePos.centered && bubblePos.arrowDir === "down" && (
          <div style={{ position: "absolute", bottom: -8, left: 32, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid #818cf840" }} />
        )}

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#818cf820", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{current.icon}</div>
            <div>
              <div style={{ fontSize: 10, color: "#818cf8", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>{fr ? "Étape" : "Step"} {current.num}/{STEPS.length}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{current.title}</div>
            </div>
          </div>
          <button onClick={onSkip} style={{ background: "none", border: "none", color: "#374151", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "2px 4px", borderRadius: 6 }}
            onMouseEnter={e => e.currentTarget.style.color = "#9ca3af"}
            onMouseLeave={e => e.currentTarget.style.color = "#374151"}>✕</button>
        </div>

        {/* Barre de progression */}
        <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? "#818cf8" : "#1a1a2e", transition: "background 0.3s" }} />
          ))}
        </div>

        {/* Description */}
        <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.65, marginBottom: 12 }}>{current.desc}</div>

        {/* Action */}
        <div style={{ background: "#00e5a010", border: "1px solid #00e5a025", borderRadius: 8, padding: "8px 12px", marginBottom: 16, fontSize: 12, color: "#00e5a0", fontWeight: 600 }}>
          👆 {current.action}
        </div>

        {/* Boutons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onSkip} style={{ background: "none", border: "none", color: "#374151", fontSize: 12, cursor: "pointer", fontFamily: "inherit", padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "#6b7280"}
            onMouseLeave={e => e.currentTarget.style.color = "#374151"}>
            {fr ? "Ignorer le tutoriel" : "Skip tutorial"}
          </button>
          <button onClick={onNext} style={{ background: "linear-gradient(135deg,#818cf8,#6366f1)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {step < STEPS.length - 1 ? (fr ? "Suivant →" : "Next →") : (fr ? "Terminer ✓" : "Done ✓")}
          </button>
        </div>
      </div>
    </>
  );
}

function DayDetail({ date, trades, sessions = {}, onBack, onTradeDetail, onNewTrade, lang = "fr" }) {
  const fr = lang === "fr";
  const G = { green: "#00e5a0", red: "#ef4444", purple: "#818cf8", amber: "#f59e0b", card: "#0a0a14", border: "#1a1a2e", text: "#e5e7eb", dim: "#6b7280" };
  const EMOTION_EMOJI = { "Confiant": "😊", "Serein": "😌", "Stressé": "😰", "Anxieux": "😟", "Frustré": "😤", "Euphorique": "🤩", "Impatient": "⚡", "En FOMO": "😱", "Neutre": "😐" };
  const FOOD_EMOJI = { "Saine": "🥗", "Neutre": "🍽️", "Mauvaise": "🍔" };
  const FOOD_COLOR = { "Saine": G.green, "Neutre": G.amber, "Mauvaise": G.red };

  const sess = sessions[date] || {};
  const dayTrades = trades.filter(t => t.date === date).sort((a, b) => (a.heure || "").localeCompare(b.heure || ""));
  const pnl = dayTrades.reduce((s, t) => s + (t.pnl || 0), 0);
  const wins = dayTrades.filter(t => (t.pnl || 0) > 0).length;
  const wr = dayTrades.length > 0 ? Math.round(wins / dayTrades.length * 100) : 0;
  const avgRR = dayTrades.length > 0 ? (dayTrades.reduce((s, t) => s + (t.rr || 0), 0) / dayTrades.length).toFixed(2) : null;
  const disciplined = dayTrades.filter(t => t.respect === "Oui").length;
  const bestTrade = dayTrades.length > 0 ? dayTrades.reduce((a, b) => (b.pnl || 0) > (a.pnl || 0) ? b : a) : null;
  const worstTrade = dayTrades.length > 1 ? dayTrades.reduce((a, b) => (b.pnl || 0) < (a.pnl || 0) ? b : a) : null;

  const emotions = sess.etat_esprit || [];
  const sport = !!sess.sport;
  const food = sess.alimentation || dayTrades[0]?.alimentation;
  const sommeil = sess.qualite_sommeil || dayTrades[0]?.qualite_sommeil;
  const intention = sess.intention || "";
  const plan = sess.plan_trading || "";

  const buildSummary = () => {
    const lines = [];
    if (dayTrades.length === 0) {
      lines.push(fr ? "Journée sans trades enregistrés." : "No trades recorded for this day.");
    } else {
      const intro = pnl > 0
        ? (fr ? `Journée profitable — ${dayTrades.length} trade${dayTrades.length > 1 ? "s" : ""}, +${Math.round(pnl)}$, win rate ${wr}%.` : `Profitable day — ${dayTrades.length} trade${dayTrades.length > 1 ? "s" : ""}, +$${Math.round(pnl)}, ${wr}% win rate.`)
        : pnl < 0
        ? (fr ? `Journée difficile — ${dayTrades.length} trade${dayTrades.length > 1 ? "s" : ""}, ${Math.round(pnl)}$, win rate ${wr}%.` : `Tough day — ${dayTrades.length} trade${dayTrades.length > 1 ? "s" : ""}, $${Math.round(pnl)}, ${wr}% win rate.`)
        : (fr ? `Journée neutre — ${dayTrades.length} trade${dayTrades.length > 1 ? "s" : ""}, 0$, win rate ${wr}%.` : `Break-even day — ${dayTrades.length} trades, $0.`);
      lines.push(intro);
      if (bestTrade && bestTrade.pnl > 0) lines.push(fr ? `Meilleur trade : ${bestTrade.actif} ${bestTrade.direction}${bestTrade.heure ? " à " + bestTrade.heure : ""} (+${Math.round(bestTrade.pnl)}$).` : `Best trade: ${bestTrade.actif} ${bestTrade.direction}${bestTrade.heure ? " at " + bestTrade.heure : ""} (+$${Math.round(bestTrade.pnl)}).`);
      if (worstTrade && worstTrade.pnl < 0 && worstTrade.id !== bestTrade?.id) lines.push(fr ? `Trade le plus difficile : ${worstTrade.actif} ${worstTrade.direction} (${Math.round(worstTrade.pnl)}$).` : `Hardest trade: ${worstTrade.actif} ${worstTrade.direction} ($${Math.round(worstTrade.pnl)}).`);
      if (disciplined === dayTrades.length) lines.push(fr ? "Toutes les règles respectées." : "All rules respected.");
      else if (disciplined < dayTrades.length) lines.push(fr ? `Discipline : ${disciplined}/${dayTrades.length} trades dans les règles.` : `Discipline: ${disciplined}/${dayTrades.length} trades within rules.`);
    }
    const positif = (emotions.includes("Confiant") || emotions.includes("Serein")) && pnl > 0;
    const negatif = (emotions.includes("Stressé") || emotions.includes("Anxieux") || emotions.includes("Frustré")) && pnl < 0;
    if (positif) lines.push(fr ? `Bon état d'esprit (${emotions[0]}) — corrélé à ta performance.` : `Good mindset (${emotions[0]}) — matched your performance.`);
    if (negatif) lines.push(fr ? `État d'esprit tendu (${emotions[0]}) — à surveiller pour la prochaine session.` : `Tense mindset (${emotions[0]}) — watch this next session.`);
    if (food === "Mauvaise") lines.push(fr ? "Alimentation mauvaise ce jour — peut affecter la concentration." : "Poor nutrition today — may affect focus.");
    if (food === "Saine" && sport) lines.push(fr ? "Excellente hygiène de vie ce jour." : "Excellent lifestyle habits today.");
    if (sommeil && sommeil <= 2) lines.push(fr ? `Sommeil très court (${sommeil}/5) — attention à la fatigue décisionnelle.` : `Very poor sleep (${sommeil}/5) — watch for decision fatigue.`);
    return lines;
  };

  const summaryLines = buildSummary();
  const dateLabel = new Date(date + "T12:00:00").toLocaleDateString(fr ? "fr-FR" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const isToday = date === new Date().toISOString().slice(0, 10);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "1px solid #1a1a2e", color: "#6b7280", borderRadius: 8, padding: "7px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "inherit", marginBottom: 24, transition: "all 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#e5e7eb"; e.currentTarget.style.borderColor = "#374151"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "#1a1a2e"; }}>
        ← {fr ? "Retour au calendrier" : "Back to calendar"}
      </button>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "clamp(18px,3vw,26px)", fontWeight: 900, letterSpacing: -0.8, margin: 0, textTransform: "capitalize", color: G.text }}>{dateLabel}</h2>
          {isToday && <span style={{ fontSize: 10, fontWeight: 800, color: G.green, background: G.green + "20", borderRadius: 20, padding: "3px 10px", letterSpacing: 1 }}>AUJOURD'HUI</span>}
          {dayTrades.length > 0 && <span style={{ fontSize: 13, fontWeight: 800, color: pnl > 0 ? G.green : pnl < 0 ? G.red : G.dim, background: (pnl > 0 ? G.green : pnl < 0 ? G.red : G.dim) + "15", borderRadius: 8, padding: "4px 12px" }}>{pnl > 0 ? "+" : ""}{Math.round(pnl)}$</span>}
        </div>
        {dayTrades.length > 0 && (
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: G.dim }}>{dayTrades.length} trade{dayTrades.length > 1 ? "s" : ""}</span>
            <span style={{ fontSize: 12, color: G.dim }}>Win rate <strong style={{ color: G.text }}>{wr}%</strong></span>
            {avgRR && <span style={{ fontSize: 12, color: G.dim }}>R/R <strong style={{ color: G.text }}>{avgRR}</strong></span>}
            <span style={{ fontSize: 12, color: G.dim }}>Discipline <strong style={{ color: disciplined === dayTrades.length ? G.green : G.amber }}>{disciplined}/{dayTrades.length}</strong></span>
          </div>
        )}
      </div>

      {/* Résumé auto */}
      <div style={{ background: "linear-gradient(135deg,#818cf808,#00e5a005)", border: "1px solid #818cf820", borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: G.purple, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>✦ {fr ? "Résumé de ta journée" : "Day summary"}</div>
        {summaryLines.map((line, i) => (
          <div key={i} style={{ fontSize: 13, color: i === 0 ? G.text : G.dim, lineHeight: 1.8, marginBottom: i < summaryLines.length - 1 ? 2 : 0 }}>{line}</div>
        ))}
      </div>

      {/* Ma journée */}
      {(emotions.length > 0 || sport || food || sommeil || intention || plan) && (
        <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: G.dim, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>{fr ? "Ma journée" : "My day"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: (intention || plan) ? 14 : 0 }}>
            {emotions.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: G.dim, fontWeight: 600, marginBottom: 6 }}>{fr ? "État d'esprit" : "Mindset"}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {emotions.map(e => <span key={e} style={{ fontSize: 12, color: G.text, background: "#1a1a2e", borderRadius: 6, padding: "3px 8px" }}>{EMOTION_EMOJI[e] || ""} {e}</span>)}
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}><span>🏃</span><span style={{ color: sport ? G.green : G.dim }}>{sport ? (fr ? "Sport fait" : "Workout done") : (fr ? "Pas de sport" : "No workout")}</span></div>
              {food && <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}><span>{FOOD_EMOJI[food] || "🍽️"}</span><span style={{ color: FOOD_COLOR[food] || G.dim }}>{fr ? "Alimentation" : "Nutrition"} : {food}</span></div>}
              {sommeil > 0 && <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}><span>🌙</span><span style={{ color: sommeil >= 4 ? G.green : sommeil >= 3 ? G.amber : G.red }}>{fr ? "Sommeil" : "Sleep"} {sommeil}/5 {"★".repeat(sommeil)}{"☆".repeat(5 - sommeil)}</span></div>}
            </div>
          </div>
          {intention && <div style={{ paddingTop: 14, borderTop: `1px solid ${G.border}`, marginTop: 4 }}><div style={{ fontSize: 10, color: G.dim, fontWeight: 600, marginBottom: 6 }}>{fr ? "Intention du jour" : "Day intention"}</div><div style={{ fontSize: 13, color: G.text, fontStyle: "italic", lineHeight: 1.6 }}>"{intention}"</div></div>}
          {plan && <div style={{ marginTop: 12 }}><div style={{ fontSize: 10, color: G.dim, fontWeight: 600, marginBottom: 6 }}>{fr ? "Plan de trading" : "Trading plan"}</div><div style={{ fontSize: 13, color: G.text, lineHeight: 1.6 }}>{plan}</div></div>}
        </div>
      )}

      {/* Trades */}
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: G.dim, letterSpacing: 2, textTransform: "uppercase" }}>{fr ? "Mes trades" : "My trades"}</div>
          <button onClick={onNewTrade} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: G.green + "15", border: `1px solid ${G.green}30`, color: G.green, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            + {fr ? "Ajouter" : "Add trade"}
          </button>
        </div>
        {dayTrades.length === 0 ? (
          <div style={{ padding: "32px 20px", textAlign: "center", color: G.dim, fontSize: 13 }}>{fr ? "Aucun trade ce jour." : "No trades this day."}</div>
        ) : dayTrades.map((t, i) => {
          const win = (t.pnl || 0) > 0; const lose = (t.pnl || 0) < 0;
          return (
            <button key={t.id} onClick={() => onTradeDetail(t)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "none", border: "none", borderBottom: i < dayTrades.length - 1 ? `1px solid ${G.border}` : "none", cursor: "pointer", color: G.text, fontFamily: "inherit", textAlign: "left", transition: "background 0.1s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#ffffff05"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <div style={{ width: 4, height: 34, borderRadius: 2, background: win ? G.green : lose ? G.red : G.dim, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>{t.actif}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: t.direction === "LONG" ? G.green : G.red, background: (t.direction === "LONG" ? G.green : G.red) + "15", borderRadius: 4, padding: "2px 6px" }}>{t.direction}</span>
                  {t.setup && <span style={{ fontSize: 11, color: G.dim }}>{t.setup}</span>}
                  <span style={{ fontSize: 10, color: t.respect === "Oui" ? G.green : t.respect === "Non" ? G.red : G.amber, fontWeight: 700 }}>{t.respect === "Oui" ? "✓ Règle" : t.respect === "Non" ? "✗ Règle" : "~ Partiel"}</span>
                </div>
                <div style={{ fontSize: 11, color: G.dim, marginTop: 3 }}>
                  {t.heure && <span>{t.heure}</span>}
                  {t.duree && <span> · {t.duree}min</span>}
                  {t.taille && <span> · {t.taille} contrats</span>}
                  {t.rr && <span> · R/R {t.rr}</span>}
                  {t.compte && <span> · {t.compte.split(" ").slice(0, 2).join(" ")}</span>}
                </div>
                {t.lecon && <div style={{ fontSize: 11, color: G.purple, marginTop: 3, fontStyle: "italic" }}>"{t.lecon}"</div>}
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: win ? G.green : lose ? G.red : G.dim, flexShrink: 0 }}>{(t.pnl || 0) >= 0 ? "+" : ""}{(t.pnl || 0).toFixed(0)}$</div>
              <div style={{ fontSize: 12, color: G.dim }}>›</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function makeAuthFetch(user) {
  return async (url, options = {}) => {
    const headers = { ...(options.headers || {}) };
    if (user?.getIdToken) {
      try {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      } catch {}
    }
    return fetch(url, { ...options, headers });
  };
}

function MonCompte({ user, subscription, onLogout, lang = "fr" }) {
  const fr = lang === "fr";
  const G = { bg: "#06060f", card: "#0a0a14", border: "#1a1a2e", text: "#e5e7eb", dim: "#6b7280", green: "#00e5a0", red: "#ef4444", purple: "#818cf8" };

  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState("");

  const handleManageBilling = async () => {
    if (!subscription?.stripeCustomerId) return;
    setPortalLoading(true); setPortalError("");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/create-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ customerId: subscription.stripeCustomerId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setPortalError(data.error || "Erreur");
    } catch { setPortalError(fr ? "Erreur réseau" : "Network error"); }
    setPortalLoading(false);
  };

  const planLabel = { monthly: fr ? "Mensuel" : "Monthly", annual: fr ? "Annuel" : "Annual", lifetime: fr ? "À vie" : "Lifetime", owner: fr ? "Propriétaire" : "Owner" };
  const isOwner = subscription?.plan === "owner";
  const expiresAt = subscription?.expiresAt && subscription.expiresAt !== "9999-12-31T00:00:00.000Z"
    ? new Date(subscription.expiresAt).toLocaleDateString(fr ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const activatedAt = subscription?.activatedAt
    ? new Date(subscription.activatedAt).toLocaleDateString(fr ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const Section = ({ title, children }) => (
    <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "24px 28px", marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: G.dim, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>{title}</div>
      {children}
    </div>
  );

  const Row = ({ label, value, valueColor }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${G.border}` }}>
      <span style={{ fontSize: 13, color: G.dim }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: valueColor || G.text }}>{value}</span>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ fontSize: 24, fontWeight: 900, color: G.text, marginBottom: 28 }}>
        {fr ? "Mon compte" : "My account"}
      </div>

      {/* Profil */}
      <Section title={fr ? "Profil" : "Profile"}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          {user.photoURL
            ? <img src={user.photoURL} alt="" style={{ width: 56, height: 56, borderRadius: "50%", border: `2px solid ${G.border}` }} />
            : <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👤</div>
          }
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: G.text }}>{user.displayName || (fr ? "Utilisateur" : "User")}</div>
            <div style={{ fontSize: 12, color: G.dim, marginTop: 2 }}>{user.email}</div>
          </div>
        </div>
        <Row label="Email" value={user.email} />
        <Row label={fr ? "Méthode de connexion" : "Sign-in method"} value={user.providerData?.[0]?.providerId === "google.com" ? "Google" : "Email / Mot de passe"} />
      </Section>

      {/* Abonnement */}
      <Section title={fr ? "Abonnement" : "Subscription"}>
        {subscription?.active ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.green, boxShadow: `0 0 8px ${G.green}` }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: G.green }}>{fr ? "Actif" : "Active"}</span>
              {!isOwner && <span style={{ fontSize: 12, color: G.dim, background: "#1a1a2e", borderRadius: 6, padding: "2px 8px" }}>{planLabel[subscription.plan] || subscription.plan}</span>}
              {isOwner && <span style={{ fontSize: 12, color: G.purple, background: G.purple + "20", borderRadius: 6, padding: "2px 8px" }}>✦ {planLabel.owner}</span>}
            </div>
            {activatedAt && <Row label={fr ? "Activé le" : "Activated on"} value={activatedAt} />}
            {expiresAt && <Row label={fr ? "Renouvellement le" : "Renewal on"} value={expiresAt} />}
            {!isOwner && subscription?.stripeCustomerId && (
              <div style={{ marginTop: 20 }}>
                <button onClick={handleManageBilling} disabled={portalLoading}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: `1px solid ${G.border}`, borderRadius: 10, padding: "11px 18px", color: G.text, fontSize: 13, fontWeight: 700, cursor: portalLoading ? "wait" : "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#ffffff40"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = G.border}>
                  💳 {portalLoading ? "..." : fr ? "Gérer mon abonnement & facturation" : "Manage subscription & billing"}
                </button>
                <div style={{ fontSize: 11, color: G.dim, marginTop: 8, lineHeight: 1.6 }}>
                  {fr ? "Annuler, changer de plan, télécharger les factures via le portail Stripe sécurisé." : "Cancel, change plan, download invoices via the secure Stripe portal."}
                </div>
                {portalError && <div style={{ fontSize: 12, color: G.red, marginTop: 8 }}>{portalError}</div>}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 13, color: G.dim, marginBottom: 16 }}>{fr ? "Aucun abonnement actif." : "No active subscription."}</div>
            <a href="/tarifs" style={{ display: "inline-block", padding: "10px 24px", background: G.green, color: "#06060f", borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
              {fr ? "Voir les tarifs →" : "See pricing →"}
            </a>
          </div>
        )}
      </Section>

      {/* Sécurité */}
      <Section title={fr ? "Sécurité" : "Security"}>
        <Row label={fr ? "Authentification" : "Authentication"} value={user.providerData?.[0]?.providerId === "google.com" ? "Google OAuth" : "Email / Password"} />
        <div style={{ marginTop: 20 }}>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: `1px solid ${G.red}30`, borderRadius: 10, padding: "10px 18px", color: G.red, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.background = G.red + "10"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            🚪 {fr ? "Se déconnecter" : "Sign out"}
          </button>
        </div>
      </Section>
    </div>
  );
}

function TemplatesPage({ templates, setTemplates, lang = "fr" }) {
  const fr = lang === "fr";
  const [editingId, setEditingId] = useState(null);
  const [editingNom, setEditingNom] = useState("");
  const FIELDS = [
    { key: "actif", label: fr ? "Actif" : "Asset" },
    { key: "direction", label: "Direction" },
    { key: "setup", label: "Setup" },
    { key: "taille", label: fr ? "Taille" : "Size" },
    { key: "heure", label: fr ? "Heure" : "Time" },
    { key: "duree", label: fr ? "Durée" : "Duration" },
    { key: "compte", label: fr ? "Compte" : "Account" },
  ];
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
        {fr ? "Mes Templates" : "My Templates"}
      </h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 32 }}>
        {fr ? "Tes 3 templates sauvegardés. Clique sur le nom pour renommer." : "Your 3 saved templates. Click the name to rename."}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {templates.map(tpl => (
          <div key={tpl.id} style={{ background: "#0a0a14", border: `1px solid ${tpl.vide ? "#1a1a2e" : "#7c3aed40"}`, borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {editingId === tpl.id ? (
                <input
                  autoFocus
                  value={editingNom}
                  onChange={e => setEditingNom(e.target.value)}
                  onBlur={() => {
                    if (editingNom.trim()) setTemplates(prev => prev.map(t => t.id === tpl.id ? { ...t, nom: editingNom.trim() } : t));
                    setEditingId(null);
                  }}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur(); }}
                  style={{ background: "#1a1a2e", border: "1px solid #7c3aed60", borderRadius: 6, color: "#fff", fontSize: 15, fontWeight: 700, padding: "4px 10px", fontFamily: "inherit", outline: "none", width: 220 }}
                />
              ) : (
                <span onClick={() => { setEditingId(tpl.id); setEditingNom(tpl.nom); }} style={{ fontSize: 15, fontWeight: 700, color: tpl.vide ? "#4b5563" : "#e5e7eb", cursor: "pointer" }}>
                  {tpl.nom} <span style={{ opacity: 0.4, fontSize: 12 }}>✏️</span>
                </span>
              )}
              {tpl.vide
                ? <div style={{ fontSize: 12, color: "#4b5563", marginTop: 4 }}>{fr ? "Vide — sauvegarde depuis le formulaire Nouveau trade" : "Empty — save from the New trade form"}</div>
                : <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {FIELDS.filter(f => tpl[f.key]).map(f => (
                      <span key={f.key} style={{ background: "#12121f", border: "1px solid #2a2a3e", borderRadius: 6, fontSize: 11, color: "#9ca3af", padding: "2px 8px" }}>
                        <span style={{ color: "#6b7280" }}>{f.label} </span>{tpl[f.key]}
                      </span>
                    ))}
                  </div>
              }
            </div>
            {!tpl.vide && (
              <button
                onClick={() => setTemplates(prev => prev.map(t => t.id === tpl.id ? { ...t, actif: "", direction: "LONG", setup: "", taille: "", heure: "09:30", duree: "", compte: "", vide: true } : t))}
                style={{ background: "none", border: "1px solid #ef444430", borderRadius: 6, color: "#ef4444", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
              >
                {fr ? "Vider" : "Clear"}
              </button>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, padding: 14, background: "#0a0a14", border: "1px solid #1a1a2e", borderRadius: 10, color: "#6b7280", fontSize: 13 }}>
        💡 {fr ? "Pour sauvegarder : remplis un trade → \"Enregistrer comme template\"." : "To save: fill a trade → \"Save as template\"."}
      </div>
    </div>
  );
}

export default function App({ user, cloudData, onDataChange, saveStatus, onLogout, subscription, isPreview = false, onCheckout, checkoutLoading, checkoutError }) {
  const authFetch = makeAuthFetch(user);

  const [lang, setLang] = useState(() => localStorage.getItem("spirit_lang") || "fr");
  const T = TR[lang];
  const fr = lang === "fr";
  const isOwner = user?.email === "mylanndecourt@gmail.com";
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const triggerPaywall = () => { if (isPreview) { setShowPaywallModal(true); return true; } return false; };
  const toggleLang = () => { const nl = lang === "fr" ? "en" : "fr"; setLang(nl); localStorage.setItem("spirit_lang", nl); };
  const [showLanding, setShowLanding] = useState(() => localStorage.getItem("spirit_skipped_landing") !== "1");

  const VALID_TABS = ["dashboard", "session", "analyse", "roi", "nouveau", "regles", "objectifs", "tarifs", "chemin", "compte"];
  const [sessionSubView, setSessionSubView] = useState("calendar"); // "calendar" | "preparation" | "dayDetail"

  // Tutorial
  const [tutorialActive, setTutorialActive] = useState(() => localStorage.getItem("spirit_tutorial_done") !== "1");
  const [tutorialStep, setTutorialStep] = useState(0);
  const closeTutorial = () => { setTutorialActive(false); localStorage.setItem("spirit_tutorial_done", "1"); };
  const nextTutorialStep = () => { if (tutorialStep < 2) setTutorialStep(s => s + 1); else closeTutorial(); };
  const [sessionDayDate, setSessionDayDate] = useState(null);
  const getTabFromUrl = () => {
    const path = window.location.pathname.replace("/", "").toLowerCase();
    return VALID_TABS.includes(path) ? path : null;
  };
  const [tab, setTab] = useState(() => {
    const urlTab = getTabFromUrl();
    if (urlTab) { localStorage.setItem("spirit_skipped_landing", "1"); return urlTab; }
    return localStorage.getItem("spirit_skipped_landing") === "1" ? "dashboard" : "landing";
  });

  const navigateTo = (newTab) => {
    setTab(newTab);
    if (newTab !== "session") setSessionSubView("calendar");
    if (newTab !== "landing") {
      window.history.pushState({}, "", `/${newTab}`);
    } else {
      window.history.pushState({}, "", "/");
    }
  };

  // Gère le bouton retour du navigateur
  useEffect(() => {
    const handlePop = () => {
      const urlTab = getTabFromUrl();
      if (urlTab) setTab(urlTab);
      else setTab("dashboard");
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);
  const [trades, setTrades] = useState(initialTrades);
  const [comptes, setComptes] = useState(initialComptes);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [selectedCompte, setSelectedCompte] = useState(null);
  const [editingTrade, setEditingTrade] = useState(null); // trade en cours d'édition, ou null
  const [newTradeDefaultDate, setNewTradeDefaultDate] = useState(null); // date pré-remplie pour nouveau trade depuis session
  const [showTradeDateModal, setShowTradeDateModal] = useState(false);
  const [editingCompte, setEditingCompte] = useState(null); // compte en cours d'édition, ou null
  const [reglesPreselect, setReglesPreselect] = useState(null); // prop firm à présélectionner dans l'onglet Règles
  const [journalInitialVue, setJournalInitialVue] = useState("liste"); // permet d'ouvrir Journal directement sur Analyse

  // ── États remontés depuis ROI / Regles / Objectifs pour permettre l'export/import complet ──
  const [objectifs, setObjectifs] = useState(initialObjectifs);
  const [reglesPerso, setReglesPerso] = useState(initialReglesPerso);
  const [chapitres, setChapitres] = useState(initialChapitres);
  const [sessions, setSessions] = useState({});
  const DEFAULT_TEMPLATES = [
    { id: 1, nom: "Template 1", actif: "", direction: "LONG", setup: "", taille: "", heure: "09:30", duree: "", compte: "", vide: true },
    { id: 2, nom: "Template 2", actif: "", direction: "LONG", setup: "", taille: "", heure: "09:30", duree: "", compte: "", vide: true },
    { id: 3, nom: "Template 3", actif: "", direction: "LONG", setup: "", taille: "", heure: "09:30", duree: "", compte: "", vide: true },
  ];
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
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

  // ── PERSISTANCE — chargement depuis Firebase (cloudData prop), sauvegarde via onDataChange ──

  // Chargement initial depuis Firestore (cloudData injecté par AppShell)
  useEffect(() => {
    if (!cloudData) return;
    // On charge TOUJOURS depuis Firebase, même si vide — pour respecter un reset volontaire
    if (Array.isArray(cloudData.trades)) setTrades(cloudData.trades);
    if (Array.isArray(cloudData.comptes)) setComptes(cloudData.comptes);
    if (Array.isArray(cloudData.objectifs)) setObjectifs(cloudData.objectifs);
    if (Array.isArray(cloudData.reglesPerso)) setReglesPerso(cloudData.reglesPerso);
    if (cloudData.mentorQ) setMentorQ(cloudData.mentorQ);
    if (Array.isArray(cloudData.fraisDivers)) setFraisDivers(cloudData.fraisDivers);
    if (cloudData.fiscal) setFiscal(cloudData.fiscal);
    if (cloudData.deviseRecue) setDeviseRecue(cloudData.deviseRecue);
    if (cloudData.deviseRef) setDeviseRef(cloudData.deviseRef);
    if (cloudData.tauxPerso) setTauxPerso(cloudData.tauxPerso);
    if (Array.isArray(cloudData.chapitres)) setChapitres(cloudData.chapitres);
    if (cloudData.sessions && typeof cloudData.sessions === "object") setSessions(cloudData.sessions);
    if (Array.isArray(cloudData.templates) && cloudData.templates.length === 3) setTemplates(cloudData.templates);
    setStorageReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sauvegarde automatique vers Firestore via onDataChange (debounce géré dans AppShell)
  useEffect(() => {
    if (!storageReady) return;
    const data = { trades, comptes, objectifs, reglesPerso, mentorQ, fraisDivers, fiscal, deviseRecue, deviseRef, tauxPerso, chapitres, sessions, templates };
    onDataChange?.(data);
    setShowStorageSaved(saveStatus === "saved");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trades, comptes, objectifs, reglesPerso, mentorQ, fraisDivers, fiscal, deviseRecue, deviseRef, tauxPerso, chapitres, sessions, templates, storageReady]);

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
      navigateTo("session");
    } else {
      setTrades(prev => [...prev, t]);
      navigateTo("session");
    }
  };

  const handleEditTrade = (trade) => {
    setEditingTrade(trade);
    setSelectedTrade(null);
    navigateTo("nouveau");
  };

  const handleCancelEdit = () => {
    if (editingTrade) {
      setSelectedTrade(editingTrade);
      setEditingTrade(null);
    } else {
      navigateTo("session");
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
    navigateTo("dashboard");
  };

  const handleEditCompte = (compte) => {
    setEditingCompte(compte);
    navigateTo("ajout_compte");
  };

  const handleNewCompte = () => {
    setEditingCompte(null);
    navigateTo("ajout_compte");
  };

  const handleGoToRegles = (firmType) => {
    setReglesPreselect(firmType);
    navigateTo("regles");
  };

  const handleGoToAnalyse = () => {
    navigateTo("analyse");
  };

  const handleCancelCompteEdit = () => {
    setEditingCompte(null);
    navigateTo("dashboard");
  };

  // ── RESET COMPLET ──
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const handleReset = () => {
    setTrades([]);
    setComptes([]);
    setObjectifs(initialObjectifs);
    setReglesPerso([]);
    setMentorQ({ mensuel: 0, moisDebut: new Date().toISOString().slice(0,7), actif: false });
    setFraisDivers([]);
    setFiscal({ pays: "FR", structure: "sasu", taux: 25, actif: false, dateCreation: new Date().toISOString().split("T")[0], acreActif: false });
    setDeviseRecue("USD");
    setDeviseRef("USD");
    setTauxPerso({});
    setChapitres(initialChapitres);
    setSessions({});
    setShowResetConfirm(false);
    setShowExportMenu(false);
  };

  // ── DONNÉES DÉMO ──
  const generateDemoData = ({ count, profile }) => {
    const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const rndInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const rndFloat = (min, max, dec = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(dec));

    const demoComptes = [
      { id: 101, nom: "Apex PA $50K", numero: "APX-101", type: "Apex", typeCompte: "pa", taille: 50000, achat: 207, activation: 0, soldeInitial: 0, joursPayoutInitial: 0, payouts: [{ date: "2026-02-10", montant: 1850, devise: "USD" }, { date: "2026-04-18", montant: 2400, devise: "USD" }] },
      { id: 102, nom: "Apex PA $25K", numero: "APX-102", type: "Apex", typeCompte: "pa", taille: 25000, achat: 137, activation: 0, soldeInitial: 0, joursPayoutInitial: 0, payouts: [{ date: "2026-03-05", montant: 900, devise: "USD" }] },
      { id: 103, nom: "Topstep XFA $50K", numero: "TS-201", type: "Topstep", typeCompte: "xfa", taille: 50000, achat: 165, activation: 130, soldeInitial: 0, joursPayoutInitial: 0, payouts: [{ date: "2026-01-22", montant: 1200, devise: "USD" }, { date: "2026-03-15", montant: 1500, devise: "USD" }] },
      { id: 104, nom: "Topstep XFA $100K", numero: "TS-202", type: "Topstep", typeCompte: "xfa", taille: 100000, achat: 310, activation: 230, soldeInitial: 0, joursPayoutInitial: 0, payouts: [{ date: "2026-05-10", montant: 3100, devise: "USD" }] },
      { id: 105, nom: "Phidias Cash $25K", numero: "PH-301", type: "Phidias", typeCompte: "cash", taille: 25000, achat: 89, activation: 0, soldeInitial: 0, joursPayoutInitial: 0, payouts: [{ date: "2026-02-28", montant: 750, devise: "USD" }] },
      { id: 106, nom: "MyFundedFutures $100K", numero: "MFF-401", type: "MyFundedFutures", typeCompte: "funded", taille: 100000, achat: 330, activation: 0, soldeInitial: 0, joursPayoutInitial: 0, payouts: [{ date: "2026-03-20", montant: 2800, devise: "USD" }] },
      { id: 107, nom: "Tradeify Challenge $50K", numero: "TF-501", type: "Tradeify", typeCompte: "challenge", taille: 50000, achat: 145, activation: 0, soldeInitial: 0, joursPayoutInitial: 0, payouts: [] },
      { id: 108, nom: "Bulenox Funded $25K", numero: "BLX-601", type: "Bulenox", typeCompte: "funded", taille: 25000, achat: 99, activation: 0, soldeInitial: 0, joursPayoutInitial: 0, payouts: [{ date: "2026-04-30", montant: 680, devise: "USD" }] },
    ];

    const compteNoms = demoComptes.map(c => c.nom);
    const setups = ["Breakout", "Pullback", "Reversal", "Range", "Scalp", "Swing"];
    const actifs = ["NQ (Nasdaq)", "ES (S&P 500)", "Gold (GC)", "Crude Oil (CL)", "EUR/USD (6E)", "YM (Dow Jones)"];
    const directions = ["LONG", "SHORT"];
    const emotions = ["Serein", "Confiant", "Stressé", "Anxieux", "Frustré", "Euphorique", "En FOMO", "Impatient", "Neutre"];
    const alimentations = ["Saine", "Saine", "Neutre", "Mauvaise"];
    const reglesViolees = ["Stop trop serré", "Entrée sans confirmation", "Taille trop grande", "Sorti trop tôt", "Revenge trade"];
    const lecons = ["Respecter le plan.", "Ne pas trader en FOMO.", "Attendre la confirmation.", "Couper les pertes vite.", "Laisser courir les gains.", "Journaliser chaque trade."];

    // Profils : gagnant = 70%+ win, perdant = 30%- win, mixte = ~50%
    const pnlByProfile = {
      gagnant:  () => Math.random() < 0.70 ? rndFloat(150, 1200, 0) : rndFloat(-600, -100, 0),
      perdant:  () => Math.random() < 0.30 ? rndFloat(100, 600, 0)  : rndFloat(-1000, -150, 0),
      mixte:    () => Math.random() < 0.52 ? rndFloat(100, 900, 0)  : rndFloat(-700, -100, 0),
    };
    const respectByProfile = {
      gagnant: () => rnd(["Oui","Oui","Oui","Oui","Partiel"]),
      perdant: () => rnd(["Oui","Partiel","Partiel","Non","Non"]),
      mixte:   () => rnd(["Oui","Oui","Partiel","Non"]),
    };

    const getPnl = pnlByProfile[profile] || pnlByProfile.mixte;
    const getRespect = respectByProfile[profile] || respectByProfile.mixte;

    const demoTrades = [];
    const startDate = new Date("2025-01-02");
    for (let i = 0; i < count; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + Math.floor(i * (365 / count)));
      const dateStr = d.toISOString().split("T")[0];
      const pnl = getPnl();
      const rr = pnl > 0 ? rndFloat(0.5, 4, 1) : rndFloat(-2, -0.2, 1);
      const respect = getRespect();
      const emotion = rnd(emotions);
      demoTrades.push({
        id: i + 1, date: dateStr,
        heure: `${rndInt(8,17).toString().padStart(2,"0")}:${rndInt(0,59).toString().padStart(2,"0")}`,
        duree: rndInt(5, 120), compte: rnd(compteNoms), actif: rnd(actifs),
        direction: rnd(directions), setup: rnd(setups), taille: rndInt(1, 5),
        pnl, rr, respect, regle_violee: respect !== "Oui" ? rnd(reglesViolees) : "",
        notes_tech: "", priere: rnd(["Oui","Non"]),
        heure_coucher: `${rndInt(21,23).toString().padStart(2,"0")}:${rndInt(0,59).toString().padStart(2,"0")}`,
        sommeil: rndFloat(5, 9, 1), ecrans: rnd(["Oui","Non"]), qualite_sommeil: rndInt(1,5),
        alimentation: rnd(alimentations), discipline: rndInt(1,5), impulsif: rnd(["Oui","Non","Parfois"]),
        emotion_avant: emotion, emotion_pendant: rnd(emotions), emotion_apres: rnd(emotions),
        lecon: rnd(lecons), note: rndInt(1,5), joursPayoutValide: pnl >= 150,
      });
    }
    setTrades(demoTrades);
    setComptes(demoComptes);
    setShowExportMenu(false);
  };

  const handleLoadDemoData = () => generateDemoData({ count: 120, profile: "mixte" });

  const fileInputRef = useRef(null);
  const handleImportClick = () => fileInputRef.current?.click();
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.trades) setTrades(data.trades);
        if (data.comptes) setComptes(data.comptes);
        if (data.objectifs) setObjectifs(data.objectifs);
        if (data.reglesPerso) setReglesPerso(data.reglesPerso);
        if (data.chapitres) setChapitres(data.chapitres);
        if (data.sessions) setSessions(data.sessions);
        if (data.mentorQ) setMentorQ(data.mentorQ);
        if (data.fraisDivers) setFraisDivers(data.fraisDivers);
        if (data.fiscal) setFiscal(data.fiscal);
        setShowImportSuccess(true);
        setTimeout(() => setShowImportSuccess(false), 3000);
      } catch {
        setShowImportError(true);
        setTimeout(() => setShowImportError(false), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  const handleExportJSON = () => {
    const data = { trades, comptes, objectifs, reglesPerso, chapitres, sessions, mentorQ, fraisDivers, fiscal };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    a.href = url; a.download = `spirit-trading-${dateStr}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleExportCSV = () => {
    if (!trades.length) return;
    const headers = ["id","date","heure","duree","compte","actif","direction","setup","taille","pnl","rr","respect","regle_violee","notes_tech","priere","heure_coucher","sommeil","ecrans","qualite_sommeil","alimentation","discipline","impulsif","emotion_avant","emotion_pendant","emotion_apres","lecon","note"];
    const esc = (v) => { const s = String(v ?? "").replace(/"/g,'""'); return /[",\n;]/.test(s) ? `"${s}"` : s; };
    const csv = [headers.join(";"), ...trades.map(t => headers.map(h => esc(t[h])).join(";"))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `spirit-trades-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const DEFAULT_TABS = [
    { id: "dashboard", icon: "📊", labelKey: "dashboard" },
    { id: "session",   icon: "🌅", labelKey: "session" },
    { id: "analyse",   icon: "🔬", labelKey: "analyse" },
    { id: "roi",       icon: "🏛️", labelKey: "roi" },
    { id: "tarifs",    icon: "💳", labelKey: "tarifs"   },
    { id: "compte",    icon: "👤", labelKey: "compte"   },
  ];
  const [tabOrder, setTabOrder] = useState(() => {
    try {
      const s = localStorage.getItem("spirit_tab_order");
      if (!s) return DEFAULT_TABS.map(t => t.id);
      const saved = JSON.parse(s);
      const missing = DEFAULT_TABS.map(t => t.id).filter(id => !saved.includes(id));
      return [...saved, ...missing];
    } catch { return DEFAULT_TABS.map(t => t.id); }
  });
  const tabs = tabOrder.map(id => DEFAULT_TABS.find(t => t.id === id)).filter(Boolean);
  const dragTab = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const handleDragStart = (e, id) => { dragTab.current = id; setDraggingId(id); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e, id) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOverId(id); };
  const handleDragLeave = () => setDragOverId(null);
  const handleDrop = (targetId) => {
    if (!dragTab.current || dragTab.current === targetId) { setDraggingId(null); setDragOverId(null); return; }
    const newOrder = [...tabOrder];
    const from = newOrder.indexOf(dragTab.current); const to = newOrder.indexOf(targetId);
    newOrder.splice(from, 1); newOrder.splice(to, 0, dragTab.current);
    setTabOrder(newOrder);
    localStorage.setItem("spirit_tab_order", JSON.stringify(newOrder));
    dragTab.current = null; setDraggingId(null); setDragOverId(null);
  };
  const handleDragEnd = () => { setDraggingId(null); setDragOverId(null); };


  const MODULES = [
    { id: "dashboard",  label: fr ? "Dashboard"             : "Dashboard"        },
    { id: "session",    label: fr ? "Session"               : "Session"          },
    { id: "analyse",    label: fr ? "Analyse"               : "Analysis"         },
    { id: "templates",  label: fr ? "Templates"             : "Templates"        },
    { id: "roi",        label: fr ? "Structure & Fiscalité" : "Structure & Tax"  },
    { id: "tarifs",     label: fr ? "Tarifs"                : "Pricing"          },
    { id: "compte",     label: fr ? "Mon compte"            : "My account"       },
  ];

  const isLanding = tab === "landing";

  return (
    <div style={{ minHeight: "100vh", background: "#06060f", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #06060f; }
        ::-webkit-scrollbar-thumb { background: #1a1a2e; border-radius: 4px; }
        .sp-nav-btn { background: none; border: none; color: #4b5563; font-size: 12.5px; font-weight: 500; cursor: pointer; padding: 5px 14px; border-radius: 6px; transition: color .15s; white-space: nowrap; font-family: inherit; letter-spacing: 0.2px; }
        .sp-nav-btn:hover { color: #e5e7eb; }
        .sp-nav-btn.active { color: #fff; font-weight: 700; }
        .sp-cta { background: #00e5a0; color: #06060f; border: none; border-radius: 10px; padding: 10px 22px; font-size: 13px; font-weight: 800; cursor: pointer; transition: all .2s; font-family: inherit; }
        .sp-cta:hover { background: #00ffb3; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,229,160,0.3); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .grad-text { background: linear-gradient(135deg,#00e5a0,#818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .sp-desktop-only { display: flex; }
        .sp-mobile-only { display: none; }
        .sp-bottom-nav { display: none; }
        @media (max-width: 768px) {
          .sp-desktop-only { display: none !important; }
          .sp-mobile-only { display: flex !important; }
          .sp-bottom-nav { display: flex !important; position: fixed; bottom: 0; left: 0; right: 0; z-index: 300; background: rgba(6,6,15,0.97); backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,0.07); padding: 6px 0 env(safe-area-inset-bottom, 6px); justify-content: space-around; align-items: center; }
          .sp-bottom-nav-btn { display: flex; flex-direction: column; align-items: center; gap: 3px; background: none; border: none; cursor: pointer; padding: 4px 8px; min-width: 52px; font-family: inherit; }
          .sp-bottom-nav-btn span.icon { font-size: 20px; line-height: 1; }
          .sp-bottom-nav-btn span.label { font-size: 9px; font-weight: 600; color: #4b5563; letter-spacing: 0.3px; }
          .sp-bottom-nav-btn.active span.label { color: #00e5a0; }
          .sp-bottom-nav-btn.active span.icon { filter: drop-shadow(0 0 6px #00e5a080); }
          .sp-mobile-nav { padding: 0 16px !important; }
          .sp-content { padding: 20px 16px 90px !important; }
        }
      `}</style>

      {/* ══ BANNIÈRE APERÇU ══ */}
      {isPreview && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 400, background: "linear-gradient(90deg,#818cf8,#00e5a0)", padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#06060f" }}>👁 Mode aperçu — Tes données ne sont pas sauvegardées</span>
          <button onClick={() => setShowPaywallModal(true)} style={{ background: "#06060f", color: "#00e5a0", border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>
            S'abonner →
          </button>
        </div>
      )}

      {/* ══ NAVBAR UNIFIÉE ══ */}
      <nav className="sp-mobile-nav" style={{ position: "fixed", top: isPreview ? 36 : 0, left: 0, right: 0, zIndex: 300, height: 60, display: "flex", alignItems: "center", padding: "0 32px", gap: 0, background: "rgba(6,6,15,0.92)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Logo */}
        <button onClick={() => navigateTo("landing")} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 28px 0 0", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/logo.png" alt="Spirit Trading" style={{ height: 36, width: 36, objectFit: "cover", borderRadius: "50%" }} />
          <span style={{ fontSize: 19, fontWeight: 900, letterSpacing: -1, color: "#fff" }}>spirit</span>
          <span style={{ fontSize: 19, fontWeight: 900, letterSpacing: -1, color: "#00e5a0" }}>.</span>
          <span style={{ fontSize: 19, fontWeight: 900, letterSpacing: -1, color: "#fff" }}>trading</span>
        </button>

        <div className="sp-desktop-only" style={{ width: 1, height: 22, background: "rgba(255,255,255,0.08)", marginRight: 20 }} />

        {/* Modules nav — centré (desktop uniquement) */}
        <div className="sp-desktop-only" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 0 }}>
          {MODULES.map(m => (
            <button key={m.id} className={`sp-nav-btn${tab === m.id ? " active" : ""}`} onClick={() => { navigateTo(m.id); setSelectedCompte(null); setSelectedTrade(null); }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Actions droite */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, position: "relative", marginLeft: "auto" }}>
          {isOwner && <>
            <button className="sp-desktop-only" onClick={() => setShowExportMenu(s => !s)} style={{ background: showExportMenu ? "rgba(0,229,160,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${showExportMenu ? "#00e5a040" : "rgba(255,255,255,0.08)"}`, color: showExportMenu ? "#00e5a0" : "#666", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
              💾 {fr ? "Données" : "Data"}
            </button>
            <button className="sp-desktop-only" onClick={toggleLang} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer", color: "#888", fontFamily: "inherit" }}>
              {lang === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
            </button>
          </>}
          {user && (() => {
            const [showProfileMenu, setShowProfileMenu] = useState(false);
            return (
              <div style={{ position: "relative" }}>
                <button onClick={() => setShowProfileMenu(v => !v)} title={user.email}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 8px", cursor: "pointer", color: "#666", fontSize: 12, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                  {user.photoURL ? <img src={user.photoURL} alt="" style={{ width: 22, height: 22, borderRadius: "50%" }} /> : <span style={{ fontSize: 18 }}>👤</span>}
                  <span style={{ fontSize: 10, color: "#555" }}>▾</span>
                </button>
                {showProfileMenu && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#0e0e1a", border: "1px solid #1a1a2e", borderRadius: 12, padding: 8, minWidth: 200, zIndex: 500, boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}
                    onMouseLeave={() => setShowProfileMenu(false)}>
                    <div style={{ fontSize: 11, color: "#555", padding: "4px 12px 8px", borderBottom: "1px solid #1a1a2e", marginBottom: 4 }}>{user.email}</div>
                    {[
                      { icon: "👤", label: fr ? "Mon compte" : "My account", action: () => { navigateTo("compte"); setShowProfileMenu(false); } },
                      { icon: "📜", label: fr ? "Mes règles" : "My rules", action: () => { navigateTo("regles"); setShowProfileMenu(false); } },
                      { icon: "🎯", label: fr ? "Mes objectifs" : "My goals", action: () => { navigateTo("objectifs"); setShowProfileMenu(false); } },
                    ].map(item => (
                      <button key={item.label} onClick={item.action} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", color: "#e5e7eb", fontSize: 13, padding: "8px 12px", cursor: "pointer", borderRadius: 8, textAlign: "left", fontFamily: "inherit" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#1a1a2e"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        {item.icon} {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop: "1px solid #1a1a2e", marginTop: 4, paddingTop: 4 }}>
                      <button onClick={() => { setShowProfileMenu(false); onLogout(); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", color: "#ef4444", fontSize: 13, padding: "8px 12px", cursor: "pointer", borderRadius: 8, textAlign: "left", fontFamily: "inherit" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#1a1a2e"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        🚪 {fr ? "Déconnexion" : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Menu données */}
          {showExportMenu && (
            <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, background: "#0e0e1a", border: "1px solid #1a1a2e", borderRadius: 12, padding: 8, minWidth: 230, zIndex: 400, boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}>
              <div style={{ fontSize: 9, color: "#374151", textTransform: "uppercase", letterSpacing: 2, padding: "4px 10px 8px", fontWeight: 700 }}>{fr ? "Gérer les données" : "Manage data"}</div>
              <div style={{ fontSize: 9, color: "#374151", textTransform: "uppercase", letterSpacing: 2, padding: "2px 10px 6px", fontWeight: 700 }}>Données démo</div>
              {[
                { label: "🏆 Gagnant · 500 trades", count: 500, profile: "gagnant", color: "#00e5a0" },
                { label: "🏆 Gagnant · 120 trades", count: 120, profile: "gagnant", color: "#00e5a0" },
                { label: "⚖️ Mixte · 120 trades",   count: 120, profile: "mixte",   color: "#818cf8" },
                { label: "⚖️ Mixte · 10 trades",    count: 10,  profile: "mixte",   color: "#818cf8" },
                { label: "📉 Perdant · 120 trades", count: 120, profile: "perdant", color: "#ef4444" },
              ].map((p, i) => (
                <button key={i} onClick={() => generateDemoData({ count: p.count, profile: p.profile })}
                  style={{ width: "100%", textAlign: "left", background: `${p.color}10`, border: "none", color: p.color, padding: "8px 10px", fontSize: 11, cursor: "pointer", borderRadius: 7, display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontFamily: "inherit", marginBottom: 2 }}>
                  {p.label}
                </button>
              ))}
              <div style={{ height: 1, background: "#1a1a2e", margin: "6px 0" }} />
              <button onClick={() => { handleExportJSON(); setShowExportMenu(false); }} style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: "#ccc", padding: "9px 10px", fontSize: 12, cursor: "pointer", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>📤 {fr ? "Exporter JSON" : "Export JSON"}</button>
              <button onClick={() => { handleExportCSV(); setShowExportMenu(false); }} style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: "#ccc", padding: "9px 10px", fontSize: 12, cursor: "pointer", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>📊 {fr ? "Exporter CSV" : "Export CSV"}</button>
              <button onClick={() => { handleImportClick(); setShowExportMenu(false); }} style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: "#00e5a0", padding: "9px 10px", fontSize: 12, cursor: "pointer", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>📥 {fr ? "Importer JSON" : "Import JSON"}</button>
              <div style={{ height: 1, background: "#1a1a2e", margin: "6px 0" }} />
              <button onClick={() => { setShowResetConfirm(true); setShowExportMenu(false); }} style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: "#ef4444", padding: "9px 10px", fontSize: 12, cursor: "pointer", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>🗑️ {fr ? "Remettre à zéro" : "Reset all data"}</button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} style={{ display: "none" }} />
        </div>
      </nav>

      {/* ══ CONTENU ══ */}
      <div style={{ paddingTop: isPreview ? 96 : 60 }}>

        {/* ── HERO (landing) ── */}
        {isLanding && (
          <LandingPage
            onEnter={() => navigateTo("dashboard")}
            onCheckout={async (plan) => {
              try {
                const token = user?.getIdToken ? await user.getIdToken() : null;
                const res = await fetch("/api/create-checkout", { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { "Authorization": `Bearer ${token}` } : {}) }, body: JSON.stringify({ plan }) });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              } catch {}
            }}
            lang={lang}
            embedded={true}
          />
        )}

        {/* ── MODULES ── */}
        {!isLanding && (
          <div className="sp-content" style={{ maxWidth: 1300, margin: "0 auto", padding: "36px 32px" }}>

            {/* Breadcrumb */}
            <div style={{ fontSize: 11, color: "#374151", marginBottom: 28, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setTab("landing")} style={{ background: "none", border: "none", color: "#374151", cursor: "pointer", fontSize: 11, fontFamily: "inherit", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: 0 }}>spirit.</button>
              <span style={{ color: "#1a1a2e" }}>›</span>
              <span style={{ color: "#00e5a0", textTransform: "none", fontSize: 11 }}>{MODULES.find(m => m.id === tab)?.label || tab}</span>
            </div>

            {/* Module content */}
            {selectedTrade
              ? <DetailTrade trade={selectedTrade} onBack={() => setSelectedTrade(null)} onEdit={handleEditTrade} lang={lang} />
              : selectedCompte && tab === "dashboard"
              ? <DetailCompte compte={selectedCompte} trades={trades} onBack={() => setSelectedCompte(null)} onEdit={() => { setSelectedCompte(null); handleEditCompte(selectedCompte); }} lang={lang}
                  onBlowAccount={(compteId) => {
                    setComptes(cs => cs.map(c => c.id === compteId ? { ...c, blown: true, blownAt: new Date().toISOString().split("T")[0] } : c));
                    setSelectedCompte(null);
                  }}
                  onValidateEval={(compteSource, nextType) => {
                    const newCompte = {
                      id: Date.now(),
                      nom: `${compteSource.type} ${nextType.label} $${(compteSource.taille / 1000).toFixed(0)}K`,
                      numero: "",
                      type: compteSource.type,
                      typeCompte: nextType.id,
                      taille: compteSource.taille,
                      achat: 0,
                      activation: 0,
                      soldeInitial: 0,
                      joursPayoutInitial: 0,
                      payouts: [],
                      isNew: true,
                    };
                    setComptes(cs => [...cs, newCompte]);
                    setSelectedCompte(null);
                  }}
                />
              : tab === "dashboard"  ? <Dashboard trades={trades} comptes={comptes} sessions={sessions} onEditCompte={handleEditCompte} onNewCompte={handleNewCompte} onNewTrade={() => { setNewTradeDefaultDate(new Date().toISOString().split("T")[0]); setShowTradeDateModal(true); }} onNewSession={() => { navigateTo("session"); setSessionSubView("preparation"); }} onGoToAnalyse={handleGoToAnalyse} onTradeDetail={setSelectedTrade} onViewCompte={setSelectedCompte} onDayOpen={(date) => { setSessionDayDate(date); setSessionSubView("dayDetail"); navigateTo("session"); }} lang={lang} user={user} />
              : tab === "session"    ? (
                sessionSubView === "preparation"
                  ? (
                    <div>
                      <button onClick={() => setSessionSubView("calendar")} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "1px solid #1a1a2e", color: "#6b7280", borderRadius: 8, padding: "7px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "inherit", marginBottom: 24, transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#e5e7eb"; e.currentTarget.style.borderColor = "#374151"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "#1a1a2e"; }}>
                        ← {fr ? "Retour au calendrier" : "Back to calendar"}
                      </button>
                      <SessionDuJour sessions={sessions} setSessions={setSessions} lang={lang} user={user} />
                    </div>
                  )
                  : sessionSubView === "dayDetail" && sessionDayDate
                  ? <DayDetail date={sessionDayDate} trades={trades} sessions={sessions} onBack={() => setSessionSubView("calendar")} onTradeDetail={setSelectedTrade} onNewTrade={() => navigateTo("nouveau")} lang={lang} />
                  : (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#00e5a0", letterSpacing: 3, textTransform: "uppercase" }}>{fr ? "Mes sessions" : "My sessions"}</div>
                        <div style={{ display: "flex", gap: 10 }}>
                          <button onClick={() => { setNewTradeDefaultDate(new Date().toISOString().split("T")[0]); setShowTradeDateModal(true); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#818cf815,#818cf808)", border: "1px solid #818cf830", color: "#818cf8", borderRadius: 10, padding: "10px 20px", fontSize: 13, cursor: "pointer", fontWeight: 700, fontFamily: "inherit", transition: "all 0.15s", letterSpacing: 0.3 }}
                            onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#818cf825,#818cf815)"; e.currentTarget.style.borderColor = "#818cf860"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#818cf815,#818cf808)"; e.currentTarget.style.borderColor = "#818cf830"; }}>
                            ➕ {fr ? "Nouveau trade" : "New trade"}
                          </button>
                          <button data-tutorial="new-session" onClick={() => setSessionSubView("preparation")} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#00e5a015,#818cf808)", border: "1px solid #00e5a030", color: "#00e5a0", borderRadius: 10, padding: "10px 20px", fontSize: 13, cursor: "pointer", fontWeight: 700, fontFamily: "inherit", transition: "all 0.15s", letterSpacing: 0.3 }}
                            onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#00e5a025,#818cf815)"; e.currentTarget.style.borderColor = "#00e5a060"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#00e5a015,#818cf808)"; e.currentTarget.style.borderColor = "#00e5a030"; }}>
                            🌅 {fr ? "Nouvelle session de trading" : "New trading session"}
                          </button>
                        </div>
                      </div>
                      <UnifiedCalendar trades={trades} sessions={sessions} user={user} onDayOpen={(date) => { setSessionDayDate(date); setSessionSubView("dayDetail"); }} lang={lang} />
                    </div>
                  )
              )
              : tab === "templates"  ? <TemplatesPage templates={templates} setTemplates={setTemplates} lang={lang} />
              : tab === "analyse"    ? <AnalysePage trades={trades} comptes={comptes} onDetail={(t) => setSelectedTrade(t)} lang={lang} user={user} />
              : tab === "nouveau"    ? <NouveauTrade onSave={handleSaveTrade} onCancel={handleCancelEdit} comptes={comptes} editTrade={editingTrade} defaultDate={newTradeDefaultDate} templates={templates} onSaveTemplate={(tpl) => setTemplates(prev => prev.map(t => t.id === tpl.id ? tpl : t))} lang={lang} />
              : tab === "ajout_compte" ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ background: "#0a0a14", border: "1px solid #1a1a2e", borderRadius: 20, position: "relative", overflow: "hidden", width: 1040 }}>
                    <button onClick={handleCancelCompteEdit} style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 8, background: "#1a1a2e", border: "1px solid #2a2a3e", color: "#666", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, transition: "all 0.15s", lineHeight: 1 }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#2a2a3e"; e.currentTarget.style.color = "#ccc"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#1a1a2e"; e.currentTarget.style.color = "#666"; }}>✕</button>
                    <AjoutCompte onSave={handleAddCompte} onCancel={handleCancelCompteEdit} editCompte={editingCompte} onGoToRegles={handleGoToRegles} lang={lang} />
                  </div>
                </div>
              )
              : tab === "regles"     ? <Regles comptes={comptes} preselectedFirm={reglesPreselect} reglesPerso={reglesPerso} setReglesPerso={setReglesPerso} lang={lang} />
              : tab === "objectifs"  ? <Objectifs trades={trades} comptes={comptes} objectifs={objectifs} setObjectifs={setObjectifs} lang={lang} />
              : tab === "chemin"     ? <LeChemin chapitres={chapitres} setChapitres={setChapitres} lang={lang} />
              : tab === "tarifs"     ? <Tarifs lang={lang} user={user} />
              : tab === "compte"     ? <MonCompte user={user} subscription={subscription} onLogout={onLogout} lang={lang} />
              : <ROI comptes={comptes} setComptes={setComptes} trades={trades} onEditCompte={handleEditCompte} mentorQ={mentorQ} setMentorQ={setMentorQ} fraisDivers={fraisDivers} setFraisDivers={setFraisDivers} fiscal={fiscal} setFiscal={setFiscal} deviseRecue={deviseRecue} setDeviseRecue={setDeviseRecue} deviseRef={deviseRef} setDeviseRef={setDeviseRef} tauxPerso={tauxPerso} setTauxPerso={setTauxPerso} lang={lang} />
            }
          </div>
        )}
      </div>

      {showTradeDateModal && (() => {
        const pickerDate = newTradeDefaultDate ? new Date(newTradeDefaultDate + "T12:00:00") : new Date();
        const [pickerYear, pickerMonth] = [pickerDate.getFullYear(), pickerDate.getMonth()];
        const firstDay = new Date(pickerYear, pickerMonth, 1).getDay();
        const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
        const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
        const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
        const dayNames = ["L","M","M","J","V","S","D"];
        const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
        const changeMonth = (delta) => {
          const d = new Date(pickerYear, pickerMonth + delta, 1);
          const cur = newTradeDefaultDate ? parseInt(newTradeDefaultDate.split("-")[2]) : 1;
          const maxD = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
          const day = Math.min(cur, maxD);
          setNewTradeDefaultDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`);
        };
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#0a0a14", border: "1px solid #818cf840", borderRadius: 20, padding: "32px 28px", maxWidth: 360, width: "100%" }}>
              <div style={{ fontSize: 19, fontWeight: 900, color: "#fff", marginBottom: 4 }}>➕ {fr ? "Nouveau trade" : "New trade"}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 22 }}>{fr ? "Sélectionne le jour du trade" : "Select the trade date"}</div>

              {/* Saisie manuelle */}
              <label style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.2, display: "block", marginBottom: 6 }}>{fr ? "Saisie manuelle" : "Manual input"}</label>
              <input type="date" value={newTradeDefaultDate || ""} onChange={e => setNewTradeDefaultDate(e.target.value)}
                style={{ background: "#0e0e1a", border: "1px solid #2a2a3e", color: "#fff", borderRadius: 8, padding: "9px 12px", fontSize: 13, width: "100%", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 20, colorScheme: "dark" }} />

              {/* Mini calendrier */}
              <div style={{ background: "#0e0e1a", border: "1px solid #1a1a2e", borderRadius: 12, padding: "14px 12px" }}>
                {/* Header mois */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <button onClick={() => changeMonth(-1)} style={{ background: "none", border: "none", color: "#818cf8", fontSize: 16, cursor: "pointer", padding: "2px 6px", borderRadius: 6, lineHeight: 1 }}>‹</button>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{monthNames[pickerMonth]} {pickerYear}</span>
                  <button onClick={() => changeMonth(1)} style={{ background: "none", border: "none", color: "#818cf8", fontSize: 16, cursor: "pointer", padding: "2px 6px", borderRadius: 6, lineHeight: 1 }}>›</button>
                </div>
                {/* Jours de semaine */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
                  {dayNames.map((d, i) => (
                    <div key={i} style={{ textAlign: "center", fontSize: 10, color: "#4b5563", fontWeight: 700, padding: "2px 0" }}>{d}</div>
                  ))}
                </div>
                {/* Grille de jours */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                  {Array.from({ length: totalCells }, (_, i) => {
                    const dayNum = i - startOffset + 1;
                    const valid = dayNum >= 1 && dayNum <= daysInMonth;
                    const dateStr = valid ? `${pickerYear}-${String(pickerMonth+1).padStart(2,"0")}-${String(dayNum).padStart(2,"0")}` : null;
                    const isSelected = dateStr === newTradeDefaultDate;
                    const isToday = dateStr === new Date().toISOString().split("T")[0];
                    return (
                      <button key={i} onClick={() => valid && setNewTradeDefaultDate(dateStr)} disabled={!valid}
                        style={{ background: isSelected ? "#818cf8" : isToday ? "#818cf820" : "none", border: isToday && !isSelected ? "1px solid #818cf840" : "none", color: isSelected ? "#fff" : valid ? "#d1d5db" : "transparent", borderRadius: 6, padding: "5px 0", fontSize: 12, fontWeight: isSelected ? 700 : 400, cursor: valid ? "pointer" : "default", textAlign: "center", transition: "background 0.1s" }}>
                        {valid ? dayNum : ""}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={() => setShowTradeDateModal(false)} style={{ flex: 1, background: "none", border: "1px solid #1a1a2e", color: "#6b7280", borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {fr ? "Annuler" : "Cancel"}
                </button>
                <button onClick={() => { setShowTradeDateModal(false); setEditingTrade(null); navigateTo("nouveau"); }} disabled={!newTradeDefaultDate}
                  style={{ flex: 2, background: "#818cf8", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", opacity: newTradeDefaultDate ? 1 : 0.4 }}>
                  {fr ? "Continuer →" : "Continue →"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Notifications */}
      {/* Tutorial */}
      {/* ══ BOTTOM NAV MOBILE ══ */}
      {!isLanding && (
        <nav className="sp-bottom-nav">
          {[
            { id: "dashboard", icon: "📊", label: "Dashboard" },
            { id: "session",   icon: "🌅", label: "Session" },
            { id: "nouveau",    icon: "➕", label: fr ? "Trade" : "Trade" },
            { id: "templates",  icon: "📋", label: "Templates" },
            { id: "analyse",    icon: "🔬", label: fr ? "Analyse" : "Analysis" },
            { id: "compte",     icon: "👤", label: fr ? "Compte" : "Account" },
          ].map(item => (
            <button key={item.id} className={`sp-bottom-nav-btn${tab === item.id ? " active" : ""}`}
              onClick={() => { navigateTo(item.id); setSelectedCompte(null); setSelectedTrade(null); }}>
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      {tutorialActive && !isLanding && (
        <TutorialOverlay
          step={tutorialStep}
          lang={lang}
          onNext={nextTutorialStep}
          onSkip={closeTutorial}
          onNavigate={(tabId) => { navigateTo(tabId); if (tabId === "session") setSessionSubView("calendar"); }}
        />
      )}

      {/* ══ MODAL PAYWALL (mode aperçu) ══ */}
      {showPaywallModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0a0a14", border: "1px solid #1a1a2e", borderRadius: 20, padding: "40px 36px", maxWidth: 420, width: "100%", textAlign: "center", position: "relative" }}>
            <button onClick={() => setShowPaywallModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#6b7280", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.5, marginBottom: 10 }}>Fonctionnalité réservée aux abonnés</h2>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, marginBottom: 28 }}>Tu es en mode aperçu. Abonne-toi pour sauvegarder tes trades, tes sessions et accéder à toutes les fonctionnalités.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#0e0e1a", border: "1px solid #00e5a030", borderRadius: 12, padding: "16px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#00e5a0", letterSpacing: 2, marginBottom: 8 }}>MENSUEL</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>7,99€<span style={{ fontSize: 11, color: "#6b7280", fontWeight: 400 }}>/mois</span></div>
                <button onClick={() => onCheckout && onCheckout("monthly")} disabled={checkoutLoading} style={{ width: "100%", marginTop: 12, background: "#00e5a015", border: "1px solid #00e5a040", color: "#00e5a0", borderRadius: 8, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {checkoutLoading ? "..." : "Commencer →"}
                </button>
              </div>
              <div style={{ background: "#0e0e1a", border: "1px solid #818cf830", borderRadius: 12, padding: "16px 12px", textAlign: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#818cf8", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>🔥 2 mois offerts</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#818cf8", letterSpacing: 2, marginBottom: 8 }}>ANNUEL</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>79,99€<span style={{ fontSize: 11, color: "#6b7280", fontWeight: 400 }}>/an</span></div>
                <button onClick={() => onCheckout && onCheckout("annual")} disabled={checkoutLoading} style={{ width: "100%", marginTop: 12, background: "#818cf815", border: "1px solid #818cf840", color: "#818cf8", borderRadius: 8, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {checkoutLoading ? "..." : "Commencer →"}
                </button>
              </div>
            </div>
            {checkoutError && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 12 }}>{checkoutError}</div>}
            <p style={{ fontSize: 11, color: "#374151" }}>✓ Accès immédiat · ✓ Annulation à tout moment · ✓ Données privées</p>
          </div>
        </div>
      )}

      {showImportSuccess && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#0e0e1a", border: "1px solid #00e5a040", borderRadius: 12, padding: "12px 20px", fontSize: 13, color: "#00e5a0", fontWeight: 700, zIndex: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>✓ {fr ? "Données importées !" : "Data imported!"}</div>}
      {showImportError && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#0e0e1a", border: "1px solid #ef444440", borderRadius: 12, padding: "12px 20px", fontSize: 13, color: "#ef4444", fontWeight: 700, zIndex: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>✕ {fr ? "Erreur d'import" : "Import error"}</div>}

      {/* Modal reset */}
      {showResetConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#0e0e1a", border: "1px solid #ef444430", borderRadius: 20, padding: "40px 36px", maxWidth: 380, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>⚠️</div>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>{fr ? "Remettre à zéro ?" : "Reset all data?"}</div>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 28, lineHeight: 1.6 }}>{fr ? "Tous tes trades, comptes et paramètres seront effacés. Action irréversible." : "All your trades, accounts and settings will be deleted. Irreversible."}</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setShowResetConfirm(false)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #1a1a2e", color: "#ccc", borderRadius: 10, padding: "11px 22px", fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>{fr ? "Annuler" : "Cancel"}</button>
              <button onClick={handleReset} style={{ background: "#ef4444", border: "none", color: "#fff", borderRadius: 10, padding: "11px 22px", fontSize: 13, cursor: "pointer", fontWeight: 800, fontFamily: "inherit" }}>{fr ? "Tout effacer" : "Delete all"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}