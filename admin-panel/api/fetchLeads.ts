import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const snapshot = await db.collection('leads').orderBy('createdAt', 'desc').get();
    const leads: any[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      leads.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        subscribeType: data.subscribeType,
        createdAt: data.createdAt
      });
    });

    res.status(200).json({ success: true, leads });
  } catch (err: any) {
    console.error('Erro ao buscar leads:', err);
    res.status(500).json({ error: err.message });
  }
}
