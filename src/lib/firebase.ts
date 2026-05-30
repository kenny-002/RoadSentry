import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBcwWA49kHyMHKhO6ltEf8-6qq1yWuANJs",
  authDomain: "streetlight-monitor-d8f2b.firebaseapp.com",
  databaseURL: "https://streetlight-monitor-d8f2b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "streetlight-monitor-d8f2b",
  storageBucket: "streetlight-monitor-d8f2b.firebasestorage.app",
  messagingSenderId: "425228443240",
  appId: "1:425228443240:web:417fc57c4fa05d544965dd"
};

// Prevent duplicate initialization in Next.js hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
export const fs = getFirestore(app);
