import React from 'react';
import HeroSection from './components/HeroSection';
import BusinessChatWidget from './components/BusinessChatWidget';
import Footer from './components/Footer';

const App: React.FC = () => {
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
              href="https://wa.me/+5577981349192" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:border-deepBlue/50 hover:text-white"
            >
              Falar com Consultor
            </a>
          </div>
        </div>
      </nav>

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