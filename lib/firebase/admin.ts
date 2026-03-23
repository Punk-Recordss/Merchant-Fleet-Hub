import 'server-only';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

/**
 * FIREBASE ADMIN INITIALIZATION
 * This is the heart of the fleet's identity system.
 */

if (!getApps().length) {
  const isDev = process.env.NODE_ENV === 'development';
  console.log(`[IDENTITY]: Checking Environment... NODE_ENV=${process.env.NODE_ENV}`);

  if (isDev) {
    // --- DEV MODE (EMULATOR) ---
    console.log("[IDENTITY]: 👻 Connecting to FIREBASE EMULATOR (Dev Mode)");
    initializeApp({
      projectId: "punk-records-dev-local",
      // No credential needed; SDK will use FIREBASE_AUTH_EMULATOR_HOST
    });
  } else {
    // --- PROD MODE (REAL FLEET) ---
    try {
      const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
      
      if (fs.existsSync(serviceAccountPath)) {
        const rawContent = fs.readFileSync(serviceAccountPath, 'utf8');
        const cleanContent = rawContent.trim();
        const serviceAccount = JSON.parse(cleanContent);
        
        initializeApp({
          credential: cert(serviceAccount),
        });
        console.log("[IDENTITY]: 🛡️ Firebase Admin SDK initialized (Production Mode)");
      } else {
        console.error("[IDENTITY]: CRITICAL - service-account.json is missing!");
      }
    } catch (error) {
      console.error("[IDENTITY]: FAILED TO INITIALIZE ADMIN SDK:", error);
    }
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore(); // In case Hub needs direct DB access later
