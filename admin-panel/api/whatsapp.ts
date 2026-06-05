import type { VercelRequest, VercelResponse } from '@vercel/node';

export class WhatsAppService {
  static getCredentials() {
    return {
      token: (process.env.META_WHATSAPP_ACCESS_TOKEN || '').trim(),
      phoneId: (process.env.META_WHATSAPP_PHONE_NUMBER_ID || '').trim(),
      gatewayUrl: (process.env.WHATSAPP_GATEWAY_URL || '').trim(),
      gatewayApiKey: (process.env.WHATSAPP_GATEWAY_API_KEY || '').trim()
    };
  }

  /**
   * Envia uma mensagem de texto simples 100% automatizada
   * @param to Número de telefone com código do país (ex: 5527999999999)
   * @param text Conteúdo da mensagem
   */
  static async sendMessage(to: string, text: string): Promise<boolean> {
    const { token, phoneId, gatewayUrl, gatewayApiKey } = this.getCredentials();

    console.log(`Iniciando envio de WhatsApp para ${to}...`);

    // Limpar o número para conter apenas dígitos e garantir padrão internacional
    let cleanNumber = to.replace(/\D/g, '');
    if (!cleanNumber.startsWith('55')) {
      cleanNumber = '55' + cleanNumber;
    }

    // Se estiver usando um gateway alternativo (Z-API / Evolution)
    if (gatewayUrl && gatewayUrl.trim()) {
      try {
        const isEvolution = gatewayUrl.includes('/message/sendText');
        const url = isEvolution ? gatewayUrl : `${gatewayUrl}/sendMessage`;
        const body = isEvolution 
          ? { number: cleanNumber, text: text }
          : { number: cleanNumber, message: text };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': gatewayApiKey
          },
          body: JSON.stringify(body),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gateway Error (${response.status}): ${errText}`);
        }

        console.log(`Mensagem enviada com sucesso via Gateway para ${to}`);
        return true;
      } catch (err) {
        console.error(`Erro ao enviar via WhatsApp Gateway:`, err);
        return false;
      }
    }

    // Caso use o WhatsApp Cloud API Oficial da Meta
    if (token && phoneId) {
      try {
        const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: cleanNumber,
            type: "text",
            text: { preview_url: false, body: text }
          })
        });

        const data: any = await response.json();

        if (!response.ok) {
          throw new Error(`Meta Cloud API Error: ${JSON.stringify(data)}`);
        }

        console.log(`Mensagem enviada com sucesso via Meta Cloud API para ${to}`);
        return true;
      } catch (err) {
        console.error(`Erro ao enviar via WhatsApp Cloud API:`, err);
        return false;
      }
    }

    // Fallback Mock de testes se nenhuma credencial estiver configurada
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      console.warn(`[DEV] Credenciais de WhatsApp não configuradas. Mensagem simulada para ${to}: "${text.slice(0, 50)}..."`);
      return true;
    }
    console.error(`[PROD] Erro: Credenciais do WhatsApp não configuradas no servidor.`);
    return false;
  }
}

// Handler padrão para evitar exposição pública direta na rota /api/whatsapp
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(403).json({ error: 'Acesso proibido' });
}
