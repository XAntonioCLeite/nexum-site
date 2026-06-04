import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import WhatsAppDashboard from './WhatsAppDashboard';
import SmokeEffect from './SmokeEffect';
import AIIntegrationSection from './AIIntegrationSection';
import FeaturesGrid from './FeaturesGrid';
import AutomatedIntelligenceSection from './AutomatedIntelligenceSection';
import CustomSoftwareSection from './CustomSoftwareSection';
import HowItWorksSection from './HowItWorksSection';
import FAQSection from './FAQSection';
import FinalCTASection from './FinalCTASection';
import { ArrowRight, Lock, Zap, Shield, BarChart3, Users, Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track window width for mobile responsiveness
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll within the main container
  const { scrollY } = useScroll();

  // 3D Transforms based on scroll position - EXTENDED ANIMATION
  const rotateX = useTransform(scrollY, [0, 800], [50, 0]); 
  const scale = useTransform(scrollY, [0, 800], [0.9, 1]);
  const opacity = useTransform(scrollY, [0, 600], [0.4, 1]); 
  
  // Parallax Effect
  const y = useTransform(scrollY, [0, 800], [0, 350]); 


  return (
    <div className="relative w-full bg-black min-h-[150vh] flex flex-col items-center overflow-hidden">
      
      {/* --- LIGHTING & ATMOSPHERE --- */}
      
      {/* 1. Technical Grid Background with Radial Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />

      {/* 2. Top Ambient Glow (Deep Blue Source) */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[600px] bg-deepBlue/40 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen" />

      {/* 3. Subtle Horizon Line at Top - Changed to Blue */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent z-10" />

      {/* 4. Secondary Spotlights (Left/Right) for Depth */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-deepBlue/20 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none z-0" />


      {/* SMOKE EFFECTS LAYER */}
      <SmokeEffect className="absolute top-[600px] bottom-0 left-0 right-0 w-full h-auto z-0" />

      {/* Top Section Content - Increased Height */}
      <div className="relative w-full min-h-[85vh] md:h-[1050px] overflow-hidden flex flex-col items-center pt-32 md:pt-44 px-4 border-b border-white/10 z-10">
        
        {/* Header Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-deepBlue/20 border border-deepBlue/30 text-blue-200 text-sm font-medium backdrop-blur-sm shadow-[0_0_20px_rgba(10,36,99,0.3)] ring-1 ring-white/5"
          >
            {/* Mint for Contrast */}
            <Sparkles size={14} className="text-mint" />
            <span>Inteligência Artificial para Clínicas</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8 leading-tight drop-shadow-2xl relative"
          >
            O novo padrão em <br />
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-white">
              automação de atendimento.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto mb-12 leading-relaxed font-light relative z-10"
          >
            Substitua processos manuais e telefonia por uma <span className="text-blue-400 font-medium">inteligência conversacional</span> que entende o contexto clínico e gerencia sua agenda 24/7.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a 
              href="https://wa.me/5527995331369" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-10 py-5 text-lg bg-deepBlue text-white font-bold rounded-full hover:bg-[#0d2e7a] hover:scale-105 transition-all flex items-center gap-2 group shadow-[0_0_20px_rgba(10,36,99,0.4)] hover:shadow-[0_0_40px_rgba(10,36,99,0.6)]"
            >
              Começar agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* 3D Dashboard Container */}
      <div className="w-full px-4 md:px-8 perspective-container -mt-16 md:-mt-[250px] mb-20 md:mb-[400px] z-20" style={{ perspective: '1200px' }}>
        <motion.div
          style={{ 
            rotateX: isMobile ? 0 : rotateX,
            scale,
            opacity,
            y: isMobile ? 0 : y,
            transformStyle: 'preserve-3d',
          }}
          className="max-w-6xl mx-auto"
        >
          {/* Dashboard Component Wrapper */}
          <div className="relative group">
            {/* Ambient Glow Behind Dashboard (Enhanced with Deep Blue) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-deepBlue/40 to-blue-600/20 opacity-40 blur-2xl rounded-2xl transition-opacity duration-500 group-hover:opacity-60" />
            
            {/* Main Dashboard UI Frame */}
            <div className="bg-[#0b141a] p-1.5 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden ring-1 ring-white/10">
              <WhatsAppDashboard />
            </div>

            {/* Decorative Floating Labels */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -right-6 lg:-right-12 top-1/3 animate-float hidden md:block"
            >
               <div className="glass-panel px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg border-l-4 border-l-blue-500 bg-black/80">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Taxa de conversão</span>
                    <span className="font-bold text-blue-400 text-sm">Alta</span>
                  </div>
               </div>
            </motion.div>

             <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute -left-6 lg:-left-12 bottom-1/4 animate-float hidden md:block"
              style={{ animationDelay: '1.5s' }}
            >
              <div className="glass-panel px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg border-l-4 border-l-deepBlue bg-black/80">
                <div className="p-1.5 bg-deepBlue/20 rounded-lg border border-deepBlue/40">
                  <Shield size={16} className="text-white" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-slate-400 uppercase tracking-wider">Status</span>
                   <span className="font-bold text-white text-sm">Criptografado</span>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* AI Integration Scroll Section */}
      <div className="w-full relative z-30 mb-20 mt-10">
        <AIIntegrationSection />
      </div>

      {/* Features Section */}
      <FeaturesGrid />
      
      {/* New Dark Mode SaaS Section */}
      <AutomatedIntelligenceSection />

      {/* Custom Software & Websites Section */}
      <CustomSoftwareSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA Section */}
      <FinalCTASection />

    </div>
  );
};

export default HeroSection;