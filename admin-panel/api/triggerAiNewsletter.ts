import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './db.js';
import { WhatsAppService } from './whatsapp.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
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
      Escreva um e-mail de marketing persuasivo, estruturado e belo promovendo os serviços da Nexum AI (desenvolvimento de sistemas customizados, landing pages premium e automações inteligentes de atendimento via WhatsApp).
      Escreva livremente com foco em conversão e copywriting persuasivo. O tom deve ser direto, dinâmico e focado em gerar interesse.
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
      Escreva uma mensagem de WhatsApp curta e direta (limite de 350 caracteres) convidando empresas a conhecerem a recepção inteligente e automações 24/7 da Nexum AI.
      Escreva de maneira natural e livre, visando alto engajamento.
      Utilize emojis de forma moderada, quebras de linha e coloque termos principais em negrito usando asteriscos simples (ex: *recepção*).
      Não use cabeçalhos ou markdown complexo. Termine com a chamada para ação contendo o link da consultoria: wa.me/5527995331369
      IMPORTANTE: Fale apenas sobre as funcionalidades reais e evite qualquer tipo de informação falsa, dados falsos ou promessas irreais. Convide-os a agendar uma consultoria gratuita.
    `;

    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    return { content };
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

  try {
    // 1. Buscar leads
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
          console.error(`Erro ao disparar email para ${lead.email}:`, e);
        }
      }

      // Envio de WhatsApp
      if ((lead.subscribeType === 'whatsapp' || lead.subscribeType === 'both') && lead.phone) {
        try {
          const firstName = lead.name.split(' ')[0];
          const personalizedMsg = `Olá ${firstName}! ${sanitizedWhatsappContent}`;
          const success = await WhatsAppService.sendMessage(lead.phone, personalizedMsg);
          if (success) whatsappsEnviados++;
        } catch (e) {
          console.error(`Erro ao disparar WhatsApp para ${lead.phone}:`, e);
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
    console.error('Erro na campanha imediata:', err);
    res.status(500).json({ error: err.message });
  }
}
