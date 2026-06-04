import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Fallback local ou padrão
      admin.initializeApp({
        projectId: 'nexum-site-1b608'
      });
    }
  } catch (error) {
    console.error('Erro ao inicializar o Firebase Admin SDK:', error);
  }
}

export const db = admin.firestore();
