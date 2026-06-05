import admin from 'firebase-admin';
import type { VercelRequest, VercelResponse } from '@vercel/node';

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

// Handler padrão para evitar exposição pública direta na rota /api/db
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(403).json({ error: 'Acesso proibido' });
}
