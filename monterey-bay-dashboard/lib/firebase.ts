/**
 * Firebase Configuration
 * 
 * Initializes Firebase app and analytics for the Monterey Bay Dashboard
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCIgZj9sGTVlG9_4Lsu9rI7gZVMumsQrto",
  authDomain: "montereydashboard.firebaseapp.com",
  projectId: "montereydashboard",
  storageBucket: "montereydashboard.firebasestorage.app",
  messagingSenderId: "880796508508",
  appId: "1:880796508508:web:06fcd38b698a2a5d29e199",
  measurementId: "G-83V49J0P14"
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
