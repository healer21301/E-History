/* ============================================================
   E-HISTORY — FIREBASE CONFIGURATION
   ============================================================
   HOW TO USE
   1. Open Firebase Console.
   2. Project Settings → Your apps → Web app.
   3. Copy the firebaseConfig object.
   4. Replace ONLY the placeholder values below.

   IMPORTANT
   - Firebase web configuration is not a password or server secret.
   - Security must come from Firebase Authentication and Firestore Rules.
   - Do not place service-account private keys in this website.
   ============================================================ */

export const firebaseConfig = {
    apiKey: "AIzaSyDmRLa2ZoAgoyCy6dtPCp88ajlpQppDhw8",
    authDomain: "e-history-9b642.firebaseapp.com",
    projectId: "e-history-9b642",
    storageBucket: "e-history-9b642.firebasestorage.app",
    messagingSenderId: "858028604413",
    appId: "1:858028604413:web:3b3853b1de39fcfaad7794"
  };
  

/* ==================== CONFIGURATION CHECK ==================== */

export function isFirebaseConfigured() {
    const requiredValues = [
        firebaseConfig.apiKey,
        firebaseConfig.authDomain,
        firebaseConfig.projectId,
        firebaseConfig.messagingSenderId,
        firebaseConfig.appId
    ];

    return requiredValues.every(
        (value) =>
            typeof value === 'string' &&
            value.trim() !== '' &&
            !value.includes('PASTE_')
    );
}
