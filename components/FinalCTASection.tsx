import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, User, Users, TrendingDown, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Banknote } from 'lucide-react';

const FinalCTASection: React.FC = () => {
  return (
    <section className="w-full bg-black py-32 relative overflow-hidden flex flex-col items-center">
      
      {/* Background Ambience - Deep Blue */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-deepBlue/20 via-black to-black pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 w-full">
        
        {/* 1. THE ANCHOR: Comparison Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden mb-24 relative"
        >
          {/* Subtle Glow behind the card */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-deepBlue/10 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 relative">
            
            {/* LEFT COLUMN: The Old Way */}
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 relative">
              <div className="flex items-center gap-3 mb-8 opacity-70">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-400/70" />
                </div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Atendimento Convencional</h3>
              </div>

              <div className="space-y-8">
                {/* Item 1 */}
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Clock className="w-5 h-5 text-orange-400/50" />
                  </div>
                  <div>
                    <p className="text-zinc-500 font-medium text-sm mb-1">Disponibilidade</p>
                    <p className="text-zinc-400 text-lg">8h/dia (Horário Comercial)</p>
                  </div>
                </div>
                {/* Item 2 */}
                <div className="flex gap-4">
                  <div className="mt-1">
                    <AlertCircle className="w-5 h-5 text-orange-400/50" />
                  </div>
                  <div>
                    <p className="text-zinc-500 font-medium text-sm mb-1">Tempo de Resposta</p>
                    <p className="text-zinc-400 text-lg">Minutos ou Horas (Filas)</p>
                  </div>
                </div>
                {/* Item 3 */}
                <div className="flex gap-4">
                  <div className="mt-1">
                    <User className="w-5 h-5 text-orange-400/50" />
                  </div>
                  <div>
                    <p className="text-zinc-500 font-medium text-sm mb-1">Capacidade</p>
                    <p className="text-zinc-400 text-lg">1 paciente por vez</p>
                  </div>
                </div>
                 {/* Item 4 */}
                 <div className="flex gap-4">
                  <div className="mt-1">
                    <Banknote className="w-5 h-5 text-orange-400/50" />
                  </div>
                  <div>
                    <p className="text-zinc-500 font-medium text-sm mb-1">Custo Real</p>
                    <p className="text-zinc-400 text-lg">Salário + Encargos + Treinamento</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: The Solution (Nexum) */}
            <div className="p-8 md:p-12 relative bg-white/[0.02]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white tracking-tight">Nexum AI</span>
                </div>
                <span className="px-3 py-1 bg-deepBlue/20 border border-deepBlue/40 rounded-full text-[10px] font-bold text-blue-400 uppercase">
                  Recomendado
                </span>
              </div>

              <div className="space-y-8">
                {/* Item 1 */}
                <div className="flex gap-4 group">
                  {/* Mint Icon Background for Contrast */}
                  <div className="mt-1 bg-mint/10 p-1 rounded-full">
                    <Zap className="w-4 h-4 text-mint" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium text-sm mb-1">Disponibilidade</p>
                    <p className="text-white text-lg font-medium group-hover:text-blue-400 transition-colors">24h/7 dias (Incluindo Feriados)</p>
                  </div>
                </div>
                {/* Item 2 */}
                <div className="flex gap-4 group">
                  <div className="mt-1 bg-mint/10 p-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-mint" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium text-sm mb-1">Tempo de Resposta</p>
                    <p className="text-white text-lg font-medium group-hover:text-blue-400 transition-colors">Instantâneo (0 segundos)</p>
                  </div>
                </div>
                {/* Item 3 */}
                <div className="flex gap-4 group">
                  <div className="mt-1 bg-mint/10 p-1 rounded-full">
                    <Users className="w-4 h-4 text-mint" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium text-sm mb-1">Capacidade</p>
                    <p className="text-white text-lg font-medium group-hover:text-blue-400 transition-colors">Escala Ilimitada (Simultâneo)</p>
                  </div>
                </div>
                 {/* Item 4 */}
                 <div className="flex gap-4 group">
                  <div className="mt-1 bg-mint/10 p-1 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-mint" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium text-sm mb-1">Custo Real</p>
                    <p className="text-white text-lg font-medium group-hover:text-blue-400 transition-colors">Investimento Fixo & Previsível</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* 2. THE PUSH: Final Call to Action */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6"
          >
            Pare de perder pacientes <br/> para a <span className="text-slate-500 line-through decoration-red-500/50 decoration-4">espera</span>.
          </motion.h2>

          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.25 }}
             transition={{ duration: 0.6, delay: 0.1 }}
             className="text-xl text-slate-400 font-light mb-10"
          >
             Sua recepção automatizada e eficiente está a uma conversa de distância.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <a 
              href="https://wa.me/5527995331369" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-10 py-5 text-lg bg-deepBlue text-white font-bold rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(10,36,99,0.5)] transition-all flex items-center gap-3 group relative overflow-hidden"
            >
               <span className="relative z-10">Agendar Consultoria Gratuita</span>
               <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
               
               {/* Shine Effect */}
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full skew-y-12"></div>
            </a>
            
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 opacity-80">
               {/* Shield Check Mint for Contrast */}
               <ShieldCheck size={12} className="text-mint" />
               Implementação guiada em 5 a 10 dias.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default FinalCTASection;