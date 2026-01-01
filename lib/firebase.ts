import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpe9tdg1ZVIUHvC0jgN2MgkiP-gozWEcc",
  authDomain: "thousand-hours-1.firebaseapp.com",
  projectId: "thousand-hours-1",
  storageBucket: "thousand-hours-1.firebasestorage.app",
  messagingSenderId: "789030864548",
  appId: "1:789030864548:web:39f3bb9ad4b403f9538831",
  measurementId: "G-VSX0FY8EWY"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();