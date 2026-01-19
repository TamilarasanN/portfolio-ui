// Firebase configuration and initialization
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAt2TUuB-xGJ1M5x9wjukMyiagL5PPtlB0",
  authDomain: "tamilarasan-portfolio-303e7.firebaseapp.com",
  projectId: "tamilarasan-portfolio-303e7",
  storageBucket: "tamilarasan-portfolio-303e7.firebasestorage.app",
  messagingSenderId: "470853366582",
  appId: "1:470853366582:web:02349013858413e8bcf997",
  measurementId: "G-GFDZ43JHMW"
};

// Initialize Firebase (avoid multiple initializations)
let app: FirebaseApp;
if (typeof window !== "undefined" && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else if (typeof window !== "undefined") {
  app = getApps()[0];
} else {
  // For SSR, create a minimal app instance
  app = initializeApp(firebaseConfig);
}

// Initialize Analytics (client-side only)
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  // Check if analytics is supported in this environment
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
