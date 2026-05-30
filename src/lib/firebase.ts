import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBcwWA49kHyMHKhO6ltEf8-6qq1yWuANJs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "streetlight-monitor-d8f2b.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://streetlight-monitor-d8f2b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "streetlight-monitor-d8f2b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "streetlight-monitor-d8f2b.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "425228443240",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:425228443240:web:417fc57c4fa05d544965dd"
};

// Prevent duplicate initialization in Next.js hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
export const fs = getFirestore(app);
