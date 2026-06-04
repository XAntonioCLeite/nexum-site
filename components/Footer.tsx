import React from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import logoInversa from '../public/logo-inversa.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const whatsappLink = "https://wa.me/5527995331369";

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-black relative overflow-hidden pt-24 pb-8 border-t border-white/5">
      
      {/* Gradient Overlay - Moved to back */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent z-0 pointer-events-none"></div>

      {/* 
        GIANT WATERMARK EFFECT 
        - Moved after gradient to ensure visibility
        - Changed to white with low opacity for better contrast against black
      */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
         <span className="text-[23vw] font-black text-white tracking-tighter leading-none whitespace-nowrap transform translate-y-16 opacity-[0.04]">
            NEXUM AI
         </span>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* 3-Column Grid (Optimized for no dead links) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src={logoInversa} alt="Nexum AI Logo" className="h-10 w-auto object-contain" />
              <span className="text-xl font-bold text-white tracking-tight">Nexum AI</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Automação inteligente para clínicas que valorizam o atendimento humano. Escalar sem perder a essência.
            </p>
          </div>

          {/* Column 2: Navigation (Internal Anchors) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold tracking-wide">Navegação</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#features" 
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="text-zinc-500 hover:text-blue-400 transition-colors text-sm cursor-pointer"
                >
                  Funcionalidades
                </a>
              </li>
              <li>
                <a 
                  href="#demo" 
                  onClick={(e) => scrollToSection(e, 'demo')}
                  className="text-zinc-500 hover:text-blue-400 transition-colors text-sm cursor-pointer"
                >
                  Teste a Inteligência
                </a>
              </li>
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => scrollToSection(e, 'how-it-works')}
                  className="text-zinc-500 hover:text-blue-400 transition-colors text-sm cursor-pointer"
                >
                  Como Funciona
                </a>
              </li>
              <li>
                <a 
                  href="#faq" 
                  onClick={(e) => scrollToSection(e, 'faq')}
                  className="text-zinc-500 hover:text-blue-400 transition-colors text-sm cursor-pointer"
                >
                  Dúvidas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact (All WhatsApp) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold tracking-wide">Fale Conosco</h3>
            <ul className="space-y-3">
              <li>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-400 transition-colors text-sm flex items-center gap-2 group">
                  Agendar Consultoria
                  <ArrowUpRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-400 transition-colors text-sm flex items-center gap-2 group">
                  Suporte Comercial
                  <ArrowUpRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                 <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-deepBlue hover:text-white hover:border-deepBlue transition-all text-sm font-medium">
                    <MessageCircle size={16} />
                    Chamar no WhatsApp
                 </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs md:text-sm">
            © {currentYear} Nexum AI. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-white/5">
             <span className="relative flex h-2 w-2">
               {/* Kept Green/Mint for 'Online' status contrast */}
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-mint"></span>
             </span>
             <span className="text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-wider">
               Sistemas Operacionais
             </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;