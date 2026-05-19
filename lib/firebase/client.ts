import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACWflbfp86ArFVBU8gVBruBvds640cjJc",
  authDomain: "punk-records-fleet.firebaseapp.com",
  projectId: "punk-records-fleet",
  storageBucket: "punk-records-fleet.firebasestorage.app",
  messagingSenderId: "461220448925",
  appId: "1:461220448925:web:67fa9f93db7fd952c56274",
  measurementId: "G-XB8H20CYR2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  try {
    console.log("👻 [CLIENT] Connecting to FIREBASE EMULATOR (Dev Mode)");

    // @ts-ignore: Internal property check
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, "http://localhost:9099");
      console.log("✅ Auth emulator connected");
    }

    // @ts-ignore: Internal property check
    if (!db._settingsFrozen) {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log("✅ Firestore emulator connected");
      } catch (e) {
        console.warn("⚠️ Firestore emulator already connected");
      }
    }
  } catch (e) {
    console.error("❌ Failed to connect to emulators:", e);
  }
} else {
  console.log("🚀 [CLIENT] Using PRODUCTION Firebase");
}

export { app, auth, db };
