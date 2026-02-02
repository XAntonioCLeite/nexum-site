import React from 'react';
import { Plus, ArrowRight, Zap, Shield, BarChart3, BrainCircuit, MessageCircle, Calendar, Database, Check } from 'lucide-react';

const FeaturesGrid: React.FC = () => {
  return (
    <div id="features" className="w-full bg-black py-24 relative z-20 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section: 2 Columns */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Feito para clínicas <br />
              <span className="text-slate-400">modernas e eficientes.</span>
            </h2>
          </div>
          <div className="max-w-sm flex flex-col gap-6">
            <p className="text-lg text-slate-400 leading-relaxed">
              Uma plataforma completa que une atendimento humanizado e automação de ponta para transformar sua gestão.
            </p>
            <a 
              href="https://wa.me/+5577981349192" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-white transition-colors font-medium group"
            >
              Faça a mudança
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Grid Section: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: NLP / Brain */}
          <div className="group relative min-h-[480px] rounded-3xl bg-[#0f1214] border border-white/10 hover:border-deepBlue/50 transition-all duration-500 overflow-hidden flex flex-col">
            {/* Graphic Placeholder */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-transparent to-black/20">
               {/* Background Grid */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20"></div>
               
               {/* Cyberpunk Brain Visual */}
               <div className="relative z-10">
                  <div className="absolute inset-0 bg-deepBlue/30 blur-3xl rounded-full animate-pulse-slow"></div>
                  <div className="relative w-24 h-24 bg-black/40 backdrop-blur-md rounded-2xl border border-deepBlue/40 flex items-center justify-center shadow-[0_0_30px_rgba(10,36,99,0.25)] group-hover:scale-110 transition-transform duration-500">
                    <BrainCircuit className="text-blue-400 w-12 h-12" strokeWidth={1.5} />
                  </div>
                  {/* Nodes connecting - Keep small dots mint for contrast */}
                  <div className="absolute -top-8 -right-8 w-3 h-3 bg-mint rounded-full animate-ping opacity-20"></div>
                  <div className="absolute -bottom-4 -left-10 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-30 delay-300"></div>
                  <div className="absolute top-1/2 -right-16 w-32 h-px bg-gradient-to-r from-deepBlue to-transparent"></div>
                  <div className="absolute top-1/2 -left-16 w-32 h-px bg-gradient-to-l from-deepBlue to-transparent"></div>
               </div>
            </div>

            {/* Card Footer */}
            <div className="p-8 pt-6 mt-auto border-t border-white/5 bg-[#0f1214] relative z-20">
              <div className="flex justify-between items-start mb-4">
                 <h3 className="text-xl font-bold text-white">Processamento de Linguagem Natural</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Modelos avançados (GPT-4/Claude) treinados especificamente com as regras, preços e procedimentos da sua clínica.
              </p>
            </div>
          </div>

          {/* Card 2: Ecosystem / Integration */}
          <div className="group relative min-h-[480px] rounded-3xl bg-[#0f1214] border border-white/10 hover:border-blue-500/30 transition-all duration-500 overflow-hidden flex flex-col">
            {/* Graphic Placeholder */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 to-transparent opacity-50"></div>
                
                {/* Connection Visual */}
                <div className="flex items-center justify-center w-full gap-4 md:gap-8 px-4 relative z-10">
                   
                   {/* Left Node: Database/ERP */}
                   <div className="flex flex-col items-center gap-2 group/node transition-all duration-500 opacity-60 group-hover:opacity-100">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center">
                        <Database size={20} className="text-slate-300" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono uppercase">ERP</span>
                   </div>

                   {/* Connecting Line Left */}
                   <div className="h-px flex-1 bg-gradient-to-r from-slate-600 to-deepBlue relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                   </div>

                   {/* Center: WhatsApp */}
                   <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,211,102,0.2)] group-hover:scale-110 transition-transform duration-300 z-20 relative">
                      <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping opacity-20"></div>
                      <MessageCircle className="text-white w-10 h-10 fill-current" />
                   </div>

                   {/* Connecting Line Right */}
                   <div className="h-px flex-1 bg-gradient-to-l from-slate-600 to-deepBlue relative">
                       <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                   </div>

                   {/* Right Node: Agenda */}
                   <div className="flex flex-col items-center gap-2 group/node transition-all duration-500 opacity-60 group-hover:opacity-100">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center">
                        <Calendar size={20} className="text-slate-300" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono uppercase">Agenda</span>
                   </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="p-8 pt-6 mt-auto border-t border-white/5 bg-[#0f1214] relative z-20">
              <div className="flex justify-between items-start mb-4">
                 <h3 className="text-xl font-bold text-white">Ecossistema Integrado</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Conectamos o WhatsApp diretamente ao seu ERP e CRM. Sincronização bidirecional de dados de pacientes e agenda.
              </p>
            </div>
          </div>

          {/* Card 3: No-Show / Checklist */}
          <div className="group relative min-h-[480px] rounded-3xl bg-[#0f1214] border border-white/10 hover:border-yellow-500/30 transition-all duration-500 overflow-hidden flex flex-col">
             {/* Graphic Placeholder */}
             <div className="flex-1 relative overflow-hidden p-8 flex items-center justify-center bg-gradient-to-b from-transparent to-yellow-900/5">
                
                {/* Checklist UI */}
                <div className="w-64 bg-[#1a1d21] border border-white/10 rounded-xl p-4 shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500">
                   <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tarefas da IA</span>
                      <div className="px-2 py-0.5 bg-green-500/20 rounded text-[10px] text-green-400 font-bold">AUTO</div>
                   </div>
                   
                   <div className="space-y-3">
                      {/* Item 1 */}
                      <div className="flex items-center gap-3 opacity-50">
                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <Check size={12} className="text-black font-bold" />
                         </div>
                         <div className="flex-1">
                            <div className="h-1.5 w-20 bg-slate-600 rounded mb-1"></div>
                            <div className="h-1.5 w-12 bg-slate-700 rounded"></div>
                         </div>
                      </div>
                      {/* Item 2 */}
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                            <Check size={12} className="text-black font-bold" />
                         </div>
                         <div className="flex-1">
                            <p className="text-xs text-slate-300">Lembrete enviado</p>
                            <p className="text-[10px] text-slate-500">Há 2 min</p>
                         </div>
                      </div>
                      {/* Item 3 */}
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                            <Check size={12} className="text-black font-bold" />
                         </div>
                         <div className="flex-1">
                            <p className="text-xs text-slate-300">Vaga preenchida</p>
                            <p className="text-[10px] text-slate-500">Lista de espera</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute bottom-8 right-8 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full backdrop-blur-md">
                   <span className="text-[10px] font-bold text-yellow-500 uppercase">Agenda Lotada</span>
                </div>
             </div>

            {/* Card Footer */}
            <div className="p-8 pt-6 mt-auto border-t border-white/5 bg-[#0f1214] relative z-20">
              <div className="flex justify-between items-start mb-4">
                 <h3 className="text-xl font-bold text-white">Gestão Autônoma de No-Show</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Lembretes inteligentes e reagendamento automático. O sistema recupera espaços vazios na agenda sem intervenção humana.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeaturesGrid;