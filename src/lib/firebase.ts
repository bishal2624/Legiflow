
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "legiflow-e5cce.firebaseapp.com",
  projectId: "legiflow-e5cce",
  storageBucket: "legiflow-e5cce.firebasestorage.app",
  messagingSenderId: "18473645306",
  appId: "1:18473645306:web:3e7058d312148d9de5c543",
  measurementId: "G-YP4KSB9ZRQ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Only initialize Analytics on the client-side
let analytics: any = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };
