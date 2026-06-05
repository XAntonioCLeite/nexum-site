import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { WhatsAppService } from './whatsapp';

admin.initializeApp();
const db = admin.firestore();

// Configurações
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

interface Lead {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  subscribeType: 'email' | 'whatsapp' | 'both';
  createdAt: admin.firestore.Timestamp;
}

// ----------------------------------------------------
// HELPERS
// ----------------------------------------------------

async function sendBrevoEmail(to: string, subject: string, htmlContent: string) {
  const brevoApiKey = process.env.BREVO_API_KEY || '';
  if (!brevoApiKey) {
    logger.warn('Chave BREVO_API_KEY não configurada. Simulação de envio para ' + to);
    return true;
  }

  // Montar HTML final integrando a logo
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
    logger.error('Erro ao enviar e-mail Brevo:', err);
    throw err;
  }
}

async function generateAICopy(channel: 'email' | 'whatsapp'): Promise<{ subject?: string; content: string }> {
  const geminiApiKey = process.env.GEMINI_API_KEY || '';
  if (!geminiApiKey) {
    return {
      subject: 'Novidades em Automação da Nexum AI',
      content: channel === 'email' 
        ? '<p>Olá! Nós somos a Nexum AI, líderes em automação clínica para WhatsApp 24/7. Agende sua consultoria gratuita e alavanque seus agendamentos hoje mesmo.</p>'
        : 'Olá! Acelere o atendimento da sua clínica e reduza faltas com a IA 24/7 da Nexum AI. Fale conosco no link: wa.me/5527995331369'
    };
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  if (channel === 'email') {
    const prompt = `
      Escreva um e-mail de marketing persuasivo, estruturado e belo promovendo os serviços de desenvolvimento de sistemas customizados, landing pages premium e automações inteligentes de atendimento (IA) via WhatsApp da Nexum AI.
      O tom de voz deve ser direto, profissional, focado em aumentar vendas, reduzir no-shows de consultas e aliviar a recepção.
      Você DEVE retornar no início da resposta o assunto marcado exatamente assim: [ASSUNTO: Assunto do E-mail]
      Não use tags de bloco de código (\`\`\`html) para englobar a resposta. Retorne apenas o assunto e as tags HTML estruturadas internamente.
      IMPORTANTE:
      - NUNCA retorne as tags <html>, <head> ou <body>. Retorne apenas as tags internas do corpo (como <p>, <h2>, <ul>, <li>, <div style="...">).
      - Como o container de fundo do e-mail é escuro (#12141c), TODOS os elementos de texto (como <p>, <h2>, <h3>, <h4>, <li>, <span>, <strong>) gerados no HTML DEVEM possuir explicitamente o atributo inline 'style="color: #ffffff;"' (ou #e2e8f0) para garantir excelente leitura e evitar que clientes de e-mail apliquem cores escuras padrão.
      - Qualquer link ou botão de chamada para ação DEVE levar para o domínio oficial 'https://nexumai.me' (NUNCA use '.com.br').
      - Inclua um botão de chamada para ação chamativo estilizado em HTML (ex: display: inline-block; padding: 12px 24px; background-color: #00D9A3; color: #0b0c10; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 15px 0;) apontando para o WhatsApp oficial: 'https://wa.me/5527995331369'.
      - Fale apenas sobre as funcionalidades reais (atendimento 24/7 via WhatsApp, integrações de agenda/ERP e no-show/lembretes). Não invente preços, descontos, estatísticas ou depoimentos.
      - O e-mail deve ser extremamente curto e objetivo (no máximo 3 parágrafos pequenos ou 150 palavras) para garantir alta conversão e leitura rápida. Evite textos longos ou prolixos.
      - O ano atual é 2026. Se houver qualquer menção a ano no texto, use rigorosamente 2026 (NUNCA utilize 2024 ou anos passados).
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const subjectMatch = text.match(/\[ASSUNTO:\s*(.*?)\]/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : 'Inovação e Automação para seu Negócio - Nexum AI';
    const content = text.replace(/\[ASSUNTO:\s*.*?\]/gi, '').trim();

    return { subject, content };
  } else {
    const prompt = `
      Escreva uma mensagem promocional curta e direta de marketing para ser enviada por WhatsApp (limite de 350 caracteres) convidando donos de clínicas e empresas a automatizarem a recepção com a IA Conversacional 24/7 da Nexum AI.
      Utilize emojis de forma moderada, quebras de linha e coloque algumas palavras-chave importantes em negrito usando asteriscos simples (ex: *recepção*).
      Não use cabeçalhos, marcadores de listas em traço, ou markdown complexo. Seja persuasivo e termine com a chamada para ação curta contendo o link da consultoria: wa.me/5527995331369
      IMPORTANTE: Fale apenas sobre as funcionalidades reais e evite qualquer tipo de informação falsa, dados falsos ou promessas irreais. Convide-os a agendar uma consultoria gratuita.
    `;

    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    return { content };
  }
}

// ----------------------------------------------------
// CLOUD FUNCTIONS HTTPS ENDPOINTS
// ----------------------------------------------------

/**
 * Endpoint para cadastrar novos leads.
 */
export const subscribeLead = onRequest({ cors: true }, async (req, res) => {
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
    const leadData: Omit<Lead, 'id'> = {
      name: name.trim(),
      subscribeType,
      createdAt: admin.firestore.Timestamp.now()
    };

    if (email && email.trim()) leadData.email = email.trim();
    if (phone && phone.trim()) leadData.phone = phone.trim();

    const docRef = await db.collection('leads').add(leadData);

    logger.info(`Lead cadastrado com ID: ${docRef.id}`);
    res.status(200).json({ success: true, id: docRef.id });
  } catch (err: any) {
    logger.error('Erro ao cadastrar lead:', err);
    res.status(500).json({ error: err.message || 'Erro interno do servidor' });
  }
});

/**
 * Endpoint para buscar leads.
 */
export const fetchLeads = onRequest({ cors: true }, async (req, res) => {
  try {
    const snapshot = await db.collection('leads').orderBy('createdAt', 'desc').get();
    const leads: Lead[] = [];
    
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
    logger.error('Erro ao buscar leads:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Disparar e-mail/WhatsApp com IA imediatamente para toda a base.
 */
export const triggerAiNewsletter = onRequest({ cors: true }, async (req, res) => {
  try {
    // 1. Buscar leads
    const snapshot = await db.collection('leads').get();
    const leads: Lead[] = [];
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

    if (leads.length === 0) {
       res.status(200).json({ success: true, message: 'Nenhum lead inscrito para envio.' });
       return;
    }

    // 2. Gerar copies pela IA
    const [emailCopy, whatsappCopy] = await Promise.all([
      generateAICopy('email'),
      generateAICopy('whatsapp')
    ]);

    // Aplicar sanitizador programático nas cópias geradas pela IA
    const sanitizedEmailSubject = sanitizeText(emailCopy.subject || '');
    const sanitizedEmailContent = sanitizeText(emailCopy.content || '');
    const sanitizedWhatsappContent = sanitizeText(whatsappCopy.content || '');

    let emailsEnviados = 0;
    let whatsappsEnviados = 0;

    // 3. Loop de disparos
    for (const lead of leads) {
      // Envio de E-mail
      if ((lead.subscribeType === 'email' || lead.subscribeType === 'both') && lead.email) {
        try {
          const success = await sendBrevoEmail(lead.email, sanitizedEmailSubject, sanitizedEmailContent);
          if (success) emailsEnviados++;
        } catch (e) {
          logger.error(`Erro ao disparar email para ${lead.email}:`, e);
        }
      }

      // Envio de WhatsApp
      if ((lead.subscribeType === 'whatsapp' || lead.subscribeType === 'both') && lead.phone) {
        try {
          // Personalizando com o primeiro nome
          const firstName = lead.name.split(' ')[0];
          const personalizedMsg = `Olá ${firstName}! ${sanitizedWhatsappContent}`;
          const success = await WhatsAppService.sendMessage(lead.phone, personalizedMsg);
          if (success) whatsappsEnviados++;
        } catch (e) {
          logger.error(`Erro ao disparar WhatsApp para ${lead.phone}:`, e);
        }
      }
    }

    // Registrar histórico da campanha no Firestore
    await db.collection('campaigns').add({
      type: 'ai_auto',
      date: admin.firestore.Timestamp.now(),
      emailsCount: emailsEnviados,
      whatsappsCount: whatsappsEnviados,
      subject: sanitizedEmailSubject,
      emailContent: sanitizedEmailContent,
      whatsappContent: sanitizedWhatsappContent
    });

    res.status(200).json({
      success: true,
      message: `Campanha IA disparada! Enviaremos para ${emailsEnviados} e-mails e ${whatsappsEnviados} números de WhatsApp.`
    });
  } catch (err: any) {
    logger.error('Erro na campanha imediata:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Enviar campanha escrita manualmente pelo painel de controle.
 */
export const sendManualNewsletter = onRequest({ cors: true }, async (req, res) => {
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
    const leads: Lead[] = [];
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
          logger.error(`Erro no email manual para ${lead.email}:`, e);
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
          logger.error(`Erro no whatsapp manual para ${lead.phone}:`, e);
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
    logger.error('Erro na campanha manual:', err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// SCHEDULED TRIGGER CRON JOB (2x POR SEMANA)
// ----------------------------------------------------

/**
 * Disparador agendado que roda duas vezes por semana.
 * Horário: 15:00 PM nos Domingos (0) e Quintas (4)
 * Cron expression: '0 15 * * 0,4'
 */
export const scheduledNewsletter = onSchedule({
  schedule: '0 15 * * 0,4',
  timeZone: 'America/Sao_Paulo',
}, async (event) => {
  logger.info('Iniciando disparador automático recorrente do Radar Nexum AI...');
  
  try {
    const snapshot = await db.collection('leads').get();
    const leads: Lead[] = [];
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

    if (leads.length === 0) {
      logger.info('Nenhum lead cadastrado. Disparo cancelado.');
      return;
    }

    // Gerar copias com IA
    const [emailCopy, whatsappCopy] = await Promise.all([
      generateAICopy('email'),
      generateAICopy('whatsapp')
    ]);

    // Aplicar sanitizador programático nas cópias geradas pela IA
    const sanitizedEmailSubject = sanitizeText(emailCopy.subject || '');
    const sanitizedEmailContent = sanitizeText(emailCopy.content || '');
    const sanitizedWhatsappContent = sanitizeText(whatsappCopy.content || '');

    let emailsEnviados = 0;
    let whatsappsEnviados = 0;

    for (const lead of leads) {
      // Disparo E-mail
      if ((lead.subscribeType === 'email' || lead.subscribeType === 'both') && lead.email) {
        try {
          const success = await sendBrevoEmail(lead.email, sanitizedEmailSubject, sanitizedEmailContent);
          if (success) emailsEnviados++;
        } catch (e) {
          logger.error(`Erro ao disparar cron email para ${lead.email}:`, e);
        }
      }

      // Disparo WhatsApp
      if ((lead.subscribeType === 'whatsapp' || lead.subscribeType === 'both') && lead.phone) {
        try {
          const firstName = lead.name.split(' ')[0];
          const personalizedMsg = `Olá ${firstName}! ${sanitizedWhatsappContent}`;
          const success = await WhatsAppService.sendMessage(lead.phone, personalizedMsg);
          if (success) whatsappsEnviados++;
        } catch (e) {
          logger.error(`Erro ao disparar cron WhatsApp para ${lead.phone}:`, e);
        }
      }
    }

    // Registrar no histórico de campanhas
    await db.collection('campaigns').add({
      type: 'cron_auto',
      date: admin.firestore.Timestamp.now(),
      emailsCount: emailsEnviados,
      whatsappsCount: whatsappsEnviados,
      subject: sanitizedEmailSubject,
      emailContent: sanitizedEmailContent,
      whatsappContent: sanitizedWhatsappContent
    });

    logger.info(`Disparador automático concluído com sucesso. E-mails: ${emailsEnviados}. WhatsApps: ${whatsappsEnviados}.`);
  } catch (err) {
    logger.error('Erro fatal no cron job do scheduledNewsletter:', err);
  }
});
