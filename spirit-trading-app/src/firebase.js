import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, indexedDBLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Remplace ces valeurs par ta config Firebase (console.firebase.google.com)
const firebaseConfig = {
  apiKey: "AIzaSyBIg3GYXCiNyKmm5Pb1x3tLFJm16GdpMv0",
  authDomain: "spirit-trading.firebaseapp.com",
  projectId: "spirit-trading",
  storageBucket: "spirit-trading.firebasestorage.app",
  messagingSenderId: "243343061617",
  appId: "1:243343061617:web:ad0b7673963506991321d0",
  measurementId: "G-5Q9HH9ZJ84",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, indexedDBLocalPersistence).catch(() => {});
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
