import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock, PhoneOff, AlertTriangle, ArrowRight } from 'lucide-react';

const ComparisonSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Otimização de Performance:
  // Em vez de rastrear o mouse (que causa re-renders constantes), 
  // usamos a posição do scroll nativo. É muito mais leve para a CPU/GPU.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Efeito Parallax:
  // Definimos velocidades verticais diferentes para cada card.
  // Conforme o usuário rola a página, os cards se "deslocam" em ritmos diferentes.
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);  // Sobe mais rápido
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 40]);   // Desce um pouco
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]); // Sobe muito rápido (frente)

  return (
    <section ref={containerRef} className="w-full bg-black py-32 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-mint/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT COLUMN: THE SOLUTION */}
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
              <span className="text-xs font-bold text-yellow-400 tracking-wide uppercase">Automação Inteligente</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight"
            >
              Sua recepção não precisa ser um <span className="text-slate-500 decoration-yellow-400/50 underline decoration-2 underline-offset-4">gargalo</span>.
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-400 leading-relaxed max-w-lg"
            >
              Elimine a espera no WhatsApp e os furos na agenda. A Nexum automatiza o atendimento da sua clínica 24/7 com precisão humana, transformando caos em conversão.
            </motion.p>
          </div>

          {/* RIGHT COLUMN: THE PROBLEM (CHAOS) - SCROLL PARALLAX */}
          <div className="relative h-[500px] w-full flex items-center justify-center group cursor-default">
             {/* Decorative Grid behind cards */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 mask-radial" />

             {/* Card 1: Waiting Time (Top Right) - Moves Up Slowly */}
             <motion.div 
               style={{ y: y1 }}
               className="absolute top-10 right-0 md:right-10 z-20 will-change-transform"
             >
                <div className="bg-[#18181b] border border-red-500/20 p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(239,68,68,0.15)] w-64 md:w-72">
                   <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                         <Clock size={20} />
                      </div>
                      <div>
                         <h4 className="text-white font-medium text-sm">Tempo de Resposta</h4>
                         <p className="text-red-300/80 text-xs mt-1">Paciente aguardando resposta há 4 horas...</p>
                         <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-[80%]"></div>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>

             {/* Card 2: Lost Lead (Center Left) - Moves Down Slowly */}
             <motion.div 
               style={{ y: y2 }}
               className="absolute top-1/2 left-0 md:left-4 -translate-y-1/2 z-30 will-change-transform"
             >
                <div className="bg-[#18181b] border border-orange-500/20 p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(249,115,22,0.15)] w-72">
                   <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                         <span className="text-xs text-slate-400">JD</span>
                      </div>
                      <div className="flex-1">
                         <div className="h-2 w-24 bg-zinc-800 rounded mb-1"></div>
                         <div className="h-2 w-16 bg-zinc-800 rounded"></div>
                      </div>
                      <PhoneOff size={16} className="text-orange-500" />
                   </div>
                   <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                      <p className="text-red-400 text-xs font-medium flex items-center gap-2">
                         <AlertTriangle size={12} />
                         Agendamento Perdido
                      </p>
                      <p className="text-slate-500 text-[10px] mt-1">Telefone ocupado. Cliente desistiu.</p>
                   </div>
                </div>
             </motion.div>

             {/* Card 3: Overload (Bottom Right) - Moves Up Fast */}
             <motion.div 
               style={{ y: y3 }}
               className="absolute bottom-12 right-4 md:right-12 z-10 will-change-transform"
             >
                <div className="bg-[#18181b] border border-zinc-700/50 p-5 rounded-xl shadow-2xl w-64">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-mono text-slate-500 uppercase">Status da Recepção</span>
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-400">Fila WhatsApp</span>
                         <span className="text-red-400 font-bold">42 msgs</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-400">Ligações</span>
                         <span className="text-orange-400 font-bold">5 na fila</span>
                      </div>
                      <div className="pt-2 border-t border-white/5">
                         <p className="text-xs text-center text-slate-500 italic">"Não dou conta de atender..."</p>
                      </div>
                   </div>
                </div>
             </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;