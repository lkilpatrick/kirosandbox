/**
 * Firebase Configuration
 * 
 * Initializes Firebase app and analytics for the Monterey Bay Dashboard
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCIgZj9sGTVlG9_4Lsu9rI7gZVMumsQrto",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "montereydashboard.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "montereydashboard",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "montereydashboard.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "880796508508",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:880796508508:web:06fcd38b698a2a5d29e199",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-83V49J0P14"
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | null = null;

// Only initialize if not already initialized
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Analytics only in browser and if supported
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
