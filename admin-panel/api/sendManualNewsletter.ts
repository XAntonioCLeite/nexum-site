import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './db.js';
import { WhatsAppService } from './whatsapp.js';
import admin from 'firebase-admin';

const SENDER_EMAIL = 'antonio_cleite@hotmail.com';
const SENDER_NAME = 'Antônio - Nexum AI';
const LOGO_URL = 'https://nexumai.me/logo-solido.png';

function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/nexum\.ai/gi, 'nexumai.me')
    .replace(/nexumai\.com\.br/gi, 'nexumai.me')
    .replace(/2024/g, '2026');
}

async function sendBrevoEmail(to: string, subject: string, htmlContent: string) {
  const brevoApiKey = process.env.BREVO_API_KEY || '';
  if (!brevoApiKey) {
    console.warn('Chave BREVO_API_KEY não configurada. Simulação de envio para ' + to);
    return true;
  }

  const formattedHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; background-color: #0b0c10; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); color: #e2e8f0;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="${LOGO_URL}" alt="Nexum AI" style="width: 140px; height: auto;" />
      </div>
      <div style="background-color: #12141c; padding: 35px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.03); color: #e2e8f0; line-height: 1.6; font-size: 15px;">
        ${htmlContent}
      </div>
      <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #64748b; font-family: monospace;">
        Você está recebendo este e-mail porque se cadastrou no Radar Nexum AI.<br/>
        Nexum AI &copy; 2026. Todos os direitos reservados.
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: to }],
        subject: subject,
        htmlContent: formattedHtml
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Erro na API do Brevo (${response.status}): ${err}`);
    }

    return true;
  } catch (err) {
    console.error('Erro ao enviar e-mail Brevo:', err);
    throw err;
  }
}

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
    res.status(405).json({ error: 'Somente POST' });
    return;
  }

  const { targetType, subject, emailBody, whatsappBody } = req.body;

  if (!targetType || !['email', 'whatsapp', 'both'].includes(targetType)) {
    res.status(400).json({ error: 'Canal de envio (targetType) inválido' });
    return;
  }

  try {
    const snapshot = await db.collection('leads').get();
    const leads: any[] = [];
    snapshot.forEach((doc: any) => {
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

    let emailsEnviados = 0;
    let whatsappsEnviados = 0;

    // Sanitizar cópias manuais para evitar anos passados ou domínios incorretos
    const sanitizedSubject = sanitizeText(subject || '');
    const sanitizedEmailBody = sanitizeText(emailBody || '');
    const sanitizedWhatsappBody = sanitizeText(whatsappBody || '');

    for (const lead of leads) {
      // Disparar E-mail
      if ((targetType === 'email' || targetType === 'both') && 
          (lead.subscribeType === 'email' || lead.subscribeType === 'both') && 
          lead.email && sanitizedSubject && sanitizedEmailBody) {
        try {
          const success = await sendBrevoEmail(lead.email, sanitizedSubject, sanitizedEmailBody);
          if (success) emailsEnviados++;
        } catch (e) {
          console.error(`Erro no email manual para ${lead.email}:`, e);
        }
      }

      // Disparar WhatsApp
      if ((targetType === 'whatsapp' || targetType === 'both') && 
          (lead.subscribeType === 'whatsapp' || lead.subscribeType === 'both') && 
          lead.phone && sanitizedWhatsappBody) {
        try {
          const firstName = lead.name.split(' ')[0];
          const personalizedMsg = sanitizedWhatsappBody.replace(/{nome}/gi, firstName);
          const success = await WhatsAppService.sendMessage(lead.phone, personalizedMsg);
          if (success) whatsappsEnviados++;
        } catch (e) {
          console.error(`Erro no whatsapp manual para ${lead.phone}:`, e);
        }
      }
    }

    // Registrar no histórico de campanhas
    await db.collection('campaigns').add({
      type: 'manual',
      date: admin.firestore.Timestamp.now(),
      emailsCount: emailsEnviados,
      whatsappsCount: whatsappsEnviados,
      subject: sanitizedSubject,
      emailContent: sanitizedEmailBody,
      whatsappContent: sanitizedWhatsappBody
    });

    res.status(200).json({
      success: true,
      message: `Mensagens enviadas com sucesso! E-mails: ${emailsEnviados}. WhatsApps: ${whatsappsEnviados}.`
    });
  } catch (err: any) {
    console.error('Erro na campanha manual:', err);
    res.status(500).json({ error: err.message });
  }
}
