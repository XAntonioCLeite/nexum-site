import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './db.js';
import admin from 'firebase-admin';

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

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Somente POST é aceito' });
    return;
  }

  const { name, email, phone, subscribeType } = req.body;

  if (!name || !name.trim()) {
    res.status(400).json({ error: 'O nome é obrigatório' });
    return;
  }

  if (!subscribeType || !['email', 'whatsapp', 'both'].includes(subscribeType)) {
    res.status(400).json({ error: 'Tipo de inscrição inválido' });
    return;
  }

  try {
    const leadData: any = {
      name: name.trim(),
      subscribeType,
      createdAt: admin.firestore.Timestamp.now()
    };

    if (email && email.trim()) leadData.email = email.trim();
    if (phone && phone.trim()) leadData.phone = phone.trim();

    const docRef = await db.collection('leads').add(leadData);

    res.status(200).json({ success: true, id: docRef.id });
  } catch (err: any) {
    console.error('Erro ao cadastrar lead:', err);
    res.status(500).json({ error: err.message || 'Erro interno do servidor' });
  }
}
