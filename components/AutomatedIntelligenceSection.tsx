import React, { useState, useEffect } from 'react';
import { Check, BarChart2, Search, Sparkles, Command, ArrowRight, Loader2, Terminal, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

// Context specifically tuned for this dashboard analysis view
const DASHBOARD_CONTEXT = `
Você é o "Nexum Core", o cérebro central de inteligência da Nexum AI.
Sua função nesta interface é analisar inputs estratégicos de donos de clínicas e fornecer insights rápidos, diretos e valiosos sobre como a automação via WhatsApp resolveria os problemas citados.

CONTEXTO DA EMPRESA:
A Nexum AI automatiza o atendimento de clínicas via WhatsApp.
Resolvemos: No-show (faltas), demora na resposta, perda de leads, burocracia de agendamento.
Tecnologia: IA Generativa que entende contexto, não é um chatbot de botões.

SEU COMPORTAMENTO:
1. Respostas curtas e analíticas (Estilo Dashboard).
2. Use formatação Markdown (negrito, listas) para facilitar leitura rápida.
3. Foque em ROI, Eficiência e Solução Técnica.
4. Se o usuário digitar algo vago, dê um exemplo de automação.

Exemplo de Input: "Muitos pacientes faltam"
Exemplo de Output:
"**Análise de Risco:** Alta taxa de no-show.
**Solução Nexum:**
1. Confirmação automática 24h antes.
2. Reagendamento imediato em caso de negativa.
3. Lista de espera automática para preencher a vaga.
**Impacto:** Redução estimada de 60% nas faltas."
`;

const AutomatedIntelligenceSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false); // Tracks if user has performed at least one analysis
  
  // State to control which side is expanded: 'input' (right) or 'output' (left)
  const [activeMode, setActiveMode] = useState<'input' | 'output'>('input');

  // Update layout mode based on user interaction
  useEffect(() => {
    if (isLoading || (response && !isFocused)) {
      setActiveMode('output');
    } else if (isFocused || !response) {
      setActiveMode('input');
    }
  }, [isLoading, response, isFocused]);

  const handleAnalysis = async () => {
    if (!query.trim()) return;

    const currentQuery = query; // Capture current query to send to API
    setQuery(''); // Clear input field immediately for better UX
    setIsLoading(true);
    setResponse(null); // Clear previous response to trigger loading state visually
    setHasAnalyzed(true); // Mark that we have done at least one analysis

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: currentQuery,
        config: {
          systemInstruction: DASHBOARD_CONTEXT,
        }
      });
      
      const text = result.text;
      setResponse(text || "Sem análise disponível.");
    } catch (error) {
      console.error("Error:", error);
      setResponse("**Erro de conexão.**\nNão foi possível processar sua solicitação no momento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalysis();
    }
  };

  return (
    <section id="demo" className="w-full bg-[#0B0C10] py-24 relative overflow-hidden border-t border-white/5 scroll-mt-32">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Ambient Glow - Deep Blue */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-deepBlue/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Teste a Inteligência Nexum</h2>
            <p className="text-slate-400">Descreva um problema da sua clínica e veja como nossa IA analisa e resolve.</p>
        </div>

        {/* Dynamic Container */}
        <div className="flex flex-col md:flex-row gap-6 h-[500px] w-full">
          
          {/* LEFT COLUMN: AI OUTPUT (Expands when creating result) */}
          <motion.div 
            layout
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className={`relative bg-[#121418] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl ${
              activeMode === 'output' ? 'md:flex-[1.5]' : 'md:flex-1'
            }`}
          >
             {/* Header */}
             <div className="h-12 border-b border-white/5 bg-[#1a1d21] flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-2">
                   {/* Status Dot - Mint for contrast */}
                   <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-mint'}`}></div>
                   <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                     {isLoading ? 'PROCESSANDO DADOS...' : 'NEXUM CORE OUTPUT'}
                   </span>
                </div>
                <Cpu size={14} className="text-slate-600" />
             </div>

             {/* Content Area */}
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
                      <p className="text-slate-500 text-sm font-mono animate-pulse">Analisando cenário...</p>
                    </motion.div>
                  ) : response ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="prose prose-invert prose-sm max-w-none"
                    >
                      {/* Simple markdown rendering */}
                      {response.split('\n').map((line, i) => (
                        <p key={i} className={`text-slate-300 leading-relaxed ${line.startsWith('**') ? 'text-white font-medium mb-1 mt-3' : 'mb-1'}`}>
                          {line.replace(/\*\*/g, '')}
                        </p>
                      ))}
                      
                      <div className="mt-6 flex gap-3">
                         <div className="px-3 py-1 bg-deepBlue/20 border border-deepBlue/40 rounded-md inline-flex items-center gap-2">
                            <Check size={12} className="text-blue-400" />
                            <span className="text-[10px] text-blue-400 font-bold uppercase">Viabilidade Alta</span>
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
                      <p className="text-slate-400 font-mono text-sm">Aguardando input do sistema...</p>
                      <p className="text-slate-600 text-xs mt-2">Digite um desafio operacional ao lado.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
             
             {/* Glow Effect when active */}
             {activeMode === 'output' && (
               <div className="absolute inset-0 border-2 border-deepBlue/30 rounded-2xl pointer-events-none"></div>
             )}
          </motion.div>


          {/* RIGHT COLUMN: USER INPUT (Expands when typing) */}
          <motion.div 
            layout
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className={`relative bg-[#0B0C10] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-xl ${
               activeMode === 'input' ? 'md:flex-[1.5]' : 'md:flex-1'
            }`}
          >
            {/* Header */}
            <div className="h-12 border-b border-white/5 bg-[#1a1d21]/50 flex items-center px-4 gap-3 shrink-0">
               <Search size={14} className="text-slate-500" />
               <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Terminal de Comando</span>
            </div>

            {/* Input Wrapper */}
            <div className="flex-1 flex flex-col p-6 relative">
               <label className="text-sm text-slate-400 font-medium mb-3 flex items-center gap-2">
                 {/* Sparkles using Mint for contrast */}
                 <Sparkles size={14} className="text-mint" />
                 {hasAnalyzed ? "Analise outro desafio da sua clínica:" : "Qual o maior desafio da sua clínica hoje?"}
               </label>
               
               <div className={`flex-1 bg-[#15191e] border rounded-xl overflow-hidden transition-all duration-300 ${isFocused ? 'border-deepBlue/50 shadow-[0_0_20px_rgba(10,36,99,0.3)]' : 'border-white/10'}`}>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder={hasAnalyzed 
                      ? "Digite outro problema para a IA analisar..." 
                      : "Ex: 'Minha recepcionista não dá conta de responder todo mundo' ou 'Tenho muita falta em consultas'"}
                    className="w-full h-full bg-transparent p-4 text-white placeholder:text-slate-600 resize-none focus:outline-none text-base md:text-lg leading-relaxed font-light"
                  />
               </div>

               <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-2">
                     <span className="text-[10px] text-slate-600 bg-white/5 px-2 py-1 rounded border border-white/5 font-mono">Enter para enviar</span>
                  </div>
                  <button 
                    onClick={handleAnalysis}
                    disabled={!query.trim() && !isLoading}
                    className="bg-white text-black px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-deepBlue hover:text-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                  >
                    {isLoading ? 'Processando...' : (hasAnalyzed ? 'Nova Análise' : 'Gerar Solução')}
                    {!isLoading && <ArrowRight size={16} />}
                  </button>
               </div>
            </div>

            {/* Decorative background glow behind input */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[200px] max-h-[200px] bg-blue-500/10 blur-[50px] pointer-events-none"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AutomatedIntelligenceSection;