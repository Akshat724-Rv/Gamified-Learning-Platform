import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

const initializeFirebaseApp = (): admin.app.App => {
  try {
    if (admin.apps.length > 0 && admin.apps[0]) {
      return admin.apps[0];
    }

    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error("serviceAccountKey.json file missing in apps/api folder");
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    // Formatting check for Private Key
    if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });

    console.log("✅ [FIREBASE] Admin SDK Connected!");
    return app;

  } catch (error: any) {
    console.error("❌ [FIREBASE] Setup Error:", error.message);
    // Yahan hum dummy object bhej rahe hain taaki crash na ho par error dikhaye
    throw new Error("Firebase configuration error. Please check service account setup.");
  }
};

const app = initializeFirebaseApp();
export const db = admin.firestore(app);
export const auth = admin.auth(app);