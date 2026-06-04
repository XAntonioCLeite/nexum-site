import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from './components/HeroSection';
import BusinessChatWidget from './components/BusinessChatWidget';
import Footer from './components/Footer';
import logoInversa from './public/logo-inversa.png';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black selection:bg-deepBlue selection:text-white relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logoInversa} alt="Nexum AI Logo" className="h-10 w-auto object-contain" />
            <span className="text-xl font-bold text-white tracking-tight">Nexum AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a 
              href="#features" 
              onClick={(e) => scrollToSection(e, 'features')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Funcionalidades
            </a>
            <a 
              href="#demo" 
              onClick={(e) => scrollToSection(e, 'demo')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Teste a IA
            </a>
            <a 
              href="#dev-services" 
              onClick={(e) => scrollToSection(e, 'dev-services')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Sistemas e Sites
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Como Funciona
            </a>
            <a 
              href="#faq" 
              onClick={(e) => scrollToSection(e, 'faq')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/5527995331369" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:block text-sm font-medium bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:border-deepBlue/50 hover:text-white"
            >
              Falar com Consultor
            </a>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
              aria-label="Alternar Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed top-20 left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 z-40 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-6 text-base font-semibold text-slate-300">
              <a 
                href="#features" 
                onClick={(e) => { scrollToSection(e, 'features'); setIsMenuOpen(false); }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Funcionalidades
              </a>
              <a 
                href="#demo" 
                onClick={(e) => { scrollToSection(e, 'demo'); setIsMenuOpen(false); }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Teste a IA
              </a>
              <a 
                href="#dev-services" 
                onClick={(e) => { scrollToSection(e, 'dev-services'); setIsMenuOpen(false); }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Sistemas e Sites
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => { scrollToSection(e, 'how-it-works'); setIsMenuOpen(false); }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Como Funciona
              </a>
              <a 
                href="#faq" 
                onClick={(e) => { scrollToSection(e, 'faq'); setIsMenuOpen(false); }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                FAQ
              </a>
              <a 
                href="https://wa.me/5527995331369" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="text-center font-semibold bg-deepBlue hover:bg-blue-600 text-white py-3 rounded-xl border border-white/10 transition-all shadow-[0_0_15px_rgba(10,36,99,0.3)]"
              >
                Falar com Consultor
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main>
        <HeroSection />
      </main>

      {/* AI Chat Widget */}
      <BusinessChatWidget />

      {/* New Footer */}
      <Footer />
    </div>
  );
};

export default App;