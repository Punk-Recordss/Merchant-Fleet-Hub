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

if (process.env.NODE_ENV === 'development') {
  console.log("👻 [CLIENT] Connecting to FIREBASE EMULATOR (Dev Mode)");
  
  // Only connect if not already connected (to prevent errors on HMR)
  // But wait, connectAuthEmulator throws if already initialized? 
  // It's usually safe to call once. With HMR, check `auth.emulatorConfig`.
  // @ts-ignore: Internal property check
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, "http://localhost:9099");
  }
  
  // @ts-ignore: Internal property check
  if (!db._settingsFrozen) { // db.toJSON().host might work? No, internal check is safer or try/catch
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
      } catch (e) {
        // Ignore if already connected
      }
  }
}

export { app, auth, db };
