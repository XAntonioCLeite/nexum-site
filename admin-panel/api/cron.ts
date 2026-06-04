import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_db';
import { WhatsAppService } from './_whatsapp';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as admin from 'firebase-admin';

const SENDER_EMAIL = 'antonio_cleite@hotmail.com';
const SENDER_NAME = 'Antônio - Nexum AI';
const LOGO_URL = 'https://nexumai.me/logo-solido.png';

async function sendBrevoEmail(to: string, subject: string, htmlContent: string) {
  const brevoApiKey = process.env.BREVO_API_KEY || '';
  if (!brevoApiKey) return true;

  const formattedHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${LOGO_URL}" alt="Nexum AI" style="width: 140px; height: auto;" />
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); color: #333333; line-height: 1.6;">
        ${htmlContent}
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #999999;">
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
    return response.ok;
  } catch (err) {
    console.error('Erro ao enviar e-mail Brevo:', err);
    return false;
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
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

  if (channel === 'email') {
    const prompt = `
      Escreva um e-mail de marketing persuasivo, estruturado e belo em formato HTML promovendo os serviços de desenvolvimento de sistemas customizados, landing pages premium e automações inteligentes de atendimento (IA) via WhatsApp da Nexum AI.
      O tom de voz deve ser direto, profissional, focado em aumentar vendas, reduzir no-shows de consultas e aliviar a recepção.
      Você DEVE retornar no início da resposta o assunto marcado exatamente assim: [ASSUNTO: Assunto do E-mail]
      Não use tags de bloco de código (\`\`\`html) para englobar a resposta. Retorne apenas o assunto e as tags HTML estruturadas internamente.
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
      Não use cabeçalhos, marcadores de listas em traço, ou markdown complexo. Seja persuasivo e termine com uma chamada para ação curta contendo o link da consultoria: wa.me/5527995331369
    `;

    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    return { content };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Segurança para evitar chamadas maliciosas no endpoint de Cron público
  // Vercel adiciona o cabeçalho Authorization se configurado, ou podemos checar uma chave de segurança simples
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    res.status(401).json({ error: 'Não autorizado' });
    return;
  }

  try {
    const snapshot = await db.collection('leads').get();
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

    if (leads.length === 0) {
       res.status(200).json({ success: true, message: 'Nenhum lead inscrito.' });
       return;
    }

    const [emailCopy, whatsappCopy] = await Promise.all([
      generateAICopy('email'),
      generateAICopy('whatsapp')
    ]);

    let emailsEnviados = 0;
    let whatsappsEnviados = 0;

    for (const lead of leads) {
      if ((lead.subscribeType === 'email' || lead.subscribeType === 'both') && lead.email) {
        try {
          await sendBrevoEmail(lead.email, emailCopy.subject!, emailCopy.content);
          emailsEnviados++;
        } catch (e) {
          console.error(e);
        }
      }

      if ((lead.subscribeType === 'whatsapp' || lead.subscribeType === 'both') && lead.phone) {
        try {
          const firstName = lead.name.split(' ')[0];
          const personalizedMsg = `Olá ${firstName}! ${whatsappCopy.content}`;
          await WhatsAppService.sendMessage(lead.phone, personalizedMsg);
          whatsappsEnviados++;
        } catch (e) {
          console.error(e);
        }
      }
    }

    await db.collection('campaigns').add({
      type: 'cron_auto',
      date: admin.firestore.Timestamp.now(),
      emailsCount: emailsEnviados,
      whatsappsCount: whatsappsEnviados,
      subject: emailCopy.subject,
      emailContent: emailCopy.content,
      whatsappContent: whatsappCopy.content
    });

    res.status(200).json({ success: true, message: `Cron executado! Emails: ${emailsEnviados}, WhatsApps: ${whatsappsEnviados}` });
  } catch (err: any) {
    console.error('Erro na cron:', err);
    res.status(500).json({ error: err.message });
  }
}
