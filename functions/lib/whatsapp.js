"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const firebase_functions_1 = require("firebase-functions");
class WhatsAppService {
    static getCredentials() {
        return {
            token: process.env.META_WHATSAPP_ACCESS_TOKEN || '',
            phoneId: process.env.META_WHATSAPP_PHONE_NUMBER_ID || '',
            gatewayUrl: process.env.WHATSAPP_GATEWAY_URL || '',
            gatewayApiKey: process.env.WHATSAPP_GATEWAY_API_KEY || ''
        };
    }
    static async sendMessage(to, text) {
        const { token, phoneId, gatewayUrl, gatewayApiKey } = this.getCredentials();
        firebase_functions_1.logger.info(`Iniciando envio de WhatsApp para ${to}...`);
        let cleanNumber = to.replace(/\D/g, '');
        if (!cleanNumber.startsWith('55')) {
            cleanNumber = '55' + cleanNumber;
        }
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
                firebase_functions_1.logger.info(`Mensagem enviada com sucesso via Gateway para ${to}`);
                return true;
            }
            catch (err) {
                firebase_functions_1.logger.error(`Erro ao enviar via WhatsApp Gateway:`, err);
                return false;
            }
        }
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
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(`Meta Cloud API Error: ${JSON.stringify(data)}`);
                }
                firebase_functions_1.logger.info(`Mensagem enviada com sucesso via Meta Cloud API para ${to}`);
                return true;
            }
            catch (err) {
                firebase_functions_1.logger.error(`Erro ao enviar via WhatsApp Cloud API:`, err);
                return false;
            }
        }
        if (process.env.FUNCTIONS_EMULATOR === 'true' || process.env.NODE_ENV === 'development') {
            firebase_functions_1.logger.warn(`[DEV] Credenciais de WhatsApp não configuradas. Mensagem simulada para ${to}: "${text.slice(0, 50)}..."`);
            return true;
        }
        firebase_functions_1.logger.error(`[PROD] Erro: Credenciais do WhatsApp não configuradas no servidor.`);
        return false;
    }
}
exports.WhatsAppService = WhatsAppService;
//# sourceMappingURL=whatsapp.js.map