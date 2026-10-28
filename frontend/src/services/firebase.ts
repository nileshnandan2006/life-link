import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  sendPasswordResetEmail, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration loaded securely from environment variables
// NEVER commit API keys or .env files directly to version control
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "series-942f9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "series-942f9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "series-942f9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "459831912379",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:459831912379:web:13a11ec7d8ff8a6bf0869e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YTVT2G7XZQ"
};

// Initialize Firebase safely (avoid duplicate app initialization)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics if supported in the browser environment
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported in this environment
  });
}

/**
 * Clean human-readable Firebase error message parser
 */
export function formatFirebaseError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/user-not-found':
      return 'No registered account found with this email.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please verify and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Console. Please enable Email/Password provider in your Firebase project Authentication > Sign-in method tab.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to multiple failed attempts. Please try again later or reset password.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
}

/**
 * Register user with Email and Password
 */
export async function registerWithFirebase(name: string, email: string, pass: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  if (userCredential.user) {
    await updateProfile(userCredential.user, {
      displayName: name
    });
  }
  return userCredential.user;
}

/**
 * Sign in with Email and Password
 */
export async function loginWithFirebase(email: string, pass: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogleFirebase() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Reset Password email
 */
export async function resetFirebasePassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

/**
 * Sign out of Firebase
 */
export async function logoutFromFirebase() {
  return await fbSignOut(auth);
}

/**
 * Auth state change subscriber
 */
export function onFirebaseAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
