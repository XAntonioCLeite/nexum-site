import React, { useState, useEffect } from "react";
import {
  Check,
  Search,
  Sparkles,
  ArrowRight,
  Loader2,
  Terminal,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// =======================
// TREINAMENTO / CONTEXTO
// =======================
// Context specifically tuned for this dashboard analysis view
const DASHBOARD_CONTEXT = `
Você é o "Nexum Core", o cérebro central de inteligência da Nexum AI.
Sua função é analisar inputs de donos de clínicas e gerar um RELATÓRIO TÉCNICO ESTRUTURADO.

SEU COMPORTAMENTO VISUAL (IMPORTANTE):
1. NÃO escreva parágrafos longos.
2. Use Títulos H3 (###) para separar as seções.
3. Use Listas ( - ) para os itens.
4. Use Negrito ( ** ) para destacar palavras-chave.

ESTRUTURA DE RESPOSTA OBRIGATÓRIA:

### 🔍 Diagnóstico
[Uma frase curta e direta identificando a dor central]

### 🛠️ Protocolo de Solução
- **[Nome da Ação]:** [Explicação ultra-breve]
- **[Nome da Ação]:** [Explicação ultra-breve]
- **[Nome da Ação]:** [Explicação ultra-breve]

### 📈 Impacto Projetado
[Uma frase de impacto focada em ROI, Tempo ou Dinheiro]

---
EXEMPLO DE INPUT: "Muitos pacientes faltam e perco dinheiro"

EXEMPLO DE OUTPUT:
### 🔍 Diagnóstico
Alta taxa de no-show (faltas) impactando o faturamento.

### 🛠️ Protocolo de Solução
- **Confirmação Ativa:** Disparo automático 24h e 2h antes da consulta.
- **Resgate Imediato:** IA identifica negativa e propõe reagendamento na hora.
- **Lista de Espera:** Preenchimento automático de "buracos" na agenda.

### 📈 Impacto Projetado
Redução estimada de 60% nas faltas e recuperação imediata de receita ociosa.
`;

function getProxyUrl(): string {
  const url = import.meta.env.VITE_GEMINI_PROXY_URL as string | undefined;
  if (!url || !url.trim()) {
    throw new Error(
      "Configuração ausente: insira GEMINI_API_KEY ou VITE_GEMINI_PROXY_URL no seu arquivo .env.local"
    );
  }
  return url.trim();
}

const AutomatedIntelligenceSection: React.FC = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [activeMode, setActiveMode] = useState<"input" | "output">("input");

  useEffect(() => {
    if (isLoading || (response && !isFocused)) setActiveMode("output");
    else if (isFocused || !response) setActiveMode("input");
  }, [isLoading, response, isFocused]);

  const handleAnalysis = async () => {
    if (!query.trim()) return;

    const currentQuery = query;
    setQuery("");
    setIsLoading(true);
    setResponse(null);
    setHasAnalyzed(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
      const hasApiKey = apiKey && apiKey.trim();
      const proxyUrl = !hasApiKey ? getProxyUrl() : "";

      let resp: Response;
      try {
        if (hasApiKey) {
          const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey.trim()}`;
          const contents = [
            { role: "user", parts: [{ text: currentQuery }] },
          ];
          const body: any = { contents };
          if (DASHBOARD_CONTEXT?.trim()) {
            body.systemInstruction = { parts: [{ text: DASHBOARD_CONTEXT }] };
          }
          resp = await fetch(directUrl, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
          });
        } else {
          resp = await fetch(proxyUrl, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              prompt: currentQuery,
              systemInstruction: DASHBOARD_CONTEXT,
              history: [],
            }),
          });
        }
      } catch (e: any) {
        throw new Error(
          `Falha de conexão com a IA. Motivo: ${e?.message ?? "NetworkError"}`
        );
      }

      const raw = await resp.text();

      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        data = { text: "", _raw: raw };
      }

      if (!resp.ok) {
        throw new Error(
          `Erro na IA (${resp.status}): ${
            typeof data === "object" ? JSON.stringify(data) : String(data)
          }`
        );
      }

      let text = "";
      if (hasApiKey) {
        text =
          data?.candidates?.[0]?.content?.parts
            ?.map((p: any) => p?.text)
            .filter(Boolean)
            .join("") ?? "";
      } else {
        text =
          typeof data?.text === "string" ? data.text : String(data?.text ?? "");
      }

      setResponse(text || "Sem análise disponível.");
    } catch (error) {
      console.error("Error:", error);
      const msg =
        error instanceof Error
          ? `**Erro.**\n${error.message}`
          : "**Erro de conexão.**\nNão foi possível processar sua solicitação no momento. Tente novamente.";
      setResponse(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnalysis();
    }
  };

  return (
    <section
      id="demo"
      className="w-full bg-[#0B0C10] py-24 relative overflow-hidden border-t border-white/5 scroll-mt-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-deepBlue/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Teste a Inteligência Nexum
          </h2>
          <p className="text-slate-400">
            Descreva um problema da sua clínica e veja como nossa IA analisa e resolve.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:h-[500px] h-auto w-full">
          {/* OUTPUT */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={`relative bg-[#121418] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl order-2 md:order-1 h-[350px] md:h-full ${
              activeMode === "output" ? "md:flex-[1.5]" : "md:flex-1"
            }`}
          >
            <div className="h-12 border-b border-white/5 bg-[#1a1d21] flex items-center px-4 justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isLoading ? "bg-yellow-400 animate-pulse" : "bg-mint"
                  }`}
                />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  {isLoading ? "PROCESSANDO DADOS..." : "NEXUM CORE OUTPUT"}
                </span>
              </div>
              <Cpu size={14} className="text-slate-600" />
            </div>

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                  >
                    <Loader2 className="w-10 h-10 text-deepBlue animate-spin" />
                    <p className="text-slate-500 text-sm font-mono animate-pulse">
                      Analisando cenário...
                    </p>
                  </motion.div>
                ) : response ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-none text-left"
                  >
                    {(() => {
                      const parseBoldText = (text: string) => {
                        const parts = text.split(/(\*\*.*?\*\*)/g);
                        return parts.map((part, index) => {
                          if (part.startsWith("**") && part.endsWith("**")) {
                            return (
                              <strong key={index} className="text-white font-bold">
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return part;
                        });
                      };

                      const lines = response.split("\n").map(l => l.trim()).filter(Boolean);

                      return (
                        <div className="space-y-4">
                          {lines.map((line, i) => {
                            if (line.startsWith("###")) {
                              const headingText = line.replace(/^###\s*/, "");
                              return (
                                <h3 key={i} className="text-base font-bold mt-6 mb-2 border-b border-white/5 pb-1 flex items-center gap-2 font-mono tracking-wide uppercase text-blue-400">
                                  {headingText}
                                </h3>
                              );
                            }
                            if (line.startsWith("-")) {
                              const itemText = line.replace(/^-\s*/, "");
                              return (
                                <div key={i} className="flex items-start gap-2.5 pl-2 text-slate-300 text-sm leading-relaxed">
                                  <span className="w-1.5 h-1.5 rounded-full bg-mint mt-2 shrink-0" />
                                  <p className="flex-1">
                                    {parseBoldText(itemText)}
                                  </p>
                                </div>
                              );
                            }
                            return (
                              <p key={i} className="text-slate-300 text-sm leading-relaxed pl-1">
                                {parseBoldText(line)}
                              </p>
                            );
                          })}
                        </div>
                      );
                    })()}

                    <div className="mt-6 flex gap-3">
                      <div className="px-3 py-1 bg-deepBlue/20 border border-deepBlue/40 rounded-md inline-flex items-center gap-2">
                        <Check size={12} className="text-blue-400" />
                        <span className="text-[10px] text-blue-400 font-bold uppercase">
                          Viabilidade Alta
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center opacity-30 text-center px-8"
                  >
                    <Terminal size={48} className="text-slate-500 mb-4" />
                    <p className="text-slate-400 font-mono text-sm">
                      Aguardando input do sistema...
                    </p>
                    <p className="text-slate-600 text-xs mt-2">
                      Digite um desafio operacional ao lado.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {activeMode === "output" && (
              <div className="absolute inset-0 border-2 border-deepBlue/30 rounded-2xl pointer-events-none" />
            )}
          </motion.div>

          {/* INPUT */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={`relative bg-[#0B0C10] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-xl order-1 md:order-2 h-[300px] md:h-full ${
              activeMode === "input" ? "md:flex-[1.5]" : "md:flex-1"
            }`}
          >
            <div className="h-12 border-b border-white/5 bg-[#1a1d21]/50 flex items-center px-4 gap-3 shrink-0">
              <Search size={14} className="text-slate-500" />
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                Terminal de Comando
              </span>
            </div>

            <div className="flex-1 flex flex-col p-6 relative">
              <label className="text-sm text-slate-400 font-medium mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-mint" />
                {hasAnalyzed
                  ? "Analise outro desafio da sua clínica:"
                  : "Qual o maior desafio da sua clínica hoje?"}
              </label>

              <div
                className={`flex-1 bg-[#15191e] border rounded-xl overflow-hidden transition-all duration-300 ${
                  isFocused
                    ? "border-deepBlue/50 shadow-[0_0_20px_rgba(10,36,99,0.3)]"
                    : "border-white/10"
                }`}
              >
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAnalysis();
                    }
                  }}
                  placeholder={
                    hasAnalyzed
                      ? "Digite outro problema para a IA analisar..."
                      : "Ex: 'Minha recepcionista não dá conta de responder todo mundo' ou 'Tenho muita falta em consultas'"
                  }
                  className="w-full h-full bg-transparent p-4 text-white placeholder:text-slate-600 resize-none focus:outline-none text-base md:text-lg leading-relaxed font-light"
                />
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] text-slate-600 bg-white/5 px-2 py-1 rounded border border-white/5 font-mono">
                  Enter para enviar
                </span>

                <button
                  onClick={handleAnalysis}
                  disabled={!query.trim() && !isLoading}
                  className="bg-white text-black px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-deepBlue hover:text-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                  {isLoading ? "Processando..." : hasAnalyzed ? "Nova Análise" : "Gerar Solução"}
                  {!isLoading && <ArrowRight size={16} />}
                </button>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[200px] max-h-[200px] bg-blue-500/10 blur-[50px] pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AutomatedIntelligenceSection;
