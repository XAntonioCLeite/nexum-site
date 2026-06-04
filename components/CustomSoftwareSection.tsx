import React from 'react';
import { ArrowRight, Code, Globe, Cpu, Laptop, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomSoftwareSection: React.FC = () => {
  const services = [
    {
      id: 1,
      title: "Sites & Landing Pages Premium",
      subtitle: "Presença digital inovadora",
      desc: "Desenvolvemos páginas de conversão de alta performance e sites institucionais com design premium, animações fluidas e otimização SEO impecável.",
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      iconBg: "bg-blue-500/10",
      borderColor: "hover:border-blue-500/30",
      features: ["Design exclusivo e responsivo", "Performance ultrarrápida", "SEO e acessibilidade integrados"],
      visual: (
        <div className="relative w-full h-full flex items-center justify-center p-6 bg-gradient-to-b from-blue-900/5 to-transparent">
          {/* Wireframe Mockup */}
          <div className="w-full max-w-[220px] bg-black/50 border border-blue-500/20 rounded-xl p-3 font-mono text-[9px] backdrop-blur-sm relative overflow-hidden transition-transform duration-500">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/60"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/60"></div>
              </div>
              <span className="text-[8px] text-slate-500">nexumai.com</span>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-blue-500/10 rounded border border-blue-500/20 flex items-center px-1.5 justify-between">
                <div className="w-16 h-1.5 bg-blue-400/40 rounded-full"></div>
                <Zap size={8} className="text-blue-400 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 bg-slate-800/40 rounded border border-white/5 p-1 flex flex-col justify-between">
                  <div className="w-8 h-1 bg-slate-600 rounded-full"></div>
                  <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
                </div>
                <div className="h-10 bg-slate-800/40 rounded border border-white/5 p-1 flex flex-col justify-between">
                  <div className="w-10 h-1 bg-slate-600 rounded-full"></div>
                  <div className="w-6 h-1 bg-slate-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Sistemas & Softwares Customizados",
      subtitle: "Automação e eficiência operacional",
      desc: "Criamos sistemas web internos, CRMs personalizados, SaaS escaláveis e dashboards de gestão com foco na produtividade e segurança dos dados.",
      icon: <Code className="w-5 h-5 text-mint" />,
      iconBg: "bg-mint/10",
      borderColor: "hover:border-mint/30",
      features: ["Bancos de dados robustos", "Painéis administrativos completos", "Níveis de permissões de acesso"],
      visual: (
        <div className="relative w-full h-full flex items-center justify-center p-6 bg-gradient-to-b from-mint/5 to-transparent">
          {/* Dashboard Visual */}
          <div className="w-full max-w-[220px] bg-black/50 border border-mint/20 rounded-xl p-3 font-mono text-[9px] backdrop-blur-sm relative transition-transform duration-500">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
              <span className="text-[8px] text-mint font-bold uppercase tracking-wider">Control Panel</span>
              <div className="w-2 h-2 rounded-full bg-mint animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-800/50 rounded p-1 border border-white/5">
                  <div className="text-[6px] text-slate-500">USUÁRIOS</div>
                  <div className="font-bold text-white text-[10px]">1,284</div>
                </div>
                <div className="flex-1 bg-slate-800/50 rounded p-1 border border-white/5">
                  <div className="text-[6px] text-slate-500">RECEITA</div>
                  <div className="font-bold text-mint text-[10px]">+24%</div>
                </div>
              </div>
              <div className="h-6 bg-[#00d9a3]/5 border border-mint/20 rounded flex items-center justify-center gap-1.5">
                <span className="w-1 h-1 bg-mint rounded-full"></span>
                <span className="text-[7px] text-mint uppercase font-bold">Servidor Saudável</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Integrações & APIs Escaláveis",
      subtitle: "Conectividade sem atrito",
      desc: "Conectamos suas ferramentas de trabalho preferidas (CRMs, ERPs, gateways de pagamento, APIs e WhatsApp) criando fluxos de dados otimizados.",
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      iconBg: "bg-indigo-500/10",
      borderColor: "hover:border-indigo-500/30",
      features: ["Sincronização em tempo real", "Segurança via criptografia", "Automações automatizadas (n8n/Make)"],
      visual: (
        <div className="relative w-full h-full flex items-center justify-center p-6 bg-gradient-to-b from-indigo-950/5 to-transparent">
          {/* Connection Visual */}
          <div className="flex items-center justify-center w-full gap-4 relative z-10 scale-95 transition-transform duration-500">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center">
              <Laptop size={16} className="text-slate-300" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-600 via-indigo-500 to-slate-600 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Layers size={16} className="text-indigo-400" />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="dev-services" className="w-full bg-[#070709] py-24 relative overflow-hidden border-t border-white/5 scroll-mt-32 z-20">
      {/* Subtle Lighting Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold"
            >
              <Zap size={12} className="text-blue-400" />
              <span>Soluções sob medida</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]"
            >
              Criamos sites e sistemas <br />
              <span className="text-slate-400">customizados para empresas.</span>
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-sm flex flex-col gap-6"
          >
            <p className="text-lg text-slate-400 leading-relaxed">
              Além de inteligência artificial, construímos sistemas e sites robustos, planejados sob medida e perfeitamente adequados à necessidade específica do seu negócio.
            </p>
            <a 
              href="https://wa.me/5527995331369" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-white transition-colors font-medium group"
            >
              Fale com um Engenheiro
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((svc, idx) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative min-h-[480px] rounded-3xl bg-[#0f1214] border border-white/10 ${svc.borderColor} transition-all duration-500 overflow-hidden flex flex-col`}
            >
              {/* Visual Header */}
              <div className="h-44 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                {svc.visual}
              </div>

              {/* Content */}
              <div className="p-8 pt-6 mt-auto border-t border-white/5 bg-[#0f1214] relative z-20 flex-1 flex flex-col">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-white/10 ${svc.iconBg}`}>
                  {svc.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">
                  {svc.title}
                </h3>
                <span className="text-xs text-blue-400 font-medium mb-3 block font-mono">
                  {svc.subtitle}
                </span>
                
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {svc.desc}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mt-auto border-t border-white/5 pt-4">
                  {svc.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CustomSoftwareSection;
