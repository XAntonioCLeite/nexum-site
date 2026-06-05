#!/bin/bash
# ==============================================================================
# Script de Automação: Instalação e Execução da Evolution API no Oracle Cloud VM
# ==============================================================================

echo "=========================================================="
echo "   Iniciando Configuração da Evolution API no Oracle VM   "
echo "=========================================================="

# 1. Instalar Docker e Docker Compose (se não estiverem instalados)
if ! command -v docker &> /dev/null
then
    echo "[1/4] Instalando dependências e Docker..."
    sudo apt-get update -y
    sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
    
    # Adicionar chave oficial do Docker
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Configurar repositório
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
else
    echo "[1/4] Docker já instalado no sistema."
fi

# 2. Criar diretório do serviço
echo "[2/4] Criando diretório de configuração..."
mkdir -p ~/evolution-api
cd ~/evolution-api

# 3. Gerar docker-compose.yml
echo "[3/4] Escrevendo arquivo docker-compose.yml..."
cat << 'EOF' > docker-compose.yml
version: '3.8'

services:
  evolution-api:
    image: atendai/evolution-api:latest
    container_name: evolution_api
    restart: always
    ports:
      - "8080:8080"
    environment:
      - SERVER_PORT=8080
      - SERVER_URL=http://localhost:8080
      - AUTHENTICATION_API_KEY=ChaveGlobalSeguraEvolution123
      - CORS_ORIGIN=*
      - CORS_METHODS=GET,POST,PUT,DELETE
      - CORS_HEADERS=Content-Type,Authorization,apikey
      - DATABASE_ENABLED=false
      - REDIS_ENABLED=false
      - DEL_INSTANCE_CLEAN_DATA=true
    volumes:
      - evolution_instances:/evolution/instances

volumes:
  evolution_instances:
EOF

# Iniciar o container
echo "Iniciando o container Docker da Evolution API..."
sudo docker compose up -d

# 4. Ajustar regras de Firewall no Linux (Oracle Cloud padrão usa iptables)
echo "[4/4] Abrindo porta 8080 no Firewall do Linux (iptables)..."
sudo iptables -I INPUT 6 -p tcp --dport 8080 -j ACCEPT
sudo netfilter-persistent save

# Obter IP Público atual
IP_PUBLICO=$(curl -s https://ifconfig.me)

echo "=========================================================="
echo "             CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!          "
echo "=========================================================="
echo "Sua Evolution API está rodando no endereço:"
echo "http://${IP_PUBLICO}:8080"
echo ""
echo "Dados para preencher no Vercel / Firebase Env:"
echo "WHATSAPP_GATEWAY_URL: http://${IP_PUBLICO}:8080/message/sendText/NOME_DA_SUA_INSTANCIA"
echo "WHATSAPP_GATEWAY_API_KEY: ChaveGlobalSeguraEvolution123"
echo "=========================================================="
echo "Lembre-se de abrir a porta TCP 8080 nas Ingress Rules da "
echo "Virtual Cloud Network (VCN) no console do Oracle Cloud!"
echo "=========================================================="
