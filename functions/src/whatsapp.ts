import { logger } from 'firebase-functions';

export class WhatsAppService {
  private static getCredentials() {
    return {
      token: process.env.META_WHATSAPP_ACCESS_TOKEN || '',
      phoneId: process.env.META_WHATSAPP_PHONE_NUMBER_ID || '',
      // Se usar um gateway alternativo como Evolution API ou Z-API
      gatewayUrl: process.env.WHATSAPP_GATEWAY_URL || '',
      gatewayApiKey: process.env.WHATSAPP_GATEWAY_API_KEY || ''
    };
  }

  /**
   * Envia uma mensagem de texto simples 100% automatizada
   * @param to Número de telefone com código do país (ex: 5527999999999)
   * @param text Conteúdo da mensagem
   */
  public static async sendMessage(to: string, text: string): Promise<boolean> {
    const { token, phoneId, gatewayUrl, gatewayApiKey } = this.getCredentials();

    logger.info(`Iniciando envio de WhatsApp para ${to}...`);

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

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': gatewayApiKey
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gateway Error (${response.status}): ${errText}`);
        }

        logger.info(`Mensagem enviada com sucesso via Gateway para ${to}`);
        return true;
      } catch (err: any) {
        logger.error(`Erro ao enviar via WhatsApp Gateway:`, err);
        return false;
      }
    }

    // Caso use o WhatsApp Cloud API Oficial da Meta
    if (token && phoneId) {
      try {
        const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
        
        // Importante: Mensagens ativas promocionais oficiais da Meta exigem aprovação prévia de Template.
        // Este é um fallback padrão. Se você estiver disparando mensagem direta livre, ela só funciona se o paciente 
        // conversou com o número nas últimas 24 horas. Caso contrário, deve-se usar templates homologados.
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

        logger.info(`Mensagem enviada com sucesso via Meta Cloud API para ${to}`);
        return true;
      } catch (err: any) {
        logger.error(`Erro ao enviar via WhatsApp Cloud API:`, err);
        return false;
      }
    }

    // Fallback Mock de testes se nenhuma credencial estiver configurada
    logger.warn(`Credenciais de WhatsApp não configuradas. Mensagem simulada para ${to}: "${text.slice(0, 50)}..."`);
    return true;
  }
}
