# Evolution API v2.3.1 - Configuração de Deploy no Render.com

Este diretório contém as configurações necessárias para rodar a Evolution API (versão v2.3.1, que é 100% gratuita e livre de licenças comerciais) no plano gratuito do **Render.com**.

## Variáveis de Ambiente Necessárias (Render Dashboard)

Adicione as seguintes chaves na seção **Environment** da sua Web Service no Render:

| Chave | Valor Sugerido | Descrição |
| :--- | :--- | :--- |
| `AUTHENTICATION_TYPE` | `apikey` | Tipo de autenticação padrão da API |
| `AUTHENTICATION_API_KEY` | `ChaveGlobalSeguraEvolution123` | Chave de segurança global (mantenha secreta) |
| `DATABASE_ENABLED` | `true` | Habilita armazenamento persistente no banco |
| `DATABASE_PROVIDER` | `postgresql` | Tipo de banco utilizado (PostgreSQL) |
| `DATABASE_CONNECTION_URI` | `postgresql://neondb_owner:npg_EfchS17gjtTA@ep-autumn-tree-aphgpqrh.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require` | String de conexão do Neon PostgreSQL |
| `REDIS_ENABLED` | `false` | Desabilita o Redis para caber no plano grátis |
| `DEL_INSTANCE_CLEAN_DATA` | `true` | Limpa dados temporários locais ao apagar instâncias |

---

## Como manter online 24/7 (Evitar o Sleep do Render)

1. Após o deploy, copie a URL do seu serviço gerada pelo Render (ex: `https://nexum-evolution-api.onrender.com`).
2. Acesse o [UptimeRobot.com](https://uptimerobot.com) (ou outro monitor gratuito como cron-job.org).
3. Adicione um monitor do tipo **HTTP(s)** apontando para a URL da saúde da sua API:
   `https://seu-subdominio.onrender.com/health`
4. Defina o intervalo de verificação para **a cada 5 minutos**.
5. Salve o monitor. Isso impedirá que a máquina gratuita entre em hibernação e manterá a sua conexão de WhatsApp estável.
