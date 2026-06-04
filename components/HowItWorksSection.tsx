import React, { useState } from 'react';
import { Moon, MessageCircle, BrainCircuit, CalendarCheck, Rocket, Check, Zap, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(1);
  const steps = [
    {
      id: 1,
      title: "Paciente chama (23:45h)",
      desc: "O paciente envia uma mensagem fora do horário comercial querendo agendar. Com a nossa ajuda, isso deixa de ser uma oportunidade perdida.",
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      iconBg: "bg-indigo-500/10",
      borderColor: "group-hover:border-indigo-500/30",
      lineColor: "bg-indigo-500",
      visual: (
        <div className="relative w-full h-full flex items-center justify-center p-6">
           {/* Abstract Chat Bubble */}
           <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl rounded-tr-sm shadow-xl max-w-[200px] transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-2 opacity-50">
                 <div className="w-6 h-6 rounded-full bg-slate-500"></div>
                 <div className="h-2 w-16 bg-slate-500 rounded-full"></div>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                 Olá, tem horário para dermatologista amanhã?
              </p>
              <div className="absolute -right-2 -bottom-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-[#121215]">
                 <MessageCircle size={12} className="text-white" />
              </div>
           </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Compreensão de Contexto",
      desc: "A IA não pede para 'digitar 1'. Ela lê a mensagem, entende a intenção, checa a especialidade e verifica a disponibilidade.",
      icon: <BrainCircuit className="w-5 h-5 text-pink-400" />,
      iconBg: "bg-pink-500/10",
      borderColor: "group-hover:border-pink-500/30",
      lineColor: "bg-pink-500",
      visual: (
        <div className="relative w-full h-full flex items-center justify-center p-6">
           {/* Abstract Code Block */}
           <div className="w-full max-w-[220px] bg-black/40 border border-pink-500/20 rounded-xl p-3 font-mono text-[10px] backdrop-blur-sm shadow-[0_0_20px_rgba(236,72,153,0.1)]">
              <div className="flex gap-1.5 mb-2 opacity-50">
                 <div className="w-2 h-2 rounded-full bg-red-500"></div>
                 <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-1.5">
                 <div className="flex justify-between">
                    <span className="text-slate-500">Intent:</span>
                    <span className="text-pink-400">"Scheduling"</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500">Doc:</span>
                    <span className="text-white">"Dr. Ana"</span>
                 </div>
                 <div className="h-px bg-white/5 my-1.5"></div>
                 <div className="flex items-center gap-1.5 text-green-400">
                    <Zap size={10} />
                    <span>Processing...</span>
                 </div>
              </div>
           </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Agendamento Autônomo",
      desc: "A Nexum oferece os horários livres, tira dúvidas sobre convênios e confirma o agendamento em segundos, integrando direto no seu calendário.",
      icon: <CalendarCheck className="w-5 h-5 text-deepBlue" />,
      iconBg: "bg-deepBlue/20",
      borderColor: "group-hover:border-deepBlue/50",
      lineColor: "bg-deepBlue",
      visual: (
        <div className="relative w-full h-full flex items-center justify-center p-6">
           {/* Abstract Calendar */}
           <div className="grid grid-cols-3 gap-2 w-[160px]">
              {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className={`aspect-square rounded-md border ${i === 5 ? 'bg-deepBlue border-deepBlue shadow-[0_0_15px_rgba(10,36,99,0.5)] scale-110 z-10' : 'bg-white/5 border-white/5'} flex items-center justify-center transition-all duration-500`}>
                    {/* Check uses Mint for contrast against the blue background */}
                    {i === 5 ? <Check size={16} className="text-white stroke-[3]" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/10" />}
                 </div>
              ))}
           </div>
           {/* Success Badge */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 ml-8 bg-[#121215] border border-mint/30 px-2 py-1 rounded-md shadow-lg flex items-center gap-1 animate-float">
              <span className="w-1.5 h-1.5 bg-mint rounded-full animate-pulse"></span>
              <span className="text-[8px] text-mint font-bold uppercase">Confirmado</span>
           </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Agenda Otimizada",
      desc: "Paciente agendado, lembretes de confirmação configurados e recepção livre para focar no atendimento presencial. Zero no-show.",
      icon: <Rocket className="w-5 h-5 text-blue-400" />,
      iconBg: "bg-blue-500/10",
      borderColor: "group-hover:border-blue-500/30",
      lineColor: "bg-blue-500",
      visual: (
        <div className="relative w-full h-full flex items-center justify-center p-6">
           {/* Abstract Chart */}
           <div className="flex items-end gap-2 h-24">
              <div className="w-8 bg-blue-900/20 h-[40%] rounded-t-sm border-t border-x border-blue-500/20"></div>
              <div className="w-8 bg-blue-700/30 h-[60%] rounded-t-sm border-t border-x border-blue-500/30"></div>
              <div className="w-8 bg-blue-500 h-[90%] rounded-t-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] relative group-hover:h-[95%] transition-all duration-500">
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ROI
                 </div>
              </div>
           </div>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="w-full bg-black py-24 relative overflow-hidden scroll-mt-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#000,transparent_100%)] z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-20">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.25 }}
             className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight"
           >
             Como funciona?
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.25 }}
             transition={{ delay: 0.1 }}
             className="text-slate-400 text-lg"
           >
             A jornada do paciente, do 'oi' ao agendamento confirmado.
           </motion.p>
        </div>

        {/* Desktop View: Cards Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {steps.map((step, index) => (
             <motion.div
               key={step.id}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, amount: 0.25 }}
               transition={{ delay: index * 0.1 }}
               className={`group relative bg-[#121215] border border-white/10 rounded-2xl overflow-hidden ${step.borderColor} hover:border-opacity-100 transition-all duration-300 flex flex-col`}
             >
                {/* Visual Header */}
                <div className="h-48 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden">
                   {/* Grid Pattern inside visual */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                   {step.visual}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col bg-[#121215] relative z-10">
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-white/10 ${step.iconBg}`}>
                      {step.icon}
                   </div>
                   
                   <h3 className="text-lg font-bold text-white mb-3 group-hover:text-white transition-colors">
                     {step.title}
                   </h3>
                   
                   <p className="text-sm text-slate-400 leading-relaxed">
                     {step.desc}
                   </p>

                   {/* Step Number Background */}
                   <div className="absolute top-4 right-4 text-4xl font-bold text-white/5 select-none font-mono group-hover:text-white/10 transition-colors">
                      0{step.id}
                   </div>
                </div>

                {/* Bottom Highlight Line */}
                <div className={`absolute bottom-0 left-0 w-full h-1 ${step.lineColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
             </motion.div>
           ))}
        </div>

        {/* Mobile View: Accordion Layout */}
        <div className="md:hidden flex flex-col gap-4">
          {steps.map((step) => {
            const isOpen = activeStep === step.id;
            return (
              <div 
                key={step.id}
                className={`border rounded-2xl bg-[#121215] transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-deepBlue/50 shadow-[0_0_20px_rgba(10,36,99,0.2)]' : 'border-white/10'
                }`}
              >
                <button
                  onClick={() => setActiveStep(isOpen ? null : step.id)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none bg-transparent"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-slate-500">0{step.id}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 ${step.iconBg}`}>
                      {step.icon}
                    </div>
                    <span className={`text-base font-bold transition-colors ${isOpen ? 'text-white' : 'text-slate-300'}`}>
                      {step.title}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-white/5 flex flex-col gap-4">
                        {/* Visual Mockup inside Accordion */}
                        <div className="h-40 rounded-xl bg-black/40 border border-white/5 overflow-hidden relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:12px_12px] opacity-20"></div>
                          <div className="scale-90 w-full h-full flex items-center justify-center">
                            {step.visual}
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;