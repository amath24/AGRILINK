/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  getFirestore 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import appletConfig from '../../firebase-applet-config.json';

// Configuration priority: runtime injected applet config -> env variables -> defaults
const firebaseConfig = {
  apiKey: appletConfig?.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: appletConfig?.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: appletConfig?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: appletConfig?.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: appletConfig?.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: appletConfig?.appId || import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Target firestore database ID (named database if configured in AI Studio)
const firestoreDatabaseId = 
  appletConfig?.firestoreDatabaseId || 
  import.meta.env.VITE_FIREBASE_DATABASE_ID || 
  '(default)';

// Initialize Firebase App instance
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Cloud Firestore with offline persistence support
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  }, firestoreDatabaseId !== '(default)' ? firestoreDatabaseId : undefined);
} catch {
  firestoreInstance = getFirestore(app, firestoreDatabaseId !== '(default)' ? firestoreDatabaseId : undefined);
}

export const db = firestoreInstance;

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;
